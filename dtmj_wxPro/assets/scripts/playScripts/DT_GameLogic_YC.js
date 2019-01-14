/**
 * Created by Administrator on 2016/12/15.
 */
    var majiang_yc = {};

    //吃判断
    majiang_yc.canChi = function (hand, cd) {
        var num = [0, 0, 0, 0, 0];
        var rtn = [];
        for (var i = 0; i < hand.length; i++) {
            var dif = hand[i] - cd;
            switch (dif) {
                case -2:
                case -1:
                case 1:
                case 2:
                    num[dif + 2]++;
                    break;
            }
        }
        if (num[3] > 0 && num[4] > 0) rtn.push(0);
        if (num[1] > 0 && num[3] > 0) rtn.push(1);
        if (num[0] > 0 && num[1] > 0) rtn.push(2);
        return rtn;
    };
    //碰判断
    majiang_yc.canPeng = function (hand, cd,laizilist) {
        var num = 0;
        for (var i = 0; i < hand.length; i++) {
            if (hand[i] == cd) num++;
        }
        console.log("laizilist"+laizilist);
        console.log("isHun(cd,laizilist)"+isHun(cd,laizilist));
        return (num >= 2&&!isHun(cd,laizilist));
        
    };
    //抓杠判断
    majiang_yc.canGang1 = function (peng, peng4, can7,can13, pl,laizilist) {
        var rtn = [];
        var ting = pl.mjting;
        var hand = pl.mjhand;
        if (ting) {
            for (var i = 0; i < peng.length; i++) {
                if (hand.indexOf(peng[i]) >= 0 && peng4.indexOf(peng[i]) < 0) {
                    rtn.push(peng[i]);
                }
            }
            var cnum = {};
            for (var i = 0; i < hand.length; i++) {
                var cd = hand[i];
                var num = cnum[cd];
                if (!num) num = 0;
                num++;
                cnum[cd] = num;

                if (num == 4 && !isHun(cd,laizilist)) {
                    var cpArry = hand.slice(0);
                    for (var j = 0; j < 4; j++) {
                        cpArry.splice(cpArry.indexOf(cd), 1);
                    }
                    if (this.checkLaiziTing(pl, laizilist, can7, can13)[0] > 0) {
                        rtn.push(cd);
                    } else if (pl.winType > 0) {
                        rtn.push(cd);
                    }
                }
            }
            return rtn;
        } else {
            for (var i = 0; i < peng.length; i++) {
                if (hand.indexOf(peng[i]) >= 0 && peng4.indexOf(peng[i]) < 0) {
                    rtn.push(peng[i]);
                }
            }
            var cnum = {};
            for (var i = 0; i < hand.length; i++) {
                var cd = hand[i];
                var num = cnum[cd];
                if (!num) num = 0;
                num++;
                cnum[cd] = num;
                if (num == 4 && !isHun(cd,laizilist) ) rtn.push(cd);
            }
            return rtn;
        }
    };
    //点杠判断
    majiang_yc.canGang0 = function ( cd,pl, can7, can13,laizilist) {
        var num = 0;
        var ting = pl.mjting;
        if (ting) {
            for (var i = 0; i < pl.mjhand.length; i++) {
                if ( pl.mjhand[i] == cd) num++;
            }
            if (num == 3&& !isHun(cd,laizilist)) {
                var cpArry =  pl.mjhand.slice(0);
                for (var j = 0; j < 3; j++) {
                    cpArry.splice(cpArry.indexOf(cd), 1);
                }
                if (this.checkLaiziTing(pl, laizilist, can7, can13)[0] > 0) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            for (var i = 0; i <  pl.mjhand.length; i++) {
                if ( pl.mjhand[i] == cd) num++;
            }
            return (num == 3&& !isHun(cd,laizilist));
        }
    };


    //检测听牌
    majiang_yc.checkLaiziTing  = function (pl,laizilist, can7, can13) {
        var mjhand=pl.mjhand;
        var tryCard=[];
        var laizi = [];
        //听牌检测数组  是手牌数组中相连或相同的牌型
        for(var i=0;i<mjhand.length;i++)
        {
            var cd=mjhand[i];
            if(isHun(cd,laizilist)){
                laizi.push(cd);
            }else{
                for(var j=-2;j<=2;j++)
                {
                    var cj=cd+j;
                    if(cj>=1&&cj<=9||cj>=11&&cj<=19||cj>=21&&cj<=29)
                    {
                        tryCard.push(cj);
                    }
                }
                if (cd==31||cd==41||cd==51||cd==61||cd==71||cd==81||cd==91)
                {
                    tryCard.push(cd);
                }
            }
        }
        tryCard.sort(function(a,b){return a-b});

        //console.log("tryCard = "+tryCard);
        //去掉数组中相同的元素 减少循环次数
        for(var i = 0;i<tryCard.length-1;i++){
            if(tryCard[i] == tryCard[i+1]){
                tryCard.splice(i,1);
                i--;
            }
        }
        //console.log("tryCard = "+tryCard);

        var maxWin=0;
        var tingKouArray = [];
        for(var cd in tryCard)
        {
            var cdi=tryCard[cd];
            var huType=majiang_yc.canhunhu(laizilist,mjhand,cdi, can7, can13);
            //console.log("huType = "+huType);
            if(huType>0)
            {
                pl.huType=huType;
                var winNum=tryCard[cd];//这里需要改改
                if(winNum>maxWin){
                    maxWin=winNum;
                }
                tingKouArray.push(cdi);
            }
        }
      //  console.log("zwz_maxWin = "+maxWin);
        return [maxWin, tingKouArray];
    };


    //检测听牌
    majiang_yc.canGangInHand = function (pl, putCard,jinlist) {
        var mjhand = pl.mjhand.slice(0);
        var peng = pl.mjpeng;
        var rtn = [];
        for (var i = 0; i < peng.length; i++) {
            if (mjhand.indexOf(peng[i]) >= 0 ) {
                rtn.push(peng[i]);
            }
        }

        var cnum = {};
        for (var i = 0; i < mjhand.length; i++) {
            var cd = mjhand[i];
            var num = cnum[cd];
            if (!num) num = 0;
            num++;
            cnum[cd] = num;
            if (num == 4 ) {

                if(jinlist) {
                    if(jinlist.indexOf(cd) < 0) {
                        rtn.push(cd);
                    }
                }
                else {
                    rtn.push(cd);
                }
                
            }
        }
        return rtn.indexOf(putCard)>=0;
    };
    //检测听牌
    majiang_yc.checkLaiziTing_laizi = function (handCard, laizilist, can7, can13,isKoudian) {
        var mjhand = handCard.slice(0);

        //听牌检测数组  是手牌数组中相连或相同的牌型
        var tryCard = [1, 2, 3, 4, 5, 6, 7, 8, 9,
            11, 12, 13, 14, 15, 16, 17, 18, 19,
            21, 22, 23, 24, 25, 26, 27, 28, 29
        ];

        var sData = cc.jsInstance.data.sData;
        var tData = sData?sData.tData:null;
        if(tData){
            if(tData.withWind){
                tryCard = tryCard.concat([31, 41, 51, 61, 71, 81, 91]);
            }
        }

        if(isKoudian){
            tryCard = [ 6, 7, 8, 9,
            16, 17, 18, 19,
            26, 27, 28, 29,
            31, 41, 51, 61, 71, 81, 91];
        }

        var tingKouArray = [];
        for (var cd in tryCard) {
            var cdi = tryCard[cd];
            var huType = majiang_yc.canhunhu(laizilist, mjhand, cdi, can7, can13);
            if (huType > 0) {
                tingKouArray.push(cdi);
            }
        }
        return tingKouArray;
    };
    //检测听牌
    majiang_yc.checkLaiziTing_laiziOne = function (handCard, laizilist, can7, can13,isKoudian) {
        var mjhand = handCard.slice(0);

        //听牌检测数组  是手牌数组中相连或相同的牌型
        var tryCard = [1, 2, 3, 4, 5, 6, 7, 8, 9,
            11, 12, 13, 14, 15, 16, 17, 18, 19,
            21, 22, 23, 24, 25, 26, 27, 28, 29
        ];

        var sData = cc.jsInstance.data.sData;
        var tData = sData?sData.tData:null;
        if(tData){
            if(tData.withWind){
                tryCard.concat([31, 41, 51, 61, 71, 81, 91]);
            }
        }

        var tingKouArray = [];
        for (var cd in tryCard) {
            var cdi = tryCard[cd];
            var huType = majiang_yc.canhunhuOne(laizilist, mjhand, cdi, can7, can13);
            if (huType > 0) {
                tingKouArray.push(cdi);
            }
        }
        return tingKouArray;
    };


    var xunhuancishu = 0;
    var xunhuancishu222 = 0;
    var xunhuancishu333 = 0;
    //检测听牌
    majiang_yc.checkLaiziTing111  = function (mjhand1,laizilist, can7, can13) {
        var mjhand=mjhand1;
        var tryCard=[];
        var laizi = [];
        tryCard.push(laizilist[0]);
        //console.log("tryCard = "+tryCard);

        var maxWin=0;
        var tingKouArray = [];
        for(var cd in tryCard)
        {
            var cdi=tryCard[cd];

            var huType=majiang_yc.canhunhu(laizilist,mjhand,cdi, can7, can13);
            //cc.log("递归调用入口 = "+xunhuancishu);
            //cc.log("递归调用剩癞子不够判断后入口 = "+xunhuancishu333);
            //cc.log("递归调用剩3张判断之后入口 = "+xunhuancishu222);
            //console.log("huType = "+huType);
            if(huType>0)
            {
                //cc.log("hu递归调用入口 = "+xunhuancishu);
                //cc.log("hu递归调用剩癞子不够判断后入口 = "+xunhuancishu333);
                //cc.log("hu递归调用剩3张判断之后入口 = "+xunhuancishu222);
                xunhuancishu = 0;
                xunhuancishu333 = 0;
                xunhuancishu222 = 0;

                var winNum=tryCard[cd];//这里需要改改
                if(winNum>maxWin){
                    maxWin=winNum;
                }
                tingKouArray.push(cdi);
            }
        }
        //  console.log("zwz_maxWin = "+maxWin);
        return [maxWin, tingKouArray];
    };

    //十三幺胡
    var s13 = [1, 9, 11, 19, 21, 29, 31, 41, 51, 61, 71, 81, 91];
    //------------------癞子相关----------------------//
    var cardType={//分牌类型
        tiao:0,
        tong:1,
        wan:2,
        feng:3,
        hun:4
    };

    var needMinHunNum=8;
    function canMath3(cds,i)
    {
        if(i+2>=cds.length) return false;
        var pat=[[0,0,0],[0,1,2]];
        for(var j=0;j<pat.length;j++)
        {
            var pj=pat[j];
            for(var k=0;k<pj.length;k++)
            {
                if(pj[k]+cds[i]!=cds[k+i]) break;
                if(k==pj.length-1) return true;
            }
        }
        return false
    }
    function canMath6(cds,i)
    {
        if( i+5>=cds.length) return false;
        var pat=[[0,0,1,1,2,2],[0,1,1,2,2,3],[0,1,1,1,1,2]];
        for(var j=0;j<pat.length;j++)
        {
            var pj=pat[j];
            for(var k=0;k<pj.length;k++)
            {
                if(pj[k]+cds[i]!=cds[k+i]) break;
                if(k==pj.length-1) return true;
            }
        }
        return false;
    }
    function canMath9(cds,i)
    {
        if( i+8>=cds.length) return false;
        var pat=[[0,1,1,2,2,2,3,3,4],[0,1,1,1,2,2,2,3,3],[0,0,1,1,1,2,2,2,3]];
        for(var j=0;j<pat.length;j++)
        {
            var pj=pat[j];
            for(var k=0;k<pj.length;k++)
            {
                if(pj[k]+cds[i]!=cds[k+i]) break;
                if(k==pj.length-1) return true;
            }
        }
        return false;
    }
    function canMath12(cds,i)
    {
        if( i+11>=cds.length) return false;
        var pat=[[0,1,1,2,2,2,3,3,3,4,4,5]];
        for(var j=0;j<pat.length;j++)
        {
            var pj=pat[j];
            for(var k=0;k<pj.length;k++)
            {
                if(pj[k]+cds[i]!=cds[k+i]) break;
                if(k==pj.length-1) return true;
            }
        }
        return false;
    }
    function canMatchSeq(seg) {
        var matchOK = true;
        for (var m = 0; m < seg.length;) {
            if (canMath3(seg, m))      m += 3;
            else if (canMath6(seg, m))  m += 6;
            else if (canMath9(seg, m))  m += 9;
            else if (canMath12(seg, m))  m += 12;
            else {
                matchOK = false;
                break;
            }
        }
        return matchOK;
    }

    //癞子 判断最少癞子算法
    function calNeedHunNumToBePu(typeVec,needNum){
        //xunhuancishu++;
        var p1,p2,p3;
        if (needMinHunNum == 0) return;
        if (needNum >= needMinHunNum)return;
        // xunhuancishu333++;
        var vSize = typeVec.length;
        if (vSize == 0)
        {
            needMinHunNum = needNum>needMinHunNum ? needMinHunNum:needNum;
            return;
        }
        else if (vSize == 1)
        {
            needMinHunNum = (needNum+2)>needMinHunNum ? needMinHunNum:(needNum+2);
            return;
        }
        else if (vSize == 2)
        {
            p1 = typeVec[0];
            p2 = typeVec[1];

            if (p2 - p1 < 3)
            {
                needMinHunNum = (needNum+1)>needMinHunNum ? needMinHunNum:(needNum+1);
            }
            return;
        }
       // xunhuancishu222++;


        //大于等于3张牌
        p1 = typeVec[0];
        p2 = typeVec[1];
        p3 = typeVec[2];
        var k2=1;
        var k3=2;

        //第一个自己一扑
        if (needNum + 2<needMinHunNum)
        {
            typeVec.splice(0,1);
            calNeedHunNumToBePu(typeVec, needNum + 2);
            typeVec.splice(0,0,p1);
        }



        //第一个跟其它的一个一扑
        if (needNum + 1<needMinHunNum)
        {
            for (var i = 1; i < typeVec.length; i++)
            {
                if (needNum + 1 >= needMinHunNum) break;
                p2 = typeVec[i];
                k2=i;
                //455567这里可结合的可能为 45 46 否则是45 45 45 46
                //如果当前的value不等于下一个value则和下一个结合避免重复
                if (i + 1 != typeVec.length)
                {
                    p3 = typeVec[i + 1];
                    k3=i+1;
                    if (p3 == p2) continue;
                }
                if (p2 - p1 < 3)
                {
                    typeVec.splice(0,1);
                    typeVec.splice(k2-1,1);

                    calNeedHunNumToBePu(typeVec, needNum + 1);

                    typeVec.splice(k2-1,0,p2);
                    typeVec.splice(0,0,p1);
                }
                else break;
            }

        }

        //第一个和其它两个一扑
        //后面间隔两张张不跟前面一张相同222234
        //可能性为222 234
        for (var ii = 1; ii < typeVec.length; ii++)
        {
            if (needNum >= needMinHunNum) break;
            p2 = typeVec[ii];
            k2=ii;
            if (ii + 2 < typeVec.length)
            {
                if (typeVec[ii + 2] == p2) continue;
            }
            for (var j = ii + 1; j < typeVec.length; j++)
            {
                if (needNum >= needMinHunNum) break;
                p3 = typeVec[j];
                k3=j;

                if (p1 == p3)
                {
                }
                if (j + 1 < typeVec.length)
                {
                    if (p3 == typeVec[j + 1]) continue;
                }

                var tempSeg = [p1,p2,p3];
                if (canMatchSeq(tempSeg))
                {
                    typeVec.splice(0,1);
                    typeVec.splice(k2-1,1);
                    typeVec.splice(k3-2,1);

                    calNeedHunNumToBePu(typeVec, needNum);
                    typeVec.splice(k3-2,0,p3);
                    typeVec.splice(k2-1,0,p2);
                    typeVec.splice(0,0,p1);
                }
                //4556
            }
        }
    }
    //将在其中 判断癞子个数算法
    function isCanHunHu(hunNum,m_HuPaiVec){
        var huSize = m_HuPaiVec.length;
        if (huSize <= 0)
        {
            if(hunNum >= 2){
                return true;
            }else{
                return false;
            }
        }
        var firstPai = m_HuPaiVec[0];
        var huPaiCopy=[];
        for(var i=0;i<m_HuPaiVec.length;i++){
            huPaiCopy.push(m_HuPaiVec[i]);
        }
        for (var it=0; it < huPaiCopy.length; it++)
        {
            if (it == huPaiCopy.length - 1)
            {
                if (hunNum > 0)
                {
                    hunNum = hunNum - 1;
                    var pairCard = huPaiCopy[it];
                    m_HuPaiVec.splice(it,1);
                    needMinHunNum = hunNum+2;
                    calNeedHunNumToBePu(m_HuPaiVec, 0);
                    if (needMinHunNum <= hunNum)
                    {
                        return true;
                    }
                    hunNum = hunNum + 1;
                    m_HuPaiVec.splice(it,0,pairCard);
                }
            }
            else
            {
                if ((it + 2 == huPaiCopy.length) || (huPaiCopy[it]!= huPaiCopy[it + 2]))
                {
                    if (huPaiCopy[it] == huPaiCopy[it+1])
                    {
                        var pair1 = m_HuPaiVec[it];
                        var pair2 = m_HuPaiVec[it+1];
                        m_HuPaiVec.splice(it,1);
                        m_HuPaiVec.splice(it,1);

                        needMinHunNum = hunNum+1;
                        calNeedHunNumToBePu(m_HuPaiVec, 0);
                        if (needMinHunNum <= hunNum)
                        {
                            return true;
                        }
                        m_HuPaiVec.splice(it,0,pair2);
                        m_HuPaiVec.splice(it,0,pair1);
                    }
                }
                if (hunNum>0 && (huPaiCopy[it] != huPaiCopy[it+1]))
                {
                    hunNum = hunNum - 1;
                    var pair3 = m_HuPaiVec[it];
                    m_HuPaiVec.splice(it,1);
                    needMinHunNum = hunNum+2;
                    calNeedHunNumToBePu(m_HuPaiVec, 0);
                    if (needMinHunNum <= hunNum)
                    {
                        return true;
                    }
                    hunNum = hunNum + 1;
                    m_HuPaiVec.splice(it,0,pair3);
                }
            }
        }
        return false;
    }
    //癞子胡法
    function laizi_canhu (laizilist,cds,cd) {
        //1.初始化
        var allCards=[];
        allCards[cardType.tiao]=[];
        allCards[cardType.tong]=[];
        allCards[cardType.wan]=[];
        allCards[cardType.feng]=[];//
        allCards[cardType.hun]=[];
        var tmp=[];
        for(var i=0;i<cds.length;i++){
            tmp.push(cds[i]);
        }
        if(cd){
            tmp.push(cd);
        }
        cds=tmp;
        cds.sort(function(a,b){return a-b});

        for(i=0;i<cds.length;i++){
            if(isHun(cds[i],laizilist)){
                allCards[cardType.hun].push(cds[i]);
            }else if(isTiao(cds[i])){
                allCards[cardType.tiao].push(cds[i]);
            }else if(isTong(cds[i])){
                allCards[cardType.tong].push(cds[i]);
            }else if(isWan(cds[i])){
                allCards[cardType.wan].push(cds[i]);
            }else if(isFeng(cds[i])){
                allCards[cardType.feng].push(cds[i]);
            }
        }

        needMinHunNum =  allCards[cardType.hun].length+1;
        calNeedHunNumToBePu(allCards[cardType.wan], 0);
        var wanToPuNeedNum = needMinHunNum;

        needMinHunNum =  allCards[cardType.hun].length+1;
        calNeedHunNumToBePu(allCards[cardType.tong], 0);
        var tongToPuNeedNum = needMinHunNum;

        needMinHunNum =  allCards[cardType.hun].length+1;
        calNeedHunNumToBePu(allCards[cardType.tiao], 0);
        var tiaoToPuNeedNum = needMinHunNum;


        needMinHunNum =  allCards[cardType.hun].length+1;
        calNeedHunNumToBePu(allCards[cardType.feng], 0);
        var fengToPuNeedNum = needMinHunNum;

        var hasNum = 0;
        var isHu = false;
        var hunHuType=100;//混胡的类型定义
        var curHunNum = allCards[cardType.hun].length;
        var needHunNum = 0;
        //将在万中
        //如果需要的混小于等于当前的则计算将在将在万中需要的混的个数
        needHunNum = tongToPuNeedNum + tiaoToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum)
        {
            hasNum = curHunNum - needHunNum;
            isHu= isCanHunHu(hasNum,allCards[cardType.wan]);
            if (isHu)  return hunHuType;
        }
        //将在饼中
        needHunNum = wanToPuNeedNum + tiaoToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum)
        {
            hasNum = curHunNum - needHunNum;
            isHu= isCanHunHu(hasNum,allCards[cardType.tong]);
            if (isHu)  return hunHuType;
        }
        //将在条中
        needHunNum = wanToPuNeedNum + tongToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum)
        {
            hasNum = curHunNum - needHunNum;
            isHu= isCanHunHu(hasNum,allCards[cardType.tiao]);
            if (isHu)  return hunHuType;
        }
        //将在风中,支持
        needHunNum = wanToPuNeedNum + tongToPuNeedNum + tiaoToPuNeedNum;
        if (needHunNum <= curHunNum)
        {
            hasNum = curHunNum - needHunNum;
            isHu= isCanHunHu(hasNum,allCards[cardType.feng]);
            if (isHu)  return hunHuType;
        }
        return 0;
    }
    function isTiao(card){
        if(card>=1&&card<=9){
            return true;
        }
        return false;
    }
    function isTong(card){
        if(card>=21&&card<=29){
            return true;
        }
        return false;
    }
    function isWan(card){
        if(card>=11&&card<=19){
            return true;
        }
        return false;
    }
    function isFeng(card){
        if(card>=31&&card<=91){
            return true;
        }
        return false;
    }
    function isHun(card,laiziList){
        if(laiziList){
            for(var i in laiziList){
                if(card==laiziList[i]){
                    return true;
                }
            }
        }
        return false;
    }

    function laizi_can7hu(laizilist,cds, cd) {
        //console.log("zwzlaizi_can7hu");
        var tmp = [];
        for (var i = 0; i < cds.length; i++) tmp.push(cds[i]);
        if (cd) tmp.push(cd);
        tmp.sort(function (a, b) {
            return a - b
        });

        if (tmp.length != 14) {
            return 0;
        }
        var oddCards = tmp.slice(0);
        var hunCards = [];

        for (i = 0; i < tmp.length; i++) {
            if (isHun(tmp[i],laizilist)) {
                hunCards.push(tmp[i]);
                var index = oddCards.indexOf(tmp[i]);
                oddCards.splice(index, 1);
                continue;
            }
            if (i == tmp.length - 1) {
                continue;
            }
            else if (tmp[i] == tmp[i + 1]) {
                var index = oddCards.indexOf(tmp[i]);
                oddCards.splice(index, 2);
                i++;
            }
        }

        if (oddCards.length > 0) {//有单牌
            if (hunCards.length >= oddCards.length) {//单牌数==红中数
                return 107;
            }
        } else {
            return 107;
        }
        return 0;
    }
    function laizi_can13hu(laizilist,cds, cd) {
       // console.log("zwzlaizi_can13hu");
        var tmp = [];
        for (var i = 0; i < cds.length; i++) tmp.push(cds[i]);
        if (cd) tmp.push(cd);
        tmp.sort(function (a, b) {
            return a - b
        });

        if (tmp.length != 14) {
            return 0;
        }

        var hunCards = [];
        var oddCards = tmp.slice(0);
        //删除癞子后剩余牌
        for(var i in tmp){
            if (isHun(tmp[i],laizilist)) {
                hunCards.push(tmp[i]);
                var index = oddCards.indexOf(tmp[i]);
                oddCards.splice(index, 1);
            }
        }
        //找将牌 没有将牌 癞子牌-1
        var hasjiang = false;
        for (var i = 0; i < oddCards.length-1 ; i++) {
            if (oddCards[i] == oddCards[i + 1]) {
                oddCards.splice(i, 1);
                hasjiang = true;
                break;
            }
        }
        //剩余牌跟13张比较 成一个数组减1 剩余数组就是需要癞子的数量
        var shisanyao = s13.slice(0);
        for (var i = 0; i < oddCards.length ; i++) {
            var index = shisanyao.indexOf(oddCards[i]);
            if(index>=0){
                shisanyao.splice(index,1);
            }
        }
        //console.log("hunCards.length = "+hunCards);
        //console.log("shisanyao.length = "+shisanyao);
        //console.log("hasjiang = "+hasjiang);
        var needhunNum = hunCards.length-shisanyao.length - (hasjiang?0:1);
        //console.log("needhunNum = "+needhunNum);
        if(needhunNum>=0){
            return 113;
        }else{
            return 0;
        }
    }
    majiang_yc.canhunhu = function(laizilist,cds,cd, can7, can13) {
        if(cd == 0)
        {
            return 0;
        }
        var huType = laizi_canhu(laizilist,cds,cd);
       // console.log("zwz_hutype = "+huType);
        if (can7) {
            var huType7 = laizi_can7hu(laizilist,cds, cd);
            if (huType7 > 0) {
                huType = huType7;
            }
        }
       // console.log("zwz_7hutype = "+huType);
        if (can13) {
            var huType13 = laizi_can13hu(laizilist,cds, cd);
             //console.log("zwz_13hutype = "+huType13);
            if (huType13 > 0) {
                huType = huType13;
            }
        }
       // console.log("zwz_13hutype = "+huType);
        return huType;
    }

    //癞子 判断最少癞子算法
    function calNeedHunNumToBePuOne(typeVec,needNum){
        var p1, p2, p3;
        if (needMinHunNum == 0) return;
        if (needNum >= needMinHunNum) return;

        var vSize = typeVec.length;
        if (vSize == 0) {
            needMinHunNum = needNum > needMinHunNum ? needMinHunNum : needNum;
            return;
        }
        else if (vSize == 1) {
            //needMinHunNum = (needNum+2)>needMinHunNum ? needMinHunNum:(needNum+2);
            return;
        }
        else if (vSize == 2) {
            p1 = typeVec[0];
            p2 = typeVec[1];

            if (p2 - p1 < 3) {
                needMinHunNum = (needNum + 1) > needMinHunNum ? needMinHunNum : (needNum + 1);
            }
            return;
        }


        //大于等于3张牌
        p1 = typeVec[0];
        p2 = typeVec[1];
        p3 = typeVec[2];
        var k2 = 1;
        var k3 = 2;

        // //第一个自己一扑
        // if (needNum + 2<needMinHunNum)
        // {
        //     typeVec.splice(0,1);
        //     calNeedHunNumToBePu(typeVec, needNum + 2);
        //     typeVec.splice(0,0,p1);
        // }


        //第一个跟其它的一个一扑
        if (needNum + 1 < needMinHunNum) {
            for (var i = 1; i < typeVec.length; i++) {
                if (needNum + 1 >= needMinHunNum) break;
                p2 = typeVec[i];
                k2 = i;
                //455567这里可结合的可能为 45 46 否则是45 45 45 46
                //如果当前的value不等于下一个value则和下一个结合避免重复
                if (i + 1 != typeVec.length) {
                    p3 = typeVec[i + 1];
                    k3 = i + 1;
                    if (p3 == p2) continue;
                }
                if (p2 - p1 < 3) {
                    typeVec.splice(0, 1);
                    typeVec.splice(k2 - 1, 1);

                    calNeedHunNumToBePuOne(typeVec, needNum + 1);

                    typeVec.splice(k2 - 1, 0, p2);
                    typeVec.splice(0, 0, p1);
                }
                else break;
            }

        }

        //第一个和其它两个一扑
        //后面间隔两张张不跟前面一张相同222234
        //可能性为222 234
        for (var ii = 1; ii < typeVec.length; ii++) {
            if (needNum >= needMinHunNum) break;
            p2 = typeVec[ii];
            k2 = ii;
            if (ii + 2 < typeVec.length) {
                if (typeVec[ii + 2] == p2) continue;
            }
            for (var j = ii + 1; j < typeVec.length; j++) {
                if (needNum >= needMinHunNum) break;
                p3 = typeVec[j];
                k3 = j;

                if (p1 == p3) {
                }
                if (j + 1 < typeVec.length) {
                    if (p3 == typeVec[j + 1]) continue;
                }

                var tempSeg = [p1, p2, p3];
                if (canMatchSeq(tempSeg)) {
                    typeVec.splice(0, 1);
                    typeVec.splice(k2 - 1, 1);
                    typeVec.splice(k3 - 2, 1);

                    calNeedHunNumToBePuOne(typeVec, needNum);
                    typeVec.splice(k3 - 2, 0, p3);
                    typeVec.splice(k2 - 1, 0, p2);
                    typeVec.splice(0, 0, p1);
                }
                //4556
            }
        }
    }
    //将在其中 判断癞子个数算法
    function isCanHunHuOne(hunNum,m_HuPaiVec){
        var huSize = m_HuPaiVec.length;
        if (huSize <= 0)
        {
            if(hunNum >= 2){
                return true;
            }else{
                return false;
            }
        }
        var firstPai = m_HuPaiVec[0];
        var huPaiCopy=[];
        for(var i=0;i<m_HuPaiVec.length;i++){
            huPaiCopy.push(m_HuPaiVec[i]);
        }
        for (var it=0; it < huPaiCopy.length; it++)
        {
            if (it == huPaiCopy.length - 1)
            {
                if (hunNum > 0)
                {
                    hunNum = hunNum - 1;
                    var pairCard = huPaiCopy[it];
                    m_HuPaiVec.splice(it,1);
                    needMinHunNum = hunNum+2;
                    calNeedHunNumToBePuOne(m_HuPaiVec, 0);
                    if (needMinHunNum <= hunNum)
                    {
                        return true;
                    }
                    hunNum = hunNum + 1;
                    m_HuPaiVec.splice(it,0,pairCard);
                }
            }
            else
            {
                if ((it + 2 == huPaiCopy.length) || (huPaiCopy[it]!= huPaiCopy[it + 2]))
                {
                    if (huPaiCopy[it] == huPaiCopy[it+1])
                    {
                        var pair1 = m_HuPaiVec[it];
                        var pair2 = m_HuPaiVec[it+1];
                        m_HuPaiVec.splice(it,1);
                        m_HuPaiVec.splice(it,1);

                        needMinHunNum = hunNum+1;
                        calNeedHunNumToBePuOne(m_HuPaiVec, 0);
                        if (needMinHunNum <= hunNum)
                        {
                            return true;
                        }
                        m_HuPaiVec.splice(it,0,pair2);
                        m_HuPaiVec.splice(it,0,pair1);
                    }
                }
                if (hunNum>0 && (huPaiCopy[it] != huPaiCopy[it+1]))
                {
                    hunNum = hunNum - 1;
                    var pair3 = m_HuPaiVec[it];
                    m_HuPaiVec.splice(it,1);
                    needMinHunNum = hunNum+2;
                    calNeedHunNumToBePuOne(m_HuPaiVec, 0);
                    if (needMinHunNum <= hunNum)
                    {
                        return true;
                    }
                    hunNum = hunNum + 1;
                    m_HuPaiVec.splice(it,0,pair3);
                }
            }
        }
        return false;
    }
    //癞子胡法
    function laizi_canhuOne (laizilist,cds,cd) {
        //1.初始化
        var allCards=[];
        allCards[cardType.tiao]=[];
        allCards[cardType.tong]=[];
        allCards[cardType.wan]=[];
        allCards[cardType.feng]=[];//
        allCards[cardType.hun]=[];
        var tmp=[];
        for(var i=0;i<cds.length;i++){
            tmp.push(cds[i]);
        }
        if(cd){
            tmp.push(cd);
        }
        cds=tmp;
        cds.sort(function(a,b){return a-b});

        for(i=0;i<cds.length;i++){
            if(isHun(cds[i],laizilist)){
                allCards[cardType.hun].push(cds[i]);
            }else if(isTiao(cds[i])){
                allCards[cardType.tiao].push(cds[i]);
            }else if(isTong(cds[i])){
                allCards[cardType.tong].push(cds[i]);
            }else if(isWan(cds[i])){
                allCards[cardType.wan].push(cds[i]);
            }else if(isFeng(cds[i])){
                allCards[cardType.feng].push(cds[i]);
            }
        }

        needMinHunNum =  allCards[cardType.hun].length+1;
        calNeedHunNumToBePuOne(allCards[cardType.wan], 0);
        var wanToPuNeedNum = needMinHunNum;

        needMinHunNum =  allCards[cardType.hun].length+1;
        calNeedHunNumToBePuOne(allCards[cardType.tong], 0);
        var tongToPuNeedNum = needMinHunNum;

        needMinHunNum =  allCards[cardType.hun].length+1;
        calNeedHunNumToBePuOne(allCards[cardType.tiao], 0);
        var tiaoToPuNeedNum = needMinHunNum;


        needMinHunNum =  allCards[cardType.hun].length+1;
        calNeedHunNumToBePuOne(allCards[cardType.feng], 0);
        var fengToPuNeedNum = needMinHunNum;

        var hasNum = 0;
        var isHu = false;
        var hunHuType=100;//混胡的类型定义
        var curHunNum = allCards[cardType.hun].length;
        var needHunNum = 0;
        //将在万中
        //如果需要的混小于等于当前的则计算将在将在万中需要的混的个数
        needHunNum = tongToPuNeedNum + tiaoToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum)
        {
            hasNum = curHunNum - needHunNum;
            isHu= isCanHunHuOne(hasNum,allCards[cardType.wan]);
            if (isHu)  return hunHuType;
        }
        //将在饼中
        needHunNum = wanToPuNeedNum + tiaoToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum)
        {
            hasNum = curHunNum - needHunNum;
            isHu= isCanHunHuOne(hasNum,allCards[cardType.tong]);
            if (isHu)  return hunHuType;
        }
        //将在条中
        needHunNum = wanToPuNeedNum + tongToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum)
        {
            hasNum = curHunNum - needHunNum;
            isHu= isCanHunHuOne(hasNum,allCards[cardType.tiao]);
            if (isHu)  return hunHuType;
        }
        //将在风中,支持
        needHunNum = wanToPuNeedNum + tongToPuNeedNum + tiaoToPuNeedNum;
        if (needHunNum <= curHunNum)
        {
            hasNum = curHunNum - needHunNum;
            isHu= isCanHunHuOne(hasNum,allCards[cardType.feng]);
            if (isHu)  return hunHuType;
        }
        return 0;
    }

    majiang_yc.canhunhuOne = function(laizilist,cds,cd, can7, can13) {
        if(cd == 0)
        {
            return 0;
        }
        var huType = laizi_canhuOne(laizilist,cds,cd);
        if (can7) {
            var huType7 = laizi_can7hu(laizilist,cds, cd);
            if (huType7 > 0) {
                huType = huType7;
            }
        }
        if (can13) {
            var huType13 = laizi_can13hu(laizilist,cds, cd);
            if (huType13 > 0) {
                huType = huType13;
            }
        }
        return huType;
    }

    function canMatchFeng(cards){
        var hand = cards.slice(0);
        hand.sort(function(a,b){return a-b});
        var fengArr = [
            [31, 31, 31], [41, 41, 41], [51, 51, 51], [61, 61, 61], //东西南北刻子
            [71, 71, 71], [81, 81, 81], [91, 91, 91], //中发白刻子
            [31, 41, 51], [31, 51, 61], [31, 41, 61], [41, 51, 61],//东西南北顺子
            [71, 81, 91]//中发白顺子
        ]
        for(var i = 0;i<fengArr.length;i++){
            if(hand.toString() == fengArr[i].toString()){
                return true;
            }
        }
        return false;
    }

    //癞子 判断最少癞子算法
    function calNeedHunNumToBePuWithFeng(typeVec,needNum,laizilist){
        //xunhuancishu++;
        var p1,p2,p3;
        if (needMinHunNum == 0) return;
        if (needNum >= needMinHunNum)return;
        // xunhuancishu333++;
        var vSize = typeVec.length;
        if (vSize == 0)
        {
            needMinHunNum = needNum>needMinHunNum ? needMinHunNum:needNum;
            return;
        }
        else if (vSize == 1)
        {
            needMinHunNum = (needNum+2)>needMinHunNum ? needMinHunNum:(needNum+2);
            return;
        }
        else if (vSize == 2)
        {
            p1 = typeVec[0];
            p2 = typeVec[1];
            p3 = laizilist[0];
            if(p3>30){
                var tempSeg = [p1,p2,p3];
                if (canMatchFeng(tempSeg))
                {
                    needMinHunNum = (needNum+1)>needMinHunNum ? needMinHunNum:(needNum+1);
                }
            }else{
                if (p2 - p1 < 3)
                {
                    needMinHunNum = (needNum+1)>needMinHunNum ? needMinHunNum:(needNum+1);
                }
            }


            return;
        }
        // xunhuancishu222++;


        //大于等于3张牌
        p1 = typeVec[0];
        p2 = typeVec[1];
        p3 = typeVec[2];
        var k2=1;
        var k3=2;

        //第一个自己一扑
        if (needNum + 2<needMinHunNum)
        {
            typeVec.splice(0,1);
            calNeedHunNumToBePuWithFeng(typeVec, needNum + 2,laizilist);
            typeVec.splice(0,0,p1);
        }



        //第一个跟其它的一个一扑
        if (needNum + 1<needMinHunNum)
        {
            for (var i = 1; i < typeVec.length; i++)
            {
                if (needNum + 1 >= needMinHunNum) break;
                p2 = typeVec[i];
                k2=i;
                //455567这里可结合的可能为 45 46 否则是45 45 45 46
                //如果当前的value不等于下一个value则和下一个结合避免重复
                if (i + 1 != typeVec.length)
                {
                    p3 = typeVec[i + 1];
                    k3=i+1;
                    if (p3 == p2) continue;
                }

                var p4 = laizilist[0];
                if(p4>30){
                    var tempSeg = [p1,p2,p4];
                    if (canMatchFeng(tempSeg))
                    {
                        typeVec.splice(0,1);
                        typeVec.splice(k2-1,1);

                        calNeedHunNumToBePuWithFeng(typeVec, needNum + 1,laizilist);

                        typeVec.splice(k2-1,0,p2);
                        typeVec.splice(0,0,p1);
                    }else break;
                }else{
                    if (p2 - p1 < 3)
                    {
                        typeVec.splice(0,1);
                        typeVec.splice(k2-1,1);

                        calNeedHunNumToBePuWithFeng(typeVec, needNum + 1,laizilist);

                        typeVec.splice(k2-1,0,p2);
                        typeVec.splice(0,0,p1);
                    }
                    else break;
                }
            }

        }

        //第一个和其它两个一扑
        //后面间隔两张张不跟前面一张相同222234
        //可能性为222 234
        for (var ii = 1; ii < typeVec.length; ii++)
        {
            if (needNum >= needMinHunNum) break;
            p2 = typeVec[ii];
            k2=ii;
            if (ii + 2 < typeVec.length)
            {
                if (typeVec[ii + 2] == p2) continue;
            }
            for (var j = ii + 1; j < typeVec.length; j++)
            {
                if (needNum >= needMinHunNum) break;
                p3 = typeVec[j];
                k3=j;

                if (p1 == p3)
                {
                }
                if (j + 1 < typeVec.length)
                {
                    if (p3 == typeVec[j + 1]) continue;
                }

                var tempSeg = [p1,p2,p3];
                if (canMatchFeng(tempSeg))
                {
                    typeVec.splice(0,1);
                    typeVec.splice(k2-1,1);
                    typeVec.splice(k3-2,1);

                    calNeedHunNumToBePuWithFeng(typeVec, needNum,laizilist);
                    typeVec.splice(k3-2,0,p3);
                    typeVec.splice(k2-1,0,p2);
                    typeVec.splice(0,0,p1);
                }
                //4556
            }
        }
    }
    //将在其中 判断癞子个数算法
    function isCanHunHuWithFeng(hunNum,m_HuPaiVec,laizilist){
        var huSize = m_HuPaiVec.length;
        if (huSize <= 0)
        {
            if(hunNum >= 2){
                return true;
            }else{
                return false;
            }
        }
        var firstPai = m_HuPaiVec[0];
        var huPaiCopy=[];
        for(var i=0;i<m_HuPaiVec.length;i++){
            huPaiCopy.push(m_HuPaiVec[i]);
        }
        for (var it=0; it < huPaiCopy.length; it++)
        {
            if (it == huPaiCopy.length - 1)
            {
                if (hunNum > 0)
                {
                    hunNum = hunNum - 1;
                    var pairCard = huPaiCopy[it];
                    m_HuPaiVec.splice(it,1);
                    needMinHunNum = hunNum+2;
                    calNeedHunNumToBePuWithFeng(m_HuPaiVec, 0,laizilist);
                    if (needMinHunNum <= hunNum)
                    {
                        return true;
                    }
                    hunNum = hunNum + 1;
                    m_HuPaiVec.splice(it,0,pairCard);
                }
            }
            else
            {
                if ((it + 2 == huPaiCopy.length) || (huPaiCopy[it]!= huPaiCopy[it + 2]))
                {
                    if (huPaiCopy[it] == huPaiCopy[it+1])
                    {
                        var pair1 = m_HuPaiVec[it];
                        var pair2 = m_HuPaiVec[it+1];
                        m_HuPaiVec.splice(it,1);
                        m_HuPaiVec.splice(it,1);

                        needMinHunNum = hunNum+1;
                        calNeedHunNumToBePuWithFeng(m_HuPaiVec, 0,laizilist);
                        if (needMinHunNum <= hunNum)
                        {
                            return true;
                        }
                        m_HuPaiVec.splice(it,0,pair2);
                        m_HuPaiVec.splice(it,0,pair1);
                    }
                }
                if (hunNum>0 && (huPaiCopy[it] != huPaiCopy[it+1]))
                {
                    hunNum = hunNum - 1;
                    var pair3 = m_HuPaiVec[it];
                    m_HuPaiVec.splice(it,1);
                    needMinHunNum = hunNum+2;
                    calNeedHunNumToBePuWithFeng(m_HuPaiVec, 0,laizilist);
                    if (needMinHunNum <= hunNum)
                    {
                        return true;
                    }
                    hunNum = hunNum + 1;
                    m_HuPaiVec.splice(it,0,pair3);
                }
            }
        }
        return false;
    }
    //癞子胡法
    function laizi_canhuwithfeng (laizilist,cds,cd) {
        //1.初始化
        var allCards=[];
        allCards[cardType.tiao]=[];
        allCards[cardType.tong]=[];
        allCards[cardType.wan]=[];
        allCards[cardType.feng]=[];//
        allCards[cardType.hun]=[];
        var tmp=[];
        for(var i=0;i<cds.length;i++){
            tmp.push(cds[i]);
        }
        if(cd){
            tmp.push(cd);
        }
        cds=tmp;
        cds.sort(function(a,b){return a-b});

        for(i=0;i<cds.length;i++){
            if(isHun(cds[i],laizilist)){
                allCards[cardType.hun].push(cds[i]);
            }else if(isTiao(cds[i])){
                allCards[cardType.tiao].push(cds[i]);
            }else if(isTong(cds[i])){
                allCards[cardType.tong].push(cds[i]);
            }else if(isWan(cds[i])){
                allCards[cardType.wan].push(cds[i]);
            }else if(isFeng(cds[i])){
                allCards[cardType.feng].push(cds[i]);
            }
        }

        needMinHunNum =  allCards[cardType.hun].length+1;
        calNeedHunNumToBePu(allCards[cardType.wan], 0);
        var wanToPuNeedNum = needMinHunNum;

        needMinHunNum =  allCards[cardType.hun].length+1;
        calNeedHunNumToBePu(allCards[cardType.tong], 0);
        var tongToPuNeedNum = needMinHunNum;

        needMinHunNum =  allCards[cardType.hun].length+1;
        calNeedHunNumToBePu(allCards[cardType.tiao], 0);
        var tiaoToPuNeedNum = needMinHunNum;


        needMinHunNum =  allCards[cardType.hun].length+1;
        calNeedHunNumToBePuWithFeng(allCards[cardType.feng], 0,laizilist);
        var fengToPuNeedNum = needMinHunNum;
        var hasNum = 0;
        var isHu = false;
        var hunHuType=100;//混胡的类型定义
        var curHunNum = allCards[cardType.hun].length;
        var needHunNum = 0;
        //将在万中
        //如果需要的混小于等于当前的则计算将在将在万中需要的混的个数
        needHunNum = tongToPuNeedNum + tiaoToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum)
        {
            hasNum = curHunNum - needHunNum;
            isHu= isCanHunHu(hasNum,allCards[cardType.wan]);
            if (isHu)  return hunHuType;
        }
        //将在饼中
        needHunNum = wanToPuNeedNum + tiaoToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum)
        {
            hasNum = curHunNum - needHunNum;
            isHu= isCanHunHu(hasNum,allCards[cardType.tong]);
            if (isHu)  return hunHuType;
        }
        //将在条中
        needHunNum = wanToPuNeedNum + tongToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum)
        {
            hasNum = curHunNum - needHunNum;
            isHu= isCanHunHu(hasNum,allCards[cardType.tiao]);
            if (isHu)  return hunHuType;
        }
        //将在风中,支持
        needHunNum = wanToPuNeedNum + tongToPuNeedNum + tiaoToPuNeedNum;
        if (needHunNum <= curHunNum)
        {
            hasNum = curHunNum - needHunNum;
            isHu= isCanHunHuWithFeng(hasNum,allCards[cardType.feng],laizilist);
            cc.log("isHu = "+isHu);
            if (isHu)  return hunHuType;
        }
        return 0;
    }


    //将在其中 判断癞子个数算法
    function isCanHunHuWithFengNew(hunNum,m_HuPaiVec,laizilist){
        var huSize = m_HuPaiVec.length;
        if (huSize <= 0)
        {
            if(hunNum >= 2){
                return true;
            }else{
                return false;
            }
        }
        var firstPai = m_HuPaiVec[0];
        var huPaiCopy=[];
        for(var i=0;i<m_HuPaiVec.length;i++){
            huPaiCopy.push(m_HuPaiVec[i]);
        }
        for (var it=0; it < huPaiCopy.length; it++)
        {
            if (it == huPaiCopy.length - 1)
            {
                if (hunNum > 0)
                {
                    for(var id in laizilist){
                        var laizilistnew = {};
                        for(var z in laizilist){
                            laizilistnew[z] = laizilist[z];
                        }
                        if(laizilist[id]>0){
                            laizilistnew[id] = laizilist[id]-1;
                            hunNum = hunNum - 1;
                            var pairCard = huPaiCopy[it];
                            m_HuPaiVec.splice(it,1);
                            needMinHunNum = hunNum+2;
                            calNeedHunNumToBePuWithFengNew(m_HuPaiVec, 0,laizilistnew);
                            if (needMinHunNum <= hunNum)
                            {
                                return true;
                            }
                            hunNum = hunNum + 1;
                            m_HuPaiVec.splice(it,0,pairCard);
                        }
                    }

                }
            }
            else
            {
                if ((it + 2 == huPaiCopy.length) || (huPaiCopy[it]!= huPaiCopy[it + 2]))
                {
                    if (huPaiCopy[it] == huPaiCopy[it+1])
                    {
                        var pair1 = m_HuPaiVec[it];
                        var pair2 = m_HuPaiVec[it+1];
                        m_HuPaiVec.splice(it,1);
                        m_HuPaiVec.splice(it,1);

                        needMinHunNum = hunNum+1;
                        calNeedHunNumToBePuWithFengNew(m_HuPaiVec, 0,laizilist);
                        if (needMinHunNum <= hunNum)
                        {
                            return true;
                        }
                        m_HuPaiVec.splice(it,0,pair2);
                        m_HuPaiVec.splice(it,0,pair1);
                    }
                }
                if (hunNum>0 && (huPaiCopy[it] != huPaiCopy[it+1]))
                {

                    for(var id in laizilist){
                        var laizilistnew = {};
                        for(var z in laizilist){
                            laizilistnew[z] = laizilist[z];
                        }
                        if(laizilist[id]>0){
                            laizilistnew[id] = laizilist[id]-1;
                            hunNum = hunNum - 1;
                            var pair3 = m_HuPaiVec[it];
                            m_HuPaiVec.splice(it,1);
                            needMinHunNum = hunNum+2;
                            calNeedHunNumToBePuWithFengNew(m_HuPaiVec, 0,laizilist);
                            if (needMinHunNum <= hunNum)
                            {
                                return true;
                            }
                            hunNum = hunNum + 1;
                            m_HuPaiVec.splice(it,0,pair3);
                        }
                    }
                }
            }
        }
        return false;
    }

    function calNeedHunNumToBePuWithFengNew(typeVec, needNum, laizilist) {
        var p1, p2, p3;
        if (needMinHunNum == 0) return;
        if (needNum >= needMinHunNum)return;
        var vSize = typeVec.length;
        if (vSize == 0) {
            needMinHunNum = needNum > needMinHunNum ? needMinHunNum : needNum;
            return;
        }
        else if (vSize == 1) {
            needMinHunNum = (needNum + 2) > needMinHunNum ? needMinHunNum : (needNum + 2);
            return;
        }
        else if (vSize == 2) {
            p1 = typeVec[0];
            p2 = typeVec[1];
            p3 = laizilist[0];
            for(var i in laizilist){
                if(laizilist[i]>0){
                    p3 = i;
                    var tempSeg = [p1, p2, p3];
                    if (canMatchFeng(tempSeg) || p1 == p2) {
                        needMinHunNum = (needNum + 1) > needMinHunNum ? needMinHunNum : (needNum + 1);
                    }
                }
            }
            return;
        }

        //大于等于3张牌
        p1 = typeVec[0];
        p2 = typeVec[1];
        p3 = typeVec[2];
        var k2 = 1;
        var k3 = 2;
        //第一个自己一扑
        if (needNum + 2 < needMinHunNum) {
            typeVec.splice(0, 1);
            for(var i in laizilist){
                if(laizilist[i]>1){
                    var laizilistnew = {};
                    for(var z in laizilist){
                        laizilistnew[z] = laizilist[z];
                    }
                    laizilistnew[i] = laizilist[i]-2;
                    calNeedHunNumToBePuWithFengNew(typeVec, needNum + 2, laizilistnew);
                }
            }
            for(var i in laizilist){
                if(laizilist[i]>0){
                    var laizilistnew = {};
                    for(var z in laizilist){
                        laizilistnew[z] = laizilist[z];
                    }
                    laizilistnew[i] = laizilist[i]-1;
                    for(var j in laizilist){
                        if(laizilist[j]>1&&i!=j){
                            laizilistnew[j] = laizilist[j]-1;
                            calNeedHunNumToBePuWithFengNew(typeVec, needNum + 2, laizilistnew);
                        }
                    }
                }
            }
            typeVec.splice(0, 0, p1);
        }
        //第一个跟其它的一个一扑
        if (needNum + 1 < needMinHunNum) {
            for (var i = 1; i < typeVec.length; i++) {
                if (needNum + 1 >= needMinHunNum) break;
                p2 = typeVec[i];
                k2 = i;
                //455567这里可结合的可能为 45 46 否则是45 45 45 46
                //如果当前的value不等于下一个value则和下一个结合避免重复
                if (i + 1 != typeVec.length) {
                    p3 = typeVec[i + 1];
                    k3 = i + 1;
                    if (p3 == p2) continue;
                }
                //console.log("laizilist222 = ",laizilist);
                for(var id in laizilist){
                    if(laizilist[id]>0){
                        var p4 = id;
                        var tempSeg = [p1, p2, p4];
                        if (canMatchFeng(tempSeg) || p1 == p2) {
                            typeVec.splice(0, 1);
                            typeVec.splice(k2 - 1, 1);
                            var laizilistnew = {};
                            for(var z in laizilist){
                                laizilistnew[z] = laizilist[z];
                            }
                            laizilistnew[id] = laizilist[id]-1;
                            calNeedHunNumToBePuWithFengNew(typeVec, needNum + 1, laizilistnew);
                            typeVec.splice(k2 - 1, 0, p2);
                            typeVec.splice(0, 0, p1);
                        }
                    }
                }

            }
        }

        //第一个和其它两个一扑
        //后面间隔两张张不跟前面一张相同222234
        //可能性为222 234
        for (var ii = 1; ii < typeVec.length; ii++) {
            if (needNum >= needMinHunNum) break;
            p2 = typeVec[ii];
            k2 = ii;
            if (ii + 2 < typeVec.length) {
                if (typeVec[ii + 2] == p2) continue;
            }
            for (var j = ii + 1; j < typeVec.length; j++) {
                if (needNum >= needMinHunNum) break;
                p3 = typeVec[j];
                k3 = j;

                if (p1 == p3) {
                }
                if (j + 1 < typeVec.length) {
                    if (p3 == typeVec[j + 1]) continue;
                }

                var tempSeg = [p1, p2, p3];
                if (canMatchFeng(tempSeg)) {
                    typeVec.splice(0, 1);
                    typeVec.splice(k2 - 1, 1);
                    typeVec.splice(k3 - 2, 1);

                    calNeedHunNumToBePuWithFengNew(typeVec, needNum, laizilist);
                    typeVec.splice(k3 - 2, 0, p3);
                    typeVec.splice(k2 - 1, 0, p2);
                    typeVec.splice(0, 0, p1);
                }
                //4556
            }
        }
    }
    //癞子正常胡法
    function laizi_canhuwithfengYC (laizilist,cds,cd,ignoreLastLaizi) {
        //1.初始化
        var allCards=[];
        allCards[cardType.tiao]=[];
        allCards[cardType.tong]=[];
        allCards[cardType.wan]=[];
        allCards[cardType.feng]=[];//
        allCards[cardType.hun]=[];
        var tmp=[];
        for(var i=0;i<cds.length;i++){
            tmp.push(cds[i]);
        }
        if(cd){
            tmp.push(cd);
        }
        cds=tmp;
        //cds.sort(function(a,b){return a-b});

        for(i=0;i<cds.length;i++){
            if(isHun(cds[i],laizilist)&&!(ignoreLastLaizi&&i==cds.length-1)){
                allCards[cardType.hun].push(cds[i]);
            }else if(isTiao(cds[i])){
                allCards[cardType.tiao].push(cds[i]);
            }else if(isTong(cds[i])){
                allCards[cardType.tong].push(cds[i]);
            }else if(isWan(cds[i])){
                allCards[cardType.wan].push(cds[i]);
            }else if(isFeng(cds[i])){
                allCards[cardType.feng].push(cds[i]);
            }
        }

        allCards[cardType.tiao].sort(function(a,b){return a-b});
        allCards[cardType.tong].sort(function(a,b){return a-b});
        allCards[cardType.wan].sort(function(a,b){return a-b});
        allCards[cardType.feng].sort(function(a,b){return a-b});


        needMinHunNum =  allCards[cardType.hun].length+1;
        calNeedHunNumToBePu(allCards[cardType.wan], 0);
        var wanToPuNeedNum = needMinHunNum;

        needMinHunNum =  allCards[cardType.hun].length+1;
        calNeedHunNumToBePu(allCards[cardType.tong], 0);
        var tongToPuNeedNum = needMinHunNum;

        needMinHunNum =  allCards[cardType.hun].length+1;
        calNeedHunNumToBePu(allCards[cardType.tiao], 0);
        var tiaoToPuNeedNum = needMinHunNum;

        var laizi = {};
        for(i=0;i<cds.length;i++){
            if(isHun(cds[i],laizilist)&&!(ignoreLastLaizi&&i==cds.length-1)){
                if(laizi[cds[i]]){
                    laizi[cds[i]]++;
                }else{
                    laizi[cds[i]] = 1;
                }
            }
        }
        needMinHunNum =  allCards[cardType.hun].length+1;
        //console.log("laizi = ",laizi)
        calNeedHunNumToBePuWithFengNew(allCards[cardType.feng],0, laizi);
        var fengToPuNeedNum = needMinHunNum;
        //console.log("zwz_fengnewneed = "+fengToPuNeedNum)
        var hasNum = 0;
        var isHu = false;
        var hunHuType=100;//混胡的类型定义
        var curHunNum = allCards[cardType.hun].length;
        var needHunNum = 0;
        //将在万中
        //如果需要的混小于等于当前的则计算将在将在万中需要的混的个数
        needHunNum = tongToPuNeedNum + tiaoToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum)
        {
            hasNum = curHunNum - needHunNum;
            isHu= isCanHunHu(hasNum,allCards[cardType.wan]);
            if (isHu)  return hunHuType;
        }
        //将在饼中
        needHunNum = wanToPuNeedNum + tiaoToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum)
        {
            hasNum = curHunNum - needHunNum;
            isHu= isCanHunHu(hasNum,allCards[cardType.tong]);
            if (isHu)  return hunHuType;
        }
        //将在条中
        needHunNum = wanToPuNeedNum + tongToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum)
        {
            hasNum = curHunNum - needHunNum;
            isHu= isCanHunHu(hasNum,allCards[cardType.tiao]);
            if (isHu)  return hunHuType;
        }

        //将在风中,支持
        needHunNum = wanToPuNeedNum + tongToPuNeedNum + tiaoToPuNeedNum;
        if (needHunNum <= curHunNum)
        {
            hasNum = curHunNum - needHunNum;
            isHu= isCanHunHuWithFengNew(hasNum,allCards[cardType.feng],laizi);
            if (isHu)  return hunHuType;
        }
        return 0;
    }

    majiang_yc.canhunhuwithfeng_yuncheng = function(pl,laizilist,cds,cd, can7, can13) {
        if(cd == 0) {
            return 0;
        }

        huType = laizi_canhuwithfengYC(laizilist,cds,cd);
        if (can7) {
            var huType7 = laizi_can7hu(laizilist, cds, cd);
            if (huType7 > 0) {
                huType = huType7;
            }
        }
        if (can13) {
            var huType13 = laizi_can13hu(laizilist,cds, cd);
            if (huType13 > 0) {
                huType = huType13;
            }
        }
        return huType;
    }

    majiang_yc.canhunhuwithfeng = function(pl,laizilist,cds,cd, can7, can13) {
        if(cd == 0)
        {
            return 0;
        }
        if(pl.kouArr&&pl.kouArr.length>0){
            cc.log("pl.kouArr = "+pl.kouArr);
            var car = pl.mjhand[pl.mjhand.length-1];
            if(pl.kouArr.indexOf(car)<0){
                return 0;
            }
        }
        var tData = cc.jsInstance.data.sData.tData;

        var quemen  = this.quemen(pl,laizilist);
        var menshu = tData.king_quemen?1:2;
        var huType = 0;
        if(quemen<=menshu){
            huType = laizi_canhuwithfeng(laizilist,cds,cd);
        }

        if (can7) {
            if(this.quemen(pl)<=menshu){
                var huType7 = laizi_can7hu(null,cds, cd);
                if (huType7 > 0) {
                    huType = huType7;
                }
            }
        }
        // console.log("zwz_7hutype = "+huType);
        if (can13) {
            var huType13 = laizi_can13hu(laizilist,cds, cd);
            //console.log("zwz_13hutype = "+huType13);
            if (huType13 > 0) {
                huType = huType13;
            }
        }
        // console.log("zwz_13hutype = "+huType);
        return huType;
    }
//------------------癞子相关结束----------------------//
    majiang_yc.SameCardCount = function(cards,cd)
    {
        var count = 0;
        for(var i=0;i<cards.length;i++){
            if(cards[i]==cd){
                count++;
            }
        }
        return count;
    }


    //胡牌听牌检测
    majiang_yc.checkfengTing  = function (pl) {
        var mjhand=pl.mjhand;
        var tryCard=[];
        var laizi = [];
        //听牌检测数组  是手牌数组中相连或相同的牌型
        for(var i=0;i<mjhand.length;i++)
        {
            var cd=mjhand[i];

            for (var j = -1; j <= 1; j++) {
                var cj = cd + j;
                if (cj >= 1 && cj <= 9 || cj >= 11 && cj <= 19 || cj >= 21 && cj <= 29) {
                    tryCard.push(cj);
                }
            }
            if (cd == 31 || cd == 41 || cd == 51 || cd == 61) {
                tryCard.push(31);
                tryCard.push(41);
                tryCard.push(51);
                tryCard.push(61);
            } else if (cd == 71 || cd == 81 || cd == 91) {
                tryCard.push(71);
                tryCard.push(81);
                tryCard.push(91);
            }

        }
        tryCard.sort(function(a,b){return a-b});


        //去掉数组中相同的元素 减少循环次数
        for (var i = 0; i < tryCard.length ; i++) {
            if (i!=tryCard.length-1&&tryCard[i] == tryCard[i + 1]) {
                tryCard.splice(i, 1);
                i--;
            }else if (this.SameCardCount(mjhand, tryCard[i]) == 4) {
                tryCard.splice(i, 1);
                i--;
            }
        }
        //cc.log("tryCard = "+tryCard);
        var maxWin=0;
        var tingKouArray = [];
        for(var cd3=0;cd3<tryCard.length;cd3++)
        {
            var cdi=tryCard[cd3];
            var huType = this.canHulinfen(mjhand,cdi, true, false);
            if(huType>0)
            {
                var fanshu = this.getMaxfan(pl,cdi);
                //cc.log("fanshu=" + fanshu);
                if(fanshu>=3) {
                    var winNum = tryCard[cd3];
                    if (winNum > maxWin) {
                        maxWin = winNum;
                    }
                    //cc.log("cdi" + cdi);
                    //cc.log("cd3" + cd3);
                    tingKouArray.push(cdi);
                }
            }
        }
        //cc.log("tingKouArray = "+tingKouArray);
        return [maxWin, tingKouArray];
    };
    //胡牌听牌检测
    majiang_yc.checkfengTingWithlaizi  = function (pl,isyuncheng) {
        var mjhand=pl.mjhand;
        var tryCard = [1, 2, 3, 4, 5, 6, 7, 8, 9,
            11, 12, 13, 14, 15, 16, 17, 18, 19,
            21, 22, 23, 24, 25, 26, 27, 28, 29,
            31, 41, 51, 61, 71, 81, 91
        ];
        var tData = cc.jsInstance.data.sData.tData;
        var maxWin=0;
        var tingKouArray = [];
        for(var cd3=0;cd3<tryCard.length;cd3++)
        {
            var cdi=tryCard[cd3];

            var huType0;
            if(isyuncheng){
                huType = this.canhunhuwithfeng_yuncheng(pl,tData.laizi,mjhand,cdi, true, true);
            }else{
                huType = this.canhunhuwithfeng(pl,tData.laizi,mjhand,cdi, true, true);
            }
            if(huType>0)
            {
                var winNum = tryCard[cd3];
                if (winNum > maxWin) {
                    maxWin = winNum;
                }
                //cc.log("cdi" + cdi);
                //cc.log("cd3" + cd3);
                tingKouArray.push(cdi);
            }
        }
        //cc.log("tingKouArray = "+tingKouArray);
        return [maxWin, tingKouArray];
    };
    //---------正常胡牌----------------//
    //正常胡
    majiang_yc.canhuNormal = function(cds, cd) {
        var tmp = [];
        for (var i = 0; i < cds.length; i++) tmp.push(cds[i]);
        if (cd) tmp.push(cd);

        //排序
        tmp.sort(function (a, b) {
            return a - b
        });
        //将牌数组
        var pair = {};
        for (var i = 0; i < tmp.length; i++) {
            if (i < tmp.length - 1 && tmp[i] == tmp[i + 1]){
                pair[tmp[i]] = tmp[i];
            }
        }
        if (Object.keys(pair).length == 0) return -1;
        for (var pairKey in pair) {
            var pcd = pair[pairKey];
            var left = [];
            var pnum = 0;
            //干掉将牌后匹配
            for (var i = 0; i < tmp.length; i++) {
                if (tmp[i] == pcd && pnum < 2)
                    pnum++;
                else   left.push(tmp[i]);
            }
            if (left.length == 0) return 1;
            //排序
            left.sort(function (a, b) {
                return a - b
            });
            //干掉将牌后匹配是否成功
            if (canMatchSeq(left)){
                return 1;
            }
        }
        return 0;
    };
    //七小对胡
    function canhu7dui(cds, cd) {
        var handcards = [];
        for (var i = 0; i < cds.length; i++) handcards.push(cds[i]);
        if (cd) handcards.push(cd);

        //排序
        handcards.sort(function (a, b) {
            return a - b
        });
        if (handcards.length != 14) {
            return 0;
        }
        //判断是否是7个将
        for (var i = 0; i < handcards.length; i += 2) {
            if (handcards[i] != handcards[i + 1]) {
                return 0
            }
        }
        return 7;
    }
    //十三幺胡
    function canhu13(cds, cd) {
        var tmp = [];
        for (var i = 0; i < cds.length; i++) tmp.push(cds[i]);
        if (cd) tmp.push(cd);
        //排序
        tmp.sort(function (a, b) {
            return a - b
        });
        //删除将牌中的一个 剩13张
        for (var i = 0; i < tmp.length - 1; i++) {
            if (tmp[i] == tmp[i + 1]) {
                tmp.splice(i, 1);
                break;
            }
        }
        //剩余牌不是十三张 就返回
        if(tmp.length!=13){
            return 0;
        }
        for (var id  = 0;id< tmp.length;id++) {
            if (s13[id] != tmp[id]) {
                return 0;
            }
        }
        return 13;
    }


    //风顺的胡牌算法
    var leftcard = 14;
    function fengshun(hasjiang,cds,cd){
        var mjhand =cds.slice(0);
        if(cd)mjhand.push(cd);
        mjhand.sort(function(a,b){return a-b});
        if(!hasjiang){
            //将牌数组
            var pair = {};
            for (var i = 0; i < mjhand.length; i++) {
                if (i < mjhand.length - 1 && mjhand[i] == mjhand[i + 1]){
                    pair[mjhand[i]] = mjhand[i];
                }
            }
            if (Object.keys(pair).length == 0) return -1;
            for (var pairKey in pair) {
                var pcd = pair[pairKey];
                var left = [];
                var pnum = 0;
                //干掉将牌后匹配
                for (var i = 0; i < mjhand.length; i++) {
                    if (mjhand[i] == pcd && pnum < 2)
                        pnum++;
                    else   left.push(mjhand[i]);
                }
                if (left.length == 0) return 1;
                //排序
                left.sort(function (a, b) {
                    return a - b
                });
                //干掉将牌后匹配是否成功
                leftcard = left.length;
                canhuwithfeng(left);
                var hand =leftcard;
                if (hand == 0){
                    return 1;
                }
            }
            return 0;
        }
        else{
            var mj = mjhand.slice(0);
            leftcard = mj.length;
            canhuwithfeng(mj);
            var hand = leftcard;
            if (hand == 0){
                return 1;
            }
            return 0;
        }
    }

    function canhuwithfeng(mjhand){
        if(mjhand.length<3&&mjhand>0){
            return leftcard;
        }
        var cards = [
            [31, 31, 31], [41, 41, 41], [51, 51, 51], [61, 61, 61], //东西南北刻子
            [71, 71, 71], [81, 81, 81], [91, 91, 91], //中发白刻子
            [31, 41, 51], [31, 51, 61], [31, 41, 61], [41, 51, 61],//东西南北顺子
            [71, 81, 91]//中发白顺子
        ]
        for(var cd = 0;cd<cards.length;cd++){
            var cardfeng = cards[cd];
            var mjhandnew = mjhand.slice(0);
            if(mjhandnew.length>=3){
                var delNum = 0;
                for(var id =0;id<cardfeng.length;id++){
                    var card = cardfeng[id];
                    var index = mjhandnew.indexOf(card);
                    if(index>=0){
                        delNum++;
                        mjhandnew.splice(index,1);
                    }
                    if(delNum == 3){
                        leftcard = leftcard>mjhandnew.length?mjhandnew.length:leftcard;
                        if(leftcard>=3){
                            canhuwithfeng(mjhandnew);
                        }else{
                            return leftcard;
                        }
                    }
                }
            }
        }
    }
    //带风顺 的正常胡牌算法
    majiang_yc.canhuWithFengShun = function(cds, cd){
        var hand = cds.slice(0);
        if(cd){hand.push(cd)}
        //排序
        hand.sort(function (a, b) {
            return a - b
        });
        var handNormal = [];
        var handFeng = [];
        for(var id = 0;id<hand.length;id++){
            if(hand[id]<30){
                handNormal.push(hand[id])
            }else{
                handFeng.push(hand[id])
            }
        }
        var hutype = this.canhuNormal(handNormal,null);

        if(hutype>0){
            if(handFeng.length == 0||fengshun(true,handFeng) == 1){
                return true;
            }
            return false;
        }else if(canMatchSeq(handNormal)){

            if(fengshun(false,handFeng) == 1){
                return true;
            }
            return false;
        }else{
            return false;
        }
    };

    majiang_yc.canHulinfen = function(cds, cd, can7, can13) {
        var huType = this.canhuWithFengShun(cds, cd);

        if (can7) {
            var huType7 = canhu7dui(cds, cd);
            if (huType7 > 0) {
                huType = huType7;
            }
        }
        if (can13) {
            var huType13 = canhu13(cds, cd);
            if (huType13 > 0) {
                huType = huType13;
            }
        }
        return huType;
    };
//缺门
    majiang_yc.quemen = function(pl,laizi){
        var mjhand = pl.mjhand;
        var temp = [];
        for (var i = 0; i < mjhand.length; i++){
            if(isHun(mjhand[i],laizi)){

            }else{
                temp.push(mjhand[i]);
            }

        }
        //明杠的牌放进去
        for (var i=0; i<pl.mjgang0.length; i++) {
            temp.push(pl.mjgang0[i]);
        }
        //暗杠的牌放进去
        for (var i=0; i<pl.mjgang1.length; i++) {
            temp.push(pl.mjgang1[i]);
        }
        //碰的牌放进去
        for (var i=0; i<pl.mjpeng.length; i++) {
            temp.push(pl.mjpeng[i]);
        }
        var tiao = 0;
        var tong = 0;
        var wan = 0;
        for(var id  = 0;id<temp.length;id++){
            if (temp[id] >= 1 && temp[id] < 10)
                tiao++;
            else if (temp[id] >= 11 && temp[id] < 20)
                wan++;
            else if(temp[id] >= 21 && temp[id] < 30)
                tong++;
        }
        var num = 0;
        if(tiao>0){
            num++
        }
        if(tong>0){
            num++
        }
        if(wan>0){
            num++
        }
        return num;//3 就有3门
    };
    //孤将
    majiang_yc.isGujiang = function(pl){
        var mjhand = [].concat(pl.mjhand,
            pl.mjpeng, pl.mjpeng, pl.mjpeng,
            pl.mjgang0, pl.mjgang0, pl.mjgang0,
            pl.mjgang1, pl.mjgang1, pl.mjgang1,
            pl.mjchi);
        var wan = 0;
        var tong = 0;
        var tiao = 0;
        for(var i = 0;i<mjhand.length;i++){
            if(mjhand[i]>0&&mjhand[i]<10){
                tiao++;
            }
            if(mjhand[i]>10&&mjhand[i]<20){
                wan++;
            }
            if(mjhand[i]>20&&mjhand[i]<30){
                tong++;
            }
        }
        if(tiao == 2||wan == 2||tong == 2){
            return true;
        }
        return false;
    };
    var sanfyNum = 0;
    //三风 kind = 1  三元 kind =2
    majiang_yc.has3fengNum = function(pl,kind){
        var mjhand = pl.mjhand.slice(0);
        var fengArr = [];
        for(var i = 0;i<mjhand.length;i++){
            if(kind == 1){
                if(mjhand[i] == 31||mjhand[i] == 41||mjhand[i] == 51||mjhand[i] == 61){
                    fengArr.push(mjhand[i]);
                }
            }else if(kind == 2){
                if(mjhand[i] == 71||mjhand[i] == 81||mjhand[i] == 91){
                    fengArr.push(mjhand[i]);
                }
            }

        }
        fengArr.sort(function (a, b) {
            return a - b
        });
        var hasjiang = (fengArr.length%3 == 2)?true:false;
        if(hasjiang){
            //将牌数组
            var pair = {};
            for (var i = 0; i < fengArr.length; i++) {
                if (i < fengArr.length - 1 && fengArr[i] == fengArr[i + 1]){
                    pair[fengArr[i]] = fengArr[i];
                }
            }
            if (Object.keys(pair).length == 0) return 0;
            var maxNum = 0;
            for (var pairKey in pair) {
                var pcd = pair[pairKey];
                var left = [];
                var pnum = 0;
                //干掉将牌后匹配
                for (var i = 0; i < fengArr.length; i++) {
                    if (fengArr[i] == pcd && pnum < 2)
                        pnum++;
                    else   left.push(fengArr[i]);
                }
                if (left.length == 0) return 0;
                //排序
                left.sort(function (a, b) {
                    return a - b
                });
                //干掉将牌后匹配是否成功
                leftcard = left.length;
                sanfyNum = 0;
                getfengshunNum(kind,left,0);
                sanfyNum = leftcard == 0?sanfyNum:0;
                maxNum = sanfyNum>maxNum?sanfyNum:maxNum;

            }
            return maxNum;

        }else {
            var mj = fengArr.slice(0);
            leftcard = mj.length;
            sanfyNum = 0;
            getfengshunNum(kind,mj,0);
            sanfyNum = leftcard == 0?sanfyNum:0;
            return sanfyNum;

        }

    };
    function getfengshunNum(kind,mjhand,num){
        if(mjhand.length<3&&mjhand>0){
            return leftcard;
        }
        if(kind == 1){
            var cards = [
                [31, 41, 51], [31, 51, 61], [31, 41, 61], [41, 51, 61],//东西南北顺子
                [31, 31, 31], [41, 41, 41], [51, 51, 51], [61, 61, 61] //东西南北刻子
            ]
        }else if(kind == 2){
            var cards = [
                [71, 81, 91],//中发白顺子
                [71, 71, 71], [81, 81, 81], [91, 91, 91] //中发白刻子
            ]

        }
        for(var cd = 0;cd<cards.length;cd++){
            var cardfeng = cards[cd];
            var mjhandnew = mjhand.slice(0);
            if(mjhandnew.length>=3){
                var delNum = 0;
                for(var id =0;id<cardfeng.length;id++){
                    var card = cardfeng[id];
                    var index = mjhandnew.indexOf(card);
                    if(index>=0){
                        delNum++;
                        mjhandnew.splice(index,1);
                    }

                    if(delNum == 3){
                        var haveOne = false;
                        if(kind == 1&&(cd == 0||cd == 1||cd == 2||cd == 3)){
                            haveOne = true;
                        }else if(kind == 2&&cd == 0){
                            haveOne = true;
                        }
                        if(haveOne){
                            sanfyNum = num+1>sanfyNum?num+1:sanfyNum;
                        }
                        leftcard = leftcard>mjhandnew.length?mjhandnew.length:leftcard;
                        if(leftcard>=3){
                            if(haveOne){
                                getfengshunNum(kind,mjhandnew,num+1);
                            }else{
                                getfengshunNum(kind,mjhandnew,num);
                            }
                        }else{
                            num = 0;
                            return leftcard;
                        }
                    }
                }
            }
        }
    }
    //胡单张
    majiang_yc.OnleOne = function(pl,GLog){
        var mjhand = pl.mjhand.slice(0);

        mjhand.splice(mjhand.length-1,1);
        var tryCard = [];
        //听牌检测数组  是手牌数组中相连或相同的牌型
        for(var i=0;i<mjhand.length;i++)
        {
            var cd=mjhand[i];
            for (var j = -1; j <= 1; j++) {
                var cj = cd + j;
                if (cj >= 1 && cj <= 9 || cj >= 11 && cj <= 19 || cj >= 21 && cj <= 29) {
                    tryCard.push(cj);
                }
            }
            if (cd == 31 || cd == 41 || cd == 51 || cd == 61) {
                tryCard.push(31);
                tryCard.push(41);
                tryCard.push(51);
                tryCard.push(61);
            } else if (cd == 71 || cd == 81 || cd == 91) {
                tryCard.push(71);
                tryCard.push(81);
                tryCard.push(91);
            }
        }
        tryCard.sort(function(a,b){return a-b});


        //去掉数组中相同的元素 减少循环次数
        for (var i = 0; i < tryCard.length ; i++) {
            if (i!=tryCard.length-1&&tryCard[i] == tryCard[i + 1]) {
                tryCard.splice(i, 1);
                i--;
            }else if (this.SameCardCount(mjhand, tryCard[i]) == 4) {
                tryCard.splice(i, 1);
                i--;
            }
        }
        // GLog("tryCard = "+tryCard);
        var huNum = 0;
        for(var cd3=0;cd3<tryCard.length;cd3++)
        {
            var cdi=tryCard[cd3];
            var huType =this.canHulinfen(mjhand,cdi, true, false);
            if(huType>0)
            {
                huNum++;
                if(huNum>=2){
                    return false;
                }
            }
        }
        if(huNum == 1){
            return true;
        }else{
            return false;
        }
    };
    //门清
    majiang_yc.OnlyHand=function(pl) {
        return   (pl.mjpeng.length==0 && pl.mjgang0.length==0&&pl.mjchi.length==0);
    };
    //一条龙
    majiang_yc.yitiaolong = function(pl){
        var mjhand = pl.mjhand;
        var haveCount =0;
        for (var i = 0; i <3 ; i++) {
            for (var j = 1+i*10; j <10+i*10; j++) {
                if (mjhand.indexOf(j)>=0)
                {
                    haveCount++;
                }
                if (haveCount==9&&j==9+i*10)
                {
                    var plcanhu = pl.mjhand.slice(0);
                    for (var z = 1+i*10; z < 10+i*10; z++) {
                        plcanhu.splice(plcanhu.indexOf(z),1);
                    }
                    if (this.canHulinfen(plcanhu, null, false, false)>0)
                    {
                        return true;
                    }
                }
            }
            haveCount =0;
        }
        return false;
    };
    //豪七  0 不是  1 豪7  2 嚎嚎七
    majiang_yc.Hao7 = function(mj){
        //if(pl.huType == 7||pl.huType == 107){
        //
        //}else{
        //    return false;
        //}

        var mjhand = mj.slice(0);
        //GLog("hao7_mjhand = "+mjhand);
        var card = mjhand[mjhand.length-1];
        var haocard = [];
        mjhand.sort(function(a,b){return a-b});
        //GLog("hao7_mjhand = "+mjhand);
        //cc.log("mjhand = "+mjhand);
        var num = 1;
        for(var id = 0;id<mjhand.length-1;id++){
            if(mjhand[id] == mjhand[id+1]){
                num++;
                //GLog("num = "+num);
                if(num == 4){
                    haocard.push(mjhand[id]);
                }
            }else{
                num = 1;
            }
        }
        //cc.log("mjhand = "+mjhand);
        //cc.log("haocard.length"+haocard)
        if(haocard.length>0){

            //cc.log("card"+card);
            if(haocard.indexOf(card)>=0){
                return haocard.length>2?2:haocard.length;
            }else{
                return 0;
            }
        }else{
            return 0;
        }
    };
    //清一色
    majiang_yc.SameColor = function(pl){
        var mjhand = pl.mjhand.slice(0);

        var test=[  mjhand,  pl.mjpeng,  pl.mjgang0,  pl.mjgang1,  pl.mjchi	];
        var color=-1;
        for(var id=0;id<test.length;id++)
        {
            var cds=test[id];
            for(var j=0;j<cds.length;j++)
            {
                var cd=cds[j];
                if(color==-1) color=Math.floor(cd/10);
                else if(color!=Math.floor(cd/10)) return false;
            }
        }
        return true;
    };
    majiang_yc.getMaxfan = function(pl,cd){
        var tData = cc.jsInstance.data.sData.tData;
        var mjhand = pl.mjhand;
        if(cd)mjhand.push(cd);

        var fanshu = 0;

        ////明杠
        //fanshu+=pl.mjgang0.length;
        //// 暗杠
        //fanshu+=pl.mjgang1.length*2;

        //缺门
        var quemen = this.quemen(pl);
        if(quemen == 2){
            fanshu+=1;
        }else if(quemen <= 1){
            fanshu+=3;
        }
        //cc.log("quemen = "+fanshu);
        if(fanshu>=3){
            pl.mjhand.splice(pl.mjhand.length-1,1);
            return fanshu;
        }
        ////庄
        //var zhuang = true;
        //if(tData){
        //    zhuang = tData.uids[tData.zhuang] == pl.info.uid;
        //}
        //if(zhuang){
        //    fanshu+=1;
        //}
        //////cc.log("zhuang = "+fanshu);
        //if(fanshu>=3){
        //    pl.mjhand.splice(pl.mjhand.length-1,1);
        //    return fanshu;
        //}
        //孤将
        var gujiang = this.isGujiang(pl);
        if(gujiang){
            fanshu+=1;
        }
        //cc.log("gujiang = "+fanshu);
        if(fanshu>=3){
            pl.mjhand.splice(pl.mjhand.length-1,1);
            return fanshu;
        }
        ////门清
        //var menqing = this.OnlyHand(pl);
        //if(menqing){
        //    fanshu+=1;
        //}
        ////cc.log("menqing = "+fanshu);
        //if(fanshu>=3){
        //    pl.mjhand.splice(pl.mjhand.length-1,1);
        //    return fanshu;
        //}
        //三风
        //GLog("  pl.mjhand[pl.mjhand.length-1]; = "+  pl.mjhand);
        var sanfeng = this.has3fengNum(pl,1);
        if(sanfeng>0){
            if(sanfeng == 1){
                fanshu+=1;
            }else if(sanfeng == 2){
                fanshu+=3;
            }else if(sanfeng == 3){
                fanshu+=7;
            }
        }
        //cc.log("sanfeng = "+fanshu);
        if(fanshu>=3){
            pl.mjhand.splice(pl.mjhand.length-1,1);
            return fanshu;
        }
        //三元
        var sanyuan = this.has3fengNum(pl,2);
        if(sanyuan>0){
            var card = pl.mjhand[pl.mjhand.length-1];
            if(sanyuan == 1){
                if(card==71||card == 81||card == 91){
                    fanshu+=1;
                }else{
                    fanshu+=1;
                }
            }else if(sanyuan == 2){
                if(card==71||card == 81||card == 91){
                    fanshu+=10;
                }else{
                    fanshu+=7;
                }
            }else if(sanyuan == 3){
                if(card==71||card == 81||card == 91){
                    fanshu+=50;
                }else{
                    fanshu+=25;
                }
            }
        }
        //cc.log("sanyuan = "+fanshu);
        if(fanshu>=3){
            pl.mjhand.splice(pl.mjhand.length-1,1);
            return fanshu;
        }
        ////七小对
        //var hutype = this.canHulinfen(pl.mjhand,null, true, false,null,null);
        //var qixiaodui = (hutype == 7||hutype == 107);
        //if(qixiaodui){
        //    fanshu+=10;
        //}
        ////cc.log("qixiaodui = "+fanshu);
        //if(fanshu>=3){
        //    pl.mjhand.splice(pl.mjhand.length-1,1);
        //    return fanshu;
        //}
        ////清一色
        //var qingyise = this.SameColor(pl);
        //if(qingyise){
        //    fanshu+=10;
        //}
        ////cc.log("qingyise = "+fanshu);
        //if(fanshu>=3){
        //    pl.mjhand.splice(pl.mjhand.length-1,1);
        //    return fanshu;
        //}
        //边砍吊单张
        //GLog("  pl.mjhand[pl.mjhand.length-1]; = "+  pl.mjhand);

        var canhuonlyOne = this.OnleOne(pl);
        if(canhuonlyOne){
            fanshu+=1;
        }
        //cc.log("canhuonlyOne = "+fanshu);
        if(fanshu>=3){
            pl.mjhand.splice(pl.mjhand.length-1,1);
            return fanshu;
        }
        ////一条龙
        //var yitiaolong = this.yitiaolong(pl);
        //if(yitiaolong){
        //    fanshu+=10;
        //}
        ////cc.log("yitiaolong = "+fanshu);
        //if(fanshu>=3){
        //    pl.mjhand.splice(pl.mjhand.length-1,1);
        //    return fanshu;
        //}


        pl.mjhand.splice(pl.mjhand.length-1,1);
        return fanshu;
    };


    //majiang_yc.gethucard  = function (pl,laizilist, can7, can13,GLog,with258) {
    //
    //    var mjhand=pl.mjhand.slice(0);
    //    var tryCard=[];
    //    if(laizilist){
    //        tryCard=[31,41,51,61,71,81,91];
    //    }
    //    var laizi = [];
    //    //听牌检测数组  是手牌数组中相连或相同的牌型  扣点  6点以下都不要
    //    for(var i=0;i<mjhand.length;i++) {
    //        var cd=mjhand[i];
    //        if(isHun(cd,laizilist)){
    //            laizi.push(cd);
    //        }else{
    //            for(var j=-1;j<=1;j++) {
    //                var cj=cd+j;
    //                if(cj>=6&&cj<=9||cj>=16&&cj<=19||cj>=26&&cj<=29) {
    //                    tryCard.push(cj);
    //                }
    //            }
    //            if (cd==31||cd==41||cd==51||cd==61||cd==71||cd==81||cd==91) {
    //                tryCard.push(cd);
    //            }
    //        }
    //    }
    //    //两个癞子连牌  算最大值用
    //    if (laizi.length > 0) {
    //        for (var ic = 0; ic < mjhand.length; ic++) {
    //            var cd2 = mjhand[ic];
    //            var cj2 = cd2 + 2;
    //            if ((cj2 >= 6 && cj2 <= 9) || (cj2 >= 16 && cj2 <= 19 ) || ( cj2 >= 26 && cj2 <= 29)) {
    //                tryCard.push(cj2);
    //            }
    //        }
    //    }
    //    tryCard.sort(function(a,b){return a-b});
    //
    //    //去掉数组中相同的元素 减少循环次数
    //    for (var i = 0; i < tryCard.length ; i++) {
    //        if (i!=tryCard.length-1&&tryCard[i] == tryCard[i + 1]) {
    //            tryCard.splice(i, 1);
    //            i--;
    //        }
    //    }
    //    var hucards = [];
    //    for(var cd3=0;cd3<tryCard.length;cd3++)
    //    {
    //        var cdi=tryCard[cd3];
    //        var huType = 0;
    //        if(isHun(cdi,laizilist)){
    //            huType = 0;
    //        }else{
    //
    //            huType = this.canhunhu(laizilist,mjhand,cdi, can7, can13);
    //        }
    //        if(huType>0) {
    //            hucards.push(cdi)
    //        }
    //    }
    //    hucards.sort(function(a,b){return a-b});
    //    return hucards;
    //};
    
    
    if (typeof(cc.jsInstance) != "undefined")
    {
        cc.jsInstance.majiang_yc=majiang_yc;
    }