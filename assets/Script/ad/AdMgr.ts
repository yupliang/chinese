import { _decorator, Component, Node, sys, __private, director } from 'cc';
import { DEBUG, WECHAT } from 'cc/env';
import { Global, events, ui, Sound } from '../Global';
import { AudioMgr } from '../manager/AudioMgr';
import { WxPlatform } from './WxPlatform';

export class AdMgr {

    static bannerOn = false;

    static closeAd() {
        const system = sys.platform;

        switch (system) {

            case sys.Platform.WECHAT_GAME:
                WxPlatform.ins.hideBanner();
                //this.bannerOn = false;
                break;
            case sys.Platform.BYTEDANCE_MINI_GAME:

                break;
            case sys.Platform.ANDROID:

                break;
        }
    }

    static closeCustomAd(num_num) {
        const system = sys.platform;

        switch (system) {

            case sys.Platform.WECHAT_GAME:
                if (num_num == 1) {
                    WxPlatform.ins.hideCustomAd1_1()
                    WxPlatform.ins.hideCustomAd1_2()
                }else if (num_num == 4) {
                    WxPlatform.ins.hideCustomAd4()
                }else if (num_num == 3) {
                    WxPlatform.ins.hideCustomAd3()
                }
                break;
            case sys.Platform.BYTEDANCE_MINI_GAME:

                break;
            case sys.Platform.ANDROID:

                break;
        }
    }


    static showBanner() {
        const system = sys.platform;

        switch (system) {

            case sys.Platform.WECHAT_GAME:
                    WxPlatform.ins.showBanner();
                break;
            case sys.Platform.BYTEDANCE_MINI_GAME:

                break;
            case sys.Platform.ANDROID:

                break;
        }

    }

    static goSelf(str_id) {
        const system = sys.platform;

        switch (system) {

            case sys.Platform.WECHAT_GAME:
                    WxPlatform.ins.goSelf(str_id);
                break;
            case sys.Platform.BYTEDANCE_MINI_GAME:

                break;
            case sys.Platform.ANDROID:

                break;
        }

    }

    static showCustomAd(str) {
        const system = sys.platform;

        switch (system) {

            case sys.Platform.WECHAT_GAME:
                if (str == '1_1') {
                    WxPlatform.ins.showCustomAd1_1((data)=>{});
                }else if (str == '1_2') {
                    WxPlatform.ins.showCustomAd1_2((data)=>{});
                }else if (str == '3_1') {
                    WxPlatform.ins.showCustomAd3_1((data)=>{});
                }
                break;
            case sys.Platform.BYTEDANCE_MINI_GAME:

                break;
            case sys.Platform.ANDROID:

                break;
        }

    }

    static showCustomAd4() {
        const system = sys.platform;

        switch (system) {

            case sys.Platform.WECHAT_GAME:
                    WxPlatform.ins.showCustomAd4((data)=>{
                        //通过data判断激励视频广告是否加载成功、失败；判断是否中途退出还是完整播放
                        if (data == 1) {
                            //director.emit(events.Toast, "获取奖励成功");
                        } else {
                            //director.emit(events.Toast, "获取奖励失败");
                        }
                    });
                break;
            case sys.Platform.BYTEDANCE_MINI_GAME:

                break;
            case sys.Platform.ANDROID:

                break;
        }

    }

    static showInterstial(delay = 0) {

        const system = sys.platform;

        switch (system) {

            case sys.Platform.WECHAT_GAME:
                WxPlatform.ins.showInterstitialAd(delay);
                break;
            case sys.Platform.MOBILE_BROWSER:
            case sys.Platform.DESKTOP_BROWSER:
                //this.showWebIntersital();
                break;

            case sys.Platform.BYTEDANCE_MINI_GAME:

                break;
            case sys.Platform.ANDROID:

                break;
        }

    }

    static showVideo(is_tv,CB = null) {


        if (DEBUG) {
            // this.showWebIntersital();
            // CB && CB();
            //return;
        }


        const system = sys.platform;

        switch (system) {
            case sys.Platform.MOBILE_BROWSER:
            case sys.Platform.DESKTOP_BROWSER:
                // this.showWebIntersital();
                CB && CB();
                break;

            case sys.Platform.WECHAT_GAME:
                if (!is_tv) {
                    let call =()=>{
                        setTimeout(() => {
                            CB && CB(2);
                        },100)
                    }
                    
                    WxPlatform.ins.showShare(call)
                    return
                }
                /* ads here!! */
                Global.Pause();
                WxPlatform.ins.showRewardVideo((data) => {
                    {
                        if (Global.canSound) {
                            if (AudioMgr.ins.isMusicPlaying()) {
                                AudioMgr.ins.stopMusic()
                            }
                            AudioMgr.ins.playMusic(Sound.wz_bgm,0.5)
                        }
                    }
                    //通过data判断激励视频广告是否加载成功、失败；判断是否中途退出还是完整播放
                    if(data == 1){//加载成功
                        CB && CB();
                        Global.Pause(false);
                        //director.emit(events.Toast, "获取奖励成功！");
                    }else if (data == 2) {//无广告
                        Global.Pause(false);

                        //director.emit(events.Toast, "暂无广告，分享可以获得奖励喔");
                        // let call =()=>{
                        //     setTimeout(() => {
                        //         CB && CB(1);
                        //     },100)
                        // }
                        // WxPlatform.ins.showShare(call)

                        {
                            director.emit(events.Toast, "暂无广告，分享也可以获得奖励喔");
                            CB && CB(1)
                        }
                        
                    } else{
                        Global.Pause(false);
                        director.emit(events.Toast, "观看完整广告，才可获得奖励！");
                    }

                })
                break;
            case sys.Platform.BYTEDANCE_MINI_GAME:

                break;
            case sys.Platform.ANDROID:

                break;
        }

    }

    static showWebIntersital() {

        //ResMgr.ins.getUI(ui.AdView);
    }


}

