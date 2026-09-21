# Production workflow

## Gates

1. **Brief gate**: establish audience, outcome, scenario, scope, story, format, assets, and rights.
2. **Outline gate**: create an approved page plan with a singular message, page type, visual recommendation, and render mode per page.
3. **Style gate**: compare distinct directions. Document their type, grid, image, density, decorative, and pacing rules.
4. **Sample gate**: preview a cover plus representative content page in the browser. Resolve crop, hierarchy, wrapping, and system consistency before scaling.
5. **Production gate**: create a shared design token set and `slide-spec.json`; generate HTML preview and PPTX from that source where practical.
6. **Delivery gate**: inspect every preview, the contact sheet, and the PPTX package. Record validation level and any remaining limits.

## Browser preview sequence

Use a fixed 1920×1080 design coordinate system and a 16:9 stage. Validate:

- overflow and text clipping;
- Chinese wrapping and font fallback;
- image loading, aspect ratio, and crop;
- hierarchy and visual focus;
- console errors;
- deck-level rhythm in the contact sheet: visual highs, quiet pages, density shifts, and repetitive layouts.

## Page-task decision

Use `object` when the audience needs to read, compare, or edit structure. Use `hero` when a visual carries emotion or attention. Use `hybrid` when evidence is visual but the explanation must stay editable. Do not choose a mode by habit.

## Required stop conditions

Stop and report rather than improvising when the brief is materially incomplete, a key asset is absent, source permission is unclear, a required runtime is missing, the target format is not producible, a PPTX package is malformed, or preview QA finds a P0 crop/overflow failure.
