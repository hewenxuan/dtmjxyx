import ListView, {
    AbsAdapter
} from "ListView";
const ListAdapter = require('club_rank_info_adapter');
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
    // {
    //     "_id": "5bade801bae06e549fb0e347",
    //     "clubid": 197720,
    //     "dayid": 20180928,
    //     "uid": 10000133,
    //     "logs": [{
    //         "tableid": "42572991",
    //         "now": "2018-09-28 16:36:17",
    //         "ownerid": 10000133,
    //         "ownername": "dksv38",
    //         "gamename": "happyDDZ",
    //         "score": 6,
    //         "finch": 1,
    //         "finchtotal": 2,
    //         "round": 8
    //     }]
    // }
    initData(data, clubroom) {
        // cc.logManager.info("点击详情传过来的数据=", JSON.stringify(data));
        this.node.active = true;
        this.clubroom = clubroom;
        if (data && data.logs) {
            this.data = data;
            this.init_rank_info(data.logs.reverse());
        } else {
            this.init_rank_info(0);
        }
    },
    onLoad() {
        this.adapter = new ListAdapter();
    },

    close() {
        this.node.active = false;
    },

    init_rank_info(logs) {
        var self = this;
        self.scroll_view.content.removeAllChildren();
        if (logs.length > 0) {
            self.adapter.setDataSet(logs);
            self.listView.setAdapter(self.adapter);
        }
    },
});