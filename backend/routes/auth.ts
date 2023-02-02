import { Router } from "express";
import { login, logout } from "../controllers/auth";

<<<<<<< HEAD
const authRoutes = express.Router();
=======
const authRoutes = Router();
>>>>>>> main

// Login route
// Return access and refresh tokens
authRoutes.get("/login", login);

<<<<<<< HEAD
=======
authRoutes.get("/logout", logout);

>>>>>>> main
export default authRoutes;
