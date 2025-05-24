import { IS_LOCAL } from "../const";
import { createUserPod } from "./kubernetes";
import { createLocalContainer } from "./docker";

import type { Technology } from "../sandbox";

export async function createUserSandbox(userId: string, technology: Technology, timeoutMs = 60000) {
  if (IS_LOCAL) {
    console.log("Creating Docker container");
    return createLocalContainer(userId, technology);
  } else {
    console.log("Creating Kubernetes pod");
    return createUserPod(userId, technology, timeoutMs);
  }
}
