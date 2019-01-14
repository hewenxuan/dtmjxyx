import ListView, {
    AbsAdapter
} from "ListView";
const ListAdapterHistory = require('club_member_history_adapter');
const ListAdapterLog = require('club_member_text_adapter');
var Color = {
    WHITE: "#ffffff",
    GRAY: "#7C809D",
    GRAY1: "#D5D9E6",
    RED: "#7E0C00",
    BLUE: "#1664C3"
};

cc.Class({
    extends: cc.Component,

    properties: {
        listView_log: {
            default: null,
            type: ListView
        },
        listView_history: {
            default: null,
            type: ListView
        },
        //上面的历史记录父节点
        history_top: {
            type: cc.Node,
            default: null,
        },
        //上面的日志父节点
        log_top: {
            type: cc.Node,
            default: null,
        },
        //主内容的父节点 
        layout: {
            type: cc.Node,
            default: null,
        },
        scroll_view_log: {
            type: cc.ScrollView,
            default: null,
        },
        scroll_view_history: {
            type: cc.ScrollView,
            default: null,
        },
        text_top: {
            type: cc.Node,
            default: null,
        }
    },

    initData(clubroom) {
        this.clubroom = clubroom;
        this.node.active = true;
        this.click_custom("", "history");
    },
    onLoad() {
        this.adapter_log = new ListAdapterLog();
        this.adapter_history = new ListAdapterHistory();
    },

    close() {
        this.node.active = false;
    },

    click_custom: function(e, custom) {
        var self = this;
        cc.logManager.info("click:" + custom);
        this.bool = false; // true 选中的是历史记录仪  false 选中的是日志
        if (custom === "history") {
            this.bool = true;
            this.history_top.getChildByName("text").color = cc.hexToColor(Color.WHITE);
            this.log_top.getChildByName("text").color = cc.hexToColor(Color.GRAY);
            this.init_history();
        } else if (custom === "log") {
            this.bool = false;
            this.history_top.getChildByName("text").color = cc.hexToColor(Color.GRAY);
            this.log_top.getChildByName("text").color = cc.hexToColor(Color.WHITE);
            this.init_log();
        }
        this.history_top.getChildByName("history_no").active = !this.bool;
        this.history_top.getChildByName("history_yes").active = this.bool;
        this.log_top.getChildByName("log_no").active = this.bool;
        this.log_top.getChildByName("log_yes").active = !this.bool;

        this.layout.getChildByName("mengban").active = this.bool;
        this.layout.getChildByName("zj_scrollew").active = this.bool;
        // this.layout.getChildByName("text_scrollew").active = !this.bool;
        this.scroll_view_log.node.parent.active = !this.bool;

        this.text_top.active = !this.bool;
    },

    init_history() {
        var self = this;
        var uid = cc.jsInstance.pinfo.pinfo.uid;
        var club = this.clubroom.clubInfo.id;
        self.scroll_view_history.content.removeAllChildren();
        cc.jsInstance.network.fetchClubLog(uid, club, function(rtn) {
            if (rtn.result === 0) {
                if (rtn.data.length === 0) {
                    return;
                }
                var logs = rtn.data[0].logs;
                if (logs.length > 0) {
                    logs.reverse();
                    self.adapter_history.setDataSet(logs);
                    self.listView_history.setAdapter(self.adapter_history);
                }
            } else {
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(rtn.msg);
            }
        });
    },

    init_log() {
        var self = this;
        this.setTopLogActive(true, false, false);
        self.scroll_view_log.content.removeAllChildren();
        cc.jsInstance.network.getClubLogs(function(rtn) {
            if (rtn.result === 0) {
                var logs = rtn.logs;
                self.log_class(logs);
                // logs.reverse(); //倒序
                if (logs.length > 0) {
                    self.adapter_log.setDataSet(logs);
                    self.listView_log.setAdapter(self.adapter_log);
                }
            } else {
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(rtn.msg);
            }
        });
    },


    //|消息类型|说明|
    // |-|-|
    // |money|兑换或购买房卡
    // |exitClub|退出亲友圈
    // |createClub|创建亲友圈
    // |modify|修改名称
    // |activateClub|完善资料
    // |setClubAssistant|设置助理
    // |removeClubAssistant|取消助理
    // |setClubManager|设置管理员
    // |removeClubManager|取消管理员
    // |kickMember|踢出玩家
    // |sealMember|封禁或解封玩家
    log_class(data) {
        this.all_log = data;
        this.fangka_log = [];
        this.exitclub_log = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].type === "money" || data[i].type === "createClub" || data[i].type === "modify") {
                this.fangka_log.push(data[i]);
            } else if (data[i].type === "exitClub" || data[i].type === "kickMember" || data[i].type === "sealMember") {
                this.exitclub_log.push(data[i]);
            }
        }
    },

    allLog_click() {
        this.setTopLogActive(true, false, false);
        this.scroll_view_log.content.removeAllChildren();
        this.adapter_log.setDataSet(this.all_log);
        this.listView_log.setAdapter(this.adapter_log);
    },

    fangkaLog_click() {
        this.setTopLogActive(false, true, false);
        this.scroll_view_log.content.removeAllChildren();
        this.adapter_log.setDataSet(this.fangka_log);
        this.listView_log.setAdapter(this.adapter_log);
    },

    exitclubLog_click() {
        this.setTopLogActive(false, false, true);
        this.scroll_view_log.content.removeAllChildren();
        this.adapter_log.setDataSet(this.exitclub_log);
        this.listView_log.setAdapter(this.adapter_log);
    },

    setTopLogActive(all, fangka, exitclub) {
        this.text_top.getChildByName("all").getComponent(cc.Sprite).enabled = all;
        this.text_top.getChildByName("fangka").getComponent(cc.Sprite).enabled = fangka;
        this.text_top.getChildByName("exitclub").getComponent(cc.Sprite).enabled = exitclub;

        this.text_top.getChildByName("all").getChildByName("all").color = cc.hexToColor(Color.GRAY1);
        this.text_top.getChildByName("fangka").getChildByName("fangka").color = cc.hexToColor(Color.GRAY1);
        this.text_top.getChildByName("exitclub").getChildByName("exitclub").color = cc.hexToColor(Color.GRAY1);
        if (all) {
            this.text_top.getChildByName("all").getChildByName("all").color = cc.hexToColor(Color.WHITE);
        } else if (fangka) {
            this.text_top.getChildByName("fangka").getChildByName("fangka").color = cc.hexToColor(Color.WHITE);
        } else if (exitclub) {
            this.text_top.getChildByName("exitclub").getChildByName("exitclub").color = cc.hexToColor(Color.WHITE);
        }
    },


});