/**
 * Per-page SEO metadata component.
 *
 * Uses React 19's native document metadata hoisting — <title>, <meta>, and
 * <link rel="canonical"> rendered inside components are automatically
 * moved to <head>. That means each page can declare its own metadata
 * without needing react-helmet or similar.
 *
 * JSON-LD <script> tags don't hoist by React 19, but Google's crawler
 * parses application/ld+json from anywhere in the document, so rendering
 * them inline in the component tree is fine.
 */

const SITE_URL = "https://www.allin1carrental.com";
const SITE_NAME = "All in 1 Car Rentals";
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/curacao-wide.webp`;

export default function Seo({
  title,
  description,
  path = "/",
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  schema = null,
  noindex = false,
}) {
  const canonical = `${SITE_URL}${path === "/" ? "/" : path.replace(/\/$/, "")}`;
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Optional structured data (JSON-LD) */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </>
  );
}
