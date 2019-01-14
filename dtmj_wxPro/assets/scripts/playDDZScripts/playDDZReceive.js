/**
 * 这个是个DDZ接收消息的类，这里统一接收消息，然后派发给各个UI管理部分更新UI
 */
cc.Class({
	extends: cc.Component,
	properties: {
        playDDZAnim:{
            type:cc.Node,
            default:null,
        },
    },

	// LIFE-CYCLE CALLBACKS:
	onLoad() {
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
            cc.logManager.info("playDDZRecevice initSceneData==",data);

        });
        
        this.node.on("addPlayer", function(data) {
            cc.logManager.info("playDDZRecevice addPlayer==",data);
            cc.jsInstance.audioManager.playSFX("player_join_effect");
            self.tableDDZManager.tableInit();
        });

        this.node.on("removePlayer", function(data) {
            cc.logManager.info("removePlayer==",data);
            cc.jsInstance.audioManager.playSFX("player_leave_effect");
            self.tableDDZManager.tableInit();
        });

        this.node.on("mjhand", function(data) {
            //发牌		 
            cc.logManager.info("playDDZRecevice mjhand==",data);

            cc.jsInstance.haveRoom = false;
            cc.jsInstance.audioManager.playSFXForDDZ("fapai");
            self.tableDDZManager.tableInit();
            self.playerDDZManager.initData();
            // self.playerDDZManager.setPaiPositionY(); 
            self.playerDDZManager.hiddenMyNoCall();
            self.playDDZSelectPaiTool.initPoker();
		});
        
        this.node.on("MJRob", function(data) {
            cc.logManager.info("playDDZRecevice MJRob==",data);
            self.tData = cc.jsInstance.data.sData.tData;
            self.playerTool.playDDZCallSorceAudio(data);
            self.playerDDZManager.refreshMyTurnLandClaim();
            self.playerDDZManager.refreshCallRobUI(data);
            if(data.detail.tData.landLoader > 0){
                self.playAnimTool.playAnimDDZForStart();
            }

            if(self.tData){
                self.playerDDZManager.initData();
                self.playerDDZManager.haveCalledRob();
                self.tableDDZManager.tableInit();
            }
		});
        
        this.node.on("MJPassDDZ",function(data){
            cc.logManager.info("playDDZRecevice MJPassDDZ==",data);
            cc.jsInstance.audioManager.playSFXForDDZ("yaobuqi");
            self.playerDDZManager.passClicked(data.detail.uid);
		});

		this.node.on("MJPutDDZ", function(data) {
            cc.logManager.info("playDDZRecevice MJPutDDZ==",data);
            var cardTypes = cc.jsInstance.Poker.getCardsType(data.detail.card);
            self.playerTool.playDDZAudioForCardType(cardTypes);
            self.playerDDZManager.dealWithPlayAnimDDZPosition(cardTypes,data.detail.uid);
            self.playerDDZManager.putCardClicked(data);
            self.playDDZSelectPaiTool.receivePutPaiNotice(data);
            self.tableDDZManager.refreshTableInfoMultipleData();
        });
        
		this.node.on("roundEndDDZ", function(data) {
            cc.logManager.info("playDDZRecevice roundEndDDZ==",data);
            cc.jsInstance.haveRoom = false;
            self.tableDDZManager.tableEnd(data);
		});

        this.node.on("endRoom", function(data) {
            cc.logManager.info("playDDZRecevice endRoom==",data);
            if(data.detail.reason === 3){
                self.tableDDZManager.beCleanedDesktopByOwner();
            }else{
                self.tableDDZManager.endRoom(data);
            }
			
		});

		this.node.on("onlinePlayer", function(data) {
            cc.logManager.info("onlinePlayer",data);
            self.playerDDZManager.refershOnLineHead(data);
            self.tableDDZManager.nextRoundReadyShow(data);
		});

		this.node.on("DelRoom", function(data) {
            cc.logManager.info("playDDZRecevice DelRoom==",data);
            self.tableDDZManager.setDeleteMaskNodeData(data.detail);
        });
        
        this.node.on("leavedClub",function(data){
            cc.logManager.info("playDDZRecevice leavedClub==",data);
			self.tableDDZManager.haveBeenRemoveClub(data.detail);
		});
	},

	initData: function() {
        cc.logManager.info("playDDZRecevice initData==");
        this.tableDDZManager = this.getComponent('tableDDZmanager');
        this.playerDDZManager = this.getComponent('playDDZManager');
        this.playDDZSelectPaiTool = this.getComponent('playDDZSelectPaiTool');
        this.playDDZGameend = this.getComponent("playDDZGameend");
        this.playerTool = this.getComponent('playerTool');
        this.playAnimTool = this.playDDZAnim.getComponent('anim');
    },
    
});