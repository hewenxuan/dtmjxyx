import ListView, {
    AbsAdapter
} from "ListView";
const ListAdapter = require('message_adapter');
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
        messageInfo: {
            type: cc.Node,
            default: null,
        },
    },

    //获取消息 https://c.datangyouxi.com/dtmj/news.json
    setmsg() {
        var self = this;
        var msg = cc.sys.localStorage.getItem("message"); //从缓存取
        if (!msg) {
            self.scroll_view.content.removeAllChildren(); //移除之前的数据
            return;
        }
        msg = JSON.parse(msg);
        if (msg && msg.length > 0) {
            self.scroll_view.content.removeAllChildren(); //移除之前的数据
            for (var i = 0; i < msg.length; i++) {
                msg[i].messageInfo = self.messageInfo;
            }
            self.adapter.setDataSet(msg);
            self.listView.setAdapter(self.adapter);
        } else {
            return;
        }
    },

    close() {
        var self = this;
        self.node.active = false;
        cc.jsInstance.audioManager.playBtnClick();
        cc.jsInstance.globalUtils.send("setMsgNum", {});
    },
    onLoad() {
        this.adapter = new ListAdapter();
    },

    start() {},


});