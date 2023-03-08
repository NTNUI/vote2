import { Router } from "express";
import {
  createVotation,
  setVotationStatus,
  removeVotationStatus,
  deleteVotation,
  editVotation,
  getVotation,
} from "../controllers/votation";
import authorization from "../utils/authorizationMiddleware";

const votationRoutes = Router();

votationRoutes.post("/", authorization, getVotation);

votationRoutes.post("/create", authorization, createVotation);

votationRoutes.put("/activation", authorization, setVotationStatus);

votationRoutes.put("/deactivation", authorization, removeVotationStatus);

votationRoutes.delete("/", authorization, deleteVotation);

votationRoutes.put("/", authorization, editVotation);

export default votationRoutes;
