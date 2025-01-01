import { model, Schema } from "mongoose";
import { logActionTypes, logType } from "../types/log";
import { userSchema } from "./user";

const logSchema = new Schema<logType>(
  {
    assemblyID: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: logActionTypes,
      required: true,
    },
    user: {
      type: userSchema,
      required: true,
    },
  },
  { collection: "logs", timestamps: { createdAt: true, updatedAt: false } }
);

// Add an index for `createdAt`,
// as the CosmosDB (Azure) wont be able to sort the logs without it.
logSchema.index({ createdAt: -1 });

const Log = model<logType>("Log", logSchema);

export { Log };
