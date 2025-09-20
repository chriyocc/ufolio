import { renderAbout } from '/src/js/renderers/about.js';
import { renderProjects } from '/src/js/renderers/projects.js';
import { renderJourney } from '/src/js/renderers/journey.js';
import { renderProjectContent } from '/src/js/renderers/projectContent.js';

export class Router {
  constructor() {
    this.cachedData = {};
    this.routes = {
      'about': () => Promise.resolve(renderAbout(this)),
      'projects': () => Promise.resolve(renderProjects(this)),
      'journey': (year) => Promise.resolve(renderJourney(year, this)),
      'project': (id) => Promise.resolve(renderProjectContent(slug, this))
    };
    
    this.contentEl = document.getElementById('content-page');
    
    //Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      if (e.state) {
        // Use the state from history
        const { route, projectSlug, currentYear} = e.state;
        this.navigate(route, false, projectSlug, currentYear); // DON'T push to history again
      } else {
        // No state means initial page load or manual URL entry
        const routeInfo = this.getRouteFromUrl();
        this.navigate(routeInfo.route, false, routeInfo.projectSlug, routeInfo.currentYear);
      }
    });
    
    const initRoute = this.getRouteFromUrl()
    this.navigate(initRoute.route, true, initRoute.projectSlug, initRoute.currentYear);
    
  }

  getRouteFromUrl() {
    // Get route from URL pathname (e.g., /users -> users)
    const path = window.location.pathname.split('/').filter(segment => segment);
    
    if (path.length === 0) {
      return { route: 'about', projectSlug: null };
    };
    
    if (path[0] == 'projects' && path[1]) {
      return { route: 'project', projectSlug: path[1] }
    };

    if (path[0] == 'journey' && path[1] === '2024' || path[1] === '2025') {
      return { route: 'journey', currentYear: path[1] }
    };

    if (path[0] == 'journey') {
      return { route: 'journey', currentYear: '2025' }
    };

    return {
      route: this.routes[path[0]] ? path[0] : 'about',
      projectSlug: null,
      currentYear: null
    };
  }

  async navigate(route, pushState = true, projectSlug = null, currentYear = '2025') {
    const prevRoute = window.location.pathname;
    const needsLoading = this.needsLoading(route);   

    if (needsLoading) {
      this.showLoading();
    }

    const { url, stateData } = this.buildRouteData(route, projectSlug, currentYear);
    
    if (pushState && prevRoute !== url) {
      history.pushState(stateData, '', url);
    };
    
    const loadSuccess = await this.executeRoute(route, projectSlug, currentYear);
    
    if (loadSuccess) {
      window.scrollTo(0, 0);
      setTimeout(() => {
        this.hideLoading();
      }, 100);
    } else {
      return;
    }

    this.updateNavBar(route);

  };

  buildRouteData(route, projectSlug, currentYear) {
    if (route == 'project' && projectSlug) {
      return {
        url: `/projects/${projectSlug}`,
        stateData: { route, projectSlug }
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

  async executeRoute(route, projectSlug, currentYear) {
    if (route == 'project') {
      return await this.routes[route](projectSlug);
    } else if (route == 'journey') {
      return await this.routes[route](currentYear);
    } else {
      return await this.routes[route]();
    }
  }

  needsLoading(route) {
    if (route == 'projects' && !this.cachedData.projects) {
      return true;
    }
    if (route == 'journey' && !this.cachedData.journey) {
      return true;
    }
    if (route == 'project') {
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

export const router = new Router();