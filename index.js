const line = require("@line/bot-sdk");
const express = require("express");
const { google, searchconsole_v1 } = require("googleapis");
const PORT = process.env.PORT || 3000;
const app = express();
require("dotenv").config();

const customSearch = google.customsearch("v1");

async function googleSearch(keyword) {
  const res = await customSearch.cse.siterestrict.list({
    auth: "AIzaSyB8PBDS-Az1oCiRIvnbdojPnzpoM2ZSz7M",
    cx: "63412fd1c3dbedc60",
    q: keyword,
  });
  return res.data;
}

const test = async () => {
  const res = await googleSearch("ジョジョ");
  console.log(res);
};

test();
const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

app.get("/", (req, res) => {
  res.send({ message: "success" });
});

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
      text: "検索したい事を入力してくだちい",
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

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
