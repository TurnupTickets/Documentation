# Complete System Documentation — Implementation Plan

## Overview

The Docusaurus site at `documentation_turnup` has 12 functional-doc stub files and 4 technical-doc files registered in its sidebar. Of those, 8 functional stubs are completely empty (0 bytes), 2 real shipped modules (event statistics/dashboard tab, mailing campaigns) have no doc page at all, and one technical page (`amouts_patterns.md`) contains a stale, partially-wrong formula note superseded by a verified reference already sitting in the source repo. This plan fills every gap against the **current, already-shipped** TurnupCms (Laravel/Filament admin + REST API) and TurnupApp (React storefront) behavior — no product behavior changes, documentation only.

## Current State Analysis

Line counts confirm the gap (documentation_turnup/docs):

| File | Lines | State |
|---|---|---|
| `functional/configs.md` | 0 | empty stub |
| `functional/contractors.md` | 0 | empty stub |
| `functional/languages.md` | 0 | empty stub |
| `functional/menu.md` | 0 | empty stub |
| `functional/seat_planner.md` | 0 | empty stub |
| `functional/seo.md` | 0 | empty stub |
| `functional/static_pages.md` | 0 | empty stub |
| `functional/users.md` | 0 | empty stub |
| `functional/tags.md` | — | does not exist yet |
| `functional/event_statistics.md` | — | does not exist yet |
| `functional/mailing.md` | — | does not exist yet |
| `technical/amouts_patterns.md` | 8 | stale, formula error flagged in its own successor note |
| `functional/administrators.md`, `events.md`, `payments.md`, `discount_codes.md`, `web_app.md` | 29–200 | already written, out of scope for this plan |
| `technical/architecture.md`, `database.md`, `rest_api.md`, `outside_integrations.md` | 67–133 | already written, out of scope |

Four parallel research passes against the live TurnupCms codebase (2026-10-23) produced the content baseline for every gap. Key discoveries below are organized by the phase that consumes them.

## Desired End State

Every file in the table above above has real, accurate content in the established house style (Polish, Docusaurus frontmatter, `## `-sectioned, mermaid diagram where the existing style uses one, no code/file-path references in functional docs). The Docusaurus build passes with zero broken links, and the result is committed and pushed to `main` so GitHub Pages serves it.

Verify via: `npm run build` (zero `onBrokenLinks` errors), `grep -rL '^---' docs/functional/*.md docs/technical/*.md` returns nothing (every file still has frontmatter), none of the target files are 0 bytes, `git log -1` shows the commit on `main`.

### Key Discoveries:

- **Finance formulas are clean, not ambiguous.** `amount_sums.md` (TurnupCms context, dated 2026-09-08) was re-verified line-by-line against current code on 2026-10-23 — every formula (service fee, discount, ticket price, order total, commission, statistics, GA, PDF) still matches exactly. The only thing wrong is `documentation_turnup`'s own `amouts_patterns.md` (8 lines, written before the correction, still has the old wrong formula and an unresolved `?` on commission). This is a straight replace, not a discrepancy to adjudicate.
- **Mailing campaigns (S-13) has a real code gap, not just a doc gap.** The module is substantially built (Filament resource, WYSIWYG template, scheduler UI, cron, queue/send job, real Mailgun wiring via the external QueueSystem) — but the one capability actually named in both the PRD scope line ("campaign scheduling/targeting") and the roadmap's own outcome line ("to a chosen customer segment") does not exist: there is no query against the customer/order base, only a flat manually-typed semicolon-separated email string. `roadmap.md` self-contradicts (line 54 says "done", line 342 says "no code … beyond its database migrations") — neither claim is accurate; "built except for segment targeting" is.
- **Contact form (static pages) was built then deliberately deleted.** Commit `916f92c` built a full contact-form backend (endpoint, `ContactMessage` model, admin inbox, notification email); commit `c6680cf` removed all of it as "built-but-never-shipped-to-any-UI" dead code. The PRD still describes `kontakt` as "the one page with real logic" — current reality is that it is a plain static page identical in behavior to the other four.
- **Seat planner is two Filament surfaces, not one**: a standalone `SeatScheme` authoring resource (grid-generator or SVG-upload + a Livewire marking canvas) feeding into a per-event "Miejsca" tab that only manages sale state (ticket-group assignment, enable/disable) and hard-blocks any already-sold seat from reassignment at the service layer, not just the UI.
- **"Kontrahenci" is not a separate entity** — it's the same `Admin` model/table as `administrators.md` already documents, filtered by role, surfaced under a differently-labeled Filament resource. There is no one-click block action (deactivation is a toggle inside the edit form) and no "this contractor's events" tab (ownership is set from the Event side only) — both are gaps against the permission list `administrators.md` already implies.
- **Languages/countries confirms the PRD's "CSV + translation groups dropped" decision**, replaced by: Countries managed inline from the Language form (no standalone nav entry), language/country codes permanently locked once referenced elsewhere, and delete blocked with a friendly warning while in use.
- **SEO settings is one global settings form, not a list** — tracking scripts (site-wide) + per-language meta/Google fields. Robots.txt is confirmed dropped (Cloudflare owns it now, no field anywhere). Sitemap and redirects are **not admin screens** — sitemap is API-only, redirects are an automatic side effect of a slug change, not a CRUD screen.
- **Payment methods configuration is a confirmed hybrid**: admin edits business toggles (active/visible/test-mode/order), but credentials are `.env`-driven and shown only as a configured/not-configured status, never editable fields — `PaymentModule::config` is deliberately not fillable.
- **Tags are per-language**, not shared across languages, with per-event "primary tag" flagging and the same cross-module SEO-slug/redirect mechanism events already use. A one-time, dry-run-capable backfill command migrated the legacy `categories` (type=2) data into this structure; the legacy table is now empty except for one deprecated "Category (legacy)" menu-item type kept only so old stored menu items don't break.
- **Menu is two fixed menus** (main/footer), each a drag-reorderable tree; item types are Tag / Static Page / URL / File / Others, plus a deprecated Category type. No PRD "dropped" framing belongs in this doc — the module is live and working.
- **Users (admin view) is read/edit/deactivate/trigger-reset only** — no create, no delete, no admin-set password (reset-link-only by explicit design decision recorded in the TurnupCms repo's own design doc).

## What We're NOT Doing

- Not touching `administrators.md`, `events.md`, `payments.md`, `discount_codes.md`, `web_app.md`, `architecture.md`, `database.md`, `rest_api.md`, `outside_integrations.md` — already written, out of scope.
- Not fixing the mailing-campaigns segment-targeting gap, the missing contractor block-action/events-tab, or rebuilding the contact form — those are TurnupCms code gaps. This plan documents current reality and flags each gap; fixing them is a separate TurnupCms-side `/10x-new` → `/10x-plan` → `/10x-implement` chain, not part of this documentation change.
- Not reconciling `roadmap.md`'s self-contradicting S-13 status lines inside the TurnupCms repo — flagged here, corrected there if the user chooses to.
- Not adding file:line code references into functional docs (matches existing house style: `events.md`/`payments.md` have none). Code references stay in `docs/technical/*`.
- Not restructuring `docs/mirrormatch/` (unrelated product) or touching `docusaurus.config.ts`/`sidebars.ts` beyond what autogenerated sidebars already pick up from the `docs/functional`/`docs/technical` folders (no sidebar config changes needed — both sidebars are `{type: 'autogenerated', dirName: ...}`).

## Implementation Approach

Each phase produces one or more complete, non-empty markdown files in the established style (frontmatter `title:`, `##`-sectioned prose, mermaid diagram mirroring `events.md`'s pattern where the module has real structure to diagram, no code paths in functional docs). Order follows the user's stated priority: money/finance accuracy first, then the two wholly-missing modules, then the back-office config cluster (one research sweep already covers all 6), then the two remaining bigger/standalone stubs, then a final build-and-publish pass.

## Phase 1: Finance accuracy — replace `amouts_patterns.md`

### Overview

Replace the stale 8-line formula note with the verified reference, confirmed to still match code as of 2026-10-23. No code changes anywhere — this phase is purely correcting what the docs site says.

### Changes Required:

#### 1. Technical formula reference

**File**: `docs/technical/amouts_patterns.md`

**Intent**: Replace the old, partially-wrong content with an accurate Polish-language writeup of the full pricing chain (ticket price → service fee → discount → order total → contractor commission → statistics/PDF), sourced from TurnupCms's `context/amount_sums.md` and the 2026-10-23 code re-verification. Keep the existing filename (already linked from `architecture.md`'s closing paragraph and referenced in `rest_api.md`) so no other page's links break.

**Contract**: Same frontmatter shape as other technical pages (`title:`). Content must state, in prose, the corrected chain the old note got wrong: discount applies to *(ticket price + service fee)* together, not to ticket price alone with commission added after. Must explicitly state that contractor commission is **not applied at checkout**, only in statistics/PDF reporting — this is the guardrail the PRD calls "no silent change to how partners are paid," so it's worth one explicit sentence rather than leaving it implicit.

### Success Criteria:

#### Automated Verification:
- File is non-empty and has valid frontmatter: `head -1 docs/technical/amouts_patterns.md` shows `---`
- `npm run build` succeeds with no broken-link errors touching this file

#### Manual Verification:
- Formulas read correctly to someone who knows the business (spot-check against `amount_sums.md`)

---

## Phase 2: Event statistics / dashboard — new functional doc

### Overview

Document the per-event "Statystyki" tab and its PDF export — a real, fully-wired feature (sales/VAT table, charts, timeline, discount/guest/gift/physical/SMS breakdowns, GA view count, verified-ticket counts, net-of-commission PDF) with no existing doc page.

### Changes Required:

#### 1. New functional doc

**File**: `docs/functional/event_statistics.md`

**Intent**: Describe, from the Admin/Kontrahent's point of view, what the Statystyki tab shows and what the PDF export contains — mirroring `events.md`'s section style (intro + admin URL pattern, then one `##` per sub-area).

**Contract**: Sections to cover: date-range filter (tab-scoped, not global), ticket-group earnings table (earned = gross minus contractor commission when commission > 0, VAT shown for display only), sold-tickets charts, sales timeline, discounted-tickets breakdown, guest-ticket list, gift/physical/SMS sold counts, verified (scanned) ticket counts, Google Analytics view count (noting it's cached once/day and only appears when GA credentials are configured), and the Kontrahent-only PDF export (honors the active date filter, breaks out commission as its own line). Close with a short note that this tab is where the finance formulas from `amouts_patterns.md` become visible to a real user — link to it.

### Success Criteria:

#### Automated Verification:
- File exists, non-empty, valid frontmatter
- `npm run build` succeeds

#### Manual Verification:
- A reader unfamiliar with the code can tell what each number on the tab means

---

## Phase 3: Mailing campaigns — new functional doc + gap flag

### Overview

Document the mailing-campaigns module as it actually behaves today, and flag the segment-targeting gap explicitly rather than describing a feature that doesn't exist or silently calling it incomplete.

### Changes Required:

#### 1. New functional doc

**File**: `docs/functional/mailing.md`

**Intent**: Describe the template builder (WYSIWYG subject/body/from-address) and the scheduler (one or more dated send-jobs per campaign, cron-driven, queued) as real, working functionality. Describe the recipient field honestly: a manually-typed, semicolon-separated email list — not a customer/order-based segment picker.

**Contract**: One `##` section naming this gap plainly, e.g. "Obecne ograniczenie: lista odbiorców", stating that targeting a segment (e.g. "buyers of event X") is not yet implemented despite being the module's originally stated goal, and that this is tracked as an open item in TurnupCms, not something this doc page can resolve.

#### 2. Flag the gap in TurnupCms's own tracking

**File**: none written by this plan (cross-repo, out of this change's scope — see "What We're NOT Doing")

**Intent**: This plan does not edit `/Users/hubertkrzysztofiak/Projects/2025/TurnupCms/context/foundation/roadmap.md`. Surfacing the S-13 self-contradiction (line 54 "done" vs line 342 "no code") and the segment-targeting gap to the user is handled in this plan's final summary to the user, not as a file change here.

### Success Criteria:

#### Automated Verification:
- File exists, non-empty, valid frontmatter
- `npm run build` succeeds

#### Manual Verification:
- The gap statement doesn't overstate or understate what's built (re-read against the Part 2 research findings before finalizing)

---

## Phase 4: Back-office config cluster

### Overview

Six small-to-medium modules, one research sweep already completed for all of them: contractors, languages & countries, SEO settings, payment methods configuration, menu, and tags.

### Changes Required:

#### 1. Contractors

**File**: `docs/functional/contractors.md`

**Intent**: Describe the Kontrahent screen as the same underlying account entity as `administrators.md`'s Admin, distinguished by role, carrying a commission percentage and an hour-format preference that affects what buyers see on that contractor's events. State plainly (without framing it as a "bug") that deactivation is a toggle on the edit form, not a one-click list action, and that there's currently no "this contractor's events" tab on this screen — ownership is set from the Event side.

**Contract**: Mirror `administrators.md`'s structure (it already exists and covers the Admin role in detail) — this page's job is the Kontrahent-specific additions (commission, hour format) and the two noted gaps, not re-explaining the shared account model from scratch. Cross-link to `administrators.md`.

#### 2. Languages & countries

**File**: `docs/functional/languages.md`

**Intent**: Describe the simplified replacement for the old CSV/translation-group tooling: Languages as the primary screen, Countries managed inline from the Language form (no standalone screen), the permanent-lock rule once a language/country code is referenced elsewhere, and the deletion guards (can't delete default/last-active/in-use).

**Contract**: One `##` per concept (Języki, Kraje — tworzone z formularza języka, Blokada edycji kodu, Ochrona przed usunięciem).

#### 3. SEO settings

**File**: `docs/functional/seo.md`

**Intent**: Describe the single global settings form: site-wide tracking scripts (head/body) plus per-language meta defaults and Google integration fields. State plainly that robots.txt is no longer managed here (Cloudflare), and that sitemap and redirects are automatic/API-side, not admin screens — so a reader doesn't go looking for "redirect list" or "robots.txt editor" buttons that don't exist.

**Contract**: Mirror the admin-URL-pattern intro line from `events.md`. Sections: Skrypty śledzące, Meta dane (per język), co NIE jest tutaj zarządzane (robots.txt, sitemapa, przekierowania — z krótkim wyjaśnieniem gdzie faktycznie się dzieją).

#### 4. Payment methods configuration

**File**: `docs/functional/configs.md`

**Intent**: Describe what's actually editable (provider type at creation only, name, active/visible/test-mode toggles, order) versus what's credential-status-only (API keys/merchant IDs/webhook secrets, shown as configured/not-configured, changed only by whoever manages deploys).

**Contract**: Two `##` sections: "Co można zmienić z panelu" / "Co jest tylko podglądem (dane dostawcy)".

#### 5. Menu

**File**: `docs/functional/menu.md`

**Intent**: Describe the two fixed menus (main/footer) as a drag-and-drop-reorderable tree, item types (Tag/Static Page/URL/File/Others, plus a legacy Category type kept only for old stored items), the non-clickable-label option, and that deleting an item deletes its whole subtree. Describe current code behavior only — no mention of any PRD decision about this module's fate.

**Contract**: Sections: Menu główne i stopka, Struktura drzewa, Typy elementów, Usuwanie.

#### 6. Tags

**File**: `docs/functional/tags.md`

**Intent**: Describe tags as the replacement for the legacy per-event category system: per-language scoping, slug uniqueness with automatic redirect-on-change (same mechanism as events, worth one cross-reference sentence rather than re-explaining), attaching tags to events from either side with a one-per-event "primary tag" flag, and a one-line note on the historical one-time migration from categories (for context, not as a how-to).

**Contract**: Cross-link to `events.md`'s existing "Kategorie wydarzeń" section (that section describes the legacy category→tag migration from the Events side; this page owns the Tags-module side).

### Success Criteria:

#### Automated Verification:
- All 6 files exist, non-empty, valid frontmatter
- `npm run build` succeeds, no broken links

#### Manual Verification:
- Cross-links between `contractors.md`↔`administrators.md` and `tags.md`↔`events.md` resolve and read coherently from both directions

---

## Phase 5: Seat / venue planner

### Overview

The biggest single remaining module — two Filament surfaces (scheme authoring, per-event assignment) plus the interactive marking canvas.

### Changes Required:

#### 1. New functional doc

**File**: `docs/functional/seat_planner.md`

**Intent**: Describe the two-surface structure clearly: (1) "Plan miejsc" — authoring reusable templates via grid-generator or SVG-upload, then labeling seats on the interactive canvas (bulk selection, range-labeling mode, orphaned-seat warnings on SVG re-upload); (2) the per-event "Miejsca" tab — assigning ticket groups to seats, enabling/disabling seats, with a hard guard against reassigning already-sold seats; plus color-coding by ticket group and the note that the public storefront's seat picker renders the exact same data.

**Contract**: Mirror `events.md`'s structure (intro, `##` per sub-area, closing mermaid diagram: `Plan miejsc -> Miejsca(Seat) -> SeatsEvent(Event + TicketGroup)`, closing summary paragraph). Suggested section order (from research): Lista planów, Tworzenie planu (Siatka / Plan SVG), Oznaczanie miejsc, Przypisanie planu do wydarzenia, Kolorowanie według grup biletów, Widok publiczny.

### Success Criteria:

#### Automated Verification:
- File exists, non-empty, valid frontmatter, contains a mermaid block
- `npm run build` succeeds

#### Manual Verification:
- Someone who's never opened the admin panel can follow the create-template → label-seats → assign-to-event flow from the doc alone

---

## Phase 6: Remaining public-facing stubs

### Overview

Static pages (with the contact-form gap flagged) and the admin-side user-management screen.

### Changes Required:

#### 1. Static pages

**File**: `docs/functional/static_pages.md`

**Intent**: Describe the fixed 5-page set (regulamin, polityka prywatności, kontakt, pomoc, metody płatności), per-language tabs with WYSIWYG body + meta fields, auto-slug suggestion with collision handling, and the rule that a page can be left untranslated in one language (falls back to Polish). State plainly, as current reality, that `kontakt` is a plain static page like the others — flag in one sentence that a real contact-form backend was built and then removed as unused dead code, and that PRD intent describes something that doesn't exist today.

**Contract**: Sections: Zestaw stron, Edycja treści (per język), Slug i kolizje, Publikacja/niewidoczność, Strona kontaktowa (stan obecny + nota o usuniętym formularzu).

#### 2. Users (admin view)

**File**: `docs/functional/users.md`

**Intent**: Describe the admin-side customer-account screen as view/edit/deactivate/trigger-password-reset only. State explicitly what's NOT possible here (no create, no delete, no setting a password directly) and that the actual password change happens on the customer-facing site via the emailed reset link, not in this admin screen. Cross-link to `web_app.md` (customer self-service side) so the two halves of "user management" are easy to find from either page.

**Contract**: Sections: Lista klientów, Edycja danych, Reset hasła (co to robi i czego nie robi), Czego nie można tutaj zrobić.

### Success Criteria:

#### Automated Verification:
- Both files exist, non-empty, valid frontmatter
- `npm run build` succeeds

#### Manual Verification:
- `users.md` and `web_app.md` cross-links resolve and don't duplicate content

---

## Phase 7: Final pass — build, link-check, publish

### Overview

Verify the whole site builds clean and ship it.

### Changes Required:

#### 1. Build verification

**Intent**: Run the full Docusaurus build once all prior phases are committed locally, confirm zero broken-link warnings (the site config has `onBrokenLinks: 'throw'`, so any bad cross-link fails the build outright — this is the actual gate, not just a nice-to-have).

**Contract**: `npm run build` exits 0.

#### 2. Commit and push

**Intent**: Stage exactly the files this plan touched (the 11 new/replaced docs — not any unrelated pre-existing modified files in the working tree), commit, push to `main` so GitHub Pages redeploys.

**Contract**: One commit, `git push origin main` succeeds.

### Success Criteria:

#### Automated Verification:
- `npm run build` exits 0
- `git log -1 --oneline` on `main` shows the commit after push
- `gh api repos/TurnupTickets/Documentation/pages` still reports `status: built` after the Pages workflow completes

#### Manual Verification:
- Spot-check 2-3 of the new pages live on `https://turnuptickets.github.io/Documentation/`

**Implementation Note**: Pause here for confirmation that the live site looks right before considering the change done.

---

## Testing Strategy

### Automated:
- Docusaurus build (`npm run build`) after every phase — catches broken internal links immediately given `onBrokenLinks: 'throw'`.
- Non-empty + frontmatter check on every target file (trivial shell check, not a real test suite — this is a documentation change).

### Manual Testing Steps:
1. Read each new/replaced page start to finish as if encountering the module for the first time.
2. Follow every cross-link added (`contractors.md`↔`administrators.md`, `tags.md`↔`events.md`, `users.md`↔`web_app.md`, `event_statistics.md`→`amouts_patterns.md`) in both directions.
3. Confirm the two flagged gaps (mailing segment-targeting, contact-form removal) read as honest statements of current state, not as bug reports dressed up as features or vice versa.

## Performance Considerations

None — static documentation site, no runtime behavior.

## Migration Notes

Not applicable — no data or schema changes. `amouts_patterns.md` is replaced in place (same filename) specifically so existing inbound links from `architecture.md`/`rest_api.md` keep resolving.

## References

- Source PRD: `/Users/hubertkrzysztofiak/Projects/2025/TurnupCms/context/foundation/prd.md`
- Source roadmap: `/Users/hubertkrzysztofiak/Projects/2025/TurnupCms/context/foundation/roadmap.md`
- Verified money formulas: `/Users/hubertkrzysztofiak/Projects/2025/TurnupCms/context/amount_sums.md`
- Existing style references: `docs/functional/events.md`, `docs/functional/payments.md`, `docs/functional/administrators.md`
- This session's 4 research reports (seat planner; static pages + users; config cluster; finance + mailing verification) — not persisted as files, synthesized directly into the phases above

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: Finance accuracy — replace amouts_patterns.md

#### Automated
- [x] 1.1 File non-empty with valid frontmatter — 97dbc33
- [x] 1.2 Build succeeds — 97dbc33

#### Manual
- [x] 1.3 Formulas spot-checked against amount_sums.md — 97dbc33

### Phase 2: Event statistics / dashboard doc

#### Automated
- [ ] 2.1 File exists, non-empty, valid frontmatter
- [ ] 2.2 Build succeeds

#### Manual
- [ ] 2.3 Reader can tell what each number means

### Phase 3: Mailing campaigns doc + gap flag

#### Automated
- [ ] 3.1 File exists, non-empty, valid frontmatter
- [ ] 3.2 Build succeeds

#### Manual
- [ ] 3.3 Gap statement accuracy re-checked

### Phase 4: Back-office config cluster

#### Automated
- [ ] 4.1 All 6 files exist, non-empty, valid frontmatter
- [ ] 4.2 Build succeeds, no broken links

#### Manual
- [ ] 4.3 Cross-links resolve coherently both directions

### Phase 5: Seat / venue planner doc

#### Automated
- [ ] 5.1 File exists, non-empty, valid frontmatter, contains mermaid block
- [ ] 5.2 Build succeeds

#### Manual
- [ ] 5.3 Create→label→assign flow followable from doc alone

### Phase 6: Remaining public-facing stubs

#### Automated
- [ ] 6.1 Both files exist, non-empty, valid frontmatter
- [ ] 6.2 Build succeeds

#### Manual
- [ ] 6.3 users.md/web_app.md cross-links resolve, no duplication

### Phase 7: Final pass — build, link-check, publish

#### Automated
- [ ] 7.1 npm run build exits 0
- [ ] 7.2 git log shows commit on main after push
- [ ] 7.3 GitHub Pages reports status: built

#### Manual
- [ ] 7.4 Spot-check 2-3 live pages
