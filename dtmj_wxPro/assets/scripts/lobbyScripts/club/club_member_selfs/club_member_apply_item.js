var Color = {
    WHITE: "#ffffff",
    GRAY: "#7C809D",
    BLUE: "#1664C3",
    RED: "#FE0707", //已拒绝要这个颜色
    REDAGREE: "#7E0C00", //已同意用这个颜色
    FAIL: "#FF0505", //加入失败用这个颜色
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
        //请求
        qingqiu: {
            type: cc.Label,
            default: null,
        },
        //时间
        time: {
            type: cc.Label,
            default: null,
        },
        //同意
        agree: {
            type: cc.Node,
            default: null,
        },
        //拒绝
        jueju: {
            type: cc.Node,
            default: null,
        },
        //是否已经同意或者拒绝   显示这个得话，隐藏agree  jueju
        isAgree: {
            type: cc.Node,
            default: null,
        },
        //默认头像
        defaultIcon: {
            type: cc.SpriteFrame,
            default: null,
        }
    },

    onLoad() {},

    start() {

    },

    // {
    //     "uid": 713510,
    //     "nickname": "%u4E09%u5341%u4E8C%u4E09%u5341%u4E8C",
    //     "timestamp": 1538064233209,
    //     "headimgurl": "http://thirdwx.qlogo.cn/mmopen/vi_32/9KBexE8cX9fiaq1k3AIGbxMZpCicRFCQUXfnlS63wRyaziam10uAP9T6v0SS51mHntic6sJZLTXZ1Fklic3YKjxhHXQ/132",
    //     "status": 2,
    //     "checkTime": 1537423022670
    // },
    //数据表绑定到ui上 
    initData(data) {
        // cc.logManager.info("绑定数据到ui上=", data);
        this.clubroom = data.club_member_self.clubroom;
        this.club_member_self = data.club_member_self;
        this.data = data;
        if (data.headimgurl) {
            cc.jsInstance.native.setHeadIcon(this.head, data.headimgurl); //公用设置头像方法
        } else {
            this.head.getComponent(cc.Sprite).spriteFrame = this.defaultIcon;
        }
        this.nickname.string = unescape(data.nickname).substr(0, 6);
        this.id.string = "ID:" + data.uid;
        this.qingqiu.string = "申请加入亲友圈";
        var date = cc.jsInstance.native.getFormatDate(data.timestamp); //时间格式化 返回[]
        this.time.string = date[0] + "/" + date[1] + "/" + date[2];
        if (data.status) {
            this.agree.active = false;
            this.jueju.active = false;
            this.isAgree.active = true;
            // if (data.status === 1) { //1 通过 2 拒绝
            //     this.choose_isagree(true);
            // } else if (data.status === 2) {
            //     this.choose_isagree(false);
            // }
            this.choose_isagree(data.status);
        } else {
            this.agree.active = true;
            this.jueju.active = true;
            this.isAgree.active = false;
        }
    },

    //  initData(clubroom, data, club_member_self) {
    //     // cc.logManager.info("绑定数据到ui上=", data);
    //     this.clubroom = clubroom;
    //     this.club_member_self = club_member_self;
    //     this.data = data;
    //     if (data.headimgurl) {
    //         cc.jsInstance.native.setHeadIcon(this.head, data.headimgurl); //公用设置头像方法
    //     } else {
    //         this.head.getComponent(cc.Sprite).spriteFrame = this.defaultIcon;
    //     }
    //     this.nickname.string = unescape(data.nickname).substr(0, 6);
    //     this.id.string = "ID:" + data.uid;
    //     this.qingqiu.string = "申请加入亲友圈";
    //     var date = cc.jsInstance.native.getFormatDate(data.timestamp); //时间格式化 返回[]
    //     this.time.string = date[0] + "/" + date[1] + "/" + date[2];
    //     if (data.status) {
    //         this.agree.active = false;
    //         this.jueju.active = false;
    //         this.isAgree.active = true;
    //         // if (data.status === 1) { //1 通过 2 拒绝
    //         //     this.choose_isagree(true);
    //         // } else if (data.status === 2) {
    //         //     this.choose_isagree(false);
    //         // }
    //         this.choose_isagree(data.status);
    //     } else {
    //         this.agree.active = true;
    //         this.jueju.active = true;
    //         this.isAgree.active = false;
    //     }
    // },

    //是否选择的同意
    choose_isagree(status) {
        this.isAgree.active = true;
        if (status === 1) { //1 通过 2 拒绝
            this.isAgree.getComponent(cc.Label).string = "已同意";
            this.isAgree.color = cc.hexToColor(Color.REDAGREE);
        } else if (status === 2) {
            this.isAgree.getComponent(cc.Label).string = "已拒绝";
            this.isAgree.color = cc.hexToColor(Color.RED);
        } else { //加入失败
            this.isAgree.getComponent(cc.Label).string = "加入失败";
            this.isAgree.color = cc.hexToColor(Color.FAIL);
        }
        this.agree.active = false;
        this.jueju.active = false;
    },

    //点击拒绝
    click_jujue() {
        cc.logManager.info("拒绝");
        this.checkClubApply(2);
    },

    click_agree() {
        cc.logManager.info("同意");
        this.checkClubApply(1);
    },
    //1 通过 2 拒绝
    checkClubApply(state) {
        var self = this;
        // clubjoinlist: 0
        // memberCount: 2
        // result: 0
        // status: 1
        // uid: 10000020
        cc.jsInstance.network.checkClubApply(this.data.uid, state, function(rtn) {
            if (rtn.result === 0) { // {"result":0,"uid":713510,"status":2,"clubjoinlist":0}
                if (rtn.status === 3) {
                    self.choose_isagree(rtn.status);
                    cc.jsInstance.bayWindow.openBayWindow("该玩家可加入的亲友圈已满！");
                } else if (rtn.status === 4) {
                    self.choose_isagree(rtn.status);
                    cc.jsInstance.bayWindow.openBayWindow("当前亲友圈已达上限，不可加入新的玩家！");
                }
                self.choose_isagree(rtn.status);
                cc.clubjoinlist = rtn.clubjoinlist;
                self.clubroom.isShowHongdian();
                self.club_member_self.init_apply(); //刷新申请列表
            } else {
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(rtn.msg);
            }
        });
    },
});