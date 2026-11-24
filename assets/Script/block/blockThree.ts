import { _decorator, Component, Label, Vec3, tween, Tween, Vec2, AffineTransform } from 'cc';
import { layerThreeView } from '../view/layerThreeView';
import { Global } from '../Global';
import { gameData } from '../gameData';
const { ccclass, property } = _decorator;

@ccclass('blockThree')
export class blockThree extends Component {
    
    @property({type:Label})
    labelInfo = null

    strInfo: any;
    canHit: boolean;
    speedRandom: number;
    gameTime: any;

    start() {
        this.gameTime = 0
    }

    init(str_info){
        this.canHit = false
        this.strInfo = str_info
        this.labelInfo.string = this.strInfo
        this.speedRandom = Math.random() * (gameData.arrData[Global.numLevel].difficulty + 2) + 0.1

        Tween.stopAllByTarget(this.node)
        this.node.scale = new Vec3(0,0,0)
       
        tween(this.node)
            .to(0.6,{scale:new Vec3(1,1,1)})
            .call(()=>{
                this.canHit = true
            })
            .start()
    }

    getV2(){
        let v3_hero = layerThreeView.ins.posHero()
        let v3_self = this.node.getPosition()

        let v2_cha = new Vec2(v3_hero.x - v3_self.x, v3_hero.y - v3_self.y)
        let f_jl = Math.sqrt(v2_cha.x * v2_cha.x + v2_cha.y * v2_cha.y)

        v2_cha.x = v2_cha.x / f_jl
        v2_cha.y = v2_cha.y / f_jl

        return v2_cha
    }

    update(deltaTime: number) {
        if (!this.canHit) {
            return
        }

        if (layerThreeView.ins.gameType != 0) {
            return
        }

        this.gameTime = this.gameTime + deltaTime
            if (this.gameTime < 0.016) {
                return
            }
        this.gameTime = 0

        let v2_dir = this.getV2()
        let v3_self = this.node.getPosition()

        v3_self.x = v3_self.x + v2_dir.x * this.speedRandom
        v3_self.y = v3_self.y + v2_dir.y * this.speedRandom

        this.node.setPosition(v3_self)
    }
}


