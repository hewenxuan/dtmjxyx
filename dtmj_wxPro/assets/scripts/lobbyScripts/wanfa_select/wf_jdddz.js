//经典斗地主
cc.Class({
    extends: cc.Component,
    properties: {
        count1one: {
            type: cc.Toggle,
            default: null,
        },
        count4one: {
            type: cc.Toggle,
            default: null,
        },
        count8one: {
            type: cc.Toggle,
            default: null,
        },

        sanzhaone: {
            type: cc.Toggle,
            default: null,
        },
        sizhaone: {
            type: cc.Toggle,
            default: null,
        },
        wuzhaone: {
            type: cc.Toggle,
            default: null,
        },
        wuxianzhaone: {
            type: cc.Toggle,
            default: null,
        },

    },

    onLoad() {
        var self = this;
        if (!cc.jsInstance.CreatRoomParam) {
            var CreatRoomParam = require("CreatRoomParam");
            cc.jsInstance.CreatRoomParam = (new CreatRoomParam()).getParams();
            cc.logManager.info("-----初始化创建房间参数------", cc.jsInstance.CreatRoomParam);
        }

        if (cc.jsInstance.CreatRoomParam.jdddzparam.round === "round1") {
            self.setCountCheck(true, false, false);
        } else if (cc.jsInstance.CreatRoomParam.jdddzparam.round === "round4") {
            self.setCountCheck(false, true, false);
        } else {
            self.setCountCheck(false, false, true);
        }
        if (cc.jsInstance.CreatRoomParam.jdddzparam.gameXg.bombLime === "3") {
            self.setZhaisCheck(true, false, false, false);
        } else if (cc.jsInstance.CreatRoomParam.jdddzparam.gameXg.bombLime === "4") {
            self.setZhaisCheck(false, true, false, false);
        } else if (cc.jsInstance.CreatRoomParam.jdddzparam.gameXg.bombLime === "5") {
            self.setZhaisCheck(false, false, true, false);
        } else if (cc.jsInstance.CreatRoomParam.jdddzparam.gameXg.bombLime === "100") {
            self.setZhaisCheck(false, false, false, true);
        }

    },

    clickToggle: function(e, custom) {
        var self = this;
        cc.logManager.info("click:" + custom);
        cc.jsInstance.audioManager.playBtnClick();
        switch (custom) {
            case "count1one":
                var ischeck = self.count1one.isChecked;
                if (!ischeck) {
                    self.count1one.isChecked = true;
                    break;
                }
                self.setCountCheck(ischeck, !ischeck, !ischeck);
                break;
            case "count4one":
                var ischeck = self.count4one.isChecked;
                if (!ischeck) {
                    self.count4one.isChecked = true;
                    break;
                }
                self.setCountCheck(!ischeck, ischeck, !ischeck);
                break;
            case "count8one":
                var ischeck = self.count8one.isChecked;
                if (!ischeck) {
                    self.count8one.isChecked = true;
                    break;
                }
                self.setCountCheck(!ischeck, !ischeck, ischeck);
                break;
            case "sanzhaone":
                var ischeck = self.sanzhaone.isChecked;
                if (!ischeck) {
                    self.sanzhaone.isChecked = true;
                    break;
                }
                self.setZhaisCheck(ischeck, !ischeck, !ischeck, !ischeck)
                break;
            case "sizhaone":
                var ischeck = self.sizhaone.isChecked;
                if (!ischeck) {
                    self.sizhaone.isChecked = true;
                    break;
                }
                self.setZhaisCheck(!ischeck, ischeck, !ischeck, !ischeck)
                break;
            case "wuzhaone":
                var ischeck = self.wuzhaone.isChecked;
                if (!ischeck) {
                    self.wuzhaone.isChecked = true;
                    break;
                }
                self.setZhaisCheck(!ischeck, !ischeck, ischeck, !ischeck)
                break;
            case "wuxianzhaone":
                var ischeck = self.wuxianzhaone.isChecked;
                if (!ischeck) {
                    self.wuxianzhaone.isChecked = true;
                    break;
                }
                self.setZhaisCheck(!ischeck, !ischeck, !ischeck, ischeck)
                break;

        }

        cc.logManager.info("1局===" + self.count1one.isChecked);
        cc.logManager.info("4局===" + self.count4one.isChecked);
        cc.logManager.info("8局===" + self.count8one.isChecked);
        cc.logManager.info("3炸===" + self.sanzhaone.isChecked);
        cc.logManager.info("4炸===" + self.sizhaone.isChecked);
        cc.logManager.info("5炸===" + self.wuzhaone.isChecked);
        cc.logManager.info("无限炸===" + self.wuxianzhaone.isChecked);
        cc.logManager.info("---------------------华丽的分割线----------------------------");
        if (self.count1one.isChecked) {
            cc.jsInstance.CreatRoomParam.jdddzparam.round = "round1";
        }
        if (self.count4one.isChecked) {
            cc.jsInstance.CreatRoomParam.jdddzparam.round = "round4";
        }
        if (self.count8one.isChecked) {
           cc.jsInstance.CreatRoomParam.jdddzparam.round = "round8";
        }
        if (self.sanzhaone.isChecked) {
            cc.jsInstance.CreatRoomParam.jdddzparam.gameXg.bombLime = "3";
        }
        if (self.sizhaone.isChecked) {
            cc.jsInstance.CreatRoomParam.jdddzparam.gameXg.bombLime = "4";
        }
        if (self.wuzhaone.isChecked) {
            cc.jsInstance.CreatRoomParam.jdddzparam.gameXg.bombLime = "5";
        }
        if (self.wuxianzhaone.isChecked) {
            cc.jsInstance.CreatRoomParam.jdddzparam.gameXg.bombLime = "100";
        }
        cc.logManager.info("cc.jsInstance.CreatRoomParam.jdddzparam----", cc.jsInstance.CreatRoomParam.jdddzparam);
    },

    setZhaisCheck(isSanzhaone, isSizhaone, isWuzhaone, isWuxianzhaone) {
        var self = this;
        self.sanzhaone.isChecked = isSanzhaone;
        self.sizhaone.isChecked = isSizhaone;
        self.wuzhaone.isChecked = isWuzhaone;
        self.wuxianzhaone.isChecked = isWuxianzhaone;
    },

    setCountCheck(isCount1one, isCount4one, isCount8one) {
        var self = this;
        self.count1one.isChecked = isCount1one;
        self.count4one.isChecked = isCount4one;
        self.count8one.isChecked = isCount8one;
    },

    start() {

    },


});