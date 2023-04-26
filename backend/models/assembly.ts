import { Types, model, Schema } from "mongoose";
import { AssemblyType } from "../types/assembly";

const assemblySchema = new Schema<AssemblyType>(
  {
    _id: {
      type: String,
      required: true,
    },
    votes: {
      type: [Types.ObjectId],
      required: false,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    currentVotation: {
      type: Types.ObjectId,
      required: false,
    },
    participants: {
      type: [Number],
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
