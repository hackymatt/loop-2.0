import express from "express";
import bodyParser from "body-parser";
import apiRouter from "./api";
import { consumeResults } from "./message-queue/consumer";
import { API_PORT } from "./const";

// Initialize the Express app
const app = express();

// Middleware to parse JSON body
app.use(bodyParser.json());

// Add the routes
app.use("/api", apiRouter);

// Start the server
app.listen(API_PORT, () => {
  console.log(`Broker service listening on port ${API_PORT}`);
});

consumeResults();
