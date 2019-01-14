cc.Class({
    extends: cc.Component,
    properties: {},

    close() {
        var self = this;
        self.node.active = false;
        cc.jsInstance.audioManager.playBtnClick();
    },

    click_downLoad(e,custom) {
        cc.jsInstance.audioManager.playBtnClick();
        var url = "";
        switch (custom) {
            case "dtddz":
                url = cc.jsInstance.remoteCfg.dtddz;
                break;
            case "hnmj":
                url = cc.jsInstance.remoteCfg.hnmj;
                break;
            case "hbmj":
                url = cc.jsInstance.remoteCfg.hbmj;
                break;
            case "nmmj":
                url = cc.jsInstance.remoteCfg.nmmj;
                break;
        }
        if (url === "") {
            url = cc.jsInstance.remoteCfg.dtddz;
        }
        cc.jsInstance.native.openURL(url);
    }
});