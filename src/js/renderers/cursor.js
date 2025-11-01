// ============================================
// CURSOR: Inverse Circle Following Effect
// ============================================
function setupCursorEffect() {
  // Check if device has fine pointer (mouse)
  const hasMouse = window.matchMedia("(pointer: fine)").matches;
  if (!hasMouse) return;

  let cursorCircle = document.querySelector('.cursor-inverse-circle');
  if (cursorCircle) {
    // If it exists, exit the function to prevent duplication
    return;
  }

  // Create cursor circle
  cursorCircle = document.createElement('div');
  cursorCircle.className = 'cursor-inverse-circle';
  document.body.appendChild(cursorCircle);

  let mouseX = 0, mouseY = 0;
  let circleX = 0, circleY = 0;
  const speed = 0.15;

  // Track mouse position
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth follow animation
  function animateCursor() {
    const dx = mouseX - circleX;
    const dy = mouseY - circleY;
    
    circleX += dx * speed;
    circleY += dy * speed;
    
    cursorCircle.style.left = `${circleX}px`;
    cursorCircle.style.top = `${circleY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();

  // Hover effects
  const interactiveElements = document.querySelectorAll('a, button, .skill-item, .project-card');
  
  interactiveElements.forEach(el => {
    el.addEventListener("mouseenter", () => { // <-- FIXED
      cursorCircle.classList.add('hover');
    });
    
    el.addEventListener("mouseleave", () => { // <-- FIXED
      cursorCircle.classList.remove('hover');
    });
  });
}
