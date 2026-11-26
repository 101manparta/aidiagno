import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, ShieldCheck, TestTubes, Workflow } from 'lucide-react';
import { SafeImage } from '../components/common/SafeImage';
import { PublicLayout } from '../components/layout/PublicLayout';
import { useSiteData } from '../context/SiteDataContext';

export function AboutPage() {
  const { homepage } = useSiteData();

  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-sky-50/60 to-white border-b border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-semibold text-[#0756B8]">Tentang AI Diagno</div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F2747]">
              Membangun Fondasi Teknologi Laboratorium Klinik yang Akurat dan Akuntabel
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              AI Diagno berfokus pada pengembangan Sistem Informasi Laboratorium (LIS), perangkat kendali mutu statistik, dan otomasi alur kerja untuk membantu fasilitas layanan kesehatan menjaga konsistensi hasil diagnostik.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <SafeImage
                src={homepage.heroImageUrl}
                alt="Fasilitas Laboratorium Klinik AI Diagno"
                fallbackLabel="AI Diagno Healthcare Technology"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-xl border border-slate-200 bg-white space-y-3">
            <h2 className="text-xl font-bold text-[#0F2747]">Misi Kami</h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {homepage.aboutMission}
            </p>
          </div>
          <div className="p-8 rounded-xl border border-slate-200 bg-white space-y-3">
            <h2 className="text-xl font-bold text-[#0F2747]">Visi Kami</h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {homepage.aboutVision}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-bold text-[#0F2747]">Fokus Pengembangan Teknologi</h2>
            <p className="text-sm sm:text-base text-slate-600">
              Setiap kapabilitas dikembangkan berdasarkan alur kerja nyata analis teknologi laboratorium medik dan dokter spesialis patologi klinik.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-3">
              <TestTubes className="w-6 h-6 text-[#0756B8]" strokeWidth={1.75} />
              <h3 className="text-base font-bold text-[#0F2747]">Smart LIS</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ketertiban pencatatan pasien, order pemeriksaan, pelacakan barcode, dan laporan hasil.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-3">
              <ShieldCheck className="w-6 h-6 text-[#16A085]" strokeWidth={1.75} />
              <h3 className="text-base font-bold text-[#0F2747]">Quality Intelligence</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Grafik Levey-Jennings, aturan Westgard terkonfigurasi, dan Delta Check untuk kendali mutu.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-3">
              <Workflow className="w-6 h-6 text-[#0756B8]" strokeWidth={1.75} />
              <h3 className="text-base font-bold text-[#0F2747]">Otomasi Alur Kerja</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Notifikasi nilai kritis, analitik waktu tunggu (TAT), dan integrasi alat laboratorium.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-3">
              <BrainCircuit className="w-6 h-6 text-[#0F2747]" strokeWidth={1.75} />
              <h3 className="text-base font-bold text-[#0F2747]">Validasi Ketat</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fitur kecerdasan analitik lanjutan hanya dirilis publik setelah proses validasi teknis selesai.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Link
              to="/kontak"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0756B8] rounded-lg hover:bg-[#0F2747] transition-colors"
            >
              <span>Diskusi dengan Tim Kami</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
