cc.Class({
	extends: cc.Component,
	properties: {},
	showMask: function(e, custom) {
		var self = this;
		cc.logManager.info("showMask:" + custom);
		cc.jsInstance.audioManager.playBtnClick();
		switch (custom) {
			case "playLog": //战绩
				this.node.parent.getChildByName("listLogs").active = true;
				cc.jsInstance.native.setScaleAction(this.node.parent.getChildByName("listLogs"));
				this.node.parent.getChildByName("listLogs").getComponent("listLogs").getPlaylog();
				return;
			case "settingMask": //设置
				this.settingMask = this.node.parent.getChildByName("settingMask");
				this.settingMask.active = true;
				cc.jsInstance.native.setScaleAction(this.settingMask.getChildByName("surfaceLayer"));
				return;
			case "userInfoMask": //个人信息
				this.userInfoMask = this.node.parent.getChildByName("userInfoMask");
				this.userInfoMask.active = true;
				cc.jsInstance.native.setScaleAction(this.userInfoMask.getChildByName("commonUserInfoBg"));
				this.userInfoMask.getComponent("userInfoMask").setUserInfo();
				return;
			case "rechargeMask": //充值
				this.rechargeMask = this.node.parent.getChildByName("rechargeMask");
				this.rechargeMask.getComponent("rechargeMask").initData(false); //是不是亲友圈页面弹出的
				cc.jsInstance.native.setScaleAction(this.rechargeMask);
				return;
			case "faceback": //反馈
				this.faceback = this.node.parent.getChildByName("faceback");
				this.faceback.active = true;
				cc.jsInstance.native.setScaleAction(this.faceback);
				return;
			case "message": //消息
				this.message = this.node.parent.getChildByName("message");
				this.message.active = true;
				cc.jsInstance.native.setScaleAction(this.message);
				this.message.getComponent("message").setmsg();
				return;
			case "help": //玩法帮助
				cc.jsInstance.playHelp.showHelpWanfa();
				return;
			case "inviFrend": //邀请好友
				this.inviFrend = this.node.parent.getChildByName("InviFrend");
				this.inviFrend.active = true;
				cc.jsInstance.native.setScaleAction(this.inviFrend);
				return;
			case "moregame": //更多游戏
				this.moregame = this.node.parent.getChildByName("moregame");
				this.moregame.active = true;
				cc.jsInstance.native.setScaleAction(this.moregame);
				return;
			case "shop": //商店
				// this.shop = this.node.parent.getChildByName("shop");
				// this.shop.active = true;
				return;
			case "houseBuild": //房主建房
				// this.houseBuild = this.node.parent.getChildByName("houseBuild");
				// this.houseBuild.active = true;
				// cc.jsInstance.native.setScaleAction(this.houseBuild);
				// cc.jsInstance.msgpop.showMsg_text_close_nocancle("优化中！！！", function() {
				// 	cc.jsInstance.audioManager.playBtnClick();
				// });
				return;
		}
	},

	onLoad() {

	},
	start() {

	},

});