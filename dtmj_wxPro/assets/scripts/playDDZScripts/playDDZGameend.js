//斗地主的结算页面
var tipsStr = {
	dissolveHalfway: "中途解散",
	add: "+",
	multiple: "x",
	singleWord: "第",
	round: "局 ",
	bombLimeNum: "个炸弹封顶",
	notBombLime: "炸弹不封顶",
	spring: " 春天",
	endBomb: "结算：炸弹",
	count: "个",
	ruler: "玩法：经典斗地主 ",
	friendCricle: " 亲友圈  ",
	tableid: "房间号:",
	deskNum: "号桌",
	id: "ID:",
}
cc.Class({
	extends: cc.Component,

	properties: {
		endOne: {
			type: cc.Node,
			default: null,
		},
		endFinal: {
			type: cc.Node,
			default: null,
		},
		playDDZAnim: {
			type: cc.Node,
			default: null,
		},
		lostTimeBg_right: {
			type: cc.Node,
			default: null,
		},
		lostTimeBg_left: {
			type: cc.Node,
			default: null,
		},
	},

	initData: function() {
		this.sData = cc.jsInstance.data.sData;
		this.playerTool = this.getComponent('playerTool');
		this.playDDZSpriteManager = this.getComponent('playDDZSpriteManager');
		this.playAnimTool = this.playDDZAnim.getComponent('anim');
	},

	getkeys: function(data) {
		this.players = cc.jsInstance.players;
		cc.logManager.info("showOneRoundEndUI data ===", data);
		var keys = [];
		for (var key in data.detail.players) {
			keys.push(key);
		}
		//将keys进行一次变换自己放在第一个位置
		keys = this.playerTool.transformUidsLocationArr(this.playerTool.getUserId());
		return keys;
	},

	hiddenItem: function(contentNode) {
		for (var i = 0; i < 3; i++) {
			var item = contentNode.getChildByName("item" + i);
			item.active = false;
		}
	},

	playChuntianAnim: function(tData, time) {
		if (tData.winType === 1) {
			time = 3.5;
			this.scheduleOnce(function() {
				this.playAnimTool.playAnim("chuntian");
			}, 1.5);
		}
	},

	setRoundNumStr: function(roundNumNode, tData) {
		if (tData.firstDel > 0) {
			roundNumNode.getComponent(cc.Label).string = tipsStr.dissolveHalfway;
		} else {
			roundNumNode.getComponent(cc.Label).string = tipsStr.singleWord + (tData.roundAll - tData.roundNum) + tipsStr.round;
		}
	},

	setWinOrFailBg: function(tData, pinfo, sorce, keys, i) {
		var self = this;
		var time = 1.5;
		var winBg = this.endOne.getChildByName("winBg");
		var failBg = this.endOne.getChildByName("failBg");
		if (pinfo.winone >= 0) {
			if (pinfo.winone != 0) {
				sorce = tipsStr.add + pinfo.winone;
			}
			if (keys[i] === this.playerTool.getUserId()) {
				this.playChuntianAnim(tData, time);
				this.scheduleOnce(function() {
					self.playAnimTool.playAnimDDZForWin();
					cc.jsInstance.audioManager.playSFXForDDZ("win");
				}, time);
				winBg.active = true;
				failBg.active = false;
				var roundNumNode = winBg.getChildByName("roundNumLab");
				this.setRoundNumStr(roundNumNode, tData);
			}
		} else {
			this.playChuntianAnim(tData, time);
			if (keys[i] === this.playerTool.getUserId()) {
				this.scheduleOnce(function() {
					cc.jsInstance.audioManager.playSFXForDDZ("lose");
				}, time);

				failBg.active = true;
				winBg.active = false;
				var roundNumNode = failBg.getChildByName("roundNumLab");
				this.setRoundNumStr(roundNumNode, tData);
			}
		}
	},

	//item的详细内容填充
	setItemDetailData: function(item, pinfo, tData, keys, i) {
		var headUrls = [];
		var headUrlNodes = [];
		var landLoaderId = tData.landLoader;
		var isLandlords = item.getChildByName("landlords");
		var nameLabNode = item.getChildByName("nameLab");
		var baseMultipleNode = item.getChildByName("baseMultiple");
		var baseScoreLab = item.getChildByName("baseScoreLab");
		item.active = true;
		//是不是地主
		if (landLoaderId === parseInt(keys[i])) {
			isLandlords.active = true;
		} else {
			isLandlords.active = false;
		}

		//个人信息赋值
		if (pinfo.info.nickname) {
			nameLabNode.getComponent(cc.Label).string = unescape(pinfo.info.nickname).substr(0, 6);
		} else {
			nameLabNode.getComponent(cc.Label).string = pinfo.info.name;
		}

		if (pinfo.info.headimgurl) {
			var headNode = item.getChildByName("mask").getChildByName("head");
			headUrls.push(pinfo.info.headimgurl);
			headUrlNodes.push(headNode);
		}

		var bombLime = Math.pow(2, tData.bombLime);
		if (tData.bombLime != 100 && tData.multiple > bombLime) {
			tData.multiple = bombLime;
		}

		if (headUrls.length > 0) {
            this.playerTool.setHead(headUrls, headUrlNodes);
		}
		
		baseMultipleNode.getComponent(cc.Label).string = tipsStr.multiple + tData.multiple;
		baseScoreLab.getComponent(cc.Label).string = tData.baseScore;
	},

	setItemUIData: function(keys, tData, contentNode) {
		for (var i = 0; i < keys.length; i++) {
			if (keys[i] === 0) {
				continue;
			}
			var pinfo = this.sData.players[keys[i]]; //头像积分信息
			var index = this.playerTool.transformUidsLocation(parseInt(keys[i]));
			index = this.playerTool.getIndexByGameKind(index);
			var item = contentNode.getChildByName("item" + i);
			this.setItemDetailData(item, pinfo, tData, keys, i);
			var sorce = pinfo.winone;
			this.setWinOrFailBg(tData, pinfo, sorce, keys, i);
			this.refreshPutUIForTableEnd(keys[i], pinfo.mjhand);
			item.getChildByName("scoreLab").getComponent(cc.Label).string = sorce;
		}
	},

	//底部UI数据设置
	setOneRoundBottomUIData: function(tData) {
		var bombNumStr = tData.bombLime < 100 ? (tData.bombLime + tipsStr.bombLimeNum) : tipsStr.notBombLime;
		var chuntianStr = ""
		if (tData.winType === 1) {
			chuntianStr = tipsStr.spring;
		}

		var bottomInfo = this.endOne.getChildByName("bottomInfo");
		bottomInfo.getChildByName("settlementLab").getComponent(cc.Label).string = tipsStr.endBomb + tData.bombNumber + tipsStr.count + chuntianStr;
		bottomInfo.getChildByName("playRulerLab").getComponent(cc.Label).string = tipsStr.ruler + tData.roundAll + tipsStr.round + bombNumStr;
	},

	//一局结束
	//小结算页面4.5秒 ，大结算5秒，春天1.5秒，胜利3.5秒之后播动画 时间控制顺序播放

	showOneRoundEndUI: function(data) {
		var tData = data.detail.tData;
		var contentNode = this.endOne.getChildByName("content");
		var keys = this.getkeys(data);
		this.hiddenItem(contentNode);
		//每一个item部分
		this.setItemUIData(keys, tData, contentNode);
		this.setOneRoundBottomUIData(tData);
		this.showEndOne();
	},

	showEndOne: function() {
		var self = this;
		var timeCallback = function(dt) {
			self.endOne.active = true;
		}
		this.scheduleOnce(timeCallback, 4.5);
	},


	nextRoundClick: function() {
		this.endOne.active = false;
		cc.jsInstance.network.tableMsgMJPassMy();
	},

	showAllRoundEndUI: function(data) {
		//处理数据
		this.tData = cc.jsInstance.data.sData.tData;
		var playInfos = data.playInfo;
		if (!playInfos) {
			cc.logManager.warn("没有玩家信息");
			return;
		}
		var players = playInfos.players;
		var headUrls = [];
		var headUrlNodes = [];
		var tableNumLab = this.endFinal.getChildByName("bigBg").getChildByName("tableNumLab");
		if (this.tData.desktop > 0) {
			tableNumLab.getComponent(cc.Label).string = unescape(this.tData.clubName).substr(0, 6) + tipsStr.friendCricle + this.tData.desktop + tipsStr.deskNum;
		} else {
			tableNumLab.getComponent(cc.Label).string = tipsStr.tableid + this.sData.tData.tableid;
		}
		this.endFinal.getChildByName("bigBg").getChildByName("timeLab").getComponent(cc.Label).string = this.playerTool.getCurrentDate();

		for (var i = 0; i < 3; i++) {
			var content = this.endFinal.getChildByName("bigBg").getChildByName("content");
			var item = content.getChildByName("item" + i);
			item.active = false;
		}

		var haveSortUids = this.playerTool.transformUidsLocationArr(this.playerTool.getUserId());
		var haveSortPlayers = [];
		for (var i = 0; i < haveSortUids.length; i++) {
			var uid = haveSortUids[i];
			if (uid === 0) {
				continue;
			}
			for (var j = 0; j < players.length; j++) {
				var pl = players[j];
				cc.logManager.info("uid ===", uid);
				if (parseInt(uid) === parseInt(pl.uid)) {
					cc.logManager.info("yes");
					haveSortPlayers.push(pl);
					break;
				}
			}
		}

		var winnerIndexArr = [];
		var maxScore = 0;
		for (var i = 0; i < haveSortPlayers.length; i++) {
			//获取节点
			var player = haveSortPlayers[i];
			var content = this.endFinal.getChildByName("bigBg").getChildByName("content");
			var item = content.getChildByName("item" + i);
			item.active = true;
			//要赋值的节点
			var nameNode = item.getChildByName("nameLab");
			if (player.nickname) {
				nameNode.getComponent(cc.Label).string = unescape(player.nickname).substr(0, 6);
			} else {
				nameNode.getComponent(cc.Label).string = player.name;
			}

			if (player.headimgurl) {
				headUrls.push(player.headimgurl);
				headUrlNodes.push(item.getChildByName("mask").getChildByName("head"));
			}

			var idNode = item.getChildByName("idLab");
			idNode.getComponent(cc.Label).string = tipsStr.id + player.uid;

			if (player.uid === this.tData.owner && !this.tData.desktop) {
				item.getChildByName("owner").active = true;
			} else {
				item.getChildByName("owner").active = false;
			}

			var fenNode = item.getChildByName("scoreLab");
			var sorce = player.winall;
			if (sorce > 0) {
				sorce = tipsStr.add + player.winall;
			}
			fenNode.getComponent(cc.Label).string = sorce;
			//拿到本局最高分
			if (player.winall >= maxScore) {
				maxScore = player.winall;
			}

			var winTagNode = item.getChildByName("winner");
			if (player.winall > 0) {
				winTagNode.active = true;
			} else {
				winTagNode.active = false;
			}
		}

		for (var i = 0; i < haveSortPlayers.length; i++) {
			var player = haveSortPlayers[i];
			var item = content.getChildByName("item" + i);
			var winTagNode = item.getChildByName("winner");
			if (player.winall === maxScore && maxScore > 0) {
				winTagNode.active = true;
			} else {
				winTagNode.active = false;
			}
		}

		this.playerTool.setHead(headUrls, headUrlNodes);

		var self = this;
		var timeCallback = function(dt) {
			self.endFinal.active = true;
		}
		this.scheduleOnce(timeCallback, 5);
	},

	//一局结束之后摊牌的UI 
	refreshPutUIForTableEnd: function(playerUid, handArr) {
		this.lostTimeBg_left.active = false;
		this.lostTimeBg_right.active = false;
		handArr.sort(function(a, b) {
			return (a % 100) - (b % 100);
		})
		var index = this.playerTool.transformUidsLocation(playerUid);
		if (!index) {
			return;
		}
		var putNode;
		var isRight = false;
		var playDDZPlaying = this.node.getChildByName("playDDZPlaying");
		switch (index) {
			case 1:
				putNode = playDDZPlaying.getChildByName("right").getChildByName("cardPut");
				isRight = true;
				break;
			case 2:
				putNode = playDDZPlaying.getChildByName("left").getChildByName("cardPut");
				break;
			default:
				break;
		}
		for (let i = 0; i < 20; i++) {
			var card = putNode.getChildByName("Card" + i);
			if (i < handArr.length) {
				card.active = true;
				card.getComponent(cc.Sprite).spriteFrame = this.playDDZSpriteManager.getPockerSpriteFrame(handArr[i])
			} else {
				card.active = false;
			}
		}

		var self = this;
		if (isRight && handArr.length < 8 && handArr.length > 0) {
			this.scheduleOnce(function() {
				var card0 = putNode.children[19];
				var x = self.cardPutNodeRightX - card0.x - card0.width / 2
				putNode.x = x;
			}, 0);
		} else if (isRight && handArr.length >= 8) {
			putNode.x = this.cardPutNodeRightX;
		}
	},

	finishClick: function() {
		this.sendExitRoomMsg();
	},

	sendExitRoomMsg: function() {
		var self = this;
		cc.jsInstance.network.leaveGame(function() {
			self.loadLobby();
			cc.jsInstance.pinfo.vipTable = 0;
		}.bind(this));
	},

	loadLobby: function() {
		cc.jsInstance.block.show();
		cc.director.preloadScene("lobby", function() {
			cc.loader.onProgress = null;
			cc.director.loadScene("lobby");
			cc.jsInstance.block.hide();
		});
	},

	onLoad() {
		this.initData();
		var playDDZPlaying = this.node.getChildByName("playDDZPlaying");
		this.cardPutNodeRightX = playDDZPlaying.getChildByName("right").getChildByName("cardPut").x;
	},

	start() {},

	// update (dt) {},
});