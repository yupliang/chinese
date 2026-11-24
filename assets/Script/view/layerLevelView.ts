import { _decorator, Component, Label, Node, Sprite, Button, director, Input, EventTouch, sys } from 'cc';
import ResMgr from '../manager/ResMgr';
import { ui, Global, Key, Sound, events } from '../Global';
import { PoolMgr } from '../manager/PoolMgr';
import { gameData } from '../gameData';
import { blockLevel } from '../block/blockLevel';
import { main } from '../main';
import { AudioMgr } from '../manager/AudioMgr';
import { WECHAT } from 'cc/env';
import { WxPlatform } from '../ad/WxPlatform';
import { AdMgr } from '../ad/AdMgr';
import { lockAllView } from './lockAllView';
import { load, remove } from '../Tools';
const { ccclass, property } = _decorator;

@ccclass('layerLevelView')
export class layerLevelView extends Component {

    @property({type:Node})
    parentLevels = null

    @property({type:Node})
    parentUnlock = null

    @property({type:Node})
    parentBtns = null

    @property({type:Label})
    labelPage = null

    @property({type:Node})
    btnUp = null

    @property({type:Node})
    btnDown = null

    numPage: number;
    numPageZong: number;
    clickLevel: any;
    XXStart: number;
    XXEnd: number;
    numDJlockCurr: number;
    
    start() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this)
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this)
    }

    init(){
        this.numDJlockCurr = 1
        //this.numDJlockCurr = Math.floor(Math.random()*2)

        let num_lenge = gameData.arrData.length
        this.numPage = Math.floor(Global.numLevel / 8) + 1
        this.numPageZong = Math.floor((num_lenge - 1) / 8) + 1
        this.pdLockAll()
        this.hideLock()
        this.cleanBlocks()
        this.createBlocks()
        this.refreshPage()
        this.refreshBtn()

        if (Math.random() > 0.6 && Global.canShow) {
            AdMgr.showInterstial()
        }

        if (!Global.canShow) {
            this.schedule(function() {
                // 这里的 this 指向 component
                AdMgr.closeCustomAd(4)
            }, 0.5, 20, 0.1);//将在 0.1 秒后开始计时，每 0.5 秒执行一次回调，执行 20 + 1 次
        }

        AdMgr.showBanner()
        AdMgr.showCustomAd('1_1')
        AdMgr.showCustomAd('1_2')
        AdMgr.showCustomAd('3_1')
    }

    pdLockAll(){

        if (!Global.canShow) {
            this.parentBtns.getChildByName('btn_lockAll').active = false
            return
        }

        let num_lockAll = Number(load(Key.TimeLockAll))
        if (num_lockAll) {
            let myDate = new Date()
            let num_miao = Math.floor(Number(myDate.getTime()) / 1000)//
            let num_miao_cha = num_miao - num_lockAll
            
            //console.log('相差秒：' + num_miao_cha);
            
            if (num_miao >= num_lockAll && num_miao - num_lockAll < 86400) {//在24小时内
                //console.log('在24小时内');
                Global.is24 = true
            }else{
                Global.is24 = false
                //console.log('不在24小时内_1');
                remove(Key.TimeLockAll)
            }
        }else{
            Global.is24 = false
            //console.log('不在24小时内_2');
        }

        this.parentBtns.getChildByName('btn_lockAll').active = !Global.is24
    }

    onTouchStart(event: EventTouch) {
        
        this.XXStart = event.getUILocation().x
    }

    onTouchEnd(event: EventTouch) {
        this.XXEnd = event.getUILocation().x

        if (this.XXStart - this.XXEnd > 15) {
            this.numPage++
            this.nextPage()
        }else if (this.XXEnd - this.XXStart > 15) {
            this.numPage--
            this.nextPage()
        }
    }

    nextPage(){
        if (this.numPage <= 1) {
            this.numPage = 1
        }
        if (this.numPage >= this.numPageZong) {
            this.numPage = this.numPageZong
        }
        this.refreshPage()
        this.cleanBlocks()
        this.createBlocks()
    }

    refreshBtn(){

        this.parentUnlock.getChildByName('btn_lock_all').active = Global.canShow

        if (Global.allShare) {
            this.parentUnlock.getChildByName('btn_lock_all').active = false
        }

        this.parentUnlock.getChildByName('btn_lock_tv').active = !Global.allShare
        this.parentUnlock.getChildByName('btn_lock_share').active = Global.allShare

        if (!Global.allShare) {
            if (this.numDJlockCurr % 2 == 0) {
                this.parentUnlock.getChildByName('btn_lock_tv').active = false
                this.parentUnlock.getChildByName('btn_lock_share').active = true
            }else{
                this.parentUnlock.getChildByName('btn_lock_tv').active = true
                this.parentUnlock.getChildByName('btn_lock_share').active = false
            }
        }
    }

    showLock(click_level){
        this.clickLevel = click_level
        this.parentUnlock.active = true
    }

    hideLock(){
        this.parentUnlock.active = false
    }

    refreshPage(){
        
        this.labelPage.string = this.numPage + '/' + this.numPageZong

        this.btnDown.getComponent(Sprite).grayscale = false
        this.btnDown.getComponent(Button).interactable = true
        this.btnUp.getComponent(Sprite).grayscale = false
        this.btnUp.getComponent(Button).interactable = true

        if (this.numPage == this.numPageZong) {
            this.btnDown.getComponent(Sprite).grayscale = true
            this.btnDown.getComponent(Button).interactable = false
        }

        if (this.numPage == 1) {
            this.btnUp.getComponent(Sprite).grayscale = true
            this.btnUp.getComponent(Button).interactable = false
        }
    }

    createBlocks(){

        //load(Key.arrLevel)


        let num_start = (this.numPage - 1) * 8
        let numW = 86
        let numH = 334
        let num_jianGeW = 40
        let num_jianGeH = 20
        let max_lie = 4
        let max_hang = 2
        for (let i = max_hang - 1; i >= 0; i--) {
            for (let j = 0; j < max_lie; j++) {
                let n_block = PoolMgr.ins.getNode('blockLevel')
                n_block.parent = this.parentLevels
                let xx = j*numW + num_jianGeW * j - (numW + num_jianGeW) * max_lie / 2 + numW / 2 + num_jianGeW / 2
                let yy = i*numH + num_jianGeH * i - (numH + num_jianGeH) * max_hang / 2 + numH / 2 + 140
                n_block.setPosition(xx,yy,0)

                let can_show = false
                if (Global.LevelData.arrData.includes(num_start)) {
                    can_show = true
                }

                let ts_block = n_block.getComponent(blockLevel)
                ts_block.init(num_start,can_show,this.node)

                //console.log('num_start:' + num_start);
                
                num_start++
                if(num_start >= gameData.arrData.length){
                    return
                }
            }
        }
    }

    cleanBlocks(){
        let children = this.parentLevels.children
        for (let i = children.length; i >= 0; i--) {
            PoolMgr.ins.putNode(children[i])
        }
    }

    btnLock(){
        Global.numLevel = this.clickLevel
        main.ins.initGame()
        if (!Global.LevelData.arrData.includes(Global.numLevel)) {
            Global.LevelData.arrData.push(Global.numLevel)
            Global.saveLevelData()
        }
        PoolMgr.ins.putNode(this.node)
    }

    btnShareOrTv(is_tv : boolean, str : string){

        AdMgr.showVideo(is_tv,(data)=>{
            if (data && data == 1) {
                if (str == 'btn_lock') {
                    this.numDJlockCurr = 0
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

                    if (str == 'btn_lock') {
                        this.numDJlockCurr = 1
                        this.btnLock()
                    }

                    this.refreshBtn()
                },0.5)
                
            }else{
                if (str == 'btn_lock') {
                    this.numDJlockCurr = 1
                    this.btnLock()
                }

                this.refreshBtn()
            }
            
        })

    }

    async callBackBtn(event:Event,str:string){
        let is_share = false
        if (str == 'btn_back') {
            ResMgr.ins.getUI(ui.layerHomeView)
            PoolMgr.ins.putNode(this.node)
        }else if (str == 'btn_up') {
            this.numPage--
            this.nextPage()
            console.log('btn_up');
            
        }else if (str == 'btn_down') {
            this.numPage++
            this.nextPage()
            console.log('btn_down');
        }else if(str == 'btn_lock_share' || str == 'btn_lock_tv'){

            let is_tv = this.parentUnlock.getChildByName('btn_lock_tv').active
            is_share = !is_tv
            this.btnShareOrTv(is_tv,'btn_lock')

        }else if(str == 'btn_close_lock'){
            this.numDJlockCurr = 1
            this.refreshBtn()
            this.hideLock()
        }else if (str == 'btn_lockAll' || str == 'btn_lock_all') {
            let n_lockAll = PoolMgr.ins.getNode('lockAllView')
            n_lockAll.parent = this.node
            n_lockAll.getComponent(lockAllView).init()
        }else if (str == 'btn_more') {
            AdMgr.closeCustomAd(1)
            AdMgr.closeCustomAd(3)
            AdMgr.showCustomAd4()
            ResMgr.ins.getUI(ui.layerMoreView)
            PoolMgr.ins.putNode(this.node)
        }
        if (!is_share || !WECHAT) {
            main.ins.playSound(Sound.wz_btn)
        }
    }

    update(deltaTime: number) {
        
    }
}


