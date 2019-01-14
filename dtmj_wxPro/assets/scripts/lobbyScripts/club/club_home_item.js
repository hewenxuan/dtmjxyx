//当前桌子状态
var TABLESTATE = {
    NULL: "0", //空桌子
    WAITTING: "1", //有人加入等待开始
    PLAYING: "2", //正在游戏中
};
cc.Class({
    extends: cc.Component,
    properties: {
        //提示按钮
        tips: {
            type: cc.Node,
            default: null,
        },
        //提示框
        tipsCon: {
            type: cc.Node,
            default: null,
        },
        //提示的文字
        tipsContent: {
            type: cc.Label,
            default: null,
        },
        //底下解散房间
        jiesan: {
            type: cc.Node,
            default: null,
        },
        //底下修改房间
        xiugai: {
            type: cc.Node,
            default: null,
        },
        //不允许修改房间
        noxiugai: {
            type: cc.Node,
            default: null,
        },
        //不能修改里面的已修改
        xiugaiEd: {
            type: cc.Node,
            default: null,
        },
        //剩余局数
        shengyu: {
            type: cc.Node,
            default: null,
        },
        //游戏中 
        playing: {
            type: cc.Node,
            default: null,
        },
        //桌子号
        deskNumCon: {
            type: cc.Label,
            default: null,
        },
        //桌子上加入（桌子人满了后需要隐藏，显示 剩余局数）
        joinNode: {
            type: cc.Node,
            default: null,
        },
        top: {
            type: cc.Node,
            default: null,
        },
        bottom: {
            type: cc.Node,
            default: null,
        },
        left: {
            type: cc.Node,
            default: null,
        },
        right: {
            type: cc.Node,
            default: null,
        },
        //人满了后需要打开遮罩（不能让再点击加入房间）
        zhezhao: {
            type: cc.Node,
            default: null,
        },
        //没有该玩法的时候的遮罩
        nowanfa: {
            type: cc.Node,
            default: null,
        },
        //默认头像
        defaultIcon: {
            type: cc.SpriteFrame,
            default: null,
        },
    },
    onLoad() {
        this.init();
    },
    //初始化ui 和 初始数据
    init() {
        cc.logManager.info("初始化牌桌");
        // this.deskNum = 1; //桌子号
        // this.deskNumCon.string = "- 1 -";
        this.tips.targetOff(this.tips); //移除之前设置的事件
        this.setTipsTouch(this.tips); //设置提示触摸事件

        this.xiugai.active = true;
        this.noxiugai.active = false;
        this.noxiugai.getChildByName("wanfaName").x = 0;
        this.xiugaiEd.active = false;

        this.jiesan.getChildByName("wanfaName").getComponent(cc.Label).string = "未设置玩法"; //有人加入没开局显示
        this.xiugai.getChildByName("wanfaName").getComponent(cc.Label).string = "未设置玩法"; //圈主自己或者允许修改才显示
        this.noxiugai.getChildByName("wanfaName").getComponent(cc.Label).string = "未设置玩法"; //开局后不能修改

        this.jiesan.active = false;

        this.joinNode.active = true;
        this.shengyu.active = false;
        this.playing.active = false;
        this.zhezhao.active = false;
        this.nowanfa.active = false;

        this.top.getChildByName("seat").active = true;
        this.top.getChildByName("head").active = false;
        this.top.getChildByName("head").getChildByName("headLeave").active = false;
        this.bottom.getChildByName("seat").active = true;
        this.bottom.getChildByName("head").active = false;
        this.bottom.getChildByName("head").getChildByName("headLeave").active = false;
        this.left.getChildByName("seat").active = true;
        this.left.getChildByName("head").active = false;
        this.left.getChildByName("head").getChildByName("headLeave").active = false;
        this.right.getChildByName("seat").active = true;
        this.right.getChildByName("head").active = false;
        this.right.getChildByName("head").getChildByName("headLeave").active = false;

        this.top.getChildByName("beiTi").active = false;
        this.bottom.getChildByName("beiTi").active = false;
        this.left.getChildByName("beiTi").active = false;
        this.right.getChildByName("beiTi").active = false;
    },

    setTipsTouch(node) {
        var clubroom = cc.find("Canvas/clubroom").getComponent("clubroom");
        node.on(cc.Node.EventType.TOUCH_START, function(t) {
            //判断桌子号是3的倍数  this.tipsCon.x=50  不是的话 this.tipsCon.x=(this.tipsCon.width+50)*-1
            if (((this.deskNum - 3) % 4 === 0 || this.deskNum % 4 === 0) && clubroom.showAll) {
                this.tipsCon.x = (this.tipsCon.width + 50) * -1;
            } else {
                this.tipsCon.x = 50;
            }
            this.tipsCon.active = true;
        }, this);
        node.on(cc.Node.EventType.TOUCH_END, function(t) {
            this.tipsCon.active = false;
        }, this);
        node.on(cc.Node.EventType.TOUCH_CANCEL, function(t) {
            this.tipsCon.active = false;
        }, this);
    },

    click_custom: function(e, custom) {
        var self = this;
        var clubroom = cc.find("Canvas/clubroom").getComponent("clubroom");
        cc.jsInstance.audioManager.playBtnClick();
        switch (custom) {
            case "join": //加入房间
                if (clubroom.show_wanfaNoUi()) { //未设置玩法
                    return;
                }
                self.join_click();
                return;
            case "jiesan": //解散房间
                 cc.jsInstance.msgpop.showMsg_text_close_nocancle("您确认要解散"+self.deskNum+"号桌的房间吗？",function(){
                     self.jiesan_click();
                 });
                return;
            case "xiugai": //修改房间
                if (clubroom.show_wanfaNoUi("xuigai") && this.isMyClub) { //未设置玩法 自己亲友全弹这个，别人的亲友全 可直接修改
                    return;
                }
                if (clubroom.show_wanfaNoUi("xuigai") && this.isManager) { //未设置玩法 自己亲友全弹这个，别人的亲友全 可直接修改
                    return;
                }
                self.xiugai_click();
                return;
        }
    },

    join_click() {
        var self = this;
        cc.jsInstance.clubShow = true;
        // if (cc.jsInstance.pinfo.vipTable != 0) { //有房间
        //     cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("包厢已经创建，请点击返回游戏", function() {
        //         cc.jsInstance.audioManager.playBtnClick();
        //     });
        //     return;
        // }

        if (cc.jsInstance.data.sData && cc.jsInstance.data.vipTable) {
            cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("包厢已经创建，请点击返回游戏！", function() {
                cc.jsInstance.audioManager.playBtnClick();
            });
            return;
        }

        //加入的时候先判断玩法符不符合小游戏的玩法
        if (this.nowanfa.active) {
            cc.jsInstance.bayWindow.openBayWindow("暂无该玩法，请前往客户端进行游戏");
            return;
        }

        //判断当前有没有房间id 没有创建房间 然后加入房间 有的话直接加入房间
        if (!this.tableInfo.tableid) { //先创建牌桌
            //判断当前亲友圈是不是自己的 判断房卡够不够 clubroom  存在的牌桌不会预扣判断
            var clubroom = cc.find("Canvas/clubroom").getComponent("clubroom");
            if (!clubroom.isCanStart(this.rule.round, this.clubId)) { //判断能不能开局 房卡够不够 不够的话提示
                if (this.isMyClub) {
                    clubroom.myfangka_short();
                    return;
                } else {
                    clubroom.fangka_short();
                    return;
                }
            }
            // {
            //     "round": "round8",
            //     "notJoin": false,
            //     "gameKind": "koudian",
            //     "kd_xg": {
            //         "kd_visible": true,
            //         "kd_SameColor": true,
            //         "kd_zhuohaozi": false,
            //         "kd_fenghaozi": false,
            //         "kd_changeTingGang": false,
            //         "kd_zhuang": false,
            //         "kd_zhuangDouble": false,
            //         "kd_fengzuizi": false,
            //         "circle": false
            //     },
            //     "gameid": "majiang",
            //     "groupid": "197720",
            //     "desktop": 1,
            //     "clubUid": 10000133,
            //     "clubId": "197720",
            //     "isClub": true,
            //     "clubName": "dksv38",
            //     "roomid": ""
            // }
            this.rule.gameid = "majiang";
            this.rule.isClub = true;
            this.rule.roomid = "club";

            this.rule.clubUid = clubroom.clubInfo.owner;
            this.rule.groupid = this.clubId;
            this.rule.desktop = this.deskNum;
            this.rule.clubId = this.clubId;
            this.rule.clubName = clubroom.clubInfo.name;
            // cc.logManager.info("----this.rule-------", this.rule);
            cc.jsInstance.network.CreateVipTableClub(this.rule, function(rtn) {
                if (rtn.result === 0) { //{"result":0,"vipTable":53955741,"msg":"创建成功了!!!!","desktop":1,"roomid":"club","groupid":"197720"}
                    cc.logManager.info("创建牌桌成功！");
                    var tableid = rtn.vipTable;
                    var groupid = rtn.groupid;
                    var desktop = rtn.desktop;
                    self.JoinTable(tableid, groupid, desktop);
                } else {
                    cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("创建失败，请重新尝试！");
                }
            });

        } else { //直接加入牌桌
            var tableid = this.tableInfo.tableid;
            var groupid = this.clubId;
            var desktop = this.deskNum;
            this.JoinTable(tableid, groupid, desktop);
        }
    },

    //加入牌桌{"tableid":53955741,"gameid":"majiang","groupid":"197720","roomid":"club","desktop":1}
    JoinTable(tableid, groupid, desktop) {
        cc.jsInstance.network.JoinGameClub(tableid, groupid, desktop, function(rtn) {
            if (rtn.result === 0) { //加入牌桌成功
                cc.jsInstance.block.show();
                cc.jsInstance.pinfo.vipTable = 1;
                cc.logManager.info("加入牌桌成功！");
            } else {
                if (rtn.result === 39) {
                    cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("该牌桌房间的人数已满");
                } else if (rtn.result === 41) {
                    cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("牌桌不存在");
                } else {
                    cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(rtn.msg);
                }
            }
        });
    },
    jiesan_click() {
        var self = this;
        if (this.tableState === TABLESTATE.PLAYING && this.overtime) { //牌桌内超时

        } else if (this.tableState != TABLESTATE.WAITTING) { //准备阶段才能解散
            return;
        }
        if (this.isMyClub || this.isManager) { //只有圈主才能解散
            cc.jsInstance.network.DestroyClubTable(this.clubId, this.deskNum, function(rtn) {
                if (rtn.result === 0) { //解散成功
                    cc.logManager.info(self.deskNum + "号牌桌解散成功");
                } else {
                    // cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(rtn.msg);
                }
            });
        }
    },
    xiugai_click() {
        //打开玩法设置
        var node = cc.find("Canvas/creatRoomMask");
        node.active = true;
        node.getComponent("createRoomMask").isClub_In(true, false, this.deskNum); //从亲友圈点进去  不是修改所有玩法 当前牌桌号
    },

    //设置数据
    initData(clubId, deskNum, isMyClub, isManager) {
        // this.data = data;
        this.clubId = clubId;
        this.deskNum = deskNum; //桌子号
        this.tableid = "";
        // this.round = round;
        this.tableState = TABLESTATE.NULL; //空桌子
        this.isMyClub = isMyClub; //是不是自己的亲友圈
        this.isManager = isManager;
        this.playerNum = 4; //默认玩家为4个人 后面根据玩法决定几个人
        this.isAlowXiugai = true; //允许修改
        this.wanfa = []; //玩法
        this.players = []; //玩家数据
        this.tableInfo = {}; //牌桌数据  包括玩家牌桌详细信息
        this.deskNumCon.string = "- " + deskNum + " -";
        this.deskNode = []; //桌子节点集合
        this.top.data = {}; //清空凳子上的数据
        this.bottom.data = {};
        this.left.data = {};
        this.right.data = {};
        this.overtime = false; //游戏是否超时20分钟
        this.nowanfaStartGame = false; //不是小程序的玩法游戏开始标志
    },

    //清理牌桌
    cleanDesktop() {
        cc.logManager.info("清理牌桌");
        this.tableState === TABLESTATE.NULL;
        this.jiesan.active = false;
        this.xiugai.active = this.isAlowXiugai;
        this.xiugaiEd.active = false;
        this.noxiugai.getChildByName("wanfaName").x = 0;
        this.noxiugai.active = !this.isAlowXiugai;
        if (this.isMyClub || this.isManager) { //圈主和管理员的话 显示修改
            this.xiugai.active = true;
            this.noxiugai.active = false;
        }

        this.zhezhao.active = false;
        this.joinNode.active = true;
        this.shengyu.active = false;
        this.playing.active = false;
        //根据之前桌子的人数 显示凳子 
        this.setSeatActive(this.playerNum);
        this.players = [];
        this.tableInfo = {}; //桌子详情
        this.deskNode = []; //桌子节点集合

        this.top.getChildByName("beiTi").active = false;
        this.bottom.getChildByName("beiTi").active = false;
        this.left.getChildByName("beiTi").active = false;
        this.right.getChildByName("beiTi").active = false;
        this.top.data = {}; //清空凳子上的数据
        this.bottom.data = {};
        this.left.data = {};
        this.right.data = {};

        this.nowanfaStartGame = false; //不是小程序的玩法游戏开始标志
        this.overtime = false; //游戏是否超时20分钟
    },
    //有人离开牌桌
    leaveDesktop(uid) {
        cc.logManager.info("有人离开牌桌");
        var isHave = false; //有时候有人离开 同一个人会走两遍
        for (var i = 0; i < this.players.length; i++) {
            if (uid === this.players[i].uid) {
                this.players.splice(i, 1);
                isHave = true;
                break;
            }
        }
        if (!isHave) {
            return;
        }
        for (var i = 0; i < this.tableInfo.players.length; i++) {
            if (uid === this.tableInfo.players[i]) {
                this.tableInfo.players.splice(i, 1);
                break;
            }
        }
        if (this.players.length === 0) {
            //直接清楚桌子
            this.tableState = TABLESTATE.NULL; //
            this.cleanDesktop();
            return;
        }
        this.setPlayers(this.players, this.tableInfo);
    },
    //有人进入牌桌
    entryDesktop(member, data) {
        cc.logManager.info("有人加入牌桌");
        for (var i = 0; i < this.players.length; i++) { //有时候有人进来 同一个人会走两遍
            if (data.uid === this.players[i].uid) {
                return;
            }
        }
        this.players.push(member);
        if (!this.tableInfo.players) { //this.tableInfo.players 暂时不用
            this.tableInfo.players = [];
            this.tableInfo.players.push(data.uid);
            this.tableInfo.createPara = data.createPara;
            this.tableInfo.desktop = data.desktop;
            this.tableInfo.tableid = data.tableid;
        } else {
            // this.tableInfo.players.push(data.uid);//加上会报错
        }
        this.setPlayers(this.players, this.tableInfo);
    },


    //设置玩家数据 1-4
    setPlayers(players, tableInfo) {
        this.players = players;
        var startPeopleNum = tableInfo.startPeopleNum; //开始人数，如果开始人数和 players长度一样，为快速开始
        if (tableInfo) {
            this.tableInfo = tableInfo;
            if (tableInfo.uptime) {
                var tickServer = cc.jsInstance.tickServer;
                var sub = tickServer - tableInfo.uptime;
                var date = cc.jsInstance.native.getFormatDate(cc.jsInstance.tickServer); //时间格式化 返回[]
                // cc.logManager.info("---当前服务器时间------", cc.jsInstance.tickServer);
                // cc.logManager.info("---当前服务器时间------", date[0] + "-" + date[1] + "-" + date[2] + " " + date[3] + ":" + date[4] + ":" + date[5]);
                // var date1 = cc.jsInstance.native.getFormatDate(tableInfo.uptime); //时间格式化 返回[]
                // cc.logManager.info("---牌桌游戏开始时间------", tableInfo.uptime);
                // cc.logManager.info("---牌桌游戏开始时间------", date1[0] + "-" + date1[1] + "-" + date1[2] + " " + date1[3] + ":" + date1[4] + ":" + date1[5]);
                // cc.logManager.info("---相差时间------", sub);
                if (sub >= 18 * 60 * 1000) { //牌桌超过18分钟，房主的话要显示解散房间 18 * 60 * 1000
                    this.overtime = true;
                } else if (sub < 0) { //服务时间没更新
                    cc.jsInstance.native.tickServer(); //获取服务器时间
                }
            }
        }
        this.tableState = TABLESTATE.WAITTING; //等待状态
        this.jiesan.active = false;
        this.xiugai.active = false;
        this.noxiugai.active = false;
        if (this.isMyClub || this.isManager) {
            this.jiesan.active = true;
        } else {
            this.noxiugai.active = true;
        }

        if (players.length === tableInfo.startPeopleNum) { //快速开始
            this.setSeatActive(tableInfo.startPeopleNum);
            switch (startPeopleNum) {
                case 2: //右 右
                    this.set2PlayerData(players);
                    break;
                case 3:
                    this.set3PlayerData(players);
                    break;
                case 4:
                    this.set4PlayerData(players);
                    break;
            }
        } else {
            switch (this.playerNum) {
                case 2: //右 右
                    this.set2PlayerData(players);
                    break;
                case 3:
                    this.set3PlayerData(players);
                    break;
                case 4:
                    this.set4PlayerData(players);
                    break;
            }
        }
    },


    // {
    //     "uid": 713510,
    //     "headimgurl": "http://thirdwx.qlogo.cn/mmopen/vi_32/9KBexE8cX9fiaq1k3AIGbxMZpCicRFCQUXfnlS63wRyaziam10uAP9T6v0SS51mHntic6sJZLTXZ1Fklic3YKjxhHXQ/132",
    //     "nickname": "%u4E09%u5341%u4E8C%u4E09%u5341%u4E8C",
    //     "ingame": {
    //         "gameid": "majiang",
    //         "locked": true,
    //         "roomid": "club",
    //         "groupid": "286651",
    //         "desktop": 1,
    //         "server": "pkroom0003"
    //     },
    //     "online": 1537433525631,
    //     "offline": 1537433295916,
    //     "entryTime": 1537433534001,
    //     "session": {
    //         "sid": 102,
    //         "fid": "pkcon0000"
    //     },
    //     "leaveTime": 1537433229534
    // },

    //设置两人玩法的玩家数据  左右
    set2PlayerData(players) {
        //删除掉数据不全的项
        // for (var i = 0; i < this.players.length; i++) { //有时候有人进来 同一个人会走两遍
        //     if (!this.players[i].uid) {
        //         this.players.splice(i, 1);
        //     }
        // }
        this.left.getChildByName("seat").active = true;
        this.left.getChildByName("head").active = false;
        this.right.getChildByName("seat").active = true;
        this.right.getChildByName("head").active = false;
        if (players.length === 1) {
            this.setSeatData(this.right, players[0]);
        } else if (players.length === 2) {
            this.setSeatData(this.right, players[0]);
            this.setSeatData(this.left, players[1]);
            this.setStatePlaying();
        }
    },

    //设置3人玩法的玩家数据  右上左
    set3PlayerData(players) {
        // for (var i = 0; i < this.players.length; i++) { //有时候有人进来 同一个人会走两遍
        //     if (!this.players[i].uid) {
        //         this.players.splice(i, 1);
        //     }
        // }
        this.left.getChildByName("seat").active = true;
        this.left.getChildByName("head").active = false;
        this.right.getChildByName("seat").active = true;
        this.right.getChildByName("head").active = false;
        this.top.getChildByName("seat").active = true;
        this.top.getChildByName("head").active = false;
        if (players.length === 1) {
            this.setSeatData(this.right, players[0]);
        } else if (players.length === 2) {
            this.setSeatData(this.right, players[0]);
            this.setSeatData(this.top, players[1]);
            if (this.tableInfo.startPeopleNum && this.tableInfo.startPeopleNum === players.length) {
                this.setStatePlaying();
            }
            //不是小程序的玩法游戏开始
            if (this.nowanfaStartGame && this.nowanfa.active) {
                this.setStatePlaying();
            }
        } else if (players.length === 3) {
            this.setSeatData(this.right, players[0]);
            this.setSeatData(this.top, players[1]);
            this.setSeatData(this.left, players[2]);
            this.setStatePlaying();
        }
    },

    //设置4人玩法的玩家数据
    set4PlayerData(players) {
        // for (var i = 0; i < this.players.length; i++) { //有时候有人进来 同一个人会走两遍
        //     if (!this.players[i].uid) {
        //         this.players.splice(i, 1);
        //     }
        // }
        this.left.getChildByName("seat").active = true;
        this.left.getChildByName("head").active = false;
        this.right.getChildByName("seat").active = true;
        this.right.getChildByName("head").active = false;
        this.top.getChildByName("seat").active = true;
        this.top.getChildByName("head").active = false;
        this.bottom.getChildByName("seat").active = true;
        this.bottom.getChildByName("head").active = false;
        if (players.length === 1) {
            this.setSeatData(this.right, players[0]);
        } else if (players.length === 2) {
            this.setSeatData(this.right, players[0]);
            this.setSeatData(this.top, players[1]);
            if (this.tableInfo.startPeopleNum && this.tableInfo.startPeopleNum === players.length) {
                this.setStatePlaying();
            }
            //不是小程序的玩法游戏开始
            if (this.nowanfaStartGame && this.nowanfa.active) {
                this.setStatePlaying();
            }
        } else if (players.length === 3) {
            this.setSeatData(this.right, players[0]);
            this.setSeatData(this.top, players[1]);
            this.setSeatData(this.left, players[2]);
            if (this.tableInfo.startPeopleNum && this.tableInfo.startPeopleNum === players.length) {
                this.setStatePlaying();
            }
            //不是小程序的玩法游戏开始
            if (this.nowanfaStartGame && this.nowanfa.active) {
                this.setStatePlaying();
            }
        } else if (players.length === 4) {
            this.setSeatData(this.right, players[0]);
            this.setSeatData(this.top, players[1]);
            this.setSeatData(this.left, players[2]);
            this.setSeatData(this.bottom, players[3]);
            this.setStatePlaying();
        }
    },
    //设置凳子数据
    setSeatData(node, data) {
        this.deskNode.push(node);
        node.data = data;
        node.getChildByName("seat").active = false;
        node.getChildByName("head").active = true;
        //如果被踢 名字不显示 显示凳子和被踢的图片
        var clubroom = cc.find("Canvas/clubroom").getComponent("clubroom");
        if (clubroom.isMember(data.uid) === false) { //判断这个用户在不在亲友圈内
            node.getChildByName("head").active = false;
            node.getChildByName("seat").active = true;
            node.getChildByName("beiTi").active = true;
            return;
        }
        node.getChildByName("head").getChildByName("name").getComponent(cc.Label).string = unescape(data.nickname).substr(0, 6);
        if (data.headimgurl) {
            cc.jsInstance.native.setHeadIcon(node.getChildByName("head").getChildByName("playhead"), data.headimgurl); //公用设置头像方法
        } else {
            node.getChildByName("head").getChildByName("playhead").getComponent(cc.Sprite).spriteFrame = this.defaultIcon;
        }
        if (data.online == 0 && data.offline == 0) { //离线 
            node.getChildByName("head").getChildByName("headLeave").active = true;
        } else if (data.online - data.offline > 0) {
            node.getChildByName("head").getChildByName("headLeave").active = false;
            if (data.ingame && data.ingame.gameid) { //游戏中
            } else { //空闲中
            }
        } else { // 离线 上次登录时间
            node.getChildByName("head").getChildByName("headLeave").active = true;
        }
    },
    //检查 桌子中有没有这个成员 没有，显示被踢字样
    isHaveMember(uid) {
        this.isHaveMemberDesk(this.top, uid);
        this.isHaveMemberDesk(this.bottom, uid);
        this.isHaveMemberDesk(this.left, uid);
        this.isHaveMemberDesk(this.right, uid);
    },

    //这个凳子上坐的是不是这个人
    isHaveMemberDesk(node, uid) {
        if (node.data && node.data.uid === uid) {
            node.getChildByName("head").active = false;
            node.getChildByName("seat").active = true;
            node.getChildByName("beiTi").active = true;
        }
    },

    //开始游戏
    setStatePlaying() {
        this.tableState = TABLESTATE.PLAYING; //游戏中
        this.jiesan.active = false; //自己亲友圈
        this.noxiugai.active = true; //别人亲友圈显示不允许修改
        //显示游戏开始的遮罩
        this.zhezhao.active = true;
        this.joinNode.active = false;
        if (this.overtime && (this.isMyClub || this.isManager)) { //这个桌子游戏超时20分钟 房主有权解散房间
            this.jiesan.active = true; //自己亲友圈
            this.noxiugai.active = false; //别人亲友圈显示不允许修改
            this.xiugai.active = false;
        }
        // this.shengyu.active = true;
        //根据 this.wanfa[1] 1圈或者 几局决定显示
        if (this.tableInfo.currentRound && this.tableInfo.currentRound < 0) {
            this.setShengyu(0, "圈");
        } else if (this.tableInfo.currentRound) {
            this.setShengyu(this.tableInfo.currentRound - 1, "局");
        }
        // else {
        //     this.setShengyu(this.tableInfo.createPara.round - 1, "局");
        // }
    },
    //设置剩余局数 单位 data 推送过来的数据
    setShengyu(num, unit, data) {
        this.tableState = TABLESTATE.PLAYING; //游戏中
        this.setYixiugaiActive(false); //隐藏已修改
        //根据 this.wanfa[1] 1圈或者 几局决定显示
        //如果是圈的话 客户端显示 黄色游戏中 字 ，不显示上剩余几圈
        if (unit === "圈") {
            this.shengyu.active = false;
            this.playing.active = true;
        } else {
            this.shengyu.active = true;
            this.playing.active = false;
            this.shengyu.getComponent(cc.Label).string = "剩余" + num + unit;
        }
        if (this.nowanfa.active) { //不支持该玩法 显示不支持该玩法，但是一开局，要隐藏修改
            // this.tableState = TABLESTATE.PLAYING; //游戏中
            // this.jiesan.active = false; //自己亲友圈
            // this.noxiugai.active = true; //别人亲友圈显示不允许修改
            this.nowanfaStartGame = true; //不是小程序的玩法游戏开始了
        }
        //快速开局
        if (data && data.startPeopleNum && data.startPeopleNum === this.players.length) {
            cc.logManager.info(data.startPeopleNum + "人快速开局");
            this.setSeatActive(data.startPeopleNum);
            switch (data.startPeopleNum) {
                case 2: //右 右
                    this.set2PlayerData(this.players);
                    break;
                case 3:
                    this.set3PlayerData(this.players);
                    break;
                case 4:
                    this.set4PlayerData(this.players);
                    break;
            }
        }
    },

    //是否允许修改玩法
    isAlowXiugaiWanfa(bool) {
        if (this.tableState === TABLESTATE.NULL) {
            this.isAlowXiugai = bool;
            if (this.isMyClub) {
                this.xiugai.active = this.isMyClub;
                this.noxiugai.active = !this.isMyClub;
            } else {
                this.xiugai.active = bool;
                this.noxiugai.active = !bool;
            }
            this.jiesan.active = false;
            if (this.isManager) {
                this.xiugai.active = this.isManager;
                this.noxiugai.active = !this.isManager;
            }
        }
    },


    // leavePlayer(data) {
    //     this.top.getChildByName("head").getChildByName("headLeave").active = true;
    // },

    //玩家状态的发生变化
    ChangeDeskMemberStatus(member, isOnline) {
        cc.logManager.info("亲友圈牌桌" + this.deskNum + " 成员状态改变");
        if (this.deskNode && this.deskNode.length > 0) {
            for (var i = 0; i < this.deskNode.length; i++) {
                if (this.deskNode[i].data.uid === member.uid) {
                    this.deskNode[i].getChildByName("head").getChildByName("headLeave").active = !isOnline;
                    break;
                }
            }
        }
    },

    //修改玩法 玩法[] 玩法内容str  wanfa[0]代表玩法中文名
    xiugaiWanfa(wanfa, wanfaCon, rule) {
        this.rule = rule;
        this.wanfa = wanfa;
        //已经开局或者 有人加入房间暂时不能修改，等房间 解散完成后才可以修改
        if (this.tableState === TABLESTATE.PLAYING || this.tableState === TABLESTATE.WAITTING) {
            return;
        }
        var wanfaTemp = wanfa[0];
        if (wanfa[0].indexOf("推倒胡") >= 0 && wanfa[0] != "二人推倒胡") { //wanfa[0]  推倒胡 平胡 大胡
            wanfa[0] = "推倒胡";
        }
        var wanfas = wanfa[0].split(" 已修改")[0];
        switch (wanfas) { //wanfa[0]
            case "推倒胡":
                wanfa[0] = wanfaTemp;
                this.playerNum = 4;
                this.nowanfa.active = false;
                break;
            case "二人推倒胡":
                this.playerNum = 2;
                this.nowanfa.active = false;
                break;
            case "拐三角":
                this.playerNum = 3;
                this.nowanfa.active = false;
                break;
            case "抠点":
                this.playerNum = 4;
                this.nowanfa.active = false;
                break;
            case "二人抠点":
                this.playerNum = 2;
                this.nowanfa.active = false;
                break;
            case "经典斗地主":
                this.playerNum = 3;
                this.nowanfa.active = false;
                break;
            case "晋中":
                this.playerNum = 4;
                this.nowanfa.active = false;
                break;
            case "跑得快":
                this.playerNum = 3;
                this.nowanfa.active = false;
                break;
            default: //不知道玩法名字，默认4个  牌桌遮住
                this.playerNum = 4;
                this.nowanfa.active = true;
                break;
        }
        this.setWanfaText(wanfa[0], wanfaCon);
        this.cleanDesktop();
    },
    //根据 人数设置凳子显示状态
    setSeatActive(num) { //top, bottom, left, right, 
        this.top.getChildByName("seat").active = true;
        this.top.getChildByName("head").active = false;
        this.top.data = {};
        this.top.getChildByName("head").getChildByName("headLeave").active = false;
        this.bottom.getChildByName("seat").active = true;
        this.bottom.getChildByName("head").active = false;
        this.bottom.getChildByName("head").getChildByName("headLeave").active = false;
        this.bottom.data = {};
        this.left.getChildByName("seat").active = true;
        this.left.getChildByName("head").active = false;
        this.left.getChildByName("head").getChildByName("headLeave").active = false;
        this.left.data = {};
        this.right.getChildByName("seat").active = true;
        this.right.getChildByName("head").active = false;
        this.right.getChildByName("head").getChildByName("headLeave").active = false;
        this.right.data = {};
        if (num === 3) { //this.playerNum 桌子人数   startPeopleNum 快速开始桌子
            this.bottom.getChildByName("seat").active = false;
        }
        if (num === 2) {
            this.top.getChildByName("seat").active = false;
            this.bottom.getChildByName("seat").active = false;
        }
    },

    //设置玩法文字
    setWanfaText(wanfaName, wanfaCon) {
        var self = this;
        self.jiesan.getChildByName("wanfaName").getComponent(cc.Label).string = wanfaName; //有人加入没开局显示
        self.xiugai.getChildByName("wanfaName").getComponent(cc.Label).string = wanfaName; //圈主自己或者允许修改才显示
        self.noxiugai.getChildByName("wanfaName").getComponent(cc.Label).string = wanfaName; //开局后不能修改
        self.tipsContent.string = wanfaCon;
    },

    setYixiugaiActive(isshow) {
        var self = this;
        if (this.tableState === TABLESTATE.PLAYING) {
            isshow = false; //隐藏已修改
        }
        if (isshow) {
            // this.noxiugai.getChildByName("wanfaName").x = -31;
            this.scheduleOnce(function() { //暂时用定时器显示，上面那个正常的会失效，暂时不知道什么原因
                this.noxiugai.getChildByName("wanfaName").x = -31;
            }, 0);
        } else {
            // this.noxiugai.getChildByName("wanfaName").x = 0;
            this.scheduleOnce(function() { //暂时用定时器显示，上面那个正常的会失效，暂时不知道什么原因
                this.noxiugai.getChildByName("wanfaName").x = 0;
            }, 0);
        }
        // this.xiugaiEd.active = isshow;
        this.scheduleOnce(function() { //暂时用定时器显示，上面那个正常的会失效，暂时不知道什么原因
            self.xiugaiEd.active = isshow;
        }, 0);
    },
});