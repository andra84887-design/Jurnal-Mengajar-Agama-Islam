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

// Bank Materi PAI Lengkap untuk SD dan SMP
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

// Data Lengkap Siswa Siap Pakai untuk Seluruh Jenjang SD (Kelas 1-6) dan SMP (Kelas 7-9) THHK
const SAMPLE_STUDENTS = [
  // --- KELAS 1 SD ---
  { id: "s-101", nisn: "013401", name: "Ahmad Fauzan", gender: "L", classId: "sd-1", level: "SD", notes: "Sangat aktif, cepat menghafal surat pendek" },
  { id: "s-102", nisn: "013402", name: "Aisyah Putri Azzahra", gender: "P", classId: "sd-1", level: "SD", notes: "Makhraj huruf hijaiyyah sudah rapi" },
  { id: "s-103", nisn: "013403", name: "Bilal Muhammad", gender: "L", classId: "sd-1", level: "SD", notes: "Perlu bimbingan menulis harakat" },
  { id: "s-104", nisn: "013404", name: "Fathimah Zahra", gender: "P", classId: "sd-1", level: "SD", notes: "Hafalan doa harian lancar" },
  { id: "s-105", nisn: "013405", name: "Kenzo Al-Ghifari", gender: "L", classId: "sd-1", level: "SD", notes: "Tertib dalam barisan wudhu" },

  // --- KELAS 2 SD ---
  { id: "s-201", nisn: "012401", name: "Adelia Rahma", gender: "P", classId: "sd-2", level: "SD", notes: "Hafal Surah An-Nas & Al-Falaq lancar" },
  { id: "s-202", nisn: "012402", name: "Bima Arya Putra", gender: "L", classId: "sd-2", level: "SD", notes: "Sangat antusias belajar Asmaul Husna" },
  { id: "s-203", nisn: "012403", name: "Citra Kirana", gender: "P", classId: "sd-2", level: "SD", notes: "Bacaan shalat fardhu tartil" },
  { id: "s-204", nisn: "012404", name: "Dzaky Ramadhan", gender: "L", classId: "sd-2", level: "SD", notes: "Tertib saat praktik shalat berjamaah" },
  { id: "s-205", nisn: "012405", name: "Elvira Zahira", gender: "P", classId: "sd-2", level: "SD", notes: "Rajin bertanya arti Asmaul Husna" },

  // --- KELAS 3 SD ---
  { id: "s-301", nisn: "011401", name: "Arif Hidayat", gender: "L", classId: "sd-3", level: "SD", notes: "Paham hukum bacaan Qalqalah" },
  { id: "s-302", nisn: "011402", name: "Bella Safitri", gender: "P", classId: "sd-3", level: "SD", notes: "Sopan santun sangat baik kepada guru" },
  { id: "s-303", nisn: "011403", name: "Dimas Maulana", gender: "L", classId: "sd-3", level: "SD", notes: "Mampu menjelaskan syarat puasa Ramadhan" },
  { id: "s-304", nisn: "011404", name: "Erina Khansa", gender: "P", classId: "sd-3", level: "SD", notes: "Hafal Surah Al-Kautsar dan Al-Ikhlas" },
  { id: "s-305", nisn: "011405", name: "Farhan Malik", gender: "L", classId: "sd-3", level: "SD", notes: "Aktif dalam diskusi kelompok adab" },

  // --- KELAS 4 SD ---
  { id: "s-401", nisn: "010401", name: "Danang Ardiansyah", gender: "L", classId: "sd-4", level: "SD", notes: "Mampu membaca Q.S. Al-Hujurat dengan tartil" },
  { id: "s-402", nisn: "010402", name: "Hanifah Syakira", gender: "P", classId: "sd-4", level: "SD", notes: "Aktif bertanya mengenai kisah rasul" },
  { id: "s-403", nisn: "010403", name: "Ibrahim Rasyid", gender: "L", classId: "sd-4", level: "SD", notes: "Hafal 25 nama nabi dan rasul" },
  { id: "s-404", nisn: "010404", name: "Nabila Khairunnisa", gender: "P", classId: "sd-4", level: "SD", notes: "Tulisan arab sangat rapi dan teliti" },
  { id: "s-405", nisn: "010405", name: "Zaidan Akbar", gender: "L", classId: "sd-4", level: "SD", notes: "Perlu pendampingan tajwid nun sukun" },

  // --- KELAS 5 SD ---
  { id: "s-501", nisn: "009401", name: "Genta Pratama", gender: "L", classId: "sd-5", level: "SD", notes: "Hafal Surah Al-Ma'un dengan makhraj fasih" },
  { id: "s-502", nisn: "009402", name: "Hafizhah Nuha", gender: "P", classId: "sd-5", level: "SD", notes: "Memahami tanda-tanda hari akhir" },
  { id: "s-503", nisn: "009403", name: "Ihsanul Fikri", gender: "L", classId: "sd-5", level: "SD", notes: "Praktik shalat sunnah dhuha mandiri" },
  { id: "s-504", nisn: "009404", name: "Jasmine Aulia", gender: "P", classId: "sd-5", level: "SD", notes: "Peduli sesama dan gemar bersedekah" },
  { id: "s-505", nisn: "009405", name: "Kareem Abdul", gender: "L", classId: "sd-5", level: "SD", notes: "Rajin memimpin dzikir sesudah shalat" },

  // --- KELAS 6 SD ---
  { id: "s-601", nisn: "008401", name: "Luthfi Hakim", gender: "L", classId: "sd-6", level: "SD", notes: "Pemahaman toleransi Q.S. Al-Kafirun baik" },
  { id: "s-602", nisn: "008402", name: "Maryam Qanita", gender: "P", classId: "sd-6", level: "SD", notes: "Tuntas materi iman kepada Qadha & Qadar" },
  { id: "s-603", nisn: "008403", name: "Naufal Zaki", gender: "L", classId: "sd-6", level: "SD", notes: "Mampu menghitung zakat fitrah sederhana" },
  { id: "s-604", nisn: "008404", name: "Olivia Salsabila", gender: "P", classId: "sd-6", level: "SD", notes: "Nilai ujian sekolah sangat memuaskan" },
  { id: "s-605", nisn: "008405", name: "Pandu Wijaya", gender: "L", classId: "sd-6", level: "SD", notes: "Karakter islami dan integritas tinggi" },

  // --- KELAS 7 SMP ---
  { id: "s-701", nisn: "007701", name: "Aditya Pratama", gender: "L", classId: "smp-7", level: "SMP", notes: "Lancar tajwid Alif Lam Syamsiyah" },
  { id: "s-702", nisn: "007702", name: "Farah Diba Nurhaliza", gender: "P", classId: "smp-7", level: "SMP", notes: "Paham hukum shalat jamak dan qashar" },
  { id: "s-703", nisn: "007703", name: "Muhammad Rizky", gender: "L", classId: "smp-7", level: "SMP", notes: "Praktik adzan dan iqomah sangat baik" },
  { id: "s-704", nisn: "007704", name: "Salma Salshabila", gender: "P", classId: "smp-7", level: "SMP", notes: "Nilai tugas sejarah Daulah Umayyah memuaskan" },
  { id: "s-705", nisn: "007705", name: "Yusuf Al-Farisi", gender: "L", classId: "smp-7", level: "SMP", notes: "Selalu memimpin doa pembuka kelas" },

  // --- KELAS 8 SMP ---
  { id: "s-801", nisn: "006801", name: "Arya Bimasakti", gender: "L", classId: "smp-8", level: "SMP", notes: "Mampu mempresentasikan kitab-kitab Allah" },
  { id: "s-802", nisn: "006802", name: "Chantika Dewi", gender: "P", classId: "smp-8", level: "SMP", notes: "Poster anti narkoba & tawuran sangat kreatif" },
  { id: "s-803", nisn: "006803", name: "Daffa Ramadhan", gender: "L", classId: "smp-8", level: "SMP", notes: "Lancar bacaan takbir shalat jenazah" },
  { id: "s-804", nisn: "006804", name: "Fathia Nurul", gender: "P", classId: "smp-8", level: "SMP", notes: "Memahami kejayaan Daulah Abbasiyah" },
  { id: "s-805", nisn: "006805", name: "Gilang Ramadhan", gender: "L", classId: "smp-8", level: "SMP", notes: "Praktik shalat istisqa dan kusuf tuntas" },

  // --- KELAS 9 SMP ---
  { id: "s-901", nisn: "005901", name: "Alifia Maharani", gender: "P", classId: "smp-9", level: "SMP", notes: "Penguasaan materi qurban & aqiqah tuntas" },
  { id: "s-902", nisn: "005902", name: "Bagus Tri Saputra", gender: "L", classId: "smp-9", level: "SMP", notes: "Tartil membaca Q.S. Az-Zumar:53" },
  { id: "s-903", nisn: "005903", name: "Devina Nur Anggraini", gender: "P", classId: "smp-9", level: "SMP", notes: "Analisis sejarah Wali Songo sangat komprehensif" },
  { id: "s-904", nisn: "005904", name: "Haidar Ali", gender: "L", classId: "smp-9", level: "SMP", notes: "Praktik penyelenggaraan jenazah menguasai" },
  { id: "s-905", nisn: "005905", name: "Zaskia Mecca", gender: "P", classId: "smp-9", level: "SMP", notes: "Hafalan juz 30 lancar" }
];

// Data Jurnal Contoh Awal Lengkap SD & SMP
const SAMPLE_JOURNAL_ENTRIES = [
  {
    id: "jrn-001",
    date: "2024-08-05",
    time: "07:30 - 08:50 (Jam ke 1-2)",
    classId: "sd-1",
    level: "SD",
    meetingNo: 1,
    semester: "1 (Ganjil)",
    aspect: "Al-Qur'an Hadis",
    chapter: "Bab 1: Aku Cinta Al-Qur'an",
    topic: "Mengenal Huruf Hijaiyyah (Alif sampai Jim) dan Harakat Fathah",
    tp: "Peserta didik mampu melafalkan huruf Alif, Ba, Ta, Tsa, Jim berharakat fathah dengan makhraj tepat.",
    activity: "1. Ice breaking tepuk anak sholeh.\n2. Guru mencontohkan pelafalan huruf hijaiyyah dengan kartu flashcard.\n3. Siswa menirukan bersama-sama dan resitasi per baris bangku.\n4. Latihan mewarnai huruf hijaiyyah di buku.",
    attendance: "Hadir: 5, Izin: 0, Sakit: 0, Alfa: 0",
    status: "Selesai",
    notes: "Anak-anak sangat antusias dan ceria. Siswa Bilal perlu latihan tambahan melafalkan huruf Tsa."
  },
  {
    id: "jrn-002",
    date: "2024-08-06",
    time: "08:50 - 10:10 (Jam ke 3-4)",
    classId: "sd-4",
    level: "SD",
    meetingNo: 1,
    semester: "1 (Ganjil)",
    aspect: "Al-Qur'an Hadis",
    chapter: "Bab 1: Mengaji Surah Al-Hujurat Ayat 13",
    topic: "Membaca Tartil Q.S. Al-Hujurat:13 dan Penerapan Tajwid Mad Thobi'i",
    tp: "Peserta didik dapat membaca Q.S. Al-Hujurat:13 dengan tartil dan mengidentifikasi hukum Mad Thobi'i.",
    activity: "1. Tadarus bersama pembuka pelajaran.\n2. Guru mendemonstrasikan bacaan tartil ayat 13.\n3. Siswa bergantian membaca ayat di depan kelas.\n4. Identifikasi hukum bacaan mad dan penjelasan arti ayat tentang keragaman suku bangsa.",
    attendance: "Hadir: 5, Izin: 0, Sakit: 0, Alfa: 0",
    status: "Selesai",
    notes: "Semua siswa mampu membaca ayat dengan lancar. Diberikan tugas mandiri hafalan ayat untuk pertemuan berikutnya."
  },
  {
    id: "jrn-003",
    date: "2024-08-07",
    time: "10:30 - 11:50 (Jam ke 5-6)",
    classId: "smp-7",
    level: "SMP",
    meetingNo: 1,
    semester: "1 (Ganjil)",
    aspect: "Al-Qur'an Hadis",
    chapter: "Bab 1: Al-Qur'an dan Sunnah sebagai Pedoman Hidup",
    topic: "Hukum Alif Lam Syamsiyah dan Alif Lam Qamariyah pada Q.S. An-Nisa:59",
    tp: "Peserta didik mampu menganalisis contoh hukum bacaan Al-Syamsiyah dan Al-Qamariyah.",
    activity: "1. Tilawah Q.S. An-Nisa:59 bersama.\n2. Pemaparan materi perbedaan ciri fisik dan pelafalan Idgham Syamsiyah vs Idzhar Qamariyah.\n3. Lembar kerja kelompok mencari 10 contoh bacaan Alif Lam dalam juz 'Amma.\n4. Refleksi dan penarikan kesimpulan.",
    attendance: "Hadir: 5, Izin: 0, Sakit: 0, Alfa: 0",
    status: "Selesai",
    notes: "Diskusi kelompok berjalan sangat aktif. Tugas lembar kerja tajwid dikumpulkan tepat waktu."
  },
  {
    id: "jrn-004",
    date: "2024-08-08",
    time: "07:30 - 08:50 (Jam ke 1-2)",
    classId: "smp-8",
    level: "SMP",
    meetingNo: 1,
    semester: "1 (Ganjil)",
    aspect: "Akidah",
    chapter: "Bab 1: Membaca Kitab-Kitab Allah",
    topic: "Mengenal 4 Kitab Suci Allah dan Keistimewaan Al-Qur'an",
    tp: "Peserta didik mampu menyebutkan 4 kitab suci dan nabi penerimanya dengan benar.",
    activity: "1. Tadarus dan doa bersama.\n2. Diskusi interaktif mengenai kitab Taurat, Zabur, Injil, dan Al-Qur'an.\n3. Presentasi kelompok mengenai keutamaan Al-Qur'an sebagai penyempurna kitab terdahulu.",
    attendance: "Hadir: 5, Izin: 0, Sakit: 0, Alfa: 0",
    status: "Selesai",
    notes: "Siswa sangat aktif berdiskusi mengenai sejarah kodifikasi Al-Qur'an."
  },
  {
    id: "jrn-005",
    date: "2024-08-09",
    time: "08:50 - 10:10 (Jam ke 3-4)",
    classId: "smp-9",
    level: "SMP",
    meetingNo: 1,
    semester: "1 (Ganjil)",
    aspect: "Al-Qur'an Hadis",
    chapter: "Bab 1: Meraih Ketenangan Hati dengan Q.S. Az-Zumar: 53",
    topic: "Optimis, Ikhtiar, dan Tawakkal Menghadapi Ujian Kelulusan",
    tp: "Peserta didik mampu menguraikan hikmah sikap optimis dan tawakkal dalam kehidupan.",
    activity: "1. Membaca Q.S. Az-Zumar: 53 dengan tartil.\n2. Bedah makna jangan berputus asa dari rahmat Allah.\n3. Refleksi diri menuliskan target ikhtiar belajar dan ibadah.",
    attendance: "Hadir: 5, Izin: 0, Sakit: 0, Alfa: 0",
    status: "Selesai",
    notes: "Suasana kelas sangat khusyuk dan memotivasi peserta didik."
  }
];

// Data Tugas & Nilai Contoh Lengkap SD & SMP
const SAMPLE_ASSIGNMENTS = [
  {
    id: "asg-001",
    title: "Tugas 1: Hafalan Huruf Hijaiyyah & Harakat",
    classId: "sd-1",
    level: "SD",
    category: "Hafalan",
    date: "2024-08-12",
    dueDate: "2024-08-19",
    maxScore: 100,
    kktp: 75,
    description: "Setoran pelafalan 10 huruf hijaiyyah pertama dengan harakat Fathah dan Kasrah.",
    scores: {
      "s-101": 90,
      "s-102": 95,
      "s-103": 75,
      "s-104": 88,
      "s-105": 82
    }
  },
  {
    id: "asg-002",
    title: "Tugas 1: Lembar Tajwid Q.S. Al-Hujurat:13",
    classId: "sd-4",
    level: "SD",
    category: "Tugas Tulis",
    date: "2024-08-13",
    dueDate: "2024-08-20",
    maxScore: 100,
    kktp: 75,
    description: "Menuliskan 5 contoh hukum bacaan Mad Thobi'i dan artinya dalam lembar kerja.",
    scores: {
      "s-401": 92,
      "s-402": 88,
      "s-403": 85,
      "s-404": 96,
      "s-405": 78
    }
  },
  {
    id: "asg-003",
    title: "Kuis 1: Hukum Alif Lam Syamsiyah & Qamariyah",
    classId: "smp-7",
    level: "SMP",
    category: "Kuis/UH",
    date: "2024-08-14",
    dueDate: "2024-08-14",
    maxScore: 100,
    kktp: 75,
    description: "Kuis tulis 10 soal pilihan ganda dan analisis ayat tentang Alif Lam.",
    scores: {
      "s-701": 90,
      "s-702": 85,
      "s-703": 88,
      "s-704": 95,
      "s-705": 82
    }
  },
  {
    id: "asg-004",
    title: "Tugas 1: Resume 4 Kitab Suci & Penerimanya",
    classId: "smp-8",
    level: "SMP",
    category: "Tugas Tulis",
    date: "2024-08-15",
    dueDate: "2024-08-22",
    maxScore: 100,
    kktp: 75,
    description: "Membuat tabel komparasi 4 kitab suci (Taurat, Zabur, Injil, Al-Qur'an) dan nabi penerimanya.",
    scores: {
      "s-801": 88,
      "s-802": 92,
      "s-803": 80,
      "s-804": 95,
      "s-805": 85
    }
  },
  {
    id: "asg-005",
    title: "Praktik 1: Membaca Tartil Q.S. Az-Zumar: 53",
    classId: "smp-9",
    level: "SMP",
    category: "Praktik Ibadah",
    date: "2024-08-16",
    dueDate: "2024-08-23",
    maxScore: 100,
    kktp: 75,
    description: "Penilaian tartil tilawah ayat dan ketepatan hukum bacaan waqaf.",
    scores: {
      "s-901": 95,
      "s-902": 90,
      "s-903": 92,
      "s-904": 86,
      "s-905": 98
    }
  }
];
