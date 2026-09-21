# Acceptance checklist

## Artifact checks

- Metadata and subtitle decision have evidence.
- Audio duration matches metadata or an abnormal retry was explicitly stopped.
- Transcript is structured, readable, and covers the tail when ASR is used.
- Chapters follow source structure and cover the meaningful runtime.
- Timestamp links resolve to the correct source and offset format.
- Frames are semantically useful and use relative paths.
- Report is parseable, complete, and contains no sensitive information.

## Browser checks

Serve the output only on `127.0.0.1`. In a real browser, verify complete loading, cover and frame images, Chinese/target-language typography, chapter navigation, source/timestamp links, console errors and warnings, and the absence of local paths or credential-like strings. Check both desktop and a viewport around 390px wide; the narrow view must not have whole-page horizontal overflow.

After acceptance, stop the local server and remove temporary scripts, preview files, and intentional bad-test artifacts. Do not delete valid source outputs.
