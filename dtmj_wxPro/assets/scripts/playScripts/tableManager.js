/**
 * 控制牌桌UI的管理类
 * 控制牌桌准备，开始，删除，退出状况的UI的隐藏和显示
 */
var tableRules = require("./tableRulers.js");

var timeLeft = {
	agreeTimeLeft:59,
	deleteTimeLeft:5 * 60,
};

cc.Class({
	extends: cc.Component,

	properties: {
		tableInfoNode: {
			type: cc.Node,
			default: null,
		},

		rulersNode: {
			type: cc.Node,
			default: null,
		},

		timerNode: {
			type: cc.Node,
			default: null,
		},

		tableSettingMaskNode: {
			type: cc.Node,
			default: null,
		},

		deleteMaskNode: {
			type: cc.Node,
			default: null,
		},

		playBegin: {
			type: cc.Node,
			default: null,
		},

		plaYing: {
			type: cc.Node,
			default: null,
		},

		playEatFlag: {
			type: cc.Node,
			default: null,
		},
		currentTableState: 0,
		leftCardNum: 56,
		leftRoundNum: 0,
		currentPlayerIndex: 0,
		putPaiTimeLeft: 15,
		rulerArr: [],

		friendItem:{
			type: cc.Prefab,
            default: null,
		},

	},

	tableInit: function() {
		this.gameEndUIManager = this.getComponent('gameEnd');
		this.playerTool = this.getComponent('playerTool');
		this.getSpriteFrame = this.getComponent("playGetPaiSpriteFrame");
		cc.logManager.info("tableManager gobal players ==");
		this._tableInitData();
		this._setTableInfoData();
		this._dealWithTableStatus();
		this.showBtnForThreeOrTwoPeople();
		this.node.getChildByName("startNowMask").active = false;
		this.setShowMaskForStartRightNowData(this.tData);
		if(cc.jsInstance.endRoomData&&cc.jsInstance.endRoomData.reason===3){
			this.beCleanedDesktopByOwner();
		}
	},

	updateTableLeftCardNum: function() {
		this._dealWithTableStatus(); //隐藏和显示相应的桌面UI
		this._setLeftCardNum();
		//赋值
		this.tableInfoNode.getChildByName("CardNum").getChildByName("cardNum").getComponent(cc.Label).string = this.leftCardNum;
	},

	_dealWithTableStatus: function() {
		switch (this.currentTableState) {
			case this.tableState.waitJoin:
				this._tableReady(false);
				break;
			case this.tableState.waitReady:
			case this.tableState.isReady:
			case this.tableState.roundFinish:
				this._tableReady(true);
				break;

			case this.tableState.waitPut:
			case this.tableState.waitEat:
			case this.tableState.waitCard:
				this._tablePlaying();
				break;
			default:
				cc.logManager.error("未处理的牌桌状态");
		}
	},

	_tableReady: function(isOneRoundEnd) {
		this.plaYing.active = false;
		this.playBegin.active = true;
		this.showBtnForThreeOrTwoPeople();

		this.PlayTableInfo.getChildByName("CardNum").active = false;
		this.PlayTableInfo.getChildByName("RoundNum").active = false;
		if (this.playerTool.isForTwoPlayers()) {
			this.playBegin.getChildByName("playHead_1").active = false;
			this.playBegin.getChildByName("playHead_3").active = false;
			this.playBegin.getChildByName("playHead_2").active = true;
		} else if (this.playerTool.isForThreePlayers()) {
			this.playBegin.getChildByName("playHead_2").active = false;
		}

		if (isOneRoundEnd) {
			this.playBegin.getChildByName("inviteFriendsBtn").active = false;
			this.playBegin.getChildByName("dissolutionBtn").active = false;
		} else if (this.tData.gameKind === "goldgame") {
			this.playBegin.getChildByName("inviteFriendsBtn").active = false;
			this.playBegin.getChildByName("dissolutionBtn").active = false;
			this.node.getChildByName("playHelpShowBtn").active = false;
			this.node.getChildByName("setting").active = false;
		} else {
			this.playBegin.getChildByName("inviteFriendsBtn").active = true;
			this.playBegin.getChildByName("dissolutionBtn").active = true;
		}

		if (this.tData.firstDel > 0) {
			this.getLeftTime();
			this.playerTool.playScaleForLayer(this.deleteMaskNode.getChildByName("bg"));
			this.setDeleteMaskNodeData(this.sData);
		} else {
			if (this.currentTableState != this.tableState.roundFinish) {
				this.deleteMaskNode.active = false;
				this.deleteTimeLeft = timeLeft.deleteTimeLeft;
			}
		}
	},

	showBtnForThreeOrTwoPeople:function(){

		if(this.tData.desktop > 0&&this.tData.tState === this.tableState.waitJoin){
			this.playBegin.getChildByName("friendBtn").active = true;
		}else{
			this.playBegin.getChildByName("friendBtn").active = false;
			this.playBegin.getChildByName("friendListBg").active = false;
		}

		if(!(this.tData.tuidaohu||this.tData.kouDian||this.tData.guaisanjiao)){
			this.hiddenBtnForThreeOrTwoPeople();
			return;
		}

		var clubs;
		var isImmediately = false;
		if(this.tData.desktop > 0){
			clubs = cc.jsInstance.clubs;
			for(var i = 0; i < clubs.length;i++){
				var club = clubs[i];
				if(club._id === this.tData.groupid){
					isImmediately = typeof(club.settings.immediately)==="undefined"?true:club.settings.immediately;
					break;
				}
			}
		}
		
		if(this.tData.tState === this.tableState.waitJoin&&isImmediately){
			if(this.tData.desktop > 0){
					//亲友圈的立刻开始的可不可点击状态
				this.tableForClub.active = true;
				this.tableForClub.getChildByName("tipsLab").active = true;
				if(Object.keys(this.sData.players).length > 1){
					this.tableForClub.getChildByName("startNowOrange").active = true;
					this.tableForClub.getChildByName("startNowGray").active = false;
				}else{
					this.tableForClub.getChildByName("startNowOrange").active = false;
					this.tableForClub.getChildByName("startNowGray").active = true;
				}
			}
		}else{
			this.hiddenBtnForThreeOrTwoPeople();
		}
	},

	hiddenBtnForThreeOrTwoPeople:function(){
		this.tableForClub.getChildByName("startNowOrange").active = false;
		this.tableForClub.getChildByName("startNowGray").active = false;
		this.tableForClub.getChildByName("tipsLab").active = false;
	},

	showMaskForStartRightNow:function(data){
		this.setShowMaskForStartRightNowData(data.detail);
	},

	setShowMaskForStartRightNowData:function(data){
		var showType = data.showType;
		if(showType === "timeOver"){
			//超时，弹超时框
			this.node.getChildByName("startNowMask").active = false;
			this.resetAgreeTimeLeftString();
			window.clearInterval(this.timer);
			cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("有玩家未响应立即开局申请，请稍后再试！",
			function(){

			});
			return;
		}else if(showType === "reject"){
			//弹谁谁谁已经拒绝
			var rejectPlayerIndex = this.playerTool.transformUidsLocation(parseInt(data.uid));
			var rejectPlayerInfo = this.playerTool.getUIPlayer(rejectPlayerIndex);
			var rejectPlayerNickName = rejectPlayerInfo.info.nickname;
			var rejectPlayerName = rejectPlayerInfo.info.name;
			var rejectName = rejectPlayerNickName?rejectPlayerNickName:rejectPlayerName;
			this.node.getChildByName("startNowMask").active = false;
			this.resetAgreeTimeLeftString();
			window.clearInterval(this.timer);
			cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("玩家【"+unescape(rejectName).substr(0, 6)+"】不同意立即开局！",
			function(){

			});
			return;
		}else if(showType === "change"){
			this.node.getChildByName("startNowMask").active = false;
			this.resetAgreeTimeLeftString();
			cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("房间已有玩家离开或进来新玩家！",function(){

			});
			return;
		}

		if(!data.immediatelyObj||!data.immediatelyObj.applicantUID||!Object.keys(data.immediatelyObj.stateArr).length){
			if(this.timer){
				this.resetAgreeTimeLeftString();
				window.clearInterval(this.timer);
			}
			return;
		}

		var requriePlayerIndex = this.playerTool.transformUidsLocation(parseInt(data.immediatelyObj.applicantUID));
		var requriePlayerInfo = this.playerTool.getUIPlayer(requriePlayerIndex);
		var requriePlayerNickName = requriePlayerInfo.info.nickname;
		var requriePlayerName = requriePlayerInfo.info.name;
		var bgNode = this.node.getChildByName("startNowMask").getChildByName("bg");
		var requireName = (requriePlayerNickName?requriePlayerNickName:requriePlayerName)
		bgNode.getChildByName("dt_wenzi_bg").getChildByName("title").getComponent(cc.Label).string = "玩家【"+unescape(requireName).substr(0, 6) +"】申请立刻开局，等待其他玩家选择";
		var stateArr = data.immediatelyObj.stateArr;
		var self = this;
		var callback = function(){
			if(self.timeAgreeLeft > 0){
				bgNode.getChildByName("timeLab").getComponent(cc.Label).string = "注：超过60秒未做出选择，则默认拒绝。剩余"+(self.timeAgreeLeft--)+"秒"
			}
		};

		if(!this.node.getChildByName("startNowMask").active){
			var self = this;
				cc.jsInstance.network.tickServer(function(e){
					self.timeAgreeLeft = parseInt((data.immediatelyObj.endTime -e.serverRecvAt)/1000-1);
					if(self.timeAgreeLeft <=0){
						self.timeAgreeLeft = timeLeft.agreeTimeLeft;
						self.resetAgreeTimeLeftString();
					}
					self.node.getChildByName("startNowMask").active = true;
				});
			 this.timer = window.setInterval(callback,1000);
		}

		

		var keys = [];
		for (var key in stateArr) {
			if(key!= data.immediatelyObj.applicantUID){
				keys.push(key);
			}
		}

		//先隐藏
		for(var i = 0; i < 2;i++){
			 bgNode.getChildByName("player"+i).active = false;
		}

		if(this.playerTool.getUserId()===data.immediatelyObj.applicantUID){
			bgNode.getChildByName("ok").active = false;
			bgNode.getChildByName("back").active = false;
		}else{
			bgNode.getChildByName("ok").active = true;
			bgNode.getChildByName("back").active = true;
		}
		
		for(var i = 0; i < keys.length;i++){
			var tempPlayerIndex = this.playerTool.transformUidsLocation(parseInt(keys[i]));
			console.log("tempPlayerIndex==",tempPlayerIndex);
			var tempPlayerInfo = this.playerTool.getUIPlayer(tempPlayerIndex);
			var tempPlayerNickName = tempPlayerInfo.info.nickname;
			var tempPlayerName = tempPlayerInfo.info.name;

			var nameNode = bgNode.getChildByName("player"+i);
			var nameStr = (tempPlayerNickName?tempPlayerNickName:tempPlayerName);
			nameNode.active = true;
			nameNode.getComponent(cc.Label).string = "玩家【"+unescape(nameStr).substr(0, 6)+"】";
			
			var playerStatesWaitNode = nameNode.getChildByName("dt_clubroom_wait_tip");
			var playerStatesAgreeNode = nameNode.getChildByName("dt_clubroom_agree_tip");
			var playerState = stateArr[keys[i]];
			if(playerState>0){
				playerStatesAgreeNode.active = true;
				playerStatesWaitNode.active = false;
				if(parseInt(keys[i]) === this.playerTool.getUserId()){
					bgNode.getChildByName("ok").active = false;
					bgNode.getChildByName("back").active = false;
				}
			}else{
				playerStatesAgreeNode.active = false;
				playerStatesWaitNode.active = true;
			}
		}
	},

	//获取时间戳，毫秒
	getLeftTime(){
		this.tData = cc.jsInstance.data.sData.tData;
		var self = this;
		if (!this.deleteMaskNode.active) {
			cc.jsInstance.network.tickServer(function(e){
				self.deleteTimeLeft = parseInt((self.tData.delEnd - e.serverRecvAt)/1000);
				if(self.deleteTimeLeft <= 0){
					self.deleteTimeLeft = timeLeft.deleteTimeLeft;
				};
				self.deleteMaskNode.active = true;
			});
		}
	},
	
	resetAgreeTimeLeftString:function(){
		var bgNode = this.node.getChildByName("startNowMask").getChildByName("bg");
		bgNode.getChildByName("timeLab").getComponent(cc.Label).string = "注：超过60秒未做出选择，则默认拒绝。剩余59秒"
	},

	agreeStartRightNow:function(){
		cc.jsInstance.network.immediatelyApply(1,function(data){
			console.log("同意立刻开始==");
		});
	},

	disagreeStartRightNow:function(){
		cc.jsInstance.network.immediatelyApply(0,function(data){
			console.log("不同意立刻开始==");
		});
	},

	//立刻开始
	startRightNow:function(){
		console.log("tdata==",this.sData);
		cc.jsInstance.network.immediatelyStart(Object.keys(this.sData.players).length,function(data){
			console.log("immediatelyStart==");
		});
	},

	//牌桌被清除
	beCleanedDesktopByOwner:function(){
		var self = this;
		cc.jsInstance.endRoomData.reason=-1;
		cc.jsInstance.msgpop.showMsg_text_close_nocancle_noensure("房间已被亲友圈房主/管理员解散，请重新加入游戏！",function(){
			self.sendExitRoomMsg();
		});
	},

	//被圈主移除俱乐部
	haveBeenRemoveClub:function(data){
		console.log("haveBeenRemoveClub==");
		if(data.kick){
			cc.jsInstance.msgpop.showMsg_text_close_nocancle_noensure("您已经被'"+unescape(data.clubName).substr(0,6) +"'管理员踢出亲友圈",function(){
			});
		}
	},
	
	//*****亲友圈邀请部分结束 */
	
	_tablePlaying: function() {
		if (this.tData.firstDel > 0) {
			this.getLeftTime();
			this.playerTool.playScaleForLayer(this.deleteMaskNode.getChildByName("bg"));
			this.setDeleteMaskNodeData(this.sData);
		} else {
			this.deleteTimeLeft = timeLeft.deleteTimeLeft;
			this.deleteMaskNode.active = false;
		}
		if(this.tData.desktop > 0){
			this.tableInfoNode.getChildByName("tableId").getComponent(cc.Label).string = "房间号：" + this.tData.tableid;
		}
		this.plaYing.active = true;
		this.PlayTableInfo.getChildByName("CardNum").active = true;
		this.PlayTableInfo.getChildByName("RoundNum").active = true;
		if (this.playerTool.isForTwoPlayers()) {
			this.plaYing.getChildByName("location1").active = false;
			this.plaYing.getChildByName("location3").active = false;
		} else if (this.tData.gameKind === "goldgame") {
			this.node.getChildByName("playHelpShowBtn").active = false;
			this.PlayTableInfo.getChildByName("RoundNum").active = false;
			this.node.getChildByName("setting").active = true;
		} else if (this.playerTool.isForThreePlayers()) {
			this.plaYing.getChildByName("location2").active = false;
		}
		this.playBegin.active = false;
		if (this.tData.haozi > 0) {
			this.plaYing.getChildByName("haozi").active = true;
			this.plaYing.getChildByName("haozi").getChildByName("pai").getComponent(cc.Sprite).spriteFrame = this.getSpriteFrame.getMJSpriteFrame(this.tData.haozi, "B");
		}
		this.refreshPointerRotation();
	},

	tableInvite: function() {
		var rulerArr = tableRules.getGameRulersInfo(this.sData,true);
		var rulerStr = rulerArr.join(",");
		console.log("rulerstr==", rulerStr);

		if (cc.sys.platform === cc.sys.WECHAT_GAME) {
			cc.jsInstance.block.showBlank();
		}else{
			alert("for debug:"+rulerStr);
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
	
	_tableInitData: function() {
		this.tData = cc.jsInstance.data.sData.tData;
		this.sData = cc.jsInstance.data.sData;
		this.currentTableState = this.tData.tState;
		this.leftRoundNum = this.tData.roundNum - 1;
		this.isQinyouquan = false; //亲友圈
		this.currentUserId = this.playerTool.getUserId();
		this.isOwner = false;
		this.isRulerShowBtnClick = false;
		this.rulerArr = [];
		if (this.tData.gameKind === "goldgame") {
			this.hostedTimes = 1;
		}
		
		this.initRulerData();
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
		this._setLeftCardNum();

	},

	_setLeftCardNum: function() {
		this.leftCardNum = this.getRemainCardNum(this.tData);
	},

	getRemainCardNum(tData){
		var remainNum = 0;
		if (tData) {
			if(tData.guaisanjiao || tData.datong){
				remainNum = (tData.withWind ? 136 : 108) - tData.cardNext - 16;
			} else if (tData.xian || tData.gameKind == "ankang") {
				if (tData.xa_hongzhong) {
					remainNum = (tData.withWind ? 136 : 112) - tData.cardNext;
				} else {
					remainNum = (tData.withWind ? 136 : 108) - tData.cardNext;
				}
			}else if(tData.gameKind == "tuidaohu2"){
				remainNum = (tData.lackOne?72:108) - tData.cardNext;
			}else {
				remainNum = (tData.withWind ? 136 : 108) - tData.cardNext;
			}
		}
		cc.log("剩余牌数:"+remainNum + "tData.cardNext:"+tData.cardNext);
		return remainNum;
	},

	_setTableInfoData: function() {
		//是不是金币场
		if (this.tData.gameKind === "goldgame") {
			//金币场
			var gameStr = "";
			switch (this.tData.uniqueId) {
				case "GM1":
					gameStr = "初级场";
					break;
				case "GM2":
					gameStr = "中级场";
					break;
				case "GM3":
					gameStr = "高级场";
					break;
				case "GM4":
					gameStr = "富豪场";
					break;
			}
			this.tableInfoNode.getChildByName("tableId").getComponent(cc.Label).string = gameStr + " 底分" + this.tData.scoreGold;
			this.tableInfoNode.getChildByName("CardNum").getChildByName("cardNum").getComponent(cc.Label).string = this.leftCardNum;
			this.tableInfoNode.getChildByName("RoundNum").active = false;
		} else {
			if(this.tData.desktop > 0){
				this.tableInfoNode.getChildByName("tableId").getComponent(cc.Label).string = unescape(this.tData.clubName).substr(0, 6)  + " 亲友圈" + this.tData.desktop + "号";
			}else{
				this.tableInfoNode.getChildByName("tableId").getComponent(cc.Label).string = "房间号：" + this.tData.tableid;
			}
			this.tableInfoNode.getChildByName("CardNum").getChildByName("cardNum").getComponent(cc.Label).string = this.leftCardNum;
			this.tableInfoNode.getChildByName("RoundNum").getChildByName("roundNum").getComponent(cc.Label).string = "剩余" + this.leftRoundNum + "局";
		}
		if (this.tData.circle) {
			this.tableInfoNode.getChildByName("RoundNum").getChildByName("roundNum").getComponent(cc.Label).string = "剩余" + this.leftRoundNum + "圈";
		}
	},

	tableEnd: function(data) {
		cc.logManager.info("tableEnd==",data);
		if(!data){
			return;
		}		
		this.tData = cc.jsInstance.data.sData.tData;
		this.deleteMaskNode.active = false;

		this.gameEndUIManager.showOneRoundEndUI(data);
		var self = this;
		if (this.tData.gameKind === "goldgame") {
			this.scheduleOnce(function() {
				if (!self.gameEndUIManager.endOne.active) {
					cc.jsInstance.block.show("正在结算，请稍后...");
				}
			}, 1);
		}

		if (this.tData.roundNum === 0 || this.tData.firstDel > 0) {
			if (this.tData.gameKind != "goldgame") {
				this.gameEndUIManager.showAllRoundEndUI(data.detail);
			}
		}
	},

	endRoom: function(data) {
		var self = this;
		if (this.tData.firstDel >= 0) {
			if (!this.isOwner && this.tData.tState === 1) {
				var ownerID = this.tData.owner;
				var ownerName = this.sData.players[ownerID];
				if (ownerName.info.nickname) {
					cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("包厢已被" + unescape(ownerName.info.nickname).substr(0, 6) + "解散，请重新加入游戏", function() {
						cc.jsInstance.audioManager.playBtnClick();
						self.sendExitRoomMsg();

					})
				} else {
					cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("包厢已被" + ownerName.info.name + "解散，请重新加入游戏", function() {
						cc.jsInstance.audioManager.playBtnClick();
						self.sendExitRoomMsg();
					})
				}
			}

			//金币场
			if (this.tData.tState === 6) {
				if (this.tData.gameKind === "goldgame") {
					self.sendExitRoomMsg();
				} else {
					this.deleteMaskNode.active = false;
					this.deleteTimeLeft = timeLeft.deleteTimeLeft;
					this.gameEndUIManager.showAllRoundEndUI(data.detail);
				}
			}
		}
	},

	loadLobby: function() {
		cc.jsInstance.block.show();
		// this.clearAllFriendPrefabItem();
		this.scheduleOnce(function(){
			cc.director.preloadScene("lobby", function() {
				cc.loader.onProgress = null;
				cc.jsInstance.HavePlayStartAnim = false;
				cc.director.loadScene("lobby");
				cc.jsInstance.block.hide();
			});
		},1);
		
	},


	refreshPointerRotation: function() {
		this.tData = cc.jsInstance.data.sData.tData;
		var currentPlayerIndex = this.tData.curPlayer;
		var currentPlayerUid = this.tData.uids[currentPlayerIndex];
		var currentPlayerLocalIndex = this.playerTool.transformUidsLocation(currentPlayerUid);
		if (!this.isReconnected) {
			this.putPaiTimeLeft = 10;
			this.putPaiTwoTimeLeft = 10;
		} else {
			this.isReconnected = false;
		}
		currentPlayerLocalIndex = this.playerTool.getIndexByGameKind(currentPlayerLocalIndex);
		var jiantou = this.plaYing.getChildByName("Pointer").getChildByName("jiantou");
		switch (currentPlayerLocalIndex) {
			case 0:
				jiantou.rotation = 270;
				break;
			case 1:
				jiantou.rotation = 180;
				break;
			case 2:
				jiantou.rotation = 90;
				break;
			case 3:
				jiantou.rotation = 0;
				break;
		}
	},

	//超级恶心写的
	timerRun: function() {
		var self = this;
		var timeNode = self.plaYing.getChildByName("Pointer").getChildByName("time");
		var isGoldgame = (self.tData.gameKind === "goldgame") ? true : false;
		self.schedule(function() {
			var iswaitPut = (self.tData.tState === 3) ? true : false;
			var isCurrentPlayer = (self.tData.uids[self.tData.curPlayer] === self.playerTool.getUserId()) ? true : false;
			if (self.putPaiTimeLeft >= 0) {
				timeNode.getComponent(cc.Label).string = self.putPaiTimeLeft--;
				timeNode.color = cc.color(255, 255, 255);
			} else if (self.putPaiTwoTimeLeft >= 0) {
				if (self.hostedTimes >= 0) {
					if (isCurrentPlayer && isGoldgame && iswaitPut || cc.jsInstance.waitPeng) {
						timeNode.getComponent(cc.Label).string = self.putPaiTwoTimeLeft--;
						timeNode.color = cc.color(255, 0, 0);
					} else if (isGoldgame && cc.jsInstance.cpgh) {
						if (cc.jsInstance.cpgh[3] < 1 && cc.jsInstance.cpgh[0] > -1) {
							cc.jsInstance.globalUtils.send("MJPassMyselfDefine", {
								data: null
							});
						} else if (cc.jsInstance.cpgh[3] > 0) {
							cc.jsInstance.globalUtils.send("MJHu", {
								data: null
							});
						}
					}
				} else if ((self.hostedTimes < 0 && isCurrentPlayer && isGoldgame && iswaitPut)) {
					this.putPaiTwoTimeLeft = -1;
					self.sendHostNotice();
				} else if (isGoldgame && cc.jsInstance.cpgh) {
					if (cc.jsInstance.cpgh[3] < 1 && cc.jsInstance.cpgh[0] > -1) {
						cc.jsInstance.globalUtils.send("MJPassMyselfDefine", {
							data: null
						});
					} else if (cc.jsInstance.cpgh[3] > 0) {
						cc.jsInstance.globalUtils.send("MJHu", {
							data: null
						});
					}
				}
			} else {
				if (cc.jsInstance.waitPeng) {
					cc.jsInstance.waitPeng = false;
					cc.jsInstance.globalUtils.send("MJPassMyselfDefine", {
						data: null
					});
				} else {
					self.sendHostNotice();
				}
			}
		}.bind(this), 1);
	},

	sendHostNotice: function() {
		if (this.putPaiTwoTimeLeft === -1) {
			this.putPaiTwoTimeLeft = -2;
			this.hostedTimes--;
			cc.jsInstance.network.tableMsgRequestManaged(true, null);
		}
	},


	hiddenEndFinal: function() {
		this.gameEndUIManager.hiddenEndFinal();
	},

	nextRoundReadyShow: function(data, isReconnected) {
		var index = this.playerTool.transformUidsLocation(data.detail.uid);
		this.isReconnected = isReconnected;
		if (index === 0) {
			this.putPaiTimeLeft = 10;
			this.putPaiTwoTimeLeft = 10;
		}
		var pInfo = this.playerTool.getUIPlayer(index);
		index = this.playerTool.getIndexByGameKind(index);
		var head = this.playBegin.getChildByName("playHead_" + index);
		var nodeName = "location" + index;
		var playingHead = this.plaYing.getChildByName(nodeName).getChildByName("head");
		if (this.currentTableState != this.tableState.waitJoin) {
			this.playBegin.getChildByName("playHead_" + index).getChildByName("zhunbei").active = data.detail.onLine;
		}
		head.getChildByName("score").getComponent(cc.Label).string = parseInt(this.tData.initCoin) + parseInt(pInfo.winall);

		var zhuangUid = this.tData.uids[this.tData.zhuang];
		if(data.detail.uid === zhuangUid){
			head.getChildByName("zhuang").active = true;
		}else{
			head.getChildByName("zhuang").active = false;
		}

		if (this.playerTool.isForTwoPlayers() || this.playerTool.isForThreePlayers()) {
			if (!data.detail.onLine) {
				head.getChildByName("headLeave").active = true;
				playingHead.getChildByName("headLeave").active = true;
			} else {
				head.getChildByName("headLeave").active = false;
				playingHead.getChildByName("headLeave").active = false;
			}
		} else {
			if (!pInfo.onLine) {
				head.getChildByName("headLeave").active = true;
				playingHead.getChildByName("headLeave").active = true;
			} else {
				head.getChildByName("headLeave").active = false;
				playingHead.getChildByName("headLeave").active = false;
			}
		}

		this.currentTableState = cc.jsInstance.data.sData.tData.tState;
		this._dealWithTableStatus();
	},

	initRulerData: function() {
		this.rulerArr = tableRules.getGameRulersInfo(this.sData,false);
		this.setRulerLabelData();
	},

	setRulerLabelData: function() {
		for (var i = 0; i < this.rulerArr.length; i++) {
			if (i > 10) {
				console.log("目前支持到10个规则的展示，长度超出10");
				break;
			}
			var nodeLab = this.rulersNode.getChildByName("detailText" + i);
			nodeLab.getComponent(cc.Label).string = this.rulerArr[i];
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

	ruleBtnClick: function() {
		if (this.isRulerShowBtnClick) {
			this.rulersNode.active = false;
		} else {
			this.rulersNode.active = true;
		}
		this.isRulerShowBtnClick = !this.isRulerShowBtnClick;
	},

	shareEnd: function() {
		if (this.tData.gameKind === "goldgame") {
			var self = this;
			var fid;
			if (cc.jsInstance.data.incontest) {
				fid = cc.jsInstance.data.incontest;
			} else {
				fid = cc.jsInstance.data.fid;
			}
			//保存这个房间号  在金币场里面离开的时候判断有没有，没有说明不在金币场 在匹配的时候=0
			cc.jsInstance.vipTable = 0;
			cc.jsInstance.network.leaveGame(function() {
				self.waittingload.leave_gold(fid);
				cc.jsInstance.audioManager.playBtnClick();
			}.bind(this))
			
		} else {
			//结束的时候分享什么都不传，和客户端保持一致
			cc.jsInstance.native.wxShareUrl(""); //主动调用分享
		}
	},

	settingMaskCloseClick: function() {
		this.tableSettingMaskNode.active = false;
	},

	settingClick: function() {
		this.tableSettingMaskNode.active = true;
		this.playerTool.playScaleForLayer(this.tableSettingMaskNode.getChildByName("surfaceLayer"));
	},

	deleteRoomInGame: function() {
		var tState = this.tData.tState
		this.tableSettingMaskNode.active = false;
		if (tState === 1) {
			this.deleteRoom();
		} else {
			cc.jsInstance.network.tableMsgDelRoom(true);
			this.deleteMaskNode.getChildByName("bg").getChildByName("ok").active = false;
			this.deleteMaskNode.getChildByName("bg").getChildByName("back").active = false;
		}
	},

	rejectDeleteRoomInGame: function() {
		cc.jsInstance.network.tableMsgDelRoom(false);
	},

	deleteRoom: function() {
		var self = this;
		if (this.isOwner&&!this.tData.desktop) {
			cc.jsInstance.network.tableMsgDelRoom(true);
			cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("游戏未开始，解散房间将不会扣除元宝", function() {
				cc.jsInstance.audioManager.playBtnClick();
				self.sendExitRoomMsg();
			})
		} else {
			this.backClick();
		}
	},

	setDeleteMaskNodeData: function(data) {
		this.getLeftTime();
		// var agreeBuleColor = "#1664C3";
		// var waitRedColor = "#7e0c00";
		this.playerTool.playScaleForLayer(this.deleteMaskNode.getChildByName("bg"));
		var titleNode = this.deleteMaskNode.getChildByName("bg").getChildByName("title");

		var players = data.players;

		//有人拒绝了
		if (data.tData.firstDel < 0) {
			this.deleteMaskNode.active = false;
			this.deleteTimeLeft = timeLeft.deleteTimeLeft;
			this.deleteMaskNode.getChildByName("bg").getChildByName("ok").active = true;
			this.deleteMaskNode.getChildByName("bg").getChildByName("back").active = true;
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
			titleNode.getComponent(cc.Label).string = "你申请解散包厢";
			this.deleteMaskNode.getChildByName("bg").getChildByName("ok").active = false;
			this.deleteMaskNode.getChildByName("bg").getChildByName("back").active = false;
		} else {
			var playNickName = this.sData.players[data.tData.firstDel].info.nickname;
			titleNode.getComponent(cc.Label).string = "玩家[" + unescape(this.sData.players[data.tData.firstDel].info.name) + "]申请解散包厢";
			if (playNickName) {
				titleNode.getComponent(cc.Label).string = "玩家[" + unescape(playNickName).substr(0, 6) + "]申请解散包厢";
			}
		}

		for (var i = 0; i < uidKeys.length; i++) {
			var playInfo = this.sData.players[uidKeys[i]];
			console.log("playInfo==");
			var playName = playInfo.info.name;
			var playNickName = playInfo.info.nickname;
			var playerLab = this.deleteMaskNode.getChildByName("bg").getChildByName("player" + i);
			var isAgree = players[uidKeys[i]].delRoom;
			if (isAgree) {
				if (playInfo.info.uid === this.currentUserId) {
					playerLab.getComponent(cc.Label).string = "你已经同意";
					this.deleteMaskNode.getChildByName("bg").getChildByName("ok").active = false;
					this.deleteMaskNode.getChildByName("bg").getChildByName("back").active = false;
				} else {
					playerLab.getComponent(cc.Label).string = "玩家[" + unescape(playName) + "]已经同意";
					if (playNickName) {
						playerLab.getComponent(cc.Label).string = "玩家[" + unescape(playNickName).substr(0, 6) + "]已经同意";
					}
				}
				// playerLab.color = cc.hexToColor(agreeBuleColor);
			} else {
				playerLab.getComponent(cc.Label).string = "玩家[" + unescape(playName) + "]等待选择";
				if (playNickName) {
					playerLab.getComponent(cc.Label).string = "玩家[" + unescape(playNickName).substr(0, 6) + "]等待选择";
				}
				// playerLab.color = cc.hexToColor(waitRedColor);
			}
		}
	},

	sendExitRoomMsg: function() {
		var self = this;
		cc.jsInstance.network.leaveGame(function() {
			self.loadLobby();
			cc.jsInstance.pinfo.vipTable = 0;
		}.bind(this));
	},

	gameEnd: function() {
		this.sendExitRoomMsg();
	},

	initData: function() {
		this.currentUserId = this.playerTool.getUserId();
		this.isOwner = false;
		this.isRulerShowBtnClick = false;
		this.rulerArr = [];
		this.initRulerData();
		if (this.tData.owner === this.currentUserId) {
			this.showMsgText = "返回大厅包厢仍然保留,赶快去邀请好友吧";
			this.isOwner = true;
		} else {
			this.showMsgText = "返回大厅包厢将退出游戏,确定退出包厢吗?";
			this.isOwner = false;
		}
	},

	//初始化桌面UI
	initTableUIForNextRound: function() {

		if (this.tData.gameKind === "goldgame") {
			this.plaYing.getChildByName("tuoguang").active = false;
			this.deleteMaskNode.getChildByName("bg").getChildByName("ok").active = true;
			this.deleteMaskNode.getChildByName("bg").getChildByName("back").active = true;
			this.hostedTimes = 1;
		}

		for (var j = 0; j < 4; j++) {
			//隐藏碰杠
			var penggangsNode = this.plaYing.getChildByName("location" + j).getChildByName("penggangs");
			for (var i = 0; i < 4; i++) {
				var pgNum = penggangsNode.getChildByName("pg_" + i);
				pgNum.active = false;
			}

			//手牌
			var mjHandNode = this.plaYing.getChildByName("location" + j).getChildByName("mjhand");
			for (var i = 0; i < 14; i++) {
				var handNode = mjHandNode.getChildByName("hand_" + i);
				handNode.active = true;
				if (j === 0) {
					var btn = handNode.getComponent(cc.Button);
					btn.normalColor = cc.color(255, 255, 255);
				}
			}

			//打出去的牌
			var mjPutNode = this.plaYing.getChildByName("location" + j).getChildByName("mjput");
			var num = 30;
			if (j === 0 || j === 2) {
				num = 41;
			}
			for (var i = 0; i < num; i++) {
				var putNode = mjPutNode.getChildByName("put_" + i);
				putNode.active = false;
			}
			this.playEatFlag.getChildByName("fiag_" + j).active = false;
		}
		this.playEatFlag.active = false;
		this.playEatFlag.getChildByName("pass").active = false;
	},

	onLoad: function() {
		
		cc.jsInstance.native.hideGameClubButton();
		cc.sys.localStorage.setItem("ShareRoomid", -1); //分享的房间号改为-1
		this.waittingload = this.node.getChildByName("waitting").getComponent("waitting");
		this.tableForClub = this.playBegin.getChildByName("tableForClub");
		this.PlayTableInfo = this.node.getChildByName("PlayTableInfo");
		this.tableInit();
		this.timerRun();
		this.deleteTimerRun();
		if (cc.jsInstance.audioManager.getBgmName() && cc.jsInstance.audioManager.getBgmName() === "bgMain") {
			cc.jsInstance.audioManager.playBGM("bgGame");
		}

		if(cc.jsInstance.endRoomData&&cc.jsInstance.endRoomData.reason >= 0&&!this.tData.desktop){
			//刚加入就被解散了
			cc.jsInstance.endRoomData.reason = -1;
			this.endRoom(cc.jsInstance.endRoomData);
			return;
		}
		//存放预制体的缓存池
		this.prefabItemCachePool = [];
		this.prefabItemNameArr = [];
	},

	deleteTimerRun: function() {
		var timeNode = this.deleteMaskNode.getChildByName("bg").getChildByName("timeLab");
		var self = this;
		this.schedule(function() {
			if (self.deleteTimeLeft > 0) {
				self.deleteTimeLeft--;
				timeNode.getComponent(cc.Label).string = parseInt(self.deleteTimeLeft / 60) + "分" + self.deleteTimeLeft % 60 + "秒 " + "之后自动同意";
			}
		}.bind(this), 1);
	},

	playHelpShowBtnClick: function() {
		if (this.tData.kouDian) {
			this.tData.gameKind = "kouDian";
		} else if (this.tData.tuidaohu) {
			this.tData.gameKind = "tuidaohu";
		}
		cc.jsInstance.playHelp.showHelpWanfa(this.tData.gameKind);
	},

});