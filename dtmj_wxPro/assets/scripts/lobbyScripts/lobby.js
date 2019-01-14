cc.Class({
    extends: cc.Component,
    properties: {
        createRoomMask: {
            type: cc.Node,
            default: null,
        },
        joinGameMask: {
            type: cc.Node,
            default: null,
        },
        joinRoomBg: {
            type: cc.Node,
            default: null,
        },
        //左上角滚动的文字
        nofit: {
            type: cc.Node,
            default: null,
        },

        gold: {
            type: cc.Node,
            default: null,
        },
        ID: {
            type: cc.Label,
            default: null,
        },
        nickname: {
            type: cc.Label,
            default: null,
        },
        money: {
            type: cc.Label,
            default: null,
        },
        coin: {
            type: cc.Label,
            default: null,
        },
        //亲友圈
        clubGame: {
            type: cc.Node,
            default: null,
        },
        createGame: {
            type: cc.Node,
            default: null,
        },
        //回到游戏
        callbackGame: {
            type: cc.Node,
            default: null,
        },
        joinGame: {
            type: cc.Node,
            default: null,
        },
        jinbichang: {
            type: cc.Node,
            default: null,
        },
        club: {
            type: cc.Node,
            default: null,
        },
        clubRoom: {
            type: cc.Node,
            default: null,
        },
        //亲友圈右上角提示
        club_tip: {
            type: cc.Node,
            default: null,
        },
        messageInfo: {
            type: cc.Node,
            default: null,
        },
        msgRed: {
            type: cc.Node,
            default: null,
        },
    },


    onLoad() {
        // cc.jsInstance.native.showGameClubButton();
        var self = this;
        self.club_tip.active = false;
        this.waitting = this.node.getChildByName("goldContest").getChildByName("waitting").getComponent("waitting");
        this.clubroom = this.clubRoom.getComponent("clubroom");
        this.setClub_Tip(); //是否显示亲友圈红点
        self.setPlayerdata();
        self.checkShare();
        self.setMarquee();
        self.setDenglongAction();
        this.instanceEventOn(); //初始化监听消息类
        this.setMsgNum(true);
        // self.ishideUI();
        this.isshowClubUi();
        // this.beginCountDown();
    },
    //定时器
    beginCountDown() {
        this.countDownCallBack = function() {
            if (!cc.jsInstance.countDownLeftTime || cc.jsInstance.countDownLeftTime.length <= 0) {
                this.unschedule(this.countDownCallBack);
            }
            for (var i = 0; i < cc.jsInstance.countDownLeftTime.length; i++) {
                var tempItem = cc.jsInstance.countDownLeftTime[i];
                if (tempItem.isClicked) {
                    tempItem.time--;
                    if (tempItem.time === 0) {
                        tempItem.time = 120;
                        tempItem.isClicked = false;
                    }
                }
            }
        };
        this.schedule(this.countDownCallBack, 1);
    },

    isshowClubUi() {
        if (cc.jsInstance.clubShow) {
            this.clubClick();
        }
    },
    //是否显示亲友圈红点
    setClub_Tip() {
        cc.logManager.info("第一次进入大厅，检查是否显示红点");
        var self = this;
        if (cc.clubjoinlist && cc.clubjoinlist > 0) {
            self.club_tip.active = true;
        } else {
            self.club_tip.active = false;
        }
    },

    setMsgNum(isshow) {
        var self = this;
        // this.messageInfo = this.node.getChildByName("messageInfo");
        cc.jsInstance.native.getmsg(function() {
            // self.messageInfo.getComponent("messageInfo").setmsgnum(isshow, self.node.getChildByName("bottomBarBg").getChildByName("noticeBtn").getChildByName("red"));
            self.messageInfo.getComponent("messageInfo").setmsgnum(isshow, self.msgRed);
            
        });
    },
    setPlayerdata() {
        var self = this;
        if (!cc.jsInstance.pinfo || !cc.jsInstance.pinfo.pinfo) {
            return;
        }
        if (cc.jsInstance.pinfo.pinfo.nickname) {
            this.nickname.string = unescape(cc.jsInstance.pinfo.pinfo.nickname).substr(0, 6);
        } else {
            this.nickname.string = cc.jsInstance.pinfo.pinfo.name;
        }
        this.ID.string = "ID:" + cc.jsInstance.pinfo.pinfo.uid;
        self.money.string = cc.jsInstance.native.formatMoney(cc.jsInstance.pinfo.pinfo.money);
        if (cc.jsInstance.pinfo.pinfo.headimgurl) {
            cc.loader.load({
                url: cc.jsInstance.pinfo.pinfo.headimgurl,
                type: 'png'
            }, function(err, ret) {
                if (err) {
                    cc.logManager.info("设置图片失败");
                    return;
                }
                var spriteFrame = new cc.SpriteFrame(ret, cc.Rect(0, 0, ret.width, ret.height));
                self.node.getChildByName("bottomBarBg").getChildByName("headIcon").getChildByName("headLayer").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }.bind(this));

        }
    },

    ishideUI() {
        if (cc.jsInstance.remoteCfg.version === cc.jsInstance.version + "") { //隐藏创建房间，加入房间 回到房间 元宝 
            this.node.getChildByName("bottomBarBg").getChildByName("rechargeBtn").active = false;
            this.createGame.active = false;
            this.callbackGame.active = false;
            this.joinGame.active = false;
            this.clubGame.active = false;
            // this.jinbichang.y = 0 + this.jinbichang.height / 2;
            this.scheduleOnce(function() { //暂时用定时器显示，上面那个正常的会失效，暂时不知道什么原因
                this.jinbichang.y = 0 + this.jinbichang.height / 2;
            }, 0);
        }
    },

    instanceEventOn() {
        var self = this;
        cc.jsInstance.globalUtils.dataEventHandler = this.node;
        this.node.on("updateInfo", function(data) {
            self.money.string = cc.jsInstance.native.formatMoney(cc.jsInstance.pinfo.pinfo.money);
            self.coin.string = cc.jsInstance.native.formatMoney(cc.jsInstance.pinfo.pinfo.coin);
        });
        this.node.on("roundEnd", function(data) {
            // //本局结束，重置开关
            if (cc.jsInstance.pinfo.vipTable != 0) {
                self.callbackGame.active = true;
                self.joinGame.active = false;
            } else {
                self.callbackGame.active = false;
                self.joinGame.active = true;
            }
        });

        this.node.on("notifyPlayer", function(data) {
            self.waitting.closeWaittingUi();

        });
        this.node.on("setMsgNum", function(data) {
            self.setMsgNum(false);
        });

        this.node.on("vipTable", function(data) {
            self.checkShare();
            //重连成功后显示在前面的弄得关闭
            self.node.getChildByName("creatRoomMask").active = false;
            self.node.getChildByName("club").active = false;
            self.node.getChildByName("clubroom").active = false;
            self.node.getChildByName("goldContest").active = false;
            // self.node.getChildByName("userInfoMask").active = false;
            // cc.jsInstance.playHelp.getActive() = false;
            // self.node.getChildByName("rechargeMask").active = false;
            // self.node.getChildByName("settingMask").active = false;
            self.node.getChildByName("listLogs").active = false;
            // self.node.getChildByName("faceback").active = false;
            self.node.getChildByName("message").active = false;
            self.node.getChildByName("messageInfo").active = false;
            // self.node.getChildByName("InviFrend").active = false;
            // self.node.getChildByName("moregame").active = false;
        });

        this.node.on("joinClub", function(data) { //重连成功后加入亲友圈
            self.checkShare();
        });

        this.onClub();
    },
    onClub() {
        var self = this;
        //某人进入某个亲友圈 {club: 324840, uid: 10000114, entryTime: 1537250464265}
        this.node.on("onEntryClub", function(data) {
            // cc.logManager.info("----onEntryClub===",data);
            if (self.clubRoom.active === true) {
                self.clubroom.onEntryClub(data.detail);
            }
        });
        //加入某个亲友圈 {clubId: 183979, clubName: "2TfEIoHV"}
        this.node.on("joinedClub", function(data) {
            // cc.logManager.info("----joinedClub===", data);
            if (self.clubRoom.active === true) {
                if (cc.jsInstance.clubId_Now) { //加入这个亲友圈 初始化 （如果俱乐部是打开的 还是选择原来的俱乐部，重新初始化下）
                    self.clubroom.getJoinedClubs(cc.jsInstance.clubId_Now);
                } else {
                    self.clubroom.getJoinedClubs();
                }
            } else { //显示俱乐部右上角的红点
                cc.logManager.info("加入亲友圈圈主同意了，显示大厅红点");
                // self.club_tip.active = true;
                self.scheduleOnce(function() { //暂时用定时器显示，上面那个正常的会失效，暂时不知道什么原因
                    self.club_tip.active = true;
                }, 0);
            }
        });
        // 离开亲友圈（被踢出）//自己被踢出亲友圈 {clubId: 286651, clubName: "模拟器1", kick: true}
        this.node.on("leavedClub", function(data) {
            // cc.logManager.info("----joinedClub===", data);
            if (self.clubRoom.active === true) {
                self.clubroom.leavedClub(data.detail);
            }
        });
        //默认牌桌规则发生变化
        this.node.on("onChangeClubRule", function(data) {
            if (self.clubRoom.active === true) {
                self.clubroom.onChangeClubRule(data.detail);
            }
        });
        //某个牌桌规则发生变化
        this.node.on("onChangeDesktopRule", function(data) {
            if (self.clubRoom.active === true) {
                self.clubroom.onChangeDesktopRule(data.detail);
            }
        });
        //亲友圈牌桌玩法是否被修改 {pro: "lockWays", status: false, club: 286651}
        this.node.on("onChangedClubPro", function(data) {
            if (self.clubRoom.active === true) {
                self.clubroom.onChangedClubPro(data.detail);
            }
        });
        //亲友圈桌子数有变化  {"club":286651,"desks":[1,2,3,4,5,6,7,8]}
        this.node.on("onDesksChange", function(data) {
            if (self.clubRoom.active === true) {
                self.clubroom.onDesksChange(data.detail);
            }
        });

        //亲友圈房卡发生变化 {club: 197720, money: 7418}
        this.node.on("ChangeClubMoney", function(data) {
            if (self.clubRoom.active === true) {
                self.clubroom.ChangeClubMoney(data.detail);
            }
        });

        // 亲友圈 人员状态发生变化
        // {appEnd: "majiang", uid: 7638895, club: 286651, props: {"online":"1537546045995"}}
        // {appEnd: "majiang", uid: 7638895, club: 286651, props: {"offline":"1537546259721"}}
        this.node.on("ChangeMemberStatus", function(data) {
            if (self.clubRoom.active === true) {
                self.clubroom.ChangeMemberStatus(data.detail);
            }
        });

        // 某人退出或者被圈主踢出去某个亲友圈{club: 286651, member: 7638895}
        this.node.on("removeMember", function(data) {
            if (self.clubRoom.active === true) {
                self.clubroom.removeMember(data.detail);
            }
        });
        // 有人申请加入亲友圈 {"uid":7638895,"nickname":"oXL3Jrtk","timestamp":1537546843901,"clubjoinlist":1}
        // {"uid":713510,"nickname":"%u4E09%u5341%u4E8C%u4E09%u5341%u4E8C","timestamp":1538064233209,"headimgurl":"","clubjoinlist":1}
        this.node.on("clubJoin", function(data) {
            if (self.clubRoom.active === true) {
                self.clubroom.clubJoin(data.detail);
            } else {
                cc.logManager.info("有人申请加入亲友圈，显示大厅红点");
                self.club_tip.active = true;
                // self.clubroom.isShowHongdian(true);
            }
        });
        // entryDesktop          玩家进入牌桌 
        this.node.on("entryDesktop", function(data) {
            if (self.clubRoom.active === true) {

                self.clubroom.entryDesktop(data.detail);
            }
        });
        // leaveDesktop          有人离开牌桌
        this.node.on("leaveDesktop", function(data) {
            if (self.clubRoom.active === true) {
                self.clubroom.leaveDesktop(data.detail);
            }
        });
        // cleanDesktop          清理牌桌
        this.node.on("cleanDesktop", function(data) {
            if (self.clubRoom.active === true) {
                self.clubroom.cleanDesktop(data.detail);
            }
        });
        // clubRoundChange       刷新牌桌局数
        this.node.on("clubRoundChange", function(data) {
            if (self.clubRoom.active === true) {
                self.clubroom.clubRoundChange(data.detail);
            }
        });
        // invitePlayer2Desk     被邀请进入牌桌
        this.node.on("invitePlayer2Desk", function(data) {
            // if (self.clubRoom.active === true) {
            // }
            self.clubroom.invitePlayer2Desk(data.detail);
        });
        // addMember             房主通过新会员入会
        this.node.on("addMember", function(data) {
            if (self.clubRoom.active === true) {
                self.clubroom.addMember(data.detail);
            }
        });
        // addDesk               新加牌桌
        this.node.on("addDesk", function(data) {
            if (self.clubRoom.active === true) {
                self.clubroom.addDesk(data.detail);
            }
        });
        //显示红点
        this.node.on("club_tip", function(data) {
            cc.logManager.info("收到推送检查是否显示大厅红点");
            self.setClub_Tip();
        });
        //亲友圈添加管理员
        this.node.on("addManager", function(data) {
            cc.logManager.info("亲友圈添加管理员");
            if (self.clubRoom.active === true) {
                self.clubroom.addManager(data.detail);
            }
        });
        //亲友圈移除管理员
        this.node.on("removeManager", function(data) {
            cc.logManager.info("亲友圈移除管理员");
            if (self.clubRoom.active === true) {
                self.clubroom.removeManager(data.detail);
            }
        });

    },


    setDenglongAction() {
        var self = this;
        // self.joinGame.rotation = -2;
        var rto = cc.rotateTo(2, -2).easing(cc.easeSineOut()); //easeCubicActionOut  easeSineOut easeSineIn
        var rto1 = cc.rotateBy(0.2, 0); //0.2秒变化0度 暂停
        var rto2 = cc.rotateTo(2, 2).easing(cc.easeSineOut());
        var rto3 = cc.rotateBy(0.2, 0);
        var seq = cc.sequence([rto, rto1, rto2, rto3]);
        var rf = cc.repeatForever(seq); // 永远循环执行
        self.joinGame.runAction(rf);

        // self.callbackGame.rotation = -2;
        var rto = cc.rotateTo(2, -2).easing(cc.easeSineOut()); //easeCubicActionOut  easeSineOut easeSineIn
        var rto1 = cc.rotateBy(0.2, 0); //0.2秒变化0度 暂停
        var rto2 = cc.rotateTo(2, 2).easing(cc.easeSineOut());
        var rto3 = cc.rotateBy(0.2, 0);
        var seq0 = cc.sequence([rto, rto1, rto2, rto3]);
        var rf0 = cc.repeatForever(seq0); // 永远循环执行
        self.callbackGame.runAction(rf0);

        // self.node.getChildByName("denglong").getChildByName("jinbichang").rotation = -2;
        var rto = cc.rotateTo(2, -2).easing(cc.easeSineOut()); //easeCubicActionOut  easeSineOut easeSineIn
        var rto1 = cc.rotateBy(0.2, 0); //0.2秒变化0度 暂停
        var rto2 = cc.rotateTo(2, 2).easing(cc.easeSineOut());
        var rto3 = cc.rotateBy(0.2, 0);
        var seq1 = cc.sequence([rto, rto1, rto2, rto3]);
        var rf1 = cc.repeatForever(seq1); // 永远循环执行
        self.node.getChildByName("denglong").getChildByName("jinbichang").runAction(rf1);

        // self.node.getChildByName("denglong").getChildByName("createroom").rotation = -2;
        var rto = cc.rotateTo(2, -2).easing(cc.easeSineOut()); //easeCubicActionOut  easeSineOut easeSineIn
        var rto1 = cc.rotateBy(0.2, 0); //0.2秒变化0度 暂停
        var rto2 = cc.rotateTo(2, 2).easing(cc.easeSineOut());
        var rto3 = cc.rotateBy(0.2, 0);
        var seq2 = cc.sequence([rto, rto1, rto2, rto3]);
        var rf2 = cc.repeatForever(seq2); // 永远循环执行
        self.node.getChildByName("denglong").getChildByName("createroom").runAction(rf2);

        // self.node.getChildByName("denglong").getChildByName("qinyouquan").rotation = -2;
        var rto = cc.rotateTo(2, -2).easing(cc.easeSineOut()); //easeCubicActionOut  easeSineOut easeSineIn
        var rto1 = cc.rotateBy(0.2, 0); //0.2秒变化0度 暂停
        var rto2 = cc.rotateTo(2, 2).easing(cc.easeSineOut());
        var rto3 = cc.rotateBy(0.2, 0);
        var seq2 = cc.sequence([rto, rto1, rto2, rto3]);
        var rf2 = cc.repeatForever(seq2); // 永远循环执行
        self.node.getChildByName("denglong").getChildByName("qinyouquan").runAction(rf2);

    },

    checkShare() {
        var self = this;
        this.callbackGame.active = false;
        if (cc.jsInstance.data.sData && cc.jsInstance.data.vipTable) { //有房间  cc.jsInstance.pinfo.vipTable != 0
            self.callbackGame.active = true;
            self.joinGame.active = false;
            self.ishideUI(); //是否需要隐藏灯笼
            cc.sys.localStorage.setItem("ShareRoomid", -1); //改变
        } else {
            self.callbackGame.active = false;
            self.joinGame.active = true;
            self.ishideUI(); //是否需要隐藏灯笼
            var ShareRoomid = cc.sys.localStorage.getItem('ShareRoomid'); //从缓存取
            cc.logManager.info("ShareRoomid============" + ShareRoomid);
            if (ShareRoomid && ShareRoomid != -1) { //看是不是点击别人邀请到房间号的分享进来的，如果有房间号 ，加入场景，然后改变viptable的值，然后改掉这个 缓存的房间号
                cc.jsInstance.network.joinGame(ShareRoomid, false, function(rtn) {
                    if (rtn.result === 0) { //加入成功
                        cc.jsInstance.pinfo.vipTable = 1;
                    }
                    cc.logManager.info("加入房间成功------改变点击分享进来的 房间号 为-1");
                    cc.sys.localStorage.setItem("ShareRoomid", -1); //改变
                });
            }
            cc.jsInstance.native.ClubShared(); //处理分享的亲友圈数据
        }
    },

    setMarquee() {
        var self = this;
        this.nofit.getComponent(cc.Label).string = cc.jsInstance.remoteCfg.homeScroll; //为滚动文字lable设置文字
        //让左上角文字自动跑马灯滚动
        self.nofit.x = 300;
        var callback = function() {
            var mto = cc.moveTo(20, cc.p(self.nofit.width * (-1), 0)); // cc.moveTo(1, x, y);
            var end_func = cc.callFunc(function() {
                self.nofit.x = 300;
                self.nofit.y = 0;
            }.bind(self))
            var seq = cc.sequence([mto, end_func]);
            self.nofit.runAction(seq);
        }.bind(self);
        this.schedule(callback, 21, cc.macro.REPEAT_FOREVER, 1); // 默认值为永远执行，马上开始  schedule(函数, 多长时间掉一次, 次数(永远), 隔多少秒以后开始执行shedule)
    },

    //显示金币场
    showGold() {
        cc.jsInstance.native.sendALDEvent("金币场");
        if (!cc.jsInstance.remoteCfg.GoldContest) {
            cc.jsInstance.bayWindow.openBayWindow("金币场逐步开放中...");
            return;
        }
        this.gold.active = true;
        cc.jsInstance.audioManager.playBtnClick();
        this.gold.getComponent("goldContest").getPeoples();
    },

    callbackRoomBtnClick: function() {
        cc.logManager.info("回到对战场景");
        cc.jsInstance.audioManager.playBtnClick();
        var data = cc.jsInstance.data.sData;
        if (data && data.tData && data.tData.gameKind === "happyDDZ") {
            cc.jsInstance.native.skipScene("playDDZ"); //跳到斗地主场景
        } else {
            cc.jsInstance.native.skipScene("play");
        }

    },

    createRoomBtnClick: function() {
        cc.logManager.info("创建房间");
        cc.jsInstance.audioManager.playBtnClick();
        this.createRoomMask.active = true;
        this.createRoomMask.getComponent("createRoomMask").isClub_In(false);
    },

    clubClick: function() {
        cc.jsInstance.native.sendALDEvent("亲友圈");
        cc.logManager.info("亲友圈");
        var self = this;
        var name;
        if (cc.jsInstance.pinfo.pinfo.nickname) {
            name = cc.jsInstance.pinfo.pinfo.nickname;
        } else {
            name = cc.jsInstance.pinfo.pinfo.name;
        }
        cc.jsInstance.audioManager.playBtnClick();
        if (cc.jsInstance.pinfo.pinfo.joinedClubs && cc.jsInstance.pinfo.pinfo.joinedClubs.length > 0) {
            cc.logManager.info("点击大厅亲友圈，看是否显示红点");
            self.setClub_Tip();
            self.node.getChildByName("clubroom").active = true;
            self.node.getChildByName("clubroom").getComponent("clubroom").click_club=true;
            self.node.getChildByName("clubroom").getComponent("clubroom").closeAllPop();
            self.node.getChildByName("clubroom").getComponent("clubroom").getJoinedClubs();

        } else {
            this.club.active = true;
        }
    },

    joinGameBtnClick: function() {
        cc.jsInstance.audioManager.playBtnClick();
        cc.logManager.info("加入游戏");
        this.joinGameMask.active = true;
        this.joinRoomBg.active = true;
        this.joinRoomBg.getComponent("joinGameBg").setRoomNumTitle("tableid");
        cc.jsInstance.native.setScaleAction(this.joinRoomBg);
    },

    start() {
        var self = this;
        cc.jsInstance.native.wxShareMenu();
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            cc.jsInstance.FeedbackButton.show();
        }
    },

    onDestroy() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            cc.jsInstance.FeedbackButton.hide();
        }
        this.unschedule(this.countDownCallBack);
    },
    isshowFeedbackButton() { //其他节点挡住这个反馈的时候要隐藏点击事件，否则显示
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (this.node.getChildByName("creatRoomMask").active ||
                this.node.getChildByName("club").active ||
                this.node.getChildByName("clubroom").active ||
                this.node.getChildByName("goldContest").active ||
                this.node.getChildByName("userInfoMask").active ||
                this.node.getChildByName("rechargeMask").active ||
                this.node.getChildByName("settingMask").active ||
                this.node.getChildByName("listLogs").active ||
                this.node.getChildByName("message").active ||
                this.node.getChildByName("messageInfo").active ||
                this.node.getChildByName("joinRoomBg").active ||
                this.node.getChildByName("club_invite").active ||
                cc.jsInstance.playHelp.getActive() ||
                cc.jsInstance.block.isActive() ||
                cc.jsInstance.msgpop.isActive()) {
                cc.jsInstance.FeedbackButton.hide();
            } else {
                cc.jsInstance.FeedbackButton.show();
            }
        }

    },

    update(dt) {
        this.isshowFeedbackButton();
    },
});