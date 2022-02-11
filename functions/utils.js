const { Client } = require("@googlemaps/google-maps-services-js");
const functions = require("firebase-functions");

const client = new Client({});

client
  .elevation({
    params: {
      locations: [{ lat: 45, lng: -110 }],
      key: functions.config().convenientapp.google_api,
    },
    timeout: 1000, // milliseconds
  })
  .then((r) => {
    console.log(r.data.results[0].elevation);
  })
  .catch((e) => {
    console.log(e.response.data.error_message);
  });
