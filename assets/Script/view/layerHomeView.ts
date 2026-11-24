import { _decorator, Component, Node } from 'cc';
import ResMgr from '../manager/ResMgr';
import { ui, Global, Sound } from '../Global';
import { layerLevelView } from './layerLevelView';
import { PoolMgr } from '../manager/PoolMgr';
import { AudioMgr } from '../manager/AudioMgr';
import { WxPlatform } from '../ad/WxPlatform';
import { AdMgr } from '../ad/AdMgr';
import { WECHAT } from 'cc/env';
import { main } from '../main';
import { layerSixView } from './layerSixView';
const { ccclass, property } = _decorator;

@ccclass('layerHomeView')
export class layerHomeView extends Component {

    @property({type:Node})
    nBtnOn = null

    @property({type:Node})
    nBtnOff = null
    numTime: number;

    start() {
        this.numTime = 0
        this.nBtnOn.active = Global.canSound
        this.nBtnOff.active = !Global.canSound
    }

    refreshBtnSound(){
        this.nBtnOn.active = Global.canSound
        this.nBtnOff.active = !Global.canSound
        if (Global.canSound) {
            if (!AudioMgr.ins.isMusicPlaying()) {
                AudioMgr.ins.playMusic(Sound.wz_bgm,0.5)
            }
        }else{
            if (AudioMgr.ins.isMusicPlaying()) {
                AudioMgr.ins.stopMusic()
            }
        }
    }

    async callBackBtn(event:Event,str:string){ 
        
        let is_share = false
        if (str == 'btn_share') {
            is_share = true
            let call =()=>{
            }
            WxPlatform.ins.showShare(call)
        }else if (str == 'btn_sound_on' || str == 'btn_sound_off') {
            Global.canSound = !Global.canSound
        }else if (str == 'btn_start') {
            const view = await ResMgr.ins.getUI(ui.layerLevelView);
            view.getComponent(layerLevelView).init();
            
            PoolMgr.ins.putNode(this.node)

        }else if(str == 'btn_xlgq'){
            const view = await ResMgr.ins.getUI(ui.layerSixView);
            view.getComponent(layerSixView).init(0,true);
            PoolMgr.ins.putNode(this.node)
        }

        this.refreshBtnSound()

        if (!is_share || !WECHAT) {
            main.ins.playSound(Sound.wz_btn)
        }
    }

    update(deltaTime: number) {
        if (Global.canShow) {
            return
        }
        this.numTime++
        if (this.numTime >= 30) {
            this.numTime = 0
            AdMgr.closeCustomAd(1)
            AdMgr.closeCustomAd(3)
        }
    }
}


