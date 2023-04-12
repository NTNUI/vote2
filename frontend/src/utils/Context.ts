import React from "react";

export interface checkedInType {
  checkedIn: boolean;
  groupSlug: string;
  groupName: string;
  setCheckedIn: (state: boolean) => void;
  setGroupSlug: (sate: string) => void;
  setGroupName: (state: string) => void;
}
export const checkedInState = React.createContext<checkedInType | null>(null);
