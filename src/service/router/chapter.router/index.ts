import express from "express";
import { chapterController } from "../../controllers/chapterController/index.ts";

export const ChapterRouter = express.Router();

ChapterRouter.get("/:chapterId", chapterController.getChapterDetail);
ChapterRouter.post("/:chapterId/analyze", chapterController.analyzeChapter);
ChapterRouter.post("/:chapterId/comic", chapterController.generateComic);
