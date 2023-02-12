import { config } from "dotenv";
config();

import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";
import { routes } from "./routes";
import path from "node:path";

const fastify = Fastify({
  logger: true,
});

const PORT = Number(process.env.PORT!) || 3001;

fastify.register(cors, { origin: process.env.CORS_ORIGIN! });
fastify.register(routes);
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "../client/dist"),
});

const start = async () => {
  try {
    await fastify.listen({ port: PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
