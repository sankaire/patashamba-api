import express, { Request, Response } from "express";
import cors from "cors";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", (req: Request, res: Response) => {
  return res.status(200).json({ message: "🚀🍧✅" });
});
