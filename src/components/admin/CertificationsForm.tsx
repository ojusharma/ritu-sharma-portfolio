import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CertificationsContent, Certification } from '../../context/ContentContext';
import { Input, Textarea } from '../ui';

interface CertificationsFormProps {
  data: CertificationsContent;
  onChange?: (data: CertificationsContent) => void;
}

export default function CertificationsForm({ data, onChange }: CertificationsFormProps) {
  const [formData, setFormData] = useState<CertificationsContent>(data);
  const originalDataRef = useRef(JSON.stringify(data));
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Update originalDataRef when data prop changes (component remounts via key prop)
  useEffect(() => {
    originalDataRef.current = JSON.stringify(data);
  }, [data]);

  useEffect(() => {
    // Only trigger onChange if data actually differs from original
    const currentDataStr = JSON.stringify(formData);
    if (currentDataStr !== originalDataRef.current) {
      onChangeRef.current?.(formData);
    }
  }, [formData]);

  const handleCertChange = (id: number, field: keyof Certification, value: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    }));
  };

  const addCertification = () => {
    const newId = Math.max(...formData.certifications.map((c) => c.id), 0) + 1;
    setFormData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          id: newId,
          title: '',
          institution: '',
          description: '',
          icon: 'award',
        },
      ],
    }));
    // Scroll to the new certification after render
    setTimeout(() => {
      const newElement = document.getElementById(`cert-${newId}`);
      newElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const removeCertification = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((cert) => cert.id !== id),
    }));
  };

  return (
    <div className="space-y-6 pt-6">
      {/* Certifications List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-300">
            Certifications
          </label>
          <button
            type="button"
            onClick={addCertification}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors"
          >
            <Plus size={16} />
            Add Certification
          </button>
        </div>

        <div className="space-y-4">
          {formData.certifications.map((cert) => (
            <div
              key={cert.id}
              id={`cert-${cert.id}`}
              className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-3">
                  <Input
                    value={cert.title}
                    onChange={(e) => handleCertChange(cert.id, 'title', e.target.value)}
                    placeholder="Certification Title"
                  />
                  <Input
                    value={cert.institution}
                    onChange={(e) => handleCertChange(cert.id, 'institution', e.target.value)}
                    placeholder="Institution"
                  />
                  <Textarea
                    value={cert.description}
                    onChange={(e) => handleCertChange(cert.id, 'description', e.target.value)}
                    placeholder="Description"
                    rows={2}
                  />
                  <select
                    value={cert.icon}
                    onChange={(e) => handleCertChange(cert.id, 'icon', e.target.value)}
                    className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="award">Award</option>
                    <option value="certificate">Certificate</option>
                    <option value="book">Book</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeCertification(cert.id)}
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
