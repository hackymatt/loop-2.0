import * as k8s from "@kubernetes/client-node";

import { RABBITMQ_HOST, RABBITMQ_PORT } from "./const";
import { getSandboxName, getSandboxImage } from "./sandbox";

import type { Technology, SandboxName } from "./sandbox";

// Kubernetes client setup
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const NAMESPACE = "sandbox";

function getPodName(userId: string, sandboxName: SandboxName): string {
  return `${sandboxName}-${userId}`;
}

async function isPodRunningAndReady(podName: string): Promise<boolean> {
  try {
    const res = await k8sApi.readNamespacedPod(podName, NAMESPACE);
    /* istanbul ignore next */
    const status = res.body?.status ?? { phase: "", containerStatuses: [] };

    if (status.phase !== "Running") return false;
    /* istanbul ignore next */
    return (status.containerStatuses || []).every((c) => c.ready);
  } catch {
    return false;
  }
}

// Function to check if the pod exist
async function isPodExists(podName: string): Promise<boolean> {
  try {
    await k8sApi.readNamespacedPod(podName, NAMESPACE);
    return true;
  } catch (err: any) {
    /* istanbul ignore next */
    return err.response?.statusCode !== 404;
  }
}

// Delete pod by name
async function deletePod(podName: string) {
  console.log(`Deleting pod ${podName}...`);

  try {
    await k8sApi.deleteNamespacedPod(podName, NAMESPACE);
  } catch (err) {
    console.error(`Failed to delete pod ${podName}:`, err);
    throw err;
  }
}

// Wait until pod is gone
async function waitForPodDeletion(podName: string, timeoutMs: number) {
  const interval = 2000;
  const maxTries = Math.ceil(timeoutMs / interval);
  for (let i = 0; i < maxTries; i++) {
    const exists = await isPodExists(podName);
    if (!exists) return;
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error(`Timeout waiting for pod ${podName} to be deleted`);
}

// Create pod
async function createPod(userId: string, technology: Technology) {
  const sandboxName = getSandboxName(technology);
  const sandboxImage = getSandboxImage(technology);
  const podName = getPodName(userId, sandboxName);

  const podSpec = {
    apiVersion: "v1",
    kind: "Pod",
    metadata: { name: podName },
    spec: {
      containers: [
        {
          name: sandboxName,
          image: sandboxImage,
          env: [
            { name: "USER_ID", value: userId },
            { name: "RABBITMQ_HOST", value: `${RABBITMQ_HOST}.default` },
            { name: "RABBITMQ_PORT", value: RABBITMQ_PORT },
          ],
          envFrom: [{ secretRef: { name: "rabbitmq-secrets" } }],
          volumeMounts: [{ name: "code-volume", mountPath: "/app/jobs" }],
        },
      ],
      restartPolicy: "Never",
      volumes: [{ name: "code-volume", emptyDir: {} }],
    },
  };

  console.log(`Creating pod ${podName}...`);
  await k8sApi.createNamespacedPod(NAMESPACE, podSpec);
}

// Wait for pod to be running and ready
async function waitForPodToBeReady(podName: string, timeoutMs: number) {
  const interval = 2000;
  const maxTries = Math.ceil(timeoutMs / interval);

  for (let i = 0; i < maxTries; i++) {
    try {
      const res = await k8sApi.readNamespacedPod(podName, NAMESPACE);
      /* istanbul ignore next */
      const status = res.body?.status ?? { phase: "", containerStatuses: [] };
      const phase = status.phase;
      /* istanbul ignore next */
      const ready = (status.containerStatuses || []).every((cs) => cs.ready);

      if (phase === "Running" && ready) {
        console.log(`Pod ${podName} is running and ready.`);
        return;
      } else {
        console.log(`Pod ${podName} status: ${phase}. Waiting...`);
      }
    } catch (err) {
      console.error(`Error reading pod status:`, err);
    }

    await new Promise((r) => setTimeout(r, interval));
  }

  throw new Error(`Timeout waiting for pod ${podName} to be ready`);
}

// Schedule deletion
async function schedulePodDeletion(podName: string) {
  const oneHourLater = new Date(Date.now() + 60 * 60 * 1000);
  const iso = oneHourLater.toISOString();
  console.log(`Pod ${podName} will be deleted at ${iso}.`);

  setTimeout(async () => {
    try {
      await deletePod(podName);
      console.log(`Pod ${podName} deleted after timeout.`);
    } catch (err) {
      console.error(`Error deleting pod ${podName} on timeout:`, err);
    }
  }, 3600000); // 1 hour
}

// Main function
export async function createUserPod(
  userId: string,
  technology: Technology,
  podReadyTimeoutMs = 60000,
  podDeletionTimeoutMs = 30000
) {
  const sandboxName = getSandboxName(technology);
  const podName = getPodName(userId, sandboxName);

  await schedulePodDeletion(podName);

  const exists = await isPodExists(podName);
  const isReady = exists ? await isPodRunningAndReady(podName) : false;

  if (isReady) {
    console.log(`Pod ${podName} is already running and ready.`);
    return;
  }

  if (exists) {
    console.log(`Pod ${podName} exists but is not ready. Deleting...`);
    try {
      await deletePod(podName);
      await waitForPodDeletion(podName, podDeletionTimeoutMs);
    } catch (error) {
      console.error(`Error deleting user pod: ${error}`);
      throw error;
    }
  }

  try {
    await createPod(userId, technology);
    await waitForPodToBeReady(podName, podReadyTimeoutMs);
    console.log(`Pod for user ${userId} created successfully.`);
  } catch (error) {
    console.error(`Error creating user pod: ${error}`);
    throw error; // Rethrow the error to handle it in the calling function
  }
}
