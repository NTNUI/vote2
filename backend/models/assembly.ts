import { model, Schema } from "mongoose";
import { AssemblyType } from "../types/assembly";
import { votationSchema } from "./vote";

const assemblySchema = new Schema<AssemblyType>(
  {
    _id: {
      type: String,
      required: true,
    },
    votes: {
      type: [votationSchema],
      required: false,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    currentVotation: {
      type: votationSchema,
      required: false,
    },
    participants: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: Number,
      required: true,
    },
  },
  { collection: "assembly", _id: false }
);

const Assembly = model<AssemblyType>("Assembly", assemblySchema);

export { Assembly };
