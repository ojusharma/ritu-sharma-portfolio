import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Navbar,
  Hero,
  Certifications,
  Book,
  Instagram,
  Testimonials,
  FAQ,
  Contact,
  Footer,
  WhatsAppButton,
} from '../components';

export default function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const element = document.getElementById(hash.slice(1));
    element?.scrollIntoView({ behavior: 'smooth' });
  }, [hash]);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        <Hero />
        <Certifications />
        <Book />
        <Instagram />
        <Testimonials />
        <Contact />
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
