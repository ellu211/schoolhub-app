/**
 * SchoolHub - Main App Coordinator & Router
 */

window.App = {
  currentRole: 'admin',

  init() {
    this.currentRole = window.appStore.data.activeRole || 'admin';
    const students = window.appStore.data.users.students || [];
    if (this.currentRole === 'student' && students.length === 0) {
      this.currentRole = 'admin';
      window.appStore.setRole('admin');
    }

    this.setupServiceWorker();
    this.setupNetworkMonitor();
    this.setupRoleSwitcher();
    this.renderNavigation();
    this.renderCurrentPortal();

    // Subscribe to store updates
    window.appStore.subscribe(() => {
      this.renderNavigation();
      this.renderCurrentPortal();
    });
  },

  setRole(role) {
    this.currentRole = role;
    window.appStore.setRole(role);
    this.renderNavigation();
    this.renderCurrentPortal();

    // Role switch notification
    const roleNames = {
      student: 'Student Portal',
      teacher: 'Teacher Portal',
      admin: 'Admin Portal'
    };
    toast.info(`Switched to ${roleNames[role]}`);
  },

  renderNavigation() {
    const sideNav = document.getElementById('sidebar-nav');
    const bottomNav = document.getElementById('mobile-bottom-nav');
    const roleBadge = document.getElementById('sidebar-role-badge');
    const roleSelect = document.getElementById('global-role-select');

    if (roleSelect) {
      roleSelect.innerHTML = `
        <option value="student" ${this.currentRole === 'student' ? 'selected' : ''}>Student</option>
        <option value="teacher" ${this.currentRole === 'teacher' ? 'selected' : ''}>Teacher</option>
        <option value="admin" ${this.currentRole === 'admin' ? 'selected' : ''}>Admin</option>
      `;
    }

    if (this.currentRole === 'student') {
      if (roleBadge) roleBadge.textContent = 'STUDENT PORTAL';
      if (sideNav) {
        sideNav.innerHTML = `
          <button class="nav-btn active" data-student-tab="home" onclick="StudentPortal.switchTab('home')">
            <span class="nav-ico">⌂</span> Dashboard
          </button>
          <button class="nav-btn" data-student-tab="timetable" onclick="StudentPortal.switchTab('timetable')">
            <span class="nav-ico">▦</span> Timetable
          </button>
          <button class="nav-btn" data-student-tab="attendance" onclick="StudentPortal.switchTab('attendance')">
            <span class="nav-ico">◷</span> Attendance
          </button>
          <button class="nav-btn" data-student-tab="homework" onclick="StudentPortal.switchTab('homework')">
            <span class="nav-ico">✎</span> Homework & Notes
          </button>
          <button class="nav-btn" data-student-tab="results" onclick="StudentPortal.switchTab('results')">
            <span class="nav-ico">▤</span> Results
          </button>
          <button class="nav-btn" data-student-tab="fees" onclick="StudentPortal.switchTab('fees')">
            <span class="nav-ico">₹</span> Fee Management
          </button>
          <button class="nav-btn" data-student-tab="notices" onclick="StudentPortal.switchTab('notices')">
            <span class="nav-ico">📢</span> Notices & Circulars
          </button>
          <button class="nav-btn" data-student-tab="profile" onclick="StudentPortal.switchTab('profile')">
            <span class="nav-ico">♙</span> My Profile / Wards
          </button>
          <button class="nav-btn" data-student-tab="services" onclick="StudentPortal.switchTab('services')">
            <span class="nav-ico">＋</span> Other Services
          </button>
        `;
      }

      if (bottomNav) {
        bottomNav.innerHTML = `
          <button class="b-nav-btn active" data-student-tab="home" onclick="StudentPortal.switchTab('home')">
            <span>⌂</span> Home
          </button>
          <button class="b-nav-btn" data-student-tab="timetable" onclick="StudentPortal.switchTab('timetable')">
            <span>▦</span> Timetable
          </button>
          <button class="b-nav-btn" data-student-tab="attendance" onclick="StudentPortal.switchTab('attendance')">
            <span>◷</span> Attendance
          </button>
          <button class="b-nav-btn" data-student-tab="homework" onclick="StudentPortal.switchTab('homework')">
            <span>✎</span> Homework
          </button>
          <button class="b-nav-btn" data-student-tab="fees" onclick="StudentPortal.switchTab('fees')">
            <span>₹</span> Fees
          </button>
          <button class="b-nav-btn" data-student-tab="profile" onclick="StudentPortal.switchTab('profile')">
            <span>♙</span> Profile
          </button>
        `;
      }
    } else if (this.currentRole === 'teacher') {
      if (roleBadge) roleBadge.textContent = 'TEACHER PORTAL';
      if (sideNav) {
        sideNav.innerHTML = `
          <button class="nav-btn active" data-teacher-tab="home" onclick="TeacherPortal.switchTab('home')">
            <span class="nav-ico">⌂</span> Dashboard
          </button>
          <button class="nav-btn" data-teacher-tab="attendance" onclick="TeacherPortal.switchTab('attendance')">
            <span class="nav-ico">◷</span> Class Attendance
          </button>
          <button class="nav-btn" data-teacher-tab="homework" onclick="TeacherPortal.switchTab('homework')">
            <span class="nav-ico">✎</span> Homework & Notes
          </button>
          <button class="nav-btn" data-teacher-tab="timetable" onclick="TeacherPortal.switchTab('timetable')">
            <span class="nav-ico">▦</span> Teaching Timetable
          </button>
          <button class="nav-btn" data-teacher-tab="students" onclick="TeacherPortal.switchTab('students')">
            <span class="nav-ico">♙</span> My Students (VIII-B)
          </button>
          <button class="nav-btn" data-teacher-tab="notices" onclick="TeacherPortal.switchTab('notices')">
            <span class="nav-ico">📢</span> Class Notices
          </button>
          <button class="nav-btn" data-teacher-tab="messages" onclick="TeacherPortal.switchTab('messages')">
            <span class="nav-ico">✉</span> Messages
          </button>
        `;
      }

      if (bottomNav) {
        bottomNav.innerHTML = `
          <button class="b-nav-btn active" data-teacher-tab="home" onclick="TeacherPortal.switchTab('home')">
            <span>⌂</span> Home
          </button>
          <button class="b-nav-btn" data-teacher-tab="attendance" onclick="TeacherPortal.switchTab('attendance')">
            <span>◷</span> Attendance
          </button>
          <button class="b-nav-btn" data-teacher-tab="homework" onclick="TeacherPortal.switchTab('homework')">
            <span>✎</span> Homework
          </button>
          <button class="b-nav-btn" data-teacher-tab="students" onclick="TeacherPortal.switchTab('students')">
            <span>♙</span> Students
          </button>
          <button class="b-nav-btn" data-teacher-tab="messages" onclick="TeacherPortal.switchTab('messages')">
            <span>✉</span> Messages
          </button>
        `;
      }
    } else if (this.currentRole === 'admin') {
      if (roleBadge) roleBadge.textContent = 'ADMIN & MANAGEMENT PORTAL';
      if (sideNav) {
        sideNav.innerHTML = `
          <button class="nav-btn active" data-admin-tab="home" onclick="AdminPortal.switchTab('home')">
            <span class="nav-ico">⌂</span> Overview
          </button>
          <button class="nav-btn" data-admin-tab="students" onclick="AdminPortal.switchTab('students')">
            <span class="nav-ico">♙</span> Student Directory
          </button>
          <button class="nav-btn" data-admin-tab="staff" onclick="AdminPortal.switchTab('staff')">
            <span class="nav-ico">👩‍🏫</span> Faculty & Staff
          </button>
          <button class="nav-btn" data-admin-tab="fees" onclick="AdminPortal.switchTab('fees')">
            <span class="nav-ico">₹</span> Fee Ledger & Counter
          </button>
          <button class="nav-btn" data-admin-tab="academics" onclick="AdminPortal.switchTab('academics')">
            <span class="nav-ico">▦</span> Academic Setup
          </button>
          <button class="nav-btn" data-admin-tab="notices" onclick="AdminPortal.switchTab('notices')">
            <span class="nav-ico">📢</span> Circulars
          </button>
          <button class="nav-btn" data-admin-tab="approvals" onclick="AdminPortal.switchTab('approvals')">
            <span class="nav-ico">☑</span> Approvals
          </button>
          <button class="nav-btn" data-admin-tab="reports" onclick="AdminPortal.switchTab('reports')">
            <span class="nav-ico">▤</span> Reports & Analytics
          </button>
        `;
      }

      if (bottomNav) {
        bottomNav.innerHTML = `
          <button class="b-nav-btn active" data-admin-tab="home" onclick="AdminPortal.switchTab('home')">
            <span>⌂</span> Overview
          </button>
          <button class="b-nav-btn" data-admin-tab="students" onclick="AdminPortal.switchTab('students')">
            <span>♙</span> Students
          </button>
          <button class="b-nav-btn" data-admin-tab="fees" onclick="AdminPortal.switchTab('fees')">
            <span>₹</span> Fees
          </button>
          <button class="b-nav-btn" data-admin-tab="approvals" onclick="AdminPortal.switchTab('approvals')">
            <span>☑</span> Approvals
          </button>
          <button class="b-nav-btn" data-admin-tab="reports" onclick="AdminPortal.switchTab('reports')">
            <span>▤</span> Reports
          </button>
        `;
      }
    }
  },

  renderCurrentPortal() {
    const root = document.getElementById('portal-root');
    if (!root) return;

    if (this.currentRole === 'student') {
      StudentPortal.render(root);
    } else if (this.currentRole === 'teacher') {
      TeacherPortal.render(root);
    } else if (this.currentRole === 'admin') {
      AdminPortal.render(root);
    }
  },

  setupRoleSwitcher() {
    const select = document.getElementById('global-role-select');
    if (select) {
      select.addEventListener('change', (e) => {
        this.setRole(e.target.value);
      });
    }
  },

  setupNetworkMonitor() {
    const banner = document.getElementById('offline-indicator');
    const updateStatus = () => {
      if (navigator.onLine) {
        if (banner) banner.classList.remove('is-offline');
      } else {
        if (banner) banner.classList.add('is-offline');
        toast.warning('Working offline. All local changes will persist.');
      }
    };

    window.addEventListener('online', () => {
      updateStatus();
      toast.success('Connection restored.');
    });
    window.addEventListener('offline', updateStatus);
    updateStatus();
  },

  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => {
            console.log('Service Worker registered with scope:', reg.scope);
          })
          .catch(err => {
            console.log('Service Worker registration skipped or failed:', err);
          });
      });
    }
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
