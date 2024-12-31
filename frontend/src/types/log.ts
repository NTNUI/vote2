import { UserType } from "./user";

export type LogType = {
  _id: string;
  assemblyID: string;
  action: string;
  user: UserType;
  createdAt: string;
  __v: number;
};
