# Project Detail Cinematic Editorial Design

## Goal

Redesign `/projects/:slug` as a polished visual showcase that feels native to Ufolio's cinematic technical minimalism while preserving the existing Supabase project records and markdown authoring workflow.

## Direction

Use the approved **Cinematic Editorial** direction. The page opens with one dominant project image, follows with an oversized project title and concise metadata, then settles into a quiet long-form reading layout. The visual system stays monochrome and restrained: near-black surfaces, white typography, translucent rules, small uppercase technical labels, and limited motion.

The redesign removes the boxed GitHub-documentation appearance. Blue accents, the filled sidebar card, and repository-like markdown framing are replaced with the same fine-line geometry, spacious composition, and typography-led hierarchy used across the About and Skills pages.

## Content Contract

The page continues to fetch one `projects` record by slug. It uses only fields already consumed by the project index:

- `title` for the page heading and image alternative text
- `description` for the short project introduction
- `date` for the release label
- `image` for the lead visual
- `tool_icon1` and `tool_icon2` for technology metadata
- `markdown_content` for the complete case study

No new database fields or content migration are required. Missing optional metadata should disappear cleanly without leaving empty labels or gaps.

`title` and `slug` remain required project-index fields. `description`, `date`, `image`, both technology icons, and `markdown_content` are optional presentation data. A missing or unknown slug keeps the existing error-feedback-and-return-to-projects behavior. The router's page loader remains the loading state while Supabase resolves.

If the lead image is missing or fails to load, the hero region is removed and the title block becomes the first major visual element. Empty markdown does not discard an otherwise valid project; the page renders its hero and metadata followed by a quiet "Case study coming soon" state. If markdown has no qualifying section headings, the section rail is omitted and the article remains centered.

## Page Structure

1. A compact utility row provides a clear return action to the projects index and labels the page as selected work.
2. A wide lead image is shown at a stable landscape aspect ratio without darkening or obscuring the work.
3. A title block presents the project name at editorial scale. The existing description, formatted date, and available technology icons form a subordinate summary column.
4. The case study uses a narrow reading column with a minimal sticky section rail generated from project-body `h2` and `h3` headings.
5. Markdown media may expand to the reading-column width and acts as a visual pause between text sections.
6. The page ends with a clear return to the projects index rather than adding inferred next-project data.

## Responsive Behavior

Desktop uses a two-part title block and a three-column reading region: section rail, readable article measure, and breathing room. The navigation rail is visually unboxed and remains sticky while the reader moves through the article.

Below the desktop breakpoint, the title and summary stack. The section rail becomes a compact, horizontally scrollable section strip with natural-width, single-line labels and 44px link targets; labels are not truncated or masked. At phone widths, the page is a single content column with at least 16px body text, safe wrapping, and no horizontal page overflow. Wide tables and code blocks scroll within their own bounds.

## Typography And Components

- Use `var(--fontSecondary)` throughout the project page; remove the isolated PT Serif project heading treatment. Metadata labels use the existing system monospace stack.
- Project title: responsive editorial scale with heavy weight and tight line height, but normal letter spacing.
- Section headings: strong sans-serif hierarchy with generous vertical spacing.
- Labels: small uppercase monospace-style metadata, matching the site's technical voice.
- Rules and boundaries: one-pixel translucent white lines.
- Images: small radius consistent with project cards, never large floating cards.
- Code blocks and tables: restrained dark surfaces with visible borders and accessible contrast.
- Links: white text with a persistent underline or arrow cue; color is not the only affordance.

## Interaction And Motion

The entrance sequence reveals the utility row, lead image, title, and summary in a short stagger. Motion uses opacity and transform only, remains interruptible, and does not block reading. Active table-of-contents state transitions use a fine white indicator instead of a filled blue background.

All motion is disabled or reduced when `prefers-reduced-motion: reduce` is active. The return action and table-of-contents links receive visible keyboard focus. Clicking a section scrolls with an offset that accounts for the sticky navigation and does not add fragment entries to browser history, preserving the existing route back behavior.

## Implementation Boundaries

`src/js/renderers/projectContent.js` owns Supabase loading, markdown parsing, project-specific heading normalization, table-of-contents construction, and route-local interactions. A focused project template helper owns date formatting, icon lookup, optional-field fallbacks, and semantic page markup. A new `src/assets/styles/project-content.css`, linked from `index.html` after the shared markdown stylesheet, owns every visual override under the `.project-detail` root. The shared `markdown.css` and Journey renderer remain unchanged.

The project hero supplies the page's only `h1`. The first markdown `h1` is treated as the markdown document title and removed from the rendered project body; later markdown `h1` elements are demoted to `h2`. The section rail is then built from the resulting `h2` and `h3` hierarchy. This normalization is scoped to project detail and never mutates Journey content.

The implementation should reuse the installed `marked` package rather than adding dependencies. Supabase project markdown is an existing trusted, first-party content source, so HTML sanitization behavior remains unchanged in this visual redesign. Route-local scroll, click, and image-error listeners must be registered through `addTrackedListener` from `src/js/utils/cleanup.js`; the router's existing `cleanupAnimations()` call removes them before the next route renders.

The empty case-study treatment is unframed inline copy inside the normal article column, not a card or reusable component.

## Verification

- Build with `npm run build`.
- Verify the project route at desktop, tablet, and 375px phone widths.
- Confirm the lead image, title, description, date, technology metadata, markdown images, code blocks, tables, and links render correctly.
- Verify keyboard focus, return navigation, table-of-contents scrolling, active-section updates, and reduced-motion behavior.
- Verify empty markdown, missing image, and markdown without `h2`/`h3` sections render without empty layout regions.
- Navigate project to projects to project repeatedly and confirm tracked listeners do not accumulate.
- Confirm browser back behavior remains unchanged and section clicks do not create history entries.
- Confirm Journey markdown retains its current styling and behavior after the new project-scoped stylesheet is loaded.
- Check for horizontal overflow and browser console errors.
