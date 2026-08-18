/**
 * Supabase Cloud Sync Module
 * Integrates Supabase Database client for real-time cloud storage and cross-device sync.
 */

const SUPABASE_CONFIG_KEY = "jurnal_pai_supabase_config_v1";

const SupabaseService = {
  client: null,
  isConnected: false,

  getConfig() {
    try {
      const data = localStorage.getItem(SUPABASE_CONFIG_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return { 
      url: "https://jvlqmzbzmupizagyjzer.supabase.co", 
      anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2bHFtemJ6bXVwaXphZ3lqemVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwMDc1NDksImV4cCI6MjEwMjU4MzU0OX0.dWu7mz3PgeYSMbeo2upFfopOQOI7SLmvMWCxim7-Yzc", 
      autoSync: true 
    };
  },

  saveConfig(config) {
    localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(config));
    this.initClient();
  },

  initClient() {
    const config = this.getConfig();
    if (config.url && config.anonKey && window.supabase) {
      try {
        this.client = window.supabase.createClient(config.url, config.anonKey);
        this.checkConnection();
      } catch (e) {
        console.error("Gagal menginisialisasi Supabase client:", e);
        this.client = null;
        this.isConnected = false;
        this.updateStatusBadge();
      }
    } else {
      this.client = null;
      this.isConnected = false;
      this.updateStatusBadge();
    }
  },

  async checkConnection() {
    if (!this.client) {
      this.isConnected = false;
      this.updateStatusBadge();
      return false;
    }

    try {
      const { data, error } = await this.client.from("app_settings").select("id").limit(1);
      if (error) {
        console.warn("Supabase check connection warning:", error.message);
        this.isConnected = false;
      } else {
        this.isConnected = true;
      }
    } catch (e) {
      console.error("Supabase connection error:", e);
      this.isConnected = false;
    }

    this.updateStatusBadge();
    return this.isConnected;
  },

  updateStatusBadge() {
    const badges = document.querySelectorAll(".supabase-status-badge");
    const statusTextEls = document.querySelectorAll(".supabase-status-text");

    const config = this.getConfig();
    const hasConfig = Boolean(config.url && config.anonKey);

    badges.forEach(badge => {
      badge.classList.remove("status-connected", "status-disconnected", "status-unconfigured");
      if (!hasConfig) {
        badge.classList.add("status-unconfigured");
        badge.innerHTML = `🟡 <span>Lokal (Belum Konek Supabase)</span>`;
      } else if (this.isConnected) {
        badge.classList.add("status-connected");
        badge.innerHTML = `🟢 <span>Terhubung Supabase Cloud</span>`;
      } else {
        badge.classList.add("status-disconnected");
        badge.innerHTML = `🔴 <span>Gagal Terhubung Supabase</span>`;
      }
    });

    statusTextEls.forEach(el => {
      if (!hasConfig) {
        el.textContent = "Mode Penyimpanan: Browser Lokal (Offline). Masukkan Supabase URL & Anon Key di bawah untuk sinkronisasi cloud.";
      } else if (this.isConnected) {
        el.textContent = "Status: Terhubung aktif ke database Supabase Cloud. Data Anda otomatis tersinkronisasi!";
      } else {
        el.textContent = "Status: Tidak dapat terhubung ke Supabase. Periksa URL, Anon Key, atau pastikan tabel sudah dibuat via SQL Editor.";
      }
    });
  },

  // ==========================================
  // SYNC OPERATIONS (PULL & PUSH)
  // ==========================================

  // Pull all data from Supabase to Local Storage
  async pullFromSupabase() {
    if (!this.client) {
      App.showToast("Supabase belum dikonfigurasi. Masukkan URL & Key terlebih dahulu.", "warning");
      return { success: false, message: "Client not configured" };
    }

    App.showToast("Mengunduh data terbaru dari Supabase Cloud...", "info");

    try {
      // 1. Settings
      const { data: settingsData } = await this.client.from("app_settings").select("*").limit(1).single();
      if (settingsData) {
        StorageService.saveSettings({
          schoolName: settingsData.school_name,
          teacherName: settingsData.teacher_name,
          teacherNip: settingsData.teacher_nip,
          headmasterName: settingsData.headmaster_name,
          headmasterNip: settingsData.headmaster_nip,
          academicYear: settingsData.academic_year,
          semester: settingsData.semester,
          defaultKktp: Number(settingsData.default_kktp) || 75
        });
      }

      // 2. Students
      const { data: studentsData, error: sErr } = await this.client.from("students").select("*");
      if (!sErr && studentsData) {
        const mappedStudents = studentsData.map(s => ({
          id: s.id,
          nisn: s.nisn,
          name: s.name,
          gender: s.gender,
          classId: s.class_id,
          level: s.level,
          notes: s.notes
        }));
        StorageService.saveStudents(mappedStudents);
      }

      // 3. Journal
      const { data: journalData, error: jErr } = await this.client.from("jurnal_entries").select("*");
      if (!jErr && journalData) {
        const mappedJournal = journalData.map(j => ({
          id: j.id,
          date: j.date,
          time: j.time,
          classId: j.class_id,
          level: j.level,
          meetingNo: j.meeting_no,
          semester: j.semester,
          aspect: j.aspect,
          chapter: j.chapter,
          topic: j.topic,
          tp: j.tp,
          activity: j.activity,
          attendance: j.attendance,
          status: j.status,
          notes: j.notes
        }));
        StorageService.saveJournal(mappedJournal);
      }

      // 4. Assignments
      const { data: asgData, error: aErr } = await this.client.from("assignments").select("*");
      if (!aErr && asgData) {
        const mappedAssignments = asgData.map(a => ({
          id: a.id,
          classId: a.class_id,
          level: a.level,
          title: a.title,
          category: a.category,
          date: a.date,
          dueDate: a.due_date,
          maxScore: Number(a.max_score) || 100,
          kktp: Number(a.kktp) || 75,
          description: a.description,
          scores: a.scores || {}
        }));
        StorageService.saveAssignments(mappedAssignments);
      }

      // Refresh UI
      if (window.JournalModule) JournalModule.render();
      if (window.GradesModule) GradesModule.render();
      if (window.StudentsModule) StudentsModule.render();
      if (window.App) {
        App.updateDashboardStats();
        App.populateSettingsForm();
      }

      App.showToast("Seluruh data berhasil disinkronkan dari Supabase Cloud!", "success");
      return { success: true };
    } catch (e) {
      console.error("Gagal sinkron dari Supabase:", e);
      App.showToast("Gagal mengambil data dari Supabase: " + e.message, "danger");
      return { success: false, error: e.message };
    }
  },

  // Push all local data to Supabase
  async pushAllToSupabase() {
    if (!this.client) {
      App.showToast("Supabase belum dikonfigurasi.", "warning");
      return { success: false };
    }

    App.showToast("Mengunggah seluruh data ke Supabase Cloud...", "info");

    try {
      // 1. Settings
      const settings = StorageService.getSettings();
      await this.client.from("app_settings").upsert({
        id: "default_settings",
        school_name: settings.schoolName,
        teacher_name: settings.teacherName,
        teacher_nip: settings.teacherNip,
        headmaster_name: settings.headmasterName,
        headmaster_nip: settings.headmasterNip,
        academic_year: settings.academicYear,
        semester: settings.semester,
        default_kktp: settings.defaultKktp,
        updated_at: new Date().toISOString()
      });

      // 2. Students
      const students = StorageService.getStudents();
      if (students.length > 0) {
        const studentPayload = students.map(s => ({
          id: s.id,
          nisn: s.nisn,
          name: s.name,
          gender: s.gender,
          class_id: s.classId,
          level: s.level,
          notes: s.notes
        }));
        await this.client.from("students").upsert(studentPayload);
      }

      // 3. Journal
      const journal = StorageService.getJournal();
      if (journal.length > 0) {
        const journalPayload = journal.map(j => ({
          id: j.id,
          date: j.date,
          time: j.time,
          class_id: j.classId,
          level: j.level,
          meeting_no: j.meetingNo,
          semester: j.semester,
          aspect: j.aspect,
          chapter: j.chapter,
          topic: j.topic,
          tp: j.tp,
          activity: j.activity,
          attendance: j.attendance,
          status: j.status,
          notes: j.notes
        }));
        await this.client.from("jurnal_entries").upsert(journalPayload);
      }

      // 4. Assignments
      const assignments = StorageService.getAssignments();
      if (assignments.length > 0) {
        const asgPayload = assignments.map(a => ({
          id: a.id,
          class_id: a.classId,
          level: a.level,
          title: a.title,
          category: a.category,
          date: a.date,
          due_date: a.dueDate,
          max_score: a.maxScore,
          kktp: a.kktp,
          description: a.description,
          scores: a.scores || {}
        }));
        await this.client.from("assignments").upsert(asgPayload);
      }

      App.showToast("Seluruh data lokal berhasil diunggah ke Supabase Cloud!", "success");
      return { success: true };
    } catch (e) {
      console.error("Gagal mengunggah ke Supabase:", e);
      App.showToast("Gagal mengunggah ke Supabase: " + e.message, "danger");
      return { success: false, error: e.message };
    }
  },

  // Single Upsert Helpers for Realtime Saving
  async saveStudentRemote(student) {
    if (!this.client || !this.isConnected) return;
    try {
      await this.client.from("students").upsert({
        id: student.id,
        nisn: student.nisn,
        name: student.name,
        gender: student.gender,
        class_id: student.classId,
        level: student.level,
        notes: student.notes
      });
    } catch (e) {
      console.warn("Gagal sinkron siswa ke Supabase:", e);
    }
  },

  async deleteStudentRemote(studentId) {
    if (!this.client || !this.isConnected) return;
    try {
      await this.client.from("students").delete().eq("id", studentId);
    } catch (e) {
      console.warn("Gagal menghapus siswa di Supabase:", e);
    }
  },

  async saveJournalRemote(entry) {
    if (!this.client || !this.isConnected) return;
    try {
      await this.client.from("jurnal_entries").upsert({
        id: entry.id,
        date: entry.date,
        time: entry.time,
        class_id: entry.classId,
        level: entry.level,
        meeting_no: entry.meetingNo,
        semester: entry.semester,
        aspect: entry.aspect,
        chapter: entry.chapter,
        topic: entry.topic,
        tp: entry.tp,
        activity: entry.activity,
        attendance: entry.attendance,
        status: entry.status,
        notes: entry.notes
      });
    } catch (e) {
      console.warn("Gagal sinkron jurnal ke Supabase:", e);
    }
  },

  async deleteJournalRemote(journalId) {
    if (!this.client || !this.isConnected) return;
    try {
      await this.client.from("jurnal_entries").delete().eq("id", journalId);
    } catch (e) {
      console.warn("Gagal menghapus jurnal di Supabase:", e);
    }
  },

  async saveAssignmentRemote(asg) {
    if (!this.client || !this.isConnected) return;
    try {
      await this.client.from("assignments").upsert({
        id: asg.id,
        class_id: asg.classId,
        level: asg.level,
        title: asg.title,
        category: asg.category,
        date: asg.date,
        due_date: asg.dueDate,
        max_score: asg.maxScore,
        kktp: asg.kktp,
        description: asg.description,
        scores: asg.scores || {}
      });
    } catch (e) {
      console.warn("Gagal sinkron tugas ke Supabase:", e);
    }
  },

  async deleteAssignmentRemote(assignmentId) {
    if (!this.client || !this.isConnected) return;
    try {
      await this.client.from("assignments").delete().eq("id", assignmentId);
    } catch (e) {
      console.warn("Gagal menghapus tugas di Supabase:", e);
    }
  }
};
