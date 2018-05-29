var Youtube = require('youtube-api');
var fs = require('fs');
var readJson = require('r-json');
var Lien = require('lien');
var Logger = require('bug-killer');
var opn = require('opn');
var prettyBytes = require('pretty-bytes');
var util = require('util');


// I downloaded the file from OAuth2 -> Download JSON
var CREDENTIALS = readJson(`${__dirname}/credential.json`);

// Init lien server
var server = new Lien({
    host: 'localhost'
    , port: 5000
});

// Authenticate
// You can access the Youtube resources via OAuth2 only.
// https://developers.google.com/youtube/v3/guides/moving_to_oauth#service_accounts
var oauth = Youtube.authenticate({
    type: 'oauth'
    , client_id: CREDENTIALS.web.client_id
    , client_secret: CREDENTIALS.web.client_secret
    , redirect_url: CREDENTIALS.web.redirect_uris[0]
});

opn(oauth.generateAuthUrl({
    access_type: 'offline'
    , scope: ['https://www.googleapis.com/auth/youtube.upload']
}));

// Handle oauth2 callback
server.addPage('/oauth2callback', lien => {
    Logger.log('Trying to get the token using the following code: ' + lien.query.code);
    oauth.getToken(lien.query.code, (err, tokens) => {

        if (err) {
            lien.lien(err, 400);
            return Logger.log(err);
        }

        Logger.log('Got the tokens.');

        oauth.setCredentials(tokens);

        lien.end('The video is being uploaded. Check out the logs in the terminal.');

        var numberOfVideos = fs.readdirSync('./').filter(file => file.endsWith('.mp4')).length;
        var numberOfFinish = 0;
        Logger.log('Number of videos prepared: ' + numberOfVideos);

        fs.readdirSync('./').filter(file => file.endsWith('.mp4')).forEach(file => {
            Logger.log('Inserting file: ' + file);
            var req = Youtube.videos.insert({
                resource: {
                    // Video title and description
                    snippet: {
                        title: '抖音搞笑 美女脱掉系列看多了，来看三个美女一起让你开心吧',
                        // title: file.slice(0, -4),
                        description: '精选抖音舞蹈视频，快来一起跟着音乐抖起来吧',
                        // description: file.slice(0, -4),
                        tags: ['搞笑', '娱乐', '抖音', '美女'],
                        categoryId: 22
                    }, status: {
                        privacyStatus: 'private'
                    }
                },
                part: 'snippet,status',
                media: {
                    body: fs.createReadStream(file)
                }
            }, (err, data) => {
                if (err) {
                    Logger.log('The API returned an error: ' + err);
                    numberOfFinish++;
                }
                if (data) {
                    // console.log(util.inspect(data, false, null));
                    Logger.log(file + ' upload finished.');
                    fs.unlinkSync(file);
                    numberOfFinish++;
                }
                Logger.log('Number of videos finished: ' + numberOfFinish + '/' + numberOfVideos);
                if (numberOfFinish >= numberOfVideos) {
                    process.exit();
                }
            });

            // show some progress
            // var id = setInterval(function () {
            //     var fileSize = fs.statSync(file).size;
            //     var uploadedBytes = req.req.connection._bytesDispatched;
            //     var uploadedMBytes = uploadedBytes / 1000000;
            //     var progress = uploadedBytes > fileSize
            //         ? 100 : (uploadedBytes / fileSize) * 100;
            //     process.stdout.clearLine();
            //     process.stdout.cursorTo(0);
            //     process.stdout.write(uploadedMBytes.toFixed(2) + ' MBs uploaded. ' +
            //         progress.toFixed(2) + '% completed.');
            //     if (progress === 100) {
            //         process.stdout.write('Done uploading, waiting for response...');
            //         clearInterval(id);
            //     }
            // }, 100);
        })
    });
});

