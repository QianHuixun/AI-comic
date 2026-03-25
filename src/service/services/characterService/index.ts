import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "../../../db/connection.ts";
import { chapterCharacters, chapters, characters, novels } from "../../../db/schema.ts";
import { HttpError } from "../../lib/http-error/index.ts";

function parsePositiveInteger(value: unknown, fieldName: string): number {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new HttpError(400, `${fieldName} 必须是正整数`);
  }

  return parsed;
}

export class CharacterService {
  async listCharacters(novelIdParam: unknown, userIdParam: unknown) {
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
      .from(characters)
      .where(eq(characters.novelId, novelId))
      .orderBy(asc(characters.name), asc(characters.id));

    return {
      success: true as const,
      message: "获取角色列表成功",
      data,
    };
  }

  async getCharacterDetail(characterIdParam: unknown, userIdParam: unknown) {
    const characterId = parsePositiveInteger(characterIdParam, "characterId");
    const userId = parsePositiveInteger(userIdParam, "userId");

    const [characterRow] = await db
      .select({ character: characters })
      .from(characters)
      .innerJoin(novels, eq(characters.novelId, novels.id))
      .where(and(eq(characters.id, characterId), eq(novels.userId, userId)));

    if (!characterRow) {
      throw new HttpError(404, "角色不存在");
    }

    const { character } = characterRow;

    const recentAppearances = await db
      .select({
        chapterId: chapters.id,
        chapterNo: chapters.chapterNo,
        chapterTitle: chapters.title,
        action: chapterCharacters.action,
        roleInChapter: chapterCharacters.roleInChapter,
        changeSummary: chapterCharacters.changeSummary,
      })
      .from(chapterCharacters)
      .innerJoin(chapters, eq(chapterCharacters.chapterId, chapters.id))
      .where(eq(chapterCharacters.characterId, characterId))
      .orderBy(desc(chapters.chapterNo), desc(chapters.id))
      .limit(5);

    return {
      success: true as const,
      message: "获取角色详情成功",
      data: {
        ...character,
        recentAppearances,
      },
    };
  }
}
