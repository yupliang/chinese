import { _decorator, Component, Node, Input, EventTouch, UITransform, Vec3, Vec2, Color, Label, tween, director } from 'cc';
import { PoolMgr } from '../manager/PoolMgr';
import { blockOne } from '../block/blockOne';
import { gameData } from '../gameData';
import { Global, ui, Sound, events } from '../Global';
import ResMgr from '../manager/ResMgr';
import { layerLevelView } from './layerLevelView';
import { tipsView } from './tipsView';
import { jian } from '../block/jian';
import { AdMgr } from '../ad/AdMgr';
import { resultView } from './resultView';
import { main } from '../main';
import { WECHAT } from 'cc/env';
const { ccclass, property } = _decorator;

@ccclass('layerOneView')
export class layerOneView extends Component {

    @property({type:Node})
    parentBlocks = null

    @property({type:Node})
    parentBtns = null

    @property({type:Node})
    parentChaHao = null

    @property({type:Label})
    labelTime = null


    numJianGe: number;
    arrBlocks: any;
    numColor: number;
    arrBlocksIndex: any[];
    numWH: number;
    numTime: number;
    callbackTime: () => void;
    isSuccess: boolean;
    numTogether: number;
    numDJaddTime: number;
    numDJtips: number;
    numDJnext: number;
    numDJanswer: number;

    start() {
        //this.init()
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchStart, this)
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this)
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this)
    }

    init(num_type = 0){//0:正常 1:重玩 2:复活

        this.numDJaddTime = 0
        this.numDJtips = 0
        this.numDJanswer = 1
        this.numDJnext = 1

        // this.numDJaddTime = Math.floor(Math.random()*2)
        // this.numDJtips = Math.floor(Math.random()*2)
        // this.numDJanswer = Math.floor(Math.random()*2)
        // this.numDJnext = Math.floor(Math.random()*2)

        this.numTogether = 0
        this.numJianGe = 6
        this.numWH = 75
        this.numTime = gameData.arrData[Global.numLevel].gameTime
        this.isSuccess = false
        
        this.arrBlocksIndex = []
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

        if (gameData.arrData[Global.numLevel].difficulty >= 1 && num_type != 2) {
            this.btnRefresh()
        }

        this.refreshBtn()
        this.parentBtns.getChildByName('btn_next').active = false

        if (Global.canSound) {
            main.ins.playSound(Sound.wz_start)
        }

        if (gameData.arrData[Global.numLevel].gameHelp) {
            this.node.getChildByName('bg_help').active = gameData.arrData[Global.numLevel].gameHelp
        }else{
            this.node.getChildByName('bg_help').active = false
        }
        if (num_type != 0) {
            if (num_type == 1) {
                this.numColor = Math.floor(Math.random()*gameData.arrColor.length)
                for (let i = 0; i < this.arrBlocks.length; i++) {
                    let ts_block = this.arrBlocks[i].getComponent(blockOne)
                    ts_block.changeColor(new Color(255,255,255,255))
                }
                this.actBlocks()
            }
          
            this.parentBtns.getChildByName('btn_next').active = true
            return
        }

        this.numColor = Math.floor(Math.random()*gameData.arrColor.length)
        this.refreshTitle()
        this.cleanBlocks()
        if (Global.canEdit) {
            let arr_hl = gameData.arrData[Global.numLevel].gameHL
            if (arr_hl) {
                this.createBlocksEdit(arr_hl[0],arr_hl[1])
            }else{
                this.createBlocks()
            }
        }else{
            this.createBlocks()
        }
        this.parentBtns.getChildByName('parentEdit').active = Global.canEdit
        this.arrBlocks = this.parentBlocks.children
        this.actBlocks()
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

    refreshTitle(){
        let label_title = this.node.getChildByName('title').getChildByName('label_title').getComponent(Label)
        label_title.string = gameData.arrData[Global.numLevel].gameTitle[1]
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
                for (let i = 0; i < this.arrBlocksIndex.length; i++) {
                    let ts_block = this.arrBlocks[this.arrBlocksIndex[i]].getComponent(blockOne)
                    ts_block.changeColor(new Color(255,255,255,255))
                }
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
        if (!Global.canEdit) {
            this.schedule(this.callbackTime, 1)
        }
    }

    onTouchStart(event: EventTouch) {
        
        if (this.isSuccess) {
            return
        }

        if (!this.callbackTime) {
            console.log('开始倒计时');
            
            this.startTime()
        }
        let v3_Start = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x,event.getUILocation().y,0))
    
        for (let i = this.arrBlocks.length-1; i >= 0; i--) {
            if (this.arrBlocksIndex.indexOf(i) != -1) {
                continue
            }
            if (this.arrBlocks[i].getComponent(UITransform).getBoundingBox().contains(new Vec2(v3_Start.x,v3_Start.y))) {
                let ts_block = this.arrBlocks[i].getComponent(blockOne)
                if (ts_block.colorBlock.r == 255 && ts_block.colorBlock.g == 255 && ts_block.colorBlock.b == 255) {
                    this.arrBlocksIndex.push(i)
                    let color = gameData.arrColor[this.numColor]
                    ts_block.changeColor(color)

                    if (Global.canSound) {
                        main.ins.playSound(Sound.wz_click)
                    }
                }
           }
        }

    }

    onTouchEnd(event: EventTouch) {
        if (this.isSuccess) {
            return
        }

        let str_word = ''
        for (let i = 0; i < this.arrBlocksIndex.length; i++) {
            let ts_block = this.arrBlocks[this.arrBlocksIndex[i]].getComponent(blockOne)
            str_word = str_word + ts_block.strInfo
        }

        let is_right = false
        for (let i = 0; i < gameData.arrData[Global.numLevel].gameTips.length; i++) {
            if (str_word == gameData.arrData[Global.numLevel].gameTips[i]) {
                is_right = true
                break
            }
        }

        if (is_right) {
            if (Global.canSound) {
                main.ins.playSound(Sound.wz_get)
            }
            this.numColor++
            if (this.numColor >= gameData.arrColor.length) {
                this.numColor = 0
            }
            this.numTogether++
            for (let i = 0; i < this.arrBlocksIndex.length; i++) {
                let ts_block = this.arrBlocks[this.arrBlocksIndex[i]].getComponent(blockOne)
                ts_block.numTogether = this.numTogether
            }
        }else{
            
            for (let i = 0; i < this.arrBlocksIndex.length; i++) {
                let ts_block = this.arrBlocks[this.arrBlocksIndex[i]].getComponent(blockOne)
                ts_block.changeColor(new Color(255,255,255,255),true)
            }

            if (this.arrBlocksIndex.length != 0) {
                if (Global.canSound) {
                    main.ins.playSound(Sound.wz_oo)
                }
            }
            
        }

        this.arrBlocksIndex = []
        console.log(str_word);
        this.judgeSuccess()
    }

    //判断是否成功
    judgeSuccess(){
        let is_success = true
        for (let i = 0; i < this.arrBlocks.length; i++) {
            let ts_block = this.arrBlocks[i].getComponent(blockOne)
            if(this.arrBlocks[i].scale.x <= 0.1)
            {
                continue
            }
            if (ts_block.colorBlock.r == 255 && ts_block.colorBlock.g == 255 && ts_block.colorBlock.b == 255) {
                is_success = false
            }
        }
        console.log('is_success:'+is_success);
        
        if (is_success) {
            if (Global.canEdit) {
                return
            }
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

    createBlocks(){
        let info = gameData.arrData[Global.numLevel]
        let arrinfo = info.gameinfo
        for (let i = 0; i < arrinfo.length; i++) {
            let n_block = PoolMgr.ins.getNode('blockOne')
            n_block.parent = this.parentBlocks
            let xx = Number(arrinfo[i][0])
            let yy = Number(arrinfo[i][1])
            n_block.setPosition(xx,yy,0)
            let ts_block = n_block.getComponent(blockOne)
            ts_block.init(arrinfo[i][2],arrinfo[i][3])
        }
    }

    createBlocksEdit(i_max,j_max){
        let num_num = -1
        for (let i = 0; i < i_max; i++) {
            for (let j = 0; j < j_max; j++) {
                num_num++
                let n_block = PoolMgr.ins.getNode('blockOne')
                n_block.parent = this.parentBlocks
                let xx = j*this.numWH + this.numJianGe * j - (this.numWH + this.numJianGe) * j_max / 2 + this.numWH / 2 + this.numJianGe / 2
                let yy = i*this.numWH + this.numJianGe * i - (this.numWH + this.numJianGe) * i_max / 2 + this.numWH / 2 + this.numJianGe / 2
                n_block.setPosition(xx,yy,0)

                let ts_block = n_block.getComponent(blockOne)
                let str_str = null
                if (gameData.arrData[Global.numLevel].gameinfo && gameData.arrData[Global.numLevel].gameinfo[num_num]) {
                    str_str = gameData.arrData[Global.numLevel].gameinfo[num_num][2]
                }
                if (str_str) {
                    ts_block.initEdit(str_str)
                }else{
                    ts_block.initEdit('')
                }
            }
        }
    }

    output(){
        let str_1 = ''
        let children = this.parentBlocks.children
        for (let i = 0; i < children.length; i++) {
            let ts_block = children[i].getComponent(blockOne)
            let str_info = ts_block.labInfo.string
            
            let xx = children[i].getPosition().x
            let yy = children[i].getPosition().y

            let num_num = ts_block.numTogether
            
            str_1 = str_1 + '[' + xx + ',' + yy + ',' + '"' + str_info + '"' + ',' + num_num + '],'
        }

        console.log(str_1);
    }

    createJian(num_num){
        let n_chaHao = PoolMgr.ins.getNode('jian')
        n_chaHao.parent = this.parentChaHao
        n_chaHao.getComponent(jian).init(num_num)
    }

    btnShowOrHide(){
        let children = this.parentBlocks.children
        for (let i = 0; i < children.length; i++) {
            let ts_block = children[i].getComponent(blockOne)
            ts_block.showOrHide()
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
        let arr_num = []
        for (let i = this.arrBlocks.length - 1; i >= 0; i--) {
            let ts_block = this.arrBlocks[i].getComponent(blockOne)
            if (ts_block.colorBlock.r == 255 && ts_block.colorBlock.g == 255 && ts_block.colorBlock.b == 255) {
                if(this.arrBlocks[i].scale.x <= 0.1)
                {
                    continue
                }
                if (arr_num.length == 0) {
                    arr_num.push(i) 
                }else{
                    let num_tips_one = this.arrBlocks[arr_num[0]].getComponent(blockOne)
                    if (ts_block.numTips == num_tips_one.numTips) {
                        arr_num.push(i)
                    }
                }
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

    btnRefresh(){
        if (!this.arrBlocks) {
            return
        }
        for (let i = 0; i < this.arrBlocks.length; i++) {
            let ts_block = this.arrBlocks[i].getComponent(blockOne)
            ts_block.isDir = false
        }
        let dir_random = Math.random()
        for (let i = 0; i < this.arrBlocks.length; i++) {
            let ts_block_1 = this.arrBlocks[i].getComponent(blockOne)
            let v3_1 = this.arrBlocks[i].getPosition()
            if (ts_block_1.isDir) {
                continue
            }
            for (let j = 0; j < this.arrBlocks.length; j++) {
                let ts_block_2 = this.arrBlocks[j].getComponent(blockOne)
                let v3_2 = this.arrBlocks[j].getPosition()
                if (ts_block_2.isDir) {
                    continue
                }
                if(dir_random > 0.5){//x轴方向 转换
                    if(Math.abs(v3_1.x - v3_2.x * -1) < 7 && Math.abs(v3_1.y - v3_2.y) < 7 && i != j){
                        this.arrBlocks[i].setPosition(v3_2)
                        this.arrBlocks[j].setPosition(v3_1)
                        ts_block_1.isDir = true
                        ts_block_2.isDir = true
                    }
                }else{//y轴方向 转换
                    if(Math.abs(v3_1.y - v3_2.y * -1) < 7 && Math.abs(v3_1.x - v3_2.x) < 7 && i != j){
                        this.arrBlocks[i].setPosition(v3_2)
                        this.arrBlocks[j].setPosition(v3_1)
                        ts_block_1.isDir = true
                        ts_block_2.isDir = true
                    }
                }
            }
        }
    }

    btnAnswer(){
        let node_tips = PoolMgr.ins.getNode('tipsView')
        node_tips.parent = this.node
        node_tips.getComponent(tipsView).init(1)

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
        if (str == 'btn_save') {
            this.output()
        }else if (str == 'btn_showOrHide') {
            this.btnShowOrHide()
        }else if(str == 'btn_addTime'){
            let is_tv = this.parentBtns.getChildByName('btn_addTime').getChildByName('sp_tv').active
            is_share = !is_tv
            this.btnShareOrTv(is_tv,'btn_addTime')
        }else if(str == 'btn_tips'){
            let is_tv = this.parentBtns.getChildByName('btn_tips').getChildByName('sp_tv').active
            is_share = !is_tv
            this.btnShareOrTv(is_tv,'btn_tips')
        }else if (str == 'btn_next') {
            let is_tv = this.parentBtns.getChildByName('btn_next').getChildByName('sp_tv').active
            is_share = !is_tv
            this.btnShareOrTv(is_tv,'btn_next')
        }else if (str == 'btn_back') {
            const view = await ResMgr.ins.getUI(ui.layerLevelView)
            view.getComponent(layerLevelView).init()
            this.cleanBlocks()
            PoolMgr.ins.putNode(this.node)
        }else if(str == 'btn_refresh'){
            this.btnRefresh()
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


