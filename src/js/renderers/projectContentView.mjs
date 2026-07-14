const escapeHTML = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

export function formatProjectDate(value, locale = undefined) {
  if (!value) return '';

  const normalized = /^\d{4}-\d{2}$/.test(value)
    ? `${value}-01T00:00:00`
    : value;
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function resolveProjectTools(project = {}, iconsByName = {}) {
  return [project.tool_icon1, project.tool_icon2]
    .map((name) => ({ name, icon: iconsByName[name] }))
    .filter(({ icon }) => typeof icon === 'string' && icon.trim());
}

export function resolveProjectIcons(project = {}, iconsByName = {}) {
  return resolveProjectTools(project, iconsByName).map(({ icon }) => icon);
}

function buildFacts(date, projectTools) {
  if (!date && projectTools.length === 0) return '';

  const dateHTML = date
    ? `
      <div class="project-detail__fact">
        <span class="project-detail__label">Released</span>
        <span class="project-detail__fact-value">${escapeHTML(date)}</span>
      </div>`
    : '';
  const toolsHTML = projectTools.length
    ? `
      <div class="project-detail__fact project-detail__fact--tools">
        <span class="project-detail__label">Built with</span>
        <div class="project-detail__tools" aria-label="Technologies used">
          ${projectTools.map(({ name, icon }) => `
            <span class="project-detail__tool">
              <span class="project-detail__tool-name">${escapeHTML(name)}</span>
              <span aria-hidden="true">${icon}</span>
            </span>`).join('')}
        </div>
      </div>`
    : '';

  return `<div class="project-detail__facts">${dateHTML}${toolsHTML}</div>`;
}

export function buildProjectContentHTML({
  project = {},
  markdownHTML = '',
  iconsByName = {},
  locale,
}) {
  const title = escapeHTML(project.title || 'Untitled project');
  const description = project.description ? escapeHTML(project.description) : '';
  const date = formatProjectDate(project.date, locale);
  const projectTools = resolveProjectTools(project, iconsByName);
  const factsHTML = buildFacts(date, projectTools);
  const hasImage = Boolean(project.image);
  const hasMarkdown = Boolean(markdownHTML.trim());
  const rootClass = hasImage
    ? 'project-detail'
    : 'project-detail project-detail--no-image';
  const heroHTML = hasImage
    ? `
      <figure class="project-detail__hero pop-up">
        <img
          class="project-detail__hero-image"
          src="${escapeHTML(project.image)}"
          alt="${title}"
          loading="eager"
          fetchpriority="high"
        >
      </figure>`
    : '';
  const summaryHTML = description
    ? `
      <div class="project-detail__summary">
        <span class="project-detail__label">In brief</span>
        <p>${description}</p>
      </div>`
    : '';
  const contextHTML = summaryHTML || factsHTML
    ? `<div class="project-detail__context">${summaryHTML}${factsHTML}</div>`
    : '';
  const articleHTML = hasMarkdown
    ? `<article class="project-detail__markdown markdown-body" id="markdown-content">${markdownHTML}</article>`
    : `
      <div class="project-detail__empty">
        <span class="project-detail__label">Project notes</span>
        <p>Case study coming soon.</p>
      </div>`;

  return `
    <div class="${rootClass}">
      <div class="project-detail__shell">
        <div class="project-detail__utility pop-up">
          <a class="project-detail__back" href="/projects" data-project-back>
            <span aria-hidden="true">&#8592;</span>
            <span>All projects</span>
          </a>
          <span class="project-detail__utility-label">Selected work</span>
        </div>
        ${heroHTML}
        <header class="project-detail__header pop-up">
          <div class="project-detail__heading">
            <span class="project-detail__label">Project showcase</span>
            <h1 class="project-detail__title">${title}</h1>
          </div>
          ${contextHTML}
        </header>
        <div class="project-detail__story project-detail__story--no-toc">
          <nav class="project-detail__toc" aria-label="On this page" hidden>
            <span class="project-detail__label">On this page</span>
            <ol class="project-detail__toc-list"></ol>
          </nav>
          <main class="project-detail__article">
            ${articleHTML}
          </main>
        </div>
        <footer class="project-detail__footer">
          <a class="project-detail__back project-detail__back--footer" href="/projects" data-project-back>
            <span aria-hidden="true">&#8592;</span>
            <span>Return to all projects</span>
          </a>
        </footer>
      </div>
    </div>
  `;
}
