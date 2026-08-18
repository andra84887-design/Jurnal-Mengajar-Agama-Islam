# 📖 Jurnal Mengajar Guru Agama Islam SD & SMP THHK

Aplikasi Web Modern, Cepat, dan *Offline-First* yang dirancang khusus untuk Guru Pendidikan Agama Islam (PAI & BP) di lingkungan **Sekolah SD dan SMP THHK**. Dilengkapi integrasi database cloud **Supabase** untuk sinkronisasi otomatis antar-perangkat.

---

## 🌟 Fitur Utama

### 1. 📊 Dashboard Guru
- **Statistik Cepat**: Total pertemuan jurnal KBM, total tugas/kuis, jumlah peserta didik SD & SMP, dan nilai rata-rata keseluruhan.
- **Daftar KBM Terkini**: Akses instan ke catatan pertemuan kelas yang baru saja dilaksanakan.
- **Aksi Cepat**: Tombol *shortcut* untuk langsung mencatat jurnal atau membuat tugas baru.

### 2. 📖 Jurnal Mengajar Harian (Agenda KBM)
- **Filter Cepat**: Berdasarkan Jenjang (**SD / SMP**), Deretan Tombol Kelas Langsung (*Class Pills*), dan kata kunci pencarian materi.
- **Bank Materi Terintegrasi**: Pilihan preset materi PAI Kurikulum Merdeka (Fase A s/d Fase D) yang dapat mengisi form jurnal secara otomatis dalam 1 klik.
- **Data Lengkap**: Hari/Tanggal, Alokasi Waktu/Jam ke-, Pertemuan ke-, Aspek PAI (*Al-Qur'an Hadis, Akidah, Akhlak, Fikih, Sejarah Islam*), Capaian/Tujuan Pembelajaran (TP/KD), Kegiatan & Metode Pembelajaran, Kehadiran, Status KBM, dan Catatan/Refleksi Guru.
- **Ekspor CSV**: Unduh rekapitulasi data jurnal ke file spreadsheet CSV.
- **Pratinjau & Cetak Lembar Pertemuan**: Format resmi lengkap dengan tanda tangan guru dan kepala sekolah.

### 3. 📝 Tugas & Buku Nilai Interaktif (Gradebook)
- **Kategori Tugas Lengkap**:
  - 📖 **Hafalan**: Surat-surat pendek Juz 'Amma dan doa harian.
  - 🕌 **Praktik Ibadah**: Praktik wudhu, sholat fardhu, sholat sunnah, dan jenazah.
  - 📝 **Tugas Tulis**: Lembar kerja, ringkasan materi, dan analisis ayat.
  - ⚡ **Kuis / Ulangan Harian (UH)**: Uji pemahaman per bab.
  - 🎓 **Asesmen Sumatif**: UTS / UAS / Asesmen Akhir Semester.
  - 🌟 **Proyek PAI**: Proyek karakter dan portofolio.
- **Tabel Nilai Interaktif**: Input nilai langsung pada tabel kelas dengan auto-kalkulasi instan rata-rata nilai, nilai tertinggi/terendah, dan indikator ketercapaian KKTP/KKM (warna hijau jika tuntas, merah jika remedial).
- **Penilaian Massal**: Modal khusus penilaian per butir tugas dengan opsi *Set Semua 100 / 85*.
- **Ekspor Nilai**: Unduh leger nilai per kelas ke format CSV/Excel.

### 4. 📚 Bank Materi & Silabus PAI SD & SMP
- Kumpulan silabus PAI Kurikulum Merdeka lengkap dari **Kelas 1 SD hingga Kelas 9 SMP**.
- Meliputi seluruh dimensi aspek: *Al-Qur'an Hadis, Akidah, Akhlak, Fikih/Ibadah, dan Tarikh/Sejarah Islam*.
- Filter berdasarkan jenjang, aspek, dan pencarian topik.
- Tombol *"Gunakan Materi Ini di Jurnal"* untuk langsung membuat agenda KBM berdasarkan silabus tersebut.

### 5. 👥 Data Siswa & Roster Kelas
- Pengelolaan daftar siswa untuk seluruh tingkatan kelas SD (Kelas 1–6) dan SMP (Kelas 7–9).
- **Impor Massal Siswa**: Salin dan tempel daftar nama siswa dari Excel secara instan.
- **Rapor Mini Siswa**: Klik nama siswa untuk melihat profil lengkap, riwayat seluruh nilai tugas PAI yang telah dikerjakan, dan catatan khusus perkembangan.

### 6. 🖨️ Cetak Rekapitulasi Resmi Siap Print / PDF
- **Cetak Jurnal Mengajar**: Format tabel dinas resmi siap cetak A4 atau simpan ke PDF lengkap dengan Kop Surat THHK, identitas guru, alokasi waktu, serta kolom tanda tangan Kepala Sekolah & Guru PAI.
- **Cetak Leger Nilai**: Format rekap nilai siswa satu kelas beserta status ketuntasan KKTP.

### 7. ⚡ Sinkronisasi Cloud Supabase & Backup Data
- **Supabase Cloud Sync**: Simpan dan sinkronkan data Jurnal, Siswa, Tugas, dan Nilai ke database Supabase Cloud secara *real-time*.
- **Offline-First Resilience**: Jika internet tidak tersedia, aplikasi tetap bekerja penuh menggunakan penyimpanan lokal browser dan dapat diunggah (*Push*) saat online.
- **Cadangkan Data (JSON)**: Unduh seluruh database ke file JSON.
- **Pulihkan Data (Restore)**: Unggah file backup kapan saja saat berganti komputer atau laptop.
- **Kosongkan Semua Data**: Tombol pembersih untuk memulai dengan lembar kerja bersih.

---

## ⚡ Panduan Menghubungkan ke Supabase

1. Buka dashboard akun Anda di [https://supabase.com](https://supabase.com) dan buat proyek baru (contoh: `jurnal-pai-thhk`).
2. Masuk ke menu **SQL Editor** pada dashboard Supabase Anda.
3. Salin seluruh isi file `supabase_schema.sql` (atau klik tombol **"Lihat Skrip SQL Tabel Supabase"** di menu Pengaturan aplikasi), lalu klik tombol **"Run"** untuk membuat seluruh tabel dan kebijakan keamanan (RLS).
4. Buka menu **Project Settings &rarr; API** di Supabase:
   - Salin **Project URL** (contoh: `https://xxxx.supabase.co`)
   - Salin **Project API Keys (anon / public)**
5. Masuk ke aplikasi menu **Pengaturan & Cloud**, tempelkan URL dan Anon Key pada form Supabase, lalu klik **"Simpan & Hubungkan Supabase"**.
6. Klik **"Tes Koneksi"** untuk memastikan status berubah menjadi 🟢 **Terhubung Supabase Cloud**.

---

## 🚀 Cara Menjalankan Aplikasi

1. **Buka Langsung File HTML**:
   - Buka folder `d:\aplikasi\Jurnal Mengajar Agama Islam\`
   - Klik ganda file `index.html` untuk langsung membukanya di browser (Google Chrome, Microsoft Edge, Mozilla Firefox, dll).

2. **Atau Menggunakan Local Server**:
   ```bash
   python -m http.server 8080 --directory "d:\aplikasi\Jurnal Mengajar Agama Islam"
   ```
   Buka `http://localhost:8080` di peramban web.

---

## 📁 Struktur Berkas

```
d:\aplikasi\Jurnal Mengajar Agama Islam\
├── index.html            # Antarmuka Utama Aplikasi
├── supabase_schema.sql   # Skrip SQL Lengkap Pembuat Tabel & RLS Supabase
├── README.md             # Panduan Penggunaan & Dokumentasi Lengkap
├── css/
│   └── style.css         # Styling Emerald & Gold Modern, Responsif & Format Cetak (@media print)
└── js/
    ├── data.js           # Data Awal: Kelas SD & SMP THHK, Bank Silabus PAI Lengkap
    ├── storage.js        # Manajemen Penyimpanan Lokal (LocalStorage), Backup JSON, Ekspor CSV
    ├── supabase.js       # Modul Sinkronisasi Cloud Supabase Database (CRUD & Realtime)
    ├── journal.js        # Logika Jurnal Mengajar: CRUD, Filter SD/SMP, Auto-fill Materi
    ├── grades.js         # Logika Buku Nilai: Tugas, Matrix Nilai Interaktif, Kalkulator KKTP
    ├── students.js       # Logika Data Siswa: Roster Kelas, Impor Massal, Profil & Rapor Mini
    └── app.js            # Controller Utama: Router Tab, Metrik Dashboard, Silabus & Laporan Cetak
```
