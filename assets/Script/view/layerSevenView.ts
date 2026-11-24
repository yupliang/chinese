import { _decorator, Component, Node, input, Input, EventTouch, Label, UITransform, Vec3, Vec2, director } from 'cc';
import { WECHAT } from 'cc/env';
import { AdMgr } from '../ad/AdMgr';
import { blockSeven } from '../block/blockSeven';
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

@ccclass('layerSevenView')
export class layerSevenView extends Component {

    @property({type:Node})
    parentBlocks = null

    @property({type:Node})
    parentBtns = null

    @property({type:Label})
    labelAnswer = null

    @property({type:Label})
    labelTime = null

    @property({type:Node})
    parentChaHao = null
    
    arrBlocks: any;
    isTVAnswer: boolean;
    isTVaddtime: boolean;
    isTVNext: boolean;
    callbackTime: any;
    numTime: number;
    isEdit: boolean;
   

    start() {
        this.isEdit = false
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);

        this.parentBtns.getChildByName('btn_log').active = this.isEdit
    }

    init(num_type = 0){//0:正常 1:重玩 2:复活

        this.labelAnswer.string = ''

        this.isTVAnswer = !Global.allShare
        this.isTVaddtime = !Global.allShare
        this.isTVNext = !Global.allShare

        this.numTime = gameData.arrData[Global.numLevel].gameTime

        this.labelTime.string = '时间：' + this.numTime

        if (this.callbackTime) {
            this.unschedule(this.callbackTime)
            this.callbackTime = null
        }

        if (Global.canSound) {
            main.ins.playSound(Sound.wz_start)
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

        if (num_type != 0) {
            this.parentBtns.getChildByName('btn_next').active = true
        }else{
            this.parentBtns.getChildByName('btn_next').active = false
        }

        this.refreshTitle()
        this.cleanBlocks()
        this.createBlocks()

        this.arrBlocks = this.parentBlocks.children

        this.refreshBtn()
    }

    onTouchStart(event: EventTouch) {
        
        if (!this.callbackTime) {
            main.ins.showLog('开始倒计时');
            
            this.startTime()
        }

        let v3_Start = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x,event.getUILocation().y,0))
    
        for (let i = this.arrBlocks.length-1; i >= 0; i--) {
            
            if (this.arrBlocks[i].getComponent(UITransform).getBoundingBox().contains(new Vec2(v3_Start.x,v3_Start.y))) {
                this.arrBlocks[i].scale = new Vec3(0,0,0)
                let ts_block = this.arrBlocks[i].getComponent(blockSeven)
                this.labelAnswer.string = this.labelAnswer.string + ts_block.strInfo

                if (Global.canSound) {
                    main.ins.playSound(Sound.wz_click)
                }

                let can_pdSuccess = true
                for (let j = 0; j < this.arrBlocks.length; j++) {
                    if (this.arrBlocks[j].scale.x != 0) {
                        can_pdSuccess = false
                        break
                    }
                }
                if (can_pdSuccess) {
                    this.pdSuccess()
                }
            }
        }
    }

    onTouchMove(event: EventTouch) {
        if (!this.isEdit) {
            return
        }

        let v3_Start = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x,event.getUILocation().y,0))
    
        for (let i = this.arrBlocks.length-1; i >= 0; i--) {
            
            if (this.arrBlocks[i].getComponent(UITransform).getBoundingBox().contains(new Vec2(v3_Start.x,v3_Start.y))) {
                let v2_delta = event.getUIDelta()
                let v3_pos = this.arrBlocks[i].getPosition()
                this.arrBlocks[i].setPosition(v3_pos.x+v2_delta.x,v3_pos.y+v2_delta.y,0)
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


    pdSuccess(){
        let arr_answer = gameData.arrData[Global.numLevel].gameTips

        for (let i = 0; i < arr_answer.length; i++) {
            if (this.labelAnswer.string == arr_answer[i]) {
                if (Global.canSound) {
                    main.ins.playSound(Sound.wz_win)
                }
                if (this.callbackTime) {
                    this.unschedule(this.callbackTime)
                }
                this.scheduleOnce(async function(){
                    const view = await ResMgr.ins.getUI(ui.resultView)
                    view.getComponent(resultView).init()
                    this.cleanBlocks()
                    PoolMgr.ins.putNode(this.node)
                },0.7)
                main.ins.gameSuccess()
                main.ins.showLog('游戏通关！');
                this.showTx(1)
            }else{
                this.scheduleOnce(function(){
                    this.btnReset()
                },0.5)

                if (Global.canSound) {
                    main.ins.playSound(Sound.wz_oo)
                }
                this.showTx(0)
                console.log('游戏失败');
            }
        }
    }

    createBlocks(){
        let info = gameData.arrData[Global.numLevel]
        let arrinfo = info.gameinfo
        
        for (let i = 0; i < arrinfo.length; i++) {
            let n_block = PoolMgr.ins.getNode('blockSeven')
            n_block.parent = this.parentBlocks
            n_block.getComponent(blockSeven).init(arrinfo[i][0])
            n_block.scale = new Vec3(1,1,1)
            if (arrinfo[i][1] && arrinfo[i][2]) {
                n_block.setPosition(Number(arrinfo[i][1]),Number(arrinfo[i][2]),0)
            }
        }
    }

    refreshTitle(){
        let label_title = this.node.getChildByName('title').getChildByName('label_title').getComponent(Label)
        label_title.string = gameData.arrData[Global.numLevel].gameTitle[1]
    }

    refreshBtn(){

        this.parentBtns.getChildByName('btn_addTime').getChildByName('sp_tv').active = this.isTVaddtime
        this.parentBtns.getChildByName('btn_addTime').getChildByName('sp_share').active = !this.isTVaddtime

        this.parentBtns.getChildByName('btn_next').getChildByName('sp_tv').active = this.isTVNext
        this.parentBtns.getChildByName('btn_next').getChildByName('sp_share').active = !this.isTVNext

        this.parentBtns.getChildByName('btn_answer').getChildByName('Layout').getChildByName('sp_tv').active = this.isTVAnswer
        this.parentBtns.getChildByName('btn_answer').getChildByName('Layout').getChildByName('sp_share').active = !this.isTVAnswer
        this.parentBtns.getChildByName('btn_answer').getChildByName('Layout').getChildByName('n_null').active = false

        if (Global.LevelData.arrAnswer.includes(Global.numLevel)) {
            this.parentBtns.getChildByName('btn_answer').getChildByName('Layout').getChildByName('sp_tv').active = false
            this.parentBtns.getChildByName('btn_answer').getChildByName('Layout').getChildByName('sp_share').active = false
            this.parentBtns.getChildByName('btn_answer').getChildByName('Layout').getChildByName('n_null').active = true
        }
    }

    cleanBlocks(){
        let children = this.parentBlocks.children
        for (let i = children.length-1; i >= 0; i--) {
            PoolMgr.ins.putNode(children[i])
        }
        this.showTx(-1)
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

    btnLog(){
        let str_log = ''
        for (let i = 0; i < this.arrBlocks.length; i++) {
            let v3_pos = this.arrBlocks[i].getPosition()
            let xx = Math.floor(v3_pos.x)
            let yy = Math.floor(v3_pos.y)
            let ts_block = this.arrBlocks[i].getComponent(blockSeven)
            let str_1 = '["' + ts_block.strInfo + '",' + xx + ',' + yy + ']'
            str_log = str_log + str_1 + ','
        }
        console.log(str_log);
    }

    btnReset(){
        this.showTx(-1)
        this.labelAnswer.string = ''
        for (let i = 0; i < this.arrBlocks.length; i++) {
            this.arrBlocks[i].scale = new Vec3(1,1,1)
        }
    }

    createJian(num_num){
        let n_chaHao = PoolMgr.ins.getNode('jian')
        n_chaHao.parent = this.parentChaHao
        n_chaHao.getComponent(jian).init(num_num)
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

    btnNext(){
        if (this.callbackTime) {
            this.unschedule(this.callbackTime)
        }
        this.cleanBlocks()
        PoolMgr.ins.putNode(this.node)
        main.ins.gameSuccess(true)

        main.ins.initGame()
    }

    btnAnswer(){
        let node_tips = PoolMgr.ins.getNode('tipsView')
        node_tips.parent = this.node
        node_tips.getComponent(tipsView).init(7)

        if (!Global.LevelData.arrAnswer.includes(Global.numLevel)) {
            Global.LevelData.arrAnswer.push(Global.numLevel)
            Global.saveLevelData()
        }
       
        this.refreshBtn()
    }

    btnShareOrTv(is_tv : boolean, str : string){

        AdMgr.showVideo(is_tv,(data)=>{
            if (data && data == 1) {
                if (str == 'btn_answer') {
                    this.isTVAnswer = false
                }else if (str == 'btn_addTime'){
                    this.isTVaddtime = false
                }else if (str == 'btn_next') {
                    this.isTVNext = false
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

                    if (str == 'btn_answer') {
                        this.isTVAnswer = true
                        this.btnAnswer()
                    }else if (str == 'btn_addTime'){
                        this.isTVaddtime = true
                        this.btnAddTime(Global.numAddTime)
                    }else if (str == 'btn_next') {
                        this.isTVNext = true
                        this.btnNext()
                    }

                    this.refreshBtn()
                },0.5)
                
            }else{
                if (str == 'btn_answer') {
                    this.isTVAnswer = true
                    this.btnAnswer()
                }else if (str == 'btn_addTime'){
                    this.isTVaddtime = true
                    this.btnAddTime(Global.numAddTime)
                }else if (str == 'btn_next') {
                    this.isTVNext = true
                    this.btnNext()
                }

                this.refreshBtn()
            }
            
        })

    }

    async callBackBtn(event:Event,str:string){
        let is_share = false
        if (str == 'btn_back') {
            this.cleanBlocks()
            const view = await ResMgr.ins.getUI(ui.layerLevelView)
            view.getComponent(layerLevelView).init()
            PoolMgr.ins.putNode(this.node)
        }else if (str == 'btn_log') {
            this.btnLog()
        }else if (str == 'btn_reSet') {
            this.btnReset()
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

