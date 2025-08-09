import { popUp } from "../animation";
import DOMPurify from 'dompurify';


//pop_content must be in html format
export function showPopBox(popContent) {
  const popUpWindow = document.querySelector('.pop-overlay');
  const popUpContent = document.querySelector('.pop-content');
  const closeBtn = document.querySelector('.pop-box .btn-close');
  const html = document.querySelector('html');

  if (!popUpWindow || !popUpContent) return;

  popUpWindow.style.display = 'flex';
  popUpWindow.classList.add('pop-up');  
  popUpContent.scroll(0, 0);

  html.classList.add('no-scroll');  
  popUpContent.innerHTML = DOMPurify.sanitize(popContent); //To prevent XSS
  popUp();

  closeBtn.onclick = () => {
    popUpWindow.style.display = 'none';
    html.classList.remove('no-scroll');
    popBox.style.width = '90%';
    popBox.style.maxWidth = '1000px';
  };
};