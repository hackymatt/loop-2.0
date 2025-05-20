import type amqp from "amqplib";
import type { JwtPayload } from "jsonwebtoken";

import url from "url";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import WebSocket, { WebSocketServer } from "ws";

import { createUserPod } from "./k8s";
import { getSandboxName } from "./sandbox";
import { WS_PORT, JWT_SECRET } from "./const";
import { publish } from "./message-queue/publisher";

import type { SandboxName } from "./sandbox";

const FINISH_MSG = "finish" as const;

const clients = new Map<WebSocket, string>();

type Key = `${SandboxName}-${string}-${string}`;
function getKey(userId: string, sandboxName: SandboxName, jobId: string): Key {
  return `${sandboxName}-${userId}-${jobId}`;
}

function verifyToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return payload;
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw new Error("TokenExpired");
    } else {
      throw new Error("TokenInvalid");
    }
  }
}

export function sendDataToClient(msg: amqp.ConsumeMessage) {
  const routingKey = msg.fields.routingKey;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, sandboxName, userId] = routingKey.split(".");
  const response = JSON.parse(msg.content.toString());
  const { job_id: jobId, result } = response;

  // Find client(s) with userId
  for (const [client, id] of clients.entries()) {
    const key = getKey(userId, sandboxName as SandboxName, jobId);
    if (id === key && client.readyState === WebSocket.OPEN) {
      if (result === FINISH_MSG) {
        client.close(1000, "Finished");
      }
      client.send(JSON.stringify(result));
    }
  }
}

export function startWebSocketServer() {
  // Create WebSocket server
  const wss = new WebSocketServer({ port: WS_PORT });

  wss.on("connection", (ws: WebSocket, req) => {
    /* istanbul ignore next */
    const parsedUrl = url.parse(req.url || "", true);
    const token = parsedUrl.query.token as string;

    try {
      const payload = verifyToken(token);
      const { user_id: userId } = payload;

      console.log("User connected with ID:", userId);

      ws.on("message", async (message) => {
        try {
          const data = JSON.parse(message.toString());
          const { technology, timeout, command, files } = data;

          const jobId = uuid();
          const sandboxName = getSandboxName(technology);
          const key = getKey(userId, sandboxName, jobId);
          clients.set(ws, key);

          console.log(`Received message from user ${userId}:`, data);

          await createUserPod(userId, technology);
          await publish(userId, jobId, technology, timeout, command, files, true, false);
        } catch (err) {
          console.error("Failed to parse message:", err);
          ws.close(1003, "Invalid message format");
        }
      });

      ws.on("close", () => {
        clients.delete(ws);
      });

      console.log("Connection established, token valid.");
    } catch (err) {
      console.error("Invalid token:", err);
      ws.close(1008, "Invalid token");
    }
  });

  console.log(`WebSocket server running on ws://localhost:${WS_PORT}`);
  return wss;
}
