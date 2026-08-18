/**
 * Main Application Controller (App.js)
 * Manages routing, dashboard metrics, syllabus browser, official print generation, settings, Supabase sync, and UI utilities.
 */

const App = {
  currentTab: "dashboard",

  init() {
    StorageService.init();
    if (window.SupabaseService) SupabaseService.initClient();

    // Initialize modules
    if (window.JournalModule) JournalModule.init();
    if (window.GradesModule) GradesModule.init();
    if (window.StudentsModule) StudentsModule.init();

    this.bindGlobalEvents();
    this.renderSyllabusBrowser();
    this.populateSettingsForm();
    this.updateDashboardStats();
    this.renderRecentActivities();
    this.setupPrintGenerators();
  },

  bindGlobalEvents() {
    // Navigation Tabs
    document.querySelectorAll(".nav-item").forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const tabId = item.dataset.tab;
        this.navigateTo(tabId);
      });
    });

    // Modal Close buttons
    document.querySelectorAll("[data-close-modal]").forEach(btn => {
      btn.addEventListener("click", () => {
        const modalId = btn.closest(".modal-overlay").id;
        this.closeModal(modalId);
      });
    });

    // Close modal on backdrop click
    document.querySelectorAll(".modal-overlay").forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });

    // Escape key closes open modals
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-overlay.active").forEach(m => {
          this.closeModal(m.id);
        });
      }
    });

    // Settings Form
    const settingsForm = document.getElementById("settingsForm");
    if (settingsForm) {
      settingsForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveSettings();
      });
    }

    // Supabase Config Form
    const supabaseForm = document.getElementById("supabaseConfigForm");
    if (supabaseForm) {
      supabaseForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveSupabaseConfig();
      });
    }

    // Test Supabase Connection
    const testSupabaseBtn = document.getElementById("testSupabaseBtn");
    if (testSupabaseBtn) {
      testSupabaseBtn.addEventListener("click", async () => {
        this.showToast("Menguji koneksi ke Supabase...", "info");
        const ok = await SupabaseService.checkConnection();
        if (ok) {
          this.showToast("Koneksi Supabase Berhasil! Database terhubung.", "success");
        } else {
          this.showToast("Gagal terhubung. Pastikan URL, Anon Key, dan SQL Schema sudah dibuat.", "danger");
        }
      });
    }

    // Pull from Supabase
    const pullSupabaseBtn = document.getElementById("pullSupabaseBtn");
    if (pullSupabaseBtn) {
      pullSupabaseBtn.addEventListener("click", () => {
        SupabaseService.pullFromSupabase();
      });
    }

    // Push to Supabase
    const pushSupabaseBtn = document.getElementById("pushSupabaseBtn");
    if (pushSupabaseBtn) {
      pushSupabaseBtn.addEventListener("click", () => {
        SupabaseService.pushAllToSupabase();
      });
    }

    // Copy SQL Schema Modal / Trigger
    const copySqlBtn = document.getElementById("copySqlSchemaBtn");
    if (copySqlBtn) {
      copySqlBtn.addEventListener("click", () => {
        this.openModal("sqlModal");
      });
    }

    // Backup Export
    const exportBackupBtn = document.getElementById("exportBackupBtn");
    if (exportBackupBtn) {
      exportBackupBtn.addEventListener("click", () => {
        StorageService.exportAllBackup();
        this.showToast("File backup JSON berhasil diunduh!", "success");
      });
    }

    // Backup Import
    const importBackupInput = document.getElementById("importBackupFileInput");
    if (importBackupInput) {
      importBackupInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const res = StorageService.importBackup(event.target.result);
          if (res.success) {
            this.showToast(res.message, "success");
            setTimeout(() => location.reload(), 1200);
          } else {
            this.showToast(res.message, "danger");
          }
        };
        reader.readAsText(file);
      });
    }

    // Tombol Kosongkan Semua Data (Clean Slate)
    const clearAllDataBtn = document.getElementById("clearAllDataBtn");
    if (clearAllDataBtn) {
      clearAllDataBtn.addEventListener("click", () => {
        if (confirm("KOSONGKAN SEMUA DATA:\nApakah Anda yakin ingin mengosongkan seluruh catatan jurnal, data siswa, dan buku nilai? Anda akan memulai dengan lembar kerja bersih.")) {
          StorageService.clearAllData();
          this.showToast("Semua data jurnal, siswa, dan nilai telah dikosongkan. Siap diisi data baru!", "info");
          setTimeout(() => location.reload(), 1000);
        }
      });
    }

    // Reset Data ke Awal
    const resetDataBtn = document.getElementById("resetDataBtn");
    if (resetDataBtn) {
      resetDataBtn.addEventListener("click", () => {
        if (confirm("PERINGATAN: Apakah Anda yakin ingin mereset seluruh data kembali ke pengaturan awal?")) {
          StorageService.resetToDefault();
          this.showToast("Data berhasil direset ke pengaturan awal.", "info");
          setTimeout(() => location.reload(), 1000);
        }
      });
    }
  },

  navigateTo(tabId) {
    this.currentTab = tabId;

    // Update active nav
    document.querySelectorAll(".nav-item").forEach(item => {
      item.classList.toggle("active", item.dataset.tab === tabId);
    });

    // Update active view
    document.querySelectorAll(".view-section").forEach(section => {
      section.classList.toggle("active", section.id === `view-${tabId}`);
    });

    // Trigger tab-specific refreshes
    if (tabId === "dashboard") {
      this.updateDashboardStats();
      this.renderRecentActivities();
    } else if (tabId === "journal") {
      if (window.JournalModule) {
        JournalModule.renderClassFilterPills();
        JournalModule.render();
      }
    } else if (tabId === "grades") {
      if (window.GradesModule) {
        GradesModule.renderClassFilterPills();
        GradesModule.render();
      }
    } else if (tabId === "students") {
      if (window.StudentsModule) {
        StudentsModule.renderClassFilterPills();
        StudentsModule.render();
      }
    } else if (tabId === "settings") {
      this.populateSettingsForm();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  updateDashboardStats() {
    const journal = StorageService.getJournal();
    const students = StorageService.getStudents();
    const assignments = StorageService.getAssignments();
    const settings = StorageService.getSettings();

    // Counts
    const totalJournals = journal.length;
    const sdJournals = journal.filter(j => j.level === "SD").length;
    const smpJournals = journal.filter(j => j.level === "SMP").length;

    const totalStudents = students.length;
    const sdStudents = students.filter(s => s.level === "SD").length;
    const smpStudents = students.filter(s => s.level === "SMP").length;

    const totalAssignments = assignments.length;

    // Calculate global average score
    let totalScoreSum = 0;
    let totalScoreCount = 0;
    assignments.forEach(a => {
      if (a.scores) {
        Object.values(a.scores).forEach(score => {
          if (score !== "" && score !== null && !isNaN(score)) {
            totalScoreSum += Number(score);
            totalScoreCount++;
          }
        });
      }
    });

    const globalAvg = totalScoreCount > 0 ? (totalScoreSum / totalScoreCount).toFixed(1) : "-";

    // Set UI elements
    const elJournals = document.getElementById("dashTotalJournals");
    if (elJournals) elJournals.textContent = totalJournals;

    const elJournalsBreakdown = document.getElementById("dashJournalsBreakdown");
    if (elJournalsBreakdown) elJournalsBreakdown.textContent = `${sdJournals} SD &bull; ${smpJournals} SMP`;

    const elAssignments = document.getElementById("dashTotalAssignments");
    if (elAssignments) elAssignments.textContent = totalAssignments;

    const elStudents = document.getElementById("dashTotalStudents");
    if (elStudents) elStudents.textContent = totalStudents;

    const elStudentsBreakdown = document.getElementById("dashStudentsBreakdown");
    if (elStudentsBreakdown) elStudentsBreakdown.textContent = `${sdStudents} Siswa SD &bull; ${smpStudents} Siswa SMP`;

    const elAvg = document.getElementById("dashGlobalAvg");
    if (elAvg) elAvg.textContent = globalAvg;

    // Header greetings
    const headerSchool = document.getElementById("headerSchoolName");
    if (headerSchool) headerSchool.textContent = settings.schoolName || "SEKOLAH THHK";

    const headerTeacher = document.getElementById("headerTeacherName");
    if (headerTeacher) headerTeacher.textContent = settings.teacherName || "Guru Pendidikan Agama Islam";

    if (window.SupabaseService) SupabaseService.updateStatusBadge();
  },

  renderRecentActivities() {
    const container = document.getElementById("dashRecentJournalsList");
    if (!container) return;

    const journal = StorageService.getJournal().slice(0, 5);
    const classes = StorageService.getClasses();
    const classMap = Object.fromEntries(classes.map(c => [c.id, c]));

    if (journal.length === 0) {
      container.innerHTML = `
        <div class="empty-state py-4 text-muted">
          <div class="empty-icon">📖</div>
          <h4>Belum Ada Catatan Jurnal</h4>
          <p>Mulai catat materi pertama Anda dengan menekan tombol <strong>"+ Catat Jurnal Baru"</strong>.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = journal.map(item => {
      const cls = classMap[item.classId] || { name: item.classId, level: item.level || "SD" };
      return `
        <div class="dash-activity-item" onclick="JournalModule.viewDetails('${item.id}')">
          <div class="dash-activity-badge ${cls.level === 'SD' ? 'bg-sd' : 'bg-smp'}">
            ${cls.level}
          </div>
          <div class="dash-activity-content">
            <div class="dash-activity-title">
              <strong>${cls.name}</strong> &bull; Pertemuan ${item.meetingNo || 1} &bull; <span class="text-primary">${item.aspect}</span>
            </div>
            <div class="dash-activity-topic">${item.topic}</div>
            <div class="dash-activity-time text-xs text-muted">
              📅 ${item.date} &bull; ${item.time || ''}
            </div>
          </div>
          <div class="dash-activity-status">
            <span class="badge ${item.status === 'Selesai' ? 'badge-success' : 'badge-warning'}">${item.status}</span>
          </div>
        </div>
      `;
    }).join("");
  },

  // Bank Materi / Silabus PAI Explorer
  renderSyllabusBrowser() {
    const container = document.getElementById("syllabusGridContainer");
    const levelSelect = document.getElementById("syllabusLevelFilter");
    const aspectSelect = document.getElementById("syllabusAspectFilter");
    const searchInput = document.getElementById("syllabusSearchInput");

    const renderFilteredSyllabus = () => {
      if (!container) return;

      const levelFilter = levelSelect ? levelSelect.value : "all";
      const aspectFilter = aspectSelect ? aspectSelect.value : "all";
      const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

      const classes = StorageService.getClasses();
      const classMap = Object.fromEntries(classes.map(c => [c.id, c]));

      let list = PAI_SYLLABUS;

      if (levelFilter !== "all") {
        list = list.filter(item => item.level === levelFilter);
      }

      if (aspectFilter !== "all") {
        list = list.filter(item => item.aspect === aspectFilter);
      }

      if (query) {
        list = list.filter(item => 
          item.chapter.toLowerCase().includes(query) ||
          item.topic.toLowerCase().includes(query) ||
          item.tp.toLowerCase().includes(query) ||
          item.aspect.toLowerCase().includes(query)
        );
      }

      if (list.length === 0) {
        container.innerHTML = `<div class="empty-state py-4">Materi tidak ditemukan dengan filter saat ini.</div>`;
        return;
      }

      container.innerHTML = list.map((item, idx) => {
        const cls = classMap[item.classId] || { name: item.classId, level: item.level };
        const aspectBadge = JournalModule ? JournalModule.getAspectBadgeClass(item.aspect) : "badge-primary";

        return `
          <div class="syllabus-card card-elevated">
            <div class="syllabus-card-header">
              <div>
                <span class="badge ${cls.level === 'SD' ? 'badge-sd' : 'badge-smp'}">${cls.level}</span>
                <span class="badge badge-outline">${cls.name}</span>
                <span class="badge ${aspectBadge}">${item.aspect}</span>
              </div>
            </div>
            <div class="syllabus-card-body">
              <h4 class="syllabus-chapter">${item.chapter}</h4>
              <h3 class="syllabus-topic">${item.topic}</h3>

              <div class="syllabus-section">
                <span class="syllabus-section-label">🎯 Capaian / TP:</span>
                <p class="syllabus-section-p">${item.tp}</p>
              </div>

              <div class="syllabus-section">
                <span class="syllabus-section-label">💡 Rekomendasi Kegiatan:</span>
                <p class="syllabus-section-p text-muted">${item.activities}</p>
              </div>
            </div>
            <div class="syllabus-card-footer">
              <button class="btn btn-sm btn-primary w-100" onclick="App.createJournalFromSyllabus('${item.classId}', ${idx})">
                <span>➕</span> Gunakan Materi Ini di Jurnal
              </button>
            </div>
          </div>
        `;
      }).join("");
    };

    if (levelSelect) levelSelect.addEventListener("change", renderFilteredSyllabus);
    if (aspectSelect) aspectSelect.addEventListener("change", renderFilteredSyllabus);
    if (searchInput) searchInput.addEventListener("input", renderFilteredSyllabus);

    renderFilteredSyllabus();
  },

  createJournalFromSyllabus(classId, idx) {
    this.navigateTo("journal");
    JournalModule.openAddModal();

    setTimeout(() => {
      const classSelect = document.getElementById("journalClassSelect");
      if (classSelect) {
        classSelect.value = classId;
        const selectedOption = classSelect.options[classSelect.selectedIndex];
        document.getElementById("journalFormLevel").value = selectedOption ? selectedOption.dataset.level : "SD";
        JournalModule.populateSyllabusPreset(classId);
      }

      const item = PAI_SYLLABUS[idx];
      if (item) {
        document.getElementById("journalAspect").value = item.aspect;
        document.getElementById("journalChapter").value = item.chapter;
        document.getElementById("journalTopic").value = item.topic;
        document.getElementById("journalTp").value = item.tp;
        document.getElementById("journalActivity").value = item.activities;
      }
    }, 150);
  },

  // Setup Print Reports
  setupPrintGenerators() {
    const btnPrintJournalReport = document.getElementById("generateJournalPrintBtn");
    if (btnPrintJournalReport) {
      btnPrintJournalReport.addEventListener("click", () => this.generateOfficialJournalReport());
    }

    const btnPrintGradeReport = document.getElementById("generateGradePrintBtn");
    if (btnPrintGradeReport) {
      btnPrintGradeReport.addEventListener("click", () => this.generateOfficialGradeReport());
    }
  },

  generateOfficialJournalReport() {
    const classId = document.getElementById("printJournalClass").value;
    const semester = document.getElementById("printJournalSemester").value;
    const settings = StorageService.getSettings();
    const classes = StorageService.getClasses();
    const classMap = Object.fromEntries(classes.map(c => [c.id, c]));

    let journals = StorageService.getJournal();
    if (classId !== "all") {
      journals = journals.filter(j => j.classId === classId);
    }
    if (semester !== "all") {
      journals = journals.filter(j => (j.semester || settings.semester).includes(semester));
    }

    journals.sort((a, b) => new Date(a.date) - new Date(b.date));

    const targetClassName = classId === "all" ? "Seluruh Jenjang (SD & SMP)" : (classMap[classId] ? classMap[classId].name : classId);

    const reportHtml = `
      <div class="print-official-container">
        <div class="kop-surat text-center mb-3">
          <h3 class="school-title mb-0">${settings.schoolName || 'SEKOLAH THHK'}</h3>
          <h2 class="document-title">REKAPITULASI JURNAL AGENDA MENGAJAR GURU</h2>
          <h5 class="subject-title">MATA PELAJARAN: PENDIDIKAN AGAMA ISLAM & BUDI PEKERTI</h5>
          <div class="header-divider"></div>
        </div>

        <table class="table-info-meta mb-3">
          <tr>
            <td width="20%"><strong>Nama Guru</strong></td>
            <td width="30%">: ${settings.teacherName || 'Guru PAI THHK'}</td>
            <td width="20%"><strong>Tahun Ajaran</strong></td>
            <td width="30%">: ${settings.academicYear || '2024/2025'}</td>
          </tr>
          <tr>
            <td><strong>NIP</strong></td>
            <td>: ${settings.teacherNip || '-'}</td>
            <td><strong>Semester</strong></td>
            <td>: ${semester === 'all' ? (settings.semester || '1 (Ganjil)') : semester}</td>
          </tr>
          <tr>
            <td><strong>Kelas / Jenjang</strong></td>
            <td>: ${targetClassName}</td>
            <td><strong>Total Pertemuan</strong></td>
            <td>: ${journals.length} Pertemuan Pembelajaran</td>
          </tr>
        </table>

        <table class="table table-bordered table-print-custom">
          <thead>
            <tr>
              <th width="30" class="text-center">No</th>
              <th width="85">Hari/Tgl</th>
              <th width="70">Kelas</th>
              <th width="40" class="text-center">Ke-</th>
              <th width="100">Aspek PAI</th>
              <th width="150">Materi Pokok / Bab</th>
              <th>Tujuan Pembelajaran (TP) & Ringkasan KBM</th>
              <th width="80">Kehadiran</th>
              <th width="70" class="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            ${journals.length === 0 ? `<tr><td colspan="9" class="text-center py-3">Tidak ada data jurnal mengajar yang sesuai filter.</td></tr>` : 
              journals.map((j, idx) => {
                const cls = classMap[j.classId] || { name: j.classId, level: j.level };
                return `
                  <tr>
                    <td class="text-center">${idx + 1}</td>
                    <td class="text-xs"><strong>${j.date}</strong><br><span class="text-muted">${j.time || ''}</span></td>
                    <td class="text-xs"><strong>${cls.name}</strong></td>
                    <td class="text-center"><strong>${j.meetingNo || 1}</strong></td>
                    <td class="text-xs font-semibold">${j.aspect}</td>
                    <td class="text-xs">
                      <strong>${j.chapter}</strong><br>
                      ${j.topic}
                    </td>
                    <td class="text-xs">
                      <div class="mb-1"><strong>TP:</strong> ${j.tp}</div>
                      <div class="text-muted"><strong>KBM:</strong> ${j.activity}</div>
                    </td>
                    <td class="text-xs">${j.attendance || 'Lengkap'}</td>
                    <td class="text-center text-xs"><strong>${j.status || 'Selesai'}</strong></td>
                  </tr>
                `;
              }).join("")
            }
          </tbody>
        </table>

        <div class="signature-section mt-5">
          <div class="sig-col">
            <p>Mengetahui,</p>
            <p class="sig-title">Kepala Sekolah THHK</p>
            <div class="sig-space"></div>
            <p class="sig-name"><strong>${settings.headmasterName || 'Kepala Sekolah THHK'}</strong></p>
            <p class="sig-nip">NIP: ${settings.headmasterNip || '-'}</p>
          </div>
          <div class="sig-col text-right">
            <p>Guru Mata Pelajaran,</p>
            <p class="sig-title">Pendidikan Agama Islam</p>
            <div class="sig-space"></div>
            <p class="sig-name"><strong>${settings.teacherName || 'Guru PAI THHK'}</strong></p>
            <p class="sig-nip">NIP: ${settings.teacherNip || '-'}</p>
          </div>
        </div>
      </div>
    `;

    document.getElementById("printReportPreviewContainer").innerHTML = reportHtml;
    document.getElementById("printReportPreviewCard").classList.remove("d-none");
    document.getElementById("printReportPreviewCard").scrollIntoView({ behavior: "smooth" });
  },

  generateOfficialGradeReport() {
    const classId = document.getElementById("printGradeClass").value;
    const settings = StorageService.getSettings();
    const classes = StorageService.getClasses();
    const cls = classes.find(c => c.id === classId) || { name: classId, level: "SD" };

    const students = StorageService.getStudents().filter(s => s.classId === classId);
    const assignments = StorageService.getAssignments().filter(a => a.classId === classId);
    const defaultKktp = settings.defaultKktp || 75;

    let totalScoreSum = 0;
    let scoreCount = 0;

    let tableHeaders = `
      <tr>
        <th width="35" class="text-center">No</th>
        <th width="90">NISN</th>
        <th>Nama Lengkap Siswa</th>
        <th width="40" class="text-center">L/P</th>
    `;

    assignments.forEach(a => {
      tableHeaders += `
        <th class="text-center text-xs">
          ${a.title}<br>
          <span class="badge-mini">(${a.category})</span>
        </th>
      `;
    });

    tableHeaders += `
        <th width="70" class="text-center">Rata-Rata</th>
        <th width="90" class="text-center">Status KKTP</th>
      </tr>
    `;

    let tableRows = students.map((s, idx) => {
      let sum = 0;
      let cnt = 0;

      let scoreCols = assignments.map(a => {
        const sc = a.scores ? a.scores[s.id] : undefined;
        if (sc !== undefined && sc !== "" && !isNaN(sc)) {
          sum += Number(sc);
          cnt++;
          totalScoreSum += Number(sc);
          scoreCount++;
          return `<td class="text-center font-semibold ${Number(sc) >= a.kktp ? '' : 'text-danger'}">${sc}</td>`;
        }
        return `<td class="text-center text-muted">-</td>`;
      }).join("");

      const avg = cnt > 0 ? (sum / cnt).toFixed(1) : "-";
      const isPass = avg !== "-" && Number(avg) >= defaultKktp;

      return `
        <tr>
          <td class="text-center">${idx + 1}</td>
          <td class="font-mono text-xs">${s.nisn}</td>
          <td><strong>${s.name}</strong></td>
          <td class="text-center">${s.gender}</td>
          ${scoreCols}
          <td class="text-center font-bold ${avg !== '-' ? (isPass ? '' : 'text-danger') : ''}">${avg}</td>
          <td class="text-center font-semibold text-xs">${avg !== '-' ? (isPass ? 'TUNTAS' : 'BELUM TUNTAS') : '-'}</td>
        </tr>
      `;
    }).join("");

    const classAverage = scoreCount > 0 ? (totalScoreSum / scoreCount).toFixed(1) : "-";

    const reportHtml = `
      <div class="print-official-container">
        <div class="kop-surat text-center mb-3">
          <h3 class="school-title mb-0">${settings.schoolName || 'SEKOLAH THHK'}</h3>
          <h2 class="document-title">LEGER & DAFTAR NILAI PENDIDIKAN AGAMA ISLAM</h2>
          <h5 class="subject-title">KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP): ${defaultKktp}</h5>
          <div class="header-divider"></div>
        </div>

        <table class="table-info-meta mb-3">
          <tr>
            <td width="20%"><strong>Jenjang & Kelas</strong></td>
            <td width="30%">: ${cls.level} / ${cls.name}</td>
            <td width="20%"><strong>Tahun Ajaran</strong></td>
            <td width="30%">: ${settings.academicYear || '2024/2025'}</td>
          </tr>
          <tr>
            <td><strong>Guru Pengampu</strong></td>
            <td>: ${settings.teacherName || 'Guru PAI THHK'}</td>
            <td><strong>Semester</strong></td>
            <td>: ${settings.semester || '1 (Ganjil)'}</td>
          </tr>
          <tr>
            <td><strong>Jumlah Siswa</strong></td>
            <td>: ${students.length} Siswa</td>
            <td><strong>Rata-Rata Kelas</strong></td>
            <td>: <strong>${classAverage}</strong></td>
          </tr>
        </table>

        <table class="table table-bordered table-print-custom">
          <thead>${tableHeaders}</thead>
          <tbody>${tableRows || `<tr><td colspan="${4 + assignments.length + 2}" class="text-center py-3">Tidak ada data siswa untuk kelas ini.</td></tr>`}</tbody>
        </table>

        <div class="signature-section mt-5">
          <div class="sig-col">
            <p>Mengetahui,</p>
            <p class="sig-title">Kepala Sekolah THHK</p>
            <div class="sig-space"></div>
            <p class="sig-name"><strong>${settings.headmasterName || 'Kepala Sekolah THHK'}</strong></p>
            <p class="sig-nip">NIP: ${settings.headmasterNip || '-'}</p>
          </div>
          <div class="sig-col text-right">
            <p>Guru Mata Pelajaran,</p>
            <p class="sig-title">Pendidikan Agama Islam</p>
            <div class="sig-space"></div>
            <p class="sig-name"><strong>${settings.teacherName || 'Guru PAI THHK'}</strong></p>
            <p class="sig-nip">NIP: ${settings.teacherNip || '-'}</p>
          </div>
        </div>
      </div>
    `;

    document.getElementById("printReportPreviewContainer").innerHTML = reportHtml;
    document.getElementById("printReportPreviewCard").classList.remove("d-none");
    document.getElementById("printReportPreviewCard").scrollIntoView({ behavior: "smooth" });
  },

  triggerBrowserPrint() {
    window.print();
  },

  // Settings & Supabase
  populateSettingsForm() {
    const settings = StorageService.getSettings();
    document.getElementById("settSchoolName").value = settings.schoolName || "SEKOLAH THHK";
    document.getElementById("settTeacherName").value = settings.teacherName || "Guru Pendidikan Agama Islam";
    document.getElementById("settTeacherNip").value = settings.teacherNip || "-";
    document.getElementById("settHeadmasterName").value = settings.headmasterName || "Kepala Sekolah THHK";
    document.getElementById("settHeadmasterNip").value = settings.headmasterNip || "-";
    document.getElementById("settAcademicYear").value = settings.academicYear || "2024/2025";
    document.getElementById("settSemester").value = settings.semester || "1 (Ganjil)";
    document.getElementById("settKktp").value = settings.defaultKktp || 75;

    // Supabase
    if (window.SupabaseService) {
      const config = SupabaseService.getConfig();
      const urlInput = document.getElementById("supabaseUrl");
      const keyInput = document.getElementById("supabaseAnonKey");
      if (urlInput) urlInput.value = config.url || "";
      if (keyInput) keyInput.value = config.anonKey || "";
      SupabaseService.updateStatusBadge();
    }
  },

  saveSettings() {
    const settings = {
      schoolName: document.getElementById("settSchoolName").value.trim(),
      teacherName: document.getElementById("settTeacherName").value.trim(),
      teacherNip: document.getElementById("settTeacherNip").value.trim(),
      headmasterName: document.getElementById("settHeadmasterName").value.trim(),
      headmasterNip: document.getElementById("settHeadmasterNip").value.trim(),
      academicYear: document.getElementById("settAcademicYear").value.trim(),
      semester: document.getElementById("settSemester").value,
      defaultKktp: Number(document.getElementById("settKktp").value) || 75
    };

    StorageService.saveSettings(settings);
    this.showToast("Pengaturan identitas sekolah & guru berhasil disimpan!", "success");
    this.updateDashboardStats();
  },

  saveSupabaseConfig() {
    const url = document.getElementById("supabaseUrl").value.trim();
    const anonKey = document.getElementById("supabaseAnonKey").value.trim();

    SupabaseService.saveConfig({
      url: url,
      anonKey: anonKey,
      autoSync: true
    });

    this.showToast("Konfigurasi Supabase disimpan. Menghubungkan...", "info");
    setTimeout(async () => {
      const ok = await SupabaseService.checkConnection();
      if (ok) {
        this.showToast("Terhubung ke Supabase Cloud Database!", "success");
      } else {
        this.showToast("Periksa kembali Supabase Project URL dan Anon Key Anda.", "warning");
      }
    }, 500);
  },

  // Modal helpers
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("active");
      document.body.classList.add("modal-open");
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("active");
      if (document.querySelectorAll(".modal-overlay.active").length === 0) {
        document.body.classList.remove("modal-open");
      }
    }
  },

  // Toast Notification System
  showToast(message, type = "info", duration = 3000) {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast-message toast-${type}`;
    
    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "warning") icon = "⚠️";
    if (type === "danger") icon = "❌";

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// Auto initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
