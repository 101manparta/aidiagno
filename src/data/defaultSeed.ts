import {
  Article,
  HomepageContent,
  MediaAsset,
  PricingPlan,
  Product,
  SiteSettings,
} from '../types/cms';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandName: 'AI Diagno',
  logoUrl: '/assets/aistudio/image_15ff9196.png',
  contactEmail: '',
  contactWhatsapp: '',
  officeAddress: '',
  seoTitle: 'AI Diagno — Platform Smart LIS & Quality Intelligence Laboratorium',
  seoDescription:
    'Platform teknologi laboratorium klinik untuk Smart LIS, Quality Intelligence, dan otomasi alur kerja diagnostik yang terstruktur dan presisi.',
  footerNote: 'Platform Teknologi Informasi & Kendali Mutu Laboratorium Klinik.',
  updatedBy: 'system',
};

export const DEFAULT_HOMEPAGE_CONTENT: HomepageContent = {
  status: 'published',
  heroTitle: 'Infrastruktur Digital dan Kendali Mutu Laboratorium Klinik Modern',
  heroSubtitle:
    'AI Diagno menyatukan sistem informasi laboratorium (Smart LIS), pemantauan kendali mutu statistik, dan otomasi alur kerja untuk mendukung akurasi diagnostik fasilitas kesehatan.',
  heroPrimaryCta: 'Minta Konsultasi',
  heroSecondaryCta: 'Jelajahi Demo',
  heroImageUrl: '/src/assets/images/hero_clinical_lab_1795651796762.jpg',
  challenges: [
    {
      id: 'ch-1',
      title: 'Fragmentasi Pencatatan Pra-Analitik',
      description:
        'Pendaftaran pasien, pelabelan tabung, dan penerimaan sampel yang masih terpisah meningkatkan risiko tertukarnya spesimen serta memperlambat waktu tunggu.',
    },
    {
      id: 'ch-2',
      title: 'Deteksi Penyimpangan QC yang Terlambat',
      description:
        'Evaluasi kontrol kualitas internal secara manual di akhir pekan berisiko melewatkan pergeseran kalibrasi alat sebelum hasil pasien dirilis.',
    },
    {
      id: 'ch-3',
      title: 'Validasi Hasil & Delta Check Manual',
      description:
        'Analis dan penanggung jawab laboratorium membutuhkan perbandingan cepat terhadap riwayat pemeriksaan sebelumnya untuk menandai perubahan klinis signifikan.',
    },
    {
      id: 'ch-4',
      title: 'Keterbatasan Visibilitas Operasional',
      description:
        'Manajemen kesulitan memantau Turnaround Time (TAT) per unit pemeriksaan serta status sampel secara real-time tanpa laporan yang terstruktur.',
    },
  ],
  solutionsIntro:
    'Tiga pilar platform yang dirancang modular agar klinik, laboratorium mandiri, maupun rumah sakit dapat mengadopsi sistem sesuai kesiapan operasionalnya.',
  differentiators: [
    {
      id: 'diff-1',
      title: 'Transparansi Kesiapan Fitur',
      description:
        'Setiap modul memisahkan dengan tegas fitur yang siap pakai, fitur dalam pengembangan, dan modul yang memerlukan integrasi kustom dengan alat lab Anda.',
    },
    {
      id: 'diff-2',
      title: 'Kendali Mutu Berbasis Statistik Tervalidasi',
      description:
        'Grafik Levey-Jennings, aturan Westgard yang dapat dikonfigurasi, dan Delta Check dirancang mengikuti praktik baku mutu laboratorium klinik.',
    },
    {
      id: 'diff-3',
      title: 'Arsitektur Keamanan & Kontrol Akses',
      description:
        'Pemisahan peran pengguna yang ketat serta pencatatan riwayat perubahan untuk mendukung tata kelola data diagnostik dan administrasi.',
    },
    {
      id: 'diff-4',
      title: 'Skalabel dari Klinik ke Rumah Sakit',
      description:
        'Struktur paket dan alur kerja dapat disesuaikan untuk laboratorium pratama bervolume rendah hingga fasilitas multi-departemen.',
    },
  ],
  ctaTitle: 'Diskusikan Kebutuhan Digitalisasi Laboratorium Anda',
  ctaSubtitle:
    'Jadwalkan sesi konsultasi teknis atau tinjauan alur kerja bersama tim AI Diagno untuk memetakan implementasi yang tepat bagi fasilitas Anda.',
  aboutMission:
    'Menghadirkan sistem informasi laboratorium dan perangkat kendali mutu yang mudah diadopsi, transparan dalam kapabilitas, serta mendukung akurasi keputusan klinis di Indonesia.',
  aboutVision:
    'Menjadi fondasi teknologi diagnostik tepercaya bagi klinik, laboratorium mandiri, dan rumah sakit melalui tata kelola data analitik yang terstandar.',
  demoEnabled: true,
  demoDefaultTab: 'registration',
  demoBannerNote:
    'Lingkungan demo interaktif menggunakan data laboratorium simulasi dan terisolasi sepenuhnya dari data produksi.',
  updatedBy: 'system',
};

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'smart-lis',
    slug: 'smart-lis',
    name: 'Smart LIS',
    tagline: 'Sistem Informasi Laboratorium End-to-End dari Registrasi hingga Laporan Hasil',
    summary:
      'Mengelola alur administrasi dan analitik laboratorium secara terpadu dengan pelacakan barcode, entri hasil terstruktur, validasi berjenjang, serta riwayat pemeriksaan pasien.',
    iconKey: 'test-tubes',
    imageUrl: '/src/assets/images/product_smart_lis_1795651796219.jpg',
    sortOrder: 1,
    status: 'published',
    features: [
      {
        id: 'sl-1',
        title: 'Pendaftaran Pasien',
        description:
          'Pencatatan identitas pasien, penjamin, dokter pengirim, dan pencarian rekam laboratorium secara cepat.',
        availability: 'available',
      },
      {
        id: 'sl-2',
        title: 'Order Pemeriksaan',
        description:
          'Pemilihan panel atau parameter tunggal dengan perhitungan tarif otomatis dan catatan klinis pra-analitik.',
        availability: 'available',
      },
      {
        id: 'sl-3',
        title: 'Pelacakan Barcode & Sampel',
        description:
          'Pembuatan ID spesimen unik dan pemantauan status dari pengambilan hingga tahap validasi.',
        availability: 'available',
      },
      {
        id: 'sl-4',
        title: 'Entri & Validasi Hasil',
        description:
          'Penandaan nilai di luar rentang rujukan serta proses verifikasi bertingkat oleh analis dan dokter penanggung jawab.',
        availability: 'available',
      },
      {
        id: 'sl-5',
        title: 'Laporan Hasil Pemeriksaan',
        description:
          'Format laporan hasil diagnostik yang rapi, siap cetak atau dibagikan secara digital dengan identitas fasilitas.',
        availability: 'available',
      },
      {
        id: 'sl-6',
        title: 'Riwayat Pemeriksaan Pasien',
        description:
          'Penelusuran hasil historis pasien untuk mendukung pemantauan klinis berkelanjutan dan Delta Check.',
        availability: 'available',
      },
      {
        id: 'sl-7',
        title: 'Integrasi SIMRS / Rekam Medis Elektronik',
        description:
          'Koneksi dua arah untuk pengiriman order dan pengembalian hasil ke sistem informasi rumah sakit atau klinik.',
        availability: 'custom_integration',
      },
    ],
    updatedBy: 'system',
  },
  {
    id: 'quality-intelligence',
    slug: 'quality-intelligence',
    name: 'Quality Intelligence',
    tagline: 'Pemantauan Kendali Mutu Internal dan Analitik Akurasi Diagnostik',
    summary:
      'Membantu tim mutu memantau stabilitas reagen dan instrumen secara konsisten melalui grafik Levey-Jennings, aturan QC terkonfigurasi, dan pemeriksaan Delta Check.',
    iconKey: 'shield-check',
    imageUrl: '/src/assets/images/product_quality_intel_1795651796372.jpg',
    sortOrder: 2,
    status: 'published',
    features: [
      {
        id: 'qi-1',
        title: 'Pemantauan QC Harian',
        description:
          'Pencatatan hasil bahan kontrol per level, lot reagen, dan instrumen dengan evaluasi status instan.',
        availability: 'available',
      },
      {
        id: 'qi-2',
        title: 'Grafik Levey-Jennings',
        description:
          'Visualisasi nilai kontrol terhadap garis Mean, ±1SD, ±2SD, dan ±3SD untuk mendeteksi tren maupun pergeseran.',
        availability: 'available',
      },
      {
        id: 'qi-3',
        title: 'Aturan QC Terkonfigurasi',
        description:
          'Penyesuaian aturan multi-rule Westgard (1-2s, 1-3s, 2-2s, R-4s, 4-1s, 10x) sesuai standar masing-masing parameter.',
        availability: 'available',
      },
      {
        id: 'qi-4',
        title: 'Delta Check',
        description:
          'Perbandingan otomatis hasil pemeriksaan saat ini dengan riwayat pasien sebelumnya guna mendeteksi variasi tak wajar.',
        availability: 'available',
      },
      {
        id: 'qi-5',
        title: 'Analitik Mutu Laboratorium',
        description:
          'Ringkasan koefisien variasi (%CV), bias, dan tingkat pelanggaran QC per periode evaluasi.',
        availability: 'available',
      },
      {
        id: 'qi-6',
        title: 'Asisten Deteksi Anomali AI Tervalidasi',
        description:
          'Dukungan analisis pola penyimpangan pra-analitik dan rekomendasi tindak lanjut yang saat ini berada pada tahap validasi klinis.',
        availability: 'planned',
      },
    ],
    updatedBy: 'system',
  },
  {
    id: 'laboratory-automation',
    slug: 'laboratory-automation',
    name: 'Laboratory Automation',
    tagline: 'Otomasi Alur Kerja, Notifikasi Kritis, dan Integrasi Operasional',
    summary:
      'Mengurangi pekerjaan administratif berulang melalui pengaturan alur kerja otomatis, peringatan nilai kritis, serta pemantauan kinerja operasional laboratorium.',
    iconKey: 'workflow',
    imageUrl: '/src/assets/images/product_lab_auto_1795651796304.jpg',
    sortOrder: 3,
    status: 'published',
    features: [
      {
        id: 'la-1',
        title: 'Otomasi Alur Kerja',
        description:
          'Pemetaan rute sampel otomatis berdasarkan jenis pemeriksaan dan prioritas penanganan (Cito / Rutin).',
        availability: 'available',
      },
      {
        id: 'la-2',
        title: 'Notifikasi & Peringatan Kritis',
        description:
          'Pemberitahuan terstruktur kepada petugas validasi apabila ditemukan nilai kritis atau pelanggaran QC.',
        availability: 'available',
      },
      {
        id: 'la-3',
        title: 'Analitik Operasional & TAT',
        description:
          'Pengukuran waktu penyelesaian pemeriksaan dari registrasi hingga rilis hasil untuk identifikasi hambatan alur.',
        availability: 'available',
      },
      {
        id: 'la-4',
        title: 'Interfacing Alat Laboratorium (HL7 / ASTM)',
        description:
          'Integrasi komunikasi langsung dengan analyzer hematologi, kimia klinik, dan imunologi milik fasilitas.',
        availability: 'custom_integration',
      },
      {
        id: 'la-5',
        title: 'Orkestrasi Laboratorium Multi-Cabang',
        description:
          'Konsolidasi rujukan sampel antar cabang dan pemantauan kapasitas terpusat dalam pengembangan lanjutan.',
        availability: 'planned',
      },
    ],
    updatedBy: 'system',
  },
];

export const DEFAULT_PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    slug: 'starter',
    name: 'Starter',
    targetAudience: 'Untuk klinik pratama dan laboratorium bervolume kecil',
    description:
      'Fondasi Smart LIS inti untuk mendigitalkan pendaftaran pasien, order pemeriksaan, pelacakan barcode, serta laporan hasil.',
    showPrice: false,
    isCustomQuote: true,
    currency: 'IDR',
    monthlyPrice: null,
    annualPrice: null,
    implementationFee: null,
    billingNote: 'Mendukung skema langganan bulanan atau tahunan serta biaya implementasi awal.',
    ctaLabel: 'Ajukan Penawaran Starter',
    highlighted: false,
    sortOrder: 1,
    status: 'published',
    features: [
      { label: 'Modul Inti', value: 'Smart LIS Dasar' },
      { label: 'Pelacakan Sampel', value: 'Barcode & Status Sampel' },
      { label: 'Validasi Hasil', value: 'Rentang Rujukan & Cetak Laporan' },
      { label: 'Quality Intelligence', value: 'Pencatatan QC Harian Dasar' },
      { label: 'Integrasi Alat', value: 'Opsional (Integrasi Kustom)' },
    ],
    updatedBy: 'system',
  },
  {
    id: 'professional',
    slug: 'professional',
    name: 'Professional',
    targetAudience: 'Untuk laboratorium klinik mandiri dan klinik utama yang berkembang',
    description:
      'Paket lengkap Smart LIS dan Quality Intelligence dengan grafik Levey-Jennings, Westgard rules, Delta Check, serta analitik operasional.',
    showPrice: false,
    isCustomQuote: true,
    currency: 'IDR',
    monthlyPrice: null,
    annualPrice: null,
    implementationFee: null,
    billingNote: 'Tersedia opsi langganan bulanan/tahunan dan paket pendampingan implementasi.',
    ctaLabel: 'Minta Konsultasi Professional',
    highlighted: true,
    sortOrder: 2,
    status: 'published',
    features: [
      { label: 'Modul Inti', value: 'Smart LIS Lengkap + Riwayat Pasien' },
      { label: 'Quality Intelligence', value: 'Levey-Jennings & Aturan Westgard' },
      { label: 'Keamanan Validasi', value: 'Delta Check & Notifikasi Nilai Kritis' },
      { label: 'Analitik Operasional', value: 'Pemantauan TAT & Beban Sampel' },
      { label: 'Integrasi Alat', value: 'Dukungan Konfigurasi Analyzer (Kustom)' },
    ],
    updatedBy: 'system',
  },
  {
    id: 'enterprise',
    slug: 'enterprise',
    name: 'Enterprise',
    targetAudience: 'Untuk rumah sakit dan jaringan fasilitas diagnostik',
    description:
      'Arsitektur yang disesuaikan dengan kebutuhan integrasi SIMRS, interfacing multi-analyzer, dan tata kelola peran kompleks.',
    showPrice: false,
    isCustomQuote: true,
    currency: 'IDR',
    monthlyPrice: null,
    annualPrice: null,
    implementationFee: null,
    billingNote: 'Penawaran kustom sesuai lingkup integrasi, jumlah instrumen, dan kebutuhan SLA.',
    ctaLabel: 'Hubungi Tim Enterprise',
    highlighted: false,
    sortOrder: 3,
    status: 'published',
    features: [
      { label: 'Modul Inti', value: 'Smart LIS + Quality Intelligence + Otomasi' },
      { label: 'Interfacing Sistem', value: 'Integrasi Kustom SIMRS / HL7 / ASTM' },
      { label: 'Kontrol Akses', value: 'RBAC Multi-Peran & Audit Log' },
      { label: 'Implementasi', value: 'Migrasi Data & Pelatihan Tim Teknis' },
      { label: 'Dukungan', value: 'Penawaran & SLA Khusus Fasilitas' },
    ],
    updatedBy: 'system',
  },
];

export const DEFAULT_ARTICLES: Article[] = [
  {
    id: 'penerapan-westgard-levey-jennings',
    slug: 'penerapan-westgard-levey-jennings',
    title: 'Penerapan Grafik Levey-Jennings dan Aturan Westgard dalam Pemantauan Mutu Internal',
    category: 'Kendali Mutu',
    excerpt:
      'Panduan praktis membaca pergeseran dan tren pada grafik Levey-Jennings serta menentukan kapan aturan multi-rule Westgard perlu memicu peninjauan ulang alat.',
    content:
      'Pemantauan mutu internal (Internal Quality Control) merupakan garda terdepan untuk memastikan keandalan setiap hasil laboratorium sebelum dikeluarkan kepada klinisi.\n\nDengan grafik Levey-Jennings, nilai bahan kontrol yang diukur setiap hari diplot terhadap nilai rata-rata (Mean) dan simpangan baku (SD) yang telah ditetapkan. Kesalahan acak maupun kesalahan sistematik dapat dikenali lebih awal sebelum memengaruhi sampel pasien.\n\nPenerapan aturan Westgard seperti 1-2s sebagai peringatan awal, 1-3s untuk penolakan kesalahan acak, serta 2-2s dan 4-1s untuk mendeteksi pergeseran kalibrasi membantu analis laboratorium mengambil keputusan objektif tanpa menghentikan operasional secara berlebihan.',
    coverImageUrl: '/src/assets/images/product_quality_intel_1795651796372.jpg',
    authorName: 'Tim Mutu Diagnostik AI Diagno',
    readMinutes: 5,
    status: 'published',
    publishedDate: '2026-10-14',
    updatedBy: 'system',
  },
  {
    id: 'pelacakan-barcode-pra-analitik',
    slug: 'pelacakan-barcode-pra-analitik',
    title: 'Menekan Kesalahan Pra-Analitik melalui Pelacakan Barcode Spesimen Terstruktur',
    category: 'Operasional LIS',
    excerpt:
      'Sebagian besar ketidaksesuaian hasil laboratorium berawal pada tahap pra-analitik. Pelacakan barcode membantu menjaga identitas spesimen tetap konsisten dari loket hingga analyzer.',
    content:
      'Tahap pra-analitik mencakup pendaftaran pasien, identifikasi permintaan pemeriksaan, pengambilan darah atau spesimen, hingga pelabelan dan distribusi ke meja kerja analitik.\n\nTanpa identifikasi barcode yang terhubung langsung ke order pemeriksaan, transkripsi manual berisiko menimbulkan ketidaksesuaian antara identitas pasien dan tabung spesimen.\n\nSistem informasi laboratorium yang mencatat setiap perpindahan status sampel—mulai dari registrasi, flebotomi, penerimaan di lab, proses analitik, hingga validasi akhir—memberikan visibilitas penuh bagi kepala laboratorium dan mempercepat penelusuran apabila terjadi keterlambatan.',
    coverImageUrl: '/src/assets/images/product_smart_lis_1795651796219.jpg',
    authorName: 'Tim Produk Smart LIS AI Diagno',
    readMinutes: 4,
    status: 'published',
    publishedDate: '2026-10-28',
    updatedBy: 'system',
  },
  {
    id: 'delta-check-validasi-hasil',
    slug: 'delta-check-validasi-hasil',
    title: 'Peran Delta Check dalam Memperkuat Proses Validasi Hasil Pasien',
    category: 'Validasi Klinis',
    excerpt:
      'Membandingkan hasil pemeriksaan terkini dengan riwayat pasien sebelumnya membantu mendeteksi kemungkinan kesalahan identifikasi sampel atau perubahan kondisi klinis akut.',
    content:
      'Validasi hasil laboratorium tidak cukup hanya bergantung pada rentang rujukan populasi umum. Seorang pasien dapat memiliki hasil yang masih berada dalam rentang normal, namun berubah drastis dibandingkan hasil pemeriksaannya beberapa hari sebelumnya.\n\nDelta Check menghitung selisih absolut maupun persentase perubahan suatu analit terhadap hasil historis pasien yang sama. Ketika ambang batas terlampaui, sistem memberikan penanda kepada validator untuk meninjau ulang sampel, kondisi pra-analitik, atau mengonfirmasi kepada unit klinis pengirim.\n\nIntegrasi Delta Check ke dalam alur entri hasil mempercepat kerja verifikator tanpa mengorbankan ketelitian diagnostik.',
    coverImageUrl: '/src/assets/images/product_lab_auto_1795651796304.jpg',
    authorName: 'Tim Riset Klinis AI Diagno',
    readMinutes: 4,
    status: 'published',
    publishedDate: '2026-11-10',
    updatedBy: 'system',
  },
];

export const DEFAULT_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'asset-logo',
    title: 'Logo Resmi AI Diagno',
    altText: 'Logo AI Diagno biru heksagonal dengan simbol medis',
    url: '/assets/aistudio/image_15ff9196.png',
    category: 'Identitas Brand',
    updatedBy: 'system',
  },
  {
    id: 'asset-hero-lab',
    title: 'Fasilitas Laboratorium Klinik Modern',
    altText: 'Interior laboratorium klinik modern dengan analyzer hematologi dan kimia klinik',
    url: '/src/assets/images/hero_clinical_lab_1795651796762.jpg',
    category: 'Hero & Fasilitas',
    updatedBy: 'system',
  },
  {
    id: 'asset-hero-backdrop',
    title: 'Latar Belakang Panorama Laboratorium Diagnostik HD',
    altText: 'Panorama interior laboratorium diagnostik dengan partisi kaca, instrumen otomatis, dan rak spesimen',
    url: '/src/assets/images/hero_lab_backdrop_1795654387973.jpg',
    category: 'Hero & Fasilitas',
    updatedBy: 'system',
  },
  {
    id: 'asset-smart-lis',
    title: 'Rak Tabung Spesimen Barcode Smart LIS',
    altText: 'Tabung sampel darah dengan label barcode di rak laboratorium dekat scanner',
    url: '/src/assets/images/product_smart_lis_1795651796219.jpg',
    category: 'Produk',
    updatedBy: 'system',
  },
  {
    id: 'asset-quality-intel',
    title: 'Stasiun Kalibrasi Quality Intelligence',
    altText: 'Stasiun kalibrasi instrumen diagnostik dengan kuvet optik dan reagen kontrol',
    url: '/src/assets/images/product_quality_intel_1795651796372.jpg',
    category: 'Produk',
    updatedBy: 'system',
  },
  {
    id: 'asset-lab-auto',
    title: 'Jalur Otomasi Sampel Laboratorium',
    altText: 'Sistem konveyor sampel dan pipetting otomatis laboratorium klinik',
    url: '/src/assets/images/product_lab_auto_1795651796304.jpg',
    category: 'Produk',
    updatedBy: 'system',
  },
];
