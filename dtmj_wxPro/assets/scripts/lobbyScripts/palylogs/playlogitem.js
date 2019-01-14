var Color = {
    WHITE: "#ffffff",
    GRAY: "#7C809D",
    RED: "#7E0C00", //负分
    BLUE: "#1664C3" //正分
};
cc.Class({
    extends: cc.Component,

    properties: {
        //日期
        date: {
            type: cc.Label,
            default: null,
        },
        //时间
        time: {
            type: cc.Label,
            default: null,
        },
        //房间号
        tableID: {
            type: cc.Label,
            default: null,
        },
        //局数
        jushu: {
            type: cc.Label,
            default: null,
        },
        //房主
        fangzhu: {
            type: cc.Label,
            default: null,
        },
        //桌子号
        desktop: {
            type: cc.Label,
            default: null,
        },
        //玩家1
        player1: {
            type: cc.Node,
            default: null,
        },
        //玩家1分数
        score1: {
            type: cc.Node,
            default: null,
        },
        //玩家2
        player2: {
            type: cc.Node,
            default: null,
        },
        //玩家2分数
        score2: {
            type: cc.Node,
            default: null,
        },
        //玩家3
        player3: {
            type: cc.Node,
            default: null,
        },
        //玩家3分数
        score3: {
            type: cc.Node,
            default: null,
        },
        //玩家4
        player4: {
            type: cc.Node,
            default: null,
        },
        //玩家4分数
        score4: {
            type: cc.Node,
            default: null,
        },
        infobtn: {
            type: cc.Node,
            default: null,
        },
        callbackbtn: {
            type: cc.Node,
            default: null,
        },
    },


    onLoad() {},
    // {
    //     "owner": 20000074,
    //     "money": 1,
    //     "round": 1,
    //     "isCoin": "true",
    //     "now": "2018-11-06 11:12:37",
    //     "tableid": "412522",
    //     "logid": "pkroom0001_tuidaohu2_1541473851196",
    //     "players": [{
    //         "uid": 20000074,
    //         "winall": 9,
    //         "nickname": "dn1lzk",
    //         "money": 123461
    //     }, {
    //         "uid": 20000081,
    //         "winall": -9,
    //         "nickname": "9ymb3b",
    //         "money": 9
    //     }],
    //     "isClubFree": "false",
    //     "extraStr": "{\"place\":\"tuidaohu2\"}",
    //     "createPara": {
    //         "ruleName": "tuidaohu2"
    //     },
    //     "isCircle": "false",
    //     "fid": "false"
    // }

    //绑定数据 playlogUiNum =1 战绩第一个页面  2第二个页面
    // initData(palylogs, data, playlogUiNum) {
    //     this.palylogs = palylogs;
    //     this.data = data;
    //     // cc.logManager.info("绑定传过来的数据到ui=", JSON.stringify(data));
    //     this.setData(data, playlogUiNum);
    // },

    initData(data) {
        this.palylogs = cc.jsInstance.listlogs;
        var playlogUiNum = this.palylogs.playlogUiNum
        this.data = data;
        // cc.logManager.info("绑定传过来的数据到ui=", JSON.stringify(data));
        this.setData(data, playlogUiNum);
    },

    setData(data, playlogUiNum) {
        var str = data.now.split(" "); //2018-09-13 14:00:00
        this.date.string = str[0];
        this.time.string = str[1];
        this.tableID.string = data.tableid;
        if (playlogUiNum === 1) { //第一个战绩页面
            this.infobtn.active = true;
            this.callbackbtn.active = false;
            this.jushu.node.active = false;
        } else { //第二个战绩页面
            this.infobtn.active = false;
            this.callbackbtn.active = false;//暂时没有回放那个的功能，有了改为true
            this.jushu.node.active = true;
            this.jushu.string = "第" + data.num + "局"; //详情里才有
            this.callbackData = data.callbackData; //回放数据
        }

        //判断是不是亲友圈不的战绩
        this.desktop.node.active = false;
        if (data.createPara && data.createPara.clubName) { //亲友圈
            this.desktop.node.active = true;
            this.fangzhu.string = unescape(data.createPara.clubName).substr(0, 6);
            this.desktop.string = "(亲友圈 " + data.createPara.desktop + "号桌)";
        } else { //普通桌
            for (var j = 0; j < data.players.length; j++) { //房主名字
                if (data.owner === data.players[j].uid) {
                    this.fangzhu.string = unescape(data.players[j].nickname).substr(0, 6);
                    break;
                }
            }
        }
        this.setPlayerUI(data.players.length); //一共有几个玩家
        if (data.players.length >= 2) {
            this.player1.getComponent(cc.Label).string = unescape(data.players[0].nickname).substr(0, 6);
            this.player2.getComponent(cc.Label).string = unescape(data.players[1].nickname).substr(0, 6);
            if (playlogUiNum === 1) {
                this.setScore(this.score1, data.players[0].winall);
                this.setScore(this.score2, data.players[1].winall);
            } else {
                this.setScore(this.score1, data.players[0].winone);
                this.setScore(this.score2, data.players[1].winone);
            }

        }
        if (data.players.length >= 3) {
            this.player3.getComponent(cc.Label).string = unescape(data.players[2].nickname).substr(0, 6);
            if (playlogUiNum === 1) {
                this.setScore(this.score3, data.players[2].winall);
            } else {
                this.setScore(this.score3, data.players[2].winone);
            }

        }
        if (data.players.length >= 4) {
            this.player4.getComponent(cc.Label).string = unescape(data.players[3].nickname).substr(0, 6);
            if (playlogUiNum === 1) {
                this.setScore(this.score4, data.players[3].winall);
            } else {
                this.setScore(this.score4, data.players[3].winone);
            }
        }

    },

    setScore(node, score) {
        if (score <= 0) {
            node.color = cc.hexToColor(Color.RED);
        } else {
            node.color = cc.hexToColor(Color.BLUE);
        }
        node.getComponent(cc.Label).string = score + "";
    },
    //一共有几个玩家
    setPlayerUI(num) {
        this.player1.active = true;
        this.score1.active = true;
        this.player2.active = true;
        this.score2.active = true;
        this.player3.active = false;
        this.score3.active = false;
        this.player4.active = false;
        this.score4.active = false;
        if (num >= 3) {
            this.player3.active = true;
            this.score3.active = true;
        }
        if (num >= 4) {
            this.player4.active = true;
            this.score4.active = true;
        }
    },


    //回放
    callBack_click() {
        cc.logManager.info("回放", this.callbackData);
    },

    info_click() {
        cc.logManager.info("详情");
        var now = this.data.now;
        var tableid = this.data.tableid;
        var data = this.data;
        var DOMAIN = "https://dtmjreplay.dtgames.cn/";
        var pass = now.substr(0, 4) + "/" + now.substr(5, 2) + "/" + now.substr(8, 2) + "/";
        var logTxtId = tableid + "_" + now.substr(11, 2) + now.substr(14, 2);
        var finalStr = DOMAIN + pass + logTxtId + ".txt";
        //获取palylogs脚本 调用脚本 getPlaylogDetailsInfo获取详情
        this.palylogs.playlogUiNum = 2;
        this.palylogs.getPlaylogDetailsInfo(finalStr, this.data);
    },

});