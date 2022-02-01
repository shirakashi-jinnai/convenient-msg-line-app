require("dotenv").config();
const express = require("express");
const https = require("https");
const bodyparser = require("body-parser");
const line = require("@line/bot-sdk");
const res = require("express/lib/response");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    req.json(result)
  );
});

const client = new line.Client(config);

const handleEvent = (event) => {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: "text",
    text: event.message.text,
  });
};

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
