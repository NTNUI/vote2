import { model, Schema } from "mongoose";
import { GroupType, UserType } from "../types/user";

export const groupSchema = new Schema<GroupType>(
  {
    groupName: {
      type: String,
      required: true,
    },
    groupSlug: {
      type: String,
      required: true,
    },
    organizer: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false }
);

const userSchema = new Schema<UserType>(
  {
    _id: {
      type: Number,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    groups: {
      type: [groupSchema],
      required: false,
    },
  },
  { collection: "users", _id: false }
);

const User = model<UserType>("User", userSchema);

export { User };
