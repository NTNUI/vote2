import React from "react";

export interface checkedInType {
  checkedIn: boolean;
  group: string;
  groupName: string;
  setCheckedIn: (state: boolean) => void;
  setGroup: (sate: string) => void;
  setGroupName: (state: string) => void;
}
export const checkedInState = React.createContext<checkedInType | null>(null);
