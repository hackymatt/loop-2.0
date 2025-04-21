import { JOIN_TYPE, USER_TYPE } from "src/consts/user";

import type { UserState } from "./types";

// ----------------------------------------------------------------------

export const USER_STORAGE_KEY: string = "user";

export const defaultUser: UserState = {
  email: null,
  firstName: null,
  lastName: null,
  avatarUrl: null,
  userType: USER_TYPE.STUDENT,
  joinType: JOIN_TYPE.EMAIL,
  isActive: false,
  isLoggedIn: false,
  plan: null,
  redirect: null,
};
