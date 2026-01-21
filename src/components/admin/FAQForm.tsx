import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { FAQContent, FAQ } from '../../context/ContentContext';
import { Input, Textarea } from '../ui';

interface FAQFormProps {
  data: FAQContent;
  onChange?: (data: FAQContent) => void;
}

export default function FAQForm({ data, onChange }: FAQFormProps) {
  const [formData, setFormData] = useState<FAQContent>(data);
  const originalDataRef = useRef(JSON.stringify(data));
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    // Only trigger onChange if data actually differs from original
    const currentDataStr = JSON.stringify(formData);
    if (currentDataStr !== originalDataRef.current) {
      onChangeRef.current?.(formData);
    }
  }, [formData]);

  const handleChange = (field: 'sectionTitle' | 'sectionSubtitle', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFAQChange = (id: number, field: keyof FAQ, value: string) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq) =>
        faq.id === id ? { ...faq, [field]: value } : faq
      ),
    }));
  };

  const addFAQ = () => {
    const newId = Math.max(...formData.faqs.map((f) => f.id), 0) + 1;
    setFormData((prev) => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        {
          id: newId,
          question: '',
          answer: '',
        },
      ],
    }));
    // Scroll to the new FAQ after render
    setTimeout(() => {
      const newElement = document.getElementById(`faq-${newId}`);
      newElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const removeFAQ = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((faq) => faq.id !== id),
    }));
  };

  return (
    <div className="space-y-6 pt-6">
      {/* Section Title & Subtitle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Section Title"
          type="text"
          value={formData.sectionTitle}
          onChange={(e) => handleChange('sectionTitle', e.target.value)}
        />
        <Input
          label="Section Subtitle"
          type="text"
          value={formData.sectionSubtitle}
          onChange={(e) => handleChange('sectionSubtitle', e.target.value)}
        />
      </div>

      {/* FAQs List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-300">
            Questions & Answers
          </label>
          <button
            type="button"
            onClick={addFAQ}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors"
          >
            <Plus size={16} />
            Add FAQ
          </button>
        </div>

        <div className="space-y-4">
          {formData.faqs.map((faq, index) => (
            <div
              key={faq.id}
              id={`faq-${faq.id}`}
              className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-gray-500 text-sm font-medium mt-3">
                  Q{index + 1}
                </span>
                <div className="flex-1 space-y-3">
                  <Input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleFAQChange(faq.id, 'question', e.target.value)}
                    placeholder="Question"
                  />
                  <Textarea
                    value={faq.answer}
                    onChange={(e) => handleFAQChange(faq.id, 'answer', e.target.value)}
                    placeholder="Answer"
                    rows={3}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFAQ(faq.id)}
                  className="p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
