var pomelo = require("pomelo-client");
var pomelo_ioError = "io-error";
var pomelo_onKick = "onKick";
var pomelo_error = "error";
var pomelo_close = "close";
var pomelo_disconnect = "disconnect";
var pomelo_reconnect = "reconnect";
var pomelo_heartbeatTimeout = "heartbeat timeout";


var reqPingPong = [];
var reqStart = Date.now();
var lastTableCmd = null;

function ComputePingPong() {
	reqPingPong.push(Date.now() - reqStart);
	if (reqPingPong.length > 5) reqPingPong.splice(0, 1);
	var pingpong = 0;
	for (var i = 0; i < reqPingPong.length; i++) pingpong += reqPingPong[i];
	cc.jsInstance.reqPingPong = pingpong / reqPingPong.length;
}

var sendEvent = function(name, data) {
	cc.logManager.info("sendEvent ", name, data);
}
cc.Class({
	extends: cc.Component,
	properties: {},
	onLoad() {},

	init() {
		var self = this;
		this.SetCallBack(pomelo_ioError, function(data) {});
		this.SetCallBack(pomelo_onKick, function(data) {
			//lew kick out data中reason{} code:1 被同一玩家提  option{...} 2:操作太频繁
			// cc.logManager.info("pomelo_onKick信息:" + JSON.stringify(data));
			if (data.reason) {
				try {
					var reasonMsg = JSON.parse(data.reason);
					if (reasonMsg.code == 1) {
						cc.jsInstance.isOnKick = true;
						// cc.jsInstance.globalUtils.send("disconnect", 6666);
					}
				} catch (e) {}
			}
		});
		this.SetCallBack(pomelo_error, function(data) {
			cc.logManager.error("pomelo 错误了");
			self.skipLobby();
		});
		this.SetCallBack(pomelo_close, function(data) {
			cc.logManager.info("pomelo 关闭了了");
			self.skipLobby();
		});
		this.SetCallBack(pomelo_disconnect, function(data) {
			cc.logManager.error("pomelo 断开连接了");
			self.skipLobby();
		});
		this.SetCallBack(pomelo_reconnect, function(data) {
			cc.logManager.info("pomelo 重连了了");
			self.skipLobby();
		});
		this.SetCallBack(pomelo_heartbeatTimeout, function() {
			cc.logManager.error("pomelo 心跳超时了 了");
			self.skipLobby();
		});
	},
	//返回到大厅重连
	skipLobby() {
		cc.logManager.info("gamenet----准备重连---", cc.director.getScene()._name);
		cc.jsInstance.isreConnect = true;
		if (cc.director.getScene()._name === "play" || cc.director.getScene()._name === "playDDZ") {
			cc.jsInstance.block.show("正在重连...");
			cc.jsInstance.native.skipScene("lobby");
		}
	},

	QueueNetMsgCallback(evt) {
		this.SetCallBack(evt, function(d) {
			cc.jsInstance.globalUtils.send("QueueNetMsg", [evt, d]);
		});
	},
	connect(host, port, f_ok, f_fail) {
		var gameNet = this;
		reqPingPong = [];
		pomelo.disconnect();
		gameNet.isConnect = false;
		this.SetCallBack(pomelo_disconnect, function() {
			gameNet.isConnect = false;
			f_fail();
		});
		pomelo.init({
			host: host,
			port: port,
			log: false
		}, function() {
			gameNet.isConnect = true;
			f_ok();
		});
	},
	disconnect() {
		var gameNet = this;
		this.SetCallBack(pomelo_disconnect);
		pomelo.disconnect();
		gameNet.isConnect = false;
		// cc.logManager.error("gamenet=======disconnect======");
	},
	request(type, msg, cb) {
		var gameNet = this;
		try {
			reqStart = Date.now();
			if ("pkcon.handler.tickServer" != type) {
				cc.logManager.info(type + " $ " + JSON.stringify(msg))
			}
			if (arguments.length == 2) {
				pomelo.notify(type, msg);
				lastTableCmd = null;
				if (type == "pkroom.handler.tableMsg") {
					lastTableCmd = msg.cmd;
				}
			} else {
				pomelo.request(type, msg, function(rtn) {
					ComputePingPong();
					var rtn1 = rtn;
					if ("pkcon.handler.tickServer" != type) {
						cc.logManager.info(type + " # " + (Date.now() - reqStart) + " ", rtn1); //JSON.stringify(rtn)
					}
					cb(rtn);
				});
			}
		} catch (e) {
			cc.jsInstance.globalUtils.send("disconnect", 2);
		}
	},
	SetCallBack(evt, cb) {
		pomelo.off(evt);
		if (cb)
			pomelo.on(evt, function(data) {
				if (lastTableCmd == evt) {
					lastTableCmd = null;
					ComputePingPong();
				}
				// cc.logManager.info(evt + "@@" + JSON.stringify(data));
				cb(data);
			});
	},
	registerPomeloMsg(evts) {
		var gameNet = this;
		for (let evt in evts) {
			const callback = evts[evt];
			pomelo.off(evt);
			pomelo.on(evt, function(data) {
				cc.logManager.info(evt + "@", data);
				evts[evt](evt, data);
			});
		}
	}
});