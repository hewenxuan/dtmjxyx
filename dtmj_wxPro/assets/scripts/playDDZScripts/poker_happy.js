(function() {
    function poker_happy() {}
    // if (typeof(cc.jsInstance) != "undefined") {
    if(cc.jsInstance){
        if (!cc.jsInstance.pokerArr)
            cc.jsInstance.pokerArr = {};
        cc.jsInstance.pokerArr["happyDDZ"] = poker_happy;
    }
    //-------------------继承------------------------------//
    function inherit(superType, subType) {
        var _prototype = Object.create(superType.prototype);
        _prototype.constructor = subType;
        subType.prototype = _prototype;
    }
    // console.log("------poker_happy---------");
    inherit(cc.jsInstance.pokerArr["linfenDDZ"], poker_happy);//  ----------------暂时注释掉,会报错
    //-------------------继承结束------------------------------//\
    //-------------------重写基类相关方法--------------------//
    poker_happy.prototype.otherTypes = {};
    // poker_happy.prototype.havelargerPokers = function(){
    // 	console.log("子类实现方法");
    // }
    //特殊炸弹判断,子类需要重写
    poker_happy.prototype.specialLargerCheck = function(numCards1, numCards2, threeBomb) {
        return false;
    }
    poker_happy.prototype.Noticbomb = function(card1, card2, card3, otherType, threeBomb) {
        console.log("子类提示方法");
        //首先判断是否有22炸,有则优先提示,否则会出现先提示4个炸的情况
        var tempBomb22 = false;
        var tempBombArr = {}; //33,22
        console.log("是否有22炸 tempBomb22:" + tempBomb22);
        for (var i = 0; i <= card1.length - 2; i++) {
            var num = 1;
            var tmparr = [card3[i]];
            for (var j = 1; j < 4; j++) {
                if ((i + j) < card1.length && card1[i] == card1[i + j]) {
                    num++;
                    tmparr.push(card3[i + j])
                } else
                    break;
            }
            var haveBomb = false;

            if (num == 4) {
                console.log("_____有诈 threeBomb:" + threeBomb + " num:" + num + " card1[i]:" + card1[i]);
                haveBomb = true;
            }
            if (haveBomb) {
                // console.log("_____有诈11111 otherType:"+otherType+" card1:"+card1);
                switch (otherType) {
                    case "bomb":
                        // console.log("_____有诈bomb");
                        if (num == 4 && card1[i] > card2[0])
                            return tmparr;
                        break;
                    case "jokerBomb":
                        return false;
                        break;
                    default: //非炸弹类型比较
                        console.log("_____有诈end" + tmparr);
                        if (tempBomb22 && num != 2) //如果有22优先查找
                            break;
                        return tmparr;
                        break;
                }
            }
        }
        //王炸
        if (card1[card1.length - 1] == 55 && card1[card1.length - 2] == 50)
            return [card3[card3.length - 1], card3[card3.length - 2]];
        return false;
    }
})
();