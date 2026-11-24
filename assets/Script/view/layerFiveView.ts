import { _decorator, Component, Node, Input, EventTouch, UITransform, Vec3, Graphics, Label, Vec2, Color, tween, director } from 'cc';
import { WECHAT } from 'cc/env';
import { AdMgr } from '../ad/AdMgr';
import { blockFive } from '../block/blockFive';
import { jian } from '../block/jian';
import { gameData } from '../gameData';
import { events, Global, Sound, ui } from '../Global';
import { main } from '../main';
import { PoolMgr } from '../manager/PoolMgr';
import ResMgr from '../manager/ResMgr';
import { layerLevelView } from './layerLevelView';
import { resultView } from './resultView';
import { tipsView } from './tipsView';
const { ccclass, property } = _decorator;

@ccclass('layerFiveView')
export class layerFiveView extends Component {

    @property({type:Node})
    parentBlocks = null

    @property({type:Node})
    parentChaHao = null

    @property({type:Node})
    parentBtns = null

    @property({type:Label})
    labelTime = null
    
    numTime: number;
    arrBlocks: any;
    numColor: number;
    numDJaddTime: number;
    numDJtips: number;
    numDJanswer: number;
    numDJnext: number;
    callbackTime: any;
    isSuccess: boolean;

    start() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this)
    }

    init(num_type = 0){//0:正常 1:重玩 2:复活

        this.numDJaddTime = 0
        this.numDJtips = 0
        this.numDJanswer = 1
        this.numDJnext = 1
        this.isSuccess = false
        
        // this.numDJaddTime = Math.floor(Math.random()*2)
        // this.numDJtips = Math.floor(Math.random()*2)
        // this.numDJanswer = Math.floor(Math.random()*2)
        // this.numDJnext = Math.floor(Math.random()*2)

        
        this.numTime = gameData.arrData[Global.numLevel].gameTime

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

        this.refreshBtn()
        this.parentBtns.getChildByName('btn_next').active = false

        if (Global.canSound) {
            main.ins.playSound(Sound.wz_start)
        }

        if (num_type != 0) {
            if (num_type == 1) {
                for (let i = 0; i < this.arrBlocks.length; i++) {
                    let ts_block = this.arrBlocks[i].getComponent(blockFive)
                    ts_block.changeColor(new Color(255,255,255,255))
                    ts_block.numType = 0
                    this.getComponent(Graphics).clear()
                }
                this.numColor = Math.floor(Math.random()*gameData.arrColor.length)
                this.actBlocks()
            }
          
            this.parentBtns.getChildByName('btn_next').active = true
            return
        }

        this.numColor = Math.floor(Math.random()*gameData.arrColor.length)

        this.refreshTitle()
        this.cleanBlocks()
        this.createBlocks()
        
        this.arrBlocks = this.parentBlocks.children
        this.refreshBlocks()

        this.actBlocks()
    }

    startTime(){
        this.callbackTime = async function () {
            if (this.numTime <= 0) {
                main.ins.showLog('游戏结束！')
                this.unschedule(this.callbackTime)
                //this.init(true)
                
                const view = await ResMgr.ins.getUI(ui.resultView)
                view.getComponent(resultView).init(2)
                PoolMgr.ins.putNode(this.node)
                
            }else{
                let children = this.node.children
                for (let i = children.length - 1; i >= 0; i--) {
                    if (children[i].name == 'tipsView') {
                        return
                    }
                }

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

    actBlocks(){
        if (!this.arrBlocks) {
            return
        }
        for (let i = 0; i < this.arrBlocks.length; i++) {
            tween(this.arrBlocks[i])
                .to(0.15,{scale:new Vec3(0,0,0)})
                .to(0.15,{scale:new Vec3(1,1,1)})
                .start()
        }
    }

    refreshBlocks(){
        let arr_1 = []
        let arr_2 = []
        for (let i = 0; i < this.arrBlocks.length; i++) {
            let ts_block = this.arrBlocks[i].getComponent(blockFive)
            if (ts_block.numZuoYou == 0) {
                arr_1.push(this.arrBlocks[i])
            }else{
                arr_2.push(this.arrBlocks[i])
            }
        }

        for (let i = 0; i < arr_1.length; i++) {
            let i_random = Math.floor(Math.random()*arr_1.length)
            let v3_pos_i = arr_1[i].getPosition()
            let v3_pos_random = arr_1[i_random].getPosition()

            arr_1[i].setPosition(v3_pos_random)
            arr_1[i_random].setPosition(v3_pos_i)
        }

        for (let i = 0; i < arr_2.length; i++) {
            let i_random = Math.floor(Math.random()*arr_2.length)
            let v3_pos_i = arr_2[i].getPosition()
            let v3_pos_random = arr_2[i_random].getPosition()

            arr_2[i].setPosition(v3_pos_random)
            arr_2[i_random].setPosition(v3_pos_i)
        }
    }

    refreshTitle(){
        let label_title = this.node.getChildByName('title').getChildByName('label_title').getComponent(Label)
        label_title.string = gameData.arrData[Global.numLevel].gameTitle[1]
    }

    onTouchStart(event: EventTouch) {

        if (this.isSuccess) {
            return
        }
        if (!this.callbackTime) {
            main.ins.showLog('开始倒计时');
            
            this.startTime()
        }

        let v3_Start = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x,event.getUILocation().y,0))
    
        for (let i = this.arrBlocks.length-1; i >= 0; i--) {
            
            if (this.arrBlocks[i].getComponent(UITransform).getBoundingBox().contains(new Vec2(v3_Start.x,v3_Start.y))) {
                let ts_block = this.arrBlocks[i].getComponent(blockFive)
                if (ts_block.numType == 2) {
                    continue
                }

                if (Global.canSound) {
                    main.ins.playSound(Sound.wz_click)
                }

                let index_1 = -1
                for (let j = 0; j < this.arrBlocks.length; j++) {
                    let ts_block_1 = this.arrBlocks[j].getComponent(blockFive)
                    if (j == i) {
                        continue
                    }
                    if (ts_block_1.numType == 1) {
                        index_1 = j
                        break
                    }
                }

                if (index_1 == -1) {//之前没有点击的
                    let color = gameData.arrColor[this.numColor]
                    ts_block.changeColor(color)
                    ts_block.numType = 1
                }else{
                    let ts_block_qian = this.arrBlocks[index_1].getComponent(blockFive)
                    let num_zuoYou_qian = ts_block_qian.numZuoYou
                    if (num_zuoYou_qian == ts_block.numZuoYou) {
                        ts_block_qian.changeColor(new Color(255,255,255,255))
                        ts_block_qian.numType = 0
                        let color = gameData.arrColor[this.numColor]
                        ts_block.changeColor(color)
                        ts_block.numType = 1
                    }else{
                        main.ins.showLog('做判断');
                        let str_1 = ts_block_qian.strInfo
                        let str_2 = ts_block.strInfo

                        if (num_zuoYou_qian == 1) {//0:左 1:右
                            str_1 = ts_block.strInfo
                            str_2 = ts_block_qian.strInfo
                        }

                        let info = gameData.arrData[Global.numLevel]
                        let arrinfo = info.gameinfo
                        let is_success = false

                        for (let i = 0; i < arrinfo.length; i++) {
                            if (str_1 == arrinfo[i][0] && str_2 == arrinfo[i][1]) {
                                is_success = true
                                break
                            }
                        }

                        if (is_success) {
                            if (Global.canSound) {
                                main.ins.playSound(Sound.wz_get)
                            }
                            main.ins.showLog('配对成功！');
                            let color = gameData.arrColor[this.numColor]
                            ts_block.changeColor(color)
                            ts_block_qian.changeColor(color)
                            ts_block.numType = 2
                            ts_block_qian.numType = 2
                            this.lianXian(i,index_1,color)
                            this.numColor++
                            if (this.numColor >= gameData.arrColor.length) {
                                this.numColor = 0
                            }
                            this.pdSuccess()
                        }else{
                            if (Global.canSound) {
                                main.ins.playSound(Sound.wz_oo)
                            }
                            if (this.numTime > 5) {
                                this.btnAddTime(-5)
                            }
                            main.ins.showLog('配对失败！');
                            ts_block_qian.changeColor(new Color(255,255,255,255))
                            ts_block_qian.numType = 0
                            ts_block.changeColor(new Color(255,255,255,255))
                            ts_block.numType = 0
                        }
                        
                    }
                }

           }
        }
    }

    pdSuccess(){
        let is_success = true
        for (let i = 0; i < this.arrBlocks.length; i++) {
            let ts_block = this.arrBlocks[i].getComponent(blockFive)
            if (ts_block.numType != 2) {
                is_success = false
                break
            }
        }

        if (is_success) {
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
            main.ins.showLog('游戏通关！');
        }

    }

    onTouchEnd(event: EventTouch) {
        
        
    }

    createBlocks(){
        let info = gameData.arrData[Global.numLevel]
        let arrinfo = info.gameinfo
        
        let numH = 55
        let num_jianGeH = info.gameW[2]
        let max_hang = arrinfo.length
        for (let i = max_hang - 1; i >= 0; i--) {
            for (let j = 0; j < 2; j++) {
                let n_block = PoolMgr.ins.getNode('blockFive')
                n_block.parent = this.parentBlocks
            
                let xx = 0
                if (j == 0) {
                    xx = -360 + info.gameW[0] / 2 + info.gameW[3]
                }else{
                    xx = 360 - info.gameW[1] / 2 - info.gameW[3]
                }
                let yy = i*numH + num_jianGeH * i - (numH + num_jianGeH) * max_hang / 2 + numH / 2 + 60
                n_block.setPosition(xx,yy,0)
                let ts_block = n_block.getComponent(blockFive)
                ts_block.init(j,arrinfo[i][j],info.gameW[j])

            }
        }


    }

    cleanBlocks(){
        let children = this.parentBlocks.children
        for (let i = children.length-1; i >= 0; i--) {
            PoolMgr.ins.putNode(children[i])
        }

        this.getComponent(Graphics).clear()
    }

    refreshBtn(){
        this.parentBtns.getChildByName('btn_tips').getChildByName('sp_tv').active = !Global.allShare
        this.parentBtns.getChildByName('btn_tips').getChildByName('sp_share').active = Global.allShare

        this.parentBtns.getChildByName('btn_answer').getChildByName('Layout').getChildByName('sp_tv').active = !Global.allShare
        this.parentBtns.getChildByName('btn_answer').getChildByName('Layout').getChildByName('sp_share').active = Global.allShare
        this.parentBtns.getChildByName('btn_answer').getChildByName('Layout').getChildByName('n_null').active = false

        this.parentBtns.getChildByName('btn_addTime').getChildByName('sp_tv').active = !Global.allShare
        this.parentBtns.getChildByName('btn_addTime').getChildByName('sp_share').active = Global.allShare

        this.parentBtns.getChildByName('btn_next').getChildByName('sp_tv').active = !Global.allShare
        this.parentBtns.getChildByName('btn_next').getChildByName('sp_share').active = Global.allShare

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

            if (this.numDJnext % 2 == 0) {
                this.parentBtns.getChildByName('btn_next').getChildByName('sp_tv').active = false
                this.parentBtns.getChildByName('btn_next').getChildByName('sp_share').active = true
            }else{
                this.parentBtns.getChildByName('btn_next').getChildByName('sp_tv').active = true
                this.parentBtns.getChildByName('btn_next').getChildByName('sp_share').active = false
            }

            if (this.numDJanswer % 2 == 0) {
                this.parentBtns.getChildByName('btn_answer').getChildByName('Layout').getChildByName('sp_tv').active = false
                this.parentBtns.getChildByName('btn_answer').getChildByName('Layout').getChildByName('sp_share').active = true
                this.parentBtns.getChildByName('btn_answer').getChildByName('Layout').getChildByName('n_null').active = false
            }else{
                this.parentBtns.getChildByName('btn_answer').getChildByName('Layout').getChildByName('sp_tv').active = true
                this.parentBtns.getChildByName('btn_answer').getChildByName('Layout').getChildByName('sp_share').active = false
                this.parentBtns.getChildByName('btn_answer').getChildByName('Layout').getChildByName('n_null').active = false
            }
        }

        if (Global.LevelData.arrAnswer.includes(Global.numLevel)) {
            this.parentBtns.getChildByName('btn_answer').getChildByName('Layout').getChildByName('sp_tv').active = false
            this.parentBtns.getChildByName('btn_answer').getChildByName('Layout').getChildByName('sp_share').active = false
            this.parentBtns.getChildByName('btn_answer').getChildByName('Layout').getChildByName('n_null').active = true
        }
    }

    lianXian(i_1,i_2,color){
        let v3_1 = this.arrBlocks[i_1].getPosition()
        let v3_2 = this.arrBlocks[i_2].getPosition()

        if (v3_1.x > 0) {
            v3_1.x = v3_1.x - this.arrBlocks[i_1].getComponent(UITransform).width / 2 + 8
            v3_2.x = v3_2.x + this.arrBlocks[i_2].getComponent(UITransform).width / 2 - 8
        }else{
            v3_1.x = v3_1.x + this.arrBlocks[i_1].getComponent(UITransform).width / 2 - 8
            v3_2.x = v3_2.x - this.arrBlocks[i_2].getComponent(UITransform).width / 2 + 8
        }

        const g = this.getComponent(Graphics);
        g.lineWidth = 3;
        g.strokeColor = color

        g.moveTo(v3_1.x , v3_1.y);
        g.lineTo(v3_1.x , v3_1.y);
        g.lineTo(v3_2.x , v3_2.y );
        g.lineTo(v3_2.x , v3_2.y );

        g.close();
        g.stroke();
        g.fill();
    }

    createJian(num_num){
        let n_chaHao = PoolMgr.ins.getNode('jian')
        n_chaHao.parent = this.parentChaHao
        n_chaHao.getComponent(jian).init(num_num)
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

    async btnAddTime(num){
        this.createJian(num)
        this.numTime = this.numTime + num
        if (this.numTime <= 0) {
            main.ins.showLog('游戏结束！')
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

    btnTips(){
        let arr_num = []
        for (let i = 0; i < this.arrBlocks.length; i++) {
            let ts_block = this.arrBlocks[i].getComponent(blockFive)
            if (ts_block.numType != 2) {
                arr_num.push(i)
                arr_num.push(i+1)
                break
            }
        }

        for (let i = 0; i < arr_num.length; i++) {
            tween(this.arrBlocks[arr_num[i]])
                .to(0.2,{scale:new Vec3(0.7,0.7,0.7)})
                .to(0.2,{scale:new Vec3(1,1,1)})
                .union()
                .repeat(4)
                .start()
        }
    }

    btnAnswer(){
        let node_tips = PoolMgr.ins.getNode('tipsView')
        node_tips.parent = this.node
        node_tips.getComponent(tipsView).init(5)

        if (!Global.LevelData.arrAnswer.includes(Global.numLevel)) {
            Global.LevelData.arrAnswer.push(Global.numLevel)
            Global.saveLevelData()
        }
       
        this.refreshBtn()
    }


    btnShareOrTv(is_tv : boolean, str : string){

        AdMgr.showVideo(is_tv,(data)=>{
            if (data && data == 1) {
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
                    main.ins.showLog('@@@: '+timeNow);
                    if (timeNow - Global.timeShare < Global.numTimeShare) {
                        director.emit(events.Toast, "分享失败，请换个微信群分享！")
                        return
                    }

                    if (str == 'btn_addTime') {
                        this.btnAddTime(Global.numAddTime)
                        this.numDJaddTime++
                    }else if (str == 'btn_tips') {
                        this.btnTips()
                        this.numDJtips++
                    }else if (str == 'btn_answer') {
                        this.numDJanswer = 1
                        this.btnAnswer()
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
                    this.btnTips()
                    this.numDJtips++
                }else if (str == 'btn_answer') {
                    this.numDJanswer = 1
                    this.btnAnswer()
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
        if (str == 'btn_back') {
            const view = await ResMgr.ins.getUI(ui.layerLevelView)
            view.getComponent(layerLevelView).init()
            this.cleanBlocks()
            PoolMgr.ins.putNode(this.node)
        }else if(str == 'btn_tips'){
            let is_tv = this.parentBtns.getChildByName('btn_tips').getChildByName('sp_tv').active
            is_share = !is_tv
            this.btnShareOrTv(is_tv,'btn_tips')
        }else if(str == 'btn_addTime'){
            let is_tv = this.parentBtns.getChildByName('btn_addTime').getChildByName('sp_tv').active
            is_share = !is_tv
            this.btnShareOrTv(is_tv,'btn_addTime')
        }else if (str == 'btn_next') {
            let is_tv = this.parentBtns.getChildByName('btn_next').getChildByName('sp_tv').active
            is_share = !is_tv
            this.btnShareOrTv(is_tv,'btn_next')
        }else if (str == 'btn_answer') {
            if (Global.LevelData.arrAnswer.includes(Global.numLevel)) {
                this.btnAnswer()
            }else{
                let is_tv = this.parentBtns.getChildByName('btn_answer').getChildByName('Layout').getChildByName('sp_tv').active
                this.btnShareOrTv(is_tv,'btn_answer')
            }
            is_share = this.parentBtns.getChildByName('btn_answer').getChildByName('Layout').getChildByName('sp_share').active
        }
        if (!is_share || !WECHAT) {
            main.ins.playSound(Sound.wz_btn)
        }
    }

    update(deltaTime: number) {
        
    }
}

