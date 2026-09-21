---
name: ppt-production
description: Produce or revise premium, editable 16:9 PPTX decks through a gated outline, style, preview, and delivery workflow. Use for presentation work where visual direction, speaker notes, object editability, and production QA matter.
---

# PPT Production

Create presentation artifacts as a production workflow, not a text-to-slides conversion. The deliverable balances narrative clarity, visual direction, editing in PowerPoint, and verifiable packaging.

## Start with decisions, not slides

Confirm or infer from the supplied material: purpose, audience, setting, page range, content scope, core story, editable-format requirement, visual assets and their rights. Stop when missing input, runtime, target format, essential assets, or image rights would materially affect delivery.

Create an outline before any full deck. Each slide needs an id, title, core message, page type, recommended visual, and `render_mode`. Wait for approval by default. If the user explicitly requests direct completion, still run the outline, style, and sample gates internally.

Read [production workflow](references/production-workflow.md) for the full gates and delivery sequence.

## Choose visual direction deliberately

Propose three genuinely different directions unless the user provides an established brand system. They must differ in typography, grid, image treatment, information density, decorative language, and pacing. A color swap is not a direction.

Before building a full deck, make a cover and one representative content slide. Add a method or data sample only when it meaningfully tests the system. Render in a real browser and ask for approval before expanding to the full deck, unless direct completion was explicitly authorized.

Read [design system](references/design-system.md) before defining a deck system or choosing page layouts.

## Assign the right render mode per page

- `object`: use native text, shapes, lines, images, tables, and charts for methods, processes, timelines, comparisons, data, and explanatory structures.
- `hero`: use a dominant visual for covers, closing pages, section breaks, emotional pages, or high-impact cases. Keep the title, subtitle, page marker, labels, and annotations as editable objects whenever possible.
- `hybrid`: pair evidence, before/after material, video or image examples with native labels and explanatory structure.

Never substitute a whole-slide bitmap for editable production. A screenshot is evidence, not a texture: crop, zoom, highlight, or annotate only the part that proves the page's point.

## Production invariants

- One page has one primary conclusion and should be understandable in about three seconds.
- Translate content into hierarchy, comparison, process, sequence, timeline, matrix, or evidence-plus-conclusion before using bullets.
- Split overfull content into pages. Never solve density by shrinking type.
- Keep one coherent brand system: no more than two primary type systems, no remote-font dependency, and compatible Hero and Object pages.
- Define tokens before full production: palette, type hierarchy, grid, safe margins, spacing, page markers, source captions, and image treatment.
- Keep a single structured source of truth. Read [slide spec schema](references/slide-spec-schema.md) before authoring or validating it.
- Write concise speaker notes for every slide: what to say, the key line, and the transition.

Avoid default AI-slide patterns: card walls, dashboard styling, generic gradient effects, unmotivated neon technology styling, repeated identical layouts, text walls, tiny type, emoji, decorative icons, stretched images, unrelated visual systems, and untouched source screenshots reduced to a corner.

## Local implementation and QA

On this Windows/Codex workflow, prefer Node and PptxGenJS for editable assembly. Do not silently install Python, packages, global npm tools, Office software, or change PATH. If a necessary runtime is absent, report the blocker.

Use HTML at a fixed 16:9 coordinate system for visual preview before generating the full PPTX. Create a contact sheet and inspect visual rhythm across the deck. Then build PPTX from the same source specification where practical. Use [the preview template](assets/preview-template.html) and [the PptxGenJS starter](assets/pptxgenjs-starter.js) as generic scaffolds, not fixed designs.

Read [quality bar](references/quality-bar.md) for visual checks and [PPTX QA](references/pptx-qa.md) before delivery. Run `scripts/validate-pptx.ps1` on the artifact. Do not deliver with a P0 issue.

If no Office renderer exists, report the result as `structural`; never claim GUI validation. If a real Office engine is available, record `rendered-office` and inspect wrapping, clipping, image crops, and layout drift. One engine is useful evidence, not a guarantee of identical pixels across every Office engine.
