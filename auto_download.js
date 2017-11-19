var request = require('request');
var fs = require('fs');
var url = require('url');
var Q = require('q');


// var lineReader = require('readline').createInterface({
//     input: require('fs').createReadStream('urls.txt')
//   });
  
// lineReader.on('line', function (line) {
//     console.log('Line from file:', line);
//     parseVideo(line);
// });


var parseVideo = function (url) {
        request.get({
            url: url,
        json: true,
    }, function (err, httpResponse, body) {
        processList(body['aweme_list']);
    });
};

var processList = function (list) {
    list.forEach(function (element) {
        var url = element['video']['download_addr']['url_list'][0].replace('watermark=1', 'watermark=0');
        var title = element['share_info']['share_desc'] + '.mp4';
        if (title === '抖音-原创音乐短视频社区.mp4') {
            title = Math.random() + title;
        }
        console.log(url);
        console.log(title);
        download(url, title);
    }, this);
}


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

parseVideo('https://aweme.snssdk.com/aweme/v1/aweme/post/?iid=15293865835&device_id=39190423462&os_api=18&app_name=aweme&channel=App%20Store&idfa=E9A19AAC-A2F5-4BB8-A347-D0A339FDDE14&device_platform=iphone&build_number=15805&vid=3EF31F21-69EE-47B9-A42E-26022EF76FD5&openudid=2d90160a3955f7c8fdd3dac59a1bbb9c56929995&device_type=iPhone7,1&app_version=1.5.8&version_code=1.5.8&os_version=11.1.1&screen_width=1242&aid=1128&ac=WIFI&count=12&max_cursor=1496920614000&user_id=54846938632&cp=053daa5accf50a54e1&as=a185e0a06c930a75bf&ts=1510933820')