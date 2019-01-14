require('libs/weapp-adapter/index');
var Parser = require('libs/xmldom/dom-parser');
window.DOMParser = Parser.DOMParser;
require('libs/wx-downloader.js');
wxDownloader.REMOTE_SERVER_ROOT = "https://wegame.datangyouxi.com/v/18";
wxDownloader.SUBCONTEXT_ROOT = "";
require('src/settings.8db4f');
require('main.5bbde');
var fundebug = require('./libs/fundebug.0.4.0.min.js')
fundebug.init({
  apikey: "21ec65a2ce258fda411a8c6f4e862dc103e539834dfd6f036e2112f60849e7e5"
});