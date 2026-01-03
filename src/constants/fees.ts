/**
 * ==============================================
 * FEES & SERVICES
 * ==============================================
 */

export const FEES_CONTENT = {
  sectionTitle: "Simple, Transparent Pricing",
  sectionSubtitle: "No hidden fees. No long-term commitments. Just results.",
  
  // Currency symbol
  currency: "₹",
  
  services: [
    {
      id: 1,
      name: "Discovery Call",
      price: "1,200",
      duration: "One-time session",
      description: "Not sure where to start? Let's talk about your goals and see if we're the right fit.",
      features: [
        "Understand your health goals",
        "Review your current eating habits",
        "Get personalized recommendations",
        "Zero pressure, 100% clarity",
      ],
      popular: false,
    },
    {
      id: 2,
      name: "Complete Transformation",
      price: "10,000",
      duration: "3 months of support",
      description: "Everything you need to finally see lasting results. Your consultation fee gets credited!",
      features: [
        "Consultation fee (₹1,200) refunded",
        "Fully personalized meal plan",
        "Check-ins every 15 days",
        "Direct call access (12 PM - 8 PM)",
        "Unlimited diet adjustments",
        "WhatsApp support for quick queries",
      ],
      popular: true, // Highlighted as recommended
    },
  ],
  
  // Note displayed below pricing
  note: "Already had a consultation? Your ₹1,200 gets deducted from the meal plan!",
};
