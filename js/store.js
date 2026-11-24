/**
 * SchoolHub - Core Data Store & State Management
 * Clean Production Slate with optional Demo Data loader
 */

const STORAGE_KEY = 'schoolhub_data_v2';

// 1. Clean Blank State (Default: All Demo Data Cleared)
const blankInitialData = {
  activeRole: 'admin',
  activeStudentId: null,
  activeTeacherId: null,

  users: {
    students: [],
    teachers: [],
    admin: {
      id: 'ADM-001',
      name: 'School Administrator',
      title: 'Principal & Operations Desk',
      school: 'SchoolHub Academy',
      email: 'admin@schoolhub.app',
      phone: '+91 361 245 9000',
      avatar: '🏛️'
    }
  },

  periods: [
    { period: 1, time: '08:30–09:10', subject: 'Period 1', teacher: '—', room: 'Room 1', icon: '📐' },
    { period: 2, time: '09:10–09:50', subject: 'Period 2', teacher: '—', room: 'Room 1', icon: '📘' },
    { period: 3, time: '09:50–10:30', subject: 'Period 3', teacher: '—', room: 'Room 1', icon: '🔬' },
    { period: 4, time: '10:30–11:00', subject: 'Recess', teacher: 'Break time', room: 'Campus', icon: '☕', isBreak: true },
    { period: 5, time: '11:00–11:40', subject: 'Period 4', teacher: '—', room: 'Room 1', icon: '🌍' },
    { period: 6, time: '11:40–12:20', subject: 'Period 5', teacher: '—', room: 'Room 1', icon: '📖' },
    { period: 7, time: '12:20–01:00', subject: 'Period 6', teacher: '—', room: 'Room 1', icon: '💻' }
  ],

  attendance: {},
  homework: [],
  submissions: [],
  fees: {},
  results: {},
  notices: [],
  leaves: [],
  library: [],
  consentForms: [],
  messages: []
};

// 2. Sample Demo Dataset (Preserved for previewing if user requests demo restore)
const sampleDemoData = {
  activeRole: 'student',
  activeStudentId: 'EDU-054',
  activeTeacherId: 'TCH-012',

  users: {
    students: [
      {
        id: 'EDU-054',
        name: 'Nisha Ahmed',
        class: 'Class VIII-B',
        roll: '18',
        parentName: 'Farida Ahmed',
        parentPhone: '+91 98765 43210',
        dob: '12 March 2012',
        bloodGroup: 'B+',
        address: '14 Hillview Road, Guwahati, Assam',
        avatar: '👩‍🎓',
        classTeacher: 'Mr. R. Das',
        room: 'Room 4',
        academicYear: '2026–27',
        attendanceRate: 92,
        schoolName: 'Green Valley High School'
      },
      {
        id: 'EDU-102',
        name: 'Arman Ahmed',
        class: 'Class V-A',
        roll: '04',
        parentName: 'Farida Ahmed',
        parentPhone: '+91 98765 43210',
        dob: '05 September 2015',
        bloodGroup: 'O+',
        address: '14 Hillview Road, Guwahati, Assam',
        avatar: '👦',
        classTeacher: 'Ms. M. Saikia',
        room: 'Room 1',
        academicYear: '2026–27',
        attendanceRate: 96,
        schoolName: 'Green Valley High School'
      },
      {
        id: 'EDU-055',
        name: 'Aarav Sharma',
        class: 'Class VIII-B',
        roll: '01',
        parentName: 'Ritu Sharma',
        parentPhone: '+91 98111 22334',
        dob: '22 July 2012',
        bloodGroup: 'A+',
        address: '42 Lake View Lane, Guwahati',
        avatar: '🧑‍🎓',
        classTeacher: 'Mr. R. Das',
        room: 'Room 4',
        academicYear: '2026–27',
        attendanceRate: 96,
        schoolName: 'Green Valley High School'
      }
    ],
    teachers: [
      {
        id: 'TCH-012',
        name: 'Mr. R. Das',
        subject: 'Mathematics',
        assignedClasses: ['Class VIII-B', 'Class VIII-A', 'Class IX-A'],
        isClassTeacher: 'Class VIII-B',
        phone: '+91 94350 11223',
        email: 'r.das@greenvalley.edu',
        room: 'Room 4',
        avatar: '👨‍🏫'
      },
      {
        id: 'TCH-015',
        name: 'Ms. P. Sharma',
        subject: 'General Science',
        assignedClasses: ['Class VII-B', 'Class VIII-B'],
        phone: '+91 94350 33445',
        email: 'p.sharma@greenvalley.edu',
        room: 'Lab 2',
        avatar: '👩‍🏫'
      }
    ],
    admin: {
      id: 'ADM-001',
      name: 'School Administrator',
      title: 'Principal & Operations Desk',
      school: 'Green Valley High School',
      email: 'admin@greenvalley.edu',
      phone: '+91 361 245 9000',
      avatar: '🏛️'
    }
  },

  periods: [
    { period: 1, time: '08:30–09:10', subject: 'Mathematics', teacher: 'Mr. R. Das', room: 'Room 4', icon: '📐' },
    { period: 2, time: '09:10–09:50', subject: 'English', teacher: 'Ms. J. Bora', room: 'Room 4', icon: '📘' },
    { period: 3, time: '09:50–10:30', subject: 'General Science', teacher: 'Ms. P. Sharma', room: 'Lab 2', icon: '🔬' },
    { period: 4, time: '10:30–11:00', subject: 'Recess', teacher: 'Break time', room: 'Campus', icon: '☕', isBreak: true },
    { period: 5, time: '11:00–11:40', subject: 'Social Science', teacher: 'Mr. A. Dutta', room: 'Room 4', icon: '🌍' },
    { period: 6, time: '11:40–12:20', subject: 'Language', teacher: 'Ms. M. Saikia', room: 'Room 4', icon: '📖' },
    { period: 7, time: '12:20–01:00', subject: 'Computer Studies', teacher: 'Mr. K. Nath', room: 'Comp Lab', icon: '💻' }
  ],

  attendance: {
    '2026-11-09': { 'EDU-054': 'Present', 'EDU-055': 'Present' }
  },

  homework: [
    {
      id: 'HW-101',
      class: 'Class VIII-B',
      subject: 'Mathematics',
      title: 'Linear Equations in One Variable',
      teacher: 'Mr. R. Das',
      assignedDate: '2026-11-08',
      dueDate: '2026-11-10',
      description: 'Solve problems from Exercise 4.2. Verify your answers.',
      attachmentName: 'Exercise 4.2.pdf',
      attachmentSize: '480 KB',
      status: 'Published'
    }
  ],

  submissions: [],

  fees: {
    'EDU-054': {
      total: 8000,
      paid: 5500,
      due: 2500,
      items: [
        { id: 'FEE-1', name: 'Tuition Fee (Term 2)', amount: 5000, status: 'Paid', receiptNo: 'REC-2026-881', date: '05 Oct 2026' },
        { id: 'FEE-2', name: 'Development Fee', amount: 1500, status: 'Paid', receiptNo: 'REC-2026-881', date: '05 Oct 2026' },
        { id: 'FEE-3', name: 'Term Fee Balance', amount: 2500, status: 'Due', dueDate: '20 Nov 2026' }
      ],
      paymentHistory: [
        {
          id: 'TXN-7721',
          date: '05 Oct 2026, 11:30 AM',
          amount: 5500,
          method: 'Online UPI',
          receiptNo: 'REC-2026-881',
          status: 'Success',
          notes: 'Tuition + Development fee'
        }
      ],
      admitEligibility: 'Not Eligible',
      admitEligibleReason: 'Pending balance ₹2,500'
    }
  },

  results: {
    'EDU-054': {
      exams: [
        {
          title: 'Unit Test 1',
          publishedDate: '18 Aug 2026',
          overallPercentage: 82,
          grade: 'A',
          subjects: [
            { subject: 'Mathematics', marks: 44, max: 50, grade: 'A' },
            { subject: 'English', marks: 41, max: 50, grade: 'A' },
            { subject: 'General Science', marks: 39, max: 50, grade: 'B+' }
          ]
        }
      ],
      teacherRemarks: 'Good performance in Mathematics and Science.'
    }
  },

  notices: [
    {
      id: 'NOT-301',
      title: 'Annual Sports Day 2026',
      audience: 'Whole school',
      category: 'Event',
      date: '08 Nov 2026',
      author: 'School Management',
      content: 'The Annual Sports Day will be held on Saturday, 28 November 2026.',
      pinned: true
    }
  ],

  leaves: [],
  library: [],
  consentForms: [],
  messages: []
};

class Store {
  constructor() {
    this.data = this.load();
    this.listeners = [];
  }

  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using blank initial state', e);
    }
    // Default: Clean Blank Slate (all demo data cleared)
    return JSON.parse(JSON.stringify(blankInitialData));
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
    this.notify();
  }

  // Clear all demo data completely
  clearAllData() {
    this.data = JSON.parse(JSON.stringify(blankInitialData));
    this.save();
    try {
      localStorage.removeItem('schoolhub_data_v1');
    } catch (e) {}
    return this.data;
  }

  // Restore sample demo dataset (if user requests)
  loadDemoData() {
    this.data = JSON.parse(JSON.stringify(sampleDemoData));
    this.save();
    return this.data;
  }

  reset() {
    this.clearAllData();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => {
      try {
        cb(this.data);
      } catch (err) {
        console.error('Error in store subscriber', err);
      }
    });
  }

  // Role & User selection
  setRole(role) {
    this.data.activeRole = role;
    this.save();
  }

  setActiveStudent(studentId) {
    this.data.activeStudentId = studentId;
    this.save();
  }

  setActiveTeacher(teacherId) {
    this.data.activeTeacherId = teacherId;
    this.save();
  }

  getActiveStudent() {
    if (!this.data.users.students || !this.data.users.students.length) return null;
    return this.data.users.students.find(s => s.id === this.data.activeStudentId) || this.data.users.students[0];
  }

  getActiveTeacher() {
    if (!this.data.users.teachers || !this.data.users.teachers.length) return null;
    return this.data.users.teachers.find(t => t.id === this.data.activeTeacherId) || this.data.users.teachers[0];
  }

  getAdmin() {
    return this.data.users.admin || blankInitialData.users.admin;
  }

  // Attendance
  markAttendance(dateStr, studentId, status) {
    if (!this.data.attendance[dateStr]) {
      this.data.attendance[dateStr] = {};
    }
    this.data.attendance[dateStr][studentId] = status;
    this.recalculateAttendance(studentId);
    this.save();
  }

  saveBulkAttendance(dateStr, classRecords) {
    if (!this.data.attendance[dateStr]) {
      this.data.attendance[dateStr] = {};
    }
    Object.assign(this.data.attendance[dateStr], classRecords);

    Object.keys(classRecords).forEach(studentId => {
      this.recalculateAttendance(studentId);
    });
    this.save();
  }

  recalculateAttendance(studentId) {
    let totalDays = 0;
    let presentDays = 0;
    Object.keys(this.data.attendance).forEach(date => {
      const status = this.data.attendance[date][studentId];
      if (status) {
        totalDays++;
        if (status === 'Present') presentDays++;
      }
    });

    const student = (this.data.users.students || []).find(s => s.id === studentId);
    if (student && totalDays > 0) {
      student.attendanceRate = Math.round((presentDays / totalDays) * 100);
    }
  }

  getAttendanceForDate(dateStr) {
    return this.data.attendance[dateStr] || {};
  }

  // Homework
  addHomework({ title, subject, targetClass, dueDate, description, attachmentName, attachmentSize }) {
    const teacher = this.getActiveTeacher();
    const newHw = {
      id: 'HW-' + Date.now().toString().slice(-4),
      class: targetClass,
      subject,
      title,
      teacher: teacher ? teacher.name : 'Faculty Member',
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate,
      description,
      attachmentName: attachmentName || 'Assignment_Task.pdf',
      attachmentSize: attachmentSize || '540 KB',
      status: 'Published'
    };
    this.data.homework.unshift(newHw);
    this.save();
    return newHw;
  }

  // Submissions
  submitHomework({ homeworkId, studentId, fileName, fileSize, comment, fileDataUrl }) {
    const student = (this.data.users.students || []).find(s => s.id === studentId) || this.getActiveStudent();
    if (!student) return null;

    const hw = this.data.homework.find(h => h.id === homeworkId);

    const submission = {
      id: 'SUB-' + Date.now().toString().slice(-4),
      homeworkId,
      studentId: student.id,
      studentName: student.name,
      subject: hw ? hw.subject : 'General',
      submittedDate: new Date().toISOString(),
      fileName: fileName || 'Submission_' + student.name.replace(/\s+/g, '_') + '.pdf',
      fileSize: fileSize || '650 KB',
      comment: comment || '',
      fileDataUrl: fileDataUrl || null,
      status: 'Submitted',
      grade: null,
      feedback: null
    };

    this.data.submissions = this.data.submissions.filter(
      s => !(s.homeworkId === homeworkId && s.studentId === student.id)
    );
    this.data.submissions.unshift(submission);
    this.save();
    return submission;
  }

  gradeSubmission(submissionId, grade, feedback) {
    const sub = this.data.submissions.find(s => s.id === submissionId);
    if (sub) {
      sub.grade = grade;
      sub.feedback = feedback;
      sub.status = 'Reviewed';
      this.save();
    }
  }

  // Fees & Payment
  payFeeOnline(studentId, amount, paymentMethod) {
    if (!this.data.fees[studentId]) {
      this.data.fees[studentId] = { total: 0, paid: 0, due: 0, items: [], paymentHistory: [], admitEligibility: 'Eligible', admitEligibleReason: 'Dues cleared' };
    }
    const feeObj = this.data.fees[studentId];

    const receiptNo = 'REC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const txnId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    const numAmount = Number(amount);

    feeObj.paid = (feeObj.paid || 0) + numAmount;
    feeObj.due = Math.max(0, (feeObj.total || 0) - feeObj.paid);

    if (!feeObj.paymentHistory) feeObj.paymentHistory = [];
    feeObj.paymentHistory.unshift({
      id: txnId,
      date: new Date().toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      amount: numAmount,
      method: paymentMethod || 'Online Gateway',
      receiptNo,
      status: 'Success',
      notes: 'Online fee payment'
    });

    if (feeObj.items) {
      feeObj.items.forEach(item => {
        if (item.status === 'Due') {
          item.status = 'Paid';
          item.receiptNo = receiptNo;
          item.date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        }
      });
    }

    if (feeObj.due <= 0) {
      feeObj.admitEligibility = 'Eligible';
      feeObj.admitEligibleReason = 'All dues cleared';
    }

    this.save();
    return { receiptNo, txnId, amount: numAmount };
  }

  recordOfflineFee(studentId, amount, method, refNo, notes) {
    if (!this.data.fees[studentId]) {
      this.data.fees[studentId] = { total: 0, paid: 0, due: 0, items: [], paymentHistory: [], admitEligibility: 'Eligible', admitEligibleReason: 'Dues cleared' };
    }
    const feeObj = this.data.fees[studentId];

    const receiptNo = refNo || ('OFF-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000));
    const txnId = 'OFF-TXN-' + Math.floor(10000 + Math.random() * 90000);
    const numAmount = Number(amount);

    feeObj.paid = (feeObj.paid || 0) + numAmount;
    feeObj.due = Math.max(0, (feeObj.total || 0) - feeObj.paid);

    if (!feeObj.paymentHistory) feeObj.paymentHistory = [];
    feeObj.paymentHistory.unshift({
      id: txnId,
      date: new Date().toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      amount: numAmount,
      method: 'Counter (' + method + ')',
      receiptNo,
      status: 'Verified & Recorded',
      notes: notes || 'Offline payment verified at school counter'
    });

    if (feeObj.items) {
      feeObj.items.forEach(item => {
        if (item.status === 'Due' && feeObj.due <= 0) {
          item.status = 'Paid';
          item.receiptNo = receiptNo;
          item.date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        }
      });
    }

    if (feeObj.due <= 0) {
      feeObj.admitEligibility = 'Eligible';
      feeObj.admitEligibleReason = 'All dues cleared';
    }

    this.save();
    return { receiptNo, txnId, amount: numAmount };
  }

  // Notices
  addNotice({ title, audience, category, content, author }) {
    const notice = {
      id: 'NOT-' + Date.now().toString().slice(-4),
      title,
      audience: audience || 'Whole school',
      category: category || 'Circular',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      author: author || 'School Office',
      content,
      pinned: false
    };
    this.data.notices.unshift(notice);
    this.save();
    return notice;
  }

  // Leaves
  applyLeave({ studentId, fromDate, toDate, reason }) {
    const student = (this.data.users.students || []).find(s => s.id === studentId) || this.getActiveStudent();
    if (!student) return null;

    const leave = {
      id: 'LEV-' + Date.now().toString().slice(-4),
      studentId: student.id,
      studentName: student.name,
      class: student.class,
      fromDate,
      toDate,
      reason,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      remarks: null
    };
    this.data.leaves.unshift(leave);
    this.save();
    return leave;
  }

  updateLeaveStatus(leaveId, status, remarks) {
    const leave = this.data.leaves.find(l => l.id === leaveId);
    if (leave) {
      leave.status = status;
      leave.remarks = remarks || '';
      this.save();
    }
  }

  // Consent forms
  grantConsent(formId, parentNotes) {
    const form = this.data.consentForms.find(f => f.id === formId);
    if (form) {
      form.status = 'Approved';
      form.parentNotes = parentNotes || 'Consent given by parent';
      this.save();
    }
  }

  // Messages
  sendMessage({ recipientId, recipientName, text }) {
    const role = this.data.activeRole;
    let sender = 'User';
    if (role === 'student') {
      const st = this.getActiveStudent();
      sender = st ? `${st.parentName} (${st.name}'s Parent)` : 'Parent';
    } else if (role === 'teacher') {
      const tch = this.getActiveTeacher();
      sender = tch ? tch.name : 'Faculty Member';
    } else {
      sender = 'School Office';
    }

    const msg = {
      id: 'MSG-' + Date.now().toString().slice(-4),
      sender,
      senderRole: role,
      recipientId: recipientId || 'ADM-001',
      recipientName: recipientName || 'Class Teacher',
      date: new Date().toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      text
    };
    this.data.messages.unshift(msg);
    this.save();
    return msg;
  }

  // Enroll Student (Admin)
  addStudent(studentData) {
    const id = 'EDU-' + Math.floor(100 + Math.random() * 900);
    const newStudent = {
      id,
      name: studentData.name,
      class: studentData.class || 'Class VIII-B',
      roll: studentData.roll || '01',
      parentName: studentData.parentName || 'Parent Name',
      parentPhone: studentData.parentPhone || '+91 90000 00000',
      dob: studentData.dob || '2012-01-01',
      bloodGroup: studentData.bloodGroup || 'A+',
      address: studentData.address || 'Guwahati',
      avatar: studentData.avatar || '🧑‍🎓',
      classTeacher: studentData.classTeacher || 'Assigned Teacher',
      room: studentData.room || 'Room 1',
      academicYear: '2026–27',
      attendanceRate: 100,
      schoolName: (this.data.users.admin && this.data.users.admin.school) || 'SchoolHub Academy'
    };

    if (!this.data.users.students) this.data.users.students = [];
    this.data.users.students.push(newStudent);

    // If activeStudentId is empty, select this student
    if (!this.data.activeStudentId) {
      this.data.activeStudentId = id;
    }

    // Init fee record
    if (!this.data.fees) this.data.fees = {};
    const tuitionAmount = Number(studentData.termFee) || 5000;
    this.data.fees[id] = {
      total: tuitionAmount,
      paid: 0,
      due: tuitionAmount,
      items: [
        { id: 'FEE-1', name: 'Academic Tuition Fee', amount: tuitionAmount, status: 'Due', dueDate: '20 Nov 2026' }
      ],
      paymentHistory: [],
      admitEligibility: 'Not Eligible',
      admitEligibleReason: `Pending fee balance ₹${tuitionAmount.toLocaleString('en-IN')}`
    };

    this.save();
    return newStudent;
  }

  // Register Teacher / Staff (Admin)
  addStaff(staffData) {
    const id = 'TCH-' + Math.floor(100 + Math.random() * 900);
    const newTeacher = {
      id,
      name: staffData.name,
      subject: staffData.subject || 'General Studies',
      assignedClasses: staffData.assignedClasses && staffData.assignedClasses.length ? staffData.assignedClasses : ['Class VIII-B'],
      isClassTeacher: staffData.isClassTeacher || null,
      phone: staffData.phone || '',
      email: staffData.email || '',
      room: staffData.room || 'Faculty Room 1',
      avatar: staffData.avatar || '👨‍🏫'
    };

    if (!this.data.users.teachers) this.data.users.teachers = [];
    this.data.users.teachers.push(newTeacher);

    if (!this.data.activeTeacherId) {
      this.data.activeTeacherId = id;
    }

    this.save();
    return newTeacher;
  }

  // Delete / Remove Student (Admin)
  deleteStudent(studentId) {
    if (!this.data.users.students) return false;
    const index = this.data.users.students.findIndex(s => s.id === studentId);
    if (index === -1) return false;

    const removed = this.data.users.students.splice(index, 1)[0];

    // Clean up fee record
    if (this.data.fees && this.data.fees[studentId]) {
      delete this.data.fees[studentId];
    }

    // Clean up results
    if (this.data.results && this.data.results[studentId]) {
      delete this.data.results[studentId];
    }

    // Clean up attendance records
    if (this.data.attendance) {
      Object.keys(this.data.attendance).forEach(date => {
        if (this.data.attendance[date] && this.data.attendance[date][studentId]) {
          delete this.data.attendance[date][studentId];
        }
      });
    }

    // Clean up submissions
    if (this.data.submissions) {
      this.data.submissions = this.data.submissions.filter(sub => sub.studentId !== studentId);
    }

    // Clean up leaves
    if (this.data.leaves) {
      this.data.leaves = this.data.leaves.filter(l => l.studentId !== studentId);
    }

    // Clean up library
    if (this.data.library) {
      this.data.library = this.data.library.filter(lib => lib.studentId !== studentId);
    }

    // Clean up consent forms
    if (this.data.consentForms) {
      this.data.consentForms = this.data.consentForms.filter(c => c.studentId !== studentId);
    }

    // Update active student id if needed
    if (this.data.activeStudentId === studentId) {
      this.data.activeStudentId = this.data.users.students.length ? this.data.users.students[0].id : null;
    }

    this.save();
    return removed;
  }

  // Delete / Remove Teacher / Staff (Admin)
  deleteStaff(teacherId) {
    if (!this.data.users.teachers) return false;
    const index = this.data.users.teachers.findIndex(t => t.id === teacherId);
    if (index === -1) return false;

    const removed = this.data.users.teachers.splice(index, 1)[0];

    if (this.data.activeTeacherId === teacherId) {
      this.data.activeTeacherId = this.data.users.teachers.length ? this.data.users.teachers[0].id : null;
    }

    this.save();
    return removed;
  }

  // Update Student details
  updateStudent(studentId, updatedData) {
    const student = (this.data.users.students || []).find(s => s.id === studentId);
    if (!student) return null;
    Object.assign(student, updatedData);
    this.save();
    return student;
  }

  // Update Staff details
  updateStaff(teacherId, updatedData) {
    const teacher = (this.data.users.teachers || []).find(t => t.id === teacherId);
    if (!teacher) return null;
    Object.assign(teacher, updatedData);
    this.save();
    return teacher;
  }
}

// Global singleton instance
window.appStore = new Store();
