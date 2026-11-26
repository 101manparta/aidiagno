export type ContentStatus = 'draft' | 'published' | 'archived';

export type FeatureAvailability = 'available' | 'planned' | 'custom_integration';

export type LeadStatus =
  | 'Baru'
  | 'Dihubungi'
  | 'Konsultasi Terjadwal'
  | 'Selesai'
  | 'Ditolak';

export type AdminRole = 'SUPER_ADMIN' | 'EDITOR';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: AdminRole;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface SiteSettings {
  brandName: string;
  logoUrl: string;
  contactEmail: string;
  contactWhatsapp: string;
  officeAddress: string;
  seoTitle: string;
  seoDescription: string;
  footerNote: string;
  updatedAt?: unknown;
  updatedBy: string;
}

export interface ChallengeItem {
  id: string;
  title: string;
  description: string;
}

export interface DifferentiatorItem {
  id: string;
  title: string;
  description: string;
}

export interface HomepageContent {
  status: 'draft' | 'published';
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroImageUrl: string;
  challenges: ChallengeItem[];
  solutionsIntro: string;
  differentiators: DifferentiatorItem[];
  ctaTitle: string;
  ctaSubtitle: string;
  aboutMission: string;
  aboutVision: string;
  demoEnabled: boolean;
  demoDefaultTab: string;
  demoBannerNote: string;
  updatedAt?: unknown;
  updatedBy: string;
}

export interface ProductFeature {
  id: string;
  title: string;
  description: string;
  availability: FeatureAvailability;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  iconKey: string;
  imageUrl: string;
  sortOrder: number;
  status: ContentStatus;
  features: ProductFeature[];
  updatedAt?: unknown;
  updatedBy: string;
}

export interface PricingFeatureItem {
  label: string;
  value: string;
}

export interface PricingPlan {
  id: string;
  slug: string;
  name: string;
  targetAudience: string;
  description: string;
  showPrice: boolean;
  isCustomQuote: boolean;
  currency: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  implementationFee: number | null;
  billingNote: string;
  ctaLabel: string;
  highlighted: boolean;
  sortOrder: number;
  status: ContentStatus;
  features: PricingFeatureItem[];
  updatedAt?: unknown;
  updatedBy: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  authorName: string;
  readMinutes: number;
  status: ContentStatus;
  publishedDate: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  updatedBy: string;
}

export interface MediaAsset {
  id: string;
  title: string;
  altText: string;
  url: string;
  category: string;
  createdAt?: unknown;
  updatedBy: string;
}

export interface ConsultationLead {
  id: string;
  fullName: string;
  facilityName: string;
  facilityType: string;
  requiredSolution: string;
  contactChannel: string;
  message?: string;
  status: LeadStatus;
  adminNotes?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'publish' | 'archive' | 'delete';
  summary: string;
  actorEmail: string;
  actorUid: string;
  createdAt?: unknown;
}
