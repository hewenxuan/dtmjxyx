var logLevel = {
    ERROR:3,
    WARN:2,
    INFO:1,
    ALL:0,
}

var logLevelColor = {
    ErrorRedColor:'#8e2323',
    WarnYellowColor:'#d9d910',
    InfoGreenColor:'#238e23',
    AllBuleColor:'#00009c',
}

var platform = {
    web:0,
    wechat:1,
    ios:2,
    android:3,
    server:4,
}

//初始化为web
var globalPlatform = platform.web;
var globalLevel = logLevel.ALL;

//层级过滤
var Filter = {
    level:3,    //过滤级别
    isOn:false, //是否开启
}

var logManager = cc.Class({
    error(str,obj) {
        this.setFormatForLog(logLevel.ERROR,str,obj);
    },
    
    warn(str,obj){
        this.setFormatForLog(logLevel.WARN,str,obj);
    },
    
    //最多支持传两个参数，一个string类型，obj类型随意
    info(str,obj){
        this.setFormatForLog(logLevel.INFO,str,obj);
    },
    
    all(str,obj){
        this.setFormatForLog(logLevel.ALL,str,obj);
    },
    
    setFormatForLog(level,str,obj){

        //微信小游戏平台不支持打印对象，转化成字符串
        if(globalPlatform === platform.wechat){
            if(typeof(obj)==="object"){
                obj = "wechat not support log obj!";
            }
        }
    
        //开启日志过滤
        if(Filter.isOn){
            this.filterForLogLevel(level,str,obj);
        }else{
            this.beginLog(level,str,obj);
        }
    },   
    
    beginLog(level,str,obj){
        var preString;
        if(!obj&&typeof(str)!="string"){
            obj = str;
        }

        switch(level){
            case logLevel.ERROR:
                preString = "[error]:";
                if(!obj){
                    console.log('%c '+preString+str,'color:#8e2323');
                }else{
                    console.log('%c '+preString+str,'color:#8e2323',obj);
                }
                break;
            case logLevel.WARN:
                preString = "[warn]:";
                if(!obj){
                    console.log('%c '+preString+str,'color:#d9d910');
                }else{
                    console.log('%c '+preString+str,'color:#d9d910',obj);
                }
                break;
            case logLevel.INFO:
                preString = "[info]:";
                if(!obj){
                    console.log('%c '+preString+str,'color:#238e23');
                }else{
                    console.log('%c '+preString+str,'color:#238e23',obj);
                }
                break;
            case logLevel.ALL:
                preString = "[all]:";
                if(!obj){
                    console.log('%c '+preString+str,'color:#00009c');
                }else{
                    console.log('%c '+preString+str,'color:#00009c',obj);
                }
                break;
        }
    },
    
    filterForLogLevel(logLevel,str,obj){
        if(logLevel >= Filter.level){
            this.beginLog(logLevel,str,obj);
        }
    },
});






