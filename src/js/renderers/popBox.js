import { popUp } from "../animation";

//pop_content must be in html format
export function showPopBox(popContent) {
  const popUpWindow = document.querySelector('.pop-overlay');
  const popUpContent = document.querySelector('.pop-content');

  popUpWindow.style.display = 'flex';
  popUpWindow.classList.add('pop-up');  
  popUpContent.scroll(0, 0);

  document.querySelector('html').classList.add('no-scroll');  
  document.querySelector('.pop-content').innerHTML = popContent
  popUp()

  document.querySelector('.btn-close').addEventListener('click', async () => {
    popUpWindow.style.display = 'none';
    document.querySelector('html').classList.remove('no-scroll');  
    document.querySelector('.pop-box').style.width = '90%';
    document.querySelector('.pop-box').style.maxWidth = '1000px';
  })
};