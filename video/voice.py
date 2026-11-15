#!/usr/bin/env python3
"""Synthesize one clip per subtitle line for one film.

    python3 voice.py <film-id>

Reads films/<id>/script.json, writes public/<id>/voice.mp3 and films/<id>/timings.json.
Needs TTS_URL (an OpenAI-style /v1/audio/speech clone endpoint), TTS_TOKEN_FILE,
TTS_REF_AUDIO and TTS_REF_TEXT, from the environment or from video/.env.local
(KEY=value lines, git-ignored). Clips are cached in voice-cache/.
"""
import hashlib, json, math, os, subprocess, sys, wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ENV = ROOT / ".env.local"
if ENV.exists():
    for row in ENV.read_text().splitlines():
        if "=" in row and not row.lstrip().startswith("#"):
            k, v = row.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())
SPEED = float(os.environ.get("VOICE_SPEED", "1.15"))
LEAD, GAP, SEG_GAP, TAIL = 0.35, 0.35, 0.8, 3.0
BEAT = 1.2  # two beats at the music's 100 BPM; segment cuts land on this grid
# spoken forms: subtitles keep the written text, the voice reads these
SAY = {"幂等": "密等"}  # a film can add more under "say" in its script.json


def tts(text, out):
    token = Path(os.environ["TTS_TOKEN_FILE"]).expanduser().read_text().strip()
    cmd = ["curl", "-q", "-sS", "--max-time", "600", "-H", f"Authorization: Bearer {token}",
           "-o", str(out), "-w", "%{http_code}", "-F", f"text={text}",
           "-F", f"ref_audio=@{os.environ['TTS_REF_AUDIO']}", "-F", f"ref_text={os.environ['TTS_REF_TEXT']}",
           os.environ["TTS_URL"]]
    code = subprocess.run(cmd, text=True, capture_output=True, check=True).stdout.strip()
    if code != "200":
        out.unlink(missing_ok=True)
        raise SystemExit(f"TTS returned HTTP {code}")


def wav_len(p):
    with wave.open(str(p)) as w:
        return w.getnframes() / w.getframerate()


def main():
    film = sys.argv[1]
    script = json.loads((ROOT / "films" / film / "script.json").read_text())
    for k, v in script.get("say", {}).items():
        SAY[k] = v
    cache = ROOT / "voice-cache"
    cache.mkdir(exist_ok=True)
    t, lines, segs, clips = LEAD, [], [], []
    for si, seg in enumerate(script["segments"]):
        seg_start = 0.0
        if si:
            seg_start = math.ceil((t - SEG_GAP / 2) / BEAT) * BEAT
            t = seg_start + SEG_GAP / 2
        for li, rows in enumerate(seg["lines"]):
            say = "".join(rows).replace("「", "").replace("」", "")
            for k, v in SAY.items():
                say = say.replace(k, v)
            raw = cache / (hashlib.sha1(say.encode()).hexdigest()[:16] + ".wav")
            if not raw.exists():
                print("synth:", say, flush=True)
                tts(say, raw)
            fast = raw.with_name(f"{raw.stem}-x{SPEED}.wav")
            if not fast.exists():
                subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af",
                                f"silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,atempo={SPEED}",
                                "-ar", "48000", "-ac", "1", str(fast)], check=True)
            d = wav_len(fast)
            lines.append({"seg": si, "rows": rows, "start": round(t, 3), "dur": round(d, 3)})
            clips.append((fast, t))
            last = li == len(seg["lines"]) - 1
            t += d + (SEG_GAP if last else GAP)
        segs.append({"name": seg["name"], "start": round(seg_start, 3)})
    total = math.ceil((t - SEG_GAP + TAIL) / (BEAT * 2)) * BEAT * 2
    inputs, fc = [], []
    for k, (f, at) in enumerate(clips):
        inputs += ["-i", str(f)]
        fc.append(f"[{k}:a]adelay={int(at * 1000)}:all=1[a{k}]")
    graph = ";".join(fc) + ";" + "".join(f"[a{k}]" for k in range(len(clips))) + \
        f"amix=inputs={len(clips)}:normalize=0,apad=whole_dur={total:.3f}[out]"
    (ROOT / "public" / film).mkdir(parents=True, exist_ok=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", graph, "-map", "[out]",
                    "-t", f"{total:.3f}", "-b:a", "128k", str(ROOT / "public" / film / "voice.mp3")], check=True)
    (ROOT / "films" / film / "timings.json").write_text(json.dumps(
        {"total": round(total, 3), "title": script["title"], "source": script["source"], "segments": segs, "lines": lines},
        ensure_ascii=False, indent=1) + "\n")
    print(f"OK {total:.1f}s, {len(lines)} lines")


if __name__ == "__main__":
    main()
