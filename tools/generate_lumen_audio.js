#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'chronicle_data.json');
const OUT_DIR = path.join(ROOT, 'exports', 'audio');
const OUT_PATH = path.join(OUT_DIR, 'Machine_Anxiety_Lumen_Submission_1080p30.wav');

const SAMPLE_RATE = 48000;
const DURATION_SEC = 60;
const CHANNELS = 2;
const BASELINE_RATE = 9.00;
const RATE_RANGE_FOR_DEVIATION = 0.72;
const RATE_RANGE_FOR_VELOCITY = 0.32;
const SHOCK_THRESHOLD = 0.18;
const DEVIATION_WEIGHT = 0.62;
const VELOCITY_WEIGHT = 0.30;
const SHOCK_WEIGHT = 0.26;

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function hashNoise(n) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

function mappedDataAt(data, progress) {
  const index = Math.min(data.length - 1, Math.floor(progress * data.length));
  const active = data[index];
  const previous = data[Math.max(0, index - 1)];
  const direction = active.rate - previous.rate;
  const movement = Math.abs(direction);
  const deviation = clamp(Math.abs(active.rate - BASELINE_RATE) / RATE_RANGE_FOR_DEVIATION);
  const velocity = clamp(movement / RATE_RANGE_FOR_VELOCITY);
  const shock = clamp((movement - SHOCK_THRESHOLD) / RATE_RANGE_FOR_VELOCITY);
  const anxiety = clamp(deviation * DEVIATION_WEIGHT + velocity * VELOCITY_WEIGHT + shock * SHOCK_WEIGHT);
  return { index, rate: active.rate, date: active.date, direction, movement, deviation, velocity, shock, anxiety };
}

function writeWav(filePath, left, right) {
  const frameCount = left.length;
  const bytesPerSample = 2;
  const blockAlign = CHANNELS * bytesPerSample;
  const byteRate = SAMPLE_RATE * blockAlign;
  const dataSize = frameCount * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(CHANNELS, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < frameCount; i++) {
    const l = Math.round(clamp(left[i], -1, 1) * 32767);
    const r = Math.round(clamp(right[i], -1, 1) * 32767);
    buffer.writeInt16LE(l, offset); offset += 2;
    buffer.writeInt16LE(r, offset); offset += 2;
  }
  fs.writeFileSync(filePath, buffer);
}

const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
fs.mkdirSync(OUT_DIR, { recursive: true });

const samples = SAMPLE_RATE * DURATION_SEC;
const left = new Float32Array(samples);
const right = new Float32Array(samples);
let lowPhase = 0;
let machinePhase = 0;
let airPhase = 0;
let memory = 0;
let lastIndex = -1;
let impulse = 0;
let lastNoise = 0;
let lpNoise = 0;
let hpNoise = 0;

for (let i = 0; i < samples; i++) {
  const t = i / SAMPLE_RATE;
  const progress = clamp(t / DURATION_SEC);
  const m = mappedDataAt(data, progress);

  if (m.index !== lastIndex) {
    impulse = Math.max(impulse, m.shock * 0.9 + m.velocity * 0.18);
    lastIndex = m.index;
  }

  const rising = clamp(m.direction / RATE_RANGE_FOR_VELOCITY);
  const falling = clamp(-m.direction / RATE_RANGE_FOR_VELOCITY);
  memory = clamp(memory + (m.anxiety * 0.022 + rising * 0.026 + m.shock * 0.048 + falling * 0.005 - (1 - m.anxiety) * 0.0012) / SAMPLE_RATE);

  const fadeIn = smoothstep(0, 4, t);
  const fadeOut = 1 - smoothstep(DURATION_SEC - 5, DURATION_SEC, t);
  const fade = fadeIn * fadeOut;

  lowPhase += (2 * Math.PI * (28 + m.deviation * 8 + memory * 10)) / SAMPLE_RATE;
  machinePhase += (2 * Math.PI * (43 + m.velocity * 14 + m.shock * 20)) / SAMPLE_RATE;
  airPhase += (2 * Math.PI * (0.06 + m.anxiety * 0.18)) / SAMPLE_RATE;

  const rawNoise = hashNoise(i * 0.37 + Math.floor(t * 60) * 19.17);
  lpNoise += (rawNoise - lpNoise) * 0.015;
  hpNoise = rawNoise - lpNoise;
  lastNoise += (hpNoise - lastNoise) * (0.18 + m.shock * 0.22);

  const low = Math.sin(lowPhase) * (0.055 + memory * 0.11 + m.deviation * 0.055);
  const machine = (Math.sin(machinePhase) + 0.45 * Math.sin(machinePhase * 2.01)) * (0.018 + m.velocity * 0.055 + m.shock * 0.035);
  const air = lastNoise * (0.012 + m.velocity * 0.045 + m.shock * 0.09 + memory * 0.015);
  const roomBreath = Math.sin(2 * Math.PI * (0.095 + memory * 0.06) * t) * (0.025 + memory * 0.055);

  impulse *= Math.exp(-1 / (SAMPLE_RATE * (0.12 + m.shock * 0.18)));
  const event = impulse * hashNoise(i * 7.7) * (0.10 + m.shock * 0.18);

  const pan = Math.sin(airPhase) * 0.24 + m.shock * 0.18 - m.velocity * 0.08;
  const mono = (low + machine + air + roomBreath + event) * fade;
  const width = 0.55 + m.velocity * 0.22 + m.shock * 0.18;
  left[i] = mono * (1 - pan * width) * 0.72;
  right[i] = mono * (1 + pan * width) * 0.72;
}

writeWav(OUT_PATH, left, right);
console.log(`Generated ${OUT_PATH}`);
console.log(`${DURATION_SEC}s, ${SAMPLE_RATE} Hz, stereo WAV`);
