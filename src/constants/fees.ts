/**
 * ==============================================
 * FEES & SERVICES
 * ==============================================
 */

export const FEES_CONTENT = {
  sectionTitle: "Plans & Fees",
  sectionSubtitle: "No hidden fees. No crash-diets. Just results.",
  
  // Currency symbol
  currency: "₹",
  
  services: [
    {
      id: 1,
      name: "Consultation Call",
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
      price: "9,999",
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
  note: "*All prices are in INR and inclusive of taxes. Transfolmation results may vary based on individual commitment and adherence to the prescribed plan.",
};
