var http = {
    // calback(err, data)
    // url 站点: http://www.baidu.com
    // path 子路径 /index.htm
    // params: key1=value1&key2=value2&key3=value3
    // callback: 当这个请求有回应的时候调用这个callback函数;
    // (err, ret) 如果有错误err != null, 如果没有错误error == null
    get: function(url, path, params, callback) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5000;
        var requestURL = url + path;
        if (params) {
            requestURL = requestURL + "?" + params;
        }
         
        xhr.open("GET",requestURL, true);
        if (cc.sys.isNative){
            xhr.setRequestHeader("Accept-Encoding","gzip,deflate","text/html;charset=UTF-8");
        }else{
             xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }
       
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                cc.logManager.info("http res("+ xhr.responseText.length + "):" + xhr.responseText);
                try {
                    // var ret = JSON.parse(xhr.responseText);
                    var ret = xhr.responseText;
                    if(callback !== null){
                        callback(null, ret);
                    }                        /* code */
                } catch (e) {
                    cc.logManager.error("err:" + e);
                    callback(e, null);
                }
                finally{
                    if(cc.vv && cc.vv.wc){
                    //       cc.vv.wc.hide();    
                    }
                }
            }
        };
        
        if(cc.vv && cc.vv.wc){
            //cc.vv.wc.show();
        }
        xhr.send();
        return xhr;
    },

    // post和get区别是post能带数据body,其他的和get一样
    post: function(url, path, params, body, callback) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5000;
        var requestURL = url + path;
        if (params) {
            requestURL = requestURL + "?" + params;
        }
        xhr.open("POST",requestURL, true);
        if (cc.sys.isNative){
            xhr.setRequestHeader("Accept-Encoding","gzip,deflate","text/html;charset=UTF-8");
        }

        if (body) {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            // xhr.setRequestHeader("Content-Length", body.length);
        }
        

        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                cc.logManager.info("http res("+ xhr.responseText.length + "):" + xhr.responseText);
                try {
                    // var ret = JSON.parse(xhr.responseText);
                    var ret = xhr.responseText;
                    if(callback !== null){
                        callback(null, ret);
                    }                        /* code */
                } catch (e) {
                    cc.logManager.info("err:" + e);
                    callback(e, null);
                }
                finally{
                    if(cc.vv && cc.vv.wc){
                    //       cc.vv.wc.hide();    
                    }
                }
            }
        };
        
        if(cc.vv && cc.vv.wc){
            //cc.vv.wc.show();
        }
        if (body) {
            xhr.send(body);
        }
        return xhr;
    }, 

    // 下载他是基于get操作，参数也一样，为什么不用get那个函数呢？
    download: function(url, path, params, callback) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5000;
        var requestURL = url + path;
        if (params) {
            requestURL = requestURL + "?" + params;
        }

        xhr.responseType = "arraybuffer";  // 指定我们的数据类型

        xhr.open("GET",requestURL, true);
        if (cc.sys.isNative){
            xhr.setRequestHeader("Accept-Encoding","gzip,deflate","text/html;charset=UTF-8");
        }

        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                var buffer = xhr.response;
                var data = new Uint8Array(buffer); // arraybuffer, new Unit8Array
                callback(null, data);
            }
        };
        
        if(cc.vv && cc.vv.wc){
            //cc.vv.wc.show();
        }
        xhr.send();
        return xhr;
    },

    
};

module.exports = http;


