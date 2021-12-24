import { Router, Response } from "express"
import AuthRouter from "./api/auth.js";
import UserAccRouter from "./api/userAcc.js";

const ApiRouter = Router();

ApiRouter.use("/auth", AuthRouter)
ApiRouter.use("/user", UserAccRouter)

export default ApiRouter;