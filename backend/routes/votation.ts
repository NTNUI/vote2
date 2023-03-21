import { Router } from "express";
import {
  createVotation,
  activateVotationStatus,
  deactivateVotationStatus,
  deleteVotation,
  editVotation,
  getAllVotations,
  getCurrentVotation,
  submitVotation,
} from "../controllers/votation";
import authorization from "../utils/authorizationMiddleware";

const votationRoutes = Router();

votationRoutes.post("/allvotations", authorization, getAllVotations);

votationRoutes.post("/currentvotation", authorization, getCurrentVotation);

votationRoutes.post("/create", authorization, createVotation);

votationRoutes.put("/activate", authorization, activateVotationStatus);

votationRoutes.put("/deactivate", authorization, deactivateVotationStatus);

votationRoutes.delete("/", authorization, deleteVotation);

votationRoutes.put("/", authorization, editVotation);

votationRoutes.put("/submit", authorization, submitVotation);

export default votationRoutes;
