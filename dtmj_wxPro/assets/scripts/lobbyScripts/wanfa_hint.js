cc.Class({
    extends: cc.Component,
    properties: {

    },

    onLoad() {
        this.con_bg = this.node.getChildByName("con_bg");
        this.con_bg.active = false;
        this.node.on(cc.Node.EventType.TOUCH_START, function(t) {
            // cc.logManager.info("cc.Node.EventType.TOUCH_START called");
            // t.stopPropagationImmediate();//立即停止当前事件的传递，事件甚至不会被分派到所连接的当前目标
            this.con_bg.active = true;
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, function(t) {
            // cc.logManager.info("cc.Node.EventType.TOUCH_END called");
            this.con_bg.active = false;
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function(t) {
            // cc.logManager.info("cc.Node.EventType.TOUCH_CANCEL called");
            this.con_bg.active = false;
        }, this);

    },

    start() {

    },

    // update (dt) {},
});