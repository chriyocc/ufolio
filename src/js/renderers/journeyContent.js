import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import { showFeedback } from './feedbackBox.js';
import supabase from '../../api/supabase.js';

export async function renderJourneyContent(journeyID, router) {
  try {

    const { data, error } = await supabase
      .from('journey')
      .select('*')
      .eq('id', journeyID)
      .single();
    
    if (error) throw error;
    
    const markdownText = await data.markdown_content;

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