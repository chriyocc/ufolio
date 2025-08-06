import { fadeIn } from '../animation.js';
import { showPopBox } from './popBox.js';
import { router } from '../router.js';

let currentYear = "2025";

export async function renderJourney(selectedYear = null, router) {
  try {
    if (router.cachedData.journey) {
      document.getElementById('content-page').innerHTML = router.cachedData.journey;
      fadeIn();
      attachJourneyEvents();
      attachYearSelectorEvents();
      return true;
    }
    const response = await fetch('/journey.json');
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const journey = await response.json();

    if (selectedYear) {
      currentYear = selectedYear
    };

    const html = buildJourneyHTML(journey, currentYear)
    router.cachedData.journey = html;
    document.getElementById('content-page').innerHTML = html;
    
    fadeIn();
    attachJourneyEvents();
    attachYearSelectorEvents();
    return true;

  } catch (error) {
      console.error('Failed to load projects', error);
  }
}

function buildJourneyHTML(journey, year) {
  const filteredJourney = journey.filter(journey => journey.year === year);
  
  const journeyHTML = filteredJourney.map(journey => {
    const dateContent = journey.dateContent.map(item => `
      <div class="timeline-card" data-journey-id="${item.id}" data-action="${item.action}">
        <div class="timeline_title-bar">
          <div class="timeline_title">
            ${item.title}
          </div>
          ${item.type_icon1}
        </div>
        <p class="timeline_text">
          ${item.text}
        </p>
        <div class="timeline-row">
          <div class="timeline_image" loading="lazy">
            ${item.image_1}
            ${item.image_2}
          </div>
          <div class="timeline_link_button">
            <img src="/images/icon-rightarrow.svg" class="timeline_link_icon" title="My Project">
          </div>
        </div>
      </div>
    `).join('');

    return `
      <div class="timeline_item">
        <div class="timeline_left">
          <div class="timeline_date-text">${journey.month} ${journey.year}</div>
        </div>
        <div class="timeline_centre">
          <div class="timeline_circle"></div>
        </div>
        <div class="timeline_right">
          ${dateContent}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="fade-in">
      <div class="year-selector">
        <div class="year ${year === '2024' ? 'active' : ''}">2024</div>
        <div class="year ${year === '2025' ? 'active' : ''}">2025</div>
      </div>
      <div class="page-wrapper">
        <div class="section-timeline">
          <div class="container">
            <div class="timeline_component">
              <div class="timeline-progress">
                <div class="timeline-progress-bar"></div>
              </div>
              ${journeyHTML}
              <div class="overlay-fade-top"></div>
              <div class="overlay-fade-bottom"></div>
            </div>
          </div>
        </div>
        <div style="height: 45vh;"></div>
      </div>
    </div>
  `;
}

function attachYearSelectorEvents() {
  document.querySelector('.year-selector').addEventListener('click', async (e) => {
    const yearButton = e.target.closest('.year');

    if (yearButton) {
      document.querySelector('.year.active').classList.remove('active');
      yearButton.classList.add('active');
      router.navigate('journey', true, null, yearButton.innerHTML);
    }
  });
}

function attachJourneyEvents() {
  document.querySelector('.timeline_component').addEventListener('click', async (e) => {
    const linkButton = e.target.closest('.timeline_link_button');
    
    if (linkButton) {
      const journey = linkButton.closest('.timeline-card');
      const action = journey.dataset.action;
      const journeyID = journey.dataset.journeyId;

      switch (action) {
        case 'popbox':
          showPopBox(`<h1>My Comprehensive Markdown Showcase</h1>
<p>This document is a comprehensive demonstration of various Markdown features. It's designed to be a long, detailed example, covering a wide range of formatting options.</p>
<h2>Section 1: Basic Text Formatting</h2>
<p>Here's a paragraph of text. You can make words <strong>bold</strong> or <em>italic</em>. You can also use a combination like <strong><em>bold and italic</em></strong>. For strikethrough, you can use two tildes: <del>this text is gone</del>.</p>
<ul>
<li>This is a bullet point list.</li>
<li>Another item.
<ul>
<li>You can nest lists by indenting.</li>
<li>Like this.</li>
</ul>
</li>
</ul>
<ol>
<li>This is a numbered list.</li>
<li>The second item.</li>
<li>The third item.</li>
</ol>
<hr>
<h2>Section 2: Links and Images</h2>
<p>This is a regular inline link to <a href="https://www.google.com">Google</a>.</p>
<p>Here is a reference-style link. I can link to <a href="https://www.wikipedia.org">Wikipedia</a> using a short identifier.</p>
<p><img src="https://picsum.photos/600/400" alt="A beautiful landscape image"></p>
<h2>Section 3: Blockquotes and Code</h2>
<blockquote>
<p>This is a blockquote.
It's often used for quoting text from another source.</p>
<blockquote>
<p>You can also nest blockquotes for more complex structures.</p>
</blockquote>
</blockquote>
<p>Here is some <code>inline code</code> within a sentence. It's useful for calling out small snippets like variable names or commands.</p>
<p>And here is a code block, which is used for larger chunks of code.</p>
<pre><code class="language-python">def fibonacci(n):
    a, b = 0, 1
    while a &lt; n:
        print(a, end=' ')
        a, b = b, a+b
    print()

fibonacci(1000)
</code></pre>
<h2>Section 4: Tables</h2>
<p>This is a simple table demonstrating how to organize data.</p>
<table>
<thead>
<tr>
<th style="text-align: left;">Header 1</th>
<th style="text-align: center;">Header 2</th>
<th style="text-align: left;">Header 3</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: left;">Left</td>
<td style="text-align: center;">Center</td>
<td style="text-align: left;">Right</td>
</tr>
<tr>
<td style="text-align: left;">Cell 1</td>
<td style="text-align: center;">Cell 2</td>
<td style="text-align: left;">A longer cell with more text.</td>
</tr>
<tr>
<td style="text-align: left;">Cell 4</td>
<td style="text-align: center;">Cell 5</td>
<td style="text-align: left;">Cell 6</td>
</tr>
<tr>
<td style="text-align: left;">This is a row with a lot of content across multiple columns.</td>
<td style="text-align: center;">Another cell with content.</td>
<td style="text-align: left;">And one more.</td>
</tr>
</tbody>
</table>
<h2>Section 5: Horizontal Rule and Miscellaneous</h2>
<p>You can use three or more hyphens, asterisks, or underscores to create a horizontal rule.</p>
<hr>
<h2>Section 6: More Complex Lists</h2>
<p>Here is a more complex nested list structure, demonstrating how deep and varied you can make your lists.</p>
<ul>
<li><strong>Project Kickoff</strong>
<ul>
<li>Task A
<ol>
<li>Subtask A.1</li>
<li>Subtask A.2</li>
</ol>
</li>
<li>Task B</li>
</ul>
</li>
<li><strong>Implementation Phase</strong>
<ul>
<li>Milestone 1
<ul>
<li>Feature X</li>
<li>Feature Y</li>
</ul>
</li>
<li>Milestone 2
<ul>
<li>Feature Z
<ul>
<li>Detail 1</li>
<li>Detail 2</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
</ul>
`);
          break;
        
        case 'navigate':
          window.location.href = `/projects/${journeyID}`;
          break;
        
        default:
          console.warn(`Unknown action: ${action}`);
      }
    }
  });
}

