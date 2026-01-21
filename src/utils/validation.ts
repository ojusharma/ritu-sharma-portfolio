// Validation utilities for admin forms

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Common validators
export const validators = {
  required: (value: unknown, fieldName: string): ValidationError | null => {
    if (value === null || value === undefined) {
      return { field: fieldName, message: `${fieldName} is required` };
    }
    if (typeof value === 'string' && value.trim() === '') {
      return { field: fieldName, message: `${fieldName} is required` };
    }
    return null;
  },

  email: (value: string, fieldName: string): ValidationError | null => {
    if (!value) return null; // Let required handle empty
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return { field: fieldName, message: `${fieldName} must be a valid email` };
    }
    return null;
  },

  url: (value: string, fieldName: string): ValidationError | null => {
    if (!value) return null; // Let required handle empty
    try {
      new URL(value);
      return null;
    } catch {
      return { field: fieldName, message: `${fieldName} must be a valid URL` };
    }
  },

  phone: (value: string, fieldName: string): ValidationError | null => {
    if (!value) return null; // Let required handle empty
    // Allow various phone formats: +91 12345 67890, (123) 456-7890, 123-456-7890, etc.
    const phoneRegex = /^[+]?[\d\s\-().]{7,20}$/;
    if (!phoneRegex.test(value)) {
      return { field: fieldName, message: `${fieldName} must be a valid phone number` };
    }
    return null;
  },

  minLength: (value: string, min: number, fieldName: string): ValidationError | null => {
    if (!value) return null;
    if (value.length < min) {
      return { field: fieldName, message: `${fieldName} must be at least ${min} characters` };
    }
    return null;
  },

  positiveNumber: (value: string | number, fieldName: string): ValidationError | null => {
    if (value === '' || value === null || value === undefined) return null;
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num) || num < 0) {
      return { field: fieldName, message: `${fieldName} must be a positive number` };
    }
    return null;
  },

  nonEmptyArray: (value: unknown[], fieldName: string): ValidationError | null => {
    if (!value || value.length === 0) {
      return { field: fieldName, message: `At least one ${fieldName} is required` };
    }
    return null;
  },
};

// Form-specific validators
export function validateHeroContent(data: {
  name: string;
  title: string;
  description: string;
  image: string;
  ctaButton: { text: string; link: string };
}): ValidationResult {
  const errors: ValidationError[] = [];

  const nameErr = validators.required(data.name, 'Name');
  if (nameErr) errors.push(nameErr);

  const titleErr = validators.required(data.title, 'Title');
  if (titleErr) errors.push(titleErr);

  const descErr = validators.required(data.description, 'Description');
  if (descErr) errors.push(descErr);

  const imgErr = validators.required(data.image, 'Image URL');
  if (imgErr) errors.push(imgErr);
  else {
    const urlErr = validators.url(data.image, 'Image URL');
    if (urlErr) errors.push(urlErr);
  }

  const ctaErr = validators.required(data.ctaButton?.text, 'CTA Button Text');
  if (ctaErr) errors.push(ctaErr);

  return { isValid: errors.length === 0, errors };
}

export function validateContactInfo(data: {
  email: string;
  phone: string;
  whatsapp: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  const emailReq = validators.required(data.email, 'Email');
  if (emailReq) errors.push(emailReq);
  else {
    const emailErr = validators.email(data.email, 'Email');
    if (emailErr) errors.push(emailErr);
  }

  const phoneReq = validators.required(data.phone, 'Phone');
  if (phoneReq) errors.push(phoneReq);
  else {
    const phoneErr = validators.phone(data.phone, 'Phone');
    if (phoneErr) errors.push(phoneErr);
  }

  const waReq = validators.required(data.whatsapp, 'WhatsApp');
  if (waReq) errors.push(waReq);
  else {
    const waErr = validators.phone(data.whatsapp, 'WhatsApp');
    if (waErr) errors.push(waErr);
  }

  return { isValid: errors.length === 0, errors };
}

export function validateCertifications(data: {
  sectionTitle: string;
  certifications: { title: string; institution: string }[];
}): ValidationResult {
  const errors: ValidationError[] = [];

  const titleErr = validators.required(data.sectionTitle, 'Section Title');
  if (titleErr) errors.push(titleErr);

  const arrErr = validators.nonEmptyArray(data.certifications, 'certification');
  if (arrErr) errors.push(arrErr);

  data.certifications?.forEach((cert, i) => {
    const certTitleErr = validators.required(cert.title, `Certification ${i + 1} Title`);
    if (certTitleErr) errors.push(certTitleErr);

    const instErr = validators.required(cert.institution, `Certification ${i + 1} Institution`);
    if (instErr) errors.push(instErr);
  });

  return { isValid: errors.length === 0, errors };
}

export function validateFees(data: {
  sectionTitle: string;
  currency: string;
  services: { name: string; price: string }[];
}): ValidationResult {
  const errors: ValidationError[] = [];

  const titleErr = validators.required(data.sectionTitle, 'Section Title');
  if (titleErr) errors.push(titleErr);

  const currErr = validators.required(data.currency, 'Currency');
  if (currErr) errors.push(currErr);

  const arrErr = validators.nonEmptyArray(data.services, 'plan');
  if (arrErr) errors.push(arrErr);

  data.services?.forEach((svc, i) => {
    const nameErr = validators.required(svc.name, `Plan ${i + 1} Name`);
    if (nameErr) errors.push(nameErr);

    const priceErr = validators.required(svc.price, `Plan ${i + 1} Price`);
    if (priceErr) errors.push(priceErr);
  });

  return { isValid: errors.length === 0, errors };
}

export function validateFAQ(data: {
  sectionTitle: string;
  faqs: { question: string; answer: string }[];
}): ValidationResult {
  const errors: ValidationError[] = [];

  const titleErr = validators.required(data.sectionTitle, 'Section Title');
  if (titleErr) errors.push(titleErr);

  const arrErr = validators.nonEmptyArray(data.faqs, 'FAQ');
  if (arrErr) errors.push(arrErr);

  data.faqs?.forEach((faq, i) => {
    const qErr = validators.required(faq.question, `FAQ ${i + 1} Question`);
    if (qErr) errors.push(qErr);

    const aErr = validators.required(faq.answer, `FAQ ${i + 1} Answer`);
    if (aErr) errors.push(aErr);
  });

  return { isValid: errors.length === 0, errors };
}

export function validateContactContent(data: {
  sectionTitle: string;
  sectionSubtitle: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  const titleErr = validators.required(data.sectionTitle, 'Section Title');
  if (titleErr) errors.push(titleErr);

  return { isValid: errors.length === 0, errors };
}

export function validateTestimonials(data: {
  sectionTitle: string;
  testimonials: { name: string; text: string; image: string }[];
}): ValidationResult {
  const errors: ValidationError[] = [];

  const titleErr = validators.required(data.sectionTitle, 'Section Title');
  if (titleErr) errors.push(titleErr);

  data.testimonials?.forEach((t, i) => {
    const nameErr = validators.required(t.name, `Testimonial ${i + 1} Name`);
    if (nameErr) errors.push(nameErr);

    const textErr = validators.required(t.text, `Testimonial ${i + 1} Text`);
    if (textErr) errors.push(textErr);

    if (t.image) {
      const urlErr = validators.url(t.image, `Testimonial ${i + 1} Image`);
      if (urlErr) errors.push(urlErr);
    }
  });

  return { isValid: errors.length === 0, errors };
}

// Main validator that routes to specific validators
export function validateSection(dbKey: string, data: unknown): ValidationResult {
  switch (dbKey) {
    case 'hero':
      return validateHeroContent(data as Parameters<typeof validateHeroContent>[0]);
    case 'contact_info':
      return validateContactInfo(data as Parameters<typeof validateContactInfo>[0]);
    case 'certifications':
      return validateCertifications(data as Parameters<typeof validateCertifications>[0]);
    case 'fees':
      return validateFees(data as Parameters<typeof validateFees>[0]);
    case 'faq':
      return validateFAQ(data as Parameters<typeof validateFAQ>[0]);
    case 'contact':
      return validateContactContent(data as Parameters<typeof validateContactContent>[0]);
    case 'testimonials':
      return validateTestimonials(data as Parameters<typeof validateTestimonials>[0]);
    default:
      return { isValid: true, errors: [] };
  }
}
