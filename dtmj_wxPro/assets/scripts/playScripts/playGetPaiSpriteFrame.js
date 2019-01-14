
/**
 * 负责给牌桌内的麻将返回相应的纹理
 */
cc.Class({
    extends: cc.Component,

    properties: {
        left_atlas: {
            default: null,        
            type: cc.SpriteAtlas, 
        },

        right_atlas: {
            default: null,        
            type: cc.SpriteAtlas, 
        },

        bottom_atlas: {
            default: null,        
            type: cc.SpriteAtlas, 
        },

        my_atlas: {
            default: null,        
            type: cc.SpriteAtlas, 
        },

        empty_atlas:{
            default: null,       
            type: cc.SpriteAtlas, 
        },
    },

    //根据数字加载相应的麻将牌
    getMJSpriteFrame:function(num,type){
        var tempStr;
        if(num === 0){
            //听了
            switch(type){
                case "B":
                tempStr = "e_mj_b_bottom";
                break;
                case "R":
                tempStr = "e_mj_b_right";
                break;
                case "L":
                tempStr = "e_mj_b_left";
                break;
            }
            return this.loadMJPaiResource(tempStr,"e");
        }else{
            if(num<10){
                //条
                tempStr = "_bamboo_" + num;
            }else if( num < 20 && num > 10){
                //万
                tempStr = "_character_" + (num - 10);
            }else if( num < 30 && num > 20){
                //筒
                tempStr = "_dot_" + (num-20);
            }else if(num === 31){
                //东
                tempStr = "_wind_east";
            }else if(num === 41){
                //西
                tempStr = "_wind_west";
            }else if(num === 51){
                //南
                tempStr = "_wind_south";
            }else if(num === 61){
                //北
                tempStr = "_wind_north";
            }else if(num === 71){
                //中
                tempStr = "_red";
            }else if(num === 81){
                //发
                tempStr = "_green";
            }else if(num === 91){
                //白
                tempStr = "_white";
            }else{
                console.log("the num is over Range,please check carefully！");
            }
            return this.loadMJPaiResource(type + tempStr,type);
        }
    },

    //从图集中拿到相应的图
    loadMJPaiResource:function(resName,type){
        if(type === "M"){
            return this.my_atlas.getSpriteFrame(resName);
        }else if(type === "B"){
            return this.bottom_atlas.getSpriteFrame(resName);
        }else if(type === "R"){
            return this.right_atlas.getSpriteFrame(resName);
        }else if(type === "L"){
            return this.left_atlas.getSpriteFrame(resName);
        }else if(type === "e"){
            return this.empty_atlas.getSpriteFrame(resName);
        }
    },

    // update (dt) {},
});
