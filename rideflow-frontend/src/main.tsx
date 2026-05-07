import React from 'react';
import ReactDOM from 'react-dom/client';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './tokens.css';
import './index.css';
import App from './App';

gsap.registerPlugin(ScrollTrigger);

// Set dark theme default
document.documentElement.setAttribute('data-theme', 'dark');

// Restore persisted theme preference
const saved = localStorage.getItem('rideflow-theme');
if (saved) document.documentElement.setAttribute('data-theme', saved);

// Init Lenis smooth scroll (only on landing, not dashboards)
const lenis = new Lenis({
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Reduced motion: freeze all GSAP
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.globalTimeline.timeScale(0);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
