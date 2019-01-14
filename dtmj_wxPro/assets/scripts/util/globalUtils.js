const ZJHCode = require('ZJHCode');
const msgNatives = require('msgNativesTest'); //本地公告测试 
cc.Class({
    extends: cc.Component,
    properties: {
        dataEventHandler: null
    },
    onLoad() {},
    start() {},
    send(evt, data) {
        if (this.dataEventHandler) {
            this.dataEventHandler.emit(evt, data)
        }
    },
    getColumn(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        } else {
            return null;
        }
    },

    needShowTingIcon() {
        var tData = cc.jsInstance.data.sData.tData;
        var needShowTing = false;
        if (tData.yulin || tData.king ||
            (tData.gameKind && tData.gameKind == "xyPoint")) {
            needShowTing = true;
        }
        return needShowTing;
    },

    init() {
        var self = this;
        cc.jsInstance.iscontinue = true; //弹窗短线用
        cc.jsInstance.native = {

            getWXku(callback) {
                if (cc.jsInstance.getWXkuTime) {
                    if ((cc.jsInstance.tickServer - cc.jsInstance.getWXkuTime) < 5 * 1000) { //离上次取的时间超过5分钟  取存的数据
                        cc.logManager.info("--本地获取微信库---", cc.jsInstance.WxNum);
                        if (callback) {
                            callback(cc.jsInstance.WxNum);
                        }
                        return;
                    }
                }
                //不存在或者时间超过5分钟
                cc.jsInstance.network.getWXKu(function(data) {
                    if (data.weixinKu) { //微信库数组存在
                        //随机取一个
                        var random = Math.floor(Math.random() * (data.weixinKu.length)); // 0 ,1
                        cc.jsInstance.WxNum = data.weixinKu[random];
                        cc.jsInstance.getWXkuTime = cc.jsInstance.tickServer; //当前获取的事件改为服务器时间
                        cc.logManager.info("--远程获取微信库---", cc.jsInstance.WxNum);
                        if (callback) {
                            callback(cc.jsInstance.WxNum);
                        }
                    }
                }, function(err) {
                    var weixinKu = ["DTKEFU21", "DTYXKF26", "DTKEHU001", "DTKEFU073", "DTKEFU200", "DTKEFU209", "datangyouxi20", "DTKEFU082", "DTKEFU206", "DTKEFU148", "DTKEHU019", "DTYXKF49", "DTKEFU054", "DTKEFU033"];
                    var random = Math.floor(Math.random() * (weixinKu.length)); // 0 ,1
                    cc.jsInstance.WxNum = weixinKu[random];
                    cc.logManager.error("--远程获取微信库---", cc.jsInstance.WxNum);
                    cc.jsInstance.getWXkuTime = cc.jsInstance.tickServer; //当前获取的事件改为服务器时间
                    if (callback) {
                        callback(weixinKu[random]);
                    }
                });

                // var wxKu = cc.jsInstance.remoteCfg.weixinKu;
                // var random = Math.floor(Math.random() * (wxKu.length )); // 0 ,1
                // cc.jsInstance.WxNum = wxKu[random];
                // cc.jsInstance.getWXkuTime = cc.jsInstance.tickServer; //当前获取的事件改为服务器时间
                // console.log("--远程获取微信库---", random);
                // console.log("--远程获取微信库---", cc.jsInstance.WxNum);
                // return cc.jsInstance.WxNum;
            },

            //阿拉丁自定义埋点数据 '事件名称'   {'参数key': '参数value'}
            sendALDEvent(event, data) {
                if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                    if (!data) {
                        data = {};
                    }
                    data.uid = cc.jsInstance.pinfo.pinfo.uid;
                    data.nickname = unescape(cc.jsInstance.pinfo.pinfo.nickname);
                    // wx.aldSendEvent(event, data);
                }
            },


            // showUserInfoButton() {
            //     if (wx.createUserInfoButton) {
            //         cc.logManager.info("-----createUserInfoButton----left---", self.left);
            //         cc.logManager.info("-----createUserInfoButton----bottom---", self.bottom);
            //         var img = cc.url.raw("resources/dt_login_weixin_btn2.png"); //本地图片
            //         var userInfoBtn = wx.createUserInfoButton({ //创建获取用户信息按钮
            //             type: 'image',
            //             // image: 'https://thumbnail0.baidupcs.com/thumbnail/634d85de53ee728191e53617f8cbc470?fid=3057468576-250528-1090933989058922&time=1540951200&rt=sh&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-wEw4dDCpD5PZehLwBu18Swk3nLA%3D&expires=8h&chkv=0&chkbd=0&chkpc=&dp-logid=7037415173006709896&dp-callid=0&size=c710_u400&quality=100&vuk=-&ft=video',
            //             image: img,
            //             style: {
            //                 left: self.left, //  520微信登录放中间  320 左边
            //                 bottom: self.bottom,
            //                 width: 150, //150
            //                 height: 40, //40
            //             }
            //         });
            //         cc.jsInstance.userInfoBtn = userInfoBtn;
            //         // cc.jsInstance.userInfoBtn.hide();
            //         cc.logManager.info("创建微信登录按钮-----", userInfoBtn);
            //     } else {
            //         cc.logManager.info("没有按钮授权api，弹框升级微信");
            //         wx.showModal({
            //             title: '微信版本过低',
            //             content: '您当前微信版本过低，请升级微信版本后重试。',
            //             confirmColor: "#3CC51F",
            //             confirmText: "确定",
            //             showCancel: false,
            //             success: function(res) {
            //                 if (res.confirm) {
            //                     wx.exitMiniProgram();
            //                 }
            //             }
            //         });
            //     }
            // },
            //获取当前本地时间
            getNowFormatDate(str) {
                var date = new Date();
                var seperator1 = "-";
                var seperator2 = ":";
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
                    " " + date.getHours() + seperator2 + date.getMinutes() +
                    seperator2 + date.getSeconds();
                if (!str) {
                    str = "";
                }
                cc.logManager.info(str + "当前本地时间：" + currentdate);
                return currentdate;
            },
            //处理分享的亲友圈数据
            ClubShared() {
                if (!cc.jsInstance.gamenet.isConnect) {
                    cc.logManager.info("-----服务已断开连接---ClubShared", );
                    return;
                }
                if (cc.director.getScene()._name === "launch" || cc.director.getScene()._name === "login") { //在启动界面和登录界面不处理
                    return;
                }
                var Club = cc.sys.localStorage.getItem("Club");
                if (Club && Club.clubid) {
                    cc.logManager.info("处理亲友圈分享：", Club);
                    var isHaveThisClub = false; //是不是有当前亲友圈
                    if (cc.jsInstance.clubs && cc.jsInstance.clubs.length > 0) {
                        cc.logManager.info("当前加入的亲友圈：", cc.jsInstance.clubs);
                        for (var i = 0; i < cc.jsInstance.clubs.length; i++) {
                            if (parseInt(Club.clubid) === cc.jsInstance.clubs[i]._id) {
                                isHaveThisClub = true;
                                break;
                            }
                        }
                    }
                    if (isHaveThisClub) {
                        if (cc.jsInstance && cc.jsInstance.pinfo && cc.jsInstance.pinfo.vipTable && cc.jsInstance.pinfo.vipTable != 0 != 0) { //有房间
                            cc.logManager.info("-----ClubShared---有房间---");
                            cc.sys.localStorage.setItem("Club", {}); //处理完成 清空数据
                        } else {
                            if (Club.clubid && Club.tableid && parseInt(Club.clubid) > 0 && Club.desktop && parseInt(Club.desktop) >= 0) { //牌桌里面的分享 灭有加入牌桌，加入牌桌
                                cc.logManager.info("分享加入的亲友圈牌桌：", Club);
                                cc.jsInstance.network.JoinGameClub(parseInt(Club.tableid), parseInt(Club.clubid), parseInt(Club.desktop), function(rtn) {
                                    cc.sys.localStorage.setItem("Club", {}); //处理完成 清空数据
                                    if (rtn.result === 0) { //加入牌桌成功
                                        cc.jsInstance.block.show();
                                        cc.jsInstance.pinfo.vipTable = 1;
                                        cc.logManager.info("分享加入亲友圈牌桌成功！");
                                    } else {
                                        if (rtn.result === 39) {
                                            cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("该牌桌房间的人数已满");
                                        } else if (rtn.result === 41) {
                                            cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("牌桌不存在");
                                        } else {
                                            cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(rtn.msg);
                                        }
                                    }
                                });
                            }
                        }
                    } else { //加入这个亲友圈
                        if (Club.clubid && parseInt(Club.clubid) > 0) {
                            cc.logManager.info("分享加入的亲友圈：", Club);
                            cc.jsInstance.network.joinClub(parseInt(Club.clubid), function(rtn) {
                                cc.logManager.info("----加入俱乐部---", rtn);
                                cc.sys.localStorage.setItem("Club", {}); //处理完成 清空数据
                                if (rtn.result === 0) {
                                    var text = "申请加入亲友圈" + Club.clubid + "成功，请耐心等待房主审核通过。";
                                    cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(text);
                                } else {
                                    cc.jsInstance.msgpop.showMsg_text_noclose_nocancle(rtn.msg);
                                }
                            });
                        }
                    }
                }
            },
            //获取服务器时间
            tickServer() {
                if (self.callback) {
                    self.unschedule(self.callback);
                }
                self.callback = function() {
                    if (!cc.jsInstance.gamenet.isConnect) {
                        self.unschedule(self.callback);
                    } else {
                        cc.jsInstance.network.tickServer();
                    }
                }.bind(self);
                self.schedule(self.callback, 20, cc.macro.REPEAT_FOREVER, 1); // 默认值为永远执行，马上开始  schedule(函数, 多长时间掉一次, 次数(永远), 隔多少秒以后开始执行shedule)
            },
            //加入俱乐部判断
            JoinGameClub(clubs, vipTable, clubId, desktop) {
                //进入这个亲友圈 看这个桌子的玩法是不是属于小游戏玩法
                var clubName;
                for (var i = 0; i < clubs.length; i++) {
                    if (clubs[i]._id === parseInt(clubId)) {
                        clubName = clubs[i].name;
                        break;
                    }
                }
                if (!clubName) {
                    cc.logManager.error("-------查找亲友圈名字失败--------");
                    return;
                }
                cc.jsInstance.network.entryClub(clubId, clubName, function(rtn) {
                    cc.logManager.info("----进入俱乐部---", rtn);
                    if (rtn.result === 0) {
                        var data = rtn.info;
                        var iscontinue = true;
                        for (var j = 0; j < data.desktops.length; j++) {
                            if (data.desktops[j].desktop === desktop + "") {
                                iscontinue = false;
                                var rule = data.desktops[j].createPara;
                                var wanfa = cc.jsInstance.WanfaStrFormat.setFormatRule(rule, true); //[]
                                if (wanfa) { //小程序支持
                                    cc.jsInstance.network.JoinGameClub(vipTable, clubId, desktop, function(rtn) {
                                        cc.logManager.info("---登录成功，之前有亲友圈房间，加入游戏----" + JSON.stringify(rtn));
                                        return;
                                    });
                                } else {
                                    cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("小游戏暂时不支持该玩法，请前往客户端进行游戏！", function() {
                                        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                                            wx.exitMiniProgram();
                                        }
                                    });
                                }
                                break;
                            }
                        }
                        if (iscontinue) {
                            var rule = data.rule;
                            var wanfa = cc.jsInstance.WanfaStrFormat.setFormatRule(rule, true); //[]
                            if (wanfa) { //小程序支持
                                cc.jsInstance.network.JoinGameClub(vipTable, clubId, desktop, function(rtn) {
                                    cc.logManager.info("---登录成功，之前有亲友圈房间，加入游戏----" + JSON.stringify(rtn));
                                    return;
                                });
                            } else {
                                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("小游戏暂时不支持该玩法，请前往客户端进行游戏！", function() {
                                    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                                        wx.exitMiniProgram();
                                    }
                                });
                            }
                        }
                    }
                });
            },
            //加入普通房间判断
            JoinGame(vipTable) {
                cc.jsInstance.network.getWanfaByTableId(function(data) {
                    if (data.result === 0) { //获取玩法成功 判断该玩法小程序有没有
                        var rule = data.createPara; //规则
                        var wanfa = cc.jsInstance.WanfaStrFormat.setFormatRule(rule, true); //[]
                        if (wanfa) {
                            cc.jsInstance.network.joinGame(vipTable, false, function(rtn1) {
                                if (rtn1.result === 0) { //加入成功
                                    cc.jsInstance.pinfo.vipTable = 1;
                                } else {
                                    self.roomNumLab.string = "";
                                }
                            });
                        } else {
                            if (data.createPara.ruleName === "goldgame") { //金币场
                                cc.logManager.info("金币场有房间，进入");
                                cc.jsInstance.network.joinGame(vipTable, false, function(rtn1) {
                                    if (rtn1.result === 0) { //加入成功
                                        cc.jsInstance.pinfo.vipTable = 1;
                                    } else {
                                        self.roomNumLab.string = "";
                                    }
                                });
                            } else {
                                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("小游戏暂时不支持该玩法，请前往客户端进行游戏！", function() {
                                    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                                        wx.exitMiniProgram();
                                    }
                                });
                            }
                        }
                    } else {
                        cc.jsInstance.msgpop.showMsg_text_close_nocancle(data.msg);
                    }
                }, parseInt(vipTable));
            },
            //格式化时间 []  传入时间戳 返回时间数组 自己组装格式
            getFormatDate(stamp) {
                var time = [];
                var myDate = new Date(parseInt(stamp));
                time.push(myDate.getFullYear());
                var month = myDate.getMonth() + 1;
                if (month < 10) {
                    month = "0" + month;
                }
                var day = myDate.getDate();
                if (day < 10) {
                    day = "0" + day;
                }
                var hours = myDate.getHours();
                if (hours < 10) {
                    hours = "0" + hours;
                }
                var minutes = myDate.getMinutes();
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                var seconds = myDate.getSeconds();
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                time.push(month);
                time.push(day);
                time.push(hours);
                time.push(minutes);
                time.push(seconds);
                // cc.logManager.info(time)
                return time;
            },
            //时间转化为时间戳
            getTimestamp(strtime) { //'2014-04-23 18:55:49:123';
                // 也很简单
                // var strtime = '2014-04-23 18:55:49:123';
                var date = new Date(strtime);
                //传入一个时间格式，如果不传入就是获取现在的时间了，这样做不兼容火狐。
                // 可以这样做
                var date = new Date(strtime.replace(/-/g, '/'));

                // 有三种方式获取，在后面会讲到三种方式的区别
                var time1 = date.getTime();
                var time2 = date.valueOf();
                var time3 = Date.parse(date);
                /* 
                三种获取的区别：
                第一、第二种：会精确到毫秒
                第三种：只能精确到秒，毫秒将用0来代替
                比如上面代码输出的结果(一眼就能看出区别)：
                1398250549123
                1398250549123
                1398250549000 
                */
                return time3;
            },
            //显示游戏圈
            showGameClubButton() {
                if (cc.jsInstance.gameClubButton) {
                    cc.jsInstance.gameClubButton.style.left = 20;
                    cc.jsInstance.gameClubButton.style.top = self.top;
                }
            },
            //隐藏游戏圈
            hideGameClubButton() {
                if (cc.jsInstance.gameClubButton) {
                    cc.jsInstance.gameClubButton.style.left = -100;
                    cc.jsInstance.gameClubButton.style.top = -100;
                }
            },
            //获取公告
            getmsg: function(cb) {
                if (!cc.jsInstance.idDebug) { //获取最新的配置信息
                    cc.jsInstance.network.getconfigs(function(data) {
                        cc.logManager.info("获取configs");
                        cc.jsInstance.remoteCfg = data;
                    }, function() {
                        cc.logManager.error("获取远程配置失败！");
                    });
                }
                var self = this;
                cc.jsInstance.network.getMsg(cc.jsInstance.remoteCfg.msgURL, function(msg) {
                    cc.logManager.info("消息==", msg.length);
                    // cc.logManager.info("消息===" + JSON.stringify(msg));
                    var msgs = cc.sys.localStorage.getItem('message'); //从缓存取

                    if (!msgs) {
                        msgs = [];
                    } else {
                        msgs = JSON.parse(msgs);
                    }
                    if (msgNatives.msgNativesOpen) {
                        cc.logManager.info("本地公告测试。。。。。。。。");
                        msg = msgNatives.msgs; //本地测试公告用
                    }
                    if (cc.sys.platform != cc.sys.WECHAT_GAME) {
                        // console.table(msg);
                    }
                    if (msg && msg.length > 0) {
                        if (msgs.length <= 0) {
                            for (var i = 0; i < msg.length; i++) {
                                msg[i].read = 0;
                                // msgs.push(msg[i]);
                            }
                            Array.prototype.push.apply(msgs, msg); //msgs 添加到news里面
                        } else {
                            var news = [];
                            var newsids = [];
                            for (var i = 0; i < msg.length; i++) {
                                var num = 0;
                                newsids.push(msg[i].id);
                                for (var j = 0; j < msgs.length; j++) {
                                    if (msgs[j].id === msg[i].id) {
                                        break;
                                    }
                                    num++;
                                    if (num == msgs.length) {
                                        msg[i].read = 0;
                                        news.push(msg[i]);
                                        num = 0;
                                    }
                                }
                            }
                            for (var j = 0; j < msgs.length; j++) {
                                if (newsids.indexOf(msgs[j].id) < 0) { //旧的缓存不包含 新的id，删除
                                    msgs.splice(j, 1);
                                }
                            }
                            if (news.length > 0) {
                                Array.prototype.push.apply(news, msgs); //msgs 添加到news里面
                                msgs = news;
                            }
                        }
                        // 小到大排序
                        msgs.sort(function(a, b) {
                            return a.id - b.id;
                        })

                        cc.sys.localStorage.setItem("message", JSON.stringify(msgs)); //加入缓存
                        if (cb) {
                            cb();
                        }
                    }
                });
            },
            //获取登陆id
            getGuest() {
                var self = this;
                if (cc.jsInstance.mail && cc.jsInstance.mail.length > 0 && cc.jsInstance.code && cc.jsInstance.code.length > 0) {
                    // cc.logManager.info("-------getGuest-----you-----");
                    var mail = cc.jsInstance.mail;
                    var code = cc.jsInstance.code;
                    cc.jsInstance.native.f_login(mail, code, true); //guest login
                    return;
                }
                // cc.logManager.info("-------getGuest-----meiyou-----");
                cc.jsInstance.network.reqGuestID({
                    app: "zjh"
                }, function(rtn) {
                    if (rtn.result == 0) {
                        cc.sys.localStorage.setItem("guestData", JSON.stringify(rtn));
                        // self.f_login(rtn.mail, rtn.code, false); //getGuest
                        cc.jsInstance.native.f_login(rtn.mail, rtn.code, true); //guest login
                    }
                });
            },
            wxLoginNative: function() {
                if (cc.jsInstance.isAuto) {} else {
                    cc.jsInstance.block.show("正在登录中...");
                }
                var self = this;
                wx.login({
                    success: function(res) {
                        // cc.logManager.info("res.code=", res.code);
                        // cc.logManager.info("res==" + JSON.stringify(res));
                        if (res.code) {
                            //发起网络请求
                            self.code = res.code;
                            cc.logManager.info('code: ', self.code);
                            cc.jsInstance.network.getSession_key(self.code, function(rtn) {
                                cc.logManager.info("getSession_key----data===" + JSON.stringify(rtn)); //{"session_key":"DrhuBimO3dagU1w6EPI8hA==","openid":"oZAfM4qAUZKtbYVf5tT3OyKNqxHI"}
                                if (!rtn.openid) {
                                    cc.jsInstance.block.hide();
                                    cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("openid获取失败!", function() {
                                        cc.jsInstance.audioManager.playBtnClick();
                                        cc.jsInstance.native.wxLoginNative();
                                    })
                                    return;
                                }
                                self.openid = rtn.openid;
                                self.unionid = rtn.unionid;
                                self.session_key = rtn.session_key;
                                cc.logManager.info("rtn.openid====" + rtn.openid);
                                var wxlogininfo = cc.sys.localStorage.getItem('wxloginData'); //从缓存取用户信息
                                if (wxlogininfo && wxlogininfo != 0) {
                                    cc.logManager.info("--------缓存拿到openid----");
                                    cc.logManager.info("缓存拿到用户信息-------------------login----------------wxloginData-----" + JSON.stringify(res.userInfo));
                                    cc.logManager.info("wxloginData==" + JSON.stringify(wxlogininfo));
                                    cc.jsInstance.native.f_login({
                                        openid: self.openid,
                                        nickname: escape(wxlogininfo.nickName),
                                        lType: "wx",
                                        // code: self.code,
                                        unionid: self.unionid,
                                        headimgurl: wxlogininfo.avatarUrl
                                    });
                                    return;
                                } else {
                                    wx.getUserInfo({
                                        success: function(res) {
                                            cc.logManager.info("getUserInfo")
                                            var userInfo = res.userInfo
                                            var nickName = userInfo.nickName
                                            var avatarUrl = userInfo.avatarUrl
                                            var gender = userInfo.gender //性别 0：未知、1：男、2：女
                                            var province = userInfo.province
                                            var city = userInfo.city
                                            var country = userInfo.country
                                            cc.logManager.info("已经授权过---直接获取信息登录-----------------------");
                                            cc.jsInstance.native.f_login({
                                                openid: self.openid,
                                                nickname: escape(nickName), //
                                                lType: "wx",
                                                unionid: self.unionid,
                                                headimgurl: avatarUrl //
                                            });
                                            return;
                                        },
                                        fail: function(res) { //获取失败了去登录界面显示登录按钮重新登录
                                            cc.director.preloadScene("login", function() {
                                                cc.loader.onProgress = null;
                                                cc.director.loadScene("login");
                                            });
                                        }
                                    })
                                }
                            });
                        } else {
                            cc.logManager.error('登录失败！' + res.errMsg);
                        }
                    }
                });
            },
            f_login: function(mail, code, isLocalGuest) {
                cc.logManager.info("mail === ", mail);
                cc.logManager.info("code == ", code);
                cc.logManager.info("isLocalGuest == ", isLocalGuest);
                // if (cc.jsInstance.mail && cc.jsInstance.mail.length > 0) {
                //     mail = cc.jsInstance.mail;
                // }
                // if (cc.jsInstance.code && cc.jsInstance.code.length > 0) {
                //     code = cc.jsInstance.code;
                // }
                var loginData = code ? {
                    mail: mail,
                    code: code
                } : mail;
                var self = this;
                loginData.app = {
                    appid: "com.coolgamebox.majiang",
                    os: cc.sys.os
                };
                loginData.gamekind = 1;
                cc.jsInstance.network.doLogin(loginData,
                    function(rtn) {
                        cc.jsInstance.block.hide();
                        cc.jsInstance.native.tickServer(); //获取服务器时间
                        cc.jsInstance.endRoomData = {};
                        cc.jsInstance.endRoomData.reason = -1; //亲友圈 endRoomData解散房间置为-1      
                        if (rtn.result == ZJHCode.Success) {
                            if (code) { //调试打开
                                if (cc.sys.platform != cc.sys.WECHAT_GAME) {
                                    var userId = cc.jsInstance.globalUtils.getColumn("id") || "";
                                    cc.sys.localStorage.setItem("loginData" + userId, JSON.stringify(loginData));
                                }
                            }

                            if (rtn.clubjoinlist) {
                                cc.clubjoinlist = rtn.clubjoinlist;
                            } else {
                                cc.clubjoinlist = 0;
                            }
                            cc.jsInstance.globalUtils.send("club_tip"); //是否显示亲友圈红点
                            cc.jsInstance.msgpop.click_close();
                            cc.jsInstance.pinfo = rtn;

                            cc.jsInstance.dataManager.setData(rtn);
                            cc.jsInstance.haveRoom = false;
                            cc.jsInstance.globalUtils.send("vipTable", rtn.vipTable); //通知大厅是否需要改变返回房间或者加入房间图片
                            if (rtn.vipTable > 0) {
                                cc.jsInstance.HavePlayStartAnim = true; //是否播放过开局动画
                                if (rtn.ingame && rtn.ingame.groupid) { //亲友圈
                                    cc.jsInstance.network.getJoinedClubs(function(data) {
                                        if (data.result === 0) {
                                            cc.jsInstance.clubs = [];
                                            for (var key in data.clubs) {
                                                cc.jsInstance.clubs.push(data.clubs[key]);
                                            }
                                            // cc.logManager.info("--cc.jsInstance.clubs----断线重连，加入的俱乐部-------", cc.jsInstance.clubs);
                                            cc.jsInstance.native.JoinGameClub(cc.jsInstance.clubs, rtn.vipTable, rtn.ingame.groupid, rtn.ingame.desktop);
                                        }
                                        cc.jsInstance.block.show();
                                    });
                                } else { //普通房间
                                    cc.jsInstance.native.JoinGame(rtn.vipTable);
                                }
                                cc.jsInstance.haveRoom = true;
                                return;
                            } else {
                                cc.jsInstance.network.getJoinedClubs(function(data) {
                                    if (data.result === 0) {
                                        cc.jsInstance.clubs = [];
                                        for (var key in data.clubs) {
                                            cc.jsInstance.clubs.push(data.clubs[key]);
                                        }
                                        // cc.logManager.info("--cc.jsInstance.clubs----断线重连后，加入的俱乐部-------", cc.jsInstance.clubs);
                                    }
                                });
                                cc.jsInstance.HavePlayStartAnim = false; //是否播放过开局动画
                                if (rtn.incontest && rtn.incontest != "") { //比赛场  GM1 GM2 GM3
                                    cc.jsInstance.network.leaveMJPlayground(rtn.incontest, function(res) {});
                                }
                                if (rtn.incontestUniqueId && rtn.incontestUniqueId != "") { //金币比赛场  fid
                                }
                            }
                            if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                                if (cc.jsInstance.isAuto) {
                                    cc.jsInstance.native.skipScene("lobby");
                                }
                            }
                        } else if (rtn.result == ZJHCode.playerNotFound) {
                            if (isLocalGuest) {}
                        } else if (rtn.result == ZJHCode.serverFull) {} else if (rtn.result == ZJHCode.clientRestart) {} else if (rtn.result == ZJHCode.clientUpdate) {}
                    });
            },
            //节点缩放动画
            setScaleAction: function(node, scale) {
                if (!node) {
                    return;
                }
                if (scale) {
                    node.scale = scale;
                }
                // cc.logManager.info("play action node==", node.name);
                var s1 = cc.scaleTo(0.2, node.scale + 0.05);
                var s2 = cc.scaleTo(0.2, node.scale);
                var seq = cc.sequence([s1, s2]);
                node.runAction(seq);
            },
            //普通分享
            wxShareUrl: function(title, okfun, failfun) {
                try {
                    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                        canvas.toTempFilePath({
                            destWidth: 500,
                            destHeight: 400,
                            fileType: 'jpg',
                            quality: 1.0,
                            success: function(res) {
                                // cc.logManager.info('截屏成功--------------' + JSON.stringify(res));
                                wx.shareAppMessage({
                                    title: title,
                                    imageUrl: res.tempFilePath,
                                    success: function(res) {
                                        cc.logManager.info('拉起分享 成功');
                                        if (okfun) {
                                            okfun(res);
                                        }
                                    },
                                    fail: function(res) {
                                        cc.logManager.error('拉起分享 失败');
                                        if (failfun) {
                                            failfun(res);
                                        }
                                    }
                                });
                            },
                            fail: function(res) {
                                cc.logManager.error('截屏失败--------------' + JSON.stringify(res));
                            },
                            complete: function(res) {
                                cc.logManager.info('截屏完成--------------' + JSON.stringify(res));
                            },
                        })
                    } else {
                        cc.jsInstance.native.HelloOC("h5分享");
                    }
                } catch (e) {
                    cc.jsInstance.native.HelloOC("wxShareUrl throw: " + JSON.stringify(e));
                }
            },
            //普通牌桌分享
            wxInviteShareUrl: function(title, roomid) {
                try {
                    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                        canvas.toTempFilePath({
                            destWidth: 500,
                            destHeight: 400,
                            fileType: 'jpg',
                            quality: 1.0,
                            success: function(res) {
                                cc.logManager.info('截屏成功');
                                wx.shareAppMessage({
                                    title: title,
                                    // imageUrl: "http://code.datangyouxi.com/uploads/-/system/appearance/header_logo/1/Icon-100.png",
                                    imageUrl: res.tempFilePath,
                                    query: 'ShareRoomid=' + roomid,
                                    success: function(res) {
                                        cc.logManager.info('拉起分享 成功');
                                        cc.jsInstance.block.hide();
                                    },
                                    fail: function(res) {
                                        cc.logManager.error('拉起分享 失败');
                                        cc.jsInstance.block.hide();
                                    }
                                });
                            },
                            fail: function(res) {
                                cc.logManager.error('截屏失败');
                                cc.jsInstance.block.hide();
                            },
                            complete: function(res) {
                                cc.logManager.info('截屏完成');
                                cc.jsInstance.block.hide();
                            },
                        })
                    } else {
                        cc.jsInstance.native.HelloOC("h5分享");
                    }
                } catch (e) {
                    cc.jsInstance.native.HelloOC("wxShareUrl throw: ");
                }
            },
            //亲友圈牌桌分享
            wxInviteShareUrlClubRoom(title, Club) { // ({"tableid": tableid,"groupid": clubid,"desktop": desktop})
                try {
                    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                        canvas.toTempFilePath({
                            destWidth: 500,
                            destHeight: 400,
                            fileType: 'jpg',
                            quality: 1.0,
                            success: function(res) {
                                cc.logManager.info('截屏成功');
                                var query = "";
                                wx.shareAppMessage({
                                    title: title,
                                    // imageUrl: "http://code.datangyouxi.com/uploads/-/system/appearance/header_logo/1/Icon-100.png",
                                    imageUrl: res.tempFilePath,
                                    query: 'clubid=' + Club.clubid + '&tableid=' + Club.tableid + '&desktop=' + Club.desktop,
                                    success: function(res) {
                                        cc.logManager.info('拉起分享 成功');
                                        cc.jsInstance.block.hide();
                                    },
                                    fail: function(res) {
                                        cc.logManager.error('拉起分享 失败');
                                        cc.jsInstance.block.hide();
                                    }
                                });
                            },
                            fail: function(res) {
                                cc.logManager.error('截屏失败');
                                cc.jsInstance.block.hide();
                            },
                            complete: function(res) {
                                cc.logManager.info('截屏完成');
                                cc.jsInstance.block.hide();
                            },
                        })
                    } else {
                        cc.jsInstance.native.HelloOC("h5分享");
                    }
                } catch (e) {
                    cc.jsInstance.native.HelloOC("wxShareUrl throw: " + JSON.stringify(e));
                }
            },
            //微信小程序右上角按钮设置分享
            wxShareMenu: function() {
                if (cc.sys.platform === cc.sys.WECHAT_GAME) { //小游戏里面右上角设置分享按钮
                    // 显示当前页面的转发按钮
                    wx.showShareMenu({
                        withShareTicket: true,
                        success: function(res) {
                            // 分享成功
                            cc.logManager.info('shareMenu share success');
                        },
                        fail: function(res) {
                            // 分享失败
                        }
                    });
                    // 设置 withShareTicket: true
                    wx.updateShareMenu({
                        withShareTicket: true
                    });
                    wx.onShareAppMessage(function() {
                        // 用户点击了“转发”按钮
                        return {
                            title: '大唐麻将',
                            imageUrl: "https://c.datangyouxi.com/damjxyx/img/share2.jpg", //http://www.datangyouxi.com/images/slides/slide1.png
                            success: function(res) {
                                cc.logManager.info('拉起分享 成功');
                            },
                            fail: function(res) {
                                cc.logManager.error('拉起分享 失败');
                            }
                        }
                    })
                }
            },
            //设置剪切板内容（小游戏和h5分开）
            wxSetClipboardData: function(data) {
                if (cc.sys.platform === cc.sys.WECHAT_GAME) { //小游戏设置内容到粘贴板
                    wx.setClipboardData({
                        data: data,
                        success: function(res) {
                            cc.logManager.info("设置剪切板内容成功：" + data) // data
                            wx.getClipboardData({
                                success: function(res) {
                                    cc.logManager.info("获取设置的剪切板内容") // data
                                    cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("复制内容(" + res.data + ")成功!", function() {
                                        cc.jsInstance.audioManager.playBtnClick();
                                    });
                                }
                            })
                        }
                    })
                } else { //h5设置内容到粘贴板
                    var save = function(e) {
                        e.clipboardData.setData('text/plain', data);
                        e.preventDefault();
                    }
                    document.addEventListener('copy', save);
                    document.execCommand('copy');
                    document.removeEventListener('copy', save);
                    cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("复制内容(" + data + ")成功!", function() {
                        cc.jsInstance.audioManager.playBtnClick();
                        //  
                        cc.sys.localStorage.setItem("ClipboardData", data); //
                    });

                }
            },
            //获取剪切板内容 （暂时不用）
            wxGetClipboardData: function() {
                if (cc.sys.platform === cc.sys.WECHAT_GAME) { //
                    wx.getClipboardData({
                        success: function(res) {
                            // cc.logManager.info(res.data);
                        }
                    })
                } else {}
            },
            //给链接跳转到指定页面
            openURL: function(url) {
                if (cc.sys.platform === cc.sys.WECHAT_GAME) { //小游戏
                    wx.setClipboardData({
                        data: url,
                        success: function(res) {
                            cc.logManager.info("设置剪切板内容成功url：" + url) // data
                            wx.getClipboardData({
                                success: function(res) {
                                    cc.logManager.info("获取设置的剪切板内容url：" + res.data) // data
                                    cc.jsInstance.msgpop.showMsg_text_close_nocancle("下载地址已复制到剪切板，请到浏览器下载！", function() {
                                        cc.jsInstance.audioManager.playBtnClick();
                                    });
                                }
                            })
                        }
                    })
                } else { //h5
                    cc.sys.openURL(url); //跳转到指定链接（其他页面打开） 
                }
            },
            //base64编码
            base64encode: function(str) {
                var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
                    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
                    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
                    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
                var out, i, len;
                var c1, c2, c3;

                len = str.length;
                i = 0;
                out = "";
                while (i < len) {
                    c1 = str.charCodeAt(i++) & 0xff;
                    if (i == len) {
                        out += base64EncodeChars.charAt(c1 >> 2);
                        out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                        out += "==";
                        break;
                    }
                    c2 = str.charCodeAt(i++);
                    if (i == len) {
                        out += base64EncodeChars.charAt(c1 >> 2);
                        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                        out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                        out += "=";
                        break;
                    }
                    c3 = str.charCodeAt(i++);
                    out += base64EncodeChars.charAt(c1 >> 2);
                    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                    out += base64EncodeChars.charAt(c3 & 0x3F);
                }
                return out;
            },
            //跳转场景
            skipScene(name, cb) {
                cc.logManager.info("准备加载的场景：" + name);
                cc.logManager.info("是否自动登陆：" + cc.jsInstance.isAuto);
                cc.logManager.info("------------ cc.jsInstance.gamenet.isConnect-----skipScene-------", cc.jsInstance.gamenet.isConnect);
                var isshow = true;
                if (cc.jsInstance.isAuto) {
                    isshow = false;
                }
                if (cc.jsInstance.isreConnect) {
                    isshow = false;
                }
                if (cc.jsInstance.gamenet.isConnect === false) {
                    isshow = false;
                    cc.logManager.info("断线重连跳转场景");
                }
                if (isshow) {
                    cc.jsInstance.block.show("正在加载场景：0%");
                }
                // cc.jsInstance.block.show("资源加载中，请稍后...");
                cc.loader.onProgress = function(completedCount, totalCount, item) {
                    if (completedCount === totalCount) {
                        cc.jsInstance.isAuto = false;
                        if (cb) {
                            cb();
                        }
                    }
                    var percent = (completedCount / totalCount * 100 + "").substr(0, 3);
                    if (percent.indexOf(".") > 0) {
                        percent = percent.substr(0, 2);
                        if (percent.indexOf(".") > 0) {
                            percent = percent.substr(0, 1);
                        }
                    }
                    if (isshow) {
                        if (!percent) {
                            percent = 0;
                        }
                        var con = "正在加载场景：" + percent + "%";
                        cc.jsInstance.block.settext(con);
                    }
                }.bind(this);

                cc.director.preloadScene(name, function() {
                    cc.director.loadScene(name);
                    cc.jsInstance.block.hide();
                });
            },
            //格式化金钱
            formatMoney(money) {
                var self = this;
                var num = parseInt(money);
                var str;
                if (num >= 2100000000) {
                    str = 21 + "亿"
                } else if (num > 100000000) {
                    str = num / 100000000 + "";
                    var pos = str.indexOf(".");
                    if (pos === 4) {
                        str = str.substr(0, 4) + "亿";;
                    } else {
                        str = str.substr(0, 5) + "亿";;
                    }

                } else if (num > 10000) {
                    str = num / 10000 + "";
                    var pos = str.indexOf(".");
                    if (pos === 4) {
                        str = str.substr(0, 4) + "万";;
                    } else {
                        str = str.substr(0, 5) + "万";;
                    }
                } else {
                    str = num + "";
                }
                return str;
            },
            //断线重连
            reConnect(text) {
                //被其他人踢了
                if (cc.jsInstance.isOnKick) {
                    cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("您当前账号在其他手机上登陆了！\n点击确定，重新登录", function() {
                        cc.jsInstance.isOnKick = false;
                        cc.jsInstance.native.reConnect("被踢重新登录");
                    });
                    return;
                }

                var iswalk = 1;
                if (cc.director.getScene()._name === "play" || cc.director.getScene()._name === "playDDZ") {
                    cc.logManager.info("reConnect----场景，return----", cc.director.getScene()._name);
                    return;
                }
                cc.logManager.info("reConnect----准备重连---", cc.director.getScene()._name);
                var self = this;
                if (!cc.jsInstance.iscontinue) {
                    cc.logManager.info("-----连接失败，等待点击确定重新连接进行重连---reConnect-----", );
                    return;
                }
                if (text) {
                    cc.logManager.info("-----reConnect进来 text ---------", text);
                } else {
                    cc.logManager.error("-----reConnect进来 text 不存在--------", );
                }
                if (cc.jsInstance.gamenet && cc.jsInstance.gamenet.isConnect) {
                    cc.logManager.info("-----已经连接上-reConnect---0----", );
                    cc.jsInstance.msgpop.click_close();
                    cc.jsInstance.block.hide();
                    return;
                }
                cc.jsInstance.isreConnect = true;
                // cc.jsInstance.block.show("正在重连中...");
                var servers = cc.jsInstance.remoteCfg.servers.split(',');
                var server = servers[Math.floor(Math.random() * servers.length)];
                var parts = server.split(':');
                var host = parts[0];
                var port = parseInt(parts[1 + Math.floor(Math.random() * (parts.length - 1))]);
                cc.jsInstance.gamenet.disconnect();
                cc.jsInstance.gamenet.connect(host, port, function() {
                    cc.jsInstance.isreConnect = false;
                    if (cc.jsInstance.gamenet && cc.jsInstance.gamenet.isConnect) {
                        cc.logManager.info("-----已经连接上--reConnect-connect-1----", );
                        cc.jsInstance.msgpop.click_close();
                        cc.jsInstance.block.hide();
                        cc.jsInstance.iscontinue = true;
                    }
                    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                        cc.logManager.info("-----重连成功，wx重新登陆----", );
                        cc.jsInstance.native.wxLoginNative();
                        cc.jsInstance.block.hide();
                    } else {
                        cc.logManager.info("-----重连成功，h5重新登陆----");
                        cc.jsInstance.native.getGuest();
                        cc.jsInstance.block.hide();
                    }
                    if (cc.director.getScene()._name === "launch") {
                        cc.director.preloadScene("login", function() {
                            cc.loader.onProgress = null;
                            cc.director.loadScene("login");
                        });
                    }
                    // cc.jsInstance.bayWindow.openBayWindow("重连成功！");
                    iswalk = 0;
                }, function() {
                    cc.jsInstance.isreConnect = true;
                    if (cc.jsInstance.gamenet && cc.jsInstance.gamenet.isConnect) {
                        cc.logManager.info("-----已经连接上--reConnect-disconnect-2----", );
                        cc.jsInstance.msgpop.click_close();
                        cc.jsInstance.block.hide();
                        cc.jsInstance.iscontinue = true;
                        return;
                    }
                    cc.logManager.info("-----重连失败--弹出重连对话框-reConnect---", cc.jsInstance.iscontinue);
                    cc.jsInstance.block.hide();
                    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                        wx.getNetworkType({
                            success: function(res) {
                                cc.logManager.info("获取网络类型:" + res.networkType)
                                if (res.networkType === "none") {
                                    cc.jsInstance.block.hide();
                                    cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("网络已断开，请检查网络后再进入游戏！", function() {
                                        wx.exitMiniProgram();
                                    });
                                    return;
                                } else {
                                    if (cc.director.getScene()._name === "play" || cc.director.getScene()._name === "playDDZ") {
                                        cc.logManager.info("reConnect----场景，return----", cc.director.getScene()._name);
                                        return;
                                    } else if (cc.director.getScene()._name === "lobby" && iswalk != 1) {
                                        cc.jsInstance.native.reConnect("wx_reConnect");
                                        return;
                                    }
                                    cc.jsInstance.iscontinue = false;
                                    cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("与服务已断开连接或者该账号在其他地方登录，请重新登录！", function() {
                                        cc.jsInstance.audioManager.playBtnClick();
                                        if (cc.director.getScene()._name === "play" || cc.director.getScene()._name === "playDDZ") {
                                            cc.jsInstance.block.show("掉线正在重连中...");
                                            cc.logManager.info("reConnect...wx====", cc.director.getScene()._name);
                                            cc.jsInstance.native.skipScene("lobby");
                                        } else {
                                            cc.jsInstance.iscontinue = true;
                                            cc.jsInstance.native.reConnect("wx_reConnect");
                                        }
                                    });
                                }
                            }
                        })
                    } else {
                        if (cc.director.getScene()._name === "play") {
                            cc.logManager.info("reConnect----play场景，return----");
                            return;
                        } else if (cc.director.getScene()._name === "lobby" && iswalk != 1) {
                            cc.jsInstance.native.reConnect("h5_reConnect");
                            return;
                        }
                        cc.jsInstance.iscontinue = false;
                        cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("与服务已断开连接或者该账号在其他地方登录，请重新登录！", function() {
                            cc.jsInstance.audioManager.playBtnClick();
                            if (cc.director.getScene()._name === "play") {
                                cc.jsInstance.block.show("掉线正在重连中...");
                                cc.logManager.info("reConnect...h5");
                                cc.jsInstnce.native.skipScene("lobby");
                            } else {
                                cc.jsInstance.iscontinue = true;
                                cc.jsInstance.native.reConnect("h5_reConnect");
                            }
                        });
                    }
                });
            },
            //给节点设置图片
            setHeadIcon(node, url) {
                cc.loader.load({
                    url: url,
                    type: 'png'
                }, function(err, ret) {
                    if (err) {
                        cc.logManager.info("设置图片失败");
                        return;
                    }
                    var spriteFrame = new cc.SpriteFrame(ret, cc.Rect(0, 0, ret.width, ret.height));
                    node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }.bind(this));
            },
            HelloOC: function(message) {
                // cc.logManager.info("虽然我挂掉了,但是我还是坚持打印了了log: " + String(message));
            },

        };
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            var self = this;
            cc.jsInstance.native.wxShareMenu(); //小游戏里面右上角设置分享按钮
            var opts = wx.getLaunchOptionsSync(); //获取点击链接进来的数据
            cc.logManager.info("-----小游戏启动参数------------" + JSON.stringify(opts));
            if (opts) {
                if (opts.query && opts.query.ShareRoomid) { //获取分享里面的数据 房间号加入缓存
                    cc.logManager.info("------ShareRoomid------------" + opts.query.ShareRoomid);
                    cc.sys.localStorage.setItem("ShareRoomid", opts.query.ShareRoomid); //加入缓存
                }
                if (opts.query && opts.query.clubid) { //获取分享里面的数据 亲友圈id加入缓存
                    cc.logManager.info("------clubid------------" + opts.query.clubid);
                    var club = {};
                    club.clubid = opts.query.clubid;
                    club.tableid = opts.query.tableid;
                    club.desktop = opts.query.desktop;
                    cc.logManager.info("------club------------", club);
                    cc.sys.localStorage.setItem("Club", club); //加入缓存
                }
            }

            // {
            //     "errMsg": "getSystemInfo:ok",
            //     "model": "iPhone 7 Plus",
            //     "pixelRatio": 3,
            //     "windowWidth": 736,
            //     "windowHeight": 414,
            //     "system": "iOS 10.0.1",
            //     "language": "zh_CN",
            //     "version": "6.6.3",
            //     "screenWidth": 736,
            //     "screenHeight": 414,
            //     "SDKVersion": "2.0.2",
            //     "brand": "devtools",
            //     "fontSizeSetting": 16,
            //     "benchmarkLevel": 1,
            //     "batteryLevel": 100,
            //     "statusBarHeight": 20,
            //     "platform": "devtools"
            // }

            self.left = 520 / 2; // 1280  520/2   1624  692/2
            self.top = 200;
            self.bottom = 94 / 2;
            self.system = "android";
            self.topfeedBack = 720 / 2;

            //获取手机信息
            wx.getSystemInfo({
                success: function(res) {
                    cc.logManager.info("手机信息==success=" + JSON.stringify(res));
                    cc.sys.localStorage.setItem("iPhoneX", 0); //苹果x为1，默认0
                    if (res.model && res.model.indexOf("iPhone X") != -1) { //苹果x  固定宽度的时候会用到 （固定高用不到）
                        cc.logManager.info("苹果x的获取用户信息按钮位置单独适配-------");
                        // self.bottom = self.bottom + 44 / 2;
                        cc.sys.localStorage.setItem("iPhoneX", 1); //苹果x为1
                    }
                    self.left = res.screenWidth / 2 - 150 / 2;
                    // self.top = res.screenHeight * 5 / 7 + 20;
                    // self.top = res.screenHeight - self.bottom - 88 / 2;//文字
                    self.topfeedBack = res.screenHeight / 2;
                    self.system = res.system;

                    // cc.logManager.error("手机信息----" + res.screenHeight / res.screenWidth);
                    if (res.screenHeight / res.screenWidth >= 0.7) { //ipad 基本都0.75左右
                        self.left = res.screenWidth / 2 - 292 / 2;
                        self.width = 292;
                        self.height = 88;
                        self.top = res.screenHeight * 5 / 7 + 20;
                    } else {
                        self.width = 150;
                        self.height = 40;
                        self.top = res.screenHeight * 5 / 7 + 20 - 5;
                    }
                },
                fail: function(res) {
                    cc.logManager.error("手机信息==fail=" + JSON.stringify(res));
                },
            });
            cc.logManager.info("获取用户信息按钮---left=" + self.left);
            cc.logManager.info("获取用户信息按钮---bottom=" + self.bottom);
            cc.logManager.info("获取用户信息按钮---top=" + self.top);

            if (wx.createUserInfoButton) {
                // var userInfoBtn = wx.createUserInfoButton({ //创建获取用户信息按钮
                //     type: 'image',
                //     image: 'https://c.datangyouxi.com/damjxyx/img/dt_login_weixin_btn2.png',
                //     style: {
                //         left: self.left, //  520微信登录放中间  320 左边
                //         top: self.top,
                //         width: self.width, //150
                //         height: self.height, //40
                //         opacity: 1,
                //     }
                // });

                var userInfoBtn = wx.createUserInfoButton({ //创建获取用户信息按钮
                    type: 'text',
                    text: '',
                    style: {
                        left: self.left, //  520微信登录放中间  320 左边
                        top: self.top, //
                        // bottom: self.bottom,
                        width: self.width, //150
                        height: self.height, //40

                        // backgroundColor: '#ff0000', //ff0000 红色
                        opacity: 0.1, //为0的话 苹果在正式服务器上点击这个按钮没反应0.1
                    }
                });
                cc.jsInstance.userInfoBtn = userInfoBtn;
                cc.jsInstance.userInfoBtn.hide();
                cc.logManager.info("创建微信登录按钮-----", userInfoBtn);
            } else {
                cc.logManager.error("没有按钮授权api，弹框升级微信");
                wx.showModal({
                    title: '微信版本过低',
                    content: '您当前微信版本过低，请升级微信版本后重试。',
                    confirmColor: "#3CC51F",
                    confirmText: "确定",
                    showCancel: false,
                    success: function(res) {
                        if (res.confirm) {
                            wx.exitMiniProgram();
                        }
                    }
                });
                return;
            }

            //游戏圈   
            // var GameClubButton = wx.createGameClubButton({
            //     icon: 'light',//dark  green  white  light
            //     type: "text",
            //     text: "游戏圈",
            //     style: {
            //         left: 20,
            //         top: self.top,
            //         width: 40,
            //         height: 40
            //     }
            // });
            // cc.jsInstance.gameClubButton = GameClubButton;
            // cc.jsInstance.native.hideGameClubButton();
            cc.logManager.info("-------self.topfeedBack------", self.topfeedBack);
            var FeedbackButton = wx.createFeedbackButton({
                type: 'text',
                text: '反馈',
                style: {
                    left: 35, //10
                    top: self.topfeedBack - 54,
                    width: 38,
                    height: 108,
                    lineHeight: 40,
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: 1,
                    opacity: 0.1, //为0的话 苹果在正式服务器上点击这个按钮没反应0.1
                    // backgroundColor: '#000000',
                }
            });
            cc.jsInstance.FeedbackButton = FeedbackButton;
            cc.jsInstance.FeedbackButton.hide();

            wx.onHide(function(opts) { // opts.mode    back(苹果右上角退出圆圈) close(安卓右上角退出圆圈)  hide（锁屏，home）  -锁屏、按 HOME 键退到桌面、显示在聊天顶部等操作会触发此事件。
                // cc.logManager.info("------wx.onHide-----------" + JSON.stringify(opts));
                cc.audioEngine.pauseAll(); //暂停背景音乐
                cc.logManager.info("-------wx.onHide-------------暂停背景音乐");
                //获取当前时间戳  
                var timestamp = Date.parse(new Date());
                timestamp = timestamp / 1000;
                cc.logManager.info("hide时候的时间戳：" + timestamp); // 104
                cc.sys.localStorage.setItem("time_hide", timestamp); //加入缓存
                if (opts && opts.mode === "back" || opts.mode === "close") {}
            });

            wx.onShow(function(scene, query) { //
                //先判断之前有没有下载成功config ，没有重新下载
                if (cc.jsInstance.remoteCfg && cc.jsInstance.remoteCfg.servers) {} else {
                    cc.jsInstance.network.getconfigs(function(data) {
                        cc.logManager.info("获取configs===", data);
                        cc.jsInstance.remoteCfg = data;
                        cc.jsInstance.native.reConnect("onNetworkStatusChange");
                    }, function() {
                        cc.logManager.error("获取远程配置失败！");
                        cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("网络不稳定，请检查或者切换网络，重新进入游戏！", function() {
                            cc.jsInstance.audioManager.playBtnClick();
                            wx.exitMiniProgram();
                        });
                    });
                    return;
                }

                cc.logManager.info("-------wx.onShow-------------恢复背景音乐");
                cc.audioEngine.resumeAll(); //恢复背景音乐
                // cc.logManager.info("-------wx.onShow-------------恢复背景音乐");
                cc.jsInstance.audioManager.setBGMVolume(1, true, true); //继续播放之前的背景音乐（cc.audioEngine.resumeAll() 有时候失效）
                // cc.game.resume(); //恢复游戏(包含一切逻辑)
                // 运行机制
                // 小程序没有重启的概念
                // 当小程序进入后台， 客户端会维持一段时间的运行状态， 超过一定时间后（ 目前是5分钟） 会被微信主动销毁
                // 当短时间内（ 5 s） 连续收到两次以上收到系统内存告警， 会进行小程序的销毁
                //获取当前时间戳  
                var timeshow = Date.parse(new Date());
                timeshow = timeshow / 1000;
                cc.logManager.info("onShow时候的时间戳：" + timeshow);
                var timehide = cc.sys.localStorage.getItem("time_hide"); //进入后台时候的时间戳
                cc.logManager.info("onhide时候的时间戳：" + timehide);
                if (timeshow && timehide) {
                    var timesub = timeshow - timehide;
                    cc.logManager.info("相差时间：" + timesub);
                    if (timesub >= 5 * 60) { //超过5分钟就强制关闭小游戏
                        //退出小游戏
                        // wx.exitMiniProgram({
                        //     success: function(res) {
                        //         cc.logManager.info("success==" + JSON.stringify(res));
                        //     },
                        //     fail: function(res) {
                        //         cc.logManager.info("fail==" + JSON.stringify(res));
                        //     },
                        //     complete: function(res) {
                        //         cc.logManager.info("complete==" + JSON.stringify(res));
                        //     }
                        // });
                    }
                }
                if (scene.query && scene.query.clubid) { //获取分享里面的数据 亲友圈id加入缓存
                    cc.logManager.info("------clubid------------" + scene.query.clubid);
                    var club = {};
                    club.clubid = scene.query.clubid;
                    club.tableid = scene.query.tableid;
                    club.desktop = scene.query.desktop;
                    cc.logManager.info("------club------------", club);
                    cc.sys.localStorage.setItem("Club", club); //加入缓存
                    cc.jsInstance.native.ClubShared(); //处理分享的亲友圈数据
                }
                if (!cc.jsInstance.gamenet.isConnect) {
                    if (scene.query && scene.query.ShareRoomid) { //获取分享里面的数据 房间号加入缓存
                        cc.logManager.info("--onShow----ShareRoomid---掉线保存房间号---------" + scene.query.ShareRoomid);
                        cc.sys.localStorage.setItem("ShareRoomid", scene.query.ShareRoomid); //服务器断开连接 需要重连成功后继续加入房间保存这个数据
                        if (cc.jsInstance && cc.jsInstance.pinfo && cc.jsInstance.pinfo.vipTable && cc.jsInstance.pinfo.vipTable != 0) { //有房间
                            cc.sys.localStorage.setItem("ShareRoomid", -1); //改变
                            cc.logManager.info("--onShow----之前有房间-----不加入游戏1-------");
                        }
                    }
                    cc.jsInstance.native.reConnect("onShow");
                } else { //判断是否分享有数据，判断是否是大厅界面
                    cc.logManager.info("当前场景名字==onShow===", cc.director.getScene()._name) //获取当前场景的名字
                    if (cc.director.getScene()._name === "lobby") {
                        cc.logManager.info("onShow scene====================" + JSON.stringify(scene)); //{"query":{}}
                        if (scene.query && scene.query.ShareRoomid) { //获取分享里面的数据 房间号加入缓存
                            cc.logManager.info("--onShow----ShareRoomid------------" + scene.query.ShareRoomid);
                            cc.sys.localStorage.setItem("ShareRoomid", scene.query.ShareRoomid); //服务器断开连接 需要重连成功后继续加入房间保存这个数据
                            cc.jsInstance.globalUtils.send("vipTable", scene.query.ShareRoomid); //通知大厅是否需要改变返回房间或者加入房间图片
                        }
                    }
                }
            });

            wx.setKeepScreenOn({ //屏幕常亮
                keepScreenOn: true,
            });

            wx.onNetworkStatusChange(function(res) { //网络状态监听
                cc.logManager.info("是否链接-----onNetworkStatusChange----startor-----------:" + res.isConnected)
                cc.logManager.info("网络类型------onNetworkStatusChange-----startor---------:" + res.networkType)
                if (!res.isConnected) {} else {
                    cc.logManager.info("网络已连接！----onNetworkStatusChange------startor----------")
                    cc.logManager.info("网络状态变化：连接成功----------startor----------");
                    if (cc.jsInstance.gamenet.isConnect) {
                        return;
                    }
                    //先判断之前有没有下载成功config ，没有重新下载
                    if (cc.jsInstance.remoteCfg && cc.jsInstance.remoteCfg.servers) {
                        cc.jsInstance.native.reConnect("onNetworkStatusChange");
                    } else {
                        cc.jsInstance.network.getconfigs(function(data) {
                            cc.logManager.info("获取configs===", data);
                            cc.jsInstance.remoteCfg = data;
                            cc.jsInstance.native.reConnect("onNetworkStatusChange");
                        }, function() {
                            cc.logManager.info("获取远程配置失败！");
                            cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("网络不稳定，请检查或者切换网络，重新进入游戏！", function() {
                                cc.jsInstance.audioManager.playBtnClick();
                                wx.exitMiniProgram();
                            });
                        });
                    }
                }
            });

            const updateManager = wx.getUpdateManager()
            updateManager.onCheckForUpdate(function(res) {
                // 请求完新版本信息的回调
                cc.logManager.info("是否有新版本===" + res.hasUpdate)
            });

            updateManager.onUpdateReady(function() {
                wx.showModal({
                    title: '更新提示',
                    content: '新版本已经准备好，是否重启应用？',
                    success: function(res) {
                        if (res.confirm) {
                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate();
                        }
                    }
                })
            });
            updateManager.onUpdateFailed(function() {
                // 新的版本下载失败
                cc.logManager.error("新的版本下载失败")
            });
        }
    },

});