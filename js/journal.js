/**
 * Journal Module
 * Handles Jurnal Mengajar PAI SD & SMP THHK CRUD, filtering, and bank materi auto-fill.
 */

const JournalModule = {
  currentFilterLevel: "all", // "all", "SD", "SMP"
  currentFilterClass: "all",
  searchQuery: "",
  editingJournalId: null,

  init() {
    this.populateClassDropdowns();
    this.populateSyllabusPreset();
    this.renderClassFilterPills();
    this.bindEvents();
    this.render();
  },

  populateClassDropdowns() {
    const classes = StorageService.getClasses();
    const filterSelect = document.getElementById("journalFilterClass");
    const formSelect = document.getElementById("journalClassSelect");
    const printSelect = document.getElementById("printJournalClass");

    if (filterSelect) {
      filterSelect.innerHTML = `<option value="all">Semua Kelas</option>` +
        classes.map(c => `<option value="${c.id}">[${c.level}] ${c.name}</option>`).join("");
    }

    if (formSelect) {
      formSelect.innerHTML = `<option value="">-- Pilih Kelas --</option>` +
        classes.map(c => `<option value="${c.id}" data-level="${c.level}">[${c.level}] ${c.name} (${c.phase})</option>`).join("");
    }

    if (printSelect) {
      printSelect.innerHTML = `<option value="all">Semua Kelas (SD & SMP)</option>` +
        classes.map(c => `<option value="${c.id}">[${c.level}] ${c.name}</option>`).join("");
    }
  },

  renderClassFilterPills() {
    const container = document.getElementById("journalClassPillsContainer");
    if (!container) return;

    const classes = StorageService.getClasses();
    let filteredClasses = classes;
    if (this.currentFilterLevel !== "all") {
      filteredClasses = classes.filter(c => c.level === this.currentFilterLevel);
    }

    const journals = StorageService.getJournal();
    const classCountMap = {};
    journals.forEach(j => {
      classCountMap[j.classId] = (classCountMap[j.classId] || 0) + 1;
    });

    let html = `
      <button class="pill-class-btn ${this.currentFilterClass === 'all' ? 'active' : ''}" onclick="JournalModule.filterByClass('all')">
        Semua Kelas (${journals.filter(j => this.currentFilterLevel === 'all' || j.level === this.currentFilterLevel).length})
      </button>
    `;

    filteredClasses.forEach(c => {
      const count = classCountMap[c.id] || 0;
      const isActive = this.currentFilterClass === c.id;
      html += `
        <button class="pill-class-btn ${isActive ? 'active' : ''}" onclick="JournalModule.filterByClass('${c.id}')">
          <span class="badge ${c.level === 'SD' ? 'badge-sd' : 'badge-smp'}">${c.level}</span> ${c.name} (${count})
        </button>
      `;
    });

    container.innerHTML = html;
  },

  filterByClass(classId) {
    this.currentFilterClass = classId;
    const filterSelect = document.getElementById("journalFilterClass");
    if (filterSelect) filterSelect.value = classId;
    this.renderClassFilterPills();
    this.render();
  },

  filterByLevel(level) {
    this.currentFilterLevel = level;
    this.currentFilterClass = "all";

    document.querySelectorAll(".journal-level-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.level === level);
    });

    this.updateClassFilterDropdown();
    this.renderClassFilterPills();
    this.render();
  },

  populateSyllabusPreset(classId = "") {
    const presetSelect = document.getElementById("journalSyllabusPreset");
    if (!presetSelect) return;

    let syllabusList = PAI_SYLLABUS;
    if (classId) {
      syllabusList = PAI_SYLLABUS.filter(item => item.classId === classId);
    }

    presetSelect.innerHTML = `<option value="">-- Pilih dari Bank Materi PAI (Otomatis Isi Form) --</option>` +
      syllabusList.map((item, idx) => `
        <option value="${item.classId}|${idx}">
          [${item.level} - ${item.aspect}] ${item.chapter} : ${item.topic.substring(0, 45)}...
        </option>
      `).join("");
  },

  bindEvents() {
    // Level filter pills
    document.querySelectorAll(".journal-level-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        this.filterByLevel(btn.dataset.level);
      });
    });

    // Class filter select
    const classFilter = document.getElementById("journalFilterClass");
    if (classFilter) {
      classFilter.addEventListener("change", (e) => {
        this.currentFilterClass = e.target.value;
        this.renderClassFilterPills();
        this.render();
      });
    }

    // Search input
    const searchInput = document.getElementById("journalSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.render();
      });
    }

    // Journal Modal Level Toggle (SD / SMP)
    document.querySelectorAll(".journal-modal-level-toggle").forEach(radio => {
      radio.addEventListener("change", (e) => {
        const level = e.target.value;
        this.filterFormClassSelect(level);
      });
    });

    // Form Class change -> Update syllabus presets & default meeting
    const formClassSelect = document.getElementById("journalClassSelect");
    if (formClassSelect) {
      formClassSelect.addEventListener("change", (e) => {
        const classId = e.target.value;
        this.populateSyllabusPreset(classId);
        if (classId) {
          const selectedOption = formClassSelect.options[formClassSelect.selectedIndex];
          const level = selectedOption ? selectedOption.dataset.level : "";
          document.getElementById("journalFormLevel").value = level || "SD";
          
          // Auto calculate next meeting number for this class
          if (!this.editingJournalId) {
            const allJournals = StorageService.getJournal().filter(j => j.classId === classId);
            document.getElementById("journalMeetingNo").value = allJournals.length + 1;
          }
        }
      });
    }

    // Syllabus preset selected -> auto populate fields
    const presetSelect = document.getElementById("journalSyllabusPreset");
    if (presetSelect) {
      presetSelect.addEventListener("change", (e) => {
        if (!e.target.value) return;
        const [cId, idx] = e.target.value.split("|");
        const syllabusItems = PAI_SYLLABUS.filter(item => item.classId === cId);
        const item = syllabusItems[idx] || PAI_SYLLABUS[idx];
        if (item) {
          if (!document.getElementById("journalClassSelect").value) {
            document.getElementById("journalClassSelect").value = item.classId;
            document.getElementById("journalFormLevel").value = item.level;
          }
          document.getElementById("journalAspect").value = item.aspect;
          document.getElementById("journalChapter").value = item.chapter;
          document.getElementById("journalTopic").value = item.topic;
          document.getElementById("journalTp").value = item.tp;
          document.getElementById("journalActivity").value = item.activities;
          App.showToast("Materi silabus berhasil disalin ke form jurnal!", "info");
        }
      });
    }

    // Form submission
    const form = document.getElementById("journalForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveEntry();
      });
    }

    // Export CSV button
    const exportBtn = document.getElementById("exportJournalCsvBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        const entries = this.getFilteredEntries();
        StorageService.exportJournalCSV(entries);
        App.showToast(`Berhasil mengekspor ${entries.length} data jurnal ke CSV!`, "success");
      });
    }
  },

  filterFormClassSelect(level) {
    const classes = StorageService.getClasses();
    const select = document.getElementById("journalClassSelect");
    if (!select) return;

    let filtered = classes;
    if (level && level !== "all") {
      filtered = classes.filter(c => c.level === level);
    }

    select.innerHTML = `<option value="">-- Pilih Kelas (${level.toUpperCase()}) --</option>` +
      filtered.map(c => `<option value="${c.id}" data-level="${c.level}">[${c.level}] ${c.name} (${c.phase})</option>`).join("");
    
    if (filtered.length > 0) {
      select.value = filtered[0].id;
      document.getElementById("journalFormLevel").value = level;
      this.populateSyllabusPreset(filtered[0].id);
      if (!this.editingJournalId) {
        const allJournals = StorageService.getJournal().filter(j => j.classId === filtered[0].id);
        document.getElementById("journalMeetingNo").value = allJournals.length + 1;
      }
    }
  },

  updateClassFilterDropdown() {
    const classes = StorageService.getClasses();
    const filterSelect = document.getElementById("journalFilterClass");
    if (!filterSelect) return;

    let filteredClasses = classes;
    if (this.currentFilterLevel !== "all") {
      filteredClasses = classes.filter(c => c.level === this.currentFilterLevel);
    }

    filterSelect.innerHTML = `<option value="all">Semua Kelas (${this.currentFilterLevel.toUpperCase()})</option>` +
      filteredClasses.map(c => `<option value="${c.id}">[${c.level}] ${c.name}</option>`).join("");
    this.currentFilterClass = "all";
  },

  getFilteredEntries() {
    let list = StorageService.getJournal();
    const classes = StorageService.getClasses();
    const classLevelMap = Object.fromEntries(classes.map(c => [c.id, c.level]));

    // Filter Level (SD / SMP)
    if (this.currentFilterLevel !== "all") {
      list = list.filter(item => {
        const lvl = item.level || classLevelMap[item.classId];
        return lvl === this.currentFilterLevel;
      });
    }

    // Filter Class
    if (this.currentFilterClass !== "all") {
      list = list.filter(item => item.classId === this.currentFilterClass);
    }

    // Search Query
    if (this.searchQuery.trim()) {
      list = list.filter(item => {
        const q = this.searchQuery;
        return (
          (item.topic && item.topic.toLowerCase().includes(q)) ||
          (item.chapter && item.chapter.toLowerCase().includes(q)) ||
          (item.aspect && item.aspect.toLowerCase().includes(q)) ||
          (item.tp && item.tp.toLowerCase().includes(q)) ||
          (item.notes && item.notes.toLowerCase().includes(q))
        );
      });
    }

    // Sort by date descending
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  render() {
    const container = document.getElementById("journalEntriesList");
    const countBadge = document.getElementById("journalFilteredCount");
    if (!container) return;

    const entries = this.getFilteredEntries();
    const allJournals = StorageService.getJournal();
    const sdCount = allJournals.filter(j => j.level === 'SD').length;
    const smpCount = allJournals.filter(j => j.level === 'SMP').length;

    // Update level badge counters
    const btnSd = document.querySelector(".journal-level-btn[data-level='SD']");
    const btnSmp = document.querySelector(".journal-level-btn[data-level='SMP']");
    const btnAll = document.querySelector(".journal-level-btn[data-level='all']");
    if (btnSd) btnSd.innerHTML = `🏫 SD (${sdCount} Jurnal)`;
    if (btnSmp) btnSmp.innerHTML = `🏛️ SMP (${smpCount} Jurnal)`;
    if (btnAll) btnAll.innerHTML = `⭐ Semua (${allJournals.length} Jurnal)`;

    const classes = StorageService.getClasses();
    const classMap = Object.fromEntries(classes.map(c => [c.id, c]));

    if (countBadge) {
      countBadge.textContent = `${entries.length} Catatan Jurnal`;
    }

    if (entries.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📖</div>
          <h3>Belum Ada Catatan Jurnal Mengajar</h3>
          <p>Mulai catat agenda pembelajaran harian Anda dengan menekan tombol <strong>"+ Tambah Jurnal Baru"</strong> di atas.</p>
          <button class="btn btn-primary mt-3" onclick="JournalModule.openAddModal()">
            <span>➕</span> Buat Jurnal Pertama
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = entries.map(item => {
      const cls = classMap[item.classId] || { name: item.classId, level: item.level || "SD" };
      const levelBadgeClass = cls.level === "SD" ? "badge-sd" : "badge-smp";
      const aspectBadgeClass = this.getAspectBadgeClass(item.aspect);
      const statusBadgeClass = item.status === "Selesai" ? "badge-success" : (item.status === "Tertunda" ? "badge-warning" : "badge-info");

      const formattedDate = this.formatDateID(item.date);

      return `
        <div class="journal-card card-elevated" id="journal-card-${item.id}">
          <div class="journal-card-header">
            <div class="journal-header-left">
              <span class="badge ${levelBadgeClass}">${cls.level}</span>
              <span class="badge badge-outline">${cls.name}</span>
              <span class="journal-meeting-tag">Pertemuan Ke-${item.meetingNo || 1}</span>
              <span class="badge ${aspectBadgeClass}">${item.aspect || 'PAI'}</span>
            </div>
            <div class="journal-header-right">
              <span class="badge ${statusBadgeClass}">${item.status || 'Selesai'}</span>
              <span class="journal-date">📅 ${formattedDate}</span>
              <div class="journal-actions">
                <button class="btn-icon" title="Lihat Detail & Cetak" onclick="JournalModule.viewDetails('${item.id}')">
                  👁️
                </button>
                <button class="btn-icon" title="Edit Jurnal" onclick="JournalModule.openEditModal('${item.id}')">
                  ✏️
                </button>
                <button class="btn-icon text-danger" title="Hapus Jurnal" onclick="JournalModule.deleteEntry('${item.id}')">
                  🗑️
                </button>
              </div>
            </div>
          </div>

          <div class="journal-card-body">
            <h4 class="journal-chapter-title">${this.escapeHtml(item.chapter || '')}</h4>
            <h3 class="journal-topic-title">${this.escapeHtml(item.topic || '')}</h3>

            <div class="journal-details-grid">
              <div class="detail-item">
                <div class="detail-label">⏰ Jam / Waktu</div>
                <div class="detail-val">${this.escapeHtml(item.time || '-')}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">👥 Kehadiran Siswa</div>
                <div class="detail-val text-attendance">${this.escapeHtml(item.attendance || 'Semua Hadir')}</div>
              </div>
            </div>

            <div class="journal-section-box">
              <div class="section-title-sm">🎯 Capaian / Tujuan Pembelajaran (TP):</div>
              <p class="section-text">${this.escapeHtml(item.tp || '-')}</p>
            </div>

            <div class="journal-section-box">
              <div class="section-title-sm">💡 Kegiatan Pembelajaran & Metode:</div>
              <p class="section-text text-prewrap">${this.escapeHtml(item.activity || '-')}</p>
            </div>

            ${item.notes ? `
              <div class="journal-section-box notes-box">
                <div class="section-title-sm">📝 Catatan Khusus & Refleksi Kelas:</div>
                <p class="section-text">${this.escapeHtml(item.notes)}</p>
              </div>
            ` : ''}
          </div>

          <div class="journal-card-footer">
            <span class="text-muted">📚 Semester: ${item.semester || '1 (Ganjil)'}</span>
            <button class="btn btn-sm btn-outline-primary" onclick="JournalModule.viewDetails('${item.id}')">
              🖨️ Pratinjau Cetak Lembar Ini
            </button>
          </div>
        </div>
      `;
    }).join("");
  },

  getAspectBadgeClass(aspect) {
    if (!aspect) return "badge-default";
    if (aspect.includes("Al-Qur'an")) return "badge-aspect-quran";
    if (aspect.includes("Akidah")) return "badge-aspect-akidah";
    if (aspect.includes("Akhlak")) return "badge-aspect-akhlak";
    if (aspect.includes("Fikih")) return "badge-aspect-fikih";
    if (aspect.includes("Sejarah") || aspect.includes("Tarikh")) return "badge-aspect-tarikh";
    return "badge-primary";
  },

  openAddModal() {
    this.editingJournalId = null;
    document.getElementById("journalModalTitle").innerHTML = `<span>➕</span> Tambah Jurnal Mengajar Baru`;
    document.getElementById("journalForm").reset();

    const levelToUse = this.currentFilterLevel === "SMP" ? "SMP" : "SD";
    const radioEl = document.querySelector(`input[name="journalModalLevel"][value="${levelToUse}"]`);
    if (radioEl) radioEl.checked = true;
    this.filterFormClassSelect(levelToUse);

    // Default today date
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("journalDate").value = today;
    document.getElementById("journalTime").value = "07:30 - 08:50 (Jam ke 1-2)";
    document.getElementById("journalAttendance").value = "Hadir: Lengkap, Izin: 0, Sakit: 0, Alfa: 0";
    document.getElementById("journalStatus").value = "Selesai";
    document.getElementById("journalSemester").value = StorageService.getSettings().semester || "1 (Ganjil)";

    if (this.currentFilterClass !== "all") {
      document.getElementById("journalClassSelect").value = this.currentFilterClass;
      this.populateSyllabusPreset(this.currentFilterClass);
    }

    App.openModal("journalModal");
  },

  openEditModal(id) {
    const list = StorageService.getJournal();
    const entry = list.find(j => j.id === id);
    if (!entry) return;

    this.editingJournalId = id;
    document.getElementById("journalModalTitle").innerHTML = `<span>✏️</span> Edit Catatan Jurnal Mengajar`;

    const radioEl = document.querySelector(`input[name="journalModalLevel"][value="${entry.level || 'SD'}"]`);
    if (radioEl) radioEl.checked = true;
    this.filterFormClassSelect(entry.level || "SD");

    document.getElementById("journalClassSelect").value = entry.classId || "";
    document.getElementById("journalFormLevel").value = entry.level || "SD";
    document.getElementById("journalDate").value = entry.date || "";
    document.getElementById("journalTime").value = entry.time || "";
    document.getElementById("journalMeetingNo").value = entry.meetingNo || 1;
    document.getElementById("journalSemester").value = entry.semester || "1 (Ganjil)";
    document.getElementById("journalAspect").value = entry.aspect || "Al-Qur'an Hadis";
    document.getElementById("journalChapter").value = entry.chapter || "";
    document.getElementById("journalTopic").value = entry.topic || "";
    document.getElementById("journalTp").value = entry.tp || "";
    document.getElementById("journalActivity").value = entry.activity || "";
    document.getElementById("journalAttendance").value = entry.attendance || "";
    document.getElementById("journalStatus").value = entry.status || "Selesai";
    document.getElementById("journalNotes").value = entry.notes || "";

    this.populateSyllabusPreset(entry.classId);

    App.openModal("journalModal");
  },

  saveEntry() {
    const classSelect = document.getElementById("journalClassSelect");
    const classId = classSelect.value;
    if (!classId) {
      App.showToast("Silakan pilih kelas terlebih dahulu!", "warning");
      return;
    }

    const selectedOption = classSelect.options[classSelect.selectedIndex];
    const level = selectedOption ? selectedOption.dataset.level : (document.getElementById("journalFormLevel").value || "SD");

    const entryData = {
      id: this.editingJournalId || ("jrn-" + Date.now().toString(36) + Math.random().toString(36).substr(2, 4)),
      classId: classId,
      level: level,
      date: document.getElementById("journalDate").value,
      time: document.getElementById("journalTime").value.trim(),
      meetingNo: parseInt(document.getElementById("journalMeetingNo").value) || 1,
      semester: document.getElementById("journalSemester").value,
      aspect: document.getElementById("journalAspect").value,
      chapter: document.getElementById("journalChapter").value.trim(),
      topic: document.getElementById("journalTopic").value.trim(),
      tp: document.getElementById("journalTp").value.trim(),
      activity: document.getElementById("journalActivity").value.trim(),
      attendance: document.getElementById("journalAttendance").value.trim(),
      status: document.getElementById("journalStatus").value,
      notes: document.getElementById("journalNotes").value.trim()
    };

    let list = StorageService.getJournal();
    if (this.editingJournalId) {
      const idx = list.findIndex(j => j.id === this.editingJournalId);
      if (idx !== -1) {
        list[idx] = entryData;
      }
      App.showToast("Catatan jurnal berhasil diperbarui!", "success");
    } else {
      list.unshift(entryData);
      App.showToast("Jurnal mengajar baru berhasil disimpan!", "success");
    }

    StorageService.saveJournal(list);
    if (window.SupabaseService) SupabaseService.saveJournalRemote(entryData);
    App.closeModal("journalModal");
    this.renderClassFilterPills();
    this.render();
    App.updateDashboardStats();
  },

  deleteEntry(id) {
    if (!confirm("Apakah Anda yakin ingin menghapus catatan jurnal ini?")) return;

    let list = StorageService.getJournal();
    list = list.filter(j => j.id !== id);
    StorageService.saveJournal(list);
    if (window.SupabaseService) SupabaseService.deleteJournalRemote(id);
    App.showToast("Catatan jurnal berhasil dihapus.", "info");
    this.renderClassFilterPills();
    this.render();
    App.updateDashboardStats();
  },

  viewDetails(id) {
    const list = StorageService.getJournal();
    const entry = list.find(j => j.id === id);
    if (!entry) return;

    const classes = StorageService.getClasses();
    const cls = classes.find(c => c.id === entry.classId) || { name: entry.classId, level: entry.level };
    const settings = StorageService.getSettings();

    const detailHtml = `
      <div class="print-official-preview">
        <div class="kop-surat text-center mb-4">
          <h4 class="school-title mb-0">${settings.schoolName || 'SEKOLAH THHK'}</h4>
          <h2 class="document-title">JURNAL AGENDA MENGAJAR GURU</h2>
          <h5 class="subject-title">MATA PELAJARAN: PENDIDIKAN AGAMA ISLAM & BUDI PEKERTI</h5>
          <div class="header-divider"></div>
        </div>

        <div class="row info-meta-grid mb-3">
          <table class="table-info-meta">
            <tr>
              <td width="20%"><strong>Jenjang / Kelas</strong></td>
              <td width="30%">: ${cls.level} / ${cls.name}</td>
              <td width="20%"><strong>Tahun Ajaran</strong></td>
              <td width="30%">: ${settings.academicYear}</td>
            </tr>
            <tr>
              <td><strong>Pertemuan Ke</strong></td>
              <td>: Pertemuan ${entry.meetingNo || 1}</td>
              <td><strong>Semester</strong></td>
              <td>: ${entry.semester || settings.semester}</td>
            </tr>
            <tr>
              <td><strong>Hari / Tanggal</strong></td>
              <td>: ${this.formatDateID(entry.date)}</td>
              <td><strong>Alokasi Waktu</strong></td>
              <td>: ${entry.time || '-'}</td>
            </tr>
            <tr>
              <td><strong>Aspek PAI</strong></td>
              <td>: <span class="badge ${this.getAspectBadgeClass(entry.aspect)}">${entry.aspect}</span></td>
              <td><strong>Status KBM</strong></td>
              <td>: <strong>${entry.status || 'Selesai'}</strong></td>
            </tr>
          </table>
        </div>

        <div class="detail-block mb-3">
          <div class="detail-block-title">A. BAB & MATERI POKOK</div>
          <div class="detail-block-body">
            <strong>${this.escapeHtml(entry.chapter)}</strong>
            <p class="mt-1 mb-0">${this.escapeHtml(entry.topic)}</p>
          </div>
        </div>

        <div class="detail-block mb-3">
          <div class="detail-block-title">B. CAPAIAN / TUJUAN PEMBELAJARAN (TP)</div>
          <div class="detail-block-body">
            ${this.escapeHtml(entry.tp || '-')}
          </div>
        </div>

        <div class="detail-block mb-3">
          <div class="detail-block-title">C. KEGIATAN PEMBELAJARAN & METODE</div>
          <div class="detail-block-body text-prewrap">
            ${this.escapeHtml(entry.activity || '-')}
          </div>
        </div>

        <div class="detail-block mb-3">
          <div class="detail-block-title">D. KEHADIRAN SISWA</div>
          <div class="detail-block-body">
            ${this.escapeHtml(entry.attendance || 'Lengkap')}
          </div>
        </div>

        <div class="detail-block mb-4">
          <div class="detail-block-title">E. CATATAN & REFLEKSI GURU</div>
          <div class="detail-block-body text-prewrap">
            ${this.escapeHtml(entry.notes || 'Pembelajaran berjalan lancar dan tertib.')}
          </div>
        </div>

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

    document.getElementById("detailModalContent").innerHTML = detailHtml;
    App.openModal("detailModal");
  },

  formatDateID(dateStr) {
    if (!dateStr) return "-";
    try {
      const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch (e) {
      return dateStr;
    }
  },

  escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};
