/**
 * SchoolHub - Student & Parent Portal Controller
 */

window.StudentPortal = {
  activeTab: 'home',

  render(container) {
    const student = window.appStore.getActiveStudent();
    const feeObj = window.appStore.data.fees[student.id] || { total: 0, paid: 0, due: 0, items: [], paymentHistory: [] };

    container.innerHTML = `
      <div class="portal-student">
        <header class="topbar">
          <div>
            <div class="crumb">SchoolHub / Student & Parent Portal</div>
            <h1 id="student-page-title">${this.getPageTitle(this.activeTab)}</h1>
          </div>
          <div class="top-actions">
            <button class="pill" id="btn-notifications" title="Notifications">
              🔔 <span class="badge-count">${window.appStore.data.notices.length}</span>
            </button>
            <div class="user-chip" id="student-user-chip" title="Active Student">
              <div class="avatar">${student.avatar}</div>
              <div class="chip-info">
                <strong>${student.name.split(' ')[0]}</strong>
                <span class="muted">${student.class}</span>
              </div>
            </div>
          </div>
        </header>

        <!-- Sub-pages container -->
        <div id="student-tab-content">
          ${this.getTabHTML(this.activeTab, student, feeObj)}
        </div>
      </div>
    `;

    this.attachEvents(container, student, feeObj);
  },

  getPageTitle(tab) {
    const titles = {
      home: 'Dashboard',
      timetable: 'Class Timetable',
      attendance: 'Attendance Record',
      homework: 'Homework & Study Materials',
      results: 'Academic Examination Results',
      fees: 'Fee Management & Receipts',
      notices: 'Notices & Circulars',
      profile: 'My Profile & Wards',
      services: 'School Services & Requests'
    };
    return titles[tab] || 'Student Portal';
  },

  getTabHTML(tab, student, feeObj) {
    switch (tab) {
      case 'home': return this.renderDashboardHTML(student, feeObj);
      case 'timetable': return this.renderTimetableHTML(student);
      case 'attendance': return this.renderAttendanceHTML(student);
      case 'homework': return this.renderHomeworkHTML(student);
      case 'results': return this.renderResultsHTML(student);
      case 'fees': return this.renderFeesHTML(student, feeObj);
      case 'notices': return this.renderNoticesHTML(student);
      case 'profile': return this.renderProfileHTML(student);
      case 'services': return this.renderServicesHTML(student);
      default: return this.renderDashboardHTML(student, feeObj);
    }
  },

  switchTab(tab) {
    this.activeTab = tab;
    const titleEl = document.getElementById('student-page-title');
    if (titleEl) titleEl.textContent = this.getPageTitle(tab);

    const contentEl = document.getElementById('student-tab-content');
    if (contentEl) {
      const student = window.appStore.getActiveStudent();
      const feeObj = window.appStore.data.fees[student.id] || { total: 0, paid: 0, due: 0, items: [], paymentHistory: [] };
      contentEl.innerHTML = this.getTabHTML(tab, student, feeObj);
      this.attachEvents(document.querySelector('.portal-student'), student, feeObj);
    }

    // Update bottom nav & sidebar active states
    document.querySelectorAll('[data-student-tab]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.studentTab === tab);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // 1. Dashboard Tab
  renderDashboardHTML(student, feeObj) {
    const isFeeDue = feeObj.due > 0;
    const pendingHwCount = window.appStore.data.homework.filter(h => h.class === student.class).length;

    return `
      <section class="tab-pane active animate-fade">
        <div class="welcome-card">
          <div class="welcome-text">
            <h2>Welcome back, ${student.name.split(' ')[0]}! 👋</h2>
            <p>Here is your daily learning overview for today. Keep up the great effort!</p>
          </div>
          <div class="student-tag">
            <span>${student.id}</span> • <strong>${student.class}</strong>
          </div>
        </div>

        <div class="quick-nav-strip">
          <button class="quick-btn" onclick="StudentPortal.switchTab('timetable')">
            <span class="q-icon">🗓️</span>
            <span>Timetable</span>
          </button>
          <button class="quick-btn" onclick="StudentPortal.switchTab('attendance')">
            <span class="q-icon">📊</span>
            <span>Attendance</span>
          </button>
          <button class="quick-btn" onclick="StudentPortal.switchTab('homework')">
            <span class="q-icon">📚</span>
            <span>Homework</span>
          </button>
          <button class="quick-btn" onclick="StudentPortal.switchTab('fees')">
            <span class="q-icon">💳</span>
            <span>Fees</span>
          </button>
          <button class="quick-btn" onclick="StudentPortal.switchTab('notices')">
            <span class="q-icon">📢</span>
            <span>Notices</span>
          </button>
        </div>

        ${isFeeDue ? `
          <div class="alert-banner warning">
            <div class="alert-icon">⚠️</div>
            <div class="alert-body">
              <strong>Fee payment reminder · ₹${feeObj.due.toLocaleString('en-IN')} pending</strong>
              <p>Please clear term dues to unlock your official Unit Test Examination Admit Card.</p>
            </div>
            <button class="btn btn-sm btn-primary" onclick="StudentPortal.openPayModal('${student.id}', ${feeObj.due})">Pay Now</button>
          </div>
        ` : `
          <div class="alert-banner success">
            <div class="alert-icon">🎉</div>
            <div class="alert-body">
              <strong>All term fees are cleared!</strong>
              <p>Your examination admit card (hall ticket) is generated and eligible for download.</p>
            </div>
            <button class="btn btn-sm btn-outline-success" onclick="docPrinter.printAdmitCard(window.appStore.getActiveStudent())">View Hall Ticket</button>
          </div>
        `}

        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-label">Attendance Rate</div>
            <div class="stat-val color-green">${student.attendanceRate}%</div>
            <div class="stat-sub"><span class="status-dot green"></span> Regular in class</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Homework Assigned</div>
            <div class="stat-val color-blue">${pendingHwCount}</div>
            <div class="stat-sub">Active worksheets</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Upcoming Exam</div>
            <div class="stat-val" style="font-size:19px">Unit Test 2</div>
            <div class="stat-sub">Starts 24 Nov 2026</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Library Books</div>
            <div class="stat-val color-amber">1</div>
            <div class="stat-sub">Due 12 Nov (Hawking)</div>
          </div>
        </div>

        <div class="split-layout">
          <!-- Left Column -->
          <div class="layout-main">
            <div class="content-card">
              <div class="card-header">
                <h3>Today's Timetable</h3>
                <button class="link-btn" onclick="StudentPortal.switchTab('timetable')">Full Timetable →</button>
              </div>
              <div class="period-list">
                ${window.appStore.data.periods.slice(0, 5).map((p, i) => `
                  <div class="period-item ${p.isBreak ? 'is-break' : ''}">
                    <div class="period-time">
                      <strong>Period ${p.period}</strong>
                      <span>${p.time}</span>
                    </div>
                    <div class="period-info">
                      <div class="period-icon">${p.icon}</div>
                      <div>
                        <div class="period-title">${p.subject}</div>
                        <div class="period-teacher">${p.teacher} • ${p.room}</div>
                      </div>
                    </div>
                    <div>
                      <span class="tag ${p.isBreak ? 'tag-amber' : 'tag-green'}">${p.isBreak ? 'Recess' : 'Scheduled'}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="content-card" style="margin-top:16px">
              <div class="card-header">
                <h3>Active Homework & Worksheets</h3>
                <button class="link-btn" onclick="StudentPortal.switchTab('homework')">View all →</button>
              </div>
              ${this.renderRecentHomeworkPreview(student)}
            </div>
          </div>

          <!-- Right Column -->
          <div class="layout-side">
            <div class="content-card">
              <div class="card-header">
                <h3>School Announcements</h3>
                <button class="link-btn" onclick="StudentPortal.switchTab('notices')">All Notices →</button>
              </div>
              <div class="updates-feed">
                ${window.appStore.data.notices.slice(0, 2).map(n => `
                  <div class="feed-item">
                    <div class="feed-badge">${n.category}</div>
                    <strong>${n.title}</strong>
                    <div class="muted small">${n.date} • ${n.author}</div>
                    <p class="feed-desc">${n.content.slice(0, 100)}...</p>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="content-card" style="margin-top:16px">
              <div class="card-header">
                <h3>Class Teacher</h3>
              </div>
              <div class="teacher-quick-box">
                <div class="teacher-avatar">👨‍🏫</div>
                <div>
                  <strong>${student.classTeacher}</strong>
                  <div class="muted small">Mathematics Teacher</div>
                  <div class="muted small">Room: ${student.room}</div>
                </div>
              </div>
              <button class="btn btn-secondary btn-block" style="margin-top:12px" onclick="StudentPortal.openTeacherMessageModal()">
                ✉ Message Class Teacher
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  renderRecentHomeworkPreview(student) {
    const list = window.appStore.data.homework.filter(h => h.class === student.class);
    if (!list.length) return `<div class="empty-state">No homework assigned.</div>`;

    return list.slice(0, 2).map(h => {
      const submission = window.appStore.data.submissions.find(s => s.homeworkId === h.id && s.studentId === student.id);
      return `
        <div class="homework-card">
          <div class="hw-top">
            <div>
              <span class="tag tag-blue">${h.subject}</span>
              <h4 style="margin:6px 0 2px">${h.title}</h4>
              <div class="muted small">By ${h.teacher} • Due: <strong>${h.dueDate}</strong></div>
            </div>
            <div>
              ${submission ? `
                <span class="tag ${submission.status === 'Reviewed' ? 'tag-green' : 'tag-amber'}">
                  ${submission.status === 'Reviewed' ? `Graded: ${submission.grade}` : 'Submitted'}
                </span>
              ` : `
                <span class="tag tag-red">Pending</span>
              `}
            </div>
          </div>
          <div class="attachment-pill">
            <span>📄 ${h.attachmentName}</span>
            <button class="btn-text" onclick="StudentPortal.viewAttachment('${h.id}')">View / Download</button>
          </div>
          <div class="hw-actions">
            ${submission ? `
              <div class="muted small">Submitted on ${new Date(submission.submittedDate).toLocaleDateString()} (${submission.fileName})</div>
            ` : `
              <button class="btn btn-sm btn-primary" onclick="StudentPortal.openSubmitHomeworkModal('${h.id}')">
                📤 Submit Assignment
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');
  },

  // 2. Timetable Tab
  renderTimetableHTML(student) {
    return `
      <section class="tab-pane active animate-fade">
        <div class="content-card">
          <div class="card-header">
            <div>
              <h3>Weekly Schedule: ${student.class}</h3>
              <p class="muted small">Academic Year ${student.academicYear || '2026–27'} • Room ${student.room}</p>
            </div>
            <div class="toolbar-actions">
              <select class="form-control" id="timetable-day-select" onchange="toast.info('Viewing ' + this.value)">
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
              </select>
            </div>
          </div>

          <div class="period-list detailed">
            ${window.appStore.data.periods.map(p => `
              <div class="period-item ${p.isBreak ? 'is-break' : ''}">
                <div class="period-time">
                  <strong>Period ${p.period}</strong>
                  <span>${p.time}</span>
                </div>
                <div class="period-info">
                  <div class="period-icon">${p.icon}</div>
                  <div>
                    <div class="period-title">${p.subject}</div>
                    <div class="period-teacher">${p.teacher} • <strong>${p.room}</strong></div>
                  </div>
                </div>
                <div>
                  <span class="tag ${p.isBreak ? 'tag-amber' : 'tag-green'}">${p.isBreak ? '30 Mins Recess' : 'Active Period'}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  },

  // 3. Attendance Tab
  renderAttendanceHTML(student) {
    const records = window.appStore.data.attendance;
    let presentCount = 0;
    let absentCount = 0;
    let leaveCount = 0;

    Object.keys(records).forEach(date => {
      const status = records[date][student.id];
      if (status === 'Present') presentCount++;
      if (status === 'Absent') absentCount++;
      if (status === 'Leave') leaveCount++;
    });

    const totalMarked = presentCount + absentCount + leaveCount;
    const rate = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 92;

    return `
      <section class="tab-pane active animate-fade">
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-label">Monthly Rate</div>
            <div class="stat-val color-green">${rate}%</div>
            <div class="stat-sub">${presentCount} of ${totalMarked || 25} marked days</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Present</div>
            <div class="stat-val color-green">${presentCount || 23}</div>
            <div class="stat-sub">Full school days</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Absent</div>
            <div class="stat-val color-red">${absentCount || 1}</div>
            <div class="stat-sub">Unplanned absence</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Approved Leave</div>
            <div class="stat-val color-amber">${leaveCount || 1}</div>
            <div class="stat-sub">Medical / Prior Leave</div>
          </div>
        </div>

        <div class="content-card" style="margin-top:16px">
          <div class="card-header">
            <div>
              <h3>November 2026 Attendance Calendar</h3>
              <p class="muted small">Tap on any marked day to view attendance records</p>
            </div>
            <div class="calendar-legend">
              <span class="legend-item"><span class="legend-box green"></span> Present</span>
              <span class="legend-item"><span class="legend-box red"></span> Absent</span>
              <span class="legend-item"><span class="legend-box amber"></span> Leave</span>
            </div>
          </div>

          <div class="calendar-grid">
            <div class="cal-day head">Mon</div>
            <div class="cal-day head">Tue</div>
            <div class="cal-day head">Wed</div>
            <div class="cal-day head">Thu</div>
            <div class="cal-day head">Fri</div>
            <div class="cal-day head">Sat</div>
            <div class="cal-day head">Sun</div>

            ${this.buildCalendarDays(student)}
          </div>
        </div>

        <div class="content-card" style="margin-top:16px">
          <div class="card-header">
            <h3>Need to take a day off?</h3>
          </div>
          <p class="muted">Submit an official leave request directly to the school principal and class teacher.</p>
          <button class="btn btn-primary" onclick="StudentPortal.openLeaveModal()">Apply for Leave</button>
        </div>
      </section>
    `;
  },

  buildCalendarDays(student) {
    let html = '';
    // Nov 2026 starts on Sunday (or 6 empty cells if Monday-first)
    for (let empty = 0; empty < 6; empty++) {
      html += `<div class="cal-day empty"></div>`;
    }

    for (let day = 1; day <= 30; day++) {
      const dayStr = day < 10 ? '0' + day : '' + day;
      const dateKey = `2026-11-${dayStr}`;
      const status = window.appStore.data.attendance[dateKey] ? window.appStore.data.attendance[dateKey][student.id] : null;

      let cls = '';
      if (status === 'Present') cls = 'present';
      else if (status === 'Absent') cls = 'absent';
      else if (status === 'Leave') cls = 'leave';
      else if (day > 9) cls = 'future';

      html += `
        <div class="cal-day ${cls}" onclick="StudentPortal.onDayClick('${dateKey}', '${status || 'Upcoming'}')">
          <span class="day-num">${day}</span>
          ${status ? `<span class="day-badge">${status[0]}</span>` : ''}
        </div>
      `;
    }
    return html;
  },

  onDayClick(date, status) {
    toast.info(`${date}: Marked as ${status}`);
  },

  // 4. Homework Tab
  renderHomeworkHTML(student) {
    const homeworkList = window.appStore.data.homework.filter(h => h.class === student.class);

    return `
      <section class="tab-pane active animate-fade">
        <div class="content-card">
          <div class="card-header">
            <div>
              <h3>Homework & PDF Notes</h3>
              <p class="muted small">Download lesson materials and upload completed tasks</p>
            </div>
            <div class="toolbar-actions">
              <select class="form-control" id="hw-subject-filter" onchange="StudentPortal.filterHomework()">
                <option value="ALL">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="General Science">General Science</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>

          <div id="homework-items-wrapper">
            ${homeworkList.map(h => {
              const sub = window.appStore.data.submissions.find(s => s.homeworkId === h.id && s.studentId === student.id);
              return `
                <div class="homework-item-box" data-subject="${h.subject}">
                  <div class="hw-head">
                    <div>
                      <span class="tag tag-blue">${h.subject}</span>
                      <h4 style="margin:6px 0 4px">${h.title}</h4>
                      <div class="muted small">Teacher: <strong>${h.teacher}</strong> • Assigned: ${h.assignedDate} • Due: <strong class="color-red">${h.dueDate}</strong></div>
                    </div>
                    <div>
                      ${sub ? `
                        <span class="tag ${sub.status === 'Reviewed' ? 'tag-green' : 'tag-amber'}">
                          ${sub.status === 'Reviewed' ? `Graded: ${sub.grade}` : 'Submitted'}
                        </span>
                      ` : `
                        <span class="tag tag-red">Pending Submission</span>
                      `}
                    </div>
                  </div>

                  <p class="hw-desc">${h.description}</p>

                  <div class="attachment-pill">
                    <span>📄 <strong>${h.attachmentName}</strong> (${h.attachmentSize})</span>
                    <button class="btn btn-sm btn-outline" onclick="StudentPortal.viewAttachment('${h.id}')">Download / Preview</button>
                  </div>

                  <div class="submission-area">
                    ${sub ? `
                      <div class="submission-status-card">
                        <div class="sub-row">
                          <span>✅ <strong>Your Submission:</strong> ${sub.fileName} (${sub.fileSize})</span>
                          <span class="muted small">${new Date(sub.submittedDate).toLocaleString()}</span>
                        </div>
                        ${sub.comment ? `<p class="muted small" style="margin:4px 0 0">"${sub.comment}"</p>` : ''}
                        ${sub.feedback ? `
                          <div class="teacher-feedback-box">
                            <strong>Teacher Remark (${sub.grade}):</strong> ${sub.feedback}
                          </div>
                        ` : `
                          <div class="muted small" style="margin-top:6px">Awaiting teacher review & grading.</div>
                        `}
                      </div>
                    ` : `
                      <button class="btn btn-primary" onclick="StudentPortal.openSubmitHomeworkModal('${h.id}')">
                        📤 Upload & Submit Work
                      </button>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </section>
    `;
  },

  filterHomework() {
    const val = document.getElementById('hw-subject-filter').value;
    document.querySelectorAll('.homework-item-box').forEach(el => {
      if (val === 'ALL' || el.dataset.subject === val) {
        el.style.display = 'block';
      } else {
        el.style.display = 'none';
      }
    });
  },

  // 5. Results Tab
  renderResultsHTML(student) {
    const resultObj = window.appStore.data.results[student.id];

    return `
      <section class="tab-pane active animate-fade">
        <div class="content-card">
          <div class="card-header">
            <div>
              <h3>Academic Examination Results</h3>
              <p class="muted small">Session: ${student.academicYear || '2026–27'} • Class ${student.class}</p>
            </div>
          </div>

          <table class="app-table">
            <thead>
              <tr>
                <th>Examination Name</th>
                <th>Published Date</th>
                <th>Overall Result</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${resultObj && resultObj.exams ? resultObj.exams.map((exam, idx) => `
                <tr>
                  <td><strong>${exam.title}</strong></td>
                  <td>${exam.publishedDate || 'Upcoming'}</td>
                  <td>
                    ${exam.overallPercentage ? `
                      <span class="tag tag-green">${exam.overallPercentage}% (Grade ${exam.grade})</span>
                    ` : `
                      <span class="tag tag-amber">Awaiting (Starts ${exam.scheduledDate})</span>
                    `}
                  </td>
                  <td>
                    ${exam.subjects ? `
                      <button class="btn btn-sm btn-outline" onclick="StudentPortal.openExamDetailModal(${idx})">View Marks Card</button>
                    ` : `
                      <button class="btn btn-sm btn-disabled" disabled>Not Ready</button>
                    `}
                  </td>
                </tr>
              `).join('') : `
                <tr><td colspan="4" class="text-center muted">No examination published.</td></tr>
              `}
            </tbody>
          </table>
        </div>

        <div class="content-card" style="margin-top:16px">
          <div class="card-header">
            <h3>Class Teacher Progress Remarks</h3>
          </div>
          <blockquote class="teacher-quote">
            "${resultObj ? resultObj.teacherRemarks : 'Regular attendance and continuous effort in class.'}"
          </blockquote>
          <div class="muted small">— ${student.classTeacher}, Class Teacher (${student.class})</div>
        </div>
      </section>
    `;
  },

  // 6. Fees Tab
  renderFeesHTML(student, feeObj) {
    const isDue = feeObj.due > 0;

    return `
      <section class="tab-pane active animate-fade">
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-label">Total Term Fee</div>
            <div class="stat-val">₹${feeObj.total.toLocaleString('en-IN')}</div>
            <div class="stat-sub">Term 2 Academic Fee</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total Paid</div>
            <div class="stat-val color-green">₹${feeObj.paid.toLocaleString('en-IN')}</div>
            <div class="stat-sub">Verified payments</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Outstanding Due</div>
            <div class="stat-val ${isDue ? 'color-red' : 'color-green'}">₹${feeObj.due.toLocaleString('en-IN')}</div>
            <div class="stat-sub">${isDue ? 'Due by 20 Nov 2026' : 'Cleared'}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Admit Card Status</div>
            <div class="stat-val" style="font-size:18px">
              <span class="tag ${isDue ? 'tag-red' : 'tag-green'}">${feeObj.admitEligibility}</span>
            </div>
            <div class="stat-sub">${feeObj.admitEligibleReason}</div>
          </div>
        </div>

        <div class="content-card" style="margin-top:16px">
          <div class="card-header">
            <div>
              <h3>Fee Heads Breakdown</h3>
              <p class="muted small">Breakdown of curriculum, tuition, and development dues</p>
            </div>
            <div>
              ${isDue ? `
                <button class="btn btn-primary" onclick="StudentPortal.openPayModal('${student.id}', ${feeObj.due})">
                  💳 Pay Outstanding Online
                </button>
              ` : `
                <span class="tag tag-green">All Clear</span>
              `}
            </div>
          </div>

          <table class="app-table">
            <thead>
              <tr>
                <th>Fee Head</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Reference / Receipt</th>
              </tr>
            </thead>
            <tbody>
              ${feeObj.items.map(item => `
                <tr>
                  <td><strong>${item.name}</strong></td>
                  <td>₹${item.amount.toLocaleString('en-IN')}</td>
                  <td>
                    <span class="tag ${item.status === 'Paid' ? 'tag-green' : 'tag-red'}">${item.status}</span>
                  </td>
                  <td>
                    ${item.receiptNo ? `<span class="monospace">${item.receiptNo}</span>` : `<span class="muted small">Due ${item.dueDate}</span>`}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="content-card" style="margin-top:16px">
          <div class="card-header">
            <h3>Payment Transaction History & Receipts</h3>
          </div>
          <table class="app-table">
            <thead>
              <tr>
                <th>Receipt No</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${feeObj.paymentHistory.length ? feeObj.paymentHistory.map(p => `
                <tr>
                  <td><strong>${p.receiptNo}</strong></td>
                  <td>${p.date}</td>
                  <td><strong>₹${p.amount.toLocaleString('en-IN')}</strong></td>
                  <td>${p.method}</td>
                  <td>
                    <button class="btn btn-sm btn-outline" onclick="StudentPortal.printReceiptItem('${p.receiptNo}')">
                      🖨️ Print Receipt
                    </button>
                  </td>
                </tr>
              `).join('') : `
                <tr><td colspan="5" class="text-center muted">No payments recorded.</td></tr>
              `}
            </tbody>
          </table>
        </div>

        <div class="content-card" style="margin-top:16px">
          <div class="card-header">
            <h3>Examination Admit Card (Hall Ticket)</h3>
          </div>
          ${!isDue ? `
            <div class="admit-ready-card">
              <div>
                <h4>🎉 Your Admit Card is Ready!</h4>
                <p class="muted">All required term dues are paid. You may download and print the official hall ticket for Unit Test 2.</p>
              </div>
              <button class="btn btn-success" onclick="docPrinter.printAdmitCard(window.appStore.getActiveStudent())">
                🖨️ Download / Print Admit Card
              </button>
            </div>
          ` : `
            <div class="alert-banner warning">
              <div class="alert-icon">🔒</div>
              <div class="alert-body">
                <strong>Admit card locked</strong>
                <p>Please clear the pending fee balance of ₹${feeObj.due.toLocaleString('en-IN')}. If you made an offline counter payment, kindly allow the school office to verify and record the counter receipt.</p>
              </div>
              <button class="btn btn-sm btn-primary" onclick="StudentPortal.openPayModal('${student.id}', ${feeObj.due})">Clear Dues</button>
            </div>
          `}
        </div>
      </section>
    `;
  },

  // 7. Notices Tab
  renderNoticesHTML(student) {
    const list = window.appStore.data.notices;

    return `
      <section class="tab-pane active animate-fade">
        <div class="content-card">
          <div class="card-header">
            <div>
              <h3>Official Notices & Circulars</h3>
              <p class="muted small">Official communications from school management & principal</p>
            </div>
          </div>

          <div class="notices-list">
            ${list.map(n => `
              <div class="notice-card ${n.pinned ? 'is-pinned' : ''}">
                <div class="notice-head">
                  <div class="notice-category">
                    <span class="tag tag-blue">${n.category}</span>
                    ${n.pinned ? '<span class="tag tag-amber">📌 Pinned</span>' : ''}
                    <span class="tag tag-gray">${n.audience}</span>
                  </div>
                  <div class="muted small">${n.date} • ${n.author}</div>
                </div>
                <h3 class="notice-title">${n.title}</h3>
                <p class="notice-body">${n.content}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  },

  // 8. Profile & Wards Tab
  renderProfileHTML(student) {
    const allStudents = window.appStore.data.users.students;
    const siblingWards = allStudents.filter(s => s.parentName === student.parentName);

    return `
      <section class="tab-pane active animate-fade">
        <div class="content-card">
          <div class="profile-header-card">
            <div class="profile-avatar-large">${student.avatar}</div>
            <div class="profile-meta">
              <h2>${student.name}</h2>
              <div class="profile-badges">
                <span class="tag tag-blue">${student.id}</span>
                <span class="tag tag-green">${student.class} (Roll: ${student.roll})</span>
                <span class="tag tag-gray">${student.schoolName}</span>
              </div>
              <p class="muted small" style="margin-top:6px">Parent / Guardian: <strong>${student.parentName}</strong> (${student.parentPhone})</p>
            </div>
          </div>

          <hr class="divider">

          <div class="info-grid">
            <div class="info-cell">
              <span class="muted small">Date of Birth</span>
              <strong>${student.dob}</strong>
            </div>
            <div class="info-cell">
              <span class="muted small">Blood Group</span>
              <strong>${student.bloodGroup}</strong>
            </div>
            <div class="info-cell">
              <span class="muted small">Class Teacher</span>
              <strong>${student.classTeacher}</strong>
            </div>
            <div class="info-cell">
              <span class="muted small">Classroom Room</span>
              <strong>${student.room}</strong>
            </div>
            <div class="info-cell" style="grid-column: span 2">
              <span class="muted small">Residential Address</span>
              <strong>${student.address}</strong>
            </div>
          </div>
        </div>

        <div class="content-card" style="margin-top:16px">
          <div class="card-header">
            <div>
              <h3>Family / Multiple Wards Profile Switcher</h3>
              <p class="muted small">One parent login to monitor all enrolled children</p>
            </div>
          </div>

          <div class="wards-list">
            ${siblingWards.map(w => `
              <div class="ward-item ${w.id === student.id ? 'active-ward' : ''}">
                <div class="ward-avatar">${w.avatar}</div>
                <div class="ward-info">
                  <strong>${w.name}</strong>
                  <div class="muted small">${w.class} • Roll ${w.roll}</div>
                  <div class="muted small">Attendance: ${w.attendanceRate}%</div>
                </div>
                <div>
                  ${w.id === student.id ? `
                    <span class="tag tag-green">Currently Viewing</span>
                  ` : `
                    <button class="btn btn-sm btn-outline" onclick="StudentPortal.switchWard('${w.id}')">
                      Switch Profile →
                    </button>
                  `}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  },

  switchWard(wardId) {
    window.appStore.setActiveStudent(wardId);
    toast.success(`Switched active profile to ${window.appStore.getActiveStudent().name}`);
    this.render(document.getElementById('portal-root'));
  },

  // 9. Other Services Tab
  renderServicesHTML(student) {
    const libraryBooks = window.appStore.data.library.filter(b => b.studentId === student.id);
    const leaves = window.appStore.data.leaves.filter(l => l.studentId === student.id);
    const consents = window.appStore.data.consentForms.filter(c => c.studentId === student.id);

    return `
      <section class="tab-pane active animate-fade">
        <div class="services-grid">
          <!-- Library Card -->
          <div class="content-card service-box">
            <div class="service-icon">📖</div>
            <h3>Library Circulation</h3>
            <p class="muted small">Active borrowed titles and return reminders</p>
            <div class="service-details">
              ${libraryBooks.map(b => `
                <div class="mini-item">
                  <strong>${b.bookTitle}</strong>
                  <div class="muted small">Due: ${b.dueDate} • <span class="tag ${b.status === 'Borrowed' ? 'tag-amber' : 'tag-green'}">${b.status}</span></div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Leave Application Card -->
          <div class="content-card service-box">
            <div class="service-icon">📝</div>
            <h3>Leave Applications</h3>
            <p class="muted small">Apply for leave and track principal approvals</p>
            <button class="btn btn-sm btn-primary" onclick="StudentPortal.openLeaveModal()">+ Apply For Leave</button>
            <div class="service-details" style="margin-top:10px">
              ${leaves.map(l => `
                <div class="mini-item">
                  <strong>${l.fromDate} to ${l.toDate}</strong>
                  <div class="muted small">${l.reason}</div>
                  <span class="tag ${l.status === 'Approved' ? 'tag-green' : l.status === 'Rejected' ? 'tag-red' : 'tag-amber'}">${l.status}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Consent Forms Card -->
          <div class="content-card service-box">
            <div class="service-icon">☑️</div>
            <h3>Field Trip & Event Consent</h3>
            <p class="muted small">Digital parent permission for excursions & sports</p>
            <div class="service-details">
              ${consents.map(c => `
                <div class="mini-item">
                  <strong>${c.title}</strong>
                  <div class="muted small">Date: ${c.eventDate} • Destination: ${c.destination}</div>
                  <div style="margin-top:6px">
                    ${c.status === 'Approved' ? `
                      <span class="tag tag-green">Consent Recorded</span>
                    ` : `
                      <button class="btn btn-sm btn-primary" onclick="StudentPortal.openConsentModal('${c.id}')">Give Digital Consent</button>
                    `}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Contact School Card -->
          <div class="content-card service-box">
            <div class="service-icon">✉️</div>
            <h3>Contact School Office</h3>
            <p class="muted small">Direct message to principal or administrative desk</p>
            <button class="btn btn-sm btn-secondary" onclick="StudentPortal.openOfficeMessageModal()">
              Send Message
            </button>
          </div>
        </div>
      </section>
    `;
  },

  // Modals & Action Handlers
  openPayModal(studentId, defaultAmount) {
    appModal.open(`
      <div class="modal-inner">
        <h3>💳 School Fee Payment Portal</h3>
        <p class="muted small">Green Valley High School Secure Fee Gateway</p>

        <div class="payment-summary-box">
          <div class="row-between">
            <span>Student Name:</span>
            <strong>${window.appStore.getActiveStudent().name}</strong>
          </div>
          <div class="row-between">
            <span>Outstanding Due:</span>
            <strong class="color-red">₹${defaultAmount.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        <div class="form-group" style="margin:12px 0">
          <label class="form-label">Payment Amount (INR):</label>
          <input type="number" id="pay-modal-amount" class="form-control" value="${defaultAmount}">
        </div>

        <div class="form-group" style="margin:12px 0">
          <label class="form-label">Choose Payment Method:</label>
          <div class="payment-options-grid">
            <label class="pay-opt-card">
              <input type="radio" name="payMethod" value="UPI (GPay / PhonePe / Paytm)" checked>
              <span>📱 Instant UPI</span>
            </label>
            <label class="pay-opt-card">
              <input type="radio" name="payMethod" value="Debit / Credit Card">
              <span>💳 Card</span>
            </label>
            <label class="pay-opt-card">
              <input type="radio" name="payMethod" value="NetBanking">
              <span>🏦 NetBanking</span>
            </label>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="appModal.close()">Cancel</button>
          <button class="btn btn-primary" onclick="StudentPortal.processOnlinePayment('${studentId}')">
            Authorize & Pay Now
          </button>
        </div>
      </div>
    `);
  },

  processOnlinePayment(studentId) {
    const amount = Number(document.getElementById('pay-modal-amount').value);
    const selectedMethod = document.querySelector('input[name="payMethod"]:checked').value;

    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }

    const receipt = window.appStore.payFeeOnline(studentId, amount, selectedMethod);
    appModal.close();

    toast.success(`Payment of ₹${amount.toLocaleString('en-IN')} successful! Receipt #${receipt.receiptNo}`);
    this.render(document.getElementById('portal-root'));

    // Offer to print receipt immediately
    setTimeout(() => {
      const student = window.appStore.getActiveStudent();
      const feeObj = window.appStore.data.fees[studentId];
      const txn = feeObj.paymentHistory[0];
      docPrinter.printReceipt(txn, student);
    }, 600);
  },

  printReceiptItem(receiptNo) {
    const student = window.appStore.getActiveStudent();
    const feeObj = window.appStore.data.fees[student.id];
    const txn = feeObj.paymentHistory.find(p => p.receiptNo === receiptNo);
    if (txn) {
      docPrinter.printReceipt(txn, student);
    } else {
      toast.error('Receipt not found');
    }
  },

  viewAttachment(hwId) {
    const hw = window.appStore.data.homework.find(h => h.id === hwId);
    if (!hw) return;

    appModal.open(`
      <div class="modal-inner">
        <div class="row-between">
          <h3>📄 ${hw.attachmentName}</h3>
          <span class="tag tag-blue">${hw.subject}</span>
        </div>
        <div class="muted small" style="margin-bottom:12px">Uploaded by ${hw.teacher} (${hw.attachmentSize})</div>

        <div class="file-preview-canvas">
          <div style="font-size:48px;margin-bottom:10px">📑</div>
          <h4>${hw.title}</h4>
          <p style="max-width:450px;margin:10px auto;line-height:1.6;font-size:13px;color:#333;">
            ${hw.description}
          </p>
          <div class="muted small" style="margin-top:15px">Official Class Study Material • Green Valley High School</div>
        </div>

        <div class="modal-actions" style="margin-top:18px">
          <button class="btn btn-secondary" onclick="appModal.close()">Close</button>
          <button class="btn btn-primary" onclick="toast.success('Downloaded ' + '${hw.attachmentName}'); appModal.close();">
            ↓ Download PDF
          </button>
        </div>
      </div>
    `);
  },

  openSubmitHomeworkModal(hwId) {
    const hw = window.appStore.data.homework.find(h => h.id === hwId);
    if (!hw) return;

    appModal.open(`
      <div class="modal-inner">
        <h3>📤 Submit Assignment</h3>
        <p class="muted small">${hw.title} (${hw.subject}) • Due: ${hw.dueDate}</p>

        <div class="form-group" style="margin:12px 0">
          <label class="form-label">Attach File (PDF, Word, or Photo):</label>
          <input type="file" id="submit-file-input" class="form-control" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg">
          <span class="muted small">Max file size 15 MB. Camera photo uploads supported.</span>
        </div>

        <div class="form-group" style="margin:12px 0">
          <label class="form-label">Student Remarks / Questions to Teacher:</label>
          <textarea id="submit-comments" class="form-control" rows="3" placeholder="Optional notes for teacher..."></textarea>
        </div>

        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="appModal.close()">Cancel</button>
          <button class="btn btn-primary" onclick="StudentPortal.processHomeworkSubmit('${hwId}')">
            Submit Assignment
          </button>
        </div>
      </div>
    `);
  },

  processHomeworkSubmit(hwId) {
    const fileInput = document.getElementById('submit-file-input');
    const comment = document.getElementById('submit-comments').value;
    const student = window.appStore.getActiveStudent();

    let fileName = 'Assignment_' + student.name.replace(/\s+/g, '_') + '.pdf';
    let fileSize = '1.1 MB';

    if (fileInput.files && fileInput.files[0]) {
      fileName = fileInput.files[0].name;
      fileSize = Math.round(fileInput.files[0].size / 1024) + ' KB';
    }

    window.appStore.submitHomework({
      homeworkId: hwId,
      studentId: student.id,
      fileName,
      fileSize,
      comment
    });

    appModal.close();
    toast.success('Assignment submitted successfully to class teacher!');
    this.render(document.getElementById('portal-root'));
  },

  openExamDetailModal(examIndex) {
    const student = window.appStore.getActiveStudent();
    const resultObj = window.appStore.data.results[student.id];
    const exam = resultObj.exams[examIndex];

    appModal.open(`
      <div class="modal-inner">
        <div class="row-between">
          <h3>📊 ${exam.title} Marks Card</h3>
          <span class="tag tag-green">${exam.overallPercentage}% (Grade ${exam.grade})</span>
        </div>
        <p class="muted small">Candidate: ${student.name} • Class: ${student.class} • Roll: ${student.roll}</p>

        <table class="app-table" style="margin:14px 0">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks Scored</th>
              <th>Maximum</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            ${exam.subjects.map(s => `
              <tr>
                <td><strong>${s.subject}</strong></td>
                <td>${s.marks}</td>
                <td>${s.max}</td>
                <td><span class="tag tag-blue">${s.grade}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="appModal.close()">Close</button>
          <button class="btn btn-primary" onclick="toast.info('Generating PDF Report Card...'); appModal.close();">
            🖨️ Print Report Card
          </button>
        </div>
      </div>
    `);
  },

  openLeaveModal() {
    const student = window.appStore.getActiveStudent();
    appModal.open(`
      <div class="modal-inner">
        <h3>📝 Leave Application</h3>
        <p class="muted small">For ${student.name} (${student.class})</p>

        <div class="form-grid" style="margin:12px 0">
          <div class="form-group">
            <label class="form-label">From Date:</label>
            <input type="date" id="leave-from" class="form-control" value="2026-11-16">
          </div>
          <div class="form-group">
            <label class="form-label">To Date:</label>
            <input type="date" id="leave-to" class="form-control" value="2026-11-17">
          </div>
        </div>

        <div class="form-group" style="margin:12px 0">
          <label class="form-label">Reason for Absence:</label>
          <textarea id="leave-reason" class="form-control" rows="3" placeholder="Explain reason for leave..."></textarea>
        </div>

        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="appModal.close()">Cancel</button>
          <button class="btn btn-primary" onclick="StudentPortal.submitLeave()">Submit Application</button>
        </div>
      </div>
    `);
  },

  submitLeave() {
    const fromDate = document.getElementById('leave-from').value;
    const toDate = document.getElementById('leave-to').value;
    const reason = document.getElementById('leave-reason').value.trim();

    if (!reason) {
      toast.error('Please specify the reason for leave.');
      return;
    }

    const student = window.appStore.getActiveStudent();
    window.appStore.applyLeave({
      studentId: student.id,
      fromDate,
      toDate,
      reason
    });

    appModal.close();
    toast.success('Leave application submitted for school office approval.');
    this.render(document.getElementById('portal-root'));
  },

  openConsentModal(formId) {
    const form = window.appStore.data.consentForms.find(f => f.id === formId);
    appModal.open(`
      <div class="modal-inner">
        <h3>☑️ Digital Consent Form</h3>
        <p class="muted small">${form.title}</p>
        <p style="font-size:13px;line-height:1.5">
          I hereby grant permission for my ward to participate in the upcoming excursion to <strong>${form.destination}</strong> on <strong>${form.eventDate}</strong>.
        </p>
        <div class="form-group" style="margin:12px 0">
          <label class="form-label">Special instructions / Emergency contact notes:</label>
          <input type="text" id="consent-note" class="form-control" placeholder="E.g. Permitted to travel by school bus">
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="appModal.close()">Cancel</button>
          <button class="btn btn-success" onclick="StudentPortal.confirmConsent('${formId}')">
            Authorize & Submit Consent
          </button>
        </div>
      </div>
    `);
  },

  confirmConsent(formId) {
    const note = document.getElementById('consent-note').value;
    window.appStore.grantConsent(formId, note);
    appModal.close();
    toast.success('Parental consent recorded successfully.');
    this.render(document.getElementById('portal-root'));
  },

  openTeacherMessageModal() {
    const student = window.appStore.getActiveStudent();
    appModal.open(`
      <div class="modal-inner">
        <h3>✉ Message Class Teacher</h3>
        <p class="muted small">Recipient: ${student.classTeacher} (${student.class})</p>
        <div class="form-group" style="margin:12px 0">
          <label class="form-label">Message:</label>
          <textarea id="teacher-msg-text" class="form-control" rows="3" placeholder="Write your message..."></textarea>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="appModal.close()">Cancel</button>
          <button class="btn btn-primary" onclick="StudentPortal.sendMessageToTeacher()">Send Message</button>
        </div>
      </div>
    `);
  },

  sendMessageToTeacher() {
    const text = document.getElementById('teacher-msg-text').value.trim();
    if (!text) {
      toast.error('Please enter a message.');
      return;
    }
    const student = window.appStore.getActiveStudent();
    window.appStore.sendMessage({
      recipientId: 'TCH-012',
      recipientName: student.classTeacher,
      text
    });
    appModal.close();
    toast.success('Message sent to class teacher!');
  },

  openOfficeMessageModal() {
    appModal.open(`
      <div class="modal-inner">
        <h3>✉ Contact School Office</h3>
        <p class="muted small">Green Valley High School Administrative Desk</p>
        <div class="form-group" style="margin:12px 0">
          <label class="form-label">Message Subject / Query:</label>
          <textarea id="office-msg-text" class="form-control" rows="3" placeholder="Enter inquiry regarding fees, transport, or certificates..."></textarea>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="appModal.close()">Cancel</button>
          <button class="btn btn-primary" onclick="StudentPortal.sendMessageToOffice()">Send Query</button>
        </div>
      </div>
    `);
  },

  sendMessageToOffice() {
    const text = document.getElementById('office-msg-text').value.trim();
    if (!text) return;
    window.appStore.sendMessage({
      recipientId: 'ADM-001',
      recipientName: 'School Office',
      text
    });
    appModal.close();
    toast.success('Inquiry submitted to school office.');
  },

  attachEvents(container, student, feeObj) {
    const notifBtn = container.querySelector('#btn-notifications');
    if (notifBtn) {
      notifBtn.onclick = () => {
        StudentPortal.switchTab('notices');
      };
    }
  }
};
