import { router } from './js/router.js';
import gsap from "gsap";

document.addEventListener('DOMContentLoaded', () => {
  const navButtons = document.querySelectorAll("nav button");
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      navButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      gsap.fromTo(button,
        { scale: 0.95 },
        { scale: 1, duration: 0.2, ease: "power2.out" }
      );

      const route = button.id || button.dataset.route;
      if (route) {
        router.navigate(route);
      }
    });
  });


  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuOverlay = document.querySelector('.menu-overlay');
  const mobileMenuButtons = document.querySelectorAll('.mobile-menu button');

  // Toggle menu
  function toggleMenu() {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  }

  // Close menu
  function closeMenu() {
    menuToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Menu toggle click
  menuToggle.addEventListener('click', toggleMenu);

  // Overlay click
  menuOverlay.addEventListener('click', closeMenu);

  // Menu item clicks
  mobileMenuButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active state
      mobileMenuButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Also update desktop nav active state
      const desktopBtn = document.querySelector(`.nav-bar button#${this.id}`);
      if (desktopBtn) {
        document.querySelectorAll('.nav-bar button').forEach(btn => btn.classList.remove('active'));
        desktopBtn.classList.add('active');
      }

      const route = this.id || this.dataset.route;
      if (route) {
        router.navigate(route);
      }
      
      // Close menu after selection
      closeMenu();
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMenu();
    }
  });
});