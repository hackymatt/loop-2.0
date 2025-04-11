import type { UserType } from "src/types/user";

// ----------------------------------------------------------------------

export type UserState = {
  email: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  isRegistered: boolean;
  isActive: boolean;
  isLoggedIn: boolean;
};

export type UserContextValue = {
  state: UserState;
  setState: (updateValue: Partial<UserState>) => void;
  setField: (name: keyof UserState, updateValue: UserState[keyof UserState]) => void;
};

export type UserProviderProps = {
  cookieUser?: UserState;
  defaultUser: UserState;
  children: React.ReactNode;
  storageKey?: string;
};
