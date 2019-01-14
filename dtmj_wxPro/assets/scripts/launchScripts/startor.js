cc.Class({
	extends: cc.Component,
	properties: {
		isdebug: false,
		version: 1.0,
		text: {
			type: cc.Label,
			default: null,
		},
	},
	// 组件实例销毁的时候调用
	onDestroy() {
		this.unschedule(this.callback);
	},

	setDian() {
		var self = this;
		this.callback = function() {
			this.nowTime++;
			if (this.nowTime > 2) {
				this.nowTime = 0;
			}
			if (this.nowTime === 0) {
				this.text.string = "正在初始化游戏数据中， 请稍后 .";
			} else if (this.nowTime === 1) {
				this.text.string = "正在初始化游戏数据中， 请稍后 . .";
			} else if (this.nowTime === 2) {
				this.text.string = "正在初始化游戏数据中， 请稍后 . . .";
			}
		}.bind(self);
		this.schedule(this.callback, 1, cc.macro.REPEAT_FOREVER, 0); // 默认值为永远执行，马上开始  schedule(函数, 多长时间掉一次, 次数(永远), 隔多少秒以后开始执行shedule)
	},
	onLoad() {
		if (cc.sys.platform === cc.sys.WECHAT_GAME) {
			wx.setPreferredFramesPerSecond(60);
		} else {
			cc.game.setFrameRate(60);
		}

		this.nowTime = 0;
		var self = this;
		this.setDian();

		// cc.jsInstance = {};
		cc.jsInstance.isShowMsgPop = true; //显示 弹窗
		cc.log = function(msg) {
			console.log(msg);
		};
		cc.jsInstance.idDebug = this.isdebug;
		cc.jsInstance.version = this.version;

		//日志管理类
		var LogManager = require("logManager");
		cc.logManager = new LogManager();
		cc.logManager.info("game started!");

		var tempGlobal = require("globalUtils");
		cc.jsInstance.globalUtils = new tempGlobal();
		cc.jsInstance.globalUtils.init();

		var clubControler = require("clubControler");
		cc.jsInstance.clubControler = new clubControler();

		var network = require("netWork");
		cc.jsInstance.network = new network();

		var CreatRoomParam = require("CreatRoomParam");
		cc.jsInstance.CreatRoomParam = (new CreatRoomParam()).getParams();

		//数据管理类
		var DataManager = require("dataManager");
		cc.jsInstance.dataManager = new DataManager();
		cc.audioEngine.uncacheAll();
		//音频管理类
		var AudioManager = require("audioMgr");
		cc.jsInstance.audioManager = new AudioManager();
		cc.jsInstance.audioManager.init();
		cc.jsInstance.audioManager.playBGM("bgMain"); //播放背景音乐

		//全局玩法格式化
		var WanfaStrFormat = require("WanfaStrFormat");
		cc.jsInstance.WanfaStrFormat = new WanfaStrFormat();

		var Poker = require("poker");
		cc.jsInstance.Poker = Poker.prototype;
		var PokerManager = require("PokerManager");
		cc.jsInstance.PokerManager = new PokerManager();

		//初始化网络连接器
		var gamenet = require("gamenet");
		gamenet = new gamenet();
		cc.jsInstance.gamenet = gamenet;
		cc.jsInstance.gamenet.init();
		cc.jsInstance.gamenet.registerPomeloMsg(cc.jsInstance.network.getMsges());
		this.initEvents();
		this.getConfig();

		var startTime, endTime, sceneName;
		cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LOADING, function(event) {
			startTime = (new Date()).getTime();
			sceneName = event.detail;
			cc.logManager.info("开始加载场景：" + sceneName);
		});
		cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function(event) {
			endTime = (new Date()).getTime();
			var dur = endTime - startTime;
			cc.logManager.info("加载场景完成-sceneName " + sceneName + " loading time:" + dur + "ms");
			if (sceneName === "play") {
				if (cc.jsInstance.audioManager.getBgmName() && cc.jsInstance.audioManager.getBgmName() != "bgGame") {
					cc.jsInstance.audioManager.playBGM("bgGame");
				}
			} else if (sceneName === "playDDZ") {
				if (cc.jsInstance.audioManager.getBgmName() && cc.jsInstance.audioManager.getBgmName() != "ddz_bgplay") {
					cc.jsInstance.audioManager.playBGMDDZ("ddz_bgplay");
				}
			} else if (sceneName === "lobby") {
				if (cc.jsInstance.pinfo && cc.jsInstance.pinfo.vipTable != 0) { //有房间 对战场景回来 不切换背景音乐

				} else {
					if (cc.jsInstance.audioManager.getBgmName() != "bgMain") { //没房间 对战场景回来 不是大厅的背景音乐就切换成大厅的
						cc.jsInstance.audioManager.playBGM("bgMain");
					}
				}
			}
		});
	},

	getConfig() {
		var self = this;
		//获取配置
		if (cc.jsInstance.idDebug) {
			// cc.logManager.info('========cc.jsInstance.idDebug===true==========', cc.jsInstance.idDebug);
			var config = require("config");
			var cfg = new config();
			cc.jsInstance.remoteCfg = cfg.getConfig();
			this.connectToPomelo();
		} else {
			// cc.logManager.info('========cc.jsInstance.idDebug===false==========', cc.jsInstance.idDebug);
			cc.jsInstance.network.getconfigs(function(data) {
				cc.logManager.info("获取configs===", data);
				cc.jsInstance.remoteCfg = data;
				self.connectToPomelo();
			}, function() {
				cc.logManager.info("获取远程配置失败！");
				cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("网络不稳定，请检查或者切换网络，重新进入游戏！", function() {
					cc.jsInstance.audioManager.playBtnClick();
					self.getConfig();
				});
			});
		}
	},
	//和服务器建立连接
	connectToPomelo() {
		var servers = cc.jsInstance.remoteCfg.servers.split(',');
		var server = servers[Math.floor(Math.random() * servers.length)];
		var parts = server.split(':');
		var host = parts[0];
		var port = parseInt(parts[1 + Math.floor(Math.random() * (parts.length - 1))]);
		cc.jsInstance.gamenet.disconnect();
		cc.jsInstance.gamenet.connect(host, port, function() {
			cc.jsInstance.globalUtils.send("connect");
		}, function() {
			cc.jsInstance.native.reConnect("startor");
			cc.jsInstance.globalUtils.send("disconnect", 1);
		});
	},

	initEvents() {
		var self = this;
		cc.jsInstance.globalUtils.dataEventHandler = this.node;
		this.node.on("connect", function(data) {
			cc.logManager.info('startor is connect!!!!!');
			// cc.jsInstance.audioManager.playBGM("bgMain");
			self.isAutoLogin();
		})
	},

	isAutoLogin() {
		var self = this;
		if (cc.sys.platform === cc.sys.WECHAT_GAME) { //
			//获取用户已授权信息
			wx.getSetting({
				success: function(res) {
					// cc.logManager.info("wx.getSetting----success==="); //{"errMsg":"getSetting:ok","authSetting":{"scope.userInfo":true}}
					if (res.authSetting["scope.userInfo"]) {
						cc.jsInstance.isAuto = true;
						cc.jsInstance.native.wxLoginNative();
					} else {
						var wxlogininfo = cc.sys.localStorage.getItem('wxloginData'); //从缓存取用户信息
						if (wxlogininfo && wxlogininfo != 0) {
							cc.jsInstance.isAuto = true;
							cc.jsInstance.native.wxLoginNative();
						} else {
							cc.logManager.info("没有找到缓存数据和授权信息---到登录界面显示登录按钮");
							cc.director.preloadScene("login", function() {
								cc.loader.onProgress = null;
								cc.director.loadScene("login");
							});
						}
					}
				},
			});
		} else {
			cc.director.preloadScene("login", function() {
				cc.loader.onProgress = null;
				cc.director.loadScene("login");
			});
		}
	},
});