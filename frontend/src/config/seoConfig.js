/**
 * SEO Configuration for Hope Physicians
 * Centralized SEO settings and keywords
 */

export const seoConfig = {
  // Default meta tags
  default: {
    title: "Hope Physicians | Primary Care & Family Medicine | Kinston, NC",
    description:
      "Hope Physicians & Urgent Care, PLLC provides comprehensive primary care, family medicine, urgent care, and specialized medical services in Kinston, NC. Expert physicians offering pediatric care, women's health, geriatric care, and occupational health services.",
    keywords: [
      "Physicians",
      "Doctors",
      "Primary care",
      "Primary care physician",
      "Family Medicine",
      "Urgent Care",
      "Immediate Care",
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
      streetAddress: "2104 North Heritage St.",
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
    "Primary Care",
    "Urgent Care",
    "Immediate Care",
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
    "@type": "MedicalBusiness",
    name: seoConfig.business.name,
    image: `${url}/logo.png`,
    "@id": url,
    url: url,
    telephone: seoConfig.business.phone,
    faxNumber: seoConfig.business.fax,
    email: seoConfig.business.email,
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
    contactPoint: {
      "@type": "ContactPoint",
      telephone: seoConfig.business.phone,
      contactType: "customer service",
      areaServed: "US",
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
  };
};
