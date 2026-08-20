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
