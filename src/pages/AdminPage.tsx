import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  BadgeDollarSign,
  BrainCircuit,
  CheckCircle2,
  Database,
  ExternalLink,
  FileText,
  Images,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Users,
} from 'lucide-react';
import { AdminAuthGate } from '../components/admin/AdminAuthGate';
import {
  AdminHomepageEditor,
  AdminPricingEditor,
  AdminProductsEditor,
} from '../components/admin/AdminContentAndCatalog';
import {
  AdminLeadsManager,
  AdminSiteSettings,
} from '../components/admin/AdminLeadsAndSettings';
import {
  AdminArticlesEditor,
  AdminDemoSettings,
  AdminMediaLibrary,
} from '../components/admin/AdminMediaAndArticles';
import { BrandLogo } from '../components/common/BrandLogo';
import { useSiteData } from '../context/SiteDataContext';
import { auth } from '../lib/firebase';
import {
  AdminDashboardBundle,
  checkCurrentUserAdmin,
  deleteArticle,
  deleteMediaAsset,
  deletePricingPlan,
  deleteProduct,
  fetchAdminDashboardData,
  saveHomepageContent,
  saveSiteSettings,
  seedInitialDataToFirestore,
  updateConsultationLead,
  upsertAdminRole,
  upsertArticle,
  upsertMediaAsset,
  upsertPricingPlan,
  upsertProduct,
} from '../services/cmsService';
import { AdminUser } from '../types/cms';

type AdminModule =
  | 'dashboard'
  | 'homepage'
  | 'products'
  | 'pricing'
  | 'media'
  | 'articles'
  | 'demo'
  | 'leads'
  | 'settings';

export function AdminPage() {
  const { refresh: refreshPublicSite, usingSeedFallback } = useSiteData();
  const [authLoading, setAuthLoading] = useState(true);
  const [firebaseEmail, setFirebaseEmail] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [authError, setAuthError] = useState('');

  const [activeModule, setActiveModule] = useState<AdminModule>('dashboard');
  const [bundle, setBundle] = useState<AdminDashboardBundle | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedDoneMsg, setSeedDoneMsg] = useState('');

  const loadAdminBundle = useCallback(async () => {
    setDataLoading(true);
    try {
      const data = await fetchAdminDashboardData();
      setBundle(data);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setAuthError('');
      if (!user) {
        setFirebaseEmail(null);
        setAdminUser(null);
        setBundle(null);
        setAuthLoading(false);
        return;
      }

      setFirebaseEmail(user.email);
      try {
        const verifiedAdmin = await checkCurrentUserAdmin();
        setAdminUser(verifiedAdmin);
        if (verifiedAdmin) {
          await loadAdminBundle();
        }
      } catch (err) {
        setAuthError(
          err instanceof Error ? err.message : 'Gagal memverifikasi otorisasi admin.'
        );
      } finally {
        setAuthLoading(false);
      }
    });
    return () => unsub();
  }, [loadAdminBundle]);

  const syncAll = async () => {
    await loadAdminBundle();
    await refreshPublicSite();
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    setSeedDoneMsg('');
    try {
      await seedInitialDataToFirestore();
      await syncAll();
      setSeedDoneMsg('Data awal AI Diagno berhasil disimpan ke Firestore.');
    } finally {
      setSeeding(false);
    }
  };

  if (authLoading || !adminUser) {
    return (
      <AdminAuthGate
        loading={authLoading}
        firebaseEmail={firebaseEmail}
        adminUser={adminUser}
        authError={authError}
      />
    );
  }

  const newConsultationCount = (bundle?.consultations || []).filter(
    (c) => c.status === 'Baru'
  ).length;

  const navItems: { id: AdminModule; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'homepage', label: 'Konten Beranda', icon: <FileText className="w-4 h-4" /> },
    { id: 'products', label: 'Produk', icon: <Package className="w-4 h-4" /> },
    { id: 'pricing', label: 'Harga', icon: <BadgeDollarSign className="w-4 h-4" /> },
    { id: 'media', label: 'Pustaka Media', icon: <Images className="w-4 h-4" /> },
    { id: 'articles', label: 'Artikel', icon: <FileText className="w-4 h-4" /> },
    { id: 'demo', label: 'Pengaturan Demo', icon: <BrainCircuit className="w-4 h-4" /> },
    {
      id: 'leads',
      label: 'Permintaan Konsultasi',
      icon: <Users className="w-4 h-4" />,
      count: newConsultationCount,
    },
    { id: 'settings', label: 'Pengaturan Situs', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-[#0F2747] text-slate-200 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-5 border-b border-slate-800">
            <BrandLogo brandName="AI Diagno CMS" darkText={false} />
            <div className="mt-3 text-[11px] font-mono text-[#38BDF8]">
              {adminUser.role} · {adminUser.email}
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const active = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-[#0756B8] text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </span>
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span
                      className={`font-mono text-[11px] tabular-nums px-1.5 py-0.5 rounded ${
                        active ? 'bg-white/20 text-white' : 'bg-[#0756B8] text-white'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-200 border border-slate-700 rounded-lg hover:bg-slate-800"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Situs Publik</span>
          </Link>
          <button
            type="button"
            onClick={() => void signOut(auth)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-950/50 rounded-lg"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {dataLoading || !bundle ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-600">
            Memuat data CMS dari Firestore...
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {activeModule === 'dashboard' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h1 className="text-xl font-bold text-[#0F2747]">Dashboard Admin CMS</h1>
                    <p className="text-xs text-slate-500">
                      Ringkasan status konten publik, prospek konsultasi, dan riwayat perubahan.
                    </p>
                  </div>

                  {usingSeedFallback && (
                    <button
                      type="button"
                      disabled={seeding}
                      onClick={() => void handleSeedDatabase()}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#16A085] rounded-lg hover:bg-[#0F2747] disabled:opacity-60"
                    >
                      <Database className="w-4 h-4" />
                      <span>
                        {seeding
                          ? 'Menyimpan Data Awal...'
                          : 'Simpan Data Awal ke Firestore'}
                      </span>
                    </button>
                  )}
                </div>

                {seedDoneMsg && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{seedDoneMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <button
                    type="button"
                    onClick={() => setActiveModule('leads')}
                    className="bg-white border border-slate-200 rounded-xl p-5 space-y-1 text-left hover:border-[#0756B8]/40 transition-colors"
                  >
                    <div className="text-xs font-medium text-slate-500">
                      Permintaan Konsultasi Baru
                    </div>
                    <div className="text-2xl font-bold font-mono tabular-nums text-[#0756B8]">
                      {newConsultationCount}
                    </div>
                    <div className="text-xs text-slate-500 tabular-nums">
                      Total {bundle.consultations.length} permintaan masuk
                    </div>
                  </button>

                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                    <div className="text-xs font-medium text-slate-500">Produk Terbit</div>
                    <div className="text-2xl font-bold font-mono tabular-nums text-[#0F2747]">
                      {bundle.products.filter((p) => p.status === 'published').length}
                    </div>
                    <div className="text-xs text-slate-500">
                      Dari {bundle.products.length} kategori produk
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                    <div className="text-xs font-medium text-slate-500">Paket Harga</div>
                    <div className="text-2xl font-bold font-mono tabular-nums text-[#0F2747]">
                      {bundle.pricingPlans.length}
                    </div>
                    <div className="text-xs text-slate-500">Starter, Professional, Enterprise</div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                    <div className="text-xs font-medium text-slate-500">Artikel Terbit</div>
                    <div className="text-2xl font-bold font-mono tabular-nums text-[#16A085]">
                      {bundle.articles.filter((a) => a.status === 'published').length}
                    </div>
                    <div className="text-xs text-slate-500">
                      Total {bundle.articles.length} artikel di CMS
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                  <h2 className="text-sm font-bold text-[#0F2747]">Aktivitas Perubahan Terakhir</h2>
                  {bundle.auditLogs.length === 0 ? (
                    <p className="text-xs text-slate-500">
                      Belum ada riwayat perubahan di database. Klik &ldquo;Simpan Data Awal ke Firestore&rdquo; atau mulai mengedit modul konten.
                    </p>
                  ) : (
                    <ul className="divide-y divide-slate-100 text-xs">
                      {bundle.auditLogs.slice(0, 6).map((log) => (
                        <li key={log.id} className="py-2.5 flex items-center justify-between gap-4">
                          <span className="text-[#0F2747] font-medium">{log.summary}</span>
                          <span className="font-mono text-slate-400 shrink-0">
                            {log.actorEmail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {activeModule === 'homepage' && (
              <AdminHomepageEditor
                initial={bundle.homepage}
                mediaAssets={bundle.mediaAssets}
                onSave={async (data) => {
                  await saveHomepageContent(data);
                  await syncAll();
                }}
              />
            )}

            {activeModule === 'products' && (
              <AdminProductsEditor
                products={bundle.products}
                mediaAssets={bundle.mediaAssets}
                onSaveProduct={async (prod) => {
                  await upsertProduct(prod);
                  await syncAll();
                }}
                onDeleteProduct={async (id) => {
                  await deleteProduct(id);
                  await syncAll();
                }}
              />
            )}

            {activeModule === 'pricing' && (
              <AdminPricingEditor
                plans={bundle.pricingPlans}
                onSavePlan={async (plan) => {
                  await upsertPricingPlan(plan);
                  await syncAll();
                }}
                onDeletePlan={async (id) => {
                  await deletePricingPlan(id);
                  await syncAll();
                }}
              />
            )}

            {activeModule === 'media' && (
              <AdminMediaLibrary
                assets={bundle.mediaAssets}
                onSaveAsset={async (asset) => {
                  await upsertMediaAsset(asset);
                  await syncAll();
                }}
                onDeleteAsset={async (id) => {
                  await deleteMediaAsset(id);
                  await syncAll();
                }}
              />
            )}

            {activeModule === 'articles' && (
              <AdminArticlesEditor
                articles={bundle.articles}
                mediaAssets={bundle.mediaAssets}
                onSaveArticle={async (art, isNew) => {
                  await upsertArticle(art, isNew);
                  await syncAll();
                }}
                onDeleteArticle={async (id) => {
                  await deleteArticle(id);
                  await syncAll();
                }}
              />
            )}

            {activeModule === 'demo' && (
              <AdminDemoSettings
                homepage={bundle.homepage}
                onSave={async (next) => {
                  await saveHomepageContent(next);
                  await syncAll();
                }}
              />
            )}

            {activeModule === 'leads' && (
              <AdminLeadsManager
                leads={bundle.consultations}
                onUpdateLead={async (leadId, status, notes) => {
                  await updateConsultationLead(leadId, status, notes);
                  await syncAll();
                }}
              />
            )}

            {activeModule === 'settings' && (
              <AdminSiteSettings
                settings={bundle.settings}
                admins={bundle.admins}
                auditLogs={bundle.auditLogs}
                currentUserRole={adminUser.role}
                onSaveSettings={async (next) => {
                  await saveSiteSettings(next);
                  await syncAll();
                }}
                onUpsertAdmin={async (admin) => {
                  await upsertAdminRole(admin);
                  await syncAll();
                }}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
