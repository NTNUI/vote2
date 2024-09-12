import { Router } from "express";
import { getGroups } from "../controllers/group";

const groupRoutes = Router();

groupRoutes.post("/", getGroups);

export default groupRoutes;
