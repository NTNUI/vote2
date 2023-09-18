import { UserType } from "./user";

export enum logActionTypes {
  checkin = "Check-in",
  checkout = "Check-out",
}

export interface logType {
  assemblyID: string;
  representsGroup: string;
  action: logActionTypes;
  user: UserType;
}
