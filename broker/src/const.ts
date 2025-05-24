import dotenv from "dotenv";

dotenv.config();

export const IS_LOCAL = (process.env.LOCAL || "True") === "True";
export const NETWORK = process.env.NETWORK || "default";

export const API_PORT = Number(process.env.API_PORT || "4000");
export const RABBITMQ_HOST = process.env.RABBITMQ_HOST || "localhost";
export const RABBITMQ_PORT = process.env.RABBITMQ_PORT || "5672";
export const RABBITMQ_USER = process.env.RABBITMQ_USER || "user";
export const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD || "password";
export const RABBITMQ_URL = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;

export const TAG = process.env.TAG || "latest";

export const WS_PORT = Number(process.env.WS_PORT || "8080");
export const JWT_SECRET =
  process.env.JWT_SECRET?.replace(/^"(.*)"$/, "$1") ||
  "lmzpsXgy4NGIUuO9MbkM9lS0dJkSSMehjyKS529EACLg8AT6C5U42T9hl5s19ZLbUw7HZwSVVRPKWqbxvboTOQ==";
