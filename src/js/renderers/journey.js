import { fadeIn } from '../animation.js';
import { showPopBox } from './popBox.js';
import { router } from '../router.js';
import { renderJourneyContent } from './journeyContent.js';
import { showFeedback } from './feedbackBox.js';
import { showImg } from './showIMG.js';

let currentYear;

export async function renderJourney(selectedYear = null, router) {
  try {
    if (selectedYear) currentYear = selectedYear;
    if (!router.cachedData.journey) router.cachedData.journey = {};
    if (router.cachedData.journey[currentYear]) {
      document.getElementById('content-page').innerHTML = router.cachedData.journey[currentYear];
      fadeIn();
      attachJourneyEvents();
      attachYearSelectorEvents();
      return true;
    }

    const response = await fetch('/journey.json');
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const journey = await response.json();

    const html = buildJourneyHTML(journey, currentYear)
    
    router.cachedData.journey[currentYear] = html;
    
    document.getElementById('content-page').innerHTML = html;
    
    fadeIn();
    attachJourneyEvents();
    attachYearSelectorEvents();
    return true;

  } catch (error) {
    console.error('Failed to load journey', error);
    showFeedback('error', 'Failed to load journey')
  }
}

function buildJourneyHTML(journey, year) {
  const filteredJourney = journey.filter(journey => journey.year === year);
  
  const journeyHTML = filteredJourney.map(journey => {
    const dateContent = journey.dateContent.map(item => `
      <div class="timeline-card" data-journey-id="${item.id}" data-action="${item.action}" data-link="${item.link}">
        <div class="timeline_title-bar">
          <div class="timeline_title">
            ${item.title}
          </div>
          ${item.type_icon1}
        </div>
        <p class="timeline_text">${item.text}</p>

        <div class="timeline-row">
          <div class="timeline_image" loading="lazy">
            ${item.image_1}
            ${item.image_2}
          </div>
          <div class="timeline_link_button ${item.action === '' ? 'hidden' : item.action}">
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

async function attachJourneyEvents() {
  document.querySelector('.timeline_component').addEventListener('click', async (e) => {
    const linkButton = e.target.closest('.timeline_link_button');
    const imgEl = e.target.closest('.timeline_image img');


    if (imgEl) {
      showImg(imgEl.getAttribute('src'))
    }
    
    if (linkButton) {
      const journey = linkButton.closest('.timeline-card');
      const action = journey.dataset.action;
      const journeyID = journey.dataset.journeyId;
      const link = journey.dataset.link;

      switch (action) {
        case 'popbox':
          try {
            const fullHTML = await renderJourneyContent(journeyID);
            showPopBox(fullHTML);
          } catch (err) {
            console.error('Popbox error:', err);
            showFeedback('error', 'Error');
          }
          break;
        
        case 'navigate':
          try {
            if (!journeyID) throw new Error('Missing journeyID');
            window.location.href = `/projects/${journeyID}`;
          } catch (err) {
            console.error('Navigation error:', err);
            showFeedback('error', 'Error');
          }
          break;
        
        case 'link':
          try {
            if (!link) throw new Error('Missing link URL');
            window.open(link, '_blank');
          } catch (err) {
            console.error('Link error:', err);
            showFeedback('error', 'Error');
          }
          break;
        
        default:
          showFeedback('error', 'Error')
          console.warn(`Unknown action: ${action}`);
      }
    }
  });

}

