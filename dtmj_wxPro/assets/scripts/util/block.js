cc.Class({
    extends: cc.Component,

    properties: {
        shaizi: {
            default: null,
            type: cc.Animation,
            serializable: true,
        },
        circle: {
            default: null,
            type: cc.Animation,
            serializable: true,
        },
        con: {
            default: null,
            type: cc.Node,
            serializable: true,
        },
    },
    onLoad() {
        cc.game.addPersistRootNode(this.node);
        cc.jsInstance.block = this;
        this.node.active = false;
        this.pos = this.node.getChildByName("shaizi").getPosition();
    },
    start() {
        this.shaizi.play('blockclip');
        this.circle.play('blockclip2');
    },
    show(text) {
        this.setActive(true, true, true);
        text = "";//暂时不要设置文字的
        if (text) {
            this.con.active = true;
            this.con.getComponent(cc.Label).string = text;
            this.node.getChildByName("shaizi").setPosition(this.pos);
        } else {
            this.con.active = false;
            this.node.getChildByName("shaizi").setPosition(0, 0);
        }
        this.node.active = true;
    },

    showBlank() {
        this.node.active = true;
        this.setActive(false, false, false);
    },

    setActive(bool, bool1, bool2) {
        this.node.getChildByName("bg").active = bool; //骰子灰色背景
        this.node.getChildByName("shaizi").active = bool1; //骰子
        this.con.active = bool2; //描述文字
    },

    settext(text) {
        this.con.getComponent(cc.Label).string = text;
    },
    hide() {
        this.node.active = false;
    },
    isActive() {
        return this.node.active;
    }
});