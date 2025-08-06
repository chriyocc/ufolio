import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import { popUp } from '../animation.js';
import { router } from '../router.js';

export async function renderProjectContent(projectID, router) {
  try {
    const response = await fetch(`/projects/${projectID}.md`);
    console.log(response.headers.get('content-type'));//this will be 200(true) as we are using local files during this stage
    if (!response.ok) throw new Error('File not found');

    const markdownText = await response.text();

    if (markdownText.includes('<!DOCTYPE html>')) {
      throw new Error('File not found - received HTML instead of markdown');
    }//this is unnecessary after deploy

    const htmlContent = marked.parse(markdownText);
    const fullHTML = `
      <div class="markdown-body pop-up">
        ${htmlContent}
      </div>
    `;
    document.getElementById('content-page').innerHTML = fullHTML;

    popUp();
    return true;
  } catch (err) {
    console.error(`Error loading file: ${err.message}`);
    router.navigate('projects');
  }
}