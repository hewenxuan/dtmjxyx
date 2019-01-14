cc.Class({
    extends: cc.Component,

    properties: {},
    onLoad() {


    },

    getConfig() {
        return {
            // "servers": "192.168.0.200:15010",      //内网  测试用
            // "servers": "192.168.0.31:15010",      //内网   测试用
            // "servers": "192.168.0.44:15010",
            "servers": "60.205.127.157:15010", //外网      测试用
            // "servers": "192.168.0.60:15010", //内网，和丁哥调试用
            // "servers": "59.110.14.4:15010",      //外网  测试用
            // "servers": "39.106.152.48:15010", 

            // "servers": "dtmjlinks.datangyouxi.com", //生产发布   （之前正式的，发布暂时不用，）
            // "servers": "dtmjssl1.datangyouxi.com", //生产发布 （之前正式的，发布暂时不用，）

            // "servers": "dtmjssl1.datangyouxi.com:1441", //生产发布（正式用）
            // "isShowClubId": true,//是否显示亲友圈id
            "msgURL": "https://c.datangyouxi.com/damjxyx/news.json", //消息
            "GoldContest": true,
            "weixinBuy": "代理咨询请联系微信客服DTKEFU041或微信客服DTKEFU235",
            "version": "2.09",
            "isSynClient": true, //是否同步客户端 暂时没有用到（之前金币场 同步客户端的解散房间功能）
            "wxShareUrl": "http://a.app.qq.com/o/simple.jsp?pkgname=com.cfgame.dtmj",
            "homeScroll": "本游戏仅供娱乐,禁止赌博. 一经发现不当行为,立即封号,并向公安机关举报.                                           大唐麻将内置反外挂系统,绝无任何外挂.如玩家发现有任何实际效果的外挂/作弊器,请联系我们.一经核实,奖励人民币50万元！   如有游戏内遇到bug，请发送邮箱 2622030812@qq.com  谢谢！",
            "feedbackURL": "https://datang.jinshuju.com/api/v1/forms/Gju98X",
            "awardChange": "请联系微信客服:DTCZKF888，领取您的现金大奖，领奖时请将此界面截图发给客服人员。",
            "dtddz": "https://app.datangyouxi.com/index.html?id=12", //大唐斗地主下载链接    http://a.app.qq.com/o/simple.jsp?pkgname=com.cfgame.dtddz
            "hbmj": "http://hbmjapp.dtgames.cn/dthbmj/download.html", //河北 麻将
            "nmmj": "http://nmmj.datangyouxi.com/dtnmmj/download.html", //内蒙 麻将
            "hnmj": "http://hnmjweb.dtgames.cn/dthnmj/download.html", //河南 麻将
            "weixinKu": ["DTKEFU21", "DTYXKF26", "DTKEHU001", "DTKEFU073", "DTKEFU200", "DTKEFU209", "datangyouxi20", "DTKEFU082", "DTKEFU206", "DTKEFU148", "DTKEHU019", "DTYXKF49", "DTKEFU054", "DTKEFU033"]
        }
    },
});