import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Barcode,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  Plus,
  ShieldCheck,
  TestTubes,
  UserPlus,
} from 'lucide-react';
import {
  DemoTab,
  QcSeriesConfig,
  SampleStage,
  SimOrder,
  SimPatient,
  SimResultParameter,
  WestgardViolation,
} from '../../types/demo';
import { LabPipelineVisualization } from './LabPipelineVisualization';

const STAGES: SampleStage[] = [
  'Registrasi',
  'Pengambilan',
  'Pra-Analitik',
  'Analitik',
  'Menunggu Validasi',
  'Tervalidasi',
];

const INITIAL_PATIENTS: SimPatient[] = [
  {
    id: 'pat-1',
    rmNumber: 'SIM-RM-0104',
    name: 'Andi Prasetyo (Simulasi)',
    age: 46,
    gender: 'Laki-laki',
    referringUnit: 'Poli Penyakit Dalam',
  },
  {
    id: 'pat-2',
    rmNumber: 'SIM-RM-0105',
    name: 'Siti Rahmawati (Simulasi)',
    age: 34,
    gender: 'Perempuan',
    referringUnit: 'Poli Umum',
  },
  {
    id: 'pat-3',
    rmNumber: 'SIM-RM-0106',
    name: 'Bambang Kusuma (Simulasi)',
    age: 58,
    gender: 'Laki-laki',
    referringUnit: 'IGD',
  },
];

const PANEL_TEMPLATES: Record<string, SimResultParameter[]> = {
  'Hematologi Lengkap': [
    {
      code: 'HGB',
      name: 'Hemoglobin',
      value: 13.8,
      previousValue: 14.1,
      unit: 'g/dL',
      refMin: 13.0,
      refMax: 17.0,
      deltaThresholdPct: 15,
    },
    {
      code: 'WBC',
      name: 'Leukosit',
      value: 11.8,
      previousValue: 7.4,
      unit: '10^3/µL',
      refMin: 4.0,
      refMax: 10.0,
      deltaThresholdPct: 35,
    },
    {
      code: 'PLT',
      name: 'Trombosit',
      value: 245,
      previousValue: 252,
      unit: '10^3/µL',
      refMin: 150,
      refMax: 450,
      deltaThresholdPct: 25,
    },
  ],
  'Kimia Klinik Metabolik': [
    {
      code: 'GLU',
      name: 'Glukosa Puasa',
      value: 148,
      previousValue: 102,
      unit: 'mg/dL',
      refMin: 70,
      refMax: 100,
      deltaThresholdPct: 25,
    },
    {
      code: 'CHOL',
      name: 'Kolesterol Total',
      value: 214,
      previousValue: 196,
      unit: 'mg/dL',
      refMin: 0,
      refMax: 200,
      deltaThresholdPct: 20,
    },
    {
      code: 'CREA',
      name: 'Kreatinin',
      value: 1.1,
      previousValue: 1.0,
      unit: 'mg/dL',
      refMin: 0.7,
      refMax: 1.3,
      deltaThresholdPct: 20,
    },
  ],
};

const INITIAL_ORDERS: SimOrder[] = [
  {
    id: 'ord-1',
    barcode: 'ADG-2611-001',
    patientId: 'pat-1',
    patientName: 'Andi Prasetyo (Simulasi)',
    panelName: 'Kimia Klinik Metabolik',
    priority: 'Rutin',
    stage: 'Menunggu Validasi',
    createdAtLabel: '08:15 WIB',
    parameters: PANEL_TEMPLATES['Kimia Klinik Metabolik'].map((p) => ({ ...p })),
  },
  {
    id: 'ord-2',
    barcode: 'ADG-2611-002',
    patientId: 'pat-2',
    patientName: 'Siti Rahmawati (Simulasi)',
    panelName: 'Hematologi Lengkap',
    priority: 'Rutin',
    stage: 'Analitik',
    createdAtLabel: '08:32 WIB',
    parameters: PANEL_TEMPLATES['Hematologi Lengkap'].map((p) => ({ ...p })),
  },
  {
    id: 'ord-3',
    barcode: 'ADG-2611-003',
    patientId: 'pat-3',
    patientName: 'Bambang Kusuma (Simulasi)',
    panelName: 'Hematologi Lengkap',
    priority: 'Cito',
    stage: 'Pra-Analitik',
    createdAtLabel: '08:45 WIB',
    parameters: [
      {
        code: 'HGB',
        name: 'Hemoglobin',
        value: 9.2,
        previousValue: 13.4,
        unit: 'g/dL',
        refMin: 13.0,
        refMax: 17.0,
        deltaThresholdPct: 15,
      },
      {
        code: 'WBC',
        name: 'Leukosit',
        value: 16.4,
        previousValue: 8.1,
        unit: '10^3/µL',
        refMin: 4.0,
        refMax: 10.0,
        deltaThresholdPct: 35,
      },
      {
        code: 'PLT',
        name: 'Trombosit',
        value: 132,
        previousValue: 210,
        unit: '10^3/µL',
        refMin: 150,
        refMax: 450,
        deltaThresholdPct: 25,
      },
    ],
  },
];

const INITIAL_QC_SERIES: QcSeriesConfig[] = [
  {
    id: 'qc-glucose',
    label: 'Glukosa Kontrol Level 1',
    analyte: 'Glukosa (Hexokinase)',
    unit: 'mg/dL',
    lot: 'LOT-SIM-GL26A',
    mean: 95.0,
    sd: 2.5,
    points: [
      { run: 'H-9', value: 94.2 },
      { run: 'H-8', value: 96.1 },
      { run: 'H-7', value: 93.8 },
      { run: 'H-6', value: 95.6 },
      { run: 'H-5', value: 97.2 },
      { run: 'H-4', value: 96.8 },
      { run: 'H-3', value: 98.4 },
      { run: 'H-2', value: 99.1 },
      { run: 'H-1', value: 100.3 },
      { run: 'Hari Ini', value: 101.2 },
    ],
  },
  {
    id: 'qc-hgb',
    label: 'Hemoglobin Kontrol Level 1',
    analyte: 'Hemoglobin (SLS)',
    unit: 'g/dL',
    lot: 'LOT-SIM-HB26C',
    mean: 13.5,
    sd: 0.25,
    points: [
      { run: 'H-9', value: 13.45 },
      { run: 'H-8', value: 13.62 },
      { run: 'H-7', value: 13.38 },
      { run: 'H-6', value: 13.51 },
      { run: 'H-5', value: 13.48 },
      { run: 'H-4', value: 13.55 },
      { run: 'H-3', value: 13.42 },
      { run: 'H-2', value: 13.60 },
      { run: 'H-1', value: 13.49 },
      { run: 'Hari Ini', value: 13.54 },
    ],
  },
];

interface InteractiveLabDemoProps {
  defaultTab?: string;
  bannerNote?: string;
  compact?: boolean;
}

export function InteractiveLabDemo({
  defaultTab = 'registration',
  bannerNote,
  compact = false,
}: InteractiveLabDemoProps) {
  const initialTab: DemoTab = (
    ['registration', 'orders', 'tracking', 'results', 'qc', 'ai_qi'].includes(defaultTab)
      ? defaultTab
      : 'registration'
  ) as DemoTab;

  const [activeTab, setActiveTab] = useState<DemoTab>(initialTab);
  const [patients, setPatients] = useState<SimPatient[]>(INITIAL_PATIENTS);
  const [orders, setOrders] = useState<SimOrder[]>(INITIAL_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(INITIAL_ORDERS[0].id);
  const [hasProgress, setHasProgress] = useState(false);

  // Registration state
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('38');
  const [newGender, setNewGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [newUnit, setNewUnit] = useState('Poli Umum');
  const [regNotice, setRegNotice] = useState('');

  // Order creation state
  const [orderPatientId, setOrderPatientId] = useState(INITIAL_PATIENTS[0].id);
  const [orderPanel, setOrderPanel] = useState<string>('Hematologi Lengkap');
  const [orderPriority, setOrderPriority] = useState<'Rutin' | 'Cito'>('Rutin');
  const [orderNotice, setOrderNotice] = useState('');

  // QC state
  const [qcSeries, setQcSeries] = useState<QcSeriesConfig[]>(INITIAL_QC_SERIES);
  const [selectedQcId, setSelectedQcId] = useState<string>(INITIAL_QC_SERIES[0].id);
  const [selectedPointIdx, setSelectedPointIdx] = useState<number | null>(null);

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId) || orders[0],
    [orders, selectedOrderId]
  );

  const currentQc = useMemo(
    () => qcSeries.find((q) => q.id === selectedQcId) || qcSeries[0],
    [qcSeries, selectedQcId]
  );

  // Evaluate Westgard Rules for current QC
  const westgardAssessment = useMemo(() => {
    const zScores = currentQc.points.map((pt) => ({
      run: pt.run,
      value: pt.value,
      z: (pt.value - currentQc.mean) / currentQc.sd,
    }));

    const latest = zScores[zScores.length - 1];
    const prev = zScores[zScores.length - 2];

    const violations: WestgardViolation[] = [];

    if (Math.abs(latest.z) > 3) {
      violations.push({
        rule: '1-3s',
        severity: 'reject',
        detail: `Titik ${latest.run} melampaui ±3 SD (${latest.z.toFixed(2)} SD). Indikasi kesalahan acak atau gangguan kalibrasi.`,
      });
    } else if (Math.abs(latest.z) > 2) {
      violations.push({
        rule: '1-2s',
        severity: 'warning',
        detail: `Titik ${latest.run} melampaui ±2 SD (${latest.z.toFixed(2)} SD). Peringatan awal untuk evaluasi aturan lain.`,
      });
    }

    if (prev && ((latest.z > 2 && prev.z > 2) || (latest.z < -2 && prev.z < -2))) {
      violations.push({
        rule: '2-2s',
        severity: 'reject',
        detail: `Dua run berurutan (${prev.run} dan ${latest.run}) berada di sisi yang sama melewati ±2 SD. Indikasi kesalahan sistematik.`,
      });
    }

    const last4 = zScores.slice(-4);
    if (
      last4.length === 4 &&
      (last4.every((p) => p.z > 1) || last4.every((p) => p.z < -1))
    ) {
      violations.push({
        rule: '4-1s',
        severity: 'reject',
        detail: 'Empat run berurutan melampaui +1 SD atau -1 SD pada sisi yang sama. Mengindikasikan pergeseran tren reagen/kalibrasi.',
      });
    }

    return { zScores, violations };
  }, [currentQc]);

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const id = `pat-${Date.now()}`;
    const rmNumber = `SIM-RM-0${107 + patients.length}`;
    const created: SimPatient = {
      id,
      rmNumber,
      name: `${newName.trim()} (Simulasi)`,
      age: Number(newAge) || 35,
      gender: newGender,
      referringUnit: newUnit,
    };
    setPatients((prev) => [created, ...prev]);
    setOrderPatientId(id);
    setNewName('');
    setHasProgress(true);
    setRegNotice(`Pasien simulasi ${created.name} berhasil didaftarkan (${rmNumber}).`);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === orderPatientId);
    if (!patient) return;
    const seq = String(orders.length + 1).padStart(3, '0');
    const newOrder: SimOrder = {
      id: `ord-${Date.now()}`,
      barcode: `ADG-2611-${seq}`,
      patientId: patient.id,
      patientName: patient.name,
      panelName: orderPanel,
      priority: orderPriority,
      stage: 'Registrasi',
      createdAtLabel: 'Baru saja',
      parameters: (PANEL_TEMPLATES[orderPanel] || PANEL_TEMPLATES['Hematologi Lengkap']).map(
        (p) => ({ ...p })
      ),
    };
    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrderId(newOrder.id);
    setHasProgress(true);
    setOrderNotice(`Order ${newOrder.barcode} untuk ${patient.name} dibuat.`);
  };

  const handleAdvanceStage = (orderId: string) => {
    setSelectedOrderId(orderId);
    setHasProgress(true);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const idx = STAGES.indexOf(o.stage);
        if (idx < STAGES.length - 1) {
          const nextStage = STAGES[idx + 1];
          return {
            ...o,
            stage: nextStage,
            validatedBy: nextStage === 'Tervalidasi' ? 'Analis Simulasi' : o.validatedBy,
          };
        }
        return o;
      })
    );
  };

  const handleUpdateParamValue = (orderId: string, code: string, nextValStr: string) => {
    const num = Number(nextValStr);
    if (Number.isNaN(num)) return;
    setHasProgress(true);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          parameters: o.parameters.map((p) => (p.code === code ? { ...p, value: num } : p)),
        };
      })
    );
  };

  const handleValidateOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setHasProgress(true);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, stage: 'Tervalidasi', validatedBy: 'dr. Penanggung Jawab (Simulasi)' }
          : o
      )
    );
  };

  const handleAppendQcRun = (sdShift: number) => {
    setHasProgress(true);
    setQcSeries((prev) =>
      prev.map((series) => {
        if (series.id !== selectedQcId) return series;
        const nextIdx = series.points.length + 1;
        const nextValue = Number((series.mean + sdShift * series.sd).toFixed(2));
        return {
          ...series,
          points: [...series.points.slice(-11), { run: `Run ${nextIdx}`, value: nextValue }],
        };
      })
    );
  };

  const handleResetQc = () => {
    setQcSeries(INITIAL_QC_SERIES);
    setSelectedPointIdx(null);
  };

  const handleResetSimulation = () => {
    setActiveTab(initialTab);
    setPatients(INITIAL_PATIENTS);
    setOrders(INITIAL_ORDERS);
    setSelectedOrderId(INITIAL_ORDERS[0].id);
    setOrderPatientId(INITIAL_PATIENTS[0].id);
    setQcSeries(INITIAL_QC_SERIES);
    setSelectedQcId(INITIAL_QC_SERIES[0].id);
    setSelectedPointIdx(null);
    setRegNotice('');
    setOrderNotice('');
    setHasProgress(false);
  };

  const handleTabSelect = (tab: DemoTab) => {
    setActiveTab(tab);
    setHasProgress(true);
  };

  const tabs: { id: DemoTab; label: string; icon: React.ReactNode }[] = [
    { id: 'registration', label: '1. Pendaftaran', icon: <UserPlus className="w-4 h-4" /> },
    { id: 'orders', label: '2. Order Lab', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'tracking', label: '3. Pelacakan Sampel', icon: <Barcode className="w-4 h-4" /> },
    { id: 'results', label: '4. Entri & Validasi', icon: <TestTubes className="w-4 h-4" /> },
    { id: 'qc', label: '5. Dashboard QC', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'ai_qi', label: '6. AI Quality Intelligence', icon: <BrainCircuit className="w-4 h-4" /> },
  ];

  // SVG Chart Geometry
  const chartW = 680;
  const chartH = 240;
  const padX = 48;
  const padY = 24;
  const plotW = chartW - padX * 2;
  const plotH = chartH - padY * 2;
  const yMin = currentQc.mean - 3.6 * currentQc.sd;
  const yMax = currentQc.mean + 3.6 * currentQc.sd;
  const toY = (val: number) =>
    padY + ((yMax - val) / (yMax - yMin)) * plotH;
  const toX = (idx: number, total: number) =>
    total <= 1 ? padX + plotW / 2 : padX + (idx / (total - 1)) * plotW;

  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Isolation Banner */}
        <div className="bg-[#0F2747] text-white px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <Activity className="w-4 h-4 text-[#38BDF8] shrink-0" strokeWidth={1.75} />
            <span>
              {bannerNote ||
                'Lingkungan Demo Interaktif: Menggunakan data laboratorium simulasi yang terisolasi dari database produksi.'}
            </span>
          </div>
          <span className="font-mono text-[#38BDF8] whitespace-nowrap shrink-0">
            MODE SIMULASI PUBLIK
          </span>
        </div>

        {/* Tab Bar */}
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabSelect(tab.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-[#0756B8] text-white'
                    : 'text-slate-600 hover:text-[#0F2747] hover:bg-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Workspace Body */}
      <div className={compact ? 'p-5' : 'p-6 sm:p-8'}>
        {/* TAB 1: REGISTRATION */}
        {activeTab === 'registration' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form onSubmit={handleRegisterPatient} className="lg:col-span-5 space-y-4">
              <div>
                <h4 className="text-base font-bold text-[#0F2747]">Registrasi Pasien Baru (Simulasi)</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Tambahkan data pasien fiktif untuk menguji alur pendaftaran hingga validasi hasil.
                </p>
              </div>
              {regNotice && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{regNotice}</span>
                </div>
              )}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Nama Pasien</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Dewi Kartika"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0756B8]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Usia (Tahun)</label>
                  <input
                    type="number"
                    min={1}
                    max={110}
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-[#0756B8]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Jenis Kelamin</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as 'Laki-laki' | 'Perempuan')}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0756B8]"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Unit Pengirim</label>
                <select
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0756B8]"
                >
                  <option value="Poli Umum">Poli Umum</option>
                  <option value="Poli Penyakit Dalam">Poli Penyakit Dalam</option>
                  <option value="IGD">IGD</option>
                  <option value="Rujukan Mandiri">Rujukan Mandiri</option>
                </select>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#0756B8] rounded-lg hover:bg-[#0F2747] transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Daftarkan Pasien Simulasi</span>
              </button>
            </form>

            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-[#0F2747]">Daftar Pasien Terdaftar (Simulasi)</h4>
                <button
                  type="button"
                  onClick={() => handleTabSelect('orders')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0756B8] hover:underline"
                >
                  <span>Lanjut ke Order Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">No. RM</th>
                      <th className="py-2.5 px-3 font-semibold">Nama</th>
                      <th className="py-2.5 px-3 font-semibold">Usia / JK</th>
                      <th className="py-2.5 px-3 font-semibold">Unit Pengirim</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {patients.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-3 font-mono text-xs tabular-nums text-[#0756B8]">
                          {p.rmNumber}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-[#0F2747]">{p.name}</td>
                        <td className="py-2.5 px-3 text-xs text-slate-600 tabular-nums">
                          {p.age} th · {p.gender}
                        </td>
                        <td className="py-2.5 px-3 text-xs text-slate-600">{p.referringUnit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS */}
        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form onSubmit={handleCreateOrder} className="lg:col-span-5 space-y-4">
              <div>
                <h4 className="text-base font-bold text-[#0F2747]">Buat Order Pemeriksaan</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Setiap order menghasilkan ID barcode spesimen unik untuk pelacakan analitik.
                </p>
              </div>
              {orderNotice && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{orderNotice}</span>
                </div>
              )}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Pilih Pasien</label>
                <select
                  value={orderPatientId}
                  onChange={(e) => setOrderPatientId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0756B8]"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.rmNumber} — {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Panel Pemeriksaan</label>
                <select
                  value={orderPanel}
                  onChange={(e) => setOrderPanel(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0756B8]"
                >
                  {Object.keys(PANEL_TEMPLATES).map((panel) => (
                    <option key={panel} value={panel}>
                      {panel}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Prioritas Penanganan</label>
                <div className="flex items-center gap-2">
                  {(['Rutin', 'Cito'] as const).map((prio) => (
                    <button
                      key={prio}
                      type="button"
                      onClick={() => setOrderPriority(prio)}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                        orderPriority === prio
                          ? 'bg-[#0756B8] text-white border-[#0756B8]'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {prio}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#0756B8] rounded-lg hover:bg-[#0F2747] transition-colors"
              >
                <Barcode className="w-4 h-4" />
                <span>Buat Order &amp; Cetak Barcode</span>
              </button>
            </form>

            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-[#0F2747]">Order Pemeriksaan Aktif</h4>
                <button
                  type="button"
                  onClick={() => handleTabSelect('tracking')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0756B8] hover:underline"
                >
                  <span>Buka Pelacakan Sampel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Barcode</th>
                      <th className="py-2.5 px-3 font-semibold">Pasien</th>
                      <th className="py-2.5 px-3 font-semibold">Panel</th>
                      <th className="py-2.5 px-3 font-semibold">Prioritas</th>
                      <th className="py-2.5 px-3 font-semibold">Tahap</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-3 font-mono text-xs tabular-nums text-[#0756B8]">
                          {o.barcode}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-[#0F2747]">{o.patientName}</td>
                        <td className="py-2.5 px-3 text-xs text-slate-600">{o.panelName}</td>
                        <td className="py-2.5 px-3 text-xs font-semibold">
                          <span className={o.priority === 'Cito' ? 'text-rose-700' : 'text-slate-600'}>
                            {o.priority}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-xs font-medium text-[#0F2747]">{o.stage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SAMPLE TRACKING */}
        {activeTab === 'tracking' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-base font-bold text-[#0F2747]">Pelacakan Barcode &amp; Status Spesimen</h4>
                <p className="text-xs text-slate-500">
                  Klik tombol tahap berikutnya untuk mensimulasikan perpindahan spesimen di lantai laboratorium.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleTabSelect('results')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0756B8] hover:underline"
              >
                <span>Lanjut ke Entri Hasil</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
                  <tr>
                    <th className="py-3 px-3 font-semibold">Barcode</th>
                    <th className="py-3 px-3 font-semibold">Pasien &amp; Panel</th>
                    <th className="py-3 px-3 font-semibold">Progres Alur Spesimen</th>
                    <th className="py-3 px-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o) => {
                    const currentIdx = STAGES.indexOf(o.stage);
                    const isDone = currentIdx === STAGES.length - 1;
                    return (
                      <tr key={o.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3 font-mono text-xs tabular-nums text-[#0756B8] whitespace-nowrap">
                          {o.barcode}
                          <div className="text-[11px] text-slate-400 mt-0.5">{o.createdAtLabel}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-[#0F2747]">{o.patientName}</div>
                          <div className="text-xs text-slate-500">
                            {o.panelName} · {o.priority}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {STAGES.map((stage, idx) => {
                              const passed = idx <= currentIdx;
                              return (
                                <span
                                  key={stage}
                                  className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                                    idx === currentIdx
                                      ? 'bg-[#0756B8] text-white font-semibold'
                                      : passed
                                      ? 'bg-sky-50 text-[#0756B8]'
                                      : 'bg-slate-100 text-slate-400'
                                  }`}
                                >
                                  {stage}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          {isDone ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOrderId(o.id);
                                handleTabSelect('results');
                              }}
                              className="text-xs font-semibold text-[#16A085] hover:underline"
                            >
                              Lihat Hasil
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAdvanceStage(o.id)}
                              className="px-3 py-1.5 text-xs font-semibold text-[#0756B8] border border-[#0756B8]/30 rounded-lg hover:bg-sky-50 transition-colors"
                            >
                              Tahap Berikutnya
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: RESULT ENTRY & VALIDATION */}
        {activeTab === 'results' && selectedOrder && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-bold text-[#0F2747]">Entri Hasil, Delta Check &amp; Validasi</h4>
                <p className="text-xs text-slate-500">
                  Ubah angka hasil untuk menguji deteksi nilai di luar rentang rujukan serta perhitungan Delta Check otomatis.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-600">Pilih Order:</label>
                <select
                  value={selectedOrder.id}
                  onChange={(e) => {
                    setSelectedOrderId(e.target.value);
                    setHasProgress(true);
                  }}
                  className="px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.barcode} — {o.patientName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Parameter</th>
                    <th className="py-2.5 px-3 font-semibold">Hasil Saat Ini</th>
                    <th className="py-2.5 px-3 font-semibold">Nilai Sebelumnya</th>
                    <th className="py-2.5 px-3 font-semibold">Rentang Rujukan</th>
                    <th className="py-2.5 px-3 font-semibold">Status &amp; Delta Check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedOrder.parameters.map((p) => {
                    const isHigh = p.value > p.refMax;
                    const isLow = p.value < p.refMin;
                    const deltaPct =
                      p.previousValue > 0
                        ? ((p.value - p.previousValue) / p.previousValue) * 100
                        : 0;
                    const deltaTriggered = Math.abs(deltaPct) >= p.deltaThresholdPct;
                    return (
                      <tr key={p.code} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-[#0F2747]">{p.name}</div>
                          <div className="font-mono text-xs text-slate-400">{p.code}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="inline-flex items-center gap-2">
                            <input
                              type="number"
                              step="0.1"
                              value={p.value}
                              onChange={(e) =>
                                handleUpdateParamValue(selectedOrder.id, p.code, e.target.value)
                              }
                              className="w-24 px-2.5 py-1.5 text-sm font-mono tabular-nums border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0756B8]"
                            />
                            <span className="text-xs text-slate-500 font-mono">{p.unit}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-xs tabular-nums text-slate-600">
                          {p.previousValue} {p.unit}
                        </td>
                        <td className="py-3 px-3 font-mono text-xs tabular-nums text-slate-600">
                          {p.refMin} – {p.refMax} {p.unit}
                        </td>
                        <td className="py-3 px-3 text-xs space-y-1">
                          <div
                            className={`font-semibold ${
                              isHigh || isLow ? 'text-rose-700' : 'text-[#16A085]'
                            }`}
                          >
                            {isHigh ? '▲ Tinggi (Di atas rujukan)' : isLow ? '▼ Rendah (Di bawah rujukan)' : '● Normal'}
                          </div>
                          <div
                            className={`font-mono tabular-nums ${
                              deltaTriggered ? 'text-amber-700 font-semibold' : 'text-slate-500'
                            }`}
                          >
                            Delta: {deltaPct >= 0 ? '+' : ''}
                            {deltaPct.toFixed(1)}%{' '}
                            {deltaTriggered ? `(Melebihi batas ${p.deltaThresholdPct}%)` : '(Stabil)'}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="text-xs text-slate-600">
                Status Saat Ini:{' '}
                <span className="font-semibold text-[#0F2747]">{selectedOrder.stage}</span>
                {selectedOrder.validatedBy && (
                  <span className="text-slate-500"> · Oleh {selectedOrder.validatedBy}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleValidateOrder(selectedOrder.id)}
                disabled={selectedOrder.stage === 'Tervalidasi'}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#16A085] rounded-lg hover:bg-[#0F2747] disabled:opacity-50 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {selectedOrder.stage === 'Tervalidasi'
                    ? 'Hasil Sudah Tervalidasi'
                    : 'Validasi & Rilis Hasil Simulasi'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: QC DASHBOARD & LEVEY-JENNINGS */}
        {activeTab === 'qc' && (
          <div className="space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-bold text-[#0F2747]">
                  Dashboard QC &amp; Grafik Levey-Jennings
                </h4>
                <p className="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
                  {currentQc.analyte} · {currentQc.lot} · Mean: {currentQc.mean} {currentQc.unit} · SD:{' '}
                  {currentQc.sd}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedQcId}
                  onChange={(e) => {
                    setSelectedQcId(e.target.value);
                    setSelectedPointIdx(null);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white"
                >
                  {qcSeries.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleAppendQcRun(0.3)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#0F2747] border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  + Run Normal
                </button>
                <button
                  type="button"
                  onClick={() => handleAppendQcRun(2.6)}
                  className="px-3 py-1.5 text-xs font-semibold text-amber-800 border border-amber-300 bg-amber-50 rounded-lg hover:bg-amber-100"
                >
                  Simulasi +2.6 SD
                </button>
                <button
                  type="button"
                  onClick={handleResetQc}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-[#0F2747]"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/60 overflow-x-auto">
              <svg
                viewBox={`0 0 ${chartW} ${chartH}`}
                className="w-full min-w-[540px] h-auto"
                role="img"
                aria-label="Grafik Levey-Jennings Simulasi"
              >
                {/* SD Reference Bands */}
                {[
                  { mult: 3, label: '+3SD', color: '#DC2626', dash: '4 4' },
                  { mult: 2, label: '+2SD', color: '#D97706', dash: '4 4' },
                  { mult: 1, label: '+1SD', color: '#94A3B8', dash: '2 4' },
                  { mult: 0, label: 'Mean', color: '#0756B8', dash: '' },
                  { mult: -1, label: '-1SD', color: '#94A3B8', dash: '2 4' },
                  { mult: -2, label: '-2SD', color: '#D97706', dash: '4 4' },
                  { mult: -3, label: '-3SD', color: '#DC2626', dash: '4 4' },
                ].map((line) => {
                  const y = toY(currentQc.mean + line.mult * currentQc.sd);
                  return (
                    <g key={line.label}>
                      <line
                        x1={padX}
                        y1={y}
                        x2={chartW - padX}
                        y2={y}
                        stroke={line.color}
                        strokeWidth={line.mult === 0 ? 1.5 : 1}
                        strokeDasharray={line.dash}
                        opacity={0.75}
                      />
                      <text
                        x={6}
                        y={y + 4}
                        fontSize="10"
                        fontFamily="JetBrains Mono, monospace"
                        fill={line.color}
                      >
                        {line.label}
                      </text>
                    </g>
                  );
                })}

                {/* Polyline */}
                <polyline
                  fill="none"
                  stroke="#0F2747"
                  strokeWidth="2"
                  points={currentQc.points
                    .map(
                      (pt, idx) =>
                        `${toX(idx, currentQc.points.length)},${toY(pt.value)}`
                    )
                    .join(' ')}
                />

                {/* Points */}
                {currentQc.points.map((pt, idx) => {
                  const z = Math.abs((pt.value - currentQc.mean) / currentQc.sd);
                  const fill = z > 3 ? '#DC2626' : z > 2 ? '#D97706' : '#0756B8';
                  const cx = toX(idx, currentQc.points.length);
                  const cy = toY(pt.value);
                  return (
                    <g
                      key={pt.run}
                      className="cursor-pointer"
                      onClick={() => setSelectedPointIdx(idx)}
                    >
                      <circle
                        cx={cx}
                        cy={cy}
                        r={selectedPointIdx === idx ? 6 : 4.5}
                        fill={fill}
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                      <text
                        x={cx}
                        y={chartH - 6}
                        textAnchor="middle"
                        fontSize="9"
                        fontFamily="JetBrains Mono, monospace"
                        fill="#64748B"
                      >
                        {pt.run}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {selectedPointIdx !== null && currentQc.points[selectedPointIdx] && (
                <div className="mt-2 pt-2 border-t border-slate-200 text-xs font-mono text-slate-700 flex items-center justify-between">
                  <span>
                    Run Terpilih: {currentQc.points[selectedPointIdx].run} · Nilai:{' '}
                    {currentQc.points[selectedPointIdx].value} {currentQc.unit}
                  </span>
                  <span>
                    Z-Score:{' '}
                    {(
                      (currentQc.points[selectedPointIdx].value - currentQc.mean) /
                      currentQc.sd
                    ).toFixed(2)}{' '}
                    SD
                  </span>
                </div>
              )}
            </div>

            {/* Westgard Rules Summary */}
            <div className="border border-slate-200 rounded-lg p-4 space-y-2.5">
              <div className="text-xs font-bold text-[#0F2747]">
                Evaluasi Aturan Westgard Terkonfigurasi
              </div>
              {westgardAssessment.violations.length === 0 ? (
                <div className="flex items-center gap-2 text-xs text-[#16A085] font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Semua run berada dalam batas kontrol (±2 SD). Tidak ada pelanggaran aturan Westgard.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {westgardAssessment.violations.map((v) => (
                    <div
                      key={v.rule}
                      className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                        v.severity === 'reject'
                          ? 'bg-rose-50 border-rose-200 text-rose-900'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-mono font-bold mr-2">ATURAN {v.rule}</span>
                        <span>{v.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: EXAMPLE AI QUALITY INTELLIGENCE */}
        {activeTab === 'ai_qi' && (
          <div className="space-y-5">
            <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/70 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0F2747]">
                <BrainCircuit className="w-5 h-5 text-[#0756B8]" strokeWidth={1.75} />
                <span>Contoh AI Quality Intelligence (Simulasi Analisis Mutu &amp; Delta Check)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Panel ini mendemonstrasikan bagaimana aturan statistik QC dan Delta Check dirangkum menjadi catatan peninjauan bagi analis. Fitur rekomendasi otomatis lanjutan ditandai sebagai modul dalam pengembangan tervalidasi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="border border-slate-200 rounded-lg p-5 space-y-3">
                <h5 className="text-sm font-bold text-[#0F2747]">
                  Ringkasan Tren QC ({currentQc.label})
                </h5>
                <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                  <p>
                    Dari 10 titik kontrol terakhir, nilai terakhir berada pada{' '}
                    <span className="font-mono font-semibold text-[#0F2747]">
                      {westgardAssessment.zScores[westgardAssessment.zScores.length - 1]?.z.toFixed(2)} SD
                    </span>
                    .
                  </p>
                  {westgardAssessment.violations.length > 0 ? (
                    <p className="text-amber-800 font-medium">
                      Terdapat indikasi pergeseran positif pada 4 run terakhir. Langkah yang disarankan pada protokol lab: periksa stabilitas suhu reagen, masa kedaluwarsa kontrol, dan lakukan verifikasi kalibrasi sebelum rilis pasien.
                    </p>
                  ) : (
                    <p className="text-[#16A085] font-medium">
                      Variabilitas kontrol stabil dalam batas ±2 SD. Instrumen layak melanjutkan pemeriksaan sampel rutin.
                    </p>
                  )}
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-5 space-y-3">
                <h5 className="text-sm font-bold text-[#0F2747]">
                  Penandaan Delta Check pada Order Aktif
                </h5>
                <div className="space-y-2">
                  {orders.slice(0, 3).map((ord) => {
                    const flagged = ord.parameters.filter((p) => {
                      const pct =
                        p.previousValue > 0
                          ? Math.abs(((p.value - p.previousValue) / p.previousValue) * 100)
                          : 0;
                      return pct >= p.deltaThresholdPct;
                    });
                    return (
                      <div
                        key={ord.id}
                        className="text-xs border-b border-slate-100 pb-2 last:border-b-0 last:pb-0"
                      >
                        <div className="font-semibold text-[#0F2747]">
                          {ord.barcode} · {ord.patientName}
                        </div>
                        <div className="text-slate-600 mt-0.5">
                          {flagged.length > 0
                            ? `${flagged.length} parameter melewati ambang Delta Check (${flagged
                                .map((f) => f.code)
                                .join(', ')}). Disarankan verifikasi identitas spesimen dan kondisi klinis.`
                            : 'Tidak ada lonjakan nilai ekstrem dibanding riwayat sebelumnya.'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Real-Time Laboratory Pipeline Visualization */}
      <LabPipelineVisualization
        activeTab={activeTab}
        patients={patients}
        orders={orders}
        selectedOrder={selectedOrder}
        currentQc={currentQc}
        westgardViolations={westgardAssessment.violations}
        latestZScore={
          westgardAssessment.zScores[westgardAssessment.zScores.length - 1]?.z ?? 0
        }
        hasProgress={hasProgress}
        onSelectOrder={(orderId) => {
          setSelectedOrderId(orderId);
          setHasProgress(true);
        }}
        onNavigateTab={handleTabSelect}
        onResetSimulation={handleResetSimulation}
      />
    </div>
  );
}
