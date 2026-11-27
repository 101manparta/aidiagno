import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Layers,
  RotateCcw,
  RotateCw,
  ShieldCheck,
} from 'lucide-react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';
import type { PricingPlan } from '../../types/cms';

export interface DeliverableDetail {
  title: string;
  detail: string;
}

const TIER_DELIVERABLES: Record<string, DeliverableDetail[]> = {
  starter: [
    {
      title: 'Alur Pendaftaran & Order Lab',
      detail: 'Registrasi pasien, permintaan pemeriksaan, dan penjadwalan sampel harian.',
    },
    {
      title: 'Pelacakan Barcode Spesimen',
      detail: 'Pelabelan tabung sampel hingga pemantauan status pra-analitik dan analitik.',
    },
    {
      title: 'Laporan Hasil & Rentang Rujukan',
      detail: 'Validasi rentang rujukan otomatis dan cetak laporan hasil pemeriksaan.',
    },
    {
      title: 'Onboarding & Dukungan Awal',
      detail: 'Konfigurasi parameter pemeriksaan dasar dan dukungan teknis operasional.',
    },
  ],
  professional: [
    {
      title: 'Smart LIS + Riwayat Pasien Terpusat',
      detail: 'Akses penuh riwayat pemeriksaan lintas kunjungan untuk mendukung evaluasi klinis.',
    },
    {
      title: 'Levey-Jennings & Aturan Westgard',
      detail: 'Pemantauan IQC harian dengan deteksi tren, pergeseran, dan pelanggaran aturan mutu.',
    },
    {
      title: 'Delta Check & Peringatan Nilai Kritis',
      detail: 'Deteksi anomali selisih hasil historis dan penandaan nilai kritis bagi validator.',
    },
    {
      title: 'Analitik TAT & Opsi Analyzer',
      detail: 'Pemantauan Turnaround Time, beban sampel, dan opsi integrasi instrumen kustom.',
    },
  ],
  enterprise: [
    {
      title: 'Smart LIS, Quality Intelligence & Otomasi',
      detail: 'Orkestrasi alur kerja terpadu untuk rumah sakit dan jaringan laboratorium.',
    },
    {
      title: 'Interfacing SIMRS, HL7 / ASTM',
      detail: 'Integrasi kustom dua arah dengan sistem rumah sakit dan multi-analyzer lab.',
    },
    {
      title: 'RBAC Multi-Peran & Audit Log',
      detail: 'Pengaturan hak akses granular per unit kerja lengkap dengan jejak audit aktivitas.',
    },
    {
      title: 'Migrasi Data, Pelatihan & SLA Khusus',
      detail: 'Pendampingan tim teknis, pelatihan analis, dan komitmen SLA sesuai fasilitas.',
    },
  ],
};

function getDeliverablesForPlan(plan: PricingPlan): DeliverableDetail[] {
  const key = (plan.slug || plan.id || '').toLowerCase();
  if (TIER_DELIVERABLES[key]) {
    return TIER_DELIVERABLES[key];
  }
  return [
    {
      title: 'Konfigurasi Modul Sesuai Kebutuhan',
      detail: 'Penyesuaian alur pendaftaran, order pemeriksaan, dan pelaporan laboratorium.',
    },
    {
      title: 'Pemantauan Mutu & Validasi Hasil',
      detail: 'Dukungan prosedur kendali mutu internal serta validasi berjenjang.',
    },
    {
      title: 'Pendampingan Implementasi',
      detail: 'Pelatihan tim laboratorium dan penyesuaian konfigurasi operasional fasilitas.',
    },
  ];
}

export function formatPricingCurrency(amount: number | null, currency: string): string {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency || 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

interface PricingFlipCardProps {
  plan: PricingPlan;
  billingMode: 'monthly' | 'annual';
  headingTag?: 'h2' | 'h3';
}

export function PricingFlipCard({
  plan,
  billingMode,
  headingTag = 'h3',
}: PricingFlipCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [flipAngle, setFlipAngle] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const skipNextClickRef = useRef(false);

  const isFlipped = Math.abs(Math.round(flipAngle / 180)) % 2 === 1;

  // 3D pointer parallax tilt (smooth spring)
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 210, damping: 24, mass: 0.55 });
  const smoothY = useSpring(pointerY, { stiffness: 210, damping: 24, mass: 0.55 });

  const tiltRotateX = useTransform(smoothY, [-0.5, 0.5], [4.5, -4.5]);
  const tiltRotateY = useTransform(smoothX, [-0.5, 0.5], [-5, 5]);

  // Specular surface sheen tracking pointer position
  const sheenPercentX = useTransform(smoothX, [-0.5, 0.5], [15, 85]);
  const sheenPercentY = useTransform(smoothY, [-0.5, 0.5], [15, 85]);
  const frontSheenBg = useMotionTemplate`radial-gradient(420px circle at ${sheenPercentX}% ${sheenPercentY}%, rgba(56, 189, 248, 0.10), transparent 65%)`;
  const backSheenBg = useMotionTemplate`radial-gradient(420px circle at ${sheenPercentX}% ${sheenPercentY}%, rgba(56, 189, 248, 0.14), transparent 65%)`;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || e.pointerType !== 'mouse' || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(Math.max(-0.5, Math.min(0.5, normX)));
    pointerY.set(Math.max(-0.5, Math.min(0.5, normY)));
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const flipCard = (direction: 'auto' | 'left' | 'right' = 'auto') => {
    if (prefersReducedMotion) {
      setFlipAngle((prev) => (Math.abs(Math.round(prev / 180)) % 2 === 1 ? 0 : 180));
      return;
    }

    setFlipAngle((prev) => {
      const currentlyFlipped = Math.abs(Math.round(prev / 180)) % 2 === 1;
      if (direction === 'left') {
        return currentlyFlipped ? 0 : -180;
      }
      if (direction === 'right') {
        return currentlyFlipped ? 0 : 180;
      }
      return currentlyFlipped ? 0 : 180;
    });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current || e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.35) {
      skipNextClickRef.current = true;
      flipCard(dx < 0 ? 'left' : 'right');
      window.setTimeout(() => {
        skipNextClickRef.current = false;
      }, 250);
    }
  };

  const handleSurfaceClick = () => {
    if (skipNextClickRef.current) return;
    flipCard('auto');
  };

  const activePrice = billingMode === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
  const deliverables = getDeliverablesForPlan(plan);
  const HeadingTag = headingTag;

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="h-full"
      style={{ perspective: 1400 }}
    >
      {/* 3D Pointer Tilt Wrapper */}
      <motion.div
        style={{
          rotateX: prefersReducedMotion ? 0 : tiltRotateX,
          rotateY: prefersReducedMotion ? 0 : tiltRotateY,
          transformStyle: 'preserve-3d',
        }}
        className="h-full"
      >
        {/* 3D Flip Card Body */}
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  rotateY: flipAngle,
                }
          }
          transition={{
            type: 'spring',
            stiffness: 155,
            damping: 22,
            mass: 0.95,
          }}
          style={{ transformStyle: 'preserve-3d' }}
          className="grid h-full"
        >
          {/* ================= FRONT FACE ================= */}
          <div
            onClick={handleSurfaceClick}
            aria-hidden={isFlipped}
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg) translateZ(1px)',
            }}
            className={`col-start-1 row-start-1 relative rounded-xl border p-7 flex flex-col justify-between space-y-6 cursor-pointer transition-opacity ${
              isFlipped
                ? prefersReducedMotion
                  ? 'opacity-0 pointer-events-none'
                  : 'pointer-events-none'
                : 'opacity-100 pointer-events-auto'
            } ${
              plan.highlighted
                ? 'border-[#0756B8] bg-sky-50/40 shadow-sm'
                : 'border-slate-200 bg-white shadow-sm'
            }`}
          >
            {!prefersReducedMotion && (
              <motion.div
                aria-hidden="true"
                style={{ background: frontSheenBg }}
                className="pointer-events-none absolute inset-0 rounded-xl"
              />
            )}

            <div className="relative space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <HeadingTag className="text-xl font-bold text-[#0F2747]">
                    {plan.name}
                  </HeadingTag>
                  <p className="text-xs font-medium text-[#0756B8] mt-1">
                    {plan.targetAudience}
                  </p>
                </div>

                <button
                  type="button"
                  tabIndex={isFlipped ? -1 : 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    flipCard('right');
                  }}
                  aria-label={`Lihat rincian yang didapatkan pada paket ${plan.name}`}
                  className="inline-flex items-center gap-1.5 px-2.5 min-h-[38px] rounded-lg text-xs font-semibold text-[#0756B8] hover:text-[#0F2747] hover:bg-sky-100/70 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0756B8]"
                >
                  <RotateCw className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>Lihat Rincian</span>
                </button>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">{plan.description}</p>

              <div className="py-4 border-y border-slate-200/80 space-y-1">
                {plan.showPrice && !plan.isCustomQuote && activePrice !== null ? (
                  <>
                    <div className="text-2xl font-bold text-[#0F2747] font-mono tabular-nums">
                      {formatPricingCurrency(activePrice, plan.currency)}
                      <span className="text-xs font-sans font-normal text-slate-500 ml-1">
                        /{billingMode === 'monthly' ? 'bulan' : 'tahun'}
                      </span>
                    </div>
                    {plan.implementationFee !== null && (
                      <div className="text-xs text-slate-600 font-mono tabular-nums">
                        Biaya Implementasi Awal:{' '}
                        {formatPricingCurrency(plan.implementationFee, plan.currency)}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-lg font-bold text-[#0F2747]">
                    Penawaran Kustom Sesuai Kebutuhan
                  </div>
                )}
                {plan.billingNote && (
                  <p className="text-xs text-slate-500 pt-1">{plan.billingNote}</p>
                )}
              </div>

              <ul className="space-y-2.5 text-sm">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start justify-between gap-3">
                    <span className="text-slate-500 text-xs">{feat.label}</span>
                    <span className="text-[#0F2747] text-xs font-semibold text-right">
                      {feat.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative space-y-2.5 pt-1">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-500">
                <RotateCw className="w-3 h-3 text-[#0756B8]" strokeWidth={1.75} />
                <span>Klik atau geser kartu untuk lihat rincian yang didapatkan</span>
              </div>

              <Link
                to="/kontak"
                tabIndex={isFlipped ? -1 : 0}
                onClick={(e) => e.stopPropagation()}
                className={`inline-flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0756B8] ${
                  plan.highlighted
                    ? 'bg-[#0756B8] text-white hover:bg-[#0F2747]'
                    : 'bg-white text-[#0F2747] border border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{plan.ctaLabel || 'Minta Penawaran'}</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </Link>
            </div>
          </div>

          {/* ================= BACK FACE ================= */}
          <div
            onClick={handleSurfaceClick}
            aria-hidden={!isFlipped}
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: prefersReducedMotion
                ? 'none'
                : 'rotateY(180deg) translateZ(1px)',
            }}
            className={`col-start-1 row-start-1 relative rounded-xl border p-7 flex flex-col justify-between space-y-5 cursor-pointer text-white transition-opacity ${
              isFlipped
                ? 'opacity-100 pointer-events-auto'
                : prefersReducedMotion
                  ? 'opacity-0 pointer-events-none'
                  : 'pointer-events-none'
            } ${
              plan.highlighted
                ? 'bg-[#0F2747] border-[#38BDF8]/70 shadow-sm'
                : 'bg-[#0F2747] border-slate-700 shadow-sm'
            }`}
          >
            {!prefersReducedMotion && (
              <motion.div
                aria-hidden="true"
                style={{ background: backSheenBg }}
                className="pointer-events-none absolute inset-0 rounded-xl"
              />
            )}

            <div className="relative space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-slate-700/80 pb-3.5">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#38BDF8]">
                    <Layers className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>Yang Anda Dapatkan</span>
                  </div>
                  <div className="text-lg font-bold text-white mt-0.5">
                    Paket {plan.name}
                  </div>
                </div>

                <button
                  type="button"
                  tabIndex={isFlipped ? 0 : -1}
                  onClick={(e) => {
                    e.stopPropagation();
                    flipCard('left');
                  }}
                  aria-label={`Kembali ke ringkasan paket ${plan.name}`}
                  className="inline-flex items-center gap-1.5 px-2.5 min-h-[38px] rounded-lg text-xs font-semibold text-[#38BDF8] hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8]"
                >
                  <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>Ringkasan</span>
                </button>
              </div>

              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-slate-300">
                  Cakupan Modul &amp; Kapabilitas
                </div>
                <ul className="space-y-2">
                  {deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2
                        className="w-4 h-4 text-[#16A085] shrink-0 mt-0.5"
                        strokeWidth={2}
                      />
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-white">
                          {item.title}
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {item.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-700/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#38BDF8]">
                  <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Ringkasan Spesifikasi Teknis</span>
                </div>
                <div className="space-y-1">
                  {plan.features.slice(0, 4).map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 text-[11px]"
                    >
                      <span className="text-slate-300">{feat.label}</span>
                      <span className="font-semibold text-white text-right">
                        {feat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative space-y-2.5 pt-1">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-300">
                <RotateCcw className="w-3 h-3 text-[#38BDF8]" strokeWidth={1.75} />
                <span>Ketuk atau geser kartu untuk kembali ke depan</span>
              </div>

              <Link
                to="/kontak"
                tabIndex={isFlipped ? 0 : -1}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-2.5 text-sm font-semibold rounded-lg bg-[#38BDF8] text-[#0F2747] hover:bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8]"
              >
                <span>{plan.ctaLabel || 'Minta Penawaran'}</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
