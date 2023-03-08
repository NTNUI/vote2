import { Router } from "express";
import {
  createVotation,
  activateVotationStatus,
  deactivateVotationStatus,
  deleteVotation,
  editVotation,
  getVotations,
} from "../controllers/votation";
import authorization from "../utils/authorizationMiddleware";

const votationRoutes = Router();

votationRoutes.post("/", authorization, getVotations);

votationRoutes.post("/create", authorization, createVotation);

votationRoutes.put("/activate", authorization, activateVotationStatus);

votationRoutes.put("/deactivate", authorization, deactivateVotationStatus);

votationRoutes.delete("/", authorization, deleteVotation);

votationRoutes.put("/", authorization, editVotation);

export default votationRoutes;
