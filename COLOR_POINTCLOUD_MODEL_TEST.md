# Color Point-Cloud Model Test

This branch tests a Scaniverse dorm-room point cloud inside the Machine Anxiety system.

## Current Branch

- Branch: `color-pointcloud-model-test-v2`
- Based on: `export-pipeline-v2`
- Purpose: test a cleaned color point cloud before developing a full new model-based version.

## Test Models

```text
models/scaniverse_dorm_bbox_clean_500k.ply
models/scaniverse_dorm_bbox_clean_300k.ply
```

The current web test uses:

```text
models/scaniverse_dorm_bbox_clean_500k.ply
```

## Current Model Settings

```js
model: {
    label: 'DORM SCAN',
    path: 'models/scaniverse_dorm_bbox_clean_500k.ply',
    pointSize: 0.0088,
    pointOpacity: 0.92,
    pointColor: 0xffffff,
    useVertexColors: true,
    axisRemap: 'scaniverseRoom',
    viewMode: 'ceilingErasure',
    crop: { enabled: false },
    ceilingErasure: {
        enabled: true,
        startAnxiety: 0.30,
        fullAnxiety: 0.62,
        overheadStartAnxiety: 0.52,
        overheadFullAnxiety: 0.86,
        heightStart: 1.62,
        heightFull: 0.92,
        ceilingDrift: 10.5,
        roomDeformBoost: 0.065
    },
    alphaTest: 0.08,
    startCamera: new THREE.Vector3(-4.15, 0.72, 2.45),
    startTarget: new THREE.Vector3(0.25, 0.34, 0.08),
    overheadCamera: new THREE.Vector3(0.12, 4.85, 0.72),
    overheadTarget: new THREE.Vector3(0.22, -0.08, 0.02),
    pressureOrigin: new THREE.Vector3(0.75, 0.2, 1.0),
    pressureRadius: 3.9
}
```

The Scaniverse coordinate system is remapped from `x/y/z` to `x/z/-y` so the long room axis becomes depth rather than vertical height in Three.js.

This test now uses a ceiling-erasure viewing mode. It starts from a lower side view, lifts ceiling particles out of the camera path first, then blends into a closer overhead view where the room interior becomes the main deformation surface.

## What To Check

- Does the color point cloud load clearly?
- Is the first view too close or too far?
- Does the model read as a dorm/private space?
- Are the colors useful, or should the work return to monochrome?
- Does 500k points still run smoothly?
- Would the 300k version be enough for browser preview?

## Next Tuning Options

- Lower `pointSize` if the model feels too dense.
- Lower `pointOpacity` if color becomes too heavy.
- Switch to the 300k model if performance drops.
- Move `pressureOrigin` after checking where the room should visually erode first.
