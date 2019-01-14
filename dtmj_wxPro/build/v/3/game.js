require('libs/weapp-adapter-min');
var Parser = require('libs/xmldom/dom-parser');
window.DOMParser = Parser.DOMParser;
require('libs/wx-downloader.js');
wxDownloader.REMOTE_SERVER_ROOT = "";
require('src/settings.41a9d');
require('main.acd1b');
var fundebug = require('./libs/fundebug.0.1.0.min.js')
fundebug.init({
  apikey: "a681d899e5b003f2601e688a68d01debfa5997b7ff102fe38d23b9d6f1394e44"
});