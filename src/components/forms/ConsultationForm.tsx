import React, { useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Send } from 'lucide-react';
import {
  ALLOWED_FACILITY_TYPES,
  ALLOWED_SOLUTIONS,
  submitConsultationLead,
  validateConsultationInput,
} from '../../services/cmsService';

const SUBMISSION_GUARD_KEY = 'ai_diagno_consultation_guard';
const MIN_INTERACTION_MS = 800;
const COOLDOWN_MS = 30000;
const DUPLICATE_WINDOW_MS = 300000;

interface SubmissionGuardRecord {
  fingerprint: string;
  submittedAt: number;
}

interface ConsultationFormProps {
  defaultSolution?: string;
}

export function ConsultationForm({ defaultSolution }: ConsultationFormProps) {
  const [fullName, setFullName] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [facilityType, setFacilityType] = useState<string>(ALLOWED_FACILITY_TYPES[0]);
  const [requiredSolution, setRequiredSolution] = useState<string>(
    defaultSolution &&
      ALLOWED_SOLUTIONS.includes(defaultSolution as (typeof ALLOWED_SOLUTIONS)[number])
      ? defaultSolution
      : ALLOWED_SOLUTIONS[0]
  );
  const [contactChannel, setContactChannel] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const mountedAtRef = useRef<number>(Date.now());
  const submittingRef = useRef(false);

  const buildFingerprint = () =>
    [
      fullName.trim().toLowerCase(),
      facilityName.trim().toLowerCase(),
      facilityType.trim().toLowerCase(),
      requiredSolution.trim().toLowerCase(),
      contactChannel.trim().toLowerCase(),
    ].join('|');

  const checkAntiSpamGuard = (): string | null => {
    if (Date.now() - mountedAtRef.current < MIN_INTERACTION_MS) {
      return 'Mohon periksa kembali data Anda sebelum mengirim formulir.';
    }

    try {
      const raw = sessionStorage.getItem(SUBMISSION_GUARD_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SubmissionGuardRecord;
        const elapsed = Date.now() - (parsed.submittedAt || 0);
        const fingerprint = buildFingerprint();

        if (parsed.fingerprint === fingerprint && elapsed < DUPLICATE_WINDOW_MS) {
          return 'Permintaan dengan data yang sama baru saja dikirimkan. Tim kami telah mencatat pengajuan Anda.';
        }
        if (elapsed < COOLDOWN_MS) {
          const waitSec = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
          return `Mohon tunggu ${waitSec} detik sebelum mengirim permintaan konsultasi berikutnya.`;
        }
      }
    } catch {
      // Ignore storage access errors in private browsing modes
    }

    return null;
  };

  const recordGuardSuccess = () => {
    try {
      const record: SubmissionGuardRecord = {
        fingerprint: buildFingerprint(),
        submittedAt: Date.now(),
      };
      sessionStorage.setItem(SUBMISSION_GUARD_KEY, JSON.stringify(record));
    } catch {
      // Ignore storage errors
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current || submitting) return;

    setErrorMsg('');

    const validationError = validateConsultationInput({
      fullName,
      facilityName,
      facilityType,
      requiredSolution,
      contactChannel,
      message,
    });
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    const spamError = checkAntiSpamGuard();
    if (spamError) {
      setErrorMsg(spamError);
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    try {
      const leadId = await submitConsultationLead({
        fullName,
        facilityName,
        facilityType,
        requiredSolution,
        contactChannel,
        message,
      });
      recordGuardSuccess();
      setSubmittedId(leadId);
      setFullName('');
      setFacilityName('');
      setContactChannel('');
      setMessage('');
    } catch (err) {
      const fallbackText =
        'Permintaan konsultasi gagal disimpan ke server. Data formulir Anda tetap aman; silakan periksa koneksi Anda dan coba kembali.';
      if (err instanceof Error && err.message && !err.message.startsWith('{')) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg(fallbackText);
      }
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  if (submittedId) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-4">
        <div className="w-11 h-11 rounded-lg bg-emerald-50 text-[#16A085] flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6" strokeWidth={1.75} />
        </div>
        <h3 className="text-xl font-bold text-[#0F2747]">Permintaan Konsultasi Berhasil Dikirim</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Terima kasih. Pengajuan konsultasi Anda telah tersimpan di sistem kami dengan status awal{' '}
          <strong className="text-[#0F2747]">Baru</strong> dan siap ditindaklanjuti oleh tim teknis AI Diagno.
        </p>
        <div className="pt-2 text-xs font-mono text-slate-500 tabular-nums">
          Referensi Tiket: {submittedId}
        </div>
        <button
          type="button"
          onClick={() => {
            mountedAtRef.current = Date.now();
            setSubmittedId(null);
          }}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[#0756B8] border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Kirim Permintaan Lain
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5"
    >
      <div>
        <h3 className="text-lg font-bold text-[#0F2747]">Formulir Permintaan Konsultasi</h3>
        <p className="text-sm text-slate-600 mt-1">
          Lengkapi informasi fasilitas Anda agar tim kami dapat menyiapkan sesi diskusi atau peninjauan modul yang relevan.
        </p>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-800"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.75} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="block text-sm font-medium text-[#0F2747]">
            Nama Lengkap <span className="text-rose-600">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            maxLength={120}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Contoh: dr. Hendra Wijaya, Sp.PK"
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0756B8] focus:border-[#0756B8]"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="facilityName" className="block text-sm font-medium text-[#0F2747]">
            Nama Laboratorium / Klinik <span className="text-rose-600">*</span>
          </label>
          <input
            id="facilityName"
            name="facilityName"
            type="text"
            autoComplete="organization"
            required
            maxLength={160}
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
            placeholder="Contoh: Laboratorium Klinik Sentosa"
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0756B8] focus:border-[#0756B8]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="facilityType" className="block text-sm font-medium text-[#0F2747]">
            Tipe Fasilitas <span className="text-rose-600">*</span>
          </label>
          <select
            id="facilityType"
            name="facilityType"
            required
            value={facilityType}
            onChange={(e) => setFacilityType(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0756B8] focus:border-[#0756B8]"
          >
            {ALLOWED_FACILITY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="requiredSolution" className="block text-sm font-medium text-[#0F2747]">
            Solusi yang Dibutuhkan <span className="text-rose-600">*</span>
          </label>
          <select
            id="requiredSolution"
            name="requiredSolution"
            required
            value={requiredSolution}
            onChange={(e) => setRequiredSolution(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0756B8] focus:border-[#0756B8]"
          >
            {ALLOWED_SOLUTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contactChannel" className="block text-sm font-medium text-[#0F2747]">
          Email atau Nomor WhatsApp <span className="text-rose-600">*</span>
        </label>
        <input
          id="contactChannel"
          name="contactChannel"
          type="text"
          required
          maxLength={160}
          value={contactChannel}
          onChange={(e) => setContactChannel(e.target.value)}
          placeholder="Contoh: manajemen@klinikanda.id atau +62812xxxxxxx"
          className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0756B8] focus:border-[#0756B8]"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="block text-sm font-medium text-[#0F2747]">
          Pesan Tambahan (Opsional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ceritakan perkiraan volume sampel harian, jumlah alat analyzer, atau kebutuhan integrasi SIMRS."
          className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0756B8] focus:border-[#0756B8]"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#0756B8] rounded-lg hover:bg-[#0F2747] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        <Send className="w-4 h-4" strokeWidth={1.75} />
        <span>{submitting ? 'Mengirim Permintaan...' : 'Kirim Permintaan Konsultasi'}</span>
      </button>
    </form>
  );
}
