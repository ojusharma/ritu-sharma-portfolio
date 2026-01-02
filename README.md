# Ritu Sharma - Nutritionist Portfolio

A modern, mobile-first single-page application built with React Router 7, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── sections/           # Page sections
│   │   ├── Hero.tsx
│   │   ├── Certifications.tsx
│   │   ├── Fees.tsx
│   │   ├── Testimonials.tsx
│   │   ├── FAQ.tsx
│   │   └── Contact.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── WhatsAppButton.tsx
│   └── index.ts
├── constants/              # ⚡ EDIT THESE TO UPDATE CONTENT
│   ├── siteConfig.ts      # Site settings, contact info, features
│   ├── heroContent.ts     # Hero section content
│   ├── certifications.ts  # Certifications & qualifications
│   ├── fees.ts            # Services & pricing
│   ├── testimonials.ts    # Client testimonials
│   ├── faq.ts             # Frequently asked questions
│   ├── contact.ts         # Contact section content
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

## ✏️ Customization Guide

### To Update Content

All content is stored in the `src/constants/` folder. Simply edit the relevant file:

| File | Content |
|------|---------|
| `siteConfig.ts` | Site name, navigation, contact info, feature toggles |
| `heroContent.ts` | Hero headline, tagline, description, stats |
| `certifications.ts` | Education and certifications |
| `fees.ts` | Services and pricing |
| `testimonials.ts` | Client testimonials |
| `faq.ts` | FAQ questions and answers |
| `contact.ts` | Contact section messaging |

### To Show/Hide Testimonials

In `siteConfig.ts`, set:
```typescript
features: {
  showTestimonials: true, // Set to true to show testimonials
}
```

### To Update Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    dark: '#1B211A',
    DEFAULT: '#628141',
    light: '#8BAE66',
  },
  accent: '#EBD5AB',
}
```

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Dark Green | `#1B211A` | Background, text |
| Green | `#628141` | Primary buttons, accents |
| Light Green | `#8BAE66` | Highlights, tagline |
| Cream | `#EBD5AB` | Accent, stats |

## 📱 Features

- ✅ Mobile-first responsive design
- ✅ Smooth scroll navigation
- ✅ Floating WhatsApp button
- ✅ Animated interactions
- ✅ SEO-friendly structure
- ✅ Fast Vite build system
- ✅ TypeScript for type safety

## 📄 License

MIT License
