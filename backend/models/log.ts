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
  { collection: "logs" }
);

const Log = model<logType>("Log", logSchema);

export { Log };
