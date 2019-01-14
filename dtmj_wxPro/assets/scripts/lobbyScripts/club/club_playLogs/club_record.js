import ListView, {
    AbsAdapter
} from "ListView";
const ListAdapter = require('club_playlogitem_info_adapter');
var Color = {
    WHITE: "#ffffff",
    GRAY: "#7C809D",
    RED: "#7E0C00",
    BLUE: "#1664C3"
};
cc.Class({ //我的战绩页面
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

    onLoad() {
        this.adapter = new ListAdapter();
    },
    close() {
        this.node.active = false;
    },

    initData(playLogIfoArry, data) {
        // cc.logManager.info("点击详情传过来的数据=", data);
        var self = this;
        this.data = data;
        self.setData(playLogIfoArry, data);
    },

    setData(playLogIfoArry, data) {
        var self = this;
        self.scroll_view.content.removeAllChildren();
        playLogIfoArry.reverse(); //反转数组
        for (var i = 0; i < playLogIfoArry.length; i++) {
            playLogIfoArry[i].num = playLogIfoArry.length - i;
            playLogIfoArry[i].data = data;
        }
        self.adapter.setDataSet(playLogIfoArry);
        self.listView.setAdapter(self.adapter);
    },



});