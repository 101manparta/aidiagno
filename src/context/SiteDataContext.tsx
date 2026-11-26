import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  DEFAULT_ARTICLES,
  DEFAULT_HOMEPAGE_CONTENT,
  DEFAULT_PRICING_PLANS,
  DEFAULT_PRODUCTS,
  DEFAULT_SITE_SETTINGS,
} from '../data/defaultSeed';
import { fetchPublicSiteData, PublicSiteBundle } from '../services/cmsService';

interface SiteDataContextValue extends PublicSiteBundle {
  loading: boolean;
  refresh: () => Promise<void>;
}

const SiteDataContext = createContext<SiteDataContextValue>({
  settings: DEFAULT_SITE_SETTINGS,
  homepage: DEFAULT_HOMEPAGE_CONTENT,
  products: DEFAULT_PRODUCTS,
  pricingPlans: DEFAULT_PRICING_PLANS,
  articles: DEFAULT_ARTICLES,
  usingSeedFallback: true,
  loading: true,
  refresh: async () => {},
});

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const [bundle, setBundle] = useState<PublicSiteBundle>({
    settings: DEFAULT_SITE_SETTINGS,
    homepage: DEFAULT_HOMEPAGE_CONTENT,
    products: DEFAULT_PRODUCTS,
    pricingPlans: DEFAULT_PRICING_PLANS,
    articles: DEFAULT_ARTICLES,
    usingSeedFallback: true,
  });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPublicSiteData();
      setBundle(data);
      if (data.settings.seoTitle) {
        document.title = data.settings.seoTitle;
      }
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && data.settings.seoDescription) {
        metaDesc.setAttribute('content', data.settings.seoDescription);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return (
    <SiteDataContext.Provider value={{ ...bundle, loading, refresh: loadData }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteDataContext);
}
