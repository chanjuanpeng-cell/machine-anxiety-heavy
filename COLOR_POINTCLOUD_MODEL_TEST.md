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
    pointSize: 0.0062,
    pointOpacity: 0.88,
    pointColor: 0xffffff,
    useVertexColors: true,
    alphaTest: 0.12,
    startCamera: new THREE.Vector3(-0.35, 0.42, 5.2),
    startTarget: new THREE.Vector3(0.12, 0.12, 0.0),
    pressureOrigin: new THREE.Vector3(0.8, 0.05, 1.2),
    pressureRadius: 3.1
}
```

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
