cc.Class({
    extends: cc.Component,
    properties: {
        clubCreate: {
            type: cc.Button,
            default: null,
        },
        clubJoin: {
            type: cc.Button,
            default: null,
        },
        clubHelp: {
            type: cc.Node,
            default: null,
        },

        clubTips: {
            type: cc.Node,
            default: null,
        },
        //创建亲友圈元宝不足的时候弹出
        rechargeMask: {
            type: cc.Node,
            default: null,
        },

    },

    onLoad() {
        // this.isEnableButton(this.clubCreate, true); //默认可用
        // this.isEnableButton(this.clubJoin, true);
    },

    createClub() {
        cc.jsInstance.audioManager.playBtnClick();
        cc.logManager.info("创建俱乐部");
        this.openClubTips();
    },

    joinClub() {
        cc.logManager.info("加入俱乐部");
        cc.jsInstance.audioManager.playBtnClick();
        // if (cc.sys.platform === cc.sys.WECHAT_GAME) { //微信的只能点击分享链接加入房间 ，方便测试，h5的可以输入房间号加入房间
        //     cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("请点击好友分享的亲友圈邀请链接加入亲友圈！", function() {
        //         cc.jsInstance.audioManager.playBtnClick();
        //     })
        // } else {
        //     this.node.active = false;
        //     this.node.parent.getChildByName("joinRoomBg").active = true;
        //     this.node.parent.getChildByName("joinRoomBg").getComponent("joinGameBg").setRoomNumTitle("clubid");
        // }

        this.node.active = false;
        this.node.parent.getChildByName("joinRoomBg").active = true;
        this.node.parent.getChildByName("joinRoomBg").getComponent("joinGameBg").setRoomNumTitle("clubid");
    },

    //创建俱乐部按钮是否可用
    isShowClub_create(isEnadle) {
        this.isEnableButton(this.clubCreate, isEnadle);
    },

    //加入俱乐部按钮是否可用
    isShowClub_join(isEnadle) {
        this.isEnableButton(this.clubJoin, isEnadle);
    },

    isEnableButton(bt, isEnadle) {
        bt.isShow = isEnadle; //保存当前按钮是否可用的状态 
        bt.interactable = isEnadle; //按钮事件是否被响应，如果为 false，则按钮将被禁用。
        bt.enableAutoGrayEffect = !isEnadle; //如果这个标记为 true，当 button 的 interactable 属性为 false 的时候，会使用内置 shader 让 button 的 target 节点的 sprite 组件变灰
    },
    //关闭创建亲友圈提示
    closeClubTips() {
        cc.jsInstance.audioManager.playBtnClick();
        this.clubTips.active = false;
    },
    //打开创建亲友圈提示
    openClubTips() {
        cc.jsInstance.audioManager.playBtnClick();
        this.clubTips.active = true;
    },
    //创建亲友圈提示里面的创建
    clubTips_create() {
        var self = this;
        cc.jsInstance.audioManager.playBtnClick();
        this.closeClubTips();
        this.node.active = false;
        //判断元宝够不够，不够弹出元宝不足的时候弹出 188元宝创建
        if (cc.jsInstance.pinfo.pinfo.money && cc.jsInstance.pinfo.pinfo.money < 188) {
            this.rechargeMask.getComponent("rechargeMask").initData(false); //是不是亲友圈页面弹出的
        } else { //创建亲友圈
            // {"result":0,"clubId":263782}
            // result: 409, msg: "已经拥有亲友圈!"
            //创建一个亲友圈
            cc.jsInstance.network.createClubBySycee(function(rtn) { //
                if (rtn.result === 409) {
                    cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(rtn.msg);
                    return;
                }
                if (rtn.result === 0) {
                    cc.jsInstance.clubId_Now = rtn.clubId;
                    cc.jsInstance.data.pinfo.foundedClub = rtn.clubId;
                    self.node.parent.getChildByName("clubroom").active = true;
                    self.node.parent.getChildByName("clubroom").getComponent("clubroom").getJoinedClubs(cc.jsInstance.clubId_Now);
                }
            });
        }
    },
    closeClubHelp() {
        cc.jsInstance.audioManager.playBtnClick();
        this.clubHelp.active = false;
    },

    openClubHelp() {
        cc.jsInstance.audioManager.playBtnClick();
        this.clubHelp.active = true;
    },

    closeCulb() {
        cc.jsInstance.audioManager.playBtnClick();
        this.node.active = false;
    },


});