export class Router {
  constructor() {
    this.routes = {
      'about': () => import('/src/js/renderers/about.js').then(m => m.renderAbout()),
      'projects': () => import('/src/js/renderers/projects.js').then(m => m.renderProjects()),
      'journey': (year) => import('/src/js/renderers/journeys.js').then(m => m.renderJourney(year)),
      'project': (id) => import('/src/js/renderers/projectContent.js').then(m => m.renderProjectContent(id))
    };
    
    this.contentEl = document.getElementById('content-page');
    
    //Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      if (e.state) {
        // Use the state from history
        const { route, projectID, currentYear} = e.state;
        this.navigate(route, false, projectID, currentYear); // DON'T push to history again
      } else {
        // No state means initial page load or manual URL entry
        const routeInfo = this.getRouteFromUrl();
        this.navigate(routeInfo.route, false, routeInfo.projectID, routeInfo.currentYear);
      }
    });
    
    const initRoute = this.getRouteFromUrl()
    this.navigate(initRoute.route, true, initRoute.projectID, initRoute.currentYear);
    
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

    if (path[0] == 'journey' && path[1] === '2024' || path[1] === '2025') {
      return { route: 'journey', currentYear: path[1] }
    };

    if (path[0] == 'journey') {
      return { route: 'journey', currentYear: '2025' }
    };

    return {
      route: this.routes[path[0]] ? path[0] : 'about',
      projectID: null,
      currentYear: null
    };
  }

  async navigate(route, pushState = true, projectID = null, currentYear = '2025') {
    const prevRoute = window.location.pathname;

    const needsLoading = this.needsLoading(route);   

    if (needsLoading) {
      this.showLoading();
    }

    const { url, stateData } = this.buildRouteData(route, projectID, currentYear);
    
    if (pushState && prevRoute !== url) {
      history.pushState(stateData, '', url);
    };

    await this.executeRoute(route, projectID, currentYear);
    this.updateNavBar(route);
    setTimeout(() => {
      window.scrollTo(0, 0);
      this.hideLoading();
    }, 1000);

  };

  buildRouteData(route, projectID, currentYear) {
    if (route == 'project' && projectID) {
      return {
        url: `/projects/${projectID}`,
        stateData: { route, projectID }
      };
    }
    if (route == 'journey' && currentYear) {
      return {
        url: `/journey/${currentYear}`,
        stateData: { route, currentYear }
      };
    }
    return {
      url: `/${route == 'projects' ? 'projects' : ''}`,
      stateData: { route }
    };
  }

  async executeRoute(route, projectID, currentYear) {
    if (route == 'project') {
      this.routes[route].call(this, projectID);
    } else if (route == 'journey') {
      this.routes[route].call(this, currentYear);
    } else {
      this.routes[route].call(this);
    }
  }

  needsLoading(route) {
    if (route == 'projects' || route == 'project' || route == 'journey') {
      return true;
    }

    return false;
  }

  showLoading() {
    const pageLoader = document.getElementById('pageLoader');
    pageLoader.classList.remove('hidden');
  }

  hideLoading() {
    pageLoader.classList.add('hidden');
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