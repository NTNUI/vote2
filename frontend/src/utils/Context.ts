import React from "react";

export interface checkedInType {
  checkedIn: boolean;
  setCheckedIn: (state: boolean) => void;
}
export const checkedInState = React.createContext<checkedInType | null>(null);
