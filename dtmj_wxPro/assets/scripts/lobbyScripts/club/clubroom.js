cc.Class({
	extends: cc.Component,
	properties: {
		//牌桌预制体
		club_home_item_pre: {
			type: cc.Prefab,
			default: null,
		},
		//亲友圈主页 牌桌的 scrollview
		club_home_scrollview: {
			type: cc.ScrollView,
			default: null,
		},
		//亲友圈主页 牌桌的 scrollview 的content
		club_home_scro_content: {
			type: cc.Node,
			default: null,
		},
		//总人数
		peopNumAll: {
			type: cc.Node,
			default: null,
		},
		//在线人数
		peopNumOnline: {
			type: cc.Label,
			default: null,
		},
		//总人数
		peopNum: {
			type: cc.Label,
			default: null,
		},
		//亲友圈id
		clubId: {
			type: cc.Label,
			default: null,
		},
		//房卡数量
		fangkaNum: {
			type: cc.Label,
			default: null,
		},
		//房卡背景 自己的 可以点击购买
		fangkaBg_self: {
			type: cc.Node,
			default: null,
		},
		//房卡背景 别人的
		fangkaBg_other: {
			type: cc.Node,
			default: null,
		},
		//关闭亲友圈节点
		closeClub: {
			type: cc.Node,
			default: null,
		},
		//上面的亲友圈
		clubs_top: {
			type: cc.Node,
			default: [],
		},
		//上面的亲友圈
		clubs_top_labels: {
			type: cc.Label,
			default: [],
		},
		//下面的菜单
		clubs_bottom: {
			type: cc.Node,
			default: [],
		},
		//第一次创建亲友圈的提示
		club_create_tips: {
			type: cc.Node,
			default: null,
		},
		//购买房卡界面
		club_buy_fangka: {
			type: cc.Node,
			default: null,
		},
		//修改或者选择完玩法后显示的页面
		wanfa_tips: {
			type: cc.Node,
			default: null,
		},
		//修改或者选择完玩法后显示的页面
		wanfa_tips_layout: {
			type: cc.Node,
			default: null,
		},

		//亲友圈设置页面
		setting_club: {
			type: cc.Node,
			default: null,
		},

		//战绩 只有自己的亲友圈才显示
		playLog_club: {
			type: cc.Node,
			default: null,
		},

		//成员 自己亲友圈显示这个 管理员
		memberSelf_club: {
			type: cc.Node,
			default: null,
		},
		//成员 别人的亲友圈显示这个
		memberother_club: {
			type: cc.Node,
			default: null,
		},
		//排行榜 别人的亲友圈显示这个
		rank_club: {
			type: cc.Node,
			default: null,
		},
		//亲友圈有人邀请进入某个牌桌
		club_invite: {
			type: cc.Node,
			default: null,
		},
		//房卡不足弹出的提示
		rechargeMask: {
			type: cc.Node,
			default: null,
		},
		//圈主自己点击加入自己亲友圈的牌桌 房卡不足弹出的提示
		my_fangka_buzu_tips: {
			type: cc.Node,
			default: null,
		},
		//亲友圈 创建和加入节点
		Club: {
			type: cc.Node,
			default: null,
		},
		//显示正在有人等待中的桌子
		ShowWaitting: {
			type: cc.Label,
			default: null,
		},
		ShowWaittingChoose: {
			type: cc.Toggle,
			default: null,
		},
		//批量修改玩法
		set_wanfa_node: {
			type: cc.Node,
			default: null,
		},
		quick_join: {
			type: cc.Node,
			default: null,
		},
	},

	onLoad() {
		this.initPool(); //初始化对象池
		this.club = this.Club.getComponent("club"); //亲友圈 创建和加入节点 脚本
	},
	click_custom: function(e, custom) {
		var self = this;
		cc.logManager.info("click:" + custom);
		cc.jsInstance.audioManager.playBtnClick();
		switch (custom) {
			case "close":
				self.node.active = false;
				cc.jsInstance.clubShow = false;
				if (self.clubInfo && self.clubInfo.id) { //cc.jsInstance.clubId_Now
					cc.jsInstance.network.LeaveClubC2S(self.clubInfo.id);
				}
				cc.jsInstance.globalUtils.send("club_tip"); //是否显示亲友圈红点
				return;
			case "setting":
				self.setting_click();
				return;
			case "buyfangka": //买房卡
				self.buyfangka_click();
				return;
			case "member": //成员
				self.member_click();
				return;
			case "zhanji": //战绩
				self.zhanji_click();
				return;
			case "quick": //快速加入
				self.quick_click();
				return;
			case "rank": //排行榜
				self.rank_click();
				return;
			case "wanfa": //玩法 修改所有的玩法
				self.wanfa_click(e, "wanfa");
				return;
			case "club": //亲友圈
				self.club_click();
				return;
			case "open": //打开亲友圈（自己建的亲友圈关闭界面的那个开启按钮）
				self.open_click();
				return;
			case "club_1": //上面第1个亲友圈
				if (!self.clubs_top_labels[0].club) {
					return;
				}
				self.clubs_click(self.clubs_top_labels[0].club._id);
				return;
			case "club_2": //上面第2个亲友圈
				if (!self.clubs_top_labels[1].club) {
					return;
				}
				self.clubs_click(self.clubs_top_labels[1].club._id);
				return;
			case "club_3": //上面第3个亲友圈
				if (!self.clubs_top_labels[2].club) {
					return;
				}
				self.clubs_click(self.clubs_top_labels[2].club._id);
				return;
			case "club_4": //上面第4个亲友圈
				if (!self.clubs_top_labels[3].club) {
					return;
				}
				self.clubs_click(self.clubs_top_labels[3].club._id);
				return;
			case "club_5": //上面第5个亲友圈
				if (!self.clubs_top_labels[4].club) {
					return;
				}
				self.clubs_click(self.clubs_top_labels[4].club._id);
				return;
			case "wanfa_tips_close": //上面第5个亲友圈
				this.wanfa_tips.active = false;
				return;
			case "my_fangka_buzu_tips_go": // 圈主自己加入自己牌桌 房卡不足 提示 里面的前往 关闭 取消
				this.my_fangka_buzu_tips_go();
				return;
			case "my_fangka_buzu_tips_close": //
				this.my_fangka_buzu_tips_close();
				return;
			case "my_fangka_buzu_tips_cancel": //
				this.my_fangka_buzu_tips_cancel();
				return;
		}
	},

	rename_club(name) {
		var self = this;
		for (var i = 0; i < self.clubs_top_labels.length; i++) { //先全部置空
			if (self.clubs_top_labels[i].club && (self.clubs_top_labels[i].club._id === this.clubInfo.id)) {
				self.clubs_top_labels[i].club.name = name;
				self.clubs_top_labels[i].getComponent(cc.Label).string = name;
				return;
			}
		}
	},

	// 获取所有亲友圈 进入某个亲友圈 不传默认进入第一个
	getJoinedClubs(clubId) {
		var self = this;
		cc.jsInstance.network.getJoinedClubs(function(rtn) {
			// cc.logManager.info("---获取玩家所有的俱乐部消息------", JSON.stringify(rtn));
			if (rtn.result === 0) {
				if (!cc.jsInstance.clubs || cc.jsInstance.clubs.length === 0) { //维护加入的俱乐部数据
					cc.jsInstance.clubs = [];
					for (var key in rtn.clubs) {
						cc.jsInstance.clubs.push(rtn.clubs[key]);
					}
					// cc.logManager.info("--- cc.jsInstance.clubs---之前没有,重新初始化加入的俱乐部-------", cc.jsInstance.clubs);
				} else {
					for (var key in rtn.clubs) {
						// cc.jsInstance.clubs.push(rtn.clubs[key]);
						var num = 0;
						for (var i = 0; i < cc.jsInstance.clubs.length; i++) {
							if (rtn.clubs[key]._id === cc.jsInstance.clubs[i]._id) {
								break;
							} else {
								num++;
							}
						}
						if (num === cc.jsInstance.clubs.length) {
							// cc.logManager.info("--- cc.jsInstance.clubs---获取新的加入新的俱乐部-------", cc.jsInstance.clubs);
							cc.jsInstance.clubs.push(rtn.clubs[key]);
						}
					}
					// cc.logManager.info("--- cc.jsInstance.clubs---获取的加入的俱乐部-------", cc.jsInstance.clubs);
				}
				self.clubs = rtn.clubs;
				if (!self.clubs_top_labels || self.clubs_top_labels.length === 0) {
					self.node.active = false;
					return;
				}
				for (var i = 0; i < self.clubs_top_labels.length; i++) { //先全部置空
					self.clubs_top_labels[i].getComponent(cc.Label).string = "";
					self.clubs_top_labels[i].club = null;
				}
				var i = 0;
				var clubsNum = 0;
				for (var key in self.clubs) {
					clubsNum++;
					if (cc.jsInstance.pinfo.pinfo.uid === self.clubs[key].owner) { //有自己的亲友圈
						if (cc.jsInstance.MyClubNewName) {
							self.clubs[key].name = cc.jsInstance.MyClubNewName; //自己亲友圈改完后的新名字
						}
						self.clubs_top_labels[i].club = self.clubs[key]; //这个俱乐部基本信息绑定到这个文字上
						self.clubs_top_labels[i].getComponent(cc.Label).string = unescape(self.clubs[key].name).substr(0, 6);
						i++;
						break;
					}
				}
				if (clubsNum === 0) {
					self.node.active = false;
					self.closeAllPop();
					return;
				}
				for (var key in self.clubs) {
					if (cc.jsInstance.pinfo.pinfo.uid === self.clubs[key].owner) {
						continue;
					}
					self.clubs_top_labels[i].getComponent(cc.Label).string = unescape(self.clubs[key].name).substr(0, 6);
					self.clubs_top_labels[i].club = self.clubs[key]; //这个俱乐部基本信息绑定到这个文字上
					i++;
				}
				// this.clubsNum = i;//加入的俱乐部数量
				//如果要加入某个亲友圈 
				if (!clubId) {
					if (self.clubs_top_labels[0].club) {
						clubId = self.clubs_top_labels[0].club._id; //不存在默认第一个
					}
					if (cc.jsInstance.clubId_Now && cc.jsInstance.pinfo.pinfo.joinedClubs.indexOf(cc.jsInstance.clubId_Now) >= 0) { //之前有进入的这个 默认这个
						clubId = cc.jsInstance.clubId_Now;
					}

				}
				for (var i = 0; i < self.clubs_top.length; i++) {
					if (self.clubs_top_labels[i].club && self.clubs_top_labels[i].club._id) {
						var currClubId = self.clubs_top_labels[i].club._id;
						if (currClubId === clubId) {
							self.clubs_top[i].getChildByName("nochoose").active = false;
						} else {
							self.clubs_top[i].getChildByName("nochoose").active = true;
						}
					} else {
						self.clubs_top[i].getChildByName("nochoose").active = true;
					}
				}

				// if (cc.jsInstance.MyClubNewName) { //苹果改完亲友圈名字后，如果往下走有的字体就会变小，所以改完名字后只刷新上面亲友圈名字，其他不刷新return
				//     cc.jsInstance.MyClubNewName = "";
				//     return;
				// }
				for (var i = 0; i < self.clubs_top_labels.length; i++) { //
					if (self.clubs_top_labels[i].club && self.clubs_top_labels[i].club._id === clubId) {
						//进入这个亲友圈
						cc.jsInstance.network.entryClub(clubId, self.clubs_top_labels[i].club.name, function(rtn) {
							cc.logManager.info("进入俱乐部");
							if (rtn.result === 0) {
								cc.jsInstance.clubControler.setCurrClubData(rtn.info);
								self.initData(rtn.info, self.clubs_top_labels[i].club.owner);
							}
						});
						break;
					}
				}
			} else {
				cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("获取亲友圈数据失败", function() {
					self.node.active = false;
				});
			}
		});
	},
	//初始化数据 （切换或者进入某个亲友圈调用）
	initData(data, owner) {
		cc.logManager.info("初始化亲友圈数据");
		this.clubInfo = data;
		cc.jsInstance.clubId_Now = data.id;
		var level = cc.jsInstance.clubControler.getMLevel(cc.jsInstance.clubId_Now, data.uid);
		if (level === 9) {
			this.mamager = true;
		} else {
			this.mamager = false;
		}
		this.initBottom(data, owner);
		this.initTable(data, owner);
		this.initDesktops(data, owner); //
		//data.desks // 桌子数  data.desks.length
		//data.desktopRule// 单独桌子的规则
		//data.members  //成员
		//data.desktops  正在玩的牌桌数据.
		//data.rule // 默认规则 如果默认规则不存在 ，弹出设置默认规则
		if (this.click_club) {
			this.click_club = false;
			this.showAll = true;
			this.ShowWaittingChoose.isChecked = false;
			this.findShowWaittingDesks(this.showAll);
		}


	},

	//初始化 有数据牌桌  玩法和能和默认玩法 其他玩法不一样，或者是玩家修改的另一种玩法 需要处理
	initDesktops(data, owner) {
		if (data.desktops && data.desktops.length > 0) {
			for (var i = 0; i < data.desktops.length; i++) {
				var desktop = data.desktops[i].desktop;
				var PlayUids = data.desktops[i].players;
				var players = this.getPlayersByMember(PlayUids); //玩家数据
				var rule = data.desktops[i].createPara;
				var wanfa = cc.jsInstance.WanfaStrFormat.setFormatRule(rule, true); //[]
				// this.tables[parseInt(desktop) - 1].getComponent("club_home_item").xiugaiWanfa(wanfa, cc.jsInstance.WanfaStrFormat.setFormatRule(rule, false), rule);

				if (wanfa) {
					var rulecon = cc.jsInstance.WanfaStrFormat.setFormatRule(rule, false);
					this.isShowxiugaiEd(rulecon, desktop); //判断当前桌子玩法是不是被修改过
					this.tables[parseInt(desktop) - 1].getComponent("club_home_item").xiugaiWanfa(wanfa, rulecon, rule);
				} else {
					var wanfa = ["不支持玩法"];
					this.tables[parseInt(desktop) - 1].getComponent("club_home_item").xiugaiWanfa(wanfa, "不支持该玩法", rule);
				}

				this.tables[parseInt(desktop) - 1].getComponent("club_home_item").setPlayers(players, data.desktops[i]); //玩家和牌桌信息设置给牌桌
			}
		}
	},

	//根据uid 从members里找到玩家数据
	getPlayersByMember(PlayUids) {
		var members = this.clubInfo.members;
		for (var i = 0; i < members.length; i++) {
			for (var j = 0; j < PlayUids.length; j++) {
				if (PlayUids[j] === members[i].uid + "") {
					PlayUids.splice(j, 1);
					PlayUids.push(members[i]);
					break;
				}
			}
		}
		return PlayUids;
	},

	//初始化桌子及默认规则
	initTable(data, owner) {
		var self = this;
		if (!data.rule && (this.isMyClub || this.mamager)) { //默认规则
			this.open_club_create_tips();
		}
		this.backPool(); //把所有对象返回对象池
		self.club_home_scro_content.removeAllChildren();
		this.tables = []; //重新初始化当前桌子预制体
		self.club_home_item_pre_Pool_used.splice(0, self.club_home_item_pre_Pool_used.length); //清空数组 
		for (var key in data.desks) {
			var opt_item;
			if (self.club_home_item_pre_Pool.size() > 0) {
				opt_item = self.club_home_item_pre_Pool.get();
			} else {
				opt_item = cc.instantiate(self.club_home_item_pre);
			}
			self.club_home_scro_content.addChild(opt_item); //Label font size can't be shirnked less than 0!
			self.club_home_item_pre_Pool_used.push(opt_item);
			opt_item.getComponent("club_home_item").initData(this.clubInfo.id, data.desks[key], this.isMyClub, this.mamager); //亲友圈id 桌子号  是不是圈主
			if (!this.isMyClub) {
				opt_item.getComponent("club_home_item").isAlowXiugaiWanfa(!data.settings.lockWays); //是否可以修改玩法
			}

			var rule = data.rule; //规则
			//转化成自己的规则
			if (rule) {
				var wanfa = cc.jsInstance.WanfaStrFormat.setFormatRule(rule, true); //[]
				// opt_item.getComponent("club_home_item").xiugaiWanfa(wanfa, cc.jsInstance.WanfaStrFormat.setFormatRule(rule, false), rule);
				if (wanfa) {
					opt_item.getComponent("club_home_item").xiugaiWanfa(wanfa, cc.jsInstance.WanfaStrFormat.setFormatRule(rule, false), rule);
				} else {
					var wanfa = ["不支持玩法"];
					opt_item.getComponent("club_home_item").xiugaiWanfa(wanfa, "不支持该玩法", rule);
				}
			}
			this.tables.push(opt_item);

		}
		self.initOtherTable(data); //其他桌子的规则 
		cc.logManager.info("club_home_item_pre_Pool剩余对象池对象====", self.club_home_item_pre_Pool.size());
		self.club_home_scrollview.scrollToTop(0);
	},

	//其他桌子的规则 
	initOtherTable(data) {
		var self = this;
		if (data.desktopRule) {
			for (let i = 0; i < self.tables.length; i++) {
				let node = self.tables[i];
				if (data.desktopRule[i + 1]) {
					var rule = data.desktopRule[i + 1];
					var wanfa = cc.jsInstance.WanfaStrFormat.setFormatRule(rule, true); //[]
					// node.getComponent("club_home_item").xiugaiWanfa(wanfa, cc.jsInstance.WanfaStrFormat.setFormatRule(rule, false), rule);

					if (wanfa) {
						node.getComponent("club_home_item").xiugaiWanfa(wanfa, cc.jsInstance.WanfaStrFormat.setFormatRule(rule, false), rule);
					} else {
						var wanfa = ["不支持玩法"];
						node.getComponent("club_home_item").xiugaiWanfa(wanfa, "不支持该玩法", rule);
					}
				}
			}
		} else {
			cc.logManager.info("暂时没有特殊牌桌玩法");
		}
	},

	//初始化下面的文字等
	initBottom(data, owner) {
		this.isMyClub = false;

		this.club.isEnableButton(this.club.clubCreate, true);
		this.club.isEnableButton(this.club.clubJoin, true);
		this.clubs_bottom[1].getChildByName("club").active = false;
		this.isHaveClubSelf = false; //是否有自己的亲友圈
		if (cc.jsInstance.pinfo.pinfo.joinedClubs.length === 5) { //最多加入5个俱乐部 到达后亲友权变成灰色
			this.club.isEnableButton(this.club.clubCreate, false);
			this.club.isEnableButton(this.club.clubJoin, false);
			this.clubs_bottom[1].getChildByName("club").active = true;
		} else {
			this.club.isEnableButton(this.club.clubJoin, true);
		}

		// 是不是有自己的亲友圈
		for (var i = 0; i < this.clubs_top_labels.length; i++) {
			if (this.clubs_top_labels[i].club && this.clubs_top_labels[i].club.owner === cc.jsInstance.pinfo.pinfo.uid) {
				this.isHaveClubSelf = true; //有自己的亲友圈
				this.clubSelfId = this.clubs_top_labels[i].club._id;
				this.club.isEnableButton(this.club.clubCreate, false);
				break;
			}
		}
		if (owner === cc.jsInstance.pinfo.pinfo.uid) {
			this.isMyClub = true;
		}

		// this.clubId.node.active = cc.jsInstance.remoteCfg.isShowClubId; //根据配置是否显示亲友圈id
		// if (!cc.jsInstance.remoteCfg.isShowClubId) { //亲友圈不显示的话 人数的位置放中间
		//     this.peopNum.node.y = 0;
		//     this.peopNumOnline.node.y = 0;
		// }

		this.clubId.string = "亲友圈ID：" + data.id;
		this.ownerId = data.owner; //圈主id
		this.fangkaNum.string = cc.jsInstance.native.formatMoney(data.money);
		var onlineNum = 0;
		for (var i = 0; i < data.members.length; i++) {
			// if (data.members[i].online != "0") { //0 不在线 
			//     onlineNum++;
			// }

			if (data.members[i].online == 0 && data.members[i].offline == 0) { //离线
			} else if (data.members[i].online - data.members[i].offline > 0) {
				onlineNum++;
				if (data.members[i].ingame && data.members[i].ingame.gameid) { //游戏中
				} else { //空闲中
				}
			} else { // 离线 上次登录时间
			}
		}
		this.peopNumOnline.string = onlineNum + "/";
		this.peopNum.string = data.members.length;
		// this.peopNum.string = "总人数：   " + onlineNum + "/" + data.members.length;

		//data.settings //设置 "lockWays": true, "immediately": false, "hideCard": true
		if (data.settings.immediately) { //允许玩家立即开局 暂时不需要

		} else {

		}
		if (data.settings.closed) { //是否开启亲友圈  true（关闭了亲友圈）
			this.closeClub.active = true;
			if (this.mamager || this.isMyClub) { //显示亲友圈开启页面
				this.closeClub.getChildByName("close_club_bg").getChildByName("close_other").active = false;
				this.closeClub.getChildByName("close_club_bg").getChildByName("close_quanzhu").active = true;
			} else { //显示亲友圈关闭页面
				this.closeClub.getChildByName("close_club_bg").getChildByName("close_other").active = true;
				this.closeClub.getChildByName("close_club_bg").getChildByName("close_quanzhu").active = false;
			}
		} else { //关闭亲友圈开启和关闭ui
			this.closeClub.active = false;
		}

		//对成员隐藏房卡数（是否允许查看房卡）
		if (!this.isMyClub && data.settings.hideCard && !this.mamager) {
			this.fangkaNum.string = "*****";
		}

		for (var i = 0; i < cc.jsInstance.clubs.length; i++) {
			if (cc.jsInstance.clubs[i]._id === this.clubInfo.id) {
				cc.jsInstance.clubs[i].settings.immediately = data.settings.immediately;
				cc.jsInstance.clubs[i].settings.hideCard = data.settings.hideCard;
				cc.jsInstance.clubs[i].settings.lockWays = data.settings.lockWays;
			}
		}
		//圈主是否开启亲友圈
		//this.closeClub.active = false;
		//this.closeClub.getChildByName("close_club_bg").getChildByName("close_other").active = false;
		//this.closeClub.getChildByName("close_club_bg").getChildByName("close_quanzhu").active = false

		//显示隐藏下面的某些东西
		this.fangkaBg_self.active = this.isMyClub;
		this.fangkaBg_other.active = !this.isMyClub;
		// this.isShowHongdian();
		//如果是管理员要主动获取申请列表才知道是否要显示
		if (this.isMyClub || this.mamager) {
			this.memberSelf_club.getComponent("club_member_self").init_apply(this);
		}
		// cc.jsInstance.clubId_Now = data.id;
		for (var i = 0; i < this.clubs_bottom.length; i++) {
			this.clubs_bottom[i].active = true;
			if (this.isMyClub) { //这个亲友圈是自己的
				if (this.clubs_bottom[i].name === "quick") {
					this.clubs_bottom[i].active = false;
				}
			} else { //亲友圈不是自己的
				var Level = cc.jsInstance.clubControler.getMLevel(data.id);
				if (Level === 9) { //管理员
					if (this.clubs_bottom[i].name === "quick") {
						this.clubs_bottom[i].active = false;
					}
				} else {
					if (this.clubs_bottom[i].name === "wanfa" || this.clubs_bottom[i].name === "zhanji") {
						this.clubs_bottom[i].active = false;
					}
					if (this.clubs_bottom[i].name === "member") {
						this.clubs_bottom[i].getChildByName("hongdian").active = false;
					}
				}
			}
		}
	},
	//亲友圈添加管理员
	addManager(data) {
		if (this.clubInfo && data.club === this.clubInfo.id) { //是当前选中的亲友圈才变化
			if (this.SelfUid() === data.member.uid) { //
				// this.closeAllPop();
				this.setting_club.active = false; //设置页面
				this.setting_club.getChildByName("bg").getChildByName("club_rename").active = false;
				this.wanfa_tips.active = false; //玩法提示
				this.playLog_club.active = false; //战绩 
				this.node.getChildByName("bg").getChildByName("club_record").active = false; //战绩详情
				this.memberSelf_club.active = false; //成员
				this.memberother_club.active = false; //其他亲友圈成员
				this.Club.active = false; //亲友圈
				this.node.getChildByName("bg").getChildByName("club_rank").active = false; //排行榜
				this.node.getChildByName("bg").getChildByName("club_rank_info").active = false; // 排行榜详情 
				cc.jsInstance.msgpop.click_close(); //弹窗
				this.node.parent.getChildByName("creatRoomMask").active = false;
				this.set_wanfa_node.active = false;
				// this.quick_join.active = false;

				this.getJoinedClubs(this.clubInfo.id);
				return;
			}
			for (var i = 0; i < this.clubInfo.members.length; i++) {
				if (this.clubInfo.members[i].uid === data.member.uid) { //找到这个状态改变的人
					this.clubInfo.members[i] = data.member;
					break;
				}
			}
		}
	},

	//亲友圈移除管理员
	removeManager(data) {
		if (this.clubInfo && data.club === this.clubInfo.id) { //是当前选中的亲友圈才变化
			if (this.SelfUid() === data.member.uid) { //
				// this.closeAllPop();
				this.setting_club.active = false; //设置页面
				this.setting_club.getChildByName("bg").getChildByName("club_rename").active = false;
				this.wanfa_tips.active = false; //玩法提示
				this.playLog_club.active = false; //战绩 
				this.node.getChildByName("bg").getChildByName("club_record").active = false; //战绩详情
				this.memberSelf_club.active = false; //成员
				this.memberother_club.active = false; //其他亲友圈成员
				this.Club.active = false; //亲友圈
				this.node.getChildByName("bg").getChildByName("club_rank").active = false; //排行榜
				this.node.getChildByName("bg").getChildByName("club_rank_info").active = false; // 排行榜详情 
				cc.jsInstance.msgpop.click_close(); //弹窗
				this.node.parent.getChildByName("creatRoomMask").active = false;
				this.set_wanfa_node.active = false;
				// this.quick_join.active = false;
				this.getJoinedClubs(this.clubInfo.id);
				return;
			}
			for (var i = 0; i < this.clubInfo.members.length; i++) {
				if (this.clubInfo.members[i].uid === data.member.uid) { //找到这个状态改变的人
					this.clubInfo.members[i] = data.member;
					break;
				}
			}
		}
	},


	//某个桌子规则发生变化 （推送）
	onChangeDesktopRule(data) {
		var self = this;
		if (this.clubInfo && data.club === this.clubInfo.id) { //是当前选中的亲友圈才变化
			cc.logManager.info("当前亲友圈某个牌桌玩法 被修改");
			//data.desks // 桌子数  data.desks.length
			//data.desktopRule// 单独桌子的规则
			//data.members  //成员
			//data.desktops  正在玩的牌桌数据.
			//data.rule // 默认规则 如果默认规则不存在 ，弹出设置默认规则
			//修改这个桌子数据
			// this.clubInfo.desktopRule[data.desktop] = data.rule[data.desktop];
			// var wanfa = cc.jsInstance.WanfaStrFormat.setFormatRule(data.rule[data.desktop], true); //[]
			// if (wanfa) {
			//     this.tables[data.desktop - 1].getComponent("club_home_item").xiugaiWanfa(wanfa, cc.jsInstance.WanfaStrFormat.setFormatRule(data.rule[data.desktop], false), data.rule[data.desktop]);
			// } else {
			//     var wanfa = ["不支持玩法"];
			//     this.tables[data.desktop - 1].getComponent("club_home_item").xiugaiWanfa(wanfa, "不支持该玩法", data.rule[data.desktop]);
			// }

			for (var i = 0; i < data.desktops.length; i++) {
				this.clubInfo.desktopRule[data.desktops[i]] = data.rule[data.desktops[i]];
				var wanfa = cc.jsInstance.WanfaStrFormat.setFormatRule(data.rule[data.desktops[i]], true); //[]
				if (wanfa) {
					this.tables[data.desktops[i] - 1].getComponent("club_home_item").xiugaiWanfa(wanfa, cc.jsInstance.WanfaStrFormat.setFormatRule(data.rule[data.desktops[i]], false), data.rule[data.desktops[i]]);
				} else {
					var wanfa = ["不支持玩法"];
					this.tables[data.desktops[i] - 1].getComponent("club_home_item").xiugaiWanfa(wanfa, "不支持该玩法", data.rule[data.desktops[i]]);
				}
			}

			//快速进入牌桌是打开状态 并且桌子号和当前变化的桌子号一样

			if (this.quick_join.active && data.desktops.indexOf(this.quick_join.getComponent("quick_join").getDeskTop()) >= 0) {
				this.quick_join.getComponent("quick_join").initData(this.tables[this.quick_join.getComponent("quick_join").getDeskTop() - 1].getComponent("club_home_item"), this);
			}

		}
	},
	//默认规则发生变化 （推送）
	onChangeClubRule(data) {
		var self = this;
		if (this.clubInfo && data.club === this.clubInfo.id) { //是当前选中的亲友圈才变化
			cc.logManager.info("当前亲友圈默认玩法 被修改");
			this.clubInfo.desktopRule = [];
			this.clubInfo.rule = data.rule;
			for (let i = 0; i < self.tables.length; i++) {
				let node = self.tables[i];
				var wanfa = cc.jsInstance.WanfaStrFormat.setFormatRule(data.rule, true); //[]
				// node.getComponent("club_home_item").xiugaiWanfa(wanfa, cc.jsInstance.WanfaStrFormat.setFormatRule(data.rule, false), data.rule);

				if (wanfa) {
					node.getComponent("club_home_item").xiugaiWanfa(wanfa, cc.jsInstance.WanfaStrFormat.setFormatRule(data.rule, false), data.rule);
				} else {
					var wanfa = ["不支持玩法"];
					node.getComponent("club_home_item").xiugaiWanfa(wanfa, "不支持该玩法", data.rule);
				}
			}
		}
		this.club_home_scro_content.parent.parent.getComponent(cc.ScrollView).scrollToTop(0);
	},

	//亲友圈牌桌玩法修改权限/房卡查看权限是能不能修改 圈主修改  （推送）
	// {pro: "lockWays", status: false, club: 286651}  {pro: "hideCard", status: true, club: 286651} {pro: "immediately", status: true, club: 286651}
	onChangedClubPro(data) {
		var self = this;
		if (this.clubInfo && data.club === this.clubInfo.id) { //是当前选中的亲友圈才变化
			cc.logManager.info("亲友圈牌桌权限 被修改");
			if (data.pro === "lockWays") {
				self.clubInfo.settings.lockWays = data.status;
				for (let i = 0; i < self.tables.length; i++) {
					let node = self.tables[i];
					node.getComponent("club_home_item").isAlowXiugaiWanfa(!data.status);
				}
			} else if (data.pro === "hideCard") { //是否隐藏房卡
				self.clubInfo.settings.hideCard = !data.status;
				if (!data.status) {
					this.fangkaNum.string = cc.jsInstance.native.formatMoney(self.clubInfo.money);
				} else {
					this.fangkaNum.string = "*****";
				}
				if (this.isMyClub || this.mamager) {
					this.fangkaNum.string = cc.jsInstance.native.formatMoney(self.clubInfo.money);
				}
			} else if (data.pro === "immediately") { //人数不足开局
				self.clubInfo.settings.immediately = data.status;
			} else if (data.pro === "closed") { //亲友圈开关
				self.clubInfo.settings.closed = data.status; //false开 亲友圈  true 关亲友圈
				if (data.status) { //是否开启亲友圈  true（关闭了亲友圈）
					self.closeClub.active = true;
					if (this.mamager || this.isMyClub) { //显示亲友圈开启页面
						self.closeClub.getChildByName("close_club_bg").getChildByName("close_other").active = false;
						self.closeClub.getChildByName("close_club_bg").getChildByName("close_quanzhu").active = true;
					} else { //显示亲友圈关闭页面
						self.closeClub.getChildByName("close_club_bg").getChildByName("close_other").active = true;
						self.closeClub.getChildByName("close_club_bg").getChildByName("close_quanzhu").active = false;
					}
				} else { //关闭亲友圈开启和关闭ui
					self.closeClub.active = false;
				}
			}
		}
	},

	//亲友圈桌子数有变化  {"club":286651,"desks":[1,2,3,4,5,6,7,8]} （推送）
	onDesksChange(data) {
		var self = this;
		if (this.clubInfo && data.club === this.clubInfo.id) { //是当前选中的亲友圈才变化
			cc.logManager.info("亲友圈桌子数有变化");
			// this.getJoinedClubs(this.clubInfo.id); //重新初始化一遍
			if (data.desks.length === this.clubInfo.desks.length) { //有时候会走两次
				return;
			}
			this.clubInfo.desks = data.desks;
			this.add_table(data);
		}
		this.show_wanfaNoUi(data); //看是否要显示玩法未设置页面
		this.findShowWaittingDesks(this.showAll);
	},

	//添加桌子  
	add_table(data) {
		var self = this;
		var opt_item;
		if (self.club_home_item_pre_Pool.size() > 0) {
			opt_item = self.club_home_item_pre_Pool.get();
		} else {
			opt_item = cc.instantiate(self.club_home_item_pre);
		}
		self.club_home_scro_content.addChild(opt_item);
		self.club_home_item_pre_Pool_used.push(opt_item);
		var level = cc.jsInstance.clubControler.getMLevel(cc.jsInstance.clubId_Now, data.uid);
		if (level === 9) {
			this.mamager = true;
		} else {
			this.mamager = false;
		}
		opt_item.getComponent("club_home_item").initData(this.clubInfo.id, data.desks.length, this.isMyClub, this.mamager); //亲友圈id 桌子号  是不是圈主
		if (!this.isMyClub) {
			opt_item.getComponent("club_home_item").isAlowXiugaiWanfa(!this.clubInfo.settings.lockWays); //是否可以修改玩法
		}
		var rule = this.clubInfo.rule; //规则
		//转化成自己的规则
		if (rule) {
			var wanfa = cc.jsInstance.WanfaStrFormat.setFormatRule(rule, true); //[]
			// opt_item.getComponent("club_home_item").xiugaiWanfa(wanfa, cc.jsInstance.WanfaStrFormat.setFormatRule(rule, false), rule);

			if (wanfa) {
				opt_item.getComponent("club_home_item").xiugaiWanfa(wanfa, cc.jsInstance.WanfaStrFormat.setFormatRule(rule, false), rule);
			} else {
				var wanfa = ["不支持玩法"];
				opt_item.getComponent("club_home_item").xiugaiWanfa(wanfa, "不支持该玩法", rule);
			}
		}
		this.tables.push(opt_item);
		cc.logManager.info("club_home_item_pre_Pool剩余对象池对象====", self.club_home_item_pre_Pool.size());
	},

	//亲友圈房卡发生变化 {club: 197720, money: 7418} （推送）
	ChangeClubMoney(data) {
		var self = this;
		if (this.clubInfo && data.club === this.clubInfo.id) { //是当前选中的亲友圈才变化
			cc.logManager.info("亲友圈房卡发生变化");
			this.fangkaNum.string = cc.jsInstance.native.formatMoney(data.money);
			this.clubInfo.money = data.money;
			if (!this.mamager && !this.isMyClub && typeof(this.clubInfo.settings.hideCard) != "undefined") {
				if (!this.clubInfo.settings.hideCard) {
					this.fangkaNum.string = "*****";
				}
			}
		}
	},
	//亲友圈 人员状态发生变化  （推送）
	// {appEnd: "majiang", uid: 7638895, club: 286651, props: {"online":"1537546045995"}}
	// {appEnd: "majiang", uid: 7638895, club: 286651, props: {"offline":"1537546259721"}}
	ChangeMemberStatus(data) {
		var self = this;
		if (this.clubInfo && data.club === this.clubInfo.id) { //是当前选中的亲友圈才变化
			cc.logManager.info("亲友圈 人员状态发生变化");
			var member;
			for (var i = 0; i < this.clubInfo.members.length; i++) {
				if (this.clubInfo.members[i].uid === data.uid) { //找到这个状态改变的人
					if (data.props.online) {
						this.clubInfo.members[i].online = data.props.online;
						member = this.clubInfo.members[i];
					}
					if (data.props.offline) {
						this.clubInfo.members[i].offline = data.props.offline;
						member = this.clubInfo.members[i];
					}
					if (data.props.ingame) {
						this.clubInfo.members[i].ingame = data.props.ingame;
						member = this.clubInfo.members[i];
					}
					break;
				}
			}
			var onlineNum = 0;
			for (var i = 0; i < this.clubInfo.members.length; i++) {
				// if (this.clubInfo.members[i].online != "0") { //0 不在线 
				//     onlineNum++;
				// }
				if (this.clubInfo.members[i].online == 0 && this.clubInfo.members[i].offline == 0) { //离线
				} else if (this.clubInfo.members[i].online - this.clubInfo.members[i].offline > 0) {
					onlineNum++;
					if (this.clubInfo.members[i].ingame && this.clubInfo.members[i].ingame.gameid) { //游戏中
					} else { //空闲中
					}
				} else { // 离线 上次登录时间
				}
			}
			this.peopNumOnline.string = onlineNum + "/";
			this.peopNum.string = this.clubInfo.members.length;
			// this.peopNum.string = "总人数：   " + onlineNum + "/" + this.clubInfo.members.length;

			//刷新成员数据和状态
			//是否是自己亲友圈
			if ((this.mamager || this.isMyClub) && this.memberSelf_club.active) { //打开状态才刷新
				this.memberSelf_club.getComponent("club_member_self").init_memberList(this);
			} else if (this.memberother_club.active) { //打开状态才刷新
				//别人的亲友圈
				this.memberother_club.getComponent("club_member_other").init_memberList(this);
			}

			// //刷新桌子状态 
			if (member) {
				if (member.online == 0 && member.offline == 0) { //离线 
					this.ChangeDeskMemberStatus(member, false);
				} else if (member.online - member.offline > 0) {
					this.ChangeDeskMemberStatus(member, true);
					if (member.ingame && member.ingame.gameid) { //游戏中
					} else { //空闲中
					}
				} else { // 离线 上次登录时间
					this.ChangeDeskMemberStatus(member, false);
				}
			}
		}
	},
	//更新所有桌子内 玩家的状态 
	ChangeDeskMemberStatus(member, isOnline) {
		var self = this;
		var uid = member.uid;
		for (var i = 0; i < self.tables.length; i++) {
			var node = self.tables[i];
			var club_home_item = node.getComponent("club_home_item");
			if (club_home_item.tableState != "0") { //游戏中 或者准备中
				if (club_home_item.players && club_home_item.players.length > 0) {
					var isHave;
					for (var j = 0; j < club_home_item.players.length; j++) {
						if (uid === club_home_item.players[j].uid) {
							isHave = true;
							break;
						}
					}
					if (isHave) { //这个成员在这个桌子里 
						club_home_item.ChangeDeskMemberStatus(member, isOnline);
						//快速进入牌桌是打开状态 并且桌子号和当前变化的桌子号一样
						if (this.quick_join.active && this.quick_join.getComponent("quick_join").getDeskTop() === club_home_item.deskNum) {
							// this.quick_join.getComponent("quick_join").changeData(this.tables[club_home_item.deskNum - 1].getComponent("club_home_item"));
							this.quick_join.getComponent("quick_join").initData(this.tables[club_home_item.deskNum - 1].getComponent("club_home_item"), self);
						}
						return;
					}
				}
			}
		}
	},

	// 某人进入某个亲友圈 {club: 324840, uid: 10000114, entryTime: 1537250464265} （推送）
	onEntryClub(data) {
		var self = this;
		if (this.clubInfo && data.club === this.clubInfo.id) { //是当前选中的亲友圈才变化

		}
	},
	// addMember    房主通过新会员入会（推送）
	addMember(data) {
		var self = this;
		if (this.clubInfo && data.club === this.clubInfo.id) { //是当前选中的亲友圈才变化//会走两遍
			cc.logManager.info("房主通过新会员入会");
			for (var i = 0; i < this.clubInfo.members.length; i++) {
				if (this.clubInfo.members[i].uid === data.member.uid) { //已经在里面 return
					return;
				}
			}
			// cc.logManager.info("------addMember之前--------", this.clubInfo.members);
			this.clubInfo.members.push(data.member);
			// cc.logManager.info("------addMember之后--------", this.clubInfo.members);
			var onlineNum = 0;
			for (var i = 0; i < this.clubInfo.members.length; i++) {
				// if (this.clubInfo.members[i].online != "0") { //0 不在线 
				//     onlineNum++;
				// }
				if (this.clubInfo.members[i].online == 0 && this.clubInfo.members[i].offline == 0) { //离线
				} else if (this.clubInfo.members[i].online - this.clubInfo.members[i].offline > 0) {
					onlineNum++;
					if (this.clubInfo.members[i].ingame && this.clubInfo.members[i].ingame.gameid) { //游戏中
					} else { //空闲中
					}
				} else { // 离线 上次登录时间
				}
			}

			this.peopNumOnline.string = onlineNum + "/";
			this.peopNum.string = this.clubInfo.members.length;
			// this.peopNum.string = "总人数：   " + onlineNum + "/" + this.clubInfo.members.length;

			//刷新成员数据和状态
			// if (this.isMyClub) {
			//     this.memberSelf_club.getComponent("club_member_self").init_memberList(this);
			// } else {
			//     //别人的亲友圈
			//     this.memberother_club.getComponent("club_member_other").init_memberList(this);
			// }
		}
	},

	//某人退出或者被圈主踢出去某个亲友圈{club: 286651, member: 7638895} （推送）
	removeMember(data) {
		var self = this;
		if (this.clubInfo && data.club === this.clubInfo.id) { //是当前选中的亲友圈才变化
			cc.logManager.info("某人退出或者被圈主踢出去某个亲友圈");
			for (var i = 0; i < this.clubInfo.members.length; i++) {
				if (this.clubInfo.members[i].uid === data.member) { //找到这个状态改变的人
					this.clubInfo.members.splice(i, 1);
					break;
				}
			}
			var onlineNum = 0;
			for (var i = 0; i < this.clubInfo.members.length; i++) {
				// if (this.clubInfo.members[i].online != "0") { //0 不在线 
				//     onlineNum++;
				// }
				if (this.clubInfo.members[i].online == 0 && this.clubInfo.members[i].offline == 0) { //离线
				} else if (this.clubInfo.members[i].online - this.clubInfo.members[i].offline > 0) {
					onlineNum++;
					if (this.clubInfo.members[i].ingame && this.clubInfo.members[i].ingame.gameid) { //游戏中
					} else { //空闲中
					}
				} else { // 离线 上次登录时间
				}
			}
			this.peopNumOnline.string = onlineNum + "/";
			this.peopNum.string = this.clubInfo.members.length;
			// this.peopNum.string = "总人数：   " + onlineNum + "/" + this.clubInfo.members.length;

			//刷新成员数据和状态
			if (this.isMyClub || this.mamager) {
				if (this.memberSelf_club.active) {
					this.memberSelf_club.getComponent("club_member_self").init_memberList(this);
				}
			} else {
				//别人的亲友圈
				if (this.memberother_club.active) {
					this.memberother_club.getComponent("club_member_other").init_memberList(this);
				}
			}
			//刷新桌子状态  如果这个被踢的人正在游戏中 被圈主踢了，桌子那块显示被踢
			// this.tables[data.desktop - 1].getComponent("club_home_item").cleanDesktop(); //清理牌桌
			for (var i = 0; i < self.tables.length; i++) {
				var node = self.tables[i];
				var club_home_item = node.getComponent("club_home_item");
				club_home_item.isHaveMember(data.member); //检查每个桌子上是不是有这个玩家，有的话 变成被踢出
				//快速进入牌桌是打开状态 并且桌子号和当前变化的桌子号一样 并且有这个用户
				if (this.quick_join.active && this.quick_join.getComponent("quick_join").getDeskTop() === club_home_item.deskNum) {
					if (this.quick_join.getComponent("quick_join").isHaveMember(data.member)) {
						this.quick_join.getComponent("quick_join").initData(this.tables[club_home_item.deskNum - 1].getComponent("club_home_item"), self);
					}
				}
			}	
		}
	},

	// 有人申请加入亲友圈 {"uid":7638895,"nickname":"oXL3Jrtk","timestamp":1537546843901,"clubjoinlist":1} （推送）
	// {"uid":713510,"nickname":"%u4E09%u5341%u4E8C%u4E09%u5341%u4E8C","timestamp":1538064233209,"headimgurl":"","clubjoinlist":1}
	clubJoin(data) {
		var self = this;
		if (!this.isHaveClubSelf) { //没有自己亲友圈
			this.clubs_bottom[5].getChildByName("hongdian").active = false;
			return;
		}
		if (this.clubSelfId === this.clubInfo.id || this.mamager) { //当前亲友圈是自己的亲友圈才行
			cc.logManager.info("有人申请加入亲友圈");
			cc.clubjoinlist = data.clubjoinlist;
			this.isShowHongdian();
			if (this.isMyClub || this.mamager) {
				if (this.memberSelf_club.active) {
					this.memberSelf_club.getComponent("club_member_self").init_apply(this);
				}
			}
		}
	},

	//圈主在成员界面操作 成员申请 后检查是否还需要显示下面成员的那个红点
	isShowHongdian() {
		if (!this.isHaveClubSelf && !this.mamager) { //没有自己亲友圈
			this.clubs_bottom[5].getChildByName("hongdian").active = false;
			return;
		}
		if (this.clubSelfId === this.clubInfo.id || this.mamager) { //当前亲友圈是自己的亲友圈或者是管理员才行
			if (cc.clubjoinlist && cc.clubjoinlist > 0) {
				this.clubs_bottom[5].getChildByName("hongdian").active = true;
			} else {
				this.clubs_bottom[5].getChildByName("hongdian").active = false;
			}
		} else {

		}
		cc.jsInstance.globalUtils.send("club_tip"); //大厅是否显示亲友圈红点
	},
	// 离开亲友圈（被踢出）//自己被踢出亲友圈 {clubId: 286651, clubName: "模拟器1", kick: true} （推送）
	leavedClub(data) {
		var self = this;
		cc.logManager.info("离开亲友圈（被踢出）");
		if (cc.jsInstance.pinfo.pinfo.joinedClubs.length === 0) { //被踢出亲友圈 如果已经没有亲友圈
			this.closeAllPop();
			self.node.active = false;
			cc.jsInstance.clubs = [];
			if (data.clubName) {
				cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("您已被'" + unescape(data.clubName).substr(0, 6) + "'管理员踢出亲友圈！");
			}
		} else {
			this.club.isEnableButton(this.club.clubJoin, true);
			this.clubs_bottom[1].getChildByName("club").active = true;
			if (data.clubName) {
				cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("您已被'" + unescape(data.clubName).substr(0, 6) + "'管理员踢出亲友圈！");
			}
			if (data.clubId === this.clubInfo.id) { //离开的亲友圈是当前选中的亲友圈
				self.setting_club.active = false; //关闭亲友圈里所有页面
				self.playLog_club.active = false; //关闭亲友圈里所有页面
				self.memberother_club.active = false; //关闭亲友圈里所有页面
				var clubId = self.clubs_top_labels[0].club._id; //默认第一个
				this.getJoinedClubs(clubId); //
			} else {
				var bool = false;
				for (var i = 0; i < self.clubs_top_labels.length; i++) { //找到这个上面的亲友圈 最后一个置空，其他重新赋值
					if (self.clubs_top_labels[i].club && self.clubs_top_labels[i].club._id === data.clubId) {
						bool = true;
					}
					// if (self.clubs_top_labels[i].getComponent(cc.Label).string === unescape(data.clubName)) {
					//     bool = true;
					// }
					if (bool) {
						if ((i + 1) >= self.clubs_top_labels.length) {
							self.clubs_top_labels[i].getComponent(cc.Label).string = "";
							self.clubs_top_labels[i].club = null;
						} else {
							self.clubs_top_labels[i].getComponent(cc.Label).string = self.clubs_top_labels[i + 1].getComponent(cc.Label).string;
							self.clubs_top_labels[i].club = self.clubs_top_labels[i + 1].club;
						}
					} else {
						self.clubs_top_labels[i].getComponent(cc.Label).string = self.clubs_top_labels[i].getComponent(cc.Label).string;
						self.clubs_top_labels[i].club = self.clubs_top_labels[i].club;
					}
				}

				for (var i = 0; i < self.clubs_top.length; i++) {
					if (self.clubs_top_labels[i].club && self.clubs_top_labels[i].club._id) {
						var currClubId = self.clubs_top_labels[i].club._id;
						if (currClubId === cc.jsInstance.clubId_Now) {
							self.clubs_top[i].getChildByName("nochoose").active = false;
						} else {
							self.clubs_top[i].getChildByName("nochoose").active = true;
						}
					} else {
						self.clubs_top[i].getChildByName("nochoose").active = true;
					}
				}
				this.clubs_bottom[1].getChildByName("club").active = false; //下面亲友圈打开 被踢出肯定不够5个亲友圈了
				if (data.clubName) {
					cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("您已被'" + unescape(data.clubName).substr(0, 6) + "'管理员踢出亲友圈！");
				}
			}
		}
	},

	// entryDesktop  (可能不是圈主的人修改了玩法，重新给这个桌子赋值)    （推送）    玩家进入牌桌 {club: 197720, uid: 7638895, desktop: 2, tableid: "30545914", createPara: {…}, …}
	entryDesktop(data) {
		var self = this;
		if (this.clubInfo && data.club === this.clubInfo.id) { //是当前选中的亲友圈才变化 

			cc.logManager.info("玩家进入牌桌");
			// cc.logManager.info("entryDesktop加入房间之前- cc.jsInstance.CreatRoomParam----------", cc.jsInstance.CreatRoomParam);
			//设置牌桌玩法
			var rule = data.createPara;
			var wanfa = cc.jsInstance.WanfaStrFormat.setFormatRule(rule, true); //[]
			// this.tables[data.desktop - 1].getComponent("club_home_item").xiugaiWanfa(wanfa, cc.jsInstance.WanfaStrFormat.setFormatRule(rule, false), rule);
			if (wanfa) {
				var rulecon = cc.jsInstance.WanfaStrFormat.setFormatRule(rule, false); //进入牌桌玩法内容
				this.isShowxiugaiEd(rulecon, data.desktop); //判断当前桌子玩法是不是被修改过
				this.tables[data.desktop - 1].getComponent("club_home_item").xiugaiWanfa(wanfa, rulecon, rule);
			} else {
				var wanfa = ["不支持玩法"];
				this.tables[data.desktop - 1].getComponent("club_home_item").xiugaiWanfa(wanfa, "不支持该玩法", rule);
			}
			//获取玩家信息
			var member;
			var members = this.clubInfo.members;
			for (var i = 0; i < members.length; i++) {
				if (data.uid === members[i].uid) {
					member = members[i];
					break;
				}
			}
			this.tables[data.desktop - 1].getComponent("club_home_item").entryDesktop(member, data); //玩家设置给牌桌
			this.desktopsChangeWeihu(1, data); //维护 this.clubInfo.desktops  state === 0 清理mou个桌子  state === 1 某个桌子进来人  state === 2某个桌子有人离开
			cc.logManager.info("玩家进入牌桌后的desktops", this.clubInfo.desktops);
			// cc.logManager.info("entryDesktop加入房间之后----cc.jsInstance.CreatRoomParam-------", cc.jsInstance.CreatRoomParam);
			//快速进入牌桌是打开状态 并且桌子号和当前变化的桌子号一样
			if (this.quick_join.active && this.quick_join.getComponent("quick_join").getDeskTop() === data.desktop) {
				this.quick_join.getComponent("quick_join").initData(this.tables[data.desktop - 1].getComponent("club_home_item"), self);
			}

			this.findShowWaittingDesks(this.showAll);
		}
	},

	//有人玩的桌子状态维护  state === 0 清理mou个桌子  state === 1 某个桌子进来人  state === 2某个桌子有人离开
	desktopsChangeWeihu(state, data) {
		var isCunzai = false;
		if (this.clubInfo.desktops && this.clubInfo.desktops.length > 0) {
			for (var i = 0; i < this.clubInfo.desktops.length; i++) {
				if (data.desktop === parseInt(this.clubInfo.desktops[i].desktop)) { //存在这个桌子  
					isCunzai = true;
					if (state === 0) { //清理mou个桌子
						this.clubInfo.desktops.splice(i, 1);
						return;
					}
					if (this.clubInfo.desktops[i].players.indexOf(data.uid) < 0) { //不存在这个玩家 加入
						if (state === 1) { //某个桌子进来人
							this.clubInfo.desktops[i].players.push(data.uid);
							return;
						}
					} else {
						if (state === 2) { //某个桌子有人离开
							this.clubInfo.desktops[i].players.splice(i, 1);
							if (this.clubInfo.desktops[i].players.length === 0) {
								this.clubInfo.desktops.splice(i, 1);
							}
							return;
						}
					}
				}
			}
		}
		if (!isCunzai && state === 1) { //一开始不存在这个桌子，重新赋值这个桌子给
			var item = {};
			item.desktop = data.desktop;
			item.tableid = data.tableid;
			item.createPara = data.createPara;
			var players = [];
			players.push(data.uid);
			item.players = players;
			this.clubInfo.desktops.push(item);
		}
	},

	// leaveDesktop          有人离开牌桌 {club: 197720, desktop: 3, uid: 711876}  （推送）
	leaveDesktop(data) {
		var self = this;
		if (this.clubInfo && data.club === this.clubInfo.id) { //是当前选中的亲友圈才变化
			cc.logManager.info("玩家离开牌桌");
			this.tables[data.desktop - 1].getComponent("club_home_item").leaveDesktop(data.uid); //玩家设置给牌桌
			this.desktopsChangeWeihu(2, data); //维护 this.clubInfo.desktops  state === 0 清理mou个桌子  state === 1 某个桌子进来人  state === 2某个桌子有人离开
			cc.logManager.info("玩家离开牌桌后的desktops", this.clubInfo.desktops);

			//快速进入牌桌是打开状态 并且桌子号和当前变化的桌子号一样
			if (this.quick_join.active && this.quick_join.getComponent("quick_join").getDeskTop() === data.desktop) {
				// this.quick_join.getComponent("quick_join").changeData(this.tables[data.desktop - 1].getComponent("club_home_item"));
				this.quick_join.getComponent("quick_join").initData(this.tables[data.desktop - 1].getComponent("club_home_item"), self);
			}
		}
	},
	// cleanDesktop          清理牌桌 {club: 197720, desktop: 2} （推送）
	cleanDesktop(data) {
		var self = this;
		if (this.clubInfo && data.club === this.clubInfo.id) { //是当前选中的亲友圈才变化
			//判断当前牌桌是不是被修改过的玩法牌桌，如果是恢复到之前的玩法 然后清理牌桌
			cc.logManager.info("清理牌桌2"); //会走两遍 暂时没处理
			this.cleanDesk(data);
			this.findShowWaittingDesks(this.showAll);
		}
	},

	//清理某个牌桌  //判断当前牌桌是不是被修改过的玩法牌桌，如果是恢复到之前的玩法 然后清理牌桌
	cleanDesk(data) {
		this.tables[data.desktop - 1].getComponent("club_home_item").tableState = "0"; //设置牌桌状态为null
		if (this.clubInfo && this.clubInfo.desktopRule && this.clubInfo.desktopRule[data.desktop]) {
			var rule = this.clubInfo.desktopRule[data.desktop];
			var wanfa = cc.jsInstance.WanfaStrFormat.setFormatRule(rule, true); //[]
			// this.tables[data.desktop - 1].getComponent("club_home_item").xiugaiWanfa(wanfa, cc.jsInstance.WanfaStrFormat.setFormatRule(rule, false), rule);

			if (wanfa) {
				this.tables[data.desktop - 1].getComponent("club_home_item").xiugaiWanfa(wanfa, cc.jsInstance.WanfaStrFormat.setFormatRule(rule, false), rule);
			} else {
				var wanfa = ["不支持玩法"];
				this.tables[data.desktop - 1].getComponent("club_home_item").xiugaiWanfa(wanfa, "不支持该玩法", rule);
			}
		} else {
			if (!this.clubInfo.rule) { //可能没有设置玩法，重新进入下该亲友圈
				this.getJoinedClubs(cc.jsInstance.clubId_Now);
				return;
			}
			var rule = this.clubInfo.rule; //规则
			var wanfa = cc.jsInstance.WanfaStrFormat.setFormatRule(rule, true); //[]
			// this.tables[data.desktop - 1].getComponent("club_home_item").xiugaiWanfa(wanfa, cc.jsInstance.WanfaStrFormat.setFormatRule(rule, false), rule);

			if (wanfa) {
				this.tables[data.desktop - 1].getComponent("club_home_item").xiugaiWanfa(wanfa, cc.jsInstance.WanfaStrFormat.setFormatRule(rule, false), rule);
			} else {
				var wanfa = ["不支持玩法"];
				this.tables[data.desktop - 1].getComponent("club_home_item").xiugaiWanfa(wanfa, "不支持该玩法", rule);
			}
		}
		this.tables[data.desktop - 1].getComponent("club_home_item").cleanDesktop(); //清理牌桌
		this.desktopsChangeWeihu(0, data); //维护 this.clubInfo.desktops  state === 0 清理mou个桌子  state === 1 某个桌子进来人  state === 2某个桌子有人离开
		cc.logManager.info("清理牌桌后的desktops", this.clubInfo.desktops);

		//快速进入牌桌是打开状态 并且桌子号和当前变化的桌子号一样
		if (this.quick_join.active && this.quick_join.getComponent("quick_join").getDeskTop() === data.desktop) {
			this.quick_join.getComponent("quick_join").initData(this.tables[data.desktop - 1].getComponent("club_home_item"), this);
		}
	},

	// clubRoundChange       刷新牌桌局数 {club: "197720", desktop: 1, currentRound: 7}（推送）
	clubRoundChange(data) {
		var self = this;
		if (this.clubInfo && data.club === this.clubInfo.id) { //是当前选中的亲友圈才变化
			cc.logManager.info("刷新牌桌局数");
			if (data.currentRound < 0) {
				this.tables[data.desktop - 1].getComponent("club_home_item").setShengyu(0, "圈", data); //剩余局数
			} else {
				this.tables[data.desktop - 1].getComponent("club_home_item").setShengyu(data.currentRound - 1, "局", data); //剩余局数
			}
			//快速进入牌桌是打开状态 并且桌子号和当前变化的桌子号一样
			if (this.quick_join.active && this.quick_join.getComponent("quick_join").getDeskTop() === data.desktop) {
				// this.quick_join.getComponent("quick_join").changeData(this.tables[data.desktop - 1].getComponent("club_home_item"));
				this.quick_join.getComponent("quick_join").initData(this.tables[data.desktop - 1].getComponent("club_home_item"), self);
			}
			this.findShowWaittingDesks(this.showAll);
		}
	},
	// invitePlayer2Desk     被邀请进入牌桌(推送)
	invitePlayer2Desk(data) {
		var self = this;
		cc.logManager.info("被邀请进入牌桌");
		this.club_invite.getComponent("club_invite").initData(data, this);
	},

	//判断这个成员是不是亲友圈成员 有可能被踢了
	isMember(uid) {
		for (var i = 0; i < this.clubInfo.members.length; i++) {
			if (uid === this.clubInfo.members[i].uid) {
				return true;
			}
		}
		return false;
	},

	//当前所有开局桌子需要支付的房卡
	needpayMoney(param, round, clubId) {
		var needPay = 0;
		for (var i = 0; i < param.length; i++) {
			needPay += param[i].createPara.money;
		}
		cc.logManager.info("needPay -========其他牌桌预扣================  " + needPay);
		if (typeof(round) == "number") {
			needPay += round;
		} else {
			if (round == "round1") {
				needPay = needPay + 1;
			} else if (round == "round4") {
				needPay += 2;
			} else if (round == "round8" || round == "circle1") {
				needPay += 3;
			} else if (round == "roundz8") {
				needPay += 2;
			} else if (round == "roundz16") {
				needPay += 3;
			}
		}
		//如果亲友圈限免开放  返回0
		for (var j = 0; j < cc.jsInstance.clubs.length; j++) {
			if (cc.jsInstance.clubs[j]._id === clubId) {
				if (cc.jsInstance.clubs[j].config && cc.jsInstance.clubs[j].config.free.start && cc.jsInstance.clubs[j].config.free.end) {
					var start = cc.jsInstance.native.getTimestamp(cc.jsInstance.clubs[j].config.free.start); //亲友圈限免开始时间
					var end = cc.jsInstance.native.getTimestamp(cc.jsInstance.clubs[j].config.free.end); //亲友圈限免结束时间
					var tickServer = cc.jsInstance.tickServer; //当前服务器时间
					if (tickServer <= end) {
						needPay = 0;
						var time = cc.jsInstance.clubs[j].config.free.start + " 到" + cc.jsInstance.clubs[j].config.free.end
						cc.logManager.info('亲友圈限免：' + time);
					}
				}
				break;
			}
		}
		cc.logManager.info('needPay========最后支付房卡=====' + needPay);
		return needPay;
	},
	//检查当前亲友圈房卡够不够开这个局  传过来当前桌子的局数
	isCanStart(round, clubId) {
		var self = this;
		var allMoney = this.clubInfo.money;
		var param = [];
		// for (var i = 0; i < this.clubInfo.desks.length; i++) {
		//     if (self.tables[i].getComponent("club_home_item").tableState === "2") { //然后挑出 正在游戏中的牌桌 剔除  0空桌子  1正在匹配中 2游戏中
		//         param.push(self.tables[i].getComponent("club_home_item").createPara);
		//     } else if (self.tables[i].getComponent("club_home_item").tableState === "0") {} else if (self.tables[i].getComponent("club_home_item").tableState === "1") {
		//         param.push(self.tables[i].getComponent("club_home_item").createPara);
		//     }
		// }
		if (parseInt(allMoney) - this.needpayMoney(this.clubInfo.desktops, round, clubId) < 0) {
			return false;
		} else {
			return true;
		}
	},

	//点击上面的某个俱乐部
	clubs_click(club_id) {
		var self = this;
		this.click_club = true;
		this.getJoinedClubs(club_id);
	},
	//打开亲友圈 打开亲友圈（自己建的亲友圈关闭界面的那个开启按钮）
	open_click() {
		cc.jsInstance.network.setClubPro("closed", false, function(rtn) {
			if (rtn.result === 0) {} else {}
		});
	},
	//设置
	setting_click() {
		var self = this;
		cc.jsInstance.network.getJoinedClubs(function(rtn) {
			cc.logManager.info("获取玩家所有的俱乐部消息");
			if (rtn.result === 0) {
				self.clubs = rtn.clubs;
				self.setting_club.getComponent("club_setting").initData(self, self.isMyClub, self.clubs, self.mamager); //有没有自己的亲友圈，没有隐藏上面部分 
			} else {
				cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(rtn.msg);
			}
		});
	},
	//购买房卡
	buyfangka_click() {
		this.club_buy_fangka.getComponent("buy_fangka").initData(this);
	},
	//成员
	member_click() {
		if (this.clubInfo && !this.clubInfo.rule && (this.isMyClub || this.mamager)) { //默认规则
			this.open_club_create_tips();
			return;
		}
		//是否是自己亲友圈
		if (this.isMyClub) {
			this.memberSelf_club.getComponent("club_member_self").initData(this, true);
		} else {
			var Level = cc.jsInstance.clubControler.getMLevel();
			if (Level === 9) {
				this.memberSelf_club.getComponent("club_member_self").initData(this, false);
			} else {
				//别人的亲友圈
				this.memberother_club.getComponent("club_member_other").initData(this);
			}
		}

	},

	//是否显示玩法未设置ui
	show_wanfaNoUi(data) {
		if (this.clubInfo && !this.clubInfo.rule && (this.isMyClub || this.mamager)) { //默认规则
			this.open_club_create_tips();
			return true;
		} else if (this.clubInfo && !this.clubInfo.rule && !this.isMyClub) { //不是自己亲友全的牌桌未设置
			if (data) {
				return true;
			}
			cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("牌桌未设置玩法，请联系房主设置牌桌玩法！", function() {
				cc.jsInstance.audioManager.playBtnClick();
			});
			return true;
		} else if (this.clubInfo && !this.clubInfo.rule && this.mamager) {
			this.open_club_create_tips();
			return true;
		}
		return false;
	},
	//战绩
	zhanji_click() {
		this.playLog_club.getComponent("club_playLog").initData(this);
	},
	//快速加入 只能加入默认玩法
	quick_click() {
		//没有默认玩法的时候弹出来
		if (!this.clubInfo || !this.clubInfo.desktopRule) {
			return;
		}
		// if (this.clubInfo.desks.length === this.clubInfo.desktopRule.length) {
		//     cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("暂无“默认玩法牌桌“可加入，请稍后再试！");
		//     return;
		// }
		this.quick();
	},
	quick() {
		var self = this;
		if (this.clubInfo && this.clubInfo.settings.closed) {
			cc.jsInstance.bayWindow.openBayWindow("亲友圈已被房主暂时关闭，快去喊他打开亲友圈吧！");
			return;
		}
		// var moRenCanJoinDesks_null = []; //默认可加入的空桌子
		// var moRenCanJoinDesks_wait = []; //默认可加入的正在匹配等待中的桌子
		// for (var i = 0; i < this.clubInfo.desks.length; i++) {
		//     if (this.clubInfo.desktopRule[this.clubInfo.desks[i]]) { //先剔除掉不是默认的牌桌
		//         continue;
		//     }
		//     if (self.tables[i].getComponent("club_home_item").tableState === "2") { //然后挑出 正在游戏中的牌桌 剔除  0空桌子  1正在匹配中 2游戏中
		//         continue;
		//     } else if (self.tables[i].getComponent("club_home_item").tableState === "0") {
		//         moRenCanJoinDesks_null.push((self.tables[i])); //挑出来 默认的 空桌子和正在等待匹配中的桌子
		//     } else if (self.tables[i].getComponent("club_home_item").tableState === "1") {
		//         moRenCanJoinDesks_wait.push((self.tables[i])); //挑出来 默认的 空桌子和正在等待匹配中的桌子
		//     }
		// }
		// if (moRenCanJoinDesks_wait.length > 0) { //正在准备中的桌子 在里面选
		//     var peopNum = moRenCanJoinDesks_wait[0].playerNum; //默认玩法的人数 4 3 2
		//     // 牌桌玩家数右多到少排序
		//     moRenCanJoinDesks_wait.sort(function(a, b) {
		//         return b.getComponent("club_home_item").players.length - a.getComponent("club_home_item").players.length;
		//     });
		//     moRenCanJoinDesks_wait[0].getComponent("club_home_item").join_click();

		// } else if (moRenCanJoinDesks_null.length > 0) { //加入默认空牌桌的第一个
		//     moRenCanJoinDesks_null[0].getComponent("club_home_item").join_click();
		// } else {
		//     cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("暂无“默认玩法牌桌“可加入，请稍后再试！");
		// }
		this.quick_show();
	},

	quick_show() {
		var self = this;
		// 缺1人>缺2人>缺3人>空桌子>全部坐满了
		var desks_1 = []; //差1人开局
		var desks_2 = []; //差2人开局
		var desks_3 = []; //差3人开局
		var desks_4 = []; //差4人开局
		// var desks_null = []; //空桌子
		for (var i = 0; i < this.clubInfo.desks.length; i++) {
			var desk = self.tables[i].getComponent("club_home_item");
			if (self.tables[i].getComponent("club_home_item").nowanfa.active) { //小游戏不支持的玩法
				continue;
			}
			if (desk.tableState === "2") { // 2游戏中
				continue;
			} else if (desk.tableState === "0") { //0空桌子
				// desks_null.push(self.tables[i].getComponent("club_home_item"));
				if (desk.playerNum === 4) {
					desks_4.push(self.tables[i].getComponent("club_home_item"));
				} else if (desk.playerNum === 3) {
					desks_3.push(self.tables[i].getComponent("club_home_item"));
				} else if (desk.playerNum === 2) {
					desks_2.push(self.tables[i].getComponent("club_home_item"));
				}
			} else if (desk.tableState === "1") { //1正在匹配中
				for (var j = 0; j < desk.players.length; j++) { //踢出掉没用的信息
					if (!desk.players[j].uid) {
						for (var z = 0; z < desk.players.length; z++) {
							if (z != j && desk.players[j] === desk.players[z].uid) {
								desk.players.splice(j, 1);
								break;
							}
						}
					}
				}
				var num = desk.playerNum - desk.players.length;
				if (num === 1) {
					desks_1.push(self.tables[i].getComponent("club_home_item"));
				} else if (num === 2) {
					desks_2.push(self.tables[i].getComponent("club_home_item"));
				} else if (num === 3) {
					desks_3.push(self.tables[i].getComponent("club_home_item"));
				}
			}
		}
		cc.logManager.info("desks_tops=", this.clubInfo.desktops);
		cc.logManager.info("desks_1=", desks_1);
		cc.logManager.info("desks_2=", desks_2);
		cc.logManager.info("desks_3=", desks_3);
		cc.logManager.info("desks_4=", desks_4);
		// cc.logManager.info("desks_null=", desks_null);
		if (desks_1 && desks_1.length > 0) { //加入差1人开局
			// desks_1[0].getComponent("club_home_item").join_click();
			this.quick_join.getComponent("quick_join").initData(desks_1[0], this);
		} else if (desks_2 && desks_2.length > 0) { //加入差2人开局
			// desks_2[0].getComponent("club_home_item").join_click();
			this.quick_join.getComponent("quick_join").initData(desks_2[0], this);
		} else if (desks_3 && desks_3.length > 0) { //加入差3人开局
			// desks_3[0].getComponent("club_home_item").join_click();
			this.quick_join.getComponent("quick_join").initData(desks_3[0], this);
		} else if (desks_4 && desks_4.length > 0) { //加入空桌子
			// desks_null[0].getComponent("club_home_item").join_click();
			this.quick_join.getComponent("quick_join").initData(desks_4[0], this);
		} else {
			cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("牌桌已满，请稍后再试！");
		}

	},

	//排行榜
	rank_click() {
		this.rank_club.getComponent("club_rank").initData(this);
	},
	//默认玩法设置 （第一次创建亲友圈提示里面的确定 共用）
	wanfa_click(e, custom) {
		if (this.club_create_tips.active) {
			this.club_create_tips.active = false;
		}
		if (custom === "wanfa") { //批量修改玩法
			if (this.clubInfo && !this.clubInfo.rule) { //如果第一次创建亲友圈没有设置默认玩法，点击玩法提示默认玩法
				this.club_create_tips.active = true;
			} else {
				this.set_wanfa_node.getComponent("set_wanfa").initData(this);
			}
		} else { // 修改默认玩法
			this.node.parent.getChildByName("creatRoomMask").active = true;
			this.node.parent.getChildByName("creatRoomMask").getComponent("createRoomMask").isClub_In(true, true);
		}

	},

	//批量修改玩法传过来的药修改的桌子号
	setPiliangwanfa(wanfas) {
		this.set_wanfas = wanfas;
	},

	//玩法修改回来 
	//1.修改所有玩法 显示新改的玩法 并更新 每个玩法的 club_home_item_pre 的ui
	//2.修改某个牌桌玩法 更新这个club_home_item_pre 的ui
	wanfa_click_callback(param, all, WanfaName, num) { //all是不是修改所有玩法  num 修改某个牌桌玩法(没有代表所有牌桌)  WanfaName 从选择玩法参数界面返回的玩法类型名字
		var self = this;
		var wanfa = cc.jsInstance.WanfaStrFormat.getWanfaStrFormat(WanfaName, true); //[]
		if (all) { //修改的所有的玩法
			if (this.set_wanfas && this.set_wanfas.length > 0) {
				cc.jsInstance.network.ChangeDesktopRule(this.clubInfo.id, this.set_wanfas, param, function(rtn) {
					if (rtn.result === 0) { //批量修改玩法成功
						var desksStr = self.set_wanfas.join(",") + "号桌";
						self.wanfa_tips_layout.parent.parent.getChildByName("label_bg").getChildByName("label").getComponent(cc.Label).string = desksStr + " 玩法设置成功";
						self.set_wanfas = [];
						self.wanfa_tips.active = true;
						for (let i = 0; i < self.wanfa_tips_layout.childrenCount; i++) {
							if (i < wanfa.length) {
								self.wanfa_tips_layout.children[i].active = true;
								self.wanfa_tips_layout.children[i].getChildByName("con").getComponent(cc.Label).string = wanfa[i];
							} else {
								self.wanfa_tips_layout.children[i].active = false;
							}
						}
					}
				});
			} else {
				cc.jsInstance.network.modifyClubDefaultRule(param, function(rtn) {
					if (rtn.result === 0) { //修改默认玩法成功
						var desksStr = self.clubInfo.desks.join(",") + "号桌";
						self.wanfa_tips_layout.parent.parent.getChildByName("label_bg").getChildByName("label").getComponent(cc.Label).string = desksStr + " 玩法设置成功";
						self.wanfa_tips.active = true;
						for (let i = 0; i < self.wanfa_tips_layout.childrenCount; i++) {
							if (i < wanfa.length) {
								self.wanfa_tips_layout.children[i].active = true;
								self.wanfa_tips_layout.children[i].getChildByName("con").getComponent(cc.Label).string = wanfa[i];
							} else {
								self.wanfa_tips_layout.children[i].active = false;
							}
						}
					}
				});
			}

		} else {
			if (!self.isMyClub && !self.mamager) { //如果修改的不是自己亲友圈的 单独桌子玩法，修改完成后加入这个桌子
				//改变玩法 然后加入游戏
				var wanfa = cc.jsInstance.WanfaStrFormat.setFormatRule(param, true); //[]
				// this.tables[num - 1].getComponent("club_home_item").xiugaiWanfa(wanfa, cc.jsInstance.WanfaStrFormat.setFormatRule(param, false), param);

				if (wanfa) {
					this.tables[num - 1].getComponent("club_home_item").xiugaiWanfa(wanfa, cc.jsInstance.WanfaStrFormat.setFormatRule(param, false), param);
				} else {
					var wanfa = ["不支持玩法"];
					this.tables[num - 1].getComponent("club_home_item").xiugaiWanfa(wanfa, "不支持该玩法", param);
				}

				self.tables[num - 1].getComponent("club_home_item").join_click(); //加入这个牌桌
				return;
			}
			cc.jsInstance.network.ChangeDesktopRule(this.clubInfo.id, num, param, function(rtn) {
				if (rtn.result === 0) { //修改默认玩法成功 
					// cc.jsInstance.bayWindow.openBayWindow(num + "号桌 玩法修改成功");
					var desksStr = num + "号桌";
					self.wanfa_tips_layout.parent.parent.getChildByName("label_bg").getChildByName("label").getComponent(cc.Label).string = desksStr + " 玩法设置成功";
					self.wanfa_tips.active = true;
					for (let i = 0; i < self.wanfa_tips_layout.childrenCount; i++) {
						if (i < wanfa.length) {
							self.wanfa_tips_layout.children[i].active = true;
							self.wanfa_tips_layout.children[i].getChildByName("con").getComponent(cc.Label).string = wanfa[i];
						} else {
							self.wanfa_tips_layout.children[i].active = false;
						}
					}
				}
			});
		}
	},

	//判断当前桌子玩法是不是被修改过
	isShowxiugaiEd(rulecon, desktop) {
		var ruleconDesktop;
		if (this.clubInfo.desktopRule && this.clubInfo.desktopRule.length > 0 && this.clubInfo.desktopRule[desktop]) {
			ruleconDesktop = cc.jsInstance.WanfaStrFormat.setFormatRule(this.clubInfo.desktopRule[desktop], true); //进入牌桌玩法内容
		} else {
			// ruleconDesktop = cc.jsInstance.WanfaStrFormat.setFormatRule(this.clubInfo.rule, false); //进入牌桌玩法内容
			ruleconDesktop = this.tables[parseInt(desktop) - 1].getComponent("club_home_item").tipsContent.string;
		}
		if (ruleconDesktop === rulecon) {
			this.tables[desktop - 1].getComponent("club_home_item").setYixiugaiActive(false);
		} else {
			this.tables[desktop - 1].getComponent("club_home_item").setYixiugaiActive(true);
		}
	},

	//打开第一次创建亲友圈提示
	open_club_create_tips() {
		this.club_create_tips.active = true;
	},
	//点击亲友圈
	club_click() {
		// this.node.parent.getChildByName("club").active = true;
		this.Club.active = true;
	},

	//加入别人亲友圈 牌桌 房卡不足弹出这个提示
	fangka_short() {
		this.rechargeMask.getComponent("rechargeMask").initData(true); //是不是亲友圈页面弹出的
	},

	//圈主自己加入自己牌桌 房卡不足 提示
	myfangka_short() {
		this.my_fangka_buzu_tips.active = true;
	},
	//圈主自己加入自己牌桌 房卡不足 提示 里面的前往
	my_fangka_buzu_tips_go() {
		this.my_fangka_buzu_tips.active = false;
		this.club_buy_fangka.getComponent("buy_fangka").initData("data");
	},
	//圈主自己加入自己牌桌 房卡不足 提示 里面的关闭
	my_fangka_buzu_tips_close() {
		this.my_fangka_buzu_tips.active = false;
	},
	//圈主自己加入自己牌桌 房卡不足 提示 里面的取消
	my_fangka_buzu_tips_cancel() {
		this.my_fangka_buzu_tips.active = false;
	},

	//初始化对象池 
	initPool() {
		var self = this;
		self.club_home_item_pre_Pool = new cc.NodePool();
		let initCount = 23; //对象池数量
		for (let i = 0; i < initCount; ++i) {
			var opt_item = cc.instantiate(self.club_home_item_pre); // 创建节点
			self.club_home_item_pre_Pool.put(opt_item); // 通过 putInPool 接口放入对象池
		}
		// cc.logManager.info("club_home_item_pre_Pool对象池size====", self.club_home_item_pre_Pool.size());
		self.club_home_item_pre_Pool_used = []; //
	},
	//切换亲友圈需要把所有对象还给对象池并初始化 以便其他亲友圈使用
	backPool() {
		var self = this;
		for (var i = 0; i < this.club_home_item_pre_Pool_used.length; i++) {
			self.club_home_item_pre_Pool_used[i].getComponent("club_home_item").init();
			self.club_home_item_pre_Pool.put(this.club_home_item_pre_Pool_used[i]); //将对象返回对象池
		}
	},
	//清空对象池
	destroyPool() {
		this.club_home_item_pre_Pool.clear(); // 调用这个方法就可以清空对象池
	},
	// 组件实例销毁的时候调用
	onDestroy() {
		this.destroyPool(); //清空对象池
	},
	//关闭亲友圈所有弹窗
	closeAllPop() {
		this.setting_club.active = false; //设置页面
		this.setting_club.getChildByName("bg").getChildByName("club_rename").active = false;
		this.wanfa_tips.active = false; //玩法提示
		this.playLog_club.active = false; //战绩 
		this.node.getChildByName("bg").getChildByName("club_record").active = false; //战绩详情
		this.memberSelf_club.active = false; //成员
		this.memberother_club.active = false; //其他亲友圈成员
		this.Club.active = false; //亲友圈
		this.node.getChildByName("bg").getChildByName("club_rank").active = false; //排行榜
		this.node.getChildByName("bg").getChildByName("club_rank_info").active = false; // 排行榜详情 
		cc.jsInstance.msgpop.click_close(); //弹窗
		this.node.parent.getChildByName("creatRoomMask").active = false;
		this.set_wanfa_node.active = false;
		this.quick_join.active = false;
	},

	findShowWaittingDesks_click(e, custom) {
		this.showAll = !this.showAll;
		this.ShowWaittingChoose.isChecked = this.showAll;
		this.findShowWaittingDesks(this.showAll);

	},

	//查找正等待匹配中的桌子
	findShowWaittingDesks(showAll) { //showAll 0 查找正在等待匹配的桌子其他隐藏  1 显示所有的
		if (!this.clubInfo || !this.clubInfo.desks || this.clubInfo.desks.length === 0) {
			return;
		}
		if (!this.showAll) {
			this.showAll = false;
		}
		var numWaittingDesks = 0;
		for (var i = 0; i < this.clubInfo.desks.length; i++) {
			if (showAll) {
				this.tables[i].active = true;
				if (this.tables[i].getComponent("club_home_item").tableState === "1") { //正在匹配的桌子挑出来 显示
					numWaittingDesks++;
				}
			} else {
				if (this.tables[i].getComponent("club_home_item").tableState === "1") { //正在匹配的桌子挑出来 显示
					numWaittingDesks++;
					this.tables[i].active = true;
				} else {
					this.tables[i].active = false;
				}
			}
		}

		this.ShowWaitting.string = "等待中 " + numWaittingDesks + "桌";
	},

	SelfUid() {
		return cc.jsInstance.data.pinfo.uid
	},
});