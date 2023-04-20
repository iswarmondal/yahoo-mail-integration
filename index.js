const express = require("express");
const app = express();
require("dotenv").config();
const { authCode } = require("./token");
const APP_ID = process.env.appId;
const CLIENT_SECRET = process.env.clientSecret;
const CLIENT_ID = process.env.clientId;

const options = {
  url: "https://api.login.yahoo.com/oauth2/get_token",
  headers: {
    Authorization:
      "Basic " + Buffer.from(`${APP_ID}:${CLIENT_SECRET}`).toString("base64"),
    "Content-Type": "application/x-www-form-urlencoded",
  },
  form: {
    grant_type: "authorization_code",
    redirect_uri: "https://example.com/oauth2/callback",
    code: "authorization_code_from_step_3",
  },
};

const getAuthToken = async () => {
  try {
    const response = await fetch(
      `https://api.login.yahoo.com/oauth2/get_token`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${APP_ID}:${CLIENT_SECRET}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        form: {
          grant_type: "authorization_code",
          redirect_uri: "https://example.com/oauth2/callback",
          code: "authorization_code_from_step_3",
        },
      }
    );
    const data = await response.json();
    console.log("data is");
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

// Set up the route for initiating the OAuth flow
app.get("/request_auth", (req, res) => {
  const authUrl = "https://api.login.yahoo.com/oauth2/request_auth";

  // Build the authorization URL with your app ID, redirect URI, and scope parameters
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: "https://localhost:4042/",
    response_type: "code",
    language: "en-us",
    scope: "openid",
    state: "some_random_string",
  });

  const authRedirectUrl = `${authUrl}?${params.toString()}`;

  // Redirect the user to the authorization URL
  res.redirect(authRedirectUrl);
});

app.get("/get_token", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.login.yahoo.com/oauth2/get_token`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${APP_ID}:${CLIENT_SECRET}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: "authorization_code",
          redirect_uri: "https://localhost:4042/",
          code: authCode,
        },
      }
    );
    const data = await response.json();
    res.json({ data });
  } catch (error) {
    console.error(error);
    res.json({ success: false, error });
  }
});

app.listen(4042, () => {
  console.log("Example app listening on port 4042!");
});
