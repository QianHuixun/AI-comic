import { AxiosError } from "axios";
import request from "./index.ts";
import type {
  AnalyzeChapterResponse,
  ApiResponse,
  ChapterDetail,
  ChapterRecord,
  CharacterDetail,
  CharacterRecord,
  GenerateComicResponse,
  NovelDetail,
  NovelRecord,
} from "../lib/types/ai-creation.ts";

export interface CreateNovelPayload {
  title: string;
  description?: string;
  style?: string;
}

export interface CreateChapterPayload {
  chapterNo: number;
  title: string;
  content: string;
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message ??
      "请求失败"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "请求失败";
}

export async function fetchNovels(): Promise<NovelRecord[]> {
  const response = await request.get<ApiResponse<NovelRecord[]>>("/novels");
  return response.data.data;
}

export async function createNovel(payload: CreateNovelPayload): Promise<NovelRecord> {
  const response = await request.post<ApiResponse<NovelRecord>>("/novels", payload);
  return response.data.data;
}

export async function fetchNovelDetail(novelId: number): Promise<NovelDetail> {
  const response = await request.get<ApiResponse<NovelDetail>>(`/novels/${novelId}`);
  return response.data.data;
}

export async function fetchChapters(novelId: number): Promise<ChapterRecord[]> {
  const response = await request.get<ApiResponse<ChapterRecord[]>>(
    `/novels/${novelId}/chapters`,
  );
  return response.data.data;
}

export async function fetchCharacters(novelId: number): Promise<CharacterRecord[]> {
  const response = await request.get<ApiResponse<CharacterRecord[]>>(
    `/novels/${novelId}/characters`,
  );
  return response.data.data;
}

export async function createChapter(
  novelId: number,
  payload: CreateChapterPayload,
): Promise<ChapterRecord> {
  const response = await request.post<ApiResponse<ChapterRecord>>(
    `/novels/${novelId}/chapters`,
    payload,
  );
  return response.data.data;
}

export async function uploadChapter(
  novelId: number,
  payload: {
    chapterNo: number;
    title: string;
    file: File;
  },
): Promise<ChapterRecord> {
  const formData = new FormData();
  formData.append("chapterNo", String(payload.chapterNo));
  formData.append("title", payload.title);
  formData.append("file", payload.file);

  const response = await request.post<ApiResponse<ChapterRecord>>(
    `/novels/${novelId}/chapters`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.data;
}

export async function fetchChapterDetail(chapterId: number): Promise<ChapterDetail> {
  const response = await request.get<ApiResponse<ChapterDetail>>(`/chapters/${chapterId}`);
  return response.data.data;
}

export async function analyzeChapter(
  chapterId: number,
  options?: {
    force?: boolean;
  },
): Promise<AnalyzeChapterResponse> {
  const response = await request.post<ApiResponse<AnalyzeChapterResponse>>(
    `/chapters/${chapterId}/analyze`,
    { force: options?.force === true },
    {
      timeout: 300000,
    },
  );
  return response.data.data;
}

export async function generateComic(
  chapterId: number,
  options?: {
    force?: boolean;
  },
): Promise<GenerateComicResponse> {
  const response = await request.post<ApiResponse<GenerateComicResponse>>(
    `/chapters/${chapterId}/comic`,
    { force: options?.force === true },
    {
      timeout: 300000,
    },
  );
  return response.data.data;
}

export async function fetchCharacterDetail(
  characterId: number,
): Promise<CharacterDetail> {
  const response = await request.get<ApiResponse<CharacterDetail>>(
    `/characters/${characterId}`,
  );
  return response.data.data;
}
