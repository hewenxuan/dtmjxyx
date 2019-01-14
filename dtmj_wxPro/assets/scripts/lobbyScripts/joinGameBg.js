cc.Class({
    extends: cc.Component,
    properties: {
        closeBtn: {
            type: cc.Button,
            default: null,
        },
        roomNumLab: {
            type: cc.Label,
            default: null,
        },
        roomNumTitle: {
            type: cc.Node,
            default: null,
        },
        roomNumTitle_club: {
            type: cc.Node,
            default: null,
        },
    },

    closeBtnClick: function() {
        cc.jsInstance.audioManager.playBtnClick();
        this.node.active = false;
    },

    numBtnClick(target, evtData) {
        cc.jsInstance.audioManager.playBtnClick();
        this.changeLabel(evtData);
    },

    setRoomNumTitle(str) { //tableid  clubid
        this.roomNumLab.string = "";
        if (str === "clubid") {
            this.joinID = 0;
            this.roomNumTitle.active = false;
            this.roomNumTitle_club.active = true;
        } else {
            this.joinID = 1;
            this.roomNumTitle.active = true;
            this.roomNumTitle_club.active = false;
        }
    },

    changeLabel(target) {
        var self = this;
        if (target == "clear") {
            this.roomNumLab.string = "";
        } else if (target == "back") {
            var str = this.roomNumLab.string;
            str = str.slice(0, str.length - 1);
            this.roomNumLab.string = str;
        } else {
            this.roomNumLab.string = this.roomNumLab.string + target;
        }
        var srtLength = 7;
        if (this.joinID === 0) {
            srtLength = 6;
        }
        if (this.roomNumLab.string.length >= srtLength) {
            this.node.active = false;
            if (this.joinID === 0) { //加入亲友圈
                self.join_club(this.roomNumLab.string);
            } else { //加入牌桌
                self.join_game(this.roomNumLab.string);
            }
            this.roomNumLab.string = "";
        }
        if (this.joinID === 0) { //亲友圈
            this.roomNumTitle_club.active = this.roomNumLab.string == ""
        } else {
            this.roomNumTitle.active = this.roomNumLab.string == ""
        }

    },
    join_game(num) {
        var self = this;
        cc.jsInstance.network.getWanfaByTableId(function(rtn) {
            if (rtn.result === 0) { //获取玩法成功 判断该玩法小程序有没有
                var rule = rtn.createPara; //规则
                var wanfa = cc.jsInstance.WanfaStrFormat.setFormatRule(rule, true); //[]
                if (wanfa) {
                    cc.jsInstance.network.joinGame(num, false, function(rtn) {
                        if (rtn.result === 0) { //加入成功
                            cc.jsInstance.pinfo.vipTable = 1;
                        } else {
                            self.roomNumLab.string = "";
                        }
                    });
                } else {
                    cc.jsInstance.msgpop.showMsg_text_close_nocancle("该牌桌玩法小游戏暂时不支持", function() {
                        cc.jsInstance.audioManager.playBtnClick();
                        cc.sys.localStorage.setItem("ShareRoomid", -1); //改变 如果是分享进来的房间号，置空
                    })
                }
            } else {
                cc.jsInstance.msgpop.showMsg_text_close_nocancle(rtn.msg)
            }
        }, parseInt(num));

        // cc.jsInstance.network.joinGame(num, false, function(rtn) {
        //     if (rtn.result === 0) { //加入成功
        //         cc.jsInstance.pinfo.vipTable = 1;
        //     } else {
        //         self.roomNumLab.string = "";
        //     }
        // });
    },

    join_club(num) {
        var self = this;
        this.node.active = false;
        //进入这个亲友圈
        cc.jsInstance.network.joinClub(parseInt(num), function(rtn) {
            cc.logManager.info("加入俱乐部");
            if (rtn.result === 0) {
                var text = "申请加入亲友圈" + num + "成功，请耐心等待房主审核通过。";
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(text);
            } else {
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(rtn.msg);
            }
        });

    },


    setnum() {
        var num = cc.sys.localStorage.getItem("ClipboardData");
        if (num && num.length === 7 || num.length === 6) {
            this.roomNumLab.string = "";
            this.changeLabel(num);
        } else {
            cc.logManager.info("剪切板内容格式不是牌桌号码格式");
        }
    },

    onLoad() {
        this.roomNumLab.string = "";
    },
});