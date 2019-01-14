cc.Class({
    extends: cc.Component,
    properties: {
    },
    // 获取反馈相关内容
    setFeedBackJson(wxid, content) {
        var productName = "dtmj"; // 产品名称
        var playerUid = cc.jsInstance.data.pinfo.uid; // 用户uid
        var nickName = unescape(cc.jsInstance.data.pinfo.nickname || cc.jsInstance.data.pinfo.name).substr(0, 6); // 用户名称
        var contactInfo = wxid; // 联系方式
        var feedbackText = content; // 反馈内容
        var feedbackJson = {
            field_1: productName,
            field_2: nickName,
            field_3: playerUid,
            field_4: contactInfo,
            field_5: String(feedbackText)
        };
        // cc.logManager.info("terry feedbackJson feedbackJson feedbackJson: " + JSON.stringify(feedbackJson));
        return feedbackJson;
    },

    btnOK_click() {
        var self = this;
        cc.jsInstance.audioManager.playBtnClick();
        var content = this.node.getChildByName("surfaceLayer").getChildByName("dt_tanchukuang_feedbackBg").getChildByName("content").getComponent(cc.EditBox).string
        var wxid = this.node.getChildByName("surfaceLayer").getChildByName("dt_tanchukuang_phone").getChildByName("wxid").getComponent(cc.EditBox).string
        if (content.length === 0) {
            cc.jsInstance.msgpop.showMsg_text_close_nocancle("您填入的反馈内容太少！", function() {
                cc.jsInstance.audioManager.playBtnClick();
            });
            return;
        } else if (wxid.length === 0) {
            cc.jsInstance.msgpop.showMsg_text_close_nocancle("请输入您的微信号！", function() {
                cc.jsInstance.audioManager.playBtnClick();
            });
            return;
        } else {
            cc.jsInstance.msgpop.showMsg_text_close_nocancle("确认提交反馈吗？", function() {
                cc.jsInstance.audioManager.playBtnClick();
                //提交反馈
                var feedbackJson = self.setFeedBackJson(wxid, content);
                // cc.logManager.info("terry feedbackJson feedbackJson feedbackJson: " + JSON.stringify(feedbackJson));
                cc.jsInstance.network.faceBack(feedbackJson, function(rtn) {
                    // cc.logManager.info("rtn: " + JSON.stringify(rtn));
                    // var result = JSON.stringify(rtn)
                    // if (rtn.code == 500) {
                    //   cc.jsInstance.audioManager.playBtnClick();
                    //   cc.jsInstance.msgpop.showMsg_text_close_nocancle("反馈成功！", function() {
                    //     self.node.active = false;
                    //   });
                    // }
                    cc.jsInstance.msgpop.showMsg_text_close_nocancle("反馈成功！", function() {
                        self.node.active = false;
                        cc.jsInstance.audioManager.playBtnClick();
                    });

                });
                return;
            });
        }
    },
    close() {
        var self = this;
        self.node.active = false;
        cc.jsInstance.audioManager.playBtnClick();
    },
});