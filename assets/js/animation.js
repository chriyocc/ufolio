const nav = document.querySelector('.nav-container')

document.addEventListener('DOMContentLoaded', async () => {
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
    }) 
  }, 500)
  
});

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault()
    const href = e.currentTarget.href
    
    document.querySelector('.nav-item.active').classList.remove('active')
    e.currentTarget.classList.add('active')
    
    document.querySelector('.main-content').classList.add('page-exit')

    setTimeout(() => {
      window.location.href = href
    }, 20)
    
  })
})

