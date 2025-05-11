// src/k8s.ts
import * as k8s from "@kubernetes/client-node";
import { getRunnerName, RunnerName, Technology } from "./runner";

// Kubernetes client setup
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const batchV1Api = kc.makeApiClient(k8s.BatchV1Api);

const NAMESPACE = "default";

function getPodName(userId: string, runnerName: RunnerName): string {
  return `${runnerName}-${userId}`;
}

// Function to check if the pod exists for a user
export async function isPodExists(
  userId: string,
  technology: Technology
): Promise<boolean> {
  const runnerName = getRunnerName(technology);
  const podName = getPodName(userId, runnerName);
  try {
    const res = await k8sApi.readNamespacedPod(podName, NAMESPACE);
    return res.body.metadata?.name === podName;
  } catch (err) {
    return false; // If not found, return false
  }
}

// Function to create a new pod for the user
export async function createPod(userId: string, technology: Technology) {
  const runnerName = getRunnerName(technology);
  const runnerImage = getRunnerName(technology);
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

  await k8sApi.createNamespacedPod(NAMESPACE, podSpec);
}
