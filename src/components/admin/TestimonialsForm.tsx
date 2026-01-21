import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { TestimonialsContent, Testimonial } from '../../context/ContentContext';
import { Input, Textarea } from '../ui';

interface TestimonialsFormProps {
  data: TestimonialsContent;
  onChange?: (data: TestimonialsContent) => void;
}

export default function TestimonialsForm({ data, onChange }: TestimonialsFormProps) {
  const [formData, setFormData] = useState<TestimonialsContent>(data);
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

  const handleTestimonialChange = (
    index: number,
    field: keyof Testimonial,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((t, i) =>
        i === index ? { ...t, [field]: value } : t
      ),
    }));
  };

  const addTestimonial = () => {
    const newId = Math.max(0, ...formData.testimonials.map((t) => t.id)) + 1;
    setFormData((prev) => ({
      ...prev,
      testimonials: [
        ...prev.testimonials,
        {
          id: newId,
          name: '',
          role: '',
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
          rating: 5,
          text: '',
        },
      ],
    }));
    // Scroll to the new testimonial after render
    setTimeout(() => {
      const newElement = document.getElementById(`testimonial-${newId}`);
      newElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const removeTestimonial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6 pt-6">
      <p className="text-yellow-400 text-sm bg-yellow-400/10 px-4 py-2 rounded-lg">
        ⚠️ Testimonials are currently hidden. Enable them in <code className="bg-gray-700 px-1 rounded">src/constants/siteConfig.ts</code> by setting <code className="bg-gray-700 px-1 rounded">showTestimonials: true</code>
      </p>

      {/* Testimonials */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-300">
            Testimonials
          </label>
          <button
            type="button"
            onClick={addTestimonial}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors text-sm"
          >
            <Plus size={16} />
            Add Testimonial
          </button>
        </div>

        {formData.testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            id={`testimonial-${testimonial.id}`}
            className="p-4 bg-gray-700/50 rounded-lg space-y-4 relative"
          >
            <button
              type="button"
              onClick={() => removeTestimonial(index)}
              className="absolute top-3 right-3 p-1.5 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
              title="Remove testimonial"
            >
              <Trash2 size={16} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Name"
                value={testimonial.name}
                onChange={(e) =>
                  handleTestimonialChange(index, 'name', e.target.value)
                }
                placeholder="Client name"
              />
              <Input
                label="Role"
                value={testimonial.role}
                onChange={(e) =>
                  handleTestimonialChange(index, 'role', e.target.value)
                }
                placeholder="e.g., Working Professional"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Image URL"
                value={testimonial.image}
                onChange={(e) =>
                  handleTestimonialChange(index, 'image', e.target.value)
                }
                placeholder="https://..."
              />
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Rating (1-5)
                </label>
                <select
                  value={testimonial.rating}
                  onChange={(e) =>
                    handleTestimonialChange(index, 'rating', parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} Star{n > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Textarea
              label="Testimonial Text"
              value={testimonial.text}
              onChange={(e) =>
                handleTestimonialChange(index, 'text', e.target.value)
              }
              rows={2}
              placeholder="What the client said..."
            />
          </div>
        ))}
      </div>

    </div>
  );
}
