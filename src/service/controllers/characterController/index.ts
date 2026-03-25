import type { Request, Response } from "express";
import { CharacterService } from "../../services/characterService/index.ts";
import {
  getErrorMessage,
  getErrorStatusCode,
} from "../../lib/http-error/index.ts";
import { getAuthenticatedUser } from "../../proxy/auth.proxy.ts";

export class CharacterController {
  private readonly characterService: CharacterService;

  constructor() {
    this.characterService = new CharacterService();
  }

  listCharacters = async (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      const result = await this.characterService.listCharacters(
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

  getCharacterDetail = async (req: Request, res: Response) => {
    try {
      const user = getAuthenticatedUser(req);
      const result = await this.characterService.getCharacterDetail(
        req.params.characterId,
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
}

export const characterController = new CharacterController();
