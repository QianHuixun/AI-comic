import test from "node:test";
import assert from "node:assert/strict";
import { db } from "../src/db/connection.ts";
import { chapterCharacters, chapters, characters } from "../src/db/schema.ts";
import { HttpError } from "../src/service/lib/http-error/index.ts";
import { ChapterAnalysisService } from "../src/service/services/chapterAnalysisService/index.ts";
import { CharacterMergeService } from "../src/service/services/characterMergeService/index.ts";

type DbLike = typeof db;
type ChapterRow = typeof chapters.$inferSelect;
type CharacterRow = typeof characters.$inferSelect;

function createResolvedBuilder<T>(result: T) {
  const builder = {
    from() {
      return builder;
    },
    innerJoin() {
      return builder;
    },
    where() {
      return builder;
    },
    orderBy() {
      return builder;
    },
    limit() {
      return builder;
    },
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
    ) {
      return Promise.resolve(result).then(onfulfilled, onrejected);
    },
  };

  return builder;
}

function createUpdateBuilder(
  onCommit: (payload: Record<string, unknown>) => void,
  result: unknown = undefined,
) {
  const state: { payload?: Record<string, unknown> } = {};
  const builder = {
    set(payload: Record<string, unknown>) {
      state.payload = payload;
      return builder;
    },
    where() {
      onCommit(state.payload ?? {});
      return builder;
    },
    then<TResult1 = unknown, TResult2 = never>(
      onfulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
    ) {
      return Promise.resolve(result).then(onfulfilled, onrejected);
    },
  };

  return builder;
}

function createInsertBuilder(options: {
  onValues?: (payload: Record<string, unknown>) => void;
  returningResult?: unknown;
  resolveValue?: unknown;
}) {
  const builder = {
    values(payload: Record<string, unknown>) {
      options.onValues?.(payload);
      return builder;
    },
    returning() {
      return Promise.resolve(options.returningResult ?? []);
    },
    then<TResult1 = unknown, TResult2 = never>(
      onfulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
    ) {
      return Promise.resolve(options.resolveValue).then(onfulfilled, onrejected);
    },
  };

  return builder;
}

function createDeleteBuilder(onDelete: () => void) {
  const builder = {
    where() {
      onDelete();
      return builder;
    },
    then<TResult1 = unknown, TResult2 = never>(
      onfulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
    ) {
      return Promise.resolve(undefined).then(onfulfilled, onrejected);
    },
  };

  return builder;
}

async function withPatchedDb<T>(
  patch: Partial<DbLike>,
  run: () => Promise<T>,
): Promise<T> {
  const originalEntries = new Map<keyof DbLike, unknown>();

  for (const key of Object.keys(patch) as Array<keyof DbLike>) {
    originalEntries.set(key, db[key]);
    Object.assign(db, { [key]: patch[key] });
  }

  try {
    return await run();
  } finally {
    for (const [key, value] of originalEntries.entries()) {
      Object.assign(db, { [key]: value });
    }
  }
}

function createExistingCharacter(overrides: Partial<CharacterRow> = {}): CharacterRow {
  return {
    id: 7,
    novelId: 21,
    name: "林雾",
    aliasesJson: ["小雾"],
    gender: "男",
    ageRange: null,
    appearance: "黑发",
    personality: "冷静",
    background: null,
    ability: null,
    relationshipJson: null,
    firstChapterId: 1,
    lastChapterId: 2,
    version: 1,
    createdAt: null,
    updatedAt: null,
    ...overrides,
  };
}

test(
  "CharacterMergeService creates new character, relation record and chapter analysis payload",
  { concurrency: false },
  async () => {
    const service = new CharacterMergeService();
    const createdCharacter = createExistingCharacter({
      id: 88,
      name: "白璃",
      aliasesJson: ["白衣少女"],
      gender: "女",
      appearance: "银发",
      personality: "冷淡",
      firstChapterId: 12,
      lastChapterId: 12,
    });

    const insertedCharacterPayloads: Array<Record<string, unknown>> = [];
    const insertedRelationPayloads: Array<Record<string, unknown>> = [];
    const chapterUpdatePayloads: Array<Record<string, unknown>> = [];

    await withPatchedDb(
      {
        transaction: async (callback: (tx: Record<string, unknown>) => Promise<unknown>) =>
          callback({
            insert(table: unknown) {
              if (table === characters) {
                return createInsertBuilder({
                  onValues: (payload) => insertedCharacterPayloads.push(payload),
                  returningResult: [createdCharacter],
                });
              }

              if (table === chapterCharacters) {
                return createInsertBuilder({
                  onValues: (payload) => insertedRelationPayloads.push(payload),
                });
              }

              throw new Error("unexpected insert table");
            },
            update(table: unknown) {
              if (table === chapters) {
                return createUpdateBuilder((payload) => chapterUpdatePayloads.push(payload));
              }

              throw new Error("unexpected update table");
            },
            delete() {
              throw new Error("delete should not be called");
            },
          }),
      } as Partial<DbLike>,
      async () => {
        const results = await service.mergeChapterAnalysis({
          chapterId: 12,
          novelId: 21,
          existingCharacters: [],
          analysis: {
            summary: "主角遇到新角色白璃。",
            scenes: [],
            storyboards: [],
            characters: [
              {
                name: "白璃",
                aliases: ["白衣少女"],
                action: "create",
                matchedCharacterId: null,
                matchType: "none",
                confidence: 0.95,
                roleInChapter: "关键新角色",
                changeSummary: "首次出现",
                extractedProfile: {
                  gender: "女",
                  ageRange: null,
                  appearance: "银发",
                  personality: "冷淡",
                  background: null,
                  ability: null,
                  relationships: [],
                },
                evidence: ["白衣少女出现在车站"],
              },
            ],
          },
        });

        assert.equal(results.length, 1);
        assert.equal(results[0]?.action, "create");
        assert.equal(insertedCharacterPayloads.length, 1);
        assert.equal(insertedRelationPayloads.length, 1);
        assert.equal(insertedRelationPayloads[0]?.action, "create");
        assert.equal(chapterUpdatePayloads.length, 1);
        assert.equal(chapterUpdatePayloads[0]?.status, "completed");
        assert.deepEqual(chapterUpdatePayloads[0]?.storyboardJson, { storyboards: [] });
      },
    );
  },
);

test(
  "ChapterAnalysisService force rerun clears chapter analysis fields and forwards replace flag",
  { concurrency: false },
  async () => {
    const service = new ChapterAnalysisService();
    const chapterUpdatePayloads: Array<Record<string, unknown>> = [];
    const chapter: ChapterRow = {
      id: 12,
      novelId: 21,
      chapterNo: 2,
      title: "第二章",
      content: "章节正文",
      contentLength: 4,
      summary: "旧摘要",
      storyboardJson: { storyboards: [] },
      analysisJson: { summary: "旧摘要" },
      analysisError: null,
      analysisAttempts: 1,
      lastAnalyzedAt: null,
      status: "completed",
      createdAt: null,
      updatedAt: null,
    };
    const mergeCalls: Array<Record<string, unknown>> = [];

    (service as unknown as { qwenClient: { analyzeChapter: () => Promise<unknown> } }).qwenClient =
      {
        analyzeChapter: async () => ({
          summary: "新摘要",
          scenes: [],
          storyboards: [],
          characters: [],
        }),
      };

    (
      service as unknown as {
        characterMergeService: { mergeChapterAnalysis: (input: Record<string, unknown>) => Promise<unknown> };
      }
    ).characterMergeService = {
      mergeChapterAnalysis: async (input: Record<string, unknown>) => {
        mergeCalls.push(input);
        return [];
      },
    };

    let selectCallIndex = 0;

    await withPatchedDb(
      {
        select: () => {
          selectCallIndex += 1;

          if (selectCallIndex === 1) {
            return createResolvedBuilder([
              {
                chapter,
                novel: {
                  id: 21,
                  title: "测试小说",
                  style: "anime",
                },
              },
            ]);
          }

          if (selectCallIndex === 2) {
            return createResolvedBuilder([]);
          }

          if (selectCallIndex === 3) {
            return createResolvedBuilder([]);
          }

          throw new Error("unexpected select call");
        },
        update: () =>
          createUpdateBuilder((payload) => {
            chapterUpdatePayloads.push(payload);
          }),
      } as Partial<DbLike>,
      async () => {
        const result = await service.analyzeChapter(12, 1, true);

        assert.equal(result.message, "章节重新分析完成");
        assert.equal(chapterUpdatePayloads.length, 1);
        assert.equal(chapterUpdatePayloads[0]?.status, "processing");
        assert.equal(chapterUpdatePayloads[0]?.analysisError, null);
        assert.equal(chapterUpdatePayloads[0]?.analysisAttempts, 2);
        assert.ok(chapterUpdatePayloads[0]?.lastAnalyzedAt instanceof Date);
        assert.equal(chapterUpdatePayloads[0]?.summary, null);
        assert.equal(chapterUpdatePayloads[0]?.storyboardJson, null);
        assert.equal(chapterUpdatePayloads[0]?.analysisJson, null);
        assert.equal(mergeCalls.length, 1);
        assert.equal(mergeCalls[0]?.replaceExistingChapterRelations, true);
      },
    );
  },
);

test(
  "ChapterAnalysisService blocks completed chapter when force is false",
  { concurrency: false },
  async () => {
    const service = new ChapterAnalysisService();
    const chapter: ChapterRow = {
      id: 12,
      novelId: 21,
      chapterNo: 2,
      title: "第二章",
      content: "章节正文",
      contentLength: 4,
      summary: "旧摘要",
      storyboardJson: null,
      analysisJson: null,
      analysisError: null,
      analysisAttempts: 1,
      lastAnalyzedAt: null,
      status: "completed",
      createdAt: null,
      updatedAt: null,
    };

    await withPatchedDb(
      {
        select: () =>
          createResolvedBuilder([
            {
              chapter,
              novel: {
                id: 21,
                title: "测试小说",
                style: "anime",
              },
            },
          ]),
      } as Partial<DbLike>,
      async () => {
        await assert.rejects(
          () => service.analyzeChapter(12, 1, false),
          (error: unknown) => {
            assert.ok(error instanceof HttpError);
            assert.equal(error.statusCode, 409);
            assert.equal(error.message, "章节已分析完成，如需重跑请传 force=true");
            return true;
          },
        );
      },
    );
  },
);

test(
  "ChapterAnalysisService writes analysis_error when analysis fails",
  { concurrency: false },
  async () => {
    const service = new ChapterAnalysisService();
    const chapterUpdatePayloads: Array<Record<string, unknown>> = [];
    const chapter: ChapterRow = {
      id: 12,
      novelId: 21,
      chapterNo: 2,
      title: "第二章",
      content: "章节正文",
      contentLength: 4,
      summary: null,
      storyboardJson: null,
      analysisJson: null,
      analysisError: null,
      analysisAttempts: 0,
      lastAnalyzedAt: null,
      status: "pending",
      createdAt: null,
      updatedAt: null,
    };

    (service as unknown as { qwenClient: { analyzeChapter: () => Promise<unknown> } }).qwenClient =
      {
        analyzeChapter: async () => {
          throw new HttpError(504, "Qwen 请求超时");
        },
      };

    let selectCallIndex = 0;

    await withPatchedDb(
      {
        select: () => {
          selectCallIndex += 1;

          if (selectCallIndex === 1) {
            return createResolvedBuilder([
              {
                chapter,
                novel: {
                  id: 21,
                  title: "测试小说",
                  style: "anime",
                },
              },
            ]);
          }

          if (selectCallIndex === 2 || selectCallIndex === 3) {
            return createResolvedBuilder([]);
          }

          throw new Error("unexpected select call");
        },
        update: () =>
          createUpdateBuilder((payload) => {
            chapterUpdatePayloads.push(payload);
          }),
      } as Partial<DbLike>,
      async () => {
        await assert.rejects(() => service.analyzeChapter(12, 1, false));

        assert.equal(chapterUpdatePayloads.length, 2);
        assert.equal(chapterUpdatePayloads[0]?.status, "processing");
        assert.equal(chapterUpdatePayloads[0]?.analysisAttempts, 1);
        assert.equal(chapterUpdatePayloads[1]?.status, "failed");
        assert.equal(chapterUpdatePayloads[1]?.analysisError, "Qwen 请求超时");
        assert.ok(chapterUpdatePayloads[1]?.lastAnalyzedAt instanceof Date);
      },
    );
  },
);
