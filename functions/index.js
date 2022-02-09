const functions = require("firebase-functions");
const line = require("@line/bot-sdk");
const express = require("express");
const { google } = require("googleapis");
const PORT = process.env.PORT || 3000;
const app = express();
require("dotenv").config();

const customSearch = google.customsearch("v1");

async function googleSearch(keyword) {
  const res = await customSearch.cse.siterestrict.list({
    auth: functions.config().convenientapp.google_api,
    cx: functions.config().convenientapp.google_search_id,
    q: keyword,
  });
  return res.data;
}

const test = async () => {
  const res = await googleSearch("ジョジョ");
  console.log(res);
};

app.get("/", async (req, res) => {
  res.send({ message: await googleSearch("ジョジョ") });
});

const config = {
  channelAccessToken: functions.config().convenientapp.line_access_token,
  channelSecret: functions.config().convenientapp.line_channel_secret,
};

app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

const client = new line.Client(config);
function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  if (event.message.text === "Google検索") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "検索したい事を入力してください",
    });
  }
  if (event.message.text === "店舗を探す") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: String(event),
    });
  }
  if (event.message.text === "乗り換え案内") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "Frexテキストで返す",
    });
  }
}

exports.app = functions.https.onRequest(app);
