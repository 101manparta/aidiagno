import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { SiteDataProvider } from './context/SiteDataContext';
import { AboutPage } from './pages/AboutPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { ContactPage } from './pages/ContactPage';
import { DemoPage } from './pages/DemoPage';
import { HomePage } from './pages/HomePage';
import { PricingPage } from './pages/PricingPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { SolutionsPage } from './pages/SolutionsPage';

const AdminPage = lazy(() =>
  import('./pages/AdminPage').then((module) => ({ default: module.AdminPage }))
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <SiteDataProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/solusi" element={<SolutionsPage />} />
            <Route
              path="/solusi/smart-lis"
              element={<ProductDetailPage productSlug="smart-lis" />}
            />
            <Route
              path="/solusi/quality-intelligence"
              element={<ProductDetailPage productSlug="quality-intelligence" />}
            />
            <Route
              path="/solusi/otomasi-lab"
              element={<ProductDetailPage productSlug="laboratory-automation" />}
            />
            <Route path="/harga" element={<PricingPage />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/tentang" element={<AboutPage />} />
            <Route path="/wawasan" element={<ResourcesPage />} />
            <Route path="/wawasan/:slug" element={<ArticleDetailPage />} />
            <Route path="/kontak" element={<ContactPage />} />
            <Route
              path="/admin/*"
              element={
                <Suspense
                  fallback={
                    <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm font-medium text-slate-600">
                      Memuat portal administrasi...
                    </div>
                  }
                >
                  <AdminPage />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SiteDataProvider>
    </ErrorBoundary>
  );
}
