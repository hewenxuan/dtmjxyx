//晋中
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
        count1quanone: {
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
        if (cc.jsInstance.CreatRoomParam.jzparam.round === "round1") {
            self.setCountCheck(true, false, false, false);
        } else if (cc.jsInstance.CreatRoomParam.jzparam.round === "round4") {
            self.setCountCheck(false, true, false, false);
        } else if (cc.jsInstance.CreatRoomParam.jzparam.round === "round8") {
            self.setCountCheck(false, false, true, false);
        } else if (cc.jsInstance.CreatRoomParam.jzparam.round === "circle1") {
            self.setCountCheck(false, false, false, true);
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
                self.setCountCheck(ischeck, !ischeck, !ischeck, !ischeck);
                break;
            case "count4one":
                var ischeck = self.count4one.isChecked;
                if (!ischeck) {
                    self.count4one.isChecked = true;
                    break;
                }
                self.setCountCheck(!ischeck, ischeck, !ischeck, !ischeck);
                break;
            case "count8one":
                var ischeck = self.count8one.isChecked;
                if (!ischeck) {
                    self.count8one.isChecked = true;
                    break;
                }
                self.setCountCheck(!ischeck, !ischeck, ischeck, !ischeck);
                break;
            case "count1quanone":
                var ischeck = self.count1quanone.isChecked;
                if (!ischeck) {
                    self.count1quanone.isChecked = true;
                    break;
                }
                self.setCountCheck(!ischeck, !ischeck, !ischeck, ischeck);
                break;
        }
        cc.logManager.info("1局===" + self.count1one.isChecked);
        cc.logManager.info("4局===" + self.count4one.isChecked);
        cc.logManager.info("8局===" + self.count8one.isChecked);
        cc.logManager.info("1圈===" + self.count1quanone.isChecked);

        if (self.count1one.isChecked) {
            cc.jsInstance.CreatRoomParam.jzparam.round = "round1";
            cc.jsInstance.CreatRoomParam.jzparam.jz_xg.circle = false;
        }
        if (self.count4one.isChecked) {
            cc.jsInstance.CreatRoomParam.jzparam.round = "round4";
            cc.jsInstance.CreatRoomParam.jzparam.jz_xg.circle = false;
        }
        if (self.count8one.isChecked) {
            cc.jsInstance.CreatRoomParam.jzparam.round = "round8";
            cc.jsInstance.CreatRoomParam.jzparam.jz_xg.circle = false;
        }
        if (self.count1quanone.isChecked) {
            cc.jsInstance.CreatRoomParam.jzparam.round = "circle1";
            cc.jsInstance.CreatRoomParam.jzparam.jz_xg.circle = true;
        }
       
        cc.logManager.info("cc.jsInstance.CreatRoomParam.jzparam----", cc.jsInstance.CreatRoomParam.jzparam);
        cc.logManager.info("---------------------华丽的分割线----------------------------");
    },
    setCountCheck(isCount1one, isCount4one, isCount8one, isCount1quanone) {
        var self = this;
        self.count1one.isChecked = isCount1one;
        self.count4one.isChecked = isCount4one;
        self.count8one.isChecked = isCount8one;
        self.count1quanone.isChecked = isCount1quanone;
    },

});