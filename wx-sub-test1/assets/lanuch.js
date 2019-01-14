cc.Class({
    extends: cc.Component,

    properties: {
        display: cc.Node,
        rank_item: {
            type: cc.Prefab,
            default: null,
        },
        content: {
            type: cc.Node,
            default: null,
        },
    },

    onLoad() {
        this.display.active = false;
    },
    start() {
        var self = this;
        wx.onMessage(data => {
            switch (data.message) {
                case 'Show':
                    this._show();
                    break;
                case 'Hide':
                    this._hide();
                    break;
            }
        });



        //取出所有好友数据
        wx.getFriendCloudStorage({
            keyList: ["score"],
            success: res => {
                console.log("取出所有好友数据成功====" + JSON.stringify(res));
                self.setdata(res);

            },
            fail: res => {
                console.log("取出所有好友数据失败====", res);
            },
        });
    },

    _show() {
        // let moveTo = cc.moveTo(0.5, 0, 73);
        // this.display.runAction(moveTo);
        this.display.active = true;
    },

    _hide() {
        // let moveTo = cc.moveTo(0.5, 0, 1000);
        // this.display.runAction(moveTo);\
        this.display.active = false;
    },

    hide() {
        this.display.active = false;
    },
    setdata(res) {
        var self = this;
        var data = res.data;
        if (data && data.length > 0) {
            // self.content.removeAllChildren(); //移除之前的数据
            for (var i = 0; i < data.length; i++) {
                var rank_item = cc.instantiate(self.rank_item);
                rank_item.getChildByName("rank").getComponent(cc.Label).string = "第" + (i + 1) + "名";
                rank_item.getChildByName("name").getComponent(cc.Label).string = data[i].nickname;
                rank_item.getChildByName("score").getComponent(cc.Label).string = data[i].KVDataList[0].value;

                cc.loader.load({
                    url: data[i].avatarUrl,
                    type: 'png'
                }, function(err, ret) {
                    if (err) {
                        console.log("设置图片失败----------------" + err);
                        return;
                    }
                    console.log("获取图片成功---------------------：");



                    var spriteFrame = new cc.SpriteFrame(ret, cc.Rect(0, 0, ret.width, ret.height));
                    rank_item.getChildByName("img").getComponent(cc.Sprite).spriteFrame = spriteFrame;




                    // var head_node = rank_item.getChildByName("img").getComponent(cc.Sprite);
                    // // ret.width = 64;
                    // // ret.height = 64;
                    // head_node.getComponent(cc.Sprite).spriteFrame.clearTexture();
                    // head_node.getComponent(cc.Sprite).spriteFrame.setTexture(ret);
                }.bind(self));
                self.content.addChild(rank_item);
            }
        }

    },
});