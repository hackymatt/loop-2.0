import { USER_TYPE } from "src/consts/user";

import type { UserState } from "./types";

// ----------------------------------------------------------------------

export const USER_STORAGE_KEY: string = "user";

export const defaultUser: UserState = {
  email: "",
  userType: USER_TYPE.STUDENT,
  isRegistered: false,
  isActive: false,
  isLoggedIn: false,
};
