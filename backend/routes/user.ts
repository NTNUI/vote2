import { Router } from "express";
import { getUserData } from "../controllers/user";
import authorization from "../utils/authorizationMiddleware";

const userRoutes = Router();

userRoutes.get("/userData", authorization, getUserData);

export default userRoutes;
