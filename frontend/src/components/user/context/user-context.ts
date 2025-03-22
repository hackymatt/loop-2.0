"use client";

import { createContext } from "react";

import type { UserContextValue } from "../types";

// ----------------------------------------------------------------------

export const UserContext = createContext<UserContextValue | undefined>(undefined);
