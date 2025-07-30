import { popUp } from '../animation.js';

export async function renderAbout() {
  const response = await fetch('/src/assets/views/about.html');
  if(!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();
  
  document.getElementById('content-page').innerHTML = html;
  popUp()
};