import type { Request, Response } from "express"; // 关键：导入 Express 类型
import  { AuthService}  from "../../services/authService/index.ts";
export class AuthController {
  private readonly authService: AuthService;
  constructor() {
    this.authService = new AuthService(); // 实例化服务层
  }
  // 登录接口（修正：添加完整的请求/响应处理）
   SignIn =async(req: Request, res: Response) =>{
    try {
      // 调用服务层逻辑
      const result = await this.authService.SignIn(req.body);
      
      // 返回响应（关键：必须用 res.json 返回，否则接口无响应）
      return res.status(200).json(result);
    } catch (error) {
      console.log(this.authService)
      const err = error as Error;
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  // 注册接口
   SignUp=async (req: Request, res: Response)=> {
    try {
      const result = await this.authService.SignUp(req.body);
      return res.status(201).json(result);
    } catch (error) {
      const err = error as Error;
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
}

// 导出控制器实例（供路由使用）
export const authController = new AuthController();