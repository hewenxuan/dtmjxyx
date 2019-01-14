//推倒胡
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
        baotingone: {
            type: cc.Toggle,
            default: null,
        },
        daifengone: {
            type: cc.Toggle,
            default: null,
        },
        onlyzimoone: {
            type: cc.Toggle,
            default: null,
        },
        changeTingone: {
            type: cc.Toggle,
            default: null,
        },
        haozione: {
            type: cc.Toggle,
            default: null,
        },
        dahuone: {
            type: cc.Toggle,
            default: null,
        },
        pinghuone: {
            type: cc.Toggle,
            default: null,
        },

        label: {
            type: cc.Label,
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

        if (cc.jsInstance.CreatRoomParam.tdhparam.round === "round1") {
            self.setCountCheck(true, false, false);
        } else if (cc.jsInstance.CreatRoomParam.tdhparam.round === "round4") {
            self.setCountCheck(false, true, false);
        } else {
            self.setCountCheck(false, false, true);
        }
        self.baotingone.isChecked = cc.jsInstance.CreatRoomParam.tdhparam.tdh_xg.tdh_needTing;
        self.daifengone.isChecked = cc.jsInstance.CreatRoomParam.tdhparam.tdh_xg.tdh_withWind;
        self.changeTingone.isChecked = cc.jsInstance.CreatRoomParam.tdhparam.tdh_xg.tdh_changeTingGang;

        self.onlyzimoone.isChecked = !cc.jsInstance.CreatRoomParam.tdhparam.tdh_xg.tdh_canEatHu;
        self.dahuone.isChecked = cc.jsInstance.CreatRoomParam.tdhparam.tdh_xg.tdh_dahu;
        self.setHuPaiType(self.dahuone.isChecked, !self.dahuone.isChecked);
        self.haozione.isChecked = cc.jsInstance.CreatRoomParam.tdhparam.tdh_xg.tdh_haozi;

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
            case "baotingone":
                var ischeck = self.baotingone.isChecked;
                cc.logManager.info("---baotingone---" + ischeck);
                if (!ischeck) {
                    self.baotingone.isChecked = false;
                    self.changeTingone.isChecked = false;
                } else {
                    self.baotingone.isChecked = true;

                }
                break;
            case "daifengone":
                break;
            case "onlyzimoone":
                break;
            case "changeTingone":
                var ischeck = self.changeTingone.isChecked;
                var ischeck1 = self.baotingone.isChecked;
                if (!ischeck) {
                    self.changeTingone.isChecked = false;
                } else {
                    self.changeTingone.isChecked = true;
                    self.haozione.isChecked = false;
                    if (!ischeck1) {
                        self.baotingone.isChecked = true;
                    }
                }
                break;
            case "haozione":
                var ischeck = self.haozione.isChecked;
                if (ischeck) {
                    self.changeTingone.isChecked = false;
                }
                break;
            case "dahuone":
                var ischeck = self.dahuone.isChecked;
                self.setHuPaiType(ischeck, !ischeck);
                break;
            case "pinghuone":
                var ischeck = self.dahuone.isChecked;
                self.setHuPaiType(!ischeck, ischeck);
                break;
        }

        cc.logManager.info("1局===" + self.count1one.isChecked);
        cc.logManager.info("4局===" + self.count4one.isChecked);
        cc.logManager.info("8局===" + self.count8one.isChecked);
        cc.logManager.info("报听===" + self.baotingone.isChecked);
        cc.logManager.info("带风===" + self.daifengone.isChecked);
        cc.logManager.info("只可自模胡===" + self.onlyzimoone.isChecked);
        cc.logManager.info("改变听口不能杠===" + self.changeTingone.isChecked);
        cc.logManager.info("随机耗子===" + self.haozione.isChecked);
        cc.logManager.info("大胡===" + self.dahuone.isChecked);
        cc.logManager.info("平胡===" + self.pinghuone.isChecked);
        cc.logManager.info("---------------------华丽的分割线----------------------------");
        if (self.count1one.isChecked) {
            cc.jsInstance.CreatRoomParam.tdhparam.round = "round1";
        }
        if (self.count4one.isChecked) {
            cc.jsInstance.CreatRoomParam.tdhparam.round = "round4";
        }
        if (self.count8one.isChecked) {
            cc.jsInstance.CreatRoomParam.tdhparam.round = "round8";
        }
        cc.jsInstance.CreatRoomParam.tdhparam.tdh_xg.tdh_needTing = self.baotingone.isChecked;
        cc.jsInstance.CreatRoomParam.tdhparam.tdh_xg.tdh_withWind = self.daifengone.isChecked;
        cc.jsInstance.CreatRoomParam.tdhparam.tdh_xg.tdh_changeTingGang = self.changeTingone.isChecked;
        cc.jsInstance.CreatRoomParam.tdhparam.tdh_xg.tdh_haozi = self.haozione.isChecked;
        cc.jsInstance.CreatRoomParam.tdhparam.tdh_xg.tdh_canEatHu = !self.onlyzimoone.isChecked;
        cc.jsInstance.CreatRoomParam.tdhparam.tdh_xg.tdh_dahu = self.dahuone.isChecked;

        cc.logManager.info("cc.jsInstance.CreatRoomParam.tdhparam----", cc.jsInstance.CreatRoomParam.tdhparam);
    },


    setCountCheck(isCount1one, isCount4one, isCount8one) {
        var self = this;
        self.count1one.isChecked = isCount1one;
        self.count4one.isChecked = isCount4one;
        self.count8one.isChecked = isCount8one;
    },
    setHuPaiType(isDahu, isPinghu) {
        var self = this;
        self.dahuone.isChecked = isDahu;
        self.pinghuone.isChecked = isPinghu;
        if (isDahu) {
            self.label.string = "玩法：胡牌类型有平胡、七小对、豪华七小对、清一色、十三幺、一条龙。";
        } else {
            self.label.string = "玩法：胡牌类型只有平胡玩法。";
        }
    },



});