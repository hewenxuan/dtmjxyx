var Color = {
    WHITE: "#ffffff",
    GRAY: "#7C809D",
    RED: "#7E0C00",
    BLUE: "#1664C3"
};

import ListView, {
    AbsAdapter
} from "ListView";
const ListAdapter = require('club_rank_adapter');
cc.Class({
    extends: cc.Component,

    properties: {
        listView: {
            default: null,
            type: ListView
        },
        scroll_view: {
            type: cc.ScrollView,
            default: null,
        },
        //今天
        today_top: {
            type: cc.Node,
            default: null,
        },
        //昨天
        yesterday_top: {
            type: cc.Node,
            default: null,
        },
        //自己下面的item
        club_rank_myself: {
            type: cc.Node,
            default: null,
        },
        //默认头像
        defaultIcon: {
            type: cc.SpriteFrame,
            default: null,
        }

    },
    initData(clubroom) {
        this.node.active = true;
        this.clubroom = clubroom;
        this.click_custom("", "today");

        this.today_top.getChildByName("text").getComponent(cc.Label).string = this.getTodayStr();
        this.yesterday_top.getChildByName("text").getComponent(cc.Label).string = this.getYesterdayStr();
    },
    onLoad() {
        this.adapter = new ListAdapter();
    },


    // "self": {
    //   "uid": 7638893,
    //   "field": 0,
    //   "score": 0,
    //   "finch": 0,
    //   "nickname": "IyyZrEX6",
    //   "headimgurl": ""
    // }
    //设置自己的数据
    setSelfData(data) {
        this.selfData = data; //自己的数据存起来
        this.club_rank_myself.getChildByName("name").getComponent(cc.Label).string = unescape(data.nickname).substr(0, 6);
        this.club_rank_myself.getChildByName("id").getComponent(cc.Label).string = data.uid;
        this.setScore(this.club_rank_myself.getChildByName("fen"), data.score);
        this.club_rank_myself.getChildByName("changshu").getComponent(cc.Label).string = data.field;
        this.club_rank_myself.getChildByName("queshen").getComponent(cc.Label).string = data.finch;
        if (data.headimgurl) {
            cc.jsInstance.native.setHeadIcon(this.club_rank_myself.getChildByName("head").getChildByName("playhead"), data.headimgurl); //公用设置头像方法
        } else {
            this.club_rank_myself.getChildByName("head").getChildByName("playhead").getComponent(cc.Sprite).spriteFrame = this.defaultIcon;
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

    getTodayStr() {
        var todayStr;
        var myDate = new Date();
        var today_month = myDate.getMonth() + 1;
        if (today_month < 10) {
            today_month = "0" + today_month;
        }
        var today_day = myDate.getDate();
        if (today_day < 10) {
            today_day = "0" + today_day;
        }
        todayStr = "今天 " + today_month + "-" + today_day;
        return todayStr;
    },
    getYesterdayStr() {
        var yesterdayStr;
        var myDate = new Date();
        var myDate1 = new Date()
        myDate1.setDate(myDate.getDate() - 1); //比今天时间减一天
        var yesterday_month = myDate1.getMonth() + 1;
        if (yesterday_month < 10) {
            yesterday_month = "0" + yesterday_month;
        }
        var yesterday_day = myDate1.getDate();
        if (yesterday_day < 10) {
            yesterday_day = "0" + yesterday_day;
        }
        yesterdayStr = "昨天 " + yesterday_month + "-" + yesterday_day;
        return yesterdayStr;
    },

    close() {
        this.node.active = false;
    },
    click_custom: function(e, custom) {
        var self = this;
        cc.logManager.info("click:" + custom);
        var bool = false; // true 选中的是申请列表  false 选中的是成员列表
        if (custom === "today") {
            bool = true;
            this.today_top.getChildByName("text").color = cc.hexToColor(Color.WHITE);
            this.yesterday_top.getChildByName("text").color = cc.hexToColor(Color.GRAY);
            // this.init_today();
            this.type = 1;
            this.getRank();
        } else if (custom === "yesterday") {
            bool = false;
            this.today_top.getChildByName("text").color = cc.hexToColor(Color.GRAY);
            this.yesterday_top.getChildByName("text").color = cc.hexToColor(Color.WHITE);
            // this.init_yesterday();
            this.type = 2;
            this.getRank();
        }
        this.today_top.getChildByName("today_no").active = !bool;
        this.today_top.getChildByName("today_yes").active = bool;
        this.yesterday_top.getChildByName("yesterday_no").active = bool;
        this.yesterday_top.getChildByName("yesterday_yes").active = !bool;

    },

    // 俱乐部排行榜 type 1 今天   2 昨天  
    getRank() {
        var self = this;
        if (!this.clubroom || !this.clubroom.clubInfo || !this.clubroom.clubInfo.id) {
            return;
        }
        cc.jsInstance.network.fetchClubRecords(self.type, this.clubroom.clubInfo.id, function(rtn) {
            // cc.logManager.info("获取排行榜：", JSON.stringify(rtn.data));
            if (rtn.result === 0) { //获取申请列表成功
                var rank = rtn.data.rank;
                self.scroll_view.content.removeAllChildren();
                if (rank.length > 0) {
                    for (var i = 0; i < rank.length; i++) {
                        rank[i].club_rank = self;
                    }
                    self.adapter.setDataSet(rank);
                    self.listView.setAdapter(self.adapter);
                }
                //设置自己的数据
                var selfRank = rtn.data.self;

                self.setMySelfData(rtn.data);
            } else {
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(rtn.msg);
            }
        });
    },

    // "self": {
    //   "uid": 7638893,
    //   "field": 0,
    //   "score": 0,
    //   "finch": 0,
    //   "nickname": "IyyZrEX6",
    //   "headimgurl": ""
    // }
    setMySelfData(data) {
        var selfRank = {};
        if (this.clubroom.isMyClub) {
            selfRank = data.self;
        } else if (this.clubroom.mamager) {
            var rank = data.rank;
            if (rank.length > 0) {
                for (var i = 0; i < rank.length; i++) {
                    if (rank[i].uid === cc.jsInstance.data.pinfo.uid + "") {
                        selfRank = rank[i];
                        break;
                    }
                }
            }
            if (!selfRank.uid) {
                selfRank.uid = cc.jsInstance.data.pinfo.uid;
                selfRank.score = 0;
                selfRank.field = 0;
                selfRank.finch = 0;

                if (cc.jsInstance.data.pinfo.nickname) {
                    selfRank.nickname = cc.jsInstance.data.pinfo.nickname;
                } else {
                    selfRank.nickname = cc.jsInstance.data.pinfo.name;
                }
                if (cc.jsInstance.data.pinfo.headimgurl) {
                    selfRank.headimgurl = cc.jsInstance.data.pinfo.headimgurl;
                }

            }
        } else {
            selfRank = data.self;
        }
        this.setSelfData(selfRank);
    },

    //点击详情 自己的详情
    click_info() {
        var self = this;
        cc.jsInstance.network.fetchMemberRecords(self.type, this.clubroom.clubInfo.id, this.selfData.uid, function(rtn) {
            cc.logManager.info("获取排行榜详情");
            if (rtn.result === 0) { //获取详情成功
                self.club_rank_info = cc.find("Canvas/clubroom/bg/club_rank_info"); //进入我的战绩界面
                self.club_rank_info.getComponent("club_rank_info").initData(rtn.data, self.clubroom);
            } else {
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(rtn.msg);
            }
        });
    },
});