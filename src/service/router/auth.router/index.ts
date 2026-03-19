import  express from 'express'
import  {authController} from"../../controllers/authController/index.ts"
export const  AuthRouter = express.Router();
AuthRouter.post("/sign-in", authController.SignIn)
AuthRouter.post("/sign-up",authController.SignUp)