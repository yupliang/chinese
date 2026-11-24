import { BYTEDANCE } from 'cc/env';
import { director } from 'cc';
import { Global, events } from '../Global';

/**
 * 抖音小游戏开放能力封装（分享 / Banner / 插屏 / 激励视频）。
 * 广告位 ID 在 Global 中配置；为空或 dyMockAds=true 时走本地 mock，避免卡死流程。
 */
export class DyPlatform {
    static _ins: DyPlatform;
    public tt = typeof window !== 'undefined' ? window['tt'] : null;

    rewardVideo: any = null;

    static get ins() {
        if (this._ins) {
            return this._ins;
        }
        this._ins = new DyPlatform();
        this._ins.init();
        return this._ins;
    }

    private get ready() {
        return BYTEDANCE && !!this.tt;
    }

    private get mockAds() {
        return Global.dyMockAds || !Global.idVideo;
    }

    init() {
        if (!this.ready) {
            return;
        }

        try {
            this.tt.showShareMenu && this.tt.showShareMenu({
                success() {},
                fail() {},
            });
        } catch (e) {
            console.warn('[DyPlatform] showShareMenu failed', e);
        }

        if (Global.shares.length > 0 && this.tt.onShareAppMessage) {
            this.tt.onShareAppMessage(() => {
                const i = Math.floor(Math.random() * Global.shares.length);
                return {
                    title: Global.shares[i].shareText,
                    imageUrl: Global.shares[i].shareLink || '',
                    query: '',
                };
            });
        }
    }

    showShare(call?: Function) {
        if (!this.ready) {
            director.emit(events.Toast, '该功能在抖音小游戏可用！');
            call && call();
            return;
        }
        if (Global.shares.length <= 0) {
            call && call();
            return;
        }

        const now = Date.now();
        if (Global.timeShare && now - Global.timeShare < 800) {
            return;
        }
        Global.timeShare = now;

        const i = Math.floor(Math.random() * Global.shares.length);
        try {
            this.tt.shareAppMessage({
                title: Global.shares[i].shareText,
                imageUrl: Global.shares[i].shareLink || '',
                query: '',
            });
        } catch (e) {
            console.warn('[DyPlatform] shareAppMessage failed', e);
        }
        call && call();
    }

    banner: any = null;

    hideBanner() {
        if (this.banner) {
            try {
                this.banner.hide();
            } catch (e) {}
        }
    }

    DestroyBanner() {
        if (this.banner) {
            try {
                this.banner.destroy();
            } catch (e) {}
            this.banner = null;
        }
    }

    showBanner() {
        if (!this.ready || this.mockAds || !Global.idBanner) {
            return;
        }
        if (this.banner) {
            this.banner.show();
            return;
        }

        const winSize = this.tt.getSystemInfoSync();
        const bannerAd = this.tt.createBannerAd({
            adUnitId: Global.idBanner,
            style: {
                left: 0,
                top: winSize.windowHeight - 100,
                width: winSize.windowWidth,
            },
        });

        bannerAd.onLoad(() => {
            console.log('[DyPlatform] banner loaded');
            this.banner = bannerAd;
        });
        bannerAd.onError((err) => {
            console.log('[DyPlatform] banner error', err);
            this.DestroyBanner();
        });
        bannerAd.show().catch((err) => {
            console.log('[DyPlatform] banner show fail', err);
        });
    }

    showInterstitialAd(delay = 0) {
        if (!this.ready || this.mockAds || !Global.idInterstitial) {
            return;
        }

        const interstitialAd = this.tt.createInterstitialAd({
            adUnitId: Global.idInterstitial,
        });
        if (!interstitialAd) {
            return;
        }

        interstitialAd.onError((err) => {
            console.log('[DyPlatform] interstitial error', err);
        });

        setTimeout(() => {
            interstitialAd
                .load()
                .then(() => interstitialAd.show())
                .catch((err) => {
                    console.log('[DyPlatform] interstitial show fail', err);
                });
        }, delay * 1000);
    }

    /**
     * callback(1) 完整观看；callback(0) 中途退出；callback(2) 无广告/失败
     */
    showRewardVideo(callback?: Function) {
        if (!this.ready || this.mockAds) {
            console.log('[DyPlatform] reward video mock');
            callback && callback(Global.dyMockAds ? 1 : 2);
            return;
        }

        if (!this.rewardVideo) {
            this.rewardVideo = this.tt.createRewardedVideoAd({
                adUnitId: Global.idVideo,
            });
        }

        const rewardedVideoAd = this.rewardVideo;
        const onClose = (res) => {
            rewardedVideoAd.offClose && rewardedVideoAd.offClose(onClose);
            if (res && res.isEnded) {
                callback && callback(1);
            } else {
                callback && callback(0);
            }
        };
        const onError = (err) => {
            console.log('[DyPlatform] reward video error', err);
            rewardedVideoAd.offError && rewardedVideoAd.offError(onError);
            callback && callback(2);
        };

        rewardedVideoAd.offClose && rewardedVideoAd.offClose(onClose);
        rewardedVideoAd.offError && rewardedVideoAd.offError(onError);
        rewardedVideoAd.onClose(onClose);
        rewardedVideoAd.onError(onError);

        rewardedVideoAd
            .show()
            .catch(() =>
                rewardedVideoAd
                    .load()
                    .then(() => rewardedVideoAd.show())
                    .catch((err) => {
                        console.log('[DyPlatform] reward video show fail', err);
                        callback && callback(2);
                    }),
            );
    }
}
