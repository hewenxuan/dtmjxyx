/**
 * 工具类
 * 动画、手牌排序、位置变换、获取用户信息、设置头像等中间方法
 */

 var checkTingkou = require("./checkTingkou.js");
 var DT_GameLogic_YC = require("./DT_GameLogic_YC.js");

cc.Class({
    extends: cc.Component,

    properties: {
        myselfAnimation: {
            type: cc.Node,
            default: null,
        },

        myselfZiMoAnimation:{
            type: cc.Node,
            default: null,
        },

        myselfAnimCards:{
            type:cc.SpriteAtlas,
            default:null,
        },

        leftAnimation: {
            type: cc.Node,
            default: null,
        },

        rightAnimation: {
            type: cc.Node,
            default: null,
        },

        upAnimation: {
            type: cc.Node,
            default: null,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.initData();
    },

    initData: function() {
        this.tData = cc.jsInstance.data.sData.tData;
        this.sData = cc.jsInstance.data.sData;
        this.playPaiSpriteFrame = this.getComponent('playGetPaiSpriteFrame');
        // this.checkTingkouTool = this.getComponent('checkTingkou');
    },

    //变换位置，使uids都是以自己为中心的0123位置 逆时针 返回index
    transformUidsLocation: function(uid) {
        console.log("uid ====", uid);
        this.initData();
        var uids = this.tData.uids.slice(0);
        //斗地主三个人不需要补位
        //拐三角没用到这个方法暂时
        if (this.tData.gameKind != "happyDDZ") {
            if (uids.length === 3 && !this.isForThreePlayers()) {
                //3个人的时候需要一个0补位，否则相对位置会乱掉
                uids.push(0);
            }

            if (uids.length === 2) {
                uids.push(0);
                uids.push(0);
            }
        }
        var selfIndex = uids.indexOf(this.getUserId());

        var transformUids = [];

        for (var i = 0; i < selfIndex; i++) {
            transformUids.push(uids[i]);
            uids.splice(i, 1);
            i--;
            selfIndex--;
        }

        for (var i = 0; i < transformUids.length; i++) {
            uids.push(transformUids[i]);
        }
        if (uids.indexOf(uid) >= 0) {
            return uids.indexOf(uid);
        } else {

        }
    },

    //变换位置，使uids都是以自己为中心的0123位置 逆时针
    transformUidsLocationArr: function(uid) {
        this.initData();
        var uids = this.tData.uids.slice(0);

        if (uids.length === 3 && !this.isForThreePlayers() && this.tData.gameKind != "happyDDZ") {
            //3个人的时候需要一个0补位，否则相对位置会乱掉
            uids.push(0);
        }

        if (uids.length === 2) {
            uids.push(0);
            uids.push(0);
        }

        var selfIndex = uids.indexOf(this.getUserId());

        var transformUids = [];

        for (var i = 0; i < selfIndex; i++) {
            transformUids.push(uids[i]);
            uids.splice(i, 1);
            i--;
            selfIndex--;
        }

        for (var i = 0; i < transformUids.length; i++) {
            uids.push(transformUids[i]);
        }
        return uids;
    },

    //关于用户信息
    getUserId: function() {
        return cc.jsInstance.data.pinfo.uid;
    },

    getUIPlayer: function(off) {
        this.initData();
        var uids = this.tData.uids;
        var peopleNum = 4;
        if (this.isForTwoPlayers()) {
            peopleNum = 2;
        } else if (this.isForThreePlayers()) {
            peopleNum = 3;
        } else if (this.tData.gameKind === "happyDDZ") {
            peopleNum = 3;
        }

        var selfIndex = uids.indexOf(this.getUserId());
        selfIndex = (selfIndex + off) % peopleNum;
        if (selfIndex < uids.length) return this.sData.players[uids[selfIndex]];
        return null;
    },

    //设置头像
    setHead(array, headNodes) {
        var width = 65;
        if (this.tData.gameKind === "happyDDZ") {
            width = 79;
        }
        var self = this;
        if (array[0]) {
            cc.loader.load({
                    url: array[0],
                    type: 'png'
                },
                function(err, ret) {
                    if (err) {
                        // console.log("设置图片失败err" + err);
                        array.splice(0, 1);
                        headNodes.splice(0, 1);
                        console.log("array.length=" + array.length);
                        console.log("headNodes.length=" + headNodes.length);
                        self.setHead(array, headNodes);
                        return;
                    }
                    console.log("获取图片成功：");
                    var head_node = headNodes[0];
                    ret.width = width;
                    ret.height = width;
                    var spriteFrame = new cc.SpriteFrame(ret, cc.Rect(0, 0, width, width));
                    head_node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    array.splice(0, 1);
                    headNodes.splice(0, 1);
                    self.setHead(array, headNodes);
                }.bind(this)
            );
        } else {
            return;
        }
    },

    //手牌排序方法
    orderThePlayerHands: function(playerHands, isDesc) {
        var laizi = [];
        if (!this.tData) {
            this.tData = cc.jsInstance.data.sData.tData;
        }
        for (var i = 0; i < playerHands.length; i++) {
            if (playerHands[i] === this.tData.haozi) {
                laizi.push(playerHands[i]);
                playerHands.splice(i, 1);
                i--;
            }
        }
        if (isDesc) {
            playerHands.sort(function(a, b) {
                return b - a;
            });
            console.log("playershands desc 倒序");
            playerHands = playerHands.concat(laizi);
        } else {
            playerHands.sort(function(a, b) {
                return a - b;
            });
            console.log("playershands 正序");
            playerHands = laizi.concat(playerHands);
        }
        return playerHands;
    },

    //检测是不是碰的牌里面杠的
    checkPengContainInGang: function(pengArr, gangArr) {
        var isFind = false;
        var index = -1;
        for (var i = 0; i < gangArr.length; i++) {
            if (isFind) {
                break;
            }
            for (var j = 0; j < pengArr.length; j++) {
                if (gangArr[i] === pengArr[j]) {
                    index = j;
                    isFind = true;
                    break;
                }
            }
        }
        return index;
    },

    hiddenHandPaiByPG: function(node, handPengArr, handGangArr, handAnGangArr) {
        var index = this.checkPengContainInGang(handPengArr, handGangArr);
        if (index >= 0) {
            handPengArr.splice(index, 1);
        }

        for (var i = 0; i < handPengArr.length * 3 + handGangArr.length * 3 + handAnGangArr.length * 3; i++) {
            node.getChildByName("hand_" + i).active = false;
        }
    },

    dealWithHandPengOrGang: function(handAnGangArr, handGangArr, handPengArr, node, type, pInfo, locationIndex) {
        //先全部隐藏
        for (var i = 0; i < 4; i++) {
            var handNode = node.getChildByName("penggangs").getChildByName("pg_" + i);
            //隐藏小手
            handNode.getChildByName("B_bamboo_2").getChildByName("mingGang").active = false;
            //隐藏pg_节点
            handNode.active = false;
        }

        var index = this.checkPengContainInGang(handPengArr, handGangArr);
        console.log("index ==", index);
        if (index >= 0) {
            handPengArr.splice(index, 1); //如果包含，那么从peng里面把牌删除
        }

        //显示手牌碰和杠的UI
        for (var i = 0; i < handPengArr.length + handGangArr.length + handAnGangArr.length; i++) {
            var handNode = node.getChildByName("penggangs").getChildByName("pg_" + i);
            handNode.active = true;
            if (i < handAnGangArr.length) {
                for (var b = 1; b < 4; b++) {
                    handNode.getChildByName("B_bamboo_" + b).getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(handAnGangArr[i], type);
                    if (b === 2) {
                        var jiantouNode = handNode.getChildByName("B_bamboo_" + b).getChildByName("dt_play_peng");
                    }
                }
                handNode.getChildByName("angang").active = true;
            } else if (i - handAnGangArr.length < handGangArr.length) {
                for (var b = 1; b < 4; b++) {
                    handNode.getChildByName("B_bamboo_" + b).getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(handGangArr[i - handAnGangArr.length], type);
                    if (b === 2 && !this.isForTwoPlayers()) {
                        var jiantouNode;
                        //自己位置的杠 显示的小箭头提示要靠上些
                        if (locationIndex === 0) {
                            jiantouNode = handNode.getChildByName("gang").getChildByName("dt_play_peng");
                        } else {
                            jiantouNode = handNode.getChildByName("B_bamboo_" + b).getChildByName("dt_play_peng");
                        }
                        jiantouNode.active = true;
                        var from = pInfo.gang0uid[handGangArr[i - handAnGangArr.length]];
                        if (from >= 0) {
                            //点杠
                            var rotate = this.caclulateRotate(from);
                            jiantouNode.rotation = rotate;
                        } else {
                            jiantouNode.active = false; //碰过明杠
                            var from = pInfo.penguid[[handGangArr[i - handAnGangArr.length]]]
                            if (from >= 0) {
                                var littleHandNode = handNode.getChildByName("B_bamboo_" + b).getChildByName("mingGang");
                                littleHandNode.active = true;
                                var arrowNode = littleHandNode.getChildByName("dt_play_peng");
                                var rotate = this.caclulateRotate(from);
                                arrowNode.rotation = rotate;
                            } else {
                                console.log("请查询数据，不可能有额外的情况了，出bug了！");
                            }
                        }

                    }
                }
                handNode.getChildByName("gang").active = true;
                handNode.getChildByName("gang").getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(handGangArr[i - handAnGangArr.length], type);
                handNode.getChildByName("angang").active = false;
            } else {
                for (var b = 1; b < 4; b++) {
                    // console.log("handNode==", handNode);
                    handNode.getChildByName("B_bamboo_" + b).getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(handPengArr[i - handGangArr.length - handAnGangArr.length], type);
                    if (b === 2 && !this.isForTwoPlayers()) {
                        var jiantouNode = handNode.getChildByName("B_bamboo_" + b).getChildByName("dt_play_peng");
                        jiantouNode.active = true;
                        var from = pInfo.penguid[handPengArr[i - handGangArr.length - handAnGangArr.length]];
                        var rotate = this.caclulateRotate(from);
                        jiantouNode.rotation = rotate;
                    }
                }
                handNode.getChildByName("gang").active = false;
                handNode.getChildByName("angang").active = false;
            }
        }
    },

    caclulateRotate: function(from) {
        var fromUid = this.tData.uids[from];
        var index = this.transformUidsLocation(fromUid);
        if (this.isForTwoPlayers()) {
            if (index != 0) {
                index = 2
            }
        } else if (this.isForThreePlayers()) {
            if (index === 2) {
                index = 3;
            }
        }

        switch (index) {
            case 0:
                return 180;
                break;
            case 1:
                return 90;
                break;
            case 2:
                return 0;
                break;
            case 3:
                return -90;
                break;
        }

    },

    //动画播放
    playAnimation: function(uid, animationStr,card) {
        var index = this.transformUidsLocation(uid);
        var animationEatFlag;
        index = this.getIndexByGameKind(index);
        switch (index) {
            //自己 0号位
            case 0:
                if(animationStr === "zimoAni"){
                    this.myselfZiMoAnimation.getChildByName("showpai").getComponent(cc.Sprite).spriteFrame = this.myselfAnimCards.getSpriteFrame("ani_my_"+card);
                    animationEatFlag = this.myselfZiMoAnimation.getComponent(cc.Animation);
                    animationStr = "zimoLocation0";
                }else{
                    animationEatFlag = this.myselfAnimation.getComponent(cc.Animation);
                }
                break;

                //上家 1号位
            case 1:
                animationEatFlag = this.rightAnimation.getComponent(cc.Animation);
                break;

                //对家 2号位
            case 2:
                animationEatFlag = this.upAnimation.getComponent(cc.Animation);
                break;

                //下家 3号位
            case 3:
                animationEatFlag = this.leftAnimation.getComponent(cc.Animation);
                break;
        }
        animationEatFlag.play(animationStr);
    },

    //打牌动画
    playMJPutAnimation: function(node, putNode, num) {
        var putNode_w = putNode.convertToWorldSpaceAR(cc.p(0, 0));
        var node_w = node.convertToWorldSpaceAR(cc.p(0, 0));
        node.active = true;
        node.getComponent(cc.Sprite).spriteFrame = this.playPaiSpriteFrame.getMJSpriteFrame(num, "M");
        var mby = cc.moveBy(0.4, cc.pSub(putNode_w, node_w));
        var dely = cc.delayTime(0.8);
        putNode.active = true;
        var seq = cc.sequence([dely, mby, cc.callFunc(function() {
            node.active = false;
        }.bind(node))]);
        node.runAction(seq);
    },

    //过胡飘字动画
    playSkipHuAnimation: function(node, sPosition, ePosition) {
        var mby = cc.moveBy(0.4, cc.pSub(sPosition, ePosition));
        var seq = cc.sequence([mby, cc.callFunc(function() {
            node.active = false;
        }.bind(node))]);
        node.runAction(seq);
    },

    checkTingkouByTool: function(hand,player) {
        var tempHand = hand.slice(0);
        var haoziNum = 0;
        for (var i = 0; i < hand.length; i++) {
            if (this.tData.haozi === hand[i]) {
                hand.splice(i, 1);
                haoziNum++;
                i--;
            }
        }

        var isYingBa = false;
        if(this.isGuaiSanJiao()){
            isYingBa = this.tData.gsjxg.gsj_ying8zhang;
        }

        var isQixiaodui = this.tData.qixiaodui;
        var isShisanyao = this.tData.shisanyao;
        if(this.isTuidaohu()){
            isQixiaodui = true;
            isShisanyao = true;
        }

        if(this.isKoudian()){
            if(this.tData.kdxg.kd_fenghaozi||this.tData.kdxg.kd_fengzuizi){
                isQixiaodui = false;
                isShisanyao = false;
            }else{
                isQixiaodui = true;
                isShisanyao = true;
            }
        }

        var choiceObj = {
            choice13:isShisanyao,
            no7:isQixiaodui,
            hard8:isYingBa,
        }
        
        if(this.tData.haozi > 0){
            var haoziArr = [];
            for(var i = 0; i < haoziNum;i++){
                haoziArr.push(this.tData.haozi);
            }
            return cc.jsInstance.majiang_yc.checkLaiziTing_laizi(tempHand,haoziArr,isQixiaodui,isShisanyao,this.isKoudian());
        }else{
            return cc.jsInstance.majiang.findTingByMjhand(hand,player.mjpeng,player.mjgang,player.mjangang,choiceObj);
        }

    },

    caclulateTingkouForleftCard: function(handCards, players, card) {
        //查看自己手牌中有几张
        var leftCard = 4;
        var hands = handCards.slice(0);
        while (hands.indexOf(card) >= 0) {
            var index = hands.indexOf(card);
            leftCard--;
            hands.splice(index, 1);
        }
        //算剩余几张牌
        for (var i = 0; i < 4; i++) {
            var pl = players[i];
            var mjputArr = pl.mjput.slice(0);
            while (mjputArr.indexOf(card) >= 0) {
                var index = mjputArr.indexOf(card);
                leftCard--;
                mjputArr.splice(index, 1);
            }

            if (pl.mjpeng.indexOf(card) >= 0) {
                leftCard = leftCard - 3;
                break;
            }

            if (pl.mjangang.indexOf(card) >= 0 || pl.mjgang.indexOf(card) >= 0) {
                leftCard = 0;
                break;
            }
        }
        return leftCard;
    },

    playScaleForLayer: function(node) {
        cc.jsInstance.native.setScaleAction(node);
    },

    isForTwoPlayers() {
        this.tData = cc.jsInstance.data.sData.tData;
        if(this.tData.peopleNum === 2) {
            return true;
        } else {
            return false;
        }
    },

    isForThreePlayers() {
        this.tData = cc.jsInstance.data.sData.tData;
        if (this.tData.peopleNum === 3) {
            return true;
        } else {
            return false;
        }
    },

    isTuidaohu(){
        var tuidaohu = false;
        var tuidaohu2 = false;
        var tuidaohu3 = false;
        if(this.tData.tuidaohu){
            tuidaohu = true;
        }

        if(this.tData.tuidaohu2){
            tuidaohu2 = true;
        }

        if(this.tData.tuidaohu3){
            tuidaohu3 = true;
        }

        if(tuidaohu||tuidaohu2||tuidaohu3){
            return true;
        }else{
            return false;
        }
    },

    isKoudian(){

        var koudian = false;
        var koudian2 = false;
        var koudian3 = false;
        if(this.tData.kouDian){
            koudian = true;
        }

        if(this.tData.kouDian2){
            koudian2 = true;
        }

        if(this.tData.kouDian3){
            koudian3 = true;
        }

        if(koudian||koudian2||koudian3){
            return true;
        }else{
            return false;
        }
    },

    isGuaiSanJiao(){

        var guaisanjiao = false;
        var guaisanjiao2 = false;
        if(this.tData.guaisanjiao){
            guaisanjiao = true;
        }

        if(this.tData.guaisanjiao2){
            guaisanjiao2 = true;
        }

        if(guaisanjiao||guaisanjiao2){
            return true;
        }else{
            return false;
        }
    },

    getIndexByGameKind: function(index) {
        this.tData = cc.jsInstance.data.sData.tData;
        if (this.tData.peopleNum === 2) {
            if (index != 0) {
                return 2;
            }
        } else if (this.tData.peopleNum === 3 && this.tData.gameKind != "happyDDZ") {
            if (index === 2) {
                return 3;
            }
        } else if (this.tData.peopleNum === 3 && this.tData.gameKind === "happyDDZ") {
            if (index === 3) {
                return 2;
            }
        }
        return index;
    },

    getCoinFormat: function(coinNum) {
        return cc.jsInstance.native.formatMoney(coinNum);
    },

    wxSetClipboardData: function() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {

        } else {
            var num = this.tData.tableid;
            if (this.tData.tableid.length === 6) {
                num = "0" + num;
            }
            cc.jsInstance.native.wxSetClipboardData(num);
        }
    },
    
    //默认月日 时分
    getCurrentDate: function() {
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth() + 1;
        var hour = d.getHours();
        var minutes = d.getMinutes();
        return +month + "月" + day + "日" + " " + hour + "时" + minutes + "分";
    },

    playDDZCallSorceAudio: function(data) {
        var curPlayer = data.detail.tData.landLoader > 0 ? data.detail.tData.curPlayer : data.detail.tData.curPlayer - 1;
        if (curPlayer < 0) {
            curPlayer = 2;
        }
        switch (data.detail.tData.callRob[curPlayer]) {
            case -1:
                cc.jsInstance.audioManager.playSFXForDDZ("bujiao");
                break;
            case 1:
                cc.jsInstance.audioManager.playSFXForDDZ("man_1_point");
                break;
            case 2:
                cc.jsInstance.audioManager.playSFXForDDZ("man_2_point");
                break;
            case 3:
                cc.jsInstance.audioManager.playSFXForDDZ("man_3_point");
                break;
        }
    },

    playDDZAudioForCardType: function(type) {
        var typeStr = type.split("_")[0];
        console.log("type====", typeStr);
        if (type.split("aircraft").length > 1) {
            typeStr = "aircraft";
        }
        switch (typeStr) {
            //顺子
            case "singleCard":
                var cardStr = this.tData.lastPut[0] % 100;
                cardStr = typeStr + "_" + cardStr;
                cc.jsInstance.audioManager.playSFXForDDZ(cardStr);
                break;
            case "doubleCards":
                var cardStr = this.tData.lastPut[0] % 100;
                cardStr = typeStr + "_" + cardStr;
                cc.jsInstance.audioManager.playSFXForDDZ(cardStr);
                break;
            default:
                cc.jsInstance.audioManager.playSFXForDDZ(typeStr);
                break;
        }
    },

    playAnimForDDZHat: function(node) {
        var actionScale = cc.scaleTo(0.5, 1.5);
        var actionScaleTwo = cc.scaleTo(0.5, 1);
        var seq = cc.sequence(actionScale, actionScaleTwo);
        node.runAction(seq);
    },

});