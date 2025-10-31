import { fadeIn } from '../animation.js';
import { showPopBox } from './popBox.js';
import { router } from '../router.js';
import { renderJourneyContent } from './journeyContent.js';
import { showFeedback } from './feedbackBox.js';
import { showImg } from './showIMG.js';
import supabase from '../../api/supabase.js';
import { iconMap } from '../iconMap.js';

let currentYear;

/**
 * Converts a month number (1-12) to its full string name (e.g., "January").
 * @param {number} monthNum - The month number (1-indexed).
 * @returns {string} The full name of the month.
 */
function getMonthName(monthNum) {
  const date = new Date();
  date.setMonth(monthNum - 1); // JS Date months are 0-indexed
  return date.toLocaleString('en-US', { month: 'long' });
}

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

    // Convert the string year to a number for the query
    const numericYear = parseInt(currentYear, 10);
    if (isNaN(numericYear)) {
      throw new Error(`Invalid year provided: ${currentYear}`);
    }

    // Fetch months for the selected year
    const { data: monthsData, error: monthsError } = await supabase
      .from('months')
      .select('id, year, month_num')
      .eq('year', numericYear)
      .order('month_num', { ascending: true });

    if (monthsError) throw new Error(monthsError.message);

    if (!monthsData || monthsData.length === 0) {
      console.warn(`No months found for year ${numericYear}`);
      // Show empty state or return early
      const html = buildJourneyHTML([], currentYear);
      router.cachedData.journey[currentYear] = html;
      document.querySelector('html').classList.remove('no-scroll');
      document.getElementById('content-page').innerHTML = html;
      fadeIn();
      attachJourneyEvents();
      attachYearSelectorEvents();
      return true;
    }

    // Get all month IDs
    const monthIds = monthsData.map(m => m.id);

    // Fetch journey items for these months
    const { data: journeyData, error: journeyError } = await supabase
      .from('journey')
      .select(`
        id,
        action,
        link,
        title,
        type_icon1,
        image_1,
        image_2,
        description,
        month_id
      `)
      .in('month_id', monthIds);

    if (journeyError) throw new Error(journeyError.message);

    // Group journey items by month_id
    const journeyByMonth = {};
    if (journeyData) {
      journeyData.forEach(item => {
        if (!journeyByMonth[item.month_id]) {
          journeyByMonth[item.month_id] = [];
        }
        journeyByMonth[item.month_id].push(item);
      });
    }

    // Transform data to match the old JSON structure
    const transformedJourney = monthsData
      .filter(monthEntry => journeyByMonth[monthEntry.id]?.length > 0)
      .map(monthEntry => {
        const dateContent = journeyByMonth[monthEntry.id].map(item => ({
          id: item.id,
          action: item.action || "",
          link: item.link || "",
          title: item.title || "",
          type_icon1: item.type_icon1 || "",
          image_1: item.image_1 || "",
          image_2: item.image_2 || "",
          text: item.description || ""
        }));

        return {
          year: String(monthEntry.year),
          month: getMonthName(monthEntry.month_num),
          dateContent: dateContent
        };
      });

    const html = buildJourneyHTML(transformedJourney, currentYear);
    
    router.cachedData.journey[currentYear] = html;

    document.querySelector('html').classList.remove('no-scroll');
    document.getElementById('content-page').innerHTML = html;
    
    fadeIn();
    attachJourneyEvents();
    attachYearSelectorEvents();
    return true;

  } catch (error) {
    console.error('Failed to load journey', error);
    showFeedback('error', 'Failed to load journey');
  }
}

/**
 * Builds the HTML for the journey timeline.
 * @param {Array} filteredJourney - The pre-filtered and transformed journey data for the selected year.
 * @param {string} year - The currently selected year (as a string).
 * @returns {string} The complete HTML string for the timeline.
 */
function buildJourneyHTML(filteredJourney, year) {
  const journeyHTML = filteredJourney.map(journey => {
    const dateContent = journey.dateContent.map(item => {
      const img1 = document.createElement("img");
      const img2 = document.createElement("img");
      const imageContainer = document.createElement("div");
      
      // Create first image
      if (item.image_1) {
        img1.src = item.image_1;
        img1.alt = item.title;
        img1.loading = "lazy";
        imageContainer.appendChild(img1);
      }

      // Create second image (if it exists)
      if (item.image_2) {
        img2.src = item.image_2;
        img2.alt = item.title;
        img2.loading = "lazy";
        imageContainer.appendChild(img2);
      }

      // Wrap images in a container
      imageContainer.className = "timeline_image";
      
      return `
          <div class="timeline-card" data-journey-id="${item.id}" data-action="${item.action}" data-link="${item.link}">
            <div class="timeline_title-bar">
              <div class="timeline_title">
                ${item.title}
              </div>
              ${item.type_icon1 && iconMap[item.type_icon1]}
            </div>
            <p class="timeline_text">${item.text}</p>

            <div class="timeline-row">
              ${imageContainer.outerHTML}
              <div class="timeline_link_button ${item.action === '' ? 'hidden' : item.action}">
                <img src="/images/icon-rightarrow.svg" class="timeline_link_icon" title="My Project">
              </div>
            </div>
          </div>
        `;
      }).join('');

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
      <div class="page-wrapper">
        <div class="black-blocker"></div>
          <div class="year-selector">
            <div class="year ${year === '2024' ? 'active' : ''}">2024</div>
            <div class="year ${year === '2025' ? 'active' : ''}">2025</div>
          </div>
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
      showImg(imgEl.getAttribute('src'));
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
            if (!link) throw new Error('Missing link URL');
            window.location.href = link;
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
          showFeedback('error', 'Error');
          console.warn(`Unknown action: ${action}`);
      }
    }
  });
}