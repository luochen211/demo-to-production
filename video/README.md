# Chapter videos

One-minute explainer animations embedded in the book. They are drawn in code with [Remotion](https://www.remotion.dev/), so a wording change only needs a re-render.

| File | Purpose |
| --- | --- |
| `script.json` | Segments and subtitle lines (the voiceover reads the same text) |
| `voice.py` | Synthesizes each line, writes `public/voice.mp3` and `src/timings.json` |
| `src/Film.jsx`, `src/kit.jsx` | Scenes and shared drawing components |
| `music.py` | Synthesizes the background music, writes `public/music.mp3` |
| `public/` | Voiceover, music, and the corner avatar and logo (from the luo-chen-com site) |

```bash
cd video
npm install
npm run studio   # preview
npm run render   # writes ../docs/public/book/ch09-callback.mp4
```

Re-running `voice.py` is only needed when `script.json` changes. It expects a voice-clone endpoint in `TTS_URL`, plus `TTS_TOKEN_FILE`, `TTS_REF_AUDIO` and `TTS_REF_TEXT`.

The music is a slow, sustained pad synthesized by `music.py` (numpy and ffmpeg), so it carries no third-party license.
