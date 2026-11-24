import { _decorator, Component, Node, Input, EventTouch, UITransform, Vec3, Vec2, Color, Label, tween, Tween, director } from 'cc';
import { PoolMgr } from '../manager/PoolMgr';
import { gameData } from '../gameData';
import { blockTwo } from '../block/blockTwo';
import { chaHao } from '../block/chaHao';
import { Global, ui, Sound, events } from '../Global';
import { main } from '../main';
import ResMgr from '../manager/ResMgr';
import { layerLevelView } from './layerLevelView';
import { AudioMgr } from '../manager/AudioMgr';
import { jian } from '../block/jian';
import { WxPlatform } from '../ad/WxPlatform';
import { WECHAT } from 'cc/env';
import { AdMgr } from '../ad/AdMgr';
import { resultView } from './resultView';
const { ccclass, property } = _decorator;

@ccclass('layerTwoView')
export class layerTwoView extends Component {

    @property({type:Node})
    parentBlocks = null

    @property({type:Node})
    parentChaHao = null

    @property({type:Node})
    parentBtns = null

    @property({type:Label})
    labelTime = null


    numJianGe: number;
    arrBlocks: any;
    numWH: number;
    numTime: number;
    callbackTime: () => void;
    numSuccess: number;
    isSuccess: boolean;
    numDJaddTime: number;
    numDJanswer: number;
    numDifficulty: number;
    numDJnext: number;
    numDJtips: number;
    
    start() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this)
    }

    init(num_type = 0){//0:正常 1:重玩 2:复活

        this.numDJaddTime = 0
        this.numDJtips = 1
        this.numDJanswer = 0
        this.numDJnext = 1

        // this.numDJaddTime = Math.floor(Math.random()*2)
        // this.numDJtips = Math.floor(Math.random()*2)
        // this.numDJanswer = Math.floor(Math.random()*2)
        // this.numDJnext = Math.floor(Math.random()*2)


        if (num_type != 2) {
            this.numDifficulty = gameData.arrData[Global.numLevel].difficulty
        }
        
        this.numJianGe = 2
        this.numWH = 75
        this.numTime = gameData.arrData[Global.numLevel].gameTime
        this.isSuccess = false
        if (this.callbackTime) {
            this.unschedule(this.callbackTime)
            this.callbackTime = null
        }
       
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

        this.labelTime.string = '时间：' + this.numTime
        
        if (num_type != 2) {
            this.numSuccess = 0
            this.refreshShuoMing()
        }
        
        this.startTime()
        this.refreshBtn()
        this.parentBtns.getChildByName('btn_next').active = false

        if (Global.canSound) {
            main.ins.playSound(Sound.wz_start)
        }
        if (num_type != 0) {
            this.parentBtns.getChildByName('btn_next').active = true
            if (num_type == 1) {
                for (let i = 0; i < this.arrBlocks.length; i++) {
                    let ts_block = this.arrBlocks[i].getComponent(blockTwo)
                    ts_block.changeColor(new Color(255,255,255,255))
                }
                this.btnAnser()
                this.refreshBlocks()
            }
           
            return
        }

        this.refreshTitle()
        this.cleanBlocks()
        this.createBlocks(gameData.arrData[Global.numLevel].numH,gameData.arrData[Global.numLevel].numW)
        this.arrBlocks = this.parentBlocks.children
        this.refreshBlocks()
    }

    refreshBtn(){
        this.parentBtns.getChildByName('btn_tips').getChildByName('sp_tv').active = !Global.allShare
        this.parentBtns.getChildByName('btn_tips').getChildByName('sp_share').active = Global.allShare

        this.parentBtns.getChildByName('btn_addTime').getChildByName('sp_tv').active = !Global.allShare
        this.parentBtns.getChildByName('btn_addTime').getChildByName('sp_share').active = Global.allShare

        this.parentBtns.getChildByName('btn_next').getChildByName('sp_tv').active = !Global.allShare
        this.parentBtns.getChildByName('btn_next').getChildByName('sp_share').active = Global.allShare

        if (this.numDifficulty == 0 ) {
            this.parentBtns.getChildByName('btn_answer').active = false
        }else{
            this.parentBtns.getChildByName('btn_answer').active = true
            this.parentBtns.getChildByName('btn_answer').getChildByName('sp_tv').active = !Global.allShare
            this.parentBtns.getChildByName('btn_answer').getChildByName('sp_share').active = Global.allShare
        }

        if (!Global.allShare) {
            if (this.numDJaddTime % 2 == 0) {
                this.parentBtns.getChildByName('btn_addTime').getChildByName('sp_tv').active = false
                this.parentBtns.getChildByName('btn_addTime').getChildByName('sp_share').active = true
            }else{
                this.parentBtns.getChildByName('btn_addTime').getChildByName('sp_tv').active = true
                this.parentBtns.getChildByName('btn_addTime').getChildByName('sp_share').active = false
            }

            if (this.numDJtips % 2 == 0) {
                this.parentBtns.getChildByName('btn_tips').getChildByName('sp_tv').active = false
                this.parentBtns.getChildByName('btn_tips').getChildByName('sp_share').active = true
            }else{
                this.parentBtns.getChildByName('btn_tips').getChildByName('sp_tv').active = true
                this.parentBtns.getChildByName('btn_tips').getChildByName('sp_share').active = false
            }

            if (this.numDJanswer % 2 == 0) {
                this.parentBtns.getChildByName('btn_answer').getChildByName('sp_tv').active = false
                this.parentBtns.getChildByName('btn_answer').getChildByName('sp_share').active = true
            }else{
                this.parentBtns.getChildByName('btn_answer').getChildByName('sp_tv').active = true
                this.parentBtns.getChildByName('btn_answer').getChildByName('sp_share').active = false
            }

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

    refreshShuoMing(){
        let label_shuoMing = this.node.getChildByName('bg_shuoMing').getChildByName('shuoMing').getComponent(Label)
        label_shuoMing.string = '找出与'+' “'+gameData.arrData[Global.numLevel].wz+'” '+'不同的字（'+this.numSuccess+'/'+gameData.arrData[Global.numLevel].cz.length+'）'
    
        if (this.numSuccess == gameData.arrData[Global.numLevel].cz.length - 1 && this.numSuccess != 0) {
            this.numDJaddTime = 1
            this.numDJanswer = 1
            this.refreshBtn()
        }
    }

    cleanBlocks(){
        let children = this.parentBlocks.children
        for (let i = children.length-1; i >= 0; i--) {
           PoolMgr.ins.putNode(children[i])
        }
    }

    startTime(){
        this.callbackTime = async function () {
            if (this.numTime <= 0) {
                console.log('游戏结束！')
                this.unschedule(this.callbackTime)

                //this.init(true)
                const view = await ResMgr.ins.getUI(ui.resultView)
                view.getComponent(resultView).init(2)
                PoolMgr.ins.putNode(this.node)
                
            }else{

                if (Global.isTVing) {
                    return
                }

                this.numTime--
                if (this.numTime <= 5) {
                    if(Global.canSound){
                        main.ins.playSound(Sound.wz_dada)
                    }
                }
                this.labelTime.string = '时间：' + this.numTime
            }
        }
        this.schedule(this.callbackTime, 1)
    }

    onTouchStart(event: EventTouch) {
        
        if (this.isSuccess) {
            return
        }

        let v3_Start = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x,event.getUILocation().y,0))
    
        for (let i = this.arrBlocks.length-1; i >= 0; i--) {
            if (this.arrBlocks[i].getComponent(UITransform).getBoundingBox().contains(new Vec2(v3_Start.x,v3_Start.y))) {
                let ts_block = this.arrBlocks[i].getComponent(blockTwo)
                if (ts_block.colorBlock.r != 255 || ts_block.colorBlock.g != 255 ||ts_block.colorBlock.b != 255 ) {
                    continue
                }
                if (ts_block.strInfo == gameData.arrData[Global.numLevel].wz) {
                    console.log('点错了')
                    this.createChaHao(this.arrBlocks[i].getPosition())
                    if (this.numTime > 5) {
                        this.btnAddTime(-5)
                    }
                    if (Global.canSound) {
                        main.ins.playSound(Sound.wz_oo)
                    }
                }else{
                    this.numSuccess++
                    ts_block.changeColor(new Color(240,80,80,255))
                    this.refreshShuoMing()
                    ts_block.chengedifficulty(0)
                    console.log('点对了')
                    if (Global.canSound) {
                        main.ins.playSound(Sound.wz_get)
                    }
                }
            }
        }

        this.judgeSuccess()
    }

    createJian(num_num){
        let n_chaHao = PoolMgr.ins.getNode('jian')
        n_chaHao.parent = this.parentChaHao
        n_chaHao.getComponent(jian).init(num_num)
    }

    createChaHao(v3_pos){
        let n_chaHao = PoolMgr.ins.getNode('chaHao')
        n_chaHao.parent = this.parentChaHao
        n_chaHao.setPosition(v3_pos)
        n_chaHao.getComponent(chaHao).init()
    }

    //判断是否成功
    judgeSuccess(){
        if (this.numSuccess == gameData.arrData[Global.numLevel].cz.length) {
            if (this.callbackTime) {
                this.unschedule(this.callbackTime)
            }
            this.isSuccess = true
            
            this.scheduleOnce(async function(){
                const view = await ResMgr.ins.getUI(ui.resultView)
                view.getComponent(resultView).init()
                this.cleanBlocks()
                PoolMgr.ins.putNode(this.node)
            },0.7)
            main.ins.gameSuccess()
            console.log('游戏通关！');
        }
    }

    createBlocks(i_max,j_max){
        let num_difficulty = gameData.arrData[Global.numLevel].difficulty
        let num_num = -1
        for (let i = 0; i < i_max; i++) {
            for (let j = 0; j < j_max; j++) {
                num_num++
                let n_block = PoolMgr.ins.getNode('blockTwo')
                n_block.parent = this.parentBlocks
                let xx = j*this.numWH + this.numJianGe * j - (this.numWH + this.numJianGe) * j_max / 2 + this.numWH / 2
                let yy = i*this.numWH + this.numJianGe * i - (this.numWH + this.numJianGe) * i_max / 2 + this.numWH / 2
                n_block.setPosition(xx,yy,0)

                let ts_block = n_block.getComponent(blockTwo)
                if (gameData.arrData[Global.numLevel].cz[num_num]) {
                    ts_block.init(gameData.arrData[Global.numLevel].cz[num_num],num_difficulty)
                }else{
                    ts_block.init(gameData.arrData[Global.numLevel].wz,num_difficulty)
                }
            }
        }
    }

    refreshBlocks(){
        for (let i = 0; i < this.arrBlocks.length; i++) {
            let ts_block = this.arrBlocks[i].getComponent(blockTwo)
            if (ts_block.strInfo != gameData.arrData[Global.numLevel].wz) {
                let num_random = Math.floor(Math.random()*this.arrBlocks.length)

                let pos_1 = this.arrBlocks[i].getPosition()
                let pos_2 = this.arrBlocks[num_random].getPosition()

                this.arrBlocks[i].setPosition(pos_2)
                this.arrBlocks[num_random].setPosition(pos_1)
            }

            tween(this.arrBlocks[i])
                .to(0.15,{scale:new Vec3(0,0,0)})
                .to(0.15,{scale:new Vec3(1,1,1)})
                .start()
        }
    }

    async btnAddTime(num){
        this.createJian(num)
        this.numTime = this.numTime + num
        if (this.numTime <= 0) {
            console.log('游戏结束！')
            this.unschedule(this.callbackTime)

            // this.init(true)
            const view = await ResMgr.ins.getUI(ui.resultView)
            view.getComponent(resultView).init(2)
            PoolMgr.ins.putNode(this.node)
            return
        }
        this.labelTime.string = '时间：' + this.numTime
        if (this.callbackTime) {
            this.unschedule(this.callbackTime)
        }
        this.startTime()
    }

    btnNext(){
        if (this.callbackTime) {
            this.unschedule(this.callbackTime)
        }
        this.isSuccess = true
        this.cleanBlocks()
        PoolMgr.ins.putNode(this.node)
        main.ins.gameSuccess(true)
        main.ins.initGame()
    }

    btnTips(){
        for (let i = 0; i < this.arrBlocks.length; i++) {
            let ts_block = this.arrBlocks[i].getComponent(blockTwo)
            if (ts_block.strInfo != gameData.arrData[Global.numLevel].wz && ts_block.colorBlock.r == 255 && ts_block.colorBlock.g == 255 && ts_block.colorBlock.b == 255) {
                Tween.stopAllByTarget(this.arrBlocks[i])
                tween(this.arrBlocks[i])
                    .to(0.2,{scale:new Vec3(0.6,0.6,0.6)})
                    .to(0.2,{scale:new Vec3(1,1,1)})
                    .union()
                    .repeat(4)
                    .start()
                break
            }
        }
    }

    btnAnser(){
        for (let i = 0; i < this.arrBlocks.length; i++) {
            let ts_block = this.arrBlocks[i].getComponent(blockTwo)
            if (ts_block.colorBlock.r == 255 && ts_block.colorBlock.g == 255 && ts_block.colorBlock.b == 255) {
                ts_block.chengedifficulty(this.numDifficulty)
            }
        }
    }

    btnShareOrTv(is_tv : boolean, str : string){


        AdMgr.showVideo(is_tv,(data)=>{
            if (data && data == 1) {//没有视频的时候
                if (str == 'btn_addTime') {
                    this.numDJaddTime = 0
                }else if (str == 'btn_tips') {
                    this.numDJtips = 0
                }else if (str == 'btn_answer') {
                    this.numDJanswer = 0
                }else if (str == 'btn_next'){
                    this.numDJnext = 0
                }
                this.refreshBtn()
            }else if (data && data == 2) {
                this.scheduleOnce(function(){

                    let timeNow = Date.now()
                    if (timeNow - Global.timeShare < Global.numTimeShare) {
                        director.emit(events.Toast, "分享失败，请换个微信群分享！")
                        return
                    }

                    if (str == 'btn_addTime') {
                        this.btnAddTime(Global.numAddTime)
                        this.numDJaddTime++
                    }else if (str == 'btn_tips') {
                        this.numDJtips = 1
                        this.btnTips()
                    }else if (str == 'btn_answer') {
                        this.numDifficulty--
                        this.numDJanswer++
                        this.btnAnser()
                    }else if (str == 'btn_next') {
                        this.numDJnext = 1
                        this.btnNext()
                    }
                    this.refreshBtn()
                },0.5)
                
            }else{
                if (str == 'btn_addTime') {
                    this.btnAddTime(Global.numAddTime)
                    this.numDJaddTime++
                }else if (str == 'btn_tips') {
                    this.numDJtips = 1
                    this.btnTips()
                }else if (str == 'btn_answer') {
                    this.numDifficulty--
                    this.numDJanswer++
                    this.btnAnser()
                }else if (str == 'btn_next') {
                    this.numDJnext = 1
                    this.btnNext()
                }
                this.refreshBtn()
            }
            
        })

    }

    async callBackBtn(event:Event,str:string){
        if (this.isSuccess) {
            return
        }
        let is_share = false
        if(str == 'btn_addTime'){
            let is_tv = this.parentBtns.getChildByName('btn_addTime').getChildByName('sp_tv').active
            is_share = !is_tv
            this.btnShareOrTv(is_tv,'btn_addTime')
        }else if(str == 'btn_tips'){
            let is_tv = this.parentBtns.getChildByName('btn_tips').getChildByName('sp_tv').active
            is_share = !is_tv
            this.btnShareOrTv(is_tv,'btn_tips')
        }else if(str == 'btn_next'){
            let is_tv = this.parentBtns.getChildByName('btn_next').getChildByName('sp_tv').active
            is_share = !is_tv
            this.btnShareOrTv(is_tv,'btn_next')
        }else if (str == 'btn_back') {
            const view = await ResMgr.ins.getUI(ui.layerLevelView)
            view.getComponent(layerLevelView).init()
            this.cleanBlocks()
            PoolMgr.ins.putNode(this.node)
        }else if (str == 'btn_answer') {
            let is_tv = this.parentBtns.getChildByName('btn_answer').getChildByName('sp_tv').active
            is_share = this.parentBtns.getChildByName('btn_answer').getChildByName('sp_share').active
            this.btnShareOrTv(is_tv,'btn_answer')
        }
        if (!is_share || !WECHAT) {
            main.ins.playSound(Sound.wz_btn)
        }
    }

    update(deltaTime: number) {
        
    }
}


