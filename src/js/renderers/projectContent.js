import { marked } from 'marked';

import { popUp } from '../animation.js';
import { iconMap } from '../iconMap.js';
import { addTrackedListener } from '../utils/cleanup.js';
import supabase from '../../api/supabase.js';
import { showFeedback } from './feedbackBox.js';
import { buildProjectContentHTML } from './projectContentView.mjs';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function createHeadingId(text, seenIds) {
  const baseId = text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-') || 'section';
  const seenCount = seenIds.get(baseId) || 0;

  seenIds.set(baseId, seenCount + 1);
  return seenCount === 0 ? baseId : `${baseId}-${seenCount + 1}`;
}

function normalizeProjectHeadings(content) {
  const documentTitle = content.querySelector('h1');
  documentTitle?.remove();

  content.querySelectorAll('h1').forEach((heading) => {
    const replacement = document.createElement('h2');
    replacement.innerHTML = heading.innerHTML;
    heading.replaceWith(replacement);
  });

  const seenIds = new Map();
  const headings = [...content.querySelectorAll('h2, h3')];

  headings.forEach((heading) => {
    heading.id = createHeadingId(heading.textContent, seenIds);
    heading.tabIndex = -1;
  });

  return headings;
}

function populateTableOfContents(page, headings) {
  const toc = page.querySelector('.project-detail__toc');
  const tocList = page.querySelector('.project-detail__toc-list');
  const story = page.querySelector('.project-detail__story');

  if (!toc || !tocList || !story || headings.length === 0) return new Map();

  const linksByHeadingId = new Map();

  headings.forEach((heading, index) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    const indexLabel = document.createElement('span');
    const headingLabel = document.createElement('span');

    item.className = `project-detail__toc-item project-detail__toc-item--${heading.tagName.toLowerCase()}`;
    link.className = 'project-detail__toc-link';
    link.href = `#${heading.id}`;
    link.dataset.headingId = heading.id;
    indexLabel.textContent = String(index + 1).padStart(2, '0');
    headingLabel.textContent = heading.textContent;
    link.append(indexLabel, headingLabel);
    item.appendChild(link);
    tocList.appendChild(item);
    linksByHeadingId.set(heading.id, link);
  });

  toc.hidden = false;
  story.classList.remove('project-detail__story--no-toc');
  return linksByHeadingId;
}

function updateActiveHeading(headings, linksByHeadingId) {
  if (headings.length === 0) return;

  const readingThreshold = window.innerWidth < 1024 ? 132 : 128;
  let currentHeading = null;

  headings.forEach((heading) => {
    if (heading.getBoundingClientRect().top <= readingThreshold) {
      currentHeading = heading;
    }
  });

  linksByHeadingId.forEach((link, headingId) => {
    const isActive = headingId === currentHeading?.id;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

function scrollToHeading(heading) {
  const stickyOffset = window.innerWidth < 1024 ? 112 : 80;
  const top = heading.getBoundingClientRect().top + window.scrollY - stickyOffset;

  window.scrollTo({
    top,
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  });
  heading.focus({ preventScroll: true });
}

function removeFailedHero(page, image) {
  image.closest('.project-detail__hero')?.remove();
  page.classList.add('project-detail--no-image');
}

function attachProjectInteractions(page, headings, linksByHeadingId, router) {
  addTrackedListener(page, 'click', (event) => {
    const backLink = event.target.closest('[data-project-back]');
    if (backLink) {
      event.preventDefault();
      router.navigate('projects');
      return;
    }

    const tocLink = event.target.closest('[data-heading-id]');
    if (!tocLink) return;

    const heading = page.querySelector(`#${CSS.escape(tocLink.dataset.headingId)}`);
    if (!heading) return;

    event.preventDefault();
    scrollToHeading(heading);
  });

  const heroImage = page.querySelector('.project-detail__hero-image');
  if (heroImage) {
    const handleImageError = () => removeFailedHero(page, heroImage);
    addTrackedListener(heroImage, 'error', handleImageError);
    if (heroImage.complete && heroImage.naturalWidth === 0) handleImageError();
  }

  if (headings.length === 0) return;

  let ticking = false;
  const handleScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateActiveHeading(headings, linksByHeadingId);
      ticking = false;
    });
  };

  addTrackedListener(window, 'scroll', handleScroll);
  updateActiveHeading(headings, linksByHeadingId);
}

export async function renderProjectContent(projectSlug, router) {
  try {
    if (!projectSlug) throw new Error('Missing project slug');

    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', projectSlug)
      .single();

    if (error) throw error;

    const rawMarkdown = typeof project.markdown_content === 'string'
      ? project.markdown_content
      : '';
    const normalizedMarkdown = rawMarkdown.trim();
    if (normalizedMarkdown.includes('<!DOCTYPE html>')) {
      throw new Error('File not found - received HTML instead of markdown');
    }

    marked.setOptions({ breaks: true, gfm: true });
    const markdownHTML = normalizedMarkdown ? marked.parse(rawMarkdown) : '';
    const contentPage = document.getElementById('content-page');

    contentPage.innerHTML = buildProjectContentHTML({
      project,
      markdownHTML,
      iconsByName: iconMap,
    });

    const page = contentPage.querySelector('.project-detail');
    const markdownContent = page.querySelector('.project-detail__markdown');
    const headings = markdownContent ? normalizeProjectHeadings(markdownContent) : [];
    const linksByHeadingId = populateTableOfContents(page, headings);

    attachProjectInteractions(page, headings, linksByHeadingId, router);
    popUp();
    return true;
  } catch (error) {
    console.error(`Error loading project: ${error.message}`);
    showFeedback('error', 'Error loading file');
    router.navigate('projects');
    return false;
  }
}
