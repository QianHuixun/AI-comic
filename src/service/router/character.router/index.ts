import express from "express";
import { characterController } from "../../controllers/characterController/index.ts";

export const CharacterRouter = express.Router();

CharacterRouter.get("/:characterId", characterController.getCharacterDetail);
