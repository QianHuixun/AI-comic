import { and, asc, eq } from "drizzle-orm";
import { db } from "../../../db/connection.ts";
import {
  chapters,
  comicPages,
  novels,
  storyboardImages,
} from "../../../db/schema.ts";
import { QwenImageClient } from "../../lib/ai/qwen-image-client.ts";
import { HttpError } from "../../lib/http-error/index.ts";
import type {
  ComicPageAsset,
  GenerateComicResponse,
  QwenStoryboard,
  StoryboardImageAsset,
} from "../../types/index.ts";

function parsePositiveInteger(value: unknown, fieldName: string): number {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new HttpError(400, `${fieldName} 必须是正整数`);
  }

  return parsed;
}

function getStyleDescription(style: string | null): string {
  if (style === "anime") {
    return "日漫分镜风格";
  }

  if (style === "western") {
    return "美漫分镜风格";
  }

  if (style === "chinese") {
    return "国风漫画风格";
  }

  if (style === "q-version") {
    return "Q版漫画风格";
  }

  return "高完成度漫画分镜风格";
}

function getChapterStoryboards(chapter: typeof chapters.$inferSelect): QwenStoryboard[] {
  const storyboardItems = chapter.storyboardJson?.storyboards;

  if (Array.isArray(storyboardItems) && storyboardItems.length > 0) {
    return storyboardItems as QwenStoryboard[];
  }

  const analysisItems = chapter.analysisJson?.storyboards;
  return Array.isArray(analysisItems) ? (analysisItems as QwenStoryboard[]) : [];
}

function buildPanelPrompt(input: {
  novelTitle: string;
  style: string | null;
  chapterTitle: string;
  chapterSummary: string | null;
  storyboard: QwenStoryboard;
}): string {
  const { novelTitle, style, chapterTitle, chapterSummary, storyboard } = input;
  const promptParts = [
    "请生成一张用于小说转漫画系统的高质量分镜插画。",
    `整体风格：${getStyleDescription(style)}。`,
    `小说：${novelTitle}。`,
    `章节：${chapterTitle}。`,
    `场景标题：${storyboard.sceneTitle}。`,
    `镜头类型：${storyboard.shot}。`,
    `画面描述：${storyboard.description}。`,
    storyboard.dialogue ? `对白参考：${storyboard.dialogue}。` : "",
    storyboard.emotion ? `情绪氛围：${storyboard.emotion}。` : "",
    chapterSummary ? `章节摘要：${chapterSummary}。` : "",
    "要求：单幅漫画分镜画面，人物一致，构图明确，电影感，细节完整，无水印，无页码，无气泡中的多余文字。",
  ];

  return promptParts.filter(Boolean).join("");
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function buildComicPageDataUrl(input: {
  chapterTitle: string;
  pageNo: number;
  panels: Array<{
    panelNo: number;
    sceneTitle: string;
    imageData: string;
  }>;
}): {
  imageData: string;
  layoutJson: Record<string, unknown>;
} {
  const { chapterTitle, pageNo, panels } = input;
  const width = 1600;
  const height = 2400;
  const margin = 64;
  const gap = 36;
  const top = 180;
  const panelWidth = (width - margin * 2 - gap) / 2;
  const panelHeight = 860;
  const positions = [
    { x: margin, y: top },
    { x: margin + panelWidth + gap, y: top },
    { x: margin, y: top + panelHeight + gap },
    { x: margin + panelWidth + gap, y: top + panelHeight + gap },
  ];

  const panelNodes = panels
    .map((panel, index) => {
      const position = positions[index];
      const titleY = position.y + panelHeight + 36;

      return `
        <g>
          <rect x="${position.x}" y="${position.y}" width="${panelWidth}" height="${panelHeight}" rx="28" fill="#ffffff" stroke="#0f172a" stroke-width="8" />
          <image href="${panel.imageData}" x="${position.x + 12}" y="${position.y + 12}" width="${panelWidth - 24}" height="${panelHeight - 24}" preserveAspectRatio="xMidYMid slice" />
          <rect x="${position.x + 18}" y="${position.y + 18}" width="112" height="54" rx="22" fill="#111827" />
          <text x="${position.x + 74}" y="${position.y + 52}" text-anchor="middle" font-family="Arial" font-size="24" font-weight="700" fill="#ffffff">Panel ${panel.panelNo}</text>
          <text x="${position.x + 8}" y="${titleY}" font-family="Arial" font-size="30" font-weight="700" fill="#111827">${escapeXml(panel.sceneTitle)}</text>
        </g>
      `;
    })
    .join("");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#f4efe7" />
      <rect x="28" y="28" width="${width - 56}" height="${height - 56}" rx="44" fill="none" stroke="#111827" stroke-width="12" />
      <text x="${margin}" y="96" font-family="Arial" font-size="52" font-weight="800" fill="#111827">${escapeXml(chapterTitle)}</text>
      <text x="${margin}" y="142" font-family="Arial" font-size="26" font-weight="600" fill="#475569">Comic Page ${pageNo}</text>
      ${panelNodes}
    </svg>
  `;

  return {
    imageData: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`,
    layoutJson: {
      width,
      height,
      layout: "2x2",
      panelCount: panels.length,
    },
  };
}

function mapStoryboardImageAsset(
  item: typeof storyboardImages.$inferSelect,
): StoryboardImageAsset {
  return {
    id: item.id,
    panelNo: item.panelNo,
    sceneTitle: item.sceneTitle,
    promptText: item.promptText,
    revisedPrompt: item.revisedPrompt ?? null,
    remoteUrl: item.remoteUrl ?? null,
    imageData: item.imageData ?? null,
    mimeType: item.mimeType ?? null,
    status: item.status,
    errorMessage: item.errorMessage ?? null,
    createdAt: item.createdAt ?? null,
    updatedAt: item.updatedAt ?? null,
  };
}

function mapComicPageAsset(item: typeof comicPages.$inferSelect): ComicPageAsset {
  return {
    id: item.id,
    pageNo: item.pageNo,
    title: item.title,
    layoutJson: item.layoutJson ?? null,
    panelImageIdsJson: item.panelImageIdsJson ?? null,
    imageData: item.imageData,
    mimeType: item.mimeType,
    createdAt: item.createdAt ?? null,
    updatedAt: item.updatedAt ?? null,
  };
}

export class ComicGenerationService {
  private readonly qwenImageClient: QwenImageClient;

  constructor() {
    this.qwenImageClient = new QwenImageClient();
  }

  async generateChapterComic(
    chapterIdParam: unknown,
    userIdParam: unknown,
    force = false,
  ): Promise<{
    success: true;
    message: string;
    data: GenerateComicResponse;
  }> {
    const chapterId = parsePositiveInteger(chapterIdParam, "chapterId");
    const userId = parsePositiveInteger(userIdParam, "userId");

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
    const storyboards = getChapterStoryboards(chapter);

    if (storyboards.length === 0) {
      throw new HttpError(409, "请先完成章节分析并生成分镜草案");
    }

    if (force) {
      await db.delete(comicPages).where(eq(comicPages.chapterId, chapterId));
      await db.delete(storyboardImages).where(eq(storyboardImages.chapterId, chapterId));
    }

    const existingImages = await db
      .select()
      .from(storyboardImages)
      .where(eq(storyboardImages.chapterId, chapterId))
      .orderBy(asc(storyboardImages.panelNo), asc(storyboardImages.id));
    const existingByPanelNo = new Map(existingImages.map((item) => [item.panelNo, item]));
    const completedImages: Array<typeof storyboardImages.$inferSelect> = [];

    for (const storyboard of storyboards) {
      const existingImage = existingByPanelNo.get(storyboard.panelNo);

      if (
        existingImage &&
        existingImage.status === "completed" &&
        existingImage.imageData?.trim()
      ) {
        completedImages.push(existingImage);
        continue;
      }

      const promptText = buildPanelPrompt({
        novelTitle: novel.title,
        style: novel.style ?? null,
        chapterTitle: chapter.title,
        chapterSummary: chapter.summary ?? null,
        storyboard,
      });

      try {
        const generatedImage = await this.qwenImageClient.generateImage({
          prompt: promptText,
        });

        if (existingImage) {
          const [updated] = await db
            .update(storyboardImages)
            .set({
              sceneTitle: storyboard.sceneTitle,
              promptText: generatedImage.promptText,
              revisedPrompt: generatedImage.promptText,
              remoteUrl: generatedImage.remoteUrl,
              imageData: generatedImage.imageData,
              mimeType: generatedImage.mimeType,
              status: "completed",
              errorMessage: null,
            })
            .where(eq(storyboardImages.id, existingImage.id))
            .returning();

          completedImages.push(updated);
          continue;
        }

        const [created] = await db
          .insert(storyboardImages)
          .values({
            chapterId,
            panelNo: storyboard.panelNo,
            sceneTitle: storyboard.sceneTitle,
            promptText: generatedImage.promptText,
            revisedPrompt: generatedImage.promptText,
            remoteUrl: generatedImage.remoteUrl,
            imageData: generatedImage.imageData,
            mimeType: generatedImage.mimeType,
            status: "completed",
          })
          .returning();

        completedImages.push(created);
      } catch (error) {
        const message = error instanceof Error ? error.message : "分镜图生成失败";

        if (existingImage) {
          await db
            .update(storyboardImages)
            .set({
              sceneTitle: storyboard.sceneTitle,
              promptText,
              revisedPrompt: null,
              remoteUrl: null,
              imageData: null,
              mimeType: null,
              status: "failed",
              errorMessage: message,
            })
            .where(eq(storyboardImages.id, existingImage.id));
        } else {
          await db.insert(storyboardImages).values({
            chapterId,
            panelNo: storyboard.panelNo,
            sceneTitle: storyboard.sceneTitle,
            promptText,
            revisedPrompt: null,
            remoteUrl: null,
            imageData: null,
            mimeType: null,
            status: "failed",
            errorMessage: message,
          });
        }

        throw error;
      }
    }

    await db.delete(comicPages).where(eq(comicPages.chapterId, chapterId));

    const sortedImages = [...completedImages].sort((a, b) => a.panelNo - b.panelNo);
    const createdPages: Array<typeof comicPages.$inferSelect> = [];

    for (let index = 0; index < sortedImages.length; index += 4) {
      const pagePanels = sortedImages.slice(index, index + 4);
      const pageNo = Math.floor(index / 4) + 1;
      const pageRender = buildComicPageDataUrl({
        chapterTitle: chapter.title,
        pageNo,
        panels: pagePanels.map((panel) => ({
          panelNo: panel.panelNo,
          sceneTitle: panel.sceneTitle,
          imageData: panel.imageData ?? "",
        })),
      });

      const [createdPage] = await db
        .insert(comicPages)
        .values({
          chapterId,
          pageNo,
          title: `${chapter.title} - Page ${pageNo}`,
          layoutJson: pageRender.layoutJson,
          panelImageIdsJson: pagePanels.map((panel) => panel.id),
          imageData: pageRender.imageData,
          mimeType: "image/svg+xml",
        })
        .returning();

      createdPages.push(createdPage);
    }

    const latestImages = await db
      .select()
      .from(storyboardImages)
      .where(eq(storyboardImages.chapterId, chapterId))
      .orderBy(asc(storyboardImages.panelNo), asc(storyboardImages.id));
    const latestPages = await db
      .select()
      .from(comicPages)
      .where(eq(comicPages.chapterId, chapterId))
      .orderBy(asc(comicPages.pageNo), asc(comicPages.id));

    return {
      success: true,
      message: force ? "漫画页重新生成成功" : "漫画页生成成功",
      data: {
        chapterId,
        storyboardImages: latestImages.map(mapStoryboardImageAsset),
        comicPages: latestPages.map(mapComicPageAsset),
      },
    };
  }
}
