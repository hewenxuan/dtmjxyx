

	var mjcards=[
1,2,3,4,5,6,7,8,9,
1,2,3,4,5,6,7,8,9,
1,2,3,4,5,6,7,8,9,
1,2,3,4,5,6,7,8,9,

11,12,13,14,15,16,17,18,19,
11,12,13,14,15,16,17,18,19,
11,12,13,14,15,16,17,18,19,
11,12,13,14,15,16,17,18,19,

21,22,23,24,25,26,27,28,29,
21,22,23,24,25,26,27,28,29,
21,22,23,24,25,26,27,28,29,
21,22,23,24,25,26,27,28,29,


31,41,51,61,71,81,91,
31,41,51,61,71,81,91,
31,41,51,61,71,81,91,
31,41,51,61,71,81,91

]
var s13=[1,9,11,19,21,29,31,41,51,61,71,81,91];

function canLink(a,b)
{
  return (a+1==b||a==b);
}

var majiang={};
majiang.randomCards=function()
{
	var rtn=[]; rtn.length=mjcards.length;
	for(var i=0;i<rtn.length;i++) rtn[i]=mjcards[i];
	for(var i=0;i<rtn.length;i++)
	{
		var ci=rtn[i];
		var j=Math.floor( Math.random() *  rtn.length );
		rtn[i]=rtn[j];
		rtn[j]=ci;
	}
	return rtn;
}

    //过滤数组
    majiang.filterArr=function(srcArr,desArr){
        var arr=srcArr.slice(0);
        for(var i=0;i<desArr.length;i++){
            var index = arr.indexOf(desArr[i]);
            if(index>=0){
                arr.splice(index,1);
            }
        }
        return arr;
    }

    //听立牌
    majiang.canTingLi = function(mjhand,mjli){
        var sData = jsInstance.data.sData;
        var tData = sData.tData;
        var cards=[];
        var hands = mjhand.slice(0);
        for(var i=0;i<mjli.length;i++){
            var index = hands.indexOf(mjli[i]);
            var cd = mjli[i];
            hands.splice(index,1);
            if(majiang.canTing_13_card(tData.canHu7,hands,tData.canHuWith258)){
                cards.push(cd);
            }
            hands.splice(index,0,cd);
        }
        return cards.length>0;
    }
    //判断13张牌能否，听牌
    majiang.canTing_13_card = function (no7, cds, with258) {
        return canHunHu(no7, cds, cardHun, with258, true);
    }
    //听牌函数
    majiang.canTing = function(no7,cds,cd,with258){
        var tempcards = cloneCds(cds);
        if(cd){
            tempcards.push(cd);
        }
        var isTing = false;
        var willPutCard;
        for(var i=0;i<tempcards.length;i++){
            willPutCard = tempcards[i];
            tempcards.splice(i,1);
            isTing = canHunHu(no7,tempcards,cardHun,with258,true);
            tempcards.splice(i,0,willPutCard);
            if(isTing){
                return true;
            }
        }
        return false;
    }
    //青龙牌形
    majiang.canQingLong = function(cds,cd) {
        var tmp = [];
        for (var i = 0; i < cds.length; i++) tmp.push(cds[i]);
        if (cd) tmp.push(cd);

        tmp.sort(function (a, b) {
            return a - b
        });
        if (tmp.length < 9) {
            //手牌小于9张
            return -1;
        }
        return  IsQingLong(tmp);
    }

	//癞子相关
	var cardType={//分牌类型
		tiao:0,
		tong:1,
		wan:2,
		feng:3,
		hun:4
	};

	var MJPAI_HUNMAX=4;
	var needMinHunNum=MJPAI_HUNMAX;
	var finalNeedHunNum = 0;
	var finalJiangNeedHunNum = 0;
	majiang.laizi = -1;
	majiang.setlaisi = function(card){
		majiang.laizi = card;
	}
	//癞子 判断最少癞子算法
	function calNeedHunNumToBePu(typeVec,needNum){
		var p1,p2,p3;
		if (needMinHunNum == 0) return;
		if (needNum >= needMinHunNum)return;

		var vSize = typeVec.length;
		if (vSize == 0)
		{
			needMinHunNum = needNum>needMinHunNum ? needMinHunNum:needNum;
			//console.log("zwz_laizisuanfa_find_laizi_Num = "+needMinHunNum);
			return;
		}
		else if (vSize == 1)
		{
			needMinHunNum = (needNum+2)>needMinHunNum ? needMinHunNum:(needNum+2);
			//console.log("zwz_laizisuanfa_find_laizi_Num = "+needMinHunNum);
			return;
		}
		else if (vSize == 2)
		{
			p1 = typeVec[0];
			p2 = typeVec[1];

			if (p2 - p1 < 3)
			{
				needMinHunNum = (needNum+1)>needMinHunNum ? needMinHunNum:(needNum+1);
				//console.log("zwz_laizisuanfa_find_laizi_Num = "+needMinHunNum);
			}
			return;
		}



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
	function canMatchSeq(seg) {
		var matchOK = true;
		for (var m = 0; m < seg.length;) {
			if (canMath12(seg, m))      m += 12;
			else if (canMath9(seg, m))  m += 9;
			else if (canMath6(seg, m))  m += 6;
			else if (canMath3(seg, m))  m += 3;
			else {
				matchOK = false;
				break;
			}
		}
		return matchOK;
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
					needMinHunNum = MJPAI_HUNMAX;
					calNeedHunNumToBePu(m_HuPaiVec, 0);
					// console.log("1111islaizi_needMinHunNum = "+needMinHunNum+"    hashunNum = "+hunNum);
					if (needMinHunNum <= hunNum)
					{
						finalJiangNeedHunNum = hunNum+1-needMinHunNum;
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

						needMinHunNum = MJPAI_HUNMAX;
						calNeedHunNumToBePu(m_HuPaiVec, 0);
						// console.log("22222islaizi_needMinHunNum = "+needMinHunNum+"    hashunNum = "+hunNum);
						if (needMinHunNum <= hunNum)
						{
							finalJiangNeedHunNum = hunNum-needMinHunNum;
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
					needMinHunNum = MJPAI_HUNMAX;
					calNeedHunNumToBePu(m_HuPaiVec, 0);
					console.log("33333islaizi_needMinHunNum = "+needMinHunNum+"    hashunNum = "+hunNum);
					if (needMinHunNum <= hunNum)
					{
						finalJiangNeedHunNum = hunNum+1-needMinHunNum;
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
    function canHunHu (no7,cds,kouDian,cd) {
		console.log("zwz_laizisuanfa_began");

        //首先执行能否胡7对
        //if(!no7){
        //    var isHu7 = can_7_Hu(cds,cd);
        //    if(isHu7)
        //        return 7;
        //}
        //分牌，按类型：条，筒，万，红中，1,2,3,5
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
		var lastCard = tmp[tmp.length-1];
		console.log("lastcard = "+lastCard);
		if (kouDian) {
			if (cd) {
				if( lastCard % 10 >=6 || lastCard >30) {
					if(cd == majiang.laizi){//传入癞子牌不让胡
						return 0;
					}
				}else {
					return 0;
				}
			}else {
				if((lastCard) == (majiang.laizi)|| lastCard % 10 >=3 || lastCard >30) {
					console.log("lastcard111111111111 = "+lastCard);
				}else {
					console.log("lastcard222222222222222 = "+majiang.laizi);
					return 0;
				}
			}
		}
		console.log("zwz_laizisuanfa_began_cds = "+cds);
		cds.sort(function(a,b){return a-b});
		console.log("zwz_laizisuanfa_began_cds = "+cds);
        for(i=0;i<cds.length;i++){
            if(isHun(cds[i])){
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
        var needHunNum = 0;
        var jiangNeedNum = 0;
        needMinHunNum = MJPAI_HUNMAX;
        calNeedHunNumToBePu(allCards[cardType.wan], 0);
        var wanToPuNeedNum = needMinHunNum;
		console.log("zwz_laizisuanfa_allCards[cardType.wan] = "+allCards[cardType.wan]);
		console.log("zwz_laizisuanfa_wanToPuNeedNum = "+needMinHunNum);
        needMinHunNum = MJPAI_HUNMAX;
        calNeedHunNumToBePu(allCards[cardType.tong], 0);
        var tongToPuNeedNum = needMinHunNum;
		console.log("zwz_laizisuanfa_allCards[cardType.tong] = "+allCards[cardType.tong]);
		console.log("zwz_laizisuanfa_tongToPuNeedNum = "+needMinHunNum);
        needMinHunNum = MJPAI_HUNMAX;
        calNeedHunNumToBePu(allCards[cardType.tiao], 0);
        var tiaoToPuNeedNum = needMinHunNum;
		console.log("zwz_laizisuanfa_allCards[cardType.tiao] = "+allCards[cardType.tiao]);
		console.log("zwz_laizisuanfa_tiaoToPuNeedNum = "+needMinHunNum);
        //支持风
        needMinHunNum = MJPAI_HUNMAX;
        calNeedHunNumToBePu(allCards[cardType.feng], 0);
        var fengToPuNeedNum = needMinHunNum;
		console.log("zwz_laizisuanfa_allCards[cardType.feng] = "+allCards[cardType.feng]);
		console.log("zwz_laizisuanfa_fengToPuNeedNum = "+needMinHunNum);
        var hasNum = 0;
        var vecSize =0;
        var isHu = false;
        var hunHuType=100;//混胡的类型定义
        var curHunNum = allCards[cardType.hun].length;

        //将在万中
        //如果需要的混小于等于当前的则计算将在将在万中需要的混的个数
        needHunNum = tongToPuNeedNum + tiaoToPuNeedNum + fengToPuNeedNum;
		console.log("zwz_wan_HasJiang_needHunNum = "+needHunNum);
		finalNeedHunNum = needHunNum;
        if (needHunNum <= curHunNum)
        {
            vecSize = allCards[cardType.wan].length;
            hasNum = curHunNum - needHunNum;
			console.log("zwz_laizisuanfa_hasNum= "+hasNum);
            //
            isHu= isCanHunHu(hasNum,allCards[cardType.wan]);
            if (isHu) {
				finalNeedHunNum = finalNeedHunNum+finalJiangNeedHunNum;
				console.log("zwz_laizisuanfa_wan_finalJiangNeedHunNum= "+finalJiangNeedHunNum+
					"   finalNeedHunNum = "+finalNeedHunNum);
				return hunHuType;
			}
        }

        //将在饼中
        needHunNum = wanToPuNeedNum + tiaoToPuNeedNum + fengToPuNeedNum;
		console.log("zwz_bing_HasJiang_needHunNum = "+needHunNum);
		finalNeedHunNum = needHunNum;
        if (needHunNum <= curHunNum)
        {
            vecSize = allCards[cardType.tong].length;
            hasNum = curHunNum - needHunNum;
			console.log("zwz_laizisuanfa_hasNum= "+hasNum);
            isHu= isCanHunHu(hasNum,allCards[cardType.tong]);
			if (isHu) {
				finalNeedHunNum = finalNeedHunNum+finalJiangNeedHunNum;
				console.log("zwz_laizisuanfa_bing_finalJiangNeedHunNum= "+finalJiangNeedHunNum+
					"   finalNeedHunNum = "+finalNeedHunNum);
				return hunHuType;
			}
		}

        //将在条中
        needHunNum = wanToPuNeedNum + tongToPuNeedNum + fengToPuNeedNum;
		console.log("zwz_tiao_HasJiang_needHunNum = "+needHunNum);
		finalNeedHunNum = needHunNum;
        if (needHunNum <= curHunNum)
        {
            vecSize = allCards[cardType.tiao].length;
            hasNum = curHunNum - needHunNum;
			console.log("zwz_laizisuanfa_hasNum= "+hasNum);
            isHu= isCanHunHu(hasNum,allCards[cardType.tiao]);
			if (isHu) {
				finalNeedHunNum = finalNeedHunNum+finalJiangNeedHunNum;
				console.log("zwz_laizisuanfa_tiao_finalJiangNeedHunNum= "+finalJiangNeedHunNum+
					"   finalNeedHunNum = "+finalNeedHunNum);
				return hunHuType;
			}
		}

        //将在风中,支持
        needHunNum = wanToPuNeedNum + tongToPuNeedNum + tiaoToPuNeedNum;
		console.log("zwz_feng_HasJiang_needHunNum = "+needHunNum);
		finalNeedHunNum = needHunNum;
        if (needHunNum <= curHunNum)
        {
            vecSize = allCards[cardType.feng].length;
            hasNum = curHunNum - needHunNum;
			console.log("zwz_laizisuanfa_hasNum= "+hasNum);
            isHu= isCanHunHu(hasNum,allCards[cardType.feng]);
			if (isHu) {
				finalNeedHunNum = finalNeedHunNum+finalJiangNeedHunNum;
				console.log("zwz_laizisuanfa_feng_finalJiangNeedHunNum= "+finalJiangNeedHunNum+
					"   finalNeedHunNum = "+finalNeedHunNum);
				return hunHuType;
			}
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
	function isHun(card){
		//console.log("laizi______haozi____ = " + majiang.laizi);
		if(card==majiang.laizi){
			return true;
		}
		return false;
	}


	function can_7_Hu(cds, cd) {
		var tmp = [];
		for (var i = 0; i < cds.length; i++) tmp.push(cds[i]);
		if (cd) tmp.push(cd);
		cds = tmp;
		cds.sort(function (a, b) {
			return a - b
		});

		if (cds.length != 14) {
			return false;
		}
		var oddCards = cds.slice(0);
		var hunCards = [];

		for (i = 0; i < cds.length; i++) {
			if (isHun(cds[i])) {
				hunCards.push(cds[i]);
				var index = oddCards.indexOf(cds[i]);
				oddCards.splice(index, 1);
				continue;
			}
			if (i == cds.length - 1) {

			}
			else if (cds[i] == cds[i + 1]) {
				var index = oddCards.indexOf(cds[i]);
				oddCards.splice(index, 2);
				i++;
			}
		}

		if (oddCards.length > 0) {//有单牌
			if (hunCards.length >= oddCards.length) {//单牌数==红中数
				return true;
			}
		} else {
			return true;
		}
		return false;
	}


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
	function is7xiaodui(handcards){
		// console.log("7xiaodui+handcards = "+handcards);
		if(handcards.length!=14){
			return 0;
		}
		var leftcards = [];
		for(var i=0;i<handcards.length;i+=2)
		{
			if(handcards[i]!=handcards[i+1]) {return 0}
			leftcards.push(handcards[i]);
		}
		console.log("7xiaodui+leftcards = "+leftcards);

		for(var i = 0;i<leftcards.length;i++){
			var card = leftcards[i];
			leftcards.splice(i,1);
			console.log("7xiaodui+leftcards ===== "+leftcards);
			if(canMatchSeq(leftcards)){
				return 1;
			}
			leftcards.splice(i,0,card);
			console.log("7xiaodui+leftcards ++++++ "+leftcards);
		}
		return 7;
	}


	majiang.laizidandiao = function(pl){
		//1.初始化
		var mjhand = pl.mjhand;

		var allCards=[];
		allCards[cardType.tiao]=[];
		allCards[cardType.tong]=[];
		allCards[cardType.wan]=[];
		allCards[cardType.feng]=[];//
		allCards[cardType.hun]=[];
		var tmp=[];
		for(var i=0;i<mjhand.length;i++){
			if((i == mjhand.length-1)&& (mjhand.length%3 == 2)){
				continue;
			}
			if(isHun(mjhand[i])){
				allCards[cardType.hun].push(mjhand[i]);
				continue;
			}

			tmp.push(mjhand[i]);
		}

		cds = tmp;
		cds.sort(function(a,b){return a-b});

		for(i=0;i<cds.length;i++){
			if(isHun(cds[i])){
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
		if(allCards[cardType.hun].length == 0){
			return false;
		}
		var needhun = 0;
		needMinHunNum = MJPAI_HUNMAX;
		calNeedHunNumToBePu(allCards[cardType.wan], 0);
		var wanToPuNeedNum = needMinHunNum;

		needMinHunNum = MJPAI_HUNMAX;
		calNeedHunNumToBePu(allCards[cardType.tong], 0);
		var tongToPuNeedNum = needMinHunNum;

		needMinHunNum = MJPAI_HUNMAX;
		calNeedHunNumToBePu(allCards[cardType.tiao], 0);
		var tiaoToPuNeedNum = needMinHunNum;

		//支持风
		needMinHunNum = MJPAI_HUNMAX;
		calNeedHunNumToBePu(allCards[cardType.feng], 0);
		var fengToPuNeedNum = needMinHunNum;


		//如果需要的混小于等于当前的则计算需要的混的个数
		needhun = tongToPuNeedNum + tiaoToPuNeedNum + wanToPuNeedNum+fengToPuNeedNum;
		if(needhun<allCards[cardType.hun].length){
			return true;
		}
		return false;
	};
majiang.computeBaseWin=function(pi,withDesc)
{
	var num2=pi.huType==7?1:0;	if(num2==1&&majiang.canGang1([],pi.mjhand).length>0) num2=2;
	var num3=num2>0?0:majiang.All3(pi);
	var sameColor=majiang.SameColor(pi);
	
	var baseWin=1;

	if (sameColor) 
	{
		var lengthCount = pi.mjdesc.length;
		if(num3==1)
		{
			baseWin*=15;  
		}
		else if(num3==2)
		{
			baseWin*=15;  
		}
		
		if(num2>0)
		{
			baseWin*=num2>1?20:17;  
		}
	
		if (lengthCount == pi.mjdesc.length ) 
		{
			baseWin*=10;  
		}
	}else
	{
		if(num3==1)
		{
			baseWin*=5;  
		}
		else if(num3==2)
		{
			baseWin*=5;  		}
		
		if(num2>0)
		{
			baseWin*=num2>1?10:7;  
		}
	}

	return baseWin;
}
 //十三幺胡
majiang.canhu13=function(cds, cd) 
{
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
    for (var i in tmp) {
        if (s13[i] != tmp[i]) {
            return 0;
        }
    }
    return 13;
};
majiang.missHandMax=function(pl)
{
	var mjhand=pl.mjhand;
	var tryCard={};
	var sData=jsInstance.data.sData;
	var tData=sData.tData;
	for(var i=0;i<mjhand.length;i++)
	{
		var cd=mjhand[i];
		for(var j=-1;j<=1;j++)
		{
			var cj=cd+j;
			if(cj>=1&&cj<=9||cj>=11&&cj<=19||cj>=21&&cj<=29)
			{
				tryCard[cj]=cj;
			}
		}
		if (cd==31||cd==41||cd==51||cd==61||cd==71||cd==81||cd==91) 
		{
			tryCard[cd]=cd;
		}
	}
	var check13 = false;

	if (tData.kouDian||tData.yulin||(tData.gameKind && tData.gameKind == "xyPoint"))
	{
		// cc.log("__________________听提示~~~~~~~~~~~"+tData.gameKind);
		var passCardType = 6;//6及以上才能胡
		if(tData.gameKind && tData.gameKind == "xyPoint"){
			passCardType = 5;//5及以上才能胡
		}
		for(var cd in tryCard)
		{
		
			if(tData && (tData.kouDian||tData.yulin||(tData.gameKind && tData.gameKind == "xyPoint")))
			{
				// cc.log("__________________听提示~~~~~~~~~~~ cd:"+cd+" tryCard[cd]:"+tryCard[cd]);
				if (cd%10>=passCardType||cd>30) 
				{

				}else if(tryCard[cd])
				{
				 	delete	tryCard[cd];
				}

			}
		}
	}else if(pl.mjpeng.length == 0 && pl.mjgang0.length == 0 && pl.mjgang1.length == 0)
	{

		console.log("十三幺检测报听")
		check13 = true;
	}

	var maxWin=0;
	mjhand.push(0);
	var tingKouArray = [];
    for(var cd in tryCard)
	{
		var lastCD=mjhand[mjhand.length-1];
		var cdi=tryCard[cd];
		mjhand[mjhand.length-1]=cdi;
		var huType=majiang.canHu(false,mjhand);

		if(check13)
		{
			var huType13=majiang.canhu13(mjhand);
			if(huType13>0)
			{
				huType = huType13;
			}
		}
			

		if(huType>0)
		{
			var oldDesc=pl.mjdesc;
			pl.mjdesc=[];
			pl.huType=huType;
			var winNum=majiang.computeBaseWin(pl,true);
			if(winNum>maxWin)maxWin=winNum;
			else 
			{ pl.mjdesc=oldDesc;
		      mjhand[mjhand.length-1]=lastCD;
		    }
		    tingKouArray.push(cdi);
		    
		}else mjhand[mjhand.length-1]=lastCD;
	}	
	mjhand.length=mjhand.length-1;
	return [maxWin,tingKouArray];
}


majiang.findTingByMjhand=function(mjhand,mjpeng,mjgang0,mjgang1,choiceObj)
{
	var choice13 = (choiceObj.choice13 == undefined)?true:choiceObj.choice13;
	var no7 = (choiceObj.no7 == undefined)?false:choiceObj.no7;//默认检测七小对
	var hard8 = (choiceObj.hard8 == undefined)?false:choiceObj.hard8;//不检测硬八张
	var check13 = false;//默认检测13幺
	
	//排除手牌有四张情况
	var cardNumObj = {};
	var fourArr = [];
	for (var i = 0; i < mjhand.length; i++) {
		if(cardNumObj[mjhand[i]]){
			cardNumObj[mjhand[i]]++;
		}else{
			cardNumObj[mjhand[i]] = 1;
		}
	}
	for(var key in cardNumObj){
		if(cardNumObj[key] == 4){
			fourArr.push(parseInt(key));
		}
	}

	var tryCard={};
	var sData=cc.jsInstance.data.sData;
	var tData=sData.tData;
	for(var i=0;i<mjhand.length;i++)
	{
		var cd=mjhand[i];
		for(var j=-1;j<=1;j++)
		{
			var cj=cd+j;
			if((cj>=1&&cj<=9||cj>=11&&cj<=19||cj>=21&&cj<=29)&&fourArr.indexOf(cj)==-1)
			{
				tryCard[cj]=cj;
			}
		}
		if ((cd==31||cd==41||cd==51||cd==61||cd==71||cd==81||cd==91)&&fourArr.indexOf(cj)==-1) 
		{
			tryCard[cd]=cd;
		}
	}
	

	if (tData.kouDian||tData.yulin)
	{
		for(var cd in tryCard)
		{
		
			if(tData && (tData.kouDian||tData.yulin))
			{
				if (cd%10>=6||cd>30) 
				{

				}else if(tryCard[cd])
				{
				 	delete	tryCard[cd];
				}
			}
		}
	}else if(choice13 && mjpeng.length == 0 && mjgang0.length == 0 && mjgang1.length == 0)
	{

		console.log("十三幺检测报听")
		check13 = true;

	}

	//自己加的
	if(check13){
		for(var i = 0; i<s13.length;i++){
			if(!tryCard.hasOwnProperty(s13[i])){
				tryCard[s13[i]] = s13[i];
			}
		}

	}

	return majiang.getTingkouArr(mjhand,tryCard,check13,no7,hard8,[mjpeng,mjgang0,mjgang1]);
}
majiang.getTingkouArr = function(mjhand,tryCard,check13,no7,hard8,pgArr){
	mjhand.push(0);
	var tingKouArray = [];
    for(var cd in tryCard)
	{
		var lastCD=mjhand[mjhand.length-1];
		var cdi=tryCard[cd];
		mjhand[mjhand.length-1]=cdi;
		var huType=majiang.canHu(no7,mjhand);

		if(check13)
		{
			var huType13=majiang.canhu13(mjhand);
			if(huType13>0)
			{
				huType = huType13;
			}
		}
		if(hard8 && !majiang.is8SameColor(mjhand,pgArr[0],pgArr[1],pgArr[2])){//不符合硬八张
			huType = 0;
		}
		if(huType>0)
		{
		    tingKouArray.push(cdi);   
		}

		
		mjhand[mjhand.length-1]=lastCD;
	}	
	mjhand.length=mjhand.length-1;
	return tingKouArray;
}
majiang.SameCardCount = function(cards,cd)
{
	var count = 0;
	for(var i=0;i<cards.length;i++){
		if(cards[i]==cd){
			count++;
		}
	}
	return count;
}

/*
**立四麻将听牌
*/
majiang.LiSi_missHandMax=function(pl)
{
	
	var mjhand=pl.mjhand.slice(0);
	console.log("LiSi_missHandMax"+mjhand);
	var tryCard={};
	var sData=cc.jsInstance.data.sData;
	var tData=sData.tData;
	for(var i=0;i<mjhand.length;i++)
	{
		var cd=mjhand[i];
		for(var j=-1;j<=1;j++)
		{
			var cj=cd+j;
			if(cj>=1&&cj<=9||cj>=11&&cj<=19||cj>=21&&cj<=29)
			{
				tryCard[cj]=cj;
			}
		}
		if (cd==31||cd==41||cd==51||cd==61||cd==71||cd==81||cd==91) 
		{
			tryCard[cd]=cd;
		}
	}
	var maxWin=0;
	mjhand.push(0);
    for(var cd in tryCard)
	{
		var lastCD=mjhand[mjhand.length-1];
		var cdi=tryCard[cd];
		mjhand[mjhand.length-1]=cdi;
		var huType=majiang.canHu(true,mjhand,false);
		if(huType>0)
		{
			var oldDesc=pl.mjdesc;
			pl.mjdesc=[];
			pl.huType=huType;
			var winNum=majiang.computeBaseWin(pl,true);
			if(winNum>maxWin)maxWin=winNum;
			else 
			{ pl.mjdesc=oldDesc;
		      mjhand[mjhand.length-1]=lastCD;
		    }
		    
		}else mjhand[mjhand.length-1]=lastCD;
	}	
	mjhand.length=mjhand.length-1;
	return maxWin;
}
	/*
	 **癞子麻将听牌
	 */
	majiang.misshunHandMax = function(pl){
		var mjhand=pl.mjhand;
		var tryCard=[];
		var laizi = [];
		var sData=cc.jsInstance.data.sData;
		var tData=sData.tData;
		//听牌检测数组  是手牌数组中相连或相同的牌型
		for(var i=0;i<mjhand.length;i++)
		{
			var cd=mjhand[i];
			if(cd == majiang.laizi){
				laizi.push(cd);
			}
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
		//如果扣点中有癞子牌   就需要加入9 或者 风  因为癞子可以单调这些牌
		if (tData.kouDian) {
			if (laizi.length > 0) {
				var laizihupai = [ 91,81,71];
				for (var i in laizihupai) {
					tryCard.push(laizihupai[i])
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
		//如果在扣点中  所有听口为6一下的牌都干掉，减少循环次数
		if (tData.kouDian)
		{
			for(i = 0;i<tryCard.length;i++)
			{
				if(tData && tData.kouDian)
				{
					if (tryCard[i]%10>=6||tryCard[i]>30)
					{

					}else
					{
						tryCard.splice(i,1);
						i--;
					}
				}
			}
		}
		//console.log("tryCard = "+tryCard);
		var maxWin=0;
		var tingKouArray = [];
		for(var cd in tryCard)
		{
			var cdi=tryCard[cd];
			var huType=majiang.canhunHu(false,mjhand,true,cdi);
			if(huType>0)
			{
				var oldDesc=pl.mjdesc;
				pl.mjdesc=[];
				pl.huType=huType;
				var winNum=tryCard[cd];//这里需要改改
				if(winNum>maxWin){
					maxWin=winNum;
				} else {
					pl.mjdesc=oldDesc;
				}
				tingKouArray.push(cdi);
			}
		}
		//console.log("zwz_maxWin = "+maxWin)
		return [maxWin, tingKouArray];
	}

/*
**晋中麻将缺门算法
*/
    //缺门牌形
    majiang.jinZhongQueMen = function (pl) {
		var cds = pl.mjhand;	
        var mTiaoNum = 0, mWanNum = 0,mTongNum = 0;
        var eNum = [1,11,21];
        var vNum = [10,20,30];
        var tmp = [];
        for (var i = 0; i < cds.length; i++) tmp.push(cds[i]);

    
		//明杠的牌放进去
		for (var i=0; i<pl.mjgang0.length; i++)
		{
			tmp.push(pl.mjgang0[i]);
		}
		//暗杠的牌放进去
		for (var i=0; i<pl.mjgang1.length; i++)
		{
			tmp.push(pl.mjgang1[i]);
		}
		//碰的牌放进去
		for (var i=0; i<pl.mjpeng.length; i++)
		{
			tmp.push(pl.mjpeng[i]);
		}

        tmp.sort(function (a, b) {
            return a - b
        });
        for(var i=0; i < tmp.length; i++)
        {
            if (tmp[i] >= eNum[2] && tmp[i] < vNum[2])
                mTongNum++;
            else if (tmp[i] >= eNum[1] && tmp[i] < vNum[1])
                mWanNum++;
            else if(tmp[i] >= eNum[0] && tmp[i] < vNum[0])
                mTiaoNum++;
        }
        var num = 0;
        if (mTongNum == 0)
            num++;
        if (mWanNum == 0)
            num++;
        if (mTiaoNum == 0)
            num++;
      	if (num>=1) 
      	{
      		return 1;
      	}else
      	{
      		return -1;
      	}
    }


majiang.checkTing=function(hand)
{
	var sData=cc.jsInstance.data.sData;
	var tData=sData.tData;
	//捉耗子胡法
	if(tData.zhuohaozi){
		var mjhand=hand;
		var tryCard=[];
		var laizi = [];

		//听牌检测数组  是手牌数组中相连或相同的牌型
		for(var i=0;i<mjhand.length;i++)
		{
			var cd=mjhand[i];
			if(cd == majiang.laizi){
				laizi.push(cd);
			}
			for(var j=-1;j<=1;j++)
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
		//如果扣点中有癞子牌   就需要加入9 或者 风  因为癞子可以单调这些牌
		if (tData.kouDian) {
			if (laizi.length > 0) {
				var laizihupai = [ 91];
				for (var i in laizihupai) {
					tryCard.push(laizihupai[i])
				}
			}
		}
		tryCard.sort(function(a,b){return a-b});

		console.log("tryCard = "+tryCard);
		//去掉数组中相同的元素 减少循环次数
		for(var i = 0;i<tryCard.length-1;i++){
			if(tryCard[i] == tryCard[i+1]){
				tryCard.splice(i,1);
				i--;
			}
		}
		console.log("tryCard = "+tryCard);
		//如果在扣点中  所有听口为6一下的牌都干掉，减少循环次数
		if (tData.kouDian)
		{
			for(i = 0;i<tryCard.length;i++)
			{
				if(tData && tData.kouDian)
				{
					if (tryCard[i]%10>=6||tryCard[i]>30)
					{

					}else
					{
						tryCard.splice(i,1);
						i--;
					}
				}
			}
		}
		console.log("tryCard = "+tryCard);
		var maxWin=0;
		for(var cd in tryCard)
		{
			var cdi=tryCard[cd];
			var huType=majiang.canhunHu(false,mjhand,true,cdi);
			if(huType>0)
			{
				return	1;
			}
		}
		return maxWin;
	}

	//其他胡法
	var mjhand=hand;
	var tryCard={};

	for(var i=0;i<mjhand.length;i++)
	{
		var cd=mjhand[i];
		for(var j=-1;j<=1;j++)
		{
			var cj=cd+j;
			if(cj>=1&&cj<=9||cj>=11&&cj<=19||cj>=21&&cj<=29)
			{
				tryCard[cj]=cj;
			}
		}
		if (cd==31||cd==41||cd==51||cd==61||cd==71||cd==81||cd==91) 
		{
			tryCard[cd]=cd;
		}
	}

	if (tData.kouDian) 
	{
		for(var cd in tryCard)
		{
		
			if(tData && tData.kouDian)
			{
				if (cd%10>=6||cd>30) 
				{

				}else if(tryCard[cd])
				{
				 	delete	tryCard[cd];
				}
			}
		}
	}

	var maxWin=0;
	mjhand.push(0);
    for(var cd in tryCard)
	{
		var lastCD=mjhand[mjhand.length-1];
		var cdi=tryCard[cd];
		mjhand[mjhand.length-1]=cdi;
		var huType=majiang.canHu(false,mjhand);
		if(huType>0)
		{
			return 1;
		    
		}else mjhand[mjhand.length-1]=lastCD;
	}	
	mjhand.length=mjhand.length-1;
	return maxWin;
}

majiang.canHuLiSi=function(no7,cds,kouDian,cd)
{
   var tmp=[];   for(var i=0;i<cds.length;i++) tmp.push(cds[i]);
   if(cd) tmp.push(cd); cds=tmp;
   var lastCard = tmp[tmp.length-1];
    if (kouDian )  
    {

   		if (cd) 
   		{
   		   if( lastCard % 10 >=6 || lastCard >30) 
		   {

		   }else
		   {
		   	 return 0;
		   }
   		}else
   		{
   			if( lastCard % 10 >=3 || lastCard >30) 
		   {

		   }else
		   {
		   	 return 0;
		   }
   		}
   	  
   }

   cds.sort(function(a,b){return a-b});
   var pair={};
   for(var i=0;i<cds.length;i++)
   {
       if(i < cds.length-1 && cds[i]==cds[i+1])
       pair[cds[i]]=cds[i];
   }
   if(Object.keys(pair).length==0) return -1;
   for(var pairKey in pair)
   {
	   var pcd=pair[pairKey];
       var left=[];
       var pnum=0;
       for(var i=0;i<cds.length;i++)
       {
           if(cds[i]==pcd&&pnum<2)
               pnum++;
           else   left.push(cds[i]);
       }
	   if(left.length==0) return 1;
       if(left.length==12)
       {
          var is13=true,off13=0;
          for(var i=0;i+off13<s13.length;i++)
          {  
            if(pcd==s13[i]) off13++;
            if(left[i]!=s13[i+off13])
            {
               is13=false;
               break;
            }
          }
          if(off13==1&&is13) return 13;
            var is7=true;
		  //if(no7) is7=false;
           for(var i=0;i<left.length;i+=2) 
           {
           	if(left[i]!=left[i+1]) {is7=false; break;} 
           } 
           
          if(is7&&no7) 
          {
          	if (kouDian) 
          	{
          		return 2;
          	}else
          	{
          		return 1;
          	}
          	
          }else if(is7)
          {
          	return 7;
          }
       }
	   var segs=[];
	   var seg=[left[0]];
	   for(var i=1;i<left.length;i++)
	   {
		  if(canLink(left[i-1],left[i])) seg.push(left[i]);
		  else
		  {
				segs.push(seg); 
				seg=[left[i]];
		  }
	   }
	   if(seg.length>0) segs.push(seg); 
	   var matchOK=true;
	   for(var i=0;i<segs.length;i++)
	   {
		  seg=segs[i];
		  if(seg.length%3!=0){ matchOK=false; break; }
		  for(var m=0;m<seg.length;)
		  {
			 if(canMath12(seg,m))      m+=12;
			 else if(canMath9(seg,m))  m+=9;
			 else if(canMath6(seg,m))  m+=6;
		     else if(canMath3(seg,m))  m+=3;
			 else { matchOK=false; break; }
		  }
	   }
	   if(matchOK) return 1;
   }
   return 0;
}

majiang.canHu=function(no7,cds,kouDian,cd)
{
	var tData = cc.jsInstance.data.sData.tData;
   var tmp=[];   for(var i=0;i<cds.length;i++) tmp.push(cds[i]);
   if(cd) tmp.push(cd); cds=tmp;
   var lastCard = tmp[tmp.length-1];
    if (kouDian ||tData.yulin)
    {
   		if (cd) 
   		{
   		   if( lastCard % 10 >=6 || lastCard >30) 
		   {

		   }else
		   {
		   	 return 0;
		   }
   		}else
   		{
   			if( lastCard % 10 >=3 || lastCard >30) 
		   {

		   }else
		   {
		   	 return 0;
		   }
   		}
   	  
   }

   cds.sort(function(a,b){return a-b});
   var pair={};
   for(var i=0;i<cds.length;i++)
   {
       if(i < cds.length-1 && cds[i]==cds[i+1])
       pair[cds[i]]=cds[i];
   }
   if(Object.keys(pair).length==0) return -1;
   for(var pairKey in pair)
   {
	   var pcd=pair[pairKey];
       var left=[];
       var pnum=0;
       for(var i=0;i<cds.length;i++)
       {
           if(cds[i]==pcd&&pnum<2)
               pnum++;
           else   left.push(cds[i]);
       }
	   if(left.length==0) return 1;
       if(left.length==12)
       {
          var is13=true,off13=0;
          for(var i=0;i+off13<s13.length;i++)
          {  
            if(pcd==s13[i]) off13++;
            if(left[i]!=s13[i+off13])
            {
               is13=false;
               break;
            }
          }
          if(off13==1&&is13) return 13;
          
          var is7=true;
		  
		  //立四麻将不带7小对

		  if(tData.lisi)
		  {
			  is7=false;
		  }

		   var hutype = is7xiaodui(tmp);
			if(hutype>0&&!tData.lisi){
				is7 = true;
			}else{
				is7 = false;
			}
		   if((tData.guaisanjiao||tData.guaisanjiao2)&&is7){
			   if(tData.qixiaodui){
				   return 7;
			   }else{
				   if(hutype == 7){
					   return 0;
				   }else if(hutype == 1){
					   return 1;
				   }
			   }
		   }

          if(is7&&no7) 
          {
          	if (kouDian) 
          	{
          		return 2;
          	}else
          	{
          		return 1;
          	}
          	
          }else if(is7)
          {
          	return 7;
          }
       }
	   var segs=[];
	   var seg=[left[0]];
	   for(var i=1;i<left.length;i++)
	   {
		  if(canLink(left[i-1],left[i])) seg.push(left[i]);
		  else
		  {
				segs.push(seg); 
				seg=[left[i]];
		  }
	   }
	   if(seg.length>0) segs.push(seg); 
	   var matchOK=true;
	   for(var i=0;i<segs.length;i++)
	   {
		  seg=segs[i];
		  if(seg.length%3!=0){ matchOK=false; break; }
		  for(var m=0;m<seg.length;)
		  {
			 if(canMath12(seg,m))      m+=12;
			 else if(canMath9(seg,m))  m+=9;
			 else if(canMath6(seg,m))  m+=6;
		     else if(canMath3(seg,m))  m+=3;
			 else { matchOK=false; break; }
		  }
	   }
	   if(matchOK) return 1;
   }
   return 0; 
}
	majiang.canhunHu = canHunHu;

majiang.canGang1_jinZhong=function(peng,hand,peng4,ting)
{
	var rtn=[];
	if (ting) 
	{
		return rtn;
	}else
	{
		for(var i=0;i<peng.length;i++)
		{
			if(hand.indexOf(peng[i])>=0&&peng4.indexOf(peng[i])<0)
			{
				rtn.push(peng[i]);
			}
		}
		var cnum={};
		for(var i=0;i<hand.length;i++)
		{
			var cd=hand[i];
			var num=cnum[cd];
			if(!num) num=0;
			num++;
		    cnum[cd]=num;
			if(num==4) rtn.push(cd);
		}
		return rtn;
	}
}

majiang.canGang0_jinZhong=function(hand,cd,ting)
{
	var num=0;
	if (ting) 
	{
    	return false;
	}else
	{
		for(var i=0;i<hand.length;i++)
		{
			if(hand[i]==cd) num++;
		}
		return num==3;
	}
}

majiang.canGang1=function(peng,hand,peng4,ting)
{
	var rtn=[];
	if (ting) 
	{
		for(var i=0;i<peng.length;i++)
		{
			if(hand.indexOf(peng[i])>=0&&peng4.indexOf(peng[i])<0)
			{

				var cpArry = hand.slice(0);
				cpArry.splice(cpArry.indexOf(peng[i]),1);
				if (majiang.checkTing(cpArry)>0) 
				{
					rtn.push(peng[i]);
				}
			}
		}
		var cnum={};
		for(var i=0;i<hand.length;i++)
		{
			var cd=hand[i];
			var num=cnum[cd];
			if(!num) num=0;
			num++;
		    cnum[cd]=num;
		    
			if(num==4)
			{
				console.log("111111111111111111111")
				var cpArry = hand.slice(0);
			    for (var j = 0; j < 4; j++) {
			    	cpArry.splice(cpArry.indexOf(cd),1);
			    }
			    if(majiang.checkTing(cpArry)>0)
			    {
			    	rtn.push(cd);
			    }

			} 
		}
		return rtn;
	}else
	{
		for(var i=0;i<peng.length;i++)
		{
			if(hand.indexOf(peng[i])>=0&&peng4.indexOf(peng[i])<0)
			{
				rtn.push(peng[i]);
			}
		}
		var cnum={};
		for(var i=0;i<hand.length;i++)
		{
			var cd=hand[i];
			var num=cnum[cd];
			if(!num) num=0;
			num++;
		    cnum[cd]=num;
			if(num==4) rtn.push(cd);
		}
		return rtn;
	}
	
	
}

majiang.canGang1_liSi=function(pl)
{
	var hand =pl.mjhand;
	var peng =pl.mjpeng;
	var peng4 = pl.mjpeng4;
	var ting = pl.mjting;
	var rtn=[];
	if (ting) 
	{
		return rtn;
	}else
	{
		for(var i=0;i<peng.length;i++)
		{
			if(hand.indexOf(peng[i])>=0&&peng4.indexOf(peng[i])<0)
			{

				rtn.push(peng[i]);
			}
		}
		var cnum={};
		for(var i=0;i<hand.length;i++)
		{
			var cd=hand[i];
			var num=cnum[cd];
			if(!num) num=0;
			num++;
		    cnum[cd]=num;
		   
			if(num==4 &&  majiang.SameCardCount(pl.mjli,cd) != 4)
			{
				rtn.push(cd);
			} 
		}
		return rtn;
	}
	
	
}
majiang.canGang0=function(hand,cd,ting)
{
	var num=0;
	if (ting) 
	{
		for(var i=0;i<hand.length;i++)
		{
			if(hand[i]==cd) num++;
		}
		if (num==3) 
		{
			var cpArry = hand.slice(0);
			    for (var j = 0; j < 3; j++) {
			    	cpArry.splice(cpArry.indexOf(cd),1);
			    }
			    if(majiang.checkTing(cpArry)>0)
			    {
			    	return true;
			    }else
			    {
			    	return false;
			    }
		}
		
	}else
	{
		for(var i=0;i<hand.length;i++)
		{
			if(hand[i]==cd) num++;
		}
		return num==3;
	}
	
}

majiang.canGang0_liSi=function(hand,cd,ting,mjli)
{
	var num=0;
	var linum=0;
	if (ting)
	{
		return false;
	}else
	{
		for(var i=0;i<hand.length;i++)
		{
			if(hand[i]==cd) num++;
		}
		for(var i=0;i<mjli.length;i++)
		{
			if(mjli[i]==cd) linum++;
		}
		return (num==3) && (linum!=3);
	}
}

majiang.canPeng=function(hand,cd)
{
	var num=0;
	for(var i=0;i<hand.length;i++)
	{
		if(hand[i]==cd) num++;
	}
	return num>=2;
}

//适用于立牌，碰方法
majiang.canPeng_Li = function (hand, cd, li) {
    var num = 0;
    for (var i = 0; i < hand.length; i++) {
        if (hand[i] == cd) num++;
    }
    if(num <2){
        return false;
    }
    var linum = 0;
    for (var i = 0; i < li.length; i++) {
        if (li[i] == cd) linum++;
    }
    if(num==3){
        return true;
    } else if(linum == num){//全在立牌中
        if(li.length>linum){
            return true;
        }
    }else if(linum == 0){//全在其他牌中
        return true;
    }else if(li.length > 1){
        return true;
    }
    return false;
}

majiang.canChi=function(hand,cd)
{
	var num=[0,0,0,0,0];
	var rtn=[];
	for(var i=0;i<hand.length;i++)
	{
		var dif=hand[i]-cd ;
		switch(dif)
		{
			case -2:
			case -1:
			case 1:
			case 2:
			   num[dif+2]++;
			break;
		}
	}
	if(num[3]>0&&num[4]>0) rtn.push(0);
	if(num[1]>0&&num[3]>0) rtn.push(1);
	if(num[0]>0&&num[1]>0) rtn.push(2);
	return rtn;
}
majiang.CardCount=function(pl)
{
	var rtn=(pl.mjpeng.length+ pl.mjgang0.length+ pl.mjgang1.length)*3+pl.mjchi.length;
	if(pl.mjhand) rtn+=pl.mjhand.length;
	return rtn;
}
majiang.OnlyHand=function(pl)
{
	return   pl.mjpeng.length==0&& pl.mjgang0.length==0&&pl.mjchi.length==0;
}
majiang.SameColor=function(pl)
{
	var test=[  pl.mjhand,  pl.mjpeng,  pl.mjgang0,  pl.mjgang1,  pl.mjchi	];
	var color=-1;
	for(var i=0;i<test.length;i++)
	{
		var cds=test[i];
		for(var j=0;j<cds.length;j++)
		{
			var cd=cds[j];
			if(color==-1) color=Math.floor(cd/10);
			else if(color!=Math.floor(cd/10)) return false;
		}
	}
	return true;
}

majiang.MixColor=function(pl)
{
	var test=[  pl.mjhand,  pl.mjpeng,  pl.mjgang0,  pl.mjgang1,  pl.mjchi	];
	var color=-1;
	var feng =-1;
	for(var i=0;i<test.length;i++)
	{
		var cds=test[i];
		for(var j=0;j<cds.length;j++)
		{
			var cd=cds[j];
			if(color==-1) color=Math.floor(cd/10);
			if (cd > 30) 
			{
				feng=1;
			}
			else if(color!=Math.floor(cd/10) && cd <31) return false;
		}
	}
	if (feng == 1 ) 
	{
		return true;
	}else
	{
		return false;
	}
	
}

majiang.All3=function(pl)
{
	if(pl.mjchi.length>0) return 0;
	var hnum={};
	var mjhand=pl.mjhand;
	for(var i=0;i<mjhand.length;i++)
	{
		var cd=mjhand[i];
		var cnum=hnum[cd];
		if(!cnum) cnum=0;
		cnum++;
		hnum[cd]=cnum;
	}
	var smallNum=0;
	var num2=0;
	for(var cd in hnum)
	{
		var cnum=hnum[cd];
		if(cnum<3) num2++;
		else if(cd<30) smallNum++;
	}
	if(num2>1) return 0;
	if(smallNum>0) return 1;
	var test=[pl.mjhand,    pl.mjpeng,  pl.mjgang0,  pl.mjgang1];
	for(var i=0;i<test.length;i++)
	{
		var cds=test[i];
		for(var j=0;j<cds.length;j++)
		{
			if(cds[j]<30) return 1;
		}
	}
	return 2;
}
//硬八张
majiang.is8SameColor=function(mjhand,mjpeng,mjgang0,mjgang1)
{
    var plmjhand = [].concat(mjhand, mjpeng, mjpeng, mjpeng, mjgang0, mjgang0, mjgang0, mjgang0, mjgang1, mjgang1, mjgang1, mjgang1);
    var tiaoColor = 0,wanColor = 0,tongColor = 0, sprColor = 0;
    for(var i = 0;i < plmjhand.length;++i)
    {
        var color = Math.floor(plmjhand[i]/10);
        if(color == 0) //tiao
            tiaoColor++;
        else if(color == 1)//wan
            wanColor++;
        else if(color == 2)//tong
            tongColor++;
        else
            sprColor++; //feng
    }
    if(tiaoColor>=8 || wanColor>=8 || tongColor>=8 || sprColor>=8)
    {
        return true;
    }
    return false;
}
majiang.NumOK=function(pl)
{
	return pl.mjhand.length+(pl.mjpeng.length+pl.mjgang0.length+pl.mjgang1.length)*3+pl.mjchi.length==14;
}

	function TestRandomCards()
	{
		var cards=majiang.randomCards();
		var nums={};
		for(var i=0;i<cards.length;i++)
		{
			var cd=cards[i];
			if(!nums[cd]) nums[cd]=1;
			else nums[cd]=nums[cd]+1;
		}
		for(var c in nums)
		{
			if(nums[c]!=4) console.error("not 4");
		}
		if(Object.keys(nums).length!=34) console.error("not 34");
	}
	function TestHu()
	{
		var hu=[
/*		   
		   [19,5,8,16,2,23,11,6,31,13,26,1,28,81]
		   ,[1,9,11,19,21,29,31,41,51,61,71,81,91,71]
		   ,[1,1, 2,2, 3,3, 4,4, 5,5, 6,6, 7,7]
		   ,[1,2,3,4,4]
		   ,[1,1,2,2,3,3,4,4]
		   ,[8,5,15,14,16,81,6,27,21,22,17,13,12,91]
		   ,*/
		   //[15,17,23,18,16,23,15,15]
		   [14,14,2,3,3,3,4,6,7,8,3]
		];
		for(var i=0;i<hu.length;i++)
		{
			console.info( majiang.canHu(false,hu[i])+" "+hu[i]);
		}
	}
	function TestcanGang1()
	{
		var gang=[
		  [[1],[1,2,2,2,2]],
		  [[1],[2,3]],
		];
		for(var i=0;i<gang.length;i++)
			console.info(majiang.canGang1(gang[i][0],gang[i][1] ));
	}
	function TestChi()
	{
		
		var chi=[
		  
		  [1,2,4,5],3
		  
		  ];
		  console.info(majiang.canChi(chi,3));
	}
	function TestCardType()
	{
		var tests=
		[
		    {name:"", mjpeng:[],mjgang0:[],mjgang1:[],mjchi:[],mjhand:[],mjdesc:[],baseWin:0 }	
		   ,{name:"", mjpeng:[],mjgang0:[],mjgang1:[],mjchi:[],mjhand:[],mjdesc:[],baseWin:0 }	
		   ,{name:"", mjpeng:[],mjgang0:[],mjgang1:[],mjchi:[],mjhand:[],mjdesc:[],baseWin:0 }	
		   ,{name:"", mjpeng:[],mjgang0:[],mjgang1:[],mjchi:[],mjhand:[],mjdesc:[],baseWin:0 }	
		   ,{name:"", mjpeng:[],mjgang0:[],mjgang1:[],mjchi:[],mjhand:[],mjdesc:[],baseWin:0 }	
		];
		for(var i=0;i<tests.length;i++)
		{
			var pl=tests[i];
			if(!majiang.NumOK(pl))
			{
 				pl.mjdesc.push("牌数不对"); 
				pl.huType=-1;
		    }
			else pl.huType=majiang.canHu(pl.mjhand);
            if(pl.huType==0)
			{
				pl.mjdesc.push("不胡");
			}
			else if(pl.huType>0)
			{
				var is13=pl.huType==13;
				var allHand=majiang.OnlyHand(pl);
				var num2=pl.huType==7?1:0;	if(num2==1&&majiang.canGang1([],pl.mjhand).length>0) num2=2;
				var num3=(num2>0||is13)?0:majiang.All3(pl);
				var sameColor=is13?false:majiang.SameColor(pl);
				var baseWin=1;
				if(allHand) //门清
				{
					baseWin*=4;	pl.mjdesc.push("门清");
				} 
				if(sameColor)//清一色
				{ 
				   baseWin*=8;  pl.mjdesc.push("清一色");
				} 
				if(is13) 
				{	
				   baseWin*=24; pl.mjdesc.push("十三幺");
				}
				if(num2>0)
				{
					baseWin*=num2>1?16:8;  pl.mjdesc.push(num2>1?"龙七对":"七巧对");
				}
				if(num3>0)
				{
					baseWin*=num3>1?16:8;  pl.mjdesc.push(num3>1?"风一色":"大对碰");
				}
				if(pl.mjdesc.length==0) pl.mjdesc.push("平胡");
				pl.baseWin=baseWin;
			}
			console.info(pl.name+" "+pl.mjdesc+"  "+pl.baseWin);
		}
	}
	
	
	function DoTest()
	{
		//TestCardType();
		//TestRandomCards();
		//TestHu();
		//TestcanGang1();
		//TestChi();
		//console.info(majiang.canGang0([2,3,4,3,3],3));
		//console.info(majiang.canPeng([2,3,4,3,3],3));
		
	}
	
	if (typeof(cc.jsInstance) != "undefined")
	{
        cc.jsInstance.majiang=majiang;
	}
	else
	{
       module.exports = majiang;
	   DoTest();
	}







