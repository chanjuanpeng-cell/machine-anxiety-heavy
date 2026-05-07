# Export Pipeline Guide

This branch prepares Machine Anxiety for higher-quality still and sequence output while keeping the live web version unchanged.

## Current Branch

- Branch: `export-pipeline-v2`
- Based on: `model-replacement-v2`
- Purpose: separate live preview behaviour from export behaviour and make output settings easier to adjust.

## Export Controls

```text
S = save one high-resolution PNG still
K = start / stop JPG sequence export
```

## Current Export Settings

The export settings are grouped inside `SYSTEM_CONFIG.export` in `index.html`:

```js
export: {
    sequenceWidth: 2880,
    sequenceHeight: 1620,
    sequenceFrames: 3600,
    sequenceFramerate: 60,
    sequenceName: 'Machine_Anxiety_FinalFlow_HQ',
    stillWidth: 3840,
    stillHeight: 2160,
    stillName: 'Machine_Anxiety_Still'
}
```

## Still Export

The still export is intended for:

- portfolio images
- submission screenshots
- documentation
- testing composition at higher resolution

Current still format:

```text
PNG
3840 x 2160
```

## Sequence Export

The sequence export is intended for:

- final video compositing
- Premiere Pro / After Effects workflow
- archival high-quality renders

Current sequence format:

```text
JPG sequence
2880 x 1620
60 fps
3600 frames
```

At 60 fps, 3600 frames equals 60 seconds.

## Important Notes

- Sequence export can create many downloaded image files.
- Do not commit exported image sequences to GitHub.
- Keep exported stills and videos in a separate local archive folder.
- Use the browser preview for testing movement before exporting.
- Use still export first to check framing before running a long sequence export.

## Future Improvements

- Add named export presets.
- Add PNG sequence export.
- Add WebM preview export.
- Add fixed-seed render mode.
- Add camera presets for stills.
- Add a dedicated export-only HTML page.
