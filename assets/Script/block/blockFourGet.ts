import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('blockFourGet')
export class blockFourGet extends Component {

    @property({type:Label})
    labelZi = null

    @property({type:Label})
    labelYin = null

    strZi: string;
    strYin: string;

    start() {

    }

    init(){
        this.strZi = ''
        this.strYin = ''
        this.labelZi.string = ''
        this.labelYin.string = ''
    }

    setZi(str_str){
        this.strZi = str_str
        this.labelZi.string = str_str
    }

    setYin(str_str){
        this.strYin = str_str
        this.labelYin.string = str_str
    }

    update(deltaTime: number) {
        
    }
}


