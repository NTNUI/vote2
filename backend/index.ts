import express, { Application } from "express";
import { createServer } from "http";
import authRoutes from "./routes/auth";
import mongoConnect from "./utils/db";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser = require("cookie-parser");
import userRoutes from "./routes/user";
import assemblyRoutes from "./routes/assembly";
import qrRoutes from "./routes/qr";
import WebSocket from "ws";
import votationRoutes from "./routes/votation";
import { parse } from "url";
import { lobbyWss } from "./wsServers/lobby";
import { organizerWss } from "./wsServers/organizer";
import groupRoutes from "./routes/groups";
import { swaggerOptions } from "./utils/swagger";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import logRoutes from "./routes/log";

dotenv.config();

const app: Application = express();
const server = createServer(app);
const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173/",
      "https://dev.vote.ntnui.no",
      "https://vote.ntnui.no",
    ],
    credentials: true,
  })
);

const port = process.env.BACKEND_PORT;

mongoConnect();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/assembly", assemblyRoutes);
app.use("/qr", qrRoutes);
app.use("/votation", votationRoutes);
app.use("/groups", groupRoutes);
app.use("/logs", logRoutes);

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// WebSocket routes
server.on("upgrade", function upgrade(request, socket, head) {
  const { pathname } = parse(request.url || "");

  if (pathname === "/lobby") {
    lobbyWss.handleUpgrade(request, socket, head, function done(ws: WebSocket) {
      lobbyWss.emit("connection", ws, request);
    });
  } else if (pathname === "/organizer") {
    lobbyWss.handleUpgrade(request, socket, head, function done(ws: WebSocket) {
      organizerWss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

try {
  // Jest will start app itself when testing, and not run on port 3000 to avoid collisions.
  if (process.env.NODE_ENV !== "test") {
    server.listen(port, (): void => {
      console.log(
        `Server is running at \u001b]8;;http://localhost:${port}\u001b\\http://localhost:${port}\u001b]8;;\u001b\\`
      );
    });
  }
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
  }
  console.error("Something went very wrong (is your .env correct?)");
}

export default server;
