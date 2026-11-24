import { _decorator, Component, Label, Sprite, Color, Tween, tween} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('blockTwo')
export class blockTwo extends Component {

    @property({type:Label})
    labInfo = null

    strInfo: any;
    colorBlock: any;
    numDifficulty: number;

    start() {

    }

    init(str_info,num_difficulty = 0){
        this.strInfo = str_info
        this.labInfo.string = this.strInfo
        this.colorBlock = new Color(255,255,255,255)
        this.node.getChildByName('bg').getComponent(Sprite).color = this.colorBlock
        this.numDifficulty = num_difficulty
        this.chengedifficulty(num_difficulty)
    }

    chengedifficulty(num_num){
        Tween.stopAllByTarget(this.labInfo.node)
        this.labInfo.node.angle = 0
        
        if (num_num == 1) {
            this.labInfo.node.angle = Math.random() * 360
        }else if (num_num > 1){
            let num_360 = 360
            if (Math.random() > 0.5) {
                num_360 = -360
            }
            tween(this.labInfo.node)
                .by(Math.random() * 2 + 1,{angle:num_360})
                .repeatForever()
                .start()
        }
    }

    changeColor(color){
        this.colorBlock = color
        this.node.getChildByName('bg').getComponent(Sprite).color = this.colorBlock
    }

    update(deltaTime: number) {
        
    }
}


