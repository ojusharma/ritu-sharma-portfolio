import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export default function FAQ() {
  const { faqContent } = useContent();
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary-dark">
            {faqContent.sectionTitle}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {faqContent.sectionSubtitle}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqContent.faqs.map((faq) => (
            <div
              key={faq.id}
              className="border border-gray-200 rounded-xl overflow-hidden hover:border-primary/30 transition-colors"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                aria-expanded={openId === faq.id}
              >
                <span className="font-semibold text-primary-dark pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 text-primary transition-transform duration-300 ${
                    openId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openId === faq.id ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
