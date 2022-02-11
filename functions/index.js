const functions = require("firebase-functions");
const { Client } = require("@googlemaps/google-maps-services-js");
const line = require("@line/bot-sdk");
const express = require("express");
const { google } = require("googleapis");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const app = express();

const customSearch = google.customsearch("v1");
const fireStore = admin.firestore();
const googleSearchRef = fireStore.collection("googleSearch");
const googleClient = new Client({});

async function googleSearchResult(keyword) {
  const res = await customSearch.cse.siterestrict.list({
    auth: functions.config().convenientapp.google_api,
    cx: functions.config().convenientapp.google_search_id,
    q: keyword,
  });
  return res.data;
}

const config = {
  channelAccessToken: functions.config().convenientapp.line_access_token,
  channelSecret: functions.config().convenientapp.line_channel_secret,
};

app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

app.get("/", async (req, res) => {
  res.send({ message: result });
});

const test = async () => {
  const result = await googleSearchResult("ジョジョ");
  console.log(JSON.stringify(result));
};
test();

googleClient
  .elevation({
    params: {
      locations: [{ lat: 45, lng: -110 }],
      key: functions.config().convenientapp.google_api,
    },
    timeout: 1000, // milliseconds
  })
  .then((r) => {
    console.log("成功", r.data.results[0].elevation);
  })
  .catch((e) => {
    console.log("エラー", e.response.data);
  });

const object = {
  type: "template",
  altText: "this is a carousel template",
  template: {
    type: "carousel",
    columns: [
      {
        thumbnailImageUrl: "https://example.com/bot/images/item1.jpg",
        imageBackgroundColor: "#FFFFFF",
        title: "this is menu",
        text: "description",
        defaultAction: {
          type: "uri",
          label: "View detail",
          uri: "http://example.com/page/123",
        },
        actions: [
          {
            type: "postback",
            label: "Buy",
            data: "action=buy&itemid=111",
          },
          {
            type: "postback",
            label: "Add to cart",
            data: "action=add&itemid=111",
          },
          {
            type: "uri",
            label: "View detail",
            uri: "http://example.com/page/111",
          },
        ],
      },
      {
        thumbnailImageUrl: "https://example.com/bot/images/item2.jpg",
        imageBackgroundColor: "#000000",
        title: "this is menu",
        text: "description",
        defaultAction: {
          type: "uri",
          label: "View detail",
          uri: "http://example.com/page/222",
        },
        actions: [
          {
            type: "postback",
            label: "Buy",
            data: "action=buy&itemid=222",
          },
          {
            type: "postback",
            label: "Add to cart",
            data: "action=add&itemid=222",
          },
          {
            type: "uri",
            label: "View detail",
            uri: "http://example.com/page/222",
          },
        ],
      },
    ],
    imageAspectRatio: "rectangle",
    imageSize: "cover",
  },
};

const client = new line.Client(config);
async function handleEvent(event) {
  const userId = event.source.userId.slice(4, 19);
  const search = await googleSearchRef
    .doc(userId)
    .get()
    .then((doc) => doc.data().search);

  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  if (search === true) {
    googleSearchRef.doc(userId).set({ search: false });
    return client.replyMessage(event.replyToken, {
      type: "template",
      altText: "this is a carousel template",
      template: {
        type: "carousel",
        columns: [
          {
            thumbnailImageUrl: "https://example.com/bot/images/item1.jpg",
            imageBackgroundColor: "#FFFFFF",
            title: `${event.message.text}についての検索結果`,
            text: "description",
            defaultAction: {
              type: "uri",
              label: "View detail",
              uri: "http://example.com/page/123",
            },
            actions: [
              {
                type: "postback",
                label: "Buy",
                data: "action=buy&itemid=111",
              },
              {
                type: "postback",
                label: "Add to cart",
                data: "action=add&itemid=111",
              },
              {
                type: "uri",
                label: "View detail",
                uri: "http://example.com/page/111",
              },
            ],
          },
          {
            thumbnailImageUrl: "https://example.com/bot/images/item2.jpg",
            imageBackgroundColor: "#000000",
            title: "this is menu",
            text: "description",
            defaultAction: {
              type: "uri",
              label: "View detail",
              uri: "http://example.com/page/222",
            },
            actions: [
              {
                type: "postback",
                label: "Buy",
                data: "action=buy&itemid=222",
              },
              {
                type: "postback",
                label: "Add to cart",
                data: "action=add&itemid=222",
              },
              {
                type: "uri",
                label: "View detail",
                uri: "http://example.com/page/222",
              },
            ],
          },
        ],
        imageAspectRatio: "rectangle",
        imageSize: "cover",
      },
    });
  }

  if (event.message.text === "Google検索") {
    googleSearchRef.doc(userId).set({ search: true });
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "検索したい事を入力してください",
    });
  }

  if (event.message.text === "店舗を探す") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "位置情報を返す",
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
