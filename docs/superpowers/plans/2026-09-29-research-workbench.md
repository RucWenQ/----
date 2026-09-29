# Research Workbench Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with verification checkpoints.

**Goal:** Build a runnable local research workbench beside the VitePress tutorial for paper review and psychology idea refinement.

**Architecture:** Keep VitePress as the static documentation site and add a small Node HTTP service plus a browser workbench under `/research/`. The service owns uploads, task state, local persistence, reports and idea revisions; a replaceable skill runner supplies deterministic demo outputs until a real model adapter is configured.

**Tech Stack:** Node.js ESM, native `http`/`fs/promises`/`crypto`, browser ES modules, VuePress/VitePress existing build.

**Spec:** `docs/superpowers/specs/2026-09-29-research-workbench-design.md`

## Global Constraints

- Accept PDF uploads up to 25 MB and persist them under `data/`.
- Do not add production auth, OCR, external model calls or database dependencies in this MVP.
- Preserve existing VitePress pages and visual language.
- API errors use `{ error: { code, message } }`.
- `npm run build` and API smoke tests must pass before completion.

---

### Task 1: Add server foundation and persistent storage

**Files:**
- Create: `app/server/storage.mjs`
- Create: `app/server/skill-runner.mjs`
- Create: `app/server/index.mjs`
- Modify: `package.json`
- Create: `.gitignore` entry for `data/`

**Interfaces:**
- `storage.mjs` exports `createStorage(root)`, `storage.saveUpload({ filename, buffer })`, `storage.saveRun(run)`, `storage.readRun(id)`, `storage.listLibrary()`, `storage.saveReport(report)`, `storage.createIdea()`, `storage.addIdeaMessage()`, `storage.readIdea()`.
- `skill-runner.mjs` exports `runPaperReview(input)` and `runIdeaRefiner(input)`, both returning structured JSON plus Markdown.
- `index.mjs` exports `createServer({ dataRoot, runner })` and starts from `npm run server`.

- [ ] Step 1: Create the storage module with JSON indexes and atomic writes.
- [ ] Step 2: Create the demo skill runner with stable output schemas and explicit `demo` status.
- [ ] Step 3: Create the HTTP router with health, upload, run, library, download and idea endpoints.
- [ ] Step 4: Add `server` and `server:dev` scripts and ignore runtime data.
- [ ] Step 5: Run `node --check` on all server modules.

### Task 2: Add workbench UI and styling

**Files:**
- Create: `app/web/research-workbench.html`
- Create: `app/web/research-workbench.js`
- Create: `app/web/research-workbench.css`

**Interfaces:**
- The page consumes the API routes from Task 1.
- `research-workbench.js` exposes no global API; it renders from local state and handles upload, polling, idea messages and downloads.

- [ ] Step 1: Build the two-pane workbench shell with tabs for literature review, idea refiner and library.
- [ ] Step 2: Add accessible upload control, status timeline, report preview and download controls.
- [ ] Step 3: Add idea conversation, stage indicator, spec panel and revision list.
- [ ] Step 4: Add responsive styles consistent with the existing tutorial theme.
- [ ] Step 5: Run a static HTML reference check and browser smoke test against the server.

### Task 3: Integrate with VitePress navigation

**Files:**
- Create: `docs/research/index.md`
- Modify: `docs/.vitepress/config.mts`
- Modify: `docs/.vitepress/sidebar.mts`

**Interfaces:**
- The VitePress route links to the separately served `/research/` workbench.
- Existing tutorial pages remain unchanged.

- [ ] Step 1: Add a short research tools landing page with the workbench link and scope notice.
- [ ] Step 2: Add a top navigation item and sidebar entry.
- [ ] Step 3: Run `npm run build` and verify the generated page contains the workbench link.

### Task 4: Verify end-to-end local workflow

**Files:**
- Create: `app/server/smoke-test.mjs`
- Modify: `README.md`

**Interfaces:**
- Smoke test starts an ephemeral server, uploads a generated minimal PDF-like fixture, polls the run, reads library data, creates an idea, sends a message and validates revision persistence.

- [ ] Step 1: Write the smoke test assertions for health, upload, report download and idea revision.
- [ ] Step 2: Run the smoke test and fix API or persistence defects.
- [ ] Step 3: Run `npm run build`.
- [ ] Step 4: Update README with `npm run server`, `npm run dev` and workbench URL.
- [ ] Step 5: Re-run smoke test and build from a clean server process.
