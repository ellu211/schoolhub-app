/**
 * SchoolHub - Document Generation & Printing Helper
 * Prints and exports Fee Receipts, Admit Cards, and Report Cards.
 */

window.docPrinter = {
  printReceipt(paymentRecord, student) {
    const html = `
      <div class="print-doc receipt-print">
        <div class="doc-header">
          <div class="doc-brand">
            <h2>🏫 GREEN VALLEY HIGH SCHOOL</h2>
            <p>Affiliated to State Board & CBSE • Recognition No. GVH/2014/991</p>
            <p>14 Hillview Campus, Dispur, Guwahati - 781006 | Ph: +91 361 245 9000</p>
          </div>
          <div class="doc-title-badge">FEE PAYMENT RECEIPT (OFFICIAL)</div>
        </div>

        <div class="doc-grid">
          <div><strong>Receipt No:</strong> ${paymentRecord.receiptNo}</div>
          <div><strong>Transaction ID:</strong> ${paymentRecord.id}</div>
          <div><strong>Date:</strong> ${paymentRecord.date}</div>
          <div><strong>Payment Mode:</strong> ${paymentRecord.method}</div>
        </div>

        <hr class="doc-divider">

        <div class="doc-grid">
          <div><strong>Student Name:</strong> ${student.name}</div>
          <div><strong>Student ID:</strong> ${student.id}</div>
          <div><strong>Class & Section:</strong> ${student.class}</div>
          <div><strong>Roll Number:</strong> ${student.roll}</div>
          <div><strong>Parent/Guardian:</strong> ${student.parentName}</div>
          <div><strong>Academic Year:</strong> ${student.academicYear || '2026–27'}</div>
        </div>

        <table class="doc-table">
          <thead>
            <tr>
              <th>Description / Fee Head</th>
              <th style="text-align:right">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Term 2 Academic & Tuition Fee Balance</td>
              <td style="text-align:right">₹${paymentRecord.amount.toLocaleString('en-IN')}</td>
            </tr>
            <tr class="doc-total-row">
              <td><strong>Total Amount Paid</strong></td>
              <td style="text-align:right"><strong>₹${paymentRecord.amount.toLocaleString('en-IN')}</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="doc-footer">
          <div class="doc-qr-placeholder">
            <div style="font-size:32px">🔲</div>
            <span style="font-size:10px">Digitally Verified Document<br>UID: ${paymentRecord.receiptNo}</span>
          </div>
          <div class="doc-signature">
            <p style="margin-bottom:30px">Authorised Signatory / Accounts Office</p>
            <p><strong>GREEN VALLEY SCHOOL ACCOUNTS</strong></p>
          </div>
        </div>
      </div>
    `;

    this._triggerPrint(html);
  },

  printAdmitCard(student, examName = 'Unit Test 2 — November 2026') {
    const html = `
      <div class="print-doc admit-print">
        <div class="doc-header">
          <div class="doc-brand">
            <h2>🏫 GREEN VALLEY HIGH SCHOOL</h2>
            <p>EXAMINATION BOARD ADMIT CARD (HALL TICKET)</p>
          </div>
          <div class="doc-badge-green">STATUS: VERIFIED & ELIGIBLE</div>
        </div>

        <div class="admit-body">
          <div class="admit-info">
            <table class="doc-table compact">
              <tr><td><strong>Candidate Name:</strong></td><td>${student.name}</td></tr>
              <tr><td><strong>Student ID:</strong></td><td>${student.id}</td></tr>
              <tr><td><strong>Class / Section:</strong></td><td>${student.class}</td></tr>
              <tr><td><strong>Roll Number:</strong></td><td>${student.roll}</td></tr>
              <tr><td><strong>Examination:</strong></td><td>${examName}</td></tr>
              <tr><td><strong>Examination Center:</strong></td><td>Room 4 & Main Hall, Block A</td></tr>
            </table>
          </div>
          <div class="admit-photo-box">
            <div style="font-size:55px;text-align:center">${student.avatar || '👩‍🎓'}</div>
            <span style="display:block;text-align:center;font-size:10px;margin-top:5px">Student Photo</span>
          </div>
        </div>

        <h4 style="margin:15px 0 8px">EXAMINATION TIMETABLE SCHEDULE</h4>
        <table class="doc-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Subject</th>
              <th>Invigilator Sign</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>24 Nov 2026</td><td>09:00 AM – 11:30 AM</td><td>Mathematics</td><td>________________</td></tr>
            <tr><td>25 Nov 2026</td><td>09:00 AM – 11:30 AM</td><td>General Science</td><td>________________</td></tr>
            <tr><td>26 Nov 2026</td><td>09:00 AM – 11:30 AM</td><td>English Language & Lit</td><td>________________</td></tr>
            <tr><td>27 Nov 2026</td><td>09:00 AM – 11:30 AM</td><td>Social Science</td><td>________________</td></tr>
            <tr><td>28 Nov 2026</td><td>09:00 AM – 11:30 AM</td><td>Assamese / Hindi</td><td>________________</td></tr>
          </tbody>
        </table>

        <div class="admit-rules">
          <strong>Important Instructions:</strong>
          <ol style="margin:5px 0;padding-left:18px;font-size:11px">
            <li>Candidates must carry this admit card to the exam hall daily.</li>
            <li>No mobile phones, electronic smartwatches or calculators are permitted.</li>
            <li>Be seated 15 minutes before the exam commences.</li>
          </ol>
        </div>

        <div class="doc-footer" style="margin-top:25px">
          <div>Candidate Signature: __________________</div>
          <div>Principal Signature: __________________</div>
        </div>
      </div>
    `;

    this._triggerPrint(html);
  },

  _triggerPrint(html) {
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>SchoolHub Document</title>
        <link rel="stylesheet" href="css/print.css">
        <style>
          body { font-family: system-ui, Arial, sans-serif; color: #111; margin: 20px; }
          .print-doc { max-width: 750px; margin: 0 auto; border: 1px solid #ccc; padding: 25px; border-radius: 8px; }
          .doc-header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 15px; margin-bottom: 15px; }
          .doc-brand h2 { margin: 0 0 5px; font-size: 20px; }
          .doc-brand p { margin: 2px 0; font-size: 11px; color: #444; }
          .doc-title-badge { display: inline-block; background: #eaf2f8; color: #144e7e; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 13px; margin-top: 8px; border: 1px solid #c2dcf0; }
          .doc-badge-green { display: inline-block; background: #e6f9ed; color: #12824e; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 12px; margin-top: 6px; }
          .doc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; margin: 12px 0; }
          .doc-divider { border: 0; border-top: 1px solid #eee; margin: 12px 0; }
          .doc-table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 15px 0; }
          .doc-table th, .doc-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .doc-table th { background: #f5f5f5; font-size: 12px; }
          .doc-table.compact td { border: none; padding: 4px 0; }
          .admit-body { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 10px; }
          .admit-photo-box { width: 110px; height: 130px; border: 1px dashed #888; border-radius: 6px; padding: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; }
          .doc-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px; font-size: 12px; }
          .doc-signature { text-align: right; }
          @media print {
            body { margin: 0; }
            .print-doc { border: none; padding: 0; }
          }
        </style>
      </head>
      <body>
        ${html}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.focus();
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      if (printFrame.parentNode) {
        document.body.removeChild(printFrame);
      }
    }, 5000);
  }
};
