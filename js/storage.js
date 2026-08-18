/**
 * Storage & Data Management Layer
 * Handles LocalStorage persistence, backup/restore, CSV/JSON export, and Supabase hooks.
 */

const STORAGE_KEYS = {
  SETTINGS: "jurnal_pai_settings_v1",
  CLASSES: "jurnal_pai_classes_v1",
  STUDENTS: "jurnal_pai_students_v1",
  JOURNAL: "jurnal_pai_journal_v1",
  ASSIGNMENTS: "jurnal_pai_assignments_v1"
};

const StorageService = {
  // Inisialisasi storage bersih
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.saveSettings(DEFAULT_SETTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CLASSES)) {
      this.saveClasses(DEFAULT_CLASSES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      this.saveStudents([]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.JOURNAL)) {
      this.saveJournal([]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS)) {
      this.saveAssignments([]);
    }
  },

  // Kosongkan seluruh data jurnal, siswa, dan nilai
  clearAllData() {
    this.saveStudents([]);
    this.saveJournal([]);
    this.saveAssignments([]);
  },

  // Reset seluruh data kembali ke pengaturan awal
  resetToDefault() {
    this.saveSettings(DEFAULT_SETTINGS);
    this.saveClasses(DEFAULT_CLASSES);
    this.saveStudents([]);
    this.saveJournal([]);
    this.saveAssignments([]);
  },

  // Settings
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (e) {
      console.error("Error reading settings", e);
      return DEFAULT_SETTINGS;
    }
  },
  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Classes
  getClasses() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CLASSES);
      let list = data ? JSON.parse(data) : DEFAULT_CLASSES;
      // Pastikan kelas SMP selalu ada jika data lama di browser hanya berisi kelas SD
      if (!Array.isArray(list) || list.length < DEFAULT_CLASSES.length) {
        list = DEFAULT_CLASSES;
        this.saveClasses(list);
      }
      return list;
    } catch (e) {
      console.error("Error reading classes", e);
      return DEFAULT_CLASSES;
    }
  },
  saveClasses(classes) {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  },

  // Students
  getStudents() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading students", e);
      return [];
    }
  },
  saveStudents(students) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  // Journal Entries
  getJournal() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JOURNAL);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading journal", e);
      return [];
    }
  },
  saveJournal(journal) {
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(journal));
  },

  // Assignments & Grades
  getAssignments() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading assignments", e);
      return [];
    }
  },
  saveAssignments(assignments) {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  },

  // Backup All Data as JSON
  exportAllBackup() {
    const data = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      settings: this.getSettings(),
      classes: this.getClasses(),
      students: this.getStudents(),
      journal: this.getJournal(),
      assignments: this.getAssignments()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    a.href = url;
    a.download = `backup_jurnal_mengajar_pai_thhk_${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Import Backup JSON
  importBackup(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) this.saveSettings(data.settings);
      if (data.classes) this.saveClasses(data.classes);
      if (data.students) this.saveStudents(data.students);
      if (data.journal) this.saveJournal(data.journal);
      if (data.assignments) this.saveAssignments(data.assignments);
      return { success: true, message: "Data berhasil dipulihkan secara lengkap!" };
    } catch (e) {
      return { success: false, message: "Format file backup tidak valid: " + e.message };
    }
  },

  // Export Journal to CSV
  exportJournalCSV(filteredEntries) {
    const classes = this.getClasses();
    const classMap = Object.fromEntries(classes.map(c => [c.id, c.name]));

    const headers = [
      "ID",
      "Tanggal",
      "Jenjang",
      "Kelas",
      "Pertemuan Ke",
      "Aspek PAI",
      "Bab / Materi Pokok",
      "Tujuan Pembelajaran (TP/KD)",
      "Kegiatan Pembelajaran",
      "Kehadiran",
      "Status",
      "Catatan Guru"
    ];

    const rows = filteredEntries.map(e => [
      `"${e.id}"`,
      `"${e.date}"`,
      `"${e.level || ''}"`,
      `"${classMap[e.classId] || e.classId}"`,
      `"${e.meetingNo || ''}"`,
      `"${e.aspect || ''}"`,
      `"${(e.chapter || '').replace(/"/g, '""')}"`,
      `"${(e.tp || '').replace(/"/g, '""')}"`,
      `"${(e.activity || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${(e.attendance || '').replace(/"/g, '""')}"`,
      `"${e.status || ''}"`,
      `"${(e.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rekap_jurnal_mengajar_pai_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Export Grades & Leger to CSV
  exportGradesCSV(classId) {
    const classes = this.getClasses();
    const targetClass = classes.find(c => c.id === classId);
    const className = targetClass ? targetClass.name : "Semua_Kelas";

    const allStudents = this.getStudents().filter(s => !classId || s.classId === classId);
    const allAssignments = this.getAssignments().filter(a => !classId || a.classId === classId);

    const headers = ["NISN", "Nama Siswa", "Kelas", ...allAssignments.map(a => `"${a.title} (${a.category})"`), "Rata-Rata", "Status KKTP"];

    const rows = allStudents.map(s => {
      let total = 0;
      let count = 0;
      const scoreCols = allAssignments.map(a => {
        const score = a.scores && a.scores[s.id] !== undefined ? a.scores[s.id] : "";
        if (score !== "" && !isNaN(score)) {
          total += Number(score);
          count++;
        }
        return score;
      });

      const avg = count > 0 ? (total / count).toFixed(1) : "-";
      const kktp = this.getSettings().defaultKktp || 75;
      const status = avg !== "-" ? (Number(avg) >= kktp ? "Tuntas" : "Belum Tuntas") : "-";

      const cObj = classes.find(c => c.id === s.classId);
      return [
        `"${s.nisn}"`,
        `"${s.name}"`,
        `"${cObj ? cObj.name : s.classId}"`,
        ...scoreCols,
        avg,
        `"${status}"`
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rekap_nilai_pai_${className.replace(/\s+/g, '_')}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
};
