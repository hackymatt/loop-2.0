import dotenv from "dotenv";

dotenv.config();

export const API_PORT = process.env.API_PORT || 3000;
export const RABBITMQ_HOST = process.env.RABBITMQ_HOST || "localhost";
export const RABBITMQ_PORT = process.env.RABBITMQ_PORT || "5672";
export const RABBITMQ_USER = process.env.RABBITMQ_USER || "user";
export const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD || "password";
export const RABBITMQ_URL = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;

export const TAG = process.env.TAG || "latest";
