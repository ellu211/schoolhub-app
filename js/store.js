/**
 * SchoolHub - Core Data Store & State Management
 * Persistent reactive store backed by localStorage with full mock seed data.
 */

const STORAGE_KEY = 'schoolhub_data_v1';

const defaultSeedData = {
  activeRole: 'student', // 'student', 'teacher', 'admin'
  activeStudentId: 'EDU-054', // default active student (Nisha Ahmed)
  activeTeacherId: 'TCH-012', // Mr. R. Das
  
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
      },
      {
        id: 'EDU-056',
        name: 'Rohan Das',
        class: 'Class VIII-B',
        roll: '03',
        parentName: 'Bikash Das',
        parentPhone: '+91 98444 55667',
        dob: '18 November 2012',
        bloodGroup: 'AB+',
        address: '8 Zoo Road, Guwahati',
        avatar: '👦',
        classTeacher: 'Mr. R. Das',
        room: 'Room 4',
        academicYear: '2026–27',
        attendanceRate: 88,
        schoolName: 'Green Valley High School'
      },
      {
        id: 'EDU-057',
        name: 'Priya Bora',
        class: 'Class VIII-B',
        roll: '04',
        parentName: 'Sunil Bora',
        parentPhone: '+91 98333 44556',
        dob: '30 January 2012',
        bloodGroup: 'B+',
        address: '27 Christian Basti, Guwahati',
        avatar: '👧',
        classTeacher: 'Mr. R. Das',
        room: 'Room 4',
        academicYear: '2026–27',
        attendanceRate: 94,
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
        assignedClasses: ['Class VII-B', 'Class VIII-B', 'Class IX-A'],
        phone: '+91 94350 33445',
        email: 'p.sharma@greenvalley.edu',
        room: 'Lab 2',
        avatar: '👩‍🏫'
      },
      {
        id: 'TCH-018',
        name: 'Ms. J. Bora',
        subject: 'English',
        assignedClasses: ['Class VIII-A', 'Class VIII-B'],
        phone: '+91 94350 55667',
        email: 'j.bora@greenvalley.edu',
        room: 'Room 3',
        avatar: '👩‍🏫'
      },
      {
        id: 'TCH-022',
        name: 'Mr. A. Dutta',
        subject: 'Social Science',
        assignedClasses: ['Class VIII-B', 'Class IX-B'],
        phone: '+91 94350 77889',
        email: 'a.dutta@greenvalley.edu',
        room: 'Room 5',
        avatar: '👨‍🏫'
      },
      {
        id: 'TCH-025',
        name: 'Mr. K. Nath',
        subject: 'Computer Studies',
        assignedClasses: ['Class VIII-B', 'Class IX-A', 'Class X-A'],
        phone: '+91 94350 99001',
        email: 'k.nath@greenvalley.edu',
        room: 'Comp Lab 1',
        avatar: '👨‍💻'
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
    { period: 6, time: '11:40–12:20', subject: 'Assamese / Hindi', teacher: 'Ms. M. Saikia', room: 'Room 4', icon: '📖' },
    { period: 7, time: '12:20–01:00', subject: 'Computer Studies', teacher: 'Mr. K. Nath', room: 'Comp Lab 1', icon: '💻' }
  ],

  // Attendance by date & student
  attendance: {
    '2026-11-09': {
      'EDU-054': 'Present',
      'EDU-055': 'Present',
      'EDU-056': 'Absent',
      'EDU-057': 'Present'
    },
    '2026-11-08': {
      'EDU-054': 'Present',
      'EDU-055': 'Present',
      'EDU-056': 'Present',
      'EDU-057': 'Present'
    },
    '2026-11-07': {
      'EDU-054': 'Present',
      'EDU-055': 'Present',
      'EDU-056': 'Present',
      'EDU-057': 'Present'
    },
    '2026-11-06': {
      'EDU-054': 'Present',
      'EDU-055': 'Absent',
      'EDU-056': 'Present',
      'EDU-057': 'Present'
    },
    '2026-11-05': {
      'EDU-054': 'Leave',
      'EDU-055': 'Present',
      'EDU-056': 'Present',
      'EDU-057': 'Present'
    },
    '2026-11-04': {
      'EDU-054': 'Present',
      'EDU-055': 'Present',
      'EDU-056': 'Absent',
      'EDU-057': 'Present'
    },
    '2026-11-03': {
      'EDU-054': 'Present',
      'EDU-055': 'Present',
      'EDU-056': 'Present',
      'EDU-057': 'Present'
    },
    '2026-11-02': {
      'EDU-054': 'Absent',
      'EDU-055': 'Present',
      'EDU-056': 'Present',
      'EDU-057': 'Present'
    },
    '2026-11-01': {
      'EDU-054': 'Present',
      'EDU-055': 'Present',
      'EDU-056': 'Present',
      'EDU-057': 'Present'
    }
  },

  // Homework assignments created by teachers
  homework: [
    {
      id: 'HW-101',
      class: 'Class VIII-B',
      subject: 'Mathematics',
      title: 'Linear Equations in One Variable',
      teacher: 'Mr. R. Das',
      assignedDate: '2026-11-08',
      dueDate: '2026-11-10',
      description: 'Solve problems from Exercise 4.2 (Questions 1 to 10). Show clear step-by-step working and verify your solution.',
      attachmentName: 'Exercise 4.2.pdf',
      attachmentSize: '480 KB',
      status: 'Published'
    },
    {
      id: 'HW-102',
      class: 'Class VIII-B',
      subject: 'General Science',
      title: 'Photosynthesis & Plant Respiration',
      teacher: 'Ms. P. Sharma',
      assignedDate: '2026-11-07',
      dueDate: '2026-11-12',
      description: 'Complete the attached worksheet on chlorophyll pigments, light reaction vs Calvin cycle. Draw labeled diagrams.',
      attachmentName: 'Worksheet_Photosynthesis.docx',
      attachmentSize: '720 KB',
      status: 'Published'
    },
    {
      id: 'HW-103',
      class: 'Class VIII-B',
      subject: 'English',
      title: 'Paragraph Writing: Environmental Conservation',
      teacher: 'Ms. J. Bora',
      assignedDate: '2026-11-06',
      dueDate: '2026-11-13',
      description: 'Write an essay of 250 words describing urgent steps needed to reduce plastic pollution in local wetlands.',
      attachmentName: 'Writing_Guidelines.pdf',
      attachmentSize: '310 KB',
      status: 'Published'
    },
    {
      id: 'HW-104',
      class: 'Class IX-A',
      subject: 'Mathematics',
      title: 'Algebra Revision & Quadratic Formulas',
      teacher: 'Mr. R. Das',
      assignedDate: '2026-11-08',
      dueDate: '2026-11-14',
      description: 'Review notes and solve quadratic factoring drill on chapter 3.',
      attachmentName: 'Algebra_revision_notes.pdf',
      attachmentSize: '950 KB',
      status: 'Published'
    }
  ],

  // Student submissions
  submissions: [
    {
      id: 'SUB-201',
      homeworkId: 'HW-101',
      studentId: 'EDU-054',
      studentName: 'Nisha Ahmed',
      subject: 'Mathematics',
      submittedDate: '2026-11-09T09:15:00',
      fileName: 'Nisha_Ahmed_Linear_Eq_Ex4.2.pdf',
      fileSize: '1.2 MB',
      comment: 'Sir, I have completed all 10 questions and verified question 7 twice.',
      status: 'Submitted',
      grade: null,
      feedback: null
    },
    {
      id: 'SUB-202',
      homeworkId: 'HW-101',
      studentId: 'EDU-055',
      studentName: 'Aarav Sharma',
      subject: 'Mathematics',
      submittedDate: '2026-11-09T08:45:00',
      fileName: 'Aarav_Math_HW.pdf',
      fileSize: '890 KB',
      comment: 'Completed exercises attached.',
      status: 'Reviewed',
      grade: 'A',
      feedback: 'Good work on linear equations. Clean presentation.'
    },
    {
      id: 'SUB-203',
      homeworkId: 'HW-103',
      studentId: 'EDU-054',
      studentName: 'Nisha Ahmed',
      subject: 'English',
      submittedDate: '2026-11-08T18:20:00',
      fileName: 'Nisha_Conservation_Essay.pdf',
      fileSize: '410 KB',
      comment: 'Draft attached for review.',
      status: 'Submitted',
      grade: null,
      feedback: null
    }
  ],

  // Fee records per student
  fees: {
    'EDU-054': {
      total: 8000,
      paid: 5500,
      due: 2500,
      items: [
        { id: 'FEE-1', name: 'Tuition Fee (Term 2)', amount: 5000, status: 'Paid', receiptNo: 'REC-2026-881', date: '05 Oct 2026' },
        { id: 'FEE-2', name: 'Development & Sports Fee', amount: 1500, status: 'Paid', receiptNo: 'REC-2026-881', date: '05 Oct 2026' },
        { id: 'FEE-3', name: 'Term Fee Balance (Term 2)', amount: 2500, status: 'Due', dueDate: '20 Nov 2026' }
      ],
      paymentHistory: [
        {
          id: 'TXN-7721',
          date: '05 Oct 2026, 11:30 AM',
          amount: 5500,
          method: 'Online UPI (SBI)',
          receiptNo: 'REC-2026-881',
          status: 'Success',
          notes: 'Tuition + Development fee'
        }
      ],
      admitEligibility: 'Not Eligible', // 'Eligible' when due === 0
      admitEligibleReason: 'Pending balance ₹2,500'
    },
    'EDU-055': {
      total: 8000,
      paid: 8000,
      due: 0,
      items: [
        { id: 'FEE-1', name: 'Tuition Fee (Term 2)', amount: 5000, status: 'Paid', receiptNo: 'REC-2026-750', date: '12 Sep 2026' },
        { id: 'FEE-2', name: 'Development Fee', amount: 1500, status: 'Paid', receiptNo: 'REC-2026-750', date: '12 Sep 2026' },
        { id: 'FEE-3', name: 'Term Fee Balance', amount: 1500, status: 'Paid', receiptNo: 'REC-2026-750', date: '12 Sep 2026' }
      ],
      paymentHistory: [
        {
          id: 'TXN-6612',
          date: '12 Sep 2026, 02:15 PM',
          amount: 8000,
          method: 'Bank Transfer (HDFC)',
          receiptNo: 'REC-2026-750',
          status: 'Success',
          notes: 'Full Term 2 payment'
        }
      ],
      admitEligibility: 'Eligible',
      admitEligibleReason: 'All dues cleared'
    },
    'EDU-102': {
      total: 6500,
      paid: 6500,
      due: 0,
      items: [
        { id: 'FEE-1', name: 'Primary Tuition Fee', amount: 4500, status: 'Paid', receiptNo: 'REC-2026-904', date: '01 Oct 2026' },
        { id: 'FEE-2', name: 'Activities & Library', amount: 2000, status: 'Paid', receiptNo: 'REC-2026-904', date: '01 Oct 2026' }
      ],
      paymentHistory: [
        {
          id: 'TXN-9044',
          date: '01 Oct 2026, 10:00 AM',
          amount: 6500,
          method: 'Counter Cash Receipt',
          receiptNo: 'REC-2026-904',
          status: 'Success',
          notes: 'Full fee paid at school counter'
        }
      ],
      admitEligibility: 'Eligible',
      admitEligibleReason: 'All dues cleared'
    }
  },

  // Academic Examination Results
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
            { subject: 'General Science', marks: 39, max: 50, grade: 'B+' },
            { subject: 'Social Science', marks: 43, max: 50, grade: 'A' },
            { subject: 'Computer Studies', marks: 46, max: 50, grade: 'A+' }
          ]
        },
        {
          title: 'Half-Yearly Examination',
          publishedDate: '20 Oct 2026',
          overallPercentage: 86.4,
          grade: 'A',
          subjects: [
            { subject: 'Mathematics', marks: 88, max: 100, grade: 'A' },
            { subject: 'English', marks: 85, max: 100, grade: 'A' },
            { subject: 'General Science', marks: 84, max: 100, grade: 'A' },
            { subject: 'Social Science', marks: 87, max: 100, grade: 'A' },
            { subject: 'Assamese / Hindi', marks: 82, max: 100, grade: 'A' },
            { subject: 'Computer Studies', marks: 92, max: 100, grade: 'A+' }
          ]
        },
        {
          title: 'Unit Test 2',
          publishedDate: null,
          status: 'Awaiting',
          scheduledDate: '24 Nov 2026'
        }
      ],
      teacherRemarks: 'Nisha is regular in class and shows good improvement in Mathematics. Keep participating in classroom discussions and scientific project work.'
    }
  },

  // Notices and circulars
  notices: [
    {
      id: 'NOT-301',
      title: 'Annual Sports Day 2026',
      audience: 'Whole school',
      category: 'Event',
      date: '08 Nov 2026',
      author: 'School Management',
      content: 'The Annual Sports Day will be held on Saturday, 28 November 2026 at the Main Athletics Ground. Students participating in track, field, and team events should report to their house teachers by 12 November for trial registrations.',
      pinned: true
    },
    {
      id: 'NOT-302',
      title: 'Parent-Teacher Meeting (PTM)',
      audience: 'Whole school',
      category: 'Circular',
      date: '06 Nov 2026',
      author: "Principal's Office",
      content: 'A mandatory Parent-Teacher Meeting is scheduled for Saturday, 14 November 2026 from 10:00 AM to 01:00 PM. Parents can discuss Half-Yearly examination progress and upcoming board/unit test strategies.',
      pinned: true
    },
    {
      id: 'NOT-303',
      title: 'Library Book Return Reminder',
      audience: 'Whole school',
      category: 'Notice',
      date: '05 Nov 2026',
      author: 'Central Library',
      content: 'All books issued for the Half-Yearly recess must be returned or re-issued by Thursday, 12 November to avoid overdue fines.',
      pinned: false
    },
    {
      id: 'NOT-304',
      title: 'Mathematics Remedial Class for VIII-B',
      audience: 'Class VIII-B',
      category: 'Class Notice',
      date: '09 Nov 2026',
      author: 'Mr. R. Das',
      content: 'Special doubt-clearing session for Chapter 4 (Linear Equations) will be conducted on Wednesday from 02:00 PM to 03:00 PM in Room 4.',
      pinned: false
    }
  ],

  // Leave applications
  leaves: [
    {
      id: 'LEV-501',
      studentId: 'EDU-054',
      studentName: 'Nisha Ahmed',
      class: 'Class VIII-B',
      fromDate: '2026-11-16',
      toDate: '2026-11-17',
      reason: 'Family wedding function in Jorhat. Requesting leave for 2 days.',
      submittedDate: '2026-11-09',
      status: 'Pending',
      remarks: null
    },
    {
      id: 'LEV-502',
      studentId: 'EDU-056',
      studentName: 'Rohan Das',
      class: 'Class VIII-B',
      fromDate: '2026-11-04',
      toDate: '2026-11-04',
      reason: 'Fever and doctor visit.',
      submittedDate: '2026-11-04',
      status: 'Approved',
      remarks: 'Approved by Class Teacher'
    }
  ],

  // Library transactions
  library: [
    {
      id: 'LIB-1',
      studentId: 'EDU-054',
      bookTitle: 'A Brief History of Time - Stephen Hawking',
      isbn: '978-0553380163',
      issueDate: '28 Oct 2026',
      dueDate: '12 Nov 2026',
      status: 'Borrowed'
    },
    {
      id: 'LIB-2',
      studentId: 'EDU-054',
      bookTitle: 'Mathematics for Young Minds - R.S. Aggarwal',
      isbn: '978-8177099231',
      issueDate: '15 Oct 2026',
      dueDate: '29 Oct 2026',
      status: 'Returned'
    }
  ],

  // Consent forms
  consentForms: [
    {
      id: 'CON-1',
      studentId: 'EDU-054',
      title: 'Regional Science Museum Educational Tour',
      eventDate: '18 Nov 2026',
      destination: 'Khanapara Science Park',
      fee: '₹200 (Transport & Entry)',
      status: 'Pending Consent',
      parentNotes: ''
    },
    {
      id: 'CON-2',
      studentId: 'EDU-055',
      title: 'Inter-School Sports Meet Transport Permission',
      eventDate: '28 Nov 2026',
      destination: 'Sarusajai Stadium',
      fee: 'Free',
      status: 'Approved',
      parentNotes: 'Permitted to travel by school sports bus.'
    }
  ],

  // Messages / Communication
  messages: [
    {
      id: 'MSG-1',
      sender: 'School Office',
      senderRole: 'admin',
      recipientId: 'TCH-012',
      recipientName: 'Mr. R. Das',
      date: '09 Nov 2026, 09:30 AM',
      text: 'Please submit the monthly progress remarks for Class VIII-B by this Friday afternoon.'
    },
    {
      id: 'MSG-2',
      sender: 'Farida Ahmed (Parent)',
      senderRole: 'parent',
      recipientId: 'TCH-012',
      recipientName: 'Mr. R. Das',
      date: '08 Nov 2026, 06:15 PM',
      text: 'Good evening Sir. Nisha was absent on Monday due to tooth pain. We have submitted the medical note.'
    }
  ]
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
      console.warn('Could not read from localStorage, using seed defaults', e);
    }
    return JSON.parse(JSON.stringify(defaultSeedData));
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
    this.notify();
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(defaultSeedData));
    this.save();
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

  getActiveStudent() {
    return this.data.users.students.find(s => s.id === this.data.activeStudentId) || this.data.users.students[0];
  }

  getActiveTeacher() {
    return this.data.users.teachers.find(t => t.id === this.data.activeTeacherId) || this.data.users.teachers[0];
  }

  getAdmin() {
    return this.data.users.admin;
  }

  // Attendance
  markAttendance(dateStr, studentId, status) {
    if (!this.data.attendance[dateStr]) {
      this.data.attendance[dateStr] = {};
    }
    this.data.attendance[dateStr][studentId] = status;
    
    // Recalculate attendance percentage
    this.recalculateAttendance(studentId);
    this.save();
  }

  saveBulkAttendance(dateStr, classRecords) {
    if (!this.data.attendance[dateStr]) {
      this.data.attendance[dateStr] = {};
    }
    Object.assign(this.data.attendance[dateStr], classRecords);
    
    // Recalculate all affected students
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

    const student = this.data.users.students.find(s => s.id === studentId);
    if (student && totalDays > 0) {
      student.attendanceRate = Math.round((presentDays / totalDays) * 100);
    }
  }

  getAttendanceForDate(dateStr) {
    return this.data.attendance[dateStr] || {};
  }

  // Homework
  addHomework({ title, subject, targetClass, dueDate, description, attachmentName, attachmentSize }) {
    const newHw = {
      id: 'HW-' + Date.now().toString().slice(-4),
      class: targetClass,
      subject,
      title,
      teacher: this.getActiveTeacher().name,
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
    const student = this.data.users.students.find(s => s.id === studentId) || this.getActiveStudent();
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

    // Remove existing if resubmitting
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
    const feeObj = this.data.fees[studentId];
    if (!feeObj) return null;

    const receiptNo = 'REC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const txnId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    const numAmount = Number(amount);

    feeObj.paid += numAmount;
    feeObj.due = Math.max(0, feeObj.total - feeObj.paid);

    feeObj.paymentHistory.unshift({
      id: txnId,
      date: new Date().toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      amount: numAmount,
      method: paymentMethod || 'Online Gateway',
      receiptNo,
      status: 'Success',
      notes: 'Online fee payment'
    });

    feeObj.items.forEach(item => {
      if (item.status === 'Due') {
        item.status = 'Paid';
        item.receiptNo = receiptNo;
        item.date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      }
    });

    if (feeObj.due <= 0) {
      feeObj.admitEligibility = 'Eligible';
      feeObj.admitEligibleReason = 'All dues cleared';
    }

    this.save();
    return { receiptNo, txnId, amount: numAmount };
  }

  recordOfflineFee(studentId, amount, method, refNo, notes) {
    const feeObj = this.data.fees[studentId];
    if (!feeObj) return null;

    const receiptNo = refNo || ('OFF-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000));
    const txnId = 'OFF-TXN-' + Math.floor(10000 + Math.random() * 90000);
    const numAmount = Number(amount);

    feeObj.paid += numAmount;
    feeObj.due = Math.max(0, feeObj.total - feeObj.paid);

    feeObj.paymentHistory.unshift({
      id: txnId,
      date: new Date().toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      amount: numAmount,
      method: 'Counter (' + method + ')',
      receiptNo,
      status: 'Verified & Recorded',
      notes: notes || 'Offline payment verified at school counter'
    });

    feeObj.items.forEach(item => {
      if (item.status === 'Due' && feeObj.due <= 0) {
        item.status = 'Paid';
        item.receiptNo = receiptNo;
        item.date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      }
    });

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
    const student = this.data.users.students.find(s => s.id === studentId) || this.getActiveStudent();
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
      sender = `${st.parentName} (${st.name}'s Parent)`;
    } else if (role === 'teacher') {
      sender = this.getActiveTeacher().name;
    } else {
      sender = 'School Office';
    }

    const msg = {
      id: 'MSG-' + Date.now().toString().slice(-4),
      sender,
      senderRole: role,
      recipientId: recipientId || 'TCH-012',
      recipientName: recipientName || 'Class Teacher',
      date: new Date().toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      text
    };
    this.data.messages.unshift(msg);
    this.save();
    return msg;
  }

  // Students & Staff management (Admin)
  addStudent(studentData) {
    const id = 'EDU-' + Math.floor(200 + Math.random() * 800);
    const newStudent = {
      id,
      name: studentData.name,
      class: studentData.class || 'Class VIII-B',
      roll: studentData.roll || '99',
      parentName: studentData.parentName || 'Parent Name',
      parentPhone: studentData.parentPhone || '+91 90000 00000',
      dob: studentData.dob || '2012-01-01',
      bloodGroup: studentData.bloodGroup || 'A+',
      address: studentData.address || 'Guwahati',
      avatar: '🧑‍🎓',
      classTeacher: 'Mr. R. Das',
      room: 'Room 4',
      academicYear: '2026–27',
      attendanceRate: 100,
      schoolName: 'Green Valley High School'
    };
    this.data.users.students.push(newStudent);

    // Init fee record
    this.data.fees[id] = {
      total: 8000,
      paid: 0,
      due: 8000,
      items: [
        { id: 'FEE-1', name: 'Tuition Fee (Term 2)', amount: 5000, status: 'Due', dueDate: '20 Nov 2026' },
        { id: 'FEE-2', name: 'Development & Sports Fee', amount: 1500, status: 'Due', dueDate: '20 Nov 2026' },
        { id: 'FEE-3', name: 'Term Fee Balance', amount: 1500, status: 'Due', dueDate: '20 Nov 2026' }
      ],
      paymentHistory: [],
      admitEligibility: 'Not Eligible',
      admitEligibleReason: 'Pending balance ₹8,000'
    };

    this.save();
    return newStudent;
  }
}

// Global singleton instance
window.appStore = new Store();
