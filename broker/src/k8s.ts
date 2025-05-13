import * as k8s from "@kubernetes/client-node";

import { getRunnerName, getRunnerImage } from "./runner";

import type { RunnerName, Technology } from "./runner";

// Kubernetes client setup
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const NAMESPACE = "default";

function getPodName(userId: string, runnerName: RunnerName): string {
  return `${runnerName}-${userId}`;
}

// Function to check if the pod exists for a user
async function isPodExists(userId: string, technology: Technology): Promise<boolean> {
  const runnerName = getRunnerName(technology);
  const podName = getPodName(userId, runnerName);
  try {
    console.log(`Checking if pod ${podName} exists...`);
    const res = await k8sApi.readNamespacedPod(podName, NAMESPACE);
    return res.body.metadata?.name === podName;
  } catch (error) {
    console.error(`Error checking pod ${podName}: ${error}`);
    return false;
  }
}

// Function to delete a new pod for the user
async function deletePod(userId: string, technology: Technology) {
  const runnerName = getRunnerName(technology);
  const podName = getPodName(userId, runnerName);

  try {
    console.log(`Deleting pod ${podName}...`);
    await k8sApi.deleteNamespacedPod(podName, NAMESPACE);
    console.log(`Pod ${podName} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting pod ${podName}:`, error);
    throw error;
  }
}

// Function to create a new pod for the user
async function createPod(userId: string, technology: Technology) {
  const runnerName = getRunnerName(technology);
  const runnerImage = getRunnerImage(technology);
  const podName = getPodName(userId, runnerName);

  const podSpec = {
    apiVersion: "v1",
    kind: "Pod",
    metadata: { name: podName },
    spec: {
      containers: [
        {
          name: runnerName,
          image: runnerImage,
          env: [
            {
              name: "USER_ID",
              value: userId,
            },
          ],
          envFrom: [
            {
              secretRef: {
                name: "secrets",
              },
            },
          ],
          volumeMounts: [
            {
              name: "code-volume",
              mountPath: "/app/jobs",
            },
          ],
        },
      ],
      restartPolicy: "Never",
      volumes: [
        {
          name: "code-volume",
          emptyDir: {},
        },
      ],
    },
  };
  try {
    console.log(`Creating pod ${podName}...`);
    await k8sApi.createNamespacedPod(NAMESPACE, podSpec);
  } catch (error) {
    console.error(`Error creating pod ${podName}:`);
    throw error;
  }
}

// Function to wait for the pod to reach the Running state
async function waitForPodToBeRunning(userId: string, technology: Technology) {
  const runnerName = getRunnerName(technology);
  const podName = getPodName(userId, runnerName);

  let isRunning = false;
  const timeout = Date.now() + 1 * 60 * 1000; // Wait for up to 1 minute

  // Poll the pod status until it is running or timeout is reached
  while (!isRunning && Date.now() < timeout) {
    try {
      const res = await k8sApi.readNamespacedPod(podName, NAMESPACE);
      const podStatus = res.body.status?.phase;

      if (podStatus === "Running") {
        isRunning = true;
        console.log(`Pod ${podName} is now running.`);
      } else {
        console.log(`Pod ${podName} status: ${podStatus}. Waiting...`);
      }
    } catch (error) {
      console.error(`Error checking pod status: ${error}`);
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000)); // Poll every 2 seconds
  }

  if (!isRunning) {
    throw new Error(`Pod ${podName} did not reach Running state within the timeout period.`);
  }
}

async function schedulePodDeletion(userId: string, technology: Technology) {
  const runnerName = getRunnerName(technology);
  const podName = getPodName(userId, runnerName);

  console.log(`Pod ${podName} will be deleted after 1 hour.`);
  setTimeout(async () => {
    try {
      await deletePod(userId, technology);
      console.log(`Pod ${podName} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting pod ${podName}: ${error}`);
    }
  }, 3.6e6); // 1 hour
}

export async function createUserPod(userId: string, technology: Technology) {
  await schedulePodDeletion(userId, technology);
  const podExists = await isPodExists(userId, technology);
  if (podExists) {
    console.log(`Pod for user ${userId} already exists.`);
    return;
  }

  try {
    await createPod(userId, technology);
    await waitForPodToBeRunning(userId, technology);
    console.log(`Pod for user ${userId} created successfully.`);
  } catch (error) {
    console.error(`Error creating user pod: ${error}`);
    throw error; // Rethrow the error to handle it in the calling function
  }
}
