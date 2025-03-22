import type { USER_TYPE } from "src/consts/user";

export type UserType = (typeof USER_TYPE)[keyof typeof USER_TYPE];
