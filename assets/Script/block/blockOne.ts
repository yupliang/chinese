import { _decorator, Component, Node, Label, EditBox, Sprite, color, Color, Vec2, Vec3, tween } from 'cc';
import { PoolMgr } from '../manager/PoolMgr';
import { blockOne_tx } from './blockOne_tx';
const { ccclass, property } = _decorator;

@ccclass('blockOne')
export class blockOne extends Component {

    @property({type:Node})
    nEditBox = null

    @property({type:Label})
    labInfo = null

    strInfo: any;
    colorBlock: Color;
    numTips: any;
    isDir: boolean;
    numTogether: number;

    start() {

    }

    init(str_info,num_tips){
        this.numTogether = -1
        this.isDir = false
        this.numTips = num_tips
        this.strInfo = str_info
        this.nEditBox.active = false
        this.labInfo.string = this.strInfo
        this.colorBlock = new Color(255,255,255,255)
        this.node.getChildByName('bg').getComponent(Sprite).color = this.colorBlock
        this.node.scale = new Vec3(1,1,1)
        if (str_info == '') {
            this.node.scale = new Vec3(0,0,0)
            this.node.getChildByName('bg').getComponent(Sprite).color = new Color(2,2,2,255)
        }
    }

    initEdit(str_info){
        this.numTogether = -1
        this.isDir = false
        this.strInfo = str_info
        this.nEditBox.active = true
        this.labInfo.string = this.strInfo
        this.colorBlock = new Color(255,255,255,255)
        this.node.getChildByName('bg').getComponent(Sprite).color = this.colorBlock
        this.nEditBox.getComponent(EditBox).string = str_info
        this.node.scale = new Vec3(1,1,1)
    }

    changeColor(color,is_act = false){
        let color_qian = this.colorBlock
        this.colorBlock = color
        this.node.getChildByName('bg').getComponent(Sprite).color = this.colorBlock

        let children = this.node.getChildByName('parent_tx').children
        for (let i = children.length - 1; i >= 0; i--) {
            PoolMgr.ins.putNode(children[i])
        }

        if (is_act) {
            let tx_one = PoolMgr.ins.getNode('blockOne_tx')
            tx_one.parent = this.node.getChildByName('parent_tx')
            tx_one.getComponent(blockOne_tx).init(color_qian)
        }
    }

    save(){
        let str_edit = this.nEditBox.getComponent(EditBox).string
        if (str_edit != null) {
            this.strInfo = str_edit
            this.labInfo.string = this.strInfo
        }
    }

    //显示或隐藏editBox
    showOrHide(){
        this.nEditBox.active = !this.nEditBox.active
        if (this.nEditBox.active && this.nEditBox.getComponent(EditBox).string == '') {
            if (this.strInfo && this.strInfo != '') {
                this.nEditBox.getComponent(EditBox).string = this.strInfo
            }
        }
    }

    update(deltaTime: number) {
        
    }
}


