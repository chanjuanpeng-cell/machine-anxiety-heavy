# Machine Anxiety — VR (WebXR) 版本指南

> 在 Meta Quest 上用 WebXR 沉浸式观看的版本。所有逻辑在单文件 `index-vr.html`，
> 复用桌面版 `index.html` 的数据引擎与点云形变，去掉了不兼容 VR 的部分。
> 本文档记录改了什么、怎么调、怎么测、怎么部署，方便日后检查和更新。

---

## 一句话

桌面版是「电影化运镜 + 后处理 + 离线导出」的观看作品；VR 版把镜头交给头显、
关掉后处理、加上手柄走动，让人**站进房间里**看它随汇率崩塌。

---

## 文件与分支

| 项 | 值 |
|----|----|
| 入口文件 | `index-vr.html`（项目根目录，和 `index.html` 同级） |
| 模型 | `models/scaniverse_room_clean_585k.ply`（与桌面版一致） |
| 数据 | `chronicle_data.json`（与桌面版一致） |
| Git 分支 | `vr-webxr-v2` |
| 推送远端 | `heavy` → `git@github.com:chanjuanpeng-cell/machine-anxiety-heavy.git` |
| Vercel 项目 | **machine-anxiety-heavy** 的 Preview 部署（不是中间那个旧的 machine-anxiety） |
| 预览网址 | `https://machine-anxiety-heavy-git-vr-2ceee9-chanjuanpeng-cells-projects.vercel.app/index-vr.html` |

> 注意：桌面版（`index.html`）完全没动，VR 版是**新增文件**，互不影响。

---

## 相对桌面版改了什么

### 复用（原样搬过来，逻辑不变）
- 数据→压力映射：`getMappedAnxiety()`（deviation / velocity / shock → `anxiety`）
- 不可逆损伤记忆：`getDeterministicErosionMemory()`
- 逐顶点形变数学：天花板/墙体/物件的渐进侵蚀、压力场、高压波动
- 点云加载与颗粒化（jitter + 颜色扰动）
- 52 秒数据循环时间线

### 替换
- **相机**：交给头显（WebXR）。桌面端保留 OrbitControls 仅作预览。
- **渲染循环**：`renderer.setAnimationLoop()` 取代 `requestAnimationFrame`，按头显刷新率驱动。
- **形变计算**：改为**分片**——每帧只算约 1/N 的点（见 `deformSlices`），
  避免一次算完 58 万点卡住主线程、导致转头延迟。

### 移除（VR 里用不到或不兼容）
- 后处理管线 EffectComposer / UnrealBloom / RGBShift（与 WebXR 立体渲染不兼容）
- 电影化关键帧运镜 `autoView.shots`（VR 里镜头由头显控制）
- 离线导出（CCapture、JPG 序列、4K 静帧）
- Debug 面板、Audio Mixer
- 生成式音频系统（**暂未移植**，见下方「待办」）

### 新增
- `VRButton`（Enter / Exit VR）
- **手柄走动**：玩家 rig（`dolly` 组）+ 摇杆控制

---

## 控制方式

**桌面浏览器**（须用本地服务器打开，不能直接双击文件）：鼠标拖动环绕预览。
桌面上 Enter VR 按钮会显示「VR NOT SUPPORTED」，正常。

**Quest（进 VR 后）**：
- 左摇杆：前后左右移动（朝视线方向走）
- 右摇杆：上推/下拉调高度；左右拨转身（每次 30°）
- 退出：按右手柄 Meta/Oculus 标志键

---

## 可调参数：`index-vr.html` 顶部 `VR_CONFIG`

| 参数 | 当前值 | 作用 |
|------|--------|------|
| `pointKeepRatio` | `1.0` | 点云密度。`1.0`=全保留；调小=抽稀，掉帧时第一个降的旋钮 |
| `disableDuplication` | `true` | 关掉颗粒复制点（省约 38% 点数与形变开销） |
| `deformSlices` | `3` | 形变分几帧算完。越大转头越跟手、动作略软；`1`=每帧全算 |
| `roomYOffset` | `1.45` | 房间整体抬高量。**调大=你在房间里相对更低**，调小=更高 |
| `roomScale` | `1.0` | 房间整体缩放 |
| `moveSpeed` | `1.4` | 摇杆移动速度（米/秒） |
| `snapTurnDegrees` | `30` | 每次转身角度 |
| `autoPlay` | `true` | 加载后自动开始数据循环 |

换更轻的模型：改文件顶部 `MODEL_PATH`，`models/` 下有 300k / 500k / 585k 三档。

---

## 本地预览

```bash
cd "/Users/pengchanjuan/Documents/Codex/machine-anxiety-web"
python3 -m http.server 5173 --bind 127.0.0.1
```

浏览器开 `http://127.0.0.1:5173/index-vr.html`，看完终端按 `Control+C` 停。
（注意：Quest 进 VR 必须 HTTPS，局域网 http 进不去，实测走 Vercel 预览链接。）

---

## 更新 / 重新部署

改完 `index-vr.html` 后：

```bash
cd "/Users/pengchanjuan/Documents/Codex/machine-anxiety-web"
git add index-vr.html
git commit -m "VR: <这次改了啥>"
git push heavy vr-webxr-v2
```

Vercel 会自动重新构建那个 Preview，**网址不变**，约一分钟后在 Quest 上重新加载即可。

> 若 `git` 报 `index.lock ... Operation timed out`：先 `rm -f .git/index.lock` 再重试。

---

## 踩过的坑（排错记录）

- **Quest 打开要登录 Vercel 且登了也进不去**：是 Vercel「Deployment Protection →
  Vercel Authentication」在挡。到 machine-anxiety-heavy 项目 Settings 里关掉它，预览即公开可访问。
- **终端 `xcrun: unable to load libxcrun ... arm64e`**：命令行工具指向了坏掉的 Xcode。
  用 `sudo xcode-select -s /Library/Developer/CommandLineTools` 切到独立的 CLT 即可修复。
- **命令「没反应」**：多半是把 git 命令敲进了正在跑 `http.server` 的终端窗口；
  那个窗口被服务器占用，命令不会执行。先 `Control+C` 停服务器，或另开终端窗口。

---

## 已知限制 / 待办

- **无声音**：生成式音频系统尚未移植（首版刻意去掉，先把帧率单独测干净）。
  下一步可移植 Web Audio，并改成空间化（PannerNode）。
- **无后处理**：Bloom / RGB glitch 等视觉语言在 VR 里暂缺，需 shader 层重写才能上。
- **房间静止**：VR 里不让房间整体旋转，避免眩晕。
- **性能旋钮顺序**（掉帧时依次尝试）：`deformSlices` 调大 → `pointKeepRatio` 调小 →
  换 500k/300k 模型。

---

*记录于 VR 原型第二版：分片形变 + 手柄走动。后续如有大改请同步更新本文件。*
