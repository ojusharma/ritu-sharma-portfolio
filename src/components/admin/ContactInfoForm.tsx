import { useState, useEffect, useRef } from 'react';
import { ContactInfo } from '../../context/ContentContext';

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
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Phone Number
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+91 99999 99999"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            WhatsApp Number (without + or spaces)
          </label>
          <input
            type="text"
            value={formData.whatsapp}
            onChange={(e) => handleChange('whatsapp', e.target.value)}
            placeholder="919999999999"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* City & Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            City
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Full Address
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Social Links */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Social Media Links
        </label>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Instagram</label>
            <input
              type="url"
              value={formData.instagram}
              onChange={(e) => handleChange('instagram', e.target.value)}
              placeholder="https://instagram.com/username"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Facebook</label>
            <input
              type="url"
              value={formData.facebook}
              onChange={(e) => handleChange('facebook', e.target.value)}
              placeholder="https://facebook.com/username"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">LinkedIn</label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* WhatsApp Message */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          WhatsApp Pre-filled Message
        </label>
        <textarea
          value={formData.whatsappMessage}
          onChange={(e) => handleChange('whatsappMessage', e.target.value)}
          rows={2}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
      </div>

    </div>
  );
}
