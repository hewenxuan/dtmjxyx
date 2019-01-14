cc.Class({
    extends: cc.Component,
    properties: {
        musicNode: {
            type: cc.Node,
            default: null,
        },
        effectNode: {
            type: cc.Node,
            default: null,
        },
    },

    onLoad() {
        var t = cc.sys.localStorage.getItem("bgmVolume");
        if (t != null) {
            // cc.logManager.info("当前背景音乐音量：" + t);
            this.musicNode.getChildByName("precent").width = 450 * t;
            this.musicNode.getComponent(cc.Slider).progress = t;
        } else {
            // cc.logManager.info("当前背景音乐音量：" + 1);
            this.musicNode.getChildByName("precent").width = 450;
            this.musicNode.getComponent(cc.Slider).progress = 1;
        }
        var t = cc.sys.localStorage.getItem("sfxVolume");
        if (t != null) {
            this.effectNode.getChildByName("precent").width = 450 * t;
            // cc.logManager.info("当前音效音量：" + t);
            this.effectNode.getComponent(cc.Slider).progress = t;
        } else {
            // cc.logManager.info("当前音效音量：" + 1);
            this.effectNode.getChildByName("precent").width = 450;
            this.effectNode.getComponent(cc.Slider).progress = 1;
        }

    },

    start() {
        // this.musicNodeFunc();
        // this.effectNodeFunc();
    },

    musicNodeFunc: function() {
        this.setSliderPrecent(this.musicNode);
    },

    effectNodeFunc: function() {
        this.setSliderPrecent(this.effectNode);
    },

    setSliderPrecent: function(node) {
        var progressSp = node.getChildByName("precent");
        progressSp.width = node.width * node.getComponent(cc.Slider).progress;
        if ("musicNode" === node.name) {
            cc.jsInstance.audioManager.setBGMVolume(Math.round(progressSp.width / 450 * 10) / 10);
        } else {
            cc.jsInstance.audioManager.setSFXVolume(Math.round(progressSp.width / 450 * 10) / 10);
        }
    },


    close() {
        this.node.active = false;
        cc.jsInstance.audioManager.playBtnClick();
    },
    exitGame() {
        this.node.active = false;
        cc.jsInstance.audioManager.playBtnClick();
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.exitMiniProgram();
        } else {
            cc.jsInstance.block.show("退出登录中...");
            cc.jsInstance.network.logout(function(rtn) {
                cc.logManager.info("退出登录" + JSON.stringify(rtn));
                if (rtn.result == 0) {
                    cc.director.preloadScene("login", function() {
                        cc.loader.onProgress = null;
                        cc.jsInstance.block.hide();
                        // cc.sys.localStorage.clear();//清理缓存用，
                        cc.sys.localStorage.setItem("wxloginData", 0); //加入缓存
                        // cc.jsInstance.mail = "";
                        // cc.jsInstance.code = "";
                        cc.jsInstance.exit = true;
                        cc.director.loadScene("login");
                    });
                }
            });
        }

    }

});