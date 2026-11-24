
import { director, Node, Prefab, AudioClip, SpriteAtlas, JsonAsset, SpriteFrame, sys } from "cc";

export const AssetType = ({
    Prefab: { type: Prefab, path: "Prefabs/" },
    Sound: { type: AudioClip, path: "Clips/" },
    Atlas: { type: SpriteAtlas, path: "Atlas/" },
    SpriteFrames: { type: SpriteFrame, path: "SpriteFrames/" },
    Json: { type: JsonAsset, path: "Jsons/" }
})

export const Sound_1 = ({
    wz_bgm:'Clips/wz_bgm',
    wz_btn:'wz_btn',
    wz_click:'wz_click',
    wz_get:'wz_get',
    wz_oo:'wz_oo',
    wz_dada:'wz_dada',
    wz_win:'wz_win',
    wz_start:'wz_start',
})

export const Sound = ({
    wz_bgm:'Clips/wz_bgm',
    wz_btn:'Clips/wz_btn',
    wz_click:'Clips/wz_click',
    wz_get:'Clips/wz_get',
    wz_oo:'Clips/wz_oo',
    wz_dada:'Clips/wz_dada',
    wz_win:'Clips/wz_win',
    wz_start:'Clips/wz_start',
})

/* for ui prefabs config */
export const ui = ({
    baseView: { name: 'baseView', layer: 1, clear: true},

    layerHomeView: { name: 'layerHomeView', layer: 2, clear: true},
    layerLevelView: { name: 'layerLevelView', layer: 2, clear: true},
    layerOneView: { name: 'layerOneView', layer: 2, clear: true},
    layerTwoView: { name: 'layerTwoView', layer: 2, clear: true},
    layerThreeView: { name: 'layerThreeView', layer: 2, clear: true},
    layerFourView: { name: 'layerFourView', layer: 2, clear: true},
    layerFiveView: { name: 'layerFiveView', layer: 2, clear: true},
    layerSixView: { name: 'layerSixView', layer: 2, clear: true},
    layerSevenView: { name: 'layerSevenView', layer: 2, clear: true},
    
    layerMoreView: { name: 'layerMoreView', layer: 2, clear: true},
    resultView: { name: 'resultView', layer: 2, clear: true},
    TipView: { name: 'TipView', layer: 5, clear: true},
})

/* keys for storage */
export const Key = {
    Pause:'Pause',
    TimeLockAll:'TimeLockAll',
    numGongDe:'numGongDe',
    ZongGongDe:'ZongGongDe',
}

export const events = {
    Toast: "toast",
}

export class Global {

    /** 正式名：软著 / 提审 / 包内标题统一用此名 */
    static gameTitle = '汉字找梗';

    static shares = [// 分享文案（抖音 / 微信）
        {
            shareText: '【有人@我】来「汉字找梗」帮我找出所有的热梗...',
            shareId: '',
            shareLink: '',
        },
    ]

    /**
     * 抖音流量主广告位。开通后填入真实 ID，并把 dyMockAds 设为 false。
     * 原卖家微信 adunit 已废弃，勿再使用。
     */
    static dyMockAds = true;
    static idBanner = '';
    static idInterstitial = '';
    static idVideo = '';

    /** 微信格子广告位（抖音分支不再使用，保留空串避免误调卖家账号） */
    static idCustom1_1 = '';
    static idCustom1_2 = '';
    static idCustom3_1 = '';
    static idCustom4 = '';
    static idCustom5 = '';






    

    static numAddTime = 40

    static canLog = false
    
    static numLockTV = 0

    static numLevel = 0

    static canEdit = false

    static canSound = true

    static allShare = false

    static canShow = true

    static isTVing = false

    static is24 = false

    static numGongDe = 1

    static ZongGongDe = 1

    static numColorXC = 0
    


    
    static timeShare = null

    static numTimeShare = 4000 //3秒

    static strLoadInfo = '88888888888888888'
    
    static Debug = false;

    /* if game starts */
    static start = false;

    /* loading rate  */
    static LoadingRate = 0;

    /* global layer storage */

    static layer: Node[] = [];

    static LevelData = null;
    

    static getLevelData(){
        let level_data = null
        let str_level_data = sys.localStorage.getItem('LevelData')
        if (str_level_data) {
            level_data = JSON.parse(str_level_data)
        }else{
            level_data = {
                arrData:[0],
                arrAnswer:[]
            }
        }
        return level_data
    }

    static saveLevelData(){
        sys.localStorage.setItem('LevelData', JSON.stringify(Global.LevelData));
    }


    /* used for game pause */
    static Pause(isPause = true) {
        director.emit(Key.Pause, isPause);
        Global.start = !isPause;
        Global.isTVing = isPause
    }

}

