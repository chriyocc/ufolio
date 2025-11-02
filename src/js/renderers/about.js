import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { addTrackedListener } from '../utils/cleanup.js';

export async function renderAbout() {
  const response = await fetch('/about.html');
  if(!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();
  
  document.getElementById('content-page').innerHTML = html;
  
  gsap.registerPlugin(ScrollTrigger);

  // Create loading overlay
  const loadingOverlay = document.createElement('div');
  loadingOverlay.className = 'start-page-loader';
  loadingOverlay.innerHTML = `
    <div class="loader-content">
      <div class="loader-line"></div>
      <div class="loader-text">LOADING PORTFOLIO</div>
      <div class="loader-progress">0%</div>
    </div>
  `;
  document.body.appendChild(loadingOverlay);

  // Disable scroll initially
  document.body.style.overflow = 'hidden';
  
  // Create and store Lenis instance (but don't start it yet)
  window.lenisInstance = new Lenis();
  window.lenisInstance.stop(); // Keep it stopped initially
  window.lenisInstance.on("scroll", ScrollTrigger.update);
  
  // Store the RAF callback for cleanup
  window.lenisRAF = (time) => {
    if (window.lenisInstance) {
      window.lenisInstance.raf(time * 1000);
    }
  };
  
  gsap.ticker.add(window.lenisRAF);
  gsap.ticker.lagSmoothing(0);

  // Loader animation
  const loaderTl = gsap.timeline();
  const loaderProgress = loadingOverlay.querySelector('.loader-progress');
  
  loaderTl
    .to('.loader-line', {
      scaleX: 1,
      duration: 1,
      ease: "power2.inOut",
      onUpdate: function() {
        const progress = Math.round(this.progress() * 100);
        loaderProgress.textContent = progress + '%';
      }
    })
    .to('.loader-content', {
      opacity: 0,
      y: -30,
      duration: 0.5,
      ease: "power2.in"
    })
    .to('.start-page-loader', {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.8,
      ease: "power3.inOut",
    });

  const tl = gsap.timeline({ 
    defaults: { ease: "power3.out" },
    delay: 2.5 // Start after loader
  });

  tl.from("nav", {
    y: -50,
    opacity: 0,
    duration: 0.5,
  })
    .from(".subtitle", {
      y: 10,
      opacity: 0,
      duration: 0.5,
    }, "-=0.2")
    .from(".side-text", {
      x: 10,
      opacity: 0,
      duration: 0.5,
    }, "-=0.2")
    .to(".scroll-indicator", {
      opacity: 1,
      y: -10,
      duration: 1,
      ease: "power2.out",
      onComplete: () => {
        loadingOverlay.remove();
        document.body.style.overflow = '';
        window.lenisInstance.start(); // Start smooth scrolling
      }
    }, "-=0.1");

  // Scroll-based nav animation
  gsap.fromTo("nav", 
    {
      y: 0
    },
    {
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      y: -200,
      ease: "power1.out",
    }
  );

  // Fade out scroll indicator on scroll
  gsap.fromTo(".scroll-indicator", {
      y: 0,
    },
    {
    scrollTrigger: {
      trigger: ".name-wrapper",
      start: "top top",
      end: "+=300px",
      scrub: 1,
    },
    opacity: 0,
    y: -20,
    ease: "power1.out"
  });

  // Scroll-based side-text animation
  gsap.fromTo(".side-text", 
    {
      y: 0,
    },
    {
      scrollTrigger: {
        trigger: ".name-wrapper",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      y: -400,
      opacity: 0,
      ease: "power1.out",
    }
  );

  // Floating logo animation
  gsap.to(".logo-jun-wrapper", {
    y: "+=10",
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  // Mouse movement effects
  const mouseMoveHandler = (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;

    gsap.to(".logo-jun-wrapper", {
      xPercent: mouseX * 5,
      yPercent: mouseY * 5,
      duration: 0.5,
      ease: "power2.out",
      overwrite: false,
    });

    gsap.to(".diagonal-line", {
      xPercent: mouseX * 7,
      yPercent: mouseY * 7,
      duration: 0.8,
      ease: "power2.out",
    });
  };
  
  addTrackedListener(document, "mousemove", mouseMoveHandler);

  // Resize handler
  const resizeHandler = () => {
    ScrollTrigger.refresh();
  };
  
  addTrackedListener(window, "resize", resizeHandler);

  // ============================================
  // #1: WHO I AM SECTION - Bold Text Reveal
  // ============================================
  setupWhoIAmAnimation();

  // ============================================
  // #2: MY SKILLS SECTION - Timeline Animation
  // ============================================
  setupSkillsAnimation();

  // ============================================
  // #3: CURSOR INVERSE CIRCLE EFFECT
  // ============================================
  setupCursorEffect();

  return true;
}

// ============================================
// WHO I AM: Progressive Bold Text Reveal
// ============================================
function setupWhoIAmAnimation() {
  const whoSection = document.querySelector(".who-i-am");
  const whoText = document.querySelector(".who-text");
  
  if (!whoSection || !whoText) return;

  // Create wrapper for text masking effect
  const textContent = whoText.textContent;
  whoText.innerHTML = `
    <span class="who-text-normal">${textContent}</span>
    <span class="who-text-bold">${textContent}</span>
  `;


  const boldText = document.querySelector(".who-text-bold");

  // Pin section and animate bold reveal
  gsap.timeline({
    scrollTrigger: {
      trigger: whoSection,
      start: "top top",
      end: "+=200%",
      scrub: 1,
      pin: true,
      pinSpacing: true,
    }
  })
  .to(boldText, {
    clipPath: "inset(0 0% 0 0)",
    duration: 1,
    ease: "power2.inOut"
  })
  .to(whoSection.querySelector(".who-content"), {
    opacity: 1,
    y: 0,
    duration: 0.3,
  }, 0);
}

// ============================================
// MY SKILLS: Timeline with Progress Animation
// ============================================
function setupSkillsAnimation() {
  const skillsSection = document.querySelector(".skills");
  if (!skillsSection) return;

  // Create timeline element
  const timelineHTML = `
    <div class="skills-timeline">
      <div class="timeline-line-wrapper">
        <div class="timeline-line">
          <div class="skills-timeline-progress"></div>
        </div>
        <div class="timeline-dots">
          <div class="marker-dot" data-stage="design"></div>
          <div class="marker-dot" data-stage="coding"></div>
          <div class="marker-dot" data-stage="engineering"></div>
        </div>
      </div>
      <div class="timeline-labels">
        <div class="marker-label">DESIGN</div>
        <div class="marker-label">CODING</div>
        <div class="marker-label">ENGINEERING</div>
      </div>
    </div>
  `;

  // Insert timeline before skills content
  const skillsContent = skillsSection.querySelector(".skills-content");
  skillsContent.insertAdjacentHTML('afterbegin', timelineHTML);

  const skillCategories = document.querySelectorAll(".skill-category");
  const timelineProgress = document.querySelector(".skills-timeline-progress");
  const markerDots = document.querySelectorAll(".marker-dot");
  const markerLabels = document.querySelectorAll(".marker-label");

  const mainSkillsTl = gsap.timeline({
    scrollTrigger: {
      trigger: skillsSection,
      start: "top top",
      end: "+=600%",
      scrub: 1,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        // Update timeline progress
        const progress = self.progress * 100;
        gsap.to(timelineProgress, {
          width: `${progress}%`,
          duration: 0.1,
          ease: "none"
        });

        // Activate markers based on progress
        const activeIndex = Math.floor(self.progress * 3);
        markerDots.forEach((dot, i) => {
          if (i <= activeIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
        
        markerLabels.forEach((label, i) => {
          if (i <= activeIndex) {
            label.classList.add('active');
          } else {
            label.classList.remove('active');
          }
        });
      }
    },
    defaults: { ease: "power3.inOut" },
  });

  skillCategories.forEach((category, index) => {
    const solidTitle = category.querySelector(".category-title.solid");
    const gradientTitle = category.querySelector(".category-title.gradient");
    const skillIcons = category.querySelectorAll(".skill-item");

    // Fade in and scale up the solid title
    mainSkillsTl.fromTo(
      solidTitle,
      { opacity: 0, y: 40, scale: 0.9, filter: "blur(4px)" },
      {
        opacity: 1,
        y: 0,
        scale: 1.1,
        filter: "blur(0px)",
        duration: 1,
      }
    );

    // Hold
    mainSkillsTl.to({}, { duration: 1 });

    // Gradient title reveal
    mainSkillsTl.fromTo(
      gradientTitle,
      { opacity: 0, y: 20, scale: 1.05, filter: "blur(6px)" },
      {
        opacity: 0.3,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1,
      },
      "-=0.2"
    );

    mainSkillsTl.to(solidTitle, { opacity: 0, scale: 1, filter: "blur(4px)", duration: 1 }, "<");

    // Stagger in skill icons
    mainSkillsTl.fromTo(
      skillIcons,
      { opacity: 0, scale: 0.85, y: 0, z: -50 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        z: 0,
        duration: 0.6,
        stagger: { each: 0.12, from: "center" },
        ease: "back.out(1.7)",
      },
      "-=0.6"
    );

    // Hold for viewing
    mainSkillsTl.to({}, { duration: 0.5 });

    // Float effect
    mainSkillsTl.to(
      skillIcons,
      {
        y: "+=10",
        repeat: 1,
        yoyo: true,
        duration: 1,
        ease: "sine.inOut",
      },
      "-=1.5"
    );

    // Fade out
    mainSkillsTl.to(
      skillIcons,
      {
        opacity: 0,
        scale: 0.9,
        y: -30,
        filter: "blur(4px)",
        duration: 0.6,
        stagger: { each: 0.08, from: "edges" },
        ease: "power2.inOut",
      },
      "+=1"
    );

    mainSkillsTl.to(
      [solidTitle, gradientTitle],
      {
        opacity: 0,
        y: -40,
        scale: 0.95,
        filter: "blur(6px)",
        duration: 0.8,
      },
      "-=0.5"
    );
  });
}
