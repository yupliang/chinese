import { _decorator, Component, Node, input, Input, EventTouch, UITransform, Vec3, Vec2, tween, director, Sprite, Label } from 'cc';
import { WECHAT } from 'cc/env';
import { AdMgr } from '../ad/AdMgr';
import { blockSix } from '../block/blockSix';
import { blockSixTX } from '../block/blockSixTX';
import { jian } from '../block/jian';
import { gameData } from '../gameData';
import { events, Global, Sound, ui } from '../Global';
import { main } from '../main';
import { PoolMgr } from '../manager/PoolMgr';
import ResMgr from '../manager/ResMgr';
import { layerLevelView } from './layerLevelView';
import { resultView } from './resultView';
const { ccclass, property } = _decorator;

@ccclass('layerSixView')
export class layerSixView extends Component {

    @property({type:Node})
    parentBlocks = null

    @property({type:Node})
    parentBlocksDi = null

    @property({type:Node})
    parentBtns = null

    @property({type:Node})
    parentChaHao = null

    @property({type:Node})
    parentBlocksDiTX = null

    @property({type:Label})
    labelTime = null

    gameType: number;
    lengthBlocks_min: number;
    numLevelBlocks: number;
    lengthType_min: number;
    numLevelType: number;
    numLevel: number;
    numClickStart: number;
    numClickhEnd: number;
    xxStartDi: number;
    yyBlockDi: number;
    numOver: number;
    canDj: number[];
    isTVYiChu: any;
    isTVCheHui: any;
    isTVXiPai: any;
    isTVMing: any;
    isTVaddtime: any;
    isTVNext: any;
    numTime: any;
    callbackTime: any;
    isdlgd: boolean;
    numBlockName: number;

    start() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this)
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this)
    }


    init(num_type = 0,is_dlgd = false){//0:正常 1:重玩 2:复活
        this.gameType = 0 //（-1：游戏失败，0：正常游戏，1：游戏通关）

        this.isdlgd = is_dlgd //是否是爹了个爹

        this.lengthBlocks_min = 30
        this.numLevelBlocks = 12
        this.lengthType_min = 4
        this.numLevelType = 2

        this.xxStartDi = -240
        this.yyBlockDi = 120//移出的y坐标

        if (num_type != 2) {
            this.numLevel = 1
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

        if (gameData.arrData[Global.numLevel].gameHelp) {
            this.node.getChildByName('bg_help').active = gameData.arrData[Global.numLevel].gameHelp
        }else{
            this.node.getChildByName('bg_help').active = false
        }

        if (this.isdlgd) {
            AdMgr.closeCustomAd(1)
            AdMgr.closeCustomAd(3)
            this.node.getChildByName('bg_help').active = false
        }

        if (num_type != 0 && !this.isdlgd) {
            this.parentBtns.getChildByName('btn_next').active = true
        }else{
            this.parentBtns.getChildByName('btn_next').active = false
        }

        if (this.callbackTime) {
            this.unschedule(this.callbackTime)
            this.callbackTime = null
        }

        this.numTime = gameData.arrData[Global.numLevel].gameTime

        this.labelTime.string = '时间：' + this.numTime

        if (this.isdlgd) {
            this.labelTime.node.active = false
        }else{
            this.labelTime.node.active = true
        }

        if (num_type == 2) {
            this.btnYiChu(true)
            return
        }

        Global.numColorXC = Math.floor(Math.random() * 18)
        this.canDj = [2,2,2,2] //移出，撤回，洗牌，明牌

        if (this.isdlgd) {
            this.numBlockName = 0
        }else{
            this.canDj = [999,999,999,999] //移出，撤回，洗牌，明牌
            this.numBlockName = gameData.arrData[Global.numLevel].blockName
        }

        this.isTVYiChu = !Global.allShare
        this.isTVCheHui = !Global.allShare
        this.isTVXiPai = !Global.allShare
        this.isTVaddtime = !Global.allShare
        this.isTVNext = !Global.allShare
        this.isTVMing = !Global.allShare
        
        this.numOver = 0

        this.refreshTitle()
        this.cleanBlocks()
        this.createBlocks() 
        this.refreshAllBlocks()
        this.pdDJ()
        this.refreshBtn()
    }

    refreshTitle(){
        if (this.isdlgd) {
            this.node.getChildByName('title').scale = new Vec3(0.6,0.6,0.6)
            let label_title = this.node.getChildByName('title').getChildByName('label_title').getComponent(Label)
            label_title.string = '第'+this.numLevel+'关'
        }else{
            this.node.getChildByName('title').scale = new Vec3(0.9,0.9,0.9)
            let label_title = this.node.getChildByName('title').getChildByName('label_title').getComponent(Label)
            label_title.string = gameData.arrData[Global.numLevel].gameTitle[1]
        }
    }

    onTouchStart(event: EventTouch) {
        
        
        if (this.gameType != 0) {
            return
        }

        if (this.pdBlockDiMoving()) {
            return
        }

        if (!this.callbackTime && !this.isdlgd) {
            main.ins.showLog('开始倒计时');
            
            this.startTime()
        }

        //this.pdHeLi()

        this.numClickStart = -1
        let v3_Start = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x,event.getUILocation().y,0))
        
        let children = this.parentBlocks.children
        for (let i = children.length-1; i >= 0; i--) {
            if (children[i].getComponent(blockSix).canTouch == false) {
                continue
            }

            if (children[i].getComponent(UITransform).getBoundingBox().contains(new Vec2(v3_Start.x,v3_Start.y))) {
                
                this.numClickStart = i
                //console.log('点中了：'+i);
                if (Global.canSound) {
                    main.ins.playSound(Sound.wz_click)
                }
                tween(children[i])
                    .to(0.1,{scale:new Vec3(1.1,1.1,1.1)})
                    .start()
                break
           }
        }
    }

    onTouchEnd(event: EventTouch) {
        if (this.gameType != 0) {
            return
        }

        if (this.pdBlockDiMoving()) {
            return
        }

        let v3_Start = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x,event.getUILocation().y,0))

        let children = this.parentBlocks.children
        for (let i = children.length-1; i >= 0; i--) {
            if (children[i].getComponent(blockSix).canTouch == false) {
                continue
            }

            if (children[i].getComponent(UITransform).getBoundingBox().contains(new Vec2(v3_Start.x,v3_Start.y))) {
                this.numClickhEnd = i
                //console.log('确认点中了：'+i);
                if (this.numClickStart == this.numClickhEnd) {
                    let block_type = children[i].getComponent(blockSix).blockType
                    this.createBlocksToBi(block_type,children[i].getPosition())
                    PoolMgr.ins.putNode(children[i])
                    this.pdDJ()
                    break
                }
           }
        }

        if (this.numClickStart != -1) {
            tween(children[this.numClickStart])
                .to(0.1,{scale:new Vec3(1,1,1)})
                .start()
        }

        if(this.parentBlocks.children.length == 0){
            this.gameType = 1

            if (Global.canSound) {
                main.ins.playSound(Sound.wz_win)
            }

            if (this.isdlgd) {
                this.numLevel++
                this.scheduleOnce(function(){
                    this.gameType = 0
                    this.refreshTitle()
                    this.cleanBlocks()
                    this.createBlocks() 
                    this.refreshAllBlocks()
                    this.pdDJ()
                    this.refreshBtn()
                },1)
                return
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


    createBlocks(){

        let num_3 = -1
        let data : any = {}

        let arr_data = []

        if (this.isdlgd) {
            data = ResMgr.ins.getJson("" + this.numLevel)
            if (data && data.mapData) {
                arr_data.push(data.mapData)

                let num_1 = 0
                while (true) {
                    num_1++
                    let data_1 = ResMgr.ins.getJson("" + this.numLevel + '_' + num_1)
                    if (!data_1) {
                        break
                    }
                    if (data_1.mapData) {
                        arr_data.push(data_1.mapData)
                    }
                }
            }
        }else{
            arr_data = gameData.arrData[Global.numLevel].gameinfo
        }

        if (!arr_data || arr_data.length < 1) {
            this.levelRandom()
            return
        }

        if (arr_data.length > 0) {
            data = arr_data[Math.floor(Math.random() * arr_data.length)]
        }

        let numType = gameData.arrData[Global.numLevel].blockType
        let mapData = arr_data
        if (this.isdlgd) {
            mapData = data
            numType = 17
        }
        let b_type_random = 0

        console.log('块的个数：'+mapData.length);
        
        for (let i = 0; i < mapData.length; i++) {
            num_3++
            let n_block = PoolMgr.ins.getNode('blockSix')
            n_block.parent = this.parentBlocks
            let xx = 0//-250  + Math.random() * 500
            let yy = 0//-60 + Math.random() * 510
            xx = Number(mapData[i][0])
            yy = Number(mapData[i][1])
            if (num_3 % 3 == 0) {
                b_type_random = Math.floor(Math.random()*numType)
                if (num_3 == 0) {
                    b_type_random = 0
                }
            }
            
            n_block.getComponent(blockSix).init(b_type_random,this.numBlockName)
            n_block.setPosition(xx,yy,0)
        }

    }

     //在底部生成元素块
     createBlocksToBi(b_type,v3_block_start){
        let node_block = PoolMgr.ins.getNode('blockSix')
        
        node_block.parent = this.parentBlocksDi

        let ts_block = node_block.getComponent(blockSix)
        ts_block.initDi(b_type,this.numBlockName)

        let hh = this.getNumDi()
        this.shuaXinNumDi(node_block)
        
        let xx = this.xxStartDi + 80 * hh

        let v3_node_di = this.parentBlocksDi.getComponent(UITransform).convertToNodeSpaceAR(this.parentBlocks.getComponent(UITransform).convertToWorldSpaceAR(v3_block_start))

        node_block.setPosition(v3_node_di)
        ts_block.v3BlockOld = v3_node_di

        tween(node_block)
            .to(0.1,{position:new Vec3(xx,0,0)})
            .call(()=>{
                this.pdXiaoChu(node_block)
            })
            .start()

    }

     //得到在底部的位置
     getNumDi(){
        let children = this.parentBlocksDi.children
        let block_end = children[children.length-1]
        let ts_block_end = block_end.getComponent(blockSix)
        let num_xiaoChu = 0

        for (let i = 0; i < children.length; i++) {
            let ts_block = children[i].getComponent(blockSix)
            if (ts_block.isXiaoChu) {
                num_xiaoChu++
            }
        }

        if (children.length - num_xiaoChu == 1) {
            ts_block_end.numDi = 0
        }
        
        for (let i = children.length-2; i >= 0; i--) {
            let ts_block_2 = children[i].getComponent(blockSix)
            if (ts_block_end.blockType == ts_block_2.blockType && ts_block_2.isXiaoChu == false) {
                ts_block_end.numDi = ts_block_2.numDi+1
                return ts_block_end.numDi
            }
        }

        ts_block_end.numDi = children.length- 1 -num_xiaoChu

        return ts_block_end.numDi
    }

     //刷新在底部的位置
     shuaXinNumDi(node_block){
        let num_di = node_block.getComponent(blockSix).numDi
        let children = this.parentBlocksDi.children
        for (let i = 0; i < children.length; i++) {
            let ts_block = children[i].getComponent(blockSix)
            if (node_block.uuid == children[i].uuid || ts_block.isXiaoChu) {
                continue
            }
            if (ts_block.numDi >= num_di) {
                ts_block.numDi++
                let xx = this.xxStartDi + 80 * ts_block.numDi
                tween(children[i])
                    .to(0.09,{position:new Vec3(xx,0,0)})
                    .start()
            }
        }
    }

    //判断是否可以消除
    pdXiaoChu(node_block){
        let ts_block = node_block.getComponent(blockSix)
        ts_block.isMoving = false
        let num_di_block = ts_block.numDi
        let children = this.parentBlocksDi.children
        let arr_blockType = []
        for (let i = 0; i < children.length; i++) {
            let ts_block_2 = children[i].getComponent(blockSix)
            if (ts_block.blockType == ts_block_2.blockType && ts_block_2.isXiaoChu == false) {
                arr_blockType.push(children[i])
            }
        }

        let is_xiaoChu = false
        if (arr_blockType.length == 3) {
            for (let i = arr_blockType.length-1; i >= 0; i--) {
                arr_blockType[i].getComponent(blockSix).isXiaoChu = true
                let v3_111 = arr_blockType[i].getPosition()
                tween(arr_blockType[i])
                    .delay(0.05)
                    .to(0.08,{scale:new Vec3(0,0,0)})
                    .call(()=>{
                        PoolMgr.ins.putNode(arr_blockType[i])
                    })
                    .start()
                //arr_blockType[i].removeFromParent()
                is_xiaoChu = true

                {
                    for (let i = 0; i < 10; i++) {
                        let node_blockTX = PoolMgr.ins.getNode('blockSixTX')
                        node_blockTX.parent = this.parentBlocksDiTX
                        node_blockTX.setPosition(v3_111)
                        node_blockTX.getComponent(blockSixTX).init()
                    }
                    
                }
            }
        }

        if (is_xiaoChu) {
            if (Global.canSound) {
                main.ins.playSound(Sound.wz_get)
            }
            let children_2 = this.parentBlocksDi.children
            for (let i = 0; i < children_2.length; i++) {
                let ts_block_2 = children_2[i].getComponent(blockSix)
                if (ts_block_2.numDi > num_di_block) {
                    ts_block_2.numDi = ts_block_2.numDi - 3
                    let xx = this.xxStartDi + 80 * ts_block_2.numDi
                    //children_2[i].setPosition(xx,0,0)
                    tween(children_2[i])
                        .delay(0.05)
                        .to(0.08,{position:new Vec3(xx,0,0)})
                        .start()
                }
            }
        }

        let num_xiaoChu_geShu = 0
        let children_2 = this.parentBlocksDi.children
        for (let i = 0; i < children_2.length; i++) {
            let ts_block = children_2[i].getComponent(blockSix)
            if (ts_block.isXiaoChu) {
                num_xiaoChu_geShu++
            }
        }

        if (children_2.length - num_xiaoChu_geShu >= 7) {
            this.numOver++
            console.log('游戏失败');
            if (Global.canSound) {
                main.ins.playSound(Sound.wz_oo)
            }
            this.unschedule(this.callbackTime)
            this.gameType = -1
            this.scheduleOnce(async function(){
                //this.init(true)
                const view = await ResMgr.ins.getUI(ui.resultView)
                view.getComponent(resultView).init(2,this.isdlgd)
                PoolMgr.ins.putNode(this.node)
            },0.5)
        }
        
    }


    pdBlockDiMoving(){
        let is_moving = false
        let children = this.parentBlocksDi.children
        if (children.length > 0) {
            let ts_block = children[children.length-1].getComponent(blockSix)
            is_moving = ts_block.isMoving
        }
        return is_moving
    }

    //随机关卡
    levelRandom(){
        let num_3 = -1

        let i_num = 15 //行
        let j_num = 10 //列
        let arr_pos = []

        let length_blocks = this.lengthBlocks_min + this.numLevel * this.numLevelBlocks
        //console.log('随机块的个数：'+length_blocks);

        if (!this.isdlgd && gameData.arrData[Global.numLevel].blockType) {
            length_blocks = gameData.arrData[Global.numLevel].blockNum
        }
        
        let ii_num = 0
        let jj_num = 0
        if (length_blocks < 100) {
            ii_num = 0
            jj_num = 1
        }

        for (let i = ii_num; i < i_num-ii_num; i++) {
            for (let j = jj_num; j < j_num-jj_num; j++) {
                arr_pos.push([i*40 - (i_num-1)*40 / 2,j*45 - 35])
            }
        }

        let legnth_type = this.lengthType_min + this.numLevel * this.numLevelType

        if (!this.isdlgd && gameData.arrData[Global.numLevel].blockType) {
            legnth_type = gameData.arrData[Global.numLevel].blockType
        }

        let b_type_random = Math.floor(Math.random()*legnth_type)

        console.log('length_blocks:'+length_blocks);
        console.log('legnth_type:'+legnth_type);
        

        for (let i = 0; i < length_blocks; i++) {
            num_3++
            let n_block = PoolMgr.ins.getNode('blockSix')
            n_block.parent = this.parentBlocks
            let i_arrRandom = Math.floor(Math.random()*arr_pos.length)
            let xx = arr_pos[i_arrRandom][0]
            let yy = arr_pos[i_arrRandom][1]
            if (num_3 % 3 == 0) {
                b_type_random = Math.floor(Math.random()*legnth_type)
            }
            n_block.getComponent(blockSix).init(b_type_random,this.numBlockName)
            n_block.setPosition(xx,yy,0)
        }
    }

    //判断叠加
    pdDJ(){
        let children = this.parentBlocks.children
        for (let i = 0; i < children.length; i++) {
            let ts_block_1 = children[i].getComponent(blockSix)
            let rect_1 = ts_block_1.getBoundingBox_pz()
            ts_block_1.setTouch(true)
            for (let j = i+1; j < children.length; j++) {
                let ts_block_2 = children[j].getComponent(blockSix)
                let rect_2 = ts_block_2.getBoundingBox_pz()

                if (rect_1.intersects(rect_2)) {
                    ts_block_1.setTouch(false)
                    break
                }
            }
        }
    }

      //洗牌功能
      refreshAllBlocks(){
        let children = this.parentBlocks.children
        for (let i = 0; i < children.length; i++) {
            let ts_1 = children[i].getComponent(blockSix)
            let i_random = Math.floor(Math.random()*children.length)
            let ts_2 = children[i_random].getComponent(blockSix)

            let type_1 = ts_1.blockType
            let type_2 = ts_2.blockType

            ts_1.shuaXinType(type_2,this.numBlockName)
            ts_2.shuaXinType(type_1,this.numBlockName)

        }
    }

    refreshBtn(){
    
        this.parentBtns.getChildByName('btn_yiChu').getChildByName('sp_tv').active = this.isTVYiChu
        this.parentBtns.getChildByName('btn_yiChu').getChildByName('sp_share').active = !this.isTVYiChu

        this.parentBtns.getChildByName('btn_cheHui').getChildByName('sp_tv').active = this.isTVCheHui
        this.parentBtns.getChildByName('btn_cheHui').getChildByName('sp_share').active = !this.isTVCheHui

        this.parentBtns.getChildByName('btn_xiPai').getChildByName('sp_tv').active = this.isTVXiPai
        this.parentBtns.getChildByName('btn_xiPai').getChildByName('sp_share').active = !this.isTVXiPai

        this.parentBtns.getChildByName('btn_ming').getChildByName('sp_tv').active = this.isTVMing
        this.parentBtns.getChildByName('btn_ming').getChildByName('sp_share').active = !this.isTVMing

        this.parentBtns.getChildByName('btn_addTime').getChildByName('sp_tv').active = this.isTVaddtime
        this.parentBtns.getChildByName('btn_addTime').getChildByName('sp_share').active = !this.isTVaddtime

        this.parentBtns.getChildByName('btn_next').getChildByName('sp_tv').active = this.isTVNext
        this.parentBtns.getChildByName('btn_next').getChildByName('sp_share').active = !this.isTVNext

        if (this.canDj[0] <= 0) {
            this.parentBtns.getChildByName('btn_yiChu').getComponent(Sprite).grayscale = true
        }else{
            this.parentBtns.getChildByName('btn_yiChu').getComponent(Sprite).grayscale = false
        }

        if (this.canDj[1] <= 0) {
            this.parentBtns.getChildByName('btn_cheHui').getComponent(Sprite).grayscale = true
        }else{
            this.parentBtns.getChildByName('btn_cheHui').getComponent(Sprite).grayscale = false
        }

        if (this.canDj[2] <= 0) {
            this.parentBtns.getChildByName('btn_xiPai').getComponent(Sprite).grayscale = true
        }else{
            this.parentBtns.getChildByName('btn_xiPai').getComponent(Sprite).grayscale = false
        }

        if (this.canDj[3] <= 0) {
            this.parentBtns.getChildByName('btn_ming').getComponent(Sprite).grayscale = true
        }else{
            this.parentBtns.getChildByName('btn_ming').getComponent(Sprite).grayscale = false
        }

        this.parentBtns.getChildByName('btn_ming').active = this.isdlgd
        this.parentBtns.getChildByName('btn_addTime').active = !this.isdlgd

    }

    //清空所有元素块
    cleanBlocks(){
        let children_1 = this.parentBlocks.children
        for (let i = children_1.length-1; i >= 0; i--) {
            PoolMgr.ins.putNode(children_1[i])
        }

        let children_2 = this.parentBlocksDi.children
        for (let i = children_2.length-1; i >= 0; i--) {
            PoolMgr.ins.putNode(children_2[i])
        }
    }

    //出去3个块
    btnYiChu(is_fh = false){
        let arr_block_di = []
        let children_di_1 = this.parentBlocksDi.children
        for (let i = 0; i < children_di_1.length; i++) {
            let ts_block = children_di_1[i].getComponent(blockSix)
            if (ts_block.numDi < 3 && ts_block.isXiaoChu == false) {
                arr_block_di.push(children_di_1[i])
            }
        }

        let num_geShu = arr_block_di.length

        if (is_fh && num_geShu == 0) {
            return
        }

        if (num_geShu == 0) {
            director.emit(events.Toast, "当前不可用该道具")
        }else if(!is_fh){
            this.canDj[0]--
            if (this.canDj[0] <= 0) {
                this.parentBtns.getChildByName('btn_yiChu').getComponent(Sprite).grayscale = true
            }else{
                this.parentBtns.getChildByName('btn_yiChu').getComponent(Sprite).grayscale = false
            }
        }

        for (let i = arr_block_di.length-1; i >= 0; i--) {
            
            let ts_block = arr_block_di[i].getComponent(blockSix)

            let v3_block_di = new Vec3(-80 + ts_block.numDi * 80,this.yyBlockDi,0)
            let v3_world = this.parentBlocksDi.getComponent(UITransform).convertToWorldSpaceAR(v3_block_di)
            let v3_block = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(v3_world)

            ts_block.isXiaoChu = true
            tween(arr_block_di[i])
                .to(0.1,{position:v3_block_di})
                .call(()=>{
                    let node_block = PoolMgr.ins.getNode('blockSix')
                    node_block.parent = this.parentBlocks
                    node_block.setPosition(v3_block)
                    node_block.getComponent(blockSix).init(ts_block.blockType,this.numBlockName)
                    this.pdDJ()
                    PoolMgr.ins.putNode(arr_block_di[i])
                })
                .start()
        }

        let children_di_2 = this.parentBlocksDi.children
        for (let i = 0; i < children_di_2.length; i++) {
        
            let ts_block = children_di_2[i].getComponent(blockSix)
            if (ts_block.isXiaoChu) {
                continue
            }
            ts_block.numDi = ts_block.numDi - num_geShu
            let xx = this.xxStartDi + 80 * ts_block.numDi
            tween(children_di_2[i])
                .to(0.08,{position:new Vec3(xx,0,0)})
                .start()
            
        }

    }

    //撤回
    btnCheHui(){
        let children = this.parentBlocksDi.children
        let i_end = -1
        for (let i = children.length - 1; i >= 0; i--) {
            let ts_block = children[i].getComponent(blockSix)
            if (ts_block.isXiaoChu) {
                continue
            }
            i_end = i
            break
        }

        let num_di_cheHui = -1

        if (i_end != -1) {
            let ts_block = children[i_end].getComponent(blockSix)
            num_di_cheHui = ts_block.numDi
            ts_block.isXiaoChu = true

            let v3_old = ts_block.v3BlockOld
            let v3_world = this.parentBlocksDi.getComponent(UITransform).convertToWorldSpaceAR(v3_old)
            let v3_block = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(v3_world)

            tween(children[i_end])
                .to(0.1,{position:v3_old})
                .call(()=>{
                    let node_block = PoolMgr.ins.getNode('blockSix')
                    node_block.parent = this.parentBlocks
                    node_block.setPosition(v3_block)
                    node_block.getComponent(blockSix).init(ts_block.blockType,this.numBlockName)
                    this.pdDJ()
                    PoolMgr.ins.putNode(children[i_end])
                })
                .start()
        }

        if (num_di_cheHui == -1) {
            director.emit(events.Toast, "当前不可用该道具")
            //console.log('当前不可用该道具')
        }else{
            this.canDj[1]--
            if (this.canDj[1] <= 0) {
                this.parentBtns.getChildByName('btn_cheHui').getComponent(Sprite).grayscale = true
            }else{
                this.parentBtns.getChildByName('btn_cheHui').getComponent(Sprite).grayscale = false
            }
        }

        let children_di_2 = this.parentBlocksDi.children
        for (let i = 0; i < children_di_2.length; i++) {
        
            let ts_block = children_di_2[i].getComponent(blockSix)
            if (ts_block.isXiaoChu) {
                continue
            }
            if (ts_block.numDi > num_di_cheHui && num_di_cheHui != -1) {
                ts_block.numDi = ts_block.numDi - 1
                let xx = this.xxStartDi + 80 * ts_block.numDi
                tween(children_di_2[i])
                    .to(0.08,{position:new Vec3(xx,0,0)})
                    .start()
            }
        }
    }

    //明牌功能
    mingAllBlocks(){
        let children = this.parentBlocks.children
        for (let i = 0; i < children.length; i++) {
            let ts_block_1 = children[i].getComponent(blockSix)
            ts_block_1.setTouch(true)
        }
    }

    //洗牌
    btnXiPai(){
        this.canDj[2]--
        this.refreshAllBlocks()
        if (this.canDj[2] <= 0) {
            this.parentBtns.getChildByName('btn_xiPai').getComponent(Sprite).grayscale = true
        }else{
            this.parentBtns.getChildByName('btn_xiPai').getComponent(Sprite).grayscale = false
        }
    }

    //明牌
    btnMing(){
        this.canDj[3]--
        this.mingAllBlocks()
        director.emit(events.Toast, "已开启明牌模式！")
        if (this.canDj[3] <= 0) {
            this.parentBtns.getChildByName('btn_ming').getComponent(Sprite).grayscale = true
        }else{
            this.parentBtns.getChildByName('btn_ming').getComponent(Sprite).grayscale = false
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

    btnShareOrTv(is_tv : boolean, str : string){

        AdMgr.showVideo(is_tv,(data)=>{
            if (data && data == 1) {
                if (str == 'btn_yiChu') {
                    this.isTVYiChu = false
                }else if (str == 'btn_cheHui') {
                    this.isTVCheHui = false
                }else if (str == 'btn_xiPai') {
                    this.isTVXiPai = false
                }else if (str == 'btn_ming'){
                    this.isTVMing = false
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

                    if (str == 'btn_yiChu') {
                        this.btnYiChu()
                        this.isTVYiChu = true
                    }else if (str == 'btn_cheHui') {
                        this.btnCheHui()
                        this.isTVCheHui = true
                    }else if (str == 'btn_xiPai') {
                        this.isTVXiPai = true
                        this.btnXiPai()
                    }else if (str == 'btn_ming') {
                        this.isTVMing = true
                        this.btnMing()
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
                if (str == 'btn_yiChu') {
                    this.btnYiChu()
                    this.isTVYiChu = true
                }else if (str == 'btn_cheHui') {
                    this.btnCheHui()
                    this.isTVCheHui = true
                }else if (str == 'btn_xiPai') {
                    this.isTVXiPai = true
                    this.btnXiPai()
                }else if (str == 'btn_ming') {
                    this.isTVMing = true
                    this.btnMing()
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
        if (this.gameType != 0) {
            return
        }

        let is_share = false
        if (str == 'btn_back') {
            this.cleanBlocks()
            //PoolMgr.ins.putNode(this.node)
            if (this.isdlgd) {
                ResMgr.ins.getUI(ui.layerHomeView)
            }else{
                const view = await ResMgr.ins.getUI(ui.layerLevelView)
                view.getComponent(layerLevelView).init()
            }
        }else if (str == 'btn_yiChu') {
            let children = this.parentBlocks.children
            console.log('lenght:'+children.length);
            
            if (this.canDj[0] <= 0) {
                director.emit(events.Toast, "该道具次数已用完！")
                return
            }
            let is_tv = this.parentBtns.getChildByName('btn_yiChu').getChildByName('sp_tv').active
            is_share = !is_tv
            this.btnShareOrTv(is_tv,'btn_yiChu')
        }else if(str == 'btn_cheHui'){
            if (this.canDj[1] <= 0) {
                director.emit(events.Toast, "该道具次数已用完！")
                return
            }
            let is_tv = this.parentBtns.getChildByName('btn_cheHui').getChildByName('sp_tv').active
            is_share = !is_tv
            this.btnShareOrTv(is_tv,'btn_cheHui')
        }else if (str == 'btn_xiPai') {
            if (this.canDj[2] <= 0) {
                director.emit(events.Toast, "该道具次数已用完！")
                return
            }
            let is_tv = this.parentBtns.getChildByName('btn_xiPai').getChildByName('sp_tv').active
            is_share = !is_tv
            this.btnShareOrTv(is_tv,'btn_xiPai')
        }else if (str == 'btn_ming') {
            if (this.canDj[3] <= 0) {
                director.emit(events.Toast, "该道具次数已用完！")
                return
            }
            let is_tv = this.parentBtns.getChildByName('btn_ming').getChildByName('sp_tv').active
            is_share = !is_tv
            this.btnShareOrTv(is_tv,'btn_ming')
        }else if(str == 'btn_addTime'){
            let is_tv = this.parentBtns.getChildByName('btn_addTime').getChildByName('sp_tv').active
            is_share = !is_tv
            this.btnShareOrTv(is_tv,'btn_addTime')
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

