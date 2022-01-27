require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const line = require("@line/bot-sdk");
const res = require("express/lib/response");
const app = express();
const port = process.env.PORT || "3000";

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    req.json(result)
  );
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
