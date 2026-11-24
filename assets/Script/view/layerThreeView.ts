import { _decorator, Component, Node, input, Input, EventTouch, UITransform, Label, tween, Vec3, Tween, director } from 'cc';
import { PoolMgr } from '../manager/PoolMgr';
import { gameData } from '../gameData';
import { blockThree } from '../block/blockThree';
import { Global, ui, Sound, events } from '../Global';
import { main } from '../main';
import ResMgr from '../manager/ResMgr';
import { layerLevelView } from './layerLevelView';
import { AudioMgr } from '../manager/AudioMgr';
import { AdMgr } from '../ad/AdMgr';
import { resultView } from './resultView';
import { WECHAT } from 'cc/env';
const { ccclass, property } = _decorator;

@ccclass('layerThreeView')
export class layerThreeView extends Component {

    @property({type:Node})
    parentBlocks = null

    @property({type:Node})
    parentQiang = null

    @property({type:Node})
    parentBtns = null

    @property({type:Node})
    nHero = null

    @property({type:Label})
    labelTime = null

    static ins : layerThreeView = null;
    numJianGe: number;
    numWH: number;
    numTime: number;
    callbackTime: () => void;
    arrXX: number[];
    arrYY: number[];
    gameType: number;
    gameTime: any;
    addTime: number;
    numDJnext: number;

    start() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this)
    }

    init(is_reStart = false){
        if (!layerThreeView.ins) {
            console.log('初始化：layerThreeView');
            
            layerThreeView.ins = this
        }
        this.numDJnext = 1

        //this.numDJnext = Math.floor(Math.random()*2)

        this.gameType = -1//(-1：准备，0：游戏中，1：成功，2：失败)
        this.numJianGe = 1
        this.numWH = 40
        this.numTime = 0
        this.gameTime = 0
        this.addTime = 0

        if (this.callbackTime) {
            this.unschedule(this.callbackTime)
            this.callbackTime = null
        }
        this.labelTime.string = '时间：' + this.numTime

        AdMgr.showBanner()

        if (Global.canShow) {
           
        }else{
            this.schedule(function() {
                // 这里的 this 指向 component
                AdMgr.closeCustomAd(1)
                AdMgr.closeCustomAd(3)
                AdMgr.closeCustomAd(4)
            }, 0.5, 20, 0.1);//将在 0.1 秒后开始计时，每 0.5 秒执行一次回调，执行 20 + 1 次
        }

        Tween.stopAllByTarget(this.nHero)
        this.nHero.scale = new Vec3(1,1,1)
        this.nHero.setPosition(0,0,0)
        this.cleanBlocks()
        this.createBlocks()

        this.refreshBtn()
        this.parentBtns.getChildByName('btn_next').active = false

        if (Global.canSound) {
            main.ins.playSound(Sound.wz_start)
        }
        if (is_reStart) {
            this.parentBtns.getChildByName('btn_next').active = true
            if (Math.random() > 0.7) {
                AdMgr.showInterstial()
            }
            return
        }

        this.refreshTitle()
        this.arrXX = [999,-999]
        this.arrYY = [999,-999]
        this.createQiang(20,17)
    }

    refreshBtn(){
        this.parentBtns.getChildByName('btn_next').getChildByName('sp_tv').active = !Global.allShare
        this.parentBtns.getChildByName('btn_next').getChildByName('sp_share').active = Global.allShare

        if (!Global.allShare) {
            if (this.numDJnext % 2 == 0) {
                this.parentBtns.getChildByName('btn_next').getChildByName('sp_tv').active = false
                this.parentBtns.getChildByName('btn_next').getChildByName('sp_share').active = true
            }else{
                this.parentBtns.getChildByName('btn_next').getChildByName('sp_tv').active = true
                this.parentBtns.getChildByName('btn_next').getChildByName('sp_share').active = false
            }
        }
        
    }

    refreshTitle(){
        let label_title = this.node.getChildByName('title').getChildByName('label_title').getComponent(Label)
        label_title.string = gameData.arrData[Global.numLevel].gameTitle[1]
    }

    posHero(){
        return this.nHero.getPosition()
    }

    cleanBlocks(){
        let children = this.parentBlocks.children
        for (let i = children.length - 1; i >= 0; i--) {
            PoolMgr.ins.putNode(children[i])
        }
    }

    createBlocks(){
        let info = gameData.arrData[Global.numLevel]
        let arrinfo = info.gameinfo
        for (let i = 0; i < arrinfo.length; i++) {
            let n_block = PoolMgr.ins.getNode('blockThree')
            n_block.parent = this.parentBlocks
            let xx = Number(arrinfo[i][0])
            let yy = Number(arrinfo[i][1])
            n_block.setPosition(xx,yy,0)
            let ts_block = n_block.getComponent(blockThree)
            ts_block.init(arrinfo[i][2])
        }
    }

    addBlock(){
        let ii_info = Math.floor(Math.random() * gameData.arrData[Global.numLevel].arrEnemy.length) 
        let n_block = PoolMgr.ins.getNode('blockThree')
        n_block.parent = this.parentBlocks
        let xx = this.arrXX[0] - 40 + Math.random() * (this.arrXX[1] - this.arrXX[0] + 80)
        let yy = this.arrYY[0] - 40 + Math.random() * (this.arrYY[1] - this.arrYY[0] + 80)
        if (Math.sqrt(xx*xx + yy*yy) < 100) {
            xx = this.arrXX[0] - 40 + Math.random() * (this.arrXX[1] - this.arrXX[0] + 80)
            yy = this.arrYY[0] - 40 + Math.random() * (this.arrYY[1] - this.arrYY[0] + 80)
            if (Math.sqrt(xx*xx + yy*yy) < 100) {
                xx = this.arrXX[0] - 40 + Math.random() * (this.arrXX[1] - this.arrXX[0] + 80)
                yy = this.arrYY[0] - 40 + Math.random() * (this.arrYY[1] - this.arrYY[0] + 80)
            }
        }
        n_block.setPosition(xx,yy,0)
        let ts_block = n_block.getComponent(blockThree)
        ts_block.init(gameData.arrData[Global.numLevel].arrEnemy[ii_info])
    }

    startTime(){
        this.callbackTime = function () {
            {
                this.numTime++
                this.labelTime.string = '时间：' + this.numTime
            }
        }
        this.schedule(this.callbackTime, 1)
    }

    onTouchStart(event: EventTouch) {
        
        if (this.gameType == -1) {
            this.startTime()
            this.gameType = 0
        }
    }

    onTouchMove(event: EventTouch) {
        if (this.gameType != 0) {
            return
        }
        let v2_xy = event.getUIDelta()
        let v3_hero = this.nHero.getPosition()

        v3_hero.x = v3_hero.x + v2_xy.x * 1.5
        v3_hero.y = v3_hero.y + v2_xy.y * 1.5

        if (v3_hero.x < this.arrXX[0]) {
            v3_hero.x = this.arrXX[0]
        }else if (v3_hero.x > this.arrXX[1]) {
            v3_hero.x = this.arrXX[1]
        }
        if (v3_hero.y < this.arrYY[0]) {
            v3_hero.y = this.arrYY[0]
        }else if (v3_hero.y > this.arrYY[1]) {
            v3_hero.y = this.arrYY[1]
        }

        this.nHero.setPosition(v3_hero)
    }

    createQiang(i_max,j_max){
        for (let i = 0; i < i_max; i++) {
            for (let j = 0; j < j_max; j++) {
                if (i == 0 || j == 0 || i == i_max-1 || j == j_max-1) {
                    let n_block = PoolMgr.ins.getNode('blockQiang')
                    n_block.parent = this.parentQiang
                    let xx = j*this.numWH + this.numJianGe * j - (this.numWH + this.numJianGe) * j_max / 2 + this.numWH / 2
                    let yy = i*this.numWH + this.numJianGe * i - (this.numWH + this.numJianGe) * i_max / 2 + this.numWH / 2
                    n_block.setPosition(xx,yy,0)

                    if (this.arrXX[0] > xx) {
                        this.arrXX[0] = xx
                    }
                    if (this.arrXX[1] < xx) {
                        this.arrXX[1] = xx
                    }
                    if (this.arrYY[0] > yy) {
                        this.arrYY[0] = yy
                    }
                    if (this.arrYY[1] < yy) {
                        this.arrYY[1] = yy
                    }
                }
            }
        }

        this.arrXX[0] = this.arrXX[0] + this.numWH / 2 + 15
        this.arrYY[0] = this.arrYY[0] + this.numWH / 2 + 15
        this.arrXX[1] = this.arrXX[1] - this.numWH / 2 - 15
        this.arrYY[1] = this.arrYY[1] - this.numWH / 2 - 15
    }

    btnNext(){
        if (this.callbackTime) {
            this.unschedule(this.callbackTime)
        }
        this.cleanBlocks()
        PoolMgr.ins.putNode(this.node)
        main.ins.gameSuccess(true)
        main.ins.initGame()
    }

    btnShareOrTv(is_tv : boolean, str : string){

        AdMgr.showVideo(is_tv,(data)=>{
            if (data && data == 1) {
                if (str == 'btn_next'){
                    this.numDJnext = 0
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

                    if (str == 'btn_next') {
                        this.numDJnext = 1
                        this.btnNext()
                    }

                    this.refreshBtn()
                },0.5)
                
            }else{
                if (str == 'btn_next') {
                    this.numDJnext = 1
                    this.btnNext()
                }

                this.refreshBtn()
            }
            
        })

    }

    async callBackBtn(event:Event,str:string){
        let is_share = false
        if(str == 'btn_next'){
            let is_tv = this.parentBtns.getChildByName('btn_next').getChildByName('sp_tv').active
            is_share = !is_tv
            this.btnShareOrTv(is_tv,'btn_next')
        }else if (str == 'btn_back') {
            const view = await ResMgr.ins.getUI(ui.layerLevelView)
            view.getComponent(layerLevelView).init()
            this.cleanBlocks()
            PoolMgr.ins.putNode(this.node)
        }
        if (!is_share || !WECHAT) {
            main.ins.playSound(Sound.wz_btn)
        }
    }

    judgeFail(){
        let rect_1 = this.nHero.getComponent(UITransform).getBoundingBox()
        let children = this.parentBlocks.children
        for (let i = 0; i < children.length; i++) {
            let ts_block = children[i].getComponent(blockThree)
            if(!ts_block.canHit)return
            let node_UITransform_1 = children[i].getComponent(UITransform)
            let rect_2 = node_UITransform_1.getBoundingBox()
            if (rect_1.intersects(rect_2)) {
                if (this.callbackTime) {
                    this.unschedule(this.callbackTime)
                }
                if (this.numTime >= gameData.arrData[Global.numLevel].gameTime) {
                    this.gameType = 2
                    
                    this.scheduleOnce(async function(){
                        const view = await ResMgr.ins.getUI(ui.resultView)
                        view.getComponent(resultView).init()
                        this.cleanBlocks()
                        PoolMgr.ins.putNode(this.node)
                    },0.7)

                    main.ins.gameSuccess()
                    console.log('游戏成功')
                }else{
                    this.gameType = 1
                    if (Global.canSound) {
                        main.ins.playSound(Sound.wz_oo)
                    }
                    console.log('游戏失败')
                }

                tween(this.nHero)
                    .delay(0.2)
                    .to(0.8,{scale:new Vec3(6,0,0)})
                    .call(()=>{
                        if (this.gameType == 1) {
                            this.init(true)
                        }
                    })
                    .start()
            }
        }
    }

    update(deltaTime: number) {
        if (this.gameType != 0) {
            return
        }
        this.judgeFail()
        
        this.gameTime = this.gameTime + deltaTime
            if (this.gameTime < 0.016) {
                return
            }
        this.gameTime = 0

        this.addTime++

        if (this.addTime > 30) {
            this.addTime = 0
            if (Math.random() > 0.25) {
                this.addBlock()
            }
        }

       
    }
}


