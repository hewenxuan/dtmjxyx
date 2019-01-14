cc.Class({
    extends: cc.Component,
    properties: {
        content: {
            type: cc.Node,
            default: null,
        },
    },
    onLoad() {
        var self = this;
        self.waittingload = this.node.getChildByName("waitting").getComponent("waitting");
        if (cc.jsInstance.remoteCfg.version === cc.jsInstance.version + "") {
            this.node.getChildByName("gold_scrollview").getChildByName("gold_bg").getChildByName("add").active = false;
        }
    },

    getPeoples() {
        var self = this;
        self.node.getChildByName("gold_scrollview").getChildByName("gold_bg").getChildByName("gold").getComponent(cc.Label).string = cc.jsInstance.native.formatMoney(cc.jsInstance.pinfo.pinfo.coin);
        cc.jsInstance.network.fetchMJAllPlaygroundStatus(function(res) {
            cc.logManager.info("获取所有金币场的在线人数");
            // cc.jsInstance.block.hide();
            if (res.result === 0) {
                cc.jsInstance.rows = res.rows;
                self.setPeoples(res.rows)
            } else {
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(res.msg, function() {
                    cc.jsInstance.audioManager.playBtnClick();
                });
            }
        });
    },

    setPeoples(rows) {
        // cc.logManager.info("cc.jsInstance.data=", cc.jsInstance.data);
        var self = this;
        // var content = self.node.getChildByName("gold_scrollview").getChildByName("view").getChildByName("content");
        var content = this.content;
        if (rows && rows.length > 0) {
            cc.logManager.info("rows.length=", rows.length);
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].uniqueId === "GM1") {
                    content.getChildByName("GM1").active = true;
                    content.getChildByName("GM1").getChildByName("PeopleNum").getComponent(cc.Label).string = rows[i].online + "人";
                    if (cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM1) {
                        var GM1 = cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM1;
                        content.getChildByName("GM1").getChildByName("score").getComponent(cc.Label).string = GM1.room.base;
                        // var gold = parseInt(GM1.coin) / 1000 + "千-" + parseInt(GM1.maxCoin) / 10000 + "万";
                        var gold = parseInt(GM1.coin) / 1000 + "千以上";
                        content.getChildByName("GM1").getChildByName("gold").getComponent(cc.Label).string = gold;
                    }
                } else if (rows[i].uniqueId === "GM2") {
                    if (cc.jsInstance.remoteCfg.version != cc.jsInstance.version + "") {
                        content.getChildByName("GM2").active = true;
                    }
                    content.getChildByName("GM2").getChildByName("PeopleNum").getComponent(cc.Label).string = rows[i].online + "人";
                    if (cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM2) {
                        var GM2 = cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM2;
                        content.getChildByName("GM2").getChildByName("score").getComponent(cc.Label).string = GM2.room.base;
                        var gold = parseInt(GM2.coin) / 10000 + "万以上";
                        content.getChildByName("GM2").getChildByName("gold").getComponent(cc.Label).string = gold;
                    }
                } else if (rows[i].uniqueId === "GM3") {
                    if (cc.jsInstance.remoteCfg.version != cc.jsInstance.version + "") {
                        content.getChildByName("GM3").active = true;
                    }
                    content.getChildByName("GM3").getChildByName("PeopleNum").getComponent(cc.Label).string = rows[i].online + "人";
                    if (cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM3) {
                        var GM3 = cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM3;
                        content.getChildByName("GM3").getChildByName("score").getComponent(cc.Label).string = GM3.room.base;
                        var gold = parseInt(GM3.coin) / 10000 + "万以上";
                        content.getChildByName("GM3").getChildByName("gold").getComponent(cc.Label).string = gold;
                    }
                } else if (rows[i].uniqueId === "GM4") {
                    if (cc.jsInstance.remoteCfg.version != cc.jsInstance.version + "") {
                        content.getChildByName("GM4").active = true;
                    }
                    content.getChildByName("GM4").getChildByName("PeopleNum").getComponent(cc.Label).string = rows[i].online + "人";
                    if (cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM4) {
                        var GM4 = cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM4;
                        content.getChildByName("GM4").getChildByName("score").getComponent(cc.Label).string = GM4.room.base;
                        var gold = parseInt(GM4.coin) / 10000 + "万以上";
                        content.getChildByName("GM4").getChildByName("gold").getComponent(cc.Label).string = gold;
                    }
                }
            }
        }

    },

    start() {

    },

    btn_click: function(e, custom) {
        var self = this;
        cc.logManager.info("btn_click:" + custom);
        switch (custom) {
            case "close":
                cc.jsInstance.audioManager.playBtnClick();
                self.node.active = false;
                return;
            case "help":
                self.node.getChildByName("help_info").active = true;
                cc.jsInstance.native.setScaleAction(self.node.getChildByName("help_info").getChildByName("dt_common_bg_1"));
                cc.jsInstance.audioManager.playBtnClick();
                return;
            case "help_close":
                cc.jsInstance.audioManager.playBtnClick();
                self.node.getChildByName("help_info").active = false;
                return;
            case "buy_gold":
                if (cc.jsInstance.remoteCfg.version === cc.jsInstance.version + "") {
                    return;
                }
                self.node.getChildByName("goldShop").active = true;
                cc.jsInstance.native.setScaleAction(self.node.getChildByName("goldShop").getChildByName("dt_shop_zhezhao"));
                cc.jsInstance.audioManager.playBtnClick();
                return;
            case "goldshop_close": //金币场 商店关闭
                self.node.getChildByName("goldShop").active = false;
                cc.jsInstance.audioManager.playBtnClick();
                return;
            case "buy_2":
                cc.jsInstance.audioManager.playBtnClick();
                if (self.checkbuyCon(2)) {
                    cc.jsInstance.msgpop.showMsg_text_close_cancle("您确定要消耗2个元宝兑换10000金币吗？", function() {
                        cc.jsInstance.audioManager.playBtnClick();
                        self.buy_gold("store_gold_2");
                    }, function() {});
                } else {
                    return;
                }

                return;
            case "buy_10": //金币场 商店10元宝购买
                cc.jsInstance.audioManager.playBtnClick();

                if (self.checkbuyCon(10)) {
                    cc.jsInstance.msgpop.showMsg_text_close_cancle("您确定要消耗10个元宝兑换50000金币吗？", function() {
                        cc.jsInstance.audioManager.playBtnClick();
                        self.buy_gold("store_gold_10");
                    }, function() {});
                } else {
                    return;
                }

                return;
            case "buy_20": //金币场 商店20元宝购买
                cc.jsInstance.audioManager.playBtnClick();

                if (self.checkbuyCon(20)) {
                    cc.jsInstance.msgpop.showMsg_text_close_cancle("您确定要消耗20个元宝兑换100000金币吗？", function() {
                        cc.jsInstance.audioManager.playBtnClick();
                        self.buy_gold("store_gold_20");
                    }, function() {});
                } else {
                    return;
                }

                return;
            case "buy_30": //金币场 商店30元宝购买
                cc.jsInstance.audioManager.playBtnClick();

                if (self.checkbuyCon(30)) {
                    cc.jsInstance.msgpop.showMsg_text_close_cancle("您确定要消耗30个元宝兑换150000金币吗？", function() {
                        cc.jsInstance.audioManager.playBtnClick();
                        self.buy_gold("store_gold_30");
                    }, function() {});
                } else {
                    return;
                }

                return;
            case "buy_60": //金币场 商店60元宝购买
                cc.jsInstance.audioManager.playBtnClick();

                if (self.checkbuyCon(60)) {
                    cc.jsInstance.msgpop.showMsg_text_close_cancle("您确定要消耗60个元宝兑换300000金币吗？", function() {
                        cc.jsInstance.audioManager.playBtnClick();
                        self.buy_gold("store_gold_60");
                    }, function() {});
                } else {
                    return;
                }

                return;
            case "buy_100": //金币场 商店100元宝购买
                cc.jsInstance.audioManager.playBtnClick();
                if (self.checkbuyCon(100)) {
                    cc.jsInstance.msgpop.showMsg_text_close_cancle("您确定要消耗100个元宝兑换500000金币吗？", function() {
                        cc.jsInstance.audioManager.playBtnClick();
                        self.buy_gold("store_gold_100");
                    }, function() {});
                } else {
                    return;
                }

                return;
            case "start_game": //快速开始游戏
                cc.jsInstance.audioManager.playBtnClick();
                self.start_game();
                return;
            case "share": //分享
                cc.jsInstance.audioManager.playBtnClick();
                self.shard();
                return;
            case "goldItem1": // 金币场 初级场
                cc.jsInstance.audioManager.playBtnClick();
                if (cc.jsInstance.rows) {
                    for (var i = 0; i < cc.jsInstance.rows.length; i++) {
                        if (cc.jsInstance.rows[i].uniqueId === "GM1") {
                            self.start_game("GM1", cc.jsInstance.rows[i].fid);
                            break;
                        }
                    }
                }

                return;
            case "goldItem2": // 金币场 中级场
                cc.jsInstance.audioManager.playBtnClick();
                if (cc.jsInstance.rows) {
                    for (var i = 0; i < cc.jsInstance.rows.length; i++) {
                        if (cc.jsInstance.rows[i].uniqueId === "GM2") {
                            self.start_game("GM2", cc.jsInstance.rows[i].fid);
                            break;
                        }
                    }
                }
                return;
            case "goldItem3": //金币场 高级场
                cc.jsInstance.audioManager.playBtnClick();
                if (cc.jsInstance.rows) {
                    for (var i = 0; i < cc.jsInstance.rows.length; i++) {
                        if (cc.jsInstance.rows[i].uniqueId === "GM3") {
                            self.start_game("GM3", cc.jsInstance.rows[i].fid);
                            break;
                        }
                    }
                }
                return;
            case "goldItem4": //金币场 富豪场
                cc.jsInstance.audioManager.playBtnClick();
                if (cc.jsInstance.rows) {
                    for (var i = 0; i < cc.jsInstance.rows.length; i++) {
                        if (cc.jsInstance.rows[i].uniqueId === "GM4") {
                            self.start_game("GM4", cc.jsInstance.rows[i].fid);
                            break;
                        }
                    }
                }
                return;
            case "buy_gold_2": // 金币不足对话框 的2元宝购买
                cc.jsInstance.audioManager.playBtnClick();
                if (self.checkbuyCon(2)) {
                    cc.jsInstance.msgpop.showMsg_text_close_cancle("您确定要消耗2个元宝兑换10000金币吗？", function() {
                        cc.jsInstance.audioManager.playBtnClick();
                        self.buy_gold("store_gold_2");
                    }, function() {});
                } else {
                    return;
                }

                return;
            case "buy_gold_10": // 金币不足对话框 的10元宝购买
                cc.jsInstance.audioManager.playBtnClick();
                if (self.checkbuyCon(10)) {
                    cc.jsInstance.msgpop.showMsg_text_close_cancle("您确定要消耗10个元宝兑换50000金币吗？", function() {
                        cc.jsInstance.audioManager.playBtnClick();
                        self.buy_gold("store_gold_10");
                    }, function() {});
                } else {
                    return;
                }

                return;
            case "buy_gold_20": // 金币不足对话框 的20元宝购买
                cc.jsInstance.audioManager.playBtnClick();
                if (self.checkbuyCon(20)) {
                    cc.jsInstance.msgpop.showMsg_text_close_cancle("您确定要消耗20个元宝兑换100000金币吗？", function() {
                        cc.jsInstance.audioManager.playBtnClick();
                        self.buy_gold("store_gold_20");
                    }, function() {});
                } else {
                    return;
                }

                return;
            case "buy_gold_30": // 金币不足对话框 的30元宝购买
                cc.jsInstance.audioManager.playBtnClick();
                if (self.checkbuyCon(30)) {
                    cc.jsInstance.msgpop.showMsg_text_close_cancle("您确定要消耗30个元宝兑换150000金币吗？", function() {
                        cc.jsInstance.audioManager.playBtnClick();
                        self.buy_gold("store_gold_30");
                    }, function() {});
                } else {
                    return;
                }

                return;
            case "closewait": //等待界面隐藏
                return;
        }
    },

    //g购买金币前检查
    checkbuyCon(money) {
        if (cc.jsInstance.pinfo.pinfo.money && parseInt(cc.jsInstance.pinfo.pinfo.money) < money) {
            cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("元宝不足！", function() {
                cc.jsInstance.audioManager.playBtnClick();
            });
            return false;
        }
        var subMoney = parseInt(cc.jsInstance.pinfo.pinfo.money) - money;
        if (parseInt(subMoney) < 3) { //兑换金币后，元宝数量少于3个，无法兑换！
            cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("兑换金币后，元宝数量少于3个，无法兑换！", function() {
                cc.jsInstance.audioManager.playBtnClick();
            });
            return false;
        }
        return true;
    },

    lookforTodayLeftTimes(GM, fid) {
        var self = this;
        cc.jsInstance.network.getSupplementaryCount(function(res) { //查询金币补助领取次数
            cc.logManager.info("今日金币补助领取次数"); //{result: 0,count: 1}
            if (res.result === 0) {
                self.count = parseInt(res.count) + 1;
                var times = cc.jsInstance.data.gameInfo.majiang.goldCon.supplementaryCoin.times; //一共能够领取的总次数
                if (parseInt(self.count) <= parseInt(times)) { //领取次数小于最大的领取次数，去领取
                    cc.jsInstance.msgpop.showMsg_buzhu("您的金币不足，系统赠送您8000金币，今天第" + self.count + "次领取，一共可领取" + times + "次/天！", function() {
                        cc.jsInstance.audioManager.playBtnClick();
                        cc.jsInstance.network.receiveSupplementaryCoin(function(res) { //领取救济金
                            cc.logManager.info("金币补助领取成功"); //{result: 0,count: 1}
                            if (res.result === 0) {
                                // self.start_games(GM, fid);
                                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("领取成功！", function() {});
                                return;
                            } else {
                                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle.showMsg(res.msg, function() {
                                    cc.jsInstance.audioManager.playBtnClick();
                                });
                                return;
                            }
                        });
                    }, function() {});

                } else {
                    self.start_games(GM, fid);
                }
            } else {
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle.showMsg(res.msg, function() {
                    cc.jsInstance.audioManager.playBtnClick();
                });
                return;
            }
        });
    },

    //开始游戏 
    start_game(GM, fid) {
        // if (cc.jsInstance.pinfo.vipTable != 0) { //有房间存在
        //     cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("您已加入其他牌桌，请退出后尝试！", function() {
        //         cc.jsInstance.audioManager.playBtnClick();
        //     });
        //     return;
        // }
        if (cc.jsInstance.data.sData && cc.jsInstance.data.vipTable) {
            cc.jsInstance.msgpop.showMsg_text_close_nocancle("您已加入其他牌桌，请退出后尝试！", function() {
                cc.jsInstance.audioManager.playBtnClick();
            });
            return;
        }
        var self = this;
        var coin = cc.jsInstance.pinfo.pinfo.coin;
        if (GM) {
            if (GM === "GM1") { //只有初级场才会提示赠送金币
                if (parseInt(coin) < parseInt(cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM1.coin)) { //金币不足最低场次的金币，去看能不能领取救济金
                    self.lookforTodayLeftTimes(GM, fid);
                    return;
                }
            }
        } else {
            if (!fid) {
                if (parseInt(coin) < parseInt(cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM1.coin)) { //金币不足最低场次的金币，去看能不能领取救济金
                    self.lookforTodayLeftTimes(GM, fid);
                    return;
                }
            }
        }

        self.start_games(GM, fid);
    },


    start_games(GM, fid) {
        var self = this;
        var coin = cc.jsInstance.pinfo.pinfo.coin;
        if (!fid) {
            if (parseInt(coin) > parseInt(cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM4.coin)) {
                if (cc.jsInstance.rows) {
                    for (var i = 0; i < cc.jsInstance.rows.length; i++) {
                        if (cc.jsInstance.rows[i].uniqueId === "GM4") {
                            fid = cc.jsInstance.rows[i].fid;
                            GM = "GM4";
                            break;
                        }
                    }
                }
            } else if (parseInt(coin) > parseInt(cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM3.coin)) {
                if (cc.jsInstance.rows) {
                    for (var i = 0; i < cc.jsInstance.rows.length; i++) {
                        if (cc.jsInstance.rows[i].uniqueId === "GM3") {
                            fid = cc.jsInstance.rows[i].fid;
                            GM = "GM3";
                            break;
                        }
                    }
                }
            } else if (parseInt(coin) > parseInt(cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM2.coin)) {
                if (cc.jsInstance.rows) {
                    for (var i = 0; i < cc.jsInstance.rows.length; i++) {
                        if (cc.jsInstance.rows[i].uniqueId === "GM2") {
                            fid = cc.jsInstance.rows[i].fid;
                            GM = "GM2";
                            break;
                        }
                    }
                }
            } else {

                if (parseInt(coin) < parseInt(cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM1.coin)) {
                    cc.jsInstance.msgpop.showMsg_buygold(2, function() {
                        if (self.checkbuyCon(2)) {
                            self.buy_gold("store_gold_2");
                        }
                    }, function() {}, function() {});
                    return;
                } else {
                    if (cc.jsInstance.rows) {
                        for (var i = 0; i < cc.jsInstance.rows.length; i++) {
                            if (cc.jsInstance.rows[i].uniqueId === "GM1") {
                                fid = cc.jsInstance.rows[i].fid;
                                GM = "GM1";
                                break;
                            }
                        }
                    }
                }
            }
        }
        if (GM) {
            if (GM === "GM1") {

                if (parseInt(coin) < parseInt(cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM1.coin)) {
                    cc.jsInstance.msgpop.showMsg_buygold(2, function() {
                        if (self.checkbuyCon(2)) {
                            self.buy_gold("store_gold_2");
                        }
                    }, function() {

                    }, function() {

                    });
                    return;
                }
                // if (parseInt(coin) > parseInt(cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM1.maxCoin)) { //大于初级场的最大值
                //     cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("您拥有的金币超过本场次最高金币限制，请前往其他场次进行游戏！", function() {
                //         cc.jsInstance.audioManager.playBtnClick();
                //     });
                //     return;
                // }
            } else if (GM === "GM2") {
                if (parseInt(coin) < parseInt(cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM2.coin)) {
                    cc.jsInstance.msgpop.showMsg_buygold(10, function() {

                        if (self.checkbuyCon(10)) {
                            self.buy_gold("store_gold_10");
                        }
                    }, function() {

                    }, function() {

                    });
                    return;
                }
            } else if (GM === "GM3") {
                if (parseInt(coin) < parseInt(cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM3.coin)) {
                    cc.jsInstance.msgpop.showMsg_buygold(20, function() {
                        if (self.checkbuyCon(20)) {
                            self.buy_gold("store_gold_20");
                        }
                    }, function() {

                    }, function() {

                    });
                    return;
                }
            } else if (GM === "GM4") {
                if (parseInt(coin) < parseInt(cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM4.coin)) {
                    cc.jsInstance.msgpop.showMsg_buygold(30, function() {
                        if (self.checkbuyCon(30)) {
                            self.buy_gold("store_gold_30");
                        }
                    }, function() {

                    }, function() {

                    });
                    return;
                }
            }
        }
        cc.jsInstance.network.joinMJPlayground(fid, function(res) {
            cc.logManager.info("开始游戏");
            // {"result":0,"fid":"5b165956f8dbc959607b5862","uniqueId":"GM1","playgroundCfg":{"room":{"base":800},"coin":8000,"cost":400,"maxCoin":50000}}
            if (res.result === 0) { //   124 表示在其他金币场，125 表示之前已经在目标金币场内；其他非0值表示进入失败
                cc.jsInstance.data.incontest = res.fid;
                cc.jsInstance.data.incontestUniqueId = res.uniqueId; //GM
                cc.logManager.info("进入等待匹配状态");
                self.waittingload.OpenWaitting(GM, function() {
                    cc.logManager.info("--------没有匹配到对手-----------");
                });
            } else if (res.result === 125) { //125   
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("已在牌桌内，点击确定返回牌桌！", function() {
                    cc.jsInstance.audioManager.playBtnClick();
                    cc.jsInstance.native.wxLoginNative();
                });

            } else {
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(res.msg, function() {
                    cc.jsInstance.audioManager.playBtnClick();
                    self.waittingload.leave_gold(fid);
                });
            }
        });
    },

    //元宝购买金币
    buy_gold(store_gold) {
        cc.jsInstance.network.buyCoinBySycee(store_gold, function(res) {
            if (res.result === 0) {
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("购买成功！", function() {
                    cc.jsInstance.audioManager.playBtnClick();
                });
            } else if (res.result === 1) {
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("元宝不足！", function() {
                    cc.jsInstance.audioManager.playBtnClick();
                });
                return;
            } else {
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(res.msg, function() {
                    cc.jsInstance.audioManager.playBtnClick();
                });
                return;
            }
        });
    },


    //分享获取金币 
    shard() {
        var self = this;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            cc.jsInstance.native.wxShareUrl("【大唐麻将】人人都在玩，不玩才怪！金币场上线啦，一个人也可以随时随地，想玩就玩！", function(ret) {
                    // cc.jsInstance.network.shareMJPlaygroud(function(res) {
                    //     cc.logManager.info("分享");
                    //     if (res.result === 0) {
                    //         cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("恭喜您分享成功，获得10000金币奖励！", function() {
                    //             cc.jsInstance.audioManager.playBtnClick();
                    //             self.node.getChildByName("gold_scrollview").getChildByName("shared").active = true;
                    //         });
                    //     } else if (res.result === 1) {
                    //         var date = cc.jsInstance.native.getFormatDate(res.timeOfShareMJPlaygroud + 20 * 60 * 60 * 1000); //时间格式化 返回[]
                    //         var con = "每隔20小时可分享仅可领取一次！\n下次可领取时间：" + date[0] + "-" + date[1] + "-" + date[2] + " " + date[3] + ":" + date[4] + ":" + date[5];
                    //         // var con = "您今天已分享领取过金币，请明天再来！"
                    //         cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(con, function() {
                    //             cc.jsInstance.audioManager.playBtnClick();
                    //             self.node.getChildByName("gold_scrollview").getChildByName("shared").active = true;
                    //         });
                    //     }
                    // });
                },
                function(ret) {

                });

        }

        // this.scheduleOnce(function() {

        // }, 0);
        self.shareMJPlaygroud();
    },

    shareMJPlaygroud() {
        var self = this;

        self.scheduleOnce(function() {
            cc.jsInstance.network.shareMJPlaygroud(function(res) { //每个20小时领取一次 10000 金币奖励
                cc.logManager.info("分享");
                if (res.result === 0) {
                    cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("恭喜您分享成功，获得10000金币奖励！", function() {
                        cc.jsInstance.audioManager.playBtnClick();
                        self.node.getChildByName("gold_scrollview").getChildByName("shared").active = true;
                    });
                } else if (res.result === 1) {
                    var date = cc.jsInstance.native.getFormatDate(res.timeOfShareMJPlaygroud + 20 * 60 * 60 * 1000); //时间格式化 返回[]
                    var con = "每隔20小时可分享仅可领取一次！\n下次可领取时间：" + date[0] + "-" + date[1] + "-" + date[2] + " " + date[3] + ":" + date[4] + ":" + date[5];
                    // var con = "您今天已分享领取过金币，请明天再来！"
                    cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(con, function() {
                        cc.jsInstance.audioManager.playBtnClick();
                        self.node.getChildByName("gold_scrollview").getChildByName("shared").active = true;
                    });
                }
            });
        }, 1);
    },


    // update (dt) {},
});