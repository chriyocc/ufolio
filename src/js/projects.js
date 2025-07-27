import { marked } from 'marked';

export async function attachProjectEvents() {
  document.querySelector('.project-container').addEventListener('click', async (e) => {
    const project = e.target.closest('.project-card')
    console.log(project);

    if (project) {
      const id = project.dataset.projectID;
      console.log(id);

      this.navigate('project', true, id);
      
    }
    
  })
}


