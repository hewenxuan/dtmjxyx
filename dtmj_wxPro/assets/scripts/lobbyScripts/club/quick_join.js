cc.Class({
    extends: cc.Component,

    properties: {
        //即将加入“文轩的亲友圈” 1号桌
        con: {
            type: cc.Label,
            default: null,
        },
        //倒计时
        time: {
            type: cc.Label,
            default: null,
        },
        //规则
        guize: {
            type: cc.Label,
            default: null,
        },
        //未开局  开局背景节点
        bg_node: {
            type: cc.Sprite,
            default: null,
        },
        //未开局背景
        bg_red: {
            type: cc.SpriteFrame,
            default: null,
        },
        //开局背景
        bg_gray: {
            type: cc.SpriteFrame,
            default: null,
        },
        player1: {
            type: cc.Node,
            default: null,
        },
        player2: {
            type: cc.Node,
            default: null,
        },
        player3: {
            type: cc.Node,
            default: null,
        },
        player4: {
            type: cc.Node,
            default: null,
        },
        //有人凳子背景
        bg_desk_yes: {
            type: cc.SpriteFrame,
            default: null,
        },
        //没人凳子背景
        bg_desk_no: {
            type: cc.SpriteFrame,
            default: null,
        },
        //确定按钮
        queding: {
            type: cc.Node,
            default: null,
        },
        //换桌按钮
        huanzhuo: {
            type: cc.Node,
            default: null,
        },
        //默认头像
        defaultIcon: {
            type: cc.SpriteFrame,
            default: null,
        },
    },



    onLoad() {},

    initData(TableData, clubroom) { // 桌子数据 
        this.tableData = TableData;
        this.clubroom = clubroom;
        this.node.active = true;

        cc.logManager.info("TableData=", TableData);
        cc.logManager.info("clubroom=", clubroom);
        if (!this.timestr || this.timestr === 0 || this.timestr === 8) {
            this.init();
            this.timestr = 8;
            this.unScheduleCallback();
            this.schedule(this.scheduleCallback, 1, 8, 0);
        }

        this.guize.string = "规则：" + this.tableData.wanfa.join(",") + "。";

        this.con.string = "即将加入 “" + unescape(clubroom.clubInfo.name) + "的亲友圈 ”" + TableData.deskNum + "号桌";


        if (this.tableData.playerNum) { //this.tableData.tableInfo.startPeopleNum
            this.setplayerShow(this.tableData.playerNum, true);
        } else {
            this.setplayerShow(this.tableData.playerNum, true);
        }

        if (this.tableData.players.length >= 1) {
            for (var j = 0; j < this.tableData.players.length; j++) { //踢出掉没用的信息
                if (!this.tableData.players[j].uid) {
                    for (var z = 0; z < this.tableData.players.length; z++) {
                        if (z != j && this.tableData.players[j] === this.tableData.players[z].uid) {
                            this.tableData.players.splice(j, 1);
                            break;
                        }
                    }
                }
            }
            this.setPlayData(this.player1, false, this.tableData.players[0]);
        }
        if (this.tableData.players.length >= 2) {
            this.setPlayData(this.player2, false, this.tableData.players[1]);
        }
        if (this.tableData.players.length >= 3) {
            this.setPlayData(this.player3, false, this.tableData.players[2]);
        }
        if (this.tableData.players.length >= 4) {
            this.setPlayData(this.player4, false, this.tableData.players[3]);
        }

        if (this.tableData.tableState === "2") { //游戏中
            this.unScheduleCallback();
            this.time.string = "已开局";
            this.queding.active = false;
            this.huanzhuo.active = true;
            this.bg_node.spriteFrame = this.bg_gray;
        } else if (this.tableData.tableState === "0") { //桌子没人了
            this.bg_node.spriteFrame = this.bg_red;
            this.queding.active = true;
            this.huanzhuo.active = false;

            if (!this.timestr || this.timestr === 0 || this.timestr === 8) {
                this.timestr = 8;
                this.unScheduleCallback();
                this.schedule(this.scheduleCallback, 1, 8, 0);
            }
        }
    },

    getDeskTop() {
        return this.tableData.deskNum;
    },

    //有人加入有人退出  开局 掉线处理
    changeData(TableData) {
        this.tableData = TableData;
        cc.logManager.info("TableData=", TableData);
        if (this.tableData.playerNum) { //this.tableData.tableInfo.startPeopleNum
            this.setplayerShow(this.tableData.playerNum, true);
        } else {
            this.setplayerShow(this.tableData.playerNum, true);
        }

        if (this.tableData.players.length >= 1) {
            if (this.tableData.players[0].uid) {
                this.setPlayData(this.player1, false, this.tableData.players[0]);
            }
        }
        if (this.tableData.players.length >= 2) {
            if (this.tableData.players[1].uid) {
                this.setPlayData(this.player2, false, this.tableData.players[1]);
            }
        }
        if (this.tableData.players.length >= 3) {
            if (this.tableData.players[2].uid) {
                this.setPlayData(this.player3, false, this.tableData.players[2]);
            }
        }
        if (this.tableData.players.length >= 4) {
            if (this.tableData.players[3].uid) {
                this.setPlayData(this.player4, false, this.tableData.players[3]);
            }
        }
        if (this.tableData.tableState === "2") { //游戏中
            this.unScheduleCallback();
            this.time.string = "已开局";
            this.queding.active = false;
            this.huanzhuo.active = true;
            this.bg_node.spriteFrame = this.bg_gray;
        } else if (this.tableData.tableState === "0") { //桌子没人了
            this.bg_node.spriteFrame = this.bg_red;
            this.queding.active = true;
            this.huanzhuo.active = false;

            if (!this.timestr || this.timestr === 0 || this.timestr === 8) {
                this.timestr = 8;
                this.unScheduleCallback();
                this.schedule(this.scheduleCallback, 1, 8, 0);
            }
        }
    },


    scheduleCallback() {
        var self = this;
        self.timestr = self.timestr - 1;
        if (self.timestr === 0) {
            self.click_queding();
            self.unScheduleCallback();
            // self.timestr = 17; //测试为了不让自动加入房间 写完删掉
        } else {
            this.time.string = self.timestr + "s";
        }
    },
    //停止倒计时
    unScheduleCallback() {
        var self = this;
        this.unschedule(this.scheduleCallback);
        self.timestr = 8;
    },


    init() {
        this.time.string = 8 + "s"; //开一个倒计时  开始了改为已开局
        this.guize.string = "规则：未设置规则。";
        this.con.string = "即将加入 “亲友圈” 1号桌";
        this.queding.active = true;
        this.huanzhuo.active = false;
        this.bg_node.spriteFrame = this.bg_red;
        this.setplayerShow(4, true); //初始化玩家数据
    },
    //初始化玩家数据
    setplayerShow(num, isdefault) {
        this.player1.active = false;
        this.player2.active = false;
        this.player3.active = false;
        this.player4.active = false;
        if (num >= 2) {
            this.setPlayData(this.player1, isdefault);
            this.setPlayData(this.player2, isdefault);
        }
        if (num >= 3) {
            this.setPlayData(this.player3, isdefault);
        }
        if (num >= 4) {
            this.setPlayData(this.player4, isdefault);
        }
    },
    //设置玩家数据 isdefault(是否是初始化数据)
    setPlayData(node, isdefault, data) {
        node.active = true;
        if (isdefault) {
            node.getChildByName("head").getChildByName("playhead").getComponent(cc.Sprite).spriteFrame = this.defaultIcon;
            node.getChildByName("head").getChildByName("headLeave").active = false;
            node.getChildByName("head").getChildByName("name").getComponent(cc.Label).string = "昵称";
            node.getChildByName("head").active = false;
            node.getComponent(cc.Sprite).spriteFrame = this.bg_desk_no;
            node.data = {};
        } else {
            node.getChildByName("head").active = true;
            node.getComponent(cc.Sprite).spriteFrame = this.bg_desk_yes;
            if (!data.uid || !this.clubroom.isMember(data.uid)) { //如果这个成员被踢除了亲友圈，名字显示被踢，头像显示默认头像
                node.getChildByName("head").getChildByName("name").getComponent(cc.Label).string = "被踢";
                node.getChildByName("head").getChildByName("playhead").getComponent(cc.Sprite).spriteFrame = this.defaultIcon;
                return;
            }

            node.data = data;
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
        }
    },

    //当前桌子是不是有这个人
    isHaveMember(uid) {
        if (!this.tableData || !this.tableData.players || this.tableData.players.length === 0) {
            return false;
        }
        for (var j = 0; j < this.tableData.players.length; j++) { //踢出掉没用的信息
            if (this.tableData.players[j].uid && this.tableData.players[j].uid === uid) {
                return true;
            }
        }
        return false;
    },

    click_queding() {
        this.node.active = false;
        this.unScheduleCallback();
        this.tableData.join_click();
    },

    click_huanzhuo() {
        this.node.active = false;
        this.clubroom.quick_click();
    },

    click_close() {
        this.node.active = false;
        this.unScheduleCallback();
    },


});