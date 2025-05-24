import { promisify } from "util";
import { exec } from "child_process";

import { getSandboxImage } from "../sandbox";
import { NETWORK, RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_USER, RABBITMQ_PASSWORD } from "../const";

import type { Technology } from "../sandbox";

const execAsync = promisify(exec);

async function waitForContainerReady(containerName: string, timeoutMs = 30000) {
  const interval = 2000;
  const maxTries = Math.ceil(timeoutMs / interval);

  for (let i = 0; i < maxTries; i++) {
    const { stdout } = await execAsync(`docker inspect -f '{{.State.Running}}' ${containerName}`);

    if (stdout.trim() === "true") {
      console.log(`Container ${containerName} is running.`);
      return;
    }

    console.log(`Waiting for container ${containerName}...`);
    await new Promise((r) => setTimeout(r, interval));
  }

  throw new Error(`Timeout: Container ${containerName} not running`);
}

export async function createLocalContainer(userId: string, technology: Technology) {
  const image = getSandboxImage(technology);
  const containerName = `sandbox-${technology}-${userId}`;

  const { stdout: existing } = await execAsync(
    `docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`
  );
  if (existing.includes(containerName)) {
    console.log(`Container ${containerName} already exists. Removing...`);
    await execAsync(`docker rm -f ${containerName}`);
  }

  console.log(`Creating local container: ${containerName}`);
  const runCommand = [
    `docker run -d`,
    `--name ${containerName}`,
    `--network ${NETWORK}`,
    `-e USER_ID=${userId}`,
    `-e RABBITMQ_HOST=${RABBITMQ_HOST}`,
    `-e RABBITMQ_PORT=${RABBITMQ_PORT}`,
    `-e RABBITMQ_USER=${RABBITMQ_USER}`,
    `-e RABBITMQ_PASSWORD=${RABBITMQ_PASSWORD}`,
    `${image}`,
  ].join(" ");

  try {
    const { stdout } = await execAsync(runCommand);
    console.log(`Container started: ${stdout.trim()}`);
    await waitForContainerReady(containerName);
  } catch (err) {
    console.error("Failed to start container:", err);
    throw err;
  }
}
