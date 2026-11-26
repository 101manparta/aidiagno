import { Link } from 'react-router-dom';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { InteractiveLabDemo } from '../components/demo/InteractiveLabDemo';
import { PublicLayout } from '../components/layout/PublicLayout';
import { useSiteData } from '../context/SiteDataContext';

export function DemoPage() {
  const { homepage } = useSiteData();

  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-sky-50/60 to-white border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="text-xs font-semibold text-[#0756B8]">Eksplorasi Produk</div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F2747]">
              Demo Interaktif Smart LIS &amp; Quality Intelligence
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Simulasi langsung alur kerja laboratorium klinik mulai dari registrasi pasien hingga evaluasi aturan Westgard pada grafik Levey-Jennings.
            </p>
          </div>

          <Link
            to="/kontak"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0756B8] rounded-lg hover:bg-[#0F2747] transition-colors whitespace-nowrap shrink-0"
          >
            <span>Jadwalkan Demo Terpandu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {homepage.demoEnabled ? (
            <InteractiveLabDemo
              defaultTab={homepage.demoDefaultTab}
              bannerNote={homepage.demoBannerNote}
            />
          ) : (
            <div className="border border-slate-200 rounded-xl p-10 text-center space-y-4 bg-slate-50">
              <ShieldAlert className="w-8 h-8 text-[#0756B8] mx-auto" strokeWidth={1.75} />
              <h2 className="text-xl font-bold text-[#0F2747]">
                Demo Publik Sedang Dinonaktifkan Sementara
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Anda tetap dapat meminta sesi demo langsung bersama tim teknis kami melalui halaman konsultasi.
              </p>
              <Link
                to="/kontak"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0756B8] rounded-lg hover:bg-[#0F2747]"
              >
                <span>Minta Sesi Demo</span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
