import test from "node:test";
import assert from "node:assert/strict";
import axios from "axios";
import { QwenClient } from "../src/service/lib/ai/qwen-client.ts";
import { HttpError } from "../src/service/lib/http-error/index.ts";

type AxiosPost = typeof axios.post;

function createJsonResponse(content: string) {
  return {
    data: {
      choices: [
        {
          message: {
            content,
          },
        },
      ],
    },
  };
}

function createTimeoutError(message: string) {
  const error = new Error(message) as Error & {
    code?: string;
    response?: { status?: number };
    isAxiosError?: boolean;
  };

  error.code = "ECONNABORTED";
  error.isAxiosError = true;
  return error;
}

function createHttpStatusError(status: number, message: string) {
  const error = new Error(message) as Error & {
    response?: { status?: number };
    isAxiosError?: boolean;
  };

  error.response = { status };
  error.isAxiosError = true;
  return error;
}

async function withPatchedAxiosPost(
  run: (setImplementation: (implementation: AxiosPost) => void) => Promise<void>,
) {
  const originalPost = axios.post;

  try {
    await run((implementation) => {
      axios.post = implementation;
    });
  } finally {
    axios.post = originalPost;
  }
}

test(
  "QwenClient retries once after timeout and returns parsed analysis",
  { concurrency: false },
  async () => {
  process.env.QWEN_API_KEY = "test-key";
  process.env.QWEN_MAX_RETRIES = "1";
  process.env.QWEN_TIMEOUT_MS = "100";

  const client = new QwenClient();
  let attempts = 0;

  await withPatchedAxiosPost(async (setImplementation) => {
    setImplementation((async () => {
      attempts += 1;

      if (attempts === 1) {
        throw createTimeoutError("timeout");
      }

      return createJsonResponse(
        JSON.stringify({
          summary: "章节摘要",
          scenes: [],
          storyboards: [],
          characters: [],
        }),
      );
    }) as AxiosPost);

    const result = await client.analyzeChapter({
      novel: {
        id: 1,
        title: "测试小说",
        style: "anime",
      },
      chapter: {
        id: 1,
        chapterNo: 1,
        title: "第一章",
        content: "正文",
      },
      knownCharacters: [],
      recentSummaries: [],
    });

    assert.equal(result.summary, "章节摘要");
    assert.equal(attempts, 2);
  });
  },
);

test(
  "QwenClient retries invalid JSON response and succeeds on next attempt",
  { concurrency: false },
  async () => {
  process.env.QWEN_API_KEY = "test-key";
  process.env.QWEN_MAX_RETRIES = "1";

  const client = new QwenClient();
  let attempts = 0;

  await withPatchedAxiosPost(async (setImplementation) => {
    setImplementation((async () => {
      attempts += 1;

      if (attempts === 1) {
        return createJsonResponse("{invalid json");
      }

      return createJsonResponse(
        JSON.stringify({
          summary: "第二次成功",
          scenes: [],
          storyboards: [],
          characters: [],
        }),
      );
    }) as AxiosPost);

    const result = await client.analyzeChapter({
      novel: {
        id: 1,
        title: "测试小说",
        style: "anime",
      },
      chapter: {
        id: 1,
        chapterNo: 1,
        title: "第一章",
        content: "正文",
      },
      knownCharacters: [],
      recentSummaries: [],
    });

    assert.equal(result.summary, "第二次成功");
    assert.equal(attempts, 2);
  });
  },
);

test(
  "QwenClient normalizes 429 response into HttpError 503 after retries",
  { concurrency: false },
  async () => {
  process.env.QWEN_API_KEY = "test-key";
  process.env.QWEN_MAX_RETRIES = "0";

  const client = new QwenClient();

  await withPatchedAxiosPost(async (setImplementation) => {
    setImplementation((async () => {
      throw createHttpStatusError(429, "rate limited");
    }) as AxiosPost);

    await assert.rejects(
      () =>
        client.analyzeChapter({
          novel: {
            id: 1,
            title: "测试小说",
            style: "anime",
          },
          chapter: {
            id: 1,
            chapterNo: 1,
            title: "第一章",
            content: "正文",
          },
          knownCharacters: [],
          recentSummaries: [],
        }),
      (error: unknown) => {
        assert.ok(error instanceof HttpError);
        assert.equal(error.statusCode, 503);
        assert.equal(error.message, "Qwen 请求频率过高，请稍后重试");
        return true;
      },
    );
  });
  },
);
