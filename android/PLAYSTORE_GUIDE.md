# Google Play Store Release & Packaging Guide for SchoolHub

This guide details how to package **SchoolHub** into a production-grade Android App (`.aab` / `.apk`) ready for the Google Play Console.

---

## Method 1: Using Capacitor & Android Studio (Recommended)

Capacitor wraps the web application in a high-performance Android WebKit shell with native plugin access.

### Prerequisites
- Node.js installed
- [Android Studio](https://developer.android.com/studio) installed with Android SDK (API Level 34+).

### Step-by-Step Build Commands

1. **Install Capacitor Dependencies**:
   ```bash
   cd C:\Users\elias\.gemini\antigravity\scratch\schoolhub-app
   npm install --save-dev @capacitor/core @capacitor/cli @capacitor/android
   ```

2. **Initialize & Add Android Platform**:
   ```bash
   npx cap init SchoolHub com.schoolhub.app --web-dir .
   npx cap add android
   ```

3. **Sync Assets to Android Project**:
   ```bash
   npx cap copy android
   npx cap sync android
   ```

4. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```

5. **Generate Signed Android App Bundle (.aab)**:
   - In Android Studio, click **Build** > **Generate Signed Bundle / APK**.
   - Select **Android App Bundle (.aab)** (mandatory for Google Play).
   - Create or select your release keystore:
     ```bash
     keytool -genkey -v -keystore schoolhub-release-key.jks -alias schoolhub -keyalg RSA -keysize 2048 -validity 10000
     ```
   - Select Build Variant: `release`.
   - Android Studio will generate `app-release.aab` in `android/app/release/`.

---

## Method 2: Using PWABuilder or Google Bubblewrap (Fastest 0-Code Method)

Because SchoolHub is built as a complete PWA with `manifest.webmanifest`, `sw.js`, and offline service worker caching, it qualifies for **Google Trusted Web Activity (TWA)**.

1. Deploy the `schoolhub-app` folder to any HTTPS hosting (Netlify, Vercel, Firebase Hosting, or Cloudflare Pages).
2. Go to [PWABuilder.com](https://www.pwabuilder.com/).
3. Enter your deployed URL.
4. Click **Package for Android** > **Download Package**.
5. PWABuilder produces a signed `.aab` file ready to drag-and-drop into the Google Play Console!

Or using Google's official Bubblewrap CLI:
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest="https://your-domain.com/manifest.webmanifest"
bubblewrap build
```

---

## Google Play Console Submission Checklist

### 1. Store Listing Details
- **App Name:** SchoolHub — School Management System
- **Short Description (80 chars max):** Unified school portal for students, parents, teachers, and administrators.
- **Full Description:**
  > SchoolHub is an all-in-one institutional school management system designed to connect classrooms, parents, teachers, and school leadership in real time.
  >
  > Key Features:
  > • Student & Parent Portal: View daily period timetables, monthly attendance registers, homework worksheets, examination results, and official admit cards (hall tickets).
  > • Seamless Multi-Ward Switching: Parents with multiple children can switch between student profiles with one tap.
  > • Fee Management & Official Receipts: View term fee dues, verify offline counter cash receipts, and instantly unlock examination admit cards upon fee clearance.
  > • Teacher Desk: Mark real-time classroom attendance with single-tap toggle, upload homework with PDF attachments, grade student submissions, and post class announcements.
  > • Administration Control Center: Manage student admissions, staff directory, counter cash/cheque fee ledger with full audit trails, and broadcast school-wide circulars.
  > • Offline Capable: Designed with offline caching to review timetables, homework, and profiles even in low-connectivity areas.
- **Category:** Education / Productivity

### 2. Graphic Assets
- **App Icon:** 512 x 512 px PNG (Located at `assets/icons/icon-512.svg`, exportable to PNG)
- **Feature Graphic:** 1024 x 500 px PNG (Located at `assets/graphics/feature-graphic.svg`)
- **Phone Screenshots:** At least 2 screenshots (minimum 320px, maximum 3840px, 16:9 or 9:16 aspect ratio).
- **7-inch & 10-inch Tablet Screenshots:** Recommended for school management apps.

### 3. Policy & App Content Declarations
- **Privacy Policy URL:** Host `legal/privacy-policy.html` and provide the public URL. (Mandatory under Google Play policy).
- **Target Age:** Select **Ages 6–8, 9–12, 13–15, 16–17, and 18+** or target parents/educators under Families policy.
- **App Access:** Under "App Access" in Play Console, select *All or some functionality is restricted* and provide demo credentials:
  - Role: Student (Nisha Ahmed, Class VIII-B)
  - Role: Teacher (Mr. R. Das)
  - Role: Admin (School Administrator)
- **Data Safety Form:**
  - Data collected: Name, Student ID, Phone Number (for parent contact), Photos/Files (optional for assignment uploads).
  - Data encrypted in transit: Yes (TLS/HTTPS).
  - Users can request data deletion: Yes.
