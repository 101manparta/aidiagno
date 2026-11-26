import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AvailabilityLabel } from '../components/common/AvailabilityLabel';
import { ProductIcon } from '../components/common/ProductIcon';
import { SafeImage } from '../components/common/SafeImage';
import { PublicLayout } from '../components/layout/PublicLayout';
import { useSiteData } from '../context/SiteDataContext';

export function SolutionsPage() {
  const { homepage, products } = useSiteData();

  const routeMap: Record<string, string> = {
    'smart-lis': '/solusi/smart-lis',
    'quality-intelligence': '/solusi/quality-intelligence',
    'laboratory-automation': '/solusi/otomasi-lab',
  };

  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-sky-50/60 to-white border-b border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="text-xs font-semibold text-[#0756B8]">Ekosistem Platform AI Diagno</div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F2747] max-w-3xl">
            Solusi Terintegrasi untuk Operasional dan Kendali Mutu Laboratorium
          </h1>
          <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
            {homepage.solutionsIntro}
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <AvailabilityLabel availability="available" />
              <span>Siap diimplementasikan</span>
            </div>
            <div className="flex items-center gap-2">
              <AvailabilityLabel availability="custom_integration" />
              <span>Memerlukan penyesuaian teknis fasilitas</span>
            </div>
            <div className="flex items-center gap-2">
              <AvailabilityLabel availability="planned" />
              <span>Tahap pengembangan &amp; validasi</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {products.map((product, idx) => {
            const href = routeMap[product.slug] || `/solusi/${product.slug}`;
            return (
              <div
                key={product.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border border-slate-200 rounded-xl overflow-hidden bg-white"
              >
                <div className={`lg:col-span-5 bg-slate-100 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <SafeImage
                    src={product.imageUrl}
                    alt={product.name}
                    fallbackLabel={product.name}
                    className="w-full h-full min-h-[260px] object-cover"
                  />
                </div>
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 text-[#0756B8] flex items-center justify-center">
                        <ProductIcon iconKey={product.iconKey} className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-[#0F2747]">{product.name}</h2>
                        <p className="text-xs font-medium text-[#0756B8]">{product.tagline}</p>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      {product.summary}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {product.features.map((feat) => (
                        <div
                          key={feat.id}
                          className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-[#0F2747]">{feat.title}</span>
                          </div>
                          <AvailabilityLabel availability={feat.availability} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Link
                      to={href}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#0756B8] rounded-lg hover:bg-[#0F2747] transition-colors"
                    >
                      <span>Detail Modul {product.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/demo"
                      className="text-sm font-semibold text-[#0756B8] hover:underline"
                    >
                      Coba di Demo Interaktif
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </PublicLayout>
  );
}
