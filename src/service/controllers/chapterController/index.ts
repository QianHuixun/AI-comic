import type { Request, Response } from "express";
import { ChapterService } from "../../services/chapterService/index.ts";
import { ChapterAnalysisService } from "../../services/chapterAnalysisService/index.ts";
import { ComicGenerationService } from "../../services/comicGenerationService/index.ts";
import {
  getErrorMessage,
  getErrorStatusCode,
} from "../../lib/http-error/index.ts";
import { getAuthenticatedUser } from "../../proxy/auth.proxy.ts";

interface RequestWithOptionalFile extends Request {
  file?: {
    buffer: Buffer;
  };
}

export class ChapterController {
  private readonly chapterService: ChapterService;
  private readonly chapterAnalysisService: ChapterAnalysisService;
  private readonly comicGenerationService: ComicGenerationService;

  constructor() {
    this.chapterService = new ChapterService();
    this.chapterAnalysisService = new ChapterAnalysisService();
    this.comicGenerationService = new ComicGenerationService();
  }

  createChapter = async (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      const request = req as RequestWithOptionalFile;
      const result = await this.chapterService.createChapter(
        req.params.novelId,
        req.body,
        request.file,
        user.userId,
      );
      return res.status(201).json(result);
    } catch (error) {
      return res.status(getErrorStatusCode(error)).json({
        success: false,
        message: getErrorMessage(error),
      });
    }
  };

  listChapters = async (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      const result = await this.chapterService.listChapters(
        req.params.novelId,
        user.userId,
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(getErrorStatusCode(error)).json({
        success: false,
        message: getErrorMessage(error),
      });
    }
  };

  getChapterDetail = async (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      const result = await this.chapterService.getChapterDetail(
        req.params.chapterId,
        user.userId,
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(getErrorStatusCode(error)).json({
        success: false,
        message: getErrorMessage(error),
      });
    }
  };

  analyzeChapter = async (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      const force = req.body?.force === true;
      const result = await this.chapterAnalysisService.analyzeChapter(
        req.params.chapterId,
        user.userId,
        force,
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(getErrorStatusCode(error)).json({
        success: false,
        message: getErrorMessage(error),
      });
    }
  };

  generateComic = async (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      const force = req.body?.force === true;
      const result = await this.comicGenerationService.generateChapterComic(
        req.params.chapterId,
        user.userId,
        force,
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(getErrorStatusCode(error)).json({
        success: false,
        message: getErrorMessage(error),
      });
    }
  };
}

export const chapterController = new ChapterController();
