import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

export const useSEO = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  canonicalUrl,
  twitterTitle,
  twitterDescription,
  twitterImage,
}: SEOProps) => {
  useEffect(() => {
    // Set title
    document.title = title;

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (metaDescription) {
      metaDescription.content = description;
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Set keywords
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
      if (metaKeywords) {
        metaKeywords.content = keywords;
      } else {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = keywords;
        document.head.appendChild(meta);
      }
    }

    // Set Open Graph tags
    const setOGTag = (property: string, content: string) => {
      const existing = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (existing) {
        existing.content = content;
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    if (ogTitle) setOGTag('og:title', ogTitle);
    if (ogDescription) setOGTag('og:description', ogDescription);
    if (ogImage) setOGTag('og:image', ogImage);
    if (ogUrl) setOGTag('og:url', ogUrl);

    // Set Twitter tags
    const setTwitterTag = (name: string, content: string) => {
      const existing = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (existing) {
        existing.content = content;
      } else {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    if (twitterTitle) setTwitterTag('twitter:title', twitterTitle);
    if (twitterDescription) setTwitterTag('twitter:description', twitterDescription);
    if (twitterImage) setTwitterTag('twitter:image', twitterImage);

    // Set canonical URL
    if (canonicalUrl) {
      const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (canonical) {
        canonical.href = canonicalUrl;
      } else {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = canonicalUrl;
        document.head.appendChild(link);
      }
    }
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl, canonicalUrl, twitterTitle, twitterDescription, twitterImage]);
};
