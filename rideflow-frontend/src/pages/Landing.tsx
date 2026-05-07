import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Star, CheckCircle } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { AuthModal } from '../components/auth/AuthModal';

export function Landing() {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'signin' | 'signup' }>({
    isOpen: false,
    mode: 'signin',
  });

  const heroRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen bg-bg-base text-text-primary overflow-x-hidden">
      <Navbar 
        onLoginClick={() => setAuthModal({ isOpen: true, mode: 'signin' })} 
        onSignupClick={() => setAuthModal({ isOpen: true, mode: 'signup' })} 
      />

      <main>
        {/* SECTION 1 — HERO */}
        <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="hero-glow absolute top-1/2 left-[70%] -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
               style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(217,119,6,0.08) 0%, transparent 70%)' }} />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <div className="hero-label inline-flex items-center gap-2 px-3 py-1 rounded-full bg-glass-bg-light border border-glass-border mb-6">
                <span className="text-amber-500 text-xs">✦</span>
                <span className="text-xs font-medium text-text-secondary">Available in Karachi · Lahore · Islamabad</span>
              </div>
              
              <h1 className="hero-headline text-[clamp(3rem,6vw,5.5rem)] font-display leading-[1.1] mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white to-amber-200">
                <span className="block overflow-hidden"><span className="word block">Ride smarter.</span></span>
                <span className="block overflow-hidden"><span className="word block">Arrive in style.</span></span>
              </h1>
              
              <p className="hero-sub text-lg text-text-muted mb-8 max-w-md">
                Pakistan's premium ride-hailing experience. Book in seconds, ride in comfort.
              </p>
              
              <div className="hero-actions flex flex-wrap gap-4 mb-12">
                <Button size="lg" onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}>Book a Ride</Button>
                <Button variant="glass" size="lg" onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}>Drive with Us</Button>
              </div>
              
              <div className="hero-actions flex items-center gap-8 text-sm font-medium text-text-muted">
                <div><span className="text-white">24,000+</span> Rides</div>
                <div><span className="text-amber-500">4.8★</span> Rating</div>
                <div><span className="text-white">500+</span> Drivers</div>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-7 relative hero-illustration h-[400px] lg:h-[600px] w-full">
              <canvas id="hero-canvas" className="w-full h-full object-contain" />
              
              {/* Floating Cards */}
              <GlassCard tier={2} className="absolute top-[20%] left-[10%] p-4 flex items-center gap-4 animate-float hidden md:flex">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                  <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse-glow" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Your ride is 2 min away</p>
                  <p className="text-xs text-text-muted">Ahmad • Toyota Corolla</p>
                </div>
              </GlassCard>
              
              <GlassCard tier={1} className="absolute bottom-[20%] right-[10%] px-4 py-2 flex items-center gap-2 animate-float hidden md:flex" style={{ animationDelay: '1s' }}>
                <Shield size={16} className="text-amber-500" />
                <span className="text-sm font-medium text-text-secondary">Safe & Verified</span>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* SECTION 2 — HOW IT WORKS */}
        <section ref={howItWorksRef} className="py-24 relative z-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-display text-center mb-16 text-text-primary">Three steps to your ride</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector Line */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] border-t-2 border-dashed border-amber-500/20" />
              
              {[
                { step: '01', title: 'Set Your Location', desc: 'Enter pickup and drop-off in seconds' },
                { step: '02', title: 'Get Matched', desc: 'We find the nearest verified driver for you' },
                { step: '03', title: 'Ride & Rate', desc: 'Complete your trip, rate your experience' },
              ].map((item, i) => (
                <GlassCard key={i} tier={1} className="hiw-card p-8 relative overflow-hidden text-center flex flex-col items-center">
                  <div className="absolute -top-6 -right-4 text-8xl font-display font-bold text-amber-500/5 select-none pointer-events-none">
                    {item.step}
                  </div>
                  <div className="w-16 h-16 rounded-full bg-glass-bg border border-glass-border flex items-center justify-center text-amber-500 mb-6 text-xl font-display">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">{item.title}</h3>
                  <p className="text-text-muted">{item.desc}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3 — VEHICLES */}
        <section className="py-24 bg-bg-surface border-y border-white/5 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-display text-center mb-16 text-text-primary">Choose your ride type</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: '🚗', title: 'Economy', desc: 'Comfortable sedans for everyday rides', price: 'From PKR 150' },
                { icon: '💼', title: 'Business', desc: 'Premium vehicles for important journeys', price: 'From PKR 280' },
                { icon: '🏍️', title: 'Bike', desc: 'Fast delivery and solo trips through traffic', price: 'From PKR 80' },
              ].map((v, i) => (
                <GlassCard key={i} tier={2} tilt spotlight className="p-8 cursor-pointer group hover:border-amber-500/40 transition-colors">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">{v.icon}</div>
                  <h3 className="text-xl font-medium text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-text-muted mb-6">{v.desc}</p>
                  <div className="text-amber-500 font-medium">{v.price}</div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 — SAFETY */}
        <section className="py-24 relative z-10 overflow-hidden">
          <div className="absolute inset-0 bg-amber-600/5" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="w-24 h-24 shrink-0 rounded-3xl bg-gradient-to-br from-amber-400 to-[#C2410C] flex items-center justify-center p-1">
                <div className="w-full h-full bg-bg-base rounded-2xl flex items-center justify-center">
                  <Shield size={40} className="text-amber-500" />
                </div>
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-3xl font-display text-white mb-4">Your safety is our priority</h2>
                <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4">
                  {['Verified Drivers', 'Live Trip Sharing', '24/7 Support'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-text-muted">
                      <CheckCircle size={16} className="text-success" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button variant="gradient-border">Learn More</Button>
            </div>
          </div>
        </section>
      </main>

      {/* SECTION 5 — FOOTER */}
      <footer className="bg-bg-base border-t border-white/5 pt-16 pb-8 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <span className="text-2xl font-display font-bold mb-4 block">
                <span className="text-text-primary">Ride</span><span className="text-amber-500">Flow</span>
              </span>
              <p className="text-text-muted text-sm max-w-xs mb-6">Elevating the standard of ride-hailing with unparalleled comfort and reliability.</p>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer">𝕏</div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer">IG</div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer">IN</div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-white font-medium mb-2">Company</h4>
              {['About', 'Careers', 'Safety', 'Blog'].map(l => (
                <a key={l} href="#" className="text-text-muted hover:text-amber-500 text-sm w-fit transition-colors">{l}</a>
              ))}
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Download the App</h4>
              <div className="flex flex-col gap-3">
                <GlassCard tier={1} className="flex items-center gap-3 p-3 cursor-pointer hover:border-amber-500/30">
                  <div className="text-xl"></div>
                  <div>
                    <div className="text-[10px] text-text-muted leading-none">Download on the</div>
                    <div className="text-sm font-medium text-white leading-tight">App Store</div>
                  </div>
                </GlassCard>
                <GlassCard tier={1} className="flex items-center gap-3 p-3 cursor-pointer hover:border-amber-500/30">
                  <div className="text-xl text-green-500">▶</div>
                  <div>
                    <div className="text-[10px] text-text-muted leading-none">GET IT ON</div>
                    <div className="text-sm font-medium text-white leading-tight">Google Play</div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted">
            <p>© 2026 RideFlow. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
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
