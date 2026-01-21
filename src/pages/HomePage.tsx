import {
  Navbar,
  Hero,
  Certifications,
  Fees,
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
        <Fees />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
