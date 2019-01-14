cc.Class({
    extends: cc.Component,
    properties: {},

    start() {

    },

    close() {
        this.node.active = false;
        cc.jsInstance.audioManager.playBtnClick();
    },

    //是不是俱乐部
    initData(isClub) {
        this.node.active = true;
        this.node.getChildByName("dt_common_bg_1").getChildByName("title").active = !isClub;
        this.node.getChildByName("dt_common_bg_1").getChildByName("detailTipsLab").active = !isClub;
        this.node.getChildByName("dt_common_bg_1").getChildByName("fangka").active = isClub;
        this.setWxNum();
    },

    setWxNum() {
        var self =this;
        // var strg = cc.jsInstance.remoteCfg.weixinBuy + "";
        // var str1 = strg.split("客服")[1].split("或微信")[0]; //代理咨询请联系微信 客服 DTKEFU203或微信 客服 DTKEHU021
        // var str2 = strg.split("客服")[2];
        // this.node.getChildByName("dt_common_bg_1").getChildByName("detailTipsLab").getComponent(cc.Label).string = strg;
        // this.node.getChildByName("dt_common_bg_1").getChildByName("wxnum1").getComponent(cc.Label).string = "微信号：" + str1;
        // this.node.getChildByName("dt_common_bg_1").getChildByName("wxnum2").getComponent(cc.Label).string = "微信号：" + str2;


        cc.jsInstance.native.getWXku(function(data) {
            var wxNum = data;
            var str = "推广员咨询请联系微信客服：" + wxNum;
            self.node.getChildByName("dt_common_bg_1").getChildByName("detailTipsLab").getComponent(cc.Label).string = str;
            self.node.getChildByName("dt_common_bg_1").getChildByName("wxnum1").getComponent(cc.Label).string = "微信号：" + wxNum;

            var strFangka = "房卡不足,请提醒亲友圈管理员补充房卡！\n或您也可以联系我们官方客服:" + wxNum;
            self.node.getChildByName("dt_common_bg_1").getChildByName("fangka").getComponent(cc.Label).string = strFangka;
        });

    },

    copyWxNum(e, label) {
        cc.jsInstance.audioManager.playBtnClick();
        var string = this.node.getChildByName("dt_common_bg_1").getChildByName(label).getComponent(cc.Label).string;
        cc.logManager.info("string=" + string);
        cc.logManager.info("string==" + string.split("：")[1]);
        cc.jsInstance.native.wxSetClipboardData(string.split("：")[1]);
    }
});