import { cookies } from "next/headers";

import { defaultUser, USER_STORAGE_KEY } from "./user-config";

import type { UserState } from "./types";

// ----------------------------------------------------------------------

export async function detectUser(storageKey: string = USER_STORAGE_KEY): Promise<UserState> {
  const cookieStore = cookies();

  const userStore = cookieStore.get(storageKey);
  const accessToken = cookies().get("access_token");

  return userStore
    ? { ...JSON.parse(userStore?.value), isLoggedIn: !!accessToken?.value }
    : defaultUser;
}
