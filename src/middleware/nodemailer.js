// Article | https://unclebigbay.com/build-an-email-application-using-node-js-express-js-with-gmail-and-nodemailer-all-in-one-article
require('dotenv').config();
// Nodemailer
const nodemailer = require("nodemailer");
// Googleapis
const {google} = require("googleapis");
// Pull out OAuth from googleapis
const OAuth2 = google.auth.OAuth2;


 const createTransporter = async () => {
// 1
  const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

// 2
  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        //console.log(err)
        reject("Failed to create access token :( " + err);
      }
      resolve(token);
    });
  });

// 3
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.OAUTH_SENDER_EMAIL,
      accessToken,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });

// 4
  return transporter;
};

module.exports = {
    createTransporter
}
