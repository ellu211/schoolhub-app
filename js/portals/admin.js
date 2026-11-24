/**
 * SchoolHub - Admin & Management Portal Controller
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
              ☑ <span class="badge-count">${window.appStore.data.leaves.filter(l => l.status === 'Pending').length}</span>
            </button>
            <div class="user-chip" title="Administrator">
              <div class="avatar">${admin.avatar}</div>
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
      students: 'Student Enrollment Management',
      staff: 'Teachers & Faculty Directory',
      fees: 'Fee Collection & Counter Ledger',
      academics: 'Academic & Examination Setup',
      notices: 'Publish Official Circulars',
      approvals: 'Pending Approvals (Leaves & Consents)',
      reports: 'School Operations Analytics & Reports'
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

  // 1. Dashboard
  renderDashboardHTML(admin) {
    const students = window.appStore.data.users.students;
    const pendingLeaves = window.appStore.data.leaves.filter(l => l.status === 'Pending').length;

    let totalDue = 0;
    Object.keys(window.appStore.data.fees).forEach(sid => {
      totalDue += window.appStore.data.fees[sid].due || 0;
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
            <div class="stat-val color-blue">842</div>
            <div class="stat-sub">Across Classes I–X</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Faculty & Staff</div>
            <div class="stat-val color-green">48</div>
            <div class="stat-sub">Teaching & Admin</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total Outstanding Dues</div>
            <div class="stat-val color-amber">₹${(totalDue + 338000).toLocaleString('en-IN')}</div>
            <div class="stat-sub">Across all sections</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Pending Approvals</div>
            <div class="stat-val color-red">${pendingLeaves + 1}</div>
            <div class="stat-sub">Leave requests & slips</div>
          </div>
        </div>

        <div class="split-layout">
          <div class="layout-main">
            <div class="content-card">
              <div class="card-header">
                <h3>Recent Administrative Activity</h3>
                <button class="link-btn" onclick="AdminPortal.switchTab('notices')">Publish Circular →</button>
              </div>
              <div class="updates-feed">
                <div class="feed-item">
                  <div class="feed-badge">Circular</div>
                  <strong>Annual Sports Day circular published</strong>
                  <div class="muted small">Dispatched to all classes and parents</div>
                </div>
                <div class="feed-item">
                  <div class="feed-badge">Accounts</div>
                  <strong>Offline fee counter transactions reconciled</strong>
                  <div class="muted small">₹2.5L recorded today at cash counter</div>
                </div>
                <div class="feed-item">
                  <div class="feed-badge">Examinations</div>
                  <strong>Unit Test 2 timetable scheduled</strong>
                  <div class="muted small">Admit cards auto-unlocking for fee-cleared students</div>
                </div>
              </div>
            </div>

            <div class="content-card" style="margin-top:16px">
              <div class="card-header">
                <h3>Pending Leave Approvals</h3>
                <button class="link-btn" onclick="AdminPortal.switchTab('approvals')">View All →</button>
              </div>
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
                  ${window.appStore.data.leaves.slice(0, 3).map(l => `
                    <tr>
                      <td><strong>${l.studentName}</strong></td>
                      <td>${l.class}</td>
                      <td>${l.fromDate} to ${l.toDate}</td>
                      <td>${l.reason.slice(0, 40)}...</td>
                      <td>
                        <span class="tag ${l.status === 'Approved' ? 'tag-green' : l.status === 'Rejected' ? 'tag-red' : 'tag-amber'}">
                          ${l.status}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div class="layout-side">
            <div class="content-card">
              <div class="card-header">
                <h3>Quick Management Actions</h3>
              </div>
              <div class="quick-action-stack">
                <button class="btn btn-primary btn-block" onclick="AdminPortal.switchTab('students')">
                  + Add / Manage Students
                </button>
                <button class="btn btn-outline btn-block" onclick="AdminPortal.switchTab('fees')">
                  💳 Record Offline Fee Payment
                </button>
                <button class="btn btn-outline btn-block" onclick="AdminPortal.switchTab('academics')">
                  ▦ Academic Timetable Setup
                </button>
                <button class="btn btn-outline btn-block" onclick="AdminPortal.switchTab('staff')">
                  👩‍🏫 Faculty Directory & Roles
                </button>
                <button class="btn btn-outline btn-block" onclick="AdminPortal.switchTab('reports')">
                  📊 Export School Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  // 2. Students Management
  renderStudentsHTML(admin) {
    const students = window.appStore.data.users.students;

    return `
      <section class="tab-pane active animate-fade">
        <div class="content-card">
          <div class="card-header">
            <div>
              <h3>Student Information System</h3>
              <p class="muted small">Enrollment records, parent contacts, and fee statuses</p>
            </div>
            <div class="toolbar-actions">
              <button class="btn btn-primary" onclick="AdminPortal.openAddStudentModal()">+ Add New Student</button>
            </div>
          </div>

          <div class="toolbar-bar">
            <input type="text" class="form-control" style="max-width:300px" placeholder="Search by name, ID or parent..." oninput="AdminPortal.filterStudentsTable(this.value)">
            <select class="form-control" style="max-width:180px">
              <option>All Classes</option>
              <option>Class VIII-B</option>
              <option>Class V-A</option>
            </select>
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
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${students.map(s => {
                const fee = window.appStore.data.fees[s.id] || { due: 0 };
                return `
                  <tr class="admin-student-row">
                    <td><span class="monospace">${s.id}</span></td>
                    <td>
                      <div class="student-mini-cell">
                        <span>${s.avatar}</span>
                        <div><strong>${s.name}</strong></div>
                      </div>
                    </td>
                    <td>${s.class} (Roll: ${s.roll})</td>
                    <td>${s.parentName} <br><span class="muted small">${s.parentPhone}</span></td>
                    <td><span class="tag tag-green">${s.attendanceRate}%</span></td>
                    <td>
                      <strong class="${fee.due > 0 ? 'color-red' : 'color-green'}">
                        ₹${fee.due.toLocaleString('en-IN')}
                      </strong>
                    </td>
                    <td><span class="tag tag-green">Enrolled</span></td>
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

  openAddStudentModal() {
    appModal.open(`
      <div class="modal-inner">
        <h3>+ Enroll New Student</h3>
        <p class="muted small">Create student admission record and set up fee ledger</p>

        <div class="form-grid" style="margin:12px 0">
          <div class="form-group">
            <label class="form-label">Full Name:</label>
            <input type="text" id="new-std-name" class="form-control" placeholder="Student name">
          </div>
          <div class="form-group">
            <label class="form-label">Class & Section:</label>
            <select id="new-std-class" class="form-control">
              <option value="Class VIII-B">Class VIII-B</option>
              <option value="Class VIII-A">Class VIII-A</option>
              <option value="Class IX-A">Class IX-A</option>
              <option value="Class V-A">Class V-A</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Roll Number:</label>
            <input type="text" id="new-std-roll" class="form-control" placeholder="E.g. 25">
          </div>
          <div class="form-group">
            <label class="form-label">Date of Birth:</label>
            <input type="date" id="new-std-dob" class="form-control" value="2012-05-15">
          </div>
          <div class="form-group">
            <label class="form-label">Parent / Guardian Name:</label>
            <input type="text" id="new-std-parent" class="form-control" placeholder="Guardian name">
          </div>
          <div class="form-group">
            <label class="form-label">Parent Phone:</label>
            <input type="tel" id="new-std-phone" class="form-control" placeholder="+91 98000 00000">
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
    const cls = document.getElementById('new-std-class').value;
    const roll = document.getElementById('new-std-roll').value.trim();
    const parentName = document.getElementById('new-std-parent').value.trim();
    const parentPhone = document.getElementById('new-std-phone').value.trim();
    const dob = document.getElementById('new-std-dob').value;

    if (!name || !roll || !parentName) {
      toast.error('Please fill in required student name, roll and parent details.');
      return;
    }

    const created = window.appStore.addStudent({
      name,
      class: cls,
      roll,
      parentName,
      parentPhone,
      dob
    });

    appModal.close();
    toast.success(`Student ${created.name} (${created.id}) successfully enrolled!`);
    const contentEl = document.getElementById('admin-tab-content');
    contentEl.innerHTML = this.getTabHTML('students', window.appStore.getAdmin());
  },

  // 3. Faculty & Staff
  renderStaffHTML(admin) {
    const staff = window.appStore.data.users.teachers;

    return `
      <section class="tab-pane active animate-fade">
        <div class="content-card">
          <div class="card-header">
            <div>
              <h3>Teachers & Staff Directory</h3>
              <p class="muted small">Faculty appointments, assigned classes, and contact channels</p>
            </div>
            <button class="btn btn-primary" onclick="toast.info('Staff registration form opened')">+ Add Staff Member</button>
          </div>

          <table class="app-table">
            <thead>
              <tr>
                <th>Faculty Name</th>
                <th>Subject Specialization</th>
                <th>Assigned Classes</th>
                <th>Class Teacher</th>
                <th>Contact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${staff.map(t => `
                <tr>
                  <td>
                    <div class="student-mini-cell">
                      <span>${t.avatar}</span>
                      <div>
                        <strong>${t.name}</strong>
                        <div class="muted small">${t.id}</div>
                      </div>
                    </div>
                  </td>
                  <td><strong>${t.subject}</strong></td>
                  <td>${t.assignedClasses.join(', ')}</td>
                  <td>${t.isClassTeacher ? `<span class="tag tag-blue">${t.isClassTeacher}</span>` : '—'}</td>
                  <td>${t.email}<br><span class="muted small">${t.phone}</span></td>
                  <td><span class="tag tag-green">Active</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
    `;
  },

  // 4. Fee Management & Offline Ledger
  renderFeesHTML(admin) {
    const students = window.appStore.data.users.students;

    return `
      <section class="tab-pane active animate-fade">
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-label">Collected This Month</div>
            <div class="stat-val color-green">₹8,62,500</div>
            <div class="stat-sub">Online + Offline cash</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Online Payments</div>
            <div class="stat-val color-blue">₹6,12,500</div>
            <div class="stat-sub">UPI & NetBanking</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Counter Cash & Cheque</div>
            <div class="stat-val color-amber">₹2,50,000</div>
            <div class="stat-sub">Verified at cash counter</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total Outstanding</div>
            <div class="stat-val color-red">₹3,40,000</div>
            <div class="stat-sub">Pending term dues</div>
          </div>
        </div>

        <div class="content-card" style="margin-top:16px">
          <div class="card-header">
            <div>
              <h3>Record Counter Offline Fee Payment</h3>
              <p class="muted small">Record cash, bank transfer, or cheque payments received at school office</p>
            </div>
            <span class="tag tag-amber">Audit Trail Enabled</span>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Select Student:</label>
              <select class="form-control" id="offline-student-select">
                ${students.map(s => {
                  const fee = window.appStore.data.fees[s.id] || { due: 0 };
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
              <input type="text" class="form-control" id="offline-notes-input" placeholder="E.g. Term 2 balance cleared at Accounts Counter #1">
            </div>
          </div>

          <div class="form-footer-actions">
            <button class="btn btn-primary" onclick="AdminPortal.saveOfflineFee()">
              💾 Record & Verify Payment
            </button>
          </div>
        </div>

        <div class="content-card" style="margin-top:16px">
          <div class="card-header">
            <div>
              <h3>Master Fee Ledger & Examination Eligibility</h3>
              <p class="muted small">Admit card unlocks automatically once all term dues are recorded</p>
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
              ${students.map(s => {
                const fee = window.appStore.data.fees[s.id] || { total: 8000, paid: 0, due: 8000, admitEligibility: 'Not Eligible' };
                const isEligible = fee.due <= 0;
                return `
                  <tr>
                    <td><strong>${s.name}</strong> <span class="muted small">(${s.id})</span></td>
                    <td>${s.class}</td>
                    <td>₹${fee.total.toLocaleString('en-IN')}</td>
                    <td class="color-green">₹${fee.paid.toLocaleString('en-IN')}</td>
                    <td><strong class="${isEligible ? 'color-green' : 'color-red'}">₹${fee.due.toLocaleString('en-IN')}</strong></td>
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
    document.getElementById('offline-student-select').value = studentId;
    document.getElementById('offline-amount-input').value = due;
    document.getElementById('offline-student-select').scrollIntoView({ behavior: 'smooth' });
  },

  saveOfflineFee() {
    const studentId = document.getElementById('offline-student-select').value;
    const amount = Number(document.getElementById('offline-amount-input').value);
    const mode = document.getElementById('offline-mode-select').value;
    const refNo = document.getElementById('offline-ref-input').value.trim();
    const notes = document.getElementById('offline-notes-input').value.trim();

    if (!amount || amount <= 0) {
      toast.error('Please enter a valid payment amount.');
      return;
    }

    const student = window.appStore.data.users.students.find(s => s.id === studentId);
    const record = window.appStore.recordOfflineFee(studentId, amount, mode, refNo, notes);

    toast.success(`Recorded offline payment of ₹${amount.toLocaleString('en-IN')} for ${student.name}!`);

    // Re-render
    const contentEl = document.getElementById('admin-tab-content');
    contentEl.innerHTML = this.getTabHTML('fees', window.appStore.getAdmin());

    // Print receipt
    setTimeout(() => {
      const feeObj = window.appStore.data.fees[studentId];
      const txn = feeObj.paymentHistory[0];
      docPrinter.printReceipt(txn, student);
    }, 400);
  },

  // 5. Academics
  renderAcademicsHTML(admin) {
    return `
      <section class="tab-pane active animate-fade">
        <div class="content-card">
          <div class="card-header">
            <div>
              <h3>Academic Year Setup & Timetable</h3>
              <p class="muted small">Session 2026–27 Schedule Configuration</p>
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
    return `
      <section class="tab-pane active animate-fade">
        <div class="content-card">
          <div class="card-header">
            <div>
              <h3>Publish School Circular / Notice</h3>
              <p class="muted small">Broadcast official announcements to students, parents, and faculty</p>
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
              <input type="text" class="form-control" id="admin-notice-title" placeholder="E.g. Winter Vacation Schedule & Pre-Board Examinations">
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

    toast.success(`Circular "${title}" broadcast to ${audience}!`);
    document.getElementById('admin-notice-title').value = '';
    document.getElementById('admin-notice-content').value = '';
  },

  // 7. Pending Approvals
  renderApprovalsHTML(admin) {
    const leaves = window.appStore.data.leaves;

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
              ${leaves.map(l => `
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
    window.appStore.updateLeaveStatus(leaveId, 'Rejected', 'Declined due to exams');
    toast.warning('Leave application marked as rejected.');
    const contentEl = document.getElementById('admin-tab-content');
    contentEl.innerHTML = this.getTabHTML('approvals', window.appStore.getAdmin());
  },

  // 8. Analytics & Reports
  renderReportsHTML(admin) {
    return `
      <section class="tab-pane active animate-fade">
        <div class="content-card">
          <div class="card-header">
            <div>
              <h3>Institutional Performance & Analytics</h3>
              <p class="muted small">Summary analytics for Green Valley High School</p>
            </div>
            <button class="btn btn-primary" onclick="toast.success('Analytics report generated!')">
              🖨️ Export PDF Report
            </button>
          </div>

          <div class="stats-row">
            <div class="stat-card">
              <div class="stat-label">Average Attendance</div>
              <div class="stat-val color-green">93.8%</div>
              <div class="stat-sub">Above benchmark</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Fee Collection Rate</div>
              <div class="stat-val color-blue">78.4%</div>
              <div class="stat-sub">Term 2 Progress</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Homework Completion</div>
              <div class="stat-val color-green">89.2%</div>
              <div class="stat-sub">Submission rate</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Teacher Retention</div>
              <div class="stat-val color-blue">98%</div>
              <div class="stat-sub">48 active faculty</div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  attachEvents(container, admin) {}
};
