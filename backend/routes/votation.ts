import { Router } from "express";
import {
  createVotation,
  setVotationStatus, 
  deleteVotation,
  editVotation
} from "../controllers/votation";
import authorization from "../utils/authorizationMiddleware";

const votationRoutes = Router();

votationRoutes.post("/create", authorization, createVotation);

votationRoutes.put("/activation", authorization, setVotationStatus);

votationRoutes.delete("/", authorization, deleteVotation);

votationRoutes.post("/", authorization, editVotation);

export default votationRoutes;