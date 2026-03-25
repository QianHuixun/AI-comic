import express from "express";
import multer from "multer";
import { novelController } from "../../controllers/novelController/index.ts";
import { chapterController } from "../../controllers/chapterController/index.ts";
import { characterController } from "../../controllers/characterController/index.ts";

const upload = multer({
  storage: multer.memoryStorage(),
});

export const NovelRouter = express.Router();

NovelRouter.post("/", novelController.createNovel);
NovelRouter.get("/", novelController.listNovels);
NovelRouter.get("/:novelId", novelController.getNovelDetail);
NovelRouter.delete("/:novelId", novelController.deleteNovel);
NovelRouter.post("/:novelId/chapters", upload.single("file"), chapterController.createChapter);
NovelRouter.get("/:novelId/chapters", chapterController.listChapters);
NovelRouter.get("/:novelId/characters", characterController.listCharacters);
