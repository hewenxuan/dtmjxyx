//抠点
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
        qingyiseone: {
            type: cc.Toggle,
            default: null,
        },
        zhuohaozione: {
            type: cc.Toggle,
            default: null,
        },
        fenghaozione: {
            type: cc.Toggle,
            default: null,
        },
        changeTingone: {
            type: cc.Toggle,
            default: null,
        },
        daizhuangone: {
            type: cc.Toggle,
            default: null,
        },
        zimozhuangone: {
            type: cc.Toggle,
            default: null,
        },
        zimozhuang: {
            type: cc.Node,
            default: null,
        },
        fengzuizione: {
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

        if (cc.jsInstance.CreatRoomParam.kdparam.round === "round1") {
            self.setCountCheck(true, false, false, false);
        } else if (cc.jsInstance.CreatRoomParam.kdparam.round === "round4") {
            self.setCountCheck(false, true, false, false);
        } else if (cc.jsInstance.CreatRoomParam.kdparam.round === "round8") {
            self.setCountCheck(false, false, true, false);
        } else if (cc.jsInstance.CreatRoomParam.kdparam.round === "circle1") {
            self.setCountCheck(false, false, false, true);
        }

        self.changeTingone.isChecked = cc.jsInstance.CreatRoomParam.kdparam.kd_xg.kd_changeTingGang;
        self.qingyiseone.isChecked = cc.jsInstance.CreatRoomParam.kdparam.kd_xg.kd_SameColor;
        self.zhuohaozione.isChecked = cc.jsInstance.CreatRoomParam.kdparam.kd_xg.kd_zhuohaozi;
        self.fenghaozione.isChecked = cc.jsInstance.CreatRoomParam.kdparam.kd_xg.kd_fenghaozi;

        self.daizhuangone.isChecked = cc.jsInstance.CreatRoomParam.kdparam.kd_xg.kd_zhuang;
        self.zimozhuangone.isChecked = cc.jsInstance.CreatRoomParam.kdparam.kd_xg.kd_zhuangDouble;
        self.zimozhuang.active = cc.jsInstance.CreatRoomParam.kdparam.kd_xg.kd_zhuang;

        self.fengzuizione.isChecked = cc.jsInstance.CreatRoomParam.kdparam.kd_xg.kd_fengzuizi;

    },

    start() {

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
            case "qingyiseone":
                var ischeck = self.qingyiseone.isChecked;
                if (ischeck) {
                    self.zhuohaozione.isChecked = !ischeck;
                    self.fenghaozione.isChecked = !ischeck;
                }
                break;
            case "zhuohaozione":
                var ischeck = self.zhuohaozione.isChecked;
                if (ischeck) {
                    self.qingyiseone.isChecked = !ischeck;
                    self.fenghaozione.isChecked = !ischeck;
                    self.changeTingone.isChecked = !ischeck;
                }
                break;
            case "fenghaozione":
                var ischeck = self.fenghaozione.isChecked;
                if (ischeck) {
                    self.qingyiseone.isChecked = !ischeck;
                    self.zhuohaozione.isChecked = !ischeck;
                    self.changeTingone.isChecked = !ischeck;
                }
                break;
            case "fengzuizione":
                break;
            case "changeTingone":
                var ischeck = self.changeTingone.isChecked;
                if (ischeck) {
                    self.zhuohaozione.isChecked = !ischeck;
                    self.fenghaozione.isChecked = !ischeck;
                }
                break;
            case "daizhuangone":
                var ischeck = self.daizhuangone.isChecked;
                if (!ischeck) {
                    self.daizhuangone.isChecked = false;
                    self.zimozhuang.active = false;
                    self.zimozhuangone.isChecked = false;
                } else {
                    self.daizhuangone.isChecked = true;
                    self.zimozhuang.active = true;
                    self.zimozhuangone.isChecked = false;
                }
                break;
            case "zimozhuangone":
                break;
        }

        cc.logManager.info("1局===" + self.count1one.isChecked);
        cc.logManager.info("4局===" + self.count4one.isChecked);
        cc.logManager.info("8局===" + self.count8one.isChecked);
        cc.logManager.info("1圈===" + self.count1quanone.isChecked);
        cc.logManager.info("清一色===" + self.qingyiseone.isChecked);
        cc.logManager.info("捉耗子===" + self.zhuohaozione.isChecked);
        cc.logManager.info("风耗子===" + self.fenghaozione.isChecked);
        cc.logManager.info("改变听===" + self.changeTingone.isChecked);
        cc.logManager.info("带庄===" + self.daizhuangone.isChecked);
        cc.logManager.info("自摸庄===" + self.zimozhuangone.isChecked);
        cc.logManager.info("风嘴子===" + self.fengzuizione.isChecked);

        if (self.count1one.isChecked) {
            cc.jsInstance.CreatRoomParam.kdparam.round = "round1";
            cc.jsInstance.CreatRoomParam.kdparam.kd_xg.circle = false;
        }
        if (self.count4one.isChecked) {
            cc.jsInstance.CreatRoomParam.kdparam.round = "round4";
            cc.jsInstance.CreatRoomParam.kdparam.kd_xg.circle = false;
        }
        if (self.count8one.isChecked) {
            cc.jsInstance.CreatRoomParam.kdparam.round = "round8";
            cc.jsInstance.CreatRoomParam.kdparam.kd_xg.circle = false;
        }
        if (self.count1quanone.isChecked) {
            cc.jsInstance.CreatRoomParam.kdparam.round = "circle1";
            cc.jsInstance.CreatRoomParam.kdparam.kd_xg.circle = true;
        }

        cc.jsInstance.CreatRoomParam.kdparam.kd_xg.kd_changeTingGang = self.changeTingone.isChecked;
        cc.jsInstance.CreatRoomParam.kdparam.kd_xg.kd_SameColor = self.qingyiseone.isChecked;
        cc.jsInstance.CreatRoomParam.kdparam.kd_xg.kd_zhuohaozi = self.zhuohaozione.isChecked;
        cc.jsInstance.CreatRoomParam.kdparam.kd_xg.kd_fenghaozi = self.fenghaozione.isChecked;
        cc.jsInstance.CreatRoomParam.kdparam.kd_xg.kd_zhuang = self.daizhuangone.isChecked;
        cc.jsInstance.CreatRoomParam.kdparam.kd_xg.kd_zhuangDouble = self.zimozhuangone.isChecked;
        cc.jsInstance.CreatRoomParam.kdparam.kd_xg.kd_fengzuizi = self.fengzuizione.isChecked;
        cc.logManager.info("cc.jsInstance.CreatRoomParam.kdparam----", cc.jsInstance.CreatRoomParam.kdparam);
        cc.logManager.info("---------------------华丽的分割线----------------------------");
    },


    setCountCheck(isCount1one, isCount4one, isCount8one, isCount1quanone) {
        var self = this;
        self.count1one.isChecked = isCount1one;
        self.count4one.isChecked = isCount4one;
        self.count8one.isChecked = isCount8one;
        self.count1quanone.isChecked = isCount1quanone;
    },



    // update (dt) {},
});