export type UserType = {
  _id: number;
  first_name: string;
  last_name: string;
  groups: GroupType[];
};

export type GroupType = {
  groupName: string;
  groupSlug: string;
  organizer: boolean;
};

export type UserDataGroupType = {
  groupName: string;
  groupSlug: string;
  organizer: boolean;
  hasActiveAssembly: boolean;
  hasAssembly: boolean;
  createdBy: string | null;
};

export type UserDataResponseType = {
  firstName: string;
  lastName: string;
  groups: UserDataGroupType[];
  isOrganizer: boolean;
};
