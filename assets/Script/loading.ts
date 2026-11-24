import { _decorator, Component, Node, director, Sprite, Vec3, sys} from 'cc';
import ResMgr from './manager/ResMgr';
import { AssetType, Global } from './Global';
import { main } from './main';
const { ccclass, property } = _decorator;

@ccclass('loading')
export class loading extends Component {

    @property({type:Sprite})
    spFill = null

    canLoad: boolean;

    async start() {
        //sys.localStorage.removeItem('LevelData')
        this.canLoad = true
        await this.loadRes()
        
    }

    /* load game res */
    async loadRes() {
        await ResMgr.ins.loadBundle(1, 0.2);
        await ResMgr.ins.loadRes(1, AssetType.Prefab, 0.6)
        await ResMgr.ins.loadRes(1, AssetType.Json, 0.2)
    }

    update(deltaTime: number) {
        
        if(!this.canLoad) return
        
        this.spFill.fillRange = Global.LoadingRate;
        
        if (Global.LoadingRate >= 1) {
            this.canLoad = false
            director.loadScene("main")
        }
    }


}

