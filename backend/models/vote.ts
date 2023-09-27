import { model, Schema, Types } from "mongoose";
import { OptionType, VoteType } from "../types/vote";

export const optionSchema = new Schema<OptionType>(
  {
    title: {
      type: String,
      required: true,
    },
    voteCount: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { collection: "options", _id: true }
);

export const votationSchema = new Schema<VoteType>(
  {
    title: {
      type: String,
      required: true,
    },
    caseNumber: {
      type: Number,
      required: true,
    },
    voteText: {
      type: String,
      required: false,
    },
    voted: {
      type: [Number],
      required: false,
    },
    options: {
      type: [Types.ObjectId],
      required: false,
    },
    maximumOptions: {
      type: Number,
      required: true,
    },
    isFinished: {
      type: Boolean,
      required: true,
    },
    numberParticipants: {
      type: Number,
      required: false,
    },
  },
  { collection: "votation", _id: true }
);

const Votation = model<VoteType>("Votation", votationSchema);
const Option = model<OptionType>("Option", optionSchema);

export { Votation, Option };
