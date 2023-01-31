import express, { Application, Request, Response } from "express";
import authRoutes from "./routes/auth";
import mongoConnect from "./utils/db";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const port = process.env.BACKEND_PORT;

mongoConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// App routes
app.use("/auth", authRoutes);

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
