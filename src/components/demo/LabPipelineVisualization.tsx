import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Barcode,
  BrainCircuit,
  ChartNoAxesCombined,
  Check,
  ClipboardList,
  Clock3,
  FileCheck,
  FilePen,
  RotateCcw,
  ShieldCheck,
  TestTube,
  UserRoundPlus,
} from 'lucide-react';
import {
  DemoTab,
  QcSeriesConfig,
  SampleStage,
  SimOrder,
  SimPatient,
  WestgardViolation,
} from '../../types/demo';

export type PipelineNodeStatus =
  | 'Menunggu'
  | 'Sedang diproses'
  | 'Selesai'
  | 'Perlu perhatian';

type PipelineNodeId =
  | 'registration'
  | 'order'
  | 'collection'
  | 'barcode'
  | 'result_entry'
  | 'validation'
  | 'qc'
  | 'ai_qi'
  | 'report';

interface PipelineNodeView {
  id: PipelineNodeId;
  stepNumber: string;
  title: string;
  status: PipelineNodeStatus;
  targetTab: DemoTab;
  targetTabLabel: string;
  summary: string;
  detailNote: string;
  icon: React.ReactNode;
}

const SAMPLE_STAGES_ORDER: SampleStage[] = [
  'Registrasi',
  'Pengambilan',
  'Pra-Analitik',
  'Analitik',
  'Menunggu Validasi',
  'Tervalidasi',
];

interface LabPipelineVisualizationProps {
  activeTab: DemoTab;
  patients: SimPatient[];
  orders: SimOrder[];
  selectedOrder: SimOrder;
  currentQc: QcSeriesConfig;
  westgardViolations: WestgardViolation[];
  latestZScore: number;
  hasProgress: boolean;
  onSelectOrder: (orderId: string) => void;
  onNavigateTab: (tab: DemoTab) => void;
  onResetSimulation: () => void;
}

export function LabPipelineVisualization({
  activeTab,
  patients,
  orders,
  selectedOrder,
  currentQc,
  westgardViolations,
  latestZScore,
  hasProgress,
  onSelectOrder,
  onNavigateTab,
  onResetSimulation,
}: LabPipelineVisualizationProps) {
  const [inspectedId, setInspectedId] = useState<PipelineNodeId>('registration');

  const stageIdx = SAMPLE_STAGES_ORDER.indexOf(selectedOrder.stage);
  const linkedPatient = patients.find((p) => p.id === selectedOrder.patientId);

  const flaggedParameters = useMemo(() => {
    return selectedOrder.parameters.filter((p) => {
      const outOfRange = p.value > p.refMax || p.value < p.refMin;
      const deltaPct =
        p.previousValue > 0
          ? Math.abs(((p.value - p.previousValue) / p.previousValue) * 100)
          : 0;
      return outOfRange || deltaPct >= p.deltaThresholdPct;
    });
  }, [selectedOrder]);

  const hasResultAttention = flaggedParameters.length > 0;
  const hasQcAttention = westgardViolations.length > 0;

  // Derive all 9 pipeline stages strictly from live demo state (single source of truth)
  const nodes: PipelineNodeView[] = useMemo(() => {
    const regStatus: PipelineNodeStatus =
      activeTab === 'registration' && stageIdx === 0 ? 'Sedang diproses' : 'Selesai';

    const orderStatus: PipelineNodeStatus =
      stageIdx === 0 && activeTab === 'orders'
        ? 'Sedang diproses'
        : stageIdx === 0
        ? 'Sedang diproses'
        : 'Selesai';

    const collectionStatus: PipelineNodeStatus =
      stageIdx < 1 ? 'Menunggu' : stageIdx === 1 ? 'Sedang diproses' : 'Selesai';

    const barcodeStatus: PipelineNodeStatus =
      stageIdx < 2 ? 'Menunggu' : stageIdx === 2 ? 'Sedang diproses' : 'Selesai';

    const entryStatus: PipelineNodeStatus =
      stageIdx < 3
        ? 'Menunggu'
        : stageIdx === 3
        ? hasResultAttention && activeTab === 'results'
          ? 'Perlu perhatian'
          : 'Sedang diproses'
        : 'Selesai';

    const validationStatus: PipelineNodeStatus =
      stageIdx < 4
        ? 'Menunggu'
        : stageIdx === 4
        ? hasResultAttention
          ? 'Perlu perhatian'
          : 'Sedang diproses'
        : 'Selesai';

    let qcStatus: PipelineNodeStatus = 'Menunggu';
    if (stageIdx >= 5) {
      qcStatus = hasQcAttention ? 'Perlu perhatian' : 'Selesai';
    } else if (activeTab === 'qc' || activeTab === 'ai_qi') {
      qcStatus = hasQcAttention
        ? 'Perlu perhatian'
        : activeTab === 'qc'
        ? 'Sedang diproses'
        : 'Selesai';
    }

    let aiQiStatus: PipelineNodeStatus = 'Menunggu';
    if (stageIdx >= 5) {
      aiQiStatus = hasQcAttention || hasResultAttention ? 'Perlu perhatian' : 'Selesai';
    } else if (activeTab === 'ai_qi') {
      aiQiStatus = hasQcAttention || hasResultAttention ? 'Perlu perhatian' : 'Sedang diproses';
    }

    let reportStatus: PipelineNodeStatus = 'Menunggu';
    if (stageIdx >= 5) {
      reportStatus = hasQcAttention ? 'Sedang diproses' : 'Selesai';
    }

    return [
      {
        id: 'registration',
        stepNumber: '01',
        title: 'Pendaftaran',
        status: regStatus,
        targetTab: 'registration',
        targetTabLabel: 'Buka Tab Pendaftaran',
        summary: 'Identitas pasien simulasi dicatat ke nomor rekam medis laboratorium.',
        detailNote: linkedPatient
          ? `Pasien terdaftar: ${linkedPatient.name} (${linkedPatient.rmNumber}) · Unit: ${linkedPatient.referringUnit}.`
          : `Pasien simulasi terkait: ${selectedOrder.patientName}.`,
        icon: <UserRoundPlus className="w-4 h-4" strokeWidth={1.75} />,
      },
      {
        id: 'order',
        stepNumber: '02',
        title: 'Order Laboratorium',
        status: orderStatus,
        targetTab: 'orders',
        targetTabLabel: 'Buka Tab Order Lab',
        summary: 'Permintaan panel pemeriksaan dan prioritas pengerjaan dibuat.',
        detailNote: `Order aktif: ${selectedOrder.panelName} · Prioritas ${selectedOrder.priority} · Waktu ${selectedOrder.createdAtLabel}.`,
        icon: <ClipboardList className="w-4 h-4" strokeWidth={1.75} />,
      },
      {
        id: 'collection',
        stepNumber: '03',
        title: 'Pengambilan Spesimen',
        status: collectionStatus,
        targetTab: 'tracking',
        targetTabLabel: 'Buka Tab Pelacakan Sampel',
        summary: 'Pengambilan sampel darah/spesimen sesuai jenis tabung dan panel.',
        detailNote:
          collectionStatus === 'Menunggu'
            ? 'Belum dijalankan. Majukan tahap spesimen dari "Registrasi" ke "Pengambilan" pada Pelacakan Sampel.'
            : `Spesimen ${selectedOrder.barcode} telah memasuki proses pengambilan dan persiapan pra-analitik.`,
        icon: <TestTube className="w-4 h-4" strokeWidth={1.75} />,
      },
      {
        id: 'barcode',
        stepNumber: '04',
        title: 'Pelacakan Barcode',
        status: barcodeStatus,
        targetTab: 'tracking',
        targetTabLabel: 'Buka Tab Pelacakan Sampel',
        summary: 'Verifikasi identitas tabung dengan barcode unik di area pra-analitik.',
        detailNote:
          barcodeStatus === 'Menunggu'
            ? 'Belum dijalankan. Tahap ini aktif setelah spesimen melewati Pengambilan.'
            : `Barcode spesimen ${selectedOrder.barcode} terverifikasi dan dipantau menuju meja analitik.`,
        icon: <Barcode className="w-4 h-4" strokeWidth={1.75} />,
      },
      {
        id: 'result_entry',
        stepNumber: '05',
        title: 'Entri Hasil',
        status: entryStatus,
        targetTab: 'results',
        targetTabLabel: 'Buka Tab Entri & Validasi',
        summary: 'Pengisian nilai parameter analitik beserta pembandingan rentang rujukan.',
        detailNote:
          entryStatus === 'Menunggu'
            ? 'Belum dijalankan. Majukan spesimen ke tahap Analitik untuk memulai entri hasil.'
            : hasResultAttention
            ? `${flaggedParameters.length} parameter (${flaggedParameters
                .map((p) => p.code)
                .join(', ')}) berada di luar rentang rujukan atau melewati ambang Delta Check.`
            : `Seluruh ${selectedOrder.parameters.length} parameter terukur berada dalam batas rujukan stabil.`,
        icon: <FilePen className="w-4 h-4" strokeWidth={1.75} />,
      },
      {
        id: 'validation',
        stepNumber: '06',
        title: 'Validasi Hasil',
        status: validationStatus,
        targetTab: 'results',
        targetTabLabel: 'Buka Tab Entri & Validasi',
        summary: 'Peninjauan Delta Check dan pengesahan klinis sebelum rilis laporan.',
        detailNote:
          validationStatus === 'Menunggu'
            ? 'Belum dijalankan. Menunggu spesimen menyelesaikan entri hasil analitik.'
            : validationStatus === 'Perlu perhatian'
            ? `Menunggu verifikasi penanggung jawab karena terdeteksi flag pada ${flaggedParameters
                .map((p) => p.code)
                .join(', ')}.`
            : validationStatus === 'Sedang diproses'
            ? 'Spesimen siap divalidasi oleh analis atau dokter penanggung jawab.'
            : `Hasil telah divalidasi (${selectedOrder.validatedBy || 'Penanggung Jawab Simulasi'}).`,
        icon: <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />,
      },
      {
        id: 'qc',
        stepNumber: '07',
        title: 'Quality Control',
        status: qcStatus,
        targetTab: 'qc',
        targetTabLabel: 'Buka Tab Dashboard QC',
        summary: 'Evaluasi kontrol mutu internal pada grafik Levey-Jennings dan aturan Westgard.',
        detailNote:
          qcStatus === 'Menunggu'
            ? 'Belum dijalankan untuk spesimen ini. Buka Dashboard QC atau selesaikan validasi hasil.'
            : hasQcAttention
            ? `${currentQc.label}: Terdeteksi pelanggaran ${westgardViolations
                .map((v) => v.rule)
                .join(', ')} (Z-Score terakhir ${latestZScore.toFixed(2)} SD).`
            : `${currentQc.label} terkendali dalam batas ±2 SD (Z-Score ${latestZScore.toFixed(2)} SD).`,
        icon: <ChartNoAxesCombined className="w-4 h-4" strokeWidth={1.75} />,
      },
      {
        id: 'ai_qi',
        stepNumber: '08',
        title: 'AI Quality Intelligence',
        status: aiQiStatus,
        targetTab: 'ai_qi',
        targetTabLabel: 'Buka Tab AI Quality Intelligence',
        summary: 'Sintesis otomatis tren QC statistik dan anomali Delta Check (Simulasi).',
        detailNote:
          aiQiStatus === 'Menunggu'
            ? 'Belum dijalankan. Menunggu evaluasi QC dan validasi hasil selesai.'
            : hasQcAttention || hasResultAttention
            ? 'Terdapat catatan peninjauan pada tren QC atau Delta Check pasien yang perlu dikonfirmasi sebelum rilis akhir.'
            : 'Tidak ditemukan indikasi pergeseran sistematik maupun lonjakan Delta Check.',
        icon: <BrainCircuit className="w-4 h-4" strokeWidth={1.75} />,
      },
      {
        id: 'report',
        stepNumber: '09',
        title: 'Hasil dan Laporan',
        status: reportStatus,
        targetTab: 'results',
        targetTabLabel: 'Lihat Ringkasan Hasil',
        summary: 'Dokumen hasil diagnostik tervalidasi siap diterbitkan kepada unit pengirim.',
        detailNote:
          reportStatus === 'Menunggu'
            ? 'Belum tersedia. Laporan hanya diterbitkan setelah spesimen berstatus Tervalidasi.'
            : reportStatus === 'Sedang diproses'
            ? 'Validasi selesai, namun terdapat peringatan QC aktif yang perlu ditinjau sebelum distribusi.'
            : `Laporan simulasi untuk ${selectedOrder.barcode} (${selectedOrder.patientName}) siap dirilis.`,
        icon: <FileCheck className="w-4 h-4" strokeWidth={1.75} />,
      },
    ];
  }, [
    activeTab,
    currentQc.label,
    flaggedParameters,
    hasQcAttention,
    hasResultAttention,
    latestZScore,
    linkedPatient,
    selectedOrder,
    stageIdx,
    westgardViolations,
  ]);

  // Automatically focus inspection card on active node when demo progresses
  const activeNodeIndex = useMemo(() => {
    const idx = nodes.findIndex(
      (n) => n.status === 'Sedang diproses' || n.status === 'Perlu perhatian'
    );
    return idx;
  }, [nodes]);

  useEffect(() => {
    if (hasProgress && activeNodeIndex >= 0) {
      setInspectedId(nodes[activeNodeIndex].id);
    }
  }, [activeNodeIndex, hasProgress, nodes]);

  const inspectedNode = nodes.find((n) => n.id === inspectedId) || nodes[0];

  const getStatusTextColor = (status: PipelineNodeStatus) => {
    switch (status) {
      case 'Selesai':
        return 'text-[#16A085]';
      case 'Sedang diproses':
        return 'text-[#0756B8]';
      case 'Perlu perhatian':
        return 'text-amber-700';
      default:
        return 'text-slate-500';
    }
  };

  const getNodeCircleClass = (status: PipelineNodeStatus, isSelected: boolean) => {
    const ring = isSelected ? 'ring-2 ring-offset-2 ring-[#0F2747]' : '';
    switch (status) {
      case 'Selesai':
        return `bg-[#0756B8] text-white border-[#0756B8] ${ring}`;
      case 'Sedang diproses':
        return `bg-white text-[#0756B8] border-2 border-[#38BDF8] shadow-[0_0_0_4px_rgba(56,189,248,0.22)] ${ring}`;
      case 'Perlu perhatian':
        return `bg-amber-50 text-amber-700 border-2 border-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.16)] ${ring}`;
      default:
        return `bg-slate-50 text-slate-400 border border-slate-300 ${ring}`;
    }
  };

  return (
    <section
      aria-labelledby="pipeline-section-title"
      className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 space-y-6"
    >
      {/* Header & Specimen Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <h3 id="pipeline-section-title" className="text-xl font-bold text-[#0F2747]">
            Alur Proses Laboratorium
          </h3>
          <p className="text-sm text-slate-600">
            Pantau perjalanan spesimen dan data melalui setiap tahap proses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <label htmlFor="pipeline-specimen-select" className="font-semibold text-slate-600">
              Spesimen Simulasi:
            </label>
            <select
              id="pipeline-specimen-select"
              value={selectedOrder.id}
              onChange={(e) => onSelectOrder(e.target.value)}
              className="px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white text-[#0F2747] focus:outline-none focus:ring-2 focus:ring-[#0756B8]"
            >
              {orders.map((ord) => (
                <option key={ord.id} value={ord.id}>
                  {ord.barcode} — {ord.patientName} ({ord.stage})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              onResetSimulation();
              setInspectedId('registration');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0F2747] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Reset Simulasi</span>
          </button>
        </div>
      </div>

      {/* Active Specimen Metadata Strip (unboxed text separators) */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
        <span>
          ID Spesimen:{' '}
          <strong className="font-mono text-[#0756B8] tabular-nums">{selectedOrder.barcode}</strong>
        </span>
        <span aria-hidden="true">·</span>
        <span>
          Pasien: <strong className="text-[#0F2747]">{selectedOrder.patientName}</strong>
        </span>
        <span aria-hidden="true">·</span>
        <span>
          Panel: <strong className="text-[#0F2747]">{selectedOrder.panelName}</strong>
        </span>
        <span aria-hidden="true">·</span>
        <span>
          Tahap Spesimen Saat Ini:{' '}
          <strong className="text-[#0756B8]">{selectedOrder.stage}</strong>
        </span>
      </div>

      {/* DESKTOP HORIZONTAL PIPELINE */}
      <div className="hidden lg:block overflow-x-auto pb-2">
        <div className="flex items-start justify-between min-w-[960px]">
          {nodes.map((node, idx) => {
            const isSelected = inspectedNode.id === node.id;
            const prevNode = idx > 0 ? nodes[idx - 1] : null;
            const connectorDone = prevNode?.status === 'Selesai' && node.status === 'Selesai';
            const connectorActive =
              hasProgress &&
              (node.status === 'Sedang diproses' || node.status === 'Perlu perhatian') &&
              prevNode !== null;

            return (
              <React.Fragment key={node.id}>
                {idx > 0 && (
                  <div className="flex-1 flex items-center pt-5 px-1 min-w-[20px]">
                    <div className="relative w-full h-0.5 bg-slate-200 overflow-hidden rounded-full">
                      {(connectorDone || connectorActive) && (
                        <div
                          className={`absolute inset-y-0 left-0 w-full ${
                            node.status === 'Perlu perhatian'
                              ? 'bg-amber-400/70'
                              : 'bg-[#0756B8]'
                          }`}
                        />
                      )}
                      {connectorActive && (
                        <span
                          aria-hidden="true"
                          className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-1.5 rounded-full animate-pipeline-x ${
                            node.status === 'Perlu perhatian'
                              ? 'bg-amber-500'
                              : 'bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]'
                          }`}
                        />
                      )}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setInspectedId(node.id)}
                  className="group flex flex-col items-center text-center w-[94px] shrink-0 focus:outline-none"
                >
                  <div className="relative">
                    {hasProgress &&
                      (node.status === 'Sedang diproses' || node.status === 'Perlu perhatian') && (
                        <span
                          aria-hidden="true"
                          className={`absolute -inset-1 rounded-full animate-pulse ${
                            node.status === 'Perlu perhatian'
                              ? 'bg-amber-400/25'
                              : 'bg-[#38BDF8]/30'
                          }`}
                        />
                      )}
                    <div
                      className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${getNodeCircleClass(
                        node.status,
                        isSelected
                      )}`}
                    >
                      {node.icon}
                    </div>
                    {node.status === 'Selesai' && (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#16A085] text-white flex items-center justify-center border-2 border-white"
                      >
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      </span>
                    )}
                    {node.status === 'Perlu perhatian' && (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center border-2 border-white"
                      >
                        <AlertTriangle className="w-2.5 h-2.5" strokeWidth={2.5} />
                      </span>
                    )}
                  </div>

                  <span className="mt-2.5 text-[11px] font-mono text-slate-400 tabular-nums">
                    {node.stepNumber}
                  </span>
                  <span className="mt-0.5 text-xs font-semibold text-[#0F2747] leading-tight group-hover:text-[#0756B8]">
                    {node.title}
                  </span>
                  <span className={`mt-1 text-[11px] font-medium ${getStatusTextColor(node.status)}`}>
                    {node.status}
                  </span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* MOBILE & TABLET VERTICAL PIPELINE */}
      <div className="lg:hidden space-y-0">
        {nodes.map((node, idx) => {
          const isSelected = inspectedNode.id === node.id;
          const nextNode = idx < nodes.length - 1 ? nodes[idx + 1] : null;
          const nextConnectorDone = node.status === 'Selesai' && nextNode?.status === 'Selesai';
          const nextConnectorActive =
            hasProgress &&
            nextNode !== null &&
            (nextNode.status === 'Sedang diproses' || nextNode.status === 'Perlu perhatian');

          return (
            <div key={node.id} className="flex items-stretch gap-3.5">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setInspectedId(node.id)}
                  aria-label={`${node.title}: ${node.status}`}
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${getNodeCircleClass(
                    node.status,
                    isSelected
                  )}`}
                >
                  {hasProgress &&
                    (node.status === 'Sedang diproses' || node.status === 'Perlu perhatian') && (
                      <span
                        aria-hidden="true"
                        className={`absolute -inset-1 rounded-full animate-pulse ${
                          node.status === 'Perlu perhatian'
                            ? 'bg-amber-400/25'
                            : 'bg-[#38BDF8]/30'
                        }`}
                      />
                    )}
                  {node.icon}
                  {node.status === 'Selesai' && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#16A085] text-white flex items-center justify-center border-2 border-white">
                      <Check className="w-2.5 h-2.5" strokeWidth={3} />
                    </span>
                  )}
                  {node.status === 'Perlu perhatian' && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center border-2 border-white">
                      <AlertTriangle className="w-2.5 h-2.5" strokeWidth={2.5} />
                    </span>
                  )}
                </button>

                {idx < nodes.length - 1 && (
                  <div className="relative w-0.5 flex-1 min-h-[26px] bg-slate-200 my-1 overflow-hidden">
                    {(nextConnectorDone || nextConnectorActive) && (
                      <div
                        className={`absolute inset-x-0 top-0 h-full ${
                          nextNode?.status === 'Perlu perhatian'
                            ? 'bg-amber-400/70'
                            : 'bg-[#0756B8]'
                        }`}
                      />
                    )}
                    {nextConnectorActive && (
                      <span
                        aria-hidden="true"
                        className={`absolute left-1/2 -translate-x-1/2 w-1.5 h-3 rounded-full animate-pipeline-y ${
                          nextNode?.status === 'Perlu perhatian'
                            ? 'bg-amber-500'
                            : 'bg-[#38BDF8]'
                        }`}
                      />
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setInspectedId(node.id)}
                className={`flex-1 text-left pb-4 pt-1 focus:outline-none ${
                  isSelected ? 'opacity-100' : 'opacity-90'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-[#0F2747]">
                    {node.stepNumber}. {node.title}
                  </span>
                  <span
                    className={`text-xs font-semibold whitespace-nowrap shrink-0 ${getStatusTextColor(
                      node.status
                    )}`}
                  >
                    {node.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{node.summary}</p>
              </button>
            </div>
          );
        })}
      </div>

      {/* Selected Node Inspection Panel */}
      <div className="border border-slate-200 rounded-xl bg-slate-50/70 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono font-bold text-[#0F2747]">
              TAHAP {inspectedNode.stepNumber}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-bold text-[#0F2747]">{inspectedNode.title}</span>
            <span aria-hidden="true">·</span>
            <span
              className={`inline-flex items-center gap-1 font-semibold ${getStatusTextColor(
                inspectedNode.status
              )}`}
            >
              {inspectedNode.status === 'Selesai' && <Check className="w-3.5 h-3.5" />}
              {inspectedNode.status === 'Perlu perhatian' && (
                <AlertTriangle className="w-3.5 h-3.5" />
              )}
              {inspectedNode.status === 'Menunggu' && <Clock3 className="w-3.5 h-3.5" />}
              <span>{inspectedNode.status}</span>
            </span>
          </div>

          <p className="text-sm font-medium text-[#0F2747]">{inspectedNode.detailNote}</p>
          <p className="text-xs text-slate-500">{inspectedNode.summary}</p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab(inspectedNode.targetTab)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#0756B8] bg-white border border-slate-300 rounded-lg hover:bg-sky-50 transition-colors whitespace-nowrap shrink-0 self-start md:self-center"
        >
          <span>{inspectedNode.targetTabLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}
