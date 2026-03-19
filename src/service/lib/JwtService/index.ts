import dotenv from 'dotenv';
dotenv.config()
 import Jwt from "jsonwebtoken"
 import bcrypt from 'bcryptjs';
 interface Body{
    passWord:string
 }
export class JwtService{
   private  readonly JwtKey= process.env.JWTKEY||"123456"
   private  readonly  BcryptKey= bcrypt.genSalt(10)
   private  readonly options ={expiresIn: '24h'}
constructor(){}
async sign(body:Body){
body.passWord=await bcrypt.hash(body.passWord,await this.BcryptKey)
  return {
    token:Jwt.sign(body,this.JwtKey,this.options as Jwt.SignOptions),
    passWord:body.passWord
  } 
}
verify(token:string){
    return  Jwt.verify(token,this.JwtKey,{ complete:true})
}
}