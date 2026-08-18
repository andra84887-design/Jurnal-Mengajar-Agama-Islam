# 📖 Jurnal Mengajar Guru Agama Islam SD & SMP THHK

Aplikasi Web Modern, Cepat, dan *Offline-First* yang dirancang khusus untuk Guru Pendidikan Agama Islam (PAI & BP) di lingkungan **Sekolah SD dan SMP THHK**.

---

## 🌟 Fitur Utama

### 1. 📊 Dashboard Guru
- **Statistik Cepat**: Total pertemuan jurnal KBM, total tugas/kuis, jumlah peserta didik SD & SMP, dan nilai rata-rata keseluruhan.
- **Daftar KBM Terkini**: Akses instan ke catatan pertemuan kelas yang baru saja dilaksanakan.
- **Aksi Cepat**: Tombol *shortcut* untuk langsung mencatat jurnal atau membuat tugas baru.

### 2. 📖 Jurnal Mengajar Harian (Agenda KBM)
- **Filter Cepat**: Berdasarkan Jenjang (**SD / SMP**), Kelas, dan kata kunci pencarian materi.
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

### 7. ⚙️ Pengaturan & Backup Data
- Kustomisasi Nama Sekolah (THHK), Nama Guru PAI, NIP/NUPTK, Nama Kepala Sekolah, Tahun Ajaran, dan Nilai Standar KKTP.
- **Cadangkan Data (JSON)**: Unduh seluruh database ke file JSON untuk disimpan di Google Drive atau flashdisk.
- **Pulihkan Data (Restore)**: Unggah file backup kapan saja saat berganti komputer atau laptop.

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini bersifat **Offline-First**, artinya dapat dibuka langsung di laptop/komputer guru tanpa memerlukan instalasi server rumit atau koneksi internet:

1. **Buka Langsung File HTML**:
   - Buka folder `d:\aplikasi\Jurnal Mengajar Agama Islam\`
   - Klik ganda file `index.html` untuk langsung membukanya di browser (Google Chrome, Microsoft Edge, Mozilla Firefox, dll).

2. **Atau Menggunakan Local Server (Opsional)**:
   ```bash
   python -m http.server 8080 --directory "d:\aplikasi\Jurnal Mengajar Agama Islam"
   ```
   Buka `http://localhost:8080` di peramban web.

---

## 📁 Struktur Berkas

```
d:\aplikasi\Jurnal Mengajar Agama Islam\
├── index.html            # Antarmuka Utama Aplikasi (Dashboard, Jurnal, Nilai, Siswa, Laporan, Pengaturan)
├── README.md             # Panduan Penggunaan & Dokumentasi Lengkap
├── css/
│   └── style.css         # Styling Emerald & Gold Modern, Responsif & Format Cetak Dinas (@media print)
└── js/
    ├── data.js           # Data Awal: Kelas SD & SMP THHK, Bank Silabus PAI Lengkap, Data Siswa Contoh
    ├── storage.js        # Manajemen Penyimpanan Lokal (LocalStorage), Backup/Restore JSON, Ekspor CSV
    ├── journal.js        # Logika Jurnal Mengajar: CRUD, Filter SD/SMP, Auto-fill Materi, Pratinjau
    ├── grades.js         # Logika Buku Nilai: Tugas, Matrix Nilai Interaktif, Kalkulator Rata-rata & KKTP
    ├── students.js       # Logika Data Siswa: Roster Kelas, Impor Massal, Profil & Rapor Mini
    └── app.js            # Controller Utama: Router Tab, Metrik Dashboard, Silabus Browser, Generator Cetak
```
