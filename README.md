# 找梗汉字局

汉字休闲合集（找梗 / 找不同 / 找字等）· 抖音小游戏 IAA · Cocos Creator **3.8.8**

正式名（软著 / 提审 / 包内）：**找梗汉字局**  
AppID：`tt4b823d3fd5f0de0c02`

## 分支

- `main`：买包基线
- `douyin`：抖音加壳与上架（当前开发分支）

## 本地预览

1. Cocos Dashboard 打开本工程  
2. 打开 `assets/loading.scene`  
3. 编辑器 **预览**

## 抖音小游戏构建

1. 菜单 **项目 → 构建发布** → 平台选 **抖音小游戏**  
2. AppID 填 `tt4b823d3fd5f0de0c02`（与 `build-config-bytedance-mini-game.json` 一致）  
3. 构建后用 **抖音开发者工具** 打开 `build/bytedance-mini-game`  
4. 流量主开通前保持 `Global.dyMockAds = true`；开通后：

```ts
// assets/Script/Global.ts
Global.dyMockAds = false;
Global.idVideo = '你的激励视频广告位ID';
Global.idBanner = '你的Banner广告位ID';       // 可选
Global.idInterstitial = '你的插屏广告位ID'; // 可选
```

## 提审前检查（已约定）

- [ ] 游戏名 / 软著名均为「找梗汉字局」  
- [ ] TipView 等处无卖家 QQ/微信水印  
- [ ] 市面同皮未大量撞车  
- [ ] 激励视频在真机可调起（或 mock 已关且广告位有效）

## 广告与平台代码

- `assets/Script/ad/DyPlatform.ts`：抖音 `tt` 能力  
- `assets/Script/ad/WxPlatform.ts`：微信（本分支不再作为上架目标）  
- `assets/Script/ad/AdMgr.ts`：按 `sys.platform` 分发  
