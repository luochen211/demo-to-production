# Chapter videos

Short explainer animations embedded in the book, one per chapter section. They are drawn in code with [Remotion](https://www.remotion.dev/), so a wording change only needs a new voiceover and a re-render.

| Path | Purpose |
| --- | --- |
| `films/<id>/script.json` | Segments and subtitle lines (the voiceover reads the same text); optional `say` gives spoken forms for numbers or terms |
| `films/<id>/Film.jsx` | The film's scenes, one per segment |
| `films/<id>/index.jsx` | Remotion entry for that film |
| `films/<id>/timings.json` | Line and segment times, written by `voice.py` |
| `src/kit.jsx`, `src/shell.jsx` | Shared drawing components, and the frame every film uses (captions, badges, audio) |
| `voice.py <id>` | Synthesizes each line, writes `public/<id>/voice.mp3` and `films/<id>/timings.json` |
| `music.py <id>` | Synthesizes the background music to the film's length, writes `public/<id>/music.mp3` |
| `render.sh <id>` | Renders a 1x master into `out/`, then writes `../docs/public/book/<id>.mp4` at 1.2x speed |
| `public/` | Per-film audio, the corner avatar and logo (from the luo-chen-com site), and the WeChat and Alipay icons (Simple Icons, CC0) |

```bash
cd video
npm install
npx remotion studio films/<id>/index.jsx   # preview
python3 voice.py <id>                      # only when script.json changes
python3 music.py <id>
./render.sh <id>
```

`voice.py` expects a voice-clone endpoint in `TTS_URL`, plus `TTS_TOKEN_FILE`, `TTS_REF_AUDIO` and `TTS_REF_TEXT`, either in the environment or as `KEY=value` lines in `video/.env.local` (git-ignored).

The music is synthesized by `music.py` (numpy and ffmpeg), so it carries no third-party license: a minor-key pad with an eighth-note bass pulse, a soft kick and a shaker that build over the film, at 100 BPM before the 1.2x speed-up.
