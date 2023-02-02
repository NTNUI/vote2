import express, { Request, Response } from "express";
import login from "../controllers/auth";

const authRoutes = express.Router();

// Login route
// Return access and refresh tokens
authRoutes.get("/", login);

export default authRoutes;
