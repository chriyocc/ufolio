import { router } from './js/router.js';

// Add event listeners after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('about').addEventListener('click', () => router.navigate('about'));
  document.getElementById('projects').addEventListener('click', () => router.navigate('projects'));
  document.getElementById('journey').addEventListener('click', () => router.navigate('journey'));
});
