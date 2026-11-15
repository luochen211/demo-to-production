#!/usr/bin/env python3
"""Synthesize the background music for one film.

    python3 music.py <film-id>

A minor-key bed at 100 BPM (120 BPM after the 1.2x speed-up) that keeps moving
under the voiceover: a sustained pad, a soft eighth-note bass pulse, a low
heartbeat kick and a quiet shaker. Layers enter one after another so the track
builds toward the end; nothing is short or bright enough to sound choppy.
Length follows films/<id>/timings.json. Writes public/<id>/music.mp3 (needs ffmpeg).
"""
import json
import os
import subprocess
import sys
import tempfile
import wave
import zlib

import numpy as np

SR = 44100
HERE = os.path.dirname(os.path.abspath(__file__))
FILM = sys.argv[1]
DUR = json.load(open(os.path.join(HERE, "films", FILM, "timings.json")))["total"] + 1.0
N = int(SR * DUR)
BPM = 100
BEAT = 60 / BPM
BAR = 4 * BEAT
OUT = os.path.join(HERE, "public", FILM, "music.mp3")
rng = np.random.default_rng(zlib.crc32(FILM.encode()))

# i - VI - iv - V in a minor key; each film gets its own key from its id
KEY = [0, 2, -2, 3, -3, 5][zlib.crc32(FILM.encode()) % 6]
PROG = [  # (bass, pad notes) in D minor before transposing
    (38, [62, 65, 69, 72]),   # Dm(add b7)
    (34, [62, 65, 69, 70]),   # Bbmaj7
    (31, [62, 65, 67, 70]),   # Gm7
    (33, [61, 64, 67, 69]),   # A7
]


def mtof(m):
    return 440.0 * 2 ** ((m + KEY - 69) / 12)


def fade(n, attack, release):
    e = np.ones(n)
    a, r = min(int(attack * SR), n // 2), min(int(release * SR), n // 2)
    if a:
        e[:a] = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, a))
    if r:
        e[-r:] *= 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, r))
    return e


def lowpass(x, cutoff):
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(spec / np.sqrt(1 + (f / cutoff) ** 4), len(x))


def highpass(x, cutoff):
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(spec * (f / cutoff) ** 2 / np.sqrt(1 + (f / cutoff) ** 4), len(x))


def reverb(x, seconds=2.6, wet=0.28):
    m = int(seconds * SR)
    ir = lowpass(rng.standard_normal(m) * np.exp(-np.arange(m) / SR * 6.9 / seconds), 5000)
    ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << int(np.ceil(np.log2(len(x) + m)))
    y = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return (1 - wet) * x + wet * y


def add(buf, at, sig):
    i = int(at * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    buf[i:i + len(sig)] += sig


pad_l, pad_r, bass, kick, shaker = (np.zeros(N) for _ in range(5))
bars = int(np.ceil(DUR / BAR))
end_bar = bars - 1  # last bar: chord rings out, rhythm stops

for b in range(bars):
    root, notes = PROG[b % 4]
    t0 = b * BAR
    # pad: each chord overlaps the next, so the bed never breaks
    n = int((BAR + 1.2) * SR)
    t = np.arange(n) / SR
    e = fade(n, 0.6, 1.4)
    for m in notes:
        for buf, cents in ((pad_l, -6), (pad_r, 6)):
            ph = 2 * np.pi * mtof(m) * 2 ** (cents / 1200) * t
            add(buf, t0, 0.07 * e * (np.sin(ph) + 0.3 * np.sin(2 * ph) + 0.1 * np.sin(3 * ph)))
    if b == end_bar:
        continue
    # bass pulse: eighth notes on the root, octave jump on the last eighth of the bar
    for k in range(8):
        m = root + (12 if k == 7 else 0)
        nn = int(0.42 * SR)
        tt = np.arange(nn) / SR
        env = (1 - np.exp(-tt / 0.004)) * np.exp(-tt / 0.16)
        tone = np.sin(2 * np.pi * mtof(m) * tt) + 0.35 * np.sin(4 * np.pi * mtof(m) * tt)
        add(bass, t0 + k * BEAT / 2, (0.30 if k % 2 == 0 else 0.22) * env * tone)
    # heartbeat kick: beats 1 and 3, from bar 2
    if b >= 2:
        for k in (0, 2):
            nn = int(0.32 * SR)
            tt = np.arange(nn) / SR
            f = 46 + 70 * np.exp(-tt / 0.03)
            add(kick, t0 + k * BEAT, 0.55 * np.exp(-tt / 0.11) * np.sin(2 * np.pi * np.cumsum(f) / SR))
    # shaker on the off-beats, from bar 4
    if b >= 4:
        for k in range(4):
            nn = int(0.09 * SR)
            add(shaker, t0 + (k + 0.5) * BEAT, 0.05 * np.exp(-np.arange(nn) / SR / 0.025) * rng.standard_normal(nn))

# build: rhythm layers grow louder across the film
grow = np.interp(np.arange(N) / SR, [0, DUR * 0.25, DUR * 0.8, DUR], [0.55, 0.75, 1.0, 1.0])
bass = lowpass(bass, 700) * grow
kick = lowpass(kick, 300) * grow
shaker = highpass(shaker, 6000) * grow
left = lowpass(pad_l, 2400) + bass + kick + shaker
right = lowpass(pad_r, 2400) + bass + kick + shaker * 0.8
out = np.stack([reverb(left), reverb(right)], axis=1)
out *= fade(N, 0.8, 2.5)[:, None]
out *= 10 ** (-3.0 / 20) / np.max(np.abs(out))  # about -18 LUFS

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with tempfile.TemporaryDirectory() as tmp:
    wav = os.path.join(tmp, "music.wav")
    with wave.open(wav, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((out * 32767).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-b:a", "160k", OUT], check=True)
print("wrote", OUT)
