import { _decorator, Component, Node, Input, EventTouch, UITransform, Vec3, Vec2, Label, director } from 'cc';
import { blockFour } from '../block/blockFour';
import { Global, Sound, ui, events } from '../Global';
import { AudioMgr } from '../manager/AudioMgr';
import { gameData } from '../gameData';
import { PoolMgr } from '../manager/PoolMgr';
import { blockFourGet } from '../block/blockFourGet';
import ResMgr from '../manager/ResMgr';
import { main } from '../main';
import { jian } from '../block/jian';
import { layerLevelView } from './layerLevelView';
import { tipsView } from './tipsView';
import { AdMgr } from '../ad/AdMgr';
import { resultView } from './resultView';
import { WECHAT } from 'cc/env';
const { ccclass, property } = _decorator;

@ccclass('layerFourView')
export class layerFourView extends Component {
    
    @property({type:Node})
    parentBlocks = null

    @property({type:Node})
    parentBlocksGet = null

    @property({type:Node})
    parentAddTime = null

    @property({type:Node})
    parentBtns = null

    @property({type:Label})
    labelTime = null
    
    arrBlocks: any;
    numWH: number;
    numJianGeH: number;
    numJianGeL: number;
    isSuccess: boolean;
    callbackTime: () => void;
    numTime: number;
    canTouch: boolean;
    numDJaddTime: number;
    numDJtips: number;
    numDJanswer: number;
    numDJnext: number;
    
    start() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this)
    }

    init(num_type = 0){
        this.numDJaddTime = 0
        this.numDJtips = 0
        this.numDJanswer = 1
        this.numDJnext = 1

        // this.numDJaddTime = Math.floor(Math.random()*2)
        // this.numDJtips = Math.floor(Math.random()*2)
        // this.numDJanswer = Math.floor(Math.random()*2)
        // this.numDJnext = Math.floor(Math.random()*2)

        this.numWH = 70
        this.numJianGeH = 6
        this.numJianGeL = 35
        this.isSuccess = false
        this.numTime = gameData.arrData[Global.numLevel].gameTime
        this.labelTime.string = '时间：' + this.numTime

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

        if (Global.canSound) {
            main.ins.playSound(Sound.wz_start)
        }
        this.parentBtns.getChildByName('btn_next').active = false
        this.refreshBtn()
        this.btnReset()
        if (num_type != 0) {
            this.parentBtns.getChildByName('btn_next').active = true
            if (num_type == 1) {
                let children = this.parentBlocksGet.children
                for (let i = 0; i < children.length; i++) {
                    children[i].getComponent(blockFourGet).init()
                }
            }
            
            return
        }

        this.refreshTitle()
        this.cleanBlocksGet()
        this.createBlocksGet(gameData.arrData[Global.numLevel].gameHL[0],gameData.arrData[Global.numLevel].gameHL[1])
        this.cleanBlocks()
        this.createBlock()

        this.arrBlocks = this.parentBlocks.children[0].children
        for (let i = 0; i < this.arrBlocks.length; i++) {
            let ts_block = this.arrBlocks[i].getComponent(blockFour)
            ts_block.init()
        }
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

    createBlock(){
        let n_block = PoolMgr.ins.getNode(gameData.arrData[Global.numLevel].gameTitle[2])
        n_block.parent = this.parentBlocks
    }

    cleanBlocks(){
        let children = this.parentBlocks.children
        for (let i = children.length - 1; i >= 0; i--) {
            PoolMgr.ins.putNode(children[i])
        }
    }

    cleanBlocksGet(){
        let children = this.parentBlocksGet.children
        for (let i = children.length - 1; i >= 0; i--) {
            PoolMgr.ins.putNode(children[i])
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

        if (!this.canTouch) {
            return
        }

        if (!this.callbackTime) {
            main.ins.showLog('开始倒计时');
            this.startTime()
        }
        
        let v3_Start = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x,event.getUILocation().y,0))
    
        for (let i = this.arrBlocks.length-1; i >= 0; i--) {
            if (this.arrBlocks[i].getComponent(UITransform).getBoundingBox().contains(new Vec2(v3_Start.x,v3_Start.y))) {
                let ts_block = this.arrBlocks[i].getComponent(blockFour)
                ts_block.changeOpacity()
                if (Global.canSound) {
                    main.ins.playSound(Sound.wz_click)
                }
                break
            }
        }
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

    createBlocksGet(i_max,j_max){
        let num_num = 0
        for (let i = i_max - 1; i >= 0; i--) {
            for (let j = 0; j < j_max; j++) {
                num_num++
                let n_block = PoolMgr.ins.getNode('blockFourGet')
                n_block.parent = this.parentBlocksGet
                let xx = j*this.numWH + this.numJianGeH * j - (this.numWH + this.numJianGeH) * j_max / 2 + this.numWH / 2
                let yy = i*this.numWH + this.numJianGeL * i - (this.numWH + this.numJianGeL) * i_max / 2 + this.numWH / 2
                n_block.setPosition(xx,yy,0)

                let ts_block = n_block.getComponent(blockFourGet)
                ts_block.init()

                if (num_num >= gameData.arrData[Global.numLevel].gameNum) {
                    return
                }
            }
        }
    }

    pdGetZi(str_str){
        this.canTouch = false
        this.scheduleOnce(function(){
            this.btnReset()
        },0.6)

        if (str_str == '') {
            if (Global.canSound) {
                main.ins.playSound(Sound.wz_oo)
            }
            this.showTx(0)
            main.ins.showLog('不是个字');
            return
        }
        let children = this.parentBlocksGet.children
        for (let i = 0; i < children.length; i++) {
            let ts_blockGet = children[i].getComponent(blockFourGet)
            if (ts_blockGet.strZi == str_str) {
                if (Global.canSound) {
                    main.ins.playSound(Sound.wz_oo)
                }

                let n_chaHao = PoolMgr.ins.getNode('jian')
                n_chaHao.parent = this.parentAddTime
                n_chaHao.getComponent(jian).init('答案已重复！',2)
                this.showTx(0)
                main.ins.showLog('已经找到这个字了')
                return
            }
        }

        for (let i = 0; i < children.length; i++) {
            let ts_blockGet = children[i].getComponent(blockFourGet)
            if (ts_blockGet.strZi == '') {
                ts_blockGet.setZi(str_str)
                let arr_Yin = gameData.arrData[Global.numLevel].gameYin
                for (let j = 0; j < arr_Yin.length; j++) {
                    if (arr_Yin[j][0].toString() == str_str) {
                        ts_blockGet.setYin(arr_Yin[j][1])
                        if (Global.canSound) {
                            main.ins.playSound(Sound.wz_get)
                        }
                        this.showTx(1)
                        break
                    }
                }
                break
            }
        }

        this.pdSuccess()
    }

    showTx(num_num){
        let tx_dui = this.node.getChildByName('parentTX').getChildByName('dui')
        let tx_cuo = this.node.getChildByName('parentTX').getChildByName('cuo')
        tx_dui.active = false
        tx_cuo.active = false
        if (num_num == 0) {
            tx_cuo.active = true
        }else if (num_num == 1) {
            tx_dui.active = true
        }
    }

    pdSuccess(){
        let is_success = true
        let children = this.parentBlocksGet.children
        for (let i = 0; i < children.length; i++) {
            let ts_blockGet = children[i].getComponent(blockFourGet)
            if (ts_blockGet.strZi == '') {
                is_success = false
            }
        }

        //成功
        if (is_success) {
            if (this.callbackTime) {
                this.unschedule(this.callbackTime)
            }
            this.isSuccess = true
            this.scheduleOnce(async function(){
                const view = await ResMgr.ins.getUI(ui.resultView)
                view.getComponent(resultView).init()
                this.cleanBlocks()
                this.cleanBlocksGet()
                PoolMgr.ins.putNode(this.node)
            },0.7)
            main.ins.gameSuccess()
            main.ins.showLog('游戏通关！');
        }
    }

    btnSubmit(){
        let str_zi = ''
        let arr_255 = []
        for (let i = 0; i < this.arrBlocks.length; i++) {
            let ts_block = this.arrBlocks[i].getComponent(blockFour)
            if (ts_block.numOpacity == 255) {
                arr_255.push(i)
            }
        }

        let arr_info = gameData.arrData[Global.numLevel].gameinfo
        for (let i = 0; i < arr_info.length; i++) {
            if (arr_255.toString() == arr_info[i][0].toString()) {
                str_zi = arr_info[i][1].toString()
                console.log('找到了：'+ str_zi);
                break
            }
        }

        console.log('找字数组：')
        
        this.pdGetZi(str_zi)
        //yī
    }

    btnReset(){
        this.showTx(-1)
        this.canTouch = true
        if (!this.arrBlocks) {
            return
        }
        for (let i = 0; i < this.arrBlocks.length; i++) {
            let ts_block = this.arrBlocks[i].getComponent(blockFour)
            ts_block.setOpacity(0)
        }
    }

    btnAddTime(){
        this.createJian(Global.numAddTime)
        this.numTime = this.numTime + Global.numAddTime
        this.labelTime.string = '时间：' + this.numTime
        if (this.callbackTime) {
            this.unschedule(this.callbackTime)
        }
        this.startTime()
    }

    btnTips(){
        this.btnReset()
        let arr_zi = []
        let str_tips = ''
        let arr_blocks = null

        let children = this.parentBlocksGet.children
        for (let i = 0; i < children.length; i++) {
            let ts_blockGet = children[i].getComponent(blockFourGet)
            if (ts_blockGet.strZi != '') {
                arr_zi.push(ts_blockGet.strZi)
            }
        }

        let arr_yin = gameData.arrData[Global.numLevel].gameYin
        for (let i = 0; i < arr_yin.length; i++) {
            if (arr_zi.indexOf(arr_yin[i][0]) == -1) {//不包含
                str_tips = arr_yin[i][0]
                break
            }
        }

        let arr_info = gameData.arrData[Global.numLevel].gameinfo
        for (let i = 0; i < arr_info.length; i++) {
            if (arr_info[i][1].toString() == str_tips) {//不包含
                arr_blocks = arr_info[i][0]
                break
            }
        }

        for (let i = 0; i < arr_blocks.length; i++) {
            let ts_block = this.arrBlocks[arr_blocks[i]].getComponent(blockFour)
            ts_block.setOpacity(135)
        }

        
    }

    btnAnswer(){
        let node_tips = PoolMgr.ins.getNode('tipsView')
        node_tips.parent = this.node
        node_tips.getComponent(tipsView).init(4)
        
        if (!Global.LevelData.arrAnswer.includes(Global.numLevel)) {
            Global.LevelData.arrAnswer.push(Global.numLevel)
            Global.saveLevelData()
        }
        
        this.refreshBtn()
    }

    btnNext(){
        if (this.callbackTime) {
            this.unschedule(this.callbackTime)
        }
        this.isSuccess = true
        this.cleanBlocks()
        this.cleanBlocksGet()
        PoolMgr.ins.putNode(this.node)
        main.ins.gameSuccess(true)

        main.ins.initGame()
    }

    createJian(num_num){
        let n_chaHao = PoolMgr.ins.getNode('jian')
        n_chaHao.parent = this.parentAddTime
        n_chaHao.getComponent(jian).init(num_num)
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
            }else if(data && data == 2){
                this.scheduleOnce(function(){
                    let timeNow = Date.now()
                    console.log('@@@: '+timeNow);
                    if (timeNow - Global.timeShare < Global.numTimeShare) {
                        director.emit(events.Toast, "分享失败，请换个微信群分享！")
                        return
                    }

                    if (str == 'btn_addTime') {
                        this.btnAddTime()
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
                    this.btnAddTime()
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
        if (str == 'btn_submit') {
            this.btnSubmit()
        }else if (str == 'btn_reset') {
            this.btnReset()
        }else if (str == 'btn_back') {
            const view = await ResMgr.ins.getUI(ui.layerLevelView)
            view.getComponent(layerLevelView).init()
            this.cleanBlocks()
            this.cleanBlocksGet()
            PoolMgr.ins.putNode(this.node)
        }else if (str == 'btn_addTime') {
            let is_tv = this.parentBtns.getChildByName('btn_addTime').getChildByName('sp_tv').active
            is_share = !is_tv
            this.btnShareOrTv(is_tv,'btn_addTime')
        }else if (str == 'btn_tips') {
            let is_tv = this.parentBtns.getChildByName('btn_tips').getChildByName('sp_tv').active
            is_share = !is_tv
            this.btnShareOrTv(is_tv,'btn_tips')
        }else if (str == 'btn_answer') {
            if (Global.LevelData.arrAnswer.includes(Global.numLevel)) {
                this.btnAnswer()
            }else{
                let is_tv = this.parentBtns.getChildByName('btn_answer').getChildByName('Layout').getChildByName('sp_tv').active
                this.btnShareOrTv(is_tv,'btn_answer')
            }
            is_share = this.parentBtns.getChildByName('btn_answer').getChildByName('Layout').getChildByName('sp_share').active
        }else if (str == 'btn_next') {
            let is_tv = this.parentBtns.getChildByName('btn_next').getChildByName('sp_tv').active
            is_share = !is_tv
            this.btnShareOrTv(is_tv,'btn_next')
        }
        if (!is_share || !WECHAT) {
            main.ins.playSound(Sound.wz_btn)
        }
    }

    update(deltaTime: number) {
        
    }
}


