cc.Class({
    extends: cc.Component,
    properties: {},

    //设置大厅消息数量显示
    setmsgnum(ispop, node) {
        var self = this;
        this.type = 1;
        var msgs = cc.sys.localStorage.getItem("message"); //从缓存取
        if (!msgs) {
            return;
        }
        msgs = JSON.parse(msgs);
        // cc.logManager.info("msgs===", msgs);
        var num = 0;
        var data; //是否登录成功 要展示最近一条
        if (msgs) {
            for (var j = 0; j < msgs.length; j++) {
                if (msgs[j].read === 0) {
                    num++;
                    if (num === 1) {
                        if (j === 0) {
                            if (msgs[j].type === "POPUPNEWS" || msgs[j].type === "POPUPNEWSONCE" || msgs[j].type === "PRESSING") { //只弹一次POPUPNEWSONCE:（点关闭按钮可以取消红点，其他情况都得进去点才能取消红点），每次登陆都弹 POPUPNEWS   LISTNEWS,正常
                                data = msgs[j];
                            }
                        }
                    }
                }
            }
            // cc.logManager.info("num===" + num);
            if (num > 0) {
                // if (data) {
                //     num = num - 1;
                // }
                if (num > 0) {
                    if (node) {
                        node.active = true;
                        node.getChildByName("count").getComponent(cc.Label).string = num + "";
                    }
                }
            } else {
                if (node) {
                    node.active = false;
                }
            }
        } else {
            if (node) {
                node.active = false;
            }
        }
        if (!ispop) {
            return;
        }
        if (data) {
            if (data.type === "LISTNEWS") {
                return;
            }
            if (cc.jsInstance.isShowMsgPop && data.type === "POPUPNEWS") { //启动界面和登录界面
                cc.jsInstance.isShowMsgPop = false;
            } else {
                return;
            }
            self.node.active = true;
            cc.jsInstance.native.setScaleAction(self.messageInfo);
            // self.node.getChildByName("bg").getChildByName("messsc").getChildByName("view").getChildByName("content").getChildByName("title").getComponent(cc.Label).string = data.title;
            // self.node.getChildByName("bg").getChildByName("messsc").getChildByName("view").getChildByName("content").getChildByName("con").getComponent(cc.Label).string = data.content;
            if (data.imgUrl && data.imgUrl.length > 0) {
                self.openPic(data.imgUrl);
            } else {
                self.message.open(data.title, data.content);
            }

            if (data.type === "POPUPNEWS" || data.type === "PRESSING") { //只弹一次POPUPNEWSONCE:（点关闭按钮可以取消红点，其他情况都得进去点才能取消红点），每次登陆都弹 POPUPNEWS   LISTNEWS,正常  紧急公告（PRESSING）
                return;
            }

            if (data.type === "POPUPNEWSONCE") { //只弹一次POPUPNEWSONCE:（点关闭按钮可以取消红点，其他情况都得进去点才能取消红点），每次登陆都弹 POPUPNEWS  LISTNEWS,正常  紧急公告（PRESSING）

            }
            var msgs = cc.sys.localStorage.getItem('message'); //从缓存取 替换数据
            msgs = JSON.parse(msgs);
            for (var j = 0; j < msgs.length; j++) {
                if (msgs[j].id === data.id) {
                    msgs[j].read = 1;
                    break;
                }
            }
            cc.sys.localStorage.setItem("message", JSON.stringify(msgs)); //加入缓存

        }
    },

    close() {
        var self = this;
        this.node.active = false;
        cc.jsInstance.audioManager.playBtnClick();
        if (this.type === 2) {
            this.node.parent.getChildByName("message").getComponent("message").setmsg();
        } else {
            cc.jsInstance.globalUtils.send("setMsgNum", {});
        }
    },

    open(title, content) {
        var self = this;
        self.node.getChildByName("bg").getChildByName("pic").active = false;
        self.node.getChildByName("bg").getChildByName("messsc").active = true;
        this.type = 2;
        self.node.getChildByName("bg").getChildByName("messsc").getChildByName("view").getChildByName("content").getChildByName("title").getComponent(cc.Label).string = title;
        self.node.getChildByName("bg").getChildByName("messsc").getChildByName("view").getChildByName("content").getChildByName("con").getComponent(cc.Label).string = content;
    },
    openPic(imgUrl) {
        var self = this;
        self.node.getChildByName("bg").getChildByName("pic").active = true;
        self.node.getChildByName("bg").getChildByName("messsc").active = false;
        self.setPic(imgUrl, self.node.getChildByName("bg").getChildByName("pic"));
    },


    //设置头像
    setPic(imgUrl, node) {
        var self = this;
        this.type = 2;
        cc.loader.load({
            url: imgUrl,
            type: 'jpg',
        }, function(err, ret) {
            if (err) {
                cc.logManager.info("设置图片失败");
                return;
            }
            node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(ret);
        }.bind(this));
    },

    onLoad() {},

    start() {

    },

    // update (dt) {},
});