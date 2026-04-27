# Machine Anxiety

A data-driven moving image work exploring how economic systems affect private space.

## Overview

Machine Anxiety is based on a 3D scan of a private room, reconstructed as a point-cloud environment.

The work uses real GBP/CNY exchange-rate data (September 2024 – April 2026) as a continuous input to drive spatial deformation, rotation, and camera movement.

The project exists as a real-time WebGL system driven by historical GBP/CNY exchange-rate data, where past financial fluctuations are reactivated as a continuous computational force.

## Live Version

👉 [View the real-time version](https://machine-anxiety.vercel.app/)

## Video

👉 [Watch the final video](https://vimeo.com/1182278340)

## Technical Notes

* Built with Three.js and WebGL  

* Point cloud reconstructed from LiDAR scan  

* ~300k vertices  

* Data-driven system using GBP/CNY exchange rates (JSON)  

* Parameters mapped to:

  * spatial deformation

  * rotation speed

  * camera movement

  * visual density

* Offline rendering via CCapture.js (JPG sequence)

* Final video composed in Adobe Premiere Pro

## Running Locally

Download the repository and open:

index.html

(For best performance, use Chrome or Safari.)

## Data
The dataset consists of historical GBP/CNY exchange-rate values recorded between September 2024 and April 2026.
Data is used as a continuous input to drive the system, rather than being visualised directly.

## License
Artwork and code © Peng Chanjuan, 2026
All rights reserved.
This repository is shared for viewing and reference only.
Please do not reuse or redistribute without permission.