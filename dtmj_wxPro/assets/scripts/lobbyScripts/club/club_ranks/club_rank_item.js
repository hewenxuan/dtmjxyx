var Color = {
    WHITE: "#ffffff",
    GRAY: "#7C809D",
    BLUE: "#1664C3",
    RED: "#FE0707", //
    REDAGREE: "#7E0C00", //
};
cc.Class({
    extends: cc.Component,

    properties: {
        //1 2 3 名的图片
        sps: {
            type: cc.SpriteFrame,
            default: [],
        },
        //前三名
        qiansan: {
            type: cc.Node,
            default: null,
        },
        //头像
        head: {
            type: cc.Node,
            default: null,
        },
        //排名
        paiming: {
            type: cc.Label,
            default: null,
        },
        //昵称
        nickName: {
            type: cc.Label,
            default: null,
        },
        //id
        id: {
            type: cc.Label,
            default: null,
        },
        //分
        fen: {
            type: cc.Label,
            default: null,
        },
        //场数
        changshu: {
            type: cc.Node,
            default: null,
        },
        //雀神数量
        queshenNum: {
            type: cc.Node,
            default: null,
        },
        //默认头像
        defaultIcon: {
            type: cc.SpriteFrame,
            default: null,
        }

    },

    onLoad() {

    },

    // {
    //   "uid": "7637454",
    //   "field": 1, //场数
    //   "score": "54",
    //   "finch": 1, //雀神
    //   "nickname": "2TfEIoHV",
    //   "headimgurl": "",
    //   "rank": 1  //排名
    // },

    //数据表绑定到ui上   type 1 今天 2 昨天
    initData(data) {
        // cc.logManager.info("绑定数据到ui上=", data);
        this.data = data;
        this.clubroom = data.club_rank.clubroom;
        this.type = data.club_rank.type;
        this.node.getChildByName("info").active = false;
        if (this.clubroom.isMyClub || this.clubroom.mamager) {
            this.node.getChildByName("info").active = true; //是不是自己的亲友圈
        }

        this.setrank(data.rank); //设置排名
        if (data.headimgurl) {
            cc.jsInstance.native.setHeadIcon(this.head, data.headimgurl); //公用设置头像方法
        } else {
            this.head.getComponent(cc.Sprite).spriteFrame = this.defaultIcon;
        }
        this.nickName.string = unescape(data.nickname).substr(0, 6);
        this.id.string = data.uid;
        this.setScore(this.fen.node, data.score);
        this.changshu.getComponent(cc.Label).string = data.field;
        this.queshenNum.getComponent(cc.Label).string = data.finch;
    },

    // initData(data, clubroom, type) {
    //     // cc.logManager.info("绑定数据到ui上=", data);
    //     this.data = data;
    //     this.clubroom = clubroom;
    //     this.type = type;
    //     this.node.getChildByName("info").active = this.clubroom.isMyClub; //是不是自己的亲友圈
    //     this.setrank(data.rank); //设置排名
    //     if (data.headimgurl) {
    //         cc.jsInstance.native.setHeadIcon(this.head, data.headimgurl); //公用设置头像方法
    //     } else {
    //         this.head.getComponent(cc.Sprite).spriteFrame = this.defaultIcon;
    //     }
    //     this.nickName.string = unescape(data.nickname).substr(0, 6);
    //     this.id.string = data.uid;
    //     this.setScore(this.fen.node, data.score);
    //     this.changshu.getComponent(cc.Label).string = data.field;
    //     this.queshenNum.getComponent(cc.Label).string = data.finch;
    // },
    setScore(node, score) {
        if (score >= 0) {
            node.color = cc.hexToColor(Color.REDAGREE);
        } else {
            node.color = cc.hexToColor(Color.BLUE);
        }
        node.getComponent(cc.Label).string = score + "";
    },
    setrank(num) {
        this.paiming.node.active = false;
        this.qiansan.active = false;
        if (num > 3) {
            this.paiming.node.active = true;
            this.paiming.string = "" + num;
        } else {
            this.qiansan.active = true;
            this.qiansan.getComponent(cc.Sprite).spriteFrame = this.sps[num - 1];
        }
    },

    //点击详情
    click_info() {
        var self = this;
        cc.jsInstance.network.fetchMemberRecords(self.type, self.clubroom.clubInfo.id, self.data.uid, function(rtn) {
            // cc.logManager.info("获取排行榜");
            if (rtn.result === 0) { //获取详情成功
                self.club_rank_info = cc.find("Canvas/clubroom/bg/club_rank_info"); //进入我的战绩界面
                self.club_rank_info.getComponent("club_rank_info").initData(rtn.data, self.clubroom);
            } else {
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(rtn.msg);
            }
        });
    },

});