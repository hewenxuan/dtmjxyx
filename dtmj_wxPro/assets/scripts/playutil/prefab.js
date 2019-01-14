
cc.Class({
    extends: cc.Component,

    properties: {

        itemScrollView:{
            type:cc.Node,
            default:null,
        },

        //预制体
        prefabItem:{
            type:cc.Prefab,
            default:null,
        },

        //装预制体content
        itemContent:{
            type:cc.Node,
            default:null,
        },

        //默认头像
        defaultIcon:{
            type:cc.SpriteFrame,
            default:null, 
        },
    },

    onLoad () {
        this.tData = cc.jsInstance.data.sData.tData;

        if(!this.tData.desktop){
            return;
        }
        //只初始化一次的数据
        this.initDataOnlyOnce();
        
		//初始化数据
        this.initData();
        
        //预制体缓存池，只初始化一次
        this.initPrefabItemCachePool();
        
        //监听滑动结束事件
        this.itemScrollView.on("scroll-ended", this.scrollEnded.bind(this), this);
        
        //启动定时器
		this.beginCountDown();
    },

    initDataOnlyOnce(){
        if(cc.jsInstance.countDownLeftTime){
            this.countDownLeftTime = cc.jsInstance.countDownLeftTime.slice(0);
        }else{
            this.countDownLeftTime = [];                                    //记录每个item剩余时间的大数组 
        }
        this.initStart_Y = this.itemContent.y;                          //列表content的初始y的位置 
        this.prefabItemCachePool = [];                                  //所有预制体的存放池
        this.itemContentHeight = this.itemContent._contentSize.height   //content高度
		this.itemHeight = this.prefabItem.data._contentSize.height		//预制体的高度
    },

	inviteFriendForGroup:function(invitedUid){
		cc.jsInstance.network.InvitePlayer2Desk(cc.jsInstance.clubId_Now,invitedUid,this.tData.desktop,function(data){
			console.log("invite Friends Success!====");
		});
	},

    //tableview 刷新数据
    reLoadData(start_index){
        this.start_index = start_index;
        for(var i = 0; i < this.prefabItemCachePool.length; i ++) {
            var friendItemPrefab = this.prefabItemCachePool[i];
            //注意替换节点
            var invitedNode = friendItemPrefab.getChildByName("invited");
            var inviteNode = friendItemPrefab.getChildByName("invite");
			var label = friendItemPrefab.getChildByName("name").getComponent(cc.Label);
            var inviteLab = friendItemPrefab.getChildByName("invited").getChildByName("inviteLab").getComponent(cc.Label);
            
            friendItemPrefab.physicalLocation = start_index+i;
            
			if(start_index + i < this.countDownLeftTime.length){
                friendItemPrefab.active = true;
                var itemTemp = this.countDownLeftTime[start_index+i];
                
                //赋值
                if(itemTemp.isClicked){
                    invitedNode.active = true;
                    inviteNode.active = false;
                    inviteLab.string = "邀请"+itemTemp.time+"s";
                    this.upDateLableString(friendItemPrefab);
                }else{
                    invitedNode.active = false;
                    inviteNode.active = true;
                    inviteLab.string = "120s";
                }

                //this.prefabData 对象取到name
                var freePlayer = this.prefabData[start_index+i];
                label.string = unescape(freePlayer.nickname).substr(0, 6);
                var head = friendItemPrefab.getChildByName("headIcon").getChildByName("headLayer");
                if(freePlayer.headimgurl){
                    cc.jsInstance.native.setHeadIcon(head,freePlayer.headimgurl);
                }else{
                    head.getComponent(cc.Sprite).spriteFrame = this.defaultIcon;
                }
                friendItemPrefab.getChildByName("state").getComponent(cc.Label).string = "空闲";
                friendItemPrefab.getChildByName("state").color =cc.color(0x8F,0xED,0x90);
				
            }else{
                friendItemPrefab.active = false;
				continue;
            }
            
			
        }
	},

    //更新UI
	upDateLableString(item){
        var self = this;
        //定时器2，做赋值操作
		this.schedule(function(){
            if(self.countDownLeftTime.length >0){
                var index = item.physicalLocation;
                if(index < self.countDownLeftTime.length){
                    var tempItem = self.countDownLeftTime[index];

                    if(tempItem.isClicked){
                        //注意替换节点
                        item.getChildByName("invited").active = true;
                        item.getChildByName("invite").active = false;
                        item.getChildByName("invited").getChildByName("inviteLab").getComponent(cc.Label).string = "邀请"+tempItem.time+"s";
                    }else{
                        item.getChildByName("invited").active = false;
                        item.getChildByName("invite").active = true;
                        item.getChildByName("invited").getChildByName("inviteLab").getComponent(cc.Label).string = "邀请120s";
                        tempItem.isClicked = false;
                        tempItem.time = 120;
                    }
                }
            }
		},1);
	},

	scrollEnded(){
		this.scrollveiwDidScrolled();
		this.itemScrollView.elastic = true;
	},


	scrollveiwDidScrolled(){
        //因为只拿了一个item复用，所以滑动的范围只要大于1就要重新加载
        //向下滑
        var isScrollDown = (this.start_index + this.page_num < this.prefabData.length&&this.itemContent.y - this.start_y >= this.itemHeight);
		if(isScrollDown){
            this.scrollDown();
            return;
        }

        //向上滑
        var isScrollUp = (this.start_index > 0&& this.start_y - this.itemContent.y >= 0);
		if(isScrollUp){
			this.scrollUp();
		}
    },
    
    scrollDown(){
        //如果滑动的范围大于了1个item的高度，就要去加载新的数据
        //每次加载一个数据

        if(this.itemScrollView._autoScrolling){
            this.itemScrollView.elastic = false;
            return;
        }

        var down_loaded = 1;
        this.start_index += down_loaded;

        //如果往后再加载一个数据就超过了总的数据长度
        console.log("start_index==",this.start_index);
        console.log("this.prefabData.length==",this.prefabData.length);
        if(this.start_index + this.page_num > this.prefabData.length){
            //down_loaded要剪掉超过的项
            var out_len = (this.start_index + this.page_num) - this.prefabData.length; //超过的长度
            down_loaded -= out_len;
            this.start_index -= out_len;
            console.log("out out out out !!");
        }
        this.reLoadData(this.start_index);
        this.itemContent.y -= down_loaded*this.itemHeight;            
    },

    scrollUp(){
        if(this.itemScrollView._autoScrolling){
            this.itemScrollView.elastic = false;
            return;
        }
        var up_loaded = 1;
        this.start_index -= up_loaded;
        if(this.start_index < 0){
            up_loaded += this.start_index;
            this.start_index = 0;
        }
        this.reLoadData(this.start_index);
        this.itemContent.y += up_loaded*this.itemHeight;
    },

    showClick(){
        this.node.active = true;
        //重新获取数据
        if(!this.tData){
            this.tData = cc.jsInstance.data.sData.tData;
        }
        this.node.getChildByName("titleLab").getComponent(cc.Label).string = "邀请 "+ unescape(this.tData.clubName).substr(0, 6) + "的亲友圈成员加入房间";
        this.initData();
    },

    hiddeClick(){
        this.node.active = false;
    },

	//定时器
    beginCountDown(){
		this.countDownCallBack = function(){
            if(cc.jsInstance.countDownLeftTime){
                for(var i = 0; i < cc.jsInstance.countDownLeftTime.length;i++){
                    var tempItem = cc.jsInstance.countDownLeftTime[i];
                    if(tempItem.isClicked){
                        tempItem.time--;
                        if(tempItem.time === 0){
                            tempItem.time = 120;
                            tempItem.beginTime = "";
                            tempItem.isClicked = false;
                        }
                    }
                }
            }
		};
		this.schedule(this.countDownCallBack,1);
    },

    //获取时间戳
    getTimeStamp(){
        return Date.parse(new Date()).valueOf()/1000;
    },

    initPrefabItemCachePool:function(){
		//计算并且初始化需要的最多的预制体个数
		var self = this;
        this.page_num = Math.floor(this.itemContentHeight/this.itemHeight)+1; 
        
		for(let i = 0; i < this.page_num;i++){
            let prefabItem = cc.instantiate(this.prefabItem);

            //初始化时全部隐藏
            prefabItem.active = false;
            prefabItem.parent = this.itemContent;
            
            //这个地方注意下预制体的结构，自己获取要去监听的部分
            
			prefabItem.getChildByName("invite").on(cc.Node.EventType.TOUCH_END, function(touchEvent){
				let index = prefabItem.physicalLocation;
                let tempItem = self.countDownLeftTime[index];
                let freePlayer = self.prefabData[index];
                tempItem.isClicked = true;
                tempItem.beginTime = self.getTimeStamp();
                self.upDateLableString(prefabItem);	
                self.inviteFriendForGroup(freePlayer.uid);			
			}, prefabItem.getChildByName("invite"));
			this.prefabItemCachePool.push(prefabItem);	
        }
    },

    update (dt) {
		this.scrollveiwDidScrolled();
	},
	
    /**
     * 每次重新拉取新的数据都进行的初始化操作
     */
	initData(){
        //this.initStart_Y 这个只初始化了一次所以是固定值 
        //防止误修改
		this.start_y = this.initStart_Y; 

        //content从头开始
        this.itemContent.y = this.initStart_Y;

		//数据的索引初始化
        this.start_index = 0;

        this.tData = cc.jsInstance.data.sData.tData;
        
        //请求新的数据
        this.getData();
    },

    initCountDownLeftTimeArr(){
        this.countDownLeftTime = [];
        for(var i = 0; i < this.prefabData.length;i++){
            var freePlayer = this.prefabData[i];
            var temp ={
                name:freePlayer.nickname, //用户名称
                time:120,//倒计时时间
                isClicked:false,//是否被点击过
                beginTime:"",
            }
            this.countDownLeftTime.push(temp);	
        }
    },
    
    //请求新的数据 
    getData(){
        var self = this;
        this.prefabData = [];
        cc.jsInstance.network.FreePlayers(this.tData.groupid,function(data){
            console.log("friendLists====");
            if(data.players.length < 1){
                //没有玩家
                self.itemScrollView.getChildByName("view").getChildByName("content").active = false;
                self.node.getChildByName("noFriendTipLab").active = true;
                self.countDownLeftTime = [];
            }else{
                //遍历赋值
                self.itemScrollView.getChildByName("view").getChildByName("content").active = true;
                self.node.getChildByName("noFriendTipLab").active = false;
                self.prefabData = data.players;
                //清空下线数据，增加新上线数据
                self.updatePrefabData();
            }
        }); 		
    },

    //更新数据
    updatePrefabData(){

        //每次都初始化
        this.initCountDownLeftTimeArr();

        //首次进入
        if(!cc.jsInstance.countDownLeftTime){
            cc.jsInstance.countDownLeftTime = this.countDownLeftTime.slice(0);
        }else{

            //所有的名字数组
            var allNames = [];
            allNames = this.setNameArr(allNames);
            
            //如果总的数据里面有这个数据，那么countDownlefttime中的数据直接从数据里面取就好了
            //如果没有，那么更新总的数据库 ，不用替换
            for(var i = 0; i < this.countDownLeftTime.length;i++){
                var item = this.countDownLeftTime[i];
                var index = allNames.indexOf(item.name);
                if(index >= 0){
                    var oldItem = cc.jsInstance.countDownLeftTime[index];
                    this.countDownLeftTime[i] = oldItem;
                }else{
                    cc.jsInstance.countDownLeftTime.push(item);
                }
            }

        }
        
        this.dealWithBeginTimeForLeftTime();

        this.reLoadData(0);
    },


    dealWithBeginTimeForLeftTime(){
        for(var i = 0; i < this.countDownLeftTime.length;i++){
            var item = this.countDownLeftTime[i];
            if(item.isClicked){
                var time = 120 - (this.getTimeStamp() - item.beginTime);
                if(time > 0){
                    item.time = time;
                }else{
                    item.time = 120;
                    item.isClicked = false;
                }
            }
        }
    },

    setNameArr(nameArr){
        for(var i = 0; i < cc.jsInstance.countDownLeftTime.length;i++){
            var item = cc.jsInstance.countDownLeftTime[i];
            nameArr.push(item.name);
        }
        return nameArr
    },
});
