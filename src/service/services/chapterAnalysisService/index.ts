import { and, asc, desc, eq, ne } from "drizzle-orm";
import { db } from "../../../db/connection.ts";
import { chapters, characters, novels } from "../../../db/schema.ts";
import { QwenClient } from "../../lib/ai/qwen-client.ts";
import { HttpError } from "../../lib/http-error/index.ts";
import { CharacterMergeService } from "../characterMergeService/index.ts";
import type { QwenChapterAnalysis } from "../../types/index.ts";

function parsePositiveInteger(value: unknown, fieldName: string): number {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new HttpError(400, `${fieldName} 必须是正整数`);
  }

  return parsed;
}

function validateAnalysis(analysis: QwenChapterAnalysis): QwenChapterAnalysis {
  if (!analysis || typeof analysis.summary !== "string") {
    throw new HttpError(502, "Qwen 返回的 summary 非法");
  }

  if (!Array.isArray(analysis.scenes) || !Array.isArray(analysis.storyboards)) {
    throw new HttpError(502, "Qwen 返回的 scenes 或 storyboards 非法");
  }

  if (!Array.isArray(analysis.characters)) {
    throw new HttpError(502, "Qwen 返回的 characters 非法");
  }

  for (const item of analysis.characters) {
    if (!item?.name?.trim()) {
      throw new HttpError(502, "Qwen 返回了空角色名");
    }

    if (!["reuse", "update", "create"].includes(item.action)) {
      throw new HttpError(502, "Qwen 返回了非法角色动作");
    }

    if (!["id", "alias", "name", "fuzzy", "none"].includes(item.matchType)) {
      throw new HttpError(502, "Qwen 返回了非法匹配类型");
    }

    if (typeof item.confidence !== "number") {
      throw new HttpError(502, "Qwen 返回了非法置信度");
    }

    if (!Array.isArray(item.evidence)) {
      throw new HttpError(502, "Qwen 返回了非法证据列表");
    }
  }

  return analysis;
}

function getFailureMessage(error: unknown): string {
  if (error instanceof HttpError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "未知错误";
}

export class ChapterAnalysisService {
  private readonly qwenClient: QwenClient;
  private readonly characterMergeService: CharacterMergeService;

  constructor() {
    this.qwenClient = new QwenClient();
    this.characterMergeService = new CharacterMergeService();
  }

  async analyzeChapter(chapterIdParam: unknown, userIdParam: unknown, force = false) {
    const chapterId = parsePositiveInteger(chapterIdParam, "chapterId");
    const userId = parsePositiveInteger(userIdParam, "userId");
    const analyzedAt = new Date();

    const [chapterRow] = await db
      .select({
        chapter: chapters,
        novel: novels,
      })
      .from(chapters)
      .innerJoin(novels, eq(chapters.novelId, novels.id))
      .where(and(eq(chapters.id, chapterId), eq(novels.userId, userId)));

    if (!chapterRow) {
      throw new HttpError(404, "章节不存在");
    }

    const { chapter, novel } = chapterRow;

    if (chapter.status === "processing") {
      throw new HttpError(409, "章节正在分析中");
    }

    if (chapter.status === "completed" && !force) {
      throw new HttpError(409, "章节已分析完成，如需重跑请传 force=true");
    }

    const knownCharacters = await db
      .select()
      .from(characters)
      .where(eq(characters.novelId, chapter.novelId))
      .orderBy(asc(characters.id));

    const recentSummaryRows = await db
      .select({ summary: chapters.summary })
      .from(chapters)
      .where(and(eq(chapters.novelId, chapter.novelId), ne(chapters.id, chapter.id)))
      .orderBy(desc(chapters.chapterNo), desc(chapters.id))
      .limit(3);

    await db
      .update(chapters)
      .set({
        status: "processing",
        analysisError: null,
        analysisAttempts: chapter.analysisAttempts + 1,
        lastAnalyzedAt: analyzedAt,
        summary: force ? null : chapter.summary,
        storyboardJson: force ? null : chapter.storyboardJson,
        analysisJson: force ? null : chapter.analysisJson,
      })
      .where(eq(chapters.id, chapter.id));

    try {
      const analysis = validateAnalysis(
        await this.qwenClient.analyzeChapter({
          novel: {
            id: novel.id,
            title: novel.title,
            style: novel.style ?? null,
          },
          chapter: {
            id: chapter.id,
            chapterNo: chapter.chapterNo,
            title: chapter.title,
            content: chapter.content,
          },
          knownCharacters: knownCharacters.map((item) => ({
            id: item.id,
            name: item.name,
            aliases: item.aliasesJson ?? [],
            gender: item.gender ?? null,
            ageRange: item.ageRange ?? null,
            appearance: item.appearance ?? null,
            personality: item.personality ?? null,
            background: item.background ?? null,
            ability: item.ability ?? null,
          })),
          recentSummaries: recentSummaryRows
            .map((item) => item.summary ?? "")
            .filter((item) => item.trim().length > 0),
        }),
      );

      const mergeResults = await this.characterMergeService.mergeChapterAnalysis({
        chapterId: chapter.id,
        novelId: chapter.novelId,
        analysis,
        existingCharacters: knownCharacters,
        replaceExistingChapterRelations: force,
        analyzedAt,
      });

      return {
        success: true as const,
        message: force ? "章节重新分析完成" : "章节分析完成",
        data: {
          chapterId: chapter.id,
          status: "completed" as const,
          summary: analysis.summary,
          characters: mergeResults,
        },
      };
    } catch (error) {
      await db
        .update(chapters)
        .set({
          status: "failed",
          analysisError: getFailureMessage(error),
          lastAnalyzedAt: analyzedAt,
        })
        .where(eq(chapters.id, chapter.id));

      console.error("chapter_analysis_failed", {
        chapterId: chapter.id,
        novelId: chapter.novelId,
        userId,
        force,
        message: getFailureMessage(error),
      });

      throw error;
    }
  }
}
