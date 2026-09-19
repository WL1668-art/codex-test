# NEWS source and selection audit

Verified at: 2026-09-19 13:20 (UTC+08:00)

Time window: 2026-09-16 through 2026-09-19. The seven-day fallback was not needed.

## Search coverage

First-party channels checked: OpenAI, Anthropic, Google/Google DeepMind, Meta AI, Microsoft, NVIDIA, SpaceXAI/xAI, Mistral AI, Hugging Face, and GitHub Changelog. Searches also looked for counterpart announcements from organizations participating in the same event.

## Candidate ledger

Eighteen distinct candidates remained after obvious search-result duplicates were collapsed.

### Selected (8)

1. SpaceXAI — Grok Voice Transcribe 2.0 (Sep 18). `Verified`; `First-party reported, not independently verified`. The release, API features and pricing are primary-source verified; performance claims remain attributed to SpaceXAI and its cited benchmark.
2. Anthropic / Accenture — embedded frontier-model evaluation team (Sep 18). `Verified`; `Cross-source corroborated`. Both participating organizations confirm the partnership, scope and expected investment.
3. OpenAI — ChatGPT for Word (Sep 17). `Verified`; `Primary-source verified`. Release notes and a dedicated help page from OpenAI confirm availability and features; these are two pages from one organization, not independent corroboration.
4. Anthropic — Life Sciences Verification Program (Sep 17). `Verified`; `Primary-source verified`. The beta access model, monitoring and retention policy are confirmed by the program announcement.
5. Anthropic Institute — frontier-lab development measurements (Sep 17). `Verified`; `First-party reported, not independently verified`. Publication and methodology are confirmed, but the internal quantitative results have not been independently audited.
6. Mistral / Mozilla — announced Mistral Small 4 integration for Firefox Smart Window beta (Sep 16). `Verified`; `Cross-source corroborated`. Both parties confirm the partnership and model choice. Mozilla says the model is coming to the beta, while Mistral says Smart Window is now powered by Mistral models; the brief preserves that rollout-language difference rather than asserting a completed universal rollout.
7. NVIDIA / Emerald AI / Google — AI Energy Management Alliance (Sep 16). `Verified`; `Primary-source verified`. NVIDIA confirms the alliance launch and objectives; no independent outcome claim is made.
8. OpenAI — model misalignment reporting framework (Sep 16). `Verified`; `Primary-source verified`. OpenAI confirms the framework and six initial reports; the brief does not treat the reported model behaviors as independently reproduced findings.

## Date audit

`event_at` and `source_published_at` are stored separately. For all eight retained items, the controlling source explicitly ties the announcement, release, launch, introduction, or publication to the displayed source date, so `event_at` is populated rather than inferred. If that link were absent, `event_at` would be `null`.

## Source-diversity exception

Anthropic is the responsible institution for three retained items, above the default limit of two. The exception is intentional: the embedded-evaluation partnership, the life-sciences access program, and the frontier-lab measurement disclosure are distinct events in different domains (external evaluation, controlled biological access, and lab-transparency metrics). Each independently clears the importance threshold, and removing one would replace it with a lower-impact candidate. This exception does not lower the verification standard.

### Excluded (10)

1. OpenAI advertising tools and Sponsored Agents — significant commercially, but more marketing-platform focused than the final technical and governance set.
2. OpenAI worker task-crossover research — useful, but overlapped with stronger research-governance coverage.
3. OpenAI older-adult training program — worthwhile social program, lower direct AI ecosystem impact.
4. OpenAI business-value analytics — incremental enterprise administration update.
5. Google CC family agent — early U.S.-only experiment/waitlist; below the impact cutoff.
6. Google UN System Data Commons — valuable public-data platform, but below the final cutoff after ranking.
7. Microsoft internal AI transformation lessons — practice report rather than a material launch or research release.
8. GitHub Copilot feature-engagement metrics — incremental dashboard change.
9. SpaceXAI Grok Build memory — useful coding-agent improvement, but narrower than the speech model release.
10. Google Flow fashion case study — case study rather than a broadly available technical release.

## Verification notes

- `verification_status` now describes whether the event or statement itself is reliably confirmed. `evidence_scope` separately describes whether underlying claims have cross-source or independent support.
- The Anthropic internal measurements item is now `Verified` at the event/report level and `First-party reported, not independently verified` at the evidence-scope level. This does not claim that the internal data has received independent third-party validation.
- No paywall bypass, account login, paid API, private data, API key, or social-media-only evidence was used.

