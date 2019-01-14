var ZJHCode = cc.Enum({
    Success: 0,
    Fail: 1,

    verifyPlayerFail: 2,
    emailUsed: 3,
    emailValid: 4,
    invalidMail: 5,
    playerNotFound: 6,
    guestCanNotRecommend: 7,
    canNotLogin: 8,
    alreadyInGame: 9,
    keepInGame: 10,

    sqlError: 30,
    lessMoney: 31,
    lessCoin: 32,

    clientRestart: 33,
    clientUpdate: 34,
    bindError: 35,

    joinRoomOK: 36,
    cfgVersionChange: 37,
    alreadyInRoom: 38,
    roomFull: 39,
    slotNotFound: 40,
    roomNotFound: 41,

    zjhCfgChange: 50,
    zjhDateEnd: 51,
    zjhCfgStop: 52,
    roomInPlay: 53,
    playerNotWaitStart: 54,

    joinActOK: 60,
    canNotJoinActInPlay: 61,
    joinWrongAct: 62,
    alreadyInAct: 63,
    actClosed: 64, //no use
    invalidActPos: 65,
    invalidActRoom: 66,
    actEnd: 67,
    invaliReward: 68,

    //add member to myroom
    canNotAddSelf: 80,
    isMemberAlready: 81,
    memberNotFound: 82,
    addMemberOK: 83,
    removeMemberOK: 84,
    membersNumLimit: 85,
    memberofNumLimit: 86,
    authAddPlayerExist: 87,

    rpcErr: 100,
    loginToMuch: 101,
    errorState: 102,
    serverFull: 103,
});

module.exports = ZJHCode;