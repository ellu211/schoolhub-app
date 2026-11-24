# SchoolHub — Unified School Management System

> Production-ready Web Application & Google Play Store Android Package for Students, Parents, Teachers, and School Administrators.

## Overview
SchoolHub transforms static school prototypes into a fully integrated, reactive multi-role educational portal. It connects Student, Teacher, and Administrator operations with persistent state, offline PWA capabilities, and native Android packaging configuration.

---

## Architecture & Features

### 1. Student & Parent Portal
- **Dashboard:** Daily class schedule, real-time attendance percentage, pending homework counter, upcoming exams, fee alert banners, and direct contact with class teachers.
- **Timetable:** Interactive weekly period scheduler (Periods 1–7) with room numbers and faculty details.
- **Attendance Register:** Interactive monthly calendar with color-coded day states (Present, Absent, Leave).
- **Homework & Submissions:** Download teacher study materials/worksheets and upload student assignments (PDFs, docs, images) with comment notes. View teacher grades and feedback.
- **Academic Results:** Comprehensive mark cards with subject breakdown, percentage, GPA grades, and teacher progress remarks.
- **Fee Management:** Live fee ledger (Tuition, Development, Term Balance), instant online payment flow with official printable fee receipts (`REC-2026-xxx`), and offline payment counter tracking.
- **Official Admit Card (Hall Ticket):** Automatically unlocks once term fee dues are cleared, featuring a printable/downloadable format with candidate photo, exam timetable, and digital verification seal.
- **Multi-Ward Switching:** Single parent account manages multiple enrolled children (e.g., Nisha Ahmed Class VIII-B and Arman Ahmed Class V-A).
- **Services:** Library book due-date tracking, leave application workflow with approval tracking, and digital consent slips.

### 2. Teacher Portal
- **Teacher Dashboard:** Daily teaching overview, active classes, student counts, and pending assignment reviews.
- **Daily Attendance Register:** Rapid attendance taker with single-click cycle toggle (Present / Absent / Leave), "Mark All Present", and instant sync to parent and admin records.
- **Homework Uploader & Grading Desk:** Publish new homework with file attachments, view student submissions, assign scores/grades (A+, A, B, etc.), and send constructive feedback.
- **Teaching Timetable:** Class periods and room allocations across assigned sections.
- **Class Roster:** Searchable student directory for assigned classes with parent phone contacts.
- **Class Notice Board & Messaging:** Broadcast section notices and communicate with school office or parents.

### 3. Admin & Management Portal
- **Executive Control Center:** High-level school KPIs (840+ students, 48 faculty, outstanding fee balances, pending approvals).
- **Student Admissions & Information System:** Search, filter by class, and enroll new students with automated fee ledger creation.
- **Faculty Directory:** Staff subjects, appointed classes, and contact directory.
- **Fee Collection & Counter Ledger:** Record cash, bank transfer, and cheque payments made at the school counter with receipt reference numbers, automatically clearing student dues and unlocking hall tickets.
- **Academic Setup:** Timetable structures and examination configurations.
- **Pending Approvals Desk:** Process leave applications and consent requests with approval remarks.
- **Reports & Analytics:** Attendance trends and fee collection metrics.

---

## Project Structure
```
schoolhub-app/
├── index.html                  # Main SPA entry point & responsive shell
├── manifest.webmanifest        # PWA Web App Manifest for Google Play & TWA
├── manifest.json               # Legacy fallback manifest
├── sw.js                       # Service Worker for offline caching & background sync
├── capacitor.config.json       # Capacitor Android configuration (com.schoolhub.app)
├── package.json                # Project dependencies and runner scripts
├── README.md                   # Project overview & documentation
├── css/
│   ├── main.css                # Typography, design tokens & reset
│   ├── layout.css              # Desktop sidebar & mobile bottom navigation
│   ├── components.css          # Cards, buttons, tables, forms, modals & toasts
│   ├── portals.css             # Portal views, calendar, homework & admit cards
│   └── print.css               # Print media rules for receipts & admit cards
├── js/
│   ├── store.js                # Reactive store with localStorage persistence & mock data
│   ├── app.js                  # Application coordinator, router & network monitor
│   ├── portals/
│   │   ├── student.js          # Student & Parent portal controller
│   │   ├── teacher.js          # Teacher portal controller
│   │   └── admin.js            # Admin portal controller
│   └── components/
│       ├── toast.js            # Mobile haptic-ready toast alerts
│       ├── modal.js            # Universal accessible modal system
│       └── print.js            # Document printer for receipts & admit cards
├── assets/
│   ├── icons/                  # 192x192 & 512x512 app icons
│   └── graphics/               # 1024x500 Google Play Store feature graphic
├── android/
│   ├── AndroidManifest.xml     # Production Android Manifest with permissions
│   ├── build.gradle            # App-level Gradle script
│   └── PLAYSTORE_GUIDE.md      # Detailed Google Play Console submission guide
└── legal/
    └── privacy-policy.html     # Google Play compliant Privacy Policy
```

---

## How to Run & Test Locally

You can run SchoolHub using any local HTTP server:

### Option A: Using Python (Built-in)
```bash
cd C:\Users\elias\.gemini\antigravity\scratch\schoolhub-app
python -m http.server 8080
```
Then open: **`http://localhost:8080`** in your browser.

### Option B: Using Node / npx
```bash
cd C:\Users\elias\.gemini\antigravity\scratch\schoolhub-app
npx serve -l 8080 .
```

---

## Publishing to Google Play Store

See the complete guide in [`android/PLAYSTORE_GUIDE.md`](file:///C:/Users/elias/.gemini/antigravity/scratch/schoolhub-app/android/PLAYSTORE_GUIDE.md) for:
1. Building `.aab` / `.apk` via Capacitor or PWABuilder / Bubblewrap.
2. Generating a signed release keystore.
3. Meeting Google Play policy requirements (Privacy Policy, Data Safety, Content Rating).
