import React, { createContext } from "react";

export type checkedInType = {
  checkedIn: boolean;
  group: string;
  setCheckedIn: (state: boolean) => void;
  setGroup: (sate: string) => void;
};
export const checkedInState = React.createContext<checkedInType>({
  checkedIn: false,
  group: "",
  setCheckedIn: () => {},
  setGroup: () => {},
});
