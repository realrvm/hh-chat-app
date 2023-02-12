import { FastifyInstance } from "fastify";
import { StreamChat } from "stream-chat";

type User = {
  id: string;
  name: string;
  image?: string;
};

const stream = StreamChat.getInstance(
  process.env.STREAM_CHAT_API_KEY!,
  process.env.STREAM_CHAT_API_SECRET_KEY!
);

const TOKEN = new Map<string, string>();

export async function routes(fastify: FastifyInstance) {
  fastify.get("/", async (request, reply) => {
    reply.send({ reply: "fastify" });
  });

  fastify.post<{ Body: User }>("/signup", async (request, reply) => {
    const { id, name, image } = request.body;
    if (!id || !name) return reply.status(400).send("Missing required fields");

    const existingUsers = await stream.queryUsers({ id });
    if (existingUsers.users.length > 0)
      return reply.status(400).send("User already exists");

    await stream.upsertUser({ id, name, image });
  });

  fastify.post<{ Body: Pick<User, "id"> }>("/login", async (request, reply) => {
    const { id } = request.body;
    if (!id) return reply.status(400).send("Missing required field");

    const {
      users: [user],
    } = await stream.queryUsers({ id });

    if (!user) return reply.status(401).send("User not found");
    const { id: userId, name, image } = user;

    const token = await stream.createToken(id);
    TOKEN.set(token, userId);

    return { token, user: { id: userId, name, image } };
  });

  fastify.post<{ Body: { token: string } }>(
    "/logout",
    async (request, reply) => {
      const token = request.body.token;
      if (!token) return reply.status(400).send("Missing required field");

      const id = TOKEN.get(token);
      if (!id) return reply.status(400).send("Invalid token");

      await stream.revokeUserToken(id, new Date());
      TOKEN.delete(token);
    }
  );
}
