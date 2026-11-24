import { _decorator, Component, Node, Label, director } from 'cc';
import { PoolMgr } from '../manager/PoolMgr';
import { Global, Sound, Key, events } from '../Global';
import { AudioMgr } from '../manager/AudioMgr';
import { WECHAT } from 'cc/env';
import { AdMgr } from '../ad/AdMgr';
import { save } from '../Tools';
import { layerLevelView } from './layerLevelView';
import { main } from '../main';
const { ccclass, property } = _decorator;

@ccclass('lockAllView')
export class lockAllView extends Component {

    @property({type:Label})
    labLockNum = null

    @property({type:Node})
    NLockAll = null
    numLockAll: number;

    start() {

    }

    init(){
        this.numLockAll = 1
        this.refreshBtn()
        this.refreshInfo()
    }

    refreshInfo(){
        this.labLockNum.string = '解锁全部关卡（' + Global.numLockTV + '/' + '3）'
    }

    refreshBtn(){
        this.NLockAll.getChildByName('sp_tv').active = !Global.allShare
        this.NLockAll.getChildByName('sp_share').active = Global.allShare

        if (!Global.allShare) {
            if (this.numLockAll % 2 == 0) {
                this.NLockAll.getChildByName('sp_tv').active = false
                this.NLockAll.getChildByName('sp_share').active = true
            }else{
                this.NLockAll.getChildByName('sp_tv').active = true
                this.NLockAll.getChildByName('sp_share').active = false
            }
        }
    }


    btnShareOrTv(is_tv : boolean, str : string){

        AdMgr.showVideo(is_tv,(data)=>{
            if (data && data == 1) {
                if (str == 'btn_unlock_all'){
                    this.numLockAll = 0
                }
                this.refreshBtn()
            }else if (data && data == 2) {
                this.scheduleOnce(function(){

                    let timeNow = Date.now()
                    console.log('@@@: '+timeNow);
                    if (timeNow - Global.timeShare < Global.numTimeShare) {
                        director.emit(events.Toast, "分享失败，请换个微信群分享！")
                        return
                    }

                    if (str == 'btn_unlock_all') {
                        this.numLockAll = 1
                        this.btnLockAll()
                    }

                    this.refreshBtn()
                },0.5)
                
            }else{
                if (str == 'btn_unlock_all') {
                    this.numLockAll = 1
                    this.btnLockAll()
                }

                this.refreshBtn()
            }
            
        })

    }


    btnLockAll(){
        Global.numLockTV++
        this.refreshInfo()
        if (Global.numLockTV >= 3) {
            let myDate = new Date()
            // console.log(myDate.getTime());
            // console.log('//////////');
            // console.log(Number(myDate.getTime()));
            
            let num_miao = Math.floor(Number(myDate.getTime()) / 1000)//
            console.log('num_miao:' + num_miao);
            
            save(Key.TimeLockAll,num_miao)
            if (this.node.parent.name == 'layerLevelView') {
                let ts_level = this.node.parent.getComponent(layerLevelView)
                ts_level.init()
            }
            PoolMgr.ins.putNode(this.node)
            console.log('看完3次广告了');
        }
    }

    callBackBtn(event:Event,str:string){
        if (Global.canSound) {
            main.ins.playSound(Sound.wz_btn)
        }

        if (str == 'btn_close_lock') {
            PoolMgr.ins.putNode(this.node)
        }else if (str == 'btn_unlock_all') {
            let is_tv = this.NLockAll.getChildByName('sp_tv').active
            this.btnShareOrTv(is_tv,'btn_unlock_all')
        }
        else if (str == 'btn_unlock_all_2') {
            AdMgr.showVideo(true,(data)=>{
                if (data && data == 1) {
                    this.scheduleOnce(function(){

                        let timeNow = Date.now()
                        if (timeNow - Global.timeShare < Global.numTimeShare) {
                            director.emit(events.Toast, "分享失败，请换个微信群分享！")
                            return
                        }
                        
                        this.btnLockAll()
                    },0.5)
                }else{
                    this.btnLockAll()
                }
                
            })

        }
    }

    update(deltaTime: number) {
        
    }
}


