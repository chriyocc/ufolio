//pop_content must be in html format
export function showPopBox(popContent) {
  document.querySelector('.pop-overlay').style.display = 'flex';

  document.querySelector('.pop-content').innerHTML = popContent

  document.querySelector('.btn-close').addEventListener('click', async (e) => {
    document.querySelector('.pop-overlay').style.display = 'none';
  })
};