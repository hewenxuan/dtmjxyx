/**
 * 负责显示牌桌内的结算页面
 */
var tableRulers = require("./tableRulers");
var goldgameEnd = require("./goldGameEnd");
var gameEndColor = {
	yingYellowColor:"#fff665",
	normalBlackColor:"#333333",
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

		deleteMaskNode: {
			type: cc.Node,
			default: null,
		},

		leaveBtnSpriteFrame: {
			type: cc.SpriteFrame,
			default: null,
		},

		leaveBtnBgSpriteFrame: {
			type: cc.SpriteFrame,
			default: null,
		},

		agianGameBtnSpriteFrame:{
			type: cc.SpriteFrame,
			default: null,
		},

		agianGameBtnBgSpriteFrame:{
			type: cc.SpriteFrame,
			default: null,
		},

		nextRoundSpriteFrame: {
			type: cc.SpriteFrame,
			default: null,
		},

		nextRoundBgSpriteFrame: {
			type: cc.SpriteFrame,
			default: null,
		},

		coinBgpriteFrame: {
			type: cc.SpriteFrame,
			default: null,
		},
	},

	// LIFE-CYCLE CALLBACKS:
	onLoad() {
		this.waitting = this.node.getChildByName("waitting").getComponent("waitting");
		this.initData();
	},

	initData: function() {
		this.sData = cc.jsInstance.data.sData;
		this.players = cc.jsInstance.players;
		this.playerTool = this.getComponent('playerTool');
		this.playPaiSpriteFrame = this.getComponent('playGetPaiSpriteFrame');
	},

	//一局结束
	showOneRoundEndUI: function(data) {
		this.players = cc.jsInstance.players;
		cc.logManager.info("showOneRoundEndUI data ===",data);
		var keys = [];
		for (var key in data.detail.players) {
			keys.push(key);
		}
		var tData = data.detail.tData;
		var uids = tData.uids;
		var headUrls = [];
		var headUrlNodes = [];
		var fenxiangbtn = this.endOne.getChildByName("zjbg").getChildByName("fenxiangbtn");
		var jixubtn = this.endOne.getChildByName("zjbg").getChildByName("jixubtn");
		if (this.sData.tData.gameKind === "goldgame") {
			//背景和文字都替换下
			fenxiangbtn.getComponent(cc.Sprite).spriteFrame = this.leaveBtnBgSpriteFrame;
			fenxiangbtn.getChildByName("dt_zi_fenxiang").getComponent(cc.Sprite).spriteFrame = this.leaveBtnSpriteFrame;

			jixubtn.getComponent(cc.Sprite).spriteFrame = this.agianGameBtnBgSpriteFrame;
			jixubtn.getChildByName("dt_zi_goon").getComponent(cc.Sprite).spriteFrame = this.agianGameBtnSpriteFrame;
		}

		this.rulerArr = tableRulers.getGameRulersInfo(this.sData,false);
		this.endOne.getChildByName("zjbg").getChildByName("ruleLab").getComponent(cc.Label).string = this.rulerArr.join(" ");

		for (var i = 0; i < 4; i++) {
			var item = this.endOne.getChildByName("content").getChildByName("item" + i);
			item.active = false;
			if (this.sData.tData.gameKind === "goldgame") {
				this.endOne.getChildByName("content").getChildByName("item" + i).getChildByName("yuanbaokuang").getComponent(cc.Sprite).spriteFrame = this.coinBgpriteFrame;
			}
		}

		//将keys进行一次变换自己放在第一个位置
		keys = this.playerTool.transformUidsLocationArr(this.playerTool.getUserId());
		for (var i = 0; i < keys.length; i++) {
			if (keys[i] === 0) {
				continue;
			}
			var pinfo = this.sData.players[keys[i]]; //头像积分信息
			var pHuPaiInfo = data.detail.players[keys[i]]; //胡牌信息
			var zhuangUid = tData.uids[tData.zhuang];

			var index = this.playerTool.transformUidsLocation(parseInt(keys[i]));
			index = this.playerTool.getIndexByGameKind(index);

			var localPlayersPGHS = this.players[index];

			var playerHands = pHuPaiInfo.mjhand;
			//排序下
			var hupaiValue;
			if (pHuPaiInfo.winType > 0) {
				hupaiValue = playerHands[playerHands.length - 1];
				playerHands.splice(playerHands.length - 1, 1);
			}

			playerHands = this.playerTool.orderThePlayerHands(playerHands, false);
			var item = this.endOne.getChildByName("content").getChildByName("item" + i);
			item.active = true;
			var ying = item.getChildByName("ying");
			var huType = item.getChildByName("endOneHuImg");
			var touxiangkuang = item.getChildByName("touxiangkuang");
			var huMjhands = item.getChildByName("huMjhands");

			var group4 = huMjhands.getChildByName("group4");
			//是不是胡牌的人
			ying.active = false;
			huType.active = false;
			// var WinType=
			// {
			//   eatPut:1,     //普通出牌点炮 
			//   eatGangPut:2, //开杠打牌点炮
			//   eatGang:3,    //抢杠
			//   pickNormal:4, //普通自摸
			//   pickGang1:5,  //吃牌开明杠后补牌自摸(点杠者包3家)
			//   pickGang23:6  //摸牌开杠补牌自摸
			// }  
			if (pHuPaiInfo.winType > 0 && tData.firstDel <= 0) {
				huType.active = true;
				if (pHuPaiInfo.winone > 0) {
					ying.active = true;
				}
				var huPai = group4.getChildByName("huPai");
				huPai.active = true;
				huPai.getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(hupaiValue, "M");
				if (hupaiValue === this.sData.tData.haozi) {
					huPai.getChildByName("dt_play_laizi_img").active = true;
				} else {
					huPai.getChildByName("dt_play_laizi_img").active = false;
				}

				var hand = group4.getChildByName("hand");
				hand.getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(playerHands[playerHands.length - 1], "M");
				if (playerHands[playerHands.length - 1] === this.sData.tData.haozi) {
					hand.getChildByName("dt_play_laizi_img").active = true;
				} else {
					hand.getChildByName("dt_play_laizi_img").active = false;
				}

				touxiangkuang.getChildByName("fan").active = true;
				//判断是不是自摸
				if (pHuPaiInfo.mjdesc.indexOf("自摸") >= 0) {
					cc.jsInstance.audioManager.playSFX("zimo");
					this.playerTool.playAnimation(parseInt(keys[i]), "zimoAni",hupaiValue);
				} else if (pHuPaiInfo.winType > 0) {
					cc.jsInstance.audioManager.playSFX("hu");
					this.playerTool.playAnimation(parseInt(keys[i]), "huAni");
					this.node.getChildByName("PlayEatFlag").active = false;
				}
			} else {
				if (pHuPaiInfo.winone > 0) {
					ying.active = true;
				}
				var hand = group4.getChildByName("hand");
				var huPai = group4.getChildByName("huPai");
				if (data.detail.tData.winner < 0 && parseInt(keys[i]) === parseInt(data.detail.tData.uids[data.detail.tData.curPlayer]) && data.detail.tData.firstDel > 0) {
					//荒局不走这里
					huPai.active = true;
					huPai.getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(playerHands[playerHands.length - 1], "M");
					hand.getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(playerHands[playerHands.length - 2], "M");
				} else {
					huPai.active = false;
					hand.getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(playerHands[playerHands.length - 1], "M");
				}
				touxiangkuang.getChildByName("fan").active = false;
			}

			var zhuang = touxiangkuang.getChildByName("zhuang");
			//是不是庄家
			if (zhuangUid === parseInt(keys[i])) {
				zhuang.active = true;
			} else {
				zhuang.active = false;
			}
			var id = touxiangkuang.getChildByName("id");
			//个人信息赋值
			id.getComponent(cc.Label).string = "ID:" + keys[i];
			id.color = cc.hexToColor(ying.active?gameEndColor.yingYellowColor:gameEndColor.normalBlackColor);

			var name = touxiangkuang.getChildByName("name");
			if (pinfo.info.nickname) {
				name.getComponent(cc.Label).string = unescape(pinfo.info.nickname).substr(0, 6);
			} else {
				name.getComponent(cc.Label).string = pinfo.info.name;
			}
			name.color = cc.hexToColor(ying.active?gameEndColor.yingYellowColor:gameEndColor.normalBlackColor);

			if (pinfo.info.headimgurl) {
				var headNode = touxiangkuang.getChildByName("head");
				headUrls.push(pinfo.info.headimgurl);
				headUrlNodes.push(headNode);
			}
			touxiangkuang.getChildByName("hupai").getComponent(cc.Label).string = pHuPaiInfo.mjdesc.join(",");
			touxiangkuang.getChildByName("hupai").color = cc.hexToColor(ying.active?gameEndColor.yingYellowColor:gameEndColor.normalBlackColor);

			touxiangkuang.getChildByName("fan").getComponent(cc.Label).string = "x" + pHuPaiInfo.baseWin + "番";
			touxiangkuang.getChildByName("fan").color = cc.hexToColor(ying.active?gameEndColor.yingYellowColor:gameEndColor.normalBlackColor);


			if (this.sData.tData.gameKind === "goldgame") {
				var sorce = parseInt(pHuPaiInfo.goldCoin) + parseInt(this.sData.tData.needPayCoin);
				if(sorce >= 0){
					sorce = "+"+(parseInt(pHuPaiInfo.goldCoin) + parseInt(this.sData.tData.needPayCoin));
				}
				item.getChildByName("fen").getComponent(cc.Label).string = sorce;
			} else {
				var sorce = pHuPaiInfo.winone;
				if(pHuPaiInfo.winone >= 0){
					sorce = "+"+pHuPaiInfo.winone;
				}
				item.getChildByName("fen").getComponent(cc.Label).string = sorce;
			}
			item.getChildByName("fen").color = cc.hexToColor(ying.active?gameEndColor.yingYellowColor:gameEndColor.normalBlackColor);

			//手牌分成了5组,处理4组
			for (var j = 0; j < 4; j++) {
				var group = huMjhands.getChildByName("group" + j);
				group.getChildByName("normal").active = true;
				group.getChildByName("angang").active = false;
				group.getChildByName("peng").active = false;
				group.getChildByName("minggang").active = false;

				if (j < localPlayersPGHS.mjangang.length) {
					group.getChildByName("normal").active = false;
					group.getChildByName("angang").active = true;
					for (var b = 0; b < 3; b++) {
						group.getChildByName("angang").getChildByName("B_bamboo_" + b).getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(localPlayersPGHS.mjangang[j], "B");
					}
					continue;
				}

				if (j - localPlayersPGHS.mjangang.length < localPlayersPGHS.mjgang.length) {
					group.getChildByName("normal").active = false;
					group.getChildByName("minggang").active = true;
					for (var b = 0; b < 3; b++) {
						group.getChildByName("minggang").getChildByName("B_bamboo_" + b).getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(localPlayersPGHS.mjgang[j - localPlayersPGHS.mjangang.length], "B");
					}
					group.getChildByName("minggang").getChildByName("gang").getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(localPlayersPGHS.mjgang[j - localPlayersPGHS.mjangang.length], "B");
					continue;
				}

				if (j - localPlayersPGHS.mjangang.length - localPlayersPGHS.mjgang.length < localPlayersPGHS.mjpeng.length) {
					group.getChildByName("normal").active = false;
					group.getChildByName("peng").active = true;
					for (var b = 0; b < 3; b++) {
						group.getChildByName("peng").getChildByName("B_bamboo_" + b).getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(localPlayersPGHS.mjpeng[j - localPlayersPGHS.mjangang.length - localPlayersPGHS.mjgang.length], "B");
					}
					continue;
				}

				var normal = group.getChildByName("normal");
				var normalIndex = j - localPlayersPGHS.mjangang.length - localPlayersPGHS.mjgang.length - localPlayersPGHS.mjpeng.length;
				for (var b = 0; b < 3; b++) {
					var paiSpriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(playerHands[normalIndex * 3 + b], "M");
					normal.getChildByName("hand_" + b).getComponent(cc.Sprite).spriteFrame = paiSpriteFrame;
					if (playerHands[normalIndex * 3 + b] === this.sData.tData.haozi) {
						normal.getChildByName("hand_" + b).getChildByName("dt_play_laizi_img").active = true;
					} else {
						normal.getChildByName("hand_" + b).getChildByName("dt_play_laizi_img").active = false;
					}
				}
			}

		}

		if (this.sData.tData.gameKind != "goldgame") {
			this.showEndOne();
		}
		this.playerTool.setHead(headUrls, headUrlNodes);
	},

	showEndOne: function() {
		var self = this;
		cc.logManager.info("隐藏骰子，显示结算界面------");
		var timeCallback = function(dt) {
			cc.jsInstance.block.hide();
			self.endOne.active = true;
		}
		this.scheduleOnce(timeCallback, 1.5);
	},

	endRoom: function() {
		var self = this;
		cc.logManager.info("进入等待匹配状态-----------------");
		self.waitting.OpenWaitting(cc.jsInstance.data.incontestUniqueId, function() {});
	},

	nextRoundClick: function() {
		if (this.sData.tData.gameKind === "goldgame") {
			if (cc.jsInstance.data.incontest) {
				cc.logManager.info("------还存在，继续------");
				this.endOne.active = false;
				goldgameEnd.continueMJPlayground(this.waitting,this.endOne);
			} else {
				cc.logManager.info("------不存在，重新加入------");
				goldgameEnd.recontinueMJPlayground(this.waitting,this.endOne);
			}
		} else {
			this.endOne.active = false;
			var tableManager = this.getComponent("tableManager");
			tableManager.initTableUIForNextRound();
		}
		cc.jsInstance.network.tableMsgMJPassMy();
	},

	//全部
	showAllRoundEndUI: function(data) {
		//处理数据
		this.tData = cc.jsInstance.data.sData.tData;
		var playInfos = data.playInfo;
		if (!playInfos) {
			cc.logManager.error("没有玩家信息");			
			return;
		}
		var players = playInfos.players;
		var headUrls = [];
		var headUrlNodes = [];
		var finalBg = this.endFinal.getChildByName("finalBg");
		finalBg.getChildByName("tableid").getComponent(cc.Label).string = "房间号:" + this.sData.tData.tableid;
		finalBg.getChildByName("time").getComponent(cc.Label).string = this.playerTool.getCurrentDate();
		if(this.tData.desktop > 0){
			finalBg.getChildByName("tableid").getComponent(cc.Label).string = unescape(this.tData.clubName).substr(0,6)+" 亲友圈"+this.tData.desktop+"号桌";
		}

		for (var i = 0; i < 4; i++) {
			var content = this.endFinal.getChildByName("finalBg").getChildByName("content");
			var item = content.getChildByName("item" + i);
			item.active = false;
		}

		//此处进行以自己为开始位置的逆时针排序展示结算手牌
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
					cc.logManager.info("yes ===");
					haveSortPlayers.push(pl);
					break;
				}
			}
		}

		var maxScore = 0;
		cc.logManager.info("haveSortPlayers ===", haveSortPlayers);
		for (var i = 0; i < haveSortPlayers.length; i++) {
			//获取节点
			var player = haveSortPlayers[i];
			var content = this.endFinal.getChildByName("finalBg").getChildByName("content");
			var item = content.getChildByName("item" + i);
			item.active = true;
			//要赋值的节点
			var nameNode = item.getChildByName("name");
			if (player.nickname) {
				nameNode.getComponent(cc.Label).string = unescape(player.nickname).substr(0, 6);
			} else {
				nameNode.getComponent(cc.Label).string = player.name;
			}

			if (player.headimgurl) {
				headUrls.push(player.headimgurl);
				headUrlNodes.push(item.getChildByName("head"));
			}

			var idNode = item.getChildByName("id");
			idNode.getComponent(cc.Label).string = "ID:" + player.uid;

			if (this.tData.roomOwner) {
				if (player.uid === this.tData.roomOwner.uid&&!this.tData.desktop) {
					item.getChildByName("owner").active = true;
				} else {
					item.getChildByName("owner").active = false;
				}
			} else {
				if (this.tData.uids[0] === player.uid&&!this.tData.desktop) {
					item.getChildByName("owner").active = true;
				} else {
					item.getChildByName("owner").active = false;
				}
			}

			var fenNode = item.getChildByName("fen");
			var sorce = player.winall;
			if(sorce >=0 ){
				sorce = "+"+player.winall;
			}
			fenNode.getComponent(cc.Label).string = sorce;
			//拿到本局最高分
			if(player.winall >= maxScore){
				maxScore = player.winall;
			}

			var winTagNode = item.getChildByName("winTag");
			if (player.winall > 0) {
				winTagNode.active = true;
			} else {
				winTagNode.active = false;
			}
		}

		for (var i = 0; i < haveSortPlayers.length; i++) {
			var player = haveSortPlayers[i];
			var item = content.getChildByName("item" + i);
			var winTagNode = item.getChildByName("winTag");
			var queshenNode = winTagNode.getChildByName("queshen");
			if(player.winall === maxScore){
				queshenNode.active = true;
			}else{
				queshenNode.active = false;
			}
		}

		this.playerTool.setHead(headUrls, headUrlNodes);
		var self = this;
		var timeCallback = function(dt) {
			self.endFinal.active = true;
			self.deleteMaskNode.active = false;
		}
		this.scheduleOnce(timeCallback, 3);
	},

	hiddenEndFinal: function() {
		this.endFinal.active = false;
	},

	loadLobby: function() {
		cc.jsInstance.block.show();
		cc.director.preloadScene("lobby", function() {
			cc.jsInstance.HavePlayStartAnim = false;
			cc.loader.onProgress = null;
			cc.director.loadScene("lobby");
			cc.jsInstance.block.hide();
		});
	},


	// update (dt) {},
});