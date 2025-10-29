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

  // Create and store Lenis instance
  window.lenisInstance = new Lenis();
  window.lenisInstance.on("scroll", ScrollTrigger.update);
  
  // Store the RAF callback for cleanup
  window.lenisRAF = (time) => {
    if (window.lenisInstance) {
      window.lenisInstance.raf(time * 1000);
    }
  };
  
  gsap.ticker.add(window.lenisRAF);
  gsap.ticker.lagSmoothing(0);

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from("nav", {
    y: -50,
    opacity: 0,
    duration: 1,
  })
    .from(".subtitle", {
      y: 10,
      opacity: 0,
      duration: 1,
    }, "-=0.5")
    .from(".side-text", {
      x: 10,
      opacity: 0,
      duration: 1,
    }, "-=0.2");

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

  // Mouse movement effects - USE TRACKED LISTENER
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

  // Resize handler - USE TRACKED LISTENER
  const resizeHandler = () => {
    ScrollTrigger.refresh();
  };
  
  addTrackedListener(window, "resize", resizeHandler);

  gsap.to(".who-content", {
    scrollTrigger: {
      trigger: ".who-i-am",
      start: "top 80%",
      end: "top 30%",
      scrub: 1,
    },
    opacity: 1,
    y: 0,
    ease: "power2.out",
  });

  // Skills section animation
  const skillsSection = document.querySelector(".skills");
  
  // Add safety check
  if (skillsSection) {
    const skillCategories = document.querySelectorAll(".skill-category");

    const mainSkillsTl = gsap.timeline({
      scrollTrigger: {
        trigger: skillsSection,
        start: "top top",
        end: "+=600%",
        scrub: 1,
        pin: true,
        pinSpacing: true,
      },
      defaults: { ease: "power3.inOut" },
    });

    skillCategories.forEach((category, index) => {
      const solidTitle = category.querySelector(".category-title.solid");
      const gradientTitle = category.querySelector(".category-title.gradient");
      const skillIcons = category.querySelectorAll(".skill-item");

      // Step 1: Fade in and scale up the solid title
      mainSkillsTl.fromTo(
        solidTitle,
        { opacity: 0, y: 40, scale: 0.9, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1.1,
          filter: "blur(0px)",
          duration: 3,
        }
      );

      //HOLD
      mainSkillsTl.to({}, { duration: 2 });

      // Add subtle breathing animation for the gradient title
      mainSkillsTl.fromTo(
        gradientTitle,
        { opacity: 0, y: 20, scale: 1.05, filter: "blur(6px)" },
        {
          opacity: 0.3,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 3,
        },
        "-=0.8"
      );

      mainSkillsTl.to(solidTitle, { opacity: 0, scale: 1, filter: "blur(4px)", duration: 3 }, "<");

      // Step 2: Stagger in the skill icons
      mainSkillsTl.fromTo(
        skillIcons,
        { opacity: 0, scale: 0.85, y: 20, z: -50 },
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
      mainSkillsTl.to({}, { duration: 2 });

      // Step 3: Subtle float effect while visible (adds liveliness)
      mainSkillsTl.to(
        skillIcons,
        {
          y: "+=10",
          repeat: 1,
          yoyo: true,
          duration: 2,
          ease: "sine.inOut",
        },
        "-=1.5"
      );

      // Step 4: Fade out the icons and titles
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

  return true;
}