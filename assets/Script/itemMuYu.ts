import { _decorator, Component, Node, Label, tween, Vec3, UIOpacity } from 'cc';
import { PoolMgr } from './manager/PoolMgr';
import { Global } from './Global';
const { ccclass, property } = _decorator;

@ccclass('itemMuYu')
export class itemMuYu extends Component {

    start() {

    }

    init(v3_pos){
        this.node.getComponent(Label).string = '功德'+'+'+Global.numGongDe
        tween(this.node)
            .set({position: v3_pos})
            .by(3,{position:new Vec3(0,180,0)})
            .call(()=>{
                PoolMgr.ins.putNode(this.node)
            })
            .start()

        tween(this.node.getComponent(UIOpacity))
            .set({opacity:255})
            .to(2.8,{opacity:0})
            .start()
    }

    update(deltaTime: number) {
        
    }
}


