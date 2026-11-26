import React, { useState } from 'react';
import {
  CheckCircle2,
  Eye,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  Article,
  ContentStatus,
  HomepageContent,
  MediaAsset,
} from '../../types/cms';
import { SafeImage } from '../common/SafeImage';

interface MediaManagerProps {
  assets: MediaAsset[];
  onSaveAsset: (asset: MediaAsset) => Promise<void>;
  onDeleteAsset: (id: string) => Promise<void>;
}

async function compressImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca berkas gambar.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Format gambar tidak valid.'));
      img.onload = () => {
        const maxDim = 1200;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas tidak tersedia.'));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL('image/jpeg', 0.8);
        if (compressed.length > 680000) {
          reject(new Error('Ukuran gambar terlalu besar setelah kompresi. Gunakan gambar lebih kecil.'));
          return;
        }
        resolve(compressed);
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function AdminMediaLibrary({
  assets,
  onSaveAsset,
  onDeleteAsset,
}: MediaManagerProps) {
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [category, setCategory] = useState('Produk');
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [notice, setNotice] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');
    setUploading(true);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      setUrl(dataUrl);
      if (!title) setTitle(file.name.replace(/\.[^.]+$/, ''));
      if (!altText) setAltText(file.name.replace(/\.[^.]+$/, ''));
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal memproses gambar.');
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setNotice('');
    if (!title.trim() || !url.trim()) {
      setErrorMsg('Judul aset dan URL atau unggahan gambar wajib diisi.');
      return;
    }
    setUploading(true);
    try {
      await onSaveAsset({
        id: `media-${Date.now()}`,
        title: title.trim(),
        altText: altText.trim() || title.trim(),
        url: url.trim(),
        category,
        updatedBy: 'admin',
      });
      setTitle('');
      setAltText('');
      setUrl('');
      setNotice('Aset media berhasil disimpan ke pustaka.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-lg font-bold text-[#0F2747]">Pustaka Media</h2>
        <p className="text-xs text-slate-500">
          Unggah gambar baru atau daftarkan URL media untuk digunakan pada halaman beranda, produk, dan artikel.
        </p>
      </div>

      <form
        onSubmit={handleAdd}
        className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
      >
        <h3 className="text-sm font-bold text-[#0F2747]">Tambah / Unggah Aset Gambar</h3>
        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
            {errorMsg}
          </div>
        )}
        {notice && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Judul Media</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Ruang Analitik Hematologi"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Teks Alternatif (Alt)</label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Deskripsi visual untuk aksesibilitas"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
            >
              <option value="Hero & Fasilitas">Hero &amp; Fasilitas</option>
              <option value="Produk">Produk</option>
              <option value="Artikel">Artikel</option>
              <option value="Identitas Brand">Identitas Brand</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              URL Gambar (atau unggah file di samping)
            </label>
            <input
              type="text"
              value={url.startsWith('data:') ? '[Gambar terkompresi siap disimpan]' : url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://... atau /src/assets/..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#0F2747] bg-slate-100 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-200">
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Memproses...' : 'Pilih Berkas Gambar'}</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              type="submit"
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0756B8] rounded-lg hover:bg-[#0F2747] disabled:opacity-60"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan ke Pustaka</span>
            </button>
          </div>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between"
          >
            <div className="aspect-[16/10] bg-slate-100 border-b border-slate-200 overflow-hidden">
              <SafeImage
                src={asset.url}
                alt={asset.altText}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-[#0F2747]">{asset.title}</div>
                  <div className="text-xs text-slate-500">{asset.category}</div>
                </div>
                <button
                  type="button"
                  onClick={() => void onDeleteAsset(asset.id)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                  title="Hapus Aset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-[11px] font-mono text-slate-400 truncate">
                {asset.url.startsWith('data:') ? 'Gambar Tersimpan (Base64 Terkompresi)' : asset.url}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ArticlesEditorProps {
  articles: Article[];
  mediaAssets: MediaAsset[];
  onSaveArticle: (article: Article, isNew: boolean) => Promise<void>;
  onDeleteArticle: (id: string) => Promise<void>;
}

export function AdminArticlesEditor({
  articles,
  mediaAssets,
  onSaveArticle,
  onDeleteArticle,
}: ArticlesEditorProps) {
  const [selectedId, setSelectedId] = useState<string>(articles[0]?.id || '');
  const [isNew, setIsNew] = useState(false);
  const current = articles.find((a) => a.id === selectedId) || articles[0];
  const [draft, setDraft] = useState<Article | null>(current || null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleSelect = (a: Article) => {
    setIsNew(false);
    setSelectedId(a.id);
    setDraft({ ...a });
    setNotice('');
  };

  const handleCreateNew = () => {
    const slug = `artikel-baru-${Date.now()}`;
    const fresh: Article = {
      id: slug,
      slug,
      title: 'Judul Artikel Baru',
      category: 'Kendali Mutu',
      excerpt: 'Ringkasan singkat isi artikel.',
      content: 'Tulis isi lengkap artikel di sini.',
      coverImageUrl: mediaAssets[0]?.url || '',
      authorName: 'Tim Editorial AI Diagno',
      readMinutes: 4,
      status: 'draft',
      publishedDate: new Date().toISOString().slice(0, 10),
      updatedBy: 'admin',
    };
    setIsNew(true);
    setSelectedId(fresh.id);
    setDraft(fresh);
    setNotice('');
  };

  const handleSave = async (overrideStatus?: ContentStatus) => {
    if (!draft) return;
    setSaving(true);
    setNotice('');
    try {
      const payload = overrideStatus ? { ...draft, status: overrideStatus } : draft;
      setDraft(payload);
      await onSaveArticle(payload, isNew);
      setIsNew(false);
      setNotice(`Artikel "${payload.title}" disimpan (${payload.status}).`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#0F2747]">Manajemen Artikel &amp; Wawasan</h2>
          <p className="text-xs text-slate-500">
            Buat, pratinjau, terbitkan, arsipkan, atau hapus artikel edukasi laboratorium.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreateNew}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0756B8] rounded-lg hover:bg-[#0F2747]"
        >
          <Plus className="w-4 h-4" />
          <span>Artikel Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-2.5">
          {articles.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => handleSelect(a)}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                draft?.id === a.id
                  ? 'border-[#0756B8] bg-sky-50/40'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 mb-1">
                <span>{a.category}</span>
                <span className="font-mono uppercase">{a.status}</span>
              </div>
              <div className="text-sm font-bold text-[#0F2747] line-clamp-2">{a.title}</div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-8">
          {draft && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              {notice && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{notice}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Judul Artikel</label>
                  <input
                    type="text"
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Slug URL</label>
                  <input
                    type="text"
                    value={draft.slug}
                    onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Kategori</label>
                  <input
                    type="text"
                    value={draft.category}
                    onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Tanggal Terbit</label>
                  <input
                    type="date"
                    value={draft.publishedDate}
                    onChange={(e) => setDraft({ ...draft, publishedDate: e.target.value })}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Penulis</label>
                  <input
                    type="text"
                    value={draft.authorName}
                    onChange={(e) => setDraft({ ...draft, authorName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Gambar Sampul</label>
                  <select
                    value={draft.coverImageUrl}
                    onChange={(e) => setDraft({ ...draft, coverImageUrl: e.target.value })}
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

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Ringkasan (Excerpt)</label>
                <textarea
                  rows={2}
                  value={draft.excerpt}
                  onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Konten Artikel</label>
                <textarea
                  rows={8}
                  value={draft.content}
                  onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => void onDeleteArticle(draft.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0F2747] border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Pratinjau</span>
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void handleSave('archived')}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                  >
                    Arsipkan
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void handleSave('published')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0756B8] rounded-lg hover:bg-[#0F2747] disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Menyimpan...' : 'Terbitkan Artikel'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {previewOpen && draft && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-[#0756B8]">Pratinjau Artikel</span>
              <button type="button" onClick={() => setPreviewOpen(false)}>
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="text-xs text-slate-500">
              {draft.category} · {draft.publishedDate} · {draft.authorName}
            </div>
            <h3 className="text-2xl font-bold text-[#0F2747]">{draft.title}</h3>
            <p className="text-sm text-slate-600">{draft.excerpt}</p>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line border-t border-slate-100 pt-4">
              {draft.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface DemoSettingsProps {
  homepage: HomepageContent;
  onSave: (next: HomepageContent) => Promise<void>;
}

export function AdminDemoSettings({ homepage, onSave }: DemoSettingsProps) {
  const [demoEnabled, setDemoEnabled] = useState(homepage.demoEnabled);
  const [demoDefaultTab, setDemoDefaultTab] = useState(homepage.demoDefaultTab);
  const [demoBannerNote, setDemoBannerNote] = useState(homepage.demoBannerNote);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice('');
    try {
      await onSave({
        ...homepage,
        demoEnabled,
        demoDefaultTab,
        demoBannerNote,
      });
      setNotice('Pengaturan demo produk publik berhasil disimpan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-lg font-bold text-[#0F2747]">Pengaturan Demo Produk Publik</h2>
        <p className="text-xs text-slate-500">
          Kontrol ketersediaan lingkungan simulasi publik, tab awal, serta catatan isolasi data.
        </p>
      </div>

      {notice && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <label className="flex items-center gap-3 text-sm font-semibold text-[#0F2747]">
          <input
            type="checkbox"
            checked={demoEnabled}
            onChange={(e) => setDemoEnabled(e.target.checked)}
          />
          <span>Aktifkan Demo Produk Interaktif di Halaman Publik &amp; Beranda</span>
        </label>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">Tab Awal Demo</label>
          <select
            value={demoDefaultTab}
            onChange={(e) => setDemoDefaultTab(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
          >
            <option value="registration">1. Pendaftaran Pasien</option>
            <option value="orders">2. Order Pemeriksaan</option>
            <option value="tracking">3. Pelacakan Sampel</option>
            <option value="results">4. Entri &amp; Validasi Hasil</option>
            <option value="qc">5. Dashboard QC &amp; Levey-Jennings</option>
            <option value="ai_qi">6. Contoh AI Quality Intelligence</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Catatan Banner Isolasi Simulasi
          </label>
          <textarea
            rows={2}
            value={demoBannerNote}
            onChange={(e) => setDemoBannerNote(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#0756B8] rounded-lg hover:bg-[#0F2747] disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Menyimpan...' : 'Simpan Pengaturan Demo'}</span>
        </button>
      </div>
    </form>
  );
}
