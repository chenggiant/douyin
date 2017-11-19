var Youtube = require("youtube-api");
var fs = require("fs");
var readJson = require("r-json");
var Lien = require("lien");
var Logger = require("bug-killer");
var opn = require("opn");
var prettyBytes = require("pretty-bytes");

// I downloaded the file from OAuth2 -> Download JSON
var CREDENTIALS = readJson(`${__dirname}/credential.json`);

// Init lien server
var server = new Lien({
    host: "localhost"
    , port: 5000
});

// Authenticate
// You can access the Youtube resources via OAuth2 only.
// https://developers.google.com/youtube/v3/guides/moving_to_oauth#service_accounts
var oauth = Youtube.authenticate({
    type: "oauth"
    , client_id: CREDENTIALS.web.client_id
    , client_secret: CREDENTIALS.web.client_secret
    , redirect_url: CREDENTIALS.web.redirect_uris[0]
});

opn(oauth.generateAuthUrl({
    access_type: "offline"
    , scope: ["https://www.googleapis.com/auth/youtube.upload"]
}));

// Handle oauth2 callback
server.addPage("/oauth2callback", lien => {
    Logger.log("Trying to get the token using the following code: " + lien.query.code);
    oauth.getToken(lien.query.code, (err, tokens) => {

        if (err) {
            lien.lien(err, 400);
            return Logger.log(err);
        }

        Logger.log("Got the tokens.");

        oauth.setCredentials(tokens);

        lien.end("The video is being uploaded. Check out the logs in the terminal.");

        fs.readdirSync("./").forEach(file => {
            if (file.indexOf(".mp4") > -1) {
                Youtube.videos.insert({
                    resource: {
                        // Video title and description
                        snippet: {
                            title: "抖音美女 脾气暴躁网红大连美女孙火火 " + file.slice(0, -4),
                            // title: file.slice(0, -4),
                            description: "精选抖音舞蹈视频，快来一起跟着音乐抖起来吧",
                            // description: file.slice(0, -4),
                            tags: ['搞笑', '娱乐', '抖音'],
                            categoryId: 22
                        }, status: {
                            privacyStatus: "private"
                        }
                    },
                    part: "snippet,status",
                    media: {
                        body: fs.createReadStream(file)
                    }
                }, (err, data) => {
                    console.log(err);
                    console.log("Done.");
                    process.exit();
                });
            }
        })
    });
});

