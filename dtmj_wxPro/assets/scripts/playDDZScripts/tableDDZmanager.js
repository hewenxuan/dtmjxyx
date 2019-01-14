//牌桌内容和状态的管理类
var tableRules =require("tableRulers");
var tipsStr = {
	baseScoreStr:"底分：",
	multipleStr:"倍数：x",
	gameNotBeginTip:"游戏未开始，解散房间将不会扣除元宝",
	dissolveRoomStr:"你申请解散包厢",
	dissolveRoomRightStr:"]申请解散包厢",
	playerLeftStr:"玩家[",
	haveAgreeStr:"你已经同意",
	haveAgreeLeftStr:"]已经同意",
	waitChooseRightStr:"]等待选择",
	roomHaveBeenStr:"包厢已被",
	dissolveAndTryAgainStr:"解散，请重新加入游戏",
	haveBeenDissolvedByHostStr:"房间已被亲友圈房主/管理员解散，请重新加入游戏！",
	haveBeenTickRStr:"'管理员踢出亲友圈",
	haveBeenTickLStr:"您已经被'",
}

var color = {
	agreeBuleColor:"#1664C3",
	waitRedColor:"#7e0c00",
}

cc.Class({
    extends: cc.Component,

    properties: {
       playDDZBegin:{
           type:cc.Node,
           default: null,
       },

       tableDDZInfo:{
           type:cc.Node,
           default:null,
       },

       playDDZPlaying:{
            type:cc.Node,
            default:null,
       },

       defaultHeadIcon:{
           type:cc.SpriteFrame,
           default:null,
       },

       placeHolderHeadIcon:{
           type:cc.SpriteFrame,
           default:null,
       },

       tableSettingMaskNode:{
            type:cc.Node,
            default:null,
       },

       deleteMaskNode:{
            type:cc.Node,
            default:null,
       },

       endOne:{
            type:cc.Node,
            default:null,
       },

       endFinal:{
            type:cc.Node,
            default:null,
	   },
	   
	   friendItem:{
		type: cc.Prefab,
		default: null,
	},
       
    },

    initTableInfoUI:function(){
		var roomInfoBgNode = this.tableDDZInfo.getChildByName("roomInfoBg");
		var sorceLabNode = roomInfoBgNode.getChildByName("socreBg").getChildByName("socrcTextLab");
		var multiple = roomInfoBgNode.getChildByName("multipleBg").getChildByName("multipleLab");
        var tableId = roomInfoBgNode.getChildByName("tableNumLab");
        var roundNum = roomInfoBgNode.getChildByName("roundNumLab");
        var playRule = roomInfoBgNode.getChildByName("playRuleInfo");

		if(this.tData.baseScore!=0){
			sorceLabNode.getComponent(cc.Label).string = tipsStr.baseScoreStr+this.tData.baseScore;
		}else{
			sorceLabNode.getComponent(cc.Label).string = tipsStr.baseScoreStr;
		}

		if(this.tData.multiple!=0){
			multiple.getComponent(cc.Label).string = tipsStr.multipleStr+this.tData.multiple;
		}else{
			multiple.getComponent(cc.Label).string = tipsStr.multipleStr+(this.tData.multiple+1);
		}

		if(this.tData.desktop > 0){
			tableId.getComponent(cc.Label).string = unescape(this.tData.clubName).substr(0,6)  + " 亲友圈  "+ this.tData.desktop+"号桌";
		}else{
			tableId.getComponent(cc.Label).string = "房间号："+this.tData.tableid;
		}

		roundNum.getComponent(cc.Label).string = "剩余"+(this.tData.roundNum-1)+"局";
		
        playRule.getComponent(cc.Label).string = this.tData.bombLime==="100"?"炸弹不封顶":this.tData.bombLime+"个炸封顶";

        if(!this.tData.remainPokers.length){
            this.tData.remainPokers = [0,0,0];
		}
		
		this.tData.remainPokers.sort(function(a,b){
            return (a%100) - (b%100);
		})
		
        for(let i = 0; i < this.tData.remainPokers.length;i++){
            var card = roomInfoBgNode.getChildByName("backCard"+i);
            card.getComponent(cc.Sprite).spriteFrame = this.playDDZSpriteManager.getSmallPockerSpriteFrame(this.tData.remainPokers[i]);
        }
    },

	//刷新叫地主的倍数
    refreshTableInfoMultipleData:function(){
		this.tData = cc.jsInstance.data.sData.tData;
		
		var multipleNum = Math.pow(2,this.tData.bombLime);
		var multiple = this.tableDDZInfo.getChildByName("roomInfoBg").getChildByName("multipleBg").getChildByName("multipleLab");

		var currentBomb = Math.pow(2,this.tData.bombNumber);
		var maxBombLime = Math.pow(2,this.tData.bombLime);
		if(this.tData.bombLime!=100&& currentBomb > maxBombLime){
			multipleNum = maxBombLime;
		}else{
			multipleNum = currentBomb;
		}

		if(multipleNum===0){
			multiple.getComponent(cc.Label).string = tipsStr.multipleStr+(this.tData.multiple+1);
		}else{
			multiple.getComponent(cc.Label).string = tipsStr.multipleStr+multipleNum;
		}
    },

    //点击下一局 牌桌初始化
    nextRoundClick:function(){
        this.endOne.active = false;
        this.playDDZPlaying.active = false;
        this.playDDZBegin.active = true;
		this.playDDZSent.passClick("nextRound");
		this.tData.baseScore = 0;
		this.tData.multiple = 0;
		this.tData.remainPokers = [0,0,0];
		this.initTableInfoUI();
        this.initPlayingUI();
    },

    nextRoundReadyShow:function(data){
        var index = this.playerTool.transformUidsLocation(data.detail.uid);
        index = this.playerTool.getIndexByGameKind(index);
        var myself = this.playDDZBegin.getChildByName("myself");
        var right = this.playDDZBegin.getChildByName("right");
        var left = this.playDDZBegin.getChildByName("left");
        var beginArr = [myself,right,left];
        
        var currentReadyPlayer = beginArr[index];
        //准备的状态
        if(data.detail.mjState === 7&&this.tData.tState!=1){
			currentReadyPlayer.getChildByName("ready").active = true;
        }else{
            currentReadyPlayer.getChildByName("ready").active = false;
        }

        if(this.tData.tState != this.tableState.waitJoin){
            this.playDDZBegin.getChildByName("delRoomOrInviteFriend").active = false;
        }

        if(data.detail.onLine){
            currentReadyPlayer.getChildByName("headLeave").active = false;
        }else{
            currentReadyPlayer.getChildByName("headLeave").active = true;
		}
		
		if(data.detail.mjState === 7){
			this.initPlayDDZBeginUI();
		}
    },

    initPlayingUI:function(){
        var myself = this.playDDZPlaying.getChildByName("myself");
        var left = this.playDDZPlaying.getChildByName("left");
        var right = this.playDDZPlaying.getChildByName("right");

        var tempArr = [myself,right,left];

        for(let i = 0;i < tempArr.length;i++){
            var tempItem = tempArr[i];
            tempItem.getChildByName("isLandLords").active = false;
            for(let j = 0; j < 20;j++){
                if(i === 0){
                    tempItem.getChildByName("poker").getChildByName("card"+j).active = false;
                }
                tempItem.getChildByName("cardPut").getChildByName("Card"+j).active = false;
            }
        }
        left.getChildByName("warn").active = false;
		right.getChildByName("warn").active = false;

		var myTurnLandClaim = myself.getChildByName("myTurnLandClaim");
        myTurnLandClaim.getChildByName("nosocreBtn").active = true;
		myTurnLandClaim.getChildByName("nosocreBtn").getComponent(cc.Button).interactable = true;
        myTurnLandClaim.getChildByName("oneSocreBtn").active = true;
		myTurnLandClaim.getChildByName("oneSocreBtn").getComponent(cc.Button).interactable = true;
		myTurnLandClaim.getChildByName("twoSocreBtn").active = true;
        myTurnLandClaim.getChildByName("twoSocreBtn").getComponent(cc.Button).interactable = true;
        myTurnLandClaim.getChildByName("threeSocreBtn").active = true;
        myTurnLandClaim.getChildByName("threeSocreBtn").getComponent(cc.Button).interactable = true;
    },

    initPlayDDZBeginUI:function(){
        var headUrls = [];
		var headUrlNodes = [];
        var num = 3;//斗地主

        var left = this.playDDZBegin.getChildByName("left");
        var myself = this.playDDZBegin.getChildByName("myself");
        var right = this.playDDZBegin.getChildByName("right");
        var headNodes = [myself,right,left];

		for (var index = 0; index < num; index++) {

			var pInfo = this.playerTool.getUIPlayer(index);
            index = this.playerTool.getIndexByGameKind(index);
            var locationHead = headNodes[index];
			var playBeginHead = locationHead.getChildByName("mask").getChildByName("head");
			var playerSocreBg = locationHead.getChildByName("playerSocreBg");
            playerSocreBg.getChildByName("nameLab").active = true;
			playerSocreBg.getChildByName("sorceLab").active = true;

			if (pInfo) {

				//头像
				if (pInfo.info.headimgurl) {
					headUrls.push(pInfo.info.headimgurl);
					headUrlNodes.push(playBeginHead);
				}else{
					playBeginHead.getComponent(cc.Sprite).spriteFrame = this.defaultHeadIcon;
				}

				//昵称
				var nameLab = playerSocreBg.getChildByName("nameLab");
				if (pInfo.info.nickname) {
					nameLab.getComponent(cc.Label).string = unescape(pInfo.info.nickname).substr(0, 6);
				} else {
					nameLab.getComponent(cc.Label).string = pInfo.info.name;
				}

				playerSocreBg.getChildByName("sorceLab").getComponent(cc.Label).string = parseInt(this.sData.tData.initCoin) + parseInt(pInfo.winall);
				
				if(this.tData.tState != 1){
					if (pInfo.mjState === 7) {
						locationHead.getChildByName("ready").active = true;
					} else {
						locationHead.getChildByName("ready").active = false;
					}
				}

				if (pInfo.onLine) {
					locationHead.getChildByName("headLeave").active = false;
				} else {
					locationHead.getChildByName("headLeave").active = true;
				}

			} else {
				locationHead.getChildByName("ready").active = false;
				locationHead.getChildByName("playerSocreBg").getChildByName("nameLab").active = false;
				locationHead.getChildByName("playerSocreBg").getChildByName("sorceLab").active = false;
                locationHead.getChildByName("headLeave").active = false;
                playBeginHead.getComponent(cc.Sprite).spriteFrame = this.placeHolderHeadIcon;
			}
		}

		if(headUrls.length > 0){
			this.playerTool.setHead(headUrls, headUrlNodes);
		}
    },

    tableInvite: function() {
		var rulerArr = tableRules.getGameRulersInfo(this.sData,true);
		var rulerStr = rulerArr.join(",");

		cc.logManager.info("rulerstr==",rulerStr);
		if (cc.sys.platform === cc.sys.WECHAT_GAME) {
			cc.jsInstance.block.showBlank();
		}

		if(this.tData.desktop > 0){
			var inviteForClub = {
				"clubid": this.tData.groupid,
				"tableid": this.tData.tableid,//房间号，-1代表没房间
				"desktop": this.tData.desktop,//桌子号
			};
			cc.jsInstance.native.wxInviteShareUrlClubRoom(rulerStr,inviteForClub);
		}else{
			cc.jsInstance.native.wxInviteShareUrl(rulerStr, this.tData.tableid);
		}
    },
    
    deleteRoom: function() {
		var self = this;
		if (this.isOwner&&!this.tData.desktop) {
			cc.jsInstance.network.tableMsgDelRoom(true);
			cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(tipsStr.gameNotBeginTip, function() {
				cc.jsInstance.audioManager.playBtnClick();
				self.sendExitRoomMsg();
			})
		} else {
			this.backClick();
		}
	},

    deleteRoomInGame: function() {
		var tState = this.tData.tState
		this.tableSettingMaskNode.active = false;
		if (tState === 1) {
			this.deleteRoom();
		} else {
			cc.jsInstance.network.tableMsgDelRoom(true);
			this.deleteNodeBg.getChildByName("ok").active = false;
			this.deleteNodeBg.getChildByName("back").active = false;
		}
    },
    
    rejectDeleteRoomInGame: function() {
		cc.jsInstance.network.tableMsgDelRoom(false);
    },
    
    settingMaskCloseClick: function() {
		this.tableSettingMaskNode.active = false;
    },

    setDeleteMaskNodeData: function(data) {
		this.getleftTime();
		this.deleteMaskNode.active = true;
		this.playerTool.playScaleForLayer(this.deleteNodeBg);
		var titleNode = this.deleteNodeBg.getChildByName("title");

		var players = data.players;

		//有人拒绝了
		if (data.tData.firstDel < 0) {
			this.deleteMaskNode.active = false;
			this.deleteTimeLeft = 5 * 60;
			this.deleteNodeBg.getChildByName("ok").active = true;
			this.deleteNodeBg.getChildByName("back").active = true;
			return;
		}

		var uidKeys = [];

		for (var key in players) {
			uidKeys.push(key);
		}

		var index = uidKeys.indexOf('' + data.tData.firstDel); //转字符串
		if (index >= 0) {
			uidKeys.splice(index, 1);
		}

		//赋值部分
		if (data.tData.firstDel === this.currentUserId) {
			titleNode.getComponent(cc.Label).string = tipsStr.dissolveRoomStr;
			this.deleteNodeBg.getChildByName("ok").active = false;
			this.deleteNodeBg.getChildByName("back").active = false;
		} else {
			var playNickName = this.sData.players[data.tData.firstDel].info.nickname;
			titleNode.getComponent(cc.Label).string = tipsStr.playerLeftStr + unescape(this.sData.players[data.tData.firstDel].info.name) + tipsStr.dissolveRoomRightStr;
			if (playNickName) {
				titleNode.getComponent(cc.Label).string =tipsStr.playerLeftStr + unescape(playNickName).substr(0, 6) + tipsStr.dissolveRoomRightStr;
			}
		}

		for (var i = 0; i < uidKeys.length; i++) {
			var playInfo = this.sData.players[uidKeys[i]];
			// console.log("playInfo==", playInfo);
			var playName = playInfo.info.name;
			var playNickName = playInfo.info.nickname;
			var playerLab = this.deleteNodeBg.getChildByName("player" + i);
			var isAgree = players[uidKeys[i]].delRoom;
			if (isAgree) {
				if (playInfo.info.uid === this.currentUserId) {
					playerLab.getComponent(cc.Label).string = haveAgreeStr;
					this.deleteNodeBg.getChildByName("ok").active = false;
					this.deleteNodeBg.getChildByName("back").active = false;
				} else {
					playerLab.getComponent(cc.Label).string = tipsStr.playerLeftStr + unescape(playName) + tipsStr.haveAgreeLeftStr;
					if (playNickName) {
						playerLab.getComponent(cc.Label).string = tipsStr.playerLeftStr + unescape(playNickName).substr(0, 6) + tipsStr.haveAgreeLeftStr;
					}
				}
				playerLab.color = cc.hexToColor(color.agreeBuleColor);
			} else {
				playerLab.getComponent(cc.Label).string = tipsStr.playerLeftStr + unescape(playName) + tipsStr.waitChooseRightStr;
				if (playNickName) {
					playerLab.getComponent(cc.Label).string = tipsStr.playerLeftStr + unescape(playNickName).substr(0, 6) + tipsStr.waitChooseRightStr;
				}
				playerLab.color = cc.hexToColor(color.waitRedColor);
			}
		}
	},

	getleftTime(){
		this.tData = cc.jsInstance.data.sData.tData;
		if (!this.deleteMaskNode.active) {
			var self = this;
			cc.jsInstance.network.tickServer(function(e){
				self.deleteTimeLeft = parseInt((self.tData.delEnd - e.serverRecvAt)/1000);
				if(self.deleteTimeLeft <= 0){
					self.deleteTimeLeft = 5 * 60;
				}
				self.deleteMaskNode.active = true;
			});
		}
	},
    
	backClick: function() {
		var self = this;
		if(self.tData.desktop>0){
			self.sendExitRoomMsg();
		}else{
			cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(this.showMsgText, function() {
				cc.jsInstance.audioManager.playBtnClick();
				if (self.isOwner) {
					self.loadLobby();
				} else {
					self.sendExitRoomMsg();
				}
			})
		}
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
    
    settingMaskCloseClick: function() {
		this.tableSettingMaskNode.active = false;
	},

	settingClick: function() {
		cc.jsInstance.audioManager.playBtnClick();
		this.tableSettingMaskNode.active = true;
		this.playerTool.playScaleForLayer(this.tableSettingMaskNode.getChildByName("surfaceLayer"));
    },

    playHelpShowBtnClick: function() {
		cc.jsInstance.audioManager.playBtnClick();
		cc.jsInstance.playHelp.showHelpWanfa("jdddz");
	},

    tableEnd:function(data){
		if(!data){
			return;
		}
        this.tData = cc.jsInstance.data.sData.tData;
		this.deleteMaskNode.active = false;
		this.playDDZPlaying.getChildByName("myself").getChildByName("myTurnPutCard").active = false;
        this.playDDZGameend.showOneRoundEndUI(data);
        if (data.detail.tData.roundNum === 0 || this.tData.firstDel > 0) {
            this.playDDZGameend.showAllRoundEndUI(data.detail);
		}
	},
	
	deleteTimerRun: function() {
		var timeNode = this.deleteNodeBg.getChildByName("timeLab");
		var self = this;
		this.schedule(function() {
			if (self.deleteTimeLeft > 0) {
				self.deleteTimeLeft--;
				timeNode.getComponent(cc.Label).string = parseInt(self.deleteTimeLeft / 60) + "分" + self.deleteTimeLeft % 60 + "秒 " + "之后自动同意";
			}
		}.bind(this), 1);
	},
    
    endRoom:function(data) {
		var self = this;
		this.deleteMaskNode.active = false;
		if (this.tData.firstDel >= 0) {
			if (!this.isOwner && this.tData.tState === 1) {
				var ownerID = this.tData.owner;
				var ownerName = this.sData.players[ownerID];
				if (ownerName.info.nickname) {
					cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(tipsStr.roomHaveBeenStr + unescape(ownerName.info.nickname).substr(0, 6) + tipsStr.dissolveAndTryAgainStr, function() {
						cc.jsInstance.audioManager.playBtnClick();
						self.sendExitRoomMsg();
					})
				} else {
					cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(tipsStr.roomHaveBeenStr + ownerName.info.name + tipsStr.dissolveAndTryAgainStr, function() {
						cc.jsInstance.audioManager.playBtnClick();
						self.sendExitRoomMsg();
					})
				}
			}
        }
        // this.playDDZGameend.showAllRoundEndUI(data.detail);
	},

	shareEnd: function() {
		cc.jsInstance.native.wxShareUrl("", function(ret) {
			cc.logManager.info("拉起成功");
		},function(ret) {
			cc.logManager.info("拉起失败");
		});
	},

    _tableInitData: function() {
		this.tData = cc.jsInstance.data.sData.tData;
		this.sData = cc.jsInstance.data.sData;
		this.currentTableState = this.tData.tState;
		this.leftRoundNum = this.tData.roundNum - 1;
		this.isQinyouquan = false; //亲友圈
		this.currentUserId = this.playerTool.getUserId();
		this.isOwner = false;
		this.deleteNodeBg = this.deleteMaskNode.getChildByName("bg");
		this.tableForClub = this.playDDZBegin.getChildByName("tableForClub");
		if (this.tData.owner === this.currentUserId) {
			this.showMsgText = "返回大厅包厢仍然保留,赶快去邀请好友吧";
			this.isOwner = true;
		} else {
			this.showMsgText = "返回大厅包厢将退出游戏,确定退出包厢吗?";
			this.isOwner = false;
		}

		this.tableState = {
			waitJoin: 1,
			waitReady: 2,
			waitPut: 3,
			waitEat: 4,
			waitCard: 5,
			roundFinish: 6,
			isReady: 7,
			waitRob: 8, //抢地主
		};

		if(cc.jsInstance.endRoomData&&cc.jsInstance.endRoomData.reason===3){
			this.beCleanedDesktopByOwner();
		}
    },
    
    _dealWithTableStatus: function() {
		switch (this.currentTableState) {
			case this.tableState.waitJoin:
				this._tableReady(true);
				break;
			case this.tableState.waitReady:
			case this.tableState.isReady:
			case this.tableState.roundFinish:
				this._tableReady(false);
				break;
			case this.tableState.waitPut:
            case this.tableState.waitCard:
            case this.tableState.waitRob:
				this._tablePlaying();
				break;
			default:
				cc.logManager.warn("未处理的牌桌状态！");
		}
    },
    
    _tableReady:function(isWaitJoin){
		this.playDDZBegin.active = true;
		if(this.isQinyouquan&&this.tData.tState === this.tableState.waitJoin){
			this.tableForClub.active = true;
		}else{
			this.tableForClub.active = false;
		}

		var inviteFriend = this.playDDZBegin.getChildByName("delRoomOrInviteFriend");
        this.playDDZPlaying.active = false;
        if(isWaitJoin){
            inviteFriend.active = true;
        }else{
            inviteFriend.active = false;
		}

		if (this.tData.firstDel > 0) {
			this.getleftTime();
			this.playerTool.playScaleForLayer(this.deleteNodeBg);
			this.setDeleteMaskNodeData(this.sData);
		} else {
			if (this.currentTableState != this.tableState.roundFinish) {
				this.deleteMaskNode.active = false;
				this.deleteTimeLeft = 5 * 60;
			}
		}
		
        this.initPlayDDZBeginUI();
	},
	
	

    _tablePlaying:function(){	
		this.playDDZBegin.getChildByName("friendListBg").active = false;
		this.playDDZBegin.active = false;
		this.playDDZPlaying.active = true;
		if (this.tData.firstDel > 0) {
			this.getleftTime();
			this.playerTool.playScaleForLayer(this.deleteNodeBg);
			this.setDeleteMaskNodeData(this.sData);
		} else {
			this.deleteMaskNode.active = false;
			this.deleteTimeLeft = 5 * 60;
		}
	},
	
	dealWithDeskForFriendsCricle:function(){
		;
		if(this.tData.desktop > 0&&this.tData.tState === this.tableState.waitJoin){
			this.tableForClub.active = true;
		}else{
			this.tableForClub.active = false;
		}
	},

	haveBeenRemoveClub:function(data){
		// console.log("haveBeenRemoveClub==",data);
		if(data.kick){
			cc.jsInstance.msgpop.showMsg_text_close_nocancle_noensure(tipsStr.haveBeenTickLStr+data.clubName+tipsStr.haveBeenTickRStr,function(){
			});
		}
	},

	//牌桌被清除
	beCleanedDesktopByOwner:function(){
		var self = this;
		cc.jsInstance.endRoomData.reason = -1;
		cc.jsInstance.msgpop.showMsg_text_close_nocancle_noensure(tipsStr.haveBeenDissolvedByHostStr,function(){
			self.sendExitRoomMsg();
		});
	},
	//*****亲友圈邀请部分结束 */

    onLoad () {
        this.playerTool = this.getComponent('playerTool');
        this.playDDZSpriteManager = this.getComponent('playDDZSpriteManager');
        this.playDDZSent = this.getComponent('playDDZSent');
		this.playDDZGameend = this.getComponent('playDDZGameend');
		this.tableInit();
		this.deleteTimerRun();
		if(cc.jsInstance.endRoomData&&cc.jsInstance.endRoomData.reason  >= 0&&!this.tData.desktop){
			//刚加入就被解散了
			cc.jsInstance.endRoomData.reason = -1;
			this.endRoom(cc.jsInstance.endRoomData);
			return;
		}
		//存放预制体的缓存池
		this.prefabItemCachePool = [];
		this.prefabItemNameArr = [];
	},
	
	tableInit:function(){
		this._tableInitData();
		this._dealWithTableStatus();
		this.initTableInfoUI();
		this.dealWithDeskForFriendsCricle();
	},

    start () {

    },

    // update (dt) {},
});
