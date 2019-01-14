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
        //桌子号
        tableID: {
            type: cc.Label,
            default: null,
        },
        //桌子号
        table_num: {
            type: cc.Label,
            default: null,
        },
        //局数
        jushu: {
            type: cc.Label,
            default: null,
        },
        //消耗房卡数
        fangka: {
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
    },

    onLoad() {

    },
    // {
    //     "ownerid": 10000133,
    //     "now": "2018-09-21 17:52:53",
    //     "tableid": "80265053",
    //     "money": 0,
    //     "logid": "pkroom0003_tuidaohu2_1537522933825",
    //     "gamename": "tuidaohu2",
    //     "players": [{
    //         "uid": 711876,
    //         "winall": 0,
    //         "coin": 0,
    //         "nickname": "%u8D3A%u6587%u8F69",
    //         "money": 2095331,
    //         "headimgurl": "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLbgAIgXrkB4rBlzIFkGQVQxX2AsExBZbYCfFXRia8hFpg47lb2kxuh1PGcyoib1q8hFqRInIsaA9Gg/132"
    //     }, {
    //         "uid": 7638893,
    //         "winall": 0,
    //         "coin": 0,
    //         "nickname": "IyyZrEX6",
    //         "money": 99840,
    //         "headimgurl": ""
    //     }],
    //     "clubMoney": 11038,
    //     "round": 8,
    //     "isCircle": "false",
    //     "desktop": 3,
    //     "isClubFree": "false"
    // }
    //绑定数据
    initData(data) {
        this.data = data;
        // cc.logManager.info("绑定传过来的数据到ui=", JSON.stringify(data));
        var str = data.now.split(" "); //2018-09-13 14:00:00
        this.date.string = str[0];
        this.time.string = str[1];
        this.tableID.string = data.tableid;
        this.table_num.string = data.desktop + "号牌桌";
        if (data.isCircle != "false" && data.round === 1) {
            this.jushu.string = "1圈";
        } else {
            this.jushu.string = data.round + "局";
        }
        this.fangka.string = "-" + data.money + "房卡";
        this.setPlayerUI(data.players.length); //一共有几个玩家
        if (data.players.length >= 2) {
            this.player1.getComponent(cc.Label).string = unescape(data.players[0].nickname).substr(0, 6) + "(" + data.players[0].uid + ")";
            this.setScore(this.score1, data.players[0].winall);
            this.player2.getComponent(cc.Label).string = unescape(data.players[1].nickname).substr(0, 6) + "(" + data.players[1].uid + ")";
            this.setScore(this.score2, data.players[1].winall);
        }
        if (data.players.length >= 3) {
            this.player3.getComponent(cc.Label).string = unescape(data.players[2].nickname).substr(0, 6) + "(" + data.players[2].uid + ")";
            this.setScore(this.score3, data.players[2].winall);
        }
        if (data.players.length === 4) {
            this.player4.getComponent(cc.Label).string = unescape(data.players[3].nickname).substr(0, 6) + "(" + data.players[3].uid + ")";
            this.setScore(this.score4, data.players[3].winall);
        }
    },

    setScore(node, score) {
        if (score >= 0) {
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


    //点击详情
    click_info() {
        var self = this;
        var now = this.data.now;
        var tableid = this.data.tableid;
        var DOMAIN = "https://dtmjreplay.dtgames.cn/";
        var pass = now.substr(0, 4) + "/" + now.substr(5, 2) + "/" + now.substr(8, 2) + "/";
        var logTxtId = tableid + "_" + now.substr(11, 2) + now.substr(14, 2);
        var finalStr = DOMAIN + pass + logTxtId + ".txt";

        cc.jsInstance.network.getloginfo(finalStr, function(msg) { //获取对战成绩详情
            cc.logManager.info("战绩详情");
            var playLogIfoArry = []; //回放的时候用这里面的数据
            var arry = [];
            arry[0] = [];
            var j = 0;
            for (var i = 0; i < msg.length; i++) {
                arry[j].push(msg[i]);
                if (msg[i] == "roundEnd" || msg[i] == "roundEndDDZ") {
                    arry[j].push(msg[i + 1]);
                    playLogIfoArry.push(arry[j]);
                    i++;
                    j++;
                    arry[j] = [];
                    arry[j].push(msg[0]);
                    arry[j].push(msg[1]);
                } else if (i == msg.length - 1) {
                    if (msg[i - 1] && msg[i - 1] == "MJLogLew") { //lew 排除掉日志
                    } else {
                        playLogIfoArry.push(arry[j]);
                    }
                }
            }
            if (msg) {
                if (playLogIfoArry.length > 0) {
                    // self.setData(playLogIfoArry, data);
                    self.club_record = cc.find("Canvas/clubroom/bg/club_record"); //进入我的战绩界面
                    self.club_record.active = true;
                    self.club_record.getComponent("club_record").initData(playLogIfoArry, self.data);
                }
            }
        });
    },

});