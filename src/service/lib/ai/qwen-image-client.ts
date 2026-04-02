import axios from "axios";
import { HttpError } from "../http-error/index.ts";

interface GenerateImageInput {
  prompt: string;
  negativePrompt?: string | null;
  size?: string | null;
}

interface QwenImageResponse {
  output?: {
    choices?: Array<{
      message?: {
        content?: Array<{
          image?: string;
        }>;
      };
    }>;
  };
  usage?: {
    width?: number;
    height?: number;
  };
  code?: string;
  message?: string;
}

function getApiKey(): string {
  const apiKey = process.env.QWEN_API_KEY ?? process.env.DASHSCOPE_API_KEY;

  if (!apiKey) {
    throw new HttpError(500, "缺少 QWEN_API_KEY 或 DASHSCOPE_API_KEY 环境变量");
  }

  return apiKey;
}

function getApiUrl(): string {
  return (
    process.env.QWEN_IMAGE_API_URL ??
    "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation"
  );
}

function getModel(): string {
  return process.env.QWEN_IMAGE_MODEL ?? "qwen-image-2.0";
}

function getSize(): string {
  return process.env.QWEN_IMAGE_SIZE ?? "1024*1024";
}

function getTimeoutMs(): number {
  const parsed = Number(process.env.QWEN_IMAGE_TIMEOUT_MS ?? 180000);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 180000;
}

function normalizeImageError(error: unknown): HttpError {
  if (error instanceof HttpError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return new HttpError(504, "Qwen 文生图请求超时");
    }

    const statusCode = error.response?.status;
    const message =
      (error.response?.data as { message?: string } | undefined)?.message ?? error.message;

    if (message.includes("Access denied") || message.includes("overdue-payment")) {
      return new HttpError(
        502,
        "Qwen 文生图账号不可用，请检查阿里云 Model Studio 的账单、额度和服务开通状态",
      );
    }

    if (statusCode === 401 || statusCode === 403) {
      return new HttpError(502, "Qwen 文生图鉴权失败，请检查 API Key");
    }

    if (statusCode === 429) {
      return new HttpError(503, "Qwen 文生图请求频率过高，请稍后重试");
    }

    if (typeof statusCode === "number") {
      return new HttpError(502, `Qwen 文生图请求失败（HTTP ${statusCode}）：${message}`);
    }

    return new HttpError(502, message || "Qwen 文生图请求失败");
  }

  if (error instanceof Error) {
    return new HttpError(502, error.message);
  }

  return new HttpError(502, "Qwen 文生图请求失败");
}

async function downloadImageAsDataUrl(url: string): Promise<{
  imageData: string;
  mimeType: string;
}> {
  const response = await axios.get<ArrayBuffer>(url, {
    responseType: "arraybuffer",
    timeout: getTimeoutMs(),
  });
  const mimeType = response.headers["content-type"] || "image/png";
  const base64 = Buffer.from(response.data).toString("base64");

  return {
    imageData: `data:${mimeType};base64,${base64}`,
    mimeType,
  };
}

export class QwenImageClient {
  async generateImage(input: GenerateImageInput): Promise<{
    promptText: string;
    remoteUrl: string;
    imageData: string;
    mimeType: string;
    width: number | null;
    height: number | null;
  }> {
    const promptText = input.prompt.trim().slice(0, 800);

    if (!promptText) {
      throw new HttpError(400, "生成图片时缺少有效提示词");
    }

    try {
      const response = await axios.post<QwenImageResponse>(
        getApiUrl(),
        {
          model: getModel(),
          input: {
            messages: [
              {
                role: "user",
                content: [
                  {
                    text: promptText,
                  },
                ],
              },
            ],
          },
          parameters: {
            size: input.size ?? getSize(),
            prompt_extend: true,
            watermark: false,
            negative_prompt: input.negativePrompt ?? process.env.QWEN_IMAGE_NEGATIVE_PROMPT,
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

      if (response.data.code) {
        throw new HttpError(502, response.data.message || "Qwen 文生图请求失败");
      }

      const remoteUrl =
        response.data.output?.choices?.[0]?.message?.content?.[0]?.image?.trim() ?? "";

      if (!remoteUrl) {
        throw new HttpError(502, "Qwen 文生图未返回有效图片地址");
      }

      const { imageData, mimeType } = await downloadImageAsDataUrl(remoteUrl);

      return {
        promptText,
        remoteUrl,
        imageData,
        mimeType,
        width: response.data.usage?.width ?? null,
        height: response.data.usage?.height ?? null,
      };
    } catch (error) {
      throw normalizeImageError(error);
    }
  }
}
