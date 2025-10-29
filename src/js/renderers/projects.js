import { popUp } from '../animation.js';
import { router } from '../router.js';
import { showFeedback } from './feedbackBox.js';
import supabase from '../../api/supabase.js';
import { iconMap } from '../iconMap.js';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


export async function renderProjects(router) {
  try {
  
    if (router.cachedData.projects) {
      document.getElementById('content-page').innerHTML = router.cachedData.projects;
      popUp();
      attachProjectEvents();
      return true;
    }

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')

    if (error) {
      throw error;
    }

    const html = buildProjectsHTML(projects);

    router.cachedData.projects = html;
    document.getElementById('content-page').innerHTML = html;
    popUp();
    attachProjectEvents();
    return true;

  } catch (error) {
    if (error.response) {
      // Server responded with a status outside 2xx
      console.error('HTTP error', error.response.status);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received', error.request);
    } else {
      console.error('Error', error.message);
    }
    console.error('Failed to load projects', error);
    showFeedback('error', 'Failed to load projects')
  }
}

function buildProjectsHTML(projects) {
  const projectsHTML = projects.map(project => {
    const projectImg = document.createElement("img");

    if (project.image) {
      projectImg.src = project.image;
      projectImg.title = project.title;
      projectImg.loading = 'lazy';
      projectImg.classList.add("thumbnail");
    }
    
    return `
        <div class="project-card pop-up" data-project-slug="${project.slug}" data-project-id="${project.id}">
          ${projectImg.outerHTML}
          <div class="project-info">
            <p class="project-date">${project.date && new Date(project.date + '-01').toLocaleString(undefined, { month: 'long', year: 'numeric' })}</p>
            <div class="project-title-bar">
              <p class="project-title">${project.title}</p>
              <div class="logo-container">
                ${iconMap[project.tool_icon1]}
                ${(project.tool_icon2 ?? '') && iconMap[project.tool_icon2]}
              </div>
            </div>
            <p class="project-description">${project.description}</p>
          </div>
        </div>
      `}).join('');
    

  return `
    <div class="page-wrapper">
      <div class="projects-header-container">
        <div class="projects-header">My Projects</div>
      </div>
      <div class="project-container">
        ${projectsHTML}
      </div>
    </div>
  `;
}

function attachProjectEvents() {
  document.querySelector('.project-container').addEventListener('click',  (e) => {
    const project = e.target.closest('.project-card')
    
    if (project) {
      const slug = project.dataset.projectSlug;
      router.navigate('project', true, slug, null);
    }
  });
}