import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function cleanupAnimations() {
  // Remove Lenis RAF from GSAP ticker BEFORE destroying Lenis
  if (window.lenisRAF) {
    gsap.ticker.remove(window.lenisRAF);
    window.lenisRAF = null;
  }
  
  // Destroy Lenis instance
  if (window.lenisInstance) {
    window.lenisInstance.destroy();
    window.lenisInstance = null;
  }

  // Kill all GSAP animations
  gsap.killTweensOf("*");
  gsap.globalTimeline.clear();
  
  // Kill all ScrollTriggers
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  
  // Destroy Lenis
  if (window.lenisInstance) {
    window.lenisInstance.destroy();
    window.lenisInstance = null;
  }
  
  // Remove event listeners if stored
  if (window.animationListeners) {
    window.animationListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    window.animationListeners = [];
  }
}

// Helper to track event listeners for cleanup
export function addTrackedListener(element, event, handler) {
  if (!window.animationListeners) {
    window.animationListeners = [];
  }
  element.addEventListener(event, handler);
  window.animationListeners.push({ element, event, handler });
}