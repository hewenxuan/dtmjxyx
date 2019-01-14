const ZJHCode = require('ZJHCode');
cc.Class({
    extends: cc.Component,
    properties: {
        weChatLoginBtn: {
            type: cc.Node,
            default: null,
        },
        CheckBox: {
            type: cc.Node,
            default: null,
        },
        legal: {
            type: cc.Node,
            default: null,
        },
    },

    showlegal: function() {
        this.legal.active = true;
        cc.jsInstance.native.setScaleAction(this.legal.getChildByName("surfaceLayer"));
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (cc.jsInstance.userInfoBtn) {
                cc.jsInstance.userInfoBtn.hide();
            }
        }
    },
    //游客登陆
    guestBtnClick: function() {
        cc.jsInstance.audioManager.playBtnClick();
        var self = this;
        //点击微信登录 
        if (this.isCheckBox) {
            cc.jsInstance.block.show("正在登录中...");
            this.guestLogin(); //游客登录
            if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                if (cc.jsInstance.userInfoBtn) {
                    cc.jsInstance.userInfoBtn.hide();
                }
            }
        } else {
            //提示 请先同意协议 
            // cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("请同意用户协议", function() {
            //     cc.jsInstance.audioManager.playBtnClick();
            //     if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            //         var wxlogininfo = cc.sys.localStorage.getItem('wxloginData'); //从缓存取用户信息
            //         if (!wxlogininfo) {
            //             if (cc.jsInstance.userInfoBtn) {
            //                 cc.jsInstance.userInfoBtn.show();
            //             }
            //         }
            //     }
            // })
            cc.jsInstance.bayWindow.openBayWindow("请先勾选同意《用户协议》");
            return;
        }
    },
    //微信登陆  
    weChatLoginBtnClick: function() {
        cc.jsInstance.audioManager.playBtnClick();
        var self = this;
        //点击微信登录 
        if (this.isCheckBox) {
            if (cc.jsInstance.gamenet.isConnect) {
                // cc.jsInstance.block.show("正在登录中...");
                //调用微信api接口 暂时无api 切换场景
                if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                    self.wxLoginNative();
                } else {
                    this.guestLogin(); //游客登录
                }
            } else {
                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("服务已断开连接！", function() {
                    cc.jsInstance.audioManager.playBtnClick();
                    cc.logManager.info("disconnect===11===网络已断开----------login----------");
                    cc.jsInstance.native.reConnect("login-11");
                })
                return;
            }
        } else {
            //提示 请先同意协议 
            // cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("请同意用户协议", function() {
            //     cc.jsInstance.audioManager.playBtnClick();
            // })
            cc.jsInstance.bayWindow.openBayWindow("请先勾选同意《用户协议》");
            return;
        }
    },
    wxLoginNative() {
        cc.jsInstance.block.show();
        var self = this;
        if (!cc.jsInstance.gamenet.isConnect) {
            cc.logManager.info("-----服务已断开连接，不能继续往下走---wxLoginNative----", );
            cc.jsInstance.block.hide();
            cc.jsInstance.native.reConnect("login-00");
            return;
        }
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
                                if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                                    wx.exitMiniProgram();
                                }
                            })
                            return;
                        }

                        self.openid = rtn.openid;
                        self.unionid = rtn.unionid;
                        self.session_key = rtn.session_key;
                        // cc.logManager.info("rtn.openid====" + rtn.openid);
                        var wxlogininfo = cc.sys.localStorage.getItem('wxloginData'); //从缓存取用户信息
                        if (wxlogininfo && wxlogininfo != 0) {
                            cc.logManager.info("--------缓存拿到openid----");
                            cc.logManager.info("缓存拿到用户信息-------------------login----------------wxloginData-----" + JSON.stringify(res.userInfo));
                            if (cc.jsInstance.gamenet.isConnect) {
                                cc.logManager.info("wxloginData==" + JSON.stringify(wxlogininfo));
                                cc.jsInstance.block.show("自动登录中...");
                                self.f_login({
                                    openid: self.openid,
                                    nickname: escape(wxlogininfo.nickName),
                                    lType: "wx",
                                    // code: self.code,
                                    unionid: self.unionid,
                                    headimgurl: wxlogininfo.avatarUrl
                                });

                                return;
                            } else {
                                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("服务已断开连接！", function() {
                                    cc.jsInstance.audioManager.playBtnClick();
                                    cc.logManager.info("disconnect===22===网络已断开----------login----------");
                                    cc.jsInstance.native.reConnect("login-22");
                                })
                                return;
                            }
                        }
                        if (cc.jsInstance.userInfoBtn) {
                            cc.logManager.info("微信登录按钮存在----------------------------login--------------------");
                        } else {
                            cc.logManager.info("微信登录按钮不存在-----------------------login-------------------------");
                        }
                        cc.jsInstance.userInfoBtn.show();
                        cc.jsInstance.block.hide();
                        cc.jsInstance.userInfoBtn.onTap(function(res) {
                            cc.logManager.info("-----userInfoBtn--------onTap---------");
                            if (!res.userInfo) {
                                return;
                            }
                            if (!cc.jsInstance.gamenet.isConnect) {
                                cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("服务已断开连接！", function() {
                                    cc.jsInstance.audioManager.playBtnClick();
                                    cc.logManager.info("disconnect===33===网络已断开----------login----------");
                                    cc.jsInstance.native.reConnect("login-33");
                                })
                                return;
                            }
                            cc.sys.localStorage.setItem("wxloginData", res.userInfo); //加入缓存
                            cc.logManager.info("获取用户信息-------------------login----------------wxloginData-----" + JSON.stringify(res.userInfo));
                            cc.jsInstance.audioManager.playBtnClick();
                            //点击微信登录 
                            if (self.isCheckBox) {
                                cc.jsInstance.userInfoBtn.offTap(this); //取消按钮点击监听
                                cc.jsInstance.userInfoBtn.hide();
                                cc.jsInstance.block.show("正在登录中...");
                                self.f_login({
                                    openid: self.openid,
                                    nickname: escape(res.userInfo.nickName), //
                                    lType: "wx",
                                    // code: self.code,
                                    unionid: self.unionid,
                                    headimgurl: res.userInfo.avatarUrl //
                                });
                            } else {
                                //提示 请先同意协议 
                                // cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("请同意用户协议", function() {
                                //     cc.jsInstance.audioManager.playBtnClick();
                                //     cc.jsInstance.userInfoBtn.show();
                                // })
                                cc.jsInstance.bayWindow.openBayWindow("请先勾选同意《用户协议》");
                                return;
                            }
                        });
                    });
                } else {
                    cc.logManager.info('登录失败！' + res.errMsg);
                }
            }
        });
    },
    guestLogin() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            var guest = cc.sys.localStorage.getItem("guestData");
            if (guest) guest = JSON.parse(guest);

            if (!guest) {
                this.getGuest();
            } else if (guest.mail && guest.code) {
                // cc.logManager.info("guest == ", guest);
                this.f_login(guest.mail, guest.code, true); //guest login
            } else {
                this.getGuest();
            }
        } else {
            if (!cc.jsInstance.gamenet.isConnect) {
                cc.logManager.info("-----服务已断开连接，不能继续往下走---guestLogin----", );
                cc.jsInstance.block.hide();
                return;
            }
            var userId = cc.jsInstance.globalUtils.getColumn("id") || "";
            var guest = cc.sys.localStorage.getItem('guestData' + userId);
            if (guest) guest = JSON.parse(guest);

            if (!guest) {
                this.getGuest();
            } else if (guest.mail && guest.code) {
                // cc.logManager.info("guest == ", guest);
                this.f_login(guest.mail, guest.code, true); //guest login
            } else {
                this.getGuest();
            }
        }
    },
    getGuest() {
        var self = this;
        // cc.jsInstance.gamenet.request("login.handler.reqGuestID", { app: "zjh" }, function (rtn) {
        cc.jsInstance.network.reqGuestID({
            app: "zjh"
        }, function(rtn) {
            if (rtn.result == 0) {
                cc.sys.localStorage.setItem("guestData", JSON.stringify(rtn));
                self.f_login(rtn.mail, rtn.code, false); //getGuest
                // self.f_login(rtn.mail, rtn.code, false);//getGuest
            }
        });
    },
    f_login(mail, code, isLocalGuest) {
        cc.logManager.info("mail === ", mail);
        cc.logManager.info("code == ", code);
        cc.logManager.info("isLocalGuest == ", isLocalGuest);
        if (cc.jsInstance.mail && cc.jsInstance.mail.length > 0) {
            mail = cc.jsInstance.mail;
        }
        if (cc.jsInstance.code && cc.jsInstance.mail.length > 0) {
            code = cc.jsInstance.code;
        }

        // mail = "100563";  
        // code = "hnrajt";

        // mail = "1000063";
        // code = "cfct60";


        // mail = "10000005"; //客户端测试 31
        // code = "f2vx8j";

        // mail = "10000286"; //客户端测试 31
        // code = "3s63vv";


        // mail = "10000131";
        // code = "i6ptrr";

        //  mail = "3";
        // code = "aqyz1n";
        var loginData = code ? {
            mail: mail,
            code: code
        } : mail;

        var self = this;
        // loginData.resVersion=jsInstance.resVersion;
        loginData.app = {
            appid: "com.coolgamebox.majiang",
            os: cc.sys.os
        };
        // loginData.remoteIP=jsInstance.remoteIP;
        loginData.gamekind = 1;
        // cc.jsInstance.gamenet.request("pkcon.handler.doLogin", loginData,
        cc.jsInstance.network.doLogin(loginData,
            function(rtn) {
                if (rtn.result == ZJHCode.Success) {
                    // self.getmsg(); //获取消息
                    cc.jsInstance.native.tickServer(); //获取服务器时间
                    cc.jsInstance.endRoomData = {};
                    cc.jsInstance.endRoomData.reason = -1; //亲友圈 endRoomData解散房间置为-1 
                    if (code) { //调试打开
                        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
                            var userId = cc.jsInstance.globalUtils.getColumn("id") || "";
                            cc.sys.localStorage.setItem("loginData" + userId, JSON.stringify(loginData));
                            cc.jsInstance.mail = mail;
                            cc.jsInstance.code = code;
                        }
                    }
                    if (rtn.clubjoinlist) {
                        cc.clubjoinlist = rtn.clubjoinlist;
                    } else {
                        cc.clubjoinlist = 0;
                    }
                    cc.jsInstance.dataManager.setData(rtn);
                    cc.jsInstance.msgpop.click_close();
                    cc.jsInstance.haveRoom = false;
                    cc.jsInstance.pinfo = rtn;
                    if (rtn.vipTable > 0) {
                        cc.jsInstance.HavePlayStartAnim = true; //是否播放过开局动画
                        if (rtn.ingame && rtn.ingame.groupid) { //亲友圈
                            cc.jsInstance.network.getJoinedClubs(function(data) {
                                if (data.result === 0) {
                                    cc.jsInstance.clubs = [];
                                    for (var key in data.clubs) {
                                        cc.jsInstance.clubs.push(data.clubs[key]);
                                    }
                                    cc.logManager.info("--cc.jsInstance.clubs----登录成功后，加入的俱乐部-------", cc.jsInstance.clubs);
                                    cc.jsInstance.native.JoinGameClub(cc.jsInstance.clubs, rtn.vipTable, rtn.ingame.groupid, rtn.ingame.desktop);
                                }
                            });
                        } else { //普通房间
                            cc.jsInstance.native.JoinGame(rtn.vipTable);
                        }
                        cc.jsInstance.haveRoom = true;
                        cc.jsInstance.pinfo.vipTable = rtn.vipTable;
                        return;
                    } else {
                        cc.jsInstance.network.getJoinedClubs(function(data) {
                            if (data.result === 0) {
                                cc.jsInstance.clubs = [];
                                for (var key in data.clubs) {
                                    cc.jsInstance.clubs.push(data.clubs[key]);
                                }
                                cc.logManager.info("--cc.jsInstance.clubs----登录成功后，加入的俱乐部-------", cc.jsInstance.clubs);
                            }
                            cc.jsInstance.block.show();
                        });
                        cc.jsInstance.HavePlayStartAnim = false; //是否播放过开局动画
                        if (rtn.incontest && rtn.incontest != "") { //比赛场  GM1 GM2 GM3
                            cc.jsInstance.network.leaveMJPlayground(rtn.incontest, function(res) {
                                if (res.result === 0) { //返回大厅

                                } else {
                                    cc.jsInstance.msgpop.showMsg_text_noclose_nocancle("离开金币场失败！", function() {});
                                }
                            });
                        }
                        if (rtn.incontestUniqueId && rtn.incontestUniqueId != "") { //金币比赛场  fid
                        }
                        // cc.jsInstance.globalUtils.send("loginOK", rtn);
                        cc.jsInstance.native.skipScene("lobby");
                    }
                } else if (rtn.result == ZJHCode.playerNotFound) {
                    if (isLocalGuest) {
                        self.getGuest();
                    }
                } else if (rtn.result == ZJHCode.serverFull) {} else if (rtn.result == ZJHCode.clientRestart) {} else if (rtn.result == ZJHCode.clientUpdate) {}
            });
    },

    start: function() {
        var self = this;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) { //
            // this.weChatLoginBtn.active = false;
            // self.node.getChildByName("LoginBg").getChildByName("DTLogin_wechat").active = false;
            self.wxLoginNative(); //第一次进来如果没有登录过会显示 创建出来的按钮需点击登录，第二次如果第一次登录过，会自动登录，如果是掉线重连的话，要手动点击登录
        } else {
            this.weChatLoginBtn.active = true;
            if (cc.jsInstance.mail && cc.jsInstance.mail.length > 0) {
                if (!cc.jsInstance.exit) {
                    self.guestLogin(); //游客登录
                }
            }
        }
    },
    onLoad() {
        cc.jsInstance.native.hideGameClubButton();
        var self = this;
        this.initEvents();
        this.node.getChildByName("version").getComponent(cc.Label).string = cc.jsInstance.version;
        cc.jsInstance.isShowMsgPop = true; //显示 弹窗
        this.isCheckBox = true;
        this.CheckBox.getChildByName("checkmark").active = true;
        if(cc.jsInstance.remoteCfg.servers != "dtmjssl1.datangyouxi.com:1441"){
           this.node.getChildByName("LoginBg").getChildByName("DTLogin_youke").active=true;
        }
    },

    checkBox_click() {
        this.isCheckBox = !this.isCheckBox;
        this.CheckBox.getChildByName("checkmark").active = this.isCheckBox;
    },

    loadLobby: function() {
        cc.jsInstance.native.skipScene("lobby");
    },

    initEvents() {
        var self = this;
        cc.jsInstance.globalUtils.dataEventHandler = this.node;
        this.node.on("loginOK", function(d) {
            self.loadLobby();
        })
    },
});