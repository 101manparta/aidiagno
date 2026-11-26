import { CheckCircle2, Clock3, Wrench } from 'lucide-react';
import { FeatureAvailability } from '../../types/cms';

export function AvailabilityLabel({ availability }: { availability: FeatureAvailability }) {
  if (availability === 'available') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A085] whitespace-nowrap shrink-0">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
        <span>Tersedia</span>
      </span>
    );
  }
  if (availability === 'planned') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 whitespace-nowrap shrink-0">
        <Clock3 className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
        <span>Dalam Pengembangan</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0756B8] whitespace-nowrap shrink-0">
      <Wrench className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
      <span>Integrasi Kustom</span>
    </span>
  );
}
