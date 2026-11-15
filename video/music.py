#!/usr/bin/env python3
"""Synthesize the background music: a slow, sustained pad under the voiceover.

Long overlapping chords with soft attacks, a sine bass and a light reverb;
no drums or short notes, so the bed stays smooth behind speech.
Writes public/music.mp3 (needs ffmpeg). Fixed seed, reproducible.

    python3 music.py
"""
import os
import subprocess
import tempfile
import wave

import numpy as np

SR = 44100
HERE_ = os.path.dirname(os.path.abspath(__file__))
# one second longer than the voiceover timeline, so the bed never runs out
DUR = float(__import__("json").load(open(os.path.join(HERE_, "src", "timings.json")))["total"]) + 1.0
N = int(SR * DUR)
BAR = 4.0  # seconds per chord
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "public", "music.mp3")
rng = np.random.default_rng(9)

# D major: Dmaj9 - Bm9 - Gmaj9 - A6sus (MIDI notes)
CHORDS = [
    (38, [62, 66, 69, 73, 76]),
    (35, [62, 66, 69, 73, 74]),
    (31, [62, 66, 67, 71, 74]),
    (33, [61, 64, 66, 69, 74]),
]
MELODY = [78, 74, 74, 73]  # one soft top note per chord


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def env(n, attack, release):
    """Slow attack, hold, slow release, in samples."""
    e = np.ones(n)
    a, r = min(int(attack * SR), n // 2), min(int(release * SR), n // 2)
    e[:a] = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, a))
    e[-r:] *= 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, r))
    return e


def pad_voice(freq, n, cents):
    t = np.arange(n) / SR
    f = freq * 2 ** (cents / 1200)
    vib = 1 + 0.0015 * np.sin(2 * np.pi * 0.21 * t + rng.uniform(0, 6))
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    # a few soft harmonics: warm, no buzz
    return np.sin(ph) + 0.28 * np.sin(2 * ph) + 0.09 * np.sin(3 * ph)


def lowpass(x, cutoff):
    spec = np.fft.rfft(x)
    freqs = np.fft.rfftfreq(len(x), 1 / SR)
    spec /= np.sqrt(1 + (freqs / cutoff) ** 4)
    return np.fft.irfft(spec, len(x))


def reverb(x, seconds=3.2, wet=0.32):
    m = int(seconds * SR)
    ir = rng.standard_normal(m) * np.exp(-np.arange(m) / SR * 6.9 / seconds)
    ir = lowpass(ir, 4500)
    ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << int(np.ceil(np.log2(len(x) + m)))
    y = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return (1 - wet) * x + wet * y


left, right = np.zeros(N), np.zeros(N)
overlap = 2.5  # each chord rings into the next, so there are no gaps
k = 0
start = 0.0
while start < DUR:
    bass, notes = CHORDS[k % 4]
    n0 = int(start * SR)
    n = min(int((BAR + overlap) * SR), N - n0)
    if n <= SR:
        break
    e = env(n, 1.6, 2.6)
    for m in notes:
        g = 0.11
        left[n0:n0 + n] += g * e * pad_voice(mtof(m), n, -5)
        right[n0:n0 + n] += g * e * pad_voice(mtof(m), n, +5)
    b = 0.30 * env(n, 0.9, 2.6) * np.sin(2 * np.pi * mtof(bass) * np.arange(n) / SR)
    left[n0:n0 + n] += b
    right[n0:n0 + n] += b
    # soft sustained top note, entering after the chord
    d = int(0.8 * SR)
    if n - d > SR:
        t = np.arange(n - d) / SR
        tone = np.sin(2 * np.pi * mtof(MELODY[k % 4]) * t) * np.exp(-t / 2.4)
        tone *= env(n - d, 0.35, 1.5)
        left[n0 + d:n0 + n] += 0.07 * tone
        right[n0 + d:n0 + n] += 0.05 * tone
    k += 1
    start += BAR

out = np.stack([reverb(lowpass(left, 2600)), reverb(lowpass(right, 2600))], axis=1)
out *= env(N, 1.5, 3.0)[:, None]
# sustained pads mask speech more than short notes, so keep the bed quiet (about -18 LUFS)
out *= 10 ** (-6.5 / 20) / np.max(np.abs(out))

with tempfile.TemporaryDirectory() as tmp:
    wav = os.path.join(tmp, "music.wav")
    with wave.open(wav, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((out * 32767).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-b:a", "160k", OUT], check=True)
print("wrote", OUT)
