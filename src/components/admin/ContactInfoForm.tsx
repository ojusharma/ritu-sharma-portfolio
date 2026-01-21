import { useState, useEffect, useRef } from 'react';
import { ContactInfo } from '../../context/ContentContext';
import { Input, Textarea } from '../ui';

interface ContactInfoFormProps {
  data: ContactInfo;
  onChange?: (data: ContactInfo) => void;
}

export default function ContactInfoForm({ data, onChange }: ContactInfoFormProps) {
  const [formData, setFormData] = useState<ContactInfo>(data);
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

  const handleChange = (field: keyof ContactInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 pt-6">
      {/* Phone & WhatsApp */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Phone Number"
          type="text"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+91 99999 99999"
        />
        <Input
          label="WhatsApp Number (without + or spaces)"
          type="text"
          value={formData.whatsapp}
          onChange={(e) => handleChange('whatsapp', e.target.value)}
          placeholder="919999999999"
        />
      </div>

      <Input
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
      />

      {/* City & Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="City"
          type="text"
          value={formData.city}
          onChange={(e) => handleChange('city', e.target.value)}
        />
        <Input
          label="Full Address"
          type="text"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
        />
      </div>

      {/* Social Links */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Social Media Links
        </label>
        <div className="space-y-3">
          <Input
            label="Instagram"
            type="url"
            value={formData.instagram}
            onChange={(e) => handleChange('instagram', e.target.value)}
            placeholder="https://instagram.com/username"
          />
          <Input
            label="Facebook"
            type="url"
            value={formData.facebook}
            onChange={(e) => handleChange('facebook', e.target.value)}
            placeholder="https://facebook.com/username"
          />
          <Input
            label="LinkedIn"
            type="url"
            value={formData.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
        </div>
      </div>

      <Textarea
        label="WhatsApp Pre-filled Message"
        value={formData.whatsappMessage}
        onChange={(e) => handleChange('whatsappMessage', e.target.value)}
        rows={2}
      />
    </div>
  );
}
