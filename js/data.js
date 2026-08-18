/**
 * Data Awal & Bank Materi PAI (Pendidikan Agama Islam) SD & SMP THHK
 */

const DEFAULT_SETTINGS = {
  schoolName: "SEKOLAH THHK",
  teacherName: "Guru Pendidikan Agama Islam",
  teacherNip: "-",
  headmasterName: "Kepala Sekolah THHK",
  headmasterNip: "-",
  academicYear: "2024/2025",
  semester: "1 (Ganjil)",
  defaultKktp: 75
};

const DEFAULT_CLASSES = [
  // Jenjang SD (Kelas 1 - 6)
  { id: "sd-1", level: "SD", name: "Kelas 1 SD", code: "1", phase: "Fase A" },
  { id: "sd-2", level: "SD", name: "Kelas 2 SD", code: "2", phase: "Fase A" },
  { id: "sd-3", level: "SD", name: "Kelas 3 SD", code: "3", phase: "Fase B" },
  { id: "sd-4", level: "SD", name: "Kelas 4 SD", code: "4", phase: "Fase B" },
  { id: "sd-5", level: "SD", name: "Kelas 5 SD", code: "5", phase: "Fase C" },
  { id: "sd-6", level: "SD", name: "Kelas 6 SD", code: "6", phase: "Fase C" },
  // Jenjang SMP (Kelas 7 - 9)
  { id: "smp-7", level: "SMP", name: "Kelas 7 SMP", code: "7", phase: "Fase D" },
  { id: "smp-8", level: "SMP", name: "Kelas 8 SMP", code: "8", phase: "Fase D" },
  { id: "smp-9", level: "SMP", name: "Kelas 9 SMP", code: "9", phase: "Fase D" }
];

// Bank Materi PAI Lengkap untuk SD dan SMP (Template Silabus)
const PAI_SYLLABUS = [
  // --- KELAS 1 SD (Fase A) ---
  {
    classId: "sd-1",
    level: "SD",
    chapter: "Bab 1: Aku Cinta Al-Qur'an",
    aspect: "Al-Qur'an Hadis",
    topic: "Mengenal Huruf Hijaiyyah dan Harakat (Fathah, Kasrah, Dhammah)",
    tp: "Peserta didik mampu melafalkan dan mengenali huruf hijaiyyah berharakat dengan benar.",
    activities: "Membaca bersama, kartu huruf hijaiyyah, menulis harakat dasar, dan menyanyi huruf hijaiyyah."
  },
  {
    classId: "sd-1",
    level: "SD",
    chapter: "Bab 2: Mengenal Rukun Iman",
    aspect: "Akidah",
    topic: "Iman kepada Allah Swt. dan Pengenalan Ciptaan-Nya",
    tp: "Peserta didik mampu menyebutkan 6 Rukun Iman dan meyakini Allah sebagai Pencipta alam semesta.",
    activities: "Menyanyikan lagu Rukun Iman, mewarnai gambar alam ciptaan Allah, diskusi tanya jawab."
  },
  {
    classId: "sd-1",
    level: "SD",
    chapter: "Bab 3: Aku Suka Bersuci",
    aspect: "Fikih",
    topic: "Tata Cara Berwudhu dan Doa Bersuci",
    tp: "Peserta didik mampu mempraktikkan rukun dan urutan wudhu dengan tertib.",
    activities: "Praktik langsung wudhu di tempat wudhu sekolah, simulasi gerakan wudhu di kelas."
  },
  {
    classId: "sd-1",
    level: "SD",
    chapter: "Bab 4: Kisah Teladan Nabi Adam a.s.",
    aspect: "Sejarah Islam (Tarikh)",
    topic: "Keteladanan Nabi Adam a.s. dalam Memohon Ampun dan Ketaatan",
    tp: "Peserta didik mampu menceritakan kembali kisah Nabi Adam a.s. secara sederhana.",
    activities: "Bercerita bergambar (storytelling), menyimak video animasi kisah nabi."
  },

  // --- KELAS 2 SD (Fase A) ---
  {
    classId: "sd-2",
    level: "SD",
    chapter: "Bab 1: Mari Mengenal Surah An-Nas dan Al-Falaq",
    aspect: "Al-Qur'an Hadis",
    topic: "Hafalan dan Pesan Pokok Surah An-Nas & Al-Falaq",
    tp: "Peserta didik mampu menghafal dan menjelaskan kandungan surah perlindungan dari kejahatan.",
    activities: "Talaqqi dan setoran hafalan mandiri/berpasangan, telaah pesan pokok perlindungan."
  },
  {
    classId: "sd-2",
    level: "SD",
    chapter: "Bab 2: Asmaul Husna (Al-Hafizh, Al-Wali, Al-'Alim, Al-Khabir)",
    aspect: "Akidah",
    topic: "Mengenal Sifat-Sifat Allah melalui Asmaul Husna",
    tp: "Peserta didik mampu melafalkan 4 Asmaul Husna dan meneladani dalam kehidupan sehari-hari.",
    activities: "Menghafal dengan irama Asmaul Husna, lembar kerja mencocokkan arti."
  },
  {
    classId: "sd-2",
    level: "SD",
    chapter: "Bab 3: Senangnya Shalat Berjamaah",
    aspect: "Fikih",
    topic: "Tata Cara dan Bacaan Shalat Fardhu Berjamaah",
    tp: "Peserta didik mampu memperagakan bacaan dan gerakan shalat fardhu secara berjamaah.",
    activities: "Praktik shalat Dzuhur bersama di musholla/kelas, drill bacaan ruku' dan sujud."
  },

  // --- KELAS 3 SD (Fase B) ---
  {
    classId: "sd-3",
    level: "SD",
    chapter: "Bab 1: Belajar Surah Al-Kautsar dan Al-Ikhlas",
    aspect: "Al-Qur'an Hadis",
    topic: "Membaca dengan Tajwid (Mad Thobi'i & Qalqalah) serta Kandungan Surah",
    tp: "Peserta didik mampu membaca surah pendek sesuai kaidah tajwid dan menghafalnya lancar.",
    activities: "Bimbingan makhraj huruf, sambung ayat, setor hafalan bergantian."
  },
  {
    classId: "sd-3",
    level: "SD",
    chapter: "Bab 2: Berbakti kepada Orang Tua dan Guru",
    aspect: "Akhlak",
    topic: "Adab Berbicara, Sopan Santun, dan Mendoakan Orang Tua",
    tp: "Peserta didik mampu menunjukkan perilaku hormat dan patuh kepada orang tua serta guru.",
    activities: "Menulis surat cinta doa untuk orang tua, bermain peran (role playing) adab di sekolah."
  },
  {
    classId: "sd-3",
    level: "SD",
    chapter: "Bab 3: Puasa Ramadhan yang Kurindukan",
    aspect: "Fikih",
    topic: "Syarat, Rukun, dan Keutamaan Puasa Ramadhan",
    tp: "Peserta didik mampu menjelaskan rukun puasa dan hal-hal yang membatalkan puasa.",
    activities: "Membuat jadwal kegiatan ibadah Ramadhan ceria, diskusi kelompok."
  },

  // --- KELAS 4 SD (Fase B) ---
  {
    classId: "sd-4",
    level: "SD",
    chapter: "Bab 1: Mengaji Surah Al-Hujurat Ayat 13",
    aspect: "Al-Qur'an Hadis",
    topic: "Keragaman Manusia sebagai Sunnatullah dan Sikap Toleransi",
    tp: "Peserta didik mampu membaca Q.S. Al-Hujurat:13 dengan tartil dan menguraikan pesan toleransi.",
    activities: "Analisis makna keberagaman di lingkungan THHK, diskusi toleransi antar suku & agama."
  },
  {
    classId: "sd-4",
    level: "SD",
    chapter: "Bab 2: Beriman kepada Rasul-Rasul Allah",
    aspect: "Akidah",
    topic: "25 Nabi dan Rasul serta Sifat Wajib bagi Rasul (Siddiq, Amanah, Tabligh, Fathanah)",
    tp: "Peserta didik mampu menyebutkan 25 nabi/rasul dan mengimplementasikan sifat wajib rasul.",
    activities: "Menyusun puzzle nama nabi ulul azmi, presentasi sifat siddiq dan amanah."
  },
  {
    classId: "sd-4",
    level: "SD",
    chapter: "Bab 3: Bersih itu Sehat (Tanda Baligh)",
    aspect: "Fikih",
    topic: "Mengenal Tanda-Tanda Baligh bagi Laki-Laki dan Perempuan menurut Ilmu Fikih",
    tp: "Peserta didik mampu memahami kewajiban ibadah setelah memasuki usia baligh.",
    activities: "Edukasi fikih thaharah mandi wajib dan tanggung jawab ibadah secara santun."
  },

  // --- KELAS 5 SD (Fase C) ---
  {
    classId: "sd-5",
    level: "SD",
    chapter: "Bab 1: Menyayangi Anak Yatim (Surah Al-Ma'un)",
    aspect: "Al-Qur'an Hadis",
    topic: "Kandungan Q.S. Al-Ma'un dan Ciri Orang yang Mendustakan Agama",
    tp: "Peserta didik mampu membaca, mengartikan, dan menghafal Surah Al-Ma'un dengan baik.",
    activities: "Tadabbur ayat, proyek sedekah peduli sesama, resitasi hafalan."
  },
  {
    classId: "sd-5",
    level: "SD",
    chapter: "Bab 2: Beriman kepada Hari Akhir (Kiamat)",
    aspect: "Akidah",
    topic: "Tanda-Tanda Kiamat Sugra dan Kubra serta Hikmah Mengingat Hari Akhir",
    tp: "Peserta didik mampu menjelaskan makna iman kepada hari akhir dan dampaknya pada amal kebaikan.",
    activities: "Diskusi reflektif, merangkum peta konsep perjalanan kehidupan akhirat."
  },
  {
    classId: "sd-5",
    level: "SD",
    chapter: "Bab 3: Ibadah Shalat Sunnah (Dhuha & Tahajjud)",
    aspect: "Fikih",
    topic: "Keutamaan dan Tata Cara Shalat Sunnah Rawatib & Dhuha",
    tp: "Peserta didik mampu mempraktikkan tata cara shalat sunnah dhuha dengan mandiri.",
    activities: "Praktik shalat Dhuha berjamaah dan pembiasaan dzikir setelah shalat."
  },

  // --- KELAS 6 SD (Fase C) ---
  {
    classId: "sd-6",
    level: "SD",
    chapter: "Bab 1: Indahnya Toleransi (Surah Al-Kafirun)",
    aspect: "Al-Qur'an Hadis",
    topic: "Prinsip Toleransi Beragama dalam Islam Berdasarkan Q.S. Al-Kafirun",
    tp: "Peserta didik mampu menjelaskan batasan toleransi dalam akidah dan muamalah.",
    activities: "Diskusi studi kasus kebhinekaan di sekolah majemuk, tadarus Surah Al-Kafirun."
  },
  {
    classId: "sd-6",
    level: "SD",
    chapter: "Bab 2: Beriman kepada Qadha dan Qadar",
    aspect: "Akidah",
    topic: "Ikhtiar, Doa, Tawakkal, dan Ridha atas Ketetapan Allah",
    tp: "Peserta didik mampu menunjukkan sikap pantang menyerah dan berprasangka baik pada takdir.",
    activities: "Refleksi capaian diri, membuat poster motivasi islami berikhtiar dan bertawakal."
  },
  {
    classId: "sd-6",
    level: "SD",
    chapter: "Bab 3: Zakat, Infak, Sedekah dan Hadiah",
    aspect: "Fikih",
    topic: "Perbedaan Zakat Fitrah, Zakat Mal, Infak dan Sedekah",
    tp: "Peserta didik mampu menghitung kadar zakat fitrah sederhana dan memahami manfaat sosial zakat.",
    activities: "Simulasi penerimaan dan penyaluran zakat fitrah di sekolah."
  },

  // --- KELAS 7 SMP (Fase D) ---
  {
    classId: "smp-7",
    level: "SMP",
    chapter: "Bab 1: Al-Qur'an dan Sunnah sebagai Pedoman Hidup",
    aspect: "Al-Qur'an Hadis",
    topic: "Hukum Bacaan Alif Lam Syamsiyah & Alif Lam Qamariyah pada Q.S. An-Nisa:59 & An-Nahl:64",
    tp: "Peserta didik mampu mengidentifikasi hukum bacaan Al-Syamsiyah/Qamariyah dan menerapkan fungsi Al-Qur'an.",
    activities: "Kajian tajwid interaktif, bedah ayat kelompok, latihan membaca tartil."
  },
  {
    classId: "smp-7",
    level: "SMP",
    chapter: "Bab 2: Meneladani Nama dan Sifat Allah (Asmaul Husna)",
    aspect: "Akidah",
    topic: "Al-'Alim, Al-Khabir, As-Sami', dan Al-Bashir dalam Kehidupan Nyata",
    tp: "Peserta didik mampu menganalisis keterkaitan makna Asmaul Husna dengan integritas diri.",
    activities: "Studi kasus kejujuran saat ujian berbasis sifat Al-Khabir dan As-Sami'."
  },
  {
    classId: "smp-7",
    level: "SMP",
    chapter: "Bab 3: Menghadirkan Shalat dan Dzikir dalam Kehidupan",
    aspect: "Fikih",
    topic: "Hakikat Khusyuk dalam Shalat, Shalat Jama' & Qashar untuk Musafir",
    tp: "Peserta didik mampu mempraktikkan shalat jamak dan qashar sesuai syarat syar'i.",
    activities: "Praktik simulasi safar dan tata cara shalat jamak taqdim/ta'khir di laboratorium ibadah."
  },
  {
    classId: "smp-7",
    level: "SMP",
    chapter: "Bab 4: Peradaban Islam Masa Daulah Umayyah di Damaskus",
    aspect: "Sejarah Islam (Tarikh)",
    topic: "Sejarah Perkembangan Ilmu Pengetahuan dan Kebudayaan Bani Umayyah",
    tp: "Peserta didik mampu menjelaskan kontribusi ilmuwan muslim masa Daulah Umayyah.",
    activities: "Pembuatan peta jalur sejarah dan infografis ilmuwan muslim Umayyah."
  },

  // --- KELAS 8 SMP (Fase D) ---
  {
    classId: "smp-8",
    level: "SMP",
    chapter: "Bab 1: Membaca Kitab-Kitab Allah (Taurat, Zabur, Injil, Al-Qur'an)",
    aspect: "Akidah",
    topic: "Iman kepada Kitab-Kitab Suci Allah dan Keistimewaan Al-Qur'an",
    tp: "Peserta didik mampu membuktikan kebenaran Al-Qur'an sebagai kitab suci penyempurna.",
    activities: "Presentasi perbandingan kitab-kitab suci, tadarus Al-Qur'an bertajwid Mad."
  },
  {
    classId: "smp-8",
    level: "SMP",
    chapter: "Bab 2: Menghindari Minuman Keras, Judi, dan Pertengkaran",
    aspect: "Akhlak",
    topic: "Telaah Q.S. Al-Ma'idah: 90-91 tentang Bahaya Narkoba & Tawuran bagi Remaja",
    tp: "Peserta didik mampu mengemukakan argumen syar'i dan medis bahaya khamr dan judi.",
    activities: "Debat ilmiah etika remaja, membuat infografis kampanye anti-tawuran."
  },
  {
    classId: "smp-8",
    level: "SMP",
    chapter: "Bab 3: Shalat Gerhana, Istisqa, dan Jenazah",
    aspect: "Fikih",
    topic: "Tata Cara Shalat Kusuf/Khusuf, Istisqa, dan Fardhu Kifayah Shalat Jenazah",
    tp: "Peserta didik mampu menghafal bacaan 4 takbir dan mempraktikkan tata cara shalat jenazah.",
    activities: "Praktik langsung tata cara shalat jenazah lengkap dari niat hingga salam."
  },
  {
    classId: "smp-8",
    level: "SMP",
    chapter: "Bab 4: Masa Keemasan Daulah Abbasiyah di Baghdad",
    aspect: "Sejarah Islam (Tarikh)",
    topic: "Baitul Hikmah dan Kemajuan Sains Kedokteran, Matematika, dan Astronomi",
    tp: "Peserta didik mampu meneladani etos keilmuan para cendekiawan masa Daulah Abbasiyah.",
    activities: "Diskusi biografi Ibnu Sina & Al-Khawarizmi, resume literasi sejarah."
  },

  // --- KELAS 9 SMP (Fase D) ---
  {
    classId: "smp-9",
    level: "SMP",
    chapter: "Bab 1: Meraih Ketenangan Hati dengan Q.S. Az-Zumar: 53",
    aspect: "Al-Qur'an Hadis",
    topic: "Optimis, Ikhtiar, dan Tawakkal serta Tajwid Hukum Bacaan Waqaf & Washal",
    tp: "Peserta didik mampu menganalisis hukum waqaf dan mengaplikasikan sikap optimis menghadapi ujian.",
    activities: "Bedah tajwid waqaf qabih/hasan, motivasi refleksi diri hadapi kelulusan."
  },
  {
    classId: "smp-9",
    level: "SMP",
    chapter: "Bab 2: Ibadah Qurban dan Aqiqah",
    aspect: "Fikih",
    topic: "Ketentuan Hewan Qurban, Waktu Penyembelihan, dan Pembagian Daging",
    tp: "Peserta didik mampu menjelaskan hikmah sosial pelaksanaan qurban dan aqiqah.",
    activities: "Simulasi perhitungan hewan qurban, studi komparasi aqiqah vs qurban."
  },
  {
    classId: "smp-9",
    level: "SMP",
    chapter: "Bab 3: Sejarah Masuk dan Perkembangannya Islam di Nusantara",
    aspect: "Sejarah Islam (Tarikh)",
    topic: "Teori Masuknya Islam, Peran Wali Songo dan Akulturasi Budaya yang Damai",
    tp: "Peserta didik mampu menganalisis kearifan dakwah para Wali Songo di tanah Jawa dan Nusantara.",
    activities: "Membuat linimasa sejarah kerajaan Islam di Indonesia & telaah lagu tembang karya Wali Songo."
  }
];

// Data Awal Kosong Siap Diisi Guru
const SAMPLE_STUDENTS = [];
const SAMPLE_JOURNAL_ENTRIES = [];
const SAMPLE_ASSIGNMENTS = [];
