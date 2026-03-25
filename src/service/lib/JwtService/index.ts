import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import type { AuthSession } from "../../types/index.ts";

dotenv.config();

export class JwtService {
  private readonly JwtKey: string = process.env.JWTKEY || "123456";
  private readonly BcryptRounds: number = 10;
  private readonly options = { expiresIn: "24h" } as const;

  constructor() {}

  async sign(session: AuthSession) {
    const token = jwt.sign(session, this.JwtKey, this.options);

    return { token };
  }

  verify(token: string) {
    try {
      return jwt.verify(token, this.JwtKey);
    } catch (error) {
      throw new Error("Token 验证失败：" + (error as Error).message);
    }
  }

  async verifyPassword(plainPwd: string, hashedPwd: string) {
    return bcrypt.compare(plainPwd, hashedPwd);
  }

  async hashPassword(passWord: string) {
    return bcrypt.hash(passWord, this.BcryptRounds);
  }
}
