import React, { useState } from 'react';
import {
  CheckCircle2,
  Eye,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import {
  ContentStatus,
  FeatureAvailability,
  HomepageContent,
  MediaAsset,
  PricingPlan,
  Product,
} from '../../types/cms';
import { AvailabilityLabel } from '../common/AvailabilityLabel';
import { SafeImage } from '../common/SafeImage';

interface HomepageEditorProps {
  initial: HomepageContent;
  mediaAssets: MediaAsset[];
  onSave: (data: HomepageContent) => Promise<void>;
}

export function AdminHomepageEditor({ initial, mediaAssets, onSave }: HomepageEditorProps) {
  const [form, setForm] = useState<HomepageContent>(initial);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleSave = async (nextStatus?: 'draft' | 'published') => {
    setSaving(true);
    setSavedMsg('');
    try {
      const payload = nextStatus ? { ...form, status: nextStatus } : form;
      setForm(payload);
      await onSave(payload);
      setSavedMsg(
        payload.status === 'published'
          ? 'Konten beranda berhasil diterbitkan ke situs publik.'
          : 'Konten beranda disimpan sebagai draf.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#0F2747]">Konten Beranda &amp; Tentang</h2>
          <p className="text-xs text-slate-500">
            Status saat ini:{' '}
            <span className="font-semibold text-[#0F2747]">
              {form.status === 'published' ? 'Diterbitkan (Published)' : 'Draf (Draft)'}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0F2747] bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            <Eye className="w-4 h-4" />
            <span>Pratinjau</span>
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSave('draft')}
            className="px-3.5 py-2 text-xs font-semibold text-[#0F2747] bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-60"
          >
            Simpan Draf
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSave('published')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0756B8] rounded-lg hover:bg-[#0F2747] disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Terbitkan Perubahan'}</span>
          </button>
        </div>
      </div>

      {savedMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{savedMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#0F2747]">Bagian Hero &amp; CTA</h3>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Judul Utama Hero</label>
            <input
              type="text"
              maxLength={180}
              value={form.heroTitle}
              onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Subjudul Hero</label>
            <textarea
              rows={3}
              maxLength={500}
              value={form.heroSubtitle}
              onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Teks CTA Utama</label>
              <input
                type="text"
                maxLength={60}
                value={form.heroPrimaryCta}
                onChange={(e) => setForm({ ...form, heroPrimaryCta: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Teks CTA Sekunder</label>
              <input
                type="text"
                maxLength={60}
                value={form.heroSecondaryCta}
                onChange={(e) => setForm({ ...form, heroSecondaryCta: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Gambar Hero</label>
            <select
              value={form.heroImageUrl}
              onChange={(e) => setForm({ ...form, heroImageUrl: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
            >
              {mediaAssets.map((m) => (
                <option key={m.id} value={m.url}>
                  {m.title} ({m.category})
                </option>
              ))}
              {!mediaAssets.some((m) => m.url === form.heroImageUrl) && (
                <option value={form.heroImageUrl}>URL Kustom Saat Ini</option>
              )}
            </select>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#0F2747]">Ringkasan Solusi, CTA Bawah &amp; Tentang</h3>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Pengantar Solusi</label>
            <textarea
              rows={2}
              maxLength={400}
              value={form.solutionsIntro}
              onChange={(e) => setForm({ ...form, solutionsIntro: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Judul Banner CTA Konsultasi</label>
            <input
              type="text"
              maxLength={180}
              value={form.ctaTitle}
              onChange={(e) => setForm({ ...form, ctaTitle: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Subjudul Banner CTA</label>
            <textarea
              rows={2}
              maxLength={400}
              value={form.ctaSubtitle}
              onChange={(e) => setForm({ ...form, ctaSubtitle: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Misi (Halaman Tentang)</label>
              <textarea
                rows={3}
                maxLength={1000}
                value={form.aboutMission}
                onChange={(e) => setForm({ ...form, aboutMission: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Visi (Halaman Tentang)</label>
              <textarea
                rows={3}
                maxLength={1000}
                value={form.aboutVision}
                onChange={(e) => setForm({ ...form, aboutVision: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Challenges & Differentiators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0F2747]">Tantangan Laboratorium</h3>
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  challenges: [
                    ...form.challenges,
                    { id: `ch-${Date.now()}`, title: 'Tantangan Baru', description: '' },
                  ].slice(0, 8),
                })
              }
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0756B8]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah</span>
            </button>
          </div>
          <div className="space-y-3">
            {form.challenges.map((c, idx) => (
              <div key={c.id} className="p-3 border border-slate-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={c.title}
                    onChange={(e) => {
                      const next = [...form.challenges];
                      next[idx] = { ...c, title: e.target.value };
                      setForm({ ...form, challenges: next });
                    }}
                    className="flex-1 px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        challenges: form.challenges.filter((_, i) => i !== idx),
                      })
                    }
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={c.description}
                  onChange={(e) => {
                    const next = [...form.challenges];
                    next[idx] = { ...c, description: e.target.value };
                    setForm({ ...form, challenges: next });
                  }}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0F2747]">Keunggulan Utama</h3>
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  differentiators: [
                    ...form.differentiators,
                    { id: `diff-${Date.now()}`, title: 'Keunggulan Baru', description: '' },
                  ].slice(0, 8),
                })
              }
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0756B8]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah</span>
            </button>
          </div>
          <div className="space-y-3">
            {form.differentiators.map((d, idx) => (
              <div key={d.id} className="p-3 border border-slate-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={d.title}
                    onChange={(e) => {
                      const next = [...form.differentiators];
                      next[idx] = { ...d, title: e.target.value };
                      setForm({ ...form, differentiators: next });
                    }}
                    className="flex-1 px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        differentiators: form.differentiators.filter((_, i) => i !== idx),
                      })
                    }
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={d.description}
                  onChange={(e) => {
                    const next = [...form.differentiators];
                    next[idx] = { ...d, description: e.target.value };
                    setForm({ ...form, differentiators: next });
                  }}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h4 className="text-sm font-bold text-[#0F2747]">Pratinjau Konten Beranda</h4>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="p-1.5 text-slate-500 hover:text-[#0F2747]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-[#0F2747]">{form.heroTitle}</h2>
                <p className="text-sm text-slate-600">{form.heroSubtitle}</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-4 py-2 text-xs font-semibold text-white bg-[#0756B8] rounded-lg">
                    {form.heroPrimaryCta}
                  </span>
                  <span className="px-4 py-2 text-xs font-semibold text-[#0F2747] border border-slate-300 rounded-lg">
                    {form.heroSecondaryCta}
                  </span>
                </div>
              </div>
              <div className="aspect-[16/10] rounded-lg overflow-hidden border border-slate-200">
                <SafeImage src={form.heroImageUrl} alt="Pratinjau Hero" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ProductsEditorProps {
  products: Product[];
  mediaAssets: MediaAsset[];
  onSaveProduct: (product: Product) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
}

export function AdminProductsEditor({
  products,
  mediaAssets,
  onSaveProduct,
  onDeleteProduct,
}: ProductsEditorProps) {
  const [selectedId, setSelectedId] = useState<string>(products[0]?.id || '');
  const current = products.find((p) => p.id === selectedId) || products[0];
  const [draft, setDraft] = useState<Product | null>(current || null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  const selectProduct = (p: Product) => {
    setSelectedId(p.id);
    setDraft(JSON.parse(JSON.stringify(p)) as Product);
    setNotice('');
  };

  const handleCreateNew = () => {
    const fresh: Product = {
      id: `produk-${Date.now()}`,
      slug: `produk-${Date.now()}`,
      name: 'Modul Baru',
      tagline: 'Deskripsi singkat kapabilitas modul',
      summary: 'Ringkasan manfaat operasional untuk laboratorium klinik.',
      iconKey: 'test-tubes',
      imageUrl: mediaAssets[0]?.url || '',
      sortOrder: products.length + 1,
      status: 'draft',
      features: [],
      updatedBy: 'admin',
    };
    setSelectedId(fresh.id);
    setDraft(fresh);
    setNotice('');
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    setNotice('');
    try {
      await onSaveProduct(draft);
      setNotice(`Produk "${draft.name}" berhasil disimpan.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#0F2747]">Manajemen Produk &amp; Kesiapan Fitur</h2>
          <p className="text-xs text-slate-500">
            Kelola kategori produk Smart LIS, Quality Intelligence, Laboratory Automation, dan status fitur.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreateNew}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0756B8] rounded-lg hover:bg-[#0F2747]"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-2.5">
          {products.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => selectProduct(p)}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                draft?.id === p.id
                  ? 'border-[#0756B8] bg-sky-50/40'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-[#0F2747]">{p.name}</span>
                <span className="text-[11px] font-mono text-slate-500 uppercase">{p.status}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.tagline}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-8">
          {draft ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              {notice && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{notice}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Nama Produk</label>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Status Publikasi</label>
                  <select
                    value={draft.status}
                    onChange={(e) =>
                      setDraft({ ...draft, status: e.target.value as ContentStatus })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="published">Published (Terbit)</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived (Arsip)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Tagline</label>
                <input
                  type="text"
                  value={draft.tagline}
                  onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Ringkasan</label>
                <textarea
                  rows={3}
                  value={draft.summary}
                  onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Ikon Lucide</label>
                  <select
                    value={draft.iconKey}
                    onChange={(e) => setDraft({ ...draft, iconKey: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="test-tubes">test-tubes (Smart LIS)</option>
                    <option value="shield-check">shield-check (Quality Intelligence)</option>
                    <option value="workflow">workflow (Automation)</option>
                    <option value="brain-circuit">brain-circuit (AI Intelligence)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Gambar Produk</label>
                  <select
                    value={draft.imageUrl}
                    onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {mediaAssets.map((m) => (
                      <option key={m.id} value={m.url}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#0F2747]">Daftar Fitur &amp; Ketersediaan</h4>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        features: [
                          ...draft.features,
                          {
                            id: `feat-${Date.now()}`,
                            title: 'Fitur Baru',
                            description: '',
                            availability: 'available' as FeatureAvailability,
                          },
                        ].slice(0, 20),
                      })
                    }
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0756B8]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Fitur</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {draft.features.map((feat, idx) => (
                    <div key={feat.id} className="p-3.5 border border-slate-200 rounded-lg space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          value={feat.title}
                          onChange={(e) => {
                            const next = [...draft.features];
                            next[idx] = { ...feat, title: e.target.value };
                            setDraft({ ...draft, features: next });
                          }}
                          className="flex-1 min-w-[180px] px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded"
                        />
                        <select
                          value={feat.availability}
                          onChange={(e) => {
                            const next = [...draft.features];
                            next[idx] = {
                              ...feat,
                              availability: e.target.value as FeatureAvailability,
                            };
                            setDraft({ ...draft, features: next });
                          }}
                          className="px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white"
                        >
                          <option value="available">Tersedia</option>
                          <option value="custom_integration">Integrasi Kustom</option>
                          <option value="planned">Dalam Pengembangan</option>
                        </select>
                        <AvailabilityLabel availability={feat.availability} />
                        <button
                          type="button"
                          onClick={() =>
                            setDraft({
                              ...draft,
                              features: draft.features.filter((_, i) => i !== idx),
                            })
                          }
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={feat.description}
                        placeholder="Deskripsi singkat fitur..."
                        onChange={(e) => {
                          const next = [...draft.features];
                          next[idx] = { ...feat, description: e.target.value };
                          setDraft({ ...draft, features: next });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => void onDeleteProduct(draft.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Produk</span>
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void handleSave()}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#0756B8] rounded-lg hover:bg-[#0F2747] disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Menyimpan...' : 'Simpan Produk'}</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

interface PricingEditorProps {
  plans: PricingPlan[];
  onSavePlan: (plan: PricingPlan) => Promise<void>;
  onDeletePlan: (id: string) => Promise<void>;
}

export function AdminPricingEditor({
  plans,
  onSavePlan,
  onDeletePlan,
}: PricingEditorProps) {
  const [selectedId, setSelectedId] = useState<string>(plans[0]?.id || '');
  const current = plans.find((p) => p.id === selectedId) || plans[0];
  const [draft, setDraft] = useState<PricingPlan | null>(current || null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  const selectPlan = (p: PricingPlan) => {
    setSelectedId(p.id);
    setDraft(JSON.parse(JSON.stringify(p)) as PricingPlan);
    setNotice('');
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    setNotice('');
    try {
      await onSavePlan(draft);
      setNotice(`Paket "${draft.name}" berhasil diperbarui.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-lg font-bold text-[#0F2747]">Manajemen Paket &amp; Harga</h2>
        <p className="text-xs text-slate-500">
          Atur visibilitas nominal, mata uang, tarif bulanan/tahunan, biaya implementasi, dan status penawaran kustom.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-2.5">
          {plans.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => selectPlan(p)}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                draft?.id === p.id
                  ? 'border-[#0756B8] bg-sky-50/40'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-[#0F2747]">{p.name}</span>
                <span className="text-[11px] font-mono text-slate-500 uppercase">{p.status}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {p.showPrice && !p.isCustomQuote ? 'Harga Ditampilkan' : 'Penawaran Kustom'}
              </p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-8">
          {draft && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              {notice && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{notice}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Nama Paket</label>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Mata Uang</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={draft.currency}
                    onChange={(e) => setDraft({ ...draft, currency: e.target.value })}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Status</label>
                  <select
                    value={draft.status}
                    onChange={(e) =>
                      setDraft({ ...draft, status: e.target.value as ContentStatus })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Target Fasilitas</label>
                <input
                  type="text"
                  value={draft.targetAudience}
                  onChange={(e) => setDraft({ ...draft, targetAudience: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Deskripsi Paket</label>
                <textarea
                  rows={2}
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <label className="inline-flex items-center gap-2 font-semibold text-[#0F2747]">
                  <input
                    type="checkbox"
                    checked={draft.showPrice}
                    onChange={(e) => setDraft({ ...draft, showPrice: e.target.checked })}
                  />
                  <span>Tampilkan Nominal Harga di Publik</span>
                </label>
                <label className="inline-flex items-center gap-2 font-semibold text-[#0F2747]">
                  <input
                    type="checkbox"
                    checked={draft.isCustomQuote}
                    onChange={(e) => setDraft({ ...draft, isCustomQuote: e.target.checked })}
                  />
                  <span>Status Penawaran Kustom</span>
                </label>
                <label className="inline-flex items-center gap-2 font-semibold text-[#0F2747]">
                  <input
                    type="checkbox"
                    checked={draft.highlighted}
                    onChange={(e) => setDraft({ ...draft, highlighted: e.target.checked })}
                  />
                  <span>Sorot Paket</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Harga Bulanan
                  </label>
                  <input
                    type="number"
                    value={draft.monthlyPrice ?? ''}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        monthlyPrice: e.target.value === '' ? null : Number(e.target.value),
                      })
                    }
                    placeholder="Kosongkan jika kustom"
                    className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Harga Tahunan
                  </label>
                  <input
                    type="number"
                    value={draft.annualPrice ?? ''}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        annualPrice: e.target.value === '' ? null : Number(e.target.value),
                      })
                    }
                    placeholder="Kosongkan jika kustom"
                    className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Biaya Implementasi Satu Kali
                  </label>
                  <input
                    type="number"
                    value={draft.implementationFee ?? ''}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        implementationFee:
                          e.target.value === '' ? null : Number(e.target.value),
                      })
                    }
                    placeholder="Opsional"
                    className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Catatan Penagihan</label>
                  <input
                    type="text"
                    value={draft.billingNote}
                    onChange={(e) => setDraft({ ...draft, billingNote: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Label Tombol CTA</label>
                  <input
                    type="text"
                    value={draft.ctaLabel}
                    onChange={(e) => setDraft({ ...draft, ctaLabel: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#0F2747]">Baris Fitur Perbandingan</h4>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        features: [...draft.features, { label: 'Komponen Baru', value: '-' }].slice(
                          0,
                          20
                        ),
                      })
                    }
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0756B8]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Baris</span>
                  </button>
                </div>

                {draft.features.map((f, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <input
                      type="text"
                      value={f.label}
                      onChange={(e) => {
                        const next = [...draft.features];
                        next[idx] = { ...f, label: e.target.value };
                        setDraft({ ...draft, features: next });
                      }}
                      className="col-span-5 px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                    />
                    <input
                      type="text"
                      value={f.value}
                      onChange={(e) => {
                        const next = [...draft.features];
                        next[idx] = { ...f, value: e.target.value };
                        setDraft({ ...draft, features: next });
                      }}
                      className="col-span-6 px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          features: draft.features.filter((_, i) => i !== idx),
                        })
                      }
                      className="col-span-1 p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => void onDeletePlan(draft.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Paket</span>
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void handleSave()}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#0756B8] rounded-lg hover:bg-[#0F2747] disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Menyimpan...' : 'Simpan Paket Harga'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
