const richmenu = {
  size: {
    width: 1200,
    height: 800,
  },
  selected: false,
  name: "Nice richmenu",
  chatBarText: "Tap here",
  areas: [
    {
      bounds: {
        x: 0,
        y: 0,
        width: 1200,
        height: 400,
      },
      action: {
        type: "message",
        label: "Google検索",
        text: "Google検索",
      },
    },
    {
      bounds: {
        x: 0,
        y: 400,
        width: 600,
        height: 400,
      },
      action: {
        type: "message",
        label: "店舗を探す",
        text: "店舗を探す",
      },
    },
    {
      bounds: {
        x: 600,
        y: 400,
        width: 600,
        height: 400,
      },
      action: {
        type: "message",
        label: "乗り換え案内",
        text: "乗り換え案内",
      },
    },
  ],
};
