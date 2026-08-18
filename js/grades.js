/**
 * Grades & Assignments Module
 * Handles assignments management, fast interactive gradebook, auto-statistics & KKTP indicators.
 */

const GradesModule = {
  currentFilterLevel: "all",
  currentSelectedClass: "",
  editingAssignmentId: null,
  activeAssignmentForGrading: null,

  init() {
    this.populateClassDropdowns();
    this.bindEvents();
    this.selectDefaultClass();
    this.renderClassFilterPills();
    this.render();
  },

  populateClassDropdowns() {
    const classes = StorageService.getClasses();
    const classSelector = document.getElementById("gradebookClassSelect");
    const formClassSelect = document.getElementById("assignmentClassSelect");
    const printClassSelect = document.getElementById("printGradeClass");

    if (classSelector) {
      classSelector.innerHTML = classes.map(c => 
        `<option value="${c.id}" data-level="${c.level}">[${c.level}] ${c.name}</option>`
      ).join("");
    }

    if (formClassSelect) {
      formClassSelect.innerHTML = `<option value="">-- Pilih Kelas --</option>` +
        classes.map(c => `<option value="${c.id}" data-level="${c.level}">[${c.level}] ${c.name}</option>`).join("");
    }

    if (printClassSelect) {
      printClassSelect.innerHTML = classes.map(c => 
        `<option value="${c.id}">[${c.level}] ${c.name}</option>`
      ).join("");
    }
  },

  selectDefaultClass() {
    const classSelector = document.getElementById("gradebookClassSelect");
    if (classSelector && classSelector.options.length > 0) {
      this.currentSelectedClass = classSelector.options[0].value;
      classSelector.value = this.currentSelectedClass;
    }
  },

  renderClassFilterPills() {
    const container = document.getElementById("gradeClassPillsContainer");
    if (!container) return;

    const classes = StorageService.getClasses();
    let filteredClasses = classes;
    if (this.currentFilterLevel !== "all") {
      filteredClasses = classes.filter(c => c.level === this.currentFilterLevel);
    }

    const students = StorageService.getStudents();
    const classCountMap = {};
    students.forEach(s => {
      classCountMap[s.classId] = (classCountMap[s.classId] || 0) + 1;
    });

    let html = "";
    filteredClasses.forEach(c => {
      const count = classCountMap[c.id] || 0;
      const isActive = this.currentSelectedClass === c.id;
      html += `
        <button class="pill-class-btn ${isActive ? 'active' : ''}" onclick="GradesModule.selectClassDirectly('${c.id}')">
          <span class="badge ${c.level === 'SD' ? 'badge-sd' : 'badge-smp'}">${c.level}</span> ${c.name} (${count} Siswa)
        </button>
      `;
    });

    container.innerHTML = html;
  },

  selectClassDirectly(classId) {
    this.currentSelectedClass = classId;
    const classSelector = document.getElementById("gradebookClassSelect");
    if (classSelector) classSelector.value = classId;
    this.renderClassFilterPills();
    this.render();
  },

  filterByLevel(level) {
    this.currentFilterLevel = level;
    document.querySelectorAll(".grade-level-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.level === level);
    });

    this.filterClassDropdownByLevel();
    this.renderClassFilterPills();
    this.render();
  },

  bindEvents() {
    // Level filter tabs
    document.querySelectorAll(".grade-level-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        this.filterByLevel(btn.dataset.level);
      });
    });

    // Class selection changed from dropdown
    const classSelector = document.getElementById("gradebookClassSelect");
    if (classSelector) {
      classSelector.addEventListener("change", (e) => {
        this.currentSelectedClass = e.target.value;
        this.renderClassFilterPills();
        this.render();
      });
    }

    // Assignment Form Level Toggle (SD / SMP)
    document.querySelectorAll(".asg-form-level-toggle").forEach(radio => {
      radio.addEventListener("change", (e) => {
        const level = e.target.value;
        this.filterFormClassSelect(level);
      });
    });

    // Assignment Form Submit
    const form = document.getElementById("assignmentForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveAssignment();
      });
    }

    // Export CSV Gradebook
    const exportBtn = document.getElementById("exportGradebookCsvBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        if (!this.currentSelectedClass) {
          App.showToast("Silakan pilih kelas terlebih dahulu.", "warning");
          return;
        }
        StorageService.exportGradesCSV(this.currentSelectedClass);
        App.showToast("Rekap nilai berhasil diekspor ke format CSV!", "success");
      });
    }
  },

  filterFormClassSelect(level) {
    const classes = StorageService.getClasses();
    const select = document.getElementById("assignmentClassSelect");
    if (!select) return;

    let filtered = classes;
    if (level && level !== "all") {
      filtered = classes.filter(c => c.level === level);
    }

    select.innerHTML = `<option value="">-- Pilih Kelas (${level.toUpperCase()}) --</option>` +
      filtered.map(c => `<option value="${c.id}" data-level="${c.level}">[${c.level}] ${c.name}</option>`).join("");
    
    if (filtered.length > 0) {
      select.value = filtered[0].id;
    }
  },

  setAssignmentModalLevel(level) {
    const radioEl = document.querySelector(`input[name="asgModalLevel"][value="${level}"]`);
    if (radioEl) radioEl.checked = true;
    this.filterFormClassSelect(level);
  },

  filterClassDropdownByLevel() {
    const classes = StorageService.getClasses();
    const classSelector = document.getElementById("gradebookClassSelect");
    if (!classSelector) return;

    let filtered = classes;
    if (this.currentFilterLevel !== "all") {
      filtered = classes.filter(c => c.level === this.currentFilterLevel);
    }

    classSelector.innerHTML = filtered.map(c => 
      `<option value="${c.id}" data-level="${c.level}">[${c.level}] ${c.name}</option>`
    ).join("");

    if (filtered.length > 0) {
      this.currentSelectedClass = filtered[0].id;
      classSelector.value = this.currentSelectedClass;
    } else {
      this.currentSelectedClass = "";
    }
  },

  render() {
    this.renderAssignmentCards();
    this.renderGradebookTable();
  },

  // Render list of assignments for selected class
  renderAssignmentCards() {
    const container = document.getElementById("assignmentsListContainer");
    if (!container) return;

    const allAssignments = StorageService.getAssignments();
    const assignments = allAssignments.filter(a => !this.currentSelectedClass || a.classId === this.currentSelectedClass);
    const classes = StorageService.getClasses();
    const classMap = Object.fromEntries(classes.map(c => [c.id, c]));

    const countBadge = document.getElementById("assignmentCountBadge");
    if (countBadge) {
      countBadge.textContent = `${assignments.length} Tugas`;
    }

    if (assignments.length === 0) {
      container.innerHTML = `
        <div class="empty-state py-4">
          <div class="empty-icon">📝</div>
          <h4>Belum Ada Tugas di Kelas Ini</h4>
          <p class="text-muted">Klik tombol "+ Buat Tugas Baru" untuk menambahkan tugas tulis, hafalan, atau kuis.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = assignments.map(a => {
      const cls = classMap[a.classId] || { name: a.classId, level: a.level || 'SD' };
      const categoryBadge = this.getCategoryBadge(a.category);
      const studentCount = StorageService.getStudents().filter(s => s.classId === a.classId).length;
      const gradedCount = a.scores ? Object.values(a.scores).filter(v => v !== "" && v !== null && !isNaN(v)).length : 0;
      const progressPercent = studentCount > 0 ? Math.round((gradedCount / studentCount) * 100) : 0;

      return `
        <div class="assignment-card card-elevated">
          <div class="asg-card-top">
            <div class="asg-meta-tags">
              <span class="badge ${cls.level === 'SD' ? 'badge-sd' : 'badge-smp'}">${cls.level}</span>
              <span class="badge badge-outline">${cls.name}</span>
              <span class="badge ${categoryBadge.className}">${categoryBadge.icon} ${a.category}</span>
            </div>
            <div class="asg-card-actions">
              <button class="btn-icon" title="Input Nilai Siswa" onclick="GradesModule.openGradingModal('${a.id}')">
                <i class="icon-check-square"></i> ✍️
              </button>
              <button class="btn-icon" title="Edit Tugas" onclick="GradesModule.openEditAssignmentModal('${a.id}')">
                <i class="icon-edit"></i> ✏️
              </button>
              <button class="btn-icon text-danger" title="Hapus Tugas" onclick="GradesModule.deleteAssignment('${a.id}')">
                <i class="icon-trash"></i> 🗑️
              </button>
            </div>
          </div>

          <h4 class="asg-title">${this.escapeHtml(a.title)}</h4>
          <p class="asg-desc">${this.escapeHtml(a.description || 'Tidak ada deskripsi.')}</p>

          <div class="asg-dates-grid">
            <div><span class="text-muted">Tanggal:</span> <strong>${a.date || '-'}</strong></div>
            <div><span class="text-muted">Batas/Due:</span> <strong>${a.dueDate || '-'}</strong></div>
            <div><span class="text-muted">KKTP/KKM:</span> <span class="badge badge-kktp">${a.kktp || 75}</span></div>
          </div>

          <div class="asg-progress-bar-wrapper mt-3">
            <div class="d-flex justify-between text-xs mb-1">
              <span>Progres Penilaian: <strong>${gradedCount}/${studentCount} Siswa</strong></span>
              <span class="font-bold ${progressPercent === 100 ? 'text-success' : 'text-primary'}">${progressPercent}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
          </div>

          <div class="asg-footer mt-3">
            <button class="btn btn-sm btn-primary w-100" onclick="GradesModule.openGradingModal('${a.id}')">
              <i class="icon-edit-3"></i> Input / Nilai Sekarang (${gradedCount}/${studentCount})
            </button>
          </div>
        </div>
      `;
    }).join("");
  },

  // Render Full Interactive Matrix Table for Selected Class
  renderGradebookTable() {
    const tableContainer = document.getElementById("gradebookTableContainer");
    const statsContainer = document.getElementById("gradebookStatsContainer");
    if (!tableContainer) return;

    if (!this.currentSelectedClass) {
      tableContainer.innerHTML = `<div class="empty-state">Pilih kelas terlebih dahulu.</div>`;
      if (statsContainer) statsContainer.innerHTML = "";
      return;
    }

    const students = StorageService.getStudents().filter(s => s.classId === this.currentSelectedClass);
    const assignments = StorageService.getAssignments().filter(a => a.classId === this.currentSelectedClass);
    const defaultKktp = StorageService.getSettings().defaultKktp || 75;

    if (students.length === 0) {
      tableContainer.innerHTML = `
        <div class="empty-state py-4">
          <div class="empty-icon">👥</div>
          <h4>Belum Ada Siswa di Kelas Ini</h4>
          <p class="text-muted">Tambahkan siswa di menu <strong>"Data Siswa"</strong> agar dapat menginput nilai.</p>
          <button class="btn btn-primary btn-sm mt-2" onclick="App.navigateTo('students')">Kelola Data Siswa</button>
        </div>
      `;
      if (statsContainer) statsContainer.innerHTML = "";
      return;
    }

    // Compute stats
    let totalAllScores = 0;
    let totalScoreCounts = 0;
    let highestOverall = 0;
    let lowestOverall = 100;
    let passedCount = 0;

    const studentAverages = students.map(s => {
      let sum = 0;
      let cnt = 0;
      assignments.forEach(a => {
        const val = a.scores ? a.scores[s.id] : undefined;
        if (val !== undefined && val !== "" && !isNaN(val)) {
          const num = Number(val);
          sum += num;
          cnt++;
          totalAllScores += num;
          totalScoreCounts++;
          if (num > highestOverall) highestOverall = num;
          if (num < lowestOverall) lowestOverall = num;
        }
      });

      const avg = cnt > 0 ? (sum / cnt) : null;
      if (avg !== null && avg >= defaultKktp) {
        passedCount++;
      }
      return { studentId: s.id, avg: avg };
    });

    const classAverage = totalScoreCounts > 0 ? (totalAllScores / totalScoreCounts).toFixed(1) : "-";
    const passPercentage = students.length > 0 ? Math.round((passedCount / students.length) * 100) : 0;

    // Render Stats Strip
    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="stats-mini-card">
          <div class="stat-icon-sm icon-bg-emerald">📊</div>
          <div>
            <div class="stat-label-sm">Rata-Rata Kelas</div>
            <div class="stat-value-sm text-emerald">${classAverage}</div>
          </div>
        </div>
        <div class="stats-mini-card">
          <div class="stat-icon-sm icon-bg-blue">🎯</div>
          <div>
            <div class="stat-label-sm">Ketuntasan (KKTP ${defaultKktp})</div>
            <div class="stat-value-sm text-blue">${passedCount}/${students.length} (${passPercentage}%)</div>
          </div>
        </div>
        <div class="stats-mini-card">
          <div class="stat-icon-sm icon-bg-amber">⭐</div>
          <div>
            <div class="stat-label-sm">Nilai Tertinggi</div>
            <div class="stat-value-sm text-amber">${totalScoreCounts > 0 ? highestOverall : '-'}</div>
          </div>
        </div>
        <div class="stats-mini-card">
          <div class="stat-icon-sm icon-bg-rose">📉</div>
          <div>
            <div class="stat-label-sm">Nilai Terendah</div>
            <div class="stat-value-sm text-rose">${totalScoreCounts > 0 ? lowestOverall : '-'}</div>
          </div>
        </div>
      `;
    }

    // Build Interactive Table
    let tableHtml = `
      <div class="table-responsive">
        <table class="table table-gradebook">
          <thead>
            <tr>
              <th width="40" class="text-center">No</th>
              <th width="80">NISN</th>
              <th width="180">Nama Siswa</th>
              <th width="40" class="text-center">L/P</th>
    `;

    // Assignment Columns
    assignments.forEach(a => {
      tableHtml += `
        <th class="text-center th-assignment" title="${this.escapeHtml(a.title)} (${a.category})">
          <div class="th-asg-title">${this.escapeHtml(a.title)}</div>
          <div class="th-asg-sub"><span class="badge-mini">${a.category}</span></div>
        </th>
      `;
    });

    tableHtml += `
              <th width="90" class="text-center th-highlight">Rata-Rata</th>
              <th width="110" class="text-center th-highlight">Status KKTP</th>
            </tr>
          </thead>
          <tbody>
    `;

    students.forEach((s, idx) => {
      let sum = 0;
      let count = 0;

      tableHtml += `
        <tr>
          <td class="text-center text-muted">${idx + 1}</td>
          <td class="font-mono text-xs">${s.nisn}</td>
          <td><strong>${this.escapeHtml(s.name)}</strong></td>
          <td class="text-center"><span class="badge-gender ${s.gender === 'L' ? 'badge-l' : 'badge-p'}">${s.gender}</span></td>
      `;

      assignments.forEach(a => {
        const score = (a.scores && a.scores[s.id] !== undefined) ? a.scores[s.id] : "";
        if (score !== "" && !isNaN(score)) {
          sum += Number(score);
          count++;
        }

        const scoreClass = score !== "" ? (Number(score) >= (a.kktp || 75) ? "score-pass" : "score-fail") : "";

        tableHtml += `
          <td class="text-center td-score">
            <input 
              type="number" 
              class="grade-input-cell ${scoreClass}" 
              min="0" 
              max="100" 
              placeholder="-"
              value="${score}" 
              data-assignment-id="${a.id}" 
              data-student-id="${s.id}"
              onchange="GradesModule.updateScoreLive('${a.id}', '${s.id}', this.value)"
              onfocus="this.select()"
            />
          </td>
        `;
      });

      const avg = count > 0 ? (sum / count).toFixed(1) : null;
      const isPassed = avg !== null && Number(avg) >= defaultKktp;
      const statusBadge = avg !== null 
        ? (isPassed ? `<span class="badge badge-success">Tuntas</span>` : `<span class="badge badge-danger">Belum Tuntas</span>`) 
        : `<span class="badge badge-outline">-</span>`;

      tableHtml += `
          <td class="text-center font-bold td-avg ${avg !== null ? (isPassed ? 'text-success' : 'text-danger') : 'text-muted'}">
            ${avg !== null ? avg : '-'}
          </td>
          <td class="text-center">${statusBadge}</td>
        </tr>
      `;
    });

    tableHtml += `
          </tbody>
        </table>
      </div>
      <div class="gradebook-tip mt-2">
        ℹ️ <strong>Tips:</strong> Anda bisa langsung mengetik nilai di dalam kotak tabel di atas, nilai otomatis tersimpan seketika.
      </div>
    `;

    tableContainer.innerHTML = tableHtml;
  },

  updateScoreLive(assignmentId, studentId, value) {
    let assignments = StorageService.getAssignments();
    const asg = assignments.find(a => a.id === assignmentId);
    if (!asg) return;

    if (!asg.scores) asg.scores = {};
    
    if (value === "" || value === null) {
      delete asg.scores[studentId];
    } else {
      let num = Number(value);
      if (num < 0) num = 0;
      if (num > (asg.maxScore || 100)) num = asg.maxScore || 100;
      asg.scores[studentId] = num;
    }

    StorageService.saveAssignments(assignments);
    if (window.SupabaseService) SupabaseService.saveAssignmentRemote(asg);
    this.render();
    App.updateDashboardStats();
    App.showToast("Nilai berhasil disimpan otomatis.", "info", 1500);
  },

  openAddAssignmentModal() {
    this.editingAssignmentId = null;
    document.getElementById("assignmentModalTitle").innerHTML = `<span>➕</span> Buat Tugas / Penilaian Baru`;
    document.getElementById("assignmentForm").reset();

    const levelToUse = this.currentFilterLevel === "SMP" ? "SMP" : "SD";
    const radioEl = document.querySelector(`input[name="asgModalLevel"][value="${levelToUse}"]`);
    if (radioEl) radioEl.checked = true;
    this.filterFormClassSelect(levelToUse);

    if (this.currentSelectedClass) {
      document.getElementById("assignmentClassSelect").value = this.currentSelectedClass;
    }

    const today = new Date().toISOString().split("T")[0];
    document.getElementById("assignmentDate").value = today;

    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    document.getElementById("assignmentDueDate").value = nextWeek;
    document.getElementById("assignmentMaxScore").value = 100;
    document.getElementById("assignmentKktp").value = StorageService.getSettings().defaultKktp || 75;

    App.openModal("assignmentModal");
  },

  openEditAssignmentModal(id) {
    const list = StorageService.getAssignments();
    const asg = list.find(a => a.id === id);
    if (!asg) return;

    this.editingAssignmentId = id;
    document.getElementById("assignmentModalTitle").innerHTML = `<span>✏️</span> Edit Data Tugas`;

    const radioEl = document.querySelector(`input[name="asgModalLevel"][value="${asg.level || 'SD'}"]`);
    if (radioEl) radioEl.checked = true;
    this.filterFormClassSelect(asg.level || "SD");

    document.getElementById("assignmentClassSelect").value = asg.classId || "";
    document.getElementById("assignmentTitle").value = asg.title || "";
    document.getElementById("assignmentCategory").value = asg.category || "Tugas Tulis";
    document.getElementById("assignmentDate").value = asg.date || "";
    document.getElementById("assignmentDueDate").value = asg.dueDate || "";
    document.getElementById("assignmentMaxScore").value = asg.maxScore || 100;
    document.getElementById("assignmentKktp").value = asg.kktp || 75;
    document.getElementById("assignmentDescription").value = asg.description || "";

    App.openModal("assignmentModal");
  },

  saveAssignment() {
    const classId = document.getElementById("assignmentClassSelect").value;
    const title = document.getElementById("assignmentTitle").value.trim();

    if (!classId || !title) {
      App.showToast("Harap pilih kelas dan isi judul tugas!", "warning");
      return;
    }

    const classes = StorageService.getClasses();
    const cls = classes.find(c => c.id === classId);

    let list = StorageService.getAssignments();
    let asgData = {
      id: this.editingAssignmentId || ("asg-" + Date.now().toString(36) + Math.random().toString(36).substr(2, 4)),
      classId: classId,
      level: cls ? cls.level : "SD",
      title: title,
      category: document.getElementById("assignmentCategory").value,
      date: document.getElementById("assignmentDate").value,
      dueDate: document.getElementById("assignmentDueDate").value,
      maxScore: Number(document.getElementById("assignmentMaxScore").value) || 100,
      kktp: Number(document.getElementById("assignmentKktp").value) || 75,
      description: document.getElementById("assignmentDescription").value.trim()
    };

    if (this.editingAssignmentId) {
      const idx = list.findIndex(a => a.id === this.editingAssignmentId);
      if (idx !== -1) {
        asgData.scores = list[idx].scores || {};
        list[idx] = asgData;
      }
      App.showToast("Data tugas berhasil diperbarui!", "success");
    } else {
      asgData.scores = {};
      list.unshift(asgData);
      App.showToast("Tugas baru berhasil ditambahkan!", "success");
    }

    StorageService.saveAssignments(list);
    if (window.SupabaseService) SupabaseService.saveAssignmentRemote(asgData);

    // UX Fix: Auto-switch view to the target level and class so the new assignment is visible
    this.currentFilterLevel = asgData.level;
    document.querySelectorAll(".grade-level-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.level === asgData.level);
    });
    this.filterClassDropdownByLevel();
    
    this.currentSelectedClass = classId;
    const classSelector = document.getElementById("gradebookClassSelect");
    if (classSelector) classSelector.value = classId;

    App.closeModal("assignmentModal");
    this.renderClassFilterPills();
    this.render();
    App.updateDashboardStats();
  },

  deleteAssignment(id) {
    if (!confirm("Apakah Anda yakin ingin menghapus tugas ini beserta seluruh nilai yang sudah diinput?")) return;

    let list = StorageService.getAssignments();
    list = list.filter(a => a.id !== id);
    StorageService.saveAssignments(list);
    if (window.SupabaseService) SupabaseService.deleteAssignmentRemote(id);
    App.showToast("Tugas dan nilai berhasil dihapus.", "info");
    this.render();
    App.updateDashboardStats();
  },

  openGradingModal(id) {
    const list = StorageService.getAssignments();
    const asg = list.find(a => a.id === id);
    if (!asg) return;

    this.activeAssignmentForGrading = asg;
    const students = StorageService.getStudents().filter(s => s.classId === asg.classId);
    const classes = StorageService.getClasses();
    const cls = classes.find(c => c.id === asg.classId);

    document.getElementById("gradingModalTitle").innerHTML = `
      <span>🏆</span> Penilaian: ${this.escapeHtml(asg.title)}
    `;

    document.getElementById("gradingModalSub").innerHTML = `
      <span class="badge ${cls && cls.level === 'SD' ? 'badge-sd' : 'badge-smp'}">${cls ? cls.level : 'SD'}</span>
      <span class="badge badge-outline">${cls ? cls.name : asg.classId}</span>
      <span class="badge badge-category">${asg.category}</span>
      <span class="text-muted">Batas Nilai: 0 - ${asg.maxScore} (KKTP: ${asg.kktp})</span>
    `;

    let formListHtml = `
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th width="40">No</th>
            <th width="90">NISN</th>
            <th>Nama Siswa</th>
            <th width="120" class="text-center">Nilai (0-${asg.maxScore})</th>
            <th width="120" class="text-center">Status</th>
          </tr>
        </thead>
        <tbody>
    `;

    if (students.length === 0) {
      formListHtml += `<tr><td colspan="5" class="text-center text-muted py-3">Tidak ada siswa di kelas ini.</td></tr>`;
    } else {
      students.forEach((s, idx) => {
        const scoreVal = (asg.scores && asg.scores[s.id] !== undefined) ? asg.scores[s.id] : "";
        const isPass = scoreVal !== "" && Number(scoreVal) >= asg.kktp;
        const statusLabel = scoreVal !== "" 
          ? (isPass ? `<span class="badge badge-success">Tuntas</span>` : `<span class="badge badge-danger">Belum Tuntas</span>`) 
          : `<span class="badge badge-outline">-</span>`;

        formListHtml += `
          <tr>
            <td class="text-center">${idx + 1}</td>
            <td class="font-mono text-xs">${s.nisn}</td>
            <td><strong>${this.escapeHtml(s.name)}</strong></td>
            <td class="text-center">
              <input 
                type="number" 
                class="form-control text-center form-control-sm grade-single-input" 
                min="0" 
                max="${asg.maxScore}" 
                placeholder="0"
                value="${scoreVal}"
                data-student-id="${s.id}"
                oninput="GradesModule.previewGradingStatus(this, ${asg.kktp})"
              />
            </td>
            <td class="text-center status-col">${statusLabel}</td>
          </tr>
        `;
      });
    }

    formListHtml += `</tbody></table>`;
    document.getElementById("gradingModalBody").innerHTML = formListHtml;
    App.openModal("gradingModal");
  },

  previewGradingStatus(inputEl, kktp) {
    const row = inputEl.closest("tr");
    const statusCol = row.querySelector(".status-col");
    const val = inputEl.value;

    if (val === "" || val === null) {
      statusCol.innerHTML = `<span class="badge badge-outline">-</span>`;
    } else if (Number(val) >= kktp) {
      statusCol.innerHTML = `<span class="badge badge-success">Tuntas</span>`;
    } else {
      statusCol.innerHTML = `<span class="badge badge-danger">Belum Tuntas</span>`;
    }
  },

  saveSingleAssignmentScores() {
    if (!this.activeAssignmentForGrading) return;

    let assignments = StorageService.getAssignments();
    const asg = assignments.find(a => a.id === this.activeAssignmentForGrading.id);
    if (!asg) return;

    if (!asg.scores) asg.scores = {};

    document.querySelectorAll(".grade-single-input").forEach(input => {
      const studentId = input.dataset.studentId;
      const val = input.value.trim();
      if (val === "") {
        delete asg.scores[studentId];
      } else {
        asg.scores[studentId] = Number(val);
      }
    });

    StorageService.saveAssignments(assignments);
    if (window.SupabaseService) SupabaseService.saveAssignmentRemote(asg);
    App.closeModal("gradingModal");
    App.showToast("Seluruh nilai tugas berhasil disimpan!", "success");
    this.render();
    App.updateDashboardStats();
  },

  fillAllScores(score) {
    document.querySelectorAll(".grade-single-input").forEach(input => {
      input.value = score;
      if (this.activeAssignmentForGrading) {
        this.previewGradingStatus(input, this.activeAssignmentForGrading.kktp);
      }
    });
  },

  getCategoryBadge(category) {
    switch (category) {
      case "Hafalan":
        return { className: "badge-hafalan", icon: "📖" };
      case "Praktik Ibadah":
        return { className: "badge-praktik", icon: "🕌" };
      case "Kuis/UH":
        return { className: "badge-kuis", icon: "⚡" };
      case "Asesmen Sumatif":
        return { className: "badge-sumatif", icon: "🎓" };
      case "Proyek PAI":
        return { className: "badge-proyek", icon: "🌟" };
      default:
        return { className: "badge-tugas", icon: "📝" };
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
