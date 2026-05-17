# Machine Anxiety Experiments

This file records experimental branches that should stay separate from the submitted web version.

## Stable Web Line

- `main`: original submitted web version.
- `presentation-stability-v2`: current documented mother-system candidate.
- `model-replacement-v2`: reusable model replacement configuration.
- `export-pipeline-v2`: high-resolution still and sequence export controls.

## Model Tests

### `color-pointcloud-model-test-v2`

Purpose:

- Test the Scaniverse dorm-room color point cloud.
- Keep browser/web compatibility.
- Use debug controls to tune camera, particles, ceiling erasure, and overhead transition.

Model files:

```text
models/scaniverse_dorm_bbox_clean_500k.ply
models/scaniverse_dorm_bbox_clean_300k.ply
```

Saved state:

- Includes local debug controls.
- Includes pause/resume.
- Includes Capture View / Lock View / Copy Values.

### `local-heavy-model-test-v2`

Purpose:

- Test larger or more complex models for local video production.
- Not intended for Vercel deployment at first.
- Can use heavier point clouds, stronger effects, and slower render/export workflows.

Recommended use:

- Keep experiments local until a visual direction is worth saving.
- Do not commit huge exported image sequences.
- Prefer documenting model source, point count, file size, and test result.

## Working Rules

- Keep `main` unchanged while submitted versions are active.
- Use one branch per experiment direction.
- Commit only when a test state is worth returning to.
- Push to GitHub/Vercel only when a branch needs a shareable preview or backup.
