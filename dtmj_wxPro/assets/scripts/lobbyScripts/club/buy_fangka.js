var Color = {
    RED: "#913429", //已拒绝要这个颜色
    REDED: "#FE0707", //已同意用这个颜色
};
cc.Class({
    extends: cc.Component,
    properties: {
        //第一次创建亲友圈的提示
        add: {
            type: cc.Node,
            default: null,
        },
        //购买房卡界面
        sub: {
            type: cc.Node,
            default: null,
        },

        fangka1: {
            type: cc.Label,
            default: null,
        },
        fangka2: {
            type: cc.Label,
            default: null,
        },
        //元宝不足
        fangka_buzu: {
            type: cc.Node,
            default: null,
        },
        //创建亲友圈元宝不足的时候弹出
        rechargeMask: {
            type: cc.Node,
            default: null,
        },
    },

    onLoad() {},

    initData(clubroom) {
        this.clubroom = clubroom;
        this.node.active = true
        this.fangka = 1200;
        this.set_fangka();
    },

    close_click() {
        this.node.active = false;
    },
    //兑换房卡
    duihuan_click() {
        var self = this;
        //元宝不足 的文字显示的话，不能购买房卡，直接跳到购买页面
        if (this.fangka_buzu.active) {
            cc.jsInstance.msgpop.showMsg_text_close_cancle("元宝不足，请充值！", function() {
                self.rechargeMask.getComponent("rechargeMask").initData(false); //是不是亲友圈页面弹出的
            });
            return;
        }
        //兑换房卡
        this.node.active = false;
        cc.jsInstance.network.buyClubMoneyBySycee(this.fangka, this.clubroom.clubInfo.id, function(rtn) {
            if (rtn.result === 0) { //修改默认玩法成功
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("兑换成功");
            } else {
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(rtn.msg);
            }
        });
    },

    add_click() {
        this.fangka = this.fangka + 50;
        if (this.fangka >= 10000) {
            this.fangka = 10000;
        }
        this.set_fangka();
    },

    sub_click() {
        if (this.fangka === 10) {
            return;
        }
        if (this.fangka === 50) {
            this.fangka = this.fangka - 40;
        } else {
            this.fangka = this.fangka - 50;
        }
        this.set_fangka();
    },

    set_fangka() {
        var needMoney = 0;
        //预扣掉 房主建房的元宝 
        if (cc.jsInstance && cc.jsInstance.data && cc.jsInstance.data.tables) {
            for (var key in cc.jsInstance.data.tables) {
                // needMoney = needMoney + cc.jsInstance.data.tables[key].createPara.money;
                var currMoney = cc.jsInstance.data.tables[key].createPara.money;
                if (currMoney <= 0) { //lew 客户端临时处理1局不扣元宝问题
                    currMoney = 1;
                }
                needMoney += currMoney;
            }
        }
        //预扣掉 自己建普通房的元宝
        if (cc.jsInstance && cc.jsInstance.data && cc.jsInstance.data.sData && cc.jsInstance.data.sData.tData) {
            needMoney = needMoney + this.getPutongMoney();
        }
        cc.logManager.info("------needMoney--------" + needMoney);
        needMoney = this.fangka + needMoney;
        if (cc.jsInstance.pinfo.pinfo.money && cc.jsInstance.pinfo.pinfo.money < needMoney) {
            this.fangka_buzu.active = true;
            this.fangka2.node.color = cc.hexToColor(Color.REDED);
        } else {
            this.fangka_buzu.active = false;
            this.fangka2.node.color = cc.hexToColor(Color.RED);
        }
        this.fangka1.string = this.fangka + "";
        this.fangka2.string = this.fangka + "元宝";
    },

    //获取普通房间建房要预扣的元宝
    getPutongMoney() {
        var majiang = cc.jsInstance.data.gameInfo.majiang;
        var mRoundNum = cc.jsInstance.data.sData.tData.roundNum;
        var needMoney = 0;
        switch (mRoundNum) {
            case 1:
                if (jsInstance.data.sData.tData.circle) {
                    needMoney = majiang.circle1;
                } else {
                    needMoney = majiang.round1;
                }
                break;
            case 4:
                needMoney = majiang.round4;
                break;
            case 8:
                needMoney = majiang.round8;
                break;
            case 100:
                needMoney = majiang.round100;
                break;
            case 101:
                needMoney = majiang.circle1;
                break;
            default:
                needMoney = majiang.round4;
                break;
        }
        if (cc.jsInstance.data.sData.tData.gameKind == "tuidaohu2") {
            if (mRoundNum == 8) {
                needMoney = majiang.roundz8;
            } else if (mRoundNum == 16) {
                needMoney = majiang.roundz16;
            }
        }
        if (cc.jsInstance.data.sData.tData.roomOwner != undefined) { //lew 房主建房,并且自己不是房主,不计算消耗
            if (cc.jsInstance.data.sData.tData.roomOwner.uid != cc.jsInstance.data.pinfo.uid) {
                needMoney = 0;
            }
        } else {
            if (cc.jsInstance.data.pinfo.uid != cc.jsInstance.data.sData.tData.uids[0]) {
                needMoney = 0;
            }
        }
        return needMoney;
    },


});