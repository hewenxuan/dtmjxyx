/**
 * 负责显示牌桌内的结算页面
 */

var goldGameEnd = {
	continueMJPlayground: continueMJPlayground,
	recontinueMJPlayground: recontinueMJPlayground,
	balanceNotEnough: balanceNotEnough,
	checkbuyCon: checkbuyCon,
	buy_gold: buy_gold,
	recontinueNextGame: recontinueNextGame,
	lookforTodayLeftTimes: lookforTodayLeftTimes,

}

//金币场
function continueMJPlayground(waitNode, endOne) {
	if (endOne) {
		this.endOne = endOne;
	}
	var self = this;
	cc.jsInstance.network.continueMJPlayground(cc.jsInstance.data.incontest, function(res) {
		cc.logManager.info("继续比赛");
		if (res.result === 0) {
			cc.logManager.info("进入等待匹配状态-----------------");
			waitNode.OpenWaitting(cc.jsInstance.data.incontestUniqueId, function() {});
		} else {
			self.recontinueMJPlayground(waitNode);
		}
	});
}

function recontinueMJPlayground(waitNode,endOne ) {
	if (endOne) {
		this.endOne = endOne;
	}
	// cc.jsInstance.data.fid; 暂存上一场的fid
	// cc.jsInstance.data.GM; 暂存上一场的GM
	var self = this;
	var coin = cc.jsInstance.pinfo.pinfo.coin;
	this.fid = cc.jsInstance.data.fid;
	switch (cc.jsInstance.data.GM) {
		case "GM1":
			if (parseInt(coin) < parseInt(cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM1.coin)) { //金币不足最低场次的金币，去看能不能领取救济金
				self.lookforTodayLeftTimes();
				return;
			}
			break;
		case "GM2":
			if (parseInt(coin) < parseInt(cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM2.coin)) { //金币不满足gm2
				self.balanceNotEnough("GM2");
				return;
			}
			break;
		case "GM3":
			if (parseInt(coin) < parseInt(cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM3.coin)) { //金币不满足gm3
				self.balanceNotEnough("GM3");
				return;
			}
			break;
		case "GM4":
			if (parseInt(coin) < parseInt(cc.jsInstance.data.gameInfo.majiang.goldCon.playground.GM4.coin)) { //金币不满足gm4
				self.balanceNotEnough("GM4");
				return;
			}
			break;
	}

	self.recontinueNextGame(waitNode);

}

function balanceNotEnough(gm) {
	var self = this;
	var storeGold = "";
	var num = 0;
	switch (gm) {
		case "GM1":
			storeGold = "store_gold_2"
			num = 2;
			break;
		case "GM2":
			storeGold = "store_gold_10"
			num = 10;
			break;
		case "GM3":
			storeGold = "store_gold_20"
			num = 20;
			break;
		case "GM4":
			storeGold = "store_gold_30"
			num = 30;
			break;
	}
	cc.jsInstance.msgpop.showMsg_buygold(num, function() {
		if (self.checkbuyCon(num)) {
			self.buy_gold(storeGold);
		} else {
			self.endOne.active = true;
		}
	}, function() {
		cc.logManager.info("----funfangqi-----");
		self.endOne.active = true;
	}, function() {
		cc.logManager.info("----funclose-----");
		self.endOne.active = true;
	});
}


//g购买金币前检查
function checkbuyCon(money) {
	if (cc.jsInstance.pinfo.pinfo.money && parseInt(cc.jsInstance.pinfo.pinfo.money) < money) {
		cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("元宝不足！", function() {
			cc.jsInstance.audioManager.playBtnClick();
			cc.logManager.info("ok!!!!!");
		});
		return false;
	}
	var subMoney = parseInt(cc.jsInstance.pinfo.pinfo.money) - money;
	if (parseInt(subMoney) < 3) { //兑换金币后，元宝数量少于3个，无法兑换！
		cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("兑换金币后，元宝数量少于3个，无法兑换！", function() {
			cc.jsInstance.audioManager.playBtnClick();
		});
		return false;
	}
	return true;
}

function buy_gold(store_gold) {
	var self = this;
	cc.jsInstance.network.buyCoinBySycee(store_gold, function(res) {
		cc.logManager.info("购买金币!!!!!");
		if (res.result === 0) {
			cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("购买成功！", function() {
				cc.jsInstance.audioManager.playBtnClick();
				self.endOne.active = true;
			});
		} else if (res.result === 1) {
			cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("元宝不足！", function() {
				cc.jsInstance.audioManager.playBtnClick();
				self.endOne.active = true;
			});
			return;
		} else {
			cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(res.msg, function() {
				cc.jsInstance.audioManager.playBtnClick();
				self.endOne.active = true;
			});
			return;
		}
	});
}

function recontinueNextGame(waitNode) {
	var self = this;
	self.endOne.active = false;
	if (!self.fid) {
		self.fid = cc.jsInstance.data.incontest;
	}
	if (!self.fid) {
		self.fid = cc.jsInstance.data.fid;
	}
	if (!self.fid) {
		cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("加入房间失败，请重新匹配！", function() {
			cc.jsInstance.audioManager.playBtnClick();
			self.loadLobby();
		});
		return;
	}
	cc.jsInstance.network.joinMJPlayground(self.fid, function(res) {
		cc.logManager.info("继续比赛!!!!!");
		if (res.result === 0) {
			//显示匹配等待界面
			cc.jsInstance.data.incontest = res.fid;
			cc.jsInstance.data.incontestUniqueId = res.uniqueId; //GM
			cc.logManager.info("进入等待匹配状态==");
			var GM = cc.jsInstance.data.GM;
			if (GM) {
				waitNode.OpenWaitting(GM, function() {});
			}
		} else {
			cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(res.msg, function() {
				cc.jsInstance.audioManager.playBtnClick();
				waitNode.leave_gold(self.fid);
			});
		}
	});
}

function lookforTodayLeftTimes() {
	var self = this;
	cc.jsInstance.network.getSupplementaryCount(function(res) { //查询金币补助领取次数
		cc.logManager.info("今日金币补助领取次数");
		if (res.result === 0) {
			self.count = parseInt(res.count) + 1;
			var times = cc.jsInstance.data.gameInfo.majiang.goldCon.supplementaryCoin.times; //一共能够领取的总次数
			if (parseInt(self.count) <= parseInt(times)) { //领取次数小于最大的领取次数，去领取
				cc.jsInstance.msgpop.showMsg_buzhu("您的金币不足，系统赠送您8000金币，今天第" + self.count + "次领取，一共可领取" + times + "次/天！", function() {
					cc.jsInstance.audioManager.playBtnClick();
					cc.logManager.info("funlingqu");
					cc.jsInstance.network.receiveSupplementaryCoin(function(res) { //领取救济金
						cc.logManager.info("金币补助领取成功:", res);
						if (res.result === 0) {
							cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("领取成功！", function() {
								cc.logManager.info("--funOk--");
								self.endOne.active = true;
							});
							return;
						} else {
							cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(res.msg, function() {
								cc.jsInstance.audioManager.playBtnClick();
							});
							return;
						}
					});
				}, function() {
					cc.logManager.info("----funclose-----");
					self.endOne.active = true;
				});
			} else {
				self.balanceNotEnough("GM1"); //金币不足去购买
			}
		} else {
			cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(res.msg, function() {
				cc.jsInstance.audioManager.playBtnClick();
			});
			return;
		}
	});
}

module.exports = goldGameEnd;