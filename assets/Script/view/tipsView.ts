import { _decorator, Component, Node, Label } from 'cc';
import { Global, ui, Sound } from '../Global';
import { PoolMgr } from '../manager/PoolMgr';
import { main } from '../main';
import ResMgr from '../manager/ResMgr';
import { layerLevelView } from './layerLevelView';
import { AudioMgr } from '../manager/AudioMgr';
import { gameData } from '../gameData';
const { ccclass, property } = _decorator;

@ccclass('tipsView')
export class tipsView extends Component {
    
    @property({type:Label})
    labelTips = null

    start() {

    }

    init(num_num){
        let str_str = ''
        
        if (num_num == 1) {
            let arr_tips = gameData.arrData[Global.numLevel].gameTips
            for (let i = 0; i < arr_tips.length; i++) {
                str_str = str_str + arr_tips[i]
                if (i != arr_tips.length-1) {
                    str_str = str_str + '、'
                }
            }
        }else if (num_num == 4) {
            let arr_tips_2 = gameData.arrData[Global.numLevel].gameYin
            for (let i = 0; i < arr_tips_2.length; i++) {
                str_str = str_str + arr_tips_2[i][0] //+ '(' + arr_tips_2[i][1] + ')'
                if (i != arr_tips_2.length-1) {
                    str_str = str_str + '、'
                }
            }
        }else if (num_num == 5) {
            let arr_tips_3 = gameData.arrData[Global.numLevel].gameinfo
            for (let i = 0; i < arr_tips_3.length; i++) {
                str_str = str_str + arr_tips_3[i][0] + '(' + arr_tips_3[i][1] + ')'
                if (i != arr_tips_3.length-1) {
                    str_str = str_str + '\n'
                }
            }
        }else if (num_num == 7) {
            let arr_tips_4 = gameData.arrData[Global.numLevel].gameTips
            for (let i = 0; i < arr_tips_4.length; i++) {
                str_str = str_str + arr_tips_4[i]
                if (i != arr_tips_4.length-1) {
                    str_str = str_str+ '\n'
                }
            }
        }

        this.labelTips.string = str_str
    }

    async callBackBtn(event:Event,str:string){
        if (Global.canSound) {
            main.ins.playSound(Sound.wz_btn)
        }
        if (str == 'btn_close') {
            PoolMgr.ins.putNode(this.node)
        }
    }

    update(deltaTime: number) {
        
    }
}


