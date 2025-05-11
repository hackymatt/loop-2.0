import dotenv from "dotenv";
dotenv.config();

export const API_PORT = process.env.API_PORT || 3000;
export const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";
