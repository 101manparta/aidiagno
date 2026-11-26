import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AvailabilityLabel } from '../components/common/AvailabilityLabel';
import { ProductIcon } from '../components/common/ProductIcon';
import { SafeImage } from '../components/common/SafeImage';
import { PublicLayout } from '../components/layout/PublicLayout';
import { useSiteData } from '../context/SiteDataContext';

export function ProductDetailPage({ productSlug }: { productSlug: string }) {
  const { products } = useSiteData();
  const product = products.find((p) => p.slug === productSlug) || products[0];

  const available = product.features.filter((f) => f.availability === 'available');
  const custom = product.features.filter((f) => f.availability === 'custom_integration');
  const planned = product.features.filter((f) => f.availability === 'planned');

  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-sky-50/60 to-white border-b border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/solusi"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0756B8] hover:underline mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Semua Solusi</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
              <div className="inline-flex items-center gap-2.5 text-sm font-semibold text-[#0756B8]">
                <ProductIcon iconKey={product.iconKey} className="w-5 h-5" />
                <span>Modul Platform AI Diagno</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F2747]">
                {product.name}
              </h1>
              <p className="text-lg font-medium text-[#0756B8]">{product.tagline}</p>
              <p className="text-base text-slate-600 leading-relaxed">{product.summary}</p>
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/kontak"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0756B8] rounded-lg hover:bg-[#0F2747] transition-colors"
                >
                  <span>Konsultasi {product.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/demo"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#0F2747] border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <span>Uji di Demo Produk</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="h-full min-h-[260px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <SafeImage
                  src={product.imageUrl}
                  alt={product.name}
                  fallbackLabel={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#0F2747]">Rincian Kapabilitas &amp; Status Kesiapan</h2>
            <p className="text-sm text-slate-600">
              AI Diagno membedakan secara terbuka antara fitur yang tersedia langsung, fitur yang memerlukan integrasi kustom, dan fitur dalam pengembangan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.features.map((feat) => (
              <div
                key={feat.id}
                className="p-6 rounded-xl border border-slate-200 bg-white flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-[#0F2747]">{feat.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feat.description}</p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <AvailabilityLabel availability={feat.availability} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-200 text-sm">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-mono text-xl font-bold text-[#16A085] tabular-nums">
                {available.length} Fitur
              </div>
              <div className="font-semibold text-[#0F2747]">Siap Digunakan (Tersedia)</div>
              <p className="text-xs text-slate-600">
                Dapat langsung diaktifkan pada proses implementasi standar.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-mono text-xl font-bold text-[#0756B8] tabular-nums">
                {custom.length} Fitur
              </div>
              <div className="font-semibold text-[#0F2747]">Memerlukan Integrasi Kustom</div>
              <p className="text-xs text-slate-600">
                Menyesuaikan spesifikasi alat analyzer atau SIMRS fasilitas Anda.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-mono text-xl font-bold text-amber-700 tabular-nums">
                {planned.length} Fitur
              </div>
              <div className="font-semibold text-[#0F2747]">Dalam Pengembangan</div>
              <p className="text-xs text-slate-600">
                Tidak diklaim aktif sebelum lolos validasi klinis dan teknis.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
