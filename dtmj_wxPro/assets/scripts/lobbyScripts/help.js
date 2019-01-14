cc.Class({
	extends: cc.Component,
	properties: {
		scrollView: {
			default: null,
			type: cc.ScrollView,
		},
		helps_parent: {
			default: null,
			type: cc.Node,
			serializable: true,
		},
		texts_parent: {
			default: null,
			type: cc.Node,
		},
	},

	//选择点击玩法
	clickChoose(e, custom) {
		if (!this.node.active) {
			this.node.active = true;
		}
		cc.jsInstance.audioManager.playBtnClick();
		var self = this;
		cc.logManager.info("click:" + custom);
		//对服务端下发的字段进行转化
		switch (custom) {
			case "tuidaohu":
				custom = "tdh";
				break;
			case "tuidaohu2":
				custom = "tdh2";
				break;
			case "guaisanjiao":
				custom = "gsj";
				break;
			case "kouDian":
				custom = "kd";
				break;
		}
		if (this.chooseWanfa === custom) {
			return;
		}
		self.chooseHelpWanfa(custom);
	},

	chooseHelpWanfa(name) {
		var self = this;
		if (self.helps_parent.childrenCount > 1) {
			for (var i = 0; i < self.helps_parent.childrenCount; i++) {
				if (self.helps_parent.children[i].name === name) {
					self.helps_parent.children[i].getChildByName("chose").active = true;
					this.chooseWanfa = name;
					self.texts_parent.children[i].active = true;
					self.scrollView.scrollToTop(0);
				} else {
					self.texts_parent.children[i].active = false;
					self.helps_parent.children[i].getChildByName("chose").active = false;
				}
			}
		}
	},

	closeHelpWanfa() {
		this.node.active = false;
		cc.jsInstance.audioManager.playBtnClick();
	},

	showHelpWanfa(custom) {
		this.node.active = true;
		cc.jsInstance.native.setScaleAction(this.node.getChildByName("bg"));
		if (custom) {
			this.clickChoose("", custom);
		}
	},

	getNode() {
		return this.node;
	},
	getActive() {
		return this.node.active;
	},

	onLoad() {
		cc.game.addPersistRootNode(this.node);
		cc.jsInstance.playHelp = this;
		var names = ["tdh", "tdh2", "gsj", "kd", "jdddz"];
		for (var i = 0; i < names.length; i++) { //先点一遍，要不然会卡
			this.chooseHelpWanfa(names[i]);
		}
		this.chooseWanfa = "tdh"
		this.chooseHelpWanfa("tdh");
		this.node.active = false;
	},


});