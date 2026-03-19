import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import type { SignInBody } from "../../types/index.ts";

dotenv.config();

export class JwtService {
  private readonly JwtKey: string = process.env.JWTKEY || "123456";
  private readonly BcryptRounds: number = 10; // 盐值轮数（固定数字，不要用 Promise）
  private readonly options = { expiresIn: "24h" } as const;

  constructor() {}

  // 生成加密密码 + JWT Token
  async sign(body: SignInBody) {
    // 2. 生成 Token（payload 不要存原始密码，这里仅示例）
    const token = jwt.sign(
      body, // 实际应存用户ID/用户名，而非密码
      this.JwtKey,
      this.options
    );

    return { token };
  }

  // 验证 Token
  verify(token: string) {
    try {
      return jwt.verify(token, this.JwtKey, { complete: true });
    } catch (error) {
      throw new Error("Token 验证失败：" + (error as Error).message);
    }
  }

  // 新增：验证密码（对比明文和加密密码）
  async verifyPassword(plainPwd: string, hashedPwd: string) {
    return bcrypt.compare(plainPwd, hashedPwd);
  }
  async hashPassword(passWord:string){
     return  await bcrypt.hash(passWord,this.BcryptRounds)
  }

}