# Extraction report schema

Write `extraction-report.json` alongside the generated page. It is process evidence, not page-display data. Use JSON values from observed evidence; use `null` or an explicit `unavailable` reason when unknown. Never include credentials, cookies, tokens, or local absolute paths.

Required top-level sections:

- `source`: original URL, platform ID where available, exact source title, uploader/creator, metadata duration.
- `subtitles`: official, CC, automatic, multipart availability; final decision and reason.
- `audio`: source file as a relative path, ffprobe duration, comparison to metadata, percent difference, validation result.
- `asr`: backend/model/language/hardware mode when ASR was used; segment count, transcript tail, audio duration, tail gap seconds/percent, result. When subtitles were used instead, preserve the section and mark ASR fields unavailable.
- `chapters`: nonempty list of `id`, `title`, `start`, `end`, and `boundary_reason`.
- `keyframes`: content-driven list. Each item has `file`, `timestamp`, `chapter`, `reason`, and `helps_understand`.
- `browser_acceptance`: localhost rendering, desktop/mobile checks, image/link checks, console status, and privacy check, including reasons where a check is unavailable.

Store time values consistently within a report: seconds or `HH:MM:SS` are both valid. Record decision reasons, not merely passing labels.
