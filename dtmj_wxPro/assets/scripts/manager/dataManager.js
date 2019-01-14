var TableState = {
    waitJoin: 1,
    waitReady: 2,
    waitPut: 3,
    waitEat: 4,
    waitCard: 5,
    roundFinish: 6,
    isReady: 7,
    waitRob: 8 //抢地主
}


cc.Class({ //用于处理游戏内数据
    extends: cc.Component,

    properties: {},



    SelfUid() {
        return cc.jsInstance.data.pinfo.uid
    },
    getSdata() {
        if (cc.jsInstance.data) {
            return cc.jsInstance.data.sData
        }
        return null;
    },

    start() {

    },
    setData(mainData) {
        cc.jsInstance.data = mainData; //包含游戏内的所有数据,比如sdata和tdata,play
    },
    setS2CData(evt, data) { //服务端向客户端的推送
        cc.logManager.info("收到的推送:" + evt);
        if (this[evt]) {
            this[evt](data);
        }
    },

    //亲友圈添加管理员
    // {
    //     "club": 187868,
    //     "member": {
    //         "uid": 10000285,
    //         "nickname": "fbzbuf",
    //         "timestamp": 1543299604518,
    //         "ingame": {},
    //         "online": 1543299459715,
    //         "offline": 1543299458715,
    //         "session": {
    //             "sid": 70,
    //             "fid": "pkcon0000"
    //         },
    //         "entryTime": 1543304502750,
    //         "leaveTime": 1543304500710,
    //         "manager": 1
    //     }
    // }
    addManager(data) {

    },

    //亲友圈移除管理员
    // {
    //     "club": 187868,
    //     "member": {
    //         "uid": 10000285,
    //         "nickname": "fbzbuf",
    //         "timestamp": 1543299604518,
    //         "ingame": {},
    //         "online": 1543299459715,
    //         "offline": 1543299458715,
    //         "session": {
    //             "sid": 70,
    //             "fid": "pkcon0000"
    //         },
    //         "entryTime": 1543304510250,
    //         "leaveTime": 1543304500710
    //     }
    // }
    removeManager(data) {

    },

    //立即开局  {uid: 7638893, immediatelyObj: {…}, showType: "update"}
    immediatelyApply(data) {
        cc.logManager.info("收到immediatelyApply");
        cc.jsInstance.data.sData.tData.immediatelyObj = data.immediatelyObj;
    },

    //进入某个亲友圈 {club: 324840, uid: 10000114, entryTime: 1537250464265}
    onEntryClub(data) {
        cc.logManager.info("收到onEntryClub");
        if (data.uid === cc.jsInstance.pinfo.pinfo.uid) {
            cc.jsInstance.clubId_Now = data.club; //保存当前在某个亲友圈的id
        }
    },
    //加入某个亲友圈 {clubId: 183979, clubName: "2TfEIoHV"}
    joinedClub(data) {
        cc.logManager.info("收到joinedClub");
        cc.jsInstance.clubId_join = data.clubId;
    },

    //离开亲友圈（被踢出）   离开亲友圈（被踢出）//自己被踢出亲友圈 {clubId: 286651, clubName: "模拟器1", kick: true}
    leavedClub(data) {
        cc.logManager.info("收到leavedClubb");
        if (cc.jsInstance.clubs && cc.jsInstance.clubs.length > 0) {
            for (var i = 0; i < cc.jsInstance.clubs.length; i++) {
                if (cc.jsInstance.clubs[i]._id === data.clubId) {
                    cc.jsInstance.clubs.splice(i, 1);
                    break;
                }
            }
        }
        cc.logManager.info("----cc.jsInstance.clubs--离开亲友圈--", cc.jsInstance.clubs);
    },
    //默认玩法被修改
    onChangeClubRule(data) {
        cc.logManager.info("收到onChangeClubRule");

    },
    //亲友圈某个牌桌玩法被修改
    onChangeDesktopRule(data) {
        cc.logManager.info("收到onChangeDesktopRule");

    },
    //亲友圈牌桌玩法是否被修改 {pro: "lockWays", status: false, club: 286651}
    onChangedClubPro(data) {
        cc.logManager.info("收到onChangedClubPro");
        // cc.logManager.info("----cc.jsInstance.clubs--亲友圈设置发生变化--", data);
        // cc.logManager.info("----cc.jsInstance.clubs--亲友圈设置发生变化前--", cc.jsInstance.clubs);
        //维护亲友圈设置数据
        if (cc.jsInstance.clubs && cc.jsInstance.clubs.length > 0) {
            for (var i = 0; i < cc.jsInstance.clubs.length; i++) {
                if (cc.jsInstance.clubs[i]._id === data.club) {
                    if (data.pro === "lockWays") {
                        cc.jsInstance.clubs[i].settings.lockWays = !data.status;
                    } else if (data.pro === "hideCard") { //是否隐藏房卡
                        cc.jsInstance.clubs[i].settings.hideCard = !data.status;
                    } else if (data.pro === "immediately") { //人数不足开局
                        cc.jsInstance.clubs[i].settings.immediately = data.status;
                    }
                    break;
                }
            }
        }
        cc.logManager.info("----cc.jsInstance.clubs--亲友圈设置发生变化后--", cc.jsInstance.clubs);
    },

    // 亲友圈桌子数有变化 
    onDesksChange(data) {
        cc.logManager.info("收到onDesksChange");
    },

    //亲友圈房卡发生变化 {club: 197720, money: 7418}
    ChangeClubMoney(data) {
        cc.logManager.info("收到ChangeClubMoney");
    },
    //亲友圈 人员状态发生变化 
    // {appEnd: "majiang", uid: 7638895, club: 286651, props: {"online":"1537546045995"}}
    // {appEnd: "majiang", uid: 7638895, club: 286651, props: {"offline":"1537546259721"}}
    ChangeMemberStatus(data) {
        cc.logManager.info("收到ChangeMemberStatus");
    },

    // removeMember 某人退出或者被圈主踢出去某个亲友圈{club: 286651, member: 7638895}
    removeMember(data) {
        cc.logManager.info("收到removeMember");
    },

    // clubJoin  有人申请加入亲友圈 {"uid":7638895,"nickname":"oXL3Jrtk","timestamp":1537546843901,"clubjoinlist":1}
    // {"uid":713510,"nickname":"%u4E09%u5341%u4E8C%u4E09%u5341%u4E8C","timestamp":1538064233209,"headimgurl":"","clubjoinlist":1}
    clubJoin(data) {
        cc.logManager.info("收到clubJoin");
        cc.clubjoinlist = data.clubjoinlist;
    },



    // entryDesktop          玩家进入牌桌 
    entryDesktop(data) {
        cc.logManager.info("收到entryDesktop");
    },
    // leaveDesktop          有人离开牌桌
    leaveDesktop(data) {
        cc.logManager.info("收到leaveDesktop");
    },
    // cleanDesktop          清理牌桌
    cleanDesktop(data) {
        cc.logManager.info("收到cleanDesktop");
    },
    // clubRoundChange       刷新牌桌局数
    clubRoundChange(data) {
        cc.logManager.info("收到clubRoundChange");
    },

    // invitePlayer2Desk     被邀请进入牌桌
    invitePlayer2Desk(data) {
        cc.logManager.info("收到invitePlayer2Desk");
    },
    // addMember             房主通过新会员入会
    addMember(data) {
        cc.logManager.info("收到addMember");
    },
    // addDesk               新加牌桌
    addDesk(data) {
        cc.logManager.info("收到addDesk");
    },


    //斗地主 过  {"cmd":"MJPass","__route__":"pkroom.handler.tableMsg","uid":103259}
    MJPassDDZ(data) {
        cc.logManager.info("收到MJPassDDZ");
        var sData = cc.jsInstance.data.sData;
        var tData = sData.tData;
        //增加计数器 下一个人的操作
        tData.curPlayer = (tData.curPlayer + 1) % 3;
        if (tData.curPlayer === tData.lastPutPlayer) {
            tData.lastPut = [];
            tData.passPlayers = [];
        }
        cc.logManager.info("MJPassDDZ");
    },
    //抢地主
    robLandlord(data) { //似乎暂时没用
        cc.logManager.info("收到robLandlord");
    },
    //抢地主
    MJRob(d) {
        cc.logManager.info("收到MJRob");
        var sData = cc.jsInstance.data.sData;
        var tData = sData.tData = d.tData;
    },
    //斗地主打牌 {"cmd":"MJPut","card":[207],"__route__":"pkroom.handler.tableMsg","uid":103431}
    MJPutDDZ(d) {
        cc.logManager.info("收到MJPutDDZ");
        var sData = cc.jsInstance.data.sData;
        var tData = sData.tData;
        var uids = tData.uids;

        //炸弹数自己处理一下
        var cardTypes = cc.jsInstance.Poker.getCardsType(d.card);
        if (cardTypes.split("bomb").length > 1 || cardTypes.split("joker").length > 1) {
            tData.bombNumber = tData.bombNumber + 1;
        }

        tData.lastPutPlayer = tData.curPlayer;
        tData.curPlayer = (tData.curPlayer + 1) % 3;
        tData.lastPut = d.card;
        tData.tState = TableState.waitPut;
        tData.putType = d.putType;

        var pl = sData.players[d.uid + ""];
        if (!pl.mjput) {
            pl.mjput = [];
        }
        pl.mjput.push(d.card);

        //playEffect("nv/" + d.card);

        if (d.uid == this.SelfUid()) {
            // pl.mjhand.splice(pl.mjhand.indexOf(d.card),1);
            pl.mjState = TableState.waitPut;
            pl.skipHu = false;
        } else {
            sData.players[this.SelfUid() + ""].mjState = TableState.waitPut;
        }
        //mylog("myput "+d.card);
    },
    //斗地主结束
    roundEndDDZ(d) {
        cc.logManager.info("收到roundEndDDZ");
        var data = d;
        cc.jsInstance.roundEnd = data;
        cc.jsInstance.pinfo.vipTable = 0;
        var sData = cc.jsInstance.data.sData;
        sData.tData = d.tData;
        for (var uid in d.players) {
            var pl = d.players[uid];
            var plLocal = sData.players[uid];
            for (var pty in pl) plLocal[pty] = pl[pty];
        }
        // if (sData.tData.winner >= 0) playEffect("nv/hu");
        if (d.playInfo && cc.jsInstance.data.playLog) {
            if (cc.jsInstance.data.playLog.logs) {
                cc.jsInstance.data.playLog.logs.push(d.playInfo);
            }
        }
    },

    //玩家微信头像缓存
    loadWxHead(data) {
        cc.logManager.info("收到loadWxHead");

    },

    //重新初始化场景数据(回放) 暂时不用
    reinitSceneData(data) {
        cc.logManager.info("收到reinitSceneData");
    },

    //移除玩家
    removePlayer(d) {
        cc.logManager.info("收到removePlayer");
        d = this.transformXGTogameKind(d);
        var sData = cc.jsInstance.data.sData;
        if (sData) {
            delete sData.players[d.uid];
            sData.tData = d.tData;
            // mylog(JSON.stringify(Object.keys(sData.players)));
        }
    },

    //增加玩家
    addPlayer(d) {
        cc.logManager.info("收到addPlayer");
        d = this.transformXGTogameKind(d);
        var sData = cc.jsInstance.data.sData;
        // cc.logManager.info("addPlayer---------3----------"+JSON.stringify(cc.jsInstance.data));
        // cc.logManager.info("addPlayer---------4----------"+JSON.stringify(sData));
        // cc.logManager.info("JOSN" + JSON.stringify(d.player))
        if (sData) {
            sData.players[d.player.info.uid] = d.player;
            sData.tData = d.tData;
            //玩家进入音效
            // playEffect("player_join_effect") 
        }
    },


    //等待玩家出牌
    waitPut(d) {
        cc.logManager.info("收到waitPut");
        d = this.transformXGTogameKind(d);
        var sData = cc.jsInstance.data.sData;
        if (sData) {
            sData.tData = d;
            sData.players[this.SelfUid() + ""].mjState = TableState.waitPut;
            // playEffect("card_click_effect"); //发牌音效
        }
    },

    //更新数据（更新玩家信息） 
    updateInfo(info) {
        cc.logManager.info("收到updateInfo");
        // cc.logManager.info("updateInfo===" + JSON.stringify(info)); //updateInfo==={"money":0}
        if (info.money >= 0) {
            // cc.logManager.info("设置更新元宝成功------");
            cc.jsInstance.pinfo.pinfo.money = info.money;
            cc.logManager.info("设置更新元宝成功------" + cc.jsInstance.pinfo.pinfo.money);
        }
        // cc.logManager.info("updateInfo===" + JSON.stringify(info)); //updateInfo==={"money":0}
        if (info.coin >= 0) {
            // cc.logManager.info("设置更新金币成功------");
            cc.jsInstance.pinfo.pinfo.coin = info.coin;
            cc.logManager.info("设置更新金币成功------" + cc.jsInstance.pinfo.pinfo.coin);
        }
        //俱乐部更新
        if (info.joinedClubs) {
            cc.jsInstance.pinfo.pinfo.joinedClubs = info.joinedClubs;
        }
        //{"foundedClub":630392,"joinedClubs":[630392]} //被赠送亲友圈

    },

    //手牌
    mjhand(d) {
        cc.logManager.info("收到mjhand");
        // sendEvent("clearCardUI");
        d = this.transformXGTogameKind(d);
        var sData = cc.jsInstance.data.sData;
        sData.tData = d.tData;
        cc.jsInstance.data.tingType = 0;
        for (var uid in sData.players) {
            var pl = sData.players[uid];
            pl.mjpeng = [];
            pl.mjgang0 = [];
            pl.mjgang1 = [];
            pl.chiArr = [];
            pl.cpgh = 0;
            pl.penguid = {};
            pl.gang0uid = {};

            pl.tingArr = [];
            pl.gangArr = [];
            pl.canhu = 0;

            pl.mjchi = [];
            pl.mjput = [];
            pl.skipHu = false;
            pl.jin = [];
            pl.mjfeng = [];
            pl.yingkou = [];
            pl.showfeng = false;
            pl.fturnfengNum = 0;
            pl.mjting = false;
            pl.kouArr = [];
            pl.gangshow = 0;
            pl.mjpeng4 = [];
            if (sData.tData.xa_xiapaozi || sData.tData.weinan_xiapaozi) {
                pl.ischeck = false;
            }
            if (sData.tData.lisi) {
                pl.liNum = 4;
            } else {
                pl.liNum = 0;
            }
            delete pl.mjli;
            delete pl.mjhand;
            //delete pl.mjting;
            pl.mjState = TableState.waitPut;
            // cc.logManager.info("d.mjhand = %s", d.mjhand);
            // cc.logManager.info("d.mjli = %s", d.mjli);
            if (uid == this.SelfUid()) {
                pl.mjhand = d.mjhand;
                pl.mjli = d.mjli;
                pl.mjting = d.mjting;
                pl.mjpeng4 = [];
            }
        }
    },

    //过(好像没有这个推送)
    MJPass(d) {
        cc.logManager.info("收到MJPass");
        var sData = cc.jsInstance.data.sData;
        var tData = sData.tData;
        var pl = sData.players[this.SelfUid()];
        pl.mjState = d.mjState;
    },

    //打牌
    MJPut(d) {
        cc.logManager.info("收到MJPut");
        var sData = cc.jsInstance.data.sData;
        if (!sData) {
            return;
        }

        var tData = sData.tData;
        tData.lastPut = d.card;
        tData.tState = TableState.waitEat;
        tData.putType = d.putType;
        var pl = sData.players[d.uid];

        cc.logManager.info("打牌人=" + d.uid);
        cc.logManager.info("打之前的手牌=" + JSON.stringify(sData.players[d.uid + ""].mjhand));
        if (cc.jsInstance.globalUtils.needShowTingIcon()) {
            if (d.trueCard) {
                pl.mjput.push(d.trueCard);
                if (tData.king || (tData.gameKind && tData.gameKind == "xyPoint")) {
                    tData.lastPut = d.trueCard;
                }
            } else {
                pl.mjput.push(d.card);
            }
        } else {
            pl.mjput.push(d.card);
        }

        // cc.logManager.info("d.card11:" + pl.mjli);


        if (d.uid == this.SelfUid() && !cc.jsInstance.replayui) {
            if (d.card != 0) {
                pl.mjhand.splice(pl.mjhand.indexOf(d.card), 1);
                pl.mjState = TableState.waitPut;
                if (!tData.zhuohaozi) {
                    pl.skipHu = false;
                }
            } else {
                pl.mjhand.splice(pl.mjhand.indexOf(d.trueCard), 1);
                pl.mjState = TableState.waitPut;
                if (!tData.zhuohaozi) {
                    pl.skipHu = false;
                }

            }
            if (d.ting) {
                // cc.logManager.info("d.card33:" + pl.mjli);
                // cc.logManager.info("d.card22:" + d.trueCard);

                if (tData.lisi && pl.mjli) {
                    pl.mjli.splice(pl.mjli.indexOf(d.trueCard), 1);
                }
            }

        } else {
            sData.players[this.SelfUid() + ""].mjState = TableState.waitEat;
        }

        if (d.ting == 1 && d.mjting) {
            pl.mjting = d.mjting;
        }
        if (tData.king) {
            for (var uid in d.players) {
                var pld = d.players[uid];
                var plLocal = sData.players[uid];
                // cc.logManager.info(" plLocal.kouArr  = " + plLocal.kouArr);
                plLocal.kouArr = pld.kouArr;
            }
        }

        sData.players[this.SelfUid() + ""].cpgh = d.cpgh;
        sData.players[this.SelfUid() + ""].chiArr = d.chiArr;

        cc.logManager.info("打之后的手牌=" + JSON.stringify(sData.players[d.uid + ""].mjhand));
    },
    //发牌
    newCard(d) {
        cc.logManager.info("收到newCard:" + d.newCard);
        var sData = cc.jsInstance.data.sData;
        if (!sData) { //如果sdata不存在,则直接返回
            return;
        }

        var pl = sData.players[this.SelfUid() + ""];
        var hands = pl.mjhand;
        pl.isNew = true;
        cc.logManager.info("之前的手牌=" + JSON.stringify(hands));
        if (d.newCard) {
            hands.push(d.newCard);
        } else {
            hands.push(d);
        }

        pl.tingArr = d.tingArr;
        pl.gangArr = d.gangArr;
        pl.canhu = d.canhu;
        cc.logManager.info("现在的手牌=" + JSON.stringify(hands));
        cc.logManager.info("new cccccc" + pl.isNew);
    },
    //碰
    MJPeng(d) {
        cc.logManager.info("收到MJPeng");
        d = this.transformXGTogameKind(d);
        var sData = cc.jsInstance.data.sData;
        sData.tData = d.tData;
        var tData = sData.tData;
        var uids = tData.uids;
        var cd = tData.lastPut;

        cc.logManager.info("MJPeng " + cd + " " + d.from + " " + tData.curPlayer); //碰的那个牌（最后打的那个牌）   谁送的碰    谁碰的

        var pl = sData.players[uids[tData.curPlayer]];
        var lp = sData.players[uids[d.from]]; //from 谁送的碰
        pl.mjpeng.push(cd);
        if (d.penguid) {
            pl.penguid = d.penguid;
        }
        if (pl.penguid) {
            // cc.logManager.info("pl.penguid = " + JSON.stringify(pl.penguid));
        }

        if (sData.tData.lastfeng > 0) {
            var mjput = lp.mjfeng;
            if (mjput.length > 0 && mjput[mjput.length - 1] == cd) {
                mjput.length = mjput.length - 1;
            } else {
                cc.logManager.error("peng error from");
                // cc.logManager.info("lp.info.uid" + lp.info.uid);
                // cc.logManager.info("mjput.length = " + mjput);
            }
        } else {
            var mjput = lp.mjput;
            if (mjput.length > 0 && mjput[mjput.length - 1] == cd) {
                mjput.length = mjput.length - 1;
            } else cc.logManager.error("peng error from");
        }


        if (uids[tData.curPlayer] == this.SelfUid() && !cc.jsInstance.replayui) {
            pl.mjState = TableState.waitPut;
            pl.isNew = false;
            var mjhand = pl.mjhand;
            var idx = mjhand.indexOf(cd);
            if (idx >= 0) {
                mjhand.splice(idx, 1);
            } else cc.logManager.error("eat error to");
            idx = mjhand.indexOf(cd);
            if (idx >= 0) {
                mjhand.splice(idx, 1);
            } else cc.logManager.error("eat error to");
            //处理立牌数据
            var mjli = pl.mjli;

            if (mjli) {
                //lew 新立四处理逻辑
                //删除碰的立四牌:
                if (d.pengLiInfo.removeLiNum > 0) { //  pengLiInfo 谁碰的
                    for (var i = 0; i < d.pengLiInfo.removeLiNum; i++) {
                        idx = mjli.indexOf(cd);
                        if (idx >= 0 && mjli.length > 1) {
                            mjli.splice(idx, 1);
                        }
                    }
                }
            }
            if (mjhand.indexOf(cd) >= 0)
                pl.mjpeng4.push(cd);

        }
        cc.logManager.info("mjhand = " + pl.mjhand);

        sData.players[this.SelfUid() + ""].tingArr = d.tingArr;
        sData.players[this.SelfUid() + ""].gangArr = d.gangArr;
        sData.players[this.SelfUid() + ""].canhu = d.canhu;

    },

    //杠
    MJGang(d) {
        cc.logManager.info("收到MJGang");
        var sData = cc.jsInstance.data.sData;
        var tData = sData.tData;
        var uids = tData.uids;
        var cd = d.card;
        var pl = sData.players[d.uid];
        if (d.gang == 1) {
            pl.mjgang0.push(cd);
            if (d.gang0uid) {
                pl.gang0uid = d.gang0uid;
            }
            if (pl.gang0uid) {
                // cc.logManager.info("pl.gang0uid = " + JSON.stringify(pl.gang0uid));
            }
            if (d.uid == this.SelfUid() && !cc.jsInstance.replayui) {
                pl.mjhand.splice(pl.mjhand.indexOf(cd), 1);
                pl.mjhand.splice(pl.mjhand.indexOf(cd), 1);
                pl.mjhand.splice(pl.mjhand.indexOf(cd), 1);

                if (pl.mjli) {
                    //处理立四牌
                    if (pl.mjli.indexOf(cd) >= 0) {
                        pl.mjli.splice(pl.mjli.indexOf(cd), 1);
                    }
                    if (pl.mjli.indexOf(cd) >= 0) {
                        pl.mjli.splice(pl.mjli.indexOf(cd), 1);
                    }
                    if (pl.mjli.indexOf(cd) >= 0) {
                        pl.mjli.splice(pl.mjli.indexOf(cd), 1);
                    }
                }

            }

            var lp = sData.players[uids[d.from]];
            var mjput = lp.mjput;
            if (mjput.length > 0 && mjput[mjput.length - 1] == cd) {
                mjput.length = mjput.length - 1;
            } else cc.logManager.error("gang error from");
            pl.isNew = false;
        } else if (d.gang == 2) {
            pl.mjgang0.push(cd);
            if (d.gang0uid) {
                pl.gang0uid = d.gang0uid;
            }
            if (pl.gang0uid) {
                // cc.logManager.info("pl.gang0uid = " + JSON.stringify(pl.gang0uid));
            }
            pl.mjpeng.splice(pl.mjpeng.indexOf(cd), 1);
            if (d.uid == this.SelfUid() && !cc.jsInstance.replayui) {
                pl.mjhand.splice(pl.mjhand.indexOf(cd), 1);
            }
        } else if (d.gang == 3) {
            pl.mjgang1.push(cd);
            if (d.uid == this.SelfUid() && !cc.jsInstance.replayui) {
                pl.mjhand.splice(pl.mjhand.indexOf(cd), 1);
                pl.mjhand.splice(pl.mjhand.indexOf(cd), 1);
                pl.mjhand.splice(pl.mjhand.indexOf(cd), 1);
                pl.mjhand.splice(pl.mjhand.indexOf(cd), 1);

                //处理立四牌

                if (pl.mjli) {
                    if (pl.mjli.indexOf(cd) >= 0) {
                        pl.mjli.splice(pl.mjli.indexOf(cd), 1);
                    }
                    if (pl.mjli.indexOf(cd) >= 0) {
                        pl.mjli.splice(pl.mjli.indexOf(cd), 1);
                    }
                    if (pl.mjli.indexOf(cd) >= 0) {
                        pl.mjli.splice(pl.mjli.indexOf(cd), 1);
                    }
                }

            }
        }
        tData.curPlayer = tData.uids.indexOf(d.uid);
        tData.lastPut = cd;
        if (!tData.noBigWin || (d.gang == 2 && tData.canEatHu)) tData.putType = d.gang;

        tData.tState = TableState.waitEat;

        if (d.uid == this.SelfUid()) {
            pl.mjState = TableState.waitCard;
        } else {
            sData.players[this.SelfUid() + ""].mjState = TableState.waitEat;
        }


        sData.players[this.SelfUid() + ""].cpgh = d.cpgh;
        sData.players[this.SelfUid() + ""].chiArr = d.chiArr;
    },

    //正常游戏结束
    roundEnd(d) {
        cc.logManager.info("收到roundEnd");
        // var data = d;
        // cc.jsInstance.roundEnd = data;
        d = this.transformXGTogameKind(d);
        cc.jsInstance.pinfo.vipTable = 0;
        var sData = cc.jsInstance.data.sData;
        sData.tData = d.tData;
        for (var uid in d.players) {
            var pl = d.players[uid];
            var plLocal = sData.players[uid];
            for (var pty in pl) plLocal[pty] = pl[pty];
        }

        if (d.playInfo && cc.jsInstance.data.playLog) {
            cc.jsInstance.data.playLog.logs = cc.jsInstance.data.playLog.logs || [];
            cc.jsInstance.data.playLog.logs.push(d.playInfo);
        }

    },

    //（游戏还没开始就结束）-----
    endRoom(d) {
        cc.logManager.info("收到endRoom");
        // var data = d;
        // cc.jsInstance.endRoom = data;
        cc.jsInstance.endRoomMsg = d;
        if (d.playInfo && cc.jsInstance.data.playLog) {
            cc.jsInstance.data.playLog.logs = cc.jsInstance.data.playLog.logs || [];
            cc.jsInstance.data.playLog.logs.push(d.playInfo);
        }
        cc.jsInstance.pinfo.vipTable = 0;
        cc.jsInstance.endRoomData = d; //亲友圈点击解散 别人还灭有进去可能在牌桌外面收到，保存数据，牌桌里面处理 
    },

    // 玩家在线1（中途上线掉线用）
    onlinePlayer(d) {
        cc.logManager.info("收到onlinePlayer");
        var sData = cc.jsInstance.data.sData;
        if (sData) {
            sData.players[d.uid].onLine = d.onLine;
            sData.players[d.uid].mjState = d.mjState;

            // 比赛场相关
            if (d && sData.tData && sData.tData.haveFid &&
                (d.isManaged == false || d.isManaged == true)) {
                sData.players[d.uid].isManaged = d.isManaged;
            }
        }
    },

    //删除房间 游戏已经正在进行有人申请解散房间
    DelRoom(dr) {
        cc.logManager.info("收到DelRoom");
        dr = this.transformXGTogameKind(dr);
        var sData = cc.jsInstance.data.sData;
        sData.tData = dr.tData;
        for (var uid in dr.players) {
            var pl = dr.players[uid];
            sData.players[uid].delRoom = pl.delRoom;
        }
        if (dr.nouid.length >= 1) {
            cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("玩家 " + this.GetUidNames(dr.nouid) + " 不同意解散包厢", function() {
                cc.jsInstance.audioManager.playBtnClick();
            })
        }
    },

    GetUidNames(uids) {
        var sData = cc.jsInstance.data.sData;

        var rtn = [];
        for (var i = 0; i < uids.length; i++) {
            var pl = sData.players[uids[i]];
            if (pl) rtn.push(unescape(pl.info.nickname || pl.info.name).substr(0, 6));
        }
        return rtn + "";

    },

    //初始化场景数据
    initSceneData(data) {
        cc.logManager.info("收到initScenData");
        if (data.tData.roundNum <= -2) {
            cc.jsInstance.network.leaveGame();
            return -1;
        } else {
            data = this.transformXGTogameKind(data);
            cc.jsInstance.data.sData = data;
            data.serverNow -= Date.now();
            cc.logManager.info("当前场景名字==isconnet===", cc.director.getScene()._name) //获取当前场景的名字
            if (data && data.tData && data.tData.gameKind === "happyDDZ") {
                cc.jsInstance.PokerManager.initPokerType(data.tData.gameKind);
                cc.jsInstance.native.skipScene("playDDZ"); //跳到斗地主场景
            }else if (data && data.tData && data.tData.gameKind === "pokerPDK") {
                cc.jsInstance.PokerManager.initPokerType(data.tData.gameKind);
                cc.jsInstance.native.skipScene("playDDZ"); //跳到斗地主场景
            } else {
                if (cc.director.getScene()._name === "play") {} else {
                    cc.jsInstance.native.skipScene("play"); //跳到 麻将对战场景
                }
            }
        }
    },

    //金币场
    notifyPlayer(data) {
        cc.logManager.info("收到notifyPlayer");
        // {
        //     "content": {
        //         "fid": "5b165956f8dbc959607b5862",
        //         "stage": "1",
        //         "score": 28888,
        //         "total_round": 0,
        //         "finish": 1,
        //         "duration": 4876,
        //         "status": 8,----   3.  5
        //         "rule": {
        //             "describe": "初级金币场",
        //             "stages": {
        //                 "1": {
        //                     "name": "初赛",
        //                     "round": 1000000000000000,
        //                     "next": null,
        //                     "score": 0
        //                 }
        //             },
        //             "groupnum": 4,
        //             "minplayers": 4
        //         },
        //         "reason": "leave",
        //         "contestType": "4",
        //         "uniqueId": "GM1",---
        //         "notifyType": 6,   // 1通知玩家参赛  2 向pkplayer请求房间 3 通知pkplayer，用户组桌游戏 4  通知pkplayer比赛结束 5 解散table 6 每一局結束，都会推送type:6消息到客户端 7 房主比赛通知客户端
        //         "finishtime": 1528196194
        //     }
        // }


        // {"content":{"msg":"please join game","vipTable":526730,"fid":"5b165956f8dbc959607b5862","contestType":"4","uniqueId":"GM1","notifyType":3}}

        // {"content":{"fid":"5b165956f8dbc959607b5862","stage":"1","score":8488,"finish":0,"duration":370911,"status":1,"rule":{"1":{"name":"初赛","round":1000000000000000,"next":null,"score":0}},"contestType":"4","uniqueId":"GM1","notifyType":6,"finishtime":1528562229}}
        // {"content":{"fid":"5b165956f8dbc959607b5862","stage":"1","score":8488,"total_round":1,"finish":1,"duration":632,"status":5,"reason":"waitTimeout","contestType":"4","uniqueId":"GM1","notifyType":6,"finishtime":1528562409}}
        if (data.content.notifyType) {
            if (data.content.notifyType === 1) { //1通知玩家参赛

            } else if (data.content.notifyType === 2) { //2 向pkplayer请求房间

            } else if (data.content.notifyType === 3) { //3 通知pkplayer，用户组桌游戏  进入比赛
                if (data.content.uniqueId) {
                    cc.jsInstance.data.incontestUniqueId = data.content.uniqueId; //GM
                }
                cc.jsInstance.vipTable = data.content.vipTable; //保存这个房间号  在金币场里面离开的时候判断有没有，没有说明不在金币场 在匹配的时候=0
                cc.jsInstance.network.joinGame(data.content.vipTable, true, function(rtn) {
                    if (rtn.result === 0) { //加入成功
                        cc.logManager.info("加入房间成功！");
                    }
                });
            } else if (data.content.notifyType === 4) { //4  通知pkplayer比赛结束  比赛结束，整个比赛结束

            } else if (data.content.notifyType === 5) { //5 解散table

            } else if (data.content.notifyType === 6) { //6 每一局結束，都会推送type:6消息到客户端   正常解散
                if (data.content.uniqueId) { //金币场服务器踢人
                    if (data.content.status && data.content.status === 5) { //强行结束比赛，通常是组桌超时  不在房间，
                        cc.jsInstance.data.incontest = ""; //fid  
                        cc.jsInstance.data.incontestUniqueId = ""; //GM
                        cc.jsInstance.data.fid = data.content.fid; //暂存上一场的fid
                        cc.jsInstance.data.GM = data.content.uniqueId; //暂存上一场的GM
                    }
                    // 1 当前局打完， 准备目前stage的下一局
                    // 2 在本轮stage被淘汰， 累计分数不足进入下一轮stage
                    // 3 正常进入下一轮stage
                    // 4 正常打完比赛
                    // 5 强行结束比赛， 通常是组桌超时
                    // 6 幸运玩家： 进入下一轮stage
                    cc.logManager.info("发送continueMJPlayground的消息--------------------------", data.content.status); //
                    if (parseInt(data.content.status) <= 5) {
                        cc.jsInstance.globalUtils.send("continueMJPlayground", {
                            data: data.content.status
                        });
                    } else {
                        cc.logManager.info("发送continueMJPlayground的消息----------不发送-------->5--------", data.content.status); //
                    }
                }
            } else if (data.content.notifyType === 7) { // 7 房主比赛通知客户端
            }
        }
    },

    checkManaged(data) {
        cc.logManager.info("收到checkManaged");
    },

    MJPass(data) {
        cc.logManager.info("收到MJPass");
    },

    MJHu(data) {
        cc.logManager.info("收到MJHu");
    },

    /**
     * 新的设计用的是gamekind
     * 旧的是gsjxg，做个统一这里
     */
    transformXGTogameKind(data) {
        if (data && data.tData && data.tData.guaisanjiao) {
            data.tData["gameKind"] = "guaisanjiao";
        } else if (data.guaisanjiao) {
            data["gameKind"] = "guaisanjiao";
        }
        return data;
    }

    // update (dt) {},
});