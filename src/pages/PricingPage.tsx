import { useState } from 'react';
import { PublicLayout } from '../components/layout/PublicLayout';
import { PricingFlipCard } from '../components/pricing/PricingFlipCard';
import { useSiteData } from '../context/SiteDataContext';

export function PricingPage() {
  const { pricingPlans } = useSiteData();
  const [billingMode, setBillingMode] = useState<'monthly' | 'annual'>('monthly');

  const allLabels = Array.from(
    new Set(pricingPlans.flatMap((p) => p.features.map((f) => f.label)))
  );

  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-sky-50/60 to-white border-b border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs font-semibold text-[#0756B8]">Skema Paket &amp; Implementasi</div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F2747]">
              Paket Layanan yang Fleksibel untuk Skala Fasilitas Anda
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Pilih kategori Starter, Professional, atau Enterprise dengan opsi langganan bulanan, tahunan, biaya implementasi satu kali, atau penawaran kustom.
            </p>
          </div>

          <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
            <button
              type="button"
              onClick={() => setBillingMode('monthly')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
                billingMode === 'monthly'
                  ? 'bg-white text-[#0F2747] shadow-sm'
                  : 'text-slate-600 hover:text-[#0F2747]'
              }`}
            >
              Langganan Bulanan
            </button>
            <button
              type="button"
              onClick={() => setBillingMode('annual')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
                billingMode === 'annual'
                  ? 'bg-white text-[#0F2747] shadow-sm'
                  : 'text-slate-600 hover:text-[#0F2747]'
              }`}
            >
              Langganan Tahunan
            </button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-stretch">
            {pricingPlans.map((plan) => (
              <PricingFlipCard
                key={plan.id}
                plan={plan}
                billingMode={billingMode}
                headingTag="h2"
              />
            ))}
          </div>

          {/* Comparison Matrix */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#0F2747]">Matriks Perbandingan Paket</h2>
            <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Komponen</th>
                    {pricingPlans.map((p) => (
                      <th key={p.id} className="py-3.5 px-4 font-bold text-[#0F2747]">
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allLabels.map((label) => (
                    <tr key={label} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-4 font-medium text-slate-700">{label}</td>
                      {pricingPlans.map((p) => {
                        const found = p.features.find((f) => f.label === label);
                        return (
                          <td key={p.id} className="py-3.5 px-4 text-xs font-medium text-[#0F2747]">
                            {found ? found.value : '—'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
