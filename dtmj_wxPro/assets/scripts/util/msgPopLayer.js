cc.Class({
    extends: cc.Component,

    properties: {
        title: {
            default: null,
            type: cc.Node,
        },
        title_default: {
            default: null,
            type: cc.SpriteFrame,
        },
        title_lingqu: {
            default: null,
            type: cc.SpriteFrame,
        },
        title_litter: {
            default: null,
            type: cc.SpriteFrame,
        },
        close: {
            default: null,
            type: cc.Node,
        },
        ok: {
            default: null,
            type: cc.Node,
        },
        cancle: {
            default: null,
            type: cc.Node,
        },
        imgbtnbg: {
            default: null,
            type: cc.Node,
        },
        imgbtn: {
            default: null,
            type: cc.Node,
        },
        img0: {
            default: null,
            type: cc.Node,
        },
        img1: {
            default: null,
            type: cc.Node,
        },
        img2: {
            default: null,
            type: cc.Node,
        },
        con: {
            default: null,
            type: cc.Node,
        },

        buy_gold_pic: {
            default: null,
            type: cc.Node,
        },

        giveup: {
            default: null,
            type: cc.Node,
        },
        buy_gold: {
            default: null,
            type: cc.Node,
        },

        club_manager: {
            default: null,
            type: cc.Node,
        },

    },

    onLoad() {
        cc.game.addPersistRootNode(this.node);
        cc.jsInstance.msgpop = this;
        this.node.active = false;

        this.okPos = this.ok.getPosition();
        this.canclePos = this.cancle.getPosition();
        this.conPos = this.con.getPosition();
        // this.con.destroy();
    },

    //文字 要关闭按钮 ，要取消 和确定
    showMsg_text_close_cancle(msg, funOk, funCancle, funClose) {
        cc.jsInstance.block.hide();
        this.node.active = true;
        this.hideUserInfoBtn();
        cc.jsInstance.native.setScaleAction(this.node.getChildByName("bg"), 1);
        this.imgbtnbg.active = false;
        this.img0.active = false;
        this.img1.active = false;
        this.img2.active = false;
        this.ok.active = true;
        this.ok.x = this.okPos.x;
        this.close.active = true;
        this.cancle.active = true;
        this.giveup.active = false;
        this.buy_gold.active = false;
        this.buy_gold_pic.active = false;
        this.title.getComponent(cc.Sprite).spriteFrame = this.title_default;
        if (this.con.isValid === true) { //socket 是网络的异步回调。收到回调时，操作的节点有可能已经被销毁了（比如场景已经切换了）销毁后就会有这类报错。你可以判断一下当前节点是否可用，或者用 node.isValid 进行二次验证
            this.con.setPosition(0, 0);
            if (msg) {
                this.con.getComponent(cc.Label).string = msg;
            } else {
                this.con.getComponent(cc.Label).string = "设置文字失败！";
            }
        }
        if (funOk) {
            this.okcb = funOk;
        } else {
            this.okcb = "";
        }
        if (funCancle) {
            this.canclecb = funCancle;
        } else {
            this.canclecb = "";
        }
        if (funClose) {
            this.closecb = funClose;
        } else {
            this.closecb = "";
        }
    },
    //文字 ，不要关闭按钮 ，不要取消，只要确定
    showMsg_text_noclose_nocancle(msg, funOk) {
        cc.jsInstance.block.hide();
        this.hideUserInfoBtn();
        this.node.active = true;
        cc.jsInstance.native.setScaleAction(this.node.getChildByName("bg"), 1);
        this.img0.active = false;
        this.img1.active = false;
        this.img2.active = false;
        this.imgbtnbg.active = false;
        this.ok.active = true;
        this.close.active = false;
        this.cancle.active = false;
        this.giveup.active = false;
        this.buy_gold.active = false;
        this.buy_gold_pic.active = false;
        this.title.getComponent(cc.Sprite).spriteFrame = this.title_default;
        if (this.con.isValid === true) { //socket 是网络的异步回调。收到回调时，操作的节点有可能已经被销毁了（比如场景已经切换了）销毁后就会有这类报错。你可以判断一下当前节点是否可用，或者用 node.isValid 进行二次验证
            this.con.setPosition(0, 0);
            if (msg) {
                this.con.getComponent(cc.Label).string = msg;
            } else {
                this.con.getComponent(cc.Label).string = "设置文字失败！";
            }
        }
        this.ok.x = 0;
        if (funOk) {
            this.okcb = funOk;
        } else {
            this.okcb = "";
        }
    },

    //文字 ，不要关闭按钮 ，要取消，要确定
    showMsg_text_noclose(msg, funOk, funCancle) {
        cc.jsInstance.block.hide();
        this.node.active = true;
        this.hideUserInfoBtn();
        cc.jsInstance.native.setScaleAction(this.node.getChildByName("bg"), 1);
        this.imgbtnbg.active = false;
        this.img0.active = false;
        this.img1.active = false;
        this.img2.active = false;
        this.ok.active = true;
        this.ok.x = this.okPos.x;
        this.close.active = false;
        this.cancle.active = true;
        this.giveup.active = false;
        this.buy_gold.active = false;
        this.buy_gold_pic.active = false;
        this.title.getComponent(cc.Sprite).spriteFrame = this.title_default;
        if (this.con.isValid === true) { //socket 是网络的异步回调。收到回调时，操作的节点有可能已经被销毁了（比如场景已经切换了）销毁后就会有这类报错。你可以判断一下当前节点是否可用，或者用 node.isValid 进行二次验证
            this.con.setPosition(0, 0);
            if (msg) {
                this.con.getComponent(cc.Label).string = msg;
            } else {
                this.con.getComponent(cc.Label).string = "设置文字失败！";
            }
        }
        if (funOk) {
            this.okcb = funOk;
        } else {
            this.okcb = "";
        }
        if (funCancle) {
            this.canclecb = funCancle;
        } else {
            this.canclecb = "";
        }
    },

    //文字 ，要关闭按钮 ，不要取消，只要确定
    showMsg_text_close_nocancle(msg, funOk, funClose) {
        cc.jsInstance.block.hide();
        this.node.active = true;
        this.hideUserInfoBtn();
        cc.jsInstance.native.setScaleAction(this.node.getChildByName("bg"), 1);
        this.img0.active = false;
        this.img1.active = false;
        this.img2.active = false;
        this.imgbtnbg.active = false;
        this.ok.active = true;
        this.close.active = true;
        this.cancle.active = false;
        this.giveup.active = false;
        this.buy_gold.active = false;
        this.buy_gold_pic.active = false;
        this.title.getComponent(cc.Sprite).spriteFrame = this.title_default;
        if (this.con.isValid === true) { //socket 是网络的异步回调。收到回调时，操作的节点有可能已经被销毁了（比如场景已经切换了）销毁后就会有这类报错。你可以判断一下当前节点是否可用，或者用 node.isValid 进行二次验证
            this.con.setPosition(0, 0);
            if (msg) {
                this.con.getComponent(cc.Label).string = msg;
            } else {
                this.con.getComponent(cc.Label).string = "设置文字失败！";
            }
        }
        this.ok.x = 0;
        if (funOk) {
            this.okcb = funOk;
        } else {
            this.okcb = "";
        }

        if (funClose) {
            this.closecb = funClose;
        } else {
            this.closecb = "";
        }
    },

    //文字 ，要关闭按钮 ，不要取消，不要确定
    showMsg_text_close_nocancle_noensure(msg, funClose) {
        cc.jsInstance.block.hide();
        this.node.active = true;
        this.hideUserInfoBtn();
        cc.jsInstance.native.setScaleAction(this.node.getChildByName("bg"), 1);
        this.img0.active = false;
        this.img1.active = false;
        this.img2.active = false;
        this.imgbtnbg.active = false;
        this.ok.active = false;
        this.close.active = true;
        this.cancle.active = false;
        this.giveup.active = false;
        this.buy_gold.active = false;
        this.buy_gold_pic.active = false;
        this.title.getComponent(cc.Sprite).spriteFrame = this.title_default;
        if (this.con.isValid === true) { //socket 是网络的异步回调。收到回调时，操作的节点有可能已经被销毁了（比如场景已经切换了）销毁后就会有这类报错。你可以判断一下当前节点是否可用，或者用 node.isValid 进行二次验证
            this.con.setPosition(0, 0);
            if (msg) {
                this.con.getComponent(cc.Label).string = msg;
            } else {
                this.con.getComponent(cc.Label).string = "设置文字失败！";
            }
        }
        this.ok.x = 0;
        if (funClose) {
            this.closecb = funClose;
        } else {
            this.closecb = "";
        }
    },


    //领取补助
    showMsg_buzhu(msg, funimgbtnbg, funClose) {
        cc.jsInstance.block.hide();
        this.node.active = true;
        this.hideUserInfoBtn();
        cc.jsInstance.native.setScaleAction(this.node.getChildByName("bg"), 1);

        this.img0.active = true;
        this.img1.active = true;
        this.img2.active = true;
        this.imgbtnbg.active = true;
        this.ok.active = false;
        this.close.active = true;
        this.giveup.active = false;
        this.buy_gold.active = false;
        this.cancle.active = false;
        this.buy_gold_pic.active = false;
        this.title.getComponent(cc.Sprite).spriteFrame = this.title_lingqu;
        if (this.con.isValid === true) { //socket 是网络的异步回调。收到回调时，操作的节点有可能已经被销毁了（比如场景已经切换了）销毁后就会有这类报错。你可以判断一下当前节点是否可用，或者用 node.isValid 进行二次验证
            this.con.setPosition(0, this.conPos.y);
            if (msg) {
                this.con.getComponent(cc.Label).string = msg;
            } else {
                this.con.getComponent(cc.Label).string = "设置文字失败！";
            }
        }
        if (funimgbtnbg) {
            this.imgcb = funimgbtnbg;
        } else {
            this.imgcb = "";
        }
        if (funClose) {
            this.closecb = funClose;
        } else {
            this.closecb = "";
        }
    },
    //购买金币 2 10 20 30
    showMsg_buygold(num, funbuy, fungiveup, funClose) {
        var self = this;
        cc.jsInstance.block.hide();
        this.hideUserInfoBtn();
        this.node.active = true;
        cc.jsInstance.native.setScaleAction(this.node.getChildByName("bg"), 1);

        this.img0.active = false;
        this.img1.active = false;
        this.img2.active = false;
        this.imgbtnbg.active = false;
        this.ok.active = false;
        this.cancle.active = false;
        this.close.active = true;
        this.giveup.active = true;
        if (this.con.isValid === true) { //socket 是网络的异步回调。收到回调时，操作的节点有可能已经被销毁了（比如场景已经切换了）销毁后就会有这类报错。你可以判断一下当前节点是否可用，或者用 node.isValid 进行二次验证
            this.con.setPosition(0, this.conPos.y);
            switch (num) {
                case 2:
                    this.buy_gold.active = true;
                    this.con.getComponent(cc.Label).string = "兑换可换取10000金币！";
                    self.showBuyGoldPic(true, false, false, false);
                    break;
                case 10:
                    this.con.getComponent(cc.Label).string = "兑换可换取50000金币！";
                    self.showBuyGoldPic(false, true, false, false);
                    break;
                case 20:
                    this.con.getComponent(cc.Label).string = "兑换可换取100000金币！";
                    self.showBuyGoldPic(false, false, true, false);
                    break;
                case 30:
                    this.con.getComponent(cc.Label).string = "兑换可换取150000金币！";
                    self.showBuyGoldPic(false, false, false, true);
                    break;
            }
        }
        this.title.getComponent(cc.Sprite).spriteFrame = this.title_litter;
        if (funbuy) {
            this.buycb = funbuy;
        } else {
            this.buycb = "";
        }
        if (fungiveup) {
            this.giveupcb = fungiveup;
        } else {
            this.giveupcb = "";
        }
        if (funClose) {
            this.closecb = funClose;
        } else {
            this.closecb = "";
        }
    },

    showBuyGoldPic(isgold2Show, isgold10show, isgold20show, isgold30show) {

        this.buy_gold.active = true;
        this.buy_gold_pic.active = true;

        this.buy_gold.getChildByName("buy_gold_2").active = isgold2Show;
        this.buy_gold_pic.getChildByName("buy_gold_pic_2").active = isgold2Show;

        this.buy_gold.getChildByName("buy_gold_10").active = isgold10show;
        this.buy_gold_pic.getChildByName("buy_gold_pic_10").active = isgold10show;

        this.buy_gold.getChildByName("buy_gold_20").active = isgold20show;
        this.buy_gold_pic.getChildByName("buy_gold_pic_20").active = isgold20show;

        this.buy_gold.getChildByName("buy_gold_30").active = isgold30show;
        this.buy_gold_pic.getChildByName("buy_gold_pic_30").active = isgold30show;
    },

    //设置某人为亲友圈管理员时
    showMsg_club_M(msg, funOk, funCancle) {
        cc.jsInstance.block.hide();
        this.node.active = true;
        this.hideUserInfoBtn();
        cc.jsInstance.native.setScaleAction(this.node.getChildByName("bg"), 1);
        this.imgbtnbg.active = false;
        this.img0.active = false;
        this.img1.active = false;
        this.img2.active = false;
        this.ok.active = true;
        this.ok.x = this.okPos.x;
        this.close.active = false;
        this.cancle.active = true;
        this.giveup.active = false;
        this.buy_gold.active = false;
        this.buy_gold_pic.active = false;
        this.club_manager.active = true;
        this.title.getComponent(cc.Sprite).spriteFrame = this.title_default;
        if (this.con.isValid === true) { //socket 是网络的异步回调。收到回调时，操作的节点有可能已经被销毁了（比如场景已经切换了）销毁后就会有这类报错。你可以判断一下当前节点是否可用，或者用 node.isValid 进行二次验证
            this.con.setPosition(0, 0);
            if (msg) {
                this.con.getComponent(cc.Label).string = msg;
            } else {
                this.con.getComponent(cc.Label).string = "设置文字失败！";
            }
        }
        if (funOk) {
            this.okcb = funOk;
        } else {
            this.okcb = "";
        }
        if (funCancle) {
            this.canclecb = funCancle;
        } else {
            this.canclecb = "";
        }
    },

    start() {

    },

    click_giveupbtn() {
        this.node.active = false;
        this.showUserInfoBtn();
        if (this.giveupcb) {
            this.giveupcb();
        }
        this.closecallback();
    },

    click_buybtn() {
        this.node.active = false;
        this.showUserInfoBtn();
        if (this.buycb) {
            this.buycb();
        }
        this.closecallback();
    },

    click_imgbtn() {
        this.node.active = false;
        this.showUserInfoBtn();
        if (this.imgcb) {
            this.imgcb();
        }
        this.closecallback();
    },

    click_ok() {
        this.club_manager.active = false;
        this.node.active = false;
        this.showUserInfoBtn();
        if (this.okcb) {
            this.okcb();
        }
        this.closecallback();
    },
    click_cancle() {
        this.club_manager.active = false;
        this.node.active = false;
        this.showUserInfoBtn();
        if (this.canclecb) {
            this.canclecb();
        }
        this.closecallback();
    },
    click_close() {
        this.node.active = false;
        this.showUserInfoBtn();
        if (this.closecb) {
            this.closecb();
        }
        this.closecallback();
    },

    //关闭所有注册监听
    closecallback() {
        this.closecb = "";
        this.buycb = "";
        this.imgcb = "";
        this.okcb = "";
        this.canclecb = "";
        this.giveupcb = "";
    },

    showUserInfoBtn() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (cc.jsInstance.userInfoBtn) {
                if (this.con.getComponent(cc.Label).string === "请同意用户协议") {
                    cc.jsInstance.userInfoBtn.show();
                    cc.logManager.info("显示登录按钮");
                }
            }
        }
    },
    hideUserInfoBtn() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (cc.jsInstance.userInfoBtn) {
                cc.jsInstance.userInfoBtn.hide();
                cc.logManager.info("隐藏登录按钮");
            }
        }
    },
    isActive() {
        return this.node.active;
    },

    getNode() {
        return this.node;
    },
    settest() {
        if (this.num >= 9) {
            this.num = 1;
        }

        switch (this.num) {
            case 9:
                cc.jsInstance.msgpop.showMsg_text_noclose("不要关闭按钮 ，要取消，只要确定", function() {});
                break;
            case 0:
                cc.jsInstance.msgpop.showMsg_text_close_nocancle_noensure("要关闭按钮 ，不要取消，不要确定", function() {});
                break;
            case 1:
                cc.jsInstance.msgpop.showMsg_text_close_cancle("要关闭按钮 ，要取消 和确定", function() {}, function() {},
                    function() {});
                break;
            case 2:
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("不要关闭按钮 ，不要取消，只要确定", function() {});
                break;
            case 3:
                cc.jsInstance.msgpop.showMsg_text_close_nocancle("要关闭按钮 ，不要取消，只要确定", function() {},
                    function() {});
                break;

            case 4:
                cc.jsInstance.msgpop.showMsg_buzhu("领取补助", function() {}, function() {});
                break;
            case 5:
                cc.jsInstance.msgpop.showMsg_buygold(2, function() {}, function() {}, function() {});
                break;
            case 6:
                cc.jsInstance.msgpop.showMsg_buygold(10, function() {}, function() {}, function() {});
                break;
            case 7:
                cc.jsInstance.msgpop.showMsg_buygold(20, function() {}, function() {}, function() {});
                break;
            case 8:
                cc.jsInstance.msgpop.showMsg_buygold(30, function() {}, function() {}, function() {});
                break;

        }
        this.num++;
    },
});