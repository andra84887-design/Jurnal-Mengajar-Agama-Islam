/**
 * Students Module
 * Handles class rosters for SD & SMP THHK, student CRUD, batch import, and student report card view.
 */

const StudentsModule = {
  currentFilterLevel: "all",
  currentFilterClass: "all",
  searchQuery: "",
  editingStudentId: null,

  init() {
    this.populateClassDropdowns();
    this.renderClassFilterPills();
    this.bindEvents();
    this.render();
  },

  populateClassDropdowns() {
    const classes = StorageService.getClasses();
    const filterSelect = document.getElementById("studentFilterClass");
    const formClassSelect = document.getElementById("studentClassSelect");
    const batchClassSelect = document.getElementById("batchStudentClassSelect");

    if (filterSelect) {
      filterSelect.innerHTML = `<option value="all">Semua Kelas</option>` +
        classes.map(c => `<option value="${c.id}">[${c.level}] ${c.name}</option>`).join("");
    }

    if (formClassSelect) {
      formClassSelect.innerHTML = `<option value="">-- Pilih Kelas --</option>` +
        classes.map(c => `<option value="${c.id}" data-level="${c.level}">[${c.level}] ${c.name}</option>`).join("");
    }

    if (batchClassSelect) {
      batchClassSelect.innerHTML = `<option value="">-- Pilih Kelas Target --</option>` +
        classes.map(c => `<option value="${c.id}" data-level="${c.level}">[${c.level}] ${c.name}</option>`).join("");
    }
  },

  renderClassFilterPills() {
    const container = document.getElementById("studentClassPillsContainer");
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

    let html = `
      <button class="pill-class-btn ${this.currentFilterClass === 'all' ? 'active' : ''}" onclick="StudentsModule.filterByClass('all')">
        Semua Kelas (${students.filter(s => this.currentFilterLevel === 'all' || s.level === this.currentFilterLevel).length})
      </button>
    `;

    filteredClasses.forEach(c => {
      const count = classCountMap[c.id] || 0;
      const isActive = this.currentFilterClass === c.id;
      html += `
        <button class="pill-class-btn ${isActive ? 'active' : ''}" onclick="StudentsModule.filterByClass('${c.id}')">
          <span class="badge ${c.level === 'SD' ? 'badge-sd' : 'badge-smp'}">${c.level}</span> ${c.name} (${count})
        </button>
      `;
    });

    container.innerHTML = html;
  },

  filterByClass(classId) {
    this.currentFilterClass = classId;
    const filterSelect = document.getElementById("studentFilterClass");
    if (filterSelect) filterSelect.value = classId;
    this.renderClassFilterPills();
    this.render();
  },

  filterByLevel(level) {
    this.currentFilterLevel = level;
    this.currentFilterClass = "all";

    // Update pill buttons active state
    document.querySelectorAll(".student-level-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.level === level);
    });

    this.updateFilterDropdown();
    this.renderClassFilterPills();
    this.render();
  },

  bindEvents() {
    // Level filter pills
    document.querySelectorAll(".student-level-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        this.filterByLevel(btn.dataset.level);
      });
    });

    // Class filter select
    const classFilter = document.getElementById("studentFilterClass");
    if (classFilter) {
      classFilter.addEventListener("change", (e) => {
        this.currentFilterClass = e.target.value;
        this.renderClassFilterPills();
        this.render();
      });
    }

    // Search query
    const searchInput = document.getElementById("studentSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.render();
      });
    }

    // Form Modal Level Toggle (SD / SMP)
    document.querySelectorAll(".student-form-level-toggle").forEach(radio => {
      radio.addEventListener("change", (e) => {
        const level = e.target.value;
        this.filterFormClassSelect(level, "studentClassSelect");
      });
    });

    // Batch Modal Level Toggle (SD / SMP)
    document.querySelectorAll(".batch-form-level-toggle").forEach(radio => {
      radio.addEventListener("change", (e) => {
        const level = e.target.value;
        this.filterFormClassSelect(level, "batchStudentClassSelect");
      });
    });

    // Single student form
    const form = document.getElementById("studentForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveStudent();
      });
    }

    // Batch student form
    const batchForm = document.getElementById("batchStudentForm");
    if (batchForm) {
      batchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveBatchStudents();
      });
    }
  },

  filterFormClassSelect(level, selectId) {
    const classes = StorageService.getClasses();
    const select = document.getElementById(selectId);
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

  updateFilterDropdown() {
    const classes = StorageService.getClasses();
    const filterSelect = document.getElementById("studentFilterClass");
    if (!filterSelect) return;

    let filtered = classes;
    if (this.currentFilterLevel !== "all") {
      filtered = classes.filter(c => c.level === this.currentFilterLevel);
    }

    filterSelect.innerHTML = `<option value="all">Semua Kelas (${this.currentFilterLevel.toUpperCase()})</option>` +
      filtered.map(c => `<option value="${c.id}">[${c.level}] ${c.name}</option>`).join("");
  },

  getFilteredStudents() {
    let list = StorageService.getStudents();
    const classes = StorageService.getClasses();
    const classLevelMap = Object.fromEntries(classes.map(c => [c.id, c.level]));

    if (this.currentFilterLevel !== "all") {
      list = list.filter(s => {
        const lvl = s.level || classLevelMap[s.classId];
        return lvl === this.currentFilterLevel;
      });
    }

    if (this.currentFilterClass !== "all") {
      list = list.filter(s => s.classId === this.currentFilterClass);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery;
      list = list.filter(s => 
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.nisn && s.nisn.toLowerCase().includes(q)) ||
        (s.notes && s.notes.toLowerCase().includes(q))
      );
    }

    return list;
  },

  render() {
    const container = document.getElementById("studentsListContainer");
    const countBadge = document.getElementById("studentFilteredCount");
    if (!container) return;

    const students = this.getFilteredStudents();
    const allStudents = StorageService.getStudents();
    const sdCount = allStudents.filter(s => s.level === 'SD').length;
    const smpCount = allStudents.filter(s => s.level === 'SMP').length;
    
    // Update badge labels
    const btnSd = document.querySelector(".student-level-btn[data-level='SD']");
    const btnSmp = document.querySelector(".student-level-btn[data-level='SMP']");
    const btnAll = document.querySelector(".student-level-btn[data-level='all']");
    if (btnSd) btnSd.innerHTML = `🏫 SD (${sdCount} Siswa)`;
    if (btnSmp) btnSmp.innerHTML = `🏛️ SMP (${smpCount} Siswa)`;
    if (btnAll) btnAll.innerHTML = `⭐ Semua (${allStudents.length} Siswa)`;

    const classes = StorageService.getClasses();
    const classMap = Object.fromEntries(classes.map(c => [c.id, c]));
    const assignments = StorageService.getAssignments();

    if (countBadge) {
      countBadge.textContent = `${students.length} Siswa Terdaftar`;
    }

    if (students.length === 0) {
      container.innerHTML = `
        <div class="empty-state py-4">
          <div class="empty-icon">👥</div>
          <h3>Belum Ada Data Siswa di Pilihan Ini</h3>
          <p>Tambahkan siswa secara manual atau tempel daftar nama secara massal.</p>
          <div class="mt-3">
            <button class="btn btn-primary btn-sm mr-2" onclick="StudentsModule.openAddModal()">+ Tambah Siswa</button>
            <button class="btn btn-outline-primary btn-sm" onclick="StudentsModule.openBatchModal()">⚡ Impor Massal Siswa</button>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th width="40" class="text-center">No</th>
              <th width="100">NISN</th>
              <th>Nama Lengkap Siswa</th>
              <th width="60" class="text-center">L/P</th>
              <th width="140">Jenjang / Kelas</th>
              <th width="120" class="text-center">Tugas Diikuti</th>
              <th width="100" class="text-center">Rata-Rata</th>
              <th>Catatan Perkembangan</th>
              <th width="110" class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${students.map((s, idx) => {
              const cls = classMap[s.classId] || { name: s.classId, level: s.level || 'SD' };
              
              // Calculate assignments and avg
              const studentAssignments = assignments.filter(a => a.classId === s.classId);
              let totalScore = 0;
              let gradedCount = 0;
              studentAssignments.forEach(a => {
                const sc = a.scores ? a.scores[s.id] : undefined;
                if (sc !== undefined && sc !== "" && !isNaN(sc)) {
                  totalScore += Number(sc);
                  gradedCount++;
                }
              });

              const avg = gradedCount > 0 ? (totalScore / gradedCount).toFixed(1) : "-";
              const isGood = avg !== "-" && Number(avg) >= 75;

              return `
                <tr>
                  <td class="text-center text-muted">${idx + 1}</td>
                  <td class="font-mono text-xs font-semibold">${s.nisn || '-'}</td>
                  <td>
                    <div class="font-bold student-name-link" onclick="StudentsModule.viewStudentProfile('${s.id}')">
                      ${this.escapeHtml(s.name)}
                    </div>
                  </td>
                  <td class="text-center">
                    <span class="badge-gender ${s.gender === 'L' ? 'badge-l' : 'badge-p'}">${s.gender}</span>
                  </td>
                  <td>
                    <span class="badge ${cls.level === 'SD' ? 'badge-sd' : 'badge-smp'}">${cls.level}</span>
                    <span class="badge badge-outline">${cls.name}</span>
                  </td>
                  <td class="text-center">
                    <span class="badge badge-secondary">${gradedCount}/${studentAssignments.length}</span>
                  </td>
                  <td class="text-center font-bold ${avg !== '-' ? (isGood ? 'text-success' : 'text-danger') : 'text-muted'}">
                    ${avg}
                  </td>
                  <td><span class="text-sm text-muted">${this.escapeHtml(s.notes || '-')}</span></td>
                  <td class="text-center">
                    <div class="action-btns-group">
                      <button class="btn-icon" title="Lihat Nilai & Rapor Mini" onclick="StudentsModule.viewStudentProfile('${s.id}')">
                        <i class="icon-file-text"></i> 👁️
                      </button>
                      <button class="btn-icon" title="Edit Siswa" onclick="StudentsModule.openEditModal('${s.id}')">
                        <i class="icon-edit"></i> ✏️
                      </button>
                      <button class="btn-icon text-danger" title="Hapus Siswa" onclick="StudentsModule.deleteStudent('${s.id}')">
                        <i class="icon-trash"></i> 🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  },

  openAddModal() {
    this.editingStudentId = null;
    document.getElementById("studentModalTitle").innerHTML = `<span>👤</span> Tambah Data Siswa`;
    document.getElementById("studentForm").reset();

    // Default to current level
    const levelToUse = this.currentFilterLevel === "SMP" ? "SMP" : "SD";
    const radioEl = document.querySelector(`input[name="studentModalLevel"][value="${levelToUse}"]`);
    if (radioEl) radioEl.checked = true;
    this.filterFormClassSelect(levelToUse, "studentClassSelect");

    if (this.currentFilterClass !== "all") {
      document.getElementById("studentClassSelect").value = this.currentFilterClass;
    }

    App.openModal("studentModal");
  },

  openEditModal(id) {
    const students = StorageService.getStudents();
    const s = students.find(item => item.id === id);
    if (!s) return;

    this.editingStudentId = id;
    document.getElementById("studentModalTitle").innerHTML = `<span>✏️</span> Edit Data Siswa`;

    const radioEl = document.querySelector(`input[name="studentModalLevel"][value="${s.level || 'SD'}"]`);
    if (radioEl) radioEl.checked = true;
    this.filterFormClassSelect(s.level || "SD", "studentClassSelect");

    document.getElementById("studentClassSelect").value = s.classId || "";
    document.getElementById("studentNisn").value = s.nisn || "";
    document.getElementById("studentName").value = s.name || "";
    document.getElementById("studentGender").value = s.gender || "L";
    document.getElementById("studentNotes").value = s.notes || "";

    App.openModal("studentModal");
  },

  saveStudent() {
    const classSelect = document.getElementById("studentClassSelect");
    const classId = classSelect.value;
    const name = document.getElementById("studentName").value.trim();
    const nisn = document.getElementById("studentNisn").value.trim();
    const gender = document.getElementById("studentGender").value;
    const notes = document.getElementById("studentNotes").value.trim();

    if (!classId || !name) {
      App.showToast("Harap pilih kelas dan isi nama siswa!", "warning");
      return;
    }

    const classes = StorageService.getClasses();
    const cls = classes.find(c => c.id === classId);

    let students = StorageService.getStudents();
    const studentData = {
      id: this.editingStudentId || ("s-" + Date.now().toString(36) + Math.random().toString(36).substr(2, 4)),
      classId: classId,
      level: cls ? cls.level : "SD",
      name: name,
      nisn: nisn || "-",
      gender: gender,
      notes: notes
    };

    if (this.editingStudentId) {
      const idx = students.findIndex(s => s.id === this.editingStudentId);
      if (idx !== -1) {
        students[idx] = studentData;
      }
      App.showToast("Data siswa berhasil diperbarui!", "success");
    } else {
      students.push(studentData);
      App.showToast("Siswa baru berhasil ditambahkan!", "success");
    }

    StorageService.saveStudents(students);
    if (window.SupabaseService) SupabaseService.saveStudentRemote(studentData);
    App.closeModal("studentModal");
    this.renderClassFilterPills();
    this.render();
    App.updateDashboardStats();
    if (window.GradesModule) GradesModule.render();
  },

  deleteStudent(id) {
    if (!confirm("Apakah Anda yakin ingin menghapus data siswa ini? Nilai siswa ini di semua tugas juga akan dihapus.")) return;

    let students = StorageService.getStudents();
    students = students.filter(s => s.id !== id);
    StorageService.saveStudents(students);
    if (window.SupabaseService) SupabaseService.deleteStudentRemote(id);

    // Clean up student scores in assignments
    let assignments = StorageService.getAssignments();
    assignments.forEach(a => {
      if (a.scores && a.scores[id] !== undefined) {
        delete a.scores[id];
        if (window.SupabaseService) SupabaseService.saveAssignmentRemote(a);
      }
    });
    StorageService.saveAssignments(assignments);

    App.showToast("Data siswa berhasil dihapus.", "info");
    this.renderClassFilterPills();
    this.render();
    App.updateDashboardStats();
    if (window.GradesModule) GradesModule.render();
  },

  openBatchModal() {
    document.getElementById("batchStudentForm").reset();
    const levelToUse = this.currentFilterLevel === "SMP" ? "SMP" : "SD";
    const radioEl = document.querySelector(`input[name="batchModalLevel"][value="${levelToUse}"]`);
    if (radioEl) radioEl.checked = true;
    this.filterFormClassSelect(levelToUse, "batchStudentClassSelect");

    App.openModal("batchStudentModal");
  },

  saveBatchStudents() {
    const classId = document.getElementById("batchStudentClassSelect").value;
    const rawText = document.getElementById("batchStudentNames").value.trim();

    if (!classId || !rawText) {
      App.showToast("Pilih kelas dan tempel daftar nama siswa!", "warning");
      return;
    }

    const classes = StorageService.getClasses();
    const cls = classes.find(c => c.id === classId);

    const lines = rawText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) {
      App.showToast("Tidak ada baris nama yang valid.", "warning");
      return;
    }

    let students = StorageService.getStudents();
    let addedCount = 0;

    lines.forEach((line, index) => {
      let parts = line.includes("\t") ? line.split("\t") : (line.includes(",") ? line.split(",") : [line]);
      let name = "";
      let nisn = "-";
      let gender = "L";

      if (parts.length === 1) {
        name = parts[0].trim();
      } else if (parts.length === 2) {
        if (/^\d+$/.test(parts[0].trim())) {
          nisn = parts[0].trim();
          name = parts[1].trim();
        } else {
          name = parts[0].trim();
          gender = (parts[1].trim().toUpperCase() === "P" || parts[1].trim().toUpperCase() === "PEREMPUAN") ? "P" : "L";
        }
      } else {
        nisn = parts[0].trim();
        name = parts[1].trim();
        gender = (parts[2].trim().toUpperCase() === "P" || parts[2].trim().toUpperCase() === "PEREMPUAN") ? "P" : "L";
      }

      if (name) {
        const newStudent = {
          id: "s-" + Date.now().toString(36) + Math.random().toString(36).substr(2, 4) + index,
          classId: classId,
          level: cls ? cls.level : "SD",
          name: name,
          nisn: nisn,
          gender: gender,
          notes: "Diimpor massal"
        };
        students.push(newStudent);
        if (window.SupabaseService) SupabaseService.saveStudentRemote(newStudent);
        addedCount++;
      }
    });

    StorageService.saveStudents(students);
    App.closeModal("batchStudentModal");
    App.showToast(`Berhasil menambahkan ${addedCount} siswa baru ke kelas ini!`, "success");
    this.renderClassFilterPills();
    this.render();
    App.updateDashboardStats();
    if (window.GradesModule) GradesModule.render();
  },

  viewStudentProfile(studentId) {
    const students = StorageService.getStudents();
    const s = students.find(item => item.id === studentId);
    if (!s) return;

    const classes = StorageService.getClasses();
    const cls = classes.find(c => c.id === s.classId) || { name: s.classId, level: s.level };
    const assignments = StorageService.getAssignments().filter(a => a.classId === s.classId);

    let totalScore = 0;
    let count = 0;
    const taskRows = assignments.map((a, idx) => {
      const scoreVal = a.scores ? a.scores[s.id] : undefined;
      const isGraded = scoreVal !== undefined && scoreVal !== "" && !isNaN(scoreVal);
      if (isGraded) {
        totalScore += Number(scoreVal);
        count++;
      }

      const isPass = isGraded && Number(scoreVal) >= (a.kktp || 75);
      const statusBadge = isGraded 
        ? (isPass ? `<span class="badge badge-success">Tuntas</span>` : `<span class="badge badge-danger">Belum Tuntas</span>`) 
        : `<span class="badge badge-outline">Belum Dinilai</span>`;

      return `
        <tr>
          <td class="text-center">${idx + 1}</td>
          <td>
            <strong>${this.escapeHtml(a.title)}</strong>
            <div class="text-xs text-muted">${a.category} &bull; Batas: ${a.dueDate || '-'}</div>
          </td>
          <td class="text-center">${a.kktp || 75}</td>
          <td class="text-center font-bold ${isGraded ? (isPass ? 'text-success' : 'text-danger') : 'text-muted'}">
            ${isGraded ? scoreVal : '-'}
          </td>
          <td class="text-center">${statusBadge}</td>
        </tr>
      `;
    }).join("");

    const avg = count > 0 ? (totalScore / count).toFixed(1) : "-";

    const profileHtml = `
      <div class="student-profile-sheet">
        <div class="student-profile-header mb-4">
          <div class="d-flex align-center gap-3">
            <div class="student-avatar-big ${s.gender === 'L' ? 'bg-l' : 'bg-p'}">
              ${s.gender === 'L' ? '👦' : '👧'}
            </div>
            <div>
              <h2 class="mb-1">${this.escapeHtml(s.name)}</h2>
              <div class="d-flex gap-2">
                <span class="badge ${cls.level === 'SD' ? 'badge-sd' : 'badge-smp'}">${cls.level}</span>
                <span class="badge badge-outline">${cls.name}</span>
                <span class="badge-gender ${s.gender === 'L' ? 'badge-l' : 'badge-p'}">${s.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</span>
                <span class="font-mono text-xs text-muted">NISN: ${s.nisn}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="stats-grid-4 mb-4">
          <div class="stat-card-modern">
            <div class="stat-icon-wrapper icon-bg-emerald">📊</div>
            <div class="stat-content">
              <div class="stat-num-modern text-emerald">${avg}</div>
              <div class="stat-label-modern">Rata-Rata Nilai PAI</div>
            </div>
          </div>
          <div class="stat-card-modern">
            <div class="stat-icon-wrapper icon-bg-blue">📝</div>
            <div class="stat-content">
              <div class="stat-num-modern text-blue">${count}/${assignments.length}</div>
              <div class="stat-label-modern">Tugas Diselesaikan</div>
            </div>
          </div>
        </div>

        <h4 class="mb-2">🏆 Rincian Tugas & Penilaian PAI:</h4>
        <div class="table-responsive mb-3">
          <table class="table table-bordered table-sm">
            <thead>
              <tr>
                <th width="40">No</th>
                <th>Tugas / Asesmen</th>
                <th width="80" class="text-center">KKTP</th>
                <th width="80" class="text-center">Nilai</th>
                <th width="110" class="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              ${taskRows || `<tr><td colspan="5" class="text-center text-muted py-3">Belum ada tugas untuk kelas ini.</td></tr>`}
            </tbody>
          </table>
        </div>

        ${s.notes ? `
          <div class="student-notes-panel mt-3">
            <strong>📝 Catatan Khusus Guru:</strong>
            <p class="mb-0 mt-1">${this.escapeHtml(s.notes)}</p>
          </div>
        ` : ''}
      </div>
    `;

    document.getElementById("detailModalContent").innerHTML = profileHtml;
    App.openModal("detailModal");
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
