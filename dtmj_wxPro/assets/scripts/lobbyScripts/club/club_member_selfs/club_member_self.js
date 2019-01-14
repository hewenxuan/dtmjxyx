import ListView, {
    AbsAdapter
} from "ListView";
const ListAdapterApply = require('club_member_apply_adapter');
const ListAdapterMember = require('club_member_self_adapter');
var Color = {
    WHITE: "#ffffff",
    GRAY: "#7C809D",
    RED: "#7E0C00",
    BLUE: "#1664C3"
};
cc.Class({
    extends: cc.Component,

    properties: {
        listView_apply: {
            default: null,
            type: ListView
        },
        listView_member: {
            default: null,
            type: ListView
        },

        scroll_view_apply: {
            type: cc.ScrollView,
            default: null,
        },
        scroll_view_member: {
            type: cc.ScrollView,
            default: null,
        },
        findEditText: {
            type: cc.EditBox,
            default: null,
        },
        //上面的历史记录父节点
        apply_top: {
            type: cc.Node,
            default: null,
        },
        //上面的日志父节点
        memberList_top: {
            type: cc.Node,
            default: null,
        },
        //主内容的父节点 
        layout: {
            type: cc.Node,
            default: null,
        },
        apply_scro_content: {
            type: cc.Node,
            default: null,
        },
        memberList_scro_content: {
            type: cc.Node,
            default: null,
        },

        setM: {
            type: cc.Node,
            default: null,
        }
    },

    initData(clubroom, isfangzhu) {
        this.clubroom = clubroom;
        this.isfangzhu = isfangzhu;
        this.members = this.clubroom.clubInfo.members;
        this.node.active = true;
        this.reOrder = false; //正序
        this.click_custom("", "apply");
    },
    onLoad() {
        this.adapter_apply = new ListAdapterApply();
        this.adapter_member = new ListAdapterMember();

        this.findEditText.node.on("text-changed", function(t) {
            // cc.logManager.info("文字变动-------", t.detail.string);
            var text = t.detail.string;
            if (text.length > 0) {
                // cc.logManager.info("开始查找-------", text);
                this.findShow(text);
            } else {
                this.findShow();
            }
        }, this);
    },

    init_apply(clubroom) {
        if (!this.bool) {
            this.bool = true;
            // return;
        }
        var self = this;
        if (clubroom) {
            this.clubroom = clubroom;
            this.members = this.clubroom.clubInfo.members;
            this.reOrder = false; //正序
        }
        self.scroll_view_apply.content.removeAllChildren();
        cc.jsInstance.network.getClubApplyList(this.clubroom.clubInfo.id, function(rtn) {
            if (rtn.result === 0) { //获取申请列表成功
                var list = rtn.list;
                if (list.length > 0) {
                    //排序
                    list = self.sortApply(list);
                    if (!self.adapter_apply) {
                        return;
                    }
                    self.adapter_apply.setDataSet(list);
                    self.listView_apply.setAdapter(self.adapter_apply);
                    self.findShow();
                } else {
                    cc.clubjoinlist = 0;
                    self.clubroom.isShowHongdian();
                }
            } else {
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(rtn.msg);
            }
        });
    },

    findApply(list) {

    },

    init_memberList(clubroom) {
        if (this.bool) {
            this.bool = false;
            // return;
        }
        var self = this;
        if (clubroom) {
            this.clubroom = clubroom;
            this.members = this.clubroom.clubInfo.members;
            this.reOrder = false; //正序
        }
        self.scroll_view_member.content.removeAllChildren();
        var members = self.sortMember(self.members, self.clubroom.clubInfo.owner, self.reOrder);
        self.adapter_member.setDataSet(members);
        this.scheduleOnce(function() { //暂时用定时器显示，上面那个正常的会失效，暂时不知道什么原因
            self.listView_member.setAdapter(self.adapter_member);
            self.findShow();
        }, 0);
    },

    //循环看现在有的数据看有没有符合的，不符合的都隐藏
    findShow(text) {
        var content;
        if (this.bool) { //申请列表
            content = this.apply_scro_content;
        } else { //成员列表
            content = this.memberList_scro_content;
        }
        for (var i = 0; i < content.childrenCount; i++) {
            var item = content.children[i];;
            var script;
            if (this.bool) { //申请列表
                script = item.getComponent("club_member_apply_item");
            } else { //成员列表
                script = item.getComponent("club_memberlist_item");
            }
            if (text) {
                var nickname = unescape(script.data.nickname).substr(0, 6);
                var uid = script.data.uid + "";
                if (nickname.indexOf(text) >= 0 || uid.indexOf(text) >= 0) {
                    item.active = true;
                } else {
                    item.active = false;
                }
            } else {
                item.active = true;
            }
        }
    },


    close() {
        this.node.active = false;
    },
    click_custom: function(e, custom) {
        var self = this;
        cc.logManager.info("click:" + custom);
        this.bool = false; // true 选中的是申请列表  false 选中的是成员列表
        this.findEditText.string = "";
        if (custom === "apply") {
            this.bool = true;
            this.apply_top.getChildByName("text").color = cc.hexToColor(Color.WHITE);
            this.memberList_top.getChildByName("text").color = cc.hexToColor(Color.GRAY);
            this.init_apply();
        } else if (custom === "memberList") {
            if (this.isfangzhu) {
                this.setM.opacity = 255;
            } else {
                this.setM.opacity = 0;
            }
            this.bool = false;
            this.apply_top.getChildByName("text").color = cc.hexToColor(Color.GRAY);
            this.memberList_top.getChildByName("text").color = cc.hexToColor(Color.WHITE);
            this.init_memberList();
        }
        this.apply_top.getChildByName("apply_no").active = !this.bool;
        this.apply_top.getChildByName("apply_yes").active = this.bool;
        this.memberList_top.getChildByName("memberList_no").active = this.bool;
        this.memberList_top.getChildByName("memberList_yes").active = !this.bool;

        this.layout.getChildByName("apply_list").active = this.bool;
        this.layout.getChildByName("member_list").active = !this.bool;
    },

    //排序请求列表
    sortApply(list) {
        var data = [];
        for (var i = 0; i < list.length; i++) {
            if (!list[i].status) {
                data.push(list[i]);
            }
        }
        cc.clubjoinlist = data.length;
        this.clubroom.isShowHongdian();
        for (var i = 0; i < list.length; i++) {
            if (list[i].status) {
                data.push(list[i]);
            }
            list[i].club_member_self = this;
        }
        return data;
    },
    //成员列表里面的刷新
    flush_click() {
        var self = this;
        cc.logManager.info("刷新");
        this.findShow();
        this.findEditText.string = "";
        self.reOrder = !self.reOrder;
        this.init_memberList();
    },
    //我
    sortMember(destArray, destOwner, reOrder) {
        var dests = [];
        var manager = [];
        var destsFree = []; //空闲中
        var destsPlaying = []; //游戏中
        var destsZuijin = []; //上次登录时间
        var destsoffline = []; //离线
        //先挑出圈主
        //挑出空闲的
        //挑出游戏中的
        //挑出最近登录的
        //挑出离线的
        for (var i = 0; i < destArray.length; i++) {
            var data = destArray[i];
            if (data.uid === destOwner) {
                dests.push(destArray[i]);
                continue;
            }
            if (data.manager && data.manager === 1) {
                manager.push(destArray[i]);
                continue;
            }
            if (data.online == 0 && data.offline == 0) { //离线
                destsoffline.push(destArray[i]);
            } else if (data.online - data.offline > 0) {
                if (data.ingame && data.ingame.gameid) { //游戏中
                    destsPlaying.push(destArray[i]);
                } else { //空闲中
                    destsFree.push(destArray[i]);
                }
            } else { // 离线  上次登录时间
                destsZuijin.push(destArray[i]);
            }
        }
        Array.prototype.push.apply(dests, manager);
        Array.prototype.push.apply(dests, destsFree); //destsFree 添加到dests里面
        Array.prototype.push.apply(dests, destsPlaying);
        Array.prototype.push.apply(dests, destsZuijin);
        Array.prototype.push.apply(dests, destsoffline);
        if (reOrder) {
            dests.reverse();
        }
        return dests;
    },

});