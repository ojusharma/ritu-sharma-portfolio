import { useState, useEffect, useRef } from 'react';
import { ContactContent } from '../../context/ContentContext';

interface ContactContentFormProps {
  data: ContactContent;
  onChange?: (data: ContactContent) => void;
}

export default function ContactContentForm({ data, onChange }: ContactContentFormProps) {
  const [formData, setFormData] = useState<ContactContent>(data);
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

  const handleChange = (field: keyof ContactContent, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvailabilityChange = (
    field: keyof ContactContent['availability'],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      availability: { ...prev.availability, [field]: value },
    }));
  };

  return (
    <div className="space-y-6 pt-6">
      {/* Section Title & Subtitle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Section Title
          </label>
          <input
            type="text"
            value={formData.sectionTitle}
            onChange={(e) => handleChange('sectionTitle', e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Section Subtitle
          </label>
          <input
            type="text"
            value={formData.sectionSubtitle}
            onChange={(e) => handleChange('sectionSubtitle', e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Welcome Message
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
      </div>

      {/* CTA Text */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Call-to-Action Button Text
        </label>
        <input
          type="text"
          value={formData.ctaText}
          onChange={(e) => handleChange('ctaText', e.target.value)}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Availability */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Availability
        </label>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Days</label>
            <input
              type="text"
              value={formData.availability.days}
              onChange={(e) => handleAvailabilityChange('days', e.target.value)}
              placeholder="e.g., Monday - Friday"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Hours</label>
            <input
              type="text"
              value={formData.availability.hours}
              onChange={(e) => handleAvailabilityChange('hours', e.target.value)}
              placeholder="e.g., 9:00 AM - 6:00 PM"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Response Note</label>
            <input
              type="text"
              value={formData.availability.note}
              onChange={(e) => handleAvailabilityChange('note', e.target.value)}
              placeholder="e.g., I typically respond within a few hours"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

    </div>
  );
}
