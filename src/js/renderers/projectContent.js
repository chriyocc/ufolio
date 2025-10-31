import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import { popUp } from '../animation.js';
import { showFeedback } from './feedbackBox.js';
import supabase from '../../api/supabase.js';

export async function renderProjectContent(projectSlug, router) {
  try {
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', `${projectSlug}`)
      .single(); // ensure only one row is returned
    
    if (error) {
      throw error;
    }
    
    const markdownText = project.markdown_content;
    
    if (!markdownText || markdownText === '') {
      throw new Error(`No markdown content found for project with slug "${projectSlug}"`);
    }

    if (markdownText.includes('<!DOCTYPE html>')) {
      throw new Error('File not found - received HTML instead of markdown');
    }

    marked.setOptions({
        breaks: true,
        gfm: true
    });

    const htmlContent = marked.parse(markdownText);
    const fullHTML = `
      <div class="markdown-page-wrapper">
        <div class="markdown-container">
            <aside class="sidebar">
                <h3>Table of Contents</h3>
                <ul class="toc" id="toc"></ul>
            </aside>
            <main class="content">
                <div class="markdown-body" id="markdown-content">
                  ${htmlContent}
                </div>
                <div style="height: 100px;"></div>
            </main>
            
        </div>
      </div>
     
      
    `;
    document.getElementById('content-page').innerHTML = fullHTML;

    const contentDiv = document.getElementById('markdown-content');
    const tocList = document.getElementById('toc');

    const headings = contentDiv.querySelectorAll('h1, h2, h3');
    const tocItems = [];

    headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;

        const level = heading.tagName.toLowerCase();
        const text = heading.textContent;

        const li = document.createElement('li');
        li.className = `toc-item level-${level.charAt(1)}`;

        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = text;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
            updateActiveTocItem(li);
        });

        li.appendChild(a);
        tocList.appendChild(li);
        tocItems.push({ element: li, heading: heading });
    });

    function updateActiveTocItem(activeItem) {
        document.querySelectorAll('.toc-item').forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
    }

    const theWindow = document.querySelector('body');
    let ticking = false;

    theWindow.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                let current = null;
                const scrollPos = contentArea.scrollTop + 100;

                tocItems.forEach(item => {
                    const headingTop = item.heading.offsetTop;
                    if (scrollPos >= headingTop) {
                        current = item.element;
                    }
                });

                if (current) {
                    updateActiveTocItem(current);
                }

                ticking = false;
            });
            ticking = true;
        }
    });

    if (tocItems.length > 0) {
        updateActiveTocItem(tocItems[0].element);
    }

    popUp();
    return true;
  } catch (err) {
    if (err.response) {
      // Server responded with a status outside 2xx
      console.error('HTTP error', err.response.status);
    } else if (err.request) {
      // Request was made but no response received
      console.error('No response received', err.request);
    }
    console.error(`Error loading file: ${err.message}`);
    showFeedback('error', 'Error loading file')
    router.navigate('projects');
  }
}