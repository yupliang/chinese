import { _decorator, Component, Node, macro, director, Canvas, instantiate, AudioClip, AudioSource, assert} from 'cc';
import ResMgr from './manager/ResMgr';
import { ui, Global, Key, Sound } from './Global';
import { Tools, load, save } from './Tools';
import { layerTwoView } from './view/layerTwoView';
import { layerThreeView } from './view/layerThreeView';
import { gameData } from './gameData';
import { AudioMgr } from './manager/AudioMgr';
import { layerFourView } from './view/layerFourView';
import { AdMgr } from './ad/AdMgr';
import { layerOneView } from './view/layerOneView';
import { layerFiveView } from './view/layerFiveView';
import { layerSixView } from './view/layerSixView';
import { layerSevenView } from './view/layerSevenView';
const { ccclass, property } = _decorator;

@ccclass('main')
export class main extends Component {

    static ins : main = null;
    canvas: Node;
    private layer: Node[] = [];

    @property({type:[AudioClip]})
    arrClips = []
    
    numArrAudio: number;
    arrAudio: any[];


    start() {
        main.ins = this
        this.initUI()
        ResMgr.ins.getUI(ui.TipView)
        this.init()
        macro.ENABLE_MULTI_TOUCH = false
    }

    init(){
        this.numArrAudio = 0
        this.arrAudio = []

        ResMgr.ins.getUI(ui.baseView)

        Global.LevelData = Global.getLevelData()
        if (Global.LevelData.arrData.length == 1) {
            Global.saveLevelData()
        }

        Global.numLevel = gameData.arrData.length - 1
        for (let i = 0; i < gameData.arrData.length; i++) {
            if (!Global.LevelData.arrData.includes(i)) {
                Global.numLevel = i-1
                if (Global.numLevel < 0) {
                    Global.numLevel = 0
                }
                break
            }
        }
        this.showLog('Global.numLevel:'+Global.numLevel);

        {
            let num_gd = Number(load('numGongDe'))
            if (num_gd) {
                Global.numGongDe = num_gd
            }
    
            let zong_gd = Number(load('ZongGongDe'))
            if (zong_gd) {
                Global.ZongGongDe = zong_gd
            }
        }
        
        
        ResMgr.ins.getUI(ui.layerHomeView)

    }

    async initGame(um_type = 0){
        let num_length = gameData.arrData.length
        if (Global.numLevel >= num_length) {
            Global.numLevel = Math.floor(Math.random() * num_length)
        }

        let num_gameType = gameData.arrData[Global.numLevel].gameType

        if (num_gameType == 1) {//0:正常 1:重玩 2:复活
            const view = await ResMgr.ins.getUI(ui.layerOneView);
            view.getComponent(layerOneView).init(um_type);
        }else if (num_gameType == 2) {
            const view = await ResMgr.ins.getUI(ui.layerTwoView);
            view.getComponent(layerTwoView).init(um_type);
        }else if (num_gameType == 3) {
            const view = await ResMgr.ins.getUI(ui.layerThreeView);
            view.getComponent(layerThreeView).init();
        }else if (num_gameType == 4) {
            const view = await ResMgr.ins.getUI(ui.layerFourView);
            view.getComponent(layerFourView).init(um_type);
        }else if (num_gameType == 5) {
            const view = await ResMgr.ins.getUI(ui.layerFiveView);
            view.getComponent(layerFiveView).init(um_type);
        }else if (num_gameType == 6) {
            const view = await ResMgr.ins.getUI(ui.layerSixView);
            view.getComponent(layerSixView).init(um_type);
        }else if (num_gameType == 7) {
            const view = await ResMgr.ins.getUI(ui.layerSevenView);
            view.getComponent(layerSevenView).init(um_type);
        }

        AdMgr.closeCustomAd(1)
        AdMgr.closeCustomAd(3)

        if (um_type != 0) {
            if (Math.random() > 0.2) {
                let num_random = Math.random()
                if (num_random > 0.5) {
                    AdMgr.showCustomAd('1_1')
                }else if (num_random > 0.3){
                    AdMgr.showCustomAd('1_2')
                }else{
                    AdMgr.showCustomAd('1_1')
                    AdMgr.showCustomAd('1_2')
                }
            }
        }
    }

    gameSuccess(is_next = false){
        if (Global.canSound && !is_next) {
            this.playSound(Sound.wz_win)
        }
        let num_length = gameData.arrData.length
        Global.numLevel++
        let num_num = Global.numLevel-1
        if (Global.numLevel >= num_length) {
            Global.numLevel = num_length - 1
        }
       
        if (Global.is24) {
            if (num_num >= num_length) {
                num_num = num_length - 1
            }
            if (!Global.LevelData.arrData.includes(num_num)) {
                Global.LevelData.arrData.push(num_num)
                Global.saveLevelData()
            }
        }else{
            if (!Global.LevelData.arrData.includes(Global.numLevel)) {
                Global.LevelData.arrData.push(Global.numLevel)
                Global.saveLevelData()
            }
        }
    }

    initUI() {
        const scene = director.getScene();
        this.canvas = scene.getComponentInChildren(Canvas).node;
        for (var i = 0; i <= 5; i++) {
            /* if layer0 exist, we clone it, otherwise create a new one */
            const node = this.layer[0] ? instantiate(this.layer[0]) : Tools.createUI();
            node.name = "layer" + i;
            node.parent = this.canvas;
            Global.layer[i] = this.layer[i] = node;
        }
    }

    playSound(str){
        if (!Global.canSound) {
            return
        }
        let num_i = -1
        // if(str == 'Clips/wz_click'){
        //     num_i = 0
        // }else if(str == 'Clips/wz_dada'){
        //     num_i = 1
        // }else if(str == 'Clips/wz_oo'){
        //     num_i = 2
        // }

        if (num_i == -1) {
            AudioMgr.ins.playSound(str)
            return
        }

        if (this.arrAudio.length > 15) {
            this.numArrAudio++
            if (this.numArrAudio >= this.arrAudio.length) {
                this.numArrAudio = 0
            }
            this.arrAudio[this.numArrAudio].stop()
            this.arrAudio[this.numArrAudio].clip = this.arrClips[num_i]
            this.arrAudio[this.numArrAudio].playOneShot(this.arrClips[num_i], 1);
        }else{
            let audio_source = new AudioSource
            audio_source.clip = this.arrClips[num_i]
            audio_source.playOneShot(this.arrClips[num_i], 1);
            this.arrAudio.push(audio_source)
        }

    }

    showLog(str){
        if (Global.canLog) {
            console.log(str);
        }
    }

   
    update(deltaTime: number) {
        
    }
}


