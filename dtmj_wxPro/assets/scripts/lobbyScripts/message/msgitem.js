cc.Class({
    extends: cc.Component,

    properties: {
        title: {
            type: cc.Label,
            default: null,
        },
        infor: {
            type: cc.Label,
            default: null,
        },
        no_read: {
            type: cc.Node,
            default: null,
        },

    },

    // LIFE-CYCLE CALLBACKS:

    initData(data) {
        this.data = data;
        this.messageInfo = data.messageInfo;
        // msg[i].read=false;
        this.title.string = data.title;
        this.infor.string = data.infor;
        if (data.read === 0) {
            this.no_read.active = true;
        } else {
            this.no_read.active = false;
        }
    },

    btn_click() {
        var self = this;
        cc.jsInstance.audioManager.playBtnClick();
        self.messageInfo.active = true;
        cc.jsInstance.native.setScaleAction(self.messageInfo);
        if (this.data.imgUrl && this.data.imgUrl.length > 0) {
            self.messageInfo.getComponent("messageInfo").openPic(this.data.imgUrl);
        } else {
            self.messageInfo.getComponent("messageInfo").open(this.data.title, this.data.content);
        }
        var msgs = cc.sys.localStorage.getItem('message'); //从缓存取 替换数据
        msgs = JSON.parse(msgs);
        for (var j = 0; j < msgs.length; j++) {
            if (msgs[j].id === this.data.id) {
                msgs[j].read = 1;
                break;
            }
        }
        cc.sys.localStorage.setItem("message", JSON.stringify(msgs)); //加入缓存
    },
});