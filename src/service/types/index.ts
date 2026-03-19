export interface SignInBody {
  passWord: string;
  phoneNumber:string;
  // 可扩展：username/email 等
}

// JWT Payload 类型
export interface JwtPayload {
  passWord?: string; // 实际不要存密码，这里仅示例
  [key: string]: any;
}