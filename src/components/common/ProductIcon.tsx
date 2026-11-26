import {
  BadgeDollarSign,
  BrainCircuit,
  FileText,
  Images,
  LayoutDashboard,
  Package,
  Settings,
  ShieldCheck,
  TestTubes,
  Users,
  Workflow,
} from 'lucide-react';

interface ProductIconProps {
  iconKey: string;
  className?: string;
  strokeWidth?: number;
}

export function ProductIcon({
  iconKey,
  className = 'w-5 h-5',
  strokeWidth = 1.75,
}: ProductIconProps) {
  switch (iconKey) {
    case 'test-tubes':
      return <TestTubes className={className} strokeWidth={strokeWidth} />;
    case 'shield-check':
      return <ShieldCheck className={className} strokeWidth={strokeWidth} />;
    case 'workflow':
      return <Workflow className={className} strokeWidth={strokeWidth} />;
    case 'brain-circuit':
      return <BrainCircuit className={className} strokeWidth={strokeWidth} />;
    case 'layout-dashboard':
      return <LayoutDashboard className={className} strokeWidth={strokeWidth} />;
    case 'package':
      return <Package className={className} strokeWidth={strokeWidth} />;
    case 'images':
      return <Images className={className} strokeWidth={strokeWidth} />;
    case 'badge-dollar-sign':
      return <BadgeDollarSign className={className} strokeWidth={strokeWidth} />;
    case 'file-text':
      return <FileText className={className} strokeWidth={strokeWidth} />;
    case 'users':
      return <Users className={className} strokeWidth={strokeWidth} />;
    case 'settings':
      return <Settings className={className} strokeWidth={strokeWidth} />;
    default:
      return <TestTubes className={className} strokeWidth={strokeWidth} />;
  }
}
