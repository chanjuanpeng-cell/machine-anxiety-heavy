# Model Replacement Guide

This branch prepares Machine Anxiety for future works that use different scanned spaces, objects, rooms, or point-cloud bodies.

## Current Branch

- Branch: `model-replacement-v2`
- Based on: `presentation-stability-v2`
- Purpose: make the model, camera, material, pressure origin, data path, and export size easier to replace without changing the deeper animation system.

## Main Configuration

The replaceable model settings are now grouped near the top of `index.html`:

```js
const SYSTEM_CONFIG = {
    model: {
        label: 'ROOM SCAN',
        path: 'room_scan_test2.ply',
        pointSize: 0.0075,
        pointOpacity: 0.82,
        pointColor: 0xd0d0d0,
        alphaTest: 0.12,
        startCamera: new THREE.Vector3(-0.599, 0.323, 2.251),
        startTarget: new THREE.Vector3(0.125, 0.225, -0.06),
        pressureOrigin: new THREE.Vector3(-1.15, 0.22, 1.35),
        pressureRadius: 2.65
    }
};
```

## How To Replace The Model

1. Add the new `.ply` file to the project folder.
2. Change `SYSTEM_CONFIG.model.path` to the new file name.
3. Adjust `pointSize` and `pointOpacity` until the scan reads clearly.
4. Adjust `startCamera` and `startTarget` so the opening view frames the new model.
5. Move `pressureOrigin` to the part of the model where the external pressure should enter.
6. Adjust `pressureRadius` to control how wide that pressure field feels.
7. Test in the browser before pushing to GitHub.

## What To Check Visually

- Is the scan centered?
- Is the first frame legible?
- Is the point size too thick or too sparse?
- Does the camera begin inside, outside, or too far from the model?
- Does deformation happen in a meaningful part of the model?
- Does the model still feel spatial, rather than becoming a flat cloud?
- Does the browser remain smooth?

## Model Preparation Notes

For future scans, keep a clean source archive outside GitHub and commit only the web-ready version.

Recommended model variants:

```text
source-high
web-medium
web-mobile
export-high
```

Avoid committing very large test exports or image sequences to GitHub.

## Future Improvements

- Add a visible debug mode for camera and pressure coordinates.
- Add multiple model presets.
- Add lower-density fallback models.
- Move the configuration into a separate JavaScript file when the project structure is split.
