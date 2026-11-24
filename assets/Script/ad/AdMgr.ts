import { director, sys } from 'cc';
import { DEBUG } from 'cc/env';
import { Global, events, Sound } from '../Global';
import { AudioMgr } from '../manager/AudioMgr';
import { WxPlatform } from './WxPlatform';
import { DyPlatform } from './DyPlatform';

export class AdMgr {

    static bannerOn = false;

    static closeAd() {
        switch (sys.platform) {
            case sys.Platform.WECHAT_GAME:
                WxPlatform.ins.hideBanner();
                break;
            case sys.Platform.BYTEDANCE_MINI_GAME:
                DyPlatform.ins.hideBanner();
                break;
            default:
                break;
        }
    }

    static closeCustomAd(num_num) {
        switch (sys.platform) {
            case sys.Platform.WECHAT_GAME:
                if (num_num == 1) {
                    WxPlatform.ins.hideCustomAd1_1();
                    WxPlatform.ins.hideCustomAd1_2();
                } else if (num_num == 4) {
                    WxPlatform.ins.hideCustomAd4();
                } else if (num_num == 3) {
                    WxPlatform.ins.hideCustomAd3();
                }
                break;
            case sys.Platform.BYTEDANCE_MINI_GAME:
                // 抖音分支不做微信格子广告
                break;
            default:
                break;
        }
    }

    static showBanner() {
        switch (sys.platform) {
            case sys.Platform.WECHAT_GAME:
                WxPlatform.ins.showBanner();
                break;
            case sys.Platform.BYTEDANCE_MINI_GAME:
                DyPlatform.ins.showBanner();
                break;
            default:
                break;
        }
    }

    static goSelf(str_id) {
        switch (sys.platform) {
            case sys.Platform.WECHAT_GAME:
                WxPlatform.ins.goSelf(str_id);
                break;
            case sys.Platform.BYTEDANCE_MINI_GAME:
                // 抖音禁止跳转卖家微信小游戏导流
                break;
            default:
                break;
        }
    }

    static showCustomAd(str) {
        switch (sys.platform) {
            case sys.Platform.WECHAT_GAME:
                if (str == '1_1') {
                    WxPlatform.ins.showCustomAd1_1(() => {});
                } else if (str == '1_2') {
                    WxPlatform.ins.showCustomAd1_2(() => {});
                } else if (str == '3_1') {
                    WxPlatform.ins.showCustomAd3_1(() => {});
                }
                break;
            case sys.Platform.BYTEDANCE_MINI_GAME:
                break;
            default:
                break;
        }
    }

    static showCustomAd4() {
        switch (sys.platform) {
            case sys.Platform.WECHAT_GAME:
                WxPlatform.ins.showCustomAd4(() => {});
                break;
            case sys.Platform.BYTEDANCE_MINI_GAME:
                break;
            default:
                break;
        }
    }

    static showInterstial(delay = 0) {
        switch (sys.platform) {
            case sys.Platform.WECHAT_GAME:
                WxPlatform.ins.showInterstitialAd(delay);
                break;
            case sys.Platform.BYTEDANCE_MINI_GAME:
                DyPlatform.ins.showInterstitialAd(delay);
                break;
            case sys.Platform.MOBILE_BROWSER:
            case sys.Platform.DESKTOP_BROWSER:
                break;
            default:
                break;
        }
    }

    private static onRewardVideoResult(data, CB) {
        if (Global.canSound) {
            if (AudioMgr.ins.isMusicPlaying()) {
                AudioMgr.ins.stopMusic();
            }
            AudioMgr.ins.playMusic(Sound.wz_bgm, 0.5);
        }
        if (data == 1) {
            CB && CB();
            Global.Pause(false);
        } else if (data == 2) {
            Global.Pause(false);
            director.emit(events.Toast, '暂无广告，分享也可以获得奖励喔');
            CB && CB(1);
        } else {
            Global.Pause(false);
            director.emit(events.Toast, '观看完整广告，才可获得奖励！');
        }
    }

    static showVideo(is_tv, CB = null) {
        if (DEBUG) {
            // keep DEBUG path open for editor preview
        }

        switch (sys.platform) {
            case sys.Platform.MOBILE_BROWSER:
            case sys.Platform.DESKTOP_BROWSER:
                CB && CB();
                break;

            case sys.Platform.WECHAT_GAME:
                if (!is_tv) {
                    const call = () => {
                        setTimeout(() => {
                            CB && CB(2);
                        }, 100);
                    };
                    WxPlatform.ins.showShare(call);
                    return;
                }
                Global.Pause();
                WxPlatform.ins.showRewardVideo((data) => {
                    AdMgr.onRewardVideoResult(data, CB);
                });
                break;

            case sys.Platform.BYTEDANCE_MINI_GAME:
                if (!is_tv) {
                    const call = () => {
                        setTimeout(() => {
                            CB && CB(2);
                        }, 100);
                    };
                    DyPlatform.ins.showShare(call);
                    return;
                }
                Global.Pause();
                DyPlatform.ins.showRewardVideo((data) => {
                    AdMgr.onRewardVideoResult(data, CB);
                });
                break;

            default:
                CB && CB();
                break;
        }
    }

    static showWebIntersital() {
        // ResMgr.ins.getUI(ui.AdView);
    }
}
