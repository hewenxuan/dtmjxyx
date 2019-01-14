(function () 
{
    var pokerCards = 
    [   
        103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115,//方块 3--2
        203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215,//米花
        303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315,//红桃
        403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415,//黑桃
        555, 550 //大小王
    ];
    // var poker_base = {};
    function poker_base() {};
    poker_base.prototype.cardTypes = {};
    poker_base.prototype.baseTypes = {
        // 单张
        singleCard: {
            level: 1,
            colorFormat: false,
            numFormat: [1],
            allowedLength: [1],
            effectNum: true
        },
        // 一对
        doubleCards: {
            level: 1,
            colorFormat: false,
            numFormat: [1, 1],
            allowedLength: [2],
            effectNum: true,
            notAllowedCard: []
        },
        // 顺子
        straights: {
            level: 1,
            colorFormat: false,
            numFormat: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            allowedLength: [5, 6, 7, 8, 9, 10, 11, 12],
            notAllowedCard: [15]
        },
        // 连对
        doublestraights: {
            level: 1,
            colorFormat: false,
            numFormat: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12],
            allowedLength: [6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
            notAllowedCard: [15]
        },
        // 三顺
        tripleStraights: {
            level: 1,
            colorFormat: false,
            numFormat: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
            allowedLength: [6, 9, 12, 15, 18, 21, 24],
            notAllowedCard: [15]
        },
        // 炸弹
        bomb: {
            level: 5,
            colorFormat: false,
            numFormat: [1, 1, 1, 1],
            allowedLength: [4]
        },
        // 王炸
        jokerBomb: {
            level: 6,
            colorFormat: false,
            numFormat: [50, 55],
            allowedLength: [2],
            notAllowedCard: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        },

        // 三张
        threeCards: {
            level: 1,
            colorFormat: false,
            numFormat: [1, 1, 1],
            allowedLength: [3]
        },

        // 三带一
        threeAndOne: {
            level: 1,
            colorFormat: false,
            numFormat: [1, 1, 1, 0],
            allowedLength: [4]
        },

        // 三带二
        threeAndTwo: {
            level: 1,
            colorFormat: false,
            numFormat: [1, 1, 1, -1, -1], //-1代表带的是2张牌
            allowedLength: [5]
        },

        // 飞机带翅膀
        aircraft: {
            level: 1,
            colorFormat: false,
            numFormat: [2, 2, 2, 1, 1, 1, 0, 0],
            allowedLength: [8]
        },

        // 飞机带翅膀
        aircraft2: {
            level: 1,
            colorFormat: false,
            numFormat: [2, 2, 2, 1, 1, 1, -1, -1, -2, -2],
            allowedLength: [10]
        },

        // 飞机带翅膀
        aircraft3: {
            level: 1,
            colorFormat: false,
            numFormat: [2, 2, 2, 1, 1, 1, -1, -1],
            allowedLength: [8]
        },

        // 飞机带翅膀
        aircraft4: {
            level: 1,
            colorFormat: false,
            numFormat: [3, 3, 3, 2, 2, 2, 1, 1, 1, -1, -1, -2, -2, -3, -3],
            allowedLength: [15]
        },

        // 飞机带翅膀
        aircraft5: {
            level: 1,
            colorFormat: false,
            numFormat: [3, 3, 3, 2, 2, 2, 1, 1, 1, 0, 0, 0],
            allowedLength: [12]
        },

        // 飞机带翅膀
        aircraft6: {
            level: 1,
            colorFormat: false,
            numFormat: [4, 4, 4, 3, 3, 3, 2, 2, 2, 1, 1, 1, -1, -1, -2, -2, -3, -3, -4, -4],
            allowedLength: [20]
        },

        // 飞机带翅膀
        aircraft7: {
            level: 1,
            colorFormat: false,
            numFormat: [4, 4, 4, 3, 3, 3, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0],
            allowedLength: [16]
        },
        fourAndTwo: {
            level: 1,
            colorFormat: false,
            numFormat: [1, 1, 1, 1, 0, 0],
            allowedLength: [6]
        },

        fourAndDoubleTwo: {
            level: 1,
            colorFormat: false,
            numFormat: [1, 1, 1, 1, -1, -1, -2, -2],
            allowedLength: [8]
        }
    };
    poker_base.prototype.otherTypes = {
        // 一对
        doubleCards: {
            level: 1,
            colorFormat: false,
            numFormat: [1, 1],
            allowedLength: [2],
            notAllowedCard: [3, 15],
            effectNum: true
        },
        // 三张
        threeCards: {
            level: 1,
            colorFormat: false,
            numFormat: [1, 1, 1],
            allowedLength: [3],
            notAllowedCard: [3]
        },
        // 22,33炸
        bomb22: {
            level: 3,
            colorFormat: false,
            numFormat: [1, 1],
            allowedLength: [2],
            notAllowedCard: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 55, 50]
        },
        ///333炸
        bomb333: {
            level: 4,
            colorFormat: false,
            numFormat: [3, 3, 3],
            allowedLength: [3],
            notAllowedCard: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 55, 50]
        },
        threeAndTwo: null,
        aircraft2: null,
        aircraft4: null,
        aircraft6: null,
        fourAndDoubleTwo: null
    };

    //洗牌
    function randomCards() {
        var rtn = [];
        rtn.length = pokerCards.length;
        for (var i = 0; i < rtn.length; i++)
            rtn[i] = pokerCards[i];
        for (var i = 0; i < rtn.length; i++) {
            var ci = rtn[i];
            var j = Math.floor(Math.random() * rtn.length);
            rtn[i] = rtn[j];
            rtn[j] = ci;
        }
        return rtn;
    };

    // 得到排好序的纯点数牌
    function createSortedCardNumbers(cards) {
        // 所有牌余除100得到纯点数
        var numbers = [];
        for (var i = 0; i < cards.length; i++) {
            numbers[i] = cards[i] % 100;
            // numbers[i] = cards[i];
        }

        // 所有牌按照从小到大排序
        numbers.sort(function(a, b) {
            return a - b;
            // return b % 100 - a % 100;
        })

        //三张(不能包括2)
        var num = getThreeArr(numbers);
        var have111222 = is111222(num);
        console.log("createSortedCardNumbers(), numbers1111 = " + numbers + " num:" + num.length);
        // 如果是四代二,优先算飞机 num[1]-num[0]:用于鉴别33335555类型牌
        if (numbers.length == 6 || (numbers.length == 8 && (num.length < 2 || num[1] - num[0] > 1)) || have111222 == true) // num < 2:33344446和四带二逻辑重叠
        {
            // console.log("内部判断");
            for (var i = 0; i < numbers.length - 3; i++) {
                // console.log("内部判断00:"+numbers[i]+" 11:"+numbers[i+1]+" 22:"+numbers[i+2]+" 33:"+numbers[i+3]);
                if (numbers[i] == numbers[i + 1] && numbers[i] == numbers[i + 2] && numbers[i] == numbers[i + 3]) {
                    // 交换
                    for (var j = 0; j < i; j++) {
                        var t = numbers[j];
                        numbers[j] = numbers[j + 4];
                        numbers[j + 4] = t;
                    }
                    return numbers;
                }
            }
        }
        console.log("createSortedCardNumbers(), numbers22222 = " + numbers);
        // 如果有三张相同的牌，则将相同的牌放在前面
        for (var i = 0; i < numbers.length - 2; i++) {
            if (numbers[i] == numbers[i + 1] && numbers[i] == numbers[i + 2] && 0 < i) {
                // 交换
                for (var j = 0; j < i; j++) {
                    var t = numbers[i - j + 2];
                    numbers[i - j + 2] = numbers[i - j - 1];
                    numbers[i - j - 1] = t;
                }
            }
        }

        console.log("createSortedCardNumbers(), numbers33333 = " + numbers);


        var num = getThreeArr(numbers); //lew 此处因排序变化,需要重新赋值
        for (var i = 0; i < num.length - 2; i++) {
            if (num[i] != num[i + 1] + 1) {
                for (var j = i; j < num.length - 1; j++) {
                    var t = numbers[j * 3];

                    numbers[j * 3 + 0] = numbers[(j + 1) * 3 + 0];
                    numbers[j * 3 + 1] = numbers[(j + 1) * 3 + 1];
                    numbers[j * 3 + 2] = numbers[(j + 1) * 3 + 2];

                    numbers[(j + 1) * 3 + 0] = t;
                    numbers[(j + 1) * 3 + 1] = t;
                    numbers[(j + 1) * 3 + 2] = t;
                }
                break;
            }
        }
        console.log("createSortedCardNumbers(), numbers44444 = " + numbers);
        // console.log("createSortedCardNumbers(), numbers = " + numbers);

        return numbers;
    }
    
    //lew 判断有多少个三张相同的牌
    function getThreeArr(numbers) {
        var numArray = [];
        for (var i = 0; i < numbers.length - 2; i++) {
            if (numbers[i] == numbers[i + 1] && numbers[i + 1] == numbers[i + 2]) {
                numArray.push(numbers[i]);
                i++;
            }
        }
        return numArray;
    }

    function is111222(numArr) {
        var have = false;
        if (numArr.length >= 2) { //lew 区分4带4和飞机
            console.log("飞机数据:" + numArr);
            for (var i = 0; i < numArr.length - 1; i++) {
                if ((numArr[i] == 14 && numArr[i + 1] == 15) || (numArr[i] == 15 && numArr[i + 1] == 14)) {
                    have = true;
                    break;
                }
            }
        }
        return have;
    }

    function getSortCard(cards) {
        // 所有牌余除100得到纯点数
        var numbers = [];
        for (var i = 0; i < cards.length; i++) {
            numbers[i] = cards[i] % 100;
        }

        // 所有牌按照从小到大排序
        numbers.sort(function(a, b) {
            return a - b;
        })

        return numbers;
    }

    // 返回牌型
    function getCardsType(cards, more) {
        console.log("---------getCardsType---------");
        var typeArr = [];
        for (var key in cc.jsInstance.poker.cardTypes) {
            // console.log("key = " + key);

            var type = cc.jsInstance.poker.cardTypes[key];

            // 只判断长度相等的牌型
            var lengthmatch = false;
            for (var i = 0; i < type.allowedLength.length; i++) {
                if (type.allowedLength[i] == cards.length) {
                    // console.log("type allowedLength = " + type.allowedLength[i] + ", cards length = " + cards.length);
                    lengthmatch = true;
                }
            }

            // 只判断长度相等的牌型
            if (!lengthmatch) {
                continue;
            }

            var numbers = [];
            // console.log("排序前"+cards+" key:"+key);
            if (key == "tripleStraights") {
                numbers = getSortCard(cards);
                // console.log("poker.js, getCardsType(), numbers = " + numbers);
            } else {
                numbers = createSortedCardNumbers(cards);
            } //此处可能需要针对三带二进行处理,以便能处理3334445555等牌型
            // console.log("排序后"+numbers);
            // 如果牌型中有禁止的数字(顺子不能带2)
            var fatch = true;
            if (type.notAllowedCard) {
                for (var i = 0; i < numbers.length; i++) {
                    for (var j = 0; j < type.notAllowedCard.length; j++) {
                        if (numbers[i] == type.notAllowedCard[j]) {
                            fatch = false;
                        }
                    }
                }
            }
            if (!fatch) {
                continue;
            }

            // 判断匹配格式
            var formatMacth = true;
            var format = type.numFormat;
            var cutNum = false;
            var startNum = [];
            // console.log("poker.js, getCardsType(), format::" + format);
            // console.log("types::"+JSON.stringify(type));
            // console.log("createSortedCardNumbers:"+numbers);
            for (var i = 0; i < numbers.length; i++) {
                // 等于零则跳过
                if (format[i] == 0) {
                    continue;
                } else if (format[i] < 0) {
                    if (!startNum[-format[i]]) {
                        startNum[-format[i]] = numbers[i]
                    } else {
                        if (startNum[-format[i]] != numbers[i]) {
                            formatMacth = false;
                            // console.log("妈卖批11111");
                            break;
                        }
                    }
                } else {
                    if (!cutNum) {
                        cutNum = numbers[i] - format[i];
                        // console.log(i+" key = " + key+" cutNum:"+cutNum+" numbers[i]:"+numbers[i]+" format[i]:"+format[i]);
                        if (key == "tripleStraights" || key == "doublestraights") {
                            // console.log("i = " + i);
                            // console.log("numbers = " + numbers[i]);
                            // console.log("format = " + format[i]);
                            // console.log("cutNum = " + cutNum);
                        }
                    } else {
                        if (key == "tripleStraights" || key == "doublestraights") {
                            // console.log("i = " + i);
                            // console.log("cutNum1111111 = " + cutNum);
                            // console.log("numbers = " + numbers[i]);
                            // console.log("format = " + format[i]);
                        }
                        if (cutNum != numbers[i] - format[i]) {
                            // console.log(i+" formatMacth == false"+" cutNum:"+cutNum+" numbers[i]:"+numbers[i]+" format[i]:"+format[i]);
                            formatMacth = false;
                            // console.log("妈卖批22222");
                            break;
                        }
                    }
                }
            }
            //lew飞机不能带14,14,14,15,15,15
            var num = getThreeArr(numbers);
            var have111222 = is111222(num);
            console.log("拦截222飞机:" + key + " num:" + num + " have111222" + have111222 + " formatMacth:" + formatMacth);
            if (formatMacth && key.indexOf("aircraft") != -1 && have111222 == true) { //&& num.length>=4
                //lew 如果把222换成杂牌,看牌型是否还成立
                var changeCard = cards.slice();;
                for (var changV = 0; changV < changeCard.length; changV++) {
                    if (changeCard[changV] % 100 == 15) {
                        changeCard[changV] = 1000;
                    }
                }
                var changeOver = getCardsType(changeCard);
                if (changeOver) {
                    console.log("换牌后牌型依然成立!");
                } else {
                    formatMacth = false;
                    console.log("拦截成功!");
                }

            }

            if (formatMacth) {
                var theType = key + "_" + cards.length;
                if (more) {
                    typeArr.push(theType);
                } else {
                    return theType;
                }
            }
        }
        if (more) {
            return typeArr;
        } else {
            return false;
        }
    };

    // 比较扑克的大小
    function comparePokers(cards1, cards2) //cards1:自己手牌 cards2:需要比较的牌
    {
        // var type1Arr = getCardsType(cards1,true);
        var type1 = getCardsType(cards1);
        var type2 = getCardsType(cards2);

        var numbers1 = createSortedCardNumbers(cards1);
        var numbers2 = createSortedCardNumbers(cards2);
        console.log("comparePokers type1:" + type1 + " type2:" + type2 + "计算 numbers1:" + numbers1[0] + "numbers2:" + numbers2[0]);
        if (type1 == type2) {

            return numbers1[0] - numbers2[0];
        } else {
            if (type1 && type2) {
                var level1;
                var level2;

                for (var key in cc.jsInstance.poker.cardTypes) {
                    if (type1.split("_")[0] == key) {
                        level1 = cc.jsInstance.poker.cardTypes[key].level;
                    }

                    if (type2.split("_")[0] == key) {
                        level2 = cc.jsInstance.poker.cardTypes[key].level;
                    }
                }

                // console.log("level1 = " + level1);
                // console.log("level2 = " + level2);

                if (level1 == level2) {
                    // if (type1.substr(0, 4) == "less" || type2.substr(0, 4)) {

                    //  if (type1.lessType == type2.split("_")[0]
                    //      || type2.lessType == type1.split("_")[0]) {

                    //      return numbers1[0] - numbers2[0];

                    //  }

                    // }
                    return false;
                } else {
                    return level1 - level2;
                }
            }
        }
    }


    var createSortedCardNumbers1 = function(cards) {
        // 所有牌余除100得到纯点数
        var numbers = [];
        for (var i = 0; i < cards.length; i++) {
            numbers[i] = cards[i] % 100;
        }

        // 所有牌按照从小到大排序
        numbers.sort(function(a, b) {
            return a - b;
        });

        return numbers;
    };

    // var typeImg = {
    //     // doubleCards: ["doubleCards"],
    //     straights: ["straights"],
    //     doublestraights: ["doublestraights"],
    //     bomb: ["bomb"],
    //     threeCards: ["threeCards", "lessThreeCards"],
    //     aircraft: ["aircraft", "aircraft2", "aircraft3", "lessAircraft", "lessAircraft2", "lessAircraft3", "lessAircraft4"]
    // };
    //
    // var getCardTypeImgName = function(type) {
    //
    //     for (var key in typeImg) {
    //
    //         for (var i = 0; i < typeImg[key].length; i++) {
    //
    //             if (type.split("_")[0] == typeImg[key][i]) {
    //
    //                 return key;
    //
    //             }
    //
    //         };
    //
    //     }
    //
    // }


    //================================判断下家是否有更大的牌===============================
    var havelargerPokers = function(plCards, putCards, threeBomb) {
        var cards1 = plCards; //玩家的所有牌
        var cards2 = putCards; //上家出的牌

        var numCards1 = createSortedCardNumbers1(cards1);
        var numCards2 = createSortedCardNumbers1(cards2);

        //同类牌判断是否有大的过的
        var cardsType = getCardsType(cards2);
        console.log("poker.js, havelargerPokers, put cards type = " + cardsType);

        if (cardsType != false) {
            var cardType2length = cardsType.split("_");
            //上家王炸
            if (cardType2length[0] == "jokerBomb") {
                return false;
            }
            console.log("类型判断1111");
            //先判断是否有王炸
            if (havejokerBomb(numCards1, numCards2))
                return true;
            console.log("类型判断2222");
            //先判断是否有炸
            if (havebomb(numCards1, numCards2))
                return true;
            //特殊炸弹判断,子类可重写
            if (cc.jsInstance.poker.specialLargerCheck(numCards1, numCards2, threeBomb)) {
                return true;
            }

            //判断是否牌够
            if (cards1.length < cards2.length || cards1.length == 0 || cards2.length == 0)
                return false;

            console.log("类型判断5555");
            switch (cardType2length[0]) {
                case "singleCard":
                    return havesingleCard(numCards1, numCards2);
                    break;
                case "doubleCards":
                    return havedoubleCards(numCards1, numCards2);
                    break;
                case "straights":
                    return havestraights(numCards1, numCards2);
                    break;
                case "doublestraights":
                    return havedoublestraights(numCards1, numCards2);
                    break;
                case "tripleStraights":
                    return havethreestraights(numCards1, numCards2);
                    break;
                case "bomb":
                    return havebomb(numCards1, numCards2);
                    break;
                case "bomb22":
                    if (haveBomb22(numCards1, numCards2) || haveBomb333(numCards1, numCards2) || havebomb(numCards1, numCards2)) {
                        return true;
                    } else
                        return false;
                    break;
                case "bomb333":
                    return havebomb(numCards1, numCards2);
                    break;
                case "threeCards":
                    return havethree(numCards1, numCards2);
                    break;
                case "threeAndOne":
                    return havethreewithone(numCards1, numCards2);
                    break;
                case "threeAndTwo":
                    return havethreewithtwo(numCards1, numCards2);
                    break;
                case "aircraft":
                    return haveaircraftwithpairs(numCards1, numCards2);
                    break;
                case "aircraft2":
                    return haveaircraftwithtwo(numCards1, numCards2);
                    break;
                case "aircraft3":
                    return haveaircraftwithpairs(numCards1, numCards2);
                    break;
                case "aircraft4":
                    return haveaircraftwithtwo(numCards1, numCards2);
                    break;
                case "aircraft5":
                    return haveaircraftwithpairs(numCards1, numCards2);
                    break;
                case "aircraft6":
                    return haveaircraftwithtwo(numCards1, numCards2);
                    break;
                case "aircraft7":
                    return haveaircraftwithpairs(numCards1, numCards2);
                    break;
                case "fourAndTwo":
                    return havefourwithtwo(numCards1, numCards2);
                case "fourAndDoubleTwo":
                    return havefourwithDoubletwo(numCards1, numCards2);
                    break;
            }
        } else {
            console.log("出的牌型不正确");
            return false;
        }
    };
    //特殊炸弹判断,子类需要重写
    function specialLargerCheck(numCards1, numCards2, threeBomb) {
        console.log("类型判断3333");
        //先判断是否有333炸
        if (threeBomb && haveBomb333(numCards1, numCards2))
            return true;
        console.log("类型判断4444");
        //判断是否有22炸
        if (haveBomb22(numCards1, numCards2))
            return true;
        return false;
    }

    function havesingleCard(card1, card2) {
        for (var key in card1) {
            if (card1[key] > card2[0])
                return true;
        }
        return false;
    };

    function havedoubleCards(card1, card2) {
        // console.log("poker.js, havedoubleCards, card1 = " + card1);
        // console.log("poker.js, havedoubleCards, card2 = " + card2);
        for (var i = 0; i < card1.length - 1; i++) {
            if (card1[i] == card1[i + 1] && card1[i] > card2[0])
                return true;
        }
        return false;
    };

    function havestraights(card1, card2) {
        var tmpArr1 = [];
        for (var i = 0; i < card1.length - 1; i++) {
            if (card1[i + 1] - card1[i] == 1 && card1[i + 1] < 15) {
                if (tmpArr1.length == 0)
                    tmpArr1.push(card1[i]);
                tmpArr1.push(card1[i + 1]);
            } else if (card1[i + 1] - card1[i] > 1) {
                if (tmpArr1.length >= card2.length && tmpArr1[tmpArr1.length - 1] > card2[card2.length - 1])
                    return true;
                tmpArr1 = [];
            }
        }
        if (tmpArr1.length >= card2.length && tmpArr1[tmpArr1.length - 1] > card2[card2.length - 1])
            return true;
        return false;
    };

    function havedoublestraights(card1, card2) {
        var pairs = [];
        for (var i = 0; i < card1.length - 1; i++) {
            if (card1[i] == card1[i + 1]) {
                pairs.push(card1[i], card1[i + 1]);
                i++;
            }
        }
        if (pairs.length < card2.length)
            return false;

        var tmpArr1 = [];
        var tmpArr2 = [];

        for (var i = 0; i < pairs.length; i += 2)
            tmpArr1.push(pairs[i]);
        for (var i = 0; i < card2.length; i += 2)
            tmpArr2.push(card2[i]);
        return havestraights(tmpArr1, tmpArr2);
    };

    function havebomb(card1, card2) {
        for (var i = 0; i <= card1.length - 4; i++) {
            var num = 1;
            for (var j = 1; j < 4; j++) {
                if (card1[i] == card1[i + j])
                    num++;
                else
                    break;
            }
            if (num == 4) {
                if (getCardsType(card2) != "bomb_4")
                    return true;
                else if (card1[i] > card2[0])
                    return true;
            }
        }
        return false;
    };

    function havejokerBomb(card1, card2) {
        if (getCardsType(card2) == "jokerBomb_2")
            return false;
        else if (card1[card1.length - 1] == 55 && card1[card1.length - 2] == 50)
            return true;
    };

    function haveBomb22(card1, card2) {
        for (var i = 0; i <= card1.length - 2; i++) {
            var num = 1;
            for (var j = 1; j < 2; j++) {
                if (card1[i] == card1[i + j])
                    num++;
                else
                    break;
            }
            if (num == 2 && (card1[i] == 15 || card1[i] == 3)) {
                var tempType = getCardsType(card2);
                if (tempType != "bomb22_2" && tempType != "bomb333_3" && tempType != "bomb_4")
                    return true;
                else if (tempType == "bomb22_2") {
                    if (card1[i] > card2[0]) //lew 22炸的特殊情况,22>33
                        return true;
                }
            }
        }
        return false;
    };

    function haveBomb333(card1, card2) {
        for (var i = 0; i <= card1.length - 3; i++) {
            var num = 1;
            for (var j = 1; j < 3; j++) {
                if (card1[i] == card1[i + j])
                    num++;
                else
                    break;
            }
            if (num == 3 && card1[i] == 3) {
                if (getCardsType(card2) != "bomb_4")
                    return true;
                else
                    return false;
            }
        }
        return false;
    };

    function havethree(card1, card2) {
        var tmpArr = [];
        for (var i = 0; i < card1.length - 2; i++) {
            var num = 1;
            for (var j = 1; j < 3; j++) {
                if (card1[i] == card1[i + j])
                    num++;
                else
                    break;
            }
            if (num == 3) {
                tmpArr.push(card1[i], card1[i], card1[i]);
                i += 2;
            }
        }

        if (tmpArr.length >= 3) {
            for (var i = 0; i < card2.length - 2; i++) {
                var tmpArr2 = [card2[i]];
                for (var j = 1; j <= 2; j++) {
                    if (card2[i] == card2[i + j])
                        tmpArr2.push(card2[i]);
                    else
                        break;
                }
                if (tmpArr2.length == 3 && tmpArr[tmpArr.length - 1] > tmpArr2[0])
                    return true;
            }
        }
        return false;
    };

    function havethreewithone(card1, card2) {
        var tmpArr = [];
        for (var i = 0; i < card1.length - 2; i++) {
            var num = 1;
            for (var j = 1; j < 3; j++) {
                if (card1[i] == card1[i + j])
                    num++;
                else
                    break;
            }
            if (num == 3) {
                tmpArr.push(card1[i], card1[i], card1[i]);
                i += 2;
            }
        }

        if (card2.length > card1.length) {
            return false
        }

        if (tmpArr.length >= 3) {
            for (var i = 0; i < card2.length - 2; i++) {
                var tmpArr2 = [card2[i]];
                for (var j = 1; j <= 2; j++) {
                    if (card2[i] == card2[i + j])
                        tmpArr2.push(card2[i]);
                    else
                        break;
                }
                if (tmpArr2.length == 3 && tmpArr[tmpArr.length - 1] > tmpArr2[0])
                    return true;
            }
        }
        return false;
    };

    function havethreewithtwo(card1, card2) {
        var threeArr = [];
        var tmpArr = [];

        for (var i in card1) {
            tmpArr[i] = card1[i];
        }

        for (var i = 0; i < card1.length - 2; i++) {
            var num = 1;
            for (var j = 1; j < 3; j++) {
                if (card1[i] == card1[i + j])
                    num++;
                else
                    break;
            }
            if (num == 3) {
                threeArr.push(card1[i], card1[i], card1[i]);
                var index = tmpArr.indexOf(card1[i]);
                tmpArr.splice(index, 3);
                i += 2;
            }
        }
        if (card2.length > card1.length) {
            return false
        }

        if (threeArr.length >= 6) {
            for (var i = 0; i < card2.length - 2; i++) {
                var tmpArr2 = [card2[i]];
                for (var j = 1; j <= 2; j++) {
                    if (card2[i] == card2[i + j])
                        tmpArr2.push(card2[i]);
                    else
                        break;
                }
                if (tmpArr2.length == 3 && threeArr[threeArr.length - 1] > tmpArr2[0])
                    return true;
            }
        } else if (threeArr.length == 3 && havedoubleCards(tmpArr, [1, 1])) {
            for (var i = 0; i < card2.length - 2; i++) {
                var tmpArr2 = [card2[i]];
                for (var j = 1; j <= 2; j++) {
                    if (card2[i] == card2[i + j])
                        tmpArr2.push(card2[i]);
                    else
                        break;
                }
                if (tmpArr2.length == 3 && threeArr[threeArr.length - 1] > tmpArr2[0])
                    return true;
            }
        }
        return false;
    };

    function havethreestraights(card1, card2) {
        var tmpArr = [];
        for (var i = 0; i <= card1.length - 3; i++) {
            var num = 1;
            for (var j = 1; j < 3; j++) {
                if (card1[i] == card1[i + j])
                    num++;
                else
                    break;
            }
            if (num == 3) {
                tmpArr.push(card1[i], card1[i], card1[i]);
                i += 2;
            }
        }


        if (card2.length > tmpArr.length)
            return false;
        else {
            var tmpArr2 = [];
            for (var i = 0; i <= card2.length - 3; i++) {
                var num = 1;
                for (var j = 1; j < 3; j++) {
                    if (card2[i] == card2[i + j])
                        num++;
                    else
                        break;
                }
                if (num == 3) {
                    tmpArr2.push(card2[i], card2[i], card2[i]);
                    i += 2;
                }
            }

            var tmpArr3 = [];
            var tmpArr4 = [];

            for (var i = 0; i <= tmpArr.length - 3; i += 3)
                tmpArr3.push(tmpArr[i]);
            for (var i = 0; i <= tmpArr2.length - 3; i += 3)
                tmpArr4.push(tmpArr2[i]);



            return havestraights(tmpArr3, tmpArr4);
        }
    };

    function returnstraights(card1, card2, card3) {
        var tmpArr1 = [];
        for (var i = 0; i < card1.length - 1; i++) {
            if (card1[i + 1] - card1[i] == 1 && card1[i + 1] < 15) {
                if (tmpArr1.length == 0)
                    tmpArr1.push(i);
                tmpArr1.push((i + 1));
            } else if (card1[i + 1] - card1[i] > 1) {
                if (tmpArr1.length >= card2.length && card1[tmpArr1[tmpArr1.length - 1]] > card2[card2.length - 1]) {
                    var index = tmpArr1.length;
                    while (card1[tmpArr1[index - 1]] > card2[card2.length - 1] && index >= card2.length) {
                        index--;
                    }

                    var tmp = [];
                    var tmplen = index;
                    while (index > tmplen - card2.length) {
                        tmp.push(card3[tmpArr1[index]]);
                        index--;
                    }
                    return tmp;
                }
                tmpArr1 = [];
            }
        }
        if (tmpArr1.length >= card2.length && card1[tmpArr1[tmpArr1.length - 1]] > card2[card2.length - 1]) {
            var index = tmpArr1.length;
            while (card1[tmpArr1[index - 1]] > card2[card2.length - 1] && index >= card2.length) {
                index--;
            }

            var tmp = [];
            var tmplen = index;
            while (index > tmplen - card2.length) {
                tmp.push(card3[tmpArr1[index]]);
                index--;
            }
            return tmp;
        }
        return false;
    };
    //飞机带单
    function haveaircraftwithpairs(card1, card2) {
        var tmpArr = [];
        for (var i = 0; i <= card1.length - 3; i++) {
            var num = 1;
            for (var j = 1; j < 3; j++) {
                if (card1[i] == card1[i + j])
                    num++;
                else
                    break;
            }
            if (num == 3) {
                tmpArr.push(card1[i], card1[i], card1[i]);
                i += 2;
            }
        }
        // console.log(" 111tmpArr.length"+ tmpArr.length/3);
        // console.log(" 111card2.length "+ card2.length /4);

        if (card2.length > card1.length) {
            return false;
        }

        if (card2.length / 4 > tmpArr.length / 3)
            return false;
        else {
            var tmpArr2 = [];
            for (var i = 0; i <= card2.length - 3; i++) {
                var num = 1;
                for (var j = 1; j < 3; j++) {
                    if (card2[i] == card2[i + j])
                        num++;
                    else
                        break;
                }
                if (num == 3) {
                    tmpArr2.push(card2[i], card2[i], card2[i]);
                    i += 2;
                }
            }

            var tmpArr3 = [];
            var tmpArr4 = [];

            for (var i = 0; i <= tmpArr.length - 3; i += 3)
                tmpArr3.push(tmpArr[i]);
            for (var i = 0; i <= tmpArr2.length - 3; i += 3)
                tmpArr4.push(tmpArr2[i]);
            // console.log(" 111tmpArr3"+ tmpArr3);
            // console.log(" 111tmpArr4 "+ tmpArr4);


            return havestraights(tmpArr3, tmpArr4);



        }
    };
    //飞机带对
    function haveaircraftwithtwo(card1, card2) {
        var tmpArr = [];
        var remainArr = [];
        for (var i in card1) {
            remainArr[i] = card1[i];
        }


        for (var i = 0; i <= card1.length - 3; i++) {
            var num = 1;
            for (var j = 1; j < 3; j++) {
                if (card1[i] == card1[i + j])
                    num++;
                else
                    break;
            }
            if (num == 3) {
                tmpArr.push(card1[i], card1[i], card1[i]);
                var index = remainArr.indexOf(card1[i]);
                remainArr.splice(index, 3);
                i += 2;
            }
        }
        // console.log(" tmpArr.length"+ tmpArr.length/3);
        // console.log(" card2.length "+ card2.length /5);

        if (card2.length > card1.length) {
            return false;
        }

        if (card2.length / 5 > tmpArr.length / 3)
            return false;
        else {
            var tmpArr2 = [];
            for (var i = 0; i <= card2.length - 3; i++) {
                var num = 1;
                for (var j = 1; j < 3; j++) {
                    if (card2[i] == card2[i + j])
                        num++;
                    else
                        break;
                }
                if (num == 3) {
                    tmpArr2.push(card2[i], card2[i], card2[i]);
                    i += 2;
                }
            }

            var tmpArr3 = [];
            var tmpArr4 = [];

            for (var i = 0; i <= tmpArr.length - 3; i += 3)
                tmpArr3.push(tmpArr[i]);
            for (var i = 0; i <= tmpArr2.length - 3; i += 3)
                tmpArr4.push(tmpArr2[i]);
            // console.log(" tmpArr3"+ tmpArr3);
            // console.log(" tmpArr4 "+ tmpArr4);
            //有三顺
            var isPlane = returnstraights(tmpArr3, tmpArr4, tmpArr3);
            if (isPlane) {
                for (var key1 in isPlane) {
                    var index = card1.indexOf(isPlane[key1]);
                    if (index) {
                        card1.splice(index, 3);
                    }
                }
            }

            //有两对
            var twoArr = [];
            for (var i = 0; i < card1.length - 1; i++) {
                if (card1[i] == card1[i + 1])
                    twoArr.push(card1[i], card1[i]);
            }

            // console.log(" twoArr.length"+ twoArr.length);
            // console.log(" isPlane.length "+ isPlane.length);
            if (twoArr.length / 2 >= isPlane.length)
                return true;
            return false;
        }
    };

    function havefourwithtwo(card1, card2) {
        for (var i = 0; i <= card1.length - 4; i++) {
            var num = 1;
            for (var j = 1; j < 4; j++) {
                if (card1[i] == card1[i + j])
                    num++;
                else
                    break;
            }
            if (num == 4) {
                if (card1[i] > card2[0])
                    return true;
            }
        }
        return false;
    };

    function havefourwithDoubletwo(card1, card2) {
        for (var i = 0; i <= card1.length - 4; i++) {
            var num = 1;
            for (var j = 1; j < 4; j++) {
                if (card1[i] == card1[i + j])
                    num++;
                else
                    break;
            }
            if (num == 4) {
                if (card1[i] > card2[0])
                    return true;
            }
        }
        return false;
    };


    //=======================================提示算法=====================================
    var noticePokers = function(myCards, putCards, threeBomb) {
        console.log("noticePokers myCards: " + JSON.stringify(myCards));
        console.log("noticePokers putCards: " + JSON.stringify(putCards));
        console.log("noticePokers threeBomb: " + JSON.stringify(threeBomb));

        var cards1 = myCards; //玩家的所有牌
        var cards2 = putCards; //上家出的牌 或者上个提示牌

        cards1.sort(function(a, b) {
            return (a % 100) - (b % 100);
        });
        cards2.sort(function(a, b) {
            return (a % 100) - (b % 100);
        });

        var numCards1 = createSortedCardNumbers1(cards1);
        var numCards2 = createSortedCardNumbers1(cards2);

        //同类牌判断是否有大的过的
        var cardsType = getCardsType(cards2);
        console.log("需比较的牌:" + cardsType);

        if (cardsType != false) {
            var cardType2length = cardsType.split("_");
            var tishi = false;
            console.log("其他人的牌类型:" + cardType2length[0] + " threeBomb:" + threeBomb);
            switch (cardType2length[0]) {
                case "singleCard":
                    tishi = NoticsingleCard(numCards1, numCards2, cards1); //检测不在炸弹里的
                    break;
                case "doubleCards":
                    tishi = NoticdoubleCards(numCards1, numCards2, cards1); //检测不在炸弹里的
                    break;
                case "straights":
                    tishi = Noticstraights(numCards1, numCards2, cards1);
                    break;
                case "doublestraights":
                    tishi = Noticdoublestraights(numCards1, numCards2, cards1);
                    break;
                case "tripleStraights":
                    tishi = Noticthreestraights(numCards1, numCards2, cards1);
                    break;
                case "bomb":
                case "bomb333":
                case "bomb22":
                    // tishi = Noticbomb(numCards1, numCards2, cards1);
                    break;
                case "threeCards":
                    tishi = Noticthree(numCards1, numCards2, cards1);
                    break;
                case "threeAndOne":
                    tishi = NoticthreewithoneChange(numCards1, numCards2, cards1, cards2);
                    // Noticthreewithone(numCards1, numCards2,cards1);
                    break;
                case "threeAndTwo":
                    tishi = NoticthreewithtwoChange(numCards1, numCards2, cards1, cards2);
                    // Noticthreewithtwo(numCards1, numCards2,cards1);
                    // console.log("threeAndTwo 提示:"+JSON.stringify(tishi)+"  numCards1:"+numCards1+" numCards2:"+numCards2+" cards1:"+cards1+" cards2:"+cards2);
                    break;
                case "aircraft":
                    tishi = Noticaircraftwithtwo(numCards1, numCards2, cards1);
                    break;
                case "aircraft2":
                    tishi = Noticaircraftwithpairs(numCards1, numCards2, cards1);
                    break;
                case "aircraft3":
                    tishi = Noticaircraftwithpairs(numCards1, numCards2, cards1);
                    break;
                case "aircraft4":
                    tishi = Noticaircraftwithpairs(numCards1, numCards2, cards1);
                    break;
                case "aircraft5":
                    tishi = Noticaircraftwithtwo(numCards1, numCards2, cards1);
                    break;
                case "aircraft6":
                    tishi = Noticaircraftwithpairs(numCards1, numCards2, cards1);
                    break;
                case "aircraft7":
                    tishi = Noticaircraftwithtwo(numCards1, numCards2, cards1);
                    break;
                case "fourAndTwo":
                case "fourAndDoubleTwo":
                    // return Noticbomb(numCards1, numCards2, cards1);
                    break;
            }
            if (tishi != false)
                return tishi;
            else
                return cc.jsInstance.poker.Noticbomb(numCards1, numCards2, cards1, cardType2length[0], threeBomb);
        }
        return false;
    };

    function NoticsingleCard(card1, card2, card3) {
        //card1 手牌  card2 上家牌  手牌
        for (var key in card1) {
            if (card1[key] > card2[0]) {
                if (NoticCardIsInBoom(card1, key)) {
                    continue;
                } else {
                    return [card3[key]];
                }
            }
        }
        return false;
    };

    function NoticdoubleCards(card1, card2, card3) {
        console.log("zwz_NoticdoubleCards");
        var tempV = cc.jsInstance.poker.cardTypes.doubleCards.notAllowedCard;
        for (var i = 0; i < card1.length - 1; i++) {
            if (card1[i] == card1[i + 1] && card1[i] > card2[0] && (tempV && tempV.indexOf(card1[i]) == -1)) {
                if (NoticCardIsInBoom(card1, i)) {
                    continue;
                } else {
                    return [card3[i], card3[i + 1]];
                }
            }
        }
        return false;
    };

    function Noticstraights(card1, card2, card3) {
        var tmpArr1 = [];
        for (var i = 0; i < card1.length - 1; i++) {
            if (card1[i + 1] - card1[i] == 1 && card1[i + 1] < 15) {
                if (tmpArr1.length == 0)
                    tmpArr1.push(i);
                tmpArr1.push((i + 1));
            } else if (card1[i + 1] - card1[i] > 1) {
                if (tmpArr1.length >= card2.length && card1[tmpArr1[tmpArr1.length - 1]] > card2[card2.length - 1]) {
                    var index = tmpArr1.length;
                    while (card1[tmpArr1[index - 1]] > card2[card2.length - 1] && index >= card2.length) {
                        index--;
                    }

                    var tmp = [];
                    var tmplen = index;
                    while (index > tmplen - card2.length) {
                        tmp.push(card3[tmpArr1[index]]);
                        index--;
                    }
                    return tmp;
                }
                tmpArr1 = [];
            }
        }
        if (tmpArr1.length >= card2.length && card1[tmpArr1[tmpArr1.length - 1]] > card2[card2.length - 1]) {
            var index = tmpArr1.length;
            while (card1[tmpArr1[index - 1]] > card2[card2.length - 1] && index >= card2.length) {
                index--;
            }

            var tmp = [];
            var tmplen = index;
            while (index > tmplen - card2.length) {
                tmp.push(card3[tmpArr1[index]]);
                index--;
            }
            return tmp;
        }
        return false;
    };

    function Noticdoublestraights(card1, card2, card3) {
        var pairs = [];
        var allcards = [];
        for (var i = 0; i < card1.length - 1; i++) {
            if (card1[i] == card1[i + 1]) {
                pairs.push(card1[i], card1[i + 1]);
                allcards.push(card3[i], card3[i + 1]);
                i++;
            }
        }
        if (pairs.length < card2.length)
            return false;

        var tmpArr1 = [];
        var tmpArr2 = [];
        var tmpArr3 = [];

        for (var i = 0; i < pairs.length; i += 2)
            tmpArr1.push(pairs[i]);
        for (var i = 0; i < card2.length; i += 2)
            tmpArr2.push(card2[i]);
        for (var i = 0; i < allcards.length; i += 2)
            tmpArr3.push(allcards[i]);

        var isDoubleStr = Noticstraights(tmpArr1, tmpArr2, tmpArr3);

        if (isDoubleStr) {
            var insertArr = [];
            for (var i in isDoubleStr) {
                var index = allcards.indexOf(isDoubleStr[i]);
                if (index >= 0) {
                    insertArr.push(allcards[index + 1]);
                }
            }
            return isDoubleStr.concat(insertArr)
        }
        return false
    };

    function Noticbomb(card1, card2, card3, otherType, threeBomb) {
        // console.log("Noticbomb出牌提示:::::otherType:"+otherType+" threeBomb:"+threeBomb);

        //首先判断是否有22炸,有则优先提示,否则会出现先提示4个炸的情况
        var tempBomb22 = false;
        var tempBombArr = {}; //33,22
        // var bomb22Card = [];
        for (var i = 0; i < card1.length - 1; i++) {
            if ((card1[i] == 3 && card1[i + 1] == 3)) {
                tempBomb22 = true;
                tempBombArr["3"] = [card3[i], card3[i + 1]];
            } else if (card1[i] == 15 && card1[i + 1] == 15) {
                tempBomb22 = true;
                tempBombArr["15"] = [card3[i], card3[i + 1]];
            }
        }
        console.log("是否有22炸 tempBomb22:" + tempBomb22);
        for (var i = 0; i <= card1.length - 2; i++) {
            var num = 1;
            var tmparr = [card3[i]];
            for (var j = 1; j < 4; j++) {
                if ((i + j) < card1.length && card1[i] == card1[i + j]) {
                    num++;
                    tmparr.push(card3[i + j])
                } else
                    break;
            }

            var haveBomb = false;

            if ((num == 2 && (card1[i] == 15 || card1[i] == 3)) ||
                (threeBomb && num == 3 && card1[i] == 3) ||
                num == 4) {
                console.log("_____有诈 threeBomb:" + threeBomb + " num:" + num + " card1[i]:" + card1[i]);
                haveBomb = true;
            }

            if (haveBomb) {
                // console.log("_____有诈11111 otherType:"+otherType+" card1:"+card1);
                switch (otherType) {
                    case "bomb22":
                        // console.log("_____有诈bomb22 num:"+num+" card1[i]:"+card1[i]);
                        if (card2[0] == 3 && tempBombArr["15"]) { //22管33
                            return tempBombArr["15"];
                        }
                        if (threeBomb && num >= 3 || (num == 2 && card1[i] > card2[0])) { //333管22或33
                            if (num == 4 && card1[i] == 3) { //3333
                                tmparr.shift(); //优先提示333
                            }
                            return tmparr;
                        } else if (num == 4) {
                            return tmparr;
                        }
                        break;
                    case "bomb333":
                        // console.log("_____有诈bomb333");
                        if (num == 4)
                            return tmparr;
                        break;
                    case "bomb":
                        // console.log("_____有诈bomb");
                        if (num == 4 && card1[i] > card2[0])
                            return tmparr;
                        break;
                    case "jokerBomb":
                        return false;
                        break;
                    default: //非炸弹类型比较
                        console.log("_____有诈end" + tmparr);
                        if (tempBomb22 && num != 2) //如果有22优先查找
                            break;
                        return tmparr;
                        break;
                }
            }

        }
        //王炸
        if (card1[card1.length - 1] == 55 && card1[card1.length - 2] == 50)
            return [card3[card3.length - 1], card3[card3.length - 2]];

        return false;
    };

    function Noticthree(card1, card2, card3) {
        var tmpArr = [];
        var tmpArr1 = [];
        for (var i = 0; i < card1.length - 2; i++) {
            var num = 1;
            for (var j = 1; j < 3; j++) {
                if (card1[i] == card1[i + j])
                    num++;
                else
                    break;
            }
            if (num == 3) {
                if (NoticCardIsInBoom(card1, i)) {
                    continue;
                } else {
                    tmpArr.push(card1[i], card1[i], card1[i]);
                    tmpArr1.push(card3[i], card3[i + 1], card3[i + 2]);
                    i += 2;
                }
            }
        }

        if (tmpArr.length >= 3) {
            for (var i = 0; i < card2.length - 2; i++) {
                var tmpArr2 = [card2[i]];
                for (var j = 1; j <= 2; j++) {
                    if (card2[i] == card2[i + j])
                        tmpArr2.push(card2[i]);
                    else
                        break;
                }
                if (tmpArr2.length == 3 && tmpArr[tmpArr.length - 1] > tmpArr2[0]) {
                    for (var i = 0; i < tmpArr.length - 2; i += 3) {
                        if (tmpArr[i] > tmpArr2[0])
                            return [tmpArr1[i], tmpArr1[i + 1], tmpArr1[i + 2]];
                    }
                }
            }
        }
        return false;
    };

    function Noticthreewithone(card1, card2, card3) {
        var tmpArr = [];
        var tmpArr1 = [];
        for (var i = 0; i < card1.length - 2; i++) {
            var num = 1;
            for (var j = 1; j < 3; j++) {
                if (card1[i] == card1[i + j])
                    num++;
                else
                    break;
            }
            if (num == 3) {
                tmpArr.push(card1[i], card1[i], card1[i]);
                tmpArr1.push(card3[i], card3[i + 1], card3[i + 2]);
                i += 2;
            }
        }

        if (tmpArr.length >= 3) {
            for (var i = 0; i < card2.length - 2; i++) {
                var tmpArr2 = [card2[i]];
                for (var j = 1; j <= 2; j++) {
                    if (card2[i] == card2[i + j])
                        tmpArr2.push(card2[i]);
                    else
                        break;
                }
                if (tmpArr2.length == 3 && tmpArr[tmpArr.length - 1] > tmpArr2[0]) {
                    for (var i = 0; i < tmpArr.length - 2; i += 3) {
                        if (tmpArr[i] > tmpArr2[0]) {
                            var threeArr = [tmpArr1[i], tmpArr1[i + 1], tmpArr1[i + 2]];
                            for (var key in card3) {
                                var index = threeArr.indexOf(card3[key])
                                if (index < 0 && threeArr.length < 4) {
                                    threeArr.push(card3[key]);
                                }
                            }
                            return threeArr;
                        }
                    }
                }
            }
        }
        return false;
    };

    function Noticthreestraights(card1, card2, card3) {
        var tmpArr = [];
        var allcards = [];
        for (var i = 0; i <= card1.length - 3; i++) {
            var num = 1;
            for (var j = 1; j < 3; j++) {
                if (card1[i] == card1[i + j])
                    num++;
                else
                    break;
            }
            if (num == 3) {
                tmpArr.push(card1[i], card1[i], card1[i]);
                allcards.push(card3[i], card3[i + 1], card3[i + 2]);
                i += 2;
            }
        }

        if (card2.length > tmpArr.length)
            return false;

        var tmpArr3 = [];
        var tmpArr4 = [];
        var tmpArr5 = [];

        for (var i = 0; i <= tmpArr.length - 3; i += 3)
            tmpArr3.push(tmpArr[i]);
        for (var i = 0; i <= card2.length - 3; i += 3)
            tmpArr4.push(card2[i]);
        for (var i = 0; i <= allcards.length - 3; i += 3)
            tmpArr5.push(allcards[i]);

        var straight = Noticstraights(tmpArr3, tmpArr4, tmpArr5);
        if (straight) {
            var insertArr = [];
            for (var i in straight) {
                var index = allcards.indexOf(straight[i]);
                if (index >= 0) {
                    insertArr.push(allcards[index + 1], allcards[index + 2]);
                }
            }
            return straight.concat(insertArr)
        }
        return false;
    };

    function Noticthreewithtwo(card1, card2, card3) {
        var tmpArr = [];
        var tmpArr1 = [];
        var tmpArr0 = card3.slice();

        for (var i = 0; i < card1.length - 2; i++) {
            var num = 1;
            for (var j = 1; j < 3; j++) {
                if (card1[i] == card1[i + j])
                    num++;
                else
                    break;
            }
            if (num == 3) {
                tmpArr.push(card1[i], card1[i], card1[i]);
                tmpArr1.push(card3[i], card3[i + 1], card3[i + 2]);
                i += 2;
            }
        }

        function typeSix() {
            for (var i = 0; i < card2.length - 2; i++) {
                var tmpArr2 = [card2[i]];
                for (var j = 1; j <= 2; j++) {
                    if (card2[i] == card2[i + j])
                        tmpArr2.push(card2[i]);
                    else
                        break;
                }
                if (tmpArr2.length == 3 && tmpArr[tmpArr.length - 1] > tmpArr2[0]) {
                    for (var i = 0; i < tmpArr.length - 2; i += 3) {
                        if (tmpArr[i] > tmpArr2[0]) {
                            var threeArr = tmpArr1.splice(i, 3);
                            threeArr.push(tmpArr1[0], tmpArr1[1]);
                            return threeArr;
                        }
                    }
                }
            };

            return false;
        };

        function typeThree() {
            for (var i = 0; i < card2.length - 2; i++) {
                var tmpArr2 = [card2[i]];
                for (var j = 1; j <= 2; j++) {
                    if (card2[i] == card2[i + j])
                        tmpArr2.push(card2[i]);
                    else
                        break;
                }
                if (tmpArr2.length == 3 && tmpArr[tmpArr.length - 1] > tmpArr2[0]) {
                    for (var i = 0; i < tmpArr.length - 2; i += 3) {
                        if (tmpArr[i] > tmpArr2[0]) {
                            var threeArr = [tmpArr1[i], tmpArr1[i + 1], tmpArr1[i + 2]];

                            for (var key in threeArr) {
                                var index = tmpArr0.indexOf(threeArr[key]);
                                if (index >= 0) {
                                    tmpArr0.splice(index, 1);
                                }
                            }

                            var tmpArrNums = createSortedCardNumbers1(tmpArr0);
                            var twoArr = NoticdoubleCards(tmpArrNums, [1, 1], tmpArr0);
                            if (twoArr) {
                                threeArr = threeArr.concat(twoArr);
                                return threeArr;
                            }
                        }
                    }
                }
            }

            return false;
        };

        var isThree = typeThree();
        if (isThree)
            return isThree;
        else
            return typeSix();

        // if(tmpArr.length>=6)
        // {
        //     for(var i=0;i<card2.length-2;i++)
        //     {
        //         var tmpArr2 = [card2[i]];
        //         for(var j=1;j<=2;j++)
        //         {
        //             if(card2[i] == card2[i+j])
        //                 tmpArr2.push(card2[i]);
        //             else
        //                 break;
        //         }
        //         if(tmpArr2.length == 3 && tmpArr[tmpArr.length-1]>tmpArr2[0])
        //         {
        //             for(var i=0;i<tmpArr.length-2;i+=3)
        //             {
        //                 if(tmpArr[i]>tmpArr2[0])
        //                 {
        //                     var threeArr = tmpArr1.splice(i,3);
        //                     threeArr.push(tmpArr1[0],tmpArr1[1]);
        //                     return threeArr;
        //                 }
        //             }
        //         }
        //     };
        //
        //     return false;
        // }
        // else if(tmpArr.length==3)
        // {
        //     for (var i = 0; i < card2.length - 2; i++)
        //     {
        //         var tmpArr2 = [card2[i]];
        //         for (var j = 1; j <= 2; j++) {
        //             if (card2[i] == card2[i + j])
        //                 tmpArr2.push(card2[i]);
        //             else
        //                 break;
        //         }
        //         if (tmpArr2.length == 3 && tmpArr[tmpArr.length - 1] > tmpArr2[0])
        //         {
        //             for(var i=0;i<tmpArr.length-2;i+=3)
        //             {
        //                 if(tmpArr[i]>tmpArr2[0])
        //                 {
        //                     var threeArr = [tmpArr1[i],tmpArr1[i+1],tmpArr1[i+2]];
        //
        //                     for(var key in threeArr)
        //                     {
        //                         var index = tmpArr0.indexOf(threeArr[key]);
        //                         if(index>=0)
        //                         {
        //                             tmpArr0.splice(index,1);
        //                         }
        //                     }
        //
        //                     var tmpArrNums = createSortedCardNumbers1(tmpArr0);
        //                     var twoArr = NoticdoubleCards(tmpArrNums,[1,1],tmpArr0);
        //                     if(twoArr)
        //                     {
        //                         threeArr = threeArr.concat(twoArr);
        //                         return threeArr;
        //                     }
        //                 }
        //             }
        //         }
        //     }
        //
        //     return false;
        // }

        return false;
    };

    function Noticaircraftwithtwo(card1, card2, card3) {
        var tmpArr = [];
        var allcards = [];
        for (var i = 0; i <= card1.length - 3; i++) {
            var num = 1;
            for (var j = 1; j < 3; j++) {
                if (card1[i] == card1[i + j])
                    num++;
                else
                    break;
            }
            if (num == 3) {
                tmpArr.push(card1[i], card1[i], card1[i]);
                allcards.push(card3[i], card3[i + 1], card3[i + 2]);
                i += 2;
            }
        }

        if (card2.length / 5 > tmpArr.length / 3)
            return false;
        else {
            var tmpArr2 = [];
            for (var i = 0; i <= card2.length - 3; i++) {
                var num = 1;
                for (var j = 1; j < 3; j++) {
                    if (card2[i] == card2[i + j])
                        num++;
                    else
                        break;
                }
                if (num == 3) {
                    if (tmpArr2.length > 0) {
                        if (card2[i] - tmpArr2[tmpArr2.length - 1] == 1) {
                            tmpArr2.push(card2[i], card2[i], card2[i]);
                        }
                    } else {
                        tmpArr2.push(card2[i], card2[i], card2[i]);
                    }
                    i += 2;
                }
            }
            var tmpArr3 = [];
            var tmpArr4 = [];
            var tmpArr5 = [];

            for (var i = 0; i <= tmpArr.length - 3; i += 3)
                tmpArr3.push(tmpArr[i]);
            for (var i = 0; i <= tmpArr2.length - 3; i += 3)
                tmpArr4.push(tmpArr2[i]);
            for (var i = 0; i <= allcards.length - 3; i += 3)
                tmpArr5.push(allcards[i]);

            var isPlane = Noticstraights(tmpArr3, tmpArr4, tmpArr5);
            if (isPlane) {
                var insertArr = [];
                for (var i in isPlane) {
                    var index = allcards.indexOf(isPlane[i]);
                    if (index >= 0) {
                        insertArr.push(allcards[index], allcards[index + 1], allcards[index + 2]);
                    }
                }
                for (var key in card3) {
                    var index = insertArr.indexOf(card3[key]);
                    if (index < 0 && insertArr.length < card2.length) {
                        insertArr.push(card3[key]);
                    }
                }
                return insertArr;
            }
            return false
        }
    };

    function Noticaircraftwithpairs(card1, card2, card3) {
        var tmpArr = [];
        var allcards = [];
        var remaincards = card3.slice();

        for (var i = 0; i <= card1.length - 3; i++) {
            var num = 1;
            for (var j = 1; j < 3; j++) {
                if (card1[i] == card1[i + j])
                    num++;
                else
                    break;
            }
            if (num == 3) {
                tmpArr.push(card1[i], card1[i], card1[i]);
                allcards.push(remaincards[i], remaincards[i + 1], remaincards[i + 2]);
                i += 2;
            }
        }


        if (card2.length / 5 > tmpArr.length / 3)
            return false;
        else {
            var tmpArr2 = [];
            for (var i = 0; i <= card2.length - 3; i++) {
                var num = 1;
                for (var j = 1; j < 3; j++) {
                    if (card2[i] == card2[i + j])
                        num++;
                    else
                        break;
                }
                if (num == 3) {
                    if (tmpArr2.length > 0) {
                        if (card2[i] - tmpArr2[tmpArr2.length - 1] == 1) {
                            tmpArr2.push(card2[i], card2[i], card2[i]);
                        }
                    } else {
                        tmpArr2.push(card2[i], card2[i], card2[i]);
                    }
                    i += 2;
                }
            }
            var tmpArr3 = [];
            var tmpArr4 = [];
            var tmpArr5 = [];

            for (var i = 0; i <= tmpArr.length - 3; i += 3)
                tmpArr3.push(tmpArr[i]);
            for (var i = 0; i <= tmpArr2.length - 3; i += 3)
                tmpArr4.push(tmpArr2[i]);
            for (var i = 0; i <= allcards.length - 3; i += 3)
                tmpArr5.push(allcards[i]);

            var isPlane = Noticstraights(tmpArr3, tmpArr4, tmpArr5);

            if (isPlane) {
                var threeArr = [];
                //取出3连
                for (var i in isPlane) {
                    var index = remaincards.indexOf(isPlane[i]);
                    if (index >= 0) {
                        threeArr.push(remaincards[index], remaincards[index + 1], remaincards[index + 2]);
                        remaincards.splice(index, 3);
                    }
                }

                //取出对子
                var twoArr = [];
                for (var key = 0; key < remaincards.length; key++) {
                    var simpRemain = remaincards[key] % 100;
                    // if (simpRemain == remaincards[key + 1] % 100) lew 不拆炸弹的前提下
                    if (simpRemain == remaincards[key + 1] % 100 && simpRemain != remaincards[key + 2] % 100 && remaincards[key + 3] % 100) {
                        twoArr = twoArr.concat(remaincards.splice(key, 2));
                        key -= 2;
                    }
                }

                if (threeArr.length == 6 && twoArr.length >= 4) {
                    return threeArr.concat(twoArr.splice(0, 4));
                } else if (threeArr.length == 9 && twoArr.length >= 6) {
                    return threeArr.concat(twoArr.splice(0, 6));
                }
            }
            return false
        }
    };

    function NoticCardIsInBoom(card3, cardIndex) {
        var index = parseInt(cardIndex);
        //炸弹
        for (var i = 0; i < 4; i++) {

            if (card3[index - 3 + i] == card3[index - 2 + i] &&
                card3[index - 2 + i] == card3[index - 1 + i] &&
                card3[index - 1 + i] == card3[index + i]) {
                // console.log("zwz_4");
                return true;
            }
        }
        return false;
    }

    //=================================提示算法修改==========================================
    function isHavePoker(a, b) {
        if (a.length < b.length || a.length == 0 || b.length == 0)
            return false;

        for (var i = 0; i < b.length; i++) {
            if (a.indexOf(b[i]) == -1)
                return false;
        }
        return true;
    };

    function NoticthreewithoneChange(card1, card2, card3, card4) {
        if (isHavePoker(card3, card4)) {
            var singlePk = 0;
            var threeArr = [];
            if (card4[0] % 100 != card4[1] % 100) {
                singlePk = card4[0];
                threeArr.push(card4[1], card4[2], card4[3])
            } else {
                singlePk = card4[card4.length - 1];
                threeArr.push(card4[0], card4[1], card4[2])
            }

            for (var key = 0; key < card1.length - 3; key++) {
                if (card1[key] % 100 == threeArr[0] % 100) {
                    if (card1[key] % 100 == card1[key + 1] % 100 &&
                        card1[key + 1] % 100 == card1[key + 2] % 100 &&
                        card1[key + 2] % 100 == card1[key + 3] % 100) {
                        return false;
                    }
                }
            }

            for (var key in card3) {
                var index = card4.indexOf(card3[key]);
                if (index < 0 && card3[key] % 100 > singlePk % 100 && card3[key] % 100 != threeArr[0] % 100) {
                    threeArr.push(card3[key]);
                    return threeArr;
                }
            }

            //继续优化3张更大的
        } else {
            var tmpArr = [];
            var tmpArr1 = [];
            for (var i = 0; i < card1.length - 2; i++) {
                var num = 1;
                for (var j = 1; j < 3; j++) {
                    if (card1[i] == card1[i + j])
                        num++;
                    else
                        break;
                }
                if (num == 3) {
                    if (NoticCardIsInBoom(card1, i)) {
                        continue;
                    } else {
                        tmpArr.push(card1[i], card1[i], card1[i]);
                        tmpArr1.push(card3[i], card3[i + 1], card3[i + 2]);
                        i += 2;
                    }
                }
            }

            if (tmpArr.length >= 3) {
                for (var i = 0; i < card2.length - 2; i++) {
                    var tmpArr2 = [card2[i]];
                    for (var j = 1; j <= 2; j++) {
                        if (card2[i] == card2[i + j])
                            tmpArr2.push(card2[i]);
                        else
                            break;
                    }
                    if (tmpArr2.length == 3 && tmpArr[tmpArr.length - 1] > tmpArr2[0]) {
                        for (var i = 0; i < tmpArr.length - 2; i += 3) {
                            if (tmpArr[i] > tmpArr2[0]) {
                                var threeArr = [tmpArr1[i], tmpArr1[i + 1], tmpArr1[i + 2]];
                                for (var key in card3) {
                                    var index = threeArr.indexOf(card3[key])
                                    if (index < 0 && threeArr.length < 4) {
                                        threeArr.push(card3[key]);
                                    }
                                }
                                return threeArr;
                            }
                        }
                    }
                }
            }
        }
        return false;
    };
    //numCards1:3,4,5,5,7,8,10,10,11,12,12,13,13,13,14,15,50 
    //numCards2:6,6,7,7,7 
    //cards1:403,404,305,405,207,308,110,210,211,112,412,213,313,413,314,115,550 
    //cards2:106,206,107,207,307
    function NoticthreewithtwoChange(card1, card2, card3, card4) {
        if (isHavePoker(card3, card4)) //自己的提示轮转
        {
            var doublePk = [];
            var threeArr = [];
            if (card4[1] % 100 != card4[2] % 100) {
                doublePk = [card4[0], card4[1]];
                threeArr.push(card4[2], card4[3], card4[4])
            } else {
                doublePk = [card4[3], card4[4]];
                threeArr.push(card4[0], card4[1], card4[2])
            }


            for (var key = 0; key < card1.length - 3; key++) {
                if (card1[key] == threeArr[0]) {
                    if (card1[key] == card1[key + 1] &&
                        card1[key + 1] == card1[key + 2] &&
                        card1[key + 2] == card1[key + 3]) {
                        return false;
                    }
                }
            }
            var tmpArr = card3.slice();
            for (var key = 0; key < tmpArr.length; key++) {
                var index = threeArr.indexOf(tmpArr[key]);
                if (index >= 0)
                    tmpArr.splice(key--, 1);
            }

            var tmpArrNums = createSortedCardNumbers1(tmpArr);
            var doubeNums = createSortedCardNumbers1(doublePk);
            var twoArr = NoticdoubleCards(tmpArrNums, doubeNums, tmpArr);
            // console.log("两张牌111:"+JSON.stringify(twoArr));
            if (twoArr)
                return threeArr.concat(twoArr);

            //继续优化3张更大的
        } else {
            var tmpArr = []; //三张牌 纯点数
            var tmpArr1 = []; //三张牌 
            var tmpArr0 = []; //手牌
            for (var key in card3) {
                tmpArr0[key] = card3[key];
            }

            for (var i = 0; i < card1.length - 2; i++) {
                var num = 1;
                for (var j = 1; j < 3; j++) {
                    if (card1[i] == card1[i + j])
                        num++;
                    else
                        break;
                }
                if (num == 3) {
                    if (NoticCardIsInBoom(card1, i)) {
                        continue;
                    } else {
                        tmpArr.push(card1[i], card1[i], card1[i]);
                        tmpArr1.push(card3[i], card3[i + 1], card3[i + 2]);
                        i += 2;
                    }
                }
            }

            function typeSix() {
                console.log("typeSix tmpArr1:" + tmpArr1 + " tmpArr0:" + tmpArr0 + " tmpArr:" + tmpArr);
                for (var i = 0; i < card2.length - 2; i++) {
                    var tmpArr2 = [card2[i]];
                    for (var j = 1; j <= 2; j++) {
                        if (card2[i] == card2[i + j])
                            tmpArr2.push(card2[i]);
                        else
                            break;
                    }
                    if (tmpArr2.length == 3 && tmpArr[tmpArr.length - 1] > tmpArr2[0]) {
                        for (var i = 0; i < tmpArr.length - 2; i += 3) {
                            if (tmpArr[i] > tmpArr2[0]) {
                                var threeArr = tmpArr1.splice(i, 3);
                                threeArr.push(tmpArr1[0], tmpArr1[1]);
                                return threeArr;
                            }
                        }
                    }
                };

                return false;
            };

            function typeThree() {
                for (var i = 0; i < card2.length - 2; i++) {
                    var tmpArr2 = [card2[i]];
                    for (var j = 1; j <= 2; j++) {
                        if (card2[i] == card2[i + j])
                            tmpArr2.push(card2[i]);
                        else
                            break;
                    }
                    if (tmpArr2.length == 3 && tmpArr[tmpArr.length - 1] > tmpArr2[0]) {
                        for (var i = 0; i < tmpArr.length - 2; i += 3) {
                            if (tmpArr[i] > tmpArr2[0]) {
                                var threeArr = [tmpArr1[i], tmpArr1[i + 1], tmpArr1[i + 2]];

                                for (var key in threeArr) {
                                    var index = tmpArr0.indexOf(threeArr[key]);
                                    if (index >= 0) {
                                        tmpArr0.splice(index, 1);
                                    }
                                }

                                var tmpArrNums = createSortedCardNumbers1(tmpArr0);
                                var twoArr = NoticdoubleCards(tmpArrNums, [1, 1], tmpArr0);
                                console.log("算法你妈逼的:" + twoArr + " tmpArrNums:" + tmpArrNums + " tmpArr0:" + tmpArr0);
                                if (twoArr) {
                                    threeArr = threeArr.concat(twoArr);
                                    return threeArr;
                                }
                            }
                        }
                    }
                }

                return false;
            };

            var isThree = typeThree();
            console.log("两张牌222:" + JSON.stringify(isThree));
            if (isThree)
                return isThree;
            else
                return typeSix();

        }

        // if(tmpArr.length>=6)
        // {
        //     for(var i=0;i<card2.length-2;i++)
        //     {
        //         var tmpArr2 = [card2[i]];
        //         for(var j=1;j<=2;j++)
        //         {
        //             if(card2[i] == card2[i+j])
        //                 tmpArr2.push(card2[i]);
        //             else
        //                 break;
        //         }
        //         if(tmpArr2.length == 3 && tmpArr[tmpArr.length-1]>tmpArr2[0])
        //         {
        //             for(var i=0;i<tmpArr.length-2;i+=3)
        //             {
        //                 if(tmpArr[i]>tmpArr2[0])
        //                 {
        //                     var threeArr = tmpArr1.splice(i,3);
        //                     threeArr.push(tmpArr1[0],tmpArr1[1]);
        //                     return threeArr;
        //                 }
        //             }
        //         }
        //     };
        //
        //     return false;
        // }
        // else if(tmpArr.length==3)
        // {
        //     for (var i = 0; i < card2.length - 2; i++)
        //     {
        //         var tmpArr2 = [card2[i]];
        //         for (var j = 1; j <= 2; j++) {
        //             if (card2[i] == card2[i + j])
        //                 tmpArr2.push(card2[i]);
        //             else
        //                 break;
        //         }
        //         if (tmpArr2.length == 3 && tmpArr[tmpArr.length - 1] > tmpArr2[0])
        //         {
        //             for(var i=0;i<tmpArr.length-2;i+=3)
        //             {
        //                 if(tmpArr[i]>tmpArr2[0])
        //                 {
        //                     var threeArr = [tmpArr1[i],tmpArr1[i+1],tmpArr1[i+2]];
        //
        //                     for(var key in threeArr)
        //                     {
        //                         var index = tmpArr0.indexOf(threeArr[key]);
        //                         if(index>=0)
        //                         {
        //                             tmpArr0.splice(index,1);
        //                         }
        //                     }
        //
        //                     var tmpArrNums = createSortedCardNumbers1(tmpArr0);
        //                     var twoArr = NoticdoubleCards(tmpArrNums,[1,1],tmpArr0);
        //                     if(twoArr)
        //                     {
        //                         threeArr = threeArr.concat(twoArr);
        //                         return threeArr;
        //                     }
        //                 }
        //             }
        //         }
        //     }
        //
        //     return false;
        // }

        return false;
    };

    //======================================================================================


    // poker.cardTypes = cardTypes;
    // poker.getCardsType = getCardsType;
    // poker.comparePokers = comparePokers;
    // poker.havelargerPokers = havelargerPokers;
    // // poker.getCardTypeImgName = getCardTypeImgName;
    // poker.createSortedCardNumbers = createSortedCardNumbers;
    // poker.noticePokers = noticePokers;

    // poker.getPokerCards = function () 
    // {
    //     return pokerCards;
    // };

    // if (typeof(cc.jsInstance) != "undefined") 
    // {
    //     cc.jsInstance.poker = poker;
    // } 
    // else 
    // {
    //     module.exports = poker;
    // }

    //lew 为便于实现继承链使用prototype赋值
    poker_base.prototype.Noticbomb = Noticbomb;
    poker_base.prototype.specialLargerCheck = specialLargerCheck; //特殊炸弹判定,子类需要重写
    //外面暴漏的主要方法 
    poker_base.prototype.getCardsType = getCardsType;
    poker_base.prototype.comparePokers = comparePokers;
    poker_base.prototype.havelargerPokers = havelargerPokers; //子类不用重写此方法,只需要控制cardTypes即可
    poker_base.prototype.createSortedCardNumbers = createSortedCardNumbers;
    poker_base.prototype.noticePokers = noticePokers;


    // console.log("------poker---------");
    cc.jsInstance = {};
    if (cc.jsInstance) {
        // if (typeof(cc.jsInstance) != "undefined") {
        if (!cc.jsInstance.pokerArr)
            cc.jsInstance.pokerArr = {};
        cc.jsInstance.pokerArr["linfenDDZ"] = poker_base;
    } else {
        module.exports = poker_base;
    }

    module.exports = poker_base;
})
();