import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, CheckCircle, LogOut, Loader2, Save, X, AlertTriangle } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { validateSection, ValidationError } from '../utils/validation';

// Import form components
import {
  HeroForm,
  ContactInfoForm,
  CertificationsForm,
  FeesForm,
  FAQForm,
  ContactContentForm,
  TestimonialsForm,
  ConfirmSaveModal,
  DiscardChangesModal,
} from '../components/admin';

type SectionKey = 'hero' | 'contactInfo' | 'certifications' | 'fees' | 'faq' | 'contactContent' | 'testimonials';

interface Section {
  key: SectionKey;
  title: string;
  dbKey: string;
}

const sections: Section[] = [
  { key: 'hero', title: 'Hero Section', dbKey: 'hero' },
  { key: 'contactInfo', title: 'Contact Information', dbKey: 'contact_info' },
  { key: 'certifications', title: 'Certifications', dbKey: 'certifications' },
  { key: 'fees', title: 'Plans & Fees', dbKey: 'fees' },
  { key: 'faq', title: 'FAQ', dbKey: 'faq' },
  { key: 'contactContent', title: 'Contact Section', dbKey: 'contact' },
  { key: 'testimonials', title: 'Testimonials', dbKey: 'testimonials' },
];

export default function AdminPage() {
  const { user, signOut } = useAuth();
  const {
    contactInfo,
    heroContent,
    certificationsContent,
    feesContent,
    faqContent,
    contactContent,
    testimonialsContent,
    isLoading,
    updateContent,
  } = useContent();

  const [expandedSection, setExpandedSection] = useState<SectionKey | null>(null);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingSaveData, setPendingSaveData] = useState<{ dbKey: string; data: unknown } | null>(null);
  const [formResetKey, setFormResetKey] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [pendingSectionSwitch, setPendingSectionSwitch] = useState<SectionKey | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const originalDataRef = useRef<Record<string, unknown>>({});

  // Store original data when content loads or forms reset
  useEffect(() => {
    originalDataRef.current = {
      hero: heroContent,
      contact_info: contactInfo,
      certifications: certificationsContent,
      fees: feesContent,
      faq: faqContent,
      contact: contactContent,
      testimonials: testimonialsContent,
    };
  }, [heroContent, contactInfo, certificationsContent, feesContent, faqContent, contactContent, testimonialsContent, formResetKey]);

  const isConfigured = isSupabaseConfigured();

  const handleSave = async (dbKey: string, data: unknown) => {
    setSavingSection(dbKey);
    setSaveStatus(null);

    const success = await updateContent(dbKey, data);

    if (success) {
      setSaveStatus({ type: 'success', message: 'Saved successfully!' });
      setHasUnsavedChanges(false);
      setPendingSaveData(null);
      setValidationErrors([]);
    } else {
      setSaveStatus({ type: 'error', message: 'Failed to save. Check console for details.' });
    }

    setSavingSection(null);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleFormChange = (dbKey: string, data: unknown) => {
    setHasUnsavedChanges(true);
    setPendingSaveData({ dbKey, data });
  };

  const handleFloatingSave = () => {
    if (pendingSaveData) {
      // Validate before showing confirm modal
      const result = validateSection(pendingSaveData.dbKey, pendingSaveData.data);
      setValidationErrors(result.errors);
      
      if (!result.isValid) {
        // Show validation errors, don't open confirm modal
        return;
      }
      
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSave = () => {
    if (pendingSaveData) {
      handleSave(pendingSaveData.dbKey, pendingSaveData.data);
      setShowConfirmModal(false);
    }
  };

  // Get human-readable changes for display in modal
  const getChanges = (): string[] => {
    if (!pendingSaveData) return [];

    const changes: string[] = [];
    const original = originalDataRef.current[pendingSaveData.dbKey] as Record<string, unknown>;
    const updated = pendingSaveData.data as Record<string, unknown>;

    if (!original || !updated) return [];

    const formatFieldName = (key: string): string => {
      return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/^./, str => str.toUpperCase())
        .trim();
    };

    // Handle array fields (certifications, services, faqs, testimonials)
    const describeArrayChanges = (oldArr: unknown[], newArr: unknown[], itemLabel: string) => {
      const oldCount = oldArr?.length || 0;
      const newCount = newArr?.length || 0;
      
      if (newCount > oldCount) {
        const addedCount = newCount - oldCount;
        changes.push(`Added ${addedCount} new ${itemLabel}${addedCount > 1 ? 's' : ''}`);
      } else if (newCount < oldCount) {
        const removedCount = oldCount - newCount;
        changes.push(`Removed ${removedCount} ${itemLabel}${removedCount > 1 ? 's' : ''}`);
      }
      
      // Check for modifications to existing items
      const minLength = Math.min(oldCount, newCount);
      let modifiedCount = 0;
      for (let i = 0; i < minLength; i++) {
        if (JSON.stringify(oldArr[i]) !== JSON.stringify(newArr[i])) {
          modifiedCount++;
        }
      }
      if (modifiedCount > 0) {
        changes.push(`Modified ${modifiedCount} ${itemLabel}${modifiedCount > 1 ? 's' : ''}`);
      }
    };

    // Compare fields
    Object.keys(updated).forEach((key) => {
      const oldVal = original[key];
      const newVal = updated[key];
      
      if (JSON.stringify(oldVal) === JSON.stringify(newVal)) return;

      // Handle arrays specially
      if (Array.isArray(newVal)) {
        const oldArr = (oldVal as unknown[]) || [];
        const newArr = newVal as unknown[];
        
        // Determine item label based on field name
        if (key === 'certifications') {
          describeArrayChanges(oldArr, newArr, 'certification');
        } else if (key === 'services') {
          describeArrayChanges(oldArr, newArr, 'plan');
        } else if (key === 'faqs') {
          describeArrayChanges(oldArr, newArr, 'FAQ');
        } else if (key === 'testimonials') {
          describeArrayChanges(oldArr, newArr, 'testimonial');
        } else {
          describeArrayChanges(oldArr, newArr, 'item');
        }
        return;
      }

      // Handle simple string/number changes
      const fieldName = formatFieldName(key);
      if (typeof newVal === 'string' && typeof oldVal === 'string') {
        if (!oldVal && newVal) {
          changes.push(`Added ${fieldName}`);
        } else if (oldVal && !newVal) {
          changes.push(`Cleared ${fieldName}`);
        } else {
          changes.push(`Updated ${fieldName}`);
        }
      } else if (typeof newVal === 'boolean') {
        changes.push(`${newVal ? 'Enabled' : 'Disabled'} ${fieldName}`);
      } else {
        changes.push(`Updated ${fieldName}`);
      }
    });

    return changes.length > 0 ? changes : ['Content has been modified'];
  };

  const handleCancelChanges = () => {
    setHasUnsavedChanges(false);
    setPendingSaveData(null);
    setValidationErrors([]);
    setFormResetKey((prev) => prev + 1); // Force form to reset to original data
  };

  const toggleSection = (key: SectionKey) => {
    // If clicking on the same section, just collapse it
    if (expandedSection === key) {
      setExpandedSection(null);
      setHasUnsavedChanges(false);
      setPendingSaveData(null);
      setValidationErrors([]);
      return;
    }
    
    // Warn if there are unsaved changes when switching to a different section
    if (hasUnsavedChanges && expandedSection !== null) {
      setPendingSectionSwitch(key);
      setShowDiscardModal(true);
      return;
    }
    
    // Clear any stale state and expand the new section
    setHasUnsavedChanges(false);
    setPendingSaveData(null);
    setValidationErrors([]);
    setExpandedSection(key);
  };

  const handleConfirmDiscard = () => {
    if (pendingSectionSwitch) {
      setExpandedSection(pendingSectionSwitch);
      setHasUnsavedChanges(false);
      setPendingSaveData(null);
      setPendingSectionSwitch(null);
      setValidationErrors([]);
    }
    setShowDiscardModal(false);
  };

  const renderForm = (sectionKey: SectionKey, dbKey: string) => {
    switch (sectionKey) {
      case 'hero':
        return (
          <HeroForm
            key={formResetKey}
            data={heroContent}
            onChange={(data) => handleFormChange(dbKey, data)}
          />
        );
      case 'contactInfo':
        return (
          <ContactInfoForm
            key={formResetKey}
            data={contactInfo}
            onChange={(data) => handleFormChange(dbKey, data)}
          />
        );
      case 'certifications':
        return (
          <CertificationsForm
            key={formResetKey}
            data={certificationsContent}
            onChange={(data) => handleFormChange(dbKey, data)}
          />
        );
      case 'fees':
        return (
          <FeesForm
            key={formResetKey}
            data={feesContent}
            onChange={(data) => handleFormChange(dbKey, data)}
          />
        );
      case 'faq':
        return (
          <FAQForm
            key={formResetKey}
            data={faqContent}
            onChange={(data) => handleFormChange(dbKey, data)}
          />
        );
      case 'contactContent':
        return (
          <ContactContentForm
            key={formResetKey}
            data={contactContent}
            onChange={(data) => handleFormChange(dbKey, data)}
          />
        );
      case 'testimonials':
        return (
          <TestimonialsForm
            key={formResetKey}
            data={testimonialsContent}
            onChange={(data) => handleFormChange(dbKey, data)}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">Back to Site</span>
              </Link>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            </div>

            <div className="flex items-center gap-3">
              {user && (
                <span className="text-gray-400 text-sm hidden md:inline">
                  {user.email}
                </span>
              )}
              {user && (
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Status Banner */}
      {!isConfigured && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-3">
          <div className="max-w-5xl mx-auto">
            <p className="text-yellow-400 text-sm">
              ⚠️ Supabase is not configured. Add your credentials to <code className="bg-gray-800 px-1 rounded">.env</code> to enable saving.
              Currently showing default content from constants.
            </p>
          </div>
        </div>
      )}

      {/* Save Status */}
      {saveStatus && (
        <div
          className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            saveStatus.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {saveStatus.type === 'success' ? <CheckCircle size={18} /> : null}
          {saveStatus.message}
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.key}
              className="bg-gray-800 rounded-xl overflow-hidden"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.key)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-700/50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                {expandedSection === section.key ? (
                  <ChevronUp size={20} className="text-gray-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400" />
                )}
              </button>

              {/* Section Content */}
              {expandedSection === section.key && (
                <div className="px-6 pb-6 border-t border-gray-700">
                  {renderForm(section.key, section.dbKey)}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="fixed bottom-24 right-6 z-50 max-w-sm bg-red-500/95 text-white rounded-lg shadow-lg p-4 animate-in slide-in-from-right">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-2">Please fix the following errors:</p>
              <ul className="text-sm space-y-1">
                {validationErrors.slice(0, 5).map((err, i) => (
                  <li key={i}>• {err.message}</li>
                ))}
                {validationErrors.length > 5 && (
                  <li className="text-red-200">...and {validationErrors.length - 5} more</li>
                )}
              </ul>
            </div>
            <button
              onClick={() => setValidationErrors([])}
              className="flex-shrink-0 p-1 hover:bg-red-600 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <button
            onClick={handleCancelChanges}
            disabled={savingSection !== null}
            className="flex items-center gap-2 px-5 py-3 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-600/50 text-white rounded-full font-medium shadow-lg transition-all duration-300 hover:scale-105"
          >
            <X size={20} />
            Cancel
          </button>
          <button
            onClick={handleFloatingSave}
            disabled={savingSection !== null}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light disabled:bg-primary/50 text-white rounded-full font-medium shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105"
          >
            {savingSection ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmSaveModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSave}
        sectionTitle={sections.find(s => s.dbKey === pendingSaveData?.dbKey)?.title || ''}
        changes={getChanges()}
        isSaving={savingSection !== null}
      />

      {/* Discard Changes Modal */}
      <DiscardChangesModal
        isOpen={showDiscardModal}
        onClose={() => {
          setShowDiscardModal(false);
          setPendingSectionSwitch(null);
        }}
        onConfirm={handleConfirmDiscard}
        sectionTitle={sections.find(s => s.key === expandedSection)?.title || 'the current section'}
      />
    </div>
  );
}
