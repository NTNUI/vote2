import { model, Schema } from "mongoose";
import { OptionType, VoteType } from "../types/vote";

const optionSchema = new Schema<OptionType>({
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
  { collection: "assembly" }
);

const Votation = model<VoteType>("Votation", votationSchema);

export { Votation };
