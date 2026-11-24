# 找梗汉字局

汉字休闲合集（找梗 / 找不同 / 找字等）· **微信小游戏 IAA** · Cocos Creator **3.8.8**

正式名（提审 / 包内）：**找梗汉字局**  
微信 AppID：创建小游戏后填入（见下方构建配置）

> 个人主体纯广告 IAA：多数情况可不强制软著；名称勿含英文/「软件」字样。详见[微信资质审核-IAA](https://developers.weixin.qq.com/minigame/introduction/guide/zzsh-iaa.html)。

## 分支

- `main`：买包基线
- `douyin`：抖音加壳（AppID `tt4b823d3fd5f0de0c02`）
- `wechat`：微信小游戏上架（当前分支）

## 本地预览

1. Cocos Dashboard 打开本工程  
2. 打开 `assets/loading.scene`  
3. 编辑器 **预览**

## 微信小游戏构建

1. 微信公众平台注册/登录，创建**小游戏**，复制 AppID  
2. 菜单 **项目 → 构建发布** → 平台选 **微信小游戏**  
3. AppID 填入，并同步改 `build-config-wechatgame.json` 里的 `appid`  
4. 构建后用 **微信开发者工具** 打开 `build/wechatgame`  
5. 流量主开通前保持 `Global.wxMockAds = true`；开通后：

```ts
// assets/Script/Global.ts
Global.wxMockAds = false;
Global.idVideo = 'adunit-你的激励视频';
Global.idBanner = 'adunit-你的Banner';           // 可选
Global.idInterstitial = 'adunit-你的插屏';     // 可选
// 格子广告按需填 idCustom*
```

## 提审前检查

- [ ] 小游戏名称与包内标题均为「找梗汉字局」  
- [ ] 无卖家 QQ/微信水印、无卖家互推跳转  
- [ ] 市面同皮未大量撞车  
- [ ] 激励视频可调起（或 mock 开启时流程不卡死）  
- [ ] 个人 IAA：类目与「不申请支付资质」选择正确  

## 广告与平台代码

- `assets/Script/ad/WxPlatform.ts`：微信 `wx` 能力（本分支主路径）  
- `assets/Script/ad/DyPlatform.ts`：抖音（保留，非本分支目标）  
- `assets/Script/ad/AdMgr.ts`：按 `sys.platform` 分发  
