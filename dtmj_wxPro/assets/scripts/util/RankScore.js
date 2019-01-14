cc.Class({
    extends: cc.Component,

    properties: {
        display: cc.Sprite
    },
    onLoad() {

        let kvdata = [{key: "score",value: "1000"}]; 
        wx.setUserCloudStorage({ 
            KVDataList: kvdata,
              success: res => {
                cc.logManager.info("设置用户数据成功==========", res);  
            },
            fail: res => { 
                cc.logManager.error("设置用户数据失败============", res);
            }
        })
    },
    start() {
        // this._isShow = false;
        this.tex = new cc.Texture2D();
    },

    onClick() {
        // this._isShow = !this._isShow;
        // 发消息给子域
        wx.postMessage({
            // message: this._isShow ? 'Show' : 'Hide'
             message: 'Show' 
        })
    },

    _updaetSubDomainCanvas() {
        if (!this.tex) {
            return;
        }
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
    },

    update() {
        this._updaetSubDomainCanvas();
    }

});