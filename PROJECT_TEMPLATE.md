# Machine Anxiety System Template

This document describes the reusable structure behind the current `presentation-stability-v2` branch. The goal is to treat this project as a mother system for future works, while keeping the submitted `main` branch unchanged.

## Current Template Branch

- Branch: `presentation-stability-v2`
- Preview: https://machine-anxiety-git-presenta-b4fbda-chanjuanpeng-cells-projects.vercel.app
- Stable submitted branch: `main`
- Stable submitted URL: https://machine-anxiety.vercel.app

## Core System

The current system follows this pipeline:

```text
Data source
-> data normalisation
-> anxiety / deviation / velocity / shock
-> point-cloud deformation
-> camera pressure
-> post-processing
-> layered Web Audio
-> browser / video export
```

## Replaceable Parts

### 1. Model Source

Current model:

```text
room_scan_test2.ply
```

Future projects can replace this with other point-cloud scans.

When replacing the model, check:

- file path
- point count
- scale
- centering
- initial camera position
- pressure origin
- point size
- opacity
- performance on browser and Vercel

### 2. Data Source

Current data:

```text
chronicle_data.json
```

Supported future data-source types:

```text
Static Historical Data
Remote Snapshot API
Live External Stream
User Interaction Input
Embodied / Sensor Input
```

All incoming data should be normalised into shared system signals before driving visual, sound, camera, and export systems.

Suggested shared signals:

```text
anxiety
deviation
velocity
shock
presence
proximity
agitation
noise
breath
```

### 3. Data Mapping

Current mapping uses:

```text
deviation
velocity
shock
```

These are combined into `targetAnxiety` and also used by the sound system.

Future mapping experiments can test:

- different baselines
- rolling averages
- volatility windows
- thresholds for shock events
- multi-source data mixing
- user input mixed with historical data

### 4. Visual System

Current visual system:

- Three.js scene
- PLY point cloud
- CPU point deformation
- directional pressure origin
- collapse / detached point behaviour
- fog
- bloom
- RGB shift

Future visual directions:

- GPU shader deformation
- scan-slice displacement
- data-loss holes
- multiple point-cloud models
- LOD models for performance
- pressure sources from doors, windows, screens, or body zones

### 5. Camera System

Current camera system:

- OrbitControls
- auto-rotation
- anxiety-driven camera distance
- breathing drift
- cycle reset

Future camera presets:

```text
orbit
slow push
fixed surveillance
first-person interior
export still
installation loop
```

### 6. Sound System

Current sound system:

- low-frequency machine oscillator
- sub oscillator
- room noise
- event noise
- air noise
- stereo panning
- compressor / master output
- data-driven mapping from deviation, velocity, and shock

Future sound directions:

- headphone mix
- installation speaker mix
- convolution reverb
- multi-channel output
- sensor-driven sound
- external sound export to Reaper / Ableton
- OSC or MIDI control from TouchDesigner

### 7. UI / Overlay

Current UI:

- intro overlay
- date / exchange-rate / spatial condition readout
- loading status
- failure status

Future UI modes:

```text
minimal artwork mode
debug mode
installation operator mode
portfolio documentation mode
```

### 8. Export System

Current export:

- `K` key starts / stops CCapture export
- JPG sequence
- 2880 x 1620
- 60 fps
- 3600 frames

Future export work:

- 4K / 8K stills
- PNG sequence
- WebM preview
- fixed random seed
- camera presets
- automatic still-frame capture
- export-only quality preset

Do not commit large exported image sequences to GitHub.

## External Software Connections

### TouchDesigner

Best for:

- installation control
- projection mapping
- sensors
- MIDI / OSC / DMX
- multi-screen output
- live performance control

Possible connection methods:

- OSC
- WebSocket
- Spout / Syphon / NDI video routing
- browser window capture
- TouchDesigner controlling data parameters externally

### Unreal Engine

Best for:

- immersive environment version
- high-quality lighting
- VR / XR
- first-person navigation
- Pixel Streaming
- large-scale spatial installation

Possible connection methods:

- Unreal Pixel Streaming
- OSC / WebSocket data bridge
- TouchEngine for UE if using TouchDesigner components
- exporting point-cloud / mesh assets into UE

## Preset System To Add Later

Future versions should support named presets:

```text
web-preview
submitted-video
installation
headphone
speaker
export-stills
export-video
mobile-safe
```

Each preset should control:

- model path
- data mode
- mapping constants
- point size / opacity
- deformation strength
- audio levels
- camera behaviour
- export resolution

## Fallback Rules

Future versions should define fallbacks:

- if live data fails, use static JSON
- if high-density model fails, load a lower-density model
- if audio is blocked, keep visual system running
- if external API fails, show a quiet error state
- if export mode is active, avoid network-dependent data

## Recommended Future Branches

```text
model-replacement-v2
shader-deformation-v2
sound-composition-v2
export-pipeline-v2
touchdesigner-installation-v2
unreal-immersive-v2
structure-v2
```

## Important Rule

Do not merge experimental branches into `main` while the original submitted version needs to remain unchanged.
