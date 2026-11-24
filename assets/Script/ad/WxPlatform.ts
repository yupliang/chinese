
import { WECHAT } from "cc/env";
import { Global, events } from "../Global";
import { director } from "cc";

export class WxPlatform {

    static _ins: WxPlatform;
    public wx = typeof window !== 'undefined' ? window["wx"] : null;

    numCustomAd1_1: number;
    numCustomAd1_2: number;
    numCustomAd4: number;
    
    numCustomAd3_1: number;


    static get ins() {
        if (this._ins) {
            return this._ins;
        }

        this._ins = new WxPlatform();

        this._ins.init();

        return this._ins;
    }

    private get mockAds() {
        return Global.wxMockAds || !Global.idVideo;
    }

    init() {
        
        if (!WECHAT) {
            return
        }
        this.numCustomAd1_1 = 0
        this.numCustomAd1_2 = 0
        this.numCustomAd4 = 0
        this.numCustomAd3_1 = 0

        
        this.wx.showShareMenu();
        // 绑定分享参数

        
        if (Global.shares.length > 0) {
            this.wx.onShareAppMessage(function () {
                // 用户点击了“转发”按钮
                let i_num = Math.floor(Math.random() * Global.shares.length);

                return {
                    title: Global.shares[i_num].shareText,
                    imageUrlId: Global.shares[i_num].shareId, // 图片 id
                    imageUrl: Global.shares[i_num].shareLink // 图片 URL
                }
            })

            this.wx.onShareTimeline(() => {
                let i_num = Math.floor(Math.random() * Global.shares.length);
                return {
                    title: Global.shares[i_num].shareText,
                    imageUrlId: Global.shares[i_num].shareId, // 图片 id
                    imageUrl: Global.shares[i_num].shareLink, // 图片 URL
                    query: ''
                }
            })

        }

    }

    getScene() {
        let scene = this.wx.getLaunchOptionsSync().scene
        return scene
    }


    showShare_query(str_query: string = '') {
        if (!WECHAT) {
            director.emit(events.Toast, "该功能在微信小游戏可用！")
            return
        }

        if (Global.shares.length <= 0) return;

        let i_num = Math.floor(Math.random() * Global.shares.length)

        if (WECHAT) {
            this.wx.shareAppMessage({
                title: '这是我自定义的关卡，欢迎来挑战！',
                imageUrlId: Global.shares[i_num].shareId, // 图片 id
                imageUrl: Global.shares[0].shareLink, // 图片 URL
                query: str_query

            })

        }

    }

    goSelf(str_id){
        this.wx.navigateToMiniProgram({
            appId: str_id,  //appid
            path: '',//path
            extraData: {  //参数
              foo: 'bar'
            },
            envVersion: 'release', //开发版develop 开发版 trial   体验版 release 正式版 
            success(res) {
              // 打开成功
            }
          })
    }

    
    getLaunchOption() {
        const query = this.wx.getLaunchOptionsSync().query;

        return query;
    }


    showShare(call:Function) {
        if (!WECHAT) {
            director.emit(events.Toast, "该功能在微信小游戏可用！")
            return
        }
        let time_now = Date.now()
        if (time_now - Global.timeShare < 800) {
            //director.emit(events.Toast, "两次分享间隔太短，请稍后再试！")
            return
        }
        Global.timeShare = time_now
        if (Global.shares.length <= 0) return;

        let i_num = Math.floor(Math.random() * Global.shares.length);

        if (WECHAT) {
            this.wx.shareAppMessage({
                title: Global.shares[i_num].shareText,
                imageUrlId: Global.shares[i_num].shareId, // 图片 id
                imageUrl: Global.shares[i_num].shareLink, // 图片 URL
            })

        }

        //分享成功
        call && call();
    }


    banner: any;

    hideBanner() {

        if (this.banner != null) {
            this.banner.hide()
        }
    }

    DestroyBanner() {
        if (this.banner != null) {
            this.banner.destroy();
            this.banner = null;
        }
    }

   

    showBanner(style = 2) {

        if (!WECHAT || this.mockAds || !Global.idBanner) {

            return;

        }

        if (this.banner) {
            this.banner.show()
            return
        }
        
        let id = Global.idBanner//消除

        let winSize = this.wx.getSystemInfoSync();

        let num_banner = 1.1

        if (Global.canShow) {
            num_banner = 1
        }

        let bannerAd = this.wx.createBannerAd({


            adUnitId: id,

            adIntervals: 30,


            style: {

                left: 0,

                top: 500,

                

                width: winSize.windowWidth / num_banner,

            }

        })
        let left;
        if (style == 1) {
            left = winSize.windowWidth - bannerAd.style.realWidth;
        }
        else if (style == 2) {
            left = winSize.windowWidth / 2 - bannerAd.style.realWidth / 2;
        }
        else {
            left = 0;
        }
        bannerAd.onResize(res => {
            bannerAd.style.top = winSize.windowHeight - bannerAd.style.realHeight;

            bannerAd.style.left = left;

        })

        bannerAd.onLoad(() => {

            console.log('banner 广告加载成功');

            this.banner = bannerAd;

        })

        bannerAd.onError(err => {
            console.log('banner 广告加载错误', err);
            this.DestroyBanner()
        })

        bannerAd.onClose(err => {
            console.log('banner 关闭Banner', err);
            this.DestroyBanner()
        })

        bannerAd.show();

    }


    hideCustomAd1_1() {
        if (this.custom1_1 != null) {
            if (this.custom1_1.isShow()) {
                this.custom1_1.hide()
            }
        }
    }

    hideCustomAd1_2() {
        if (this.custom1_2 != null) {
            if (this.custom1_2.isShow()) {
                this.custom1_2.hide()
            }
        }
    }

    DestroyCustomAd1_1() {
        if (this.custom1_1 != null) {
            this.custom1_1.destroy();
            this.custom1_1 = null;
        }
    }

    DestroyCustomAd1_2() {
        if (this.custom1_2 != null) {
            this.custom1_2.destroy();
            this.custom1_2 = null;
        }
    }

    hideCustomAd4() {
        if (this.custom4 != null) {
            if (this.custom4.isShow()) {
                this.custom4.hide()
            }
        }
    }

    DestroyCustomAd4() {
        if (this.custom4 != null) {
            this.custom4.destroy();
            this.custom4 = null;
        }
    }

    hideCustomAd3() {
        if (this.custom3_1 != null) {
            if (this.custom3_1.isShow()) {
                this.custom3_1.hide()
            }
        }
    }

    DestroyCustomAd3() {
        if (this.custom3_1 != null) {
            this.custom3_1.destroy();
            this.custom3_1 = null;
        }
    }

    //创建原生模板广告组件-1行格子广告-弹窗

    custom1_1: any;
    showCustomAd1_1(callback: Function) {

        if (!WECHAT || this.mockAds || !Global.idCustom1_1) {

            return;

        }

        if (this.custom1_1 != null) {
            this.numCustomAd1_1++
            if (this.custom1_1.isShow() == false) {
                this.custom1_1.show()
            }
            if (this.numCustomAd1_1 >= 3 && Global.canShow) {
                this.numCustomAd1_1 = 0
                this.DestroyCustomAd1_1()
            }else{
                return
            }
        }

        let id = Global.idCustom1_1 //Main.ins.Platforms[0].customId[0];
        let winSize = this.wx.getSystemInfoSync();
        let style = {}

        style = {
            width: 0,
            left: 0,
            top: winSize.screenHeight - 90 - winSize.screenHeight / 4,
            fixed: 0,
        }


        let CustomAd = this.wx.createCustomAd({
            adUnitId: id,  //'adunit-abf9c63427c3a38a',
            style: style
        });
        CustomAd.onLoad(() => {
            console.log('原生模板 广告加载成功');
            callback(1);
            CustomAd.show().then(() => console.log('原生模板 广告显示成功')).catch((err) => {
                console.log("原生模板 广告显示失败", err)
                callback(0);
                this.DestroyCustomAd1_1()
            })
            this.custom1_1 = CustomAd;
        })
        CustomAd.onClose(res => {
            this.DestroyCustomAd1_1()
            console.log('关闭原生模板广告', res);
        });
        CustomAd.onError(err => {
            this.DestroyCustomAd1_1()
            console.log('原生模板CustomAd 广告加载失败：', err);
            callback(0);
        });
    }

    //创建原生模板广告组件-1行格子广告-弹窗

    custom1_2: any;
    showCustomAd1_2(callback: Function) {

        if (!WECHAT || this.mockAds || !Global.idCustom1_2) {

            return;

        }

        if (this.custom1_2 != null) {
            this.numCustomAd1_2++
            if (this.custom1_2.isShow() == false) {
                this.custom1_2.show()
            }
            if (this.numCustomAd1_2 >= 4 && Global.canShow) {
                this.numCustomAd1_2 = 0
                this.DestroyCustomAd1_2()
            }else{
                return
            }
        }

        let id = Global.idCustom1_2 //Main.ins.Platforms[0].customId[0];
        let winSize = this.wx.getSystemInfoSync();
        let style = {}

        // style = {
        //     width: winSize.screenWidth / 1.5,
        //     left: (winSize.screenWidth - winSize.screenWidth / 1.5) / 2,
        //     top: 0,
        //     fixed: 0,
        // }

        style = {
            width: 0,
            left: winSize.screenWidth - 58,
            top: winSize.screenHeight - 90 - winSize.screenHeight / 4,
            fixed: 0,
        }


        let CustomAd = this.wx.createCustomAd({
            adUnitId: id,  //'adunit-abf9c63427c3a38a',
            style: style
        });
        CustomAd.onLoad(() => {
            console.log('原生模板 广告加载成功');
            callback(1);
            CustomAd.show().then(() => console.log('原生模板 广告显示成功')).catch((err) => {
                console.log("原生模板 广告显示失败", err)
                callback(0);
                this.DestroyCustomAd1_2()
            })
            this.custom1_2 = CustomAd;
        })
        CustomAd.onClose(res => {
            this.DestroyCustomAd1_2()
            console.log('关闭原生模板广告', res);
        });
        CustomAd.onError(err => {
            this.DestroyCustomAd1_2()
            console.log('原生模板CustomAd 广告加载失败：', err);
            callback(0);
        });
    }


    //创建原生模板广告组件-1行格子广告-弹窗

    custom1: any;
    showCustomAd1(callback: Function) {

        if (!WECHAT || this.mockAds) {

            return;

        }
        let id = null //Main.ins.Platforms[0].customId[0];
        let winSize = this.wx.getSystemInfoSync();
        let style = {}

        id = "原生五行格子广告id";
        style = {
            width: 128,
            left: 64,
            top: 300,
            fixed: 0,
        }


        if (this.custom1) {
            this.custom1.show();
            return;
        }

        let CustomAd = this.wx.createCustomAd({
            adUnitId: id,  //'adunit-abf9c63427c3a38a',
            style: style
        });
        CustomAd.onLoad(() => {
            console.log('原生模板 广告加载成功');
            callback(1);
            CustomAd.show().then(() => console.log('原生模板 广告显示成功')).catch((err) => {
                console.log("原生模板 广告显示失败", err)
                callback(0);
            })
            this.custom1 = CustomAd;
        })
        CustomAd.onClose(res => {
            console.log('关闭原生模板广告', res);
        });
        CustomAd.onError(err => {
            console.log('原生模板CustomAd 广告加载失败：', err);
            callback(0);
        });
    }

    //创建原生模板广告组件-3行格子广告-弹窗

    custom4: any;
    async showCustomAd4(callback: Function) {

        if (!WECHAT || this.mockAds || !Global.idCustom4) {
            return;
        }

        if (this.custom4 != null) {
            this.numCustomAd4++
            if (this.custom4.isShow() == false) {
                this.custom4.show()
            }
            if (this.numCustomAd4 >= 4 && Global.canShow) {
                this.numCustomAd4 = 0
                this.DestroyCustomAd4()
            }else{
                return
            }
        }

        let id = Global.idCustom4
        let winSize = this.wx.getSystemInfoSync();
        let num_top = (winSize.screenHeight - 400) / 2 - 75
        let num_width = winSize.screenWidth / 1.15
        let num_hhh = 490
        let num_num = 3.85
        let style = {}

        let is_4 = false
        let num_biLi = 0.5
        if (Math.random() > 0.8) {
            is_4 = true
        }

        if (!Global.canShow) {
            is_4 = true
            num_num = 3
        }

        if (is_4) {
            num_width = winSize.screenWidth / 1.1
            num_biLi = 0.915
            id = Global.idCustom4
        }else{
            num_width = winSize.screenWidth / 1.15
            num_biLi = 0.76
            id = Global.idCustom5
        }

        num_hhh = num_width / num_biLi
        num_top = winSize.screenHeight - num_hhh - winSize.screenHeight / num_num

        style = {
            top: num_top,
            width: num_width,
            left: (winSize.screenWidth - num_width) / 2,
            fixed: 0,
        }


        let CustomAd = this.wx.createCustomAd({
            adUnitId: id,  //'adunit-abf9c63427c3a38a',
            style: style
        });
        CustomAd.onLoad(() => {
            console.log('原生模板 广告加载成功');
            callback(1);
            CustomAd.show().then(() => console.log('原生模板 广告显示成功')).catch((err) => {
                console.log("原生模板 广告显示失败", err)
                callback(0);
                this.DestroyCustomAd4()
            })
            this.custom4 = CustomAd;
        })
        CustomAd.onClose(res => {
            this.DestroyCustomAd4()
            console.log('关闭原生模板广告', res);
        });
        CustomAd.onError(errMsg => {
            this.DestroyCustomAd4()
            console.log('原生模板CustomAd 广告加载失败：', errMsg);
            callback(0);
        });
    }


    custom3_1: any;
    async showCustomAd3_1(callback: Function) {

        if (!WECHAT || this.mockAds || !Global.idCustom3_1) {
            return;
        }

        if (this.custom3_1 != null) {
            this.numCustomAd3_1++
            if (this.custom3_1.isShow() == false) {
                this.custom3_1.show()
            }
            if (this.numCustomAd3_1 >= 5 && Global.canShow) {
                this.numCustomAd3_1 = 0
                this.DestroyCustomAd3()
            }else{
                return
            }
        }

        let id = Global.idCustom3_1
        let winSize = this.wx.getSystemInfoSync();
        let style = {}

        style = {
            //top: 76,
            top: 25,
            //width: winSize.screenWidth,
            left: 70,
            fixed: 0,
        }


        let CustomAd = this.wx.createCustomAd({
            adUnitId: id,  //'adunit-abf9c63427c3a38a',
            style: style
        });
        CustomAd.onLoad(() => {
            console.log('原生模板 广告加载成功');
            callback(1);
            CustomAd.show().then(() => console.log('原生模板 广告显示成功')).catch((err) => {
                console.log("原生模板 广告显示失败", err)
                callback(0);
                this.DestroyCustomAd3()
            })
            this.custom3_1 = CustomAd;
        })
        CustomAd.onClose(res => {
            this.DestroyCustomAd3()
            console.log('关闭原生模板广告', res);
        });
        CustomAd.onError(errMsg => {
            this.DestroyCustomAd3()
            console.log('原生模板CustomAd 广告加载失败：', errMsg);
            callback(0);
        });
    }



    showInterstitialAd(delay = 0) {

        if (!WECHAT || this.mockAds || !Global.idInterstitial) {
            return;
        }

        let id = Global.idInterstitial
        
        let interstitialAd = this.wx.createInterstitialAd({
            adUnitId: id,
        });
        if (interstitialAd) {
            interstitialAd.load().then(() => {
                console.log('插屏 广告加载成功');
            });
            interstitialAd.onClose(res => {
                console.log('关闭插屏广告', res);
            });
            interstitialAd.onError(err => {
                console.log('err:插屏广告加载失败', err);
            });

            setTimeout(() => {
                interstitialAd.show().catch((err) => {
                    console.log('插屏广告展示失败', err);
                });
            }, delay * 1000);
        }






    }


    rewardVideo2: any;

    showRewardVideo(callback?: Function) {

        if (!WECHAT || this.mockAds) {
            console.log('[WxPlatform] reward video mock');
            callback && callback(Global.wxMockAds ? 1 : 2);
            return;
        }

        let my = this;

        let id = Global.idVideo

        let rewardedVideoAd = this.wx.createRewardedVideoAd({
            adUnitId: id,
        });
        my.rewardVideo2 = rewardedVideoAd;
        var fun = function (res) {
            if (res && res.isEnded) {
                console.log('res:  ', res);
                callback && callback(1);
                rewardedVideoAd.offClose(fun);
            } else {
                console.log('播放中途退出');
                callback && callback(0);
            }
        }
        rewardedVideoAd.load().then(() => {
            this.wx.showToast({

                title: "加载中，请稍后",

                icon: 'success',//图标，支持"success"、"loading" 

                duration: 1500,//提示的延迟时间，单位毫秒，默认：1500 

                mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 

                success: function () { },

                fail: function () { },

                complete: function () { }

            })


            console.log('激励视频 广告加载成功');
            rewardedVideoAd.show();
        });
        rewardedVideoAd.onError(err => {
            console.log('激励视频 广告显示失败', err);
            this.wx.showToast({

                title: "请稍后再试",

                icon: 'fail',//图标，支持"success"、"loading" 

                duration: 1500,//提示的延迟时间，单位毫秒，默认：1500 

                mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 

                success: function () { },

                fail: function () { },

                complete: function () { }

            })
            callback && callback(2);
        })
        rewardedVideoAd.onClose(fun);
    }




}



