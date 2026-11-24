import { _decorator, Component, Node, Label, UITransform, Sprite, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('blockFive')
export class blockFive extends Component {

    @property({type:Label})
    labInfo = null
    
    strInfo: any;
    numZuoYou: any;
    numType: number;

    start() {

    }

    init(num_zuoYou,str_info,num_w){
        this.numType = 0 //(0:未点击，1:点击了未确认，2:成功)
        this.numZuoYou = num_zuoYou //（0:左边，1:右边）
        this.strInfo = str_info

        this.labInfo.string = str_info
        this.node.getComponent(UITransform).width = num_w

        this.node.getComponent(Sprite).color = new Color(255,255,255,255)
    }

    changeColor(color){
        this.node.getComponent(Sprite).color = color
    }

    update(deltaTime: number) {
        
    }
}

