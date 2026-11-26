import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  DEFAULT_ARTICLES,
  DEFAULT_HOMEPAGE_CONTENT,
  DEFAULT_MEDIA_ASSETS,
  DEFAULT_PRICING_PLANS,
  DEFAULT_PRODUCTS,
  DEFAULT_SITE_SETTINGS,
} from '../data/defaultSeed';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  AdminUser,
  Article,
  AuditLog,
  ConsultationLead,
  HomepageContent,
  LeadStatus,
  MediaAsset,
  PricingPlan,
  Product,
  SiteSettings,
} from '../types/cms';

export const BOOTSTRAP_SUPER_ADMIN_EMAIL = 'manparta0101@gmail.com';

export const ALLOWED_FACILITY_TYPES = [
  'Laboratorium Klinik Mandiri',
  'Klinik Pratama / Utama',
  'Rumah Sakit',
  'Jaringan Fasilitas Diagnostik',
  'Unit Laboratorium Khusus',
] as const;

export const ALLOWED_SOLUTIONS = [
  'Smart LIS (Lengkap)',
  'Quality Intelligence (QC & Westgard)',
  'Laboratory Automation & Integrasi Alat',
  'Paket Gabungan Smart LIS + Quality Intelligence',
  'Konsultasi Kebutuhan Kustom / Enterprise',
] as const;

export const LEAD_STATUS_OPTIONS: LeadStatus[] = [
  'Baru',
  'Dihubungi',
  'Konsultasi Terjadwal',
  'Selesai',
  'Ditolak',
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?\d[\d\s-]{7,18}$/;

export function normalizeLeadStatus(raw: string | undefined): LeadStatus {
  switch (raw) {
    case 'Baru':
    case 'new':
      return 'Baru';
    case 'Dihubungi':
    case 'contacted':
      return 'Dihubungi';
    case 'Konsultasi Terjadwal':
    case 'demo_scheduled':
      return 'Konsultasi Terjadwal';
    case 'Selesai':
    case 'closed':
      return 'Selesai';
    case 'Ditolak':
    case 'archived':
      return 'Ditolak';
    default:
      return 'Baru';
  }
}

export function validateConsultationInput(input: {
  fullName: string;
  facilityName: string;
  facilityType: string;
  requiredSolution: string;
  contactChannel: string;
  message?: string;
}): string | null {
  const fullName = input.fullName.trim();
  const facilityName = input.facilityName.trim();
  const facilityType = input.facilityType.trim();
  const requiredSolution = input.requiredSolution.trim();
  const contactChannel = input.contactChannel.trim();
  const message = (input.message || '').trim();

  if (fullName.length < 2 || fullName.length > 120) {
    return 'Nama lengkap wajib diisi (2–120 karakter).';
  }
  if (facilityName.length < 2 || facilityName.length > 160) {
    return 'Nama laboratorium atau klinik wajib diisi (2–160 karakter).';
  }
  if (!ALLOWED_FACILITY_TYPES.includes(facilityType as (typeof ALLOWED_FACILITY_TYPES)[number])) {
    return 'Pilih tipe fasilitas yang valid.';
  }
  if (!ALLOWED_SOLUTIONS.includes(requiredSolution as (typeof ALLOWED_SOLUTIONS)[number])) {
    return 'Pilih solusi yang valid.';
  }
  if (contactChannel.length < 5 || contactChannel.length > 160) {
    return 'Masukkan alamat email atau nomor WhatsApp aktif yang dapat dihubungi.';
  }
  if (!EMAIL_PATTERN.test(contactChannel) && !PHONE_PATTERN.test(contactChannel)) {
    return 'Format kontak harus berupa email valid (contoh: nama@lab.id) atau nomor WhatsApp aktif.';
  }
  if (message.length > 2000) {
    return 'Pesan tambahan maksimal 2000 karakter.';
  }
  return null;
}

export interface PublicSiteBundle {
  settings: SiteSettings;
  homepage: HomepageContent;
  products: Product[];
  pricingPlans: PricingPlan[];
  articles: Article[];
  usingSeedFallback: boolean;
}

export interface AdminDashboardBundle {
  settings: SiteSettings;
  homepage: HomepageContent;
  products: Product[];
  pricingPlans: PricingPlan[];
  articles: Article[];
  mediaAssets: MediaAsset[];
  consultations: ConsultationLead[];
  auditLogs: AuditLog[];
  admins: AdminUser[];
}

function slugifyId(raw: string): string {
  const cleaned = raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return cleaned || `item-${Date.now()}`;
}

export async function recordAuditLog(
  entityType: string,
  entityId: string,
  action: AuditLog['action'],
  summary: string
): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  const path = 'audit_logs';
  try {
    await addDoc(collection(db, path), {
      entityType,
      entityId,
      action,
      summary: summary.slice(0, 300),
      actorEmail: user.email || 'admin',
      actorUid: user.uid,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchPublicSiteData(): Promise<PublicSiteBundle> {
  let usingSeedFallback = false;

  // Settings
  let settings = DEFAULT_SITE_SETTINGS;
  try {
    const settingsSnap = await getDoc(doc(db, 'site_settings', 'global'));
    if (settingsSnap.exists()) {
      settings = { ...DEFAULT_SITE_SETTINGS, ...(settingsSnap.data() as SiteSettings) };
    } else {
      usingSeedFallback = true;
    }
  } catch {
    usingSeedFallback = true;
  }

  // Homepage Content
  let homepage = DEFAULT_HOMEPAGE_CONTENT;
  try {
    const homeSnap = await getDoc(doc(db, 'homepage_content', 'main'));
    if (homeSnap.exists()) {
      const data = homeSnap.data() as HomepageContent;
      if (data.status === 'published') {
        homepage = { ...DEFAULT_HOMEPAGE_CONTENT, ...data };
      }
    } else {
      usingSeedFallback = true;
    }
  } catch {
    usingSeedFallback = true;
  }

  // Products
  let products = DEFAULT_PRODUCTS;
  try {
    const prodQ = query(collection(db, 'products'), where('status', '==', 'published'));
    const prodSnap = await getDocs(prodQ);
    if (!prodSnap.empty) {
      products = prodSnap.docs
        .map((d) => ({ ...(d.data() as Product), id: d.id }))
        .sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
    } else {
      usingSeedFallback = true;
    }
  } catch {
    usingSeedFallback = true;
  }

  // Pricing Plans
  let pricingPlans = DEFAULT_PRICING_PLANS;
  try {
    const priceQ = query(collection(db, 'pricing_plans'), where('status', '==', 'published'));
    const priceSnap = await getDocs(priceQ);
    if (!priceSnap.empty) {
      pricingPlans = priceSnap.docs
        .map((d) => ({ ...(d.data() as PricingPlan), id: d.id }))
        .sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
    } else {
      usingSeedFallback = true;
    }
  } catch {
    usingSeedFallback = true;
  }

  // Articles
  let articles = DEFAULT_ARTICLES;
  try {
    const artQ = query(collection(db, 'articles'), where('status', '==', 'published'));
    const artSnap = await getDocs(artQ);
    if (!artSnap.empty) {
      articles = artSnap.docs
        .map((d) => ({ ...(d.data() as Article), id: d.id }))
        .sort((a, b) => (b.publishedDate || '').localeCompare(a.publishedDate || ''));
    } else {
      usingSeedFallback = true;
    }
  } catch {
    usingSeedFallback = true;
  }

  return {
    settings,
    homepage,
    products,
    pricingPlans,
    articles,
    usingSeedFallback,
  };
}

export async function submitConsultationLead(input: {
  fullName: string;
  facilityName: string;
  facilityType: string;
  requiredSolution: string;
  contactChannel: string;
  message?: string;
}): Promise<string> {
  const validationError = validateConsultationInput(input);
  if (validationError) {
    throw new Error(validationError);
  }

  const path = 'consultation_leads';
  try {
    const payload: Record<string, unknown> = {
      fullName: input.fullName.trim().slice(0, 120),
      facilityName: input.facilityName.trim().slice(0, 160),
      facilityType: input.facilityType.trim().slice(0, 80),
      requiredSolution: input.requiredSolution.trim().slice(0, 120),
      contactChannel: input.contactChannel.trim().slice(0, 160),
      status: 'Baru',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    if (input.message && input.message.trim()) {
      payload.message = input.message.trim().slice(0, 2000);
    }
    const docRef = await addDoc(collection(db, path), payload);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function checkCurrentUserAdmin(): Promise<AdminUser | null> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return null;

  if (user.email === BOOTSTRAP_SUPER_ADMIN_EMAIL) {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'Super Admin',
      role: 'SUPER_ADMIN',
    };
  }

  const path = `admins/${user.uid}`;
  try {
    const snap = await getDoc(doc(db, 'admins', user.uid));
    if (!snap.exists()) return null;
    return snap.data() as AdminUser;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function fetchAdminDashboardData(): Promise<AdminDashboardBundle> {
  const safeGet = async <T>(col: string): Promise<(T & { id: string })[]> => {
    try {
      const snap = await getDocs(collection(db, col));
      return snap.docs.map((d) => ({ ...(d.data() as T), id: d.id }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, col);
    }
  };

  let settings = DEFAULT_SITE_SETTINGS;
  try {
    const snap = await getDoc(doc(db, 'site_settings', 'global'));
    if (snap.exists()) settings = { ...DEFAULT_SITE_SETTINGS, ...(snap.data() as SiteSettings) };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'site_settings/global');
  }

  let homepage = DEFAULT_HOMEPAGE_CONTENT;
  try {
    const snap = await getDoc(doc(db, 'homepage_content', 'main'));
    if (snap.exists()) homepage = { ...DEFAULT_HOMEPAGE_CONTENT, ...(snap.data() as HomepageContent) };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'homepage_content/main');
  }

  const [
    productsRaw,
    plansRaw,
    articlesRaw,
    mediaAssets,
    primaryLeadsRaw,
    legacyLeadsRaw,
    auditLogsRaw,
    admins,
  ] = await Promise.all([
    safeGet<Product>('products'),
    safeGet<PricingPlan>('pricing_plans'),
    safeGet<Article>('articles'),
    safeGet<MediaAsset>('media_assets'),
    safeGet<ConsultationLead>('consultation_leads'),
    (async (): Promise<(ConsultationLead & { id: string })[]> => {
      try {
        const snap = await getDocs(collection(db, 'consultations'));
        return snap.docs.map((d) => ({ ...(d.data() as ConsultationLead), id: d.id }));
      } catch {
        return [];
      }
    })(),
    (async () => {
      try {
        const q = query(collection(db, 'audit_logs'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        return snap.docs.map((d) => ({ ...(d.data() as AuditLog), id: d.id }));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'audit_logs');
      }
    })(),
    safeGet<AdminUser>('admins'),
  ]);

  const seenLeadIds = new Set<string>();
  const combinedLeads: ConsultationLead[] = [...primaryLeadsRaw, ...legacyLeadsRaw]
    .filter((lead) => {
      if (seenLeadIds.has(lead.id)) return false;
      seenLeadIds.add(lead.id);
      return true;
    })
    .map((lead) => ({
      ...lead,
      status: normalizeLeadStatus(lead.status),
    }))
    .sort((a, b) => {
      const aSec = (a.createdAt as { seconds?: number })?.seconds ?? 0;
      const bSec = (b.createdAt as { seconds?: number })?.seconds ?? 0;
      return bSec - aSec;
    });

  return {
    settings,
    homepage,
    products: (productsRaw.length ? productsRaw : DEFAULT_PRODUCTS).sort(
      (a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99)
    ),
    pricingPlans: (plansRaw.length ? plansRaw : DEFAULT_PRICING_PLANS).sort(
      (a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99)
    ),
    articles: (articlesRaw.length ? articlesRaw : DEFAULT_ARTICLES).sort((a, b) =>
      (b.publishedDate || '').localeCompare(a.publishedDate || '')
    ),
    mediaAssets: mediaAssets.length ? mediaAssets : DEFAULT_MEDIA_ASSETS,
    consultations: combinedLeads,
    auditLogs: auditLogsRaw,
    admins,
  };
}

export async function seedInitialDataToFirestore(): Promise<void> {
  const actor = auth.currentUser?.email || BOOTSTRAP_SUPER_ADMIN_EMAIL;

  try {
    await setDoc(doc(db, 'site_settings', 'global'), {
      ...DEFAULT_SITE_SETTINGS,
      updatedBy: actor,
      updatedAt: serverTimestamp(),
    });

    await setDoc(doc(db, 'homepage_content', 'main'), {
      ...DEFAULT_HOMEPAGE_CONTENT,
      updatedBy: actor,
      updatedAt: serverTimestamp(),
    });

    for (const product of DEFAULT_PRODUCTS) {
      const { id, ...rest } = product;
      await setDoc(doc(db, 'products', id), {
        ...rest,
        updatedBy: actor,
        updatedAt: serverTimestamp(),
      });
    }

    for (const plan of DEFAULT_PRICING_PLANS) {
      const { id, ...rest } = plan;
      await setDoc(doc(db, 'pricing_plans', id), {
        ...rest,
        updatedBy: actor,
        updatedAt: serverTimestamp(),
      });
    }

    for (const article of DEFAULT_ARTICLES) {
      const { id, ...rest } = article;
      await setDoc(doc(db, 'articles', id), {
        ...rest,
        updatedBy: actor,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    for (const asset of DEFAULT_MEDIA_ASSETS) {
      const { id, ...rest } = asset;
      await setDoc(doc(db, 'media_assets', id), {
        ...rest,
        updatedBy: actor,
        createdAt: serverTimestamp(),
      });
    }

    await recordAuditLog('system', 'seed', 'create', 'Inisialisasi konten awal AI Diagno ke Firestore');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'seed_initial_data');
  }
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  const actor = auth.currentUser?.email || 'admin';
  const path = 'site_settings/global';
  try {
    await setDoc(doc(db, 'site_settings', 'global'), {
      brandName: settings.brandName.trim(),
      logoUrl: settings.logoUrl.trim(),
      contactEmail: settings.contactEmail.trim(),
      contactWhatsapp: settings.contactWhatsapp.trim(),
      officeAddress: settings.officeAddress.trim(),
      seoTitle: settings.seoTitle.trim(),
      seoDescription: settings.seoDescription.trim(),
      footerNote: settings.footerNote.trim(),
      updatedBy: actor,
      updatedAt: serverTimestamp(),
    });
    await recordAuditLog('site_settings', 'global', 'update', 'Memperbarui pengaturan situs dan SEO');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveHomepageContent(content: HomepageContent): Promise<void> {
  const actor = auth.currentUser?.email || 'admin';
  const path = 'homepage_content/main';
  try {
    await setDoc(doc(db, 'homepage_content', 'main'), {
      status: content.status,
      heroTitle: content.heroTitle.trim(),
      heroSubtitle: content.heroSubtitle.trim(),
      heroPrimaryCta: content.heroPrimaryCta.trim(),
      heroSecondaryCta: content.heroSecondaryCta.trim(),
      heroImageUrl: content.heroImageUrl.trim(),
      challenges: content.challenges.slice(0, 8),
      solutionsIntro: content.solutionsIntro.trim(),
      differentiators: content.differentiators.slice(0, 8),
      ctaTitle: content.ctaTitle.trim(),
      ctaSubtitle: content.ctaSubtitle.trim(),
      aboutMission: content.aboutMission.trim(),
      aboutVision: content.aboutVision.trim(),
      demoEnabled: content.demoEnabled,
      demoDefaultTab: content.demoDefaultTab,
      demoBannerNote: content.demoBannerNote.trim(),
      updatedBy: actor,
      updatedAt: serverTimestamp(),
    });
    await recordAuditLog(
      'homepage_content',
      'main',
      content.status === 'published' ? 'publish' : 'update',
      `Menyimpan konten beranda & pengaturan demo (${content.status})`
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function upsertProduct(product: Product): Promise<void> {
  const actor = auth.currentUser?.email || 'admin';
  const docId = slugifyId(product.id || product.slug);
  const path = `products/${docId}`;
  try {
    await setDoc(doc(db, 'products', docId), {
      slug: docId,
      name: product.name.trim(),
      tagline: product.tagline.trim(),
      summary: product.summary.trim(),
      iconKey: product.iconKey,
      imageUrl: product.imageUrl.trim(),
      sortOrder: Number(product.sortOrder) || 1,
      status: product.status,
      features: product.features.slice(0, 20),
      updatedBy: actor,
      updatedAt: serverTimestamp(),
    });
    await recordAuditLog(
      'product',
      docId,
      product.status === 'published' ? 'publish' : 'update',
      `Memperbarui produk ${product.name} (${product.status})`
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));
    await recordAuditLog('product', productId, 'delete', `Menghapus produk ${productId}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function upsertPricingPlan(plan: PricingPlan): Promise<void> {
  const actor = auth.currentUser?.email || 'admin';
  const docId = slugifyId(plan.id || plan.slug);
  const path = `pricing_plans/${docId}`;
  try {
    await setDoc(doc(db, 'pricing_plans', docId), {
      slug: docId,
      name: plan.name.trim(),
      targetAudience: plan.targetAudience.trim(),
      description: plan.description.trim(),
      showPrice: Boolean(plan.showPrice),
      isCustomQuote: Boolean(plan.isCustomQuote),
      currency: plan.currency.trim() || 'IDR',
      monthlyPrice: plan.monthlyPrice === null || Number.isNaN(plan.monthlyPrice) ? null : Number(plan.monthlyPrice),
      annualPrice: plan.annualPrice === null || Number.isNaN(plan.annualPrice) ? null : Number(plan.annualPrice),
      implementationFee:
        plan.implementationFee === null || Number.isNaN(plan.implementationFee)
          ? null
          : Number(plan.implementationFee),
      billingNote: plan.billingNote.trim(),
      ctaLabel: plan.ctaLabel.trim(),
      highlighted: Boolean(plan.highlighted),
      sortOrder: Number(plan.sortOrder) || 1,
      status: plan.status,
      features: plan.features.slice(0, 20),
      updatedBy: actor,
      updatedAt: serverTimestamp(),
    });
    await recordAuditLog(
      'pricing_plan',
      docId,
      plan.status === 'published' ? 'publish' : 'update',
      `Memperbarui paket harga ${plan.name} (${plan.status})`
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deletePricingPlan(planId: string): Promise<void> {
  const path = `pricing_plans/${planId}`;
  try {
    await deleteDoc(doc(db, 'pricing_plans', planId));
    await recordAuditLog('pricing_plan', planId, 'delete', `Menghapus paket harga ${planId}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function upsertArticle(article: Article, isNew: boolean): Promise<string> {
  const actor = auth.currentUser?.email || 'admin';
  const docId = slugifyId(article.id || article.slug || article.title);
  const path = `articles/${docId}`;
  try {
    const existingSnap = await getDoc(doc(db, 'articles', docId));
    const baseData = {
      slug: docId,
      title: article.title.trim(),
      category: article.category.trim(),
      excerpt: article.excerpt.trim(),
      content: article.content.trim(),
      coverImageUrl: article.coverImageUrl.trim(),
      authorName: article.authorName.trim(),
      readMinutes: Number(article.readMinutes) || 4,
      status: article.status,
      publishedDate: article.publishedDate || new Date().toISOString().slice(0, 10),
      updatedBy: actor,
      updatedAt: serverTimestamp(),
    };

    if (existingSnap.exists() && !isNew) {
      await updateDoc(doc(db, 'articles', docId), baseData);
    } else {
      await setDoc(doc(db, 'articles', docId), {
        ...baseData,
        createdAt: existingSnap.exists() ? existingSnap.data().createdAt : serverTimestamp(),
      });
    }

    await recordAuditLog(
      'article',
      docId,
      article.status === 'published' ? 'publish' : article.status === 'archived' ? 'archive' : 'update',
      `${isNew ? 'Membuat' : 'Memperbarui'} artikel "${article.title}" (${article.status})`
    );
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteArticle(articleId: string): Promise<void> {
  const path = `articles/${articleId}`;
  try {
    await deleteDoc(doc(db, 'articles', articleId));
    await recordAuditLog('article', articleId, 'delete', `Menghapus artikel ${articleId}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function upsertMediaAsset(asset: MediaAsset): Promise<string> {
  const actor = auth.currentUser?.email || 'admin';
  const docId = slugifyId(asset.id || asset.title);
  const path = `media_assets/${docId}`;
  try {
    const existingSnap = await getDoc(doc(db, 'media_assets', docId));
    await setDoc(doc(db, 'media_assets', docId), {
      title: asset.title.trim(),
      altText: asset.altText.trim(),
      url: asset.url.trim(),
      category: asset.category.trim() || 'Umum',
      updatedBy: actor,
      createdAt: existingSnap.exists() ? existingSnap.data().createdAt : serverTimestamp(),
    });
    await recordAuditLog('media_asset', docId, 'create', `Menyimpan aset media "${asset.title}"`);
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteMediaAsset(assetId: string): Promise<void> {
  const path = `media_assets/${assetId}`;
  try {
    await deleteDoc(doc(db, 'media_assets', assetId));
    await recordAuditLog('media_asset', assetId, 'delete', `Menghapus aset media ${assetId}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function updateConsultationLead(
  leadId: string,
  status: LeadStatus,
  adminNotes: string
): Promise<void> {
  if (!LEAD_STATUS_OPTIONS.includes(status)) {
    throw new Error('Status permintaan konsultasi tidak valid.');
  }

  const cleanNotes = adminNotes.trim().slice(0, 2000);
  const primaryRef = doc(db, 'consultation_leads', leadId);
  const primaryPath = `consultation_leads/${leadId}`;

  try {
    const primarySnap = await getDoc(primaryRef);
    const targetRef = primarySnap.exists() ? primaryRef : doc(db, 'consultations', leadId);
    const targetPath = primarySnap.exists() ? primaryPath : `consultations/${leadId}`;

    try {
      await updateDoc(targetRef, {
        status,
        adminNotes: cleanNotes,
        updatedAt: serverTimestamp(),
      });
      await recordAuditLog(
        'consultation_lead',
        leadId,
        'update',
        `Mengubah status permintaan konsultasi menjadi ${status}`
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, targetPath);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, primaryPath);
  }
}

export async function upsertAdminRole(admin: {
  uid: string;
  email: string;
  displayName: string;
  role: AdminUser['role'];
}): Promise<void> {
  const path = `admins/${admin.uid}`;
  try {
    const existingSnap = await getDoc(doc(db, 'admins', admin.uid));
    await setDoc(doc(db, 'admins', admin.uid), {
      uid: admin.uid.trim(),
      email: admin.email.trim(),
      displayName: admin.displayName.trim(),
      role: admin.role,
      createdAt: existingSnap.exists() ? existingSnap.data().createdAt : serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await recordAuditLog('admin', admin.uid, 'update', `Mengatur peran ${admin.email} sebagai ${admin.role}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
