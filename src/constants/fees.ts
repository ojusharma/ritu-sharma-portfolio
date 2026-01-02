/**
 * ==============================================
 * FEES & SERVICES
 * ==============================================
 * Edit this file to update pricing and services
 */

export const FEES_CONTENT = {
  sectionTitle: "Services & Fees",
  sectionSubtitle: "Investment in your health",
  
  // Currency symbol
  currency: "₹",
  
  services: [
    {
      id: 1,
      name: "Initial Consultation",
      price: "X,XXX",
      duration: "60 minutes",
      description: "Comprehensive health assessment, body composition analysis, and personalized diet plan.",
      features: [
        "Detailed health history review",
        "Body composition analysis",
        "Customized meal plan",
        "Lifestyle recommendations",
      ],
      popular: false,
    },
    {
      id: 2,
      name: "Monthly Package",
      price: "X,XXX",
      duration: "4 weeks",
      description: "Complete monthly program with weekly follow-ups and diet adjustments.",
      features: [
        "Initial consultation included",
        "Weekly follow-up calls",
        "Diet plan modifications",
        "WhatsApp support",
        "Progress tracking",
      ],
      popular: true, // Highlighted as recommended
    },
    {
      id: 3,
      name: "3-Month Transformation",
      price: "XX,XXX",
      duration: "12 weeks",
      description: "Intensive program for significant health transformation with continuous support.",
      features: [
        "Everything in Monthly Package",
        "Bi-weekly video consultations",
        "Recipe suggestions",
        "Grocery shopping guide",
        "Priority support",
        "Progress reports",
      ],
      popular: false,
    },
    {
      id: 4,
      name: "Follow-up Session",
      price: "XXX",
      duration: "30 minutes",
      description: "Quick check-in for existing clients to review progress and adjust plans.",
      features: [
        "Progress review",
        "Diet modifications",
        "Query resolution",
      ],
      popular: false,
    },
  ],
  
  // Note displayed below pricing
  note: "All prices are inclusive of taxes. Payment plans available for long-term packages.",
};
