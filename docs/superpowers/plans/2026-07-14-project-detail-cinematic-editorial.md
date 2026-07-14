# Project Detail Cinematic Editorial Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the GitHub-like `/projects/:slug` view with the approved image-led Cinematic Editorial showcase while preserving current Supabase project data and markdown content.

**Architecture:** Extract a pure `.mjs` view helper so metadata formatting and conditional markup can be tested with Node's built-in test runner. Keep Supabase loading, markdown parsing, heading normalization, table-of-contents behavior, and tracked route events in the existing renderer. Add a project-scoped stylesheet after `markdown.css` so Journey markdown cannot regress.

**Tech Stack:** Vite, browser ES modules, Supabase JS, marked, existing icon map, existing `popUp` animation, Node `node:test`, CSS.

---

## Chunk 1: Rendering Contract And Page Shell

### Task 1: Lock the project view contract with tests

**Files:**
- Create: `tests/projectContentView.test.mjs`
- Create: `src/js/renderers/projectContentView.mjs`
- Modify: `package.json`

- [ ] **Step 1: Replace the placeholder test script**

Set the package script to:

```json
"test": "node --test tests/*.test.mjs"
```

- [ ] **Step 2: Write failing view-helper tests**

Cover the exact presentation contract:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildProjectContentHTML,
  formatProjectDate,
  resolveProjectIcons,
} from '../src/js/renderers/projectContentView.mjs';

test('formats project month values for display', () => {
  assert.equal(formatProjectDate('2025-08', 'en-US'), 'August 2025');
  assert.equal(formatProjectDate('', 'en-US'), '');
  assert.equal(formatProjectDate('not-a-date', 'en-US'), '');
});

test('renders image-led project metadata and trusted markdown', () => {
  const html = buildProjectContentHTML({
    markdownHTML: '<h1>Signal Lab</h1><h2>Overview</h2><p>Body</p>',
    iconsByName: { vite: '<svg data-tool="vite"></svg>' },
    project: {
      title: 'Signal Lab',
      description: 'A focused engineering tool.',
      date: '2025-08',
      image: 'https://example.com/signal.jpg',
      tool_icon1: 'vite',
    },
    locale: 'en-US',
  });

  assert.match(html, /class="project-detail/);
  assert.match(html, /Signal Lab/);
  assert.match(html, /A focused engineering tool\./);
  assert.match(html, /August 2025/);
  assert.match(html, /signal\.jpg/);
  assert.match(html, /data-tool="vite"/);
  assert.match(html, /<h2>Overview<\/h2>/);
});

test('omits missing optional regions and renders the inline empty state', () => {
  const html = buildProjectContentHTML({
    project: { title: 'Quiet Project' },
    markdownHTML: '',
    iconsByName: {},
    locale: 'en-US',
  });

  assert.doesNotMatch(html, /project-detail__hero/);
  assert.doesNotMatch(html, /project-detail__summary/);
  assert.doesNotMatch(html, /project-detail__facts/);
  assert.match(html, /Case study coming soon/);
  assert.match(html, /project-detail--no-image/);
});

test('escapes project metadata while preserving parsed markdown HTML', () => {
  const html = buildProjectContentHTML({
    project: { title: '<script>alert(1)</script>' },
    markdownHTML: '<p><strong>Trusted body</strong></p>',
    iconsByName: {},
  });

  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /<strong>Trusted body<\/strong>/);
});

test('keeps valid partial metadata and ignores unknown tool icons', () => {
  const project = {
    title: 'Partial Project',
    date: '2025-08',
    tool_icon1: 'vite',
    tool_icon2: 'unknown',
  };
  const iconsByName = { vite: '<svg data-tool="vite"></svg>' };

  assert.deepEqual(resolveProjectIcons(project, iconsByName), [iconsByName.vite]);

  const html = buildProjectContentHTML({
    project,
    markdownHTML: '<h2>Overview</h2><p>Body</p>',
    iconsByName,
    locale: 'en-US',
  });

  assert.doesNotMatch(html, /project-detail__hero/);
  assert.doesNotMatch(html, /project-detail__summary/);
  assert.match(html, /August 2025/);
  assert.match(html, /data-tool="vite"/);
  assert.equal((html.match(/data-project-back/g) || []).length, 2);
  assert.equal((html.match(/<h1/g) || []).length, 1);
  assert.match(html, /class="project-detail__toc"[^>]*hidden/);
  assert.match(html, /class="project-detail__toc-list"/);
});
```

- [ ] **Step 3: Run tests and confirm they fail**

Run: `npm test`

Expected: FAIL because `projectContentView.mjs` does not exist.

- [ ] **Step 4: Implement the pure project view helper**

Create `projectContentView.mjs` with these responsibilities:

```js
const escapeHTML = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

export function formatProjectDate(value, locale = undefined) {
  if (!value) return '';
  const normalized = /^\d{4}-\d{2}$/.test(value) ? `${value}-01T00:00:00` : value;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
}

export function buildProjectContentHTML({
  project,
  markdownHTML = '',
  iconsByName = {},
  locale,
}) {
  // Return the approved semantic shell. Escape Supabase metadata, preserve the
  // trusted marked output, and omit image/summary/facts when their data is absent.
}
```

Export `resolveProjectIcons(project, iconsByName)` from the same helper. It must inspect `tool_icon1` and `tool_icon2`, return only map entries that exist and contain markup, and preserve field order. `buildProjectContentHTML` calls this function internally, keeping icon lookup and optional fallback behavior inside the pure helper while the renderer only supplies the existing map.

The returned shell must contain:

- `.project-detail` root with `.project-detail--no-image` when appropriate
- two `[data-project-back]` links, one in the utility row and one after the article
- optional eager-loaded `.project-detail__hero-image` with escaped alt text
- `.project-detail__title` as the only page `h1`
- optional description, date, and technology-icon list
- initially hidden `.project-detail__toc` and empty `.project-detail__toc-list`
- `.project-detail__markdown.markdown-body` containing trusted parsed markdown
- unframed `.project-detail__empty` copy for empty markdown
- `pop-up` only on the utility row, hero, and title block

- [ ] **Step 5: Run tests and confirm they pass**

Run: `npm test`

Expected: 5 tests pass with zero failures.

### Task 2: Rebuild the project renderer around the view helper

**Files:**
- Modify: `src/js/renderers/projectContent.js`

- [ ] **Step 1: Replace the CDN parser and wire focused dependencies**

Use:

```js
import { marked } from 'marked';
import { popUp } from '../animation.js';
import { iconMap } from '../iconMap.js';
import { addTrackedListener } from '../utils/cleanup.js';
import { buildProjectContentHTML } from './projectContentView.mjs';
```

Keep `showFeedback` and Supabase imports. Pass `iconMap` to `buildProjectContentHTML` as `iconsByName`; do not perform icon key lookup in the renderer. Do not modify Journey's renderer.

- [ ] **Step 2: Add project-only heading normalization**

After injecting the page:

1. Remove the first markdown `h1` as the document title.
2. Replace each remaining markdown `h1` with an `h2` while preserving children.
3. Build unique, stable IDs from final `h2` and `h3` text with a slug counter fallback.
4. When headings exist, populate `.project-detail__toc-list`, set `toc.hidden = false`, and remove `.project-detail__story--no-toc`.
5. When no headings remain, keep the TOC hidden and add `.project-detail__story--no-toc`.

Keep helpers local to `projectContent.js` because they require the browser DOM and are route-specific.

- [ ] **Step 3: Add tracked project interactions**

Register all route-local events through `addTrackedListener`:

- back-link clicks prevent default and call `router.navigate('projects')`
- TOC clicks calculate `heading.getBoundingClientRect().top + window.scrollY - stickyOffset`, where `stickyOffset` is 112px below 1024px and 80px otherwise, then call `window.scrollTo`. Smooth behavior is used unless reduced motion is requested.
- hero `error` removes `image.closest('.project-detail__hero')` entirely and applies `.project-detail--no-image` to the root, making the title block the first major visual element
- the throttled window scroll handler updates `.active` on the last heading above the reading threshold

Section clicks must not push or replace history entries. Call `popUp()` after setup and return `true`.

- [ ] **Step 4: Preserve loading and error behavior**

Use the router's existing project loader while fetching. A missing record or invalid HTML response must still show `showFeedback('error', 'Error loading file')` and navigate back to projects. Empty markdown is valid and must render the inline empty state.

- [ ] **Step 5: Run tests and build**

Run: `npm test && npm run build`

Expected: tests pass; Vite builds successfully. The pre-existing missing `about-me/index.css` warning may remain, but no new warning may reference project-detail files.

### Task 3: Implement the approved visual system without affecting Journey

**Files:**
- Create: `src/assets/styles/project-content.css`
- Modify: `index.html`

- [ ] **Step 1: Load the scoped stylesheet after shared markdown styles**

Add this immediately after the `markdown.css` link:

```html
<link rel="stylesheet" href="/src/assets/styles/project-content.css">
```

- [ ] **Step 2: Implement the desktop editorial composition**

Every selector must begin with `.project-detail`. Define page-local tokens for surface, line, muted text, content width, and motion easing. Implement:

- max-width shell around `1440px` with responsive 4/8-based gutters
- 44px utility links with arrow cue and visible `:focus-visible`
- lead image at a stable landscape aspect ratio, `object-fit: cover`, small radius, and no overlay
- two-column title/summary block with an editorial `clamp()` title size and normal letter spacing
- unboxed metadata facts and tool icons separated by thin rules
- desktop reading grid with sticky section rail, 65-72 character article measure, and breathing room
- active TOC state using a one-pixel white indicator, never blue fill
- project-scoped markdown overrides for headings, paragraphs, links, images, lists, quotes, code, preformatted blocks, and tables
- unframed closing return link and empty state

- [ ] **Step 3: Implement responsive and reduced-motion behavior**

At tablet widths, stack title and summary and turn the section rail into a natural-width horizontal scroll strip. At 640px and below, use at least 16px body text, 44px controls, compact gutters, and self-contained overflow for code/tables. Ensure image, title, and long words cannot exceed the viewport.

Under `prefers-reduced-motion: reduce`, force project `pop-up` elements visible, remove transitions/transforms, disable smooth scrolling in CSS, and preserve all content immediately.

- [ ] **Step 4: Run static verification**

Run:

```bash
npm test
npm run build
git diff --check
```

Expected: all commands succeed except the documented existing Vite warning; no whitespace errors.

### Task 4: Verify the real route visually and interactively

**Files:**
- Create: `.omx/state/project-detail/ralph-progress.json`
- Modify only if visual verdict identifies a concrete mismatch: `src/assets/styles/project-content.css`, `src/js/renderers/projectContent.js`, or `src/js/renderers/projectContentView.mjs`

- [ ] **Step 1: Start the local app**

Run: `npm run dev -- --host 127.0.0.1 --port 4173`

Expected: Vite reports `http://127.0.0.1:4173/` and remains running.

- [ ] **Step 2: Exercise the live project path**

Open `/projects`, select a real project, and verify the detail route at 1440x1000, 768x1024, and 375x812. Confirm:

- lead image is visible and not obscured
- title, description, date, and icons match the selected project
- TOC scrolling and active state work
- keyboard focus is visible
- browser back returns predictably
- markdown media, code, tables, links, and long words remain contained
- Journey markdown still renders with its existing styling
- project to projects to project navigation does not add duplicate handlers
- browser console contains no project-detail errors

- [ ] **Step 3: Run the visual-verdict iteration**

Save screenshots to `.omx/state/project-detail/desktop.png`, `.omx/state/project-detail/tablet.png`, and `.omx/state/project-detail/phone.png`. Use the approved `cinematic-editorial-blueprint.png` as the intent reference and compare it with desktop and phone screenshots. Persist JSON to `.omx/state/project-detail/ralph-progress.json` with `score`, threshold, differences, suggestions, reasoning, and next actions.

If score is below 90, make only the suggested visual adjustments, recapture screenshots, and rerun the verdict before another edit. Stop when the score is at least 90 and the UI category matches a cinematic editorial portfolio showcase.

For interaction evidence, record `window.animationListeners.length` on the first project render, navigate project to projects to project twice, and confirm the count returns to the same value rather than increasing. Record `location.href` and `history.length` before and after a TOC click and confirm both are unchanged.

- [ ] **Step 4: Run final verification**

Run:

```bash
npm test
npm run build
git diff --check
git status --short
```

Expected: tests and build pass, no whitespace errors, and the status lists only intentional implementation files plus the user's pre-existing unrelated changes.
