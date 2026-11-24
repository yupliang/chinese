
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

    static shares = [//微信分享
        {
            shareText:'【有人@我】帮我找出所有的热梗...',//标题
            shareId:'',
            shareLink:''//分享图片链接
        },
    ]

    static idBanner = 'adunit-d8147e4cc5c5ae3c'//Banner广告位id
    static idInterstitial = 'adunit-1fc4df0f7f6f2fb3'//插屏广告位id
    static idVideo = 'adunit-6c4f7fba7f8ac821'//激励视频广告位id
    static idCustom1_1 = 'adunit-3bd065c5f30207a1'//单格子
    static idCustom1_2 = 'adunit-952039134ab27045'//单格子
    static idCustom3_1 = 'adunit-15a15ae8dc60a6b0'//多格子-三个
    static idCustom4 = 'adunit-79cc10eec8416b61'//矩阵格子-4行
    static idCustom5 = 'adunit-3e70d615782ae047'//矩阵格子-5行






    

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

