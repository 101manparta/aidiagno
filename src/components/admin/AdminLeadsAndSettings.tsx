import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Plus, Save, Search } from 'lucide-react';
import { LEAD_STATUS_OPTIONS } from '../../services/cmsService';
import {
  AdminRole,
  AdminUser,
  AuditLog,
  ConsultationLead,
  LeadStatus,
  SiteSettings,
} from '../../types/cms';

interface LeadsManagerProps {
  leads: ConsultationLead[];
  onUpdateLead: (leadId: string, status: LeadStatus, notes: string) => Promise<void>;
}

const LEAD_STATUS_STYLE: Record<LeadStatus, string> = {
  Baru: 'text-[#0756B8]',
  Dihubungi: 'text-sky-700',
  'Konsultasi Terjadwal': 'text-[#16A085]',
  Selesai: 'text-emerald-700',
  Ditolak: 'text-rose-700',
};

function formatLeadDate(raw: unknown): string {
  if (!raw) return '—';
  let date: Date | null = null;
  if (typeof raw === 'object' && raw !== null && 'seconds' in raw) {
    const secs = (raw as { seconds?: number }).seconds;
    if (typeof secs === 'number') date = new Date(secs * 1000);
  } else if (typeof raw === 'string' || typeof raw === 'number') {
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) date = parsed;
  }
  if (!date) return '—';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function AdminLeadsManager({ leads, onUpdateLead }: LeadsManagerProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | LeadStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(leads[0]?.id || null);
  const [notes, setNotes] = useState(leads[0]?.adminNotes || '');
  const [status, setStatus] = useState<LeadStatus>(leads[0]?.status || 'Baru');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [errorNotice, setErrorNotice] = useState('');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return leads.filter((lead) => {
      if (filterStatus !== 'all' && lead.status !== filterStatus) return false;
      if (!q) return true;
      return (
        lead.fullName.toLowerCase().includes(q) ||
        lead.facilityName.toLowerCase().includes(q) ||
        lead.facilityType.toLowerCase().includes(q) ||
        lead.requiredSolution.toLowerCase().includes(q) ||
        lead.contactChannel.toLowerCase().includes(q) ||
        (lead.message || '').toLowerCase().includes(q)
      );
    });
  }, [filterStatus, leads, searchQuery]);

  const selectedLead = useMemo(
    () => leads.find((l) => l.id === selectedLeadId) || filtered[0] || null,
    [filtered, leads, selectedLeadId]
  );

  useEffect(() => {
    if (selectedLead) {
      setStatus(selectedLead.status);
      setNotes(selectedLead.adminNotes || '');
    }
  }, [selectedLead]);

  const newLeadsCount = useMemo(
    () => leads.filter((l) => l.status === 'Baru').length,
    [leads]
  );

  const handleSelect = (lead: ConsultationLead) => {
    setSelectedLeadId(lead.id);
    setStatus(lead.status);
    setNotes(lead.adminNotes || '');
    setNotice('');
    setErrorNotice('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    setSaving(true);
    setNotice('');
    setErrorNotice('');
    try {
      await onUpdateLead(selectedLead.id, status, notes);
      setNotice('Status dan catatan tindak lanjut berhasil disimpan.');
    } catch {
      setErrorNotice('Gagal memperbarui status permintaan konsultasi. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-[#0F2747]">Permintaan Konsultasi</h2>
          <p className="text-xs text-slate-500 tabular-nums">
            Total {leads.length} permintaan tercatat · {newLeadsCount} berstatus Baru
          </p>
        </div>

        <div className="relative w-full lg:w-80">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            strokeWidth={1.75}
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, fasilitas, solusi, atau kontak..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0756B8]"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit max-w-full">
        {(['all', ...LEAD_STATUS_OPTIONS] as const).map((st) => {
          const count =
            st === 'all' ? leads.length : leads.filter((l) => l.status === st).length;
          return (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                filterStatus === st
                  ? 'bg-white text-[#0F2747] shadow-sm'
                  : 'text-slate-600 hover:text-[#0F2747]'
              }`}
            >
              {st === 'all' ? `Semua (${count})` : `${st} (${count})`}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-500">
          {leads.length === 0
            ? 'Belum ada permintaan konsultasi yang masuk dari formulir publik.'
            : 'Tidak ada permintaan konsultasi yang cocok dengan filter atau pencarian saat ini.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7 overflow-x-auto bg-white border border-slate-200 rounded-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
                <tr>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">Tanggal</th>
                  <th className="py-3 px-4 font-semibold">Nama &amp; Fasilitas</th>
                  <th className="py-3 px-4 font-semibold">Solusi</th>
                  <th className="py-3 px-4 font-semibold">Kontak</th>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => handleSelect(lead)}
                    className={`cursor-pointer transition-colors ${
                      selectedLead?.id === lead.id ? 'bg-sky-50/70' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-xs text-slate-500 whitespace-nowrap tabular-nums">
                      {formatLeadDate(lead.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#0F2747]">{lead.fullName}</div>
                      <div className="text-xs text-slate-500">
                        {lead.facilityName} · {lead.facilityType}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">{lead.requiredSolution}</td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-700 break-all">
                      {lead.contactChannel}
                    </td>
                    <td
                      className={`py-3 px-4 text-xs font-semibold whitespace-nowrap ${
                        LEAD_STATUS_STYLE[lead.status]
                      }`}
                    >
                      {lead.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="xl:col-span-5">
            {selectedLead && (
              <form
                onSubmit={handleSave}
                className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-[#0F2747]">
                    Detail Pesan &amp; Tindak Lanjut
                  </h3>
                  <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                    {formatLeadDate(selectedLead.createdAt)}
                  </span>
                </div>

                {notice && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{notice}</span>
                  </div>
                )}

                {errorNotice && (
                  <div
                    role="alert"
                    className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorNotice}</span>
                  </div>
                )}

                <div className="text-xs space-y-2 border-b border-slate-100 pb-4 text-slate-600">
                  <div>
                    <span className="font-semibold text-[#0F2747]">Nama Pemohon:</span>{' '}
                    {selectedLead.fullName}
                  </div>
                  <div>
                    <span className="font-semibold text-[#0F2747]">Fasilitas:</span>{' '}
                    {selectedLead.facilityName} ({selectedLead.facilityType})
                  </div>
                  <div>
                    <span className="font-semibold text-[#0F2747]">Kontak:</span>{' '}
                    <span className="font-mono text-[#0756B8]">{selectedLead.contactChannel}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#0F2747]">Solusi Dibutuhkan:</span>{' '}
                    {selectedLead.requiredSolution}
                  </div>
                  <div className="pt-2">
                    <span className="block font-semibold text-[#0F2747] mb-1">Detail Pesan:</span>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {selectedLead.message?.trim()
                        ? selectedLead.message
                        : 'Tidak ada pesan tambahan yang disertakan pemohon.'}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="lead-status-select"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Status Permintaan
                  </label>
                  <select
                    id="lead-status-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as LeadStatus)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0756B8]"
                  >
                    {LEAD_STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="lead-internal-notes"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Catatan Tindak Lanjut Internal
                  </label>
                  <textarea
                    id="lead-internal-notes"
                    rows={3}
                    maxLength={2000}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Catat hasil kontak awal, jadwal demo, atau kebutuhan integrasi..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0756B8]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0756B8] rounded-lg hover:bg-[#0F2747] disabled:opacity-60 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface SiteSettingsProps {
  settings: SiteSettings;
  admins: AdminUser[];
  auditLogs: AuditLog[];
  currentUserRole: AdminRole;
  onSaveSettings: (next: SiteSettings) => Promise<void>;
  onUpsertAdmin: (admin: {
    uid: string;
    email: string;
    displayName: string;
    role: AdminRole;
  }) => Promise<void>;
}

export function AdminSiteSettings({
  settings,
  admins,
  auditLogs,
  currentUserRole,
  onSaveSettings,
  onUpsertAdmin,
}: SiteSettingsProps) {
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  // Role management state
  const [newUid, setNewUid] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDisplay, setNewDisplay] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('EDITOR');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice('');
    try {
      await onSaveSettings(form);
      setNotice('Pengaturan situs dan metadata SEO berhasil diperbarui.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUid.trim() || !newEmail.trim()) return;
    await onUpsertAdmin({
      uid: newUid.trim(),
      email: newEmail.trim(),
      displayName: newDisplay.trim() || newEmail.trim(),
      role: newRole,
    });
    setNewUid('');
    setNewEmail('');
    setNewDisplay('');
    setNotice('Peran administrator baru berhasil disimpan.');
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-lg font-bold text-[#0F2747]">Pengaturan Situs, Kontak, SEO &amp; Riwayat</h2>
        <p className="text-xs text-slate-500">
          Konfigurasi identitas situs, kontak resmi yang ditampilkan ke publik, hak akses admin, dan log perubahan.
        </p>
      </div>

      {notice && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="bg-white border border-slate-200 rounded-xl p-6 space-y-5"
      >
        <h3 className="text-sm font-bold text-[#0F2747]">Identitas, Kontak &amp; SEO</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Nama Brand</label>
            <input
              type="text"
              value={form.brandName}
              onChange={(e) => setForm({ ...form, brandName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">URL Logo</label>
            <input
              type="text"
              value={form.logoUrl}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Email Kontak Resmi</label>
            <input
              type="email"
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              placeholder="Kosongkan jika hanya memakai formulir"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">WhatsApp Bisnis</label>
            <input
              type="text"
              value={form.contactWhatsapp}
              onChange={(e) => setForm({ ...form, contactWhatsapp: e.target.value })}
              placeholder="Kosongkan jika belum dipublikasikan"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">Alamat Kantor / Operasional</label>
          <input
            type="text"
            value={form.officeAddress}
            onChange={(e) => setForm({ ...form, officeAddress: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">SEO Title</label>
          <input
            type="text"
            maxLength={120}
            value={form.seoTitle}
            onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">SEO Meta Description</label>
          <textarea
            rows={2}
            maxLength={320}
            value={form.seoDescription}
            onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#0756B8] rounded-lg hover:bg-[#0F2747] disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Menyimpan...' : 'Simpan Pengaturan Situs'}</span>
        </button>
      </form>

      {currentUserRole === 'SUPER_ADMIN' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#0F2747]">Kontrol Akses Berbasis Peran (RBAC)</h3>
          <form onSubmit={handleAddAdmin} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              value={newUid}
              onChange={(e) => setNewUid(e.target.value)}
              placeholder="Firebase User UID"
              className="px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg"
            />
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email Google Terverifikasi"
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              value={newDisplay}
              onChange={(e) => setNewDisplay(e.target.value)}
              placeholder="Nama Lengkap"
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
            <div className="flex gap-2">
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as AdminRole)}
                className="flex-1 px-2.5 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="EDITOR">EDITOR</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              </select>
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-white bg-[#0756B8] rounded-lg hover:bg-[#0F2747]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Simpan</span>
              </button>
            </div>
          </form>

          {admins.length > 0 && (
            <div className="text-xs divide-y divide-slate-100 border border-slate-200 rounded-lg">
              {admins.map((a) => (
                <div key={a.uid} className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#0F2747]">{a.displayName}</span>{' '}
                    <span className="text-slate-500">({a.email})</span>
                  </div>
                  <span className="font-mono font-semibold text-[#0756B8]">{a.role}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content Change History */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#0F2747]">Riwayat Perubahan Konten</h3>
        {auditLogs.length === 0 ? (
          <p className="text-xs text-slate-500">Belum ada catatan perubahan tercatat.</p>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Entitas</th>
                  <th className="py-2.5 px-3 font-semibold">Aksi</th>
                  <th className="py-2.5 px-3 font-semibold">Ringkasan</th>
                  <th className="py-2.5 px-3 font-semibold">Aktor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.slice(0, 25).map((log) => (
                  <tr key={log.id}>
                    <td className="py-2.5 px-3 font-mono text-[#0756B8]">
                      {log.entityType}/{log.entityId}
                    </td>
                    <td className="py-2.5 px-3 font-mono uppercase text-slate-600">{log.action}</td>
                    <td className="py-2.5 px-3 text-[#0F2747]">{log.summary}</td>
                    <td className="py-2.5 px-3 text-slate-500">{log.actorEmail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
