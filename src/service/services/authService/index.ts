
import { eq } from "drizzle-orm";
import { db } from "../../../db/connection.ts";
import { users , type User} from "../../../db/schema.ts";
import { JwtService } from "../../lib/JwtService/index.ts";
import type { SignInBody } from "../../types/index.ts";
export class AuthService {
  private readonly jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService(); // 实例化 JWT 服务
  }

   SignIn=async (body: SignInBody)=> {
    if (!body.passWord) {
      throw new Error("密码不能为空");
    }
     const { phoneNumber, passWord } = body;

    // 1. 参数校验
    if (! phoneNumber || !passWord) {
      throw new Error("用户名和密码不能为空");
    }
    // 2. 从 Supabase 查询用户（Drizzle PostgreSQL 语法）
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.phoneNumber,phoneNumber));
    if (!user) {
      throw new Error("用户名不存在");
    }
    // 3. 验证密码
      const isPwdValid = this.jwtService.verifyPassword(body.passWord,user.passWord)
    if (!isPwdValid) {
      throw new Error("密码错误");
    }
     body.passWord=user.passWord
     const result = await this.jwtService.sign(body);
    return {
      success: true,
      message: "登录成功",
      data: result,
    };
  }
   SignUp=async(body:SignInBody)=> {
    // 注册逻辑（示例）
const { phoneNumber,passWord} = body;
    // 1. 校验手机号/邮箱是否已存在
    const [existUser] = await
 db
      .select()
      .from(users)
      .where(eq(users.phoneNumber, phoneNumber))

    if (existUser) {
      throw new Error("手机号/邮箱已存在");
    }
    // 3. 插入数据
  const hashedPwd= await this.jwtService.hashPassword(passWord)
    const [newUser] = await
    db.insert(users) .values({ ...body, passWord: hashedPwd }) .returning();

    // 4. 返回用户信息
    const { ...userInfo } = newUser;
    return {
      success: true,
      message: "注册成功",
      data: userInfo,
    };
  }
  }