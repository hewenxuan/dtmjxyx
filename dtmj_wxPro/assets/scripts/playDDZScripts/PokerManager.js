//lew 管理斗地主相关玩法

var PokerManager = cc.Class({
	initPokerType: function (gameKind) {
		var sData = cc.jsInstance.data.sData;
	    var tData = sData.tData;
	    //根据玩法初始化poker算法
	    cc.log("游戏类型:"+gameKind);
	    if(!cc.jsInstance.pokerArr || cc.jsInstance.pokerArr.length == 0 || !cc.jsInstance.pokerArr[gameKind]){
	    	console.log("!!!!!!!!!!!!!!!!斗地主玩法初始化失败");
	    	return;
	    }

	    cc.jsInstance.poker = new cc.jsInstance.pokerArr[gameKind];
	   

	    cc.jsInstance.poker.cardTypes={};
	    //附加基础玩法
	    for(var cardType in cc.jsInstance.poker.baseTypes){
	        cc.jsInstance.poker.cardTypes[cardType] = cc.jsInstance.poker.baseTypes[cardType]
	        // cc.log("附加数据 cardType:"+cardType+" 类型:"+cc.jsInstance.poker.baseTypes[cardType]);
	    }

	    //附加特殊玩法
	    var otherTyps = cc.jsInstance.poker.otherTypes;
	    for(var cardType in otherTyps){
	        if((cardType == "bomb333"|| cardType == "threeCards") && tData.linfenDDZ_isBomb == false)
	            continue;
	        cc.jsInstance.poker.cardTypes[cardType] = otherTyps[cardType]
	        if(otherTyps[cardType]){
                cc.jsInstance.poker.cardTypes[cardType] = otherTyps[cardType]
            }else{
                delete cc.jsInstance.poker.cardTypes[cardType];
            }
	    }

	    
	},
});
PokerManager._instance = null;
PokerManager.getInstance = function () {
	if (!this._instance) {
		this._instance = new PokerManager();
	}
	return this._instance;
};