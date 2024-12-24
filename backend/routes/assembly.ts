import { Router } from "express";
import {
  createAssembly,
  deleteAssembly,
  getAssemblyByName,
  getNumberOfParticipantsInAssembly,
  isUserInAssembly,
  setAssemblyStatus,
} from "../controllers/assembly";
import authorization from "../utils/authorizationMiddleware";
import {
  addExternalOrganizerToAssembly,
  getExternalOrganizersInAssembly,
  removeExternalOrganizerFromAssembly,
  searchForGroupMember,
} from "../controllers/assemblyOrganizer";

const assemblyRoutes = Router();

assemblyRoutes.post("/create", authorization, createAssembly);

assemblyRoutes.put("/activation", authorization, setAssemblyStatus);

assemblyRoutes.delete("/", authorization, deleteAssembly);

assemblyRoutes.post("/", authorization, getAssemblyByName);

assemblyRoutes.post("/user/includes", authorization, isUserInAssembly);

assemblyRoutes.post(
  "/participants",
  authorization,
  getNumberOfParticipantsInAssembly
);

assemblyRoutes.post("/organizer", authorization, addExternalOrganizerToAssembly);

assemblyRoutes.delete("/organizer", authorization, removeExternalOrganizerFromAssembly);

assemblyRoutes.post("/organizers", authorization, getExternalOrganizersInAssembly);

assemblyRoutes.post("/group/members/search", authorization, searchForGroupMember);

export default assemblyRoutes;
