import React from 'react';
import { Helmet } from 'react-helmet-async';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const MetaTags: React.FC<MetaTagsProps> = ({
  title = "Jharkhand Tourism - Discover the Heart of India",
  description = "Explore Jharkhand's pristine forests, vibrant tribal culture, and breathtaking waterfalls through our AI-powered smart tourism platform. Book authentic experiences with local communities.",
  keywords = "Jharkhand tourism, tribal culture, eco tourism, Netarhat, Hundru Falls, Betla National Park, Deoghar, local guides, homestays, handicrafts",
  image = "/pexels/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1200",
  url = "https://jharkhndtourism.vercel.app"
}) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Government of Jharkhand" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Jharkhand Tourism" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@JharkhandGov" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#059669" />
      <meta name="msapplication-TileColor" content="#059669" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Jharkhand Tourism" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TouristDestination",
          "name": "Jharkhand",
          "description": description,
          "image": image,
          "url": url,
          "address": {
            "@type": "PostalAddress",
            "addressRegion": "Jharkhand",
            "addressCountry": "India"
          },
          "touristType": ["EcoTourist", "CulturalTourist", "AdventureTourist"],
          "availableLanguage": ["English", "Hindi"],
          "currenciesAccepted": "INR",
          "paymentAccepted": ["Cash", "Credit Card", "Digital Payment"]
        })}
      </script>
    </Helmet>
  );
};

export default MetaTags;