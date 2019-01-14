var Color = {
    WHITE: "#ffffff",
    GRAY: "#79889A",
    RED: "#7E0C00",
    BLUE: "#1664C3",
    BLACK: "#000000"
};
cc.Class({
    extends: cc.Component,

    properties: {
        //名字
        con: {
            type: cc.Label,
            default: null,
        },
        //id
        time: {
            type: cc.Label,
            default: null,
        },
    },

    initData(data) {
        this.data = data;
        var date = cc.jsInstance.native.getFormatDate(data.timestamp); //时间格式化 返回[]
        var time = date[0] + "/" + date[1] + "/" + date[2] + " " + date[3] + ":" + date[4] + ":" + date[5];
        this.time.string = time;
        //因为服务端返回的字符串逗号是英文的，苹果手机显示的时候会逗号会识别不出来，所以先全部替换逗号为中文的
        this.con.string = unescape(data.message.replace(/\, /, "，")); 
        this.time.node.color = cc.hexToColor(Color.GRAY);
        if (data.type === "checkApply" || data.type === "money" || data.type === "createClub" || data.type === "modify" || data.type === "exitClub" || data.type === "kickMember" || data.type === "sealMember") {
            this.con.node.color = cc.hexToColor(Color.BLUE);
        } else {
            this.con.node.color = cc.hexToColor(Color.RED);
        }
        // if (data.type === "exitClub"||data.type === "createClub") {
        //     this.con.node.color = cc.hexToColor(Color.BLACK);
        // }
    },
});