import test from "node:test";
import assert from "node:assert/strict";
import { authMiddleware } from "../src/service/proxy/auth.proxy.ts";
import { JwtService } from "../src/service/lib/JwtService/index.ts";
import { chapterController } from "../src/service/controllers/chapterController/index.ts";
import { ChapterAnalysisService } from "../src/service/services/chapterAnalysisService/index.ts";
import { ComicGenerationService } from "../src/service/services/comicGenerationService/index.ts";

interface MockResponse {
  statusCode: number;
  body: unknown;
  status: (code: number) => MockResponse;
  json: (payload: unknown) => MockResponse;
}

function createMockResponse(): MockResponse {
  return {
    statusCode: 200,
    body: null,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
}

test(
  "authMiddleware returns 401 when bearer token is missing",
  { concurrency: false },
  async () => {
    const response = createMockResponse();
    let nextCalled = false;

    authMiddleware(
      {
        headers: {},
      } as never,
      response as never,
      () => {
        nextCalled = true;
      },
    );

    assert.equal(nextCalled, false);
    assert.equal(response.statusCode, 401);
    assert.deepEqual(response.body, {
      success: false,
      message: "未提供有效的 Token，请先登录",
    });
  },
);

test(
  "authMiddleware attaches decoded session and calls next",
  { concurrency: false },
  async () => {
    const originalVerify = JwtService.prototype.verify;
    const response = createMockResponse();
    let nextCalled = false;
    const request = {
      headers: {
        authorization: "Bearer test-token",
      },
    } as Record<string, unknown>;

    JwtService.prototype.verify = function mockVerify() {
      return {
        userId: 12,
        phoneNumber: "13800000000",
        name: "测试用户",
      };
    };

    try {
      authMiddleware(request as never, response as never, () => {
        nextCalled = true;
      });

      assert.equal(nextCalled, true);
      assert.equal(response.statusCode, 200);
      assert.deepEqual(request.user, {
        userId: 12,
        phoneNumber: "13800000000",
        name: "测试用户",
      });
    } finally {
      JwtService.prototype.verify = originalVerify;
    }
  },
);

test(
  "chapterController.analyzeChapter forwards authenticated user and force flag",
  { concurrency: false },
  async () => {
    const originalAnalyze = ChapterAnalysisService.prototype.analyzeChapter;
    const response = createMockResponse();
    const analyzeCalls: Array<{ chapterId: unknown; userId: unknown; force: boolean }> = [];

    ChapterAnalysisService.prototype.analyzeChapter = async function mockAnalyze(
      chapterIdParam: unknown,
      userIdParam: unknown,
      force = false,
    ) {
      analyzeCalls.push({
        chapterId: chapterIdParam,
        userId: userIdParam,
        force,
      });

      return {
        success: true as const,
        message: "章节重新分析完成",
        data: {
          chapterId: Number(chapterIdParam),
          status: "completed" as const,
          summary: "测试摘要",
          characters: [],
        },
      };
    };

    try {
      await chapterController.analyzeChapter(
        {
          params: {
            chapterId: "12",
          },
          body: {
            force: true,
          },
          user: {
            userId: 99,
            phoneNumber: "13800000000",
            name: "测试用户",
          },
        } as never,
        response as never,
      );

      assert.equal(response.statusCode, 200);
      assert.deepEqual(response.body, {
        success: true,
        message: "章节重新分析完成",
        data: {
          chapterId: 12,
          status: "completed",
          summary: "测试摘要",
          characters: [],
        },
      });
      assert.deepEqual(analyzeCalls, [
        {
          chapterId: "12",
          userId: 99,
          force: true,
        },
      ]);
    } finally {
      ChapterAnalysisService.prototype.analyzeChapter = originalAnalyze;
    }
  },
);

test(
  "chapterController.generateComic forwards authenticated user and force flag",
  { concurrency: false },
  async () => {
    const originalGenerate = ComicGenerationService.prototype.generateChapterComic;
    const response = createMockResponse();
    const generateCalls: Array<{ chapterId: unknown; userId: unknown; force: boolean }> = [];

    ComicGenerationService.prototype.generateChapterComic = async function mockGenerate(
      chapterIdParam: unknown,
      userIdParam: unknown,
      force = false,
    ) {
      generateCalls.push({
        chapterId: chapterIdParam,
        userId: userIdParam,
        force,
      });

      return {
        success: true as const,
        message: "漫画页生成成功",
        data: {
          chapterId: Number(chapterIdParam),
          storyboardImages: [],
          comicPages: [],
        },
      };
    };

    try {
      await chapterController.generateComic(
        {
          params: {
            chapterId: "18",
          },
          body: {
            force: true,
          },
          user: {
            userId: 88,
            phoneNumber: "13800000000",
            name: "测试用户",
          },
        } as never,
        response as never,
      );

      assert.equal(response.statusCode, 200);
      assert.deepEqual(response.body, {
        success: true,
        message: "漫画页生成成功",
        data: {
          chapterId: 18,
          storyboardImages: [],
          comicPages: [],
        },
      });
      assert.deepEqual(generateCalls, [
        {
          chapterId: "18",
          userId: 88,
          force: true,
        },
      ]);
    } finally {
      ComicGenerationService.prototype.generateChapterComic = originalGenerate;
    }
  },
);
