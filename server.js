const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();
const PORT = 8000;

const app = express();
app.use(cors()); // Use cors() instead of cors
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY);

app.post("/gemini", async (req, res) => {
  console.log("history", req.body.history);
  console.log("message", req.body.message);

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const chat = model.startChat({
    history: req.body.history,
  });
  const msg = req.body.message;
  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();
  console.log("response", text);
  res.send(text);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
