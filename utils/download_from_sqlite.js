var request = require('request');
var fs = require('fs');
var url = require('url');
var Q = require('q');
var sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('./videos.db');

let sql = `SELECT *
            FROM videos
            ORDER BY playCount DESC 
            LIMIT 20`;

db.each(sql, [], (err, row) => {
    if (err) {
        throw err;
    }
    var url = `${row.videoDownloadUrl}`.replace('watermark=1', 'watermark=0');
    var title = `${row.title}` + '.mp4';
    download(url, title);
});

// close the database connection
db.close();



var download = function (uri, filename) {
    var protocol = url.parse(uri).protocol.slice(0, -1);
    var deferred = Q.defer();
    var onError = function (e) {
        fs.unlink(filename);
        deferred.reject(e);
    }
    require(protocol).get(uri, function (response) {
        if (response.statusCode >= 200 && response.statusCode < 300) {
            var fileStream = fs.createWriteStream(filename);
            fileStream.on('error', onError);
            fileStream.on('close', deferred.resolve);
            response.pipe(fileStream);
        } else if (response.headers.location) {
            deferred.resolve(download(response.headers.location, filename));
        } else {
            deferred.reject(new Error(response.statusCode + ' ' + response.statusMessage));
        }
    }).on('error', onError);
    return deferred.promise;
};