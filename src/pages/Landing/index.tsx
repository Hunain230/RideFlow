import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from './Hero';
import { HowItWorks } from './HowItWorks';
import { VehicleOptions } from './VehicleOptions';
import { SafetyBanner } from './SafetyBanner';
import { useLenis } from '@/hooks/useLenis';
import { motion } from 'framer-motion';
import { fadeSlideUp } from '@/lib/motion';

export default function LandingPage() {
  useLenis();

  return (
    <motion.div
      {...fadeSlideUp}
      className="flex flex-col min-h-screen"
    >
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <VehicleOptions />
        <SafetyBanner />
      </main>
      <Footer />
    </motion.div>
  );
}
