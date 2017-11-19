var request = require('request');

var parseVideo = function (raw_url) {
    var param1 = Math.random().toString(10).substring(2);
    var param2 = generateStr(raw_url + "@" + param1).toString(10);

    request.post({ url: 'http://service.iiilab.com/video/douyin', 
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'http://douyin.iiilab.com'
      },
    form: { 
        link: raw_url,
        r: param1,
        s: param2} 
    }, function (err, httpResponse, body) {
        console.log('Err:', err);
        console.log('Http', httpResponse);
        console.log('Server responded with:', body);
    });

};

var generateStr = function (a) {
    var c = function () {
        for (var d = 0, f = new Array(256), g = 0; 256 != g; ++g) {
            d = g,
                d = 1 & d ? -306674912 ^ d >>> 1 : d >>> 1,
                d = 1 & d ? -306674912 ^ d >>> 1 : d >>> 1,
                d = 1 & d ? -306674912 ^ d >>> 1 : d >>> 1,
                d = 1 & d ? -306674912 ^ d >>> 1 : d >>> 1,
                d = 1 & d ? -306674912 ^ d >>> 1 : d >>> 1,
                d = 1 & d ? -306674912 ^ d >>> 1 : d >>> 1,
                d = 1 & d ? -306674912 ^ d >>> 1 : d >>> 1,
                d = 1 & d ? -306674912 ^ d >>> 1 : d >>> 1,
                f[g] = d
        }
        return "undefined" != typeof Int32Array ? new Int32Array(f) : f
    }()
        , b = function (g) {
            for (var j, k, h = -1, f = 0, d = g.length; f < d;) {
                j = g.charCodeAt(f++),
                    j < 128 ? h = h >>> 8 ^ c[255 & (h ^ j)] : j < 2048 ? (h = h >>> 8 ^ c[255 & (h ^ (192 | j >> 6 & 31))],
                        h = h >>> 8 ^ c[255 & (h ^ (128 | 63 & j))]) : j >= 55296 && j < 57344 ? (j = (1023 & j) + 64,
                            k = 1023 & g.charCodeAt(f++),
                            h = h >>> 8 ^ c[255 & (h ^ (240 | j >> 8 & 7))],
                            h = h >>> 8 ^ c[255 & (h ^ (128 | j >> 2 & 63))],
                            h = h >>> 8 ^ c[255 & (h ^ (128 | k >> 6 & 15 | (3 & j) << 4))],
                            h = h >>> 8 ^ c[255 & (h ^ (128 | 63 & k))]) : (h = h >>> 8 ^ c[255 & (h ^ (224 | j >> 12 & 15))],
                                h = h >>> 8 ^ c[255 & (h ^ (128 | j >> 6 & 63))],
                                h = h >>> 8 ^ c[255 & (h ^ (128 | 63 & j))])
            }
            return h ^ -1
        };
    return b(a) >>> 0
};
parseVideo("https://www.douyin.com/share/video/6463478591609900302/?region=CN&utm_source=copy_link&utm_campaign=client_share&utm_medium=android&share_app_name=aweme&share_iid=15014279267");