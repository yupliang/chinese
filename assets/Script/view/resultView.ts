import { _decorator, Component, Node, tween, Vec3, director, Label } from 'cc';
import { Global, ui, Sound, events } from '../Global';
import { PoolMgr } from '../manager/PoolMgr';
import { main } from '../main';
import ResMgr from '../manager/ResMgr';
import { layerLevelView } from './layerLevelView';
import { AudioMgr } from '../manager/AudioMgr';
import { WxPlatform } from '../ad/WxPlatform';
import { AdMgr } from '../ad/AdMgr';
import { itemMuYu } from '../itemMuYu';
import { save } from '../Tools';
import { WECHAT } from 'cc/env';
import { layerSixView } from './layerSixView';
const { ccclass, property } = _decorator;

@ccclass('resultView')
export class resultView extends Component {

    @property({type:Node})
    btnShare = null

    @property({type:Node})
    parentBtns = null

    numDJfh: number;
    isDleg: boolean;

    start() {
        this.schedule(function(){
            let n_muYu = PoolMgr.ins.getNode('itemMuYu')
            n_muYu.parent = this.node
            let v3_pos = this.btnShare.getPosition()
            v3_pos.y = v3_pos.y + 55
            n_muYu.getComponent(itemMuYu).init(v3_pos)
            Global.ZongGongDe = Global.ZongGongDe + Global.numGongDe
            this.node.getChildByName('Label').getComponent(Label).string = '总功德：' + Global.ZongGongDe
        },0.8)

        tween(this.btnShare)
            .to(0.4,{scale:new Vec3(1.1,1.1,1.1)})
            .to(0.4,{scale:new Vec3(1,1,1)})
            .union()
            .repeatForever()
            .start()

        console.log('resultView:start');
        
    }

    init(num_result = 1,is_dlgd = false){
        this.isDleg = is_dlgd
        AdMgr.showCustomAd4()

        AdMgr.closeCustomAd(1)
        AdMgr.closeCustomAd(3)
        
        this.numDJfh = 1
        //this.numDJfh = Math.floor(Math.random()*2) + 1

        this.refreshBtn()

        AdMgr.showInterstial()
        AdMgr.showBanner()
        Global.ZongGongDe = Global.ZongGongDe + Math.floor(Math.random() * 100) + 100
        this.node.getChildByName('Label').getComponent(Label).string = '总功德：' + Global.ZongGongDe

        let title_success = this.node.getChildByName('title')
        let title_faile = this.node.getChildByName('title_2')
        let btn_home = this.parentBtns.getChildByName('btn_home')
        let btn_next = this.parentBtns.getChildByName('btn_next')
        let btn_replay = this.parentBtns.getChildByName('btn_replay')
        let btn_fh = this.parentBtns.getChildByName('btn_fh')

        if (num_result == 1) {
            title_success.active = true
            btn_home.active = true
            btn_next.active = true

            title_faile.active = false
            btn_replay.active = false
            btn_fh.active = false
        }else{
            title_success.active = false
            btn_home.active = false
            btn_next.active = false

            title_faile.active = true
            btn_replay.active = true
            btn_fh.active = true

            let v3_pos = btn_fh.getPosition()

            if (Math.random() > 0.85) {
                btn_fh.setPosition(-220,v3_pos.y,0)
                btn_replay.setPosition(220,v3_pos.y,0)
            }else{
                btn_fh.setPosition(220,v3_pos.y,0)
                btn_replay.setPosition(-220,v3_pos.y,0)
            }
        }
    }

    refreshBtn(){
        this.parentBtns.getChildByName('btn_fh').getChildByName('sp_tv').active = !Global.allShare
        this.parentBtns.getChildByName('btn_fh').getChildByName('sp_share').active = Global.allShare

        if (!Global.allShare) {
            if (this.numDJfh % 2 == 0) {
                this.parentBtns.getChildByName('btn_fh').getChildByName('sp_tv').active = false
                this.parentBtns.getChildByName('btn_fh').getChildByName('sp_share').active = true
            }else{
                this.parentBtns.getChildByName('btn_fh').getChildByName('sp_tv').active = true
                this.parentBtns.getChildByName('btn_fh').getChildByName('sp_share').active = false
            }
        }

       
    }

    async btnFH(){
        AdMgr.closeCustomAd(4)
        PoolMgr.ins.putNode(this.node)
        if (this.isDleg) {
            const view = await ResMgr.ins.getUI(ui.layerSixView);
            view.getComponent(layerSixView).init(2,true);
            return
        }
        main.ins.initGame(2)
    }

    btnShareOrTv(is_tv : boolean, str : string){

        AdMgr.showVideo(is_tv,(data)=>{
            if (data && data == 1) {
                if (str == 'btn_fh'){
                    AdMgr.closeCustomAd(4)
                    this.numDJfh = 0
                }
                this.refreshBtn()
            }else if (data && data == 2) {
                this.scheduleOnce(function(){

                    let timeNow = Date.now()
                    console.log('@@@: '+timeNow);
                    if (timeNow - Global.timeShare < Global.numTimeShare) {
                        AdMgr.closeCustomAd(4)
                        director.emit(events.Toast, "分享失败，请换个微信群分享！")
                        return
                    }

                   if (str == 'btn_fh') {
                        this.numDJfh = 1
                        this.btnFH()
                    }

                    this.refreshBtn()
                },0.5)
                
            }else{
                if (str == 'btn_fh') {
                    this.numDJfh = 1
                    this.btnFH()
                }

                this.refreshBtn()
            }
            
        })

    }

    async callBackBtn(event:Event,str:string){
        let is_share = false
        if (str == 'btn_next') {
            save('ZongGongDe',Global.ZongGongDe)
            PoolMgr.ins.putNode(this.node)
            main.ins.initGame()
            AdMgr.closeCustomAd(4)
        }else if(str == 'btn_home'){
            const view = await ResMgr.ins.getUI(ui.layerLevelView)
            view.getComponent(layerLevelView).init()
            save('ZongGongDe',Global.ZongGongDe)
            PoolMgr.ins.putNode(this.node)
            AdMgr.closeCustomAd(4)
        }else if (str == 'btn_share') {
            is_share = true
            let call =()=>{
                this.scheduleOnce(function(){
                    let timeNow = Date.now()
                    if (timeNow - Global.timeShare < Global.numTimeShare) {
                        director.emit(events.Toast, "加功德失败，请换个微信群分享！")
                        AdMgr.closeCustomAd(4)
                        return
                    }
                    Global.numGongDe++
                    save('numGongDe',Global.numGongDe)
                },0.8)
            }
            WxPlatform.ins.showShare(call)
        }else if(str == 'btn_replay'){
            if (this.isDleg) {
                const view = await ResMgr.ins.getUI(ui.layerSixView);
                view.getComponent(layerSixView).init(0,true);
                PoolMgr.ins.putNode(this.node)
                return
            }
            PoolMgr.ins.putNode(this.node)
            main.ins.initGame(1)
            AdMgr.closeCustomAd(4)
        }else if(str == 'btn_fh'){
            let is_tv = this.parentBtns.getChildByName('btn_fh').getChildByName('sp_tv').active
            is_share = !is_tv
            this.btnShareOrTv(is_tv,'btn_fh')
        }
        if (!is_share || !WECHAT) {
            main.ins.playSound(Sound.wz_btn)
        }
    }

    update(deltaTime: number) {
        
    }
}


