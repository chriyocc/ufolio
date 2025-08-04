import { popUp } from '../animation.js';

export async function renderProjects() {
  try {
    const response = await fetch('/projects.json');
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const projects = await response.json();
    
    const html = buildProjectsHTML(projects);

    document.getElementById('content-page').innerHTML = html;
    popUp();
    attachProjectEvents();
  } catch(error) {
    console.error('Failed to load projects', error);
  }
}

function buildProjectsHTML(projects) {
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

  return `
    <div class="page-wrapper">
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
      const id = project.dataset.projectId;

      import('/src/main.js').then(({ router }) => {
        router.navigate('project', true, id, null);
      });
    }
  });
}