const DeskState = {
    choose: 1,
    nochoose: 0,
};

const NodeColor = {
    normal: "#86B9A1",
    checked: "#F0F98B",
    while: "#ffffff",
    gray: "#5C5C5C"
};


cc.Class({
    extends: cc.Component,

    properties: {
        creatRoomMask: {
            type: cc.Node,
            default: null,
        },
        content: { //桌子父节点
            type: cc.Node,
            default: null,
        },
        queding: {
            type: cc.Button,
            default: null,
        },
        queding_bg: {
            type: cc.Sprite,
            default: null,
        },
        queding_hong: {
            type: cc.SpriteFrame,
            default: null,
        },
         queding_hui: {
            type: cc.SpriteFrame,
            default: null,
        },
    },



    onLoad() {
        this.setTouchEvent(this.content);
    },

    initData(data) {
        this.clubroom = data;
        this.node.active = true;
        this.init();
        var tables = data.tables;
        var club_home_item;
        for (var i = 0; i < tables.length; i++) {
            club_home_item = tables[i].getComponent("club_home_item");
            this.content.children[i].active = true;
            this.content.children[i].getChildByName("wanfaName").getComponent(cc.Label).string = club_home_item.xiugai.getChildByName("wanfaName").getComponent(cc.Label).string;
        }

    },

    init() {
        this.AllDeskState = []; //所有桌子的状态
        this.chooseDesks = []; //选中的桌子
        for (let i = 0; i < this.content.childrenCount; i++) {
            let node = this.content.children[i];
            this.setState(node, DeskState.nochoose);
            this.AllDeskState.push(DeskState.nochoose);
            node.active = false;
        }
        this.isShowQueding_create(false);
    },

    setState: function(node, state) {
        if (node.state === state) {
            return;
        }
        switch (state) {
            case DeskState.choose:
                node.getChildByName("nochoose").active = false;
                node.getChildByName("desk").color = cc.hexToColor(NodeColor.checked);
                node.getChildByName("wanfaName").color = cc.hexToColor(NodeColor.checked);
                break;
            case DeskState.nochoose:
                node.getChildByName("nochoose").active = true;
                node.getChildByName("desk").color = cc.hexToColor(NodeColor.normal);
                node.getChildByName("wanfaName").color = cc.hexToColor(NodeColor.normal);
                break;
        }
        node.state = state;
    },
    setTouchEvent: function(node) {
        var self = this;
        node.on(cc.Node.EventType.TOUCH_START, (t) => {
            var w_pos = t.getLocation();
            this.istouthPai = true;
            if (this.istouthPai) {
                this.isboxbom(w_pos, true);
            }
        });
        node.on(cc.Node.EventType.TOUCH_MOVE, function(t) {
            if (this.content.getBoundingBoxToWorld().contains(t.getLocation())) {
                var w_pos = t.getLocation();
                this.istouthPai = true;
                if (this.istouthPai) {
                    this.isboxbom(w_pos, false);
                }
            } else {
                this.istouthPai = false;
            }
        }, this);
        node.on(cc.Node.EventType.TOUCH_END, function(t) {
            this.istouthPai = false;

        }, this);
        node.on(cc.Node.EventType.TOUCH_CANCEL, function(t) {
            this.istouthPai = false;
        }, this);
    },

    isboxbom(pos, start) {
        for (let i = 0; i < this.content.childrenCount; i++) {
            var node = this.content.children[i];
            if (node.getBoundingBoxToWorld().contains(pos)) { //
                if (this.tempNode && this.tempNode === node && !start) {//如果一直在一个node移动 return
                    return;
                }
                if (!node.active) {//节点隐藏不处理
                    return;
                }
                if (node.state === DeskState.nochoose) {
                    this.setState(node, DeskState.choose);
                    this.AllDeskState[i] = DeskState.choose;
                } else {
                    this.setState(node, DeskState.nochoose);
                    this.AllDeskState[i] = DeskState.nochoose;
                }
                this.tempNode = node;//保存当前临时节点

                this.chooseDesks = []; //找出当前选中的桌子
                for (var i = 0; i < this.AllDeskState.length; i++) {
                    if (this.AllDeskState[i] === DeskState.choose) {
                        this.chooseDesks.push(i + 1);
                    }
                }
                if (this.chooseDesks.length > 0) {
                    this.isShowQueding_create(true);
                } else {
                    this.isShowQueding_create(false);
                }
                return;
            }
        }



    },

    //确定按钮是否可用
    isShowQueding_create(isEnadle) {
        this.isEnableButton(this.queding, isEnadle);
    },


    isEnableButton(bt, isEnadle) {
        bt.isShow = isEnadle; //保存当前按钮是否可用的状态 
        bt.interactable = isEnadle; //按钮事件是否被响应，如果为 false，则按钮将被禁用。
        bt.enableAutoGrayEffect = !isEnadle; //如果这个标记为 true，当 button 的 interactable 属性为 false 的时候，会使用内置 shader 让 button 的 target 节点的 sprite 组件变灰
        if (isEnadle) {
            this.queding_bg.spriteFrame=this.queding_hong;
        } else {
             this.queding_bg.spriteFrame=this.queding_hui;
        }
    },

    btn_click() {
        console.log("this.AllDeskState=", this.AllDeskState);
        console.log("this.chooseDesks=", this.chooseDesks);
        this.creatRoomMask.active = true;
        this.creatRoomMask.getComponent("createRoomMask").isClub_In(true, true);
        this.clubroom.setPiliangwanfa(this.chooseDesks);
        this.node.active = false;
    },

    close_click() {
        this.node.active = false;
    },


    start() {

    },

});