import express from "express";
import cors from "cors";
import { generate } from "./chatbot.js";

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

app.post("/chat", async (req, res) => {
  const { message, threadId } = req.body;

  if (!message || !threadId) {
    return res.status(400).json({ error: "Message and threadId are required" });
  }

  const result = await generate(message, threadId);
  res.json({ msg: result });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
