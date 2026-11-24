import { _decorator, Component, Node, Vec3, tween } from 'cc';
import { PoolMgr } from '../manager/PoolMgr';
const { ccclass, property } = _decorator;

@ccclass('blockSixTX')
export class blockSixTX extends Component {
    start() {

    }

    init(){
        let f_scale = Math.random() * 3 + 1
        let f_scale_2 = new Vec3(0,0,0)
        let f_angle = 30 + Math.random() * 360
        this.node.scale = new Vec3(f_scale,f_scale,f_scale)
        let v3_p = this.node.getPosition()
        let time_move = 0.3 + Math.random() * 0.3
        v3_p.x = v3_p.x - 40 + Math.random() * 80
        v3_p.y = v3_p.y - 60 + Math.random() * 120
        tween(this.node)
            .to(time_move,{position:v3_p,scale:f_scale_2,angle:f_angle})
            .call(()=>{
                PoolMgr.ins.putNode(this.node)
            })
            .start()
    }

    update(deltaTime: number) {
        
    }
}

