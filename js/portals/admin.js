/**
 * SchoolHub - Admin & Management Portal Controller
 * Full CRUD for Students, Teachers/Faculty, Fee Ledger, Circulars, and Approvals
 */

window.AdminPortal = {
  activeTab: 'home',

  render(container) {
    const admin = window.appStore.getAdmin();

    container.innerHTML = `
      <div class="portal-admin">
        <header class="topbar">
          <div>
            <div class="crumb">SchoolHub / Management Portal</div>
            <h1 id="admin-page-title">${this.getPageTitle(this.activeTab)}</h1>
          </div>
          <div class="top-actions">
            <button class="pill" onclick="AdminPortal.switchTab('approvals')" title="Pending Approvals">
              ☑ <span class="badge-count">${(window.appStore.data.leaves || []).filter(l => l.status === 'Pending').length}</span>
            </button>
            <div class="user-chip" title="Administrator">
              <div class="avatar">${admin.avatar || '🏛️'}</div>
              <div class="chip-info">
                <strong>${admin.name}</strong>
                <span class="muted">${admin.title}</span>
              </div>
            </div>
          </div>
        </header>

        <div id="admin-tab-content">
          ${this.getTabHTML(this.activeTab, admin)}
        </div>
      </div>
    `;

    this.attachEvents(container, admin);
  },

  getPageTitle(tab) {
    const titles = {
      home: 'Admin Overview & Statistics',
      students: 'Student Enrollment & Records',
      staff: 'Teachers & Faculty Directory',
      fees: 'Fee Collection & Counter Ledger',
      academics: 'Academic & Timetable Setup',
      notices: 'Publish Official Circulars',
      approvals: 'Pending Approvals (Leaves & Consents)',
      reports: 'School Operations Analytics'
    };
    return titles[tab] || 'Admin Portal';
  },

  getTabHTML(tab, admin) {
    switch (tab) {
      case 'home': return this.renderDashboardHTML(admin);
      case 'students': return this.renderStudentsHTML(admin);
      case 'staff': return this.renderStaffHTML(admin);
      case 'fees': return this.renderFeesHTML(admin);
      case 'academics': return this.renderAcademicsHTML(admin);
      case 'notices': return this.renderNoticesHTML(admin);
      case 'approvals': return this.renderApprovalsHTML(admin);
      case 'reports': return this.renderReportsHTML(admin);
      default: return this.renderDashboardHTML(admin);
    }
  },

  switchTab(tab) {
    this.activeTab = tab;
    const titleEl = document.getElementById('admin-page-title');
    if (titleEl) titleEl.textContent = this.getPageTitle(tab);

    const contentEl = document.getElementById('admin-tab-content');
    if (contentEl) {
      const admin = window.appStore.getAdmin();
      contentEl.innerHTML = this.getTabHTML(tab, admin);
      this.attachEvents(document.querySelector('.portal-admin'), admin);
    }

    document.querySelectorAll('[data-admin-tab]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.adminTab === tab);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // 1. Dashboard Overview
  renderDashboardHTML(admin) {
    const students = window.appStore.data.users.students || [];
    const teachers = window.appStore.data.users.teachers || [];
    const pendingLeaves = (window.appStore.data.leaves || []).filter(l => l.status === 'Pending').length;

    let totalDue = 0;
    let totalCollected = 0;
    Object.keys(window.appStore.data.fees || {}).forEach(sid => {
      const f = window.appStore.data.fees[sid];
      totalDue += (f.due || 0);
      totalCollected += (f.paid || 0);
    });

    return `
      <section class="tab-pane active animate-fade">
        <div class="welcome-card admin-theme">
          <div class="welcome-text">
            <h2>Welcome, ${admin.name}</h2>
            <p>${admin.school} Operations Control Panel • Session 2026–27</p>
          </div>
          <div class="student-tag">
            <span>Admin Center</span> • <strong>Main Office</strong>
          </div>
        </div>

        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-label">Enrolled Students</div>
            <div class="stat-val color-blue">${students.length}</div>
            <div class="stat-sub">${students.length ? 'Active enrollment' : 'No students enrolled'}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Faculty & Staff</div>
            <div class="stat-val color-green">${teachers.length}</div>
            <div class="stat-sub">${teachers.length ? 'Active faculty' : 'No staff registered'}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total Outstanding Dues</div>
            <div class="stat-val color-amber">₹${totalDue.toLocaleString('en-IN')}</div>
            <div class="stat-sub">${totalCollected > 0 ? `Collected: ₹${totalCollected.toLocaleString('en-IN')}` : 'No collections yet'}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Pending Approvals</div>
            <div class="stat-val color-red">${pendingLeaves}</div>
            <div class="stat-sub">Leave requests awaiting review</div>
          </div>
        </div>

        <div class="split-layout">
          <div class="layout-main">
            <div class="content-card">
              <div class="card-header">
                <h3>Quick Management Actions</h3>
              </div>
              <div class="grid-2-col" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <button class="btn btn-primary" style="padding:14px" onclick="AdminPortal.openAddStudentModal()">
                  + Enroll New Student
                </button>
                <button class="btn btn-primary" style="padding:14px" onclick="AdminPortal.openAddStaffModal()">
                  + Add Staff / Teacher
                </button>
                <button class="btn btn-outline" style="padding:14px" onclick="AdminPortal.switchTab('fees')">
                  💳 Record Offline Fee Payment
                </button>
                <button class="btn btn-outline" style="padding:14px" onclick="AdminPortal.switchTab('notices')">
                  📢 Broadcast School Notice
                </button>
              </div>
            </div>

            <div class="content-card" style="margin-top:16px">
              <div class="card-header">
                <h3>Pending Leave Approvals</h3>
                <button class="link-btn" onclick="AdminPortal.switchTab('approvals')">View All →</button>
              </div>
              ${pendingLeaves === 0 ? `
                <div class="empty-box" style="padding:24px 10px">
                  <p class="muted small">No pending leave requests at this time.</p>
                </div>
              ` : `
                <table class="app-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Class</th>
                      <th>Dates</th>
                      <th>Reason</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${(window.appStore.data.leaves || []).filter(l => l.status === 'Pending').slice(0, 3).map(l => `
                      <tr>
                        <td><strong>${l.studentName}</strong></td>
                        <td>${l.class}</td>
                        <td>${l.fromDate} to ${l.toDate}</td>
                        <td>${l.reason.slice(0, 40)}...</td>
                        <td>
                          <button class="btn btn-sm btn-success" onclick="AdminPortal.approveLeave('${l.id}')">Approve</button>
                          <button class="btn btn-sm btn-danger" onclick="AdminPortal.rejectLeave('${l.id}')">Reject</button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              `}
            </div>
          </div>

          <div class="layout-side">
            <div class="content-card">
              <div class="card-header">
                <h3>Roster Summary</h3>
              </div>
              <div class="info-cell" style="margin-bottom:12px">
                <span class="muted small">Registered Students</span>
                <strong style="font-size:16px">${students.length} pupil(s)</strong>
              </div>
              <div class="info-cell" style="margin-bottom:12px">
                <span class="muted small">Teaching Staff</span>
                <strong style="font-size:16px">${teachers.length} faculty member(s)</strong>
              </div>
              <hr class="divider">
              <button class="btn btn-outline btn-block" onclick="AdminPortal.switchTab('students')">
                Browse Student Directory →
              </button>
              <button class="btn btn-outline btn-block" style="margin-top:8px" onclick="AdminPortal.switchTab('staff')">
                Browse Faculty Directory →
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  // 2. Student Management (Add, View/Edit, Remove)
  renderStudentsHTML(admin) {
    const students = window.appStore.data.users.students || [];

    return `
      <section class="tab-pane active animate-fade">
        <div class="content-card">
          <div class="card-header">
            <div>
              <h3>Student Information System</h3>
              <p class="muted small">Enroll, update, and manage student admission records and fee ledgers</p>
            </div>
            <div class="toolbar-actions">
              <button class="btn btn-primary" onclick="AdminPortal.openAddStudentModal()">+ Add New Student</button>
            </div>
          </div>

          <div class="toolbar-bar">
            <input type="text" class="form-control" style="max-width:320px" placeholder="Search by name, ID or parent..." oninput="AdminPortal.filterStudentsTable(this.value)">
          </div>

          <table class="app-table" id="admin-students-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Class & Roll</th>
                <th>Parent Name & Phone</th>
                <th>Attendance</th>
                <th>Fee Due</th>
                <th style="text-align:right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${students.length === 0 ? `
                <tr>
                  <td colspan="7" style="text-align:center;padding:40px 10px">
                    <div style="font-size:42px;margin-bottom:8px">🧑‍🎓</div>
                    <strong style="font-size:16px;display:block">No Students Enrolled Yet</strong>
                    <p class="muted small" style="margin:6px 0 16px">Click "+ Add New Student" to enroll your first student manually.</p>
                    <button class="btn btn-primary btn-sm" onclick="AdminPortal.openAddStudentModal()">+ Add New Student</button>
                  </td>
                </tr>
              ` : students.map(s => {
                const fee = (window.appStore.data.fees && window.appStore.data.fees[s.id]) || { due: 0 };
                return `
                  <tr class="admin-student-row">
                    <td><span class="monospace">${s.id}</span></td>
                    <td>
                      <div class="student-mini-cell">
                        <span>${s.avatar || '🧑‍🎓'}</span>
                        <div><strong>${s.name}</strong></div>
                      </div>
                    </td>
                    <td>${s.class} (Roll: ${s.roll})</td>
                    <td>${s.parentName} <br><span class="muted small">${s.parentPhone}</span></td>
                    <td><span class="tag tag-green">${s.attendanceRate || 100}%</span></td>
                    <td>
                      <strong class="${fee.due > 0 ? 'color-red' : 'color-green'}">
                        ₹${(fee.due || 0).toLocaleString('en-IN')}
                      </strong>
                    </td>
                    <td style="text-align:right;white-space:nowrap">
                      <button class="btn btn-sm btn-outline" onclick="AdminPortal.openEditStudentModal('${s.id}')" title="Edit Student">✏️ Edit</button>
                      <button class="btn btn-sm btn-danger" onclick="AdminPortal.confirmDeleteStudent('${s.id}')" title="Remove Student">🗑️ Remove</button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </section>
    `;
  },

  filterStudentsTable(query) {
    const q = query.toLowerCase();
    document.querySelectorAll('.admin-student-row').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  },

  // Modal: Add New Student
  openAddStudentModal() {
    appModal.open(`
      <div class="modal-inner">
        <h3>+ Enroll New Student</h3>
        <p class="muted small">Create student admission record and set up initial fee ledger</p>

        <div class="form-grid" style="margin:14px 0">
          <div class="form-group">
            <label class="form-label">Full Name: *</label>
            <input type="text" id="new-std-name" class="form-control" placeholder="E.g. Aarav Sharma">
          </div>
          <div class="form-group">
            <label class="form-label">Class & Section: *</label>
            <input type="text" id="new-std-class" class="form-control" value="Class VIII-B" placeholder="E.g. Class VIII-B">
          </div>
          <div class="form-group">
            <label class="form-label">Roll Number: *</label>
            <input type="text" id="new-std-roll" class="form-control" placeholder="E.g. 01">
          </div>
          <div class="form-group">
            <label class="form-label">Date of Birth:</label>
            <input type="date" id="new-std-dob" class="form-control" value="2012-05-15">
          </div>
          <div class="form-group">
            <label class="form-label">Blood Group:</label>
            <select id="new-std-blood" class="form-control">
              <option>A+</option><option>B+</option><option>O+</option><option>AB+</option><option>A-</option><option>B-</option><option>O-</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Initial Term Fee (INR):</label>
            <input type="number" id="new-std-fee" class="form-control" value="5000" placeholder="5000">
          </div>
          <div class="form-group">
            <label class="form-label">Parent / Guardian Name: *</label>
            <input type="text" id="new-std-parent" class="form-control" placeholder="Guardian name">
          </div>
          <div class="form-group">
            <label class="form-label">Parent Phone: *</label>
            <input type="tel" id="new-std-phone" class="form-control" placeholder="+91 98765 43210">
          </div>
          <div class="form-group" style="grid-column: span 2">
            <label class="form-label">Residential Address:</label>
            <input type="text" id="new-std-address" class="form-control" placeholder="Address...">
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="appModal.close()">Cancel</button>
          <button class="btn btn-primary" onclick="AdminPortal.saveNewStudent()">Enroll Student</button>
        </div>
      </div>
    `);
  },

  saveNewStudent() {
    const name = document.getElementById('new-std-name').value.trim();
    const cls = document.getElementById('new-std-class').value.trim();
    const roll = document.getElementById('new-std-roll').value.trim();
    const parentName = document.getElementById('new-std-parent').value.trim();
    const parentPhone = document.getElementById('new-std-phone').value.trim();
    const dob = document.getElementById('new-std-dob').value;
    const bloodGroup = document.getElementById('new-std-blood').value;
    const termFee = document.getElementById('new-std-fee').value;
    const address = document.getElementById('new-std-address').value.trim();

    if (!name || !roll || !parentName) {
      toast.error('Please fill in student name, roll number, and parent name.');
      return;
    }

    const created = window.appStore.addStudent({
      name,
      class: cls || 'Class VIII-B',
      roll,
      parentName,
      parentPhone: parentPhone || '+91 90000 00000',
      dob: dob || '2012-01-01',
      bloodGroup: bloodGroup || 'O+',
      termFee: Number(termFee) || 5000,
      address: address || 'Guwahati'
    });

    appModal.close();
    toast.success(`Student ${created.name} (${created.id}) successfully enrolled!`);

    // Refresh view
    const contentEl = document.getElementById('admin-tab-content');
    contentEl.innerHTML = this.getTabHTML('students', window.appStore.getAdmin());
  },

  // Modal: Edit Student
  openEditStudentModal(studentId) {
    const student = (window.appStore.data.users.students || []).find(s => s.id === studentId);
    if (!student) return;

    appModal.open(`
      <div class="modal-inner">
        <h3>✏️ Edit Student Details</h3>
        <p class="muted small">${student.name} (${student.id})</p>

        <div class="form-grid" style="margin:14px 0">
          <div class="form-group">
            <label class="form-label">Full Name:</label>
            <input type="text" id="edit-std-name" class="form-control" value="${student.name}">
          </div>
          <div class="form-group">
            <label class="form-label">Class & Section:</label>
            <input type="text" id="edit-std-class" class="form-control" value="${student.class}">
          </div>
          <div class="form-group">
            <label class="form-label">Roll Number:</label>
            <input type="text" id="edit-std-roll" class="form-control" value="${student.roll}">
          </div>
          <div class="form-group">
            <label class="form-label">Date of Birth:</label>
            <input type="text" id="edit-std-dob" class="form-control" value="${student.dob}">
          </div>
          <div class="form-group">
            <label class="form-label">Parent / Guardian:</label>
            <input type="text" id="edit-std-parent" class="form-control" value="${student.parentName}">
          </div>
          <div class="form-group">
            <label class="form-label">Parent Phone:</label>
            <input type="tel" id="edit-std-phone" class="form-control" value="${student.parentPhone}">
          </div>
          <div class="form-group" style="grid-column: span 2">
            <label class="form-label">Address:</label>
            <input type="text" id="edit-std-address" class="form-control" value="${student.address || ''}">
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="appModal.close()">Cancel</button>
          <button class="btn btn-primary" onclick="AdminPortal.saveEditStudent('${studentId}')">Save Changes</button>
        </div>
      </div>
    `);
  },

  saveEditStudent(studentId) {
    const name = document.getElementById('edit-std-name').value.trim();
    const cls = document.getElementById('edit-std-class').value.trim();
    const roll = document.getElementById('edit-std-roll').value.trim();
    const parentName = document.getElementById('edit-std-parent').value.trim();
    const parentPhone = document.getElementById('edit-std-phone').value.trim();
    const dob = document.getElementById('edit-std-dob').value.trim();
    const address = document.getElementById('edit-std-address').value.trim();

    if (!name || !roll) {
      toast.error('Student name and roll number cannot be empty.');
      return;
    }

    window.appStore.updateStudent(studentId, {
      name,
      class: cls,
      roll,
      parentName,
      parentPhone,
      dob,
      address
    });

    appModal.close();
    toast.success('Student details updated.');
    const contentEl = document.getElementById('admin-tab-content');
    contentEl.innerHTML = this.getTabHTML('students', window.appStore.getAdmin());
  },

  // Modal: Confirm Delete Student
  confirmDeleteStudent(studentId) {
    const student = (window.appStore.data.users.students || []).find(s => s.id === studentId);
    if (!student) return;

    appModal.open(`
      <div class="modal-inner">
        <h3 class="color-red">🗑️ Remove Student</h3>
        <p style="font-size:14px;margin:12px 0;line-height:1.5">
          Are you sure you want to remove <strong>${student.name}</strong> (Roll: ${student.roll}, ${student.class})?
        </p>
        <p class="muted small" style="background:#fff0f0;padding:10px;border-radius:8px;border:1px solid #ffd2d5">
          ⚠️ <strong>Warning:</strong> This will permanently delete this student's admission record, attendance history, homework submissions, and fee ledger.
        </p>
        <div class="modal-actions" style="margin-top:20px">
          <button class="btn btn-secondary" onclick="appModal.close()">Cancel</button>
          <button class="btn btn-danger" onclick="AdminPortal.executeDeleteStudent('${studentId}')">Confirm Remove</button>
        </div>
      </div>
    `);
  },

  executeDeleteStudent(studentId) {
    const removed = window.appStore.deleteStudent(studentId);
    appModal.close();
    if (removed) {
      toast.success(`Removed student ${removed.name} from records.`);
    }
    const contentEl = document.getElementById('admin-tab-content');
    contentEl.innerHTML = this.getTabHTML('students', window.appStore.getAdmin());
  },

  // 3. Teachers & Staff Management (Add, View/Edit, Remove)
  renderStaffHTML(admin) {
    const staff = window.appStore.data.users.teachers || [];

    return `
      <section class="tab-pane active animate-fade">
        <div class="content-card">
          <div class="card-header">
            <div>
              <h3>Teachers & Staff Directory</h3>
              <p class="muted small">Faculty appointments, subject specializations, and assigned classes</p>
            </div>
            <button class="btn btn-primary" onclick="AdminPortal.openAddStaffModal()">+ Add Staff Member</button>
          </div>

          <table class="app-table">
            <thead>
              <tr>
                <th>Faculty Name</th>
                <th>Subject Specialization</th>
                <th>Assigned Classes</th>
                <th>Class Teacher</th>
                <th>Contact</th>
                <th style="text-align:right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${staff.length === 0 ? `
                <tr>
                  <td colspan="6" style="text-align:center;padding:40px 10px">
                    <div style="font-size:42px;margin-bottom:8px">👨‍🏫</div>
                    <strong style="font-size:16px;display:block">No Faculty Members Registered Yet</strong>
                    <p class="muted small" style="margin:6px 0 16px">Click "+ Add Staff Member" to add teachers to your faculty directory.</p>
                    <button class="btn btn-primary btn-sm" onclick="AdminPortal.openAddStaffModal()">+ Add Staff Member</button>
                  </td>
                </tr>
              ` : staff.map(t => `
                <tr>
                  <td>
                    <div class="student-mini-cell">
                      <span>${t.avatar || '👨‍🏫'}</span>
                      <div>
                        <strong>${t.name}</strong>
                        <div class="muted small">${t.id}</div>
                      </div>
                    </div>
                  </td>
                  <td><strong>${t.subject}</strong></td>
                  <td>${(t.assignedClasses || []).join(', ')}</td>
                  <td>${t.isClassTeacher ? `<span class="tag tag-blue">${t.isClassTeacher}</span>` : '—'}</td>
                  <td>${t.email || '—'}<br><span class="muted small">${t.phone || ''}</span></td>
                  <td style="text-align:right;white-space:nowrap">
                    <button class="btn btn-sm btn-outline" onclick="AdminPortal.openEditStaffModal('${t.id}')" title="Edit Staff">✏️ Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="AdminPortal.confirmDeleteStaff('${t.id}')" title="Remove Staff">🗑️ Remove</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
    `;
  },

  // Modal: Add New Staff Member
  openAddStaffModal() {
    appModal.open(`
      <div class="modal-inner">
        <h3>+ Add New Faculty / Staff Member</h3>
        <p class="muted small">Register teacher, assign subjects, and configure teaching classes</p>

        <div class="form-grid" style="margin:14px 0">
          <div class="form-group">
            <label class="form-label">Full Name: *</label>
            <input type="text" id="new-tch-name" class="form-control" placeholder="E.g. Mr. R. Das">
          </div>
          <div class="form-group">
            <label class="form-label">Subject Specialization: *</label>
            <input type="text" id="new-tch-subject" class="form-control" placeholder="E.g. Mathematics">
          </div>
          <div class="form-group">
            <label class="form-label">Assigned Classes (Comma separated): *</label>
            <input type="text" id="new-tch-classes" class="form-control" value="Class VIII-B, Class IX-A" placeholder="Class VIII-B, Class IX-A">
          </div>
          <div class="form-group">
            <label class="form-label">Class Teacher of (Optional):</label>
            <input type="text" id="new-tch-classteacher" class="form-control" placeholder="E.g. Class VIII-B or leave blank">
          </div>
          <div class="form-group">
            <label class="form-label">Email Address:</label>
            <input type="email" id="new-tch-email" class="form-control" placeholder="teacher@school.edu">
          </div>
          <div class="form-group">
            <label class="form-label">Phone Number:</label>
            <input type="tel" id="new-tch-phone" class="form-control" placeholder="+91 94350 00000">
          </div>
          <div class="form-group">
            <label class="form-label">Room / Lab Allocation:</label>
            <input type="text" id="new-tch-room" class="form-control" value="Room 4" placeholder="Room 4">
          </div>
          <div class="form-group">
            <label class="form-label">Avatar Emoji:</label>
            <select id="new-tch-avatar" class="form-control">
              <option value="👨‍🏫">👨‍🏫 Teacher (Male)</option>
              <option value="👩‍🏫">👩‍🏫 Teacher (Female)</option>
              <option value="👨‍💻">👨‍💻 Computer / Lab</option>
              <option value="🔬">🔬 Science Specialist</option>
            </select>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="appModal.close()">Cancel</button>
          <button class="btn btn-primary" onclick="AdminPortal.saveNewStaff()">Register Staff Member</button>
        </div>
      </div>
    `);
  },

  saveNewStaff() {
    const name = document.getElementById('new-tch-name').value.trim();
    const subject = document.getElementById('new-tch-subject').value.trim();
    const classesStr = document.getElementById('new-tch-classes').value.trim();
    const isClassTeacher = document.getElementById('new-tch-classteacher').value.trim();
    const email = document.getElementById('new-tch-email').value.trim();
    const phone = document.getElementById('new-tch-phone').value.trim();
    const room = document.getElementById('new-tch-room').value.trim();
    const avatar = document.getElementById('new-tch-avatar').value;

    if (!name || !subject) {
      toast.error('Faculty name and subject are required.');
      return;
    }

    const assignedClasses = classesStr ? classesStr.split(',').map(s => s.trim()).filter(Boolean) : ['Class VIII-B'];

    const created = window.appStore.addStaff({
      name,
      subject,
      assignedClasses,
      isClassTeacher: isClassTeacher || null,
      email,
      phone,
      room: room || 'Faculty Room',
      avatar
    });

    appModal.close();
    toast.success(`Registered faculty member ${created.name} (${created.id})!`);
    const contentEl = document.getElementById('admin-tab-content');
    contentEl.innerHTML = this.getTabHTML('staff', window.appStore.getAdmin());
  },

  // Modal: Edit Staff Member
  openEditStaffModal(teacherId) {
    const teacher = (window.appStore.data.users.teachers || []).find(t => t.id === teacherId);
    if (!teacher) return;

    appModal.open(`
      <div class="modal-inner">
        <h3>✏️ Edit Faculty Member</h3>
        <p class="muted small">${teacher.name} (${teacher.id})</p>

        <div class="form-grid" style="margin:14px 0">
          <div class="form-group">
            <label class="form-label">Full Name:</label>
            <input type="text" id="edit-tch-name" class="form-control" value="${teacher.name}">
          </div>
          <div class="form-group">
            <label class="form-label">Subject:</label>
            <input type="text" id="edit-tch-subject" class="form-control" value="${teacher.subject}">
          </div>
          <div class="form-group" style="grid-column: span 2">
            <label class="form-label">Assigned Classes (Comma separated):</label>
            <input type="text" id="edit-tch-classes" class="form-control" value="${(teacher.assignedClasses || []).join(', ')}">
          </div>
          <div class="form-group">
            <label class="form-label">Class Teacher Designation:</label>
            <input type="text" id="edit-tch-classteacher" class="form-control" value="${teacher.isClassTeacher || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Room:</label>
            <input type="text" id="edit-tch-room" class="form-control" value="${teacher.room || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Email:</label>
            <input type="email" id="edit-tch-email" class="form-control" value="${teacher.email || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Phone:</label>
            <input type="tel" id="edit-tch-phone" class="form-control" value="${teacher.phone || ''}">
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="appModal.close()">Cancel</button>
          <button class="btn btn-primary" onclick="AdminPortal.saveEditStaff('${teacherId}')">Save Changes</button>
        </div>
      </div>
    `);
  },

  saveEditStaff(teacherId) {
    const name = document.getElementById('edit-tch-name').value.trim();
    const subject = document.getElementById('edit-tch-subject').value.trim();
    const classesStr = document.getElementById('edit-tch-classes').value.trim();
    const isClassTeacher = document.getElementById('edit-tch-classteacher').value.trim();
    const email = document.getElementById('edit-tch-email').value.trim();
    const phone = document.getElementById('edit-tch-phone').value.trim();
    const room = document.getElementById('edit-tch-room').value.trim();

    if (!name || !subject) {
      toast.error('Teacher name and subject cannot be empty.');
      return;
    }

    const assignedClasses = classesStr ? classesStr.split(',').map(s => s.trim()).filter(Boolean) : [];

    window.appStore.updateStaff(teacherId, {
      name,
      subject,
      assignedClasses,
      isClassTeacher: isClassTeacher || null,
      email,
      phone,
      room
    });

    appModal.close();
    toast.success('Teacher details updated.');
    const contentEl = document.getElementById('admin-tab-content');
    contentEl.innerHTML = this.getTabHTML('staff', window.appStore.getAdmin());
  },

  // Modal: Confirm Delete Staff Member
  confirmDeleteStaff(teacherId) {
    const teacher = (window.appStore.data.users.teachers || []).find(t => t.id === teacherId);
    if (!teacher) return;

    appModal.open(`
      <div class="modal-inner">
        <h3 class="color-red">🗑️ Remove Staff Member</h3>
        <p style="font-size:14px;margin:12px 0;line-height:1.5">
          Are you sure you want to remove <strong>${teacher.name}</strong> (${teacher.subject}) from the faculty directory?
        </p>
        <p class="muted small" style="background:#fff0f0;padding:10px;border-radius:8px;border:1px solid #ffd2d5">
          ⚠️ <strong>Note:</strong> This will unassign them from their classes and delete their teacher account access.
        </p>
        <div class="modal-actions" style="margin-top:20px">
          <button class="btn btn-secondary" onclick="appModal.close()">Cancel</button>
          <button class="btn btn-danger" onclick="AdminPortal.executeDeleteStaff('${teacherId}')">Confirm Remove</button>
        </div>
      </div>
    `);
  },

  executeDeleteStaff(teacherId) {
    const removed = window.appStore.deleteStaff(teacherId);
    appModal.close();
    if (removed) {
      toast.success(`Removed ${removed.name} from faculty directory.`);
    }
    const contentEl = document.getElementById('admin-tab-content');
    contentEl.innerHTML = this.getTabHTML('staff', window.appStore.getAdmin());
  },

  // 4. Fee Management & Offline Ledger
  renderFeesHTML(admin) {
    const students = window.appStore.data.users.students || [];

    let totalDue = 0;
    let totalCollected = 0;
    let onlineCollected = 0;
    let offlineCollected = 0;

    students.forEach(s => {
      const fee = (window.appStore.data.fees && window.appStore.data.fees[s.id]) || { total: 0, paid: 0, due: 0, paymentHistory: [] };
      totalDue += (fee.due || 0);
      totalCollected += (fee.paid || 0);
      (fee.paymentHistory || []).forEach(p => {
        if (p.method && p.method.includes('Counter')) {
          offlineCollected += (p.amount || 0);
        } else {
          onlineCollected += (p.amount || 0);
        }
      });
    });

    return `
      <section class="tab-pane active animate-fade">
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-label">Collected Total</div>
            <div class="stat-val color-green">₹${totalCollected.toLocaleString('en-IN')}</div>
            <div class="stat-sub">Online + Offline cash</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Online Payments</div>
            <div class="stat-val color-blue">₹${onlineCollected.toLocaleString('en-IN')}</div>
            <div class="stat-sub">Instant UPI & Cards</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Counter Cash & Cheque</div>
            <div class="stat-val color-amber">₹${offlineCollected.toLocaleString('en-IN')}</div>
            <div class="stat-sub">Verified at cash counter</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total Outstanding</div>
            <div class="stat-val color-red">₹${totalDue.toLocaleString('en-IN')}</div>
            <div class="stat-sub">Pending balances</div>
          </div>
        </div>

        <div class="content-card" style="margin-top:16px">
          <div class="card-header">
            <div>
              <h3>Record Counter Offline Fee Payment</h3>
              <p class="muted small">Record cash, bank transfer, or cheque payments received at school office counter</p>
            </div>
            <span class="tag tag-amber">Audit Trail Enabled</span>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Select Student:</label>
              <select class="form-control" id="offline-student-select">
                ${students.length === 0 ? `
                  <option disabled selected>No students enrolled yet</option>
                ` : students.map(s => {
                  const fee = (window.appStore.data.fees && window.appStore.data.fees[s.id]) || { due: 0 };
                  return `<option value="${s.id}">${s.name} (${s.id} • ${s.class}) — Due: ₹${fee.due}</option>`;
                }).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Amount Received (INR):</label>
              <input type="number" class="form-control" id="offline-amount-input" placeholder="E.g. 2500" value="2500">
            </div>

            <div class="form-group">
              <label class="form-label">Payment Mode:</label>
              <select class="form-control" id="offline-mode-select">
                <option value="Cash">Cash at Counter</option>
                <option value="Bank NEFT/RTGS">Direct Bank Transfer</option>
                <option value="School QR UPI">School QR UPI</option>
                <option value="Cheque / DD">Bank Cheque</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Counter Receipt / Cheque No:</label>
              <input type="text" class="form-control" id="offline-ref-input" placeholder="E.g. CHQ-99104 or REC-2026-9901">
            </div>

            <div class="form-group" style="grid-column: span 2">
              <label class="form-label">Internal Audit Notes:</label>
              <input type="text" class="form-control" id="offline-notes-input" placeholder="E.g. Fee cleared at Accounts Counter #1">
            </div>
          </div>

          <div class="form-footer-actions">
            <button class="btn btn-primary" onclick="AdminPortal.saveOfflineFee()" ${students.length === 0 ? 'disabled' : ''}>
              💾 Record & Verify Payment
            </button>
          </div>
        </div>

        <div class="content-card" style="margin-top:16px">
          <div class="card-header">
            <div>
              <h3>Master Fee Ledger & Examination Eligibility</h3>
              <p class="muted small">Admit cards unlock automatically once all required dues are cleared</p>
            </div>
          </div>

          <table class="app-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Total Fee</th>
                <th>Paid</th>
                <th>Balance Due</th>
                <th>Admit Eligibility</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${students.length === 0 ? `
                <tr><td colspan="7" class="text-center muted" style="padding:30px">No students enrolled. Enroll students to track fees.</td></tr>
              ` : students.map(s => {
                const fee = (window.appStore.data.fees && window.appStore.data.fees[s.id]) || { total: 0, paid: 0, due: 0, admitEligibility: 'Eligible' };
                const isEligible = fee.due <= 0;
                return `
                  <tr>
                    <td><strong>${s.name}</strong> <span class="muted small">(${s.id})</span></td>
                    <td>${s.class}</td>
                    <td>₹${(fee.total || 0).toLocaleString('en-IN')}</td>
                    <td class="color-green">₹${(fee.paid || 0).toLocaleString('en-IN')}</td>
                    <td><strong class="${isEligible ? 'color-green' : 'color-red'}">₹${(fee.due || 0).toLocaleString('en-IN')}</strong></td>
                    <td>
                      <span class="tag ${isEligible ? 'tag-green' : 'tag-red'}">${isEligible ? 'Eligible' : 'Not Eligible'}</span>
                    </td>
                    <td>
                      ${isEligible ? `
                        <button class="btn btn-sm btn-outline-success" onclick="docPrinter.printAdmitCard(window.appStore.data.users.students.find(st => st.id === '${s.id}'))">
                          Print Hall Ticket
                        </button>
                      ` : `
                        <button class="btn btn-sm btn-outline" onclick="AdminPortal.quickPayFor('${s.id}', ${fee.due})">
                          Record Payment
                        </button>
                      `}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </section>
    `;
  },

  quickPayFor(studentId, due) {
    const sel = document.getElementById('offline-student-select');
    if (sel) sel.value = studentId;
    const amt = document.getElementById('offline-amount-input');
    if (amt) amt.value = due;
    if (sel) sel.scrollIntoView({ behavior: 'smooth' });
  },

  saveOfflineFee() {
    const sel = document.getElementById('offline-student-select');
    if (!sel || !sel.value) {
      toast.error('Please select a student.');
      return;
    }
    const studentId = sel.value;
    const amount = Number(document.getElementById('offline-amount-input').value);
    const mode = document.getElementById('offline-mode-select').value;
    const refNo = document.getElementById('offline-ref-input').value.trim();
    const notes = document.getElementById('offline-notes-input').value.trim();

    if (!amount || amount <= 0) {
      toast.error('Please enter a valid payment amount.');
      return;
    }

    const student = (window.appStore.data.users.students || []).find(s => s.id === studentId);
    if (!student) return;

    window.appStore.recordOfflineFee(studentId, amount, mode, refNo, notes);
    toast.success(`Recorded payment of ₹${amount.toLocaleString('en-IN')} for ${student.name}!`);

    const contentEl = document.getElementById('admin-tab-content');
    contentEl.innerHTML = this.getTabHTML('fees', window.appStore.getAdmin());
  },

  // 5. Academics
  renderAcademicsHTML(admin) {
    return `
      <section class="tab-pane active animate-fade">
        <div class="content-card">
          <div class="card-header">
            <div>
              <h3>Academic Schedule & Timetable Setup</h3>
              <p class="muted small">Configure curriculum periods, exam dates, and syllabi</p>
            </div>
          </div>

          <div class="services-grid">
            <div class="content-card service-box">
              <div class="service-icon">▦</div>
              <h3>Class Timetables</h3>
              <p class="muted small">Configure periods, timings, rooms, and assigned teachers.</p>
              <button class="btn btn-sm btn-outline" onclick="toast.info('Class timetable editor launched')">Configure Timetable</button>
            </div>

            <div class="content-card service-box">
              <div class="service-icon">📊</div>
              <h3>Examination Schedules</h3>
              <p class="muted small">Set up Unit Tests, Half-Yearly and Final exam dates & admit cards.</p>
              <button class="btn btn-sm btn-outline" onclick="toast.info('Exam schedule editor launched')">Manage Exams</button>
            </div>

            <div class="content-card service-box">
              <div class="service-icon">📖</div>
              <h3>Curriculum & Syllabus</h3>
              <p class="muted small">Upload syllabus PDFs and learning milestone guidelines.</p>
              <button class="btn btn-sm btn-outline" onclick="toast.info('Curriculum manager opened')">Curriculum Setup</button>
            </div>

            <div class="content-card service-box">
              <div class="service-icon">📚</div>
              <h3>Library Circulation</h3>
              <p class="muted small">Track book issues, returns, and catalog inventory.</p>
              <button class="btn btn-sm btn-outline" onclick="toast.info('Library desk opened')">Library Console</button>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  // 6. Notices & Circulars
  renderNoticesHTML(admin) {
    const list = window.appStore.data.notices || [];

    return `
      <section class="tab-pane active animate-fade">
        <div class="content-card">
          <div class="card-header">
            <div>
              <h3>Broadcast Official Notice / Circular</h3>
              <p class="muted small">Dispatches announcement to all parents, students, and faculty members</p>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Audience:</label>
              <select class="form-control" id="admin-notice-audience">
                <option value="Whole school">Whole School (All Students & Parents)</option>
                <option value="Teachers only">Teachers & Staff Only</option>
                <option value="Parents only">Parents Only</option>
                <option value="Class VIII">Class VIII Only</option>
                <option value="Class IX">Class IX Only</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Category:</label>
              <select class="form-control" id="admin-notice-category">
                <option value="Circular">Official Circular</option>
                <option value="Urgent">Urgent Notice</option>
                <option value="Event">School Event</option>
                <option value="Holiday">Holiday Announcement</option>
              </select>
            </div>

            <div class="form-group" style="grid-column: span 2">
              <label class="form-label">Circular Title:</label>
              <input type="text" class="form-control" id="admin-notice-title" placeholder="E.g. Winter Vacation Schedule & Examinations">
            </div>

            <div class="form-group" style="grid-column: span 2">
              <label class="form-label">Notice Body:</label>
              <textarea class="form-control" id="admin-notice-content" rows="4" placeholder="Draft notice content..."></textarea>
            </div>
          </div>

          <div class="form-footer-actions">
            <button class="btn btn-primary" onclick="AdminPortal.publishOfficialNotice()">
              📢 Broadcast Circular
            </button>
          </div>
        </div>

        <div class="content-card" style="margin-top:16px">
          <div class="card-header">
            <h3>Active Circulars & Announcements (${list.length})</h3>
          </div>
          ${list.length === 0 ? `
            <div class="empty-box" style="padding:24px 10px">
              <p class="muted small">No circulars broadcast yet.</p>
            </div>
          ` : `
            <div class="notices-list">
              ${list.map(n => `
                <div class="notice-card" style="padding:14px;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:10px">
                  <div class="notice-head" style="display:flex;justify-content:space-between">
                    <div>
                      <span class="tag tag-blue">${n.category}</span>
                      <span class="tag tag-gray">${n.audience}</span>
                    </div>
                    <span class="muted small">${n.date}</span>
                  </div>
                  <h4 style="margin:8px 0 4px">${n.title}</h4>
                  <p class="muted small">${n.content}</p>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </section>
    `;
  },

  publishOfficialNotice() {
    const title = document.getElementById('admin-notice-title').value.trim();
    const audience = document.getElementById('admin-notice-audience').value;
    const category = document.getElementById('admin-notice-category').value;
    const content = document.getElementById('admin-notice-content').value.trim();

    if (!title || !content) {
      toast.error('Please enter title and content for the circular.');
      return;
    }

    window.appStore.addNotice({
      title,
      audience,
      category,
      content,
      author: 'Principal / Admin'
    });

    toast.success(`Circular "${title}" broadcast!`);
    const contentEl = document.getElementById('admin-tab-content');
    contentEl.innerHTML = this.getTabHTML('notices', window.appStore.getAdmin());
  },

  // 7. Approvals
  renderApprovalsHTML(admin) {
    const leaves = window.appStore.data.leaves || [];

    return `
      <section class="tab-pane active animate-fade">
        <div class="content-card">
          <div class="card-header">
            <div>
              <h3>Pending Requests & Approvals</h3>
              <p class="muted small">Review leave requests, consent forms, and document verification</p>
            </div>
          </div>

          <table class="app-table">
            <thead>
              <tr>
                <th>Request Type</th>
                <th>Student</th>
                <th>Details</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${leaves.length === 0 ? `
                <tr><td colspan="5" class="text-center muted" style="padding:30px">No leave or consent requests pending.</td></tr>
              ` : leaves.map(l => `
                <tr>
                  <td><strong>📝 Leave Application</strong></td>
                  <td>${l.studentName} <span class="muted small">(${l.class})</span></td>
                  <td>
                    <div><strong>${l.fromDate} to ${l.toDate}</strong></div>
                    <div class="muted small">${l.reason}</div>
                  </td>
                  <td>
                    <span class="tag ${l.status === 'Approved' ? 'tag-green' : l.status === 'Rejected' ? 'tag-red' : 'tag-amber'}">
                      ${l.status}
                    </span>
                  </td>
                  <td>
                    ${l.status === 'Pending' ? `
                      <button class="btn btn-sm btn-success" onclick="AdminPortal.approveLeave('${l.id}')">Approve</button>
                      <button class="btn btn-sm btn-danger" onclick="AdminPortal.rejectLeave('${l.id}')">Reject</button>
                    ` : `
                      <span class="muted small">Processed</span>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
    `;
  },

  approveLeave(leaveId) {
    window.appStore.updateLeaveStatus(leaveId, 'Approved', 'Approved by Principal Office');
    toast.success('Leave application approved.');
    const contentEl = document.getElementById('admin-tab-content');
    contentEl.innerHTML = this.getTabHTML('approvals', window.appStore.getAdmin());
  },

  rejectLeave(leaveId) {
    window.appStore.updateLeaveStatus(leaveId, 'Rejected', 'Declined by Principal Office');
    toast.warning('Leave application marked as rejected.');
    const contentEl = document.getElementById('admin-tab-content');
    contentEl.innerHTML = this.getTabHTML('approvals', window.appStore.getAdmin());
  },

  // 8. Reports
  renderReportsHTML(admin) {
    const students = window.appStore.data.users.students || [];
    const teachers = window.appStore.data.users.teachers || [];

    return `
      <section class="tab-pane active animate-fade">
        <div class="content-card">
          <div class="card-header">
            <div>
              <h3>Institutional Performance & Analytics</h3>
              <p class="muted small">Live analytics for ${admin.school}</p>
            </div>
            <button class="btn btn-primary" onclick="toast.success('Analytics report generated!')">
              🖨️ Export Summary
            </button>
          </div>

          <div class="stats-row">
            <div class="stat-card">
              <div class="stat-label">Active Enrollment</div>
              <div class="stat-val color-green">${students.length}</div>
              <div class="stat-sub">Enrolled students</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Faculty Staff</div>
              <div class="stat-val color-blue">${teachers.length}</div>
              <div class="stat-sub">Active teachers</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Student-Teacher Ratio</div>
              <div class="stat-val color-green">${teachers.length > 0 ? (students.length / teachers.length).toFixed(1) : '—'} : 1</div>
              <div class="stat-sub">Classroom coverage</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">System Health</div>
              <div class="stat-val color-blue">100%</div>
              <div class="stat-sub">All modules active</div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  attachEvents(container, admin) {}
};
