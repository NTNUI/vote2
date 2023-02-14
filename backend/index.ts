import express, { Application } from "express";
import authRoutes from "./routes/auth";
import mongoConnect from "./utils/db";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser = require("cookie-parser");
import userRoutes from "./routes/user";

dotenv.config();

const app: Application = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const port = process.env.BACKEND_PORT;

mongoConnect();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// App routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

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
