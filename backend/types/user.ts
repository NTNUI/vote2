export type UserType = {
  _id: number;
  first_name: string;
  last_name: string;
  committees: GroupType[];
};

export type GroupType = {
  groupName: string;
  roleInGroup: string;
};
