cc.Class({
    extends: cc.Component,

    properties: {
        //
        con_lable: {
            type: cc.Label,
            default: null,
        },
        //规则
        guize_label: {
            type: cc.Label,
            default: null,
        },
        //头像
        head_node: {
            type: cc.Node,
            default: null,
        },
        //默认头像
        defaultIcon: {
            type: cc.SpriteFrame,
            default: null,
        },
    },



    onLoad() {

    },
    //club :{id: 286651, name: "模拟器1", headimgurl: null}
    // desktop:{desktop: 1, tableid: "59527559", players: Array(1), createPara: {…}}
    // inviter :{uid: 7638895, headimgurl: "", nickname: "oXL3Jrtk", ingame: {…}, online: 1537856157918, …}
    initData(data, clubroom) {
        if (this.node.parent.getChildByName("goldContest").getChildByName("waitting").active) {
            return;
        }
        this.node.active = true;
        if (this.data && this.data === data) { //邀请一次会走两遍，暂时没找到原因 
            return;
        }
        this.clubroom = clubroom;
        this.data = data;
        this.tableid = data.desktop.tableid;
        this.groupid = data.club.id;
        this.desktop = data.desktop.desktop;
        var rule = data.desktop.createPara;
        this.wanfa = cc.jsInstance.WanfaStrFormat.setFormatRule(rule, true); //[]
        if (!this.wanfa) {
            this.wanfa = ["暂无该玩法"];
        }
        var guize = this.getGuizeStr(this.wanfa);
        cc.logManager.info("牌桌规则：" + guize);
        this.guize_label.string = guize;
        this.con_lable.string = unescape(data.inviter.nickname).substr(0, 6) + ",邀请您加入'" + unescape(data.club.name).substr(0, 6) + "' 的亲友圈" + data.desktop.desktop + "号桌";
        if (data.inviter.headimgurl) {
            cc.jsInstance.native.setHeadIcon(this.head_node, data.inviter.headimgurl); //公用设置头像方法
        } else {
            this.head_node.getComponent(cc.Sprite).spriteFrame = this.defaultIcon;
        }
    },

    getGuizeStr(wanfa) {
        var str = "规则：";
        for (var i = 0; i < wanfa.length; i++) {
            if (i < wanfa.length - 1) {
                str = str + wanfa[i] + ","
            } else {
                str = str + wanfa[i] + "."
            }

        }

        return str;
    },

    close_click() {
        this.data = {};
        this.node.active = false;
    },

    jujue_click() {
        cc.logManager.info("拒绝");
        this.data = {};
        this.node.active = false;
    },

    agree_click() {
        cc.logManager.info("同意");
        this.data = {};
        this.node.active = false;
        // if (cc.jsInstance.pinfo.vipTable != 0) { //有房间
        //     cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("包厢已经创建，请点击返回游戏", function() {
        //         cc.jsInstance.audioManager.playBtnClick();
        //     });
        //     return;
        // }
        if (cc.jsInstance.data.sData && cc.jsInstance.data.vipTable) {
            cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("包厢已经创建，请点击返回游戏！", function() {
                cc.jsInstance.audioManager.playBtnClick();
            });
            return;
        }
        if (this.wanfa && this.wanfa[0] === "暂无该玩法") {
            cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("暂无该玩法,请前往客户端进行游戏", function() {
                cc.jsInstance.audioManager.playBtnClick();
            });
            return;
        }
        this.JoinTable(this.tableid, this.groupid, this.desktop);
    },

    //加入牌桌{"tableid":53955741,"gameid":"majiang","groupid":"197720","roomid":"club","desktop":1}
    JoinTable(tableid, groupid, desktop) {
        var self = this;
        cc.jsInstance.network.JoinGameClub(tableid, groupid, desktop, function(rtn) {
            if (rtn.result === 0) { //加入牌桌成功
                cc.jsInstance.block.show();
                cc.jsInstance.pinfo.vipTable = 1;
                cc.logManager.info("加入牌桌成功！");
            } else {
                if (rtn.result === 39) {
                    cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("该牌桌房间的人数已满");
                } else if (rtn.result === 41) {
                    cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("牌桌不存在");
                } else if (rtn.result === 21) {
                    self.clubroom.node.active = true;
                    self.clubroom.getJoinedClubs(groupid);
                    cc.jsInstance.bayWindow.openBayWindow("亲友圈已被房主暂时关闭，快去喊他打开亲友圈吧！");
                    return;
                } else {
                    cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(rtn.msg);
                }
            }
        });
    },


});