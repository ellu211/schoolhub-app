/**
 * SchoolHub - Teacher Portal Controller
 */

window.TeacherPortal = {
  activeTab: 'home',
  selectedClass: 'Class VIII-B',
  selectedDate: '2026-11-09',

  render(container) {
    const teacher = window.appStore.getActiveTeacher();
    if (!teacher) {
      container.innerHTML = `
        <div class="portal-teacher">
          <header class="topbar">
            <div>
              <div class="crumb">SchoolHub / Teacher Portal</div>
              <h1 id="teacher-page-title">Teacher Portal</h1>
            </div>
            <div class="top-actions">
              <button class="btn btn-outline" onclick="App.setRole('admin')">Go to Admin Portal</button>
            </div>
          </header>
          <div class="content-card" style="text-align:center;padding:50px 20px">
            <div style="font-size:52px;margin-bottom:12px">👨‍🏫</div>
            <h3 style="margin-bottom:8px">No Faculty Members Registered Yet</h3>
            <p class="muted" style="max-width:440px;margin:0 auto 20px">
              There are currently no teachers registered in the school faculty directory. Registered teachers can mark daily classroom attendance, publish assignments, review student submissions, and communicate with parents.
            </p>
            <button class="btn btn-primary" onclick="App.setRole('admin'); setTimeout(() => AdminPortal.openAddStaffModal(), 150);">
              + Add Staff Member as Admin
            </button>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="portal-teacher">
        <header class="topbar">
          <div>
            <div class="crumb">SchoolHub / Teacher Portal</div>
            <h1 id="teacher-page-title">${this.getPageTitle(this.activeTab)}</h1>
          </div>
          <div class="top-actions">
            <button class="pill" onclick="TeacherPortal.switchTab('messages')" title="Messages">
              ✉ <span class="badge-count">${window.appStore.data.messages.length}</span>
            </button>
            <div class="user-chip" title="Teacher Account">
              <div class="avatar">${teacher.avatar}</div>
              <div class="chip-info">
                <strong>${teacher.name}</strong>
                <span class="muted">${teacher.subject}</span>
              </div>
            </div>
          </div>
        </header>

        <div id="teacher-tab-content">
          ${this.getTabHTML(this.activeTab, teacher)}
        </div>
      </div>
    `;

    this.attachEvents(container, teacher);
  },

  getPageTitle(tab) {
    const titles = {
      home: 'Teacher Dashboard',
      attendance: 'Class Attendance Register',
      homework: 'Homework, Notes & Submissions',
      timetable: 'My Teaching Timetable',
      students: 'My Students Directory',
      notices: 'Class Notices & Circulars',
      messages: 'Staff & Parent Messages'
    };
    return titles[tab] || 'Teacher Portal';
  },

  getTabHTML(tab, teacher) {
    switch (tab) {
      case 'home': return this.renderDashboardHTML(teacher);
      case 'attendance': return this.renderAttendanceHTML(teacher);
      case 'homework': return this.renderHomeworkHTML(teacher);
      case 'timetable': return this.renderTimetableHTML(teacher);
      case 'students': return this.renderStudentsHTML(teacher);
      case 'notices': return this.renderNoticesHTML(teacher);
      case 'messages': return this.renderMessagesHTML(teacher);
      default: return this.renderDashboardHTML(teacher);
    }
  },

  switchTab(tab) {
    this.activeTab = tab;
    const titleEl = document.getElementById('teacher-page-title');
    if (titleEl) titleEl.textContent = this.getPageTitle(tab);

    const contentEl = document.getElementById('teacher-tab-content');
    if (contentEl) {
      const teacher = window.appStore.getActiveTeacher();
      if (!teacher) {
        this.render(document.getElementById('portal-root'));
        return;
      }
      contentEl.innerHTML = this.getTabHTML(tab, teacher);
      this.attachEvents(document.querySelector('.portal-teacher'), teacher);
    }

    document.querySelectorAll('[data-teacher-tab]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.teacherTab === tab);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // 1. Dashboard
  renderDashboardHTML(teacher) {
    const studentsInClass = window.appStore.data.users.students.filter(s => s.class === 'Class VIII-B');
    const pendingSubs = window.appStore.data.submissions.filter(s => s.status === 'Submitted');

    return `
      <section class="tab-pane active animate-fade">
        <div class="welcome-card teacher-theme">
          <div class="welcome-text">
            <h2>Good morning, ${teacher.name}! 👋</h2>
            <p>Teaching overview for <strong>Monday, 9 November 2026</strong> • Class Teacher of <strong>${teacher.isClassTeacher}</strong></p>
          </div>
          <div class="student-tag">
            <span>Staff ID: ${teacher.id}</span> • <strong>${teacher.room}</strong>
          </div>
        </div>

        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-label">My Classes</div>
            <div class="stat-val color-blue">${teacher.assignedClasses.length}</div>
            <div class="stat-sub">VIII-B, VIII-A, IX-A</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total Students</div>
            <div class="stat-val color-green">126</div>
            <div class="stat-sub">Across all sections</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Pending Reviews</div>
            <div class="stat-val color-amber">${pendingSubs.length}</div>
            <div class="stat-sub">Submissions to grade</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Today's Attendance</div>
            <div class="stat-val color-green">94%</div>
            <div class="stat-sub">Class VIII-B</div>
          </div>
        </div>

        <div class="split-layout">
          <div class="layout-main">
            <div class="content-card">
              <div class="card-header">
                <h3>Today's Teaching Schedule</h3>
                <button class="link-btn" onclick="TeacherPortal.switchTab('timetable')">Full Timetable →</button>
              </div>
              <div class="period-list">
                <div class="period-item">
                  <div class="period-time"><strong>Period 1</strong><span>08:30–09:10</span></div>
                  <div class="period-info">
                    <div class="period-icon">📐</div>
                    <div>
                      <div class="period-title">Mathematics • Linear Equations</div>
                      <div class="period-teacher">Class VIII-B • Room 4</div>
                    </div>
                  </div>
                  <span class="tag tag-green">Current</span>
                </div>
                <div class="period-item">
                  <div class="period-time"><strong>Period 3</strong><span>09:50–10:30</span></div>
                  <div class="period-info">
                    <div class="period-icon">📐</div>
                    <div>
                      <div class="period-title">Mathematics • Quadratic Equations</div>
                      <div class="period-teacher">Class IX-A • Room 2</div>
                    </div>
                  </div>
                  <span class="tag tag-blue">Scheduled</span>
                </div>
                <div class="period-item">
                  <div class="period-time"><strong>Period 5</strong><span>11:00–11:40</span></div>
                  <div class="period-info">
                    <div class="period-icon">📐</div>
                    <div>
                      <div class="period-title">Mathematics • Geometry Proofs</div>
                      <div class="period-teacher">Class VIII-A • Room 3</div>
                    </div>
                  </div>
                  <span class="tag tag-blue">Scheduled</span>
                </div>
              </div>
            </div>

            <div class="content-card" style="margin-top:16px">
              <div class="card-header">
                <h3>Submissions Awaiting Grading</h3>
                <button class="link-btn" onclick="TeacherPortal.switchTab('homework')">Review all →</button>
              </div>
              <table class="app-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Assignment</th>
                    <th>Submitted</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${pendingSubs.length ? pendingSubs.map(s => `
                    <tr>
                      <td><strong>${s.studentName}</strong></td>
                      <td>${s.subject}</td>
                      <td>${new Date(s.submittedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td>
                        <button class="btn btn-sm btn-primary" onclick="TeacherPortal.openGradeModal('${s.id}')">
                          Review & Grade
                        </button>
                      </td>
                    </tr>
                  `).join('') : `
                    <tr><td colspan="4" class="text-center muted">All submissions reviewed! 🎉</td></tr>
                  `}
                </tbody>
              </table>
            </div>
          </div>

          <div class="layout-side">
            <div class="content-card">
              <div class="card-header">
                <h3>Quick Teacher Actions</h3>
              </div>
              <div class="quick-action-stack">
                <button class="btn btn-primary btn-block" onclick="TeacherPortal.switchTab('attendance')">
                  ◷ Take Class Attendance
                </button>
                <button class="btn btn-outline btn-block" onclick="TeacherPortal.switchTab('homework')">
                  ✎ Upload Homework / PDF Notes
                </button>
                <button class="btn btn-outline btn-block" onclick="TeacherPortal.switchTab('notices')">
                  📢 Publish Class Notice
                </button>
                <button class="btn btn-outline btn-block" onclick="TeacherPortal.switchTab('students')">
                  ♙ Browse Class Student Profiles
                </button>
              </div>
            </div>

            <div class="content-card" style="margin-top:16px">
              <div class="card-header">
                <h3>Notice Board</h3>
              </div>
              <div class="feed-item">
                <div class="feed-badge">Circular</div>
                <strong>Annual Sports Day Registrations</strong>
                <p class="muted small">Please submit names of class athletes by Nov 12.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  // 2. Attendance Register
  renderAttendanceHTML(teacher) {
    const assignedClasses = (teacher.assignedClasses && teacher.assignedClasses.length) ? teacher.assignedClasses : ['Class VIII-B'];
    if (!assignedClasses.includes(this.selectedClass)) {
      this.selectedClass = assignedClasses[0];
    }
    const students = (window.appStore.data.users.students || []).filter(s => s.class === this.selectedClass);
    const dateRecords = (window.appStore.data.attendance && window.appStore.data.attendance[this.selectedDate]) || {};

    return `
      <section class="tab-pane active animate-fade">
        <div class="content-card">
          <div class="card-header">
            <div>
              <h3>Daily Attendance Register</h3>
              <p class="muted small">Live class register with instant sync to parents and administration</p>
            </div>
            <div class="toolbar-actions">
              <select class="form-control" id="teacher-attend-class" onchange="TeacherPortal.changeClass(this.value)">
                ${assignedClasses.map(c => `
                  <option value="${c}" ${c === this.selectedClass ? 'selected' : ''}>${c}</option>
                `).join('')}
              </select>
              <input type="date" class="form-control" id="teacher-attend-date" value="${this.selectedDate}" onchange="TeacherPortal.changeDate(this.value)">
            </div>
          </div>

          <div class="toolbar-bar">
            <button class="btn btn-sm btn-outline-success" onclick="TeacherPortal.markAll('Present')">✅ Mark All Present</button>
            <button class="btn btn-sm btn-outline-danger" onclick="TeacherPortal.markAll('Absent')">❌ Mark All Absent</button>
            <span class="muted small" style="margin-left:auto">Click on status badge to toggle Present / Absent / Leave</span>
          </div>

          <table class="app-table">
            <thead>
              <tr>
                <th style="width:70px">Roll</th>
                <th>Student Name</th>
                <th>Parent Contact</th>
                <th>Status for ${this.selectedDate}</th>
                <th style="text-align:right">Action</th>
              </tr>
            </thead>
            <tbody>
              ${students.length === 0 ? `
                <tr><td colspan="5" class="text-center muted" style="padding:30px">No students enrolled in ${this.selectedClass}. Please enroll students in the Admin Portal.</td></tr>
              ` : students.map(s => {
                const status = dateRecords[s.id] || 'Present';
                let tagCls = 'tag-green';
                if (status === 'Absent') tagCls = 'tag-red';
                if (status === 'Leave') tagCls = 'tag-amber';

                return `
                  <tr id="attend-row-${s.id}">
                    <td><strong>${s.roll}</strong></td>
                    <td>
                      <div class="student-mini-cell">
                        <span>${s.avatar || '🧑‍🎓'}</span>
                        <div>
                          <strong>${s.name}</strong>
                          <div class="muted small">${s.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>${s.parentName} (${s.parentPhone})</td>
                    <td>
                      <span class="tag ${tagCls} cursor-pointer" onclick="TeacherPortal.cycleStatus('${s.id}')" id="status-tag-${s.id}">
                        ${status}
                      </span>
                    </td>
                    <td style="text-align:right">
                      <button class="btn btn-sm btn-outline" onclick="TeacherPortal.cycleStatus('${s.id}')">Toggle</button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div class="form-footer-actions">
            <button class="btn btn-primary" onclick="TeacherPortal.saveAttendanceRegister()">
              💾 Save & Sync Attendance
            </button>
          </div>
        </div>
      </section>
    `;
  },

  changeClass(cls) {
    this.selectedClass = cls;
    const contentEl = document.getElementById('teacher-tab-content');
    contentEl.innerHTML = this.getTabHTML('attendance', window.appStore.getActiveTeacher());
  },

  changeDate(date) {
    this.selectedDate = date;
    const contentEl = document.getElementById('teacher-tab-content');
    contentEl.innerHTML = this.getTabHTML('attendance', window.appStore.getActiveTeacher());
  },

  cycleStatus(studentId) {
    const tag = document.getElementById(`status-tag-${studentId}`);
    if (!tag) return;

    const current = tag.textContent.trim();
    let next = 'Present';
    let cls = 'tag-green';

    if (current === 'Present') {
      next = 'Absent';
      cls = 'tag-red';
    } else if (current === 'Absent') {
      next = 'Leave';
      cls = 'tag-amber';
    } else {
      next = 'Present';
      cls = 'tag-green';
    }

    tag.textContent = next;
    tag.className = `tag ${cls} cursor-pointer`;
  },

  markAll(status) {
    const students = window.appStore.data.users.students.filter(s => s.class === this.selectedClass);
    students.forEach(s => {
      const tag = document.getElementById(`status-tag-${s.id}`);
      if (tag) {
        tag.textContent = status;
        tag.className = `tag ${status === 'Present' ? 'tag-green' : 'tag-red'} cursor-pointer`;
      }
    });
    toast.info(`Marked all students as ${status}. Remember to click Save.`);
  },

  saveAttendanceRegister() {
    const students = window.appStore.data.users.students.filter(s => s.class === this.selectedClass);
    const records = {};

    students.forEach(s => {
      const tag = document.getElementById(`status-tag-${s.id}`);
      if (tag) {
        records[s.id] = tag.textContent.trim();
      }
    });

    window.appStore.saveBulkAttendance(this.selectedDate, records);
    toast.success(`Attendance for ${this.selectedClass} on ${this.selectedDate} saved!`);
  },

  // 3. Homework & Submissions
  renderHomeworkHTML(teacher) {
    const submissions = window.appStore.data.submissions;
    const homeworkList = window.appStore.data.homework.filter(h => h.teacher === teacher.name);

    return `
      <section class="tab-pane active animate-fade">
        <div class="content-card">
          <div class="card-header">
            <div>
              <h3>Publish New Homework or PDF Study Notes</h3>
              <p class="muted small">Assignments are immediately dispatched to students' portals</p>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Target Class:</label>
              <select class="form-control" id="new-hw-class">
                ${teacher.assignedClasses.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Subject:</label>
              <select class="form-control" id="new-hw-subject">
                <option value="${teacher.subject}">${teacher.subject}</option>
                <option value="Mathematics">Mathematics</option>
                <option value="General Science">General Science</option>
              </select>
            </div>

            <div class="form-group" style="grid-column: span 2">
              <label class="form-label">Assignment Title:</label>
              <input type="text" class="form-control" id="new-hw-title" placeholder="E.g. Chapter 4: Linear Equations Practice Set">
            </div>

            <div class="form-group">
              <label class="form-label">Due Date:</label>
              <input type="date" class="form-control" id="new-hw-duedate" value="2026-11-15">
            </div>

            <div class="form-group">
              <label class="form-label">Attach PDF / Notes File:</label>
              <input type="file" class="form-control" id="new-hw-file" accept=".pdf,.doc,.docx,.png,.jpg">
            </div>

            <div class="form-group" style="grid-column: span 2">
              <label class="form-label">Instructions / Task Details:</label>
              <textarea class="form-control" id="new-hw-desc" rows="3" placeholder="Provide problem numbers, instructions, and grading criteria..."></textarea>
            </div>
          </div>

          <div class="form-footer-actions">
            <button class="btn btn-primary" onclick="TeacherPortal.publishHomework()">
              📢 Publish to Students
            </button>
          </div>
        </div>

        <div class="content-card" style="margin-top:16px">
          <div class="card-header">
            <h3>Student Submissions for Review</h3>
          </div>
          <table class="app-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Subject</th>
                <th>Submitted File</th>
                <th>Status</th>
                <th>Score / Grade</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${submissions.map(s => `
                <tr>
                  <td><strong>${s.studentName}</strong></td>
                  <td>${s.subject}</td>
                  <td>📄 ${s.fileName} <span class="muted small">(${s.fileSize})</span></td>
                  <td>
                    <span class="tag ${s.status === 'Reviewed' ? 'tag-green' : 'tag-amber'}">
                      ${s.status}
                    </span>
                  </td>
                  <td><strong>${s.grade || '—'}</strong></td>
                  <td>
                    <button class="btn btn-sm btn-outline" onclick="TeacherPortal.openGradeModal('${s.id}')">
                      ${s.status === 'Reviewed' ? 'Edit Grade' : 'Grade & Feedback'}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="content-card" style="margin-top:16px">
          <div class="card-header">
            <h3>My Active Uploads</h3>
          </div>
          <div class="homework-list">
            ${homeworkList.map(h => `
              <div class="hw-mini-item">
                <div class="hw-mini-left">
                  <span class="tag tag-blue">${h.class}</span>
                  <strong>${h.title}</strong>
                  <div class="muted small">Due: ${h.dueDate} • File: ${h.attachmentName} (${h.attachmentSize})</div>
                </div>
                <span class="tag tag-green">Published</span>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  },

  publishHomework() {
    const title = document.getElementById('new-hw-title').value.trim();
    const targetClass = document.getElementById('new-hw-class').value;
    const subject = document.getElementById('new-hw-subject').value;
    const dueDate = document.getElementById('new-hw-duedate').value;
    const desc = document.getElementById('new-hw-desc').value.trim();
    const fileInput = document.getElementById('new-hw-file');

    if (!title) {
      toast.error('Please enter an assignment title.');
      return;
    }

    let attachmentName = 'Assignment_Worksheet.pdf';
    let attachmentSize = '620 KB';

    if (fileInput.files && fileInput.files[0]) {
      attachmentName = fileInput.files[0].name;
      attachmentSize = Math.round(fileInput.files[0].size / 1024) + ' KB';
    }

    window.appStore.addHomework({
      title,
      subject,
      targetClass,
      dueDate,
      description: desc || 'Complete the attached assignment by the due date.',
      attachmentName,
      attachmentSize
    });

    toast.success(`Homework "${title}" published to ${targetClass}!`);
    const contentEl = document.getElementById('teacher-tab-content');
    contentEl.innerHTML = this.getTabHTML('homework', window.appStore.getActiveTeacher());
  },

  openGradeModal(submissionId) {
    const sub = window.appStore.data.submissions.find(s => s.id === submissionId);
    if (!sub) return;

    appModal.open(`
      <div class="modal-inner">
        <h3>📝 Review & Grade Submission</h3>
        <p class="muted small">Student: <strong>${sub.studentName}</strong> • ${sub.subject}</p>

        <div class="submission-file-box">
          <div style="font-size:32px">📄</div>
          <div>
            <strong>${sub.fileName}</strong>
            <div class="muted small">${sub.fileSize} • Submitted: ${new Date(sub.submittedDate).toLocaleString()}</div>
            ${sub.comment ? `<p class="muted small" style="margin:4px 0 0">"${sub.comment}"</p>` : ''}
          </div>
        </div>

        <div class="form-grid" style="margin:14px 0">
          <div class="form-group">
            <label class="form-label">Grade / Score:</label>
            <input type="text" id="grade-input" class="form-control" value="${sub.grade || 'A'}" placeholder="E.g. A+, A, 95/100">
          </div>
          <div class="form-group">
            <label class="form-label">Status:</label>
            <select class="form-control" id="grade-status">
              <option value="Reviewed">Reviewed & Graded</option>
              <option value="Resubmit Requested">Needs Revision</option>
            </select>
          </div>
          <div class="form-group" style="grid-column: span 2">
            <label class="form-label">Feedback / Remarks to Student:</label>
            <textarea id="feedback-input" class="form-control" rows="3" placeholder="Provide constructive comments...">${sub.feedback || 'Good work. Clean solution steps.'}</textarea>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="appModal.close()">Cancel</button>
          <button class="btn btn-primary" onclick="TeacherPortal.saveGrade('${submissionId}')">Save Grade & Feedback</button>
        </div>
      </div>
    `);
  },

  saveGrade(submissionId) {
    const grade = document.getElementById('grade-input').value.trim();
    const feedback = document.getElementById('feedback-input').value.trim();

    window.appStore.gradeSubmission(submissionId, grade, feedback);
    appModal.close();
    toast.success('Grade and feedback saved! Reflected in student portal.');
    const contentEl = document.getElementById('teacher-tab-content');
    contentEl.innerHTML = this.getTabHTML('homework', window.appStore.getActiveTeacher());
  },

  // 4. Timetable
  renderTimetableHTML(teacher) {
    return `
      <section class="tab-pane active animate-fade">
        <div class="content-card">
          <div class="card-header">
            <div>
              <h3>Teaching Timetable: ${teacher.name}</h3>
              <p class="muted small">Department of ${teacher.subject}</p>
            </div>
          </div>

          <table class="app-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Time</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Room</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><strong>Monday</strong></td><td>08:30–09:10</td><td><span class="tag tag-blue">VIII-B</span></td><td>Mathematics</td><td>Room 4</td></tr>
              <tr><td><strong>Monday</strong></td><td>09:50–10:30</td><td><span class="tag tag-blue">IX-A</span></td><td>Mathematics</td><td>Room 2</td></tr>
              <tr><td><strong>Monday</strong></td><td>11:00–11:40</td><td><span class="tag tag-blue">VIII-A</span></td><td>Mathematics</td><td>Room 3</td></tr>
              <tr><td><strong>Tuesday</strong></td><td>09:10–09:50</td><td><span class="tag tag-blue">VIII-A</span></td><td>Mathematics</td><td>Room 3</td></tr>
              <tr><td><strong>Tuesday</strong></td><td>11:40–12:20</td><td><span class="tag tag-blue">VIII-B</span></td><td>Mathematics</td><td>Room 4</td></tr>
              <tr><td><strong>Wednesday</strong></td><td>08:30–09:10</td><td><span class="tag tag-blue">IX-A</span></td><td>Mathematics</td><td>Room 2</td></tr>
              <tr><td><strong>Thursday</strong></td><td>10:00–10:40</td><td><span class="tag tag-blue">VIII-B</span></td><td>Mathematics</td><td>Room 4</td></tr>
              <tr><td><strong>Friday</strong></td><td>08:30–09:10</td><td><span class="tag tag-blue">VIII-B</span></td><td>Mathematics</td><td>Room 4</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    `;
  },

  // 5. Students Directory
  renderStudentsHTML(teacher) {
    const students = window.appStore.data.users.students.filter(s => s.class === 'Class VIII-B');

    return `
      <section class="tab-pane active animate-fade">
        <div class="content-card">
          <div class="card-header">
            <div>
              <h3>My Class Roster: Class VIII-B</h3>
              <p class="muted small">Class Teacher: ${teacher.name} • 32 Students Enrolled</p>
            </div>
            <div class="toolbar-actions">
              <input type="text" class="form-control" id="teacher-student-search" placeholder="Search student name or roll..." oninput="TeacherPortal.filterStudents(this.value)">
            </div>
          </div>

          <table class="app-table" id="teacher-students-table">
            <thead>
              <tr>
                <th>Roll</th>
                <th>Student</th>
                <th>Parent Name</th>
                <th>Attendance</th>
                <th>Admit Eligibility</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${students.map(s => {
                const fee = window.appStore.data.fees[s.id];
                const isEligible = fee && fee.due <= 0;
                return `
                  <tr class="student-search-row">
                    <td><strong>${s.roll}</strong></td>
                    <td>
                      <div class="student-mini-cell">
                        <span>${s.avatar}</span>
                        <div>
                          <strong>${s.name}</strong>
                          <div class="muted small">${s.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>${s.parentName} (${s.parentPhone})</td>
                    <td><span class="tag tag-green">${s.attendanceRate}%</span></td>
                    <td>
                      <span class="tag ${isEligible ? 'tag-green' : 'tag-red'}">${isEligible ? 'Eligible' : 'Fee Pending'}</span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-outline" onclick="TeacherPortal.viewStudentProfile('${s.id}')">View Details</button>
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

  filterStudents(query) {
    const q = query.toLowerCase();
    document.querySelectorAll('.student-search-row').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  },

  viewStudentProfile(studentId) {
    const student = window.appStore.data.users.students.find(s => s.id === studentId);
    if (!student) return;

    appModal.open(`
      <div class="modal-inner">
        <div class="profile-header-card">
          <div class="profile-avatar-large">${student.avatar}</div>
          <div class="profile-meta">
            <h3>${student.name}</h3>
            <div class="muted small">${student.id} • ${student.class} • Roll: ${student.roll}</div>
            <span class="tag tag-green" style="margin-top:6px">Attendance: ${student.attendanceRate}%</span>
          </div>
        </div>

        <div class="info-grid" style="margin:14px 0">
          <div class="info-cell">
            <span class="muted small">Parent Name</span>
            <strong>${student.parentName}</strong>
          </div>
          <div class="info-cell">
            <span class="muted small">Contact Phone</span>
            <strong>${student.parentPhone}</strong>
          </div>
          <div class="info-cell">
            <span class="muted small">Date of Birth</span>
            <strong>${student.dob}</strong>
          </div>
          <div class="info-cell">
            <span class="muted small">Blood Group</span>
            <strong>${student.bloodGroup}</strong>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="appModal.close()">Close</button>
          <button class="btn btn-primary" onclick="appModal.close(); TeacherPortal.switchTab('attendance');">
            View Attendance Register
          </button>
        </div>
      </div>
    `);
  },

  // 6. Notices
  renderNoticesHTML(teacher) {
    return `
      <section class="tab-pane active animate-fade">
        <div class="content-card">
          <div class="card-header">
            <div>
              <h3>Publish Class Notice</h3>
              <p class="muted small">Post homework updates, reminder circulars, or test dates</p>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Audience:</label>
              <select class="form-control" id="teacher-notice-audience">
                <option value="Class VIII-B">Class VIII-B (My Class)</option>
                <option value="Class VIII-A">Class VIII-A</option>
                <option value="Class IX-A">Class IX-A</option>
                <option value="Whole school">Whole School</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Category:</label>
              <select class="form-control" id="teacher-notice-cat">
                <option value="Class Notice">Class Notice</option>
                <option value="Urgent">Urgent</option>
                <option value="Event">Event</option>
              </select>
            </div>

            <div class="form-group" style="grid-column: span 2">
              <label class="form-label">Notice Title:</label>
              <input type="text" class="form-control" id="teacher-notice-title" placeholder="E.g. Mathematics Formula Quiz Tomorrow">
            </div>

            <div class="form-group" style="grid-column: span 2">
              <label class="form-label">Notice Content:</label>
              <textarea class="form-control" id="teacher-notice-body" rows="4" placeholder="Write announcement..."></textarea>
            </div>
          </div>

          <div class="form-footer-actions">
            <button class="btn btn-primary" onclick="TeacherPortal.publishNotice()">
              📢 Publish Notice
            </button>
          </div>
        </div>
      </section>
    `;
  },

  publishNotice() {
    const title = document.getElementById('teacher-notice-title').value.trim();
    const audience = document.getElementById('teacher-notice-audience').value;
    const cat = document.getElementById('teacher-notice-cat').value;
    const content = document.getElementById('teacher-notice-body').value.trim();

    if (!title || !content) {
      toast.error('Please enter notice title and body.');
      return;
    }

    const teacher = window.appStore.getActiveTeacher();
    window.appStore.addNotice({
      title,
      audience,
      category: cat,
      content,
      author: teacher.name
    });

    toast.success(`Class notice published to ${audience}!`);
    document.getElementById('teacher-notice-title').value = '';
    document.getElementById('teacher-notice-body').value = '';
  },

  // 7. Messages
  renderMessagesHTML(teacher) {
    const msgs = window.appStore.data.messages;

    return `
      <section class="tab-pane active animate-fade">
        <div class="content-card">
          <div class="card-header">
            <div>
              <h3>Communication Inbox</h3>
              <p class="muted small">Direct messages with parents and administrative office</p>
            </div>
          </div>

          <div class="messages-stream">
            ${msgs.map(m => `
              <div class="message-bubble ${m.senderRole === 'teacher' ? 'outgoing' : 'incoming'}">
                <div class="msg-header">
                  <strong>${m.sender}</strong>
                  <span class="muted small">${m.date}</span>
                </div>
                <div class="msg-body">${m.text}</div>
              </div>
            `).join('')}
          </div>

          <div class="message-composer">
            <textarea class="form-control" id="teacher-reply-text" rows="2" placeholder="Write reply to school office or parent..."></textarea>
            <button class="btn btn-primary" style="margin-top:8px" onclick="TeacherPortal.sendReply()">
              ✉ Send Message
            </button>
          </div>
        </div>
      </section>
    `;
  },

  sendReply() {
    const text = document.getElementById('teacher-reply-text').value.trim();
    if (!text) return;

    window.appStore.sendMessage({
      recipientId: 'ADM-001',
      recipientName: 'School Office',
      text
    });

    toast.success('Message sent!');
    const contentEl = document.getElementById('teacher-tab-content');
    contentEl.innerHTML = this.getTabHTML('messages', window.appStore.getActiveTeacher());
  },

  attachEvents(container, teacher) {}
};
