import { popUp } from '../animation.js';
import { showPopBox } from './popBox.js';
import { showFeedback } from './feedbackBox.js';

export async function renderAbout() {
  const response = await fetch('/about.html');
  if(!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();
  
  document.getElementById('content-page').innerHTML = html;
  popUp();
  attachContactBtn();
  return true;
};

function attachContactBtn() {
  const mailContactBtn = document.querySelectorAll('.contact-btn')[1];
  const feedbackBox = document.querySelector('.feedback-overlay');
  const popBox = document.querySelector('.pop-box');

  mailContactBtn.addEventListener('click', () => {
    popBox.style.maxWidth = '500px';
    showPopBox(`
      <div class="email-container">
        <span class="email-address" id="emailAddress">yoyongjun2005@gmail.com</span>
        <div class="copy-btn">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>
        </div>
      </div>
    `)

    document.querySelector('.copy-btn').addEventListener('click', () => {
      const mail = 'yoyongjun2005@gmail.com';
      navigator.clipboard.writeText(mail).then(() => {
        showFeedback('check', 'Copied to clipboard');
      }).catch((err) => {
        console.log('Copy Failed: ', err);
        showFeedback('error', 'Copy Failed');
      })
    });
    
  });

  
}