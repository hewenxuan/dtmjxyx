/**
 * 这个是个接收消息的类，这里统一接收消息，然后派发给各个UI管理部分更新UI
 */
cc.Class({
	extends: cc.Component,
	properties: {},

	// LIFE-CYCLE CALLBACKS:
	onLoad() {
		cc.logManager.info("playReceive onLoad")
		this.waitting = this.node.getChildByName("waitting").getComponent("waitting");
		this.instanceEventOn(); //初始化监听消息类
		this.initData();
	},

	start() {

	},

	update(dt) {},

	instanceEventOn: function() {
		cc.jsInstance.globalUtils.dataEventHandler = this.node;
		var self = this;
		this.node.on("initSceneData", function(data) {
			cc.logManager.info("playRecevice initSceneData==",data);
		});

		this.node.on("removePlayer", function(data) {
			cc.logManager.info("playRecevice removePlayer==",data);
			self.tableManager.tableInit();
			self.playerManager.initData();
			self.tableManager.showBtnForThreeOrTwoPeople();
		});

		this.node.on("addPlayer", function(data) {
			cc.logManager.info("playRecevice addPlayer==",data);
			cc.jsInstance.audioManager.playSFX("player_join_effect");
			self.playerManager.initData();
			self.tableManager.showBtnForThreeOrTwoPeople();
			
		});

		this.node.on("mjhand", function(data) {
			cc.logManager.info("playRecevice mjhand==",data);
			self.recevieMJHand();
		});

		this.node.on("MJPut", function(data) {
			cc.logManager.info("playRecevice MJPut==",data);
			self.tableManager.refreshPointerRotation();
			self.playerManager.putPai(data);
		});

		this.node.on("newCard", function(data) {
			cc.logManager.info("playRecevice newCard==",data);
			self.playerManager.getNewCard(data);
		});

		this.node.on("waitPut", function(data) {
			cc.logManager.info("playRecevice waitPut==",data);
			self.playerManager.waitPut(data);
			self.tableManager.updateTableLeftCardNum();
		});

		this.node.on("MJPeng", function(data) {
			cc.logManager.info("playRecevice MJPeng==",data);
			self.playerManager.pengPai(data);
			self.tableManager.refreshPointerRotation();
		});

		this.node.on("MJGang", function(data) {
			cc.logManager.info("playRecevice MJPeng==",data);
			self.playerManager.gangPai(data);
			self.tableManager.refreshPointerRotation();
		});

		this.node.on("roundEnd", function(data) {
			cc.logManager.info("playRecevice roundEnd==",data);
			self.tableManager.tableEnd(data);
			self.playerManager.offTheMoveEvent();
			//金币场本局结束就刷新牌桌 
			if(cc.jsInstance.data.sData.tData.gameKind === "goldgame"){
				self.tableManager.initTableUIForNextRound();
			}
		});

		this.node.on("endRoom", function(data) {
			cc.logManager.info("playRecevice endRoom==",data);
			if (cc.jsInstance.data.sData.tData.gameKind === "goldgame") {
				self.gameEnd.endRoom(data);
			} else {
				if(data.detail.reason === 3){
					self.tableManager.beCleanedDesktopByOwner();
				}else{
					self.tableManager.endRoom(data);
				}
			}
		});

		this.node.on("onlinePlayer", function(data) {
			cc.logManager.info("playRecevice onlinePlayer==",data);
			if (data.detail.uid === self.playerTool.getUserId()) {
				self.tableManager.hiddenEndFinal();
			}
			self.tableManager.nextRoundReadyShow(data,true);
			self.tableManager.showBtnForThreeOrTwoPeople();
		});

		this.node.on("DelRoom", function(data) {
			cc.logManager.info("playRecevice DelRoom==",data);
			self.tableManager.setDeleteMaskNodeData(data.detail);
		});

		this.node.on("notifyPlayer", function(data) {
			cc.logManager.info("playRecevice notifyPlayer==",data);
			self.waitting.closeWaittingUi();
		});

		this.node.on("continueMJPlayground", function(data) {
			cc.logManager.info("playRecevice continueMJPlayground==",data);
			self.gameEnd.showEndOne();
		});

		this.node.on("checkManaged",function(data){
			cc.logManager.info("playRecevice checkManaged==",data);
			if(data.detail.plManaged){
				self.playerManager.beginHost();
			}
		});

		this.node.on("MJPass",function(data){
			cc.logManager.info("playRecevice MJPass==",data);
			if(data.detail.skipHu){
				//自己收到过胡的消息，隐藏掉自己的UI
				self.playerManager.hiddenPassUI();
			}
		});

		this.node.on("MJPassMyselfDefine",function(data){
			console.log("playRecevice MJPassMyselfDefine==");
			self.playerManager.passClicked();
		});

		this.node.on("MJHu",function(data){
			console.log("playRecevice MJHu==");
			self.playerManager.huClick();
		});

		this.node.on("immediatelyApply",function(data){
			console.log("playRecevice immediatelyApply==");
			self.tableManager.showMaskForStartRightNow(data);
		});

		this.node.on("leavedClub",function(data){
			console.log("playRecevice leavedClub==");
			self.tableManager.haveBeenRemoveClub(data.detail);
		});

	},

	initData: function() {
		console.log("playRecevice initData()");
		this.tableManager = this.getComponent('tableManager');
		this.playerManager = this.getComponent("playerManager");
		this.playerTool = this.getComponent("playerTool");
		this.gameEnd = this.getComponent("gameEnd");
	},

	recevieMJHand: function() {
		console.log("playRecevice recevieMJHand()");
		this.playerManager.initData(); //先去处理手牌
		this.tableManager.tableInit(); //然后才能计算剩余牌
		if(cc.jsInstance.data.sData.tData.gameKind != "goldgame"){
			this.tableManager.initTableUIForNextRound();
		}
		this.gameEnd.initData();
		this.playerManager.playAnimForBegin();//播放开局动画
	},

});