export async function popUp() {
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
      item.classList.remove('pop-up');
      item.classList.remove('page-in');
    })
  }, 500);
}

export async function fadeIn() {
  const item = document.querySelector('.fade-in');

  await new Promise(resolve => {
    setTimeout(() => {
      item.classList.add('page-in');
      resolve();
    }, 100);
  });

  setTimeout(() => {
    item.classList.remove('fade-in');
    item.classList.remove('page-in');
  }, 500);
}


  

