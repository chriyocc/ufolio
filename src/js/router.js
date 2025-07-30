export class Router {
  constructor() {
    this.routes = {
      'about': () => import('/src/js/renderers/about.js').then(m => m.renderAbout()),
      'projects': () => import('/src/js/renderers/projects.js').then(m => m.renderProjects()),
      'journey': () => import('/src/js/renderers/journeys.js').then(m => m.renderJourney()),
      'project': (id) => import('/src/js/renderers/projectContent.js').then(m => m.renderProjectContent(id))
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
    };
    
    if (path[0] == 'projects' && path[1]) {
      return { route: 'project', projectID: path[1] }
    };

    return {
      route: this.routes[path[0]] ? path[0] : 'about',
      projectID: null
    };
  }

  async navigate(route, pushState = true, projectID = null) {
    const prevRoute = window.location.pathname;
    window.scrollTo(0, 0);

    const { url, stateData } = this.buildRouteData(route, projectID);

    if (pushState && prevRoute !== url) {
      history.pushState(stateData, '', url);
    };

    await this.executeRoute(route, projectID);
    this.updateNavBar(route);

  };

  buildRouteData(route, projectID) {
    if (route == 'project' && projectID) {
      return {
        url: `/projects/${projectID}`,
        stateData: { route, projectID }
      };
    }
    return {
      url: `/${route}`,
      stateData: { route }
    };
  }

  async executeRoute(route, projectID) {
    if (route == 'project') {
      this.routes[route].call(this, projectID);
    } else {
      this.routes[route].call(this);
    }
  }

  updateNavBar(route) {
    if (route == 'project') {
      document.querySelector('.nav-bar').style.display = 'none';
    } else {
      document.querySelector('.nav-bar').style.display = 'flex';
      document.querySelector('.nav-item.active').classList.remove('active');
      document.getElementById(`${route}`)?.classList.add('active');
      document.querySelector('.nav-container').classList.add('active');
    }
  }
}