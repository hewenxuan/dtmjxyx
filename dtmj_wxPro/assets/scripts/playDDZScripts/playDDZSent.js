
//斗地主发送消息
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    //不叫
    dontCallRob:function(){
        cc.jsInstance.audioManager.playBtnClick();
        cc.jsInstance.network.tableMsgMJRob(0, -1);
    },

    //1分
    callOneSorceForRob:function(){
        cc.jsInstance.audioManager.playBtnClick();
        cc.jsInstance.network.tableMsgMJRob(1, 1);
    },

    //2分
    callTwoSorceForRob:function(){
        cc.jsInstance.audioManager.playBtnClick();
        cc.jsInstance.network.tableMsgMJRob(1, 2);
    },

    //3分
    callThreeSorceForRob:function(){
        cc.jsInstance.audioManager.playBtnClick();
        cc.jsInstance.network.tableMsgMJRob(1, 3);
    },

    putCardClick:function(){
        cc.jsInstance.audioManager.playBtnClick();
        var needPutCards = this.playDDZSelectPaiTool.getReadyCards();
        cc.logManager.info("needPutCards=========");
        this.tData = cc.jsInstance.data.sData.tData;
        if(this.tData.lastPut.length>0){
            var canPut = cc.jsInstance.Poker.comparePokers(needPutCards,this.tData.lastPut);
            if(canPut>0){
                cc.jsInstance.network.tableMsgMJPutDDZ(needPutCards);
            }else{
                this.playDDZSelectPaiTool.recoveryPai();
            }
        }else{
            var cardTypes = cc.jsInstance.Poker.getCardsType(needPutCards);
            if(cardTypes){
                cc.jsInstance.network.tableMsgMJPutDDZ(needPutCards);
            }else{
                this.playDDZSelectPaiTool.recoveryPai();
            }
        }
    },

    passClick:function(){
        cc.jsInstance.audioManager.playBtnClick();
        cc.jsInstance.network.tableMsgMJPassDDZ();
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.playDDZSelectPaiTool = this.getComponent('playDDZSelectPaiTool');
    },

    start () {
        
    },

    // update (dt) {},
});
