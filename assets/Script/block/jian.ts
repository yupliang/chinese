import { _decorator, Component, Node, Vec2, Vec3, tween, Tween, UIOpacity, Label, UITransform } from 'cc';
import { PoolMgr } from '../manager/PoolMgr';
const { ccclass, property } = _decorator;

@ccclass('jian')
export class jian extends Component {
    
    start() {

    }

    init(num_num,num_type = 1){
        Tween.stopAllByTarget(this.node)

        if (num_type == 1) {
            this.node.getChildByName('bg').getComponent(UITransform).width = 80
            if (num_num > 0) {
                this.node.getChildByName('Label').getComponent(Label).string = '+' + num_num + 's'
            }else{
                this.node.getChildByName('Label').getComponent(Label).string = '' + num_num + 's'
            }
        }else if (num_type == 2) {
            this.node.getChildByName('bg').getComponent(UITransform).width = 200
            this.node.getChildByName('Label').getComponent(Label).string = num_num
        }
        
        
        this.node.setPosition(0,0,0)
        this.node.scale = new Vec3(0.8,0.8,0.8)

        tween(this.node)
            .set({position: new Vec3(0,0,0)})
            .to(0.5,{position: new Vec3(0,100,0)})
            .delay(2)
            .call(()=>{
                PoolMgr.ins.putNode(this.node)
            })
            .start()

        tween(this.node.getComponent(UIOpacity))
            .set({opacity:255})
            .delay(1.8)
            .to(0.5,{opacity:0})
            .start()
            

    }

    update(deltaTime: number) {
        
    }
}


