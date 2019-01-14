import ListView, {
    AbsAdapter
} from "ListView";
const ListAdapter = require('club_member_other_adapter');
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
    },

    initData(clubroom) {
        this.node.active = true;
        this.clubroom = clubroom;
        this.members = this.clubroom.clubInfo.members;
        this.init_memberList();
    },

    onLoad() {
        var self = this;
        this.adapter = new ListAdapter();
    },

    close() {
        this.node.active = false;
    },

    init_memberList(clubroom) {
        var self = this;
        if (clubroom) {
            this.clubroom = clubroom;
            this.members = this.clubroom.clubInfo.members;
            this.reOrder = false; //正序
        }
        this.scroll_view.content.removeAllChildren();
        var members = self.sortMember(self.members, self.clubroom.clubInfo.owner, false);
        self.adapter.setDataSet(members);
        self.listView.setAdapter(self.adapter);

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