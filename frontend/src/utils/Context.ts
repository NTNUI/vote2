import React from "react";

export interface checkedInType {
  checkedIn: boolean;
  group: string;
  setCheckedIn: (state: boolean) => void;
  setGroup: (sate: string) => void;
}
export const checkedInState = React.createContext<checkedInType | null>(null);
