import { Mail, MapPin, MessageSquare, ShieldCheck } from 'lucide-react';
import { ConsultationForm } from '../components/forms/ConsultationForm';
import { PublicLayout } from '../components/layout/PublicLayout';
import { useSiteData } from '../context/SiteDataContext';

export function ContactPage() {
  const { settings } = useSiteData();
  const hasAnyChannel =
    Boolean(settings.contactEmail) ||
    Boolean(settings.contactWhatsapp) ||
    Boolean(settings.officeAddress);

  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-sky-50/60 to-white border-b border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 max-w-3xl">
          <div className="text-xs font-semibold text-[#0756B8]">Konsultasi &amp; Kontak</div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F2747]">
            Jadwalkan Konsultasi Kebutuhan Laboratorium Anda
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Sampaikan profil fasilitas, kebutuhan modul Smart LIS atau Quality Intelligence, serta rencana integrasi instrumen Anda.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <ConsultationForm />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-xl border border-slate-200 bg-slate-50/70 space-y-4">
              <div className="flex items-center gap-2.5 text-[#0F2747]">
                <ShieldCheck className="w-5 h-5 text-[#16A085]" strokeWidth={1.75} />
                <h2 className="text-lg font-bold">Apa yang Dibahas pada Sesi Konsultasi?</h2>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 leading-relaxed">
                <li>1. Pemetaan alur pra-analitik, analitik, hingga pelaporan di fasilitas Anda.</li>
                <li>2. Peninjauan kesesuaian paket Starter, Professional, atau Enterprise.</li>
                <li>3. Identifikasi kebutuhan integrasi SIMRS dan interfacing analyzer (HL7/ASTM).</li>
                <li>4. Estimasi tahapan implementasi dan pelatihan tim laboratorium.</li>
              </ul>
            </div>

            {hasAnyChannel && (
              <div className="p-6 sm:p-8 rounded-xl border border-slate-200 bg-white space-y-4">
                <h2 className="text-base font-bold text-[#0F2747]">Kanal Kontak Resmi</h2>
                <div className="space-y-3 text-sm text-slate-600">
                  {settings.contactEmail && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-[#0756B8] shrink-0" />
                      <span>{settings.contactEmail}</span>
                    </div>
                  )}
                  {settings.contactWhatsapp && (
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-4 h-4 text-[#0756B8] shrink-0" />
                      <span>{settings.contactWhatsapp}</span>
                    </div>
                  )}
                  {settings.officeAddress && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#0756B8] shrink-0 mt-0.5" />
                      <span>{settings.officeAddress}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
