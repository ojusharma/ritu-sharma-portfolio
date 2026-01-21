import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { FeesContent, Service } from '../../context/ContentContext';

interface FeesFormProps {
  data: FeesContent;
  onChange?: (data: FeesContent) => void;
}

export default function FeesForm({ data, onChange }: FeesFormProps) {
  const [formData, setFormData] = useState<FeesContent>(data);
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

  const handleChange = (field: keyof FeesContent, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (
    id: number,
    field: keyof Service,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((service) =>
        service.id === id ? { ...service, [field]: value } : service
      ),
    }));
  };

  const handleFeatureChange = (serviceId: number, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              features: service.features.map((f, i) => (i === index ? value : f)),
            }
          : service
      ),
    }));
  };

  const addFeature = (serviceId: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((service) =>
        service.id === serviceId
          ? { ...service, features: [...service.features, ''] }
          : service
      ),
    }));
  };

  const removeFeature = (serviceId: number, index: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((service) =>
        service.id === serviceId
          ? { ...service, features: service.features.filter((_, i) => i !== index) }
          : service
      ),
    }));
  };

  const addService = () => {
    const newId = Math.max(...formData.services.map((s) => s.id), 0) + 1;
    setFormData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          id: newId,
          name: '',
          price: '',
          duration: '',
          description: '',
          features: [''],
          popular: false,
        },
      ],
    }));
    // Scroll to the new service after render
    setTimeout(() => {
      const newElement = document.getElementById(`service-${newId}`);
      newElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const removeService = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((service) => service.id !== id),
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

      {/* Currency */}
      <div className="w-32">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Currency Symbol
        </label>
        <input
          type="text"
          value={formData.currency}
          onChange={(e) => handleChange('currency', e.target.value)}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Services */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-300">
            Services / Plans
          </label>
          <button
            type="button"
            onClick={addService}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors"
          >
            <Plus size={16} />
            Add Plan
          </button>
        </div>

        <div className="space-y-6">
          {formData.services.map((service) => (
            <div
              key={service.id}
              id={`service-${service.id}`}
              className={`p-4 rounded-lg border space-y-4 ${
                service.popular
                  ? 'bg-primary/10 border-primary'
                  : 'bg-gray-700/50 border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) =>
                      handleServiceChange(service.id, 'name', e.target.value)
                    }
                    placeholder="Plan Name"
                    className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={service.price}
                    onChange={(e) =>
                      handleServiceChange(service.id, 'price', e.target.value)
                    }
                    placeholder="Price (e.g., 9,999)"
                    className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={service.duration}
                    onChange={(e) =>
                      handleServiceChange(service.id, 'duration', e.target.value)
                    }
                    placeholder="Duration (e.g., 3 months)"
                    className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <label className="flex items-center gap-3 px-4 py-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={service.popular}
                      onChange={(e) =>
                        handleServiceChange(service.id, 'popular', e.target.checked)
                      }
                      className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary focus:ring-offset-gray-800"
                    />
                    <span className="text-gray-300">Mark as Recommended</span>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => removeService(service.id)}
                  className="p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <textarea
                value={service.description}
                onChange={(e) =>
                  handleServiceChange(service.id, 'description', e.target.value)
                }
                placeholder="Description"
                rows={2}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Features</span>
                  <button
                    type="button"
                    onClick={() => addFeature(service.id)}
                    className="text-xs text-primary hover:text-primary-light"
                  >
                    + Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) =>
                          handleFeatureChange(service.id, index, e.target.value)
                        }
                        placeholder="Feature description"
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(service.id, index)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Footer Note
        </label>
        <textarea
          value={formData.note}
          onChange={(e) => handleChange('note', e.target.value)}
          rows={2}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
      </div>

    </div>
  );
}
