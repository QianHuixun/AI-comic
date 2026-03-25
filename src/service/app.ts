import express from "express";
import { AuthRouter } from "./router/auth.router/index.ts";
import { NovelRouter } from "./router/novel.router/index.ts";
import { ChapterRouter } from "./router/chapter.router/index.ts";
import { CharacterRouter } from "./router/character.router/index.ts";
import { authMiddleware } from "./proxy/auth.proxy.ts";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use("/api/auth", AuthRouter);
  app.use("/api/novels", authMiddleware, NovelRouter);
  app.use("/api/chapters", authMiddleware, ChapterRouter);
  app.use("/api/characters", authMiddleware, CharacterRouter);

  return app;
}
