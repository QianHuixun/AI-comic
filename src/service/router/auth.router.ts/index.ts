import  express from 'express'
import  {authController} from"../../controllers/authController"

export const  useAuthRouter = express.Router();

useAuthRouter.post("/sign-in", authController.SignIn)