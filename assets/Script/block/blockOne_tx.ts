import { _decorator, Component, Node, Sprite, tween, UIOpacity } from 'cc';
import { PoolMgr } from '../manager/PoolMgr';
const { ccclass, property } = _decorator;

@ccclass('blockOne_tx')
export class blockOne_tx extends Component {
    start() {

    }

    init(color){
        let num_time = 0.15
        this.node.getComponent(Sprite).color = color
        tween(this.node.getComponent(UIOpacity))
            .set({opacity:255})
            .delay(num_time)
            .set({opacity:0})
            .delay(num_time)
            .set({opacity:255})
            .delay(num_time)
            .set({opacity:0})
            .delay(num_time)
            .set({opacity:255})
            .delay(num_time)
            .set({opacity:0})
            .call(()=>{
                PoolMgr.ins.putNode(this.node)
            })
            .start()
            
    }

    update(deltaTime: number) {
        
    }
}

