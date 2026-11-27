import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, PlayCircle } from 'lucide-react';
import { AvailabilityLabel } from '../components/common/AvailabilityLabel';
import { ProductIcon } from '../components/common/ProductIcon';
import { SafeImage } from '../components/common/SafeImage';
import { InteractiveLabDemo } from '../components/demo/InteractiveLabDemo';
import { PublicLayout } from '../components/layout/PublicLayout';
import { PricingFlipCard } from '../components/pricing/PricingFlipCard';
import { useSiteData } from '../context/SiteDataContext';

export function HomePage() {
  const { homepage, products, pricingPlans } = useSiteData();
  const [billingMode, setBillingMode] = useState<'monthly' | 'annual'>('monthly');
  const [backdropFailed, setBackdropFailed] = useState(false);

  const routeMap: Record<string, string> = {
    'smart-lis': '/solusi/smart-lis',
    'quality-intelligence': '/solusi/quality-intelligence',
    'laboratory-automation': '/solusi/otomasi-lab',
  };

  return (
    <PublicLayout>
      {/* 2. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/80 via-white to-white border-b border-slate-100">
        {/* Translucent HD Laboratory Visual Backdrop */}
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          {!backdropFailed && (
            <img
              src="/src/assets/images/hero_lab_backdrop_1795654387973.jpg"
              alt=""
              referrerPolicy="no-referrer"
              onError={() => setBackdropFailed(true)}
              className="w-full h-full object-cover object-center opacity-30 select-none"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-white/88 via-white/65 to-sky-50/45" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <div className="text-xs font-semibold tracking-wide text-[#0756B8]">
                Platform Sistem Informasi &amp; Kendali Mutu Laboratorium
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-[#0F2747] leading-[1.15] [text-wrap:balance]">
                {homepage.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-xl">
                {homepage.heroSubtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/kontak"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#0756B8] rounded-lg hover:bg-[#0F2747] transition-colors whitespace-nowrap shrink-0"
                >
                  <span>{homepage.heroPrimaryCta || 'Minta Konsultasi'}</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </Link>
                <Link
                  to="/demo"
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[#0F2747] bg-white/95 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
                >
                  <PlayCircle className="w-4 h-4 text-[#0756B8]" strokeWidth={1.75} />
                  <span>{homepage.heroSecondaryCta || 'Jelajahi Demo'}</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[280px] sm:min-h-[360px] rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                <SafeImage
                  src={homepage.heroImageUrl}
                  alt="Lingkungan laboratorium klinik modern dengan sistem AI Diagno"
                  fallbackLabel="Fasilitas Laboratorium Klinik AI Diagno"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Laboratory Challenges */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F2747]">
              Tantangan Operasional di Laboratorium Klinik
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Ketelitian diagnostik bergantung pada keteraturan alur pra-analitik, kejelasan kendali mutu internal, serta kecepatan validasi hasil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {homepage.challenges.map((item, idx) => (
              <div
                key={item.id}
                className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="text-xs font-mono font-semibold text-[#0756B8] tabular-nums">
                  0{idx + 1}.
                </div>
                <h3 className="text-base font-bold text-[#0F2747]">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. AI Diagno Solutions & 5. Product Showcase */}
      <section className="py-16 lg:py-20 bg-slate-50/70 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F2747]">
                Solusi Terstruktur AI Diagno
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                {homepage.solutionsIntro}
              </p>
            </div>
            <Link
              to="/solusi"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0756B8] hover:text-[#0F2747] whitespace-nowrap shrink-0"
            >
              <span>Lihat Semua Solusi</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            {products.map((product) => {
              const targetHref = routeMap[product.slug] || `/solusi/${product.slug}`;
              return (
                <article
                  key={product.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col"
                >
                  <div className="aspect-[4/3] bg-slate-100 border-b border-slate-200 overflow-hidden">
                    <SafeImage
                      src={product.imageUrl}
                      alt={product.name}
                      fallbackLabel={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 text-[#0756B8] flex items-center justify-center shrink-0">
                          <ProductIcon iconKey={product.iconKey} className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#0F2747]">{product.name}</h3>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 leading-relaxed">{product.summary}</p>

                      <ul className="space-y-2.5 pt-2 border-t border-slate-100">
                        {product.features.slice(0, 4).map((feat) => (
                          <li key={feat.id} className="flex items-start justify-between gap-3 text-xs">
                            <span className="font-medium text-[#0F2747]">{feat.title}</span>
                            <AvailabilityLabel availability={feat.availability} />
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2">
                      <Link
                        to={targetHref}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0756B8] hover:text-[#0F2747]"
                      >
                        <span>Pelajari {product.name}</span>
                        <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Key Differentiators */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F2747]">
                Prinsip Rekayasa &amp; Keunggulan Utama
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Dirancang dengan fokus pada kejelasan status kapabilitas, kepatuhan prosedur kendali mutu, serta kemudahan adopsi tim laboratorium.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {homepage.differentiators.map((diff) => (
                <div
                  key={diff.id}
                  className="p-6 rounded-xl border border-slate-200 bg-white space-y-2.5"
                >
                  <div className="flex items-center gap-2 text-[#16A085]">
                    <CheckCircle2 className="w-4 h-4 shrink-0" strokeWidth={2} />
                    <h3 className="text-base font-bold text-[#0F2747]">{diff.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{diff.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Interactive Product Demo */}
      {homepage.demoEnabled && (
        <section className="py-16 lg:py-20 bg-slate-50/70 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-2xl space-y-2.5">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F2747]">
                  Simulasi Alur Kerja &amp; Quality Intelligence
                </h2>
                <p className="text-sm sm:text-base text-slate-600">
                  Uji langsung pendaftaran pasien, pelacakan barcode, validasi Delta Check, dan grafik Levey-Jennings menggunakan data fiktif terisolasi.
                </p>
              </div>
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#0756B8] bg-white border border-slate-300 rounded-lg hover:bg-slate-50 whitespace-nowrap shrink-0"
              >
                <span>Buka Demo Layar Penuh</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </Link>
            </div>

            <InteractiveLabDemo
              defaultTab={homepage.demoDefaultTab}
              bannerNote={homepage.demoBannerNote}
              compact
            />
          </div>
        </section>
      )}

      {/* 8. Pricing Plans */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl space-y-2.5">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F2747]">
                Struktur Paket Layanan
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Pilihan paket untuk skala klinik hingga rumah sakit. Mendukung langganan bulanan, tahunan, biaya implementasi awal, maupun penawaran kustom.
              </p>
            </div>

            <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
              <button
                type="button"
                onClick={() => setBillingMode('monthly')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  billingMode === 'monthly'
                    ? 'bg-white text-[#0F2747] shadow-sm'
                    : 'text-slate-600 hover:text-[#0F2747]'
                }`}
              >
                Bulanan
              </button>
              <button
                type="button"
                onClick={() => setBillingMode('annual')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  billingMode === 'annual'
                    ? 'bg-white text-[#0F2747] shadow-sm'
                    : 'text-slate-600 hover:text-[#0F2747]'
                }`}
              >
                Tahunan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-stretch">
            {pricingPlans.map((plan) => (
              <PricingFlipCard
                key={plan.id}
                plan={plan}
                billingMode={billingMode}
                headingTag="h3"
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/harga"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0756B8] hover:underline"
            >
              <span>Lihat Matriks Perbandingan Paket Lengkap</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Consultation CTA */}
      <section className="py-16 lg:py-20 bg-[#0F2747] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {homepage.ctaTitle}
          </h2>
          <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {homepage.ctaSubtitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/kontak"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#0F2747] bg-[#38BDF8] rounded-lg hover:bg-white transition-colors"
            >
              <span>Minta Konsultasi Sekarang</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <span>Coba Demo Produk</span>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
