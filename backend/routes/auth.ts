import { Router } from "express";
import { refresh, login, verify } from "../controllers/auth";

const authRoutes = Router();

// Login route
// Return access and refresh tokens
authRoutes.get("/login", login);

authRoutes.get("/logout", login);

authRoutes.get("/refresh", refresh);

authRoutes.get("/verify", verify);

export default authRoutes;
