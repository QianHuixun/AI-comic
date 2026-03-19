import type { Request, Response, NextFunction } from 'express';
import { JwtService } from '../lib/JwtService/index.ts';

/**
 * JWT 鉴权中间件（TS 版，完整类型注解）
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. 获取 Token
  const jwtservice=new JwtService()
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: '未提供有效的Token，请先登录',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. 验证 Token 并解析 Payload（指定类型为 JwtPayload）
    const decoded = jwtservice.verify(token);
    
    // 3. 挂载到 req.user（类型已在 global 中扩展）
    req.use = decoded;
    next();
  } catch (error) {
    const err = error as Error; // 类型收窄
    return res.status(401).json({
      success: false,
      message: 'Token 无效或已过期，请重新登录',
      error: err.message,
    });
  }
};