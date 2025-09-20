import api from '/src/api/axios.js';
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import { popUp } from '../animation.js';
import { showFeedback } from './feedbackBox.js';

export async function renderProjectContent(projectSlug, router) {
  try {
    const response = await api.get(`/projects/${projectSlug}`);
    const project = response.data;
    const markdownText = project.markdown_content;
    
    if (!markdownText || markdownText === '') {
      throw new Error(`No markdown content found for project with slug "${projectSlug}"`);
    }

    if (markdownText.includes('<!DOCTYPE html>')) {
      throw new Error('File not found - received HTML instead of markdown');
    }

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
    if (err.response) {
      // Server responded with a status outside 2xx
      console.error('HTTP error', err.response.status);
    } else if (err.request) {
      // Request was made but no response received
      console.error('No response received', err.request);
    }
    console.error(`Error loading file: ${err.message}`);
    showFeedback('error', 'Error loading file')
    router.navigate('projects');
  }
}