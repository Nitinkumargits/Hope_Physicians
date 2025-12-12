/**
 * SEO Configuration for Hope Physicians
 * Centralized SEO settings and keywords
 */

export const seoConfig = {
  // Default meta tags
  default: {
    title: "Urgent Care in Kinston, NC | Hope Physicians & Urgent Care",
    description:
      "Hope Physicians provides urgent care and immediate care services in Kinston, NC at 2104 North Herritage Street, Kinston, NC 28501. Walk-in urgent care, family medicine, and primary care physician services. No appointment needed for urgent care visits.",
    keywords: [
      "urgent care in Kinston",
      "urgent care Kinston NC",
      "Kinston urgent care",
      "immediate care Kinston",
      "urgent care near me Kinston",
      "walk-in clinic Kinston",
      "urgent care Kinston North Carolina",
      "Urgent Care",
      "Immediate Care",
      "Physicians",
      "Doctors",
      "Primary care",
      "Primary care physician",
      "Family Medicine",
      "Geriatric Care",
      "Women's Health",
      "Pediatric care",
      "Occupational Health",
      "Wellness care",
      "Obesity management",
      "Sports physical",
      "DOT physical",
      "Kinston NC",
      "Hope Physicians",
    ],
    author: "Hope Physicians & Urgent Care, PLLC",
    siteName: "Hope Physicians",
    locale: "en_US",
    type: "website",
  },

  // Business information
  business: {
    name: "Hope Physicians & Urgent Care, PLLC",
    address: {
      streetAddress: "2104 North Herritage Street",
      addressLocality: "Kinston",
      addressRegion: "NC",
      postalCode: "28501",
      addressCountry: "US",
    },
    phone: "252-522-3663",
    fax: "252-522-3660",
    email: "info@hopephysicians.com",
    url: "https://hopephysicians.com",
  },

  // Medical specialties
  specialties: [
    "Family Medicine",
    "Pediatrics",
    "Geriatrics",
    "Women's Health",
    "Men's Health",
    "Occupational Health",
  ],

  // Services
  services: [
    "Urgent Care",
    "UrgentCareService",
    "EmergencyService",
    "Immediate Care",
    "Primary Care",
    "Family Medicine",
    "Pediatric Care",
    "Women's Health",
    "Geriatric Care",
    "Occupational Health",
    "Wellness Care",
    "Obesity Management",
    "Sports Physical",
    "DOT Physical",
  ],

  // Social media
  social: {
    twitter: "@hopephysicians",
    facebook: "hopephysicians",
  },
};

/**
 * Generate structured data for MedicalBusiness schema
 */
export const getMedicalBusinessSchema = (url = seoConfig.business.url) => {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "EmergencyService"],
    name: seoConfig.business.name,
    image: `${url}/logo.png`,
    "@id": url,
    url: url,
    telephone: seoConfig.business.phone,
    faxNumber: seoConfig.business.fax,
    email: seoConfig.business.email,
    description:
      "Urgent care and immediate care services in Kinston, NC. Walk-in welcome, no appointment needed. Located at 2104 North Herritage Street, Kinston, NC 28501.",
    address: {
      "@type": "PostalAddress",
      streetAddress: seoConfig.business.address.streetAddress,
      addressLocality: seoConfig.business.address.addressLocality,
      addressRegion: seoConfig.business.address.addressRegion,
      postalCode: seoConfig.business.address.postalCode,
      addressCountry: seoConfig.business.address.addressCountry,
    },
    medicalSpecialty: seoConfig.specialties,
    service: seoConfig.services,
    priceRange: "$$",
    paymentAccepted: ["Cash", "Credit Card", "Insurance"],
    currenciesAccepted: "USD",
    areaServed: {
      "@type": "City",
      name: "Kinston",
      "@id": "https://www.wikidata.org/wiki/Q1007401",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "08:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Friday",
        opens: "08:00",
        closes: "12:00",
      },
    ],
  };
};

/**
 * Generate structured data for Organization schema
 */
export const getOrganizationSchema = (url = seoConfig.business.url) => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seoConfig.business.name,
    url: url,
    logo: `${url}/logo.png`,
    description:
      "Urgent care and primary care services in Kinston, NC. Providing walk-in urgent care, immediate care, family medicine, and specialized medical services at 2104 North Herritage Street, Kinston, NC 28501.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: seoConfig.business.phone,
      contactType: "customer service",
      areaServed: {
        "@type": "City",
        name: "Kinston",
        addressRegion: "NC",
      },
      availableLanguage: ["English"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: seoConfig.business.address.streetAddress,
      addressLocality: seoConfig.business.address.addressLocality,
      addressRegion: seoConfig.business.address.addressRegion,
      postalCode: seoConfig.business.address.postalCode,
      addressCountry: seoConfig.business.address.addressCountry,
    },
    sameAs: [
      `https://www.facebook.com/${seoConfig.social.facebook}`,
      `https://twitter.com/${seoConfig.social.twitter}`,
    ],
  };
};

/**
 * Generate structured data for LocalBusiness schema
 */
export const getLocalBusinessSchema = (url = seoConfig.business.url) => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: seoConfig.business.name,
    image: `${url}/logo.png`,
    "@id": url,
    url: url,
    telephone: seoConfig.business.phone,
    description:
      "Urgent care and immediate care services in Kinston, NC. Walk-in welcome, no appointment needed. Located at 2104 North Herritage Street, Kinston, NC 28501.",
    address: {
      "@type": "PostalAddress",
      streetAddress: seoConfig.business.address.streetAddress,
      addressLocality: seoConfig.business.address.addressLocality,
      addressRegion: seoConfig.business.address.addressRegion,
      postalCode: seoConfig.business.address.postalCode,
      addressCountry: seoConfig.business.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "35.2621",
      longitude: "-77.5816",
    },
    areaServed: {
      "@type": "City",
      name: "Kinston",
      addressRegion: "NC",
    },
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: "35.2621",
        longitude: "-77.5816",
      },
      geoRadius: {
        "@type": "Distance",
        value: "25",
        unitCode: "mi",
      },
    },
    hasMap: `https://www.google.com/maps?q=2104+North+Herritage+Street,+Kinston,+NC+28501`,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "08:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Friday",
        opens: "08:00",
        closes: "12:00",
      },
    ],
    priceRange: "$$",
    paymentAccepted: ["Cash", "Credit Card", "Insurance"],
    currenciesAccepted: "USD",
  };
};
