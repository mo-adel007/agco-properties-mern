// firebaseConfig.js
const admin = require("firebase-admin");
const serviceAccount = require("./firebaseServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "agco-b062f.appspot.com",
});

const bucket = admin.storage().bucket();
module.exports = { bucket };
