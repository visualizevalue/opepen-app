# Opepen: directive for creative agents

You are helping an artist create work that can earn a place in Opepen's permanent collection.
Your job is to understand the constraint, develop an original idea, produce finished artwork,
and prepare or submit it through the artist's authorized account. Deliver actual artwork and
a usable submission package, not just prompts or a concept description.

This guide works with any agent or LLM. You do not need to clone, install, or modify the Opepen
application to make art. Use the live site for current availability and submission status.

## Start here

1. Read this directive and inspect the [Opepen schematics](https://raw.githubusercontent.com/visualizevalue/opepen-api/refs/heads/main/app/Services/OpepenSVG/opepen-schematics.svg).
2. Study the [permanent collection](https://opepen.art/sets) and
   [current submissions](https://opepen.art/submissions). Identify what makes your proposed
   set different. Do not assume that today's leaders or available set slots are fixed.
3. Choose a complete set at [Create](https://opepen.art/create), or contribute to an existing
   set at [Open for Participation](https://opepen.art/contribute). Default to a complete
   `PRINT` set if the artist asks for a set without specifying a type.
4. Produce, inspect, and refine the art; assemble the files, names, description, and previews.
5. Use the artist's authorized wallet session to submit. If access or publishing authorization
   is missing, finish the package and provide the exact remaining steps.

## What Opepen is and what winning means

Opepen Edition is an art project on Ethereum by Visualize Value. Artists reinterpret a shared
silhouette. Collectors choose which submissions become part of the permanent collection by
opting eligible unrevealed Opepen tokens into the work they want to receive.

There are 200 set slots. Each revealed set contains 80 existing tokens, distributed across
six edition groups. The original supply was 16,000 tokens; burns mean that is not a statement
of current circulating supply. A submission proposes artwork for existing tokens; submitting
a set does not mint a new collection.

| Edition group | Tokens in the revealed set | PRINT artwork files | DYNAMIC final artworks |
| ------------- | -------------------------: | ------------------: | ---------------------: |
| 1/1           |                          1 |                   1 |                      1 |
| 1/4           |                          4 |                   1 |                      4 |
| 1/5           |                          5 |                   1 |                      5 |
| 1/10          |                         10 |                   1 |                     10 |
| 1/20          |                         20 |                   1 |                     20 |
| 1/40          |                         40 |                   1 |                     40 |
| Total         |                         80 |                   6 |                     80 |

A complete-set submission competes for collector demand and eventual reveal. A contribution
competes for selection by that set's creator; the assembled set still needs to succeed in the
collector process. Neither publishing nor receiving likes guarantees inclusion.

### How selection works

The lifecycle is: draft → published candidate → collector demand → staged consensus window
→ reveal, if the requirements remain satisfied.

- Demand comes from valid unrevealed token opt-ins, subject to the collector's maximum-reveal
  settings. It is neither an image-like count nor a requirement for 80 separate wallets.
- The current backend staging command selects the highest-demand eligible published candidate
  with **more than 40 total demand** when no submission has been staged within the preceding
  72 hours plus a 20-minute buffer. Reaching 41 does not guarantee immediate staging.
- Once staged (`starred_at`), a submission has a **72-hour consensus window**. This clock
  starts at staging, not at publishing or at first reaching full demand.
- Consensus requires demand of at least **1, 4, 5, 10, 20, and 40 in the respective groups**.
  Excess demand in one group cannot fill another. For example, 80 opt-ins in the 1/40 group
  alone do not satisfy the other five groups.
- Demand can change as ownership or token eligibility changes. The backend revalidates it
  before reveal; a staged submission without a scheduled reveal after its window can be
  archived. Do not promise a reveal date based only on a displayed percentage.
- A successful reveal allocates eligible opted-in tokens to the artwork, respecting edition
  capacities and collector limits. The backend uses a future Ethereum block hash to seed
  token selection; this is not an LLM judging contest.

These are the reviewed implementation's rules, not a promise about scheduler timing. Check
the live submission and its per-edition Demand Stats. Image likes and Opt-In Value are useful
context, but neither replaces the edition demand requirements. Opt-In Value is an estimate
based on unrevealed edition floor prices, not money paid to the artist.

## The creative constraint

Start from the silhouette and preserve its recognizable structure. The reference uses an
8×8 square canvas, with coordinates measured from the top left:

- Left eye occupies x=2–4, y=2–4, with a square top-left corner and rounded remaining outline.
- Right eye is a circle centered at (5, 3), radius 1.
- Mouth occupies x=2–6, y=4–6, with a flat top and rounded lower corners.
- Torso occupies x=2–6, y=7–8, with rounded upper shoulders and its base at the canvas edge.

Inspect the SVG rather than approximating these shapes from memory. The
[local schematic](https://opepen.art/schematics.svg),
[silhouette](https://opepen.art/solid.svg), and
[wireframe](https://opepen.art/wireframe.svg) are additional references. Remove construction
grids and labels from finished work unless they are part of the intended concept.

Develop a visual idea that makes meaningful use of this constraint. A new palette alone is
rarely a complete idea. Explore material, composition, process, motion, interaction, or a
clear conceptual rule. The six edition groups should belong together while giving each group
a reason to exist. Give the 1/40 group the same care as the 1/1: half the set lives there.

Use these as creative goals, not claims about automated platform validation:

- Make several distinct directions, compare them against existing sets, and develop the
  strongest rather than exporting the first acceptable result.
- Evaluate silhouette recognition, originality, coherence, craft, and variation. Revise the
  weakest dimension before expanding the system to all required pieces.
- Inspect every export at full size and at small gallery/avatar size. Check cropping,
  contrast, accidental artifacts, duplicate variants, and animation or interaction behavior.
- For generated work, keep reproducible source, seeds, and dependencies where possible. For
  image-model workflows, keep prompts and source files. Credit collaborators and describe
  the actual process without inventing authorship or claiming an existing artist's identity.

## Choose and produce the edition type

**PRINT:** supply six named media files, one for each edition group. The 1/4 artwork is shared
by four tokens, the 1/40 artwork by forty, and so on. This is the simplest complete-set format.

**DYNAMIC:** supply six base media slots plus 79 separately assigned variant slots:
4 + 5 + 10 + 20 + 40. The base 1/1 is its final artwork; each other group's base media is its
preview, with a final variant for each token. This means **85 populated media slots for 80
final token artworks**, not 80 upload slots and not six base images plus 74 variants. There is
no separate 1/1 variant slot. All six base media UUIDs must differ, and all 80 final-slot
UUIDs must differ. A non-1/1 preview can reuse a final variant's media, so 85 distinct uploads
are not required. Do not reuse one media UUID across multiple final slots. Here, “Dynamic”
refers to per-token variants; it does not require animation.

`NUMBERED_PRINT` is an admin-only option; do not choose it for a normal creator submission.

### Media requirements

The current backend upload limit is **15 MB per file**. The frontend file pickers offer PNG,
JPEG, GIF, SVG, WebP, MP4, WebM, GLTF/GLB, and HTML. The server also validates the detected file
subtype; picker acceptance alone does not prove a file will upload. In particular, validate
3D/HTML exports in the real upload and preview flow before producing a full set.

For a static first set, square PNGs at a consistent high resolution are a practical default
(for example, 2000×2000). That resolution is a recommendation, not an enforced minimum in the
reviewed code. Export within the file limit and inspect the app-generated previews. Avoid
depending on unavailable external assets for interactive work.

## Deliver a submission package

Before uploading, provide:

- A set name, artist display name, and concise description of the idea and process.
- The edition type and all six edition names.
- Six labeled base files. For `DYNAMIC`, also provide all 79 variants, grouped by edition and
  numbered from 1 within each group. A useful convention is `base/edition-4.png` and
  `variants/4/01.png`; filenames are organizational, not an API import format.
- A contact sheet of the six base images, and variant contact sheets for a dynamic set.
- A manifest mapping edition, variant index if applicable, title, and local filename. Record
  media UUIDs and the submission UUID after upload. This is a handoff artifact, not a file
  the site automatically imports.
- Source files or a reproducible generator, plus a brief validation report listing file
  counts, dimensions, sizes, and any known preview issues.
- The creator's public wallet address and any actual co-creator addresses, when provided.
  Keep an absent address marked as missing rather than inventing one.

## Submit a complete set

1. Connect the intended creator wallet and complete Sign-In with Ethereum on
   [Opepen](https://opepen.art/create). Authentication uses a wallet-signed login message and
   a cookie session. Creating artwork and creating a submission do not require buying tokens;
   collector opt-ins are a separate token-holder action.
2. Open **Create Opepen Set** (`/create/new`). This creates a server-side draft and opens
   `/create/{submission-uuid}`. Save the UUID; avoid creating another draft just to resume.
3. Fill the set name, description, artist name, edition type, six edition names, and six base
   media slots. Add co-creators and Deep Dive Links where relevant. Ordinary creators use the
   signed-in account as creator; creator-address reassignment is an admin feature.
4. For `DYNAMIC`, fill every variant slot in the 4, 5, 10, 20, and 40 groups. The form needs
   all required fields and media before offering Publish.
5. Wait for uploads and autosave to finish; confirm the saved state by reloading the draft.
   Open the Square and Open Graph previews and inspect them. Use Share Preview for review.
6. When publishing is within the artist's authorization, choose **Publish** in the editor's
   options menu, then verify the public page at `/submissions/{submission-uuid}` and its
   published state. Report the URL and actual status.
7. Core artwork and metadata fields lock after publication for ordinary creators. Unpublish
   removes the public listing and **clears all opt-ins**. Do not unpublish as a routine retry
   or editing shortcut without authorization for that loss.
8. An optional **artist signature** is offered after publishing. It is a separate onchain
   Ethereum transaction with gas, not the login signature or a publishing prerequisite.
   Only execute it within the artist's transaction authorization.

Do research, ideation, generation, exports, and packaging autonomously within the brief.
Use wallet access only through the owner's authorized signing tool or connected session;
never request seed phrases or private keys. Do not fabricate opt-ins, circumvent contribution
limits, or use admin endpoints to simulate success. If a wallet action needs the owner,
complete the work that can be done first and identify that precise remaining action.

## Contribute to someone else's set

1. Visit [Open for Participation](https://opepen.art/contribute), choose a set, and read its
   concept, existing pieces, and creator's contribution requirements.
2. Confirm it is open for participation and still accepts contributions in the live UI.
   Check its per-artist limit; an empty limit means unlimited overall, while the current UI
   accepts up to 10 files per upload batch, further limited by your remaining allowance.
3. Make finished renditions that fit that particular set. Sign in, upload them, then press
   **Submit Contribution**. Uploading media alone does not submit it to the set.
4. Verify the pieces appear under your contributions. Selection is made by the creator;
   likes can help discovery but do not automatically select a piece.
5. Selected contributors are credited automatically while at least one of their pieces
   remains selected. A selected contribution must be removed from the set before it can be
   deleted. Report whether a piece is submitted or selected rather than conflating the two.

If you are assembling an open set, turn on Open For Participation in the draft and set a
per-artist cap if useful. For `DYNAMIC`, use **Compose Contributions** at
`/create/{uuid}/compose` to place pieces into the 80 final slots; check its Saved status.
For prints, select contribution artwork for the six edition groups. Keep the six base
previews and all publication requirements complete. Composition is a creator/admin action;
contributors cannot assign their own work to someone else's set.

## API reference for capable agents

The browser is sufficient. If you use HTTP tools, follow the same authenticated workflow as
the app. There is no API-key or bearer-token workflow documented in this frontend. Use the
configured `runtimeConfig.public.opepenApi`; `.env.example` points to
`https://api.opepen.art/v1`. Paths below are relative to that base, including its `/v1` prefix.
For example, `/set-submissions` resolves to `https://api.opepen.art/v1/set-submissions`.
Preserve session cookies, use the correct site origin for SIWE, and read server errors.

| Method and path                        | Purpose / request                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------------- |
| `GET /opepen/sets`                     | Read permanent set data.                                                                    |
| `GET /set-submissions`                 | Read candidates; inspect pagination instead of assuming all results are returned.           |
| `GET /set-submissions/curated`         | Read staged/current-or-past submission data; check timestamps and status.                   |
| `GET /set-submissions/{uuid}`          | Read submission data and status.                                                            |
| `GET /auth/nonce`                      | Get the login nonce in the same cookie session.                                             |
| `POST /auth/verify`                    | Verify `{ "message": "<SIWE message>", "signature": "<wallet signature>" }`; chain ID is 1. |
| `GET /auth/me`                         | Verify the authenticated account.                                                           |
| `POST /set-submissions`                | Create a draft; record the returned `uuid`.                                                 |
| `POST /opepen/images`                  | Upload multipart form data with field `image`; record returned media `uuid`.                |
| `POST /set-submissions/{uuid}`         | Save JSON fields below.                                                                     |
| `POST /set-submissions/{uuid}/images`  | Assign dynamic variants with one-based indices.                                             |
| `GET /render/sets/{uuid}/square`       | Inspect the square preview.                                                                 |
| `GET /render/sets/{uuid}/og`           | Inspect the Open Graph preview.                                                             |
| `POST /set-submissions/{uuid}/publish` | Publish the completed, authorized draft.                                                    |
| `POST /participation`                  | Submit `{ "submissionId": "<submission uuid>", "imageIds": ["<media uuid>"] }`.             |

The save payload uses `name`, `description`, `artist`, `edition_type`, and, for every
`N` in `[1, 4, 5, 10, 20, 40]`, `edition_N_name` and `edition_N_image_id`. Replace `N` with the
number in each actual key; image IDs here are the uploaded media **UUIDs**. Optional fields
include `co_creators` (public address array), `open_for_participation` (boolean), and
`max_contributions_per_contributor` (positive integer or `null`). **This save endpoint expects
the full form state, not a partial patch.** Read existing state first and send all fields,
preserving optional values: omitted base images are cleared, an omitted type defaults to
`PRINT`, and omitted co-creators or participation settings are reset.

Example dynamic assignment for the first two slots of the 1/4 group:

```json
{
  "images": [
    { "edition": 4, "index": 1, "uuid": "<first uploaded media uuid>" },
    { "edition": 4, "index": 2, "uuid": "<second uploaded media uuid>" }
  ]
}
```

This example is incomplete: fill indices 1 through N for each dynamic group N. Read responses
and reload saved state after writes. If a create/upload request has an uncertain outcome,
reconcile existing drafts or media before retrying to avoid duplicates. Authentication or
authorization errors require restoring the correct session, not changing creator identity.

## Finish with evidence

Return the final artwork package, preview contact sheets, concept, edition mapping, and
validation results. If you interacted with the site, also return the submission URL/UUID,
the actual state (draft, published, contribution submitted, selected, staged, or revealed),
and any remaining owner action. If monitoring was requested, track per-edition demand and
state changes without promising selection or generating fake engagement.

## Sources and maintenance

Reviewed against frontend `5ec9468` and API `8f2d7cc` on 2026-09-05. Re-check current source
and live validation when behavior changes; creative advice above is not a new protocol rule.

- [Frontend creation form](https://github.com/visualizevalue/opepen-app/blob/main/components/SetSubmissionForm.client.vue),
  [dynamic assignments](https://github.com/visualizevalue/opepen-app/blob/main/components/DynamicImagesForm.vue),
  [publish controls](https://github.com/visualizevalue/opepen-app/blob/main/components/Set/EditOptions.client.vue).
- [Contributions](https://github.com/visualizevalue/opepen-app/blob/main/components/Set/Participation.client.vue),
  [composition](https://github.com/visualizevalue/opepen-app/blob/main/components/Set/CompositionBoard.client.vue),
  [authentication](https://github.com/visualizevalue/opepen-app/blob/main/composables/siwe.ts).
- [Media validation](https://github.com/visualizevalue/opepen-api/blob/main/app/Controllers/Http/ImagesController.ts),
  [staging](https://github.com/visualizevalue/opepen-api/blob/main/commands/StageSet.ts),
  [demand and reveal model](https://github.com/visualizevalue/opepen-api/blob/main/app/Models/SetSubmission.ts).

Maintainers: this file is the canonical public creator directive, served at `/agents.md`.
Keep `AGENTS.md`, `public/llms.txt`, and the README linked here rather than duplicating it.
