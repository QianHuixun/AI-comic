import type { NextFunction, Request, Response } from "express";
import { JwtService } from "../lib/JwtService/index.ts";
import { HttpError } from "../lib/http-error/index.ts";
import type { AuthSession } from "../types/index.ts";

export type AuthenticatedRequest = Request & {
  user?: unknown;
};

const jwtService = new JwtService();

export function getAuthenticatedUser(req: Request): AuthSession {
  const { user } = req as AuthenticatedRequest;

  if (!user || typeof user !== "object") {
    throw new HttpError(401, "登录状态无效，请重新登录");
  }

  const userId = Reflect.get(user, "userId");
  const phoneNumber = Reflect.get(user, "phoneNumber");
  const name = Reflect.get(user, "name");

  if (!Number.isInteger(userId) || typeof phoneNumber !== "string") {
    throw new HttpError(401, "登录状态已失效，请重新登录");
  }

  return {
    userId: Number(userId),
    phoneNumber,
    name: typeof name === "string" ? name : null,
  };
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "未提供有效的 Token，请先登录",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwtService.verify(token);
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token 无效或已过期，请重新登录",
      error: (error as Error).message,
    });
  }
};
