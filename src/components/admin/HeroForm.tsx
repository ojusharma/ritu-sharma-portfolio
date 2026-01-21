import { useState, useEffect, useRef } from 'react';
import { HeroContent } from '../../context/ContentContext';

interface HeroFormProps {
  data: HeroContent;
  onChange?: (data: HeroContent) => void;
}

export default function HeroForm({ data, onChange }: HeroFormProps) {
  const [formData, setFormData] = useState<HeroContent>(data);
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

  const handleChange = (field: keyof HeroContent, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCTAChange = (
    ctaType: 'primaryCTA' | 'secondaryCTA',
    field: 'text' | 'link',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [ctaType]: { ...prev[ctaType], [field]: value },
    }));
  };

  const handleHighlightChange = (index: number, field: 'value' | 'label', value: string) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.map((h, i) =>
        i === index ? { ...h, [field]: value } : h
      ),
    }));
  };

  return (
    <div className="space-y-6 pt-6">
      {/* Headline */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Headline
        </label>
        <input
          type="text"
          value={formData.headline}
          onChange={(e) => handleChange('headline', e.target.value)}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Tagline */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tagline
        </label>
        <input
          type="text"
          value={formData.tagline}
          onChange={(e) => handleChange('tagline', e.target.value)}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
      </div>

      {/* Primary CTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Primary Button Text
          </label>
          <input
            type="text"
            value={formData.primaryCTA.text}
            onChange={(e) => handleCTAChange('primaryCTA', 'text', e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Primary Button Link
          </label>
          <input
            type="text"
            value={formData.primaryCTA.link}
            onChange={(e) => handleCTAChange('primaryCTA', 'link', e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Secondary CTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Secondary Button Text
          </label>
          <input
            type="text"
            value={formData.secondaryCTA.text}
            onChange={(e) => handleCTAChange('secondaryCTA', 'text', e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Secondary Button Link
          </label>
          <input
            type="text"
            value={formData.secondaryCTA.link}
            onChange={(e) => handleCTAChange('secondaryCTA', 'link', e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Hero Image URL
          </label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) => handleChange('image', e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Image Alt Text
          </label>
          <input
            type="text"
            value={formData.imageAlt}
            onChange={(e) => handleChange('imageAlt', e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Highlights */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Highlights
        </label>
        <div className="space-y-3">
          {formData.highlights.map((highlight, index) => (
            <div key={index} className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={highlight.value}
                onChange={(e) => handleHighlightChange(index, 'value', e.target.value)}
                placeholder="Value"
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <input
                type="text"
                value={highlight.label}
                onChange={(e) => handleHighlightChange(index, 'label', e.target.value)}
                placeholder="Label"
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
