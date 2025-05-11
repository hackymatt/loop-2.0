import express, { Request, Response } from "express";
import { publish } from "./message-queue/publisher";

const router = express.Router();

router.post("/test", async (req: Request, res: Response) => {
  try {
    const { userId, technology, files, command } = req.body;

    if (!userId || !technology || !files || !command) {
      return res
        .status(400)
        .json({ error: "Missing required fields: userId, files, or command" });
    }

    // Handle the job execution logic with Python runner
    const jobResult = await publish(
      userId,
      technology,
      command,
      files,
      false,
      true
    );

    const isError = "error" in jobResult;

    res.status(isError ? 400 : 200).json(jobResult); // Send back the job result
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
