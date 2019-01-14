cc.Class({
	extends: cc.Component,

	properties: {

	},

	onLoad() {},
	//格式化后两种形式  一种 字符串，一种[] 数组   isCollection (是不是要数组形式返回)
	getWanfaStrFormat(wanfaName, isCollection) {
		var self = this;
		switch (wanfaName) {
			case "tdh":
				return self.wanfa_tdh(isCollection);
			case "tdh2":
				return self.wanfa_tdh2(isCollection);
			case "kd":
				return self.wanfa_kd(isCollection);
			case "gsj":
				return self.wanfa_gsj(isCollection);
			case "jdddz":
				return self.wanfa_jdddz(isCollection);
			case "jz":
				return self.wanfa_jz(isCollection);
			case "kd2":
				return self.wanfa_kd2(isCollection);
			case "pokerPDK":
				return self.wanfa_pokerPDK(isCollection);
		}
	},
    //跑的快
	wanfa_pokerPDK(isCollection, param) {
		var wanfastr = "";
		var wanfastrs = [];
		var pokerPDKparam = cc.jsInstance.CreatRoomParam.pokerPDKparam;
		if (param) {
			pokerPDKparam = param;
		}
		wanfastr = "跑得快";
		wanfastrs.push("跑得快");
		switch (pokerPDKparam.round) {
			case "round1":
				wanfastr = wanfastr + "\n1局";
				wanfastrs.push("1局");
				break;
			case "round4":
				wanfastr = wanfastr + "\n4局";
				wanfastrs.push("4局");
				break;
			case "round8":
				wanfastr = wanfastr + "\n8局";
				wanfastrs.push("8局");
				break;
			case 1:
				wanfastr = wanfastr + "\n1局";
				wanfastrs.push("1局");
				break;
			case 4:
				wanfastr = wanfastr + "\n4局";
				wanfastrs.push("4局");
				break;
			case 8:
				wanfastr = wanfastr + "\n8局";
				wanfastrs.push("8局");
				break;
		}
		if (pokerPDKparam.gameXg.pdk_redPeach_3) {
			wanfastr = wanfastr + "\n开局先出红3";
			wanfastrs.push("开局先出红3");
		}
		if (isCollection) {
			return wanfastrs;
		} else {
			return wanfastr;
		}
	},
	//晋中
	wanfa_jz(isCollection, param) {
		var wanfastr = "";
		var wanfastrs = [];
		var jzparam = cc.jsInstance.CreatRoomParam.jzparam;
		if (param) {
			jzparam = param;
		}
		wanfastr = "晋中";
		wanfastrs.push("晋中");
		switch (jzparam.round) {
			case "round1":
				wanfastr = wanfastr + "\n1局";
				wanfastrs.push("1局");
				break;
			case "round4":
				wanfastr = wanfastr + "\n4局";
				wanfastrs.push("4局");
				break;
			case "round8":
				wanfastr = wanfastr + "\n8局";
				wanfastrs.push("8局");
				break;
			case "circle1":
				wanfastr = wanfastr + "\n1圈";
				wanfastrs.push("1圈");
				break;
			case 1:
				if (jzparam.jz_xg.circle) { //1圈
					wanfastr = wanfastr + "\n1圈";
					wanfastrs.push("1圈");
				} else {
					wanfastr = wanfastr + "\n1局";
					wanfastrs.push("1局");
				}
				break;
			case 4:
				wanfastr = wanfastr + "\n4局";
				wanfastrs.push("4局");
				break;
			case 8:
				wanfastr = wanfastr + "\n8局";
				wanfastrs.push("8局");
				break;
		}
		wanfastr = wanfastr + "\n报听";
		wanfastrs.push("报听");
		wanfastr = wanfastr + "\n带风";
		wanfastrs.push("带风");
		wanfastr = wanfastr + "\n点炮胡";
		wanfastrs.push("点炮胡");
		if (isCollection) {
			return wanfastrs;
		} else {
			return wanfastr;
		}
	},
    //经典斗地主
	wanfa_jdddz(isCollection, param) {
		var wanfastr = "";
		var wanfastrs = [];
		var jdddzparam = cc.jsInstance.CreatRoomParam.jdddzparam;
		if (param) {
			jdddzparam = param;
		}
		wanfastr = "经典斗地主";
		wanfastrs.push("经典斗地主");
		switch (jdddzparam.round) {
			case "round1":
				wanfastr = wanfastr + "\n1局";
				wanfastrs.push("1局");
				break;
			case "round4":
				wanfastr = wanfastr + "\n4局";
				wanfastrs.push("4局");
				break;
			case "round8":
				wanfastr = wanfastr + "\n8局";
				wanfastrs.push("8局");
				break;
			case 1:
				wanfastr = wanfastr + "\n1局";
				wanfastrs.push("1局");
				break;
			case 4:
				wanfastr = wanfastr + "\n4局";
				wanfastrs.push("4局");
				break;
			case 8:
				wanfastr = wanfastr + "\n8局";
				wanfastrs.push("8局");
				break;
		}
		switch (jdddzparam.gameXg.bombLime + "") {
			case "3":
				wanfastr = wanfastr + "\n3个炸封顶";
				wanfastrs.push("3个炸封顶");
				break;
			case "4":
				wanfastr = wanfastr + "\n4个炸封顶";
				wanfastrs.push("4个炸封顶");
				break;
			case "5":
				wanfastr = wanfastr + "\n5个炸封顶";
				wanfastrs.push("5个炸封顶");
				break;
			case "100":
				wanfastr = wanfastr + "\n炸弹不封顶";
				wanfastrs.push("炸弹不封顶");
				break;
		}

		if (isCollection) {
			return wanfastrs;
		} else {
			return wanfastr;
		}
	},
	//拐三角
	wanfa_gsj(isCollection, param) {
		var wanfastr = "";
		var wanfastrs = []
		var gsjparam = cc.jsInstance.CreatRoomParam.gsjparam;
		if (param) {
			gsjparam = param;
		}
		wanfastr = "拐三角";
		wanfastrs.push("拐三角");
		switch (gsjparam.round) {
			case "round1":
				wanfastr = wanfastr + "\n1局";
				wanfastrs.push("1局");
				break;
			case "round4":
				wanfastr = wanfastr + "\n4局";
				wanfastrs.push("4局");
				break;
			case "round8":
				wanfastr = wanfastr + "\n8局";
				wanfastrs.push("8局");
				break;
			case "circle1":
				wanfastr = wanfastr + "\n1圈";
				wanfastrs.push("1圈");
				break;
			case 1:
				if (param.gsj_xg.circle) { //1圈
					wanfastr = wanfastr + "\n1圈";
					wanfastrs.push("1圈");
				} else {
					wanfastr = wanfastr + "\n1局";
					wanfastrs.push("1局");
				}
				break;
			case 4:
				wanfastr = wanfastr + "\n4局";
				wanfastrs.push("4局");
				break;
			case 8:
				wanfastr = wanfastr + "\n8局";
				wanfastrs.push("8局");
				break;
		}
		wanfastr = wanfastr + "\n不报听";
		wanfastrs.push("不报听");
		if (gsjparam.gsj_xg.gsj_shisanyao) {
			wanfastr = wanfastr + "\n带风";
			wanfastrs.push("带风");
		} else {
			wanfastr = wanfastr + "\n不带风";
			wanfastrs.push("不带风");
		}
		wanfastr = wanfastr + "\n点炮胡";
		wanfastrs.push("点炮胡");
		if (gsjparam.gsj_xg.gsj_shisanyao) {
			wanfastr = wanfastr + "\n十三幺";
			wanfastrs.push("十三幺");
		}
		if (gsjparam.gsj_xg.gsj_qixiaodui) {
			wanfastr = wanfastr + "\n七小对";
			wanfastrs.push("七小对");
		}
		if (gsjparam.gsj_xg.gsj_ying8zhang) {
			wanfastr = wanfastr + "\n硬八张";
			wanfastrs.push("硬八张");
		}
		if (isCollection) {
			return wanfastrs;
		} else {
			return wanfastr;
		}
	},
	//抠点
	wanfa_kd(isCollection, param) {
		var wanfastr = "";
		var wanfastrs = []
		var kdparam = cc.jsInstance.CreatRoomParam.kdparam;
		if (param) {
			kdparam = param;
		}
		wanfastr = "抠点";
		wanfastrs.push("抠点");
		switch (kdparam.round) {
			case "round1":
				wanfastr = wanfastr + "\n1局";
				wanfastrs.push("1局");
				break;
			case "round4":
				wanfastr = wanfastr + "\n4局";
				wanfastrs.push("4局");
				break;
			case "round8":
				wanfastr = wanfastr + "\n8局";
				wanfastrs.push("8局");
				break;
			case "circle1":
				wanfastr = wanfastr + "\n1圈";
				wanfastrs.push("1圈");
				break;
			case 1:
				if (param.kd_xg.circle) { //1圈
					wanfastr = wanfastr + "\n1圈";
					wanfastrs.push("1圈");
				} else {
					wanfastr = wanfastr + "\n1局";
					wanfastrs.push("1局");
				}
				break;
			case 4:
				wanfastr = wanfastr + "\n4局";
				wanfastrs.push("4局");
				break;
			case 8:
				wanfastr = wanfastr + "\n8局";
				wanfastrs.push("8局");
				break;

		}
		wanfastr = wanfastr + "\n报听";
		wanfastrs.push("报听");
		wanfastr = wanfastr + "\n带风";
		wanfastrs.push("带风");
		wanfastr = wanfastr + "\n点炮胡";
		wanfastrs.push("点炮胡");
		if (kdparam.kd_xg.kd_SameColor) {
			wanfastr = wanfastr + "\n清一色翻倍";
			wanfastrs.push("清一色翻倍");
			wanfastr = wanfastr + "\n一条龙翻倍";
			wanfastrs.push("一条龙翻倍");
		}
		if (kdparam.kd_xg.kd_zhuohaozi) {
			wanfastr = wanfastr + "\n捉耗子";
			wanfastrs.push("捉耗子");
		}
		if (kdparam.kd_xg.kd_fenghaozi) {
			wanfastr = wanfastr + "\n风耗子";
			wanfastrs.push("风耗子");
		}
		if (kdparam.kd_xg.kd_zhuang) {
			wanfastr = wanfastr + "\n带庄";
			wanfastrs.push("带庄");
			if (kdparam.kd_xg.kd_zhuangDouble) {
				wanfastr = wanfastr + "\n自摸庄分翻倍";
				wanfastrs.push("自摸庄分翻倍");
			}
		}
		if (kdparam.kd_xg.kd_fengzuizi) {
			wanfastr = wanfastr + "\n风嘴子";
			wanfastrs.push("风嘴子");
		}

		if (kdparam.kd_xg.kd_changeTingGang) {
			wanfastr = wanfastr + "\n变听口不能杠";
			wanfastrs.push("变听口不能杠");
		}
		if (isCollection) {
			return wanfastrs;
		} else {
			return wanfastr;
		}
	},
	//二人抠点
	wanfa_kd2(isCollection, param) {
		var wanfastr = "";
		var wanfastrs = []
		var kd2param = cc.jsInstance.CreatRoomParam.kd2param;
		if (param) {
			kd2param = param;
		}
		wanfastr = "二人抠点";
		wanfastrs.push("二人抠点");
		switch (kd2param.round) {
			case "round1":
				wanfastr = wanfastr + "\n1局";
				wanfastrs.push("1局");
				break;
			case "roundz8":
				wanfastr = wanfastr + "\n8局";
				wanfastrs.push("8局");
				break;
			case "roundz16":
				wanfastr = wanfastr + "\n16局";
				wanfastrs.push("16局");
				break;
		}
		wanfastr = wanfastr + "\n点炮胡";
		wanfastrs.push("点炮胡");
		wanfastr = wanfastr + "\n报听";
		wanfastrs.push("报听");
		if (kd2param.gameXg.withWind) {
			wanfastr = wanfastr + "\n带风";
			wanfastrs.push("带风");
		} else {
			wanfastr = wanfastr + "\n不带风";
			wanfastrs.push("不带风");
		}

		if (kd2param.gameXg.kd_SameColor) {
			wanfastr = wanfastr + "\n清一色翻倍";
			wanfastrs.push("清一色翻倍");
			wanfastr = wanfastr + "\n一条龙翻倍";
			wanfastrs.push("一条龙翻倍");
		}
		if (kd2param.gameXg.kd_zhuohaozi) {
			wanfastr = wanfastr + "\n捉耗子";
			wanfastrs.push("捉耗子");
		}
		if (kd2param.gameXg.kd_fenghaozi) {
			wanfastr = wanfastr + "\n风耗子";
			wanfastrs.push("风耗子");
		}

		if (kd2param.gameXg.kd_changeTingGang) {
			wanfastr = wanfastr + "\n变听口不能杠";
			wanfastrs.push("变听口不能杠");
		}
		if (kd2param.gameXg.kd_zhuang) {
			wanfastr = wanfastr + "\n带庄";
			wanfastrs.push("带庄");
			if (kd2param.gameXg.kd_zhuangDouble) {
				wanfastr = wanfastr + "\n自摸庄分翻倍";
				wanfastrs.push("自摸庄分翻倍");
			}
		}
		if (kd2param.gameXg.kd_fengzuizi) {
			wanfastr = wanfastr + "\n风嘴子";
			wanfastrs.push("风嘴子");
		}

		if (isCollection) {
			return wanfastrs;
		} else {
			return wanfastr;
		}
	},
	//二人推倒胡
	wanfa_tdh2(isCollection, param) {
		var wanfastr = "";
		var wanfastrs = []
		var tdh2param = cc.jsInstance.CreatRoomParam.tdh2param;
		if (param) {
			tdh2param = param;
		}
		wanfastr = "二人推倒胡";
		wanfastrs.push("二人推倒胡");
		switch (tdh2param.round) {
			case "round1":
				wanfastr = wanfastr + "\n1局";
				wanfastrs.push("1局");
				break;
			case "roundz8":
				wanfastr = wanfastr + "\n8局";
				wanfastrs.push("8局");
				break;
			case "roundz16":
				wanfastr = wanfastr + "\n16局";
				wanfastrs.push("16局");
				break;
			case 1:
				wanfastr = wanfastr + "\n1局";
				wanfastrs.push("1局");
				break;
			case 8:
				wanfastr = wanfastr + "\n8局";
				wanfastrs.push("8局");
				break;
			case 16:
				wanfastr = wanfastr + "\n16局";
				wanfastrs.push("16局");
				break;
		}
		if (tdh2param.gameXg.dahu) {
			wanfastr = wanfastr + "\n大胡";
			wanfastrs.push("大胡");
		} else {
			wanfastr = wanfastr + "\n平胡";
			wanfastrs.push("平胡");
		}
		if (tdh2param.gameXg.needTing) {
			wanfastr = wanfastr + "\n报听";
			wanfastrs.push("报听");
		} else {
			wanfastr = wanfastr + "\n不报听";
			wanfastrs.push("不报听");
		}
		wanfastr = wanfastr + "\n不带风";
		wanfastrs.push("不带风");
		if (tdh2param.gameXg.canEatHu) {
			wanfastr = wanfastr + "\n点炮胡";
			wanfastrs.push("点炮胡");
		} else {
			wanfastr = wanfastr + "\n自摸胡";
			wanfastrs.push("自摸胡");
		}
		if (tdh2param.gameXg.changeTingGang) {
			wanfastr = wanfastr + "\n变听口不能杠";
			wanfastrs.push("变听口不能杠");
		}
		if (tdh2param.gameXg.lackOne) {
			wanfastr = wanfastr + "\n缺一门";
			wanfastrs.push("缺一门");
		}
		if (isCollection) {
			return wanfastrs;
		} else {
			return wanfastr;
		}
	},
	//推倒胡
	wanfa_tdh(isCollection, param) {
		var wanfastr = "";
		var wanfastrs = []
		var tdhparam = cc.jsInstance.CreatRoomParam.tdhparam;
		if (param) {
			tdhparam = param;
		}
		if (tdhparam.tdh_xg.tdh_dahu) {
			wanfastr = "推倒胡 大胡";
			wanfastrs.push("推倒胡 大胡");
		} else {
			wanfastr = "推倒胡 平胡";
			wanfastrs.push("推倒胡 平胡");
		}
		switch (tdhparam.round) {
			case "round1":
				wanfastr = wanfastr + "\n1局";
				wanfastrs.push("1局");
				break;
			case "round4":
				wanfastr = wanfastr + "\n4局";
				wanfastrs.push("4局");
				break;
			case "round8":
				wanfastr = wanfastr + "\n8局";
				wanfastrs.push("8局");
				break;
			case 1:
				wanfastr = wanfastr + "\n1局";
				wanfastrs.push("1局");
				break;
			case 4:
				wanfastr = wanfastr + "\n4局";
				wanfastrs.push("4局");
				break;
			case 8:
				wanfastr = wanfastr + "\n8局";
				wanfastrs.push("8局");
				break;
		}
		if (tdhparam.tdh_xg.tdh_needTing) {
			wanfastr = wanfastr + "\n报听";
			wanfastrs.push("报听");
		} else {
			wanfastr = wanfastr + "\n不报听";
			wanfastrs.push("不报听");
		}
		if (tdhparam.tdh_xg.tdh_withWind) {
			wanfastr = wanfastr + "\n带风";
			wanfastrs.push("带风");
		} else {
			wanfastr = wanfastr + "\n不带风";
			wanfastrs.push("不带风");
		}
		if (tdhparam.tdh_xg.tdh_canEatHu) {
			wanfastr = wanfastr + "\n点炮胡";
			wanfastrs.push("点炮胡");
		} else {
			wanfastr = wanfastr + "\n自摸胡";
			wanfastrs.push("自摸胡");
		}
		if (tdhparam.tdh_xg.tdh_changeTingGang) {
			wanfastr = wanfastr + "\n变听口不能杠";
			wanfastrs.push("变听口不能杠");
		}
		if (tdhparam.tdh_xg.tdh_haozi) {
			wanfastr = wanfastr + "\n随机耗子";
			wanfastrs.push("随机耗子");
		}
		if (isCollection) {
			return wanfastrs;
		} else {
			return wanfastr;
		}
	},
	//亲友圈 传过来的玩法 转化成自己格式  一种 字符串，一种[] 数组   isCollection (是不是要数组形式返回) isName 是否
	setFormatRule(rule, isCollection) {
		var self = this;
		var param = {};
		var wanfaName;
		for (var key in rule) {
			switch (key) {
				case "gameXg": //经典斗地主的   tuidaohu2  "happyDDZ"
					if (rule.gameXg.visible) {
						if (rule.gameKind === "tuidaohu2") {
							param.round = rule.round;
							param.gameKind = "tuidaohu2";
							param.gameXg = rule.gameXg;
							wanfaName = "tdh2";
						} else if (rule.gameKind === "happyDDZ") {
							param.round = rule.round;
							param.gameKind = "happyDDZ";
							param.gameXg = rule.gameXg;
							wanfaName = "jdddz";
						} else if (rule.gameKind === "koudian2") {
							param.round = rule.round;
							param.gameKind = "koudian2";
							param.gameXg = rule.gameXg;
							wanfaName = "kd2";
						} else if (rule.gameKind === "pokerPDK") {
							param.round = rule.round;
							param.gameKind = "pokerPDK";
							param.gameXg = rule.gameXg;
							wanfaName = "pokerPDK";
						}
					}
					break;
				case "tdh_xg": //推倒胡
					if (rule[key].tdh_visible) {
						param.round = rule.round;
						param.gameKind = "tuidaohu";
						param.tdh_xg = rule.tdh_xg;
						wanfaName = "tdh";
					}
					break;
				case "gsj_xg": //拐三角
					if (rule[key].gsj_visible) {
						param.round = rule.round;
						param.gameKind = "guaisanjiao";
						param.gsj_xg = rule.gsj_xg;
						wanfaName = "gsj";
					}
					break;
				case "kd_xg": //抠点
					if (rule[key].kd_visible) {
						param.round = rule.round;
						param.gameKind = "koudian";
						param.kd_xg = rule.kd_xg;
						wanfaName = "kd";
					}
					break;
				case "jz_xg": //晋中
					if (rule[key].jz_visible) {
						param.round = rule.round;
						param.gameKind = "jz";
						param.jz_xg = rule.jz_xg;
						wanfaName = "jz";
					}
					break;
				case "yuncheng": //运城
					if (rule[key].yc_visible) {

					}
					break;
				case "ls_xg": //立四
					if (rule[key].ls_visible) {

					}
					break;
				case "XA_xiangGuan": //西安
					if (rule[key].xa_visible) {

					}
					break;
				case "lf_xiangGuan": //临汾
					if (rule[key].lf_visible) {

					}
					break;
				case "yl_xiangGuan": //临沂
					if (rule[key].yl_visible) {

					}
					break;
				case "rain_xiangGuan": //下雨
					if (rule[key].yc_visible) {

					}
					break;
				case "king_xiangGuan": //洪洞王牌
					if (rule[key].king_visible) {

					}
					break;
			}
		}
		if (!param) {
			cc.logManager.error("获取参数出错=", rule);
		}

		switch (wanfaName) {
			case "tdh":
				return self.wanfa_tdh(isCollection, param);
			case "tdh2":
				return self.wanfa_tdh2(isCollection, param);
			case "kd":
				return self.wanfa_kd(isCollection, param);
			case "kd2":
				return self.wanfa_kd2(isCollection, param);
			case "gsj":
				return self.wanfa_gsj(isCollection, param);
			case "jdddz":
				return self.wanfa_jdddz(isCollection, param);
			case "jz":
				return self.wanfa_jz(isCollection, param);
			case "pokerPDK":
				return self.wanfa_pokerPDK(isCollection, param);
		}
	}


});