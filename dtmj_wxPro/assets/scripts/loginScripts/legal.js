cc.Class({
    extends: cc.Component,
    properties: {
    },
    onLoad() {
    },

    start() {

    },

    update(dt) {},
    close() {
        this.node.active = false;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (cc.jsInstance.userInfoBtn) {
                cc.jsInstance.userInfoBtn.show();
            }
        }
    },

    showlegal: function() {
        this.node.active = true;
    },

});