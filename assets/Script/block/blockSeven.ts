import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('blockSeven')
export class blockSeven extends Component {


    strInfo: string;

    start() {

    }

    init(str_info){
        this.strInfo = str_info
        this.node.getComponent(Label).string = str_info
    }

    update(deltaTime: number) {
        
    }
}

