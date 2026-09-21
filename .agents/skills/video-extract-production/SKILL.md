---
name: video-extract-production
description: Convert a video URL into a verified, timestamped knowledge page with metadata, subtitles-or-ASR, natural chapters, semantic keyframes, and browser acceptance.
metadata:
  short-description: Verified video-to-knowledge-page workflow
---

# Video Extract Production

Turn a user-authorized video URL into a concise, navigable knowledge page. The outcome is not a transcript: it must help a reader scan the argument, find a step, return to the source, and act on what the video presents.

## Route the request

First identify the requested stopping point. Default to the complete workflow. If the user asks for only metadata, only transcription, only chapters, or only a data plan, stop at that boundary and do not create later artifacts.

Before doing work, inspect the target directory for usable metadata, audio, transcript, report, frames, and a page. Validate and reuse sound artifacts; do not redownload or re-run ASR merely because the skill is invoked again.

## Required sequence

1. Identify source and retrieve the available metadata: source URL/ID, original title, creator, parts, description, tags, cover, publication date, and duration.
2. Prefer text supplied by the platform in this order: official subtitles, CC subtitles, automatic subtitles, then multipart subtitles. Record availability and the decision. Use browser cookies only when necessary for user-authorized access; never print, persist, or place cookies, tokens, or credentials in artifacts. A failed cookie read gets no high-frequency retry loop.
3. Obtain or reuse audio, then compare its `ffprobe` duration to metadata. If the difference exceeds 5%, retry the safe extraction once; if it remains abnormal, stop and report rather than silently continuing.
4. If no usable subtitles exist, inspect hardware, CUDA availability, installed ASR backends/models/runtimes, language, and audio length before selecting ASR. Prefer existing tools and models; do not install large runtimes or system dependencies without explicit authorization. On CPU-only long-form work, benchmark a representative 2–3 minute clip when practical, estimate real-time factor and total time, and choose a sensible quantized small/base-class model or another appropriate option instead of defaulting to a full large/turbo model.
5. Start long standalone processes with a recorded start time. Do not keep the agent occupied or poll repeatedly. A later status check is one snapshot: process state, log progress, CPU activity, and final files. If it is still running, report that and end the check. Completion requires normal exit **and** nonempty structured JSON/TXT output.
6. Validate transcript segments contain `start`, `end`, and `text`. Compare the final segment end against real audio duration; halt before the page if tail coverage is materially abnormal or text is clearly unusable.
7. Reorganize the video into natural chapters, then write the knowledge synthesis and choose semantic visual anchors. Read [production workflow](references/production-workflow.md) for the required editorial rules.
8. Generate the report, page, and evidence-backed browser acceptance. Use [report schema](references/extraction-report-schema.md), [page template](assets/page-template.html), and [acceptance checklist](references/acceptance-checklist.md).

## Non-negotiable stop conditions

Do not enter page production if the video body cannot be acquired, metadata is clearly invalid, duration retry fails, no subtitle/viable ASR path exists, ASR is unreadable, tail coverage is abnormal, required visual material is missing, or authorization/privacy is uncertain. State what failed and preserve already-valid artifacts.

## Content integrity

Chapters must follow topic turns, new questions, method changes, demonstrations, examples, summaries, or explicit language transitions—never fixed minutes, segment counts, or a target chapter count. Attribute subjective statements as “作者提出”, “视频中认为”, or equivalent; do not convert video opinion into externally established fact.

Treat ASR spellings of names, products, models, people, English terms, and film terminology as candidates. Confirm high-risk proper nouns against source metadata, page/UI text, relevant visual frames, or the source itself before publishing them.

Each selected frame needs a timestamp, chapter, reason, and `helps_understand`. Choose steps, UI states, diagrams, before/after evidence, parameters, or otherwise text-resistant visual concepts. Remove visual repetition; frame count is content-driven.

## Validation and cleanup

Run `scripts/validate-extraction.ps1 -CaseDir <output-directory>` before declaring a complete run. It validates report structure and common privacy failures but does not replace content review or browser rendering. Use a localhost server bound only to `127.0.0.1` for a real desktop and approximately 390px-wide mobile render check, then stop the server and remove temporary validation artifacts.

Read [ASR strategy](references/asr-strategy.md) only when ASR is needed. Read the other references as linked above when producing their corresponding artifact.
