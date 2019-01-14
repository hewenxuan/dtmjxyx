/**
 * 1.initPoker() 初始化牌  
 * 2.getReadyCards()  获取抬起来的牌
 * 3.putpai()  打牌
 * 4.getCardNodes() 获取所有牌的节点数组
 * 5.recoveryPai() 如果打的拍不符合规则，所有牌都下去
 **/

const CardNodeState = {
    choose: 1,
    nochoose: 0,
    put: -1,
};
const CardNodeColor = {
    normal: "#FFFFFF",
    checked: "#808080",
};

cc.Class({
    extends: cc.Component,
    properties: {
        //获取myself 下的poker节点
        myself: {
            type: cc.Node,
            default: null,
        },
    },

    onLoad() {
        this.taipaiHeight = 30;
        this.AllCardState = []; //所有牌的状态
        this.cardNodes = this.myself.getChildByName("poker");
        for (let i = 0; i < this.cardNodes.childrenCount; i++) {
            let node = this.cardNodes.children[i];
            this.pos_y = node.y;
            this.pos_y_choose = node.y + this.taipaiHeight;
            this.setState(node, CardNodeState.nochoose);
            this.setTouchEvent(node);
            this.AllCardState.push(CardNodeState.nochoose);
        }
        this.synNode = []; //拖动一起选中的牌
        this.istouthPai = false;
    },

    setTouchEvent: function(node) {
        node.on(cc.Node.EventType.TOUCH_START, (event) => {
            cc.jsInstance.audioManager.playSFXForDDZ("xuanpai");
            this.startpos_x = node.x;
            this.istouthPai = true;
            this.endpos_x = this.startpos_x;
            this.isboxbom();
        });

        node.on(cc.Node.EventType.TOUCH_MOVE, function(t) {
            node.color = cc.hexToColor(CardNodeColor.checked)
            if (this.istouthPai) {
                this.isboxbom();
            }

            if (this.cardNodes.getBoundingBoxToWorld().contains(t.getLocation())) {
                var w_pos = t.getLocation();
                var pos = this.cardNodes.convertToNodeSpaceAR(w_pos); //转换成节点（锚点为原点）坐标
                this.endpos_x = pos.x;
                this.istouthPai = true;
            } else {
                this.istouthPai = false;
            }
        }, this);
        node.on(cc.Node.EventType.TOUCH_END, function(t) {
            // console.log("---------TOUCH_END-------", t.currentTarget.name);
            this.setPosition();
            this.istouthPai = false;
        }, this);
        node.on(cc.Node.EventType.TOUCH_CANCEL, function(t) {
            // console.log("---------TOUCH_CANCEL-------", t.currentTarget.name);
            this.setPosition();
            this.istouthPai = false;
        }, this);
    },

    isboxbom() {
        if (this.endpos_x > this.startpos_x) { //右边
            for (let i = 0; i < this.cardNodes.childrenCount; i++) {
                let nownode = this.cardNodes.children[i];
                if (nownode.x + 53 > this.startpos_x && nownode.x <= this.endpos_x) {
                    this.setNodeColorChecked(nownode);
                } else {
                     //手指往右滑动
                    this.setNodeColorNormal(nownode)
                }
            }
        }else { //左边
            for (let i = 0; i < this.cardNodes.childrenCount; i++) {
                let nownode = this.cardNodes.children[i];
                if (nownode.x <= this.startpos_x && nownode.x + 53 > this.endpos_x) {
                    this.setNodeColorChecked(nownode);
                } else {
                    //手指往右滑动
                    this.setNodeColorNormal(nownode);
                }
            }
        }
    },

    setNodeColorNormal:function(nownode){
        for (let j = 0; j < this.synNode.length; j++) {
            if (this.synNode[j] === nownode) {
                nownode.color = cc.hexToColor(CardNodeColor.normal);
                this.synNode.splice(j, 1);
                break;
            }
        }
    },

    setNodeColorChecked:function(nownode){
        nownode.color = cc.hexToColor(CardNodeColor.checked);
        var isBreak = false;
        for (let j = 0; j < this.synNode.length; j++) {
            if (this.synNode[j] === nownode) {
                isBreak = true;
                break;
            }
        }
        if(!isBreak){
            this.synNode.push(nownode);
        }
    },

    setState: function(node, state) {
        if (node.state === state) {
            return;
        }
        switch (state) {
            case CardNodeState.choose:
                break;
            case CardNodeState.nochoose:
                break;
            case CardNodeState.put:
                break;
            default:
                break;
        }
        node.state = state;
    },

    setPosition() {
        for (let j = 0; j < this.synNode.length; j++) {
            var nownode = this.synNode[j];
            if (nownode.state === CardNodeState.choose) {
                this.setState(nownode, CardNodeState.nochoose);
            } else if (nownode.state === CardNodeState.nochoose) {
                this.setState(nownode, CardNodeState.choose);
            }
        }
        this.synNode = [];
        for (let i = 0; i < this.cardNodes.childrenCount; i++) {
            let node = this.cardNodes.children[i];
            node.color = cc.hexToColor(CardNodeColor.normal);
            this.AllCardState[i] = node.state;
            if (node.state === CardNodeState.choose) {
                node.y = this.pos_y_choose;
            } else if (node.state === CardNodeState.nochoose) {
                node.y = this.pos_y;
            }
        }
    },

    //获取所有牌的状态
    getReadyCards() {
        var ReadyCards = [];
        var cards = cc.jsInstance.players[0].mjhand;
        if (cc.jsInstance.players && cc.jsInstance.players[0] && cc.jsInstance.players[0].mjhand) {
            for (let i = 0; i < this.cardNodes.childrenCount; i++) {
                let node = this.cardNodes.children[i];
                if (node.y === this.pos_y_choose && node.active) {
                    ReadyCards.push(cards[parseInt(node.name.split("card")[1])]);
                }
            }
        }
        return ReadyCards;
    },

    setTipPaiNodesPos(indexs) {
        for (let i = 0; i < this.cardNodes.childrenCount; i++) {
            let node = this.cardNodes.children[i];
            if (indexs.indexOf(this.cardNodes.childrenCount - i - 1) >= 0) { //存在
                node.y = this.pos_y_choose;
                this.setState(node, CardNodeState.choose);
                this.AllCardState[i] = CardNodeState.choose;
            } else {
                node.y = this.pos_y;
                this.setState(node, CardNodeState.nochoose);
                this.AllCardState[i] = CardNodeState.nochoose;
            }
        }
    },

    receivePutPaiNotice(data) {
        console.log("牌的状态全部重置下");
        this.putpai();
    },

    //获取所有的牌的节点数组
    getCardNodes() {
        return this.cardNodes;
    },

    //如果打的拍不符合规则，所有牌都下去
    recoveryPai() {
        this.synNode = []; //拖动一起选中的牌
        this.istouthPai = false;
        for (let i = 0; i < this.cardNodes.childrenCount; i++) {
            let node = this.cardNodes.children[i];
            if (node.y === this.pos_y_choose) { //上去的牌都下去
                node.y = this.pos_y;
                this.setState(node, CardNodeState.nochoose);
                this.AllCardState[i] = CardNodeState.nochoose;
            }
        }
        // console.log("recoveryPai----this.AllCardState===", this.AllCardState);
    },

    putpai() {
        for (let i = 0; i < this.cardNodes.childrenCount; i++) {
            let node = this.cardNodes.children[i];
            node.y = this.pos_y; //所有的牌都下来
            if (node.active === true) {
                this.AllCardState[i] = CardNodeState.nochoose;
                this.setState(node, CardNodeState.nochoose);
            } else {
                this.AllCardState[i] = CardNodeState.put;
                this.setState(node, CardNodeState.put);
            }
        }
        // console.log("putpai----this.AllCardState===", this.AllCardState);
    },

    //初始化手牌
    initPoker() {
        this.AllCardState = [];
        this.synNode = []; //拖动一起选中的牌
        this.istouthPai = false;
        for (let i = 0; i < this.cardNodes.childrenCount; i++) {
            let node = this.cardNodes.children[i];
            this.pos_y = node.y;
            this.pos_y_choose = node.y + this.taipaiHeight;
            this.setState(node, CardNodeState.nochoose);
            this.AllCardState.push(CardNodeState.nochoose);
        }
    },
});