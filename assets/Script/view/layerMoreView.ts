import { _decorator, Component, Node } from 'cc';
import ResMgr from '../manager/ResMgr';
import { ui, Global, Sound } from '../Global';
import { layerLevelView } from './layerLevelView';
import { PoolMgr } from '../manager/PoolMgr';
import { AdMgr } from '../ad/AdMgr';
import { AudioMgr } from '../manager/AudioMgr';
import { main } from '../main';
const { ccclass, property } = _decorator;

@ccclass('layerMoreView')
export class layerMoreView extends Component {
    numTime: number;

    start() {
        this.numTime = 0
    }

    init(){
        
    }

    async callBackBtn(event:Event,str:string){
        if (Global.canSound) {
            main.ins.playSound(Sound.wz_btn)
        }
        if (str == 'btn_back') {
            AdMgr.closeCustomAd(4)
            const view = await ResMgr.ins.getUI(ui.layerLevelView);
            view.getComponent(layerLevelView).init();
            
            PoolMgr.ins.putNode(this.node)
        }else if (str == 'btn_hzzg') {
            AdMgr.goSelf('wxda028206dba66eb2')
        }else if (str == 'btn_xlgq') {
            AdMgr.goSelf('wx221c26558d67126a')
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


