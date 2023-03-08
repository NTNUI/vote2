import express, { Application } from "express";
import authRoutes from "./routes/auth";
import mongoConnect from "./utils/db";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser = require("cookie-parser");
import userRoutes from "./routes/user";
import assemblyRoutes from "./routes/assembly";
import qrRoutes from "./routes/qr";
import expressWs from "express-ws";
import WebSocket from "ws";
import jsonwebtoken from "jsonwebtoken";
import votationRoutes from "./routes/votation";

dotenv.config();

const appBase: Application = express();
appBase.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const wsInstance = expressWs(appBase);
export const allSockets = wsInstance.getWss();
const { app } = wsInstance;
const port = process.env.BACKEND_PORT;

mongoConnect();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// App routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/assembly", assemblyRoutes);
app.use("/qr", qrRoutes);
app.use("/votation", votationRoutes);

export const connections: WebSocket[] = [];
app.ws("/status", (ws, req) => {
  const decoded = jsonwebtoken.decode(req.cookies.accessToken);
  if (decoded && typeof decoded !== "string") {
    connections[decoded.ntnui_no] = ws;
  }
});

try {
  app.listen(port, (): void => {
    console.log(`Server is running on port ${port}`);
  });
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
  }
  console.error("Something went very wrong (is your .env correct?)");
}

export default app;
