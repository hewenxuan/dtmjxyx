//安康一五九
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

        hongzhongone: {
            type: cc.Toggle,
            default: null,
        },
        xiapaozione: {
            type: cc.Toggle,
            default: null,
        },
        qiduione: {
            type: cc.Toggle,
            default: null,
        },
        tianhuone: {
            type: cc.Toggle,
            default: null,
        },
        ganghuaone: {
            type: cc.Toggle,
            default: null,
        },
        yimaone: {
            type: cc.Toggle,
            default: null,
        },
        simaone: {
            type: cc.Toggle,
            default: null,
        },
        liumaone: {
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

        if (cc.jsInstance.CreatRoomParam.ankangparam.round === "round1") {
            self.setCountCheck(true, false, false);
        } else if (cc.jsInstance.CreatRoomParam.ankangparam.round === "round4") {
            self.setCountCheck(false, true, false);
        } else {
            self.setCountCheck(false, false, true);
        }

        if (cc.jsInstance.CreatRoomParam.ankangparam.gameXg.ankang_buyCode === 1) {
            self.setMaCheck(true, false, false);
        } else if (cc.jsInstance.CreatRoomParam.ankangparam.gameXg.ankang_buyCode === 4) {
            self.setMaCheck(false, true, false);
        } else {
            self.setMaCheck(false, false, true);
        }
        self.hongzhongone.isChecked = cc.jsInstance.CreatRoomParam.ankangparam.gameXg.ankang_red;
        self.xiapaozione.isChecked = cc.jsInstance.CreatRoomParam.ankangparam.gameXg.ankang_bang;
        self.qiduione.isChecked = cc.jsInstance.CreatRoomParam.ankangparam.gameXg.ankang_QAdd;
        self.tianhuone.isChecked = cc.jsInstance.CreatRoomParam.ankangparam.gameXg.ankang_HAdd;
        self.ganghuaone.isChecked = cc.jsInstance.CreatRoomParam.ankangparam.gameXg.ankang_GAdd;
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
            case "hongzhongone":
                break;
            case "xiapaozione":
                break;
            case "qiduione":
                break;
            case "tianhuone":
                break;
            case "ganghuaone":
                break;
            case "yimaone":
                var ischeck = self.yimaone.isChecked;
                if (!ischeck) {
                    self.yimaone.isChecked = true;
                    break;
                }
                self.setMaCheck(ischeck, !ischeck, !ischeck);
                break;
            case "simaone":
                var ischeck = self.simaone.isChecked;
                if (!ischeck) {
                    self.simaone.isChecked = true;
                    break;
                }
                self.setMaCheck(!ischeck, ischeck, !ischeck);
                break;
            case "liumaone":
                var ischeck = self.liumaone.isChecked;
                if (!ischeck) {
                    self.liumaone.isChecked = true;
                    break;
                }
                self.setMaCheck(!ischeck, !ischeck, ischeck);
                break;

        }

        cc.logManager.info("1局===" + self.count1one.isChecked);
        cc.logManager.info("4局===" + self.count4one.isChecked);
        cc.logManager.info("8局===" + self.count8one.isChecked);

        cc.logManager.info("红中癞子===" + self.hongzhongone.isChecked);
        cc.logManager.info("下炮子===" + self.xiapaozione.isChecked);
        cc.logManager.info("七对加1码===" + self.qiduione.isChecked);
        cc.logManager.info("天胡加1码===" + self.tianhuone.isChecked);
        cc.logManager.info("杠上开花加1码===" + self.ganghuaone.isChecked);
        cc.logManager.info("一码全中===" + self.yimaone.isChecked);
        cc.logManager.info("买4码===" + self.simaone.isChecked);
        cc.logManager.info("买6码===" + self.liumaone.isChecked);
        cc.logManager.info("---------------------华丽的分割线----------------------------");
        if (self.count1one.isChecked) {
            cc.jsInstance.CreatRoomParam.ankangparam.round = "round1";
        }
        if (self.count4one.isChecked) {
            cc.jsInstance.CreatRoomParam.ankangparam.round = "round4";
        }
        if (self.count8one.isChecked) {
            cc.jsInstance.CreatRoomParam.ankangparam.round = "round8";
        }

        if (self.yimaone.isChecked) {
            cc.jsInstance.CreatRoomParam.ankangparam.gameXg.ankang_buyCode = 1;
        }
        if (self.simaone.isChecked) {
            cc.jsInstance.CreatRoomParam.ankangparam.gameXg.ankang_buyCode = 4;
        }
        if (self.liumaone.isChecked) {
            cc.jsInstance.CreatRoomParam.ankangparam.gameXg.ankang_buyCode = 6;
        }
        cc.jsInstance.CreatRoomParam.ankangparam.gameXg.ankang_red = self.hongzhongone.isChecked;
        cc.jsInstance.CreatRoomParam.ankangparam.gameXg.ankang_bang = self.xiapaozione.isChecked;
        cc.jsInstance.CreatRoomParam.ankangparam.gameXg.ankang_QAdd = self.qiduione.isChecked;
        cc.jsInstance.CreatRoomParam.ankangparam.gameXg.ankang_HAdd = self.tianhuone.isChecked;
        cc.jsInstance.CreatRoomParam.ankangparam.gameXg.ankang_GAdd = self.ganghuaone.isChecked;

        cc.logManager.info("cc.jsInstance.CreatRoomParam.ankangparam----", cc.jsInstance.CreatRoomParam.ankangparam);
    },


    setCountCheck(isCount1one, isCount4one, isCount8one) {
        var self = this;
        self.count1one.isChecked = isCount1one;
        self.count4one.isChecked = isCount4one;
        self.count8one.isChecked = isCount8one;
    },

    setMaCheck(isyimaone, issimaone, isliumaone) {
        var self = this;
        self.yimaone.isChecked = isyimaone;
        self.simaone.isChecked = issimaone;
        self.liumaone.isChecked = isliumaone;
    },


});