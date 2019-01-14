/**
 * 处理玩家的UI更新
 * 包括：手牌，碰杠胡，打出去的牌和玩家头像信息
 */

 var pMColor = {
	darkgrey:"#646464",
	white:"#ffffff",
 }

cc.Class({
	extends: cc.Component,
	properties: {
		//头像信息
		playBegin: {
			type: cc.Node,
			default: null,
		},

		plaYing: {
			type: cc.Node,
			default: null,
		},

		//上边的人的 （手牌，打出的牌，头像个人信息）
		up: {
			type: cc.Node,
			default: null,
		},
		//我的 （手牌，打出的牌，头像个人信息）
		myself: {
			type: cc.Node,
			default: null,
		},
		//左边的人的 （手牌，打出的牌，头像个人信息）
		left: {
			type: cc.Node,
			default: null,
		},
		//右边的人的 （手牌，打出的牌，头像个人信息） 
		right: {
			type: cc.Node,
			default: null,
		},

		//cpgh
		dy_play_gang_btn: {
			default: null,
			type: cc.SpriteFrame,
		},

		dy_play_guo_btn: {
			default: null,
			type: cc.SpriteFrame,
		},

		dy_play_hu_btn: {
			default: null,
			type: cc.SpriteFrame,
		},

		dy_play_peng_btn: {
			default: null,
			type: cc.SpriteFrame,
		},

		dy_play_ting_btn: {
			default: null,
			type: cc.SpriteFrame,
		},

		tingTips: {
			default: null,
			type: cc.SpriteFrame,
		},

		currentPutTips: {
			default: null,
			type: cc.SpriteFrame,
		},

		penggangsFromTips: {
			default: null,
			type: cc.SpriteFrame,
		},

		//手牌UI
		holdEmpty1: {
			default: [],
			type: [cc.SpriteFrame],
			serializable: true,
		},

		playEatFlag: {
			type: cc.Node,
			default: null,
		},

		playAnim:{
			type: cc.Node,
            default: null,
		},

		goldCoinSpriteFrame:{
			type:cc.SpriteFrame,
			default:null,
		},

		userInfo: {
			type: cc.Node,
			default: null,
		},

		defaultHeadIcon_bottom:{
			type:cc.SpriteFrame,
			default:null,
		},

		defaultHeadIcon_left:{
			type:cc.SpriteFrame,
			default:null,
		},

		defaultHeadIcon_right:{
			type:cc.SpriteFrame,
			default:null,
		},

		defaultHeadIcon_top:{
			type:cc.SpriteFrame,
			default:null,
		},
		putnum: 0,
		rightPutNum: 0,
		upPutNum: 0,
		leftPutNum: 0,
		leftCardNum: 56,
	},

	// LIFE-CYCLE CALLBACKS:
	onLoad() {
		cc.logManager.info("playerManager onLoad");
		this.initData();
		this.initPlayersHeadInfo();
		//不是每次都初始化
		this.leftBigPosition = this.left.getChildByName("big").getPosition();
		this.rightBigPosition = this.right.getChildByName("big").getPosition();
		this.upBigPosition = this.up.getChildByName("big").getPosition();
		this.myselfBigPosition = this.myself.getChildByName("big").getPosition();
	},

	initData: function() {
		cc.logManager.info("playerManager initData");
		this.tData = cc.jsInstance.data.sData.tData;
		this.sData = cc.jsInstance.data.sData;
		this.playerTool = this.getComponent('playerTool');
		this.playAnimTool = this.playAnim.getComponent('anim');
		this.handPaiNodeUpArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //手牌未被点击过
		this.isTingClick = false; //记录是不是处于听的状态
		this.canTing = false; //记录能不能听
		this.isGang = false; //自摸的时候区分是杠，还是胡，涉及到从哪里拿牌
		this.playPaiSpriteFrame = this.getComponent('playGetPaiSpriteFrame');
		this.rightPutNum = 0;
		this.upPutNum = 0;
		this.leftPutNum = 0;
		this.putnum = 0;
		this.ishosted = false;
		this.skipHu = false;
		cc.jsInstance.cpgh = [-1,-1,-1,-1];
		this.playAnimForBegin();
		this.initLocalData();
		this.setGobalMjHandData();
		this.initPlayersHeadInfo();
		this.initPlayerUIData();
	},

	initLocalData: function() {
		var myself = {
			mjhand: [],
			mjput: [],
			mjpeng: [],
			mjgang: [],
			mjangang: [],
		}

		var otherPlayer_left = {
			mjput: [],
			mjpeng: [],
			mjgang: [],
			mjangang: [],
		}

		var otherPlayer_right = {
			mjput: [],
			mjpeng: [],
			mjgang: [],
			mjangang: [],
		}

		var otherPlayer_up = {
			mjput: [],
			mjpeng: [],
			mjgang: [],
			mjangang: [],
		}
		this.orderMjhand = [];
		this.players = [myself, otherPlayer_right, otherPlayer_up, otherPlayer_left];
		cc.jsInstance.players = this.players;
		console.log("playerManager gobal players ==");
	},

	initPlayersHeadInfo: function() {
		cc.logManager.info("playerManager initPlayersHeadInfo==");
		var headUrls = [];
		var headUrlNodes = [];
		var num = this.tData.peopleNum;
		for (var index = 0; index < num; index++) {
			var pInfo = this.playerTool.getUIPlayer(index);
			index = this.playerTool.getIndexByGameKind(index);
			var playBeginHead = this.playBegin.getChildByName("playHead_" + index);
			var plaYingHead = this.plaYing.getChildByName("location" + index).getChildByName("head");
			var zhuangIndex = this.tData.zhuang;
			var zhuangUid = this.tData.uids[zhuangIndex];
			if (pInfo) {
				playBeginHead.getChildByName("readyHead").active = true;
				var headNode = playBeginHead.getChildByName("readyHead");
				var plaYingHeadNode = plaYingHead.getChildByName("playhead");
				if (pInfo.info.headimgurl) {
					
					headNode.active = true;

					headUrls.push(pInfo.info.headimgurl);
					headUrlNodes.push(headNode);

					headUrls.push(pInfo.info.headimgurl);
					headUrlNodes.push(plaYingHeadNode);

				}else{
					var headIcon;
					switch(index){
						case 0:
						headIcon = this.defaultHeadIcon_bottom;
							break;
						case 1:
							headIcon = this.defaultHeadIcon_left;
							break;
						case 2:
							headIcon = this.defaultHeadIcon_top;
							break;
						case 3:
							headIcon = this.defaultHeadIcon_right;
							break;
					}
					headNode.getComponent(cc.Sprite).spriteFrame = headIcon;
					plaYingHeadNode.getComponent(cc.Sprite).spriteFrame = headIcon;
				}

				playBeginHead.getChildByName("scoreBG").active = true;
				playBeginHead.getChildByName("name").active = true;

				if (pInfo.info.nickname) {
					playBeginHead.getChildByName("name").getComponent(cc.Label).string = unescape(pInfo.info.nickname).substr(0, 6);
					plaYingHead.getChildByName("name").getComponent(cc.Label).string = unescape(pInfo.info.nickname).substr(0, 6);
				} else {
					playBeginHead.getChildByName("name").getComponent(cc.Label).string = pInfo.info.name;
					plaYingHead.getChildByName("name").getComponent(cc.Label).string = pInfo.info.name;
				}

				playBeginHead.getChildByName("score").active = true;
				playBeginHead.getChildByName("score").getComponent(cc.Label).string = parseInt(this.sData.tData.initCoin) + parseInt(pInfo.winall);
				plaYingHead.getChildByName("score").getComponent(cc.Label).string = parseInt(this.sData.tData.initCoin) + parseInt(pInfo.winall);

				if(this.tData.gameKind === "goldgame"){
					playBeginHead.getChildByName("scoreBG").getComponent(cc.Sprite).spriteFrame = this.goldCoinSpriteFrame;
					plaYingHead.getChildByName("scoreBG").getComponent(cc.Sprite).spriteFrame = this.goldCoinSpriteFrame;
					plaYingHead.getChildByName("scoreBG").scale = 0.8;
					playBeginHead.getChildByName("score").getComponent(cc.Label).string = this.playerTool.getCoinFormat(pInfo.info.coin - parseInt(this.sData.tData.needPayCoin));
					plaYingHead.getChildByName("score").getComponent(cc.Label).string = this.playerTool.getCoinFormat(pInfo.info.coin - parseInt(this.sData.tData.needPayCoin));
				}
				
				if(this.tData.tState != 1){
					if (pInfo.mjState === 7) {
						playBeginHead.getChildByName("zhunbei").active = true;
					} else {
						playBeginHead.getChildByName("zhunbei").active = false;
					}
				}

				if (pInfo.onLine) {
					playBeginHead.getChildByName("headLeave").active = false;
					plaYingHead.getChildByName("headLeave").active = false;

				} else {
					playBeginHead.getChildByName("headLeave").active = true;
					plaYingHead.getChildByName("headLeave").active = true;
				}

				if ("" + pInfo.info.uid === "" + zhuangUid) {
					plaYingHead.getChildByName("zhuang").active = true;
				} else {
					plaYingHead.getChildByName("zhuang").active = false;
				}

			} else {
				playBeginHead.getChildByName("readyHead").active = false;
				playBeginHead.getChildByName("scoreBG").active = false;
				playBeginHead.getChildByName("name").active = false;
				playBeginHead.getChildByName("score").active = false;
				playBeginHead.getChildByName("zhunbei").active = false;
			}
		}
		if(headUrls.length > 0){
			this.playerTool.setHead(headUrls, headUrlNodes);
		}
	},

	initPlayerUIData: function() {
		var peopleNum = this.tData.peopleNum;
		//一进来就隐藏手牌
		this.hand13Hide();
		for (var i = 0; i < peopleNum; i++) {
			var pInfo = this.playerTool.getUIPlayer(i);
			var index = i;
			index = this.playerTool.getIndexByGameKind(index);
			//先初始化数据
			if (pInfo) {
				if (pInfo.mjput) {
					this.players[index].mjput = pInfo.mjput;
				}

				if (pInfo.mjpeng) {
					this.players[index].mjpeng = pInfo.mjpeng;
				}

				if (pInfo.mjgang0) {
					this.players[index].mjgang = pInfo.mjgang0;
				}

				if (pInfo.mjgang1) {
					this.players[index].mjangang = pInfo.mjgang1;
				}

			}

			if(!pInfo){
				continue;
			}

			//要刷新自己的手牌
			if (i === 0) {
				this.refreshHandPai(pInfo.mjhand);
				if (this.tData.curPlayer >= 0) {
					//
					
					this.setCPGHData(pInfo);
					if (pInfo.mjState === 4) {
						this.checkCPGH(pInfo.cpgh);
					}else if(pInfo.mjState === 3 &&(pInfo.cpgh[2]>0||pInfo.cpgh[3]>0)){
						this.checkCPGH(pInfo.cpgh);
					}else if(!pInfo.mjting&&pInfo.tingArr.length > 0&&this.isCurrent()){//报听状态
						//自己的回合不可能有碰
						if(pInfo.cpgh[1] > 0){
							pInfo.cpgh[1] = 0;
						}
						this.checkCPGH(pInfo.cpgh);
					}
					if(pInfo.mjting){ //已经听过了 拍的颜色
						this.setMyHandPaiGray();
					}
				}
			}

			if(pInfo){
				if (this.tData.curPlayer >= 0) {
					var isPeng ;
					var isGang ;
					if(typeof(pInfo.cpgh) === "undefined"){
						isPeng = false;
						isGang = false;
					}else{
						isPeng = pInfo.cpgh[1]>0?true:false;
						isGang = pInfo.cpgh[2]>0?true:false;
					}
					
					this.refreshMjPutUI(index);
					//断线重连或者手牌初始化
					this.hiddenHandPai(index, this.tData.lastPut, isPeng,isGang);
					this.showHandPengOrGang(pInfo.info.uid);
				}
			}

			if(i === 0){
				if(this.tData.curPlayer >= 0){
					if (this.isCurrent()&&this.tData.tState!=4) {
						cc.logManager.info("this is current player!");
						this.registerMJMove(); //激活事件
						this.hand13Show();
						if(pInfo.mjting){
							this.isTingClick = true;
							this.dealWithPai("13");
						}
					}
				}
			}
			
		}
		cc.jsInstance.players = this.players;
	},

	playAnimForBegin:function(){
		cc.logManager.info("playerManager playAnimForBegin!");
		if(!cc.jsInstance.HavePlayStartAnim){
			this.playAnimTool.playAnimDDZForStart();
			cc.jsInstance.HavePlayStartAnim = true;
		}
	},

	setCPGHData: function(pInfo) {
		cc.logManager.info("playerManager setCPGHData!");
		if (this.tData.uids[this.tData.curPlayer] === pInfo.info.uid) {

			if(!pInfo.cpgh){
				var cpgh = [0,0,0,0];
				pInfo.cpgh = cpgh;
			}
			//自己的回合
			if (pInfo.cpgh[2] === 1) {
				this.newCard = pInfo.mjhand[pInfo.mjhand.length - 1];
			}
			
			//听的状态添加进来
			if (pInfo.tingArr.length > 0) {
				this.tingArr = pInfo.tingArr;
				this.canTing = true;
			}

			if (pInfo.gangArr.length > 0) {
				this.gangArr = pInfo.gangArr;
				pInfo.cpgh[2] = 1;
			}

			if(pInfo.canhu > 0){
				pInfo.cpgh[3] = 1;
			}
		} else {
			if (pInfo.cpgh[1] === 1) {
				this.putCard = this.tData.lastPut;
			}
			if (pInfo.cpgh[2] === 1) {
				this.gangArr = [];
				this.gangArr[0] = this.tData.lastPut;
			}
			if(pInfo.canhu > 0){
				pInfo.cpgh[3] = 1;
			}
		}

		//mjting = ture 处于听牌状态 
		if (!pInfo.mjting) {
			if(pInfo.tingArr.length > 0){
				this.isTingClick = false;
				this.canTing = true;
			}else{
				this.isTingClick = false;
				this.canTing = false;
			}
		}else{
			this.isTingClick = true;
			this.canTing = false;
		}
	},

	setGobalMjHandData: function() {
		cc.jsInstance.putnum = this.putnum;
		cc.jsInstance.rightPutNum = this.rightPutNum;
		cc.jsInstance.upPutNum = this.upPutNum;
		cc.jsInstance.leftPutNum = this.leftPutNum;
	},

	//刷新手牌
	refreshHandPai: function(handPai) {
		cc.logManager.info("playerManager refreshHandPai");
		if (handPai) {
			this.players[0].mjhand = handPai;
		}
		this.orderMjhand = this.players[0].mjhand.slice(0); //深拷贝
		//我拿到this.orderMjhand 这个数组的时候就给它处理成有序的
		this.makeTheHandPaiOrdered();
	},

	//使手牌有序
	makeTheHandPaiOrdered:function(){
		cc.logManager.info("playerManager makeTheHandPaiOrdered");
		this.orderMjhand = this.playerTool.orderThePlayerHands(this.orderMjhand,true);
	},

	//刷新自己打出去的牌UI
	refreshMJput: function(mjName) {
		cc.logManager.info("playerManager refreshMJput");
		var myselfBigNode = this.myself.getChildByName("big");
		myselfBigNode.setPosition(this.myselfBigPosition);
		var putNode = this.myself.getChildByName("mjput").getChildByName("put_" + this.putnum++);
		this.playerTool.playMJPutAnimation(myselfBigNode, putNode, mjName);
		putNode.getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(mjName, "B");
		this.setGobalMjHandData();
	},

	isCurrent:function(){
		cc.logManager.info("playerManager isCurrent");
		this.tData = cc.jsInstance.data.sData.tData;
		if(this.tData.uids[this.tData.curPlayer]===this.playerTool.getUserId()){
			return true;
		}

		var player = this.players[0];
		var allLength = this.orderMjhand.length +player.mjangang.length * 3+player.mjpeng.length*3+player.mjgang.length*3;

		if(allLength === 14){
			return true;
		}
		return false;
	},

	//刷新其他人的手牌
	refreshOtherMJPut: function(name, type) {
		cc.logManager.info("playerManager refreshOtherMJPut");
		var putNode;
		switch (type) {
			case "R":
				console.log("R,rightPutNum==", this.rightPutNum);
				var rightBigNode = this.right.getChildByName("big");
				rightBigNode.setPosition(this.rightBigPosition);
				putNode = this.right.getChildByName("mjput").getChildByName("put_" + this.rightPutNum++);
				this.playerTool.playMJPutAnimation(rightBigNode, putNode, name);
				break;
			case "L":
				var leftBigNode = this.left.getChildByName("big");
				leftBigNode.setPosition(this.leftBigPosition);
				putNode = this.left.getChildByName("mjput").getChildByName("put_" + this.leftPutNum++);
				this.playerTool.playMJPutAnimation(leftBigNode, putNode, name);
				break;
			case "B":
				var upBigNode = this.up.getChildByName("big");
				upBigNode.setPosition(this.upBigPosition);
				putNode = this.up.getChildByName("mjput").getChildByName("put_" + this.upPutNum++);
				this.playerTool.playMJPutAnimation(upBigNode, putNode, name);
				break;
		}
		this.setGobalMjHandData();
		putNode.active = true;
		putNode.getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(name, type);
		this.setGobalMjHandData();
	},

	dealWithPai: function(index) {
		cc.logManager.info("playerManager dealWithPai");
		//根据标记拦截下事件，条件足够执行下边
		if(!this.ishosted){
			if (this.handPaiNodeUpArr[index] === 0) {
				if (index === "13") {
					var handNode = this.myself.getChildByName("mjhand").getChildByName("hand_" + index);
					if (!this.isTingClick || this.isTingClick && this.canTing) {
						console.log("走了dealWithPai index=13");
						handNode.setPosition(handNode.x, handNode.y + 20);
						this.handPaiNodeUpArr[index] = 1;
						this.setHavePutGrey(this.orderMjhand[this.orderMjhand.length-1]);
					}
				}

				var hand = this.orderMjhand.slice(0);
				var handIndex;
				if (index === "13") {
					handIndex = this.orderMjhand.length - 1;
				} else {
					handIndex = index;
				}
				hand.splice(handIndex, 1);
				if(!this.tingkouArr){
					this.tingkouArr = [];
				}

				// if(!this.tData.guaisanjiao){
					this.getTingkouByTool(hand);
				// }
				
				if (this.isTingClick && this.canTing) {
					this.showTingkouNode(this.tingkouArr);
					this.myself.getChildByName("showTingkou").getChildByName("pass").active = true;
					
				} else {
					if (this.tingkouArr.length > 0) {
						this.showTingkouNode(this.tingkouArr);
						//不报听的不显示过
						this.myself.getChildByName("showTingkou").getChildByName("pass").active = false;
					} else {
						this.myself.getChildByName("showTingkou").active = false;
					}
				}
	
				for (var i = 0; i < this.handPaiNodeUpArr.length; i++) {
					var handNode = this.myself.getChildByName("mjhand").getChildByName("hand_" + i);
					if (!this.isTingClick || this.isTingClick && this.canTing) {
						if (i === parseInt(index)) {
							if (this.handPaiNodeUpArr[i] === 0) {
								handNode.setPosition(handNode.x, handNode.y + 20);
								this.handPaiNodeUpArr[i] = 1;
								this.setHavePutGrey(this.orderMjhand[i]);
							}
						} else {
							if (this.handPaiNodeUpArr[i] === 1) {
								this.handPaiNodeUpArr[i] = 0;
								handNode.setPosition(handNode.x, handNode.y - 20);
							}
						}
	
					} else {
						this.myself.getChildByName("showTingkou").active = false;
						break;
					}
				}
				if (this.isTingClick && this.canTing || !this.isTingClick) {
					return;
				}
			} else if (this.handPaiNodeUpArr[index] === 1) {
				this.handPaiNodeUpArr[index] = 0;
				var handNode = this.myself.getChildByName("mjhand").getChildByName("hand_" + index);
				handNode.setPosition(handNode.x, handNode.y - 20);
				if (this.isTingClick) {
					if (this.canTing) {
						this.canTing = false; //听过了
						this.sendTingMessage(index);
					}
				}
			}
		}else{
			for (var i = 0; i < this.handPaiNodeUpArr.length; i++) {
					var handNode = this.myself.getChildByName("mjhand").getChildByName("hand_" + i);
					if (this.handPaiNodeUpArr[i] === 1) {
						this.handPaiNodeUpArr[i] = 0;
						handNode.setPosition(handNode.x, handNode.y - 20);
					}	
				}
		}

		if (index === "13") {
			//打了抓来的牌，不需要排序 
			console.log("put pai 13")
			this.hand13Hide();
			cc.jsInstance.network.tableMsgMjput(this.orderMjhand[this.orderMjhand.length - 1]);
			//加动画！
			this.orderMjhand.splice(this.orderMjhand.length - 1, 1);
		} else {
			this.hand13Hide();
			cc.jsInstance.network.tableMsgMjput(this.orderMjhand[index]);
			this.orderMjhand.splice(index, 1);//加动画！
			this.refreshMyHand(true);
			this.orderTheMJHandPai();
		}
		cc.jsInstance.waitPeng = false;
		this.offTheMoveEvent(); //关闭事件响应
	},

	setHavePutGrey:function(paiNum){
		cc.logManager.info("playerManager setHavePutGrey");
		this.setHavePutWhite();
		for(var i = 0; i < this.players.length;i++){
			var player = this.players[i];
			for(var j = 0 ; j < player.mjput.length;j++){
				var putPaiNum = player.mjput[j];
				if(putPaiNum === paiNum){
					if(i===0){
						this.myself.getChildByName("mjput").getChildByName("put_"+j).color = cc.hexToColor(pMColor.darkgrey);
					}else if(i===1){
						this.right.getChildByName("mjput").getChildByName("put_"+j).color = cc.hexToColor(pMColor.darkgrey);
					}else if(i===2){
						this.up.getChildByName("mjput").getChildByName("put_"+j).color = cc.hexToColor(pMColor.darkgrey);
					}else{
						this.left.getChildByName("mjput").getChildByName("put_"+j).color = cc.hexToColor(pMColor.darkgrey);
					}
				}
			}
		}
	},

	setHavePutWhite:function(){
		cc.logManager.info("playerManager setHavePutWhite");
		for(var j = 0 ; j < 41;j++){
			if(j<30){
				this.right.getChildByName("mjput").getChildByName("put_"+j).color = cc.hexToColor(pMColor.white);
				this.left.getChildByName("mjput").getChildByName("put_"+j).color = cc.hexToColor(pMColor.white);
			}
			this.myself.getChildByName("mjput").getChildByName("put_"+j).color = cc.hexToColor(pMColor.white);
			this.up.getChildByName("mjput").getChildByName("put_"+j).color =cc.hexToColor(pMColor.white);
		}
		
	},

	showTingkouNode: function(test) {
		cc.logManager.info("playerManager showTingkouNode");
		this.myself.getChildByName("showTingkou").active = true;
		this.hiddenTingKouNode();
		var tingkouNum = test.length>9?9:test.length;
		var tingkouWidth = 300;
		if(tingkouNum > 3){
			tingkouWidth = 300 + (tingkouNum - 3)*100;
		}
		this.myself.getChildByName("showTingkou").width = tingkouWidth;
		for (var k = 0; k < tingkouNum;k++) {
			var tingkouNode = this.myself.getChildByName("showTingkou").getChildByName("tingkou" + k);
			tingkouNode.active = true;
			tingkouNode.getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(test[k], "M");
			var everyLeftCardNum = this.playerTool.caclulateTingkouForleftCard(this.orderMjhand, this.players, test[k]);
			tingkouNode.getChildByName("countLab").getComponent(cc.Label).string = "" + everyLeftCardNum;
		}

	},

	hiddenTingKouNode: function() {
		cc.logManager.info("playerManager hiddenTingKouNode");
		for (var i = 0; i < 9; i++) {
			var tingkouNode = this.myself.getChildByName("showTingkou").getChildByName("tingkou" + i);
			tingkouNode.active = false;
		}
	},

	cancelTing: function() {
		cc.logManager.info("playerManager cancelTing");
		this.myself.getChildByName("showTingkou").active = false;
		this.isTingClick = false;
		this.canTing = false;
		for (var i = 0; i < this.orderMjhand.length; i++) {
			var paiNode = this.myself.getChildByName("mjhand").getChildByName("hand_" + i);
			var btn = paiNode.getComponent(cc.Button);
			btn.normalColor = cc.hexToColor(pMColor.white);
		}
		//第十三张牌
		var paiNode = this.myself.getChildByName("mjhand").getChildByName("hand_13");
		var btn = paiNode.getComponent(cc.Button);
		btn.normalColor = cc.hexToColor(pMColor.white);
		this.registerMJMove();
	},

	sendTingMessage: function(index) {
		cc.logManager.info("playerManager sendTingMessage index===",index);
		this.myself.getChildByName("showTingkou").active = false;
		if (index === "13") {
			cc.jsInstance.network.tableMsgMjputTing(this.orderMjhand[this.orderMjhand.length - 1]);
		} else {
			cc.jsInstance.network.tableMsgMjputTing(this.orderMjhand[index]);
		}
		this.setMyHandPaiGray();
	},

	setMyHandPaiGray(){
		cc.logManager.info("playerManager setMyHandPaiGray");
		for (var i = 0; i < this.orderMjhand.length; i++) {
			var paiNode = this.myself.getChildByName("mjhand").getChildByName("hand_" + i);
			var btn = paiNode.getComponent(cc.Button);
			btn.normalColor = cc.hexToColor(pMColor.darkgrey);
		}
	},

	showOthers13Hand: function(uid) {
		cc.logManager.info("playerManager showOthers13Hand");
		var index = this.playerTool.transformUidsLocation(uid);
		this.right.getChildByName("mjhand").getChildByName("hand_13").active = false;
		this.up.getChildByName("mjhand").getChildByName("hand_13").active = false;
		this.left.getChildByName("mjhand").getChildByName("hand_13").active = false;
		index = this.playerTool.getIndexByGameKind(index);
		switch (index) {
			case 1:
				this.right.getChildByName("mjhand").getChildByName("hand_13").active = true;
				break;
			case 2:
				this.up.getChildByName("mjhand").getChildByName("hand_13").active = true;
				break;
			case 3:
				this.left.getChildByName("mjhand").getChildByName("hand_13").active = true;
				break;
			default:break;
		}
	},

	hand13Hide: function() {
		cc.logManager.info("playerManager hand13Hide");
		this.myself.getChildByName("mjhand").getChildByName("hand_13").active = false;
	},

	hand13Show: function() {
		cc.logManager.info("playerManager hand13Show");
		this.myself.getChildByName("mjhand").getChildByName("hand_13").active = true;
	},

	//只有初始化和断线重连才会走
	orderTheMJHandPaiAndDeal:function(isNeedSubLength){
		cc.logManager.info("playerManager orderTheMJHandPaiAndDeal");
		this.orderMjhand = this.playerTool.orderThePlayerHands(this.orderMjhand,true);
		var player = this.players[0];
		var hand = player.mjhand;
		var lastGetCard = hand[hand.length - 1];
        for(var i = 0;i < this.orderMjhand.length;i++){
            if(this.orderMjhand[i]===lastGetCard){
                this.orderMjhand.splice(i,1);
                break;
            }
        }
		this.orderMjhand.push(lastGetCard); 
		if (!this.tData.needTing) {
			this.checkIsTing();
		}
		this.setPaiSpriteFrame(isNeedSubLength);
	},

	//打完牌之后刷新牌
	orderTheMJHandPai: function() {
		cc.logManager.info("playerManager orderTheMJHandPai");
		this.orderMjhand = this.playerTool.orderThePlayerHands(this.orderMjhand,true);
		if (!this.tData.needTing&&this.isCurrent()) {
			this.checkIsTing();
		}
		this.setPaiSpriteFrame(false);
	},

	setPaiSpriteFrame: function(isNeedSubLength) {
		cc.logManager.info("playerManager setPaiSpriteFrame");
		var showLength = isNeedSubLength?this.orderMjhand.length-1:this.orderMjhand.length;
		
		for (var i = 0; i < showLength; i++) {
			this.myself.getChildByName("mjhand").getChildByName("hand_" + i).getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(this.orderMjhand[i], "M");
			this.myself.getChildByName("mjhand").getChildByName("hand_" + i).active = true;
			if(this.orderMjhand[i] === this.tData.haozi){
				this.myself.getChildByName("mjhand").getChildByName("hand_" + i).getChildByName("dt_play_laizi_img").active = true;
			}else{
				this.myself.getChildByName("mjhand").getChildByName("hand_" + i).getChildByName("dt_play_laizi_img").active = false;
			}
		}
	},

	//检测吃碰杠胡
	checkCPGH: function(cpgh) {
		cc.logManager.info("playerManager checkCPGH");
		this.dealedCpgh = [];

		if(!this.gangArr){
			this.gangArr = [];
		}

		if (cpgh[2] === 1) {
			this.isGang = true;
			if (this.gangArr.length > 0) {
				for (var i = 0; i < this.gangArr.length; i++) {
					this.dealedCpgh.push("dy_play_gang_btn");
				}
			} else {
				this.dealedCpgh.push("dy_play_gang_btn");
			}
		}

		for (var i = 0; i < cpgh.length; i++) {
			if (cpgh[i] === 1) {
				switch (i) {
					case 0:
					this.dealedCpgh.push("dy_play_chi_btn");
						break;
					case 1:
					this.dealedCpgh.splice(0,0,"dy_play_peng_btn"); //插入到第一位准备显示
						break;
					case 3:
					this.dealedCpgh.push("dy_play_hu_btn");
						break;
				}
			}
		}

		if (this.canTing && !this.isTingClick) {
			this.dealedCpgh.push("dy_play_ting_btn");
		}
		if(this.tData.gameKind === "goldgame"){
			cc.jsInstance.cpgh = cpgh;
		}
		this.showEatFlagTag(this.dealedCpgh);
	},

	showEatFlagTag: function(showArr) {
		cc.logManager.info("playerManager showEatFlagTag");
		this.canPeng = false;
		if (showArr.length > 0) {
			this.playEatFlag.active = true;
			this.playEatFlag.getChildByName("pass").active = true;
			var iskoudian = this.playerTool.isKoudian();
			var player0hands = this.players[0].mjhand;
			var isHaozi = player0hands[player0hands.length-1]===this.tData.haozi;
			if(iskoudian&&(this.isCurrent()||this.selfGetCardCanHu)&&isHaozi){
				this.playEatFlag.getChildByName("pass").active = false;
			}

		}

		//显示之前全部隐藏先
		for (var i = 0; i < 4; i++) {
			var flag = this.playEatFlag.getChildByName("fiag_" + i);
			flag.active = false;
		}
		var self = this;
		//杠在最前面出现
		for (var i = 0; i < showArr.length; i++) {
			var flag = this.playEatFlag.getChildByName("fiag_" + i);
			flag.active = true;
			var paiNode = flag.getChildByName("pai");
			paiNode.active = true;
			var actionNode = flag.getChildByName("action");
			if (showArr[i] === "dy_play_ting_btn") {
				paiNode.active = false;
				actionNode.getComponent(cc.Sprite).spriteFrame = this.dy_play_ting_btn;
			} else if (showArr[i] === "dy_play_peng_btn") {
				this.canPeng = true;
				this.setPaiNode("p",paiNode);
				actionNode.getComponent(cc.Sprite).spriteFrame = this.dy_play_peng_btn;
			} else if (showArr[i] === "dy_play_gang_btn") {
				if (this.gangArr.length > 0) {
					paiNode.getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(this.gangArr[this.canPeng?i-1:i], "B");
				} else {
					this.setPaiNode("g",paiNode);
				}
				actionNode.getComponent(cc.Sprite).spriteFrame = this.dy_play_gang_btn;
			} else if (showArr[i] === "dy_play_hu_btn") {
				this.setPaiNode("h", paiNode);
				actionNode.getComponent(cc.Sprite).spriteFrame = this.dy_play_hu_btn;
			}
		}

		if(this.ishosted){
			if(showArr.indexOf("dy_play_hu_btn")>=0){
				this.scheduleOnce(function(){
					self.huClick();
				},1);
			}else{
				this.scheduleOnce(function(){
					self.passClick();
				},1);
			}
		}
	},

	setPaiNode: function(type, paiNode) {
		cc.logManager.info("playerManager setPaiNode");
		var showCard = this.putCard;
		this.tData = cc.jsInstance.data.sData.tData;

		var player = this.players[0];
		var allLength = this.orderMjhand.length +player.mjangang.length * 3+player.mjpeng.length*3+player.mjgang.length*3;

		if(typeof(this.selfGetCardCanHu) === "undefined"){
			if(allLength === 14&&type==="h"){
				this.selfGetCardCanHu = true;
			}else if(type === "h"&&allLength === 13){
				this.selfGetCardCanHu = false;
			}
		}

		if(type === "p"){
			//碰的值显示的一定是最后打的牌
			showCard = this.tData.lastPut?this.tData.lastPut:this.tData.lastPut;
		}else if(type === "h"){
			//点炮胡
			if(!this.isCurrent()&&!this.selfGetCardCanHu){
				showCard = this.tData.lastPut;
			//自摸胡
			}else if(this.isCurrent()&&this.selfGetCardCanHu){
				var hand = this.players[0].mjhand;
				showCard = this.newCard?this.newCard:hand[hand.length - 1];
				// this.selfGetCardCanHu = false;
			}
		}else if(type === "g"){
			//自己摸到牌杠 暗杠或者补杠
			if(this.isCurrent()&&allLength===14){
				//可能有好几个牌等着杠
				if (this.gangArr&&this.gangArr.length > 0) {
					if (this.isGang&&type==="g") {
						showCard = this.gangArr[0];
						this.isGang = false;
					} else {
						showCard = this.newCard?this.newCard:this.players[0].mjhand[0];
					}
				}
			}else if(allLength === 13){
				//被点杠
				showCard = this.tData.lastPut;
			}
		}		
		paiNode.getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(showCard, "B");
	},

	showHandPengOrGang: function(uid) {
		var index = this.playerTool.transformUidsLocation(uid);
		//下方获取用户信息不要转化，确保位置正确
		if (this.playerTool.isForTwoPlayers()) {
			if (index != 0) {
				index = 1;
			}
		}else if(this.playerTool.isForThreePlayers()){
			if (index === 3) {
				index = 2;
			}
		}
		var pInfo = this.playerTool.getUIPlayer(index);
		index = this.playerTool.getIndexByGameKind(index);
		switch (index) {
			//自己 0号位
			case 0:
				this.playerTool.dealWithHandPengOrGang(this.players[0].mjangang, this.players[0].mjgang, this.players[0].mjpeng, this.myself, "B", pInfo,0);
				break;

				//上家 1号位
			case 1:
				this.playerTool.dealWithHandPengOrGang(this.players[1].mjangang, this.players[1].mjgang, this.players[1].mjpeng, this.right, "R", pInfo,1);
				break;

				//对家 2号位
			case 2:
				this.playerTool.dealWithHandPengOrGang(this.players[2].mjangang, this.players[2].mjgang, this.players[2].mjpeng, this.up, "B", pInfo,2);
				break;

				//下家 3号位
			case 3:
				this.playerTool.dealWithHandPengOrGang(this.players[3].mjangang, this.players[3].mjgang, this.players[3].mjpeng, this.left, "L", pInfo,3);
				break;
		}
	},

	hiddenIndexOfMJPutOnTable: function(index) {
		cc.logManager.info("playerManager hiddenIndexOfMJPutOnTable");
		var localIndex = this.playerTool.transformUidsLocation(this.sData.tData.uids[index]);
		localIndex = this.playerTool.getIndexByGameKind(localIndex);
		var putNode;
		switch (localIndex) {
			case 0:
				this.putnum--;
				putNode = this.myself.getChildByName("mjput").getChildByName("put_" + this.putnum);
				break;
			case 1:
				this.rightPutNum--;
				putNode = this.right.getChildByName("mjput").getChildByName("put_" + this.rightPutNum);
				break;
			case 2:
				this.upPutNum--;
				putNode = this.up.getChildByName("mjput").getChildByName("put_" + this.upPutNum);
				break;
			case 3:
				this.leftPutNum--;
				putNode = this.left.getChildByName("mjput").getChildByName("put_" + this.leftPutNum);
				break;
		}
		this.setGobalMjHandData();
		putNode.active = false;
	},

	//碰，杠，和初始化会走这个方法
	hiddenHandPai: function(index, lastPut, isPeng,isGang) {
		cc.logManager.info("playerManager hiddenHandPai");
		index = this.playerTool.getIndexByGameKind(index);
		switch (index) {
			case 0:
				if (isPeng&&this.isCurrent()) {
					//为了第0张牌显示在待打牌位置
					this.orderMjhand.push(this.orderMjhand[0]);
					this.orderMjhand.splice(0,1);
					this.refreshMyHandForPengAction(isPeng);
					this.setPaiSpriteFrame(true);
				}else if(isGang){
					if(this.isCurrent()){
						this.orderTheMJHandPaiAndDeal(false);
					}else{
						this.orderTheMJHandPai();
					}
					this.refreshMyHand(false);
				}else {
					//断线重连
					if (this.isCurrent()&&this.tData.tState!=4) {
						this.orderTheMJHandPaiAndDeal(false);
						this.refreshMyHand(false);
					} else {
						this.refreshMyHand(false);
						this.orderTheMJHandPai();
					}
				}
				break;
			case 1:
				var rightHand = this.right.getChildByName("mjhand");
				var mjpeng = this.players[1].mjpeng;
				var mjangang = this.players[1].mjangang;
				var mjgang = this.players[1].mjgang;
				this.playerTool.hiddenHandPaiByPG(rightHand, mjpeng, mjgang, mjangang);
				break;
			case 2:
				var upHand = this.up.getChildByName("mjhand");
				var mjpeng = this.players[2].mjpeng;
				var mjangang = this.players[2].mjangang;
				var mjgang = this.players[2].mjgang;
				this.playerTool.hiddenHandPaiByPG(upHand, mjpeng, mjgang, mjangang);
				break;
			case 3:
				var leftHand = this.left.getChildByName("mjhand");
				var mjpeng = this.players[3].mjpeng;
				var mjangang = this.players[3].mjangang;
				var mjgang = this.players[3].mjgang;
				this.playerTool.hiddenHandPaiByPG(leftHand, mjpeng, mjgang, mjangang);
				break;
		}
	},

	deleteMyOrderHand: function(card) {
		//隐藏暗杠
		cc.logManager.info("playerManager deleteMyOrderHand");
		var num = 0;
		var myselfAnGang = this.players[0].mjangang;
		for (var j = 0; j < myselfAnGang.length; j++) {
			for (var i = 0; i < this.orderMjhand.length; i++) {
				if (this.orderMjhand[i] === myselfAnGang[j]) {
					num++
					this.orderMjhand.splice(i, 1);
					i--;
				}
				if(num === 4){
					break;
				}
			}
			if(num === 4){
				break;
			}
		}

		num = 0;
		var myselfMJGang = this.players[0].mjgang;
		//删除 手牌中 存在于明杠数组的元素
		for (var j = 0; j < myselfMJGang.length; j++) {
			for (var i = 0; i < this.orderMjhand.length; i++) {
				if (this.orderMjhand[i] === myselfMJGang[j]) {
					num++
					this.orderMjhand.splice(i, 1);
					i--;
				}
				if(num === 4){
					break;
				}
			}
			if(num === 4){
				break;
			}
		}

		var myselfMJPeng = this.players[0].mjpeng;
		if (myselfMJPeng.indexOf(card) >= 0) {
			for (var i = 0; i < this.orderMjhand.length; i++) {
				if (this.orderMjhand[i] === card) {
					this.orderMjhand.splice(i, 2);
					break;
				}
			}
		}
	},

	passClick: function() {
		cc.logManager.info("playerManager passClick");
		var self = this;
		if(this.dealedCpgh.indexOf("dy_play_hu_btn")>=0){
			cc.jsInstance.msgpop.showMsg_text_close_cancle("确认过胡嘛？", function() {
				self.passClicked();
				//不是自摸的情况飘过胡
				if(!self.isCurrent()){
					self.skipHu = true;
				}
			},function(){
				return;
			})
		}else{
			self.passClicked();
		}
	},

	passClicked:function(){
		cc.logManager.info("playerManager passClicked");
		this.tData = cc.jsInstance.data.sData.tData;
		if (!this.isCurrent()) {
			cc.logManager.info("playerManager passClicked 别人回合的过!");
			this.isPassClicked = true;
			cc.jsInstance.network.tableMsgMJPass();
		}else{
			this.dealWithPassUI();
		}
	},

	dealWithPassUI:function(){
		cc.logManager.info("playerManager dealWithPassUI");
		this.hiddenPassUI();
		if (this.isTingClick && this.isCurrent()) {
			this.dealWithPai("13");
		}else if(this.ishosted&&this.isCurrent()){
			this.dealWithPai("13");
		}
	},

	hiddenPassUI:function(){
		cc.logManager.info("playerManager hiddenPassUI");
		cc.jsInstance.waitPeng = false;
		this.canTing = false;
		this.playEatFlag.active = false;
		cc.jsInstance.cpgh = [-1,-1,-1,-1];
	},

	pengClick: function() {
		cc.logManager.info("playerManager pengClick");
		cc.jsInstance.waitPeng = true;
		cc.jsInstance.network.tableMsgMJPeng(this.putCard);
		this.hiddeTingTips();
	},

	gangClick: function(index) {
		cc.logManager.info("playerManager gangClick");
		cc.jsInstance.waitPeng = true;
		if (this.gangArr.length > 0) {
			console.log("gangclick==");
			cc.jsInstance.network.tableMsgMJGangMy(this.gangArr[index]);
		} else {
			cc.jsInstance.network.tableMsgMJGang(this.putCard);
		}
		this.hiddeTingTips();
	},

	tingClick: function() {
		cc.logManager.info("playerManager tingClick");
		this.isTingClick = true;
		var canPutPaiArr = [];
		for (var i = 0; i < this.tingArr.length; i++) {
			var canPutPai = this.players[0].mjhand[this.tingArr[i]];
			if (canPutPaiArr.indexOf(canPutPai) < 0) {
				canPutPaiArr.push(canPutPai);
			}
		}

		for (var i = 0; i < this.orderMjhand.length; i++) {
			var paiNode = this.myself.getChildByName("mjhand").getChildByName("hand_" + i);
			var btn = paiNode.getComponent(cc.Button);
			if (canPutPaiArr.indexOf(this.orderMjhand[i]) >= 0) {
				paiNode.on(cc.Node.EventType.TOUCH_START, this.touchStart, this); //包含的话可以打
			} else {
				btn.normalColor = cc.hexToColor(pMColor.darkgrey);
				paiNode.off(cc.Node.EventType.TOUCH_START); //否则不可以打
			}
		}
		//TODO 处理第十三张牌
		var paiNode13 = this.myself.getChildByName("mjhand").getChildByName("hand_13");
		if (canPutPaiArr.indexOf(this.orderMjhand[this.orderMjhand.length - 1]) >= 0) {
			paiNode13.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
		} else {
			var btn = paiNode13.getComponent(cc.Button);
			btn.normalColor = cc.hexToColor(pMColor.darkgrey);
			paiNode13.off(cc.Node.EventType.TOUCH_START);
		}
		this.playEatFlag.active = false;
	},

	huClick: function() {
		cc.logManager.info("playerManager huClick");
		//本局结束 所有状态置空
		if (this.selfGetCardCanHu||this.isCurrent()) {
			cc.jsInstance.network.tableMsgMJHuMy();
		} else {
			cc.jsInstance.network.tableMsgMJHu();
		}
		this.playEatFlag.active = false;
	},

	eatFlagClick: function(e) {
		cc.logManager.info("playerManager eatFlagClick");
		var spriteName = e.currentTarget.getComponent(cc.Sprite).spriteFrame.name;
		var fiagIndex = e.currentTarget.parent.name.substr(5);
		cc.jsInstance.cpgh = [-1,-1,-1,-1];
		if (spriteName === "dy_play_peng_btn") {
			this.pengClick();
		} else if (spriteName === "dy_play_gang_btn") {
			if(this.isCurrent()){
				this.gangClick(parseInt(fiagIndex));
			}else{
				this.gangClick(0);
			}
		} else if (spriteName === "dy_play_hu_btn") {
			this.huClick();
		} else if (spriteName === "dy_play_ting_btn") {
			this.tingClick();
		}
	},

	offTheMoveEvent: function() {
		cc.logManager.info("playerManager offTheMoveEvent");
		this.hiddeTingTips();
		this.gangArr = [];
		for (var i = 0; i < 13; i++) {
			var paiNode = this.myself.getChildByName("mjhand").getChildByName("hand_" + i);
			paiNode.off(cc.Node.EventType.TOUCH_START);
		}
	},

	hiddeTingTips(){
		cc.logManager.info("playerManager hiddeTingTips");
		if(!this.canPutCardsNode){
			this.canPutCardsNode = [];
			return;
		}
		if (!this.tData.needTing) {
			//销毁刚才创建的剪头提示节点
			for (var i = 0; i < this.canPutCardsNode.length; i++) {
				var tipsNode = this.canPutCardsNode[i];
				tipsNode.destroy();
			}
		}
		this.canPutCardsNode = [];
	},

	touchStart: function(event) {
		cc.logManager.info("playerManager touchStart");
		var nodeName = event.currentTarget.name;
		var index = nodeName.substr(5);
		console.log("playerManager touchStart index ==", index);
		cc.logManager.info("playerManager touchStart");
		this.dealWithPai(index);
	},

	registerMJMove: function() {
		cc.logManager.info("playerManager registerMJMove");
		if (!this.tData.needTing) {
			this.checkIsTing();
		}

		if (this.isTingClick) {
			return;
		}
		for (var i = 0; i < 14; i++) {
			var paiNode = this.myself.getChildByName("mjhand").getChildByName("hand_" + i);
			paiNode.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
		}
	},

	refreshMjPutUI: function(index) {
		cc.logManager.info("playerManager refreshMjPutUI");
		index = this.playerTool.getIndexByGameKind(index);
		switch (index) {
			case 0:
				for (var i = 0; i < this.players[0].mjput.length; i++) {
					var putNode = this.myself.getChildByName("mjput").getChildByName("put_" + this.putnum++);
					putNode.active = true;
					putNode.getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(this.players[0].mjput[i], "B");
				}
				break;
			case 1:
				for (var i = 0; i < this.players[1].mjput.length; i++) {
					var putNode = this.right.getChildByName("mjput").getChildByName("put_" + this.rightPutNum++);
					putNode.active = true;
					putNode.getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(this.players[1].mjput[i], "R");
				}
				break;
			case 2:
				for (var i = 0; i < this.players[2].mjput.length; i++) {
					var putNode = this.up.getChildByName("mjput").getChildByName("put_" + this.upPutNum++);
					putNode.active = true;
					putNode.getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(this.players[2].mjput[i], "B");
				}
				break;
			case 3:
				for (var i = 0; i < this.players[3].mjput.length; i++) {
					var putNode = this.left.getChildByName("mjput").getChildByName("put_" + this.leftPutNum++);
					putNode.active = true;
					putNode.getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(this.players[3].mjput[i], "L");
				}
				break;
		}
		this.setGobalMjHandData();
	},

	refreshMyHandForPengAction: function(isPeng) {
		cc.logManager.info("playerManager refreshMyHandForPengAction");
		//当前的回合是我的回合
		for (var i = 0; i < 13; i++) {
			this.myself.getChildByName("mjhand").getChildByName("hand_" + i).active = false;
		}
		var player = this.players[0];
		var allLength = this.orderMjhand.length +player.mjangang.length * 3+player.mjpeng.length*3+player.mjgang.length*3;

		//碰玩牌之后走这里处理完毕
		if(isPeng&&allLength===14){
			this.hand13Show();
			this.myself.getChildByName("mjhand").getChildByName("hand_13").getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(this.orderMjhand[this.orderMjhand.length - 1], "M");
			if(this.orderMjhand[this.orderMjhand.length - 1] === this.tData.haozi){
				this.myself.getChildByName("mjhand").getChildByName("hand_13").getChildByName("dt_play_laizi_img").active = true;
			}else{
				this.myself.getChildByName("mjhand").getChildByName("hand_13").getChildByName("dt_play_laizi_img").active = false;
			}

			for (var i = 0; i < this.orderMjhand.length - 1; i++) {
				this.myself.getChildByName("mjhand").getChildByName("hand_" + i).active = true;
			}
		}else{
			this.hand13Hide();
			for (var i = 0; i < this.orderMjhand.length; i++) {
				this.myself.getChildByName("mjhand").getChildByName("hand_" + i).active = true;
				if(this.orderMjhand[i] === this.tData.haozi){
					this.myself.getChildByName("mjhand").getChildByName("hand_" + i).getChildByName("dt_play_laizi_img").active = true;
				}else{
					this.myself.getChildByName("mjhand").getChildByName("hand_" + i).getChildByName("dt_play_laizi_img").active = false;
				}
	
			}
		}


		
		
		
	},

	refreshMyHand: function(isPutPai) {
		cc.logManager.info("playerManager refreshMyHand");

		for (var i = 0; i < 14; i++) {
			this.myself.getChildByName("mjhand").getChildByName("hand_" + i).active = false;
		}
		
		var player = this.players[0];
		var allLength = this.orderMjhand.length +player.mjangang.length * 3+player.mjpeng.length*3+player.mjgang.length*3;
		if(this.isCurrent()&&allLength===14){
			console.log("refreshMyHand");
			this.hand13Show();
			this.myself.getChildByName("mjhand").getChildByName("hand_13").getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(this.orderMjhand[this.orderMjhand.length - 1], "M");
			if(this.orderMjhand[this.orderMjhand.length - 1] === this.tData.haozi){
				this.myself.getChildByName("mjhand").getChildByName("hand_13").getChildByName("dt_play_laizi_img").active = true;
			}else{
				this.myself.getChildByName("mjhand").getChildByName("hand_13").getChildByName("dt_play_laizi_img").active = false;
			}
			for (var i = 0; i < this.orderMjhand.length - 1; i++) {
				this.myself.getChildByName("mjhand").getChildByName("hand_" + i).active = true;
			}
		}else{
			for (var i = 0; i < this.orderMjhand.length; i++) {
				this.myself.getChildByName("mjhand").getChildByName("hand_" + i).active = true;
			}
		}
	},

	pengPai: function(data) {
		cc.logManager.info("playerManager pengPai");
		cc.jsInstance.waitPeng = false;
		this.playEatFlag.active = false;
		if (this.currentPutNode) {
			this.currentPutNode.destroy();
		}
		this.hiddeTingTips();
		this.players = cc.jsInstance.players;
		cc.jsInstance.audioManager.playSFX("peng");
		this.isGang = false;
		this.canTing = false;
		this.tingArr = [];
		if (data.detail.tingArr.length > 0) {
			if (this.isCurrent()) {
				this.canTing = true;
			}
			this.tingArr = data.detail.tingArr;
			var cpgh = [];
			this.checkCPGH(cpgh);
		}
		var index = this.playerTool.transformUidsLocation(data.detail.pengLiInfo.uid);
		index = this.playerTool.getIndexByGameKind(index);
		this.hiddenIndexOfMJPutOnTable(data.detail.from);
		if (this.players[index].mjpeng.indexOf(data.detail.tData.lastPut) < 0) {
			this.players[index].mjpeng.push(data.detail.tData.lastPut);
		}
		cc.jsInstance.players = this.players;
		if(this.isCurrent()){
			this.deleteMyOrderHand(data.detail.tData.lastPut);
		}
		this.hiddenHandPai(index, data.detail.tData.lastPut, true,false);
		this.showHandPengOrGang(data.detail.pengLiInfo.uid);
		this.playerTool.playAnimation(data.detail.pengLiInfo.uid, "pengAni");
		this.showOthers13Hand(data.detail.pengLiInfo.uid);
		if (this.isCurrent()&&!this.ishosted) {
			this.registerMJMove();
		}else if(this.isCurrent()&&this.ishosted){
			this.dealWithPai("13");
		}
	},

	gangPai: function(data) {
		cc.logManager.info("playerManager gangPai");
		cc.jsInstance.waitPeng = false;
		this.playEatFlag.active = false;
		this.players = cc.jsInstance.players;
		cc.jsInstance.audioManager.playSFX("gang");
		this.isGang = true;
		var index = this.playerTool.transformUidsLocation(data.detail.uid);
		if (this.currentPutNode) {
			this.currentPutNode.destroy();
		}
		index = this.playerTool.getIndexByGameKind(index);
		this.hiddeTingTips();
		this.tData = cc.jsInstance.data.sData.tData;
		if (this.isCurrent()) {
			if (data.detail.gang === 3) {
				if (this.players[0].mjangang.indexOf(data.detail.card) < 0) {
					this.players[0].mjangang.push(data.detail.card);
				}
			} else {
				if (this.players[0].mjgang.indexOf(data.detail.card) < 0) {
					this.players[0].mjgang.push(data.detail.card);
				}

				if (data.detail.gang === 1) {
					//点杠
					console.log("from===",data.detail.from);
					this.hiddenIndexOfMJPutOnTable(data.detail.from);
				}
			}
		} else {
			if (data.detail.gang === 3) {
				//暗杠
				if (this.players[index].mjangang.indexOf(data.detail.card) < 0) {
					this.players[index].mjangang.push(data.detail.card);
				}
			} else {
				//明杠2或者点杠1
				if (this.players[index].mjgang.indexOf(data.detail.card) < 0) {
					this.players[index].mjgang.push(data.detail.card);
				}
			}

			if (data.detail.gang === 1) {
				//点杠
				this.hiddenIndexOfMJPutOnTable(data.detail.from);
			}
		}
		//抢杠胡
		if (data.detail.cpgh[3] === 1) {
			this.putCard = data.detail.card;
			this.checkCPGH(data.detail.cpgh);
		}
		cc.jsInstance.players = this.players;
		if(this.isCurrent()){
			this.deleteMyOrderHand(data.detail.card);
		}
		this.hiddenHandPai(index, data.detail.card, false,true);
		this.showHandPengOrGang(data.detail.uid);
		this.playerTool.playAnimation(data.detail.uid, "gangAni");
	},

	getNewCard: function(data) {
		cc.logManager.info("playerManager getNewCard");
		this.hiddenPassUI();
		this.newCard = data.detail.newCard;
		this.myself.getChildByName("mjhand").getChildByName("hand_13").getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(this.newCard, "M");
		if(this.newCard === this.tData.haozi){
			this.myself.getChildByName("mjhand").getChildByName("hand_13").getChildByName("dt_play_laizi_img").active = true;
		}else{
			this.myself.getChildByName("mjhand").getChildByName("hand_13").getChildByName("dt_play_laizi_img").active = false;
		}
		this.orderMjhand.push(this.newCard);
		this.orderTheMJHandPaiAndDeal(true);
		this.isGang = false;
		this.canTing = false;
		this.skipHu = false;
		var cpgh = [-1, 0, 0, 0];
		if (this.isTingClick) {
			if (data.detail.canhu > 0||data.detail.gangArr.length > 0) {
				if(data.detail.canhu&&data.detail.gangArr.length){
					cpgh[3] = 1;
					cpgh[2] = 1;
					cpgh[0] = 0;
					this.selfGetCardCanHu = true;
					this.gangArr = data.detail.gangArr;
					this.checkCPGH(cpgh);
				}else if(data.detail.canhu > 0){
					cpgh[3] = 1;
					cpgh[0] = 0;
					this.selfGetCardCanHu = true;
					this.checkCPGH(cpgh);
				}else if(data.detail.gangArr.length > 0){
					cpgh[2] = 1;
					cpgh[0] = 0;
					this.selfGetCardCanHu = true;
					this.gangArr = data.detail.gangArr;
					this.checkCPGH(cpgh);
				}

			} else {
				var timeCallback = function(dt) {
					this.dealWithPai("13");
				}
				this.scheduleOnce(timeCallback, 1);
			}
			
		}else {
			if (data.detail.canhu > 0) {
				cpgh[3] = 1;
				cpgh[0] = 0;
				this.selfGetCardCanHu = true;
			}

			if (data.detail.gangArr.length > 0) {
				cpgh[2] = 1;
				this.gangArr = data.detail.gangArr;
				cpgh[0] = 0;
			}

			if (data.detail.tingArr.length > 0) {
				this.canTing = true;
				this.tingArr = data.detail.tingArr;
			}
			if (cpgh[0] >= 0 || this.canTing) {
				this.checkCPGH(cpgh);
			}
		}
		var self = this;
		if(this.ishosted&&data.detail.canhu <= 0){
			this.scheduleOnce(function(){
				self.dealWithPai("13");
			},1);
		}
	},

	waitPut: function(data) {
		cc.logManager.info("playerManager waitPut");
		if (this.isCurrent()) {
			this.registerMJMove();
			this.hand13Show();
			this.showOthers13Hand(this.playerTool.getUserId());
		} else {
			this.hand13Hide();
			this.showOthers13Hand(data.detail.uids[data.detail.curPlayer]);
		}
		if(this.isPassClicked&&!this.isCurrent()){
			this.isPassClicked = false;
			this.hiddenPassUI();
		}
	},

	addCurrentPutPaiTips: function(uid) {
		cc.logManager.info("playerManager addCurrentPutPaiTips");
		this.tData = cc.jsInstance.data.sData.tData;
		//this.currentPutNode 这个是当前打出的牌的指示箭头
		if (this.currentPutNode) {
			this.currentPutNode.destroy(); //先删除
		}
		var index = this.playerTool.transformUidsLocation(uid);
		index = this.playerTool.getIndexByGameKind(index);
		var putNode;
		var lastCard;
		switch (index) {
			case 0:
				putNode = this.myself.getChildByName("mjput").getChildByName("put_" + (this.putnum - 1));
				var putArr = this.players[0].mjput;
				lastCard = putArr[putArr.length - 1];
				break;
			case 1:
				putNode = this.right.getChildByName("mjput").getChildByName("put_" + (this.rightPutNum - 1));
				var putArr = this.players[1].mjput;
				lastCard = putArr[putArr.length - 1];
				break;
			case 2:
				putNode = this.up.getChildByName("mjput").getChildByName("put_" + (this.upPutNum - 1));
				var putArr = this.players[2].mjput;
				lastCard = putArr[putArr.length - 1];
				break;
			case 3:
				putNode = this.left.getChildByName("mjput").getChildByName("put_" + (this.leftPutNum - 1));
				var putArr = this.players[3].mjput;
				lastCard = putArr[putArr.length - 1];
				break;
		}
		if (lastCard === this.tData.lastPut) {
			this.currentPutNode = new cc.Node("currentPutTipsNode");
			var sp = this.currentPutNode.addComponent(cc.Sprite);
			sp.getComponent(cc.Sprite).spriteFrame = this.currentPutTips;
			putNode.addChild(this.currentPutNode);
			this.currentPutNode.setPosition(0, 25);
			this.currentPutNode.scale = 0.4;
		}
	},

	putPai: function(data) {
		cc.logManager.info("playerManager putPai");
		var putUid = data.detail.uid;
		this.putCard = data.detail.card;
		this.myself.getChildByName("showTingkou").active = false;
		if (this.putCard > 0) {
			cc.jsInstance.audioManager.playSFX(data.detail.card);
		} else {
			cc.jsInstance.audioManager.playSFX("ting");
			this.playerTool.playAnimation(putUid, "tingAni");
		}
		var index = this.playerTool.transformUidsLocation(putUid);
		index = this.playerTool.getIndexByGameKind(index);
		switch (index) {
			case 0:
				this.refreshMJput(this.putCard);
				break;
			case 1:
				this.refreshOtherMJPut(this.putCard, "R");
				break;
			case 2:
				this.refreshOtherMJPut(this.putCard, "B");
				break;
			case 3:
				this.refreshOtherMJPut(this.putCard, "L");
				break;
		}

		var cpgh = data.detail.cpgh;
		if (cpgh[0] >= 0) {
			this.checkCPGH(cpgh);
		}
		var self = this;
		if(this.skipHu&&!this.isCurrent()){
			var guohuNode = this.myself.getChildByName("guohu");
			guohuNode.active = true;
			this.scheduleOnce(function(){
				guohuNode.active = false;
			},0.5);
		}
		this.addCurrentPutPaiTips(data.detail.uid);
		this.setHavePutWhite();
	},

	checkIsTing: function() {
		cc.logManager.info("playerManager checkIsTing");
		this.hiddeTingTips();
		for (var i = 0; i < this.orderMjhand.length; i++) {
			var hands = this.orderMjhand.slice(0);
			hands.splice(i, 1);
			if(!this.tingkouArr){
				this.tingkouArr = [];
			}

			if(!this.playerTool.isKoudian()){
				this.getTingkouByTool(hands);
			}

			if (this.tingkouArr.length > 0) {
				var tingTipsNode = new cc.Node('tingTips' + i);
				if (i + 1 === this.orderMjhand.length) {
					tingTipsNode = new cc.Node('tingTips13');
				}
				var sp = tingTipsNode.addComponent(cc.Sprite);
				sp.getComponent(cc.Sprite).spriteFrame = this.tingTips;
				var hand = this.myself.getChildByName("mjhand").getChildByName("hand_" + i);
				if (i + 1 === this.orderMjhand.length) {
					hand = this.myself.getChildByName("mjhand").getChildByName("hand_13");
				}
				hand.addChild(tingTipsNode);
				this.canPutCardsNode.push(tingTipsNode);
				var handPosition = hand.getPosition();
				tingTipsNode.setPosition(0, handPosition.y + 20 + hand.height / 2); //牌的y+牌高度一半
				tingTipsNode.scale = 0.4;
			}
		}
	},

	getTingkouByTool:function(hand){
		cc.logManager.info("playerManager getTingkouByTool");
		this.tingkouArr = this.playerTool.checkTingkouByTool(hand,this.players[0]);
	},

	showUserInfo(e, custom) {
		cc.logManager.info("playerManager showUserInfo==",e);
		var self = this;
		cc.jsInstance.native.setScaleAction(self.userInfo.getChildByName("commonUserInfoBg"));
		var imageNode = self.userInfo.getChildByName("commonUserInfoBg").getChildByName("defaultHeadBg").getChildByName("mask").getChildByName("defaultHeadImg");
		var nameNode = self.userInfo.getChildByName("commonUserInfoBg").getChildByName("name");
		var moneyNode = self.userInfo.getChildByName("commonUserInfoBg").getChildByName("balance").getChildByName("money");
		var idNode = self.userInfo.getChildByName("commonUserInfoBg").getChildByName("idLab"); 
		var pInfo = this.playerTool.getUIPlayer(parseInt(custom));

		//设置默认的头像
		imageNode.getComponent(cc.Sprite).spriteFrame = this.defaultHeadIcon_left;
		if (this.playerTool.isForTwoPlayers()) {
			if(custom != "0"){
				pInfo = this.playerTool.getUIPlayer(1);
			}
		}else if(this.playerTool.isForThreePlayers()){
			if(custom === "3"){
				pInfo = this.playerTool.getUIPlayer(2);
			}
		}
		if(pInfo){
			self.userInfo.active = true; 
		}else{
			self.userInfo.active = false; 
			return;
		}
		if (pInfo.info.headimgurl) {
			this.playerTool.setHead([pInfo.info.headimgurl], [imageNode]);
		}

		if (pInfo.info.nickname) {
			nameNode.getComponent(cc.Label).string = unescape(pInfo.info.nickname).substr(0, 6);
		} else {
			nameNode.getComponent(cc.Label).string = pInfo.info.name;
		}
		idNode.getComponent(cc.Label).string = "ID:" + pInfo.info.uid;

		if(this.tData.gameKind === "goldgame"){
			moneyNode.getComponent(cc.Label).string = this.playerTool.getCoinFormat(pInfo.info.coin - parseInt(this.sData.tData.needPayCoin));
		}else{
			moneyNode.getComponent(cc.Label).string = pInfo.info.money;
		}

	},

	closeUserInfo(e, custom) {
		cc.logManager.info("playerManager closeUserInfo");
		var self = this;
		self.userInfo.active = false;
	},

	beginHost:function(){
		cc.logManager.info("playerManager beginHost");
		if(!cc.jsInstance.cpgh){
			cc.jsInstance.cpgh = [-1,-1,-1,-1];
		}
		this.ishosted = true;
		cc.logManager.info("jsInstance.cpgh",cc.jsInstance.cpgh);
		if(cc.jsInstance.cpgh[0] < 0){
			this.plaYing.getChildByName("tuoguang").active = true;
			this.dealWithPai("13");
		}else if(cc.jsInstance.cpgh[3] > 0){
			this.huClick();
		}else{//有碰 杠
			this.passClick();
			this.plaYing.getChildByName("tuoguang").active = true;
			this.dealWithPai("13");
		}
	},

	endHost:function(){
		cc.logManager.info("playerManager endHost");
		this.ishosted = false;
		this.plaYing.getChildByName("tuoguang").active = false;
		cc.jsInstance.network.tableMsgRequestManaged(false, null);
	}

});