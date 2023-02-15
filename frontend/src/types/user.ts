export type UserType = {
  _id: number;
  first_name: string;
  last_name: string;
  groups: GroupType[];
};

export type GroupType = {
  groupName: string;
  role: string;
};

export type UserDataGroupType = {
  groupName: string;
  role: string;
  hasActiveAssembly: boolean;
};

export type UserDataResponseType = {
  data: {
    firstName: string;
    lastName: string;
    groups: UserDataGroupType[];
    isOrganizer: boolean;
  };
};
