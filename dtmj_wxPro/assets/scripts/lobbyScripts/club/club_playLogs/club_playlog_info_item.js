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
        desktop: {
            type: cc.Node,
            default: null,
        },
    },

    onLoad() {},

    start() {

    },
    //绑定数据
    initData(playLogIfoData) {
        this.playLogIfoData = playLogIfoData; //回放数据
        this.num = playLogIfoData.num;
        // cc.logManager.info("绑定传过来的数据到ui=", JSON.stringify(data));
        this.setData(playLogIfoData, playLogIfoData.data);
    },
    // initData(playLogIfoData, num, data) {
    //     this.playLogIfoData = playLogIfoData; //回放数据
    //     this.num = num;
    //     // cc.logManager.info("绑定传过来的数据到ui=", JSON.stringify(data));
    //     this.setData(playLogIfoData, data);
    // },

    setData(playLogIfoData, data) {
        if (playLogIfoData.length <= 0) {
            return;
        }
        var str = data.now.split(" "); //2018-09-13 14:00:00
        this.date.string = str[0];
        this.time.string = str[1];
        this.tableID.string = data.tableid;
        this.jushu.string = "第" + this.num + "局";
        this.desktop.string = "(亲友圈 " + data.desktop + "号桌)";
        this.setPlayerUI(data.players.length); //一共有几个玩家

        if (data.players.length >= 2) {
            this.player1.getComponent(cc.Label).string = unescape(data.players[0].nickname).substr(0, 6);
            this.player2.getComponent(cc.Label).string = unescape(data.players[1].nickname).substr(0, 6);
        }
        if (data.players.length >= 3) {
            this.player3.getComponent(cc.Label).string = unescape(data.players[2].nickname).substr(0, 6);
        }
        if (data.players.length >= 4) {
            this.player4.getComponent(cc.Label).string = unescape(data.players[3].nickname).substr(0, 6);
        }
        for (var i = 0; i < playLogIfoData.length; i++) {
            if (playLogIfoData[i] == "roundEnd" || playLogIfoData[i] == "roundEndDDZ") {
                this.fangzhu.string = unescape(playLogIfoData[i + 1].createPara.clubName).substr(0, 6);
                if (data.players.length >= 2 && playLogIfoData[i + 1].players[data.players[0].uid]) {
                    this.setScore(this.score1, playLogIfoData[i + 1].players[data.players[0].uid].winone);
                }
                if (data.players.length >= 2 && playLogIfoData[i + 1].players[data.players[1].uid]) {
                    this.setScore(this.score2, playLogIfoData[i + 1].players[data.players[1].uid].winone);
                }
                if (data.players.length >= 3 && playLogIfoData[i + 1].players[data.players[2].uid]) {
                    this.setScore(this.score3, playLogIfoData[i + 1].players[data.players[2].uid].winone);
                }
                if (data.players.length >= 4 && playLogIfoData[i + 1].players[data.players[3].uid]) {
                    this.setScore(this.score4, playLogIfoData[i + 1].players[data.players[3].uid].winone);
                }
                return;
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
        // cc.logManager.info("回放",this.playLogIfoData);
        cc.logManager.info("回放");
    },


});