import ListView, {
    AbsAdapter
} from "ListView";
const ListAdapter = require('ListLogsAdapter');

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


    onLoad() {
        cc.logManager.info("初始化适配器");
        this.content = this.scroll_view.content;
        cc.jsInstance.listlogs = this;
        this.adapter = new ListAdapter();
    },

    getPlaylog() {
        var self = this;
        cc.logManager.info("获取战绩");
        this.playlogUiNum = 1;
        this.content.removeAllChildren(); //移除之前的数据
        cc.jsInstance.network.getLog(function(rtn) {
            cc.logManager.info("战绩");
            if (rtn.result == 0) {
                if (!rtn.playLog.logs) {
                    self.node.getChildByName("bg").getChildByName("hint1").active = true;
                    return;
                }
                rtn.playLog.logs.reverse();
                self.adapter.setDataSet(rtn.playLog.logs);
                self.listView.setAdapter(self.adapter);
            }
        });
    },


    //查看战绩的详情  获取详情的url  和上个界面传来的数据 
    getPlaylogDetailsInfo(finalStr, data) {
        var self = this;
        cc.logManager.info("finalStr=" + finalStr);
        cc.logManager.info("点击详情传过来的而数据=" + JSON.stringify(data));
        cc.jsInstance.network.getloginfo(finalStr, function(msg) { //获取对战成绩详情
            cc.logManager.info("战绩详情", msg);
            self.playlogUiNum = 2;
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
                self.setPlaylogDetails(playLogIfoArry, data);
            }
        }, this);
    },

    setPlaylogDetails(playLogIfoArry, data) {
        this.playlogUiNum = 2;
        var self = this;
        self.value_set = [];
        this.content.removeAllChildren(); //移除之前的数据
        for (var i = playLogIfoArry.length - 1; i >= 0; i--) {
            for (var j = 0; j < playLogIfoArry[i].length; j++) {
                if (playLogIfoArry[i][j] == "roundEnd" || playLogIfoArry[i][j] == "roundEndDDZ") {
                    var data1 = JSON.parse(JSON.stringify(data)); //
                    data1.num = i + 1;
                    if (data1.players.length >= 2) {
                        data1.players[0].winone = playLogIfoArry[i][j + 1].players[data.players[0].uid].winone;
                        data1.players[1].winone = playLogIfoArry[i][j + 1].players[data.players[1].uid].winone;
                    }
                    if (data1.players.length >= 3) {
                        data1.players[2].winone = playLogIfoArry[i][j + 1].players[data.players[2].uid].winone;
                    }
                    if (data1.players.length >= 4) {
                        data1.players[3].winone = playLogIfoArry[i][j + 1].players[data.players[3].uid].winone;
                    }
                    data1.callbackData = playLogIfoArry[i]; //回放数据
                    self.value_set.push(data1);
                }
            }
        }
        // self.value_set.reverse();
        cc.logManager.info("value_set", self.value_set);
        self.adapter.setDataSet(self.value_set);
        self.listView.setAdapter(self.adapter);
    },


    close() {
        if (this.playlogUiNum === 2) {
            this.playlogUiNum = 1;
            this.getPlaylog();
        } else {
            this.node.active = false;
        }
        cc.jsInstance.audioManager.playBtnClick();
    },

    update: function(dt) {
        if (this.playlogUiNum && this.playlogUiNum === 1) {
            this.node.getChildByName("bg").getChildByName("hint").active = true;
        } else {
            this.node.getChildByName("bg").getChildByName("hint").active = false;
        }
    },

});