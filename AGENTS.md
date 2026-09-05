# Opepen agent instructions

If your task is to create an Opepen set or contribute artwork, read
[the Opepen creator directive](public/agents.md) first. It is the canonical guide to the
project, artwork constraints, edition structure, submission workflow, and selection process.
Follow its workflow to produce finished artwork and a submission package. You do not need to
install or modify this app to participate.

The same file is served at `/agents.md`. [public/llms.txt](public/llms.txt) helps external
agents discover it. Keep the full creator guide in one place: `public/agents.md`.

## When changing the application

This repository is the Nuxt 3 / Vue frontend for Opepen.art. The separate
[opepen-api](https://github.com/visualizevalue/opepen-api) repository handles authentication,
uploads, submissions, participation, consensus, and reveal operations. The
[metadata service](https://github.com/visualizevalue/opepens-metadata-api) is separate too.

- Read `package.json` and `.env.example` for setup. The package manager is pnpm; the dev
  command uses port 6996. API URLs are runtime configuration, not hardcoded in components.
- `pages/create/`, `components/SetSubmissionForm.client.vue`, and
  `components/DynamicImagesForm.vue` implement set creation.
- `components/Set/Participation.client.vue` and `components/Set/CompositionBoard.client.vue`
  implement contributions and creator selection.
- `composables/siwe.ts` manages wallet authentication. `utils/editions.ts` and
  `utils/demand.ts` define edition groups and consensus display.
- Verify documentation against the active form and the backend before asserting upload,
  publish, authentication, or selection requirements. Distinguish creative recommendations
  from validation rules, and source-code behavior from observed live status.
- Keep `/agents.md`, `/llms.txt`, and the README entry points consistent when changing the
  creator workflow. Do not embed credentials or private account information in public docs.
