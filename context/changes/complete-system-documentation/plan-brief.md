# Complete System Documentation — Plan Brief

> Full plan: `context/changes/complete-system-documentation/plan.md`

## What & Why

Fill every remaining gap in the TurnupTickets documentation site: 8 empty functional-doc stubs, 2 shipped modules with no doc at all (event statistics/dashboard, mailing campaigns), and one stale/wrong technical page (money formulas). All against the system as it actually behaves today — no product change, documentation only.

## Starting Point

The site already has working docs for events, payments, administrators, discount codes, and the web storefront, plus architecture/database/REST API technical pages. Everything else is either a 0-byte placeholder or doesn't exist yet.

## Desired End State

Every module in the admin panel and storefront has an accurate, non-empty doc page in the house style (Polish, Docusaurus, no code paths in functional docs). Build passes, site is live on GitHub Pages.

## Key Decisions Made

| Decision | Choice | Why | Source |
|---|---|---|---|
| Scope | One plan, all 11 gaps | User wants full picture in one pass | Plan |
| Priority order | Finance → new modules → config cluster → seat planner → remaining stubs → publish | Money accuracy is highest-risk, lowest-effort fix first | Plan |
| Money formula fix | Replace `amouts_patterns.md` content in place | Re-verified against code 2026-10-23 — old note is simply wrong, not ambiguous | Plan |
| Mailing gap (no segment targeting) | Document current reality + flag gap; don't fix code here | Cross-repo code fix belongs to TurnupCms's own change process | Plan |
| Contact form (built then removed) | Document current reality (plain static page) | Matches the project's own "describe what's in code" convention (same rule applied to the Menu module) | Plan |
| Menu module | Describe as-is, no PRD "dropped" framing | PRD's drop decision was reversed in practice — code has it, live | Plan |
| Doc depth | No file:line refs in functional docs | Matches existing `events.md`/`payments.md` style | Plan |
| Tags | New standalone `tags.md`, added mid-session | User flagged this was missing from the original phase list | Plan |

## Scope

**In scope:** `configs.md`, `contractors.md`, `languages.md`, `menu.md`, `seat_planner.md`, `seo.md`, `static_pages.md`, `users.md` (fill), `tags.md`, `event_statistics.md`, `mailing.md` (new), `amouts_patterns.md` (replace).

**Out of scope:** Already-written docs, fixing the mailing-campaigns segment-targeting gap or rebuilding the contact form (TurnupCms-side work), reconciling `roadmap.md`'s self-contradicting S-13 status.

## Architecture / Approach

Each phase writes complete markdown files following the established template (frontmatter, `##` sections, mermaid where structure warrants it). Research for every gap was done against live TurnupCms code via 4 parallel sub-agents, not guessed from stale planning notes — two real code gaps (mailing targeting, contact form) surfaced this way and are flagged rather than silently glossed over.

## Phases at a Glance

| Phase | What it delivers | Key risk |
|---|---|---|
| 1. Finance accuracy | Corrected `amouts_patterns.md` | Low — fully re-verified against code |
| 2. Event statistics | New `event_statistics.md` | Low — feature is fully built |
| 3. Mailing campaigns | New `mailing.md` + gap flag | Flagging the gap honestly without over/understating it |
| 4. Back-office config cluster | 6 files: contractors, languages, seo, configs, menu, tags | Cross-link consistency across 6 pages written together |
| 5. Seat/venue planner | `seat_planner.md` | Biggest single module — two Filament surfaces to describe clearly |
| 6. Remaining stubs | `static_pages.md`, `users.md` | Contact-form gap must read as current-state, not a bug report |
| 7. Final pass | Build, link-check, commit, push | `onBrokenLinks: 'throw'` means any bad cross-link fails the whole build |

**Prerequisites:** none — all source material already gathered.
**Estimated effort:** ~11 files across 7 phases, one session each for phases 1-2-3, one larger session for phase 4, one for phase 5, one for phase 6, one short one for phase 7.

## Open Risks & Assumptions

- The mailing-campaigns and contact-form gaps are real TurnupCms code gaps, not doc gaps — this plan documents them but doesn't fix them. If the user wants them fixed, that's a separate TurnupCms-side plan.
- `roadmap.md`'s S-13 self-contradiction (done vs. migrations-only) is noted but not corrected in this plan — flagged for the user to resolve in TurnupCms's own tracking if desired.

## Success Criteria (Summary)

- All 11 target files are non-empty, correctly formatted, and accurate against current code.
- `npm run build` passes with zero broken links.
- Site is live and verified on GitHub Pages after push.
