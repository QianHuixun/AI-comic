import { and, asc, eq } from "drizzle-orm";
import { db } from "../../../db/connection.ts";
import {
  chapterCharacters,
  chapters,
  characters,
  comicPages,
  novels,
  storyboardImages,
} from "../../../db/schema.ts";
import { HttpError } from "../../lib/http-error/index.ts";
import type { CreateChapterBody } from "../../types/index.ts";

interface UploadedTextFile {
  buffer: Buffer;
}

function parsePositiveInteger(value: unknown, fieldName: string): number {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new HttpError(400, `${fieldName} 必须是正整数`);
  }

  return parsed;
}

function normalizeRequiredText(value: string | undefined, fieldName: string): string {
  const trimmed = value?.trim();

  if (!trimmed) {
    throw new HttpError(400, `${fieldName} 不能为空`);
  }

  return trimmed;
}

function getContentLength(content: string): number {
  return Array.from(content).length;
}

export class ChapterService {
  async createChapter(
    novelIdParam: unknown,
    body: CreateChapterBody,
    uploadedFile?: UploadedTextFile,
    userId?: number,
  ) {
    const novelId = parsePositiveInteger(novelIdParam, "novelId");
    const chapterNo = parsePositiveInteger(body.chapterNo, "chapterNo");
    const title = normalizeRequiredText(body.title, "章节标题");
    const uploadedContent = uploadedFile?.buffer.toString("utf-8");
    const content = normalizeRequiredText(body.content ?? uploadedContent, "章节内容");
    const contentLength = getContentLength(content);

    if (contentLength > 5000) {
      throw new HttpError(400, "章节内容不能超过 5000 字");
    }

    const [novel] = await db
      .select({ id: novels.id })
      .from(novels)
      .where(
        and(
          eq(novels.id, novelId),
          eq(novels.userId, parsePositiveInteger(userId, "userId")),
        ),
      );

    if (!novel) {
      throw new HttpError(404, "小说不存在");
    }

    const [existingChapter] = await db
      .select({ id: chapters.id })
      .from(chapters)
      .where(and(eq(chapters.novelId, novelId), eq(chapters.chapterNo, chapterNo)));

    if (existingChapter) {
      throw new HttpError(409, "同一本小说内 chapterNo 不能重复");
    }

    const sourceType = uploadedFile ? "upload" : "manual";

    const [chapter] = await db
      .insert(chapters)
      .values({
        novelId,
        chapterNo,
        title,
        content,
        contentLength,
        status: "pending",
      })
      .returning();

    await db
      .update(novels)
      .set({
        totalChapters: await this.getNovelChapterCount(novelId),
        sourceType,
      })
      .where(eq(novels.id, novelId));

    return {
      success: true as const,
      message: "章节创建成功",
      data: chapter,
    };
  }

  async listChapters(novelIdParam: unknown, userIdParam: unknown) {
    const novelId = parsePositiveInteger(novelIdParam, "novelId");
    const userId = parsePositiveInteger(userIdParam, "userId");

    const [novel] = await db
      .select({ id: novels.id })
      .from(novels)
      .where(and(eq(novels.id, novelId), eq(novels.userId, userId)));

    if (!novel) {
      throw new HttpError(404, "小说不存在");
    }

    const data = await db
      .select()
      .from(chapters)
      .where(eq(chapters.novelId, novelId))
      .orderBy(asc(chapters.chapterNo), asc(chapters.id));

    return {
      success: true as const,
      message: "获取章节列表成功",
      data,
    };
  }

  async getChapterDetail(chapterIdParam: unknown, userIdParam: unknown) {
    const chapterId = parsePositiveInteger(chapterIdParam, "chapterId");
    const userId = parsePositiveInteger(userIdParam, "userId");

    const [chapterRow] = await db
      .select({ chapter: chapters })
      .from(chapters)
      .innerJoin(novels, eq(chapters.novelId, novels.id))
      .where(and(eq(chapters.id, chapterId), eq(novels.userId, userId)));

    if (!chapterRow) {
      throw new HttpError(404, "章节不存在");
    }

    const { chapter } = chapterRow;

    const characterRows = await db
      .select({
        id: characters.id,
        name: characters.name,
        action: chapterCharacters.action,
        roleInChapter: chapterCharacters.roleInChapter,
        changeSummary: chapterCharacters.changeSummary,
      })
      .from(chapterCharacters)
      .innerJoin(characters, eq(chapterCharacters.characterId, characters.id))
      .where(eq(chapterCharacters.chapterId, chapterId))
      .orderBy(asc(characters.id));

    const storyboardImageRows = await db
      .select()
      .from(storyboardImages)
      .where(eq(storyboardImages.chapterId, chapterId))
      .orderBy(asc(storyboardImages.panelNo), asc(storyboardImages.id));

    const comicPageRows = await db
      .select()
      .from(comicPages)
      .where(eq(comicPages.chapterId, chapterId))
      .orderBy(asc(comicPages.pageNo), asc(comicPages.id));

    return {
      success: true as const,
      message: "获取章节详情成功",
      data: {
        ...chapter,
        characters: characterRows,
        storyboardImages: storyboardImageRows,
        comicPages: comicPageRows,
      },
    };
  }

  private async getNovelChapterCount(novelId: number): Promise<number> {
    const existingChapters = await db
      .select({ id: chapters.id })
      .from(chapters)
      .where(eq(chapters.novelId, novelId));

    return existingChapters.length;
  }
}
