// loadWxHead          玩家微信头像缓存 1
// MJChat              互动表情
// downAndPlayVoice    下载播放声音
// initSceneData       初始化场景数据1
// reinitSceneData     重新初始化场景数据(回放)
// removePlayer        移除玩家1 ----游戏还没开始，房主解散房间（或者其他玩家主动退出房间《点击解散房间》）
// addPlayer           增加玩家1
// updateInfo          更新数据（更新玩家信息）1 ---{"gameCountSinceBindPlayer":6,"energyPoint":3}  roundEnd（房间内所有牌局结束）完成之后推过来
// moveHead            移动头像
// mjhand              手牌1
// MJPao               下炮 
// MJShowfeng          显示风
// fengbuCard          
// MJPass              过1  -----(好像没有这个推送)
// MJPut               打牌1
// showMJGang          显示杠（榆林打锅子）
// newCard             发牌1
// waitPut             等待玩家出牌1
// MJPutJin            
// MJChi               吃
// MJPeng              碰1
// MJGang              杠1
// roundEnd            正常结束1-----每局游戏结束都会推送
// endRoom            （游戏还没开始就结束）-----
// onlinePlayer        玩家在线1----（中途上线掉线用，准备状态会推）
// MJTickGame          心跳
// MJTick              心跳
// DelRoom             删除房间 投票结束 游戏已经正在进行有人申请解散房间

// notifyPlayer        金币场 type = 3  和5

// MJPassDDZ           斗地主过
// robLandlord         抢地主 //暂时没用
// MJRob               抢地主
// MJPutDDZ            斗地主打牌
// roundEndDDZ         斗地主一举结束

//亲友圈
// onEntryClub          进入某个亲友圈
// joinedClub           加入某个亲友圈
// leavedClub           离开亲友圈（被踢出）//自己被踢出亲友圈 {clubId: 286651, clubName: "模拟器1", kick: true}
// onChangeDesktopRule  某个牌桌规则发生变化
// onChangeClubRule     默认牌桌规则发生变化
// onChangedClubPro     允许玩家修改玩法 房卡,修改玩法开关{ pro:"proname",status:true/false }
// onDesksChange        亲友圈桌子数有变化 
// ChangeClubMoney      亲友圈房卡发生变化
// ChangeMemberStatus   亲友圈 人员状态发生变化 玩家状态变更
// clubJoin             有人申请加入亲友圈 {"uid":7638895,"nickname":"oXL3Jrtk","timestamp":1537546843901,"clubjoinlist":1}

// addManager {"club":187868,"member":{"uid":10000285,"nickname":"fbzbuf","timestamp":1543299604518,"ingame":{},"online":1543299459715,"offline":1543299458715,"session":{"sid":70,"fid":"pkcon0000"},"entryTime":1543304502750,"leaveTime":1543304500710,"manager":1}}
// removeManager {"club":187868,"member":{"uid":10000285,"nickname":"fbzbuf","timestamp":1543299604518,"ingame":{},"online":1543299459715,"offline":1543299458715,"session":{"sid":70,"fid":"pkcon0000"},"entryTime":1543304510250,"leaveTime":1543304500710}}

// 牌桌内
// entryDesktop          玩家进入牌桌 
// leaveDesktop          有人离开牌桌
// cleanDesktop          清理牌桌
// clubRoundChange       刷新牌桌局数

// invitePlayer2Desk     被邀请进入牌桌
// addMember             房主通过新会员入会
// removeMember          玩家退亲友圈{club: 286651, member: 7638895}
// addDesk               新加牌桌
// immediatelyApply      立即开局



var http = require("http");
const ZJHCode = require('ZJHCode');

cc.Class({ //该类用户封装gamenet相关操作,以及服务端推送
    extends: cc.Component,

    properties: {

    },
    getMsges() {
        //消息头cmd   有消息就往这里加一个字符串
        this.netMsgName = ["loadWxHead", "MJChat", "downAndPlayVoice", "initSceneData", "reinitSceneData", "removePlayer", "addPlayer",
            "updateInfo", "moveHead", "mjhand", "MJPao", "MJShowfeng", "fengbuCard", "MJPass", "MJPut", "MJHu", "showMJGang", "newCard", "waitPut", "MJPutJin",
            "MJChi", "MJPeng", "MJGang", "roundEnd", "endRoom", "onlinePlayer", "MJTickGame", "MJTick", "DelRoom", "notifyPlayer", "checkManaged",
            "MJPassDDZ", "robLandlord", "MJRob", "MJPutDDZ", "roundEndDDZ", "onEntryClub", "joinedClub", "leavedClub", "onChangeDesktopRule", "onChangeClubRule",
            "onChangedClubPro", "onDesksChange", "ChangeClubMoney", "ChangeMemberStatus", "removeMember", "clubJoin", "entryDesktop", "leaveDesktop", "cleanDesktop",
            "cleanDesktop", "clubRoundChange", "invitePlayer2Desk", "addMember", "addDesk", "immediatelyApply", "addManager", "removeManager",
        ]

        var jsNetMsg = {}
        for (var i = 0; i < this.netMsgName.length; i++) {
            jsNetMsg[this.netMsgName[i]] = this.callback;
        }
        return jsNetMsg;
    },
    callback(evt, data) {
        // cc.jsInstance.dataManager.setData(data);
        cc.jsInstance.dataManager.setS2CData(evt, data);
        cc.jsInstance.globalUtils.send(evt, data);
        // cc.logManager.info(evt + "===callback_data === ", data);
    },
    //获取服务器时间
    tickServer(callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--tickServer", );
            return;
        }
        cc.jsInstance.gamenet.request("pkcon.handler.tickServer", {}, function(rtn) {
            // cc.logManager.info("---pkcon.handler.tickServer------", rtn);
            cc.jsInstance.tickServer = rtn.serverRecvAt;
            var date = cc.jsInstance.native.getFormatDate(cc.jsInstance.tickServer); //时间格式化 返回[]
            // cc.logManager.info("---当前服务器时间------", cc.jsInstance.tickServer);
            // cc.logManager.info("---当前服务器时间------", date[0] + "-" + date[1] + "-" + date[2] + " " + date[3] + ":" + date[4] + ":" + date[5]);
            if (callBack) {
                callBack(rtn);
            }
        });
    },


    LeaveClubC2S(clubid) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--LeaveClub", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        var params = {
            "club": clubid
        };
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkroom.handler.LeaveClub", params, function(rtn) {
            cc.jsInstance.block.hide();
            if (rtn.result == 0) {} else {}
        });
    },

    //设置管理员 params: { uid: 10000002 }
    setClubManagerC2S(params, callback) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--setClubManager", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkplayer.handler.setClubManager", params, function(rtn) {
            cc.jsInstance.block.hide();
            if (rtn.result == 0) {
                cc.logManager.info("设置管理员成功 rtn:" + JSON.stringify(rtn));
                //更改成员属性
                cc.jsInstance.clubControler.changeManager(params.uid, 1);
                if (callback) {
                    callback();
                }
            } else {
                cc.jsInstance.msgpop.showMsg_text_noclose("设置管理员失败!!请重新打开成员列表!", function() {});
            }
        });
    },

    //取消管理员 params: { uid: 10000002 }
    removeClubManagerC2S(params, callback) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--removeClubManager", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkplayer.handler.removeClubManager", params, function(rtn) {
            cc.jsInstance.block.hide();
            if (rtn.result == 0) {
                cc.logManager.info("取消管理员成功 rtn:" + JSON.stringify(rtn));
                //更改成员属性
                cc.jsInstance.clubControler.changeManager(params.uid, 1);
                if (callback) {
                    callback();
                }
            } else {
                cc.jsInstance.msgpop.showMsg_text_noclose("取消管理员失败!!请重新打开成员列表!", function() {});
            }
        });
    },


    //离开亲友圈牌桌(暂时没用到)
    DestroyClubTable(clubId, desktop) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--DestroyClubTable", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkroom.handler.DestroyClubTable", {
            club: clubId,
            desktop: desktop
        }, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    //立即开局  
    immediatelyStart(peopleNum, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--createClubBySycee", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        if (!peopleNum) {
            alert("people is null! must write this parameter!");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "immediatelyStart",
            needNum: peopleNum
        }, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    //同意或者 取消 立即开局   0:取消 1:同意
    immediatelyApply(isAgree, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--immediatelyApply", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "immediatelyApply",
            applyType: isAgree
        }, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },


    //创建亲友圈
    createClubBySycee(callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--createClubBySycee", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkplayer.handler.createClubBySycee", {
            price: 188
        }, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },
    //加入这个亲友圈
    joinClub(clubId, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--joinClub", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkplayer.handler.joinClub", {
            clubId: clubId
        }, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    //进入这个亲友圈
    entryClub(clubID, nickname, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--entryClub", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkroom.handler.entryClub", {
            "club": clubID,
            "appEnd": "majiang",
            "nickname": nickname
        }, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    //获取所有的亲友圈数据
    getJoinedClubs(callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--getJoinedClubs", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkplayer.handler.getJoinedClubs", {}, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    //设置默认亲友圈玩法规则 {"rule":{"round":"round8","gameKind":"happyDDZ","gameXg":{"visible":true,"bombLime":3}}}
    modifyClubDefaultRule(rule, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--modifyClubDefaultRule", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        var params = {
            "rule": rule
        };
        cc.jsInstance.clubControler.attachClubId(params);
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkplayer.handler.modifyClubDefaultRule", params, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    //修改亲友圈某个牌桌的玩法 俱乐部id 桌子号 规则
    // {"club":286651,"desktop":1,"rule":{"round":"roundz16","gameKind":"tuidaohu2","gameXg":{"visible":true,"dahu":false,"canEatHu":true,"needTing":false,"changeTingGang":false}}}
    ChangeDesktopRule(club, desktop, rule, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--ChangeDesktopRule", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkroom.handler.ChangeDesktopRule", {
            "club": club,
            "desktop": desktop,
            "rule": rule
        }, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    // 亲友圈设置  房卡 是否允许修改  立即开局 pro(immediately lockWays hideCard)  bool 是否打开
    setClubPro(pro, bool, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--setClubPro", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        var params = {
            "pro": pro
        };
        cc.jsInstance.clubControler.attachClubId(params);
        cc.jsInstance.block.show();
        var request;
        if (bool) {
            request = "pkplayer.handler.enableClubPro";
        } else {
            request = "pkplayer.handler.disableClubPro";
        }
        cc.jsInstance.gamenet.request(request, params, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    //获取我的亲友圈信息
    getMyClub(callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--getMyClub", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        var params = {};
        cc.jsInstance.clubControler.attachClubId(params);
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkplayer.handler.getMyClub", params, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },
    //亲友圈改名字  需要检查违规字符
    keywordTest(text, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--keywordTest", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkcon.handler.keywordTest", {
            "text": text
        }, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    //亲友圈改名字
    modifyClubName(name, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--modifyClubName", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        var params = {
            "name": name
        };
        cc.jsInstance.clubControler.attachClubId(params);
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkplayer.handler.modifyClubName", params, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },


    // 购买房卡     {"btype":0,"prize":1,"number":1150,"amount":1150,"clubid":286651}
    // btype:购买类型，区别于用户现金购买和元宝购买，btype: 0--元宝购买，1--用户支付购买，
    // prize:房卡价格，
    // number:房卡数量，
    // amount:金额，
    // clubid:俱乐部id
    buyClubMoneyBySycee(amount, clubid, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--buyClubMoneyBySycee", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkplayer.handler.buyClubMoneyBySycee", {
            "btype": 0,
            "prize": 1,
            "number": amount,
            "amount": amount,
            "clubid": clubid
        }, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    // 获取亲友圈申请列表
    getClubApplyList(clubid, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--getClubApplyList", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkplayer.handler.getClubApplyList", {
            "clubId": clubid
        }, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    // JS: pkplayer.handler.checkClubApply${"uid":713510,"status":2}  1 通过 2 拒绝
    // JS: pkplayer.handler.checkClubApply # 64 {"result":0,"uid":713510,"status":2,"clubjoinlist":0}
    // 圈主点击 同意或者拒绝 某人是否能够加入自己的亲友圈 1 通过 2 拒绝
    checkClubApply(uid, status, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--checkClubApply", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        var params = {
            "uid": uid,
            "status": status
        };
        cc.jsInstance.clubControler.attachClubId(params);
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkplayer.handler.checkClubApply", params, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },


    //亲友权 圈主 踢人
    kickClubMember(uid, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--checkClubApply", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        var params = {
            "uid": uid
        };
        cc.jsInstance.clubControler.attachClubId(params);

        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkplayer.handler.kickClubMember", params, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    //退出亲友圈
    exitClub(clubId, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--kickClubMember", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkplayer.handler.exitClub", {
            "clubId": clubId
        }, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },


    //圈主点击解散房间  {"club":"286651","desktop":1}
    DestroyClubTable(clubId, desktop, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--DestroyClubTable", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkroom.handler.DestroyClubTable", {
            "club": clubId,
            "desktop": desktop
        }, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    //俱乐部 创建房间 
    CreateVipTableClub(data, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--CreateVipTable", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkplayer.handler.CreateVipTable", data, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    //俱乐部点击加入牌桌 {"tableid":53955741,"gameid":"majiang","groupid":"197720","roomid":"club","desktop":1}
    JoinGameClub(tableid, groupid, desktop, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--JoinGame", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkplayer.handler.JoinGame", {
            "tableid": tableid,
            "gameid": "majiang",
            "groupid": groupid,
            "roomid": "club",
            "desktop": desktop
        }, function(rtn) {
            cc.jsInstance.block.hide();
            cc.sys.localStorage.setItem("Club", {}); //分享的亲友圈数据处理完成 清空数据
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    //获取某个亲友圈里 空闲的成员
    FreePlayers(clubId, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--FreePlayers", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkroom.handler.FreePlayers", {
            "club": clubId,
        }, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },


    //邀请玩家进入牌桌
    // club number required 俱乐部id
    // uid number required 被邀请的玩家id
    // desktop number required 俱乐部牌桌号
    InvitePlayer2Desk(club, uid, desktop, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--InvitePlayer2Desk", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkroom.handler.InvitePlayer2Desk", {
            "club": club,
            "uid": uid,
            "desktop": desktop,
        }, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },


    //圈主查看对战记录（历史战绩） {"uid":7638893,"club":286651,"appEnd":"majiang"}
    fetchClubLog(uid, club, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--fetchClubLog", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        var params = {
            "uid": uid,
            "club": club,
            "appEnd": "majiang",
        };
        cc.jsInstance.clubControler.attachClubId(params);
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkroom.handler.fetchClubLog", params, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    //获取俱乐部日志
    getClubLogs(callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--getClubLogs", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        var params = {};
        cc.jsInstance.clubControler.attachClubId(params);
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkplayer.handler.getClubLogs", params, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },


    //俱乐部排行榜 type 1 今天   2 昨天  club 俱乐部id   type:1–今天 2–昨天 3–前天 4–待定
    fetchClubRecords(type, club, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--fetchClubRecords", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkroom.handler.fetchClubRecords", {
            "type": type,
            "club": club,
            "appEnd": "majiang"
        }, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    // pkroom.handler.fetchMemberRecords${"type":1,"club":"286651","appEnd":"majiang","uid":"7638895"}
    // 点击亲友圈排行榜里面的详情  type 1 今天   2 昨天  
    fetchMemberRecords(type, club, uid, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--fetchMemberRecords", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkroom.handler.fetchMemberRecords", {
            "type": type,
            "club": club,
            "appEnd": "majiang",
            "uid": uid
        }, function(rtn) {
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },



    //抢地主 rob 0:不抢 1:抢 score:分数（不抢-1）   pkroom.handler.tableMsg${"cmd":"MJRob","rob":1,"score":1}
    //pkroom.handler.tableMsg${"cmd":"MJPass"}  //过
    tableMsgMJRob(rob, score) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--robLandlord", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        // cc.logManager.info("发送抢地主 rob:" + rob + " score:" + score);
        cc.jsInstance.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJRob",
            rob: rob,
            score: score
        });
    },

    //斗地主 过
    tableMsgMJPassDDZ() { //tableMsg
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--tableMsgMJPassDDZ", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }

        cc.jsInstance.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJPass",
        });
    },
    //斗地主打牌
    // pkroom.handler.tableMsg${"cmd":"MJPut","card":[207]}
    tableMsgMJPutDDZ(card) { //tableMsg
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--tableMsgMJPutDDZ", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJPut",
            card: card
        });
    },


    //游客登陆
    reqGuestID(data, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--reqGuestID", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.gamenet.request("login.handler.reqGuestID", data, callBack);
    },
    //登陆 
    doLogin(data, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--doLogin", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        var baseCall = function(rtn) {

            if (callBack) {
                callBack(rtn);
            }
        }
        cc.jsInstance.gamenet.request("pkcon.handler.doLogin", data, baseCall);
    },
    createVipTable(data, callBack) { //创建房间
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--createVipTable", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.gamenet.request("pkplayer.handler.CreateVipTable", data, callBack);
    },
    //加入游戏
    joinGame(tableid, isContest, callBack) { //加入房间
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--joinGame", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        var joinPara = {
            roomid: "symj1"
        };
        if (tableid) joinPara.tableid = parseInt(tableid);
        else joinPara.roomid = "symj2";

        var baseCall = function(rtn) {
            if (rtn.result != 0) {
                cc.jsInstance.block.hide();
                cc.sys.localStorage.setItem("ShareRoomid", -1); //改变 如果是分享进来的房间号，置空
                if (isContest || cc.jsInstance.data.inContest) { // 比赛场不显示加入房间相关信息
                    if (rtn.result == ZJHCode.roomFull) cc.logManager.info("包厢已经满roomid:" + tableid);
                    if (rtn.result == ZJHCode.roomNotFound) cc.logManager.info("包厢不存在roomid:" + tableid);
                } else {
                    if (rtn.result == ZJHCode.roomFull) {
                        cc.jsInstance.msgpop.showMsg_text_close_nocancle("包厢已经满", function() {
                            cc.jsInstance.audioManager.playBtnClick();
                        })
                    } else if (rtn.result == ZJHCode.roomNotFound) {
                        cc.jsInstance.msgpop.showMsg_text_close_nocancle("包厢不存在", function() {
                            cc.jsInstance.audioManager.playBtnClick();
                        })
                    } else if (rtn.result == ZJHCode.playerNotFound) {
                        cc.jsInstance.msgpop.showMsg_text_close_nocancle("玩家不存在", function() {
                            cc.jsInstance.audioManager.playBtnClick();
                        })
                    } else if (rtn.result == ZJHCode.verifyPlayerFail) {
                        cc.jsInstance.msgpop.showMsg_text_close_nocancle("账号验证失败，请重新尝试", function() {
                            cc.jsInstance.audioManager.playBtnClick();
                        })
                    } else {
                        cc.jsInstance.msgpop.showMsg_text_close_nocancle("加入房间失败=" + rtn.result, function() {
                            cc.jsInstance.audioManager.playBtnClick();
                        })
                    }

                }
            }
            if (callBack) {
                callBack(rtn);
            }
        }
        cc.jsInstance.gamenet.request("pkplayer.handler.JoinGame", joinPara, baseCall);
    },

    //通过 桌子号获取玩法类型
    getWanfaByTableId(callBack, tableid, clubId, desktop) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--getWanfaByTableId", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        var parameters = {};
        if (tableid) {
            parameters.tableid = tableid;
        }
        if (clubId) {
            parameters.groupid = clubId;
            parameters.roomid = 'club';
        } else {
            parameters.roomid = 'symj1';
        }
        if (desktop) {
            parameters.desktop = desktop;
        }
        cc.jsInstance.gamenet.request("pkplayer.handler.ProbeRoom", parameters, function(rtn) {
            if (rtn.result == 0) {}
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    //打牌
    tableMsgMjput(cds) { //tableMsg
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--tableMsgMjput", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJPut",
            card: cds,
            // ting: 1
        });
    },

    //听牌 
    tableMsgMjputTing(cds) { //tableMsg
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--tableMsgMjputTing", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJPut",
            card: cds,
            ting: 1
        });
    },
    //胡牌
    tableMsgMJHu() { //tableMsg
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--tableMsgMJHu", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        var self = this;
        var sData = cc.jsInstance.data.sData;
        var tData = sData.tData;
        var pl = sData.players[this.SelfUid() + ""];
        var cpgh = pl.cpgh;
        // cc.logManager.info("zwz_cpgh = " + cpgh);
        if (!cpgh || cpgh == [-1, -1, -1, -1]) {
            return;
        }
        this.seteagflag(cpgh);
        cc.jsInstance.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJHu",
            eatFlag: self._eatFlag
        });
    },

    //胡牌（自己）
    tableMsgMJHuMy() { //tableMsg
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--tableMsgMJHuMy", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJHu",
        });
    },

    //杠
    tableMsgMJGang(cds) { //tableMsg
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--tableMsgMJGang", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        var self = this;
        var sData = cc.jsInstance.data.sData;
        var tData = sData.tData;
        var pl = sData.players[this.SelfUid() + ""];
        var cpgh = pl.cpgh;
        // cc.logManager.info("zwz_cpgh = " + cpgh);
        if (!cpgh || cpgh == [-1, -1, -1, -1]) {
            return;
        }
        this.seteagflag(cpgh);
        cc.jsInstance.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJGang",
            card: cds,
            eatFlag: self._eatFlag
        });
    },

    //杠(自己)
    tableMsgMJGangMy(cds) { //tableMsg
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--tableMsgMJGangMy", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJGang",
            card: cds,
        });
    },

    //碰
    tableMsgMJPeng(cds) { //tableMsg
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--tableMsgMJPeng", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        var self = this;
        var sData = cc.jsInstance.data.sData;
        var tData = sData.tData;
        var pl = sData.players[this.SelfUid() + ""];
        var cpgh = pl.cpgh;
        // cc.logManager.info("zwz_cpgh = " + cpgh);
        if (!cpgh || cpgh == [-1, -1, -1, -1]) {
            return;
        }
        this.seteagflag(cpgh);
        cc.jsInstance.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJPeng",
            card: cds,
            eatFlag: self._eatFlag
        });
    },

    //过
    tableMsgMJPass() { //tableMsg
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--tableMsgMJPass", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        var self = this;
        var sData = cc.jsInstance.data.sData;
        var tData = sData.tData;
        var pl = sData.players[this.SelfUid() + ""];
        var cpgh = pl.cpgh;
        // cc.logManager.info("zwz_cpgh = " + cpgh);
        if (!cpgh || cpgh == [-1, -1, -1, -1]) {
            return;
        }
        this.seteagflag(cpgh);
        cc.jsInstance.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJPass",
            eatFlag: self._eatFlag
        });
    },

    tableMsgMJPassMy() { //tableMsg
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--tableMsgMJPassMy", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJPass",
        });
    },

    //删除房间
    tableMsgDelRoom(yes) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--tableMsgDelRoom", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "DelRoom",
            yes: yes
        });
    },
    //玩家处于托管状态 /s/ debug操作：点杠的时候是否托管，是托管则先请求取消托管
    tableMsgRequestManaged(isManaged, callBack) {

        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接，不能继续往下走---tableMsgRequestManaged", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        } else {
            cc.logManager.info("-----服务连接正常，tableMsgRequestManaged-- --", );
        }
        if (isManaged) {
            cc.jsInstance.block.show("请求托管...");
        } else {
            cc.jsInstance.block.show("取消托管求托管...");
        }

        cc.jsInstance.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "RequestManaged",
            Managed: isManaged
        }, function(rtn) {
            cc.jsInstance.block.hide();
            // cc.logManager.info("isManaged===" + isManaged);
            // cc.logManager.info("rtn===", rtn);
            if (rtn.result == 0) {

                // sendEvent("LeaveGame");
            }
            if (callBack) {
                callBack(rtn);
            }
        });
    },


    //离开游戏  // pkplayer.handler.LeaveGame # 107 {"result":0}//彻底离开房间 
    leaveGame(callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--leaveGame", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkplayer.handler.LeaveGame", {}, function(rtn) {
            cc.jsInstance.block.hide();
            if (rtn.result == 0) {
                delete cc.jsInstance.data.sData;
                // delete cc.jsInstance.roundEnd;
                // delete cc.jsInstance.endRoom;
                cc.logManager.info("离开牌桌，删除牌桌数据");
            }

            if (callBack) {
                callBack(rtn);
            }
        });
    },

    //登出游戏
    logout(callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--logout", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.gamenet.request("pkcon.handler.logout", {}, function(rtn) {
            // sys.localStorage.removeItem("WX_USER_LOGIN");
            // sys.localStorage.setItem("WX_USER_LOGIN", JSON.stringify(para));  //设置微信登陆信息
            // sys.localStorage.removeItem("loginData");
            // sys.localStorage.removeItem("chatFaceLock");
            // cc.jsInstance.energyPoint = 0;//清空比赛场能量点
            // //清空本地配置文件,重新初始化
            // sys.localStorage.clear();//该方法ios支持不完整
            // initLocalInfo();
            // sendEvent("logout");
            if (rtn.result == 0) {

                // sendEvent("LeaveGame");
            }
            if (callBack) {
                callBack(rtn);
            }
        });

    },

    //查看战绩  //pkplayer.handler.getSymjLog 请求查看战绩 
    getLog(callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--getLog", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        var uid = this.SelfUid();
        cc.jsInstance.block.show("获取战绩中...");
        cc.jsInstance.gamenet.request("pkplayer.handler.getSymjLog", {
            uid: uid
        }, function(rtn) {
            if (rtn.result == 0) {
                // sendEvent("LeaveGame");
            }
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });

    },

    //http://dtmjreplay.dtgames.cn/2018/03/21/622049_1814.txt  //对战回放  2018.3.21 18：14分，622049的房间号回放
    getloginfo(url, callBack, listlogs) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--getloginfo", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.logManager.info("战绩详情url：" + url);
        cc.jsInstance.block.show("获取战绩详情中...");
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function() {
            cc.logManager.info(" xhr.readyState：" + xhr.readyState);
            cc.logManager.info(" xhr.State：" + xhr.status);
            if (xhr.readyState === 4) {
                cc.jsInstance.block.hide();
                if (xhr.status === 200) {
                    var response = xhr.responseText;
                    if (callBack) {
                        callBack(JSON.parse(response));
                    }
                } else {
                    if (listlogs) {
                        listlogs.playlogUiNum = 1;
                    }
                    cc.jsInstance.msgpop.showMsg_text_close_nocancle("本场战绩未记录或已过期！", function() {
                        cc.jsInstance.audioManager.playBtnClick();
                    });
                }
            }

        };

        xhr.onerror = function(event) {
            cc.logManager.error("function getloginfo request error:");
            cc.jsInstance.block.hide();
        }
        xhr.open("GET", url, true); //http://dtmjreplay.dtgames.cn/2018/03/21/622049_1814.txt
        xhr.send();
    },


    //房主创建房间历史记录
    getFzcreateLog(callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--getFzcreateLog", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        var uid = this.SelfUid();
        cc.jsInstance.gamenet.request("pkplayer.handler.getSymjLog", {
            ownerId: uid
        }, function(rtn) {
            if (rtn.result == 0) {}
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    //反馈 
    faceBack(str, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--faceBack", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        var postString = JSON.stringify(str);
        cc.logManager.info("反馈提交内容===" + postString);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                cc.logManager.info("response=" + response);
                if (callBack) {
                    callBack(JSON.parse(response));
                }
            } else {
                cc.logManager.info("-------------------------------", xhr.readyState);
                cc.logManager.info("-------------------------------", xhr);
            }
        };
        xhr.onerror = function(event) {
            cc.logManager.error("提交反馈失败：", event);
        }
        xhr.open("POST", cc.jsInstance.remoteCfg.feedbackURL, true);
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        xhr.setRequestHeader("Authorization", 'Basic ' + cc.jsInstance.native.base64encode('8i3lMgOUk_yCBpIxazo_vQ:0K0k0NjqfYsK1liXNub34w'));
        xhr.send(postString);

    },


    //     一、获取金币场列表， （暂时废弃，第10代替）
    // 说明：通常是返回三个金币场，uniqueId 分别为 GM1、GM2 和 GM3；
    fetchPlaygrounds(callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--fetchPlaygrounds", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkplayer.handler.fetchPlaygrounds", {
            appid: 'com.coolgamebox.dtmj'
        }, function(rtn) {
            if (rtn.result == 0) {

            }
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    //     二、获取金币场状态（暂时废弃，第10代替）
    // 说明：获取单个金币场的当前状态，以及用户在这个金币场的状态
    fetchMJPlaygroundStatus(cid, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--fetchMJPlaygroundStatus", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show();
        cc.jsInstance.gamenet.request("pkplayer.handler.fetchMJPlaygroundStatus", {
            cid: cid
        }, function(rtn) {
            if (rtn.result == 0) {

            }
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    //     三、进入金币场
    // 说明：进入金币场时的逻辑判决
    // 检查进入目标金币场所需的入场金币是否足够
    // 已经在其他比赛场进行比赛的玩家禁止进入当前金币场
    // 已经进入目标比赛场进行比赛的玩家禁止重复进入
    // 确认用户进入比赛服的金笔场，预扣金币并更新玩家pinfo上挂的incontest属性
    joinMJPlayground(fid, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--joinMJPlayground", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show("正在加入牌桌中...");
        cc.jsInstance.gamenet.request("pkplayer.handler.joinMJPlayground", {
            fid: fid
        }, function(rtn) {
            if (rtn.result == 0) {

            }
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    //     四、进入组桌状态 
    // 说明：打完一局后选择”离开/下一局“时调用
    continueMJPlayground(fid, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--continueMJPlayground", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show("正在加入牌桌中...");
        cc.jsInstance.gamenet.request("pkplayer.handler.continueMJPlayground", {
            fid: fid
        }, function(rtn) {
            if (rtn.result == 0) {

            }
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    //     五、离开金币场
    // 说明：只有在 空闲/idle 或者  过渡/wait 状态下用户才能主动离开金币场，意味着正在进入房间或在房间里面时不能离开；
    // 注意：为了保证可靠性，建议牌桌打完之后等待1-3秒再调用此接口；原因是room服房间结束后，比赛后需要延后一段时间才能获取到房间结束消息，并更新玩家状态为“wait“
    leaveMJPlayground(fid, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--leaveMJPlayground", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show("离开金币场...");
        cc.jsInstance.gamenet.request("pkplayer.handler.leaveMJPlayground", {
            fid: fid
        }, function(rtn) {
            if (rtn.result == 0) {
                cc.jsInstance.data.incontest = ""; //fid
                cc.jsInstance.data.incontestUniqueId = ""; //GM
            }
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },


    //     六、领取金币补助 New*
    // 路由：pkplayer.handler.receiveSupplementaryCoin
    // 返回结果里 result == 0 是表示领取成功 
    // 如果不确定当前是否能够领取补助，可先调用 pkplayer.handler.getSupplementaryCount 查询当日领取次数
    receiveSupplementaryCoin(callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--receiveSupplementaryCoin", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show("领取补助金币中...");
        cc.jsInstance.gamenet.request("pkplayer.handler.receiveSupplementaryCoin", {}, function(rtn) {
            if (rtn.result == 0) {

            }
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },


    //     七、查询金币补助领取次数 New*
    // 路由：pkplayer.handler.getSupplementaryCount
    getSupplementaryCount(callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--getSupplementaryCount", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show("查询当天领取补助次数...");
        cc.jsInstance.gamenet.request("pkplayer.handler.getSupplementaryCount", {}, function(rtn) {
            if (rtn.result == 0) {

            }
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },


    //     八、分享金币场领取奖励 New*
    // 路由：pkplayer.handler.shareMJPlaygroud
    //  每个20小时领取一次 10000 金币奖励
    shareMJPlaygroud(callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--shareMJPlaygroud", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show("分享成功，领取金币中...");
        cc.jsInstance.gamenet.request("pkplayer.handler.shareMJPlaygroud", {}, function(rtn) {
            if (rtn.result == 0) {

            }
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    // 九、元宝兑换金币
    // 路由：pkplayer.handler.buyCoinBySycee
    // 配置参数在GameCfg.js文件里，参考 dtmj 项目   store_gold_2  store_gold_10  store_gold_20   store_gold_30  store_gold_60  store_gold_100
    // storeInfo  节点
    buyCoinBySycee(store_gold, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--buyCoinBySycee", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show("购买金币中...");
        cc.jsInstance.gamenet.request("pkplayer.handler.buyCoinBySycee", {
            productId: store_gold
        }, function(rtn) {
            if (rtn.result == 0) {

            }
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },

    //     十、获取所有金币场的在线人数
    // 路由：pkplayer.handler.fetchMJAllPlaygroundStatus
    fetchMJAllPlaygroundStatus(callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--fetchMJAllPlaygroundStatus", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.block.show("获取金币场数据中...");
        cc.jsInstance.gamenet.request("pkplayer.handler.fetchMJAllPlaygroundStatus", {
            appid: 'com.coolgamebox.dtmj'
        }, function(rtn) {
            if (rtn.result == 0) {

            }
            cc.jsInstance.block.hide();
            if (callBack) {
                callBack(rtn);
            }
        });
    },



    //根据code获取 session_key等数据
    getSession_key(code, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--getSession_key", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("network");
            return;
        }
        cc.jsInstance.gamenet.request("pkcon.handler.FetchPassportByWechat", {
            code: code,
            gamekind: 1,
            appid: "com.coolgamebox.majiang"
        }, function(rtn) {
            if (callBack) {
                callBack(rtn);
            }
        });

    },


    // https://c.datangyouxi.com/damjxyx/news.json
    // https://c.datangyouxi.com/damjxyx/config.json  
    getconfigs(callBack, err) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var response = xhr.responseText;
                    if (callBack) {
                        callBack(JSON.parse(response));
                    }
                } else {
                    if (err) {
                        err();
                    }
                }
            }
        };

        xhr.onerror = function(event) {
            cc.logManager.error("function getconfigs request error:", event);
            // cc.jsInstance.block.hide();
            if (err) {
                err();
            }
        }
        xhr.open("GET", "https://c.datangyouxi.com/damjxyx/config.json", true); // https://dtmjreplay.dtgames.cn/2018/06/26/354854_1438.txt   https://c.datangyouxi.com/dtmj/news.json
        xhr.send();
    },


    //大厅消息
    getMsg(url, callBack) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--getMsg", );
            cc.jsInstance.block.hide();
            // cc.jsInstance.native.reConnect("network");
            cc.jsInstance.native.reConnect("network getMsg");
            return;
        }
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function() {
            cc.logManager.info(" xhr.readyState：" + xhr.readyState);
            cc.logManager.info(" xhr.State：" + xhr.status);
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var response = xhr.responseText;
                    if (callBack) {
                        cc.logManager.info("获取公告成功！");
                        callBack(JSON.parse(response));
                    }
                }
            }
        };
        xhr.onerror = function(event) {
            cc.logManager.error("获取公告失败：", event);
        }
        xhr.open("GET", url, true); //
        xhr.send();

    },
    //获取微信库信息
    getWXKu(callBack, err) {
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接--network--getWXKu", );
            cc.jsInstance.block.hide();
            // cc.jsInstance.native.reConnect("network");
            cc.jsInstance.native.reConnect("network getWXKu");
            return;
        }
        var self = this;
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var response = xhr.responseText;
                    if (callBack) {
                        callBack(JSON.parse(response));
                    }
                } else {
                    if (err) {
                        err();
                    }
                }
            }
        };

        xhr.onerror = function(event) {
            cc.logManager.error("function getWXKu request error:", event);
            // cc.jsInstance.block.hide();
            if (err) {
                err();
            }
        }
        xhr.open("GET", "https://sxmj.datangyouxi.com/dtmj/android.json", true); // https://dtmjreplay.dtgames.cn/2018/06/26/354854_1438.txt   https://c.datangyouxi.com/dtmj/news.json
        xhr.send();
    },

    SelfUid() {
        return cc.jsInstance.data.pinfo.uid
    },
    seteagflag: function(cpgh) {
        var eatflag = 0;
        eatflag += cpgh[0] > 0 ? 1 : 0;
        eatflag += cpgh[1] > 0 ? 2 : 0;
        eatflag += cpgh[2] > 0 ? 4 : 0;
        eatflag += cpgh[3] > 0 ? 8 : 0;
        this._eatFlag = eatflag;
    },

});