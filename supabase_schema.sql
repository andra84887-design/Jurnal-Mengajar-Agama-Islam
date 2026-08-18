-- ==============================================================================
-- SKRIP SQL SUPABASE: JURNAL MENGAJAR AGAMA ISLAM SD & SMP THHK
-- Salin dan jalankan seluruh isi skrip ini di Menu "SQL Editor" pada Dashboard Supabase Anda.
-- ==============================================================================

-- 1. Tabel Pengaturan Aplikasi (Identitas Sekolah & Guru)
CREATE TABLE IF NOT EXISTS public.app_settings (
  id TEXT PRIMARY KEY DEFAULT 'default_settings',
  school_name TEXT NOT NULL DEFAULT 'SEKOLAH THHK',
  teacher_name TEXT NOT NULL DEFAULT 'Guru Pendidikan Agama Islam',
  teacher_nip TEXT DEFAULT '-',
  headmaster_name TEXT DEFAULT 'Kepala Sekolah THHK',
  headmaster_nip TEXT DEFAULT '-',
  academic_year TEXT DEFAULT '2024/2025',
  semester TEXT DEFAULT '1 (Ganjil)',
  default_kktp NUMERIC DEFAULT 75,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Data Siswa SD & SMP
CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY,
  nisn TEXT,
  name TEXT NOT NULL,
  gender TEXT DEFAULT 'L',
  class_id TEXT NOT NULL,
  level TEXT NOT NULL, -- 'SD' atau 'SMP'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Jurnal Mengajar Harian PAI
CREATE TABLE IF NOT EXISTS public.jurnal_entries (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  time TEXT,
  class_id TEXT NOT NULL,
  level TEXT NOT NULL, -- 'SD' atau 'SMP'
  meeting_no INT DEFAULT 1,
  semester TEXT DEFAULT '1 (Ganjil)',
  aspect TEXT,
  chapter TEXT NOT NULL,
  topic TEXT NOT NULL,
  tp TEXT,
  activity TEXT NOT NULL,
  attendance TEXT,
  status TEXT DEFAULT 'Selesai',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Tugas & Nilai Siswa (Gradebook)
CREATE TABLE IF NOT EXISTS public.assignments (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  level TEXT NOT NULL, -- 'SD' atau 'SMP'
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE,
  due_date DATE,
  max_score NUMERIC DEFAULT 100,
  kktp NUMERIC DEFAULT 75,
  description TEXT,
  scores JSONB DEFAULT '{}'::jsonb, -- Format: {"student_id": 90, ...}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- AKTIFKAN ROW LEVEL SECURITY (RLS) & IZINKAN AKSES ANON (PUBLIC KEY)
-- ==============================================================================

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jurnal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Buat Kebijakan Akses Penuh untuk Penggunaan Aplikasi Guru PAI
DROP POLICY IF EXISTS "Public access app_settings" ON public.app_settings;
CREATE POLICY "Public access app_settings" ON public.app_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access students" ON public.students;
CREATE POLICY "Public access students" ON public.students FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access jurnal_entries" ON public.jurnal_entries;
CREATE POLICY "Public access jurnal_entries" ON public.jurnal_entries FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access assignments" ON public.assignments;
CREATE POLICY "Public access assignments" ON public.assignments FOR ALL USING (true) WITH CHECK (true);

-- Insert Pengaturan Default Awal jika belum ada
INSERT INTO public.app_settings (id, school_name, teacher_name, academic_year, semester, default_kktp)
VALUES ('default_settings', 'SEKOLAH THHK', 'Guru Pendidikan Agama Islam', '2024/2025', '1 (Ganjil)', 75)
ON CONFLICT (id) DO NOTHING;
