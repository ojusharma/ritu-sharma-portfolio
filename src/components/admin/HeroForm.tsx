import { useState, useEffect, useRef } from 'react';
import { HeroContent } from '../../context/ContentContext';
import { Input, Textarea } from '../ui';

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
      <Input
        label="Headline"
        type="text"
        value={formData.headline}
        onChange={(e) => handleChange('headline', e.target.value)}
      />

      <Input
        label="Tagline"
        type="text"
        value={formData.tagline}
        onChange={(e) => handleChange('tagline', e.target.value)}
      />

      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        rows={3}
      />

      {/* Primary CTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Primary Button Text"
          type="text"
          value={formData.primaryCTA.text}
          onChange={(e) => handleCTAChange('primaryCTA', 'text', e.target.value)}
        />
        <Input
          label="Primary Button Link"
          type="text"
          value={formData.primaryCTA.link}
          onChange={(e) => handleCTAChange('primaryCTA', 'link', e.target.value)}
        />
      </div>

      {/* Secondary CTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Secondary Button Text"
          type="text"
          value={formData.secondaryCTA.text}
          onChange={(e) => handleCTAChange('secondaryCTA', 'text', e.target.value)}
        />
        <Input
          label="Secondary Button Link"
          type="text"
          value={formData.secondaryCTA.link}
          onChange={(e) => handleCTAChange('secondaryCTA', 'link', e.target.value)}
        />
      </div>

      {/* Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Hero Image URL"
          type="text"
          value={formData.image}
          onChange={(e) => handleChange('image', e.target.value)}
        />
        <Input
          label="Image Alt Text"
          type="text"
          value={formData.imageAlt}
          onChange={(e) => handleChange('imageAlt', e.target.value)}
        />
      </div>

      {/* Highlights */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Highlights
        </label>
        <div className="space-y-3">
          {formData.highlights.map((highlight, index) => (
            <div key={index} className="grid grid-cols-2 gap-3">
              <Input
                type="text"
                value={highlight.value}
                onChange={(e) => handleHighlightChange(index, 'value', e.target.value)}
                placeholder="Value"
              />
              <Input
                type="text"
                value={highlight.label}
                onChange={(e) => handleHighlightChange(index, 'label', e.target.value)}
                placeholder="Label"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
