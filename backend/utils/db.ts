import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let database: mongoose.Connection;
mongoose.set("strictQuery", true);

const uri: string = process.env.DB_URI || "";

const mongoConnect = async () => {
  console.log("Connecting to MongoDb ...");
  try {
    mongoose.connect(uri, {
      dbName:
        process.env.NODE_ENV === "production" ? "production" : "development",
    });
  } catch (e) {
    console.error("ERROR: ", e);
  }

  database = mongoose.connection;

  database.once("open", async () => {
    console.log("Connected to MongoDB 🌱");
  });

  // In case of any error while running
  database.on("error", () => {
    console.error(`Error connecting to database`);
  });
};

export default mongoConnect;
