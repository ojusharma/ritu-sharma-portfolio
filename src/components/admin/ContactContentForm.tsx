import { useState, useEffect, useRef } from 'react';
import { ContactContent } from '../../context/ContentContext';
import { Input, Textarea } from '../ui';

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
      <Textarea
        label="Welcome Message"
        value={formData.message}
        onChange={(e) => handleChange('message', e.target.value)}
        rows={3}
      />

      <Input
        label="Call-to-Action Button Text"
        type="text"
        value={formData.ctaText}
        onChange={(e) => handleChange('ctaText', e.target.value)}
      />

      {/* Availability */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Availability
        </label>
        <div className="space-y-3">
          <Input
            label="Days"
            type="text"
            value={formData.availability.days}
            onChange={(e) => handleAvailabilityChange('days', e.target.value)}
            placeholder="e.g., Monday - Friday"
          />
          <Input
            label="Hours"
            type="text"
            value={formData.availability.hours}
            onChange={(e) => handleAvailabilityChange('hours', e.target.value)}
            placeholder="e.g., 9:00 AM - 6:00 PM"
          />
          <Input
            label="Response Note"
            type="text"
            value={formData.availability.note}
            onChange={(e) => handleAvailabilityChange('note', e.target.value)}
            placeholder="e.g., I typically respond within a few hours"
          />
        </div>
      </div>
    </div>
  );
}
