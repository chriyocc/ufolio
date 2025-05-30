
async function popUp() {
  const items = document.querySelectorAll('.pop-up');

  for (let i = 0; i < items.length; i++) {
    await new Promise(resolve => {
      setTimeout(() => {
        items[i].classList.add('page-in');
        resolve();
      }, 100);
    });
  }

  setTimeout(() => {
      items.forEach((item) => {
        item.classList.remove('pop-up')
        item.classList.remove('page-in')
    }) 
  }, 500)
}
  

