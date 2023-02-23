export type UserType = {
  _id: number;
  first_name: string;
  last_name: string;
  groups: GroupType[];
};

export type GroupType = {
  groupName: string;
  organizer: boolean;
};

export type UserDataGroupType = {
  hasAssembly: boolean;
  groupName: string;
  groupSlug: string;
  organizer: boolean;
  hasActiveAssembly: boolean;
  creator: string;
};

export type UserDataResponseType = {
  firstName: string;
  lastName: string;
  groups: UserDataGroupType[];
  isOrganizer: boolean;
};
