var Color = {
    BLUE: "#2366B9",
    RED: "#913429",
};
cc.Class({
    extends: cc.Component,
    properties: {
        //一共4个，前三个如果有自己亲友圈要显示的 ， 没有则隐藏
        content: {
            type: cc.Node,
            default: null,
        },
        //所有亲友圈
        club_scrollew: {
            type: cc.Node,
            default: null,
        },
        club_scrollew_bg: {
            type: cc.Node,
            default: null,
        },
        clubName: {
            type: cc.Label,
            default: null,
        },
        //修改亲友圈名称页面
        club_rename: {
            type: cc.Node,
            default: null,
        },
        club_name: {
            type: cc.EditBox,
            default: null,
        },
        //第一次修改显示这个
        tips1: {
            type: cc.Node,
            default: null,
        },
        //第二次及以上修改需要显示这个
        tips2: {
            type: cc.Node,
            default: null,
        },

        xiugaiOne: {
            type: cc.Toggle,
            default: null,
        },
        chakanfangkaOne: {
            type: cc.Toggle,
            default: null,
        },
        peop_littleOne: {
            type: cc.Toggle,
            default: null,
        },
        openclubOne: {
            type: cc.Toggle,
            default: null,
        },
        //所有亲友圈父节点
        club_content: {
            type: cc.Node,
            default: null,
        },
        //默认头像
        defaultIcon: {
            type: cc.SpriteFrame,
            default: null,
        },

        title: {
            type: cc.Label,
            default: null,
        },

    },
    onLoad() {

    },

    //haveMyclub有没有自己的亲友圈，没有隐藏上面部分   bool是不是第一次修改 
    initData(clubroom, isMyclub, clubs, mamager) {

        var titleCon = cc.jsInstance.clubControler.getCurrClubData().name;
        this.title.string = unescape(titleCon).substr(0, 6) + "的亲友圈";
        this.mamager = mamager;
        this.isMyclub = isMyclub;

        this.clubroom = clubroom;
        this.node.active = true;
        var self = this;
        this.content.getChildByName("item1").active = false;
        this.content.getChildByName("item2").active = false;
        this.content.getChildByName("item3").active = false;
        this.content.getChildByName("item4").active = true;
        if (isMyclub || mamager) {
            this.content.getChildByName("item1").active = true;
            this.content.getChildByName("item2").active = true;
            this.content.getChildByName("item3").active = true;
            this.scheduleOnce(function() { //暂时用定时器显示，上面那个正常的会失效，暂时不知道什么原因
                this.club_scrollew.height = 245; //245 有人数不足立刻开局的时候为245  否则345
                this.club_scrollew.getChildByName("view").height = 245; //245
                this.club_scrollew_bg.height = 245;
            }, 0);
            this.getMyClub();
        } else {
            this.scheduleOnce(function() { //暂时用定时器显示，上面那个正常的会失效，暂时不知道什么原因
                this.club_scrollew.height = 500;
                this.club_scrollew.getChildByName("view").height = 500;
                this.club_scrollew_bg.height = 500;
            }, 0);
        }
        this.club_scrollew.getComponent(cc.ScrollView).scrollToTop(0);


        this.club_content.getChildByName("club_set_item1").active = false;
        this.club_content.getChildByName("club_set_item2").active = false;
        this.club_content.getChildByName("club_set_item3").active = false;
        this.club_content.getChildByName("club_set_item4").active = false;
        this.club_content.getChildByName("club_set_item5").active = false;
        var i = 1;
        if (isMyclub) { //是自己亲友圈显示，不是就不显示
            for (var key in clubs) {
                if (cc.jsInstance.pinfo.pinfo.uid === clubs[key].owner) {
                    var item = this.club_content.getChildByName("club_set_item1");
                    item.active = true;
                    item.getChildByName("dt_button_green_little").active = isMyclub;
                    item.getChildByName("dt_button_red_little").active = !isMyclub;
                    self.setItemData(item, clubs[key]);
                    break;
                }
            }
        }
        for (var key in clubs) {
            if (cc.jsInstance.pinfo.pinfo.uid === clubs[key].owner) {
                continue;
            }
            i++;
            var item = this.club_content.getChildByName("club_set_item" + i);
            item.active = true;

            if (mamager && clubs[key]._id === clubroom.clubInfo.id) { //管理员管理的亲友圈
                item.getChildByName("dt_button_green_little").active = true;
            } else {
                item.getChildByName("dt_button_green_little").active = false;
            }

            self.setItemData(item, clubs[key]);
        }
    },

    //获取自己亲友圈信息
    getMyClub() {
        var self = this;
        cc.jsInstance.network.getMyClub(function(rtn) {
            cc.logManager.info("获取我自己的亲友圈详情");
            if (rtn.result === 0) { // 
                if (rtn.club) {
                    self.setClubPro(rtn.club);
                }
            } else {
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(rtn.msg);
            }
        });
    },

    setClubPro(club) {
        var self = this;
        // var settings = club.settings;
        this.modifyNameCounter = club.modifyNameCounter;
        if (club.modifyNameCounter) {
            this.tips1.active = false;
            this.tips2.active = true;
        } else {
            this.tips1.active = true;
            this.tips2.active = false;
        }
        this.clubMoney = club.money;
        this.clubName.string = unescape(club.name).substr(0, 6);

        if (club.settings && typeof(club.settings.hideCard) != "undefined") {
            this.chakanfangkaOne.isChecked = !club.settings.hideCard;
        } else {
            this.chakanfangkaOne.isChecked = true;
        }

        var ischeckFangkaOne = self.chakanfangkaOne.isChecked;
        if (ischeckFangkaOne) {
            self.chakanfangkaOne.node.parent.getChildByName("dt_setting_sllider_1").x = 0;
        } else {
            self.chakanfangkaOne.node.parent.getChildByName("dt_setting_sllider_1").x = self.chakanfangkaOne.node.parent.getChildByName("dt_setting_sllider_1").width * (-1);
        }


        if (club.settings && typeof(club.settings.lockWays) != "undefined") {
            this.xiugaiOne.isChecked = !club.settings.lockWays;
        } else {
            this.xiugaiOne.isChecked = true;
        }


        var ischeckXiugaiOne = self.xiugaiOne.isChecked;
        if (ischeckXiugaiOne) {
            self.xiugaiOne.node.parent.getChildByName("dt_setting_sllider_1").x = 0;
        } else {
            self.xiugaiOne.node.parent.getChildByName("dt_setting_sllider_1").x = self.xiugaiOne.node.parent.getChildByName("dt_setting_sllider_1").width * (-1);
        }


        if (club.settings && typeof(club.settings.immediately) != "undefined") {
            this.peop_littleOne.isChecked = club.settings.immediately;
        } else {
            this.peop_littleOne.isChecked = true;
        }

        var ischeckPeop_littleOne = self.peop_littleOne.isChecked;
        if (ischeckPeop_littleOne) {
            self.peop_littleOne.node.parent.getChildByName("dt_setting_sllider_1").x = 0;
        } else {
            self.peop_littleOne.node.parent.getChildByName("dt_setting_sllider_1").x = self.peop_littleOne.node.parent.getChildByName("dt_setting_sllider_1").width * (-1);
        }

        if (club.settings && typeof(club.settings.closed) != "undefined") {
            this.openclubOne.isChecked = !club.settings.closed;
        } else {
            this.openclubOne.isChecked = true;
        }
        var ischeckopenclubOne = self.openclubOne.isChecked;
        if (ischeckopenclubOne) {
            self.openclubOne.node.parent.getChildByName("dt_setting_sllider_1").x = 0;
        } else {
            self.openclubOne.node.parent.getChildByName("dt_setting_sllider_1").x = self.openclubOne.node.parent.getChildByName("dt_setting_sllider_1").width * (-1);
        }

    },

    setItemData(item, data) {
        var self = this;
        item.data = data;
        var textColor = cc.hexToColor(Color.RED);
        var selfClub = false;
        if (data.owner === cc.jsInstance.pinfo.pinfo.uid) {
            textColor = cc.hexToColor(Color.BLUE);
            selfClub = true;
        }
        var name = item.getChildByName("name");
        name.color = textColor;
        name.getComponent(cc.Label).string = unescape(data.name).substr(0, 6);

        var clubId = item.getChildByName("clubId");
        clubId.color = textColor;
        clubId.getComponent(cc.Label).string = "亲友圈ID:" + data._id;
        // clubId.active = cc.jsInstance.remoteCfg.isShowClubId; //根据配置是否显示亲友圈id

        // item.getChildByName("dt_button_green_little").active = selfClub;
        // item.getChildByName("dt_button_red_little").active = !selfClub;

        if (data.headimgurl) {
            cc.jsInstance.native.setHeadIcon(item.getChildByName("head").getChildByName("playhead"), data.headimgurl); //公用设置头像方法
        } else {
            item.getChildByName("head").getChildByName("playhead").getComponent(cc.Sprite).spriteFrame = this.defaultIcon;
        }
    },
    close() {
        var self = this;
        cc.jsInstance.audioManager.playBtnClick();
        self.node.active = false;
    },
    //修改亲友圈名称
    club_rename_click() {
        cc.jsInstance.audioManager.playBtnClick();
        this.club_rename.active = true;
        this.club_name.getComponent(cc.EditBox).string = "";
    },
    //关闭修改亲友圈名称页面
    close_club_rename() {
        cc.jsInstance.audioManager.playBtnClick();
        this.club_rename.active = false;
    },
    rename_club() {
        var self = this;
        cc.jsInstance.audioManager.playBtnClick();
        //获取修改的名字 提交服务器修改亲友圈名称
        var name = this.club_name.getComponent(cc.EditBox).string;
        if (name.length <= 0) {
            cc.jsInstance.bayWindow.openBayWindow("名称不能为空！");
            return;
        }
        if (!/^[\w\u4e00-\u9fa5]+$/.test(name)) {
            cc.jsInstance.bayWindow.openBayWindow("名称字符有误，请重新输入。");
            self.club_name.getComponent(cc.EditBox).string = "";
            return;
        }
        var length = 0
        var newName = "";
        for (var i in name) {
            var str = name[i];
            if (/^[\w]+$/.test(str)) {
                length += 1
            }
            if (/^[\u4e00-\u9fa5]+$/.test(str)) {
                length += 2
            }
            if (length <= 12) {
                newName += str;
            }
        }

        if (length > 12) {
            cc.jsInstance.bayWindow.openBayWindow("名称过长，中文最多6个字符，英文或数字最多12个字符。");
            return;
        }

        if (this.modifyNameCounter && this.modifyNameCounter > 0) {
            if (this.clubMoney < 30) {
                cc.jsInstance.bayWindow.openBayWindow("房卡不足。");
                return;
            } else {
                cc.jsInstance.msgpop.showMsg_text_noclose("是否消耗30房卡修改亲友圈名称？", function() {
                    self.modifyClubName(name);
                });
            }
        } else {
            self.modifyClubName(name);
        }


    },
    //改名字
    modifyClubName(name) {
        var self = this;
        cc.jsInstance.network.keywordTest(name, function(rtn) {
            if (rtn.result === 0) { //检测名字通过
                cc.jsInstance.network.modifyClubName(name, function(rtn) {
                    if (rtn.result === 0) { // 改名成功
                        cc.jsInstance.bayWindow.openBayWindow("修改亲友圈名称成功！");
                        self.clubName.string = name;
                        if (self.isMyclub) {
                            cc.jsInstance.MyClubNewName = name;
                        }
                        self.title.string = name + "的亲友圈";
                        // self.clubroom.getJoinedClubs(); //刷新亲友圈名字
                        self.clubroom.rename_club(name);
                        // self.getMyClub(); //重新获取自己亲友圈信息
                        self.club_rename.active = false;
                    }
                    self.club_name.getComponent(cc.EditBox).string = "";
                });
            } else {
                cc.jsInstance.bayWindow.openBayWindow("您的新亲友圈名称中有违规字符，请重新输入。");
                self.club_name.getComponent(cc.EditBox).string = "";
            }
        });
    },

    //允许玩家修改玩法
    xiugai_click() {
        var self = this;
        cc.jsInstance.audioManager.playBtnClick();
        var ischeck = self.xiugaiOne.isChecked;
        if (ischeck) {
            self.xiugaiOne.node.parent.getChildByName("dt_setting_sllider_1").x = 0;
        } else {
            self.xiugaiOne.node.parent.getChildByName("dt_setting_sllider_1").x = self.xiugaiOne.node.parent.getChildByName("dt_setting_sllider_1").width * (-1);
        }
        cc.logManager.info("允许玩家修改玩法", ischeck);
        // 亲友圈设置  房卡 是否允许修改  立即开局 pro(immediately lockWays hideCard)  bool 是否打开
        cc.jsInstance.network.setClubPro("lockWays", !ischeck, function(rtn) {
            if (rtn.result === 0) {} else {
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(rtn.msg);
            }
        });
    },
    //允许玩家查看房卡数量
    chakanfangka_click() {
        var self = this;
        cc.jsInstance.audioManager.playBtnClick();
        var ischeck = self.chakanfangkaOne.isChecked;
        if (ischeck) {
            self.chakanfangkaOne.node.parent.getChildByName("dt_setting_sllider_1").x = 0;
        } else {
            self.chakanfangkaOne.node.parent.getChildByName("dt_setting_sllider_1").x = self.chakanfangkaOne.node.parent.getChildByName("dt_setting_sllider_1").width * (-1);
        }
        cc.logManager.info("允许玩家查看房卡数量", ischeck);
        // 亲友圈设置  房卡 是否允许修改  立即开局 pro(immediately lockWays hideCard)  bool 是否打开
        cc.jsInstance.network.setClubPro("hideCard", !ischeck, function(rtn) {
            if (rtn.result === 0) {} else {
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(rtn.msg);
            }
        });
    },
    //允许人数不足可立即开局
    peop_little_click() {
        var self = this;
        cc.jsInstance.audioManager.playBtnClick();
        var ischeck = self.peop_littleOne.isChecked;
        if (ischeck) {
            self.peop_littleOne.node.parent.getChildByName("dt_setting_sllider_1").x = 0;
        } else {
            self.peop_littleOne.node.parent.getChildByName("dt_setting_sllider_1").x = self.peop_littleOne.node.parent.getChildByName("dt_setting_sllider_1").width * (-1);
        }
        cc.logManager.info("允许人数不足可立即开局", ischeck);
        // 亲友圈设置  房卡 是否允许修改  立即开局 pro(immediately lockWays hideCard)  bool 是否打开
        cc.jsInstance.network.setClubPro("immediately", ischeck, function(rtn) {
            if (rtn.result === 0) {} else {
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(rtn.msg);
            }
        });
    },

    openClub_click() {
        var self = this;
        cc.jsInstance.audioManager.playBtnClick();
        var ischeck = self.openclubOne.isChecked;
        if (ischeck) {
            self.openclubOne.node.parent.getChildByName("dt_setting_sllider_1").x = 0;
        } else {
            self.openclubOne.node.parent.getChildByName("dt_setting_sllider_1").x = self.openclubOne.node.parent.getChildByName("dt_setting_sllider_1").width * (-1);
        }
        cc.logManager.info("开启亲友圈", ischeck);
        // 亲友圈设置  房卡 是否允许修改  立即开局 pro(immediately lockWays hideCard)  bool 是否打开
        cc.jsInstance.network.setClubPro("closed", !ischeck, function(rtn) {
            if (rtn.result === 0) {} else {
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(rtn.msg);
            }
        });
    },


    click_custom: function(e, custom) {
        var self = this;
        cc.logManager.info("click:" + custom);
        cc.jsInstance.audioManager.playBtnClick();
        switch (custom) {
            case "invite": //邀请好友
                self.club_invite(this.club_content.getChildByName("club_set_item1").data);
                return;
            case "tuichu1": //
                self.club_tuichu(this.club_content.getChildByName("club_set_item2"));
                return;
            case "tuichu2": //
                self.club_tuichu(this.club_content.getChildByName("club_set_item3"));
                return;
            case "tuichu3": //
                self.club_tuichu(this.club_content.getChildByName("club_set_item4"));
                return;
            case "tuichu4": //
                self.club_tuichu(this.club_content.getChildByName("club_set_item5"));
                return;
        }
    },
    club_invite(data) {
        cc.logManager.info("邀请的亲友圈id=" + data._id);
        this.node.active = false;
        var Club = {
            "clubid": data._id, //亲友圈id
            "tableid": -1, //房间号，-1代表没房间
            "desktop": -1, //桌子号
        };
        cc.jsInstance.native.wxInviteShareUrlClubRoom("亲友圈的ID:{" + data._id + "}快来加入我的亲友圈吧【大唐麻将】", Club);
    },
    club_invite_M() {
        var data = this.club_content.getChildByName("club_set_item2").data;
        cc.logManager.info("邀请的亲友圈id=" + data._id);
        this.node.active = false;
        var Club = {
            "clubid": data._id, //亲友圈id
            "tableid": -1, //房间号，-1代表没房间
            "desktop": -1, //桌子号
        };
        cc.jsInstance.native.wxInviteShareUrlClubRoom("亲友圈的ID:{" + data._id + "}快来加入我的亲友圈吧【大唐麻将】", Club);
    },
    club_tuichu(node) {
        var self = this;
        cc.logManager.info("退出亲友圈id=" + node.data._id);
        cc.jsInstance.msgpop.showMsg_text_close_cancle("您确定要退出" + unescape(node.data.name).substr(0, 6) + "的亲友圈吗？", function() {
            cc.jsInstance.network.exitClub(node.data._id, function(rtn) {
                if (rtn.result === 0) { // 
                    node.active = false;
                    self.clubroom.getJoinedClubs();
                } else {
                    cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(rtn.msg);
                }
            });
        });
    },

});