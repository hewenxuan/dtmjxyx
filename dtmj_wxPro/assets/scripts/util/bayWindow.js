cc.Class({
    extends: cc.Component,

    properties: {
        con: {
            default: null,
            type: cc.Prefab
        }
    },
    onLoad() {
        cc.game.addPersistRootNode(this.node);
        cc.jsInstance.bayWindow = this;
        this.node.active = false;
        this.pos = this.node.getPosition();
    },
    openBayWindow(text) {
        var self = this;
        if (!text) {
            return;
        }
        let con = cc.instantiate(this.con);
        //写了一个连击效果
        con.parent = this.node.parent;
        if (con.getChildByName("con").isValid === true) { //socket 是网络的异步回调。收到回调时，操作的节点有可能已经被销毁了（比如场景已经切换了）销毁后就会有这类报错。你可以判断一下当前节点是否可用，或者用 node.isValid 进行二次验证
            con.getChildByName("con").getComponent(cc.Label).string = text;
        } else {
            cc.logManager.error("飘窗节点状态异常---销毁预制体--");
            con.destroy();
            return;
        }
        // con.getChildByName("con").getComponent(cc.Label).string = text;
        con.setPosition(this.pos);
        let action0 = cc.rotateTo(0.5, 0); //一秒旋转0 ，静止一秒
        let action1 = cc.moveBy(1.5, 0, 100);
        let action2 = cc.fadeOut(1.5);
        let action3 = cc.spawn(action1, action2); //1.5秒y移动100并且渐变出去
        let finish = cc.callFunc(function() {
            con.destroy();
        }, this);
        this.action = cc.sequence(action0, action3, finish);
        con.stopAllActions();
        con.runAction(this.action);
    },


    getNode() {
        return this.node;
    },

});