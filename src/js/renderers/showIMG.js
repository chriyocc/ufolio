import { popUp } from "../animation";

export async function showImg(imgEl) {
  const imgWindow = document.querySelector('.img-overlay');
  const imgContent = document.querySelector('.img-content');
  const closeBtn = document.querySelector('.img-box .btn-close');

  if (!imgWindow || !imgContent || !closeBtn) return;

   // Clear any existing content
  imgContent.innerHTML = '';

  // Create and append a safe <img> element
  const image = document.createElement('img');
  image.src = imgEl;
  imgContent.appendChild(image);
  closeBtn.style.transform = 'translateX(15px)';
  imgWindow.classList.add('pop-up')
  imgWindow.style.display = 'flex';
  document.querySelector('html').classList.add('no-scroll'); 
  popUp();

  closeBtn.onclick = () => {
    imgWindow.style.display = 'none';
    document.querySelector('html').classList.remove('no-scroll'); 
  };
}

