import Hero from '@/components/Hero';
import TrustedSection from '@/components/TrustedSection';
import Features from '@/components/Features';
import Membership from '@/components/Membership';
import Reviews from '@/components/Reviews';
import CTA from '@/components/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <TrustedSection />
      <Features />
      <Membership />
      <Reviews />
      <CTA />
    </>
  );
}
