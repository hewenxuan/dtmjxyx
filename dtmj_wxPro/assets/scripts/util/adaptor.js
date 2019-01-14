cc.Class({
    extends: cc.Component,

    properties: {
        lobbySceneBgForiPhoneX: {
            default: null,
            type: cc.SpriteFrame,
        },

        playSceneBgForiPhoneX: {
            default: null,
            type: cc.SpriteFrame,
        },
        loginSceneBgForiPhoneX: {
            default: null,
            type: cc.SpriteFrame,
        },
    },

    start() {
        cc.jsInstance.isIphoneX = false;
        this.getScreenSize();
        this.initAdaptor();
        this._initCanvasBg();
    },

    getScreenSize: function() {
        this.windowSize = cc.view.getFrameSize();
        if ((Math.round(this.windowSize.height * 10000 / this.windowSize.width) / 10000) < 0.5000) { // 保留4位小数
            cc.jsInstance.isIphoneX = true;
            cc.logManager.info("需要适配");
        } else {
            cc.jsInstance.isIphoneX = false;
            cc.logManager.info("不需要适配");
        }
    },

    initAdaptor: function() {
        this.CanvasScene = {
            login: "login",
            lobby: "lobby",
            play: "play",
            playDDZ: "playDDZ",
        };
    },

    _initCanvasBg: function() {
        var name = cc.director.getScene()._name;//this.node.parent.name
        if (name === this.CanvasScene.login && cc.jsInstance.isIphoneX) {
            this.node.getChildByName("LoginBg").getComponent(cc.Sprite).spriteFrame = this.loginSceneBgForiPhoneX;
            this.loginAdaptorUIForIphoneX();
        } else if (name === this.CanvasScene.lobby && cc.jsInstance.isIphoneX) {
            this.node.getChildByName("lobbyBg").getComponent(cc.Sprite).spriteFrame = this.lobbySceneBgForiPhoneX;
            this.lobbyAdaptorUIForIphoneX();
        } else if (name === this.CanvasScene.play && cc.jsInstance.isIphoneX) {

            this.node.getChildByName("PlayBg").getComponent(cc.Sprite).spriteFrame = this.playSceneBgForiPhoneX;
            this.playAdaptorUIForIphoneX();

        } else if (name === this.CanvasScene.playDDZ && cc.jsInstance.isIphoneX) {
            this.playDDZAdaptorUIForIphoneX();
        } else if (name === this.CanvasScene.lobby) {
            this.lobbyAdaptorUIForNormal();
        }

        if (cc.jsInstance.isIphoneX) {
            this.PersistRootNodeForScale();
        }
    },

    PersistRootNodeForScale() {
        var helpBg = cc.jsInstance.playHelp.getNode().getChildByName("bg");
        this.adaptorForScale(helpBg, 0.8, true);
        var msgpop = cc.jsInstance.msgpop.getNode().getChildByName("bg");
        this.adaptorForScale(msgpop, 0.8, true);
        var bayWindow = cc.jsInstance.bayWindow.getNode();
        this.adaptorForScale(bayWindow, 0.8, true);
    },

    loginAdaptorUIForIphoneX() {
        var legal = this.node.getChildByName("legal").getChildByName("surfaceLayer");
        this.adaptorForScale(legal, 0.8, true);
    },

    //lobby场景的个别组件的iphonex适配 
    lobbyAdaptorUIForIphoneX: function() {
        var renwu = this.node.getChildByName("renwu");
        var denglong = this.node.getChildByName("denglong");
        var creatRoomMask = this.node.getChildByName("creatRoomMask");
        var joinRoomBg = this.node.getChildByName("joinRoomBg");
        var playLogBg = this.node.getChildByName("listLogs").getChildByName("bg");
        var messageBg = this.node.getChildByName("message").getChildByName("bg");
        var messageInfoBg = this.node.getChildByName("messageInfo").getChildByName("bg");
        var goldContestContent = this.node.getChildByName("goldContest").getChildByName("gold_scrollview").getChildByName("view").getChildByName("content");
        var goldShop = this.node.getChildByName("goldContest").getChildByName("goldShop");

        this.adaptorForScale(renwu, 0.8, true);
        this.adaptorForScale(denglong, 0.8, true);
        this.adaptorForScale(creatRoomMask, 0.8, true);
        this.adaptorForScale(joinRoomBg, 0.8, true);
        this.adaptorForScale(playLogBg, 0.8, true);
        this.adaptorForScale(messageBg, 0.8, true);
        this.adaptorForScale(messageInfoBg, 0.8, true);
        this.equalSpaceXAdaptorBaseOnLayout(goldContestContent, 290.0, 4);
        this.adaptorForScale(goldShop, 0.8, true);

        var club = this.node.getChildByName("club").getChildByName("bg");
        this.adaptorForScale(club, 0.8, true);
        var clubroom = this.node.getChildByName("clubroom").getChildByName("bg");
        this.adaptorForScale(clubroom, 0.8, true);

        var goldContestContent = this.node.getChildByName("goldContest").getChildByName("gold_scrollview")
        this.adaptorForScale(goldContestContent, 0.8, true);
        
         this.adaptorForScale(cc.jsInstance.msgpop, 0.8, true);

    },

    //lobby场景个别组件在一般机器上的调整
    lobbyAdaptorUIForNormal: function() {
        var playLogBg = this.node.getChildByName("listLogs").getChildByName("bg");
        var goldContestContent = this.node.getChildByName("goldContest").getChildByName("gold_scrollview").getChildByName("view").getChildByName("content");
        var goldShop = this.node.getChildByName("goldContest").getChildByName("goldShop");

        this.adaptorForScale(playLogBg, 0.95, false);
        this.equalSpaceXAdaptorBaseOnLayout(goldContestContent, 290.0, 4);
        this.adaptorForScale(goldShop, 0.95, false);
    },

    //play场景的个别组件的iphonex适配 
    playAdaptorUIForIphoneX: function() {
        var myhand = this.node.getChildByName("PlaYing").getChildByName("location0").getChildByName("mjhand");
        var penggangs = this.node.getChildByName("PlaYing").getChildByName("location0").getChildByName("penggangs");
        var mjput = this.node.getChildByName("PlaYing").getChildByName("location3").getChildByName("mjput");
        var pointer = this.node.getChildByName("PlaYing").getChildByName("Pointer");
        var playEatFlag = this.node.getChildByName("PlayEatFlag");
        var showTingkou = this.node.getChildByName("PlaYing").getChildByName("location0").getChildByName("showTingkou");
        var playBegin = this.node.getChildByName("PlayBegin");
        var endOne = this.node.getChildByName("endOne");
        var endFinal = this.node.getChildByName("endFinal");
        var player0_mjput = this.node.getChildByName("PlaYing").getChildByName("location0").getChildByName("mjput");

        this.adaptorForScale(myhand, 0.8, true);
        this.adaptorForScale(penggangs, 0.8, true);
        this.adaptorForScale(mjput, 0.8, true);
        this.adaptorForScale(pointer, 0.8, true);
        this.adaptorForScale(playEatFlag, 0.8, true);
        this.adaptorForScale(showTingkou, 1.2, true);
        this.adaptorForScale(playBegin, 0.8, true);
        this.adaptorForScale(endOne, 0.8, true);
        this.adaptorForScale(endFinal, 0.8, true);
        // this.adaptorForScale(playHelp, 0.8, true);
        player0_mjput.getComponent(cc.Widget).bottom = 135;
    },

    playDDZAdaptorUIForIphoneX: function() {
        var poker = this.node.getChildByName("playDDZPlaying").getChildByName("myself").getChildByName("poker");
        var myTurnPutCard = this.node.getChildByName("playDDZPlaying").getChildByName("myself").getChildByName("myTurnPutCard");
        var myTurnLandClaim = this.node.getChildByName("playDDZPlaying").getChildByName("myself").getChildByName("myTurnLandClaim");
        var endOne = this.node.getChildByName("endDDZOne");
        var endFinal = this.node.getChildByName("endDDZFinal");
        var anim = this.node.getChildByName("playDDZPlaying").getChildByName("anim");

        this.adaptorForScale(poker, 0.8, true);
        this.adaptorForScale(myTurnPutCard, 0.8, true);
        this.adaptorForScale(myTurnLandClaim, 0.8, true);
        this.adaptorForScale(endOne, 0.8, true);
        this.adaptorForScale(endFinal, 0.8, true);
        this.adaptorForScale(anim, 0.8, true);
        this.playDDZAdaptorUIForIphoneXHeadAddx();
    },
    playDDZAdaptorUIForIphoneXHeadAddx() {
        var addX = 20;
        var playDDZBegin_left = this.node.getChildByName("playDDZBegin").getChildByName("left");
        var playDDZPlaying_left = this.node.getChildByName("playDDZPlaying").getChildByName("left");

        var playDDZBegin_myself = this.node.getChildByName("playDDZBegin").getChildByName("myself");
        var playDDZPlaying_myself_mask = this.node.getChildByName("playDDZPlaying").getChildByName("myself").getChildByName("mask");
        var playDDZPlaying_myself_playerSocreBg = this.node.getChildByName("playDDZPlaying").getChildByName("myself").getChildByName("playerSocreBg");
        var playDDZPlaying_myself_headBg = this.node.getChildByName("playDDZPlaying").getChildByName("myself").getChildByName("headBg");
        var playDDZPlaying_myself_headLeave = this.node.getChildByName("playDDZPlaying").getChildByName("myself").getChildByName("headLeave");
        var playDDZPlaying_myself_isLandLords = this.node.getChildByName("playDDZPlaying").getChildByName("myself").getChildByName("isLandLords");
        var playDDZPlaying_myself_myTurnPutCard = this.node.getChildByName("playDDZPlaying").getChildByName("myself").getChildByName("myTurnPutCard");
        var playDDZPlaying_myself_myTurnLandClaim = this.node.getChildByName("playDDZPlaying").getChildByName("myself").getChildByName("myTurnLandClaim");
        var playDDZPlaying_myself_playerTips = this.node.getChildByName("playDDZPlaying").getChildByName("myself").getChildByName("playerTips");

        this.nodeAddX(playDDZBegin_left, addX);
        this.nodeAddX(playDDZPlaying_left, addX);
        this.nodeAddX(playDDZBegin_myself, addX);
        this.nodeAddX(playDDZPlaying_myself_mask, addX);
        this.nodeAddX(playDDZPlaying_myself_playerSocreBg, addX);
        this.nodeAddX(playDDZPlaying_myself_headBg, addX);
        this.nodeAddX(playDDZPlaying_myself_headLeave, addX);
        this.nodeAddX(playDDZPlaying_myself_isLandLords, addX);
        this.nodeAddX(playDDZPlaying_myself_myTurnPutCard, addX);
        this.nodeAddX(playDDZPlaying_myself_myTurnLandClaim, addX);
        this.nodeAddX(playDDZPlaying_myself_playerTips, addX);
    },
    nodeAddX(node, addX) {
        node.x = node.x + addX;
    },

    /**
     * 基于layout设置下等间距
     * width每个控件的宽度
     * num 控件的个数
     */
    equalSpaceXAdaptorBaseOnLayout: function(node, width, num) {
        var spaceX = (cc.winSize.width - width * num) / (num + 1.0);
        node.getComponent(cc.Layout).paddingLeft = spaceX;
        node.getComponent(cc.Layout).spacingX = spaceX;
        cc.logManager.info("spaceX==", spaceX);
    },

    //等比例缩放
    adaptorForScale: function(node, scale, isOnlyForIphoneX) {
        if (cc.jsInstance.isIphoneX && isOnlyForIphoneX) {
            node.scale = scale;
        } else if (!isOnlyForIphoneX) {
            node.scale = scale;
        } else {
            var errDic = {
                "说明": "适配条件不生效!",
                "场景名称": this.node.parent.name,
                "控件名称": node.name,
                "方法名称": "adaptorForScale",
                "参数": {
                    "node": node.name,
                    "scale": scale,
                    "isOnlyForIphoneX": isOnlyForIphoneX
                },
            };
            var errStr = JSON.stringify(errDic);
            this.getFormatJosnStr(errStr);
        }
    },

    //自己实现的一个json字符串的格式化
    getFormatJosnStr: function(str) {
        var needInsterIndexArr = [];
        for (let i = 0; i < str.length; i++) {
            var subChar = str.substr(i, 1);
            var subCharNext;
            if (i + 1 < str.length) {
                subCharNext = str.substr(i + 1, 1);
            }
            if (subChar === ",") {
                needInsterIndexArr.push(i + 1);
            } else if (subChar === "{" || subChar === "[" || (subChar === "}" || subChar === "]") && subCharNext != ",") {
                needInsterIndexArr.push(i);
                needInsterIndexArr.push(i + 1);
            } else if ((subChar === "}" || subChar === "]") && subCharNext === ",") {
                needInsterIndexArr.push(i);
            }
        }

        for (let i = 0; i < needInsterIndexArr.length; i++) {
            var subStrs = str.substring(0, needInsterIndexArr[i] + i);
            var leftStr = str.substring(needInsterIndexArr[i] + i, str.length);
            str = subStrs + "\n" + leftStr;
        }

        var kuohaoNum = 0;
        for (let i = 0; i < str.length; i++) {
            var subChar = str.substr(i, 1);
            var subCharNext;
            if (i + 1 < str.length) {
                subCharNext = str.substr(i + 1, 1);
            }
            var subCharNextNext;
            if (i + 1 < str.length) {
                subCharNextNext = str.substr(i + 2, 1);
            }
            if (subChar === "{" || subChar === "[") {
                kuohaoNum++;
            } else if ((subCharNext === "}" || subCharNext === "]")) {
                if (subChar === "\n") {
                    kuohaoNum--;
                    for (let j = 0; j < kuohaoNum; j++) {
                        var subStrs = str.substring(0, i + j + 1);
                        var leftStr = str.substring(i + j + 1, str.length);
                        str = subStrs + "\t" + leftStr;
                    }
                }
            } else {
                if (subChar === "\n") {
                    for (let j = 0; j < kuohaoNum; j++) {
                        var subStrs = str.substring(0, i + j + 1);
                        var leftStr = str.substring(i + j + 1, str.length);
                        str = subStrs + "\t" + leftStr;
                    }
                }
            }
        }
        alert(str);
    },

});