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
      filterSelect.innerHTML = `<option value="all">Semua Kelas (SD & SMP)</option>` +
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
      const isSmp = this.currentFilterLevel === "SMP" || (this.currentFilterClass && this.currentFilterClass.startsWith("smp"));
      container.innerHTML = `
        <div class="empty-state py-4">
          <div class="empty-icon">${isSmp ? '🏛️' : '👥'}</div>
          <h3>Belum Ada Data Siswa ${isSmp ? 'Jenjang SMP' : (this.currentFilterLevel === 'SD' ? 'Jenjang SD' : '')}</h3>
          <p>Tambahkan siswa secara manual atau gunakan tombol <strong>"⚡ Impor Massal Siswa"</strong> untuk menempel seluruh daftar nama siswa sekaligus.</p>
          <div class="mt-3 d-flex gap-2 justify-center">
            <button class="btn btn-primary" onclick="StudentsModule.openAddModal('${isSmp ? 'SMP' : 'SD'}')">
              <span>➕</span> Tambah Siswa ${isSmp ? 'SMP' : ''}
            </button>
            <button class="btn btn-gold" onclick="StudentsModule.openBatchModal('${isSmp ? 'SMP' : 'SD'}')">
              <span>⚡</span> Impor Massal Siswa ${isSmp ? 'SMP' : ''}
            </button>
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
                        👁️
                      </button>
                      <button class="btn-icon" title="Edit Siswa" onclick="StudentsModule.openEditModal('${s.id}')">
                        ✏️
                      </button>
                      <button class="btn-icon text-danger" title="Hapus Siswa" onclick="StudentsModule.deleteStudent('${s.id}')">
                        🗑️
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

  openAddModal(presetLevel = null) {
    this.editingStudentId = null;
    document.getElementById("studentModalTitle").innerHTML = `<span>👤</span> Tambah Data Siswa Baru`;
    document.getElementById("studentForm").reset();

    let levelToUse = presetLevel || (this.currentFilterLevel === "SMP" ? "SMP" : "SD");
    if (this.currentFilterClass && this.currentFilterClass.startsWith("smp")) {
      levelToUse = "SMP";
    }

    const radioEl = document.querySelector(`input[name="studentModalLevel"][value="${levelToUse}"]`);
    if (radioEl) radioEl.checked = true;
    this.filterFormClassSelect(levelToUse, "studentClassSelect");

    if (this.currentFilterClass !== "all") {
      document.getElementById("studentClassSelect").value = this.currentFilterClass;
    }

    App.openModal("studentModal");
  },

  openEditModal(id) {
    const list = StorageService.getStudents();
    const student = list.find(s => s.id === id);
    if (!student) return;

    this.editingStudentId = id;
    document.getElementById("studentModalTitle").innerHTML = `<span>✏️</span> Edit Data Siswa`;

    const radioEl = document.querySelector(`input[name="studentModalLevel"][value="${student.level || 'SD'}"]`);
    if (radioEl) radioEl.checked = true;
    this.filterFormClassSelect(student.level || "SD", "studentClassSelect");

    document.getElementById("studentClassSelect").value = student.classId;
    document.getElementById("studentName").value = student.name;
    document.getElementById("studentNisn").value = (student.nisn !== "-" ? student.nisn : "") || "";
    document.getElementById("studentGender").value = student.gender || "L";
    document.getElementById("studentNotes").value = (student.notes !== "-" ? student.notes : "") || "";

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
    
    // Auto-switch view to the target class so the new student is visible immediately
    this.currentFilterLevel = studentData.level;
    this.currentFilterClass = studentData.classId;
    document.querySelectorAll(".student-level-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.level === studentData.level);
    });
    this.updateFilterDropdown();

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

  openBatchModal(presetLevel = null) {
    document.getElementById("batchStudentForm").reset();

    let levelToUse = presetLevel || (this.currentFilterLevel === "SMP" ? "SMP" : "SD");
    if (this.currentFilterClass && this.currentFilterClass.startsWith("smp")) {
      levelToUse = "SMP";
    }

    const radioEl = document.querySelector(`input[name="batchModalLevel"][value="${levelToUse}"]`);
    if (radioEl) radioEl.checked = true;
    this.filterFormClassSelect(levelToUse, "batchStudentClassSelect");

    if (this.currentFilterClass !== "all") {
      const select = document.getElementById("batchStudentClassSelect");
      if (select) select.value = this.currentFilterClass;
    }

    App.openModal("batchStudentModal");
  },

  setStudentModalLevel(level) {
    const radioEl = document.querySelector(`input[name="studentModalLevel"][value="${level}"]`);
    if (radioEl) radioEl.checked = true;
    this.filterFormClassSelect(level, "studentClassSelect");
  },

  setBatchModalLevel(level) {
    const radioEl = document.querySelector(`input[name="batchModalLevel"][value="${level}"]`);
    if (radioEl) radioEl.checked = true;
    this.filterFormClassSelect(level, "batchStudentClassSelect");
  },

  insertBatchSample(type = 'SMP') {
    const textarea = document.getElementById("batchStudentNames");
    if (!textarea) return;

    if (type === 'SMP') {
      this.setBatchModalLevel('SMP');
      textarea.value = "007701, Aditya Pratama, L\n007702, Farah Diba Nurhaliza, P\n007703, Muhammad Rizky, L\n007704, Salma Salshabila, P\n007705, Yusuf Al-Farisi, L";
      App.showToast("Contoh format daftar siswa SMP dimuat!", "info");
    } else {
      this.setBatchModalLevel('SD');
      textarea.value = "013401, Ahmad Fauzan, L\n013402, Aisyah Putri Azzahra, P\n013403, Bilal Muhammad, L\n013404, Fathimah Zahra, P\n013405, Kenzo Al-Ghifari, L";
      App.showToast("Contoh format daftar siswa SD dimuat!", "info");
    }
  },

  saveBatchStudents() {
    const classId = document.getElementById("batchStudentClassSelect").value;
    const rawText = document.getElementById("batchStudentNames").value.trim();

    if (!classId) {
      App.showToast("Silakan pilih kelas target terlebih dahulu!", "warning");
      return;
    }

    if (!rawText) {
      App.showToast("Tempel (paste) daftar nama siswa di kotak teks!", "warning");
      return;
    }

    const classes = StorageService.getClasses();
    const cls = classes.find(c => c.id === classId);
    const targetLevel = cls ? cls.level : (classId.startsWith("smp") ? "SMP" : "SD");

    const lines = rawText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) {
      App.showToast("Tidak ada baris nama yang valid.", "warning");
      return;
    }

    let students = StorageService.getStudents();
    let addedCount = 0;

    lines.forEach((line, index) => {
      // Split by tab, comma, or semicolon
      let parts = line.includes("\t") ? line.split("\t") : (line.includes(",") ? line.split(",") : (line.includes(";") ? line.split(";") : [line]));
      parts = parts.map(p => p.trim()).filter(p => p.length > 0);

      let name = "";
      let nisn = "-";
      let gender = "L";

      if (parts.length === 1) {
        // Hanya Nama
        name = parts[0];
      } else if (parts.length === 2) {
        // Bisa: (NISN, Nama) atau (Nama, Gender)
        if (/^\d+$/.test(parts[0])) {
          nisn = parts[0];
          name = parts[1];
        } else {
          name = parts[0];
          const g = parts[1].toUpperCase();
          gender = (g === "P" || g === "PEREMPUAN" || g === "WANITA") ? "P" : "L";
        }
      } else {
        // (NISN, Nama, Gender) atau sebaliknya
        if (/^\d+$/.test(parts[0])) {
          nisn = parts[0];
          name = parts[1];
          const g = parts[2].toUpperCase();
          gender = (g === "P" || g === "PEREMPUAN" || g === "WANITA") ? "P" : "L";
        } else {
          name = parts[0];
          nisn = parts[1];
          const g = parts[2].toUpperCase();
          gender = (g === "P" || g === "PEREMPUAN" || g === "WANITA") ? "P" : "L";
        }
      }

      // Bersihkan karakter angka urutan di depan nama (misal: "1. Ahmad" -> "Ahmad")
      name = name.replace(/^\d+[\.\-\)]\s*/, '').trim();

      if (name) {
        const newStudent = {
          id: "s-" + Date.now().toString(36) + Math.random().toString(36).substr(2, 4) + index,
          classId: classId,
          level: targetLevel,
          name: name,
          nisn: nisn || "-",
          gender: gender,
          notes: `Diimpor massal ke ${cls ? cls.name : classId}`
        };
        students.push(newStudent);
        if (window.SupabaseService) SupabaseService.saveStudentRemote(newStudent);
        addedCount++;
      }
    });

    StorageService.saveStudents(students);
    App.closeModal("batchStudentModal");
    App.showToast(`Berhasil menambahkan ${addedCount} siswa baru ke ${cls ? cls.name : 'kelas'}!`, "success");
    
    // Auto-switch view to the target class so new students are visible immediately
    this.currentFilterLevel = targetLevel;
    this.currentFilterClass = classId;
    document.querySelectorAll(".student-level-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.level === targetLevel);
    });
    this.updateFilterDropdown();

    this.renderClassFilterPills();
    this.render();
    App.updateDashboardStats();
    if (window.GradesModule) GradesModule.render();
  },

  viewStudentProfile(studentId) {
    const list = StorageService.getStudents();
    const student = list.find(s => s.id === studentId);
    if (!student) return;

    const classes = StorageService.getClasses();
    const cls = classes.find(c => c.id === student.classId) || { name: student.classId, level: student.level };
    const assignments = StorageService.getAssignments().filter(a => a.classId === student.classId);
    const settings = StorageService.getSettings();

    let totalScore = 0;
    let gradedCount = 0;

    let assignmentsRows = assignments.map((a, idx) => {
      const score = (a.scores && a.scores[student.id] !== undefined) ? a.scores[student.id] : "";
      if (score !== "" && !isNaN(score)) {
        totalScore += Number(score);
        gradedCount++;
      }

      const isPass = score !== "" && Number(score) >= (a.kktp || 75);
      const statusBadge = score !== "" 
        ? (isPass ? `<span class="badge badge-success">Tuntas</span>` : `<span class="badge badge-danger">Remedial</span>`) 
        : `<span class="badge badge-outline">Belum Dinilai</span>`;

      return `
        <tr>
          <td class="text-center">${idx + 1}</td>
          <td><strong>${this.escapeHtml(a.title)}</strong></td>
          <td><span class="badge badge-mini">${a.category}</span></td>
          <td class="text-center">${a.dueDate || a.date}</td>
          <td class="text-center font-bold ${score !== '' ? (isPass ? 'text-success' : 'text-danger') : 'text-muted'}">
            ${score !== "" ? score : "-"}
          </td>
          <td class="text-center">${statusBadge}</td>
        </tr>
      `;
    }).join("");

    const avgScore = gradedCount > 0 ? (totalScore / gradedCount).toFixed(1) : "-";
    const defaultKktp = settings.defaultKktp || 75;
    const isOverallPass = avgScore !== "-" && Number(avgScore) >= defaultKktp;

    const profileHtml = `
      <div class="print-official-preview">
        <div class="kop-surat text-center mb-3">
          <h4 class="school-title mb-0">${settings.schoolName || 'SEKOLAH THHK'}</h4>
          <h2 class="document-title">LEMBAR PERKEMBANGAN & RAPOR MINI PAI</h2>
          <h5 class="subject-title">MATA PELAJARAN: PENDIDIKAN AGAMA ISLAM & BUDI PEKERTI</h5>
          <div class="header-divider"></div>
        </div>

        <table class="table-info-meta mb-3">
          <tr>
            <td width="20%"><strong>Nama Siswa</strong></td>
            <td width="30%">: <strong>${this.escapeHtml(student.name)}</strong></td>
            <td width="20%"><strong>NISN / No. Induk</strong></td>
            <td width="30%">: ${student.nisn || '-'}</td>
          </tr>
          <tr>
            <td><strong>Jenjang & Kelas</strong></td>
            <td>: ${cls.level} / ${cls.name}</td>
            <td><strong>Jenis Kelamin</strong></td>
            <td>: ${student.gender === 'L' ? 'Laki-Laki (L)' : 'Perempuan (P)'}</td>
          </tr>
          <tr>
            <td><strong>Tahun Ajaran</strong></td>
            <td>: ${settings.academicYear}</td>
            <td><strong>Semester</strong></td>
            <td>: ${settings.semester}</td>
          </tr>
          <tr>
            <td><strong>Rata-Rata Nilai PAI</strong></td>
            <td>: <strong class="${isOverallPass ? 'text-success' : 'text-danger'} font-lg">${avgScore}</strong> (KKTP: ${defaultKktp})</td>
            <td><strong>Status Ketercapaian</strong></td>
            <td>: <strong>${avgScore !== '-' ? (isOverallPass ? '✅ TUNTAS' : '⚠️ BELUM TUNTAS') : '-'}</strong></td>
          </tr>
        </table>

        <div class="detail-block mb-3">
          <div class="detail-block-title">REKAPITULASI TUGAS, HAFALAN & ASESMEN PAI</div>
          <div class="detail-block-body p-0">
            <table class="table table-bordered table-sm mb-0">
              <thead>
                <tr>
                  <th width="35" class="text-center">No</th>
                  <th>Judul Tugas / Materi Penilaian</th>
                  <th width="120">Kategori</th>
                  <th width="90" class="text-center">Tanggal</th>
                  <th width="65" class="text-center">Nilai</th>
                  <th width="90" class="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                ${assignmentsRows || `<tr><td colspan="6" class="text-center text-muted py-3">Belum ada data tugas untuk kelas ini.</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>

        <div class="detail-block mb-4">
          <div class="detail-block-title">CATATAN KHUSUS & PERKEMBANGAN KARAKTER KEAGAMAAN</div>
          <div class="detail-block-body">
            ${this.escapeHtml(student.notes || 'Siswa menunjukkan motivasi belajar dan akhlak yang baik dalam mengikuti pembelajaran PAI.')}
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
