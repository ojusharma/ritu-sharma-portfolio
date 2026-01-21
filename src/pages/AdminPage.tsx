import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, CheckCircle, LogOut, Loader2, Save, X, AlertTriangle, Trash2 } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';

// Import form components
import {
  HeroForm,
  ContactInfoForm,
  CertificationsForm,
  FeesForm,
  FAQForm,
  ContactContentForm,
  TestimonialsForm,
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

// Login Form Component
function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-gray-400">Sign in to manage your content</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-light disabled:bg-primary/50 text-white rounded-lg font-medium transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user, isLoading: authLoading, signOut } = useAuth();
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

  // Show login form if not authenticated
  if (!authLoading && !user && isConfigured) {
    return <LoginForm />;
  }

  const handleSave = async (dbKey: string, data: unknown) => {
    setSavingSection(dbKey);
    setSaveStatus(null);

    const success = await updateContent(dbKey, data);

    if (success) {
      setSaveStatus({ type: 'success', message: 'Saved successfully!' });
      setHasUnsavedChanges(false);
      setPendingSaveData(null);
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
    const describeArrayChanges = (fieldName: string, oldArr: unknown[], newArr: unknown[], itemLabel: string, nameKey = 'title') => {
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
          describeArrayChanges(key, oldArr, newArr, 'certification');
        } else if (key === 'services') {
          describeArrayChanges(key, oldArr, newArr, 'plan', 'name');
        } else if (key === 'faqs') {
          describeArrayChanges(key, oldArr, newArr, 'FAQ', 'question');
        } else if (key === 'testimonials') {
          describeArrayChanges(key, oldArr, newArr, 'testimonial', 'name');
        } else {
          describeArrayChanges(key, oldArr, newArr, 'item');
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
    setFormResetKey((prev) => prev + 1); // Force form to reset to original data
  };

  const toggleSection = (key: SectionKey) => {
    // If clicking on the same section, just collapse it
    if (expandedSection === key) {
      setExpandedSection(null);
      setHasUnsavedChanges(false);
      setPendingSaveData(null);
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
    setExpandedSection(key);
  };

  const handleConfirmDiscard = () => {
    if (pendingSectionSwitch) {
      setExpandedSection(pendingSectionSwitch);
      setHasUnsavedChanges(false);
      setPendingSaveData(null);
      setPendingSectionSwitch(null);
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

  if (isLoading || authLoading) {
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
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden border border-gray-700">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-700 bg-gray-800/80">
              <AlertTriangle size={24} className="text-yellow-500" />
              <h3 className="text-lg font-semibold text-white">Confirm Changes</h3>
            </div>

            {/* Content */}
            <div className="px-6 py-4 overflow-y-auto max-h-[50vh]">
              <p className="text-gray-300 mb-4">
                You're about to save the following changes to <span className="font-semibold text-primary">{sections.find(s => s.dbKey === pendingSaveData?.dbKey)?.title}</span>:
              </p>

              <ul className="space-y-2">
                {getChanges().map((change, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-700 bg-gray-800/80">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                disabled={savingSection !== null}
                className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-light disabled:bg-primary/50 text-white rounded-lg font-medium transition-colors"
              >
                {savingSection ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Confirm & Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discard Changes Modal */}
      {showDiscardModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              setShowDiscardModal(false);
              setPendingSectionSwitch(null);
            }}
          />

          {/* Modal */}
          <div className="relative bg-gray-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-700">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-700 bg-gray-800/80">
              <AlertTriangle size={24} className="text-yellow-500" />
              <h3 className="text-lg font-semibold text-white">Unsaved Changes</h3>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              <p className="text-gray-300">
                You have unsaved changes in <span className="font-semibold text-white">{sections.find(s => s.key === expandedSection)?.title || 'the current section'}</span>.
              </p>
              <p className="text-gray-400 mt-2">
                Are you sure you want to switch sections? Your changes will be lost.
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-700 bg-gray-800/80">
              <button
                onClick={() => {
                  setShowDiscardModal(false);
                  setPendingSectionSwitch(null);
                }}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Stay Here
              </button>
              <button
                onClick={handleConfirmDiscard}
                className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
              >
                <Trash2 size={18} />
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
