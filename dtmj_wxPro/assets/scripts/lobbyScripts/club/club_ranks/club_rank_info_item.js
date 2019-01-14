var Color = {
	WHITE: "#ffffff",
	GRAY: "#7C809D",
	BLUE: "#1664C3",
	RED: "#FE0707", //
	REDAGREE: "#7E0C00", //
};
cc.Class({
	extends: cc.Component,

	properties: {
		//时间
		time: {
			type: cc.Label,
			default: null,
		},
		//房间号
		houseid: {
			type: cc.Label,
			default: null,
		},
		//房主
		fangzhu: {
			type: cc.Label,
			default: null,
		},
		//玩法
		wanfa: {
			type: cc.Label,
			default: null,
		},
		//局数
		jushu: {
			type: cc.Label,
			default: null,
		},
		//得分
		defen: {
			type: cc.Label,
			default: null,
		},
		//雀神人数
		queshenNum: {
			type: cc.Label,
			default: null,
		},
		//雀神
		queshen: {
			type: cc.Node,
			default: null,
		},
	},

	onLoad() {

	},

	// {
	// 	"tableid": "42572991",
	// 	"now": "2018-09-28 16:36:17",
	// 	"ownerid": 10000133,
	// 	"ownername": "dksv38",
	// 	"gamename": "happyDDZ",
	// 	"score": 6,
	// 	"finch": 1, //雀神
	// 	"finchtotal": 2,
	// 	"round": 8,
	// 	"isCircle": "false"
	// }
	//数据表绑定到ui上 
	initData(data) {
		// cc.logManager.info("绑定数据到ui上=", data);
		var times = data.now.split(" ")[1];
		this.time.string = times.split(":")[0] + ":" + times.split(":")[1]; //"10:25"
		this.houseid.string = data.tableid;
		this.fangzhu.string = unescape(data.ownername).substr(0, 5);
		this.setWanfaName(this.wanfa, data.gamename);
		if (data.isCircle && data.isCircle === "true") {
			this.jushu.string = data.round + "圈";
		} else {
			this.jushu.string = data.round + "局";
		}
		this.setScore(this.defen.node, data.score);
		if (data.finch === 0) {
			this.queshenNum.node.active = false;
			this.queshen.active = false;
		} else {
			this.queshen.active = true;
			this.queshenNum.node.active = true;
			this.queshenNum.string = data.finch;
		}

		// this.time.string = "10:25";
		// this.houseid.string = "123465";
		// this.fangzhu.string = "文轩";
		// this.wanfa.string = "经典斗地主";
		// this.jushu.string = "16局";
		// this.defen.string = "20";
		// this.setScore(this.defen.node, 25);
		// this.queshenNum.string = "2";
	},

	setWanfaName(label, name) {
		var WanfaName;
		switch (name) {
			case "happyDDZ":
				WanfaName = "经典斗地主";
				break;
			case "guaisanjiao":
				WanfaName = "拐三角";
				break;
			case "tuidaohu":
				WanfaName = "推倒胡";
				break;
			case "koudian":
				WanfaName = "抠点";
				break;
			case "tuidaohu2":
				WanfaName = "二人推倒胡";
				break;
			case "pokerPDK":
				WanfaName = "跑得快";
				break;
			case "koudian2":
				WanfaName = "二人抠点";
				break;
			case "jinzhong":
				WanfaName = "晋中";
				break;
			default:
				WanfaName = "不支持查看";
				break;

		}
		label.string = WanfaName;

	},
	setScore(node, score) {
		if (score >= 0) {
			node.color = cc.hexToColor(Color.REDAGREE);
		} else {
			node.color = cc.hexToColor(Color.BLUE);
		}
		node.getComponent(cc.Label).string = score + "";
	},



});