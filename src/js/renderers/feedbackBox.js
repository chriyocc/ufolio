export function showFeedback(type, text) {
  const feedbackBox = document.querySelector('.feedback-overlay');
  

  if (type == 'check' && text) {
    document.querySelector('.feedback-content').innerHTML = text;
    document.querySelector('.feedback-icon').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#adff2f"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg>`;
  }

  if (type == 'error' && text) {
    document.querySelector('.feedback-content').innerHTML = text;
    document.querySelector('.feedback-icon').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#d30000ff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>`;
  }

  feedbackBox.classList.add('active');
  setTimeout(() => {
    feedbackBox.classList.remove('active')
  }, 2000);
}