//处理斗地主牌桌内的打牌逻辑
cc.Class({

    extends: cc.Component,

    properties: {
        //牌桌的两个大的状态节点
        playDDZBegin: {
            type: cc.Node,
            default: null,
        },

        playDDZPlaying: {
            type: cc.Node,
            default: null,
        },

        //玩家节点
        left: {
            type: cc.Node,
            default: null,
        },

        right: {
            type: cc.Node,
            default: null,
        },

        myself: {
            type: cc.Node,
            default: null,
        },

        //用户信息节点
        userInfo: {
            type: cc.Node,
            default: null,
        },

        //图片
        defaultHeadIcon: {
            type: cc.SpriteFrame,
            default: null,
        },

        graySorceOne: {
            type: cc.SpriteFrame,
            default: null,
        },

        graySorceTwo: {
            type: cc.SpriteFrame,
            default: null,
        },

        playDDZAnim: {
            type: cc.Node,
            default: null,
        },
        //斗地主自己头像位置
        myHeadPos: {
            type: cc.Node,
            default: null,
        },
        //斗地主左边头像位置
        leftHeadPos: {
            type: cc.Node,
            default: null,
        },
        //斗地主右边头像位置
        rightHeadPos: {
            type: cc.Node,
            default: null,
        },
        //斗地主左边打出牌的位置
        left_putcard_Pos: {
            type: cc.Node,
            default: null,
        },
        //斗地主右边打出牌的位置
        right_putcard_Pos: {
            type: cc.Node,
            default: null,
        },
        //斗地主自己打出牌的位置
        my_putcard_Pos: {
            type: cc.Node,
            default: null,
        },
    },

    initData: function() {
        this.tData = cc.jsInstance.data.sData.tData;
        this.sData = cc.jsInstance.data.sData;
        //倒计时初始化
        this.leftTime = 15;
        this.leftTimeNode;
        this.playDDZSpriteManager = this.getComponent('playDDZSpriteManager');
        this.playAnimTool = this.playDDZAnim.getComponent('anim');
        this.playerPokerHand = [];
        this.initLocalData();
        this.initPlayingDDZHeadInfo();
        this.refreshMyTurnLandClaim();
        this.initPlayerUIData();
        var index = this.playerTool.transformUidsLocation(this.tData.uids[this.tData.lastPutPlayer]);
        this.refreshTurnsUI(this.players[index].mjput);
    },

    initLocalData: function() {
        var myself = {
            mjhand: [],
            mjput: [],
            leftCardNum: 0
        }

        var otherPlayer_left = {
            mjput: [],
            leftCardNum: 0
        }

        var otherPlayer_right = {
            mjput: [],
            leftCardNum: 0
        }
        this.players = [myself, otherPlayer_right, otherPlayer_left];
        cc.jsInstance.players = this.players;
    },

    initPlayingDDZHeadInfo: function() {
        var headUrls = [];
        var headUrlNodes = [];
        var num = 3; //斗地主
        var headNodes = [this.myself, this.right, this.left];
        for (var index = 0; index < num; index++) {
            var pInfo = this.playerTool.getUIPlayer(index);
            index = this.playerTool.getIndexByGameKind(index);
            var playerLocation = headNodes[index];
            var playingHead = playerLocation.getChildByName("mask").getChildByName("head");
            var playerSocreBg = playerLocation.getChildByName("playerSocreBg");

            playerSocreBg.getChildByName("nameLab").active = true;
            playerSocreBg.getChildByName("sorceLab").active = true;
            if (pInfo) {
                //头像
                if (pInfo.info.headimgurl) {
                    headUrls.push(pInfo.info.headimgurl);
                    headUrlNodes.push(playingHead);
                } else {
                    playingHead.getComponent(cc.Sprite).spriteFrame = this.defaultHeadIcon;
                }

                //昵称
                if (pInfo.info.nickname) {
                    playerSocreBg.getChildByName("nameLab").getComponent(cc.Label).string = unescape(pInfo.info.nickname).substr(0, 6);
                } else {
                    playerSocreBg.getChildByName("nameLab").getComponent(cc.Label).string = pInfo.info.name;
                }

                //分数
                playerSocreBg.getChildByName("sorceLab").getComponent(cc.Label).string = parseInt(this.sData.tData.initCoin) + parseInt(pInfo.winall);

                //离线
                if (pInfo.onLine) {
                    playerLocation.getChildByName("headLeave").active = false;
                } else {
                    playerLocation.getChildByName("headLeave").active = true;
                }

                //地主
                if (this.tData.landLoader >= 0) {
                    if (this.tData.landLoader === pInfo.info.uid) {
                        playerLocation.getChildByName("isLandLords").active = true;
                        var hatNode = playerLocation.getChildByName("isLandLords").getChildByName("hat");
                        this.playerTool.playAnimForDDZHat(hatNode);
                    } else {
                        playerLocation.getChildByName("isLandLords").active = false;
                    }
                } else {
                    if (!index) {
                        var card0 = this.myself.getChildByName("poker").getChildByName("card0");
                        card0.getChildByName("Card_Dizhu").active = false;
                    }
                    playerLocation.getChildByName("isLandLords").active = false;
                }

                //剩余牌数
                var paiIndex;
                if (index) {
                    paiIndex = this.tData.uids.indexOf(pInfo.info.uid);
                    var cardNumNode = playerLocation.getChildByName("cardNumBg");
                    var leftCardNumStr = this.tData.cardNumbers[paiIndex];
                    if (leftCardNumStr < 10) {
                        leftCardNumStr = "0" + leftCardNumStr;
                    }
                    cardNumNode.getChildByName("leftCardLab").getComponent(cc.Label).string = leftCardNumStr;
                } else {
                    paiIndex = this.tData.uids.indexOf(pInfo.info.uid);
                }
                this.players[index].leftCardNum = this.tData.cardNumbers[paiIndex];

            } else {
                cc.logManager.warn("can not get this player's pinfo data!");
            }
        }
        if (headUrls.length > 0) {
            this.playerTool.setHead(headUrls, headUrlNodes);
        }
    },

    initPlayerUIData: function() {
        var peopleNum = 3;
        var myTurnCallRob = this.myself.getChildByName("myTurnLandClaim");
        var myTurnPutCard = this.myself.getChildByName("myTurnPutCard");

        for (var i = 0; i < peopleNum; i++) {

            var pInfo = this.playerTool.getUIPlayer(i);
            var index = i;
            index = this.playerTool.getIndexByGameKind(index);

            if (pInfo) {
                if (pInfo.mjput) {
                    this.players[index].mjput = pInfo.mjput;
                }
            }

            
            var iscurrent = false;
            if(this.tData.curPlayer >= 0){
                iscurrent = this.tData.uids[this.tData.curPlayer] === pInfo.info.uid ? true : false;
            }

            if (i === 0 && pInfo) {
                this.players[0].mjhand = pInfo.mjhand;
                this.refreshHandPai(pInfo.mjhand);
                //自己的信息 刷新手牌
                if (iscurrent) {
                    if (this.tData.tState === 8) {
                        myTurnPutCard.active = false;
                    } else {
                        myTurnPutCard.active = true;
                        if (this.tData.bFirstStartGame) {
                            myTurnPutCard.getChildByName("nooutBtn0").active = false;
                            myTurnPutCard.getChildByName("tipsBtn").active = false;
                        }
                    }
                } else {
                    //不是自己的回合都隐藏
                    myTurnCallRob.active = false;
                    myTurnPutCard.active = false;
                }
                
            }

            if (pInfo) {
                if (this.tData.curPlayer >= 0) {
                    this.refreshMjPutUI(index);
                }
            }
        }
    },

    //刷新叫分部分的UI
    refreshMyTurnLandClaim: function() {
        this.tData = cc.jsInstance.data.sData.tData;
        var callRobData = this.tData.callRob;

        //叫过地主了已经，不用刷新抢地主的分数UI了
        if (this.tData.remainPokers.length > 0) {
            if (this.tData.remainPokers[0] > 0) {
                this.myself.getChildByName("myTurnLandClaim").active = false;
                return;
            }
        }

        for (const key in callRobData) {
            const element = callRobData[key];
            if (this.tData.uids[key] === this.playerTool.getUserId()) {
                if (element != 0) {
                    this.myself.getChildByName("myTurnLandClaim").active = false;
                    break;
                }
            } else {
                //到了自己的回合叫地主
               this.setUIForMyCallRob(element);
            }
        }
    },

    //到了自己的回合叫地主 刷新UI
    setUIForMyCallRob:function(element){
        var myTurnLandClaim = this.myself.getChildByName("myTurnLandClaim");
        if (this.tData.uids[this.tData.curPlayer] === this.playerTool.getUserId()) {
            myTurnLandClaim.active = true;
            if (element >= 1) {
                myTurnLandClaim.getChildByName("oneSocreBtn").getComponent(cc.Button).interactable = false;
                myTurnLandClaim.getChildByName("oneSocreBtn").getComponent(cc.Sprite).spriteFrame = this.graySorceOne;
            } 

            if (element >= 2) {
                myTurnLandClaim.getChildByName("twoSocreBtn").getComponent(cc.Button).interactable = false;
                myTurnLandClaim.getChildByName("twoSocreBtn").getComponent(cc.Sprite).spriteFrame = this.graySorceTwo;
            } 

            if (element > 3) {
                myTurnLandClaim.active = false;
            }
        }
    },

    hiddenMyNoCall: function() {
        var myselfPlayerTips = this.myself.getChildByName("playerTips");
        var leftPlayerTips = this.left.getChildByName("playerTips");
        var rightPlayerTips = this.right.getChildByName("playerTips");
        var playerTips = [myselfPlayerTips, rightPlayerTips, leftPlayerTips];
        for (let i = 0; i < playerTips.length; i++) {
            var playerTip = playerTips[i];
            playerTip.getChildByName("noCall").active = false;
        }
    },

    dealWithPlayAnimDDZPosition: function(types, uid) {
        var index = this.playerTool.transformUidsLocation(uid);
        var pos = cc.p(0, 0);
        var typeStr = types.split("_")[0];
        var start_pos;
        var end_pos;
        switch (index) {
            case 1: //右边
                if (typeStr === "bomb") {
                    start_pos = this.right_pos;
                    end_pos = this.putcard_right_Pos;
                } else {
                    pos = this.putcard_right_Pos;
                }
                break;
            case 2: //左边
                if (typeStr === "bomb") {
                    start_pos = this.left_pos;
                    end_pos = this.putcard_left_Pos;
                } else {
                    pos = this.putcard_left_Pos;
                }
                break;
            case 0: //自己
                if (typeStr === "bomb") {
                    start_pos = this.my_pos;
                    end_pos = this.putcard_my_Pos;
                } else {
                    pos = this.putcard_my_Pos;
                }
                break;
        }
        //炸弹，顺子，连对需要位置
        if (typeStr === "doublestraights" || typeStr === "straights") {
            this.playAnimTool.playAnimDDZForPlaying(types, pos);
        } else if (typeStr === "bomb") {
            this.playAnimTool.playAnimDDZForPlaying(types, start_pos, end_pos);
        } else {
            this.playAnimTool.playAnimDDZForPlaying(types);
        }
    },

    //叫分的ui
    refreshCallRobUI: function(data) {
        var index = this.playerTool.transformUidsLocation(data.detail.uid);
        var playerTip;
        switch (index) {
            case 0:
                playerTip = this.myself.getChildByName("playerTips");
                break;
            case 1:
                playerTip = this.right.getChildByName("playerTips");
                break;
            case 2:
                playerTip = this.left.getChildByName("playerTips");
                break;
        }

        this.playerTipsHidden(playerTip);
        var playerTips = [this.myself.getChildByName("playerTips"), this.right.getChildByName("playerTips"), this.left.getChildByName("playerTips")];
        //已经确定地主了 全部隐藏
        if (data.detail.tData.landLoader > 0) {
            for (let i = 0; i < playerTips.length; i++) {
                var pl = playerTips[i];
                this.playerTipsHidden(pl);
            }
            return;
        }
        var currentPlayIndex = data.detail.tData.curPlayer - 1 >= 0 ? data.detail.tData.curPlayer - 1 : 2;
        switch (data.detail.tData.callRob[currentPlayIndex]) {
            case -1:
                playerTip.getChildByName("noCall").active = true;
                break;
            case 1:
                playerTip.getChildByName("callOne").active = true;
                break;
            case 2:
                playerTip.getChildByName("callTwo").active = true;
                break;
            case 3:
                playerTip.getChildByName("callThree").active = true;
                break;
        }
    },

    playerTipsHidden: function(playerTip) {
        playerTip.getChildByName("noCall").active = false;
        playerTip.getChildByName("callOne").active = false;
        playerTip.getChildByName("callTwo").active = false;
        playerTip.getChildByName("callThree").active = false;
    },

    refershOnLineHead: function(data) {
        var index = this.playerTool.transformUidsLocation(data.detail.uid);
        index = this.playerTool.getIndexByGameKind(index);
        var myself = this.playDDZPlaying.getChildByName("myself");
        var right = this.playDDZPlaying.getChildByName("right");
        var left = this.playDDZPlaying.getChildByName("left");
        var beginArr = [myself, right, left];

        var currentReadyPlayer = beginArr[index];

        if (data.detail.onLine) {
            currentReadyPlayer.getChildByName("headLeave").active = false;
        } else {
            currentReadyPlayer.getChildByName("headLeave").active = true;
        }
    },

    passClicked: function(uid) {
        this.leftTime = 15;
        var index = this.playerTool.transformUidsLocation(uid);
        var cardPutNode;
        var playerTip;
        //差 显示不出 的ui 
        switch (index) {
            case 0:
                cardPutNode = this.myself.getChildByName("cardPut");
                playerTip = this.myself.getChildByName("playerTips");
                break;
            case 1:
                cardPutNode = this.right.getChildByName("cardPut");
                playerTip = this.right.getChildByName("playerTips");
                break;
            case 2:
                cardPutNode = this.left.getChildByName("cardPut");
                playerTip = this.left.getChildByName("playerTips");
                break;
        }

        //隐藏所有节点
        playerTip.getChildByName("cantPut").active = true;
        this.scheduleOnce(function() {
            playerTip.getChildByName("cantPut").active = false;
        }, 3);
        for (let i = 0; i < 20; i++) {
            cardPutNode.getChildByName("Card" + i).active = false;
        }
        if (index === 0) {
            this.hiddeMyTrunsUI();
        }
        this.refreshTurnsUI(this.tData.lastPut);
        this.hiddenCurrentPlayerPutUI();
    },

    hiddeMyTrunsUI: function() {
        this.myself.getChildByName("myTurnPutCard").active = false;
    },

    haveCalledRob: function() {
        var pokerArr = this.players[0].mjhand;
        if (this.tData.landLoader === this.playerTool.getUserId()) {
            for (let i = 0; i < this.tData.remainPokers.length; i++) {
                if (pokerArr.indexOf(this.tData.remainPokers[i]) < 0) {
                    pokerArr.push(this.tData.remainPokers[i]);
                }
            }
        }
        this.refreshHandPai(pokerArr);
    },

    refreshHandPai: function(pokerArr) {
        pokerArr.sort(function(a, b) {
            return (a % 100) - (b % 100);
        })

        this.players[0].mjhand = pokerArr;
        cc.jsInstance.players[0].mjhand = this.players[0].mjhand;
        var poker = this.myself.getChildByName("poker");
        var card0 = poker.getChildByName("card0");
        if (this.tData.landLoader === this.playerTool.getUserId()) {
            card0.getChildByName("Card_Dizhu").active = true;
        } else {
            card0.getChildByName("Card_Dizhu").active = false;
        }

        for (var i = 0; i < 20; i++) {
            var card = poker.getChildByName("card" + i);
            if (i >= pokerArr.length) {
                card.active = false;
            } else {
                card.active = true;
                card.getComponent(cc.Sprite).spriteFrame = this.playDDZSpriteManager.getPockerSpriteFrame(pokerArr[i]);
            }
        }
        //不是断线重连进入要播动画
        if (!cc.jsInstance.haveRoom) {
            cc.jsInstance.haveRoom = true;
            this.showCardOneByOneForStart();
        }
    },

    //发牌的那个效果实现
    showCardOneByOneForStart: function() {
        var isHidden = false;
        if (this.myself.getChildByName("myTurnLandClaim").active) {
            isHidden = true;
            this.myself.getChildByName("myTurnLandClaim").active = false;
        }

        var pokerArr = this.players[0].mjhand;
        var poker = this.myself.getChildByName("poker");
        for (var i = 0; i < 20; i++) {
            var card = poker.getChildByName("card" + i)
            card.y = this.cardStart_y;
            card.active = false;
        }

        let j = 0;
        var self = this;
        this.players[1].leftCardNum = 0;
        this.players[2].leftCardNum = 0;
        var t1 = setInterval(function() {
            if (j < 17) {
                var card = poker.getChildByName("card" + j);
                card.active = true;
                card.getComponent(cc.Sprite).spriteFrame = self.playDDZSpriteManager.getPockerSpriteFrame(pokerArr[j]);
                j++;
                self.players[1].leftCardNum++;
                self.refreshLeftCardNum(1);
                self.players[2].leftCardNum++;
                cc.jsInstance.audioManager.playSFXForDDZ("fapai");
                self.refreshLeftCardNum(2);
                self.players[0].leftCardNum++;
            }

            if (j === 17) {
                clearInterval(t1);
            }
        }, 200);

        if (isHidden) {
            this.scheduleOnce(function() {
                self.myself.getChildByName("myTurnLandClaim").active = true;
            }, 3.5);
        }

    },

    putCardClicked: function(data) {
        this.leftTime = 15;
        this.canputPai = [];
        this.tData = cc.jsInstance.data.sData.tData;
        var uid = data.detail.uid;
        var index = this.playerTool.transformUidsLocation(uid);
        this.players[index].mjput = data.detail.card;
        this.players[index].leftCardNum = this.players[index].leftCardNum - data.detail.card.length;
        this.refreshMjPutUI(index);
        if (index === 0) {
            this.dealWithHandCard();
            this.myself.getChildByName("myTurnPutCard").active = false;
        }
        this.refreshLeftCardNum(index);
        this.refreshTurnsUI(data.detail.card);
    },

    refreshTurnsUI: function(lastPutcard) {
        var isCurrent = this.tData.uids[this.tData.curPlayer] === this.playerTool.getUserId()?true:false;
        var myTurnPutCard = this.myself.getChildByName("myTurnPutCard");
        if ( isCurrent&& this.tData.landLoader > 0) {
            if (this.tData.curPlayer === this.tData.lastPutPlayer) {
                myTurnPutCard.active = true;
                this.setMyTurnsUI(false, true);
                //别人都要不起或者 首轮出牌
                myTurnPutCard.getChildByName("putCard").active = true;
                myTurnPutCard.getChildByName("canNotPut").active = false;
            } else {
                var canPutCards = cc.jsInstance.Poker.noticePokers(this.players[0].mjhand, lastPutcard);
                myTurnPutCard.active = true;
                if (canPutCards.length > 0 && this.tData.lastPutPlayer >= 0) {
                    this.setMyTurnsUI(true, false);
                } else {
                    this.setMyTurnsUI(false, true);
                }
            }
            //开始算牌看看
        } else {
            myTurnPutCard.active = false;
        }
    },

    tipsClick: function() {
        cc.jsInstance.audioManager.playBtnClick();

        var uid = this.tData.uids[this.tData.lastPutPlayer];
        var index = this.playerTool.transformUidsLocation(uid);
        var tempPut = this.players[index].mjput;
        var isBigJoker = false;
        var isLittleJoker = false;

        if (this.canputPai && this.canputPai.length > 0) {
            if (this.canputPai.indexOf(555) >= 0) {
                isBigJoker = true;
            }

            if (this.canputPai.indexOf(550) >= 0) {
                isLittleJoker = true;
            }

            tempPut = this.canputPai.slice(0);
        }

        if (isBigJoker && isLittleJoker && this.canputPai.length === 2) {
            tempPut = this.players[index].mjput;
        }

        this.canputPai = [];
        this.canputPai = cc.jsInstance.Poker.noticePokers(this.players[0].mjhand, tempPut);

        if (!this.canputPai.length) {
            tempPut = this.players[index].mjput;
            this.canputPai = cc.jsInstance.Poker.noticePokers(this.players[0].mjhand, tempPut);
        }

        var paiIndex = [];
        for (let i = 0; i < this.canputPai.length; i++) {
            var index = this.players[0].mjhand.indexOf(this.canputPai[i]);
            if (paiIndex.indexOf(index) < 0) {
                paiIndex.push(index);
            }
        }
        if (paiIndex.length > 0) {
            this.playDDZSelectPaiTool.setTipPaiNodesPos(paiIndex);
        }
    },

    setMyTurnsUI: function(isShowMost, isShowCanNot) {
        this.myself.getChildByName("myTurnPutCard").getChildByName("nooutBtn0").active = isShowMost;
        this.myself.getChildByName("myTurnPutCard").getChildByName("tipsBtn").active = isShowMost;
        this.myself.getChildByName("myTurnPutCard").getChildByName("putCard").active = isShowMost;
        this.myself.getChildByName("myTurnPutCard").getChildByName("canNotPut").active = isShowCanNot;
    },

    dealWithHandCard: function() {
        var currentPutCards = this.players[0].mjput;
        var currentHandCards = this.players[0].mjhand;
        for (var i = 0; i < currentPutCards.length; i++) {
            var index = currentHandCards.indexOf(currentPutCards[i]);
            if (index >= 0) {
                //删除打出去的牌
                currentHandCards.splice(index, 1);
            }
        }
        this.players[0].mjhand = currentHandCards;
        cc.jsInstance.players[0].mjhand = this.players[0].mjhand;
        this.refreshHandPai(currentHandCards);
    },

    //刷新打牌逻辑
    refreshMjPutUI: function(index) {
        var putCardArr = this.players[index].mjput;
        var isPassPlayer = this.isPassPlayerThisTurn(index);
        var cardPutNode;
        var playerTip;
        var isRight = false;
        switch (index) {
            case 0:
                cardPutNode = this.myself.getChildByName("cardPut");
                playerTip = this.myself.getChildByName("playerTips");
                break;
            case 1:
                cardPutNode = this.right.getChildByName("cardPut");
                playerTip = this.right.getChildByName("playerTips");
                isRight = true;
                break;
            case 2:
                cardPutNode = this.left.getChildByName("cardPut");
                playerTip = this.left.getChildByName("playerTips");
                break;
        }

        if (isPassPlayer) {
            putCardArr = [];
            //显示不要
            playerTip.getChildByName("cantPut").active = true;
        } else {
            playerTip.getChildByName("cantPut").active = false;
        }


        var transformUids = this.playerTool.transformUidsLocationArr(this.playerTool.getUserId());
        var currentID = transformUids[index];

        for (var i = 0; i < 20; i++) {
            var pCard = cardPutNode.getChildByName("Card" + i);
            if (i >= putCardArr.length) {
                pCard.active = false;
            } else {
                pCard.active = true;
                pCard.getComponent(cc.Sprite).spriteFrame = this.playDDZSpriteManager.getPockerSpriteFrame(putCardArr[i]);
            }

            if (i === 0) {
                if (currentID === this.tData.landLoader) {
                    pCard.getChildByName("Card_Dizhu").active = true;
                } else {
                    pCard.getChildByName("Card_Dizhu").active = false;
                }
            }
        }

        var self = this;
        if (isRight && putCardArr.length < 8 && putCardArr.length > 0) {
            this.scheduleOnce(function() {
                var card0 = cardPutNode.children[19];
                var x = self.cardPutNodeRightX - card0.x - card0.width / 2
                cardPutNode.x = x;
            }, 0);
        } else if (isRight && putCardArr.length >= 8) {
            cardPutNode.x = this.cardPutNodeRightX;
        }

        this.hiddenCurrentPlayerPutUI();

    },

    showUserInfo(e, custom) {
        cc.jsInstance.audioManager.playBtnClick();
        var self = this;
        var commonUserInfoBg = self.userInfo.getChildByName("commonUserInfoBg");
        cc.jsInstance.native.setScaleAction(commonUserInfoBg);
        var imageNode = commonUserInfoBg.getChildByName("defaultHeadBg").getChildByName("mask").getChildByName("defaultHeadImg");
        var nameNode = commonUserInfoBg.getChildByName("name");
        var moneyNode =commonUserInfoBg.getChildByName("balance").getChildByName("money");
        var idNode = commonUserInfoBg.getChildByName("idLab");
        var pInfo = this.playerTool.getUIPlayer(parseInt(custom));

        if (pInfo) {
            self.userInfo.active = true;
        } else {
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

        if (this.tData.gameKind === "goldgame") {
            moneyNode.getComponent(cc.Label).string = this.playerTool.getCoinFormat(pInfo.info.coin - parseInt(this.sData.tData.needPayCoin));
        } else {
            moneyNode.getComponent(cc.Label).string = pInfo.info.money;
        }

    },

    closeUserInfo(e, custom) {
        cc.logManager.info("closeUserInfo:");
        var self = this;
        self.userInfo.active = false;
    },

    isPassPlayerThisTurn: function(index) {
        var passPlayerArr = [];
        for (let i = 0; i < this.tData.passPlayers.length; i++) {
            var uid = this.tData.uids[this.tData.passPlayers[i]];
            if (passPlayerArr.indexOf(uid) < 0) {
                passPlayerArr.push(uid);
            }
        }

        var relativeUids = this.playerTool.transformUidsLocationArr(this.playerTool.getUserId());
        if (passPlayerArr.indexOf(relativeUids[index]) >= 0) {
            return true;
        } else {
            return false;
        }

    },

    hiddenCurrentPlayerPutUI: function() {
        var currentPutUid = this.tData.uids[this.tData.curPlayer];
        var currentPutIndex = this.playerTool.transformUidsLocation(currentPutUid);
        var cardPutNode;
        this.left.getChildByName("lostTimeBg").active = false;
        this.right.getChildByName("lostTimeBg").active = false;

        var players = [this.myself,this.right,this.left];
        var currentNode = players[currentPutIndex];
        cardPutNode = currentNode.getChildByName("cardPut");
        currentNode.getChildByName("playerTips").getChildByName("cantPut").active = false;
        if(currentPutIndex){
            this.leftTimeNode = currentNode.getChildByName("lostTimeBg").getChildByName("timeLab");
        }else{
            this.leftTimeNode = currentNode.getChildByName("myTurnPutCard").getChildByName("lostTimeBg").getChildByName("timeLab");
        }

        for (var i = 0; i < 20; i++) {
            cardPutNode.getChildByName("Card" + i).active = false;
        }
    },

    refreshLeftCardNum: function(index) {
        var cardNumNode;
        var warnNode;
        switch (index) {
            case 1:
                cardNumNode = this.right.getChildByName("cardNumBg");
                warnNode = this.right.getChildByName("warn");
                break;
            case 2:
                cardNumNode = this.left.getChildByName("cardNumBg");
                warnNode = this.left.getChildByName("warn");
                break;
        }

        if (index) {
            var leftCardNumStr = this.players[index].leftCardNum;
            if (leftCardNumStr < 10) {
                leftCardNumStr = "0" + leftCardNumStr;
            }
            cardNumNode.getChildByName("leftCardLab").getComponent(cc.Label).string = leftCardNumStr;

            if (this.tData.tState != 8) {
                if (this.players[index].leftCardNum <= 2) {
                    warnNode.active = true;
                    this.playBaojing();
                } else {
                    warnNode.active = false;
                }
            }
        } else {
            if (this.tData.tState != 8) {
                this.playBaojing();
            }
        }
    },

    playBaojing:function(){
        if (this.players[0].leftCardNum === 1) {
            this.scheduleOnce(function() {
                cc.jsInstance.audioManager.playSFXForDDZ("baojing1");
            }, 0.5);
        } else if (this.players[0].leftCardNum === 2) {
            this.scheduleOnce(function() {
                cc.jsInstance.audioManager.playSFXForDDZ("baojing2");
            }, 0.5);
        }
    },

    timeRun: function() {
        var self = this;
        this.schedule(function() {
            if (self.leftTime > 0) {
                self.leftTime--;
                self.leftTimeNode.getComponent(cc.Label).string = self.leftTime;
            }
            
            if(cc.jsInstance.data.sData&&cc.jsInstance.data.sData){
                this.tData = cc.jsInstance.data.sData.tData;
            }

            if (this.tData.tState === 3 || this.tData.tState === 8) {
                if (self.leftTime === 3) {
                    cc.jsInstance.audioManager.playSFX("timeup_alarm");
                }
            }
        }.bind(this), 1);
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.tData = cc.jsInstance.data.sData.tData;
        this.sData = cc.jsInstance.data.sData;
        this.playDDZSpriteManager = this.getComponent('playDDZSpriteManager');
        this.playDDZSelectPaiTool = this.getComponent('playDDZSelectPaiTool');
        this.playerTool = this.getComponent('playerTool');
        this.cardStart_y = this.myself.getChildByName("poker").getChildByName("card0").y;
        cc.logManager.info("this.cardStart_y==",this.cardStart_y);
        //处于打牌阶段
        if (this.tData.tState === 3 || this.tData.tState === 5 || this.tData.tState === 8) {
            this.initData();
        }
        this.timeRun();

        this.cardPutNodeRightX = this.right.getChildByName("cardPut").x;

        this.left_pos = this.leftHeadPos.convertToWorldSpaceAR(cc.p(0, 0)); // (91,522)
        this.left_pos.x = this.left_pos.x - cc.winSize.width / 2;
        this.left_pos.y = this.left_pos.y - cc.winSize.height / 2 - this.leftHeadPos.height;

        this.putcard_left_Pos = this.left_putcard_Pos.convertToWorldSpaceAR(cc.p(0, 0)); //(1030,492)
        this.putcard_left_Pos.x = this.putcard_left_Pos.x - cc.winSize.width / 2;
        this.putcard_left_Pos.y = this.putcard_left_Pos.y - cc.winSize.height / 2 - this.leftHeadPos.height;

        this.right_pos = this.rightHeadPos.convertToWorldSpaceAR(cc.p(0, 0)); //(1189,522)
        this.right_pos.x = this.right_pos.x - cc.winSize.width / 2;
        this.right_pos.y = this.right_pos.y - cc.winSize.height / 2 - this.leftHeadPos.height;

        this.putcard_right_Pos = this.right_putcard_Pos.convertToWorldSpaceAR(cc.p(0, 0)); //(430,492)
        this.putcard_right_Pos.x = this.putcard_right_Pos.x - cc.winSize.width / 2 - this.right_putcard_Pos.width / 2;
        this.putcard_right_Pos.y = this.putcard_right_Pos.y - cc.winSize.height / 2 - this.leftHeadPos.height;


        this.my_pos = this.myHeadPos.convertToWorldSpaceAR(cc.p(0, 0)); // (91,522)
        this.my_pos.x = this.my_pos.x - cc.winSize.width / 2;
        this.my_pos.y = this.my_pos.y - cc.winSize.height / 2 - this.leftHeadPos.height;

        this.putcard_my_Pos = this.my_putcard_Pos.convertToWorldSpaceAR(cc.p(0, 0)); //(430,492)
        this.putcard_my_Pos.x = this.putcard_my_Pos.x - cc.winSize.width / 2
        this.putcard_my_Pos.y = this.putcard_my_Pos.y - cc.winSize.height / 2 - this.leftHeadPos.height;
    },

    start() {
        
    },
    // update (dt) {},
});