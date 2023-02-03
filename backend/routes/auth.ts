import { Router } from "express";
import { login, logout } from "../controllers/auth";

const authRoutes = Router();

// Login route
// Return access and refresh tokens
authRoutes.post("/login", login);

authRoutes.get("/logout", logout);

export default authRoutes;
