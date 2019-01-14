cc.Class({
    extends: cc.Component,
    properties: {
    },

    setUserInfo() {
        var self = this;
        if (!cc.jsInstance.pinfo.pinfo) {
            return;
        }
        if (cc.jsInstance.pinfo.pinfo.nickname) {
            this.node.getChildByName("commonUserInfoBg").getChildByName("name").getComponent(cc.Label).string = unescape(cc.jsInstance.pinfo.pinfo.nickname).substr(0, 6);
        } else {
            this.node.getChildByName("commonUserInfoBg").getChildByName("name").getComponent(cc.Label).string = cc.jsInstance.pinfo.pinfo.name;
        }

        if (cc.jsInstance.pinfo.pinfo.headimgurl) {
            cc.loader.load({
                url: cc.jsInstance.pinfo.pinfo.headimgurl,
                type: 'png'
            }, function(err, ret) {
                if (err) {
                    cc.logManager.info("设置图片失败" );
                    return;
                }
                var spriteFrame = new cc.SpriteFrame(ret, cc.Rect(0, 0, ret.width, ret.height));
                self.node.getChildByName("commonUserInfoBg").getChildByName("defaultHeadBg").getChildByName("mask").getChildByName("defaultHeadImg").getComponent(cc.Sprite).spriteFrame = spriteFrame;

            }.bind(this));
        } else {

        }

        this.node.getChildByName("commonUserInfoBg").getChildByName("balance").getChildByName("money").getComponent(cc.Label).string = cc.jsInstance.native.formatMoney(cc.jsInstance.pinfo.pinfo.money);
        this.node.getChildByName("commonUserInfoBg").getChildByName("idLab").getComponent(cc.Label).string = "ID:" + cc.jsInstance.pinfo.pinfo.uid;
        this.node.getChildByName("commonUserInfoBg").getChildByName("ipLab").getComponent(cc.Label).string = "IP:" + cc.jsInstance.pinfo.pinfo.remoteIP;
    },

    close() {
        this.node.active = false;
        cc.jsInstance.audioManager.playBtnClick();
    }
});