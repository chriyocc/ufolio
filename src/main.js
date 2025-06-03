class Router {
  constructor() {
    this.routes = {
      'about': this.renderAbout,
      'projects': this.renderProjects,
      'journey': this.renderJourney
    };
    
    this.contentEl = document.getElementById('content-page');
    
    //Handle browser back/forward
    window.addEventListener('popstate', (e) => {
        const route = e.state?.route || 'about';
        this.navigate(route, true);
    });
    
    const initRoute = this.getRouteFromUrl()
    this.navigate(initRoute, true);
  }

  getRouteFromUrl() {
    // Get route from URL pathname (e.g., /users -> users)
    const hash = window.location.pathname.substring(1);
    return hash && this.routes[hash] ? hash : 'about';
  }

  navigate(route, pushState = true) {

    this.currentRoute = route;

    if (pushState) {
      history.pushState({route}, '', `/${route}`);
    }

    document.querySelector('.nav-item.active').classList.remove('active');
    document.getElementById(`${route}`)?.classList.add('active');
    document.querySelector('.nav-container').classList.add('active');

    this.routes[route].call(this);

  }

  async renderAbout() {
    const response = await fetch('/src/assets/views/about.txt');
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    console.log(html);
    
    this.contentEl.innerHTML = html;
    popUp()
  }

  async renderProjects() {
    try {
      const response = await fetch('/src/assets/views/projects.json');
      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      const projects = await response.json();
      
      const projectsHTML = projects.map(project => `
        <div class="project-card pop-up">
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

    } catch(error) {
      console.error('Failed to load projects', error);
    }
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
                <div class="timeline_image">
                  <img src="${journey.image}"/>
                  <img src="${journey.image}"/>
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
          <div style="height: 50vh;"></div>
        </div>
      `

      this.contentEl.innerHTML = fullHTML;
      
      popUp()

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