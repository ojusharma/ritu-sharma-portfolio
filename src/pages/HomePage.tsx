import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  const { section } = useParams();

  useEffect(() => {
    if (!section) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: 'smooth' });
  }, [section]);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        <Hero />
        <Certifications />
        <Book />
        <Testimonials />
        <Instagram />
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
