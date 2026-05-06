import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, Flip);

// Default ease config
gsap.defaults({ ease: 'expo.out' });

export { gsap, ScrollTrigger, Flip };
