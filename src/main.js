import { popUp,fadeIn } from './js/animation.js'
// import { attachProjectEvents} from './js/projects.js'
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

class Router {
  constructor() {
    this.routes = {
      'about': this.renderAbout,
      'projects': this.renderProjects,
      'journey': this.renderJourney,
      'project': this.renderProjectContent
    };
    
    this.contentEl = document.getElementById('content-page');
    
    //Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      if (e.state) {
        // Use the state from history
        const { route, projectID } = e.state;
        this.navigate(route, false, projectID); // DON'T push to history again
      } else {
        // No state means initial page load or manual URL entry
        const routeInfo = this.getRouteFromUrl();
        this.navigate(routeInfo.route, false, routeInfo.projectID);
      }
    });
    
    const initRoute = this.getRouteFromUrl()
    this.navigate(initRoute.route, true, initRoute.projectID);
  }

  getRouteFromUrl() {
    // Get route from URL pathname (e.g., /users -> users)
    const path = window.location.pathname.split('/').filter(segment => segment);
    
    if (path.length === 0) {
      return { route: 'about', projectID: null };
    }
    
    if (path[0] == 'projects' && path[1]) {
      return {route: 'project', projectID: path[1]}
    }

    return {
      route: this.routes[path[0]] ? path[0] : 'about',
      projectID: null
    };
  }

  navigate(route, pushState = true, projectID = null) {
    let url;
    let stateData;

    if (route == 'project' && projectID) {
      url = `/projects/${projectID}`;
      stateData = { route, projectID };
    } else {
      url = `/${route}`
      stateData = { route };
    }

    if (pushState) {
      history.pushState(stateData, '', url);
    }

    if (route == 'project') {
      this.routes[route].call(this, projectID);
      document.querySelector('.nav-bar').style.display = 'none';
    } else {
      this.routes[route].call(this);
      document.querySelector('.nav-bar').style.display = 'flex';
      document.querySelector('.nav-item.active').classList.remove('active');
      document.getElementById(`${route}`)?.classList.add('active');
      document.querySelector('.nav-container').classList.add('active');
    }

  }

  async renderAbout() {
    const response = await fetch('/src/assets/views/about.html');
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    
    this.contentEl.innerHTML = html;
    popUp()
  }

  async renderProjects() {
    try {
      const response = await fetch('/src/assets/views/projects.json');
      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      const projects = await response.json();
      
      const projectsHTML = projects.map(project => `
        <div class="project-card pop-up" data-project-id="${project.id}">
          <img class="thumbnail" src="${project.image}">
          <div class="project-info">
            <p class="project-date">${project.date}</p>
            <div class="project-title-bar">
              <p class="project-title">${project.title}</p>
              <div class="logo-container">
                ${project.tool_icon1}
                ${project.tool_icon2}
              </div>
            </div>
            <p class="project-description">${project.description}</p>
          </div>
        </div>
      `).join('');

      const fullHTML = `
        <div class="page-wrapper">
          <div class="project-container">
            ${projectsHTML}
          </div>
        </div>
      `

      this.contentEl.innerHTML = fullHTML;

      popUp()
      this.attachProjectEvents()

    } catch(error) {
      console.error('Failed to load projects', error);
    }
  }

  async renderProjectContent(projectID) {
    try {
      const response = await fetch(`/src/projects/${projectID}.md`);
      console.log(response.headers.get('content-type'));//this will be 200(true) as we are using local files during this stage
      if (!response.ok) throw new Error('File not found');
  
      const markdownText = await response.text();
  
      if (markdownText.includes('<!DOCTYPE html>')) {
        throw new Error('File not found - received HTML instead of markdown');
      }//this is uncessary after deploy
  
      const htmlContent = marked.parse(markdownText);
      const fullHTML = `
        <div class="markdown-body pop-up">
          ${htmlContent}
        </div>
      `
  
      document.getElementById('content-page').innerHTML = fullHTML

      popUp()
  
    } catch (err) {
      console.error(`Error loading file: ${err.message}`);
      this.navigate('projects');
    }
  }

  attachProjectEvents() {
    document.querySelector('.project-container').addEventListener('click', async (e) => {
      const project = e.target.closest('.project-card')
      console.log(project);
  
      if (project) {
        const id = project.dataset.projectId;
        console.log(id);
  
        this.navigate('project', true, id);
        
      }
      
    })
  }

  async renderJourney() {
    try {
      const response = await fetch('/src/assets/views/journey.json');
      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      const journeys = await response.json();

      const journeysHTML = journeys.map(journey => `
          <div class="timeline_item">
            <div class="timeline_left">
              <div class="timeline_date-text">${journey.date}</div>
            </div>
            <div class="timeline_centre">
              <div class="timeline_circle"></div>
            </div>
            <div class="timeline_right">
              <div class="timeline-card">
                <div class="timeline_title-bar">
                  <div class="timeline_title">
                    ${journey.title}
                  </div>
                  <img src="/src/assets/images/icon-bulb.svg" class="timeline_title-icon" title="My Project">
                </div>
                <p class="timeline_text">
                  ${journey.text}
                </p>
                <div class="timeline-row">
                  <div class="timeline_image">
                    <img src="${journey.image}"/>
                    <img src="${journey.image}"/>
                  </div>
                  <div class="timeline_link_button">
                    <img src="/src/assets/images/icon-rightarrow.svg" class="timeline_link_icon" title="My Project">
                  </div>
                </div>
              </div>
              <div class="timeline-card">
                <div class="timeline_title">
                  ${journey.title}
                </div>
                <p class="timeline_text">
                  ${journey.text}
                </p>
                <div class="timeline_image">
                  <img src="${journey.image}"/>
                </div>
              </div>
            </div>
          </div>
        `)
      
      const fullHTML = `
        <div class="fade-in">
          <div class="year-selector">
            <div class="year">2024</div>
            <div class="year">2025</div>
            <div class="year">2026</div>
            <div class="year">2027</div>
          </div>
          <div class="page-wrapper">
            <div class="section-timeline">
              <div class="container">
                <div class="timeline_component">
                  <div class="timeline-progress">
                    <div class="timeline-progress-bar"></div>
                  </div>
                  ${journeysHTML}
                  <div class="overlay-fade-top"></div>
                  <div class="overlay-fade-bottom"></div>
                </div>
              </div>
            </div>
            <div style="height: 45vh;">
          </div>
        </div>
      `

      this.contentEl.innerHTML = fullHTML;
      
      fadeIn()

    } catch (error) {
        console.error('Failed to load projects', error);
    }

      
  }
}

//Initialize the Router
const router = new Router();

// Add event listeners after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('about').addEventListener('click', () => router.navigate('about'));
  document.getElementById('projects').addEventListener('click', () => router.navigate('projects'));
  document.getElementById('journey').addEventListener('click', () => router.navigate('journey'));
});