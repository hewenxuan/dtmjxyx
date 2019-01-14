cc.Class({
    extends: cc.Component,

    properties: {

        bgmVolume: 1.0,
        sfxVolume: 1.0,

        bgmAudioID: -1,
    },

    onload: function() {

    },

    init: function() {
        var t = cc.sys.localStorage.getItem("bgmVolume");
        if (t || t === 0) {
            this.bgmVolume = parseFloat(t);
            cc.logManager.info("init背景音量=" + t);
        } else {
            this.bgmVolume = 0.5;
            cc.sys.localStorage.setItem("bgmVolume", this.bgmVolume);
        }

        var t = cc.sys.localStorage.getItem("sfxVolume");
        if (t || t === 0) {
            this.sfxVolume = parseFloat(t);
        } else {
            this.sfxVolume = 0.5;
            cc.sys.localStorage.setItem("sfxVolume", this.sfxVolume);
        }
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            // cc.logManager.info("设置声游戏前台后台监听。。。微信小游戏在wx.onhide和wx.onShow里处理过");
            cc.game.on(cc.game.EVENT_HIDE, function() {
                cc.logManager.info("cc.audioEngine.pauseAll");
                cc.audioEngine.pauseAll();
            });
            cc.game.on(cc.game.EVENT_SHOW, function() {
                cc.logManager.info("cc.audioEngine.resumeAll");
                cc.audioEngine.resumeAll();
            });
        }
    },

    getUrl: function(url, path) {
        if (path) {
            return cc.url.raw("resources/sound/" + path + "/" + url + ".mp3");
        }
        return cc.url.raw("resources/sound/" + url + ".mp3");
    },

    getBgmName() {
        return this.bgm;
    },
    playBGMDDZ(url) {
        this.playBGM(url, "ddz_sound");
    },
    playBGM(url, path) {
        this.bgm = url;
        cc.audioEngine.stopAll();
        var audioUrl = this.getUrl(url, path);
        var t = cc.sys.localStorage.getItem("bgmVolume");
        if (t || t === 0) {
            this.bgmVolume = parseFloat(t);
        }
        this.bgmAudioID = cc.audioEngine.play(audioUrl, true, this.bgmVolume);
        if (this.bgmVolume > 0) {
            this.setBGMVolume(this.bgmVolume);
        } else {
            cc.audioEngine.pause(this.bgmAudioID);
        }
    },

    playSFXForDDZ(url) {
        this.playSFX(url, "ddz_sound");
    },

    playSFX(url, path) {
        var audioUrl = this.getUrl(url, path);
        if (this.sfxVolume > 0) {
            var t = cc.sys.localStorage.getItem("sfxVolume");
            if (t || t === 0) {
                this.sfxVolume = parseFloat(t);
            }
            var audioId = cc.audioEngine.play(audioUrl, false, this.sfxVolume);
        }
    },

    playBtnClick(path) {
        var audioUrl = this.getUrl("btn_click_effect", path);
        if (this.sfxVolume > 0) {
            var t = cc.sys.localStorage.getItem("sfxVolume");
            if (t || t === 0) {
                this.sfxVolume = parseFloat(t);
            }
            var audioId = cc.audioEngine.play(audioUrl, false, this.sfxVolume);
        }
    },

    setSFXVolume: function(v) {
        if (this.sfxVolume != v) {
            cc.sys.localStorage.setItem("sfxVolume", v);
            this.sfxVolume = v;
            cc.logManager.info("设置音效音量=====" + this.sfxVolume);
        }
    },

    setBGMVolume: function(v, force, iscon) {
        if (this.bgmAudioID >= 0) {
            if (v > 0) {
                cc.audioEngine.resume(this.bgmAudioID);
                var state = cc.audioEngine.getState(this.bgmAudioID);
            } else {
                cc.audioEngine.pause(this.bgmAudioID);
                var state = cc.audioEngine.getState(this.bgmAudioID);
            }
        } else {
            cc.logManager.info("没有发现正在播放的背景音乐，重新播放");
            cc.audioEngine.stopAll();
            var audioUrl = this.getUrl("bgGame", path);
            this.bgmAudioID = cc.audioEngine.play(audioUrl, true, v);
        }
        if (this.bgmVolume != v || force) {
            if (iscon) {
                v = this.bgmVolume;
            }
            cc.sys.localStorage.setItem("bgmVolume", v);
            this.bgmVolume = v;
            cc.audioEngine.setVolume(this.bgmAudioID, v);
            cc.logManager.info("设置背景音乐音量=====" + this.bgmVolume);
        }
    },

    //暂停所有音乐
    pauseAll: function() {
        cc.audioEngine.pauseAll();
    },

    //恢复所有音乐
    resumeAll: function() {
        cc.audioEngine.resumeAll();
    }
});