import axios from "axios";
import { chapterAnalysisJsonSchema } from "./chapter-analysis-schema.ts";
import { HttpError } from "../http-error/index.ts";
import type { QwenChapterAnalysis } from "../../types/index.ts";

interface AnalyzeChapterInput {
  novel: {
    id: number;
    title: string;
    style: string | null;
  };
  chapter: {
    id: number;
    chapterNo: number;
    title: string;
    content: string;
  };
  knownCharacters: Array<{
    id: number;
    name: string;
    aliases: string[];
    gender: string | null;
    ageRange: string | null;
    appearance: string | null;
    personality: string | null;
    background: string | null;
    ability: string | null;
  }>;
  recentSummaries: string[];
}

interface QwenApiResponse {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
  }>;
}

function getApiUrl(): string {
  return (
    process.env.QWEN_API_URL ??
    process.env.DASHSCOPE_API_URL ??
    "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
  );
}

function getApiKey(): string {
  const apiKey = process.env.QWEN_API_KEY ?? process.env.DASHSCOPE_API_KEY;

  if (!apiKey) {
    throw new HttpError(500, "缺少 QWEN_API_KEY 或 DASHSCOPE_API_KEY 环境变量");
  }

  return apiKey;
}

function getModel(): string {
  return process.env.QWEN_MODEL ?? "qwen-plus";
}

function getTimeoutMs(): number {
  const rawTimeout = process.env.QWEN_TIMEOUT_MS;
  const parsedTimeout = rawTimeout ? Number(rawTimeout) : 120000;

  if (!Number.isFinite(parsedTimeout) || parsedTimeout <= 0) {
    return 120000;
  }

  return parsedTimeout;
}

function getMaxRetries(): number {
  const rawRetries = process.env.QWEN_MAX_RETRIES;
  const parsedRetries = rawRetries ? Number(rawRetries) : 1;

  if (!Number.isInteger(parsedRetries) || parsedRetries < 0) {
    return 1;
  }

  return parsedRetries;
}

function getContentText(
  content: string | Array<{ type?: string; text?: string }> | undefined,
): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => (typeof item.text === "string" ? item.text : ""))
      .join("");
  }

  return "";
}

function buildSystemPrompt(): string {
  return [
    "你是小说转漫画系统的章节分析器。",
    "你必须只依据提供的章节文本、已有角色和最近章节摘要判断。",
    "禁止输出 JSON 之外的任何说明文字。",
    "禁止编造章节里没有出现的角色设定。",
    "如果章节人物可匹配到已有角色，优先复用已有角色。",
    "只有章节中明确出现的稳定新信息，才可以把动作标记为 update。",
    "无法稳定匹配已有角色时，动作标记为 create。",
    "每个角色都必须返回 action、matchType、confidence、changeSummary、evidence。",
  ].join("\n");
}

function buildUserPrompt(input: AnalyzeChapterInput): string {
  return JSON.stringify(input, null, 2);
}

function parseAnalysis(content: string): QwenChapterAnalysis {
  try {
    return JSON.parse(content) as QwenChapterAnalysis;
  } catch {
    throw new HttpError(502, "Qwen 返回了无法解析的 JSON");
  }
}

function shouldRetry(error: unknown): boolean {
  if (error instanceof HttpError) {
    return error.statusCode >= 500;
  }

  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return true;
    }

    const statusCode = error.response?.status;
    return statusCode === 429 || (typeof statusCode === "number" && statusCode >= 500);
  }

  return false;
}

function getRetryDelayMs(attempt: number): number {
  return Math.min(1000 * attempt, 3000);
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function normalizeRequestError(error: unknown): HttpError {
  if (error instanceof HttpError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return new HttpError(504, "Qwen 请求超时");
    }

    const statusCode = error.response?.status;

    if (statusCode === 401 || statusCode === 403) {
      return new HttpError(502, "Qwen 鉴权失败，请检查 API Key");
    }

    if (statusCode === 429) {
      return new HttpError(503, "Qwen 请求频率过高，请稍后重试");
    }

    if (typeof statusCode === "number" && statusCode >= 500) {
      return new HttpError(502, `Qwen 服务异常（HTTP ${statusCode}）`);
    }

    if (typeof statusCode === "number") {
      return new HttpError(502, `Qwen 请求失败（HTTP ${statusCode}）`);
    }

    return new HttpError(502, error.message || "Qwen 请求失败");
  }

  if (error instanceof Error) {
    return new HttpError(502, error.message);
  }

  return new HttpError(502, "Qwen 请求失败");
}

export class QwenClient {
  async analyzeChapter(input: AnalyzeChapterInput): Promise<QwenChapterAnalysis> {
    const maxRetries = getMaxRetries();
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt += 1) {
      try {
        const response = await axios.post<QwenApiResponse>(
          getApiUrl(),
          {
            model: getModel(),
            temperature: Number(process.env.QWEN_TEMPERATURE ?? 0.2),
            messages: [
              {
                role: "system",
                content: buildSystemPrompt(),
              },
              {
                role: "user",
                content: buildUserPrompt(input),
              },
            ],
            response_format: {
              type: "json_schema",
              json_schema: chapterAnalysisJsonSchema,
            },
          },
          {
            timeout: getTimeoutMs(),
            headers: {
              Authorization: `Bearer ${getApiKey()}`,
              "Content-Type": "application/json",
            },
          },
        );

        const message = response.data.choices?.[0]?.message;
        const content = getContentText(message?.content);

        if (!content) {
          throw new HttpError(502, "Qwen 未返回有效内容");
        }

        return parseAnalysis(content);
      } catch (error) {
        lastError = error;

        if (attempt > maxRetries || !shouldRetry(error)) {
          break;
        }

        console.warn("qwen_retry", {
          attempt,
          maxRetries,
          message: error instanceof Error ? error.message : "未知错误",
        });

        await sleep(getRetryDelayMs(attempt));
      }
    }

    throw normalizeRequestError(lastError);
  }
}
