require('libs/weapp-adapter/index');
var Parser = require('libs/xmldom/dom-parser');
window.DOMParser = Parser.DOMParser;
require('libs/wx-downloader.js');
wxDownloader.REMOTE_SERVER_ROOT = "http://wegametest.datangyouxi.com";
wxDownloader.SUBCONTEXT_ROOT = "";
require('src/settings.c665e');
require('main.fe282');