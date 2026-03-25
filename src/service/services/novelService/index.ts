import { and, count, desc, eq } from "drizzle-orm";
import { db } from "../../../db/connection.ts";
import { chapters, characters, novels } from "../../../db/schema.ts";
import { HttpError } from "../../lib/http-error/index.ts";
import type { CreateNovelBody } from "../../types/index.ts";

function normalizeOptionalText(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export class NovelService {
  async createNovel(userId: number, body: CreateNovelBody) {
    const title = body.title?.trim();

    if (!title) {
      throw new HttpError(400, "小说标题不能为空");
    }

    const [novel] = await db
      .insert(novels)
      .values({
        userId,
        title,
        description: normalizeOptionalText(body.description),
        style: normalizeOptionalText(body.style),
        sourceType: body.sourceType ?? "manual",
        status: body.status ?? "draft",
      })
      .returning();

    return {
      success: true as const,
      message: "小说创建成功",
      data: novel,
    };
  }

  async listNovels(userId: number) {
    const data = await db
      .select()
      .from(novels)
      .where(eq(novels.userId, userId))
      .orderBy(desc(novels.updatedAt), desc(novels.id));

    return {
      success: true as const,
      message: "获取小说列表成功",
      data,
    };
  }

  async getNovelDetail(novelIdParam: unknown, userId: number) {
    const novelId = Number(novelIdParam);

    if (!Number.isInteger(novelId) || novelId <= 0) {
      throw new HttpError(400, "novelId 必须是正整数");
    }

    const [novel] = await db
      .select()
      .from(novels)
      .where(and(eq(novels.id, novelId), eq(novels.userId, userId)));

    if (!novel) {
      throw new HttpError(404, "小说不存在");
    }

    const [chapterStats] = await db
      .select({ count: count() })
      .from(chapters)
      .where(eq(chapters.novelId, novelId));

    const [characterStats] = await db
      .select({ count: count() })
      .from(characters)
      .where(eq(characters.novelId, novelId));

    return {
      success: true as const,
      message: "获取小说详情成功",
      data: {
        ...novel,
        stats: {
          chapterCount: chapterStats.count,
          characterCount: characterStats.count,
        },
      },
    };
  }
}
