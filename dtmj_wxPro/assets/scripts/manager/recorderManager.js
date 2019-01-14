cc.Class({
    extends: cc.Component,

    properties: {},
    onLoad() {this.init();},

    init() {
        this.recorderManager = wx.getRecorderManager();
        this.innerAudioContext = wx.createInnerAudioContext();
        this.tempFilePath = "";
    },
    //开始录音的时候
    start1() {
        var options = {
            duration: 10000, //指定录音的时长，单位 ms
            sampleRate: 16000, //采样率
            numberOfChannels: 1, //录音通道数
            encodeBitRate: 96000, //编码码率
            format: 'mp3', //音频格式，有效值 aac/mp3
            frameSize: 50, //指定帧大小，单位 KB
        };
        //开始录音
        this.recorderManager.start(options);//开始录音
        this.recorderManager.onStart(() => {//开始录音事件
            cc.logManager.info('recorder start')
        });
        //错误回调
        this.recorderManager.onError((res) => {//录音错误事件, 会回调错误信息
            cc.logManager.error('recorder Error=',res);
        });
        this.recorderManager.onPause(() => {//暂停录音事件
            cc.logManager.info('recorder pause');
        });
        this.recorderManager.onStop((res) => {//停止录音事件
            cc.logManager.info('recorder stop=', res);
            this.tempFilePath = res.tempFilePath;
            const {
                tempFilePath
            } = res
        });
        this.recorderManager.onFrameRecorded((res) => {//已录制完指定帧大小的文件，会回调录音分片结果数据。如果设置了 frameSize ，则会回调此事件
            cc.logManager.info('recorder recorderManager=', res)
            const {
                frameBuffer
            } = res
            cc.logManager.info('frameBuffer.byteLength=', frameBuffer.byteLength)
        });
    },
    //停止录音
    stop() {
        this.recorderManager.stop();
        this.recorderManager.onStop((res) => {
            this.tempFilePath = res.tempFilePath;
            cc.logManager.info('停止录音', res.tempFilePath)
            const {
                tempFilePath
            } = res

        })
    },

    //播放声音
    play() {
        this.innerAudioContext.autoplay = true;
        this.innerAudioContext.src = this.tempFilePath,
            this.innerAudioContext.onPlay(() => {
                cc.logManager.info('开始播放')
            })
        this.innerAudioContext.onError((res) => {
            cc.logManager.info(res.errMsg)
            cc.logManager.info(res.errCode)
        })

    },
    // update (dt) {},
});