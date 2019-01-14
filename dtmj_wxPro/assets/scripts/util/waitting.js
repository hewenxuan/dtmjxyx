cc.Class({
    extends: cc.Component,

    properties: {

    },
    start() {

    },

    OpenWaitting(GM, callback) {
        var self = this;
        if (!GM) {
            return;
        }
        if (callback) {
            self.callback = callback;
        }
        self.node.active = true;
        if (GM === "GM1") {
            self.node.getChildByName("title").getComponent(cc.Label).string = "初级场：底分" + cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM1.room.base;
        } else if (GM === "GM2") {
            self.node.getChildByName("title").getComponent(cc.Label).string = "中级场：底分" + cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM2.room.base;
        } else if (GM === "GM3") {
            self.node.getChildByName("title").getComponent(cc.Label).string = "高级场：底分" + cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM3.room.base;
        } else if (GM === "GM4") {
            self.node.getChildByName("title").getComponent(cc.Label).string = "富豪场：底分" + cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM4.room.base;
        }
        cc.jsInstance.vipTable = 0; //保存这个房间号  在金币场里面离开的时候判断有没有，没有说明不在金币场 在匹配的时候=0
        self.time = 30;
        self.schedule(self.scheduleCallback, 1, 30, 0);
    },
    closeWaitting() {
        this.unScheduleCallback();
    },

    closeWaittingUi() {
        var self = this;
        this.unschedule(self.scheduleCallback);
        self.time = 30;
        self.node.getChildByName("wait").getComponent(cc.Label).string = "正在匹配中...(" + (self.time) + "s)";
        self.node.active = false;
    },

    scheduleCallback() {
        var self = this;
        self.time = self.time - 1;

        if (self.time <= 0) {
            self.node.active = false;
            self.unScheduleCallback();
            cc.jsInstance.bayWindow.openBayWindow("未能匹配到合适的对手，请再次尝试！");
            cc.jsInstance.block.hide();
            if (self.callback) {
                self.callback();
            }
        } else {
            self.node.getChildByName("wait").getComponent(cc.Label).string = "正在匹配中...(" + (self.time) + "s)";
        }
    },

    unScheduleCallback() {
        var self = this;
        this.unschedule(this.scheduleCallback);
        self.time = 30;
        var fid = cc.jsInstance.data.incontest;
        if (!fid) {
            fid = cc.jsInstance.data.fid;
        }
        if (!fid) {
            self.node.active = false;
            return;
        }
        self.leave_gold(fid);

    },

    loadLobby: function() {
        // cc.jsInstance.block.show();
        // cc.director.preloadScene("lobby", function() {
        //     cc.loader.onProgress = null;
        //     cc.director.loadScene("lobby");
        //     cc.jsInstance.block.hide();
        // });
        cc.jsInstance.native.skipScene("lobby");
    },


    leave_gold(fid) {
        var self = this;
        if (cc.jsInstance.vipTable && cc.jsInstance.vipTable > 0) {
            cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("已在牌桌内,不能离开！", function() {
                cc.jsInstance.audioManager.playBtnClick(fid);
            });
            return;
        }
        if (!fid) {
            cc.logManager.info("fid====null");
            return;
        }
        cc.jsInstance.network.leaveMJPlayground(fid, function(res) {
            cc.logManager.info("取消匹配:", res);
            self.node.getChildByName("wait").getComponent(cc.Label).string = "正在匹配中...(" + (self.time) + "s)";
            self.node.active = false;
            if (res.result === 0) { //返回大厅
                cc.jsInstance.vipTable = 0;
                if (cc.director.getScene()._name === "play") {
                    self.loadLobby();
                }
            } else {
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("离开失败!", function() {
                    cc.jsInstance.audioManager.playBtnClick(fid);
                    self.leave_gold(fid);
                });
            }
        });
    }

});