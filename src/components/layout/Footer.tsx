import { Link } from 'react-router-dom';
import { Mail, MapPin, MessageSquare } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { BrandLogo } from '../common/BrandLogo';

export function Footer() {
  const { settings } = useSiteData();
  const hasContactDetails =
    Boolean(settings.contactEmail) ||
    Boolean(settings.contactWhatsapp) ||
    Boolean(settings.officeAddress);

  return (
    <footer className="bg-[#0F2747] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <BrandLogo brandName={settings.brandName} logoUrl={settings.logoUrl} darkText={false} />
            </Link>
            <p className="text-sm text-slate-300/90 leading-relaxed max-w-sm">
              {settings.footerNote}
            </p>
            {hasContactDetails ? (
              <div className="space-y-2 pt-2 text-xs text-slate-300">
                {settings.contactEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#38BDF8] shrink-0" strokeWidth={1.75} />
                    <span>{settings.contactEmail}</span>
                  </div>
                )}
                {settings.contactWhatsapp && (
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#38BDF8] shrink-0" strokeWidth={1.75} />
                    <span>{settings.contactWhatsapp}</span>
                  </div>
                )}
                {settings.officeAddress && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" strokeWidth={1.75} />
                    <span>{settings.officeAddress}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 pt-1">
                Kanal konsultasi resmi tersedia melalui formulir kontak terintegrasi.
              </p>
            )}
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="text-sm font-semibold text-white">Solusi Platform</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/solusi" className="hover:text-[#38BDF8] transition-colors">
                  Semua Solusi
                </Link>
              </li>
              <li>
                <Link to="/solusi/smart-lis" className="hover:text-[#38BDF8] transition-colors">
                  Smart LIS
                </Link>
              </li>
              <li>
                <Link
                  to="/solusi/quality-intelligence"
                  className="hover:text-[#38BDF8] transition-colors"
                >
                  Quality Intelligence
                </Link>
              </li>
              <li>
                <Link to="/solusi/otomasi-lab" className="hover:text-[#38BDF8] transition-colors">
                  Laboratory Automation
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="text-sm font-semibold text-white">Eksplorasi &amp; Perusahaan</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/demo" className="hover:text-[#38BDF8] transition-colors">
                  Demo Produk Interaktif
                </Link>
              </li>
              <li>
                <Link to="/harga" className="hover:text-[#38BDF8] transition-colors">
                  Paket &amp; Harga
                </Link>
              </li>
              <li>
                <Link to="/wawasan" className="hover:text-[#38BDF8] transition-colors">
                  Wawasan &amp; Artikel
                </Link>
              </li>
              <li>
                <Link to="/tentang" className="hover:text-[#38BDF8] transition-colors">
                  Tentang AI Diagno
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="text-sm font-semibold text-white">Konsultasi</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/kontak" className="hover:text-[#38BDF8] transition-colors">
                  Minta Konsultasi
                </Link>
              </li>
              <li>
                <Link to="/demo" className="hover:text-[#38BDF8] transition-colors">
                  Jelajahi Demo
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} {settings.brandName}. Seluruh hak cipta dilindungi.</p>
          <p>Sistem Informasi Laboratorium &amp; Quality Intelligence</p>
        </div>
      </div>
    </footer>
  );
}
