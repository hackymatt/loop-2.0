import type { Request, Response } from "express";

import express from "express";

import { createUserPod } from "./k8s";
import { publish } from "./message-queue/publisher";

const router = express.Router();

router.post("/test", async (req: Request, res: Response) => {
  try {
    const { userId, technology, files, timeout, command } = req.body;

    if (!userId || !technology || !files || !timeout || !command) {
      res.status(400).json({ error: "Missing required fields: userId, files, timeout or command" });
      return;
    }

    await createUserPod(userId, technology);
    const jobResult = await publish(userId, technology, timeout, command, files, false, true);

    const isError = "error" in jobResult;

    res.status(isError ? 400 : 200).json(jobResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
