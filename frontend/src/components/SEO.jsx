import { Helmet } from "react-helmet-async";
import {
  seoConfig,
  getMedicalBusinessSchema,
  getOrganizationSchema,
  getLocalBusinessSchema,
} from "../config/seoConfig";

/**
 * SEO Component for dynamic meta tag management
 * @param {Object} props - SEO props
 * @param {string} props.title - Page title
 * @param {string} props.description - Meta description
 * @param {string[]} props.keywords - Additional keywords
 * @param {string} props.image - Open Graph image URL
 * @param {string} props.url - Canonical URL
 * @param {boolean} props.noindex - Whether to add noindex tag
 */
const SEO = ({
  title,
  description,
  keywords = [],
  image,
  url,
  noindex = false,
}) => {
  // Merge default keywords with page-specific keywords
  const allKeywords = [...seoConfig.default.keywords, ...keywords].join(", ");

  // Use defaults if not provided
  const pageTitle = title
    ? `${title} | ${seoConfig.default.siteName}`
    : seoConfig.default.title;
  const pageDescription = description || seoConfig.default.description;
  const pageImage = image || `${seoConfig.business.url}/og-image.jpg`;
  const pageUrl = url || seoConfig.business.url;

  // Generate structured data
  const medicalBusinessSchema = getMedicalBusinessSchema(pageUrl);
  const organizationSchema = getOrganizationSchema(pageUrl);
  const localBusinessSchema = getLocalBusinessSchema(pageUrl);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={seoConfig.default.author} />

      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={seoConfig.default.type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content={seoConfig.default.siteName} />
      <meta property="og:locale" content={seoConfig.default.locale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      {seoConfig.social.twitter && (
        <meta name="twitter:site" content={seoConfig.social.twitter} />
      )}

      {/* Structured Data - JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(medicalBusinessSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
