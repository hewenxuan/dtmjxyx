cc.Class({
    extends: cc.Component,
    properties: {
        anim_sps: {
            type: sp.Skeleton,
            default: [],
        },
    },

    onLoad() {
        this.initAnimNames();
    },

    initAnimNames() {
        if (!this.animName) {
            this.animName = {
                bomb: "zhadan",
                aircraft: "feiji",
                playStart: "kaiju",
                win: "shengli",
                jokerBomb: "huojian",
                doublestraights: "liandui",
                chuntian: "chuntian",
                shunzi: "shunzi",
            }
        }
    },

    //测试
    play_anim_test(e, custom, callback) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            return;
        }
        var anims = ["zhadan", "feiji", "kaiju", "huojian", "shengli", "liandui", "chuntian", "shunzi"];
        var num = Math.floor(Math.random() * anims.length); // 0-5
        custom = anims[num];
        custom = "zhadan";
        // cc.logManager.info("第" + num + "个动画 :" + anims[num]);
        this.playAnim(custom, cc.p(50, 480), cc.p(250, 420), callback); //-391 171  
    },

    playAnim(name, w_pos_start, w_pos_end, callback) {
        this.initAnimNames();
        // cc.logManager.info("name===", name);
        var sp = this.getAnim(name);
        if (!sp) {
            cc.logManager.warn("没有该动画");
            return;
        }
        if (w_pos_start) {
            sp.node.setPosition(w_pos_start.x, w_pos_start.y);
        } else {
            sp.node.setPosition(0, 0);
        }

        this.playAudioBg(name); //播放声音
        this.set_listener(sp, callback);
        sp.node.active = true;
        if (sp.name.indexOf(this.animName.aircraft) != -1) { //飞机需要移动动画
            sp.node.x = cc.winSize.width / 2;
            var mto = cc.moveTo(1.5, cc.p(-1 * (cc.winSize.width * 3 / 4), 0));
            sp.node.runAction(mto);
        }
        sp.clearTrack(0); // 指定管道的索引
        if (sp.name.indexOf(this.animName.bomb) != -1) { //炸弹需要从某个人头像出发扔出去

            if (!w_pos_end) {
                sp.setAnimation(0, "animation", false);
                return;
            }
            var start = cc.callFunc(function() {
                // cc.logManager.info("初始位置=", sp.node.getPosition());
                sp.setAnimation(0, "animation1", true);
            }, this);
            var mto = cc.moveTo(0.5, w_pos_end.x, w_pos_end.y).easing(cc.easeSineIn());
            var finish = cc.callFunc(function() {
                cc.logManager.info("播放爆炸动画");
                // cc.logManager.info("结束位置=", sp.node.getPosition());
                sp.setAnimation(0, "animation", false);
            }, this);
            var seq = cc.sequence(start, mto, finish);
            sp.node.runAction(seq);
        } else {
            sp.setAnimation(0, "animation", false); // 把管道清空，加入当前这个，
        }
    },

    playAnimDDZForStart() {
        this.initAnimNames();
        this.playAnim(this.animName.playStart, cc.p(0, 0), function() {});
    },

    //动画播放位置，传个世界坐标，需要设置位置的动画（炸弹 ，连队 ，顺子 【自己播放动画位置都默认 cc.p(0, 0) 】） 收到别人的这个三种牌型播放动画需要位置 ，
    //不需要改位置的可以不传，或者传false 或者传  cc.p(0, 0)  都行
    //传位置的话，用斗地主界面的左右两边的倒计时的位置应该就可以  w_pos_start  开始位置  w_pos_end 结束位置

    playAnimDDZForPlaying(name, w_pos_start, w_pos_end) {
        this.initAnimNames();
        var anmiName = "";
        var typeStr = name.split("_")[0];
        if (name.split("aircraft").length > 1) {
            typeStr = "aircraft";
        }
        switch (typeStr) {
            case "aircraft":
                anmiName = this.animName.aircraft;
                break;
            case "bomb":
                anmiName = this.animName.bomb;
                break;
            case "doublestraights":
                anmiName = this.animName.doublestraights;
                break;
            case "jokerBomb":
                anmiName = this.animName.jokerBomb;
                break;
            case "straights":
                anmiName = this.animName.shunzi;
                break;
        }
        if (!w_pos_start) {
            w_pos_start = false;
        }
        if (anmiName != "") {
            this.playAnim(anmiName, w_pos_start, w_pos_end, null);
        }
    },

    playAnimDDZForWin() {
        this.initAnimNames();
        this.playAnim(this.animName.win);
    },

    playAudioBg(name) {
        switch (name) {
            case "zhadan":
                cc.jsInstance.audioManager.playSFXForDDZ("zhadan");
                break;
            case "feiji":
                cc.jsInstance.audioManager.playSFXForDDZ("feiji");
                break;
            case "kaiju":
                break;
            case "huojian":
                cc.jsInstance.audioManager.playSFXForDDZ("huojian");
                break;
            case "chuntian":
                cc.jsInstance.audioManager.playSFXForDDZ("chuntian");
                break;
            case "shunzi":
                cc.jsInstance.audioManager.playSFXForDDZ("shunzi");
                break;
            case "liandui":
                cc.jsInstance.audioManager.playSFXForDDZ("shunzi");
                break;
        }
    },

    getAnim(name) {
        if (!this.anim_sps || this.anim_sps.length <= 0) {
            return false;
        }
        for (var i = 0; i < this.anim_sps.length; i++) {
            if (this.anim_sps[i].name.indexOf(name) != -1) {
                cc.logManager.info("找到动画节点");
                return this.anim_sps[i];
            }
        }
        return false;
    },

    set_listener(sp, callback) {
        sp.setStartListener(function() {});
        sp.setEndListener(function() {});
        sp.setCompleteListener(function() {
            // cc.logManager.info("play once");
            sp.node.active = false;
            if (callback) {
                callback();
            }
        });
    },
    start() {},
    // update (dt) {},
});