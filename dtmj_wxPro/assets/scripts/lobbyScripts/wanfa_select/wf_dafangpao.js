//打放炮
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


        dahuone: {
            type: cc.Toggle,
            default: null,
        },
        baotingone: {
            type: cc.Toggle,
            default: null,
        },
        onlyzimoone: {
            type: cc.Toggle,
            default: null,
        },
        nofengone: {
            type: cc.Toggle,
            default: null,
        },
        yipaoduoxiangone: {
            type: cc.Toggle,
            default: null,
        },
        ganghuone: {
            type: cc.Toggle,
            default: null,
        },
        minggangone: {
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

        if (cc.jsInstance.CreatRoomParam.dafangpaoparam.round === "round1") {
            self.setCountCheck(true, false, false);
        } else if (cc.jsInstance.CreatRoomParam.dafangpaoparam.round === "round4") {
            self.setCountCheck(false, true, false);
        } else {
            self.setCountCheck(false, false, true);
        }
        self.dahuone.isChecked = cc.jsInstance.CreatRoomParam.dafangpaoparam.gameXg.dfp_dahu;
        self.baotingone.isChecked = cc.jsInstance.CreatRoomParam.dafangpaoparam.gameXg.dfp_ting;
        self.onlyzimoone.isChecked = cc.jsInstance.CreatRoomParam.dafangpaoparam.gameXg.dfp_zimo;
        self.nofengone.isChecked = cc.jsInstance.CreatRoomParam.dafangpaoparam.gameXg.dfp_budaifeng;
        self.yipaoduoxiangone.isChecked = cc.jsInstance.CreatRoomParam.dafangpaoparam.gameXg.dfp_ypdx;
        self.ganghuone.isChecked = cc.jsInstance.CreatRoomParam.dafangpaoparam.gameXg.dfp_gshz;
        self.minggangone.isChecked = cc.jsInstance.CreatRoomParam.dafangpaoparam.gameXg.dfp_mgsjc;
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
            case "dahuone":
                break;
            case "baotingone":
                break;
            case "onlyzimoone":
                break;
            case "nofengone":
                break;
            case "yipaoduoxiangone":
                break;
            case "ganghuone":
                break;
            case "minggangone":
                break;
        }

        cc.logManager.info("1局===" + self.count1one.isChecked);
        cc.logManager.info("4局===" + self.count4one.isChecked);
        cc.logManager.info("8局===" + self.count8one.isChecked);

        cc.logManager.info("大胡===" + self.dahuone.isChecked);
        cc.logManager.info("报听===" + self.baotingone.isChecked);
        cc.logManager.info("只可自摸胡===" + self.onlyzimoone.isChecked);
        cc.logManager.info("不带风===" + self.nofengone.isChecked);
        cc.logManager.info("一炮多响===" + self.yipaoduoxiangone.isChecked);
        cc.logManager.info("杠随胡走===" + self.ganghuone.isChecked);
        cc.logManager.info("明杠三家出===" + self.minggangone.isChecked);
        cc.logManager.info("---------------------华丽的分割线----------------------------");
        if (self.count1one.isChecked) {
            cc.jsInstance.CreatRoomParam.dafangpaoparam.round = "round1";
        }
        if (self.count4one.isChecked) {
            cc.jsInstance.CreatRoomParam.dafangpaoparam.round = "round4";
        }
        if (self.count8one.isChecked) {
            cc.jsInstance.CreatRoomParam.dafangpaoparam.round = "round8";
        }
        cc.jsInstance.CreatRoomParam.dafangpaoparam.gameXg.dfp_dahu = self.dahuone.isChecked;
        cc.jsInstance.CreatRoomParam.dafangpaoparam.gameXg.dfp_ting = self.baotingone.isChecked;
        cc.jsInstance.CreatRoomParam.dafangpaoparam.gameXg.dfp_zimo = self.onlyzimoone.isChecked;
        cc.jsInstance.CreatRoomParam.dafangpaoparam.gameXg.dfp_budaifeng = self.nofengone.isChecked;
        cc.jsInstance.CreatRoomParam.dafangpaoparam.gameXg.dfp_ypdx = self.yipaoduoxiangone.isChecked;
        cc.jsInstance.CreatRoomParam.dafangpaoparam.gameXg.dfp_gshz = self.ganghuone.isChecked;
        cc.jsInstance.CreatRoomParam.dafangpaoparam.gameXg.dfp_mgsjc = self.minggangone.isChecked;

        cc.logManager.info("cc.jsInstance.CreatRoomParam.dafangpaoparam----", cc.jsInstance.CreatRoomParam.dafangpaoparam);
    },


    setCountCheck(isCount1one, isCount4one, isCount8one) {
        var self = this;
        self.count1one.isChecked = isCount1one;
        self.count4one.isChecked = isCount4one;
        self.count8one.isChecked = isCount8one;
    },
});