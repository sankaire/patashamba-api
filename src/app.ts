import express, { Request, Response } from "express";
import cors from "cors";
import db from "./config/db.js";
import { config } from "dotenv";
import api from "./routes/index.js";
config();

export const app = express();
const connectDB = await db(process.env.DB_URI as string);
if (!connectDB.success) {
  console.log(connectDB.message);
  process.exit(1);
}
console.log(connectDB.message);
app.use(cors());
app.use(express.json());

app.use("/api/v1", api);
app.get("/api", (req: Request, res: Response) => {
  return res.status(200).json({ message: "🚀🍧✅" });
});
