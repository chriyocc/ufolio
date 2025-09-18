import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import { showFeedback } from './feedbackBox.js';

export async function renderJourneyContent(journeyID, router) {
  try {
    const response = await fetch(`/journeyContent/${journeyID}.md`);
    console.log(response.headers.get('content-type'));//this will be 200(true) as we are using local files during this stage
    if (!response.ok) throw new Error('File not found');

    const markdownText = await response.text();

    if (markdownText.includes('<!DOCTYPE html>')) {
      throw new Error('File not found - received HTML instead of markdown');
    }//this is unnecessary after deploy

    const htmlContent = marked.parse(markdownText);
    const fullHTML = htmlContent;
    return fullHTML;
  } catch (err) {
    console.error(`Error loading: ${err.message}`);
    showFeedback('error', 'Error loading journey')
    router.navigate('journey');
  }
}