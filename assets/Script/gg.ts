import { _decorator, Component, Node, UIOpacity, Vec3, tween, Label } from 'cc';
import { AdMgr } from './ad/AdMgr';
import { Global } from './Global';
const { ccclass, property } = _decorator;

@ccclass('gg')
export class gg extends Component {

    start() {
        //this.node.active = Global.canShow
        let time_1 = Math.random() * 2
        let time_2 = Math.random() * 2 + 2
        tween(this.node)
            .delay(time_1)
            .to(0.2,{angle:5})
            .to(0.4,{angle:-5})
            .to(0.4,{angle:5})
            .to(0.4,{angle:-5})
            .to(0.4,{angle:5})
            .to(0.2,{angle:0})
            .delay(time_2)
            .union()
            .repeatForever()
            .start()
    }

    callBackBtn(event:Event,str:string){

        if (str == 'btn_gg') {
            if (this.node.name == 'gg_hzzg') {//找梗汉字局（原卖家导流位，抖音侧已禁用）
                AdMgr.goSelf('wxda028206dba66eb2')
            }else if (this.node.name == 'gg_xlgq') {
                AdMgr.goSelf('wx221c26558d67126a')
            }
        }else if (str == 'btn_close') {
            this.node.scale = new Vec3(0,0,0)
            this.scheduleOnce(function(){
                this.node.scale = new Vec3(1,1,1)
            },10)
        }

    }

    update(deltaTime: number) {
        
    }
}

