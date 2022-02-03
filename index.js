const line = require("@line/bot-sdk");
const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();

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
      text: "google検索の処理が走る",
    });
  }
  if (event.message.text === "店舗を探す") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "目当ての店舗を位置情報で返す",
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
