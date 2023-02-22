import express, { Application } from "express";
import authRoutes from "./routes/auth";
import mongoConnect from "./utils/db";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser = require("cookie-parser");
import userRoutes from "./routes/user";
import assemblyRoutes from "./routes/assembly";
import qrRoutes from "./routes/qr";

dotenv.config();

const app: Application = express();
app.use(
  cors({
    origin: "http://10.22.148.163:5173",
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
app.use("/assembly", assemblyRoutes);
app.use("/qr", qrRoutes);

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
