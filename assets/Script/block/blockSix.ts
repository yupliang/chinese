import { _decorator, Component, Node, UITransform, Rect, Vec3, Sprite, Label, Tween, tween } from 'cc';
import { gameData } from '../gameData';
import { Global } from '../Global';
const { ccclass, property } = _decorator;

@ccclass('blockSix')
export class blockSix extends Component {

    @property({type:Node})
    nodeYinYing = null

    @property({type:Label})
    labelSelf = null

    blockType: any;
    canTouch: any;
    is_di: boolean;
    v3BlockOld: Vec3;
    numDi: number;
    isXiaoChu: boolean;
    isMoving: boolean;
    numBlockName: number;

    start() {

    }

    init(num_type,num_blockName){
        if (num_type >= 17) {
            num_type = Math.floor(Math.random() * 17) 
        }
        this.blockType = num_type
        this.canTouch = true
        this.is_di = false
        this.numBlockName = num_blockName

        this.node.scale = new Vec3(1,1,1)

        let num_color = Global.numColorXC + this.blockType
        while(num_color >= gameData.arrColor.length){
            num_color = num_color - gameData.arrColor.length
        }
        this.node.getComponent(Sprite).color = gameData.arrColor[num_color]
        this.labelSelf.string = gameData.arrBlockName[num_blockName][this.blockType]
    }

    initDi(num_type,num_blockName){
        this.numBlockName = num_blockName
        this.blockType = num_type
        this.canTouch = false
        this.is_di = true
        this.isXiaoChu = false
        this.isMoving = true
        this.numDi = -1
        this.nodeYinYing.active = false

        this.node.scale = new Vec3(1,1,1)
        this.v3BlockOld = new Vec3(0,0,0)

        console.log('di:'+num_type);
        
        let num_color = Global.numColorXC + this.blockType
        while(num_color >= gameData.arrColor.length){
            num_color = num_color - gameData.arrColor.length
        }
        this.node.getComponent(Sprite).color = gameData.arrColor[num_color]
        this.labelSelf.string = gameData.arrBlockName[num_blockName][this.blockType]
    }

    setTouch(can_touch){
        this.canTouch = can_touch
        if (this.canTouch) {
            this.nodeYinYing.active = false
        }else{
            this.nodeYinYing.active = true
        }
    }

    shuaXinType(num_type,num_blockName){
        this.blockType = num_type
        this.numBlockName = num_blockName

        Tween.stopAllByTarget(this.node)
        this.node.scale = new Vec3(1,1,1)

        tween(this.node)
            .to(0.15,{scale:new Vec3(0,0,0)})
            .call(()=>{
                let num_color = Global.numColorXC + this.blockType
                while(num_color >= gameData.arrColor.length){
                    num_color = num_color - gameData.arrColor.length
                }
                this.node.getComponent(Sprite).color = gameData.arrColor[num_color]
                this.labelSelf.string = gameData.arrBlockName[this.numBlockName][this.blockType]
            })
            .to(0.15,{scale:new Vec3(1,1,1)})
            .start()
    }

    getBoundingBox_pz(){
        let num_pz = 5
        let node_UITransform_1 = this.node.getComponent(UITransform)
        let rect_1 = node_UITransform_1.getBoundingBox()
        let rect_3 = new Rect(rect_1.x + num_pz,rect_1.y + num_pz,rect_1.width-num_pz*2,rect_1.height-num_pz*2)
        return rect_3
    }

    update(deltaTime: number) {
        
    }
}

