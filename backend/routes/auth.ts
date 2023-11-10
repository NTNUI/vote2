import { Router } from "express";
import { login, logout, refreshAccessToken } from "../controllers/auth";

const authRoutes = Router();

// Login route
// Return access and refresh tokens
authRoutes.post("/login", login);

authRoutes.get("/logout", logout);

authRoutes.get("/token/refresh", refreshAccessToken);

export default authRoutes;
