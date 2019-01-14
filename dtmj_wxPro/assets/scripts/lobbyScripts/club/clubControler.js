cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad() {},

    //---------------俱乐部管理员相关-------begin---------//
    setCurrClubData(clubData) {
        this.currClubData = clubData;
    },
    getCurrClubData() {
        return this.currClubData;
    },

    //获取成员等级 level:0:普通会员 1:房主 2:管理员
    getMemberByUid(uid, members) {
        var memberInfo = null
        if (members) {
            for (var i = 0; i < members.length; i++) {
                var tempM = members[i];
                if (tempM.uid == uid) {
                    memberInfo = tempM;
                    break;
                }
            }
        }
        return memberInfo;
    },

    //判断玩家是否是管理员 
    havePower(needLevel, clubId, uid) {
        var needL = needLevel ? needLevel : 1; //默认需要一级
        var level = this.getMLevel(clubId, uid);
        return level >= needL ? true : false;
    },

    //获取玩家权限,clubId:默认值为当前俱乐部id.uid:默认值为当前玩家
    getMLevel(clubId, uid) {
        var level = 0; //等级分0-10,房主10级 管理员9级
        var tempClubId = clubId ? clubId : cc.jsInstance.clubId_Now;
        var tempUid = uid ? uid : this.SelfUid();
        var currData = this.getCurrClubData();
        if (cc.jsInstance.data.pinfo.foundedClub == tempClubId) {
            level = 10;
        } else if (currData && tempClubId == cc.jsInstance.clubId_Now) { //仅能获取当前俱乐部的玩家数据
            var memberInfo = this.getMemberByUid(tempUid, currData.members);
            if (memberInfo && memberInfo.manager > 0) {
                level = 9;
            }
        }
        return level;
    },
    //state:1:管理员 null
    changeManager(uid, state) {
        var currData = this.getCurrClubData();

        if (currData) {
            var memberInfo = this.getMemberByUid(uid, currData.members);
            if (state == 1) {
                memberInfo.manager = state;
            } else {
                delete memberInfo.manager;
            }
        }
    },
    //如果是管理员,则请求参数附加上 clubId
    attachClubId(params) {
        if (this.getCurrClubData() && this.getMLevel() == 9) { //管理员权限
            params.clubId = parseInt(this.getCurrClubData().id);
        }
    },
    //---------------俱乐部管理员相关-------end---------//
    SelfUid() {
        return cc.jsInstance.data.pinfo.uid
    },

});