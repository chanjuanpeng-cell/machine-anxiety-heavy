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
| 短网址（生产域名，推荐分享） | `https://machine-anxiety-heavy.vercel.app/vr`（2026-06-16 起，见下方「生产域名短路径 /vr」） |

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

## 生产域名短路径 /vr（2026-06-16 新增）

**背景**：分支预览网址太长（`...-git-vr-...-chanjuanpeng-cells-projects.vercel.app/index-vr.html`），
在 Quest 里手输很痛苦。改用生产域名上的一条短路径，方便分享与输入。

**最终网址**：`https://machine-anxiety-heavy.vercel.app/vr`
（旧的预览长链接和 `/index-vr.html` 仍然有效）

**做法**：往**生产分支 `main`** 上新增两个文件（桌面版 `index.html` 一行没动，风险极低、可回退）：

1. `index-vr.html`（从 `vr-webxr-v2` 取来；它依赖的模型 585k 和 `chronicle_data.json` 桌面版已在 `main` 上，无需额外搬运）。
2. `vercel.json`，只加一条精确重写：

```json
{
  "rewrites": [
    { "source": "/vr", "destination": "/index-vr.html" }
  ]
}
```

`/vr` 只匹配这一个路径，根路径（桌面版）和其他地址都不受影响。

**回退**：删掉 `main` 上这两个文件再推一次即可恢复原状。

> 说明：VR 代码仍以 `vr-webxr-v2` 分支为开发主线；`main` 上的 `index-vr.html` 是「拿来发布」的副本。
> 改完 VR 后若要更新生产 `/vr`，需把新的 `index-vr.html` 同步到 `main` 再推。

---

## 踩过的坑（排错记录）

- **Quest 打开要登录 Vercel 且登了也进不去**：是 Vercel「Deployment Protection →
  Vercel Authentication」在挡。到 machine-anxiety-heavy 项目 Settings 里关掉它，预览即公开可访问。
- **终端 `xcrun: unable to load libxcrun ... arm64e`**：命令行工具指向了坏掉的 Xcode。
  用 `sudo xcode-select -s /Library/Developer/CommandLineTools` 切到独立的 CLT 即可修复。
- **命令「没反应」**：多半是把 git 命令敲进了正在跑 `http.server` 的终端窗口；
  那个窗口被服务器占用，命令不会执行。先 `Control+C` 停服务器，或另开终端窗口。
- **`git fetch/push` 报 `rev-list died of signal 10`（SIGBUS）**：本地仓库对象库损坏
  （2026-06-16 遇到）。删 `.git/objects/info/commit-graph` 缓存没修好，说明损坏更深。
  **绕过办法**：在 `/tmp` 全新 `git clone` 一份干净副本，在干净副本里改文件、推送，
  不依赖坏掉的本地仓库。事后再用 `git fsck --full` 排查，或干脆把本地目录重新 clone 一份替换。

---

## 已知限制 / 待办

- ~~**无声音**~~ **已加声音（2026-06-16）**：生成式音频系统已移植，并做了**真 3D 空间化**
  （HRTF panner + 听者绑头显），转头时声音方位会变。原方案见下方「声音移植方案」（保留作记录），
  实际落地差异见「声音落地记录」。
- **无后处理**：Bloom / RGB glitch 等视觉语言在 VR 里暂缺，需 shader 层重写才能上。
- **房间静止**：VR 里不让房间整体旋转，避免眩晕。
- **性能旋钮顺序**（掉帧时依次尝试）：`deformSlices` 调大 → `pointKeepRatio` 调小 →
  换 500k/300k 模型。

---

## 声音移植方案（下一步）

目标：把桌面版的生成式音频搬进 VR，并做**真 3D 空间化**——让声音从房间里的具体位置传来，
随头显转动而改变方位，强化「站进房间」的沉浸感。

### 桌面版音频系统长什么样（在 `index.html` 里）

| 部件 | 位置 | 作用 |
|------|------|------|
| `initSoundSystem()` | 约 L976 | 搭建 Web Audio 图：`masterOutput`(gain) → `compressorNode` → `destination` |
| 四层声源 | L990–L1032 | 机器音 `oscillator`+`subOscillator`(子低频)、房间噪声 `roomNoiseSource`、事件噪声 `eventNoiseSource`、空气噪声 `airNoiseSource`；每层各带 gain + biquad 滤波 + **`StereoPanner`** |
| `createNoiseBuffer()` | 约 L966 | 生成循环噪声缓冲 |
| `updateDataDrivenSound(now,endFade,accum)` | 约 L1490 | **每帧**读 `currentSoundMapping`(anxiety/deviation/velocity/shock/movement) 驱动各层增益/频率/滤波；含「累积张力→屋顶坍塌时音频高潮」逻辑 |
| 开关 | `soundEnabled` / `isAudioInitialized` | 须在用户手势后 `audioCtx.resume()`（浏览器自动播放限制） |

> VR 版已经复用了数据引擎，`currentSoundMapping` 在 VR 里同样可算出来，所以音频逻辑能直接对接。

### 移植步骤

1. **搬骨架**：把 `createNoiseBuffer()`、`initSoundSystem()`、`updateDataDrivenSound()` 三个函数
   搬进 `index-vr.html`，去掉桌面专用的部分（`buildAudioMixer` 调试 UI、`startAudioRecording`/CCapture 录音——这些 VR 用不到）。
2. **2D→3D 换 panner**：把每层的 `createStereoPanner()` 换成 `audioCtx.createPanner()`
   （`panningModel='HRTF'`, `distanceModel='inverse'`），给每个声源一个房间内的世界坐标
   （`panner.positionX/Y/Z`）。机器音可锚在某件物体上，空气/房间噪声可设为近似环境声（距离衰减小或直接走非空间化的 ambient 层）。
3. **听者绑头显**：每帧用 `renderer.xr.getCamera()` 取头显位姿，写入 `audioCtx.listener`
   的 `positionX/Y/Z` 与 `forwardX/Y/Z`+`upX/Y/Z`（朝向向量由相机四元数算）。这样转头时方位感才正确。
4. **手势启动**：WebXR 里在「Enter VR」或首次扣扳机时 `audioCtx.resume()`，绕过自动播放限制
   （`VRButton` 的 sessionstart 回调里做最稳）。
5. **每帧调用**：在 `setAnimationLoop` 里调 `updateDataDrivenSound(...)` + 更新 listener 位姿。
   音频跑在 Web Audio 自己的线程，几乎不吃主线程；**不要**和 `deformSlices` 抢预算即可，掉帧不影响声音。

### 坑预警

- **方位反了/不动**：多半是 listener 的 forward/up 向量没用相机四元数正确算，或没每帧更新。
- **没声音**：八成是没在用户手势里 `resume()`，或 Quest 把音量/音频会话停了。
- **太吵/糊**：HRTF + 多层噪声在头显里比桌面更闷，`masterOutput` 增益和各层滤波截止频率要重新调一遍。
- **性能**：纯 Web Audio 开销极小；真要省，先降的是视觉旋钮（见上方性能顺序），不是音频。

### 验收

进 VR 后：能听到声音随汇率压力变化、屋顶坍塌时有高潮；**转头时声音方位跟着变**；帧率不掉。

---

## 声音落地记录（2026-06-16 已实现）

按上方方案移植，实际做法与几处取舍：

- **搬入的函数**：`createNoiseBuffer` / `initSoundSystem` / `updateDataDrivenSound` /
  `triggerDataClick` / `triggerOverloadGlitch`，去掉了 Mixer 调试 UI 与录音相关代码。
  桌面版的 `SOUND_MIX` / `SOUND_MASTER_GAIN` / `SOUND_LAYER_GAIN` 原值照搬。
- **2D→3D**：每层 `StereoPanner` 换成 `PannerNode`（`panningModel='HRTF'`,
  `distanceModel='inverse'`）。位置在文件顶部 `SOUND_POS` 集中配置（世界坐标，房间中心约
  `(0, roomYOffset, 0)`）：
  - 机器音/子低频/数据 click 锚在**压力源** `PRESSURE_ORIGIN` 处，贴身定位（refDistance 1.2、rolloff 0.9）。
  - 房间噪声、空气噪声作**宽环境床**（refDistance 4–5、rolloff 0.2–0.25），走到哪都在、只是方位感弱。
  - 事件/glitch 噪声放在**远角**，定位明显。
- **听者绑头显**：`updateAudioListener()` 每帧用 `renderer.xr.getCamera()`（桌面退回普通相机）
  取世界位姿，朝向/up 向量由相机四元数算，写进 `audioCtx.listener`。所以转头方位才正确。
- **手势启动**：首次 `pointerdown`/`keydown`（桌面）或 `xr.sessionstart`（Quest）时
  `initSoundSystem()` 里 `audioCtx.resume()`，绕过自动播放限制。左上角有 "♪ Sound on…" 提示，启动后消失。
- **高潮/淡出**：`accum = erosionMemory*0.6 + threshold(progress,0.62,0.96)`，喂给音频让屋顶坍塌时鼓胀；
  outro 段做 0.6 的轻淡出，循环重启时自然续上。

> 想调音量/方位：改顶部 `SOUND_MIX`（各层增益）和 `SOUND_POS`（各层世界坐标）。
> HRTF 在头显里比桌面闷，若太糊先降 `SOUND_MIX.room/air` 或把 ambient 床的 rolloff 再调小。

---

*记录于 VR 原型第二版：分片形变 + 手柄走动。后续如有大改请同步更新本文件。*
*声音移植方案补于 2026-06-16；同日完成 3D 空间化音频落地（见「声音落地记录」）。*
