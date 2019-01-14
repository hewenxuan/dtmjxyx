cc.Class({
    extends: cc.Component,
    properties: {
    },
    start() {

    },
    close() {
        var self = this;
        self.node.active = false;
        cc.jsInstance.audioManager.playBtnClick();
    },
    click_inviFrend() {
        cc.jsInstance.audioManager.playBtnClick();
        cc.jsInstance.native.wxShareUrl(cc.jsInstance.remoteCfg.wxShareUrl, "大唐麻将", "我在大唐麻将玩的很嗨，快来呦！"); //主动调用分享
    },

    sharedReceive(){

    },

});