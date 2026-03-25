import type { Request, Response } from "express";
import { NovelService } from "../../services/novelService/index.ts";
import {
  getErrorMessage,
  getErrorStatusCode,
} from "../../lib/http-error/index.ts";
import { getAuthenticatedUser } from "../../proxy/auth.proxy.ts";

export class NovelController {
  private readonly novelService: NovelService;

  constructor() {
    this.novelService = new NovelService();
  }

  createNovel = async (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      const result = await this.novelService.createNovel(user.userId, req.body);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(getErrorStatusCode(error)).json({
        success: false,
        message: getErrorMessage(error),
      });
    }
  };

  listNovels = async (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      const result = await this.novelService.listNovels(user.userId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(getErrorStatusCode(error)).json({
        success: false,
        message: getErrorMessage(error),
      });
    }
  };

  getNovelDetail = async (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      const result = await this.novelService.getNovelDetail(req.params.novelId, user.userId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(getErrorStatusCode(error)).json({
        success: false,
        message: getErrorMessage(error),
      });
    }
  };

  deleteNovel = async (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      const result = await this.novelService.deleteNovel(req.params.novelId, user.userId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(getErrorStatusCode(error)).json({
        success: false,
        message: getErrorMessage(error),
      });
    }
  };
}

export const novelController = new NovelController();
