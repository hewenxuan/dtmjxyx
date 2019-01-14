//二人抠点
cc.Class({
    extends: cc.Component,

    properties: {
        count1one: {
            type: cc.Toggle,
            default: null,
        },
        count8one: {
            type: cc.Toggle,
            default: null,
        },
        count16one: {
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
        withWindone: {
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

        if (cc.jsInstance.CreatRoomParam.kd2param.round === "round1") {
            self.setCountCheck(true, false, false);
        } else if (cc.jsInstance.CreatRoomParam.kd2param.round === "roundz8") {
            self.setCountCheck(false, true, false);
        } else if (cc.jsInstance.CreatRoomParam.kd2param.round === "roundz16") {
            self.setCountCheck(false, false, true);
        }

        self.changeTingone.isChecked = cc.jsInstance.CreatRoomParam.kd2param.gameXg.kd_changeTingGang;
        self.qingyiseone.isChecked = cc.jsInstance.CreatRoomParam.kd2param.gameXg.kd_SameColor;
        self.zhuohaozione.isChecked = cc.jsInstance.CreatRoomParam.kd2param.gameXg.kd_zhuohaozi;
        self.fenghaozione.isChecked = cc.jsInstance.CreatRoomParam.kd2param.gameXg.kd_fenghaozi;
        self.withWindone.isChecked = !cc.jsInstance.CreatRoomParam.kd2param.gameXg.withWind;


        self.daizhuangone.isChecked = cc.jsInstance.CreatRoomParam.kd2param.gameXg.kd_zhuang;
        self.zimozhuangone.isChecked = cc.jsInstance.CreatRoomParam.kd2param.gameXg.kd_zhuangDouble;
        self.zimozhuang.active = cc.jsInstance.CreatRoomParam.kd2param.gameXg.kd_zhuang;

        self.fengzuizione.isChecked = cc.jsInstance.CreatRoomParam.kd2param.gameXg.kd_fengzuizi;

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
                self.setCountCheck(ischeck, !ischeck, !ischeck);
                break;
            case "count8one":
                var ischeck = self.count8one.isChecked;
                if (!ischeck) {
                    self.count8one.isChecked = true;
                    break;
                }
                self.setCountCheck(!ischeck, ischeck, !ischeck);
                break;
            case "count16one":
                var ischeck = self.count16one.isChecked;
                if (!ischeck) {
                    self.count16one.isChecked = true;
                    break;
                }
                self.setCountCheck(!ischeck, !ischeck, ischeck);
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
                    self.withWindone.isChecked = !ischeck;
                }
                break;
            case "withWindone":
                var ischeck = self.withWindone.isChecked;
                if (ischeck) {
                    self.fengzuizione.isChecked = !ischeck;
                    self.fenghaozione.isChecked = !ischeck;
                }
                break;

            case "fengzuizione":
                var ischeck = self.fengzuizione.isChecked;
                if (ischeck) {
                    self.withWindone.isChecked = !ischeck;
                }
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
        cc.logManager.info("8局===" + self.count8one.isChecked);
        cc.logManager.info("16局===" + self.count16one.isChecked);
        cc.logManager.info("清一色===" + self.qingyiseone.isChecked);
        cc.logManager.info("捉耗子===" + self.zhuohaozione.isChecked);
        cc.logManager.info("风耗子===" + self.fenghaozione.isChecked);
        cc.logManager.info("不带风===" + !self.withWindone.isChecked);

        cc.logManager.info("改变听===" + self.changeTingone.isChecked);
        cc.logManager.info("带庄===" + self.daizhuangone.isChecked);
        cc.logManager.info("自摸庄===" + self.zimozhuangone.isChecked);
        cc.logManager.info("风嘴子===" + self.fengzuizione.isChecked);

        if (self.count1one.isChecked) {
            cc.jsInstance.CreatRoomParam.kd2param.round = "round1";
            cc.jsInstance.CreatRoomParam.kd2param.gameXg.circle = false;
        }
        if (self.count16one.isChecked) {
            cc.jsInstance.CreatRoomParam.kd2param.round = "roundz16";
            cc.jsInstance.CreatRoomParam.kd2param.gameXg.circle = false;
        }
        if (self.count8one.isChecked) {
            cc.jsInstance.CreatRoomParam.kd2param.round = "roundz8";
            cc.jsInstance.CreatRoomParam.kd2param.gameXg.circle = false;
        }

        cc.jsInstance.CreatRoomParam.kd2param.gameXg.kd_changeTingGang = self.changeTingone.isChecked;
        cc.jsInstance.CreatRoomParam.kd2param.gameXg.kd_SameColor = self.qingyiseone.isChecked;
        cc.jsInstance.CreatRoomParam.kd2param.gameXg.kd_zhuohaozi = self.zhuohaozione.isChecked;
        cc.jsInstance.CreatRoomParam.kd2param.gameXg.kd_fenghaozi = self.fenghaozione.isChecked;
        cc.jsInstance.CreatRoomParam.kd2param.gameXg.withWind = !self.withWindone.isChecked;

        cc.jsInstance.CreatRoomParam.kd2param.gameXg.kd_zhuang = self.daizhuangone.isChecked;
        cc.jsInstance.CreatRoomParam.kd2param.gameXg.kd_zhuangDouble = self.zimozhuangone.isChecked;
        cc.jsInstance.CreatRoomParam.kd2param.gameXg.kd_fengzuizi = self.fengzuizione.isChecked;
        cc.logManager.info("cc.jsInstance.CreatRoomParam.kd2param----", cc.jsInstance.CreatRoomParam.kd2param);
        cc.logManager.info("---------------------华丽的分割线----------------------------");
    },


    setCountCheck(isCount1one, isCount8one, isCount16one) {
        var self = this;
        self.count1one.isChecked = isCount1one;
        self.count8one.isChecked = isCount8one;
        self.count16one.isChecked = isCount16one;
    },



    // update (dt) {},
});