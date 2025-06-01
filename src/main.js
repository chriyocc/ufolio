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
        <div class="box">
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
      const response = await fetch('/src/assets/views/journey.html');
      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      this.contentEl.innerHTML = html;
      popUp()
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