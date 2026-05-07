import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Shield, Star, CheckCircle, Users, Clock, Phone, ArrowRight, Zap, Globe } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { MagneticButton } from '../components/ui/MagneticButton';
import { Floating3DObjects } from '../components/ui/Floating3DObjects';
import { ParallaxWrapper } from '../components/ui/ParallaxWrapper';
import { MotionTrails } from '../components/ui/MotionTrails';
import { GeographicTextures } from '../components/ui/GeographicTextures';
import { CinematicBackground } from '../components/ui/CinematicBackground';
import { DynamicSpotlight } from '../components/ui/DynamicSpotlight';
import { AnimatedParticles } from '../components/ui/AnimatedParticles';
import { ConnectiveGlow } from '../components/ui/ConnectiveGlow';
import { AuthModal } from '../components/auth/AuthModal';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function Landing() {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'signin' | 'signup' }>({
    isOpen: false,
    mode: 'signin',
  });
    const heroRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for cursor effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    // Dynamic import for Three.js scene
    const canvas = document.querySelector<HTMLCanvasElement>('#hero-canvas');
    let scene: any;
    if (canvas) {
      import('../3d/HeroScene').then(({ HeroScene }) => {
        scene = new HeroScene(canvas);
      });
    }

    // Hero GSAP sequence
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.navbar', { y: -72, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
        .fromTo('.hero-label', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
        .fromTo('.hero-headline .word', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, '-=0.2')
        .fromTo(['.hero-sub', '.hero-actions'], { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 }, '-=0.3')
        .fromTo('.hero-illustration', { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9 }, '-=0.7')
        .fromTo('.hero-glow', { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5 }, '-=0.8');

      // How it works scroll trigger
      if (howItWorksRef.current) {
        gsap.fromTo(
          gsap.utils.toArray('.hiw-card'),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.2,
            scrollTrigger: {
              trigger: howItWorksRef.current,
              start: 'top 75%',
            },
          }
        );
      }
    }, heroRef);

    return () => {
      ctx.revert();
      if (scene) scene.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-white via-soft-beige to-ivory text-text-primary overflow-x-hidden relative">
      {/* Custom Cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed w-6 h-6 rounded-full bg-gradient-to-r from-soft-gold to-champagne opacity-50 pointer-events-none z-50 mix-blend-screen"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      
      {/* Enhanced Visual Layers */}
      <CinematicBackground />
      <GeographicTextures />
      <MotionTrails />
      <DynamicSpotlight />
      <ConnectiveGlow />
      <AnimatedParticles />
      <Floating3DObjects />
      <Navbar 
        onLoginClick={() => setAuthModal({ isOpen: true, mode: 'signin' })} 
        onSignupClick={() => setAuthModal({ isOpen: true, mode: 'signup' })} 
      />

      <main>
        {/* SECTION 1 — HERO */}
        <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-champagne/10 to-soft-gold/10 animate-gradient-shift" />
          
          {/* Hero Glow Effect */}
          <motion.div 
            className="hero-glow absolute top-1/2 left-[70%] -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(230,213,184,0.15) 0%, transparent 70%)' }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <div className="hero-label inline-flex items-center gap-3 px-5 py-3 rounded-full backdrop-blur-xl bg-glass-white-strong border border-soft-gold/50 shadow-glow-lg mb-8 relative z-20">
                <motion.span 
                  className="text-amber-500 text-lg font-bold"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >✦</motion.span>
                <span className="text-sm font-semibold text-text-primary">Available in Karachi · Lahore · Islamabad</span>
              </div>
              
              <h1 className="hero-headline text-[clamp(3.5rem,7vw,6rem)] font-display leading-[1.05] mb-8 relative">
                <span className="block overflow-hidden relative">
                  <span className="word block bg-gradient-to-r from-amber-600 via-soft-gold to-champagne bg-clip-text text-transparent font-bold drop-shadow-lg">Ride smarter.</span>
                </span>
                <span className="block overflow-hidden relative">
                  <span className="word block bg-gradient-to-r from-champagne via-amber-600 to-soft-gold bg-clip-text text-transparent font-bold drop-shadow-lg">Arrive in style.</span>
                </span>
              </h1>
              
              <p className="hero-sub text-xl md:text-2xl text-text-primary/90 mb-10 max-w-lg leading-relaxed font-light drop-shadow">
                Pakistan's premium ride-hailing experience. Book in seconds, ride in comfort.
              </p>
              
              <div className="hero-actions flex flex-wrap gap-4 mb-16">
                <MagneticButton
                  onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
                  className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-soft-gold to-champagne hover:from-champagne hover:to-soft-gold text-text-primary shadow-glow rounded-xl border-0 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    Book a Ride
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </MagneticButton>
                <MagneticButton
                  onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
                  className="px-8 py-4 text-lg font-semibold backdrop-blur-xl bg-glass-white border-glass-border hover:border-soft-gold/50 text-text-primary rounded-xl transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Drive with Us
                  </span>
                </MagneticButton>
              </div>
              
              <div className="hero-actions flex items-center gap-8 text-sm font-medium text-text-secondary">
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-2 h-2 bg-soft-gold rounded-full animate-pulse-glow shadow-glow" />
                  <span className="text-text-primary font-bold text-base">24,000+</span>
                  <span className="text-amber-600">Rides</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-text-primary font-bold text-base">4.8★</span>
                  <span className="text-amber-600">Rating</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Users className="w-4 h-4 text-amber-500" />
                  <span className="text-text-primary font-bold text-base">500+</span>
                  <span className="text-amber-600">Drivers</span>
                </motion.div>
              </div>
            </div>

            {/* Right Content */}
            <ParallaxWrapper speed={0.3} className="lg:col-span-7 relative hero-illustration h-[400px] lg:h-[600px] w-full">
              <canvas id="hero-canvas" className="w-full h-full object-contain" />
              
              {/* Floating Cards */}
              <motion.div
                className="absolute top-[20%] left-[10%] hidden md:flex"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <GlassCard tier={2} className="p-4 flex items-center gap-4 backdrop-blur-xl bg-glass-white border-glass-border shadow-glow">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-soft-gold/20 to-champagne/20 flex items-center justify-center border border-soft-gold/30">
                    <div className="w-3 h-3 bg-soft-gold rounded-full animate-pulse-glow shadow-glow" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Your ride is 2 min away</p>
                    <p className="text-xs text-text-secondary">Ahmad • Toyota Corolla</p>
                  </div>
                </GlassCard>
              </motion.div>
              
              <motion.div
                className="absolute bottom-[20%] right-[10%] hidden md:flex"
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, -2, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
              >
                <GlassCard tier={1} className="px-4 py-2 flex items-center gap-2 backdrop-blur-xl bg-glass-white border-glass-border shadow-glow">
                  <Shield size={16} className="text-amber-500" />
                  <span className="text-sm font-medium text-text-secondary">Safe & Verified</span>
                </GlassCard>
              </motion.div>
            </ParallaxWrapper>
          </div>
        </section>

        {/* SECTION 2 — HOW IT WORKS */}
        <section ref={howItWorksRef} className="py-24 relative z-10 border-t border-glass-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 
              className="text-4xl md:text-5xl font-display text-center mb-20 text-text-primary font-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-soft-gold via-champagne to-amber-500 bg-clip-text text-transparent">Three steps to your ride</span>
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector Line */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] border-t-2 border-dashed border-soft-gold/30" />
              
              {[
                { step: '01', title: 'Set Your Location', desc: 'Enter pickup and drop-off in seconds' },
                { step: '02', title: 'Get Matched', desc: 'We find the nearest verified driver for you' },
                { step: '03', title: 'Ride & Rate', desc: 'Complete your trip, rate your experience' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <GlassCard tier={2} className="hiw-card p-8 relative overflow-hidden text-center flex flex-col items-center backdrop-blur-xl bg-glass-white border-glass-border hover:border-soft-gold/40 transition-all duration-300 hover:shadow-glow-lg">
                    <div className="absolute -top-6 -right-4 text-8xl font-display font-bold text-soft-gold/10 select-none pointer-events-none">
                      {item.step}
                    </div>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-soft-gold/20 to-champagne/20 border-2 border-soft-gold/30 flex items-center justify-center text-amber-600 mb-6 text-2xl font-display font-bold shadow-glow">
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-semibold text-text-primary mb-3">{item.title}</h3>
                    <p className="text-text-secondary text-lg leading-relaxed">{item.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3 — VEHICLES */}
        <section className="py-24 bg-gradient-to-b from-transparent to-soft-beige/30 border-y border-glass-border relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 
              className="text-4xl md:text-5xl font-display text-center mb-20 text-text-primary font-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-champagne via-amber-500 to-soft-gold bg-clip-text text-transparent">Choose your ride type</span>
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: '🚗', title: 'Economy', desc: 'Comfortable sedans for everyday rides', price: 'From PKR 150' },
                { icon: '💼', title: 'Business', desc: 'Premium vehicles for important journeys', price: 'From PKR 280' },
                { icon: '🏍️', title: 'Bike', desc: 'Fast delivery and solo trips through traffic', price: 'From PKR 80' },
              ].map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <GlassCard tier={2} tilt spotlight className="p-8 cursor-pointer group backdrop-blur-xl bg-glass-white border-glass-border hover:border-soft-gold/40 transition-all duration-300 hover:shadow-glow-lg">
                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform origin-left duration-300">{v.icon}</div>
                    <h3 className="text-2xl font-semibold text-text-primary mb-3">{v.title}</h3>
                    <p className="text-text-secondary text-lg mb-6 leading-relaxed">{v.desc}</p>
                    <div className="text-amber-600 font-bold text-xl">{v.price}</div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 — SAFETY */}
        <section className="py-24 relative z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-champagne/10 to-soft-gold/10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div 
              className="flex flex-col lg:flex-row items-center gap-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="w-28 h-28 shrink-0 rounded-3xl bg-gradient-to-br from-soft-gold to-champagne flex items-center justify-center p-1 shadow-glow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <div className="w-full h-full bg-warm-white rounded-2xl flex items-center justify-center">
                  <Shield size={48} className="text-amber-600" />
                </div>
              </motion.div>
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-4xl md:text-5xl font-display text-text-primary mb-6 font-bold">
                  <span className="bg-gradient-to-r from-soft-gold to-champagne bg-clip-text text-transparent">Your safety is our priority</span>
                </h2>
                <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4">
                  {[
                    { icon: CheckCircle, text: 'Verified Drivers', color: 'text-amber-600' },
                    { icon: Phone, text: 'Live Trip Sharing', color: 'text-amber-600' },
                    { icon: Clock, text: '24/7 Support', color: 'text-amber-600' }
                  ].map((item, index) => (
                    <motion.div 
                      key={item.text} 
                      className="flex items-center gap-3 text-text-secondary text-lg"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <item.icon size={20} className={item.color} />
                      <span className="text-text-primary font-medium">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="gradient-border" 
                  className="px-8 py-4 text-lg font-semibold backdrop-blur-xl bg-glass-white border-soft-gold/50 hover:border-soft-gold/70 text-text-primary shadow-glow"
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 5 — STATS */}
        <ParallaxWrapper speed={0.2} className="py-24 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display text-text-primary font-bold mb-4">
                <span className="bg-gradient-to-r from-amber-500 via-soft-gold to-champagne bg-clip-text text-transparent">Trusted by thousands</span>
              </h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">Join the growing community of satisfied riders across Pakistan</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: '24K+', label: 'Daily Rides', icon: Zap },
                { number: '4.8★', label: 'Average Rating', icon: Star },
                { number: '500+', label: 'Expert Drivers', icon: Users },
                { number: '3', label: 'Major Cities', icon: Globe },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <GlassCard tier={2} className="p-8 text-center backdrop-blur-xl bg-glass-white border-glass-border hover:border-soft-gold/40 transition-all duration-300 hover:shadow-glow">
                    <stat.icon className="w-8 h-8 text-amber-600 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-text-primary mb-2">{stat.number}</div>
                    <div className="text-text-secondary">{stat.label}</div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </ParallaxWrapper>

        {/* SECTION 6 — TESTIMONIALS */}
        <section className="py-24 bg-gradient-to-b from-transparent to-cream/30 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display text-text-primary font-bold mb-4">
                <span className="bg-gradient-to-r from-champagne to-soft-gold bg-clip-text text-transparent">Love from our riders</span>
              </h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">Real experiences from real people</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Sarah Ahmed', role: 'Marketing Professional', text: 'The most comfortable and reliable ride service in Lahore. Drivers are professional and cars are always clean.', rating: 5 },
                { name: 'Ali Khan', role: 'Tech Entrepreneur', text: 'Game changer for my daily commute. The app is intuitive and booking takes seconds.', rating: 5 },
                { name: 'Fatima Noor', role: 'Medical Student', text: 'Safe, affordable, and always on time. Perfect for late night study sessions at the library.', rating: 5 },
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <GlassCard tier={2} className="p-8 backdrop-blur-xl bg-glass-white border-glass-border hover:border-soft-gold/40 transition-all duration-300 hover:shadow-glow">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, j) => (
                        <Star key={j} className="w-5 h-5 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-text-secondary mb-6 italic">"{testimonial.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-soft-gold to-champagne flex items-center justify-center text-text-primary font-semibold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-text-primary">{testimonial.name}</div>
                        <div className="text-sm text-text-secondary">{testimonial.role}</div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* SECTION 7 — FOOTER */}
      <footer className="bg-gradient-to-b from-transparent to-soft-beige/50 backdrop-blur-xl border-t border-glass-border pt-16 pb-8 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <span className="text-3xl font-display font-bold mb-6 block">
                <span className="text-text-primary">Ride</span><span className="text-amber-600">Flow</span>
              </span>
              <p className="text-text-secondary text-lg max-w-xs mb-8 leading-relaxed">Elevating the standard of ride-hailing with unparalleled comfort and reliability.</p>
              <div className="flex gap-6">
                {[
                  { icon: '𝕏', label: 'Twitter' },
                  { icon: 'IG', label: 'Instagram' },
                  { icon: 'IN', label: 'LinkedIn' },
                ].map((social) => (
                  <motion.div 
                    key={social.label}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full backdrop-blur-xl bg-glass-white border-glass-border flex items-center justify-center hover:bg-glass-white-strong hover:border-soft-gold/50 cursor-pointer transition-all duration-300 text-xl"
                  >{social.icon}</motion.div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-text-primary font-semibold mb-3 text-lg">Company</h4>
              {['About', 'Careers', 'Safety', 'Blog'].map(l => (
                <motion.a 
                  key={l} 
                  href="#" 
                  className="text-text-secondary hover:text-amber-600 text-lg w-fit transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  {l}
                </motion.a>
              ))}
            </div>
            <div>
              <h4 className="text-text-primary font-semibold mb-6 text-lg">Download the App</h4>
              <div className="flex flex-col gap-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <GlassCard tier={2} className="flex items-center gap-4 p-4 cursor-pointer backdrop-blur-xl bg-glass-white border-glass-border hover:border-soft-gold/50 transition-all duration-300 hover:shadow-glow">
                    <div className="text-2xl"></div>
                    <div>
                      <div className="text-[11px] text-text-secondary leading-none">Download on the</div>
                      <div className="text-base font-semibold text-text-primary leading-tight">App Store</div>
                    </div>
                  </GlassCard>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <GlassCard tier={2} className="flex items-center gap-4 p-4 cursor-pointer backdrop-blur-xl bg-glass-white border-glass-border hover:border-soft-gold/50 transition-all duration-300 hover:shadow-glow">
                    <div className="text-2xl text-green-600">▶</div>
                    <div>
                      <div className="text-[11px] text-text-secondary leading-none">GET IT ON</div>
                      <div className="text-base font-semibold text-text-primary leading-tight">Google Play</div>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>
            </div>
          </div>
          <div className="border-t border-glass-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
            <p>© 2026 RideFlow. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={authModal.isOpen} 
        mode={authModal.mode} 
        onClose={() => setAuthModal({ ...authModal, isOpen: false })} 
      />
    </div>
  );
}
