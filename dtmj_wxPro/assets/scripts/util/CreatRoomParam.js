cc.Class({
    extends: cc.Component,

    properties: {

    },
    onLoad() {},

    getParams() {
        return {
            "tdhparam": { //推倒胡
                "round": "round8",
                "gameKind": "tuidaohu",
                "notJoin": false,
                "tdh_xg": {
                    "tdh_visible": true,
                    "tdh_dahu": true,
                    "tdh_withWind": false,
                    "tdh_canEatHu": true,
                    "tdh_needTing": false,
                    "tdh_changeTingGang": false,
                    "tdh_haozi": false,
                },
            },
            "tdh3param": { //三人推倒胡
                "round": "roundz8", //  round1  roundz8  roundz16
                "gameKind": "tuidaohu3",
                "notJoin": false,
                "gameXg": {
                    "withWind": true,
                    "canEatHu": false,
                    "needTing": true,
                    "changeTingGang": true,
                    "noBigWin": false,
                    "visible": true
                },
            },
            "tdh2param": { //二人推倒胡
                "round": "roundz8", //  round1  roundz8  roundz16
                "gameKind": "tuidaohu2",
                "notJoin": false,
                "gameXg": {
                    "visible": true,
                    "dahu": true,
                    "canEatHu": true,
                    "needTing": false,
                    "changeTingGang": false,
                    "lackOne": false,
                },
            },

            "gsjparam": { //拐三角
                "round": "round8", //  circle1   round1  round4  round8
                "gameKind": "guaisanjiao",
                "notJoin": false,
                "gsj_xg": {
                    "gsj_visible": true,
                    "gsj_qixiaodui": true,
                    "gsj_shisanyao": false,
                    "gsj_ying8zhang": false,
                    "circle": false
                },
            },
            "gsj2param": { //二人拐三角
                "round": "round8", //  circle1   round1  round4  round8
                "gameKind": "guaisanjiao",
                "notJoin": false,
                "gsj_xg": {
                    "gsj_visible": true,
                    "gsj_qixiaodui": true,
                    "gsj_shisanyao": false,
                    "gsj_ying8zhang": false,
                    "circle": false
                },
            },

            "kdparam": { //抠点
                "round": "round8",
                "notJoin": false,
                "gameKind": "koudian",
                "kd_xg": {
                    "kd_visible": true,
                    "kd_SameColor": true,
                    "kd_zhuohaozi": false,
                    "kd_fenghaozi": false,
                    "kd_changeTingGang": false,
                    "kd_zhuang": false,
                    "kd_zhuangDouble": false,
                    "kd_fengzuizi": false,
                    "circle": false
                }
            },
            "kd2param": { //二人抠点
                "round": "roundz8", //round1  roundz8  roundz16
                "notJoin": false,
                "gameKind": "koudian2",
                "gameXg": {
                    "visible": true,
                    "kd_SameColor": true,
                    "kd_zhuohaozi": false,
                    "kd_fenghaozi": false,
                    "kd_changeTingGang": false,
                    "kd_zhuang": false,
                    "kd_zhuangDouble": false,
                    "kd_fengzuizi": false,
                    "circle": false,
                    "needTing": false,
                    "withWind": true,
                    "canEatHu": true
                }
            },

            "jdddzparam": { //经典斗地主
                "notJoin": false,
                "round": "round8",
                "gameKind": "happyDDZ",
                "gameXg": {
                    "visible": true,
                    "bombLime": "3" // 3，4，5，100 
                }
            },
         
            "pokerPDKparam": {//跑得快
                "round": "round8",//round1  round4 round8
                "putSpeed": 1,//打牌速度
                "gameKind": "pokerPDK",
                "gameXg": {
                    "pdk_redPeach_3": false,//开局先出红三
                    "visible": true
                }
            },

            "ankangparam": { //安康一五九
                "round": "round8",
                "gameKind": "ankang",
                "gameXg": {
                    "ankang_visible": true,
                    "ankang_buyCode": 1,
                    "ankang_red": false,
                    "ankang_bang": false,
                    "ankang_QAdd": true,
                    "ankang_HAdd": false,
                    "ankang_GAdd": false
                }
            },

            "dafangpaoparam": { //打放炮
                "round": "round8",
                "gameKind": "dafangpao",
                "gameXg": {
                    "dfp_dahu": false,
                    "dfp_ting": false,
                    "dfp_zimo": false,
                    "dfp_budaifeng": false,
                    "dfp_ypdx": false,
                    "dfp_gshz": false,
                    "dfp_mgsjc": false,
                    "visible": true
                }
            },

            "yunchnegparam": { //运城贴金
                "round": "round1",
                "notJoin": false,
                "yuncheng": {
                    "yc_visible": false,
                    "yc_jinNum": 8,
                    "yc_ssy": true,
                    "yc_ytl": true,
                    "yc_qys": true,
                    "yc_qxd": true,
                    "yc_suojin": true,
                    "yc_sjbs": false,
                    "yc_sjfd": true,
                    "yc_dptp": false,
                    "yc_zhuang": false,
                    "yc_heisanfeng": false,
                    "yc_caneatHu": false
                },
            },

            "jzparam": { //晋中
                "round": "round8", //circle1  round1  round4   round8
                "notJoin": false,
                "jz_xg": {
                    "jz_visible": true,
                    "circle": false
                },
            },

            "lsparam": { //立四
                "round": "round1",
                "notJoin": false,
                "ls_xg": {
                    "ls_visible": true,
                    "circle": false
                },
            },

            "XAparam": { //西安麻将
                "round": "round1",
                "notJoin": false,
                "XA_xiangGuan": {
                    "xa_visible": false,
                    "xa_zimo": false,
                    "xa_xiapaozi": false,
                    "xa_hongzhong": false,
                    "xa_withWind": false,
                    "xa_jiang_258": false,
                    "xa_hu_with258": false,
                    "xa_jiang_with258": false,
                    "xa_can7_fanbei": false,
                    "xa_can7_bufanbei": false,
                    "xa_qys": false,
                    "circle": false
                },
            },

            "ylparam": { //临沂推倒胡
                "round": "round1",
                "notJoin": false,

                "yl_xiangGuan": {
                    "yl_visible": false,
                    "yl_zhuang": false
                },
            },

            "lfparam": { //临汾硬三嘴
                "round": "round1",
                "notJoin": false,
                "lf_xiangGuan": {
                    "lf_visible": false,
                    "lf_ysz": true,
                    "lf_ymp": false,
                    "lf_sy": false,
                    "lf_50fan": false,
                    "circle": false
                },
            },


            "dtparam": { //大同乱刮风
                "round": "round1",
                "notJoin": false,
                "dt_xiangGuan": {
                    "dt_visible": false,
                    "dt_fzb": true,
                    "dt_ct": false,
                    "dt_qidui": true,
                    "dt_gangScore": true,
                    "circle": false
                },
            },

            "rainparam": { //繁寺下雨
                "round": "round1",
                "rain_xiangGuan": {
                    "rain_visible": false,
                    "rain_addScore": false,
                    "rain_bang": false,
                    "circle": false
                },
            },

            "kingparam": { //洪洞王牌
                "round": "round1",
                "notJoin": false,
                "king_xiangGuan": {
                    "king_visible": false,
                    "king_quemen": false,
                    "king_baogang": false,
                    "circle": false
                },
            }

        }

    },
});