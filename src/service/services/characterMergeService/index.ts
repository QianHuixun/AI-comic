import { eq } from "drizzle-orm";
import { db } from "../../../db/connection.ts";
import {
  chapterCharacters,
  chapters,
  characters,
} from "../../../db/schema.ts";
import type {
  CharacterMergeResult,
  ExtractedCharacterProfile,
  QwenChapterAnalysis,
  QwenCharacterAnalysisItem,
} from "../../types/index.ts";

type ExistingCharacterRow = typeof characters.$inferSelect;

function normalizeName(value: string): string {
  return value.replace(/\s+/g, "").trim().toLowerCase();
}

function normalizeOptionalText(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function isNonEmpty(value: string | null | undefined): value is string {
  return Boolean(value && value.trim());
}

function dedupeStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();

    if (!trimmed) {
      continue;
    }

    const key = normalizeName(trimmed);

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(trimmed);
  }

  return result;
}

function mergeRelationships(
  existing: Record<string, unknown>[] | null,
  nextItems: ExtractedCharacterProfile["relationships"],
): Record<string, unknown>[] | null {
  const items = [
    ...(Array.isArray(existing) ? existing : []),
    ...((nextItems ?? []).map((item) => ({
      targetName: item.targetName,
      relation: item.relation,
    })) as Record<string, unknown>[]),
  ];

  if (items.length === 0) {
    return null;
  }

  const seen = new Set<string>();
  const merged: Record<string, unknown>[] = [];

  for (const item of items) {
    const targetName = typeof item.targetName === "string" ? item.targetName.trim() : "";
    const relation = typeof item.relation === "string" ? item.relation.trim() : "";

    if (!targetName || !relation) {
      continue;
    }

    const key = `${normalizeName(targetName)}:${relation}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    merged.push({ targetName, relation });
  }

  return merged.length > 0 ? merged : null;
}

function shouldReplaceText(
  currentValue: string | null,
  nextValue: string | null,
  confidence: number,
): boolean {
  if (!isNonEmpty(nextValue)) {
    return false;
  }

  if (!isNonEmpty(currentValue)) {
    return true;
  }

  if (currentValue === nextValue) {
    return false;
  }

  return confidence >= 0.9 && nextValue.length > currentValue.length;
}

function isConflictingField(currentValue: string | null, nextValue: string | null): boolean {
  return isNonEmpty(currentValue) && isNonEmpty(nextValue) && currentValue !== nextValue;
}

function itemToExtractedJson(item: QwenCharacterAnalysisItem): Record<string, unknown> {
  return {
    name: item.name,
    aliases: item.aliases ?? [],
    action: item.action,
    matchedCharacterId: item.matchedCharacterId ?? null,
    matchType: item.matchType,
    confidence: item.confidence,
    roleInChapter: item.roleInChapter ?? null,
    changeSummary: item.changeSummary,
    extractedProfile: item.extractedProfile,
    evidence: item.evidence,
  };
}

function replaceMutableCharacter(
  mutableCharacters: ExistingCharacterRow[],
  updatedCharacter: ExistingCharacterRow,
) {
  const index = mutableCharacters.findIndex((item) => item.id === updatedCharacter.id);

  if (index >= 0) {
    mutableCharacters[index] = updatedCharacter;
  }
}

export class CharacterMergeService {
  async mergeChapterAnalysis(input: {
    chapterId: number;
    novelId: number;
    analysis: QwenChapterAnalysis;
    existingCharacters: ExistingCharacterRow[];
    replaceExistingChapterRelations?: boolean;
    analyzedAt?: Date;
  }): Promise<CharacterMergeResult[]> {
    const {
      chapterId,
      novelId,
      analysis,
      existingCharacters,
      replaceExistingChapterRelations = false,
      analyzedAt = new Date(),
    } = input;

    return db.transaction(async (tx) => {
      const mutableCharacters = [...existingCharacters];
      const results: CharacterMergeResult[] = [];
      const processedKeys = new Set<string>();

      if (replaceExistingChapterRelations) {
        await tx.delete(chapterCharacters).where(eq(chapterCharacters.chapterId, chapterId));
      }

      for (const item of analysis.characters) {
        const existingCharacter = this.matchExistingCharacter(item, mutableCharacters);
        const processedKey = existingCharacter
          ? `existing:${existingCharacter.id}`
          : `new:${normalizeName(item.name)}`;

        if (processedKeys.has(processedKey)) {
          continue;
        }

        processedKeys.add(processedKey);

        if (!existingCharacter) {
          const [createdCharacter] = await tx
            .insert(characters)
            .values({
              novelId,
              name: item.name.trim(),
              aliasesJson: dedupeStrings(item.aliases ?? []),
              gender: normalizeOptionalText(item.extractedProfile.gender),
              ageRange: normalizeOptionalText(item.extractedProfile.ageRange),
              appearance: normalizeOptionalText(item.extractedProfile.appearance),
              personality: normalizeOptionalText(item.extractedProfile.personality),
              background: normalizeOptionalText(item.extractedProfile.background),
              ability: normalizeOptionalText(item.extractedProfile.ability),
              relationshipJson: mergeRelationships(
                null,
                item.extractedProfile.relationships,
              ),
              firstChapterId: chapterId,
              lastChapterId: chapterId,
              version: 1,
            })
            .returning();

          mutableCharacters.push(createdCharacter);

          await tx.insert(chapterCharacters).values({
            chapterId,
            characterId: createdCharacter.id,
            action: "create",
            roleInChapter: normalizeOptionalText(item.roleInChapter),
            changeSummary: item.changeSummary.trim() || "新角色",
            extractedJson: itemToExtractedJson(item),
            isNew: true,
            isUpdated: false,
          });

          results.push({
            id: createdCharacter.id,
            name: createdCharacter.name,
            action: "create",
            roleInChapter: normalizeOptionalText(item.roleInChapter),
            changeSummary: item.changeSummary.trim() || "新角色",
          });

          continue;
        }

        const mergeDecision = this.buildCharacterUpdate(existingCharacter, item, chapterId);

        if (mergeDecision.shouldUpdate) {
          const [updatedCharacter] = await tx
            .update(characters)
            .set(mergeDecision.patch)
            .where(eq(characters.id, existingCharacter.id))
            .returning();

          replaceMutableCharacter(mutableCharacters, updatedCharacter);

          await tx.insert(chapterCharacters).values({
            chapterId,
            characterId: updatedCharacter.id,
            action: "update",
            roleInChapter: normalizeOptionalText(item.roleInChapter),
            changeSummary: mergeDecision.changeSummary,
            extractedJson: itemToExtractedJson(item),
            isNew: false,
            isUpdated: true,
          });

          results.push({
            id: updatedCharacter.id,
            name: updatedCharacter.name,
            action: "update",
            roleInChapter: normalizeOptionalText(item.roleInChapter),
            changeSummary: mergeDecision.changeSummary,
          });

          continue;
        }

        await tx
          .update(characters)
          .set({ lastChapterId: chapterId })
          .where(eq(characters.id, existingCharacter.id));

        await tx.insert(chapterCharacters).values({
          chapterId,
          characterId: existingCharacter.id,
          action: "reuse",
          roleInChapter: normalizeOptionalText(item.roleInChapter),
          changeSummary: mergeDecision.changeSummary,
          extractedJson: itemToExtractedJson(item),
          isNew: false,
          isUpdated: false,
        });

        results.push({
          id: existingCharacter.id,
          name: existingCharacter.name,
          action: "reuse",
          roleInChapter: normalizeOptionalText(item.roleInChapter),
          changeSummary: mergeDecision.changeSummary,
        });
      }

      await tx
        .update(chapters)
        .set({
          status: "completed",
          summary: analysis.summary,
          storyboardJson: { storyboards: analysis.storyboards },
          analysisError: null,
          lastAnalyzedAt: analyzedAt,
          analysisJson: {
            summary: analysis.summary,
            scenes: analysis.scenes,
            storyboards: analysis.storyboards,
            characters: analysis.characters,
          },
        })
        .where(eq(chapters.id, chapterId));

      return results;
    });
  }

  private matchExistingCharacter(
    item: QwenCharacterAnalysisItem,
    existingCharacters: ExistingCharacterRow[],
  ): ExistingCharacterRow | null {
    const normalizedName = normalizeName(item.name);

    if (typeof item.matchedCharacterId === "number") {
      const matchedById = existingCharacters.find(
        (character) => character.id === item.matchedCharacterId,
      );

      if (matchedById) {
        return matchedById;
      }
    }

    const exactName = existingCharacters.find(
      (character) => normalizeName(character.name) === normalizedName,
    );

    if (exactName) {
      return exactName;
    }

    const aliasMatch = existingCharacters.find((character) =>
      (character.aliasesJson ?? []).some((alias) => normalizeName(alias) === normalizedName),
    );

    if (aliasMatch) {
      return aliasMatch;
    }

    if (item.confidence >= 0.85) {
      const fuzzyMatch = existingCharacters.find((character) => {
        const names = [character.name, ...(character.aliasesJson ?? [])].map(normalizeName);
        return names.some(
          (name) => name.includes(normalizedName) || normalizedName.includes(name),
        );
      });

      if (fuzzyMatch) {
        return fuzzyMatch;
      }
    }

    return null;
  }

  private buildCharacterUpdate(
    existingCharacter: ExistingCharacterRow,
    item: QwenCharacterAnalysisItem,
    chapterId: number,
  ) {
    const patch: Partial<typeof characters.$inferInsert> = {
      lastChapterId: chapterId,
    };
    const appliedChanges: string[] = [];
    const conflictNotes: string[] = [];

    const nextAliases = dedupeStrings([
      ...(existingCharacter.aliasesJson ?? []),
      ...(item.aliases ?? []),
    ]);

    if (nextAliases.length > (existingCharacter.aliasesJson ?? []).length) {
      patch.aliasesJson = nextAliases;
      appliedChanges.push("补充了别名");
    }

    if (
      shouldReplaceText(
        existingCharacter.appearance,
        item.extractedProfile.appearance ?? null,
        item.confidence,
      )
    ) {
      patch.appearance = normalizeOptionalText(item.extractedProfile.appearance);
      appliedChanges.push("补充了外貌");
    }

    if (
      shouldReplaceText(
        existingCharacter.personality,
        item.extractedProfile.personality ?? null,
        item.confidence,
      )
    ) {
      patch.personality = normalizeOptionalText(item.extractedProfile.personality);
      appliedChanges.push("补充了性格");
    }

    if (
      shouldReplaceText(
        existingCharacter.background,
        item.extractedProfile.background ?? null,
        item.confidence,
      )
    ) {
      patch.background = normalizeOptionalText(item.extractedProfile.background);
      appliedChanges.push("补充了背景");
    }

    if (
      shouldReplaceText(
        existingCharacter.ability,
        item.extractedProfile.ability ?? null,
        item.confidence,
      )
    ) {
      patch.ability = normalizeOptionalText(item.extractedProfile.ability);
      appliedChanges.push("补充了能力");
    }

    const mergedRelationships = mergeRelationships(
      existingCharacter.relationshipJson,
      item.extractedProfile.relationships,
    );

    if (
      mergedRelationships &&
      mergedRelationships.length !== (existingCharacter.relationshipJson?.length ?? 0)
    ) {
      patch.relationshipJson = mergedRelationships;
      appliedChanges.push("补充了关系信息");
    }

    if (isConflictingField(existingCharacter.gender, item.extractedProfile.gender ?? null)) {
      conflictNotes.push("本章提取的性别信息与现有档案冲突，未覆盖");
    } else if (
      shouldReplaceText(
        existingCharacter.gender,
        item.extractedProfile.gender ?? null,
        item.confidence,
      )
    ) {
      patch.gender = normalizeOptionalText(item.extractedProfile.gender);
      appliedChanges.push("补充了性别");
    }

    if (isConflictingField(existingCharacter.ageRange, item.extractedProfile.ageRange ?? null)) {
      conflictNotes.push("本章提取的年龄信息与现有档案冲突，未覆盖");
    } else if (
      shouldReplaceText(
        existingCharacter.ageRange,
        item.extractedProfile.ageRange ?? null,
        item.confidence,
      )
    ) {
      patch.ageRange = normalizeOptionalText(item.extractedProfile.ageRange);
      appliedChanges.push("补充了年龄范围");
    }

    const shouldUpdate =
      item.confidence >= 0.8 &&
      appliedChanges.length > 0 &&
      !isConflictingField(existingCharacter.gender, item.extractedProfile.gender ?? null) &&
      !isConflictingField(existingCharacter.ageRange, item.extractedProfile.ageRange ?? null);

    if (shouldUpdate) {
      patch.version = existingCharacter.version + 1;
    }

    const changeSummary =
      [item.changeSummary.trim(), ...appliedChanges, ...conflictNotes]
        .filter((value) => value.length > 0)
        .join("；") || "本章复用已有角色";

    return {
      shouldUpdate,
      patch,
      changeSummary,
    };
  }
}
