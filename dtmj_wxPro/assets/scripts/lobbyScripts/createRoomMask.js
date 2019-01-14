cc.Class({
    extends: cc.Component,
    properties: {
        //返回
        backBtn: {
            type: cc.Button,
            default: null,
        },

        rechargeMask: {
            type: cc.Node,
            default: null,
        },

        wanfas_parent: {
            default: null,
            type: cc.Node,
            serializable: true,
        },
        wanfaMasks_parent: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad() {
        this.init();
    },

    backClick: function() {
        cc.jsInstance.audioManager.playBtnClick();
        this.node.active = false;
    },

    //是不是从亲友圈玩法设置进来的   bool 是否从亲友圈进来   bool1是否修改所有牌桌玩法  修改牌桌玩法的某个牌桌编号
    isClub_In(bool, bool1, num) {
        this.isClub = bool;
        this.isClubAll = bool1;
        if (num) {
            this.isClub_tableNum = num;
        }
    },

    commitBtnClick: function(e, custom) {
        var self = this;
        if (cc.jsInstance.data.sData && cc.jsInstance.data.vipTable) {
            cc.jsInstance.msgpop.showMsg_text_close_nocancle("包厢已经创建，请点击返回游戏！", function() {
                cc.jsInstance.audioManager.playBtnClick();
                self.node.active = false;
            });
            return;
        }
        //切换场景
        cc.jsInstance.audioManager.playBtnClick();
        cc.logManager.info("click:" + custom);
        switch (custom) {
            case "tdh": //推倒胡
                self.param = cc.jsInstance.CreatRoomParam.tdhparam;
                cc.sys.localStorage.setItem("wanfa", "tdh");
                cc.logManager.info("cc.jsInstance.CreatRoomParam.tdhparam----", cc.jsInstance.CreatRoomParam.tdhparam);
                break;
            case "tdh2": //二人推倒胡
                self.param = cc.jsInstance.CreatRoomParam.tdh2param;
                cc.sys.localStorage.setItem("wanfa", "tdh2");
                cc.logManager.info("cc.jsInstance.CreatRoomParam.tdh2param----", cc.jsInstance.CreatRoomParam.tdh2param);
                break;
            case "kd": //抠点
                self.param = cc.jsInstance.CreatRoomParam.kdparam;
                cc.sys.localStorage.setItem("wanfa", "kd");
                cc.logManager.info("cc.jsInstance.CreatRoomParam.kdparam----", cc.jsInstance.CreatRoomParam.kdparam);
                break;
            case "kd2": //二人抠点
                self.param = cc.jsInstance.CreatRoomParam.kd2param;
                cc.sys.localStorage.setItem("wanfa", "kd2");
                cc.logManager.info("cc.jsInstance.CreatRoomParam.kd2param----", cc.jsInstance.CreatRoomParam.kd2param);
                break;
            case "gsj": //拐三角
                self.param = cc.jsInstance.CreatRoomParam.gsjparam;
                cc.sys.localStorage.setItem("wanfa", "gsj");
                cc.logManager.info("cc.jsInstance.CreatRoomParam.gsjparam----", cc.jsInstance.CreatRoomParam.gsjparam);
                break;
            case "jdddz": //经典斗地主
                self.param = cc.jsInstance.CreatRoomParam.jdddzparam;
                cc.sys.localStorage.setItem("wanfa", "jdddz");
                cc.logManager.info("cc.jsInstance.CreatRoomParam.jdddzparam----", cc.jsInstance.CreatRoomParam.jdddzparam);
                break;
            case "pokerPDK": //跑得快
                self.param = cc.jsInstance.CreatRoomParam.pokerPDKparam;
                cc.sys.localStorage.setItem("wanfa", "pokerPDK");
                cc.logManager.info("cc.jsInstance.CreatRoomParam.pokerPDKparam----", cc.jsInstance.CreatRoomParam.pokerPDKparam);
                break;
            case "jz": //晋中
                self.param = cc.jsInstance.CreatRoomParam.jzparam;
                cc.sys.localStorage.setItem("wanfa", "jz");
                cc.logManager.info("cc.jsInstance.CreatRoomParam.jzparam----", cc.jsInstance.CreatRoomParam.jzparam);
                break;
            case "ls": //立四
                self.param = cc.jsInstance.CreatRoomParam.lsparam;
                cc.sys.localStorage.setItem("wanfa", "ls");
                cc.logManager.info("cc.jsInstance.CreatRoomParam.lsparam----", cc.jsInstance.CreatRoomParam.lsparam);
                break;
            case "tdh3": //三人推倒胡
                self.param = cc.jsInstance.CreatRoomParam.tdh3param;
                cc.sys.localStorage.setItem("wanfa", "tdh3");
                cc.logManager.info("cc.jsInstance.CreatRoomParam.tdh3param----", cc.jsInstance.CreatRoomParam.tdh3param);
                break;
            case "ankang": //安康一五九
                self.param = cc.jsInstance.CreatRoomParam.ankangparam;
                cc.sys.localStorage.setItem("wanfa", "ankang");
                cc.logManager.info("cc.jsInstance.CreatRoomParam.ankangparam----", cc.jsInstance.CreatRoomParam.ankangparam);
                break;
            case "dafangpao": //打放炮
                self.param = cc.jsInstance.CreatRoomParam.dafangpaoparam;
                cc.sys.localStorage.setItem("wanfa", "dafangpao");
                cc.logManager.info("cc.jsInstance.CreatRoomParam.dafangpaoparam----", cc.jsInstance.CreatRoomParam.dafangpaoparam);
                break;
        }
        if (!self.param) {
            cc.jsInstance.block.hide();
            cc.jsInstance.msgpop.showMsg_text_close_nocancle("没有获取到参数配置！", function() {
                cc.jsInstance.audioManager.playBtnClick();
            });
            return;
        }
        this.node.active = false;
        if (this.isClub) { //从俱乐部点进来的 不加入房间
            if (this.isClubAll) {
                this.node.parent.getChildByName("clubroom").getComponent("clubroom").wanfa_click_callback(self.param, this.isClubAll, custom);
            } else {
                this.node.parent.getChildByName("clubroom").getComponent("clubroom").wanfa_click_callback(self.param, this.isClubAll, custom, this.isClub_tableNum);
            }
            return;
        }
        cc.logManager.info("要去创建房间了！！！");
        // cc.jsInstance.block.show("创建房间...");
        if (self.param.clubId) { //修改别人亲友圈玩法后加入牌桌，这个参数不知道怎么多了这些，暂时先删除，
            delete self.param.clubId;
            delete self.param.clubName;
            delete self.param.clubUid;
            delete self.param.isClub;
            delete self.param.desktop;
            delete self.param.groupid;
            delete self.param.roomid;
            delete self.param.gameid;
        }
        cc.jsInstance.network.createVipTable(self.param,
            function(rtn) {
                if (rtn.result == 0) {
                    cc.jsInstance.data.vipTable = rtn.vipTable;
                    cc.logManager.info("房间号=" + rtn.vipTable);
                    cc.jsInstance.network.joinGame(rtn.vipTable, false, function(rtn) {
                        if (rtn.result === 0) { //加入成功
                            cc.jsInstance.pinfo.vipTable = 1;
                        }
                    });
                } else if (rtn.result == 1) {
                    cc.jsInstance.block.hide();
                    // cc.jsInstance.msgpop.showMsg_text_close_nocancle("创建失败,请重新尝试！", function() {
                    //     cc.jsInstance.audioManager.playBtnClick();
                    // });
                    self.rechargeMask.getComponent("rechargeMask").initData(false); //是不是亲友圈页面弹出的
                    cc.jsInstance.native.setScaleAction(self.rechargeMask);
                } else if (rtn.result == 202) {
                    cc.jsInstance.block.hide();
                    cc.jsInstance.msgpop.showMsg_text_close_nocancle("您的元宝数只满足当前房间数量或您的房间数量达到上限！", function() {
                        cc.jsInstance.audioManager.playBtnClick();
                        self.rechargeMask.getComponent("rechargeMask").initData(false); //是不是亲友圈页面弹出的
                        cc.jsInstance.native.setScaleAction(self.rechargeMask);
                    });
                }
            });
    },

    start() {},

    //选择点击玩法
    clickwanfa(e, custom) {
        var self = this;
        cc.logManager.info("click:" + custom);
        cc.jsInstance.audioManager.playBtnClick();
        self.setwanfa(custom);
    },

    //设置玩法
    setwanfa(custom, first) {
        var self = this;
        if (self.wanfas_parent.childrenCount > 1) {
            for (var i = 0; i < self.wanfaMasks_parent.childrenCount; i++) {
                if (self.wanfaMasks_parent.children[i].name === custom) {
                    self.wanfaMasks_parent.children[i].active = true;
                } else {
                    self.wanfaMasks_parent.children[i].active = false;
                    if (self.wanfaMasks_parent.children[i].name === "dt_fengexian" || self.wanfaMasks_parent.children[i].name === "typeScrollView") {
                        self.wanfaMasks_parent.children[i].active = true;
                    }
                }
            }

            for (var i = 0; i < self.wanfas_parent.childrenCount; i++) {
                if (self.wanfas_parent.children[i].name === custom) {
                    self.wanfas_parent.children[i].getChildByName("chose").active = true;
                    //滑动到当前项
                    if (first) {
                        self.wanfas_parent.y = (-1) * (self.wanfas_parent.children[i].y + self.wanfas_parent.children[i].height / 2);
                    }
                } else {
                    self.wanfas_parent.children[i].getChildByName("chose").active = false;
                }
            }
        }
    },

    //初始化玩法
    init() {
        var wanfa = cc.sys.localStorage.getItem("wanfa"); //从缓存取用户信息
        if (!wanfa) {
            cc.sys.localStorage.setItem("wanfa", "tdh"); //加入缓存
            wanfa = cc.sys.localStorage.getItem("wanfa");
        }
        cc.logManager.info("设置玩法参数：" + wanfa);
        this.setwanfa(wanfa, true);

    },
});