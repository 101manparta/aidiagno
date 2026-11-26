export type DemoTab =
  | 'registration'
  | 'orders'
  | 'tracking'
  | 'results'
  | 'qc'
  | 'ai_qi';

export type SampleStage =
  | 'Registrasi'
  | 'Pengambilan'
  | 'Pra-Analitik'
  | 'Analitik'
  | 'Menunggu Validasi'
  | 'Tervalidasi';

export interface SimPatient {
  id: string;
  rmNumber: string;
  name: string;
  age: number;
  gender: 'Laki-laki' | 'Perempuan';
  referringUnit: string;
}

export interface SimResultParameter {
  code: string;
  name: string;
  value: number;
  previousValue: number;
  unit: string;
  refMin: number;
  refMax: number;
  deltaThresholdPct: number;
}

export interface SimOrder {
  id: string;
  barcode: string;
  patientId: string;
  patientName: string;
  panelName: string;
  priority: 'Rutin' | 'Cito';
  stage: SampleStage;
  createdAtLabel: string;
  validatedBy?: string;
  parameters: SimResultParameter[];
}

export interface WestgardViolation {
  rule: string;
  severity: 'warning' | 'reject';
  detail: string;
}

export interface QcSeriesConfig {
  id: string;
  label: string;
  analyte: string;
  unit: string;
  lot: string;
  mean: number;
  sd: number;
  points: { run: string; value: number }[];
}
