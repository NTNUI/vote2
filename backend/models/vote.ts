import { Types, model, Schema } from "mongoose";
import { OptionType, VoteType } from "../types/vote";

export const optionSchema = new Schema<OptionType>({
  title: {
    type: String,
    required: true,
  },
  voteCount: {
    type: Number,
    required: true,
  },
});

export const votationSchema = new Schema<VoteType>(
  {
    _id: {
      type: Types.ObjectId,
      required: false,
    },
    title: {
      type: String,
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
      type: [optionSchema],
      required: false,
    },
    isFinished: {
      type: Boolean,
      required: true,
    },
  },
  { collection: "votation", _id: true }
);

const Votation = model<VoteType>("Votation", votationSchema);
const Option = model<OptionType>("Option", optionSchema);

export { Votation, Option };
