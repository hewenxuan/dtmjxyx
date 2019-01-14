/**
 * 用来统一游戏规则显示
 * 亲友圈，牌桌，牌桌结算，和分享四个模块
 * 例如带不带风，几局等等的信息
 */
var tableRulers = {
    getGameRulersInfo:getGameRulersInfo,
    getGameKind:getGameKind,
    getRoundName:getRoundName,
};
/**
 * 获取游戏名称
 */
function getGameKind(tData){
    var nameStr;
    if(tData.tuidaohu){
        nameStr = "推倒胡";
    }else if(tData.haveGoldFid){
        nameStr = "金币场推倒胡";
    }else if(tData.tuidaohu2){
        nameStr = "二人推倒胡";
    }else if(tData.tuidaohu3){
        nameStr = "三人推倒胡";
    }else if (tData.guaisanjiao) {
        nameStr = "拐三角";
    }else if(tData.guaisanjiao2){
        nameStr = "二人拐三角";
    }else if (tData.kouDian){    
        nameStr = "抠点";
    }else if(tData.koudian2){
        nameStr = "二人抠点";
    }else if(tData.koudian3){
        nameStr = "三人抠点";
    }else if(tData.jinZhong) {
        nameStr = "晋中";
    }else if (tData.lisi) {
        nameStr = "立四";
    } else if (tData.yulin) {
        nameStr = "榆林打锅子";
    } else if (tData.xian) {
        nameStr = "西安";
    } else if (tData.linfen) {
        nameStr = "临汾硬三嘴";
    }else if (tData.datong) {
        nameStr = "大同乱刮风";
    } else if (tData.rain) {
        nameStr = "繁峙下雨";
    }else if (tData.king) {
        nameStr = "洪洞王牌";
    }else if (tData.weinan) {
        nameStr = "渭南麻将";
    }else if (tData.yuncheng) {
        nameStr = tData.yctjxg.yc_jinNum == 4 ? "贴金4金" : "贴金8金";
    }else{
        console.log("no this gameKind for the function getGameKind!");
    }

    return unescape(nameStr);
}

/**
 * 
 * @param {分享} isForShared 
 */
function getGameRulersInfo(sData,isForShared){
    var tData = sData.tData;
    if(!tData){
        console.log("getGameRulersInfo传入tData参数不能为空!");
        return;
    }
    var infoarray = [];
    var inviteStr = "";
    //处理邀请
    if(isForShared){
        if(tData.desktop > 0){
            //亲友圈里面发来的邀请
            inviteStr = tData.clubName+"的亲友圈 亲友圈ID:"+tData.groupid+"桌号"+tData.desktop;
        }else{
            //正常的麻将邀请
            inviteStr = "包厢号:"+tData.tableid+"【大唐麻将】【一起垒长城】";
        }
        infoarray.push(inviteStr);
    }

    var gameNameStr = this.getGameKind(tData);
    var str;  
    infoarray.push(gameNameStr);
    //推倒胡
    if (tData.tuidaohu) {
        str = tData.tdhxg.tdh_dahu ? "大胡":"平胡";
        infoarray.push(str);
        str = tData.needTing ? "报听" : "不报听";
        infoarray.push(str);
        str = tData.withWind ? "带风" : "不带风";
        infoarray.push(str);
        str = tData.canEatHu ? "点炮胡" : "自摸胡";
        infoarray.push(str);
        if(tData.tdh_haozi){
            infoarray.push("随机耗子");
        }

        if(tData.needTing && tData.changeTingGang){
            str = "变听口不能杠";
            infoarray.push(str);
        }

    }
    //晋中
    if (tData.jinZhong) {
        str = tData.needTing ? "报听" : "不报听";
        infoarray.push(str);
        str = tData.withWind ? "带风" : "不带风";
        infoarray.push(str);
        str = tData.canEatHu ? "点炮胡" : "自摸胡";
        infoarray.push(str);
    }
    //立四
    if (tData.lisi) {
        str = tData.needTing ? "报听" : "不报听";
        infoarray.push(str);
        str = tData.withWind ? "带风" : "不带风";
        infoarray.push(str);
        str = tData.canEatHu ? "点炮胡" : "自摸胡";
        infoarray.push(str);
    }
    //拐三角
    if (tData.guaisanjiao) {
        str = tData.needTing ? "报听" : "不报听";
        infoarray.push(str);
        str = tData.withWind ? "带风" : "不带风";
        infoarray.push(str);
        str = tData.canEatHu ? "点炮胡" : "自摸胡";
        infoarray.push(str);
        if (tData.shisanyao) {
            infoarray.push("十三幺");
        }
        if (tData.qixiaodui) {
            infoarray.push("七小对");
        }
        if (tData.ying8zhang) {
            infoarray.push("硬八张");
        }
    }
    //临汾硬三嘴
    if (tData.linfen) {
        str = tData.needTing ? "报听" : "不报听";
        infoarray.push(str);
        str = tData.withWind ? "带风" : "不带风";
        infoarray.push(str);
        str = tData.canEatHu ? "点炮胡" : "自摸胡";
        infoarray.push(str);
        if (tData.lf_ysz) {
            infoarray.push("硬三嘴");
        }
        if (tData.lf_ymp) {
            infoarray.push("一门牌");
        }
        if (tData.lf_sy) {
            infoarray.push("数页");
        } else {
            infoarray.push("不数页");
        }
        if (tData.lf_50fan) {
            infoarray.push("50番封顶");
        } else {
            infoarray.push("不封顶");
        }
    }

    //大同乱刮风
    if (tData.datong) {
        str = tData.needTing ? "报听" : "不报听";
        infoarray.push(str);
        str = tData.withWind ? "带风" : "不带风";
        infoarray.push(str);
        str = tData.canEatHu ? "点炮胡" : "自摸胡";
        infoarray.push(str);
        if (tData.dt_fzb) {
            infoarray.push("防作弊玩法");
        }
        if (tData.dt_ct) {
            infoarray.push("传统玩法");
        }
        if (tData.dt_qidui) {
            infoarray.push("带七对");
        }
        if (tData.dt_gangScore) {
            infoarray.push("杠牌算分");
        }

    }
    //繁峙下雨
    if (tData.rain) {
        str = tData.needTing ? "报听" : "不报听";
        infoarray.push(str);
        str = tData.withWind ? "带风" : "不带风";
        infoarray.push(str);
        str = tData.canEatHu ? "点炮胡" : "自摸胡";
        infoarray.push(str);
        infoarray.push("缺一门");
        if (tData.rain_addScore) {
            infoarray.push("庄家加一分");
        }
        if (tData.rain_bang) {
            infoarray.push("点炮包胡");
        }
    }
    //王牌
    if (tData.king) {
        str = tData.needTing ? "报听" : "不报听";
        infoarray.push(str);
        str = tData.withWind ? "带风" : "不带风";
        infoarray.push(str);
        str = tData.canEatHu ? "点炮胡" : "自摸胡";
        infoarray.push(str);
        if (tData.king_quemen) {
            infoarray.push("缺两门");
        }else{
            infoarray.push("缺一门");
        }
        if (tData.king_baogang) {
            infoarray.push("不报听点杠包杠");
        }
    }
    //抠点
    if (tData.kouDian && // 二人扣点 和 三人扣点过滤
        !(tData.gameKind && (tData.gameKind == "koudian2" || tData.gameKind == "koudian3"))) {
        str = tData.needTing ? "报听" : "不报听";
        infoarray.push(str);
        str = tData.withWind ? "带风" : "不带风";
        infoarray.push(str);
        str = tData.canEatHu ? "点炮胡" : "自摸胡";
        infoarray.push(str);
        if (tData.zhuohaozi) {
            infoarray.push("捉耗子");
        }
        if (tData.fenghaozi) {
            infoarray.push("风耗子");
        }
        if (tData.allcolorsame) {
            infoarray.push("清一色翻倍");
            infoarray.push("一条龙翻倍");
        }
        if(tData.kd_zhuang){
            infoarray.push("带庄");
        }
        if(tData.kd_zhuangDouble){
            infoarray.push("自摸庄分翻倍");
        }
        if(tData.changeTingGang){
            infoarray.push("变听口不能杠");
        }
        if(tData.kd_fengzuizi){
            infoarray.push("风嘴子");
        }
    }
    //运城贴金
    if (tData.yuncheng) {
        str = tData.needTing ? "报听" : "不报听";
        infoarray.push(str);
        if (tData.yctjxg.yc_suojin) {
            infoarray.push("锁金");
        }
        if (tData.yctjxg.yc_sjbs) {
            infoarray.push("首金必上");
        }
        if (tData.yctjxg.yc_sjfd) {
            infoarray.push("三金封顶");
        }
        if (tData.yctjxg.yc_dptp) {
            infoarray.push("点炮通赔");
        }
        if (tData.yctjxg.yc_zhuang) {
            infoarray.push("带庄闲");
        }
        if (tData.yctjxg.yc_heisanfeng) {
            infoarray.push("黑三风");
        }
        if (tData.yctjxg.yc_qxd) {
            infoarray.push("七小对翻番");
        }
        if (tData.yctjxg.yc_qys) {
            infoarray.push("清一色翻番");
        }
        if (tData.yctjxg.yc_ssy) {
            infoarray.push("十三幺翻番");
        }
        if (tData.yctjxg.yc_ytl) {
            infoarray.push("一条龙翻番");
        }
    }
    //西安麻将
    if (tData.xian) {
        str = tData.needTing ? "报听" : "不报听";
        infoarray.push(str);
        str = tData.withWind ? "带风" : "不带风";
        infoarray.push(str);
        str = tData.canEatHu ? "点炮胡" : "自摸胡";
        infoarray.push(str);
        if (tData.xa_xiapaozi) {
            infoarray.push("下炮子");
        }
        if (tData.xa_hongzhong) {
            infoarray.push("红中癞子");
        }
        if (tData.xa_qys) {
            infoarray.push("清一色翻倍");
        }
        if (tData.xa_can7_fanbei) {
            infoarray.push("七小对翻倍");
        } else if (tData.xa_can7_bufanbei) {
            infoarray.push("七小对不翻倍");
        }
        if (tData.xa_jiang_258) {
            infoarray.push("258硬将");
        }
        if (tData.xa_hu_with258) {
            infoarray.push("胡258翻倍");
        }
        if (tData.xa_jiang_with258) {
            infoarray.push("将258翻倍");
        }
    }
    //榆林打锅子
    if (tData.yulin) {
        str = tData.needTing ? "报听" : "不报听";
        infoarray.push(str);
        str = tData.withWind ? "带风" : "不带风";
        infoarray.push(str);
        str = tData.canEatHu ? "点炮胡" : "自摸胡";
        infoarray.push(str);

        if (tData.yl_zhuang) {
            infoarray.push("庄翻倍");
        }
        // if (tData.roundNum == 100|| tData.roundAll == 6) {
        //     infoarray.push("100锅底");
        // }
    }
    //安康159
    if(tData.ankang){
        str = tData.needTing ? "报听" : "不报听";
        infoarray.push(str);
        str = tData.withWind ? "带风" : "不带风";
        infoarray.push(str);
        str = tData.canEatHu ? "点炮胡" : "自摸胡";
        infoarray.push(str);

        if (tData.ankang_buyCode) {
            if(tData.ankang_buyCode == 1){
                infoarray.push("一码全中");
            }else{
                infoarray.push("买"+tData.ankang_buyCode+"码");
            }
            
        }
        if (tData.ankang_red) {
            infoarray.push("红中癞子");
        }
        if (tData.ankang_bang) {
            infoarray.push("下炮子");
        }
        if (tData.ankang_QAdd) {
            infoarray.push("七对加1码");
        }
        if (tData.ankang_HAdd) {
            infoarray.push("天胡加1码");
        }
        if (tData.ankang_GAdd) {
            infoarray.push("杠上花加1码");
        }
    }

    if(tData.weinan){
        str = tData.needTing ? "报听" : "不报听";
        infoarray.push(str);
        str = tData.withWind ? "带风" : "不带风";
        infoarray.push(str);
        str = tData.canEatHu ? "点炮胡" : "自摸胡";
        infoarray.push(str);
        if(tData.weinan_xiapaozi){
            infoarray.push("下炮子");
        }
        if(tData.weinan_YPDX){
            infoarray.push("1炮3响3家输");
        }
    }
    if(tData.xyPoint){
        str = tData.needTing ? "报听" : "不报听";
        infoarray.push(str);
        str = tData.withWind ? "带风" : "不带风";
        infoarray.push(str);
        str = tData.canEatHu ? "点炮胡" : "自摸胡";
        infoarray.push(str);
        str = tData.xyPoint_zhuang ? "带庄" : "不带庄";
        infoarray.push(str);
        str = tData.xyPoint_anTing ? "暗听" : "明听";
        infoarray.push(str);
        if(tData.xyPoint_gang){
            infoarray.push("点杠包杠");
        }
    }
    if(tData.linfenDDZ){
        str = tData.linfenDDZ_double ? "炸弹分翻倍" : "炸弹+2分";
        infoarray.push(str);
        str = tData.linfenDDZ_isBomb ? "333算炸弹" : "";
        infoarray.push(str);
    }
    if(tData.happyDDZ){
        str = tData.bombLime == 100 ? "炸弹不封顶" : tData.bombLime+"个炸封顶";
        infoarray.push(str);
    }
    if(tData.contest){
        infoarray.push("大胡");
        str = tData.needTing ? "报听" : "不报听";
        infoarray.push(str);
        str = tData.withWind ? "带风" : "不带风";
        infoarray.push(str);
        str = tData.canEatHu ? "点炮胡" : "自摸胡";
        infoarray.push(str);    
        if(tData.tdh_haozi){
            infoarray.push("随机耗子");
        }    
    }
    if(tData.tuidaohu2){
        str = tData.noBigWin ? "平胡" : "大胡";
        infoarray.push(str);
        str = tData.needTing ? "报听" : "不报听";
        infoarray.push(str);
        str = tData.withWind ? "带风" : "不带风";
        infoarray.push(str);
        str = tData.canEatHu ? "点炮胡" : "自摸胡";
        infoarray.push(str);
        if(tData.changeTingGang){infoarray.push("变听口不能杠");}
        if(tData.lackOne){infoarray.push("缺一门");}
       
    }else if(tData.jiShan){

        str = tData.withWind ? "带风" : "不带风";
        infoarray.push(str);
        str = tData.canEatHu ? "点炮胡" : "自摸胡";
        infoarray.push(str);
        str = "底分:"+tData.baseScoreMJ;
        infoarray.push(str);
        if(tData.needLeft == 0)
        {
            str = "不留牌";
            infoarray.push(str);
        }
        else if(tData.needLeft == 1)
        {
            str = "杠留一张";
            infoarray.push(str);
        }
        else if(tData.needLeft == 2)
        {
            str = "杠留两张";
            infoarray.push(str);
        }
        
    }else if(tData.jiangXian){
        str = "底分:"+tData.baseScoreMJ;
        infoarray.push(str);
        if(tData.yiTiaoL){
            infoarray.push("一条龙");
        }
    }

    // 比赛场和金币场不显示局数
    if(!tData.haveFid && !tData.haveGoldFid && infoarray.length>0 ){//补充局数等信息
        var waysName;
        var inviteNameStr;
        if(isForShared){
            inviteNameStr = infoarray.shift();
            waysName = infoarray.shift();
        }else{
            waysName = infoarray.shift();
        }
        if(waysName == "大胡" || waysName == "平胡"){
            waysName = "推倒胡 "+waysName;
        }
        var roundName = getRoundName(tData);// getRoundName(tData.roundAll,tData.circle,tData.gameKind);
        if(roundName != ""){
            infoarray.unshift(roundName);
        }
        infoarray.unshift(waysName);
        if(inviteNameStr){
            infoarray.unshift(inviteNameStr);
        }
        cc.log("规则初始化后 局数:"+tData.roundAll);
    }

    if(isForShared){
            //亲友圈里面发来的邀请
            inviteStr = "速度加入【大唐麻将】("+tData.peopleNum+"缺"+parseInt(tData.peopleNum-Object.keys(sData.players).length)+")";
        infoarray.push(inviteStr);
    }

     return infoarray;
}


function getRoundName(tData){ 
    var round = tData.roundAll;
    var isCircle = false;
    if(tData.circle || (tData.gameXg && tData.gameXg.circle))
    {
        isCircle = true;
    }
    // cc.log("getRoundName round: " + round);
    // cc.log("getRoundName isCircle: " + isCircle);
    // cc.log("getRoundName tData.roundNum: " + tData.roundNum);

    var roundStr = "";
    if(typeof(round) == "number"){
        if(isCircle){
            roundStr = "1圈";
        }else if(round == 1){
            roundStr = "1局";
        }else if(round == 4){
            roundStr = "4局";
        }else if(round == 8){
            roundStr = "8局";
        }else if(round == 16){
            roundStr = "16局";
        }
        //else if(round == 100){
        else if(round == 100 || tData.roundNum == 100|| tData.roundAll == 6){
            roundStr = "100锅底";
        }
    }else{
        if (round == "round1"){
            roundStr = "1局";
        }else if (round == "round4"){
            roundStr = "4局";
        }else if (round == "round8"){
            roundStr = "8局";
        }else if(round == "circle1"){
            roundStr = "1圈";
        }else if(round == "round100"){
            roundStr = "100锅底";
        }else if(round == "roundz8"){
            roundStr = "8局";
        }else if(round == "roundz16"){
            roundStr = "16局";
        }
    }
    return roundStr;
}
module.exports = tableRulers;

