import type { Request, Response } from "express";

import express from "express";
import { v4 as uuid } from "uuid";

import { publish } from "./message-queue/publisher";
import { createUserSandbox } from "./sandbox/utils";

const router = express.Router();

router.post("/test", async (req: Request, res: Response) => {
  try {
    const { user_id: userId, technology, files, timeout, command } = req.body;

    if (!userId || !technology || !files || !timeout || !command) {
      res
        .status(400)
        .json({ error: "Missing required fields: user_id, files, timeout or command" });
      return;
    }

    await createUserSandbox(userId, technology);
    const jobId = uuid();
    const jobResult = await publish(
      userId,
      jobId,
      technology,
      timeout,
      command,
      files,
      false,
      true
    );

    const isError = "error" in jobResult;

    res.status(isError ? 400 : 200).json(jobResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
