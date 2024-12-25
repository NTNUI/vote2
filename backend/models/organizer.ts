import { Schema, model } from "mongoose";
import { OrganizerType } from "../types/organizer";

const organizerSchema = new Schema<OrganizerType>(
  {
    ntnui_no: {
      type: Number,
      required: true,
    },
    assembly_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { collection: "organizer", _id: true }
);

const Organizer = model<OrganizerType>("Organizer", organizerSchema);

export { Organizer };
