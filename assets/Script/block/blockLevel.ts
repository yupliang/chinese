import { _decorator, Component, Node, Label, EditBox, Sprite, color, Color, director } from 'cc';
import { gameData } from '../gameData';
import { main } from '../main';
import { Global, Sound } from '../Global';
import { PoolMgr } from '../manager/PoolMgr';
import { layerLevelView } from '../view/layerLevelView';
import { AudioMgr } from '../manager/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('blockLevel')
export class blockLevel extends Component {

    @property({type:Label})
    labelInfo = null
    
    numIndex: any;
    canShow: boolean;
    nParent: any;

    start() {

    }

    init(num_index,can_show,n_parent){
        this.canShow = can_show
        this.numIndex = num_index
        this.nParent = n_parent
        this.labelInfo.string = gameData.arrData[num_index].gameTitle[0]

        if (gameData.arrData[num_index].gameBao) {
            this.node.getChildByName('bao').active = gameData.arrData[num_index].gameBao
        }else{
            this.node.getChildByName('bao').active = false
        }

        if (this.canShow) {
            this.node.getComponent(Sprite).color = new Color(255,60,60,255)
        }else{
            if (Global.is24) {
                this.node.getComponent(Sprite).color = new Color(140,255,140,255)
            }else{
                this.node.getComponent(Sprite).color = new Color(255,255,255,255)
            }
        }
    }

    callBackBtn(event:Event,str:string){
        if (Global.canSound) {
            main.ins.playSound(Sound.wz_btn)
        }
        if (str == 'blockLevel') {
            if (this.canShow || Global.is24) {
                Global.numLevel = this.numIndex
                main.ins.initGame()
                PoolMgr.ins.putNode(this.nParent)
            }else{
                let ts_layerLevelView = this.nParent.getComponent(layerLevelView)
                ts_layerLevelView.showLock(this.numIndex)
            }
        }
    }

    update(deltaTime: number) {
        
    }
}


