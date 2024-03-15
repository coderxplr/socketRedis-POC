const io = require("socket.io");
const redisAdapter = require("socket.io-redis");
const Redis = require("ioredis");

function createServer(port) {
  const server = io(port);

  console.log(`Client connected to Server on http://localhost:${port}`);

  const redisClient = new Redis({
    host: "localhost",
    port: 6379,
  });

  server.adapter(
    redisAdapter({ pubClient: redisClient, subClient: redisClient.duplicate() })
  );

  server.on("connection", (socket) => {
    console.log(`user with id: ${socket.id} is connected!`);

    socket.on("chat message", (msg) => {
      console.log(`message from Server on port ${port}: ` + msg);
      server.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected from Server on port ${port}`);
    });
  });

  return server;
}

createServer(4001);
createServer(4002);
createServer(4003);
