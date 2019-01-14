//提供扑克牌图片的类
cc.Class({
    extends: cc.Component,

    properties: {
        hongtao_tlas:{
            default: null,        
            type: cc.SpriteAtlas, 
        },

        meihua_tlas:{
            default: null,        
            type: cc.SpriteAtlas, 
        },

        fangkuai_tlas:{
            default: null,        
            type: cc.SpriteAtlas, 
        },

        heitao_tlas:{
            default: null,        
            type: cc.SpriteAtlas, 
        },

        dawang:{
            type:cc.SpriteFrame,
            default:null,
        },

        xiaowang:{
            type:cc.SpriteFrame,
            default:null,
        },

        hongtaosmall_tlas:{
            default: null,        
            type: cc.SpriteAtlas, 
        },

        meihuasmall_tlas:{
            default: null,        
            type: cc.SpriteAtlas, 
        },

        fangkuaismall_tlas:{
            default: null,        
            type: cc.SpriteAtlas, 
        },

        heitaosmall_tlas:{
            default: null,        
            type: cc.SpriteAtlas, 
        },

        dawang_small:{
            type:cc.SpriteFrame,
            default:null,
        },

        xiaowang_small:{
            type:cc.SpriteFrame,
            default:null,
        },

        boxsbackCard:{
            type:cc.SpriteFrame,
            default:null,
        }
    },

    getPockerSpriteFrame:function(num){
        var cardNum = "Card_"+num;
        if(num > 102&&num < 116){
            //方块 ♦ ️
            return this.fangkuai_tlas.getSpriteFrame(cardNum);
        }else if(num > 202&&num < 216){
            //梅花 ♣️
            return this.meihua_tlas.getSpriteFrame(cardNum);
        }else if(num > 302&&num < 316){
            //红桃 ♥ ️
            return this.hongtao_tlas.getSpriteFrame(cardNum);
        }else if(num > 402&&num < 416){
            //黑桃 ♠️
            return this.heitao_tlas.getSpriteFrame(cardNum);
        }else if(num === 550){
            //小王 
            return this.xiaowang;
        }else if(num === 555){
            //大王 
            return this.dawang;
        }
    },

    getSmallPockerSpriteFrame:function(num){
        var cardNum = "Card_"+num;
        if(num > 102&&num < 116){
            //方块 ♦ ️
            return this.fangkuaismall_tlas.getSpriteFrame(cardNum);
        }else if(num > 202&&num < 216){
            //梅花 ♣️
            return this.meihuasmall_tlas.getSpriteFrame(cardNum);
        }else if(num > 302&&num < 316){
            //红桃 ♥ ️
            return this.hongtaosmall_tlas.getSpriteFrame(cardNum);
        }else if(num > 402&&num < 416){
            //黑桃 ♠️
            return this.heitaosmall_tlas.getSpriteFrame(cardNum);
        }else if(num === 550){
            //小王 
            return this.xiaowang_small;
        }else if(num === 555){
            //大王 
            return this.dawang_small;
        }else if(num === 0){
            //牌背
            return this.boxsbackCard;
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
