import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildProjectContentHTML,
  formatProjectDate,
  isPrimaryProjectHeading,
  resolveProjectIcons,
  splitProjectHeading,
} from '../src/js/renderers/projectContentView.mjs';

test('formats project month values for display', () => {
  assert.equal(formatProjectDate('2025-08', 'en-US'), 'August 2025');
  assert.equal(formatProjectDate('', 'en-US'), '');
  assert.equal(formatProjectDate('not-a-date', 'en-US'), '');
});

test('separates decorative heading icons and keeps only primary headings in the section index', () => {
  assert.deepEqual(splitProjectHeading('🧰 Tech Stack'), {
    icon: '🧰',
    label: 'Tech Stack',
  });
  assert.deepEqual(splitProjectHeading('Hardware'), {
    icon: '',
    label: 'Hardware',
  });
  assert.equal(isPrimaryProjectHeading('H2'), true);
  assert.equal(isPrimaryProjectHeading('h3'), false);
});

test('renders image-led project metadata and trusted markdown', () => {
  const html = buildProjectContentHTML({
    project: {
      title: 'Signal Lab',
      description: 'A focused engineering tool.',
      date: '2025-08',
      image: 'https://example.com/signal.jpg',
      tool_icon1: 'vite',
    },
    markdownHTML: '<h1>Signal Lab</h1><h2>Overview</h2><p>Body</p>',
    iconsByName: { vite: '<svg data-tool="vite"></svg>' },
    locale: 'en-US',
  });

  assert.match(html, /class="project-detail/);
  assert.match(html, /Signal Lab/);
  assert.match(html, /A focused engineering tool\./);
  assert.match(html, /August 2025/);
  assert.match(html, /signal\.jpg/);
  assert.match(html, /alt="Signal Lab"/);
  assert.doesNotMatch(html, /alt="Signal Lab project preview"/);
  assert.match(html, /class="project-detail__hero-ambient"/);
  assert.match(html, /class="project-detail__hero-ambient"[\s\S]*?alt=""[\s\S]*?aria-hidden="true"/);
  assert.ok(
    html.indexOf('project-detail__hero-ambient') < html.indexOf('project-detail__hero-image'),
    'tonal wash should sit behind the accessible lead image',
  );
  assert.equal((html.match(/signal\.jpg/g) || []).length, 2);
  assert.ok(
    html.indexOf('project-detail__header') < html.indexOf('project-detail__hero'),
    'project identity should appear before lead media',
  );
  assert.match(html, /data-tool="vite"/);
  assert.match(html, /<article class="project-detail__markdown markdown-body"/);
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
  assert.match(html, /class="project-detail__tool-name">vite<\/span>/);
  assert.equal((html.match(/data-project-back/g) || []).length, 2);
  assert.equal((html.match(/<h1/g) || []).length, 1);
  assert.match(html, /class="project-detail__toc"[^>]*hidden/);
  assert.match(html, /class="project-detail__toc-list"/);
});
