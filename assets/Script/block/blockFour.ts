import { _decorator, Component, Node, Sprite, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('blockFour')
export class blockFour extends Component {

    numOpacity: number;

    start() {

    }

    init(){
        this.setOpacity(0)
    }

    setOpacity(num_num){
        this.numOpacity = num_num

        if (this.node.getComponent(Sprite)) {
            this.node.getComponent(Sprite).color = new Color(255,255,255,this.numOpacity)
        }else{
            let children = this.node.children
            for (let i = 0; i < children.length; i++) {
                if (children[i].getComponent(Sprite)) {
                    children[i].getComponent(Sprite).color = new Color(255,255,255,this.numOpacity)
                }
            }
        }

    }

    changeOpacity(){
        if (this.numOpacity < 255) {
            this.numOpacity = 255
        }else{
            this.numOpacity = 0
        }

        if (this.node.getComponent(Sprite)) {
            this.node.getComponent(Sprite).color = new Color(255,255,255,this.numOpacity)
        }else{
            let children = this.node.children
            for (let i = 0; i < children.length; i++) {
                if (children[i].getComponent(Sprite)) {
                    children[i].getComponent(Sprite).color = new Color(255,255,255,this.numOpacity)
                }
            }
        }
    }

    update(deltaTime: number) {
        
    }
}


