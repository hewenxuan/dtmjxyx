var Color = {
    WHITE: "#ffffff",
    GRAY: "#7C809D",
    BLUE: "#1664C3", //空闲中的颜色
    RED: "#FE0707", //游戏中的颜色
    REDAGREE: "#7E0C00", //离线的颜色
};

var State = {
    kongxian: "空闲中",
    youxi: "游戏中",
    lixian: "离线", //正常红色
};

cc.Class({
    extends: cc.Component,

    properties: {
        //头像
        head: {
            type: cc.Node,
            default: null,
        },
        //名字
        nickname: {
            type: cc.Label,
            default: null,
        },
        //id
        id: {
            type: cc.Label,
            default: null,
        },
        //状态
        state: {
            type: cc.Label,
            default: null,
        },
        //默认头像
        defaultIcon: {
            type: cc.SpriteFrame,
            default: null,
        },

        tichu: {
            type: cc.Node,
            default: null,
        },
        setM: {
            type: cc.Node,
            default: null,
        },
        cancelM: {
            type: cc.Node,
            default: null,
        },
        zhiwu: {
            type: cc.Label,
            default: null,
        }
    },
    // manager  =1管理员  不存在就是普通成员 
    onLoad() {},
    //数据表绑定到ui上 
    initData(data) {
        // cc.logManager.info("绑定数据到ui上=", data);
        this.data = data;

        if (data.headimgurl) {
            cc.jsInstance.native.setHeadIcon(this.head, data.headimgurl); //公用设置头像方法
        } else {
            this.head.getComponent(cc.Sprite).spriteFrame = this.defaultIcon;
        }
        this.nickname.string = unescape(data.nickname).substr(0, 6);
        this.id.string = data.uid;

        this.setM.active = false;
        this.cancelM.active = false;

        this.tichu.active = false;
        this.zhiwu.node.active = false;


        var Level = cc.jsInstance.clubControler.getMLevel();
        if (Level === 10) { //房主
            if (data.manager && data.manager === 1) {
                this.cancelM.active = true;
            } else {
                this.setM.active = true;
            }
        } else if (Level === 9) { //管理员

        }
        var fangzhuId = cc.jsInstance.clubControler.getCurrClubData().owner;
        if (fangzhuId === data.uid) { //房主
            this.zhiwu.node.active = true;
            this.zhiwu.string = "房主";
            this.setM.active = false;
            this.cancelM.active = false;
        } else if (data.manager && data.manager === 1) { //管理员
            this.zhiwu.node.active = true;
            this.zhiwu.string = "管理员";
        } else { //普通成员
            this.tichu.active = true;
        }


        if (data.online == 0 && data.offline == 0) {
            this.setNodeColor(this.state.node, "离线");
        } else if (data.online - data.offline > 0) {
            if (data.ingame && data.ingame.gameid) { //游戏中
                this.setNodeColor(this.state.node, "游戏中");
            } else { //空闲中
                this.setNodeColor(this.state.node, "空闲中");
            }
        } else { // 离线
            var date = cc.jsInstance.native.getFormatDate(data.offline); //时间格式化 返回[]
            var datestr = date[0] + "/" + date[1] + "/" + date[2];
            this.setNodeColor(this.state.node, "上次登录时间：" + datestr);
        }
    },

    setNodeColor(node, text) {
        if (text === "空闲中") {
            node.color = cc.hexToColor(Color.BLUE);
        } else if (text === "游戏中") {
            node.color = cc.hexToColor(Color.RED);
        } else { //离线和上次登录时间 
            node.color = cc.hexToColor(Color.REDAGREE);
        }
        node.getComponent(cc.Label).string = text + "";
    },

    //点击踢出
    click_tichu() {
        var self = this;
        cc.logManager.info("踢出");
        cc.jsInstance.msgpop.showMsg_text_close_cancle("您确定把" + unescape(this.data.nickname).substr(0, 6) + "(" + this.data.uid + ")踢出亲友圈吗？", function() {
            cc.jsInstance.network.kickClubMember(self.data.uid, function(rtn) {
                if (rtn.result === 0) {
                    self.node.removeFromParent();
                } else {
                    cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(rtn.msg);
                }
            });
        });
    },

    click_setM() {
        var self = this;
        var text = "确认将" + unescape(this.data.nickname).substr(0, 6) + "(" + this.data.uid + ")任命为亲友圈\n管理员吗？"
        cc.jsInstance.msgpop.showMsg_club_M(text, function() {
            var params = {
                uid: self.data.uid
            }
            cc.jsInstance.network.setClubManagerC2S(params, function(rtn) {
                //刷新列表
                self.setM.active = false;
                self.cancelM.active = true;
                self.tichu.active = false;
                self.zhiwu.node.active = true;
                self.zhiwu.string = "管理员";
            });

        });
    },

    click_cancelM() {
        var self = this;
        var text = "您确定把" + unescape(this.data.nickname).substr(0, 6) + "(" + this.data.uid + ")降为普通成员吗？"
        cc.jsInstance.msgpop.showMsg_text_noclose(text, function() {
            var params = {
                uid: self.data.uid
            }
            cc.jsInstance.network.removeClubManagerC2S(params, function(rtn) {
                //刷新列表
                self.setM.active = true;
                self.cancelM.active = false;
                self.tichu.active = true;
                self.zhiwu.node.active = false;
            });
        });
    },

});