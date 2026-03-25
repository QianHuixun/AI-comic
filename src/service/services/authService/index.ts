import { eq } from "drizzle-orm";
import { db } from "../../../db/connection.ts";
import { users } from "../../../db/schema.ts";
import { JwtService } from "../../lib/JwtService/index.ts";
import type { AuthUserSummary, SignInBody } from "../../types/index.ts";

export class AuthService {
  private readonly jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService();
  }

  SignIn = async (body: SignInBody) => {
    if (!body.passWord) {
      throw new Error("密码不能为空");
    }

    const { phoneNumber, passWord } = body;

    if (!phoneNumber || !passWord) {
      throw new Error("用户名和密码不能为空");
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.phoneNumber, phoneNumber));

    if (!user) {
      throw new Error("用户名不存在");
    }

    const isPwdValid = await this.jwtService.verifyPassword(
      body.passWord,
      user.passWord,
    );

    if (!isPwdValid) {
      throw new Error("密码错误");
    }

    const userInfo: AuthUserSummary = {
      id: user.id,
      phoneNumber: user.phoneNumber,
      name: user.name ?? null,
    };
    const result = await this.jwtService.sign({
      userId: user.id,
      phoneNumber: user.phoneNumber,
      name: user.name ?? null,
    });

    return {
      success: true,
      message: "登录成功",
      data: {
        ...result,
        user: userInfo,
      },
    };
  };

  SignUp = async (body: SignInBody) => {
    const { phoneNumber, passWord } = body;
    const [existUser] = await db
      .select()
      .from(users)
      .where(eq(users.phoneNumber, phoneNumber));

    if (existUser) {
      throw new Error("手机号/邮箱已存在");
    }

    const hashedPwd = await this.jwtService.hashPassword(passWord);
    const [newUser] = await db
      .insert(users)
      .values({ ...body, passWord: hashedPwd })
      .returning();

    const { ...userInfo } = newUser;
    return {
      success: true,
      message: "注册成功",
      data: userInfo,
    };
  };
}
