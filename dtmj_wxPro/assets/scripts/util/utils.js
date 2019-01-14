const util = module.exports = {};

util.request = {
    get: function (url, cb) {
        const req = new XMLHttpRequest();
        req.onerror = cb;
        req.onreadystatechange = function (chunk, event) {
            cb(null, chunk);
        }
        req.open('GET', url);
    },
    post: function () {
        const req = new XMLHttpRequest();
        req.onerror = cb;
        req.onreadystatechange = function (chunk, event) {
            cb(null, chunk);
        }
        req.open('POST', url);
    }
};