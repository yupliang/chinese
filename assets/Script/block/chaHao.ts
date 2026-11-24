import { _decorator, Component, Node, Vec2, Vec3, tween } from 'cc';
import { PoolMgr } from '../manager/PoolMgr';
const { ccclass, property } = _decorator;

@ccclass('chaHao')
export class chaHao extends Component {
    start() {

    }

    init(){
        this.node.scale = new Vec3(0.8,0.8,0.8)

        tween(this.node)
            .to(0.3,{scale: new Vec3(1,1,1)})
            .to(0.8,{scale: new Vec3(0,0,0)})
            .call(()=>{
                PoolMgr.ins.putNode(this.node)
            })
            .start()

    }

    update(deltaTime: number) {
        
    }
}


