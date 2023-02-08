import { model, Schema } from "mongoose";
import { AssemblyType } from "../types/assembly";
import { voteSchema } from "./vote";

const assemblySchema = new Schema<AssemblyType>(
  {
    _id: {
      type: String,
      required: true,
    },
    votes: {
      type: [voteSchema],
      required: false,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    participants: {
      type: Number,
      required: true,
    },
  },
  { collection: "assembly", _id: false }
);

const Assembly = model<AssemblyType>("Assembly", assemblySchema);

export { Assembly };
