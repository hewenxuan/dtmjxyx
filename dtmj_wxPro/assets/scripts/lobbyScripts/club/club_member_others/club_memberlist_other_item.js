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
        fangzhu: {
            type: cc.Node,
            default: null,
        },

        manager: {
            type: cc.Node,
            default: null,
        },
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
        this.manager.active = false;
        this.fangzhu.active = false;
        // var level = cc.jsInstance.clubControler.getMLevel(cc.jsInstance.clubId_Now, data.uid);
        // if (level === 10) { //房主
        //     this.fangzhu.active = true;
        // } else if (level === 9) { //管理员
        //     this.manager.active = true;
        // } else if (level === 0) { //普通玩家

        // }
        var fangzhuId = cc.jsInstance.clubControler.getCurrClubData().owner;
        if (fangzhuId === data.uid) { //房主
            this.fangzhu.active = true;
        } else if (data.manager && data.manager === 1) { //管理员
            this.manager.active = true;
        } else {

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

});