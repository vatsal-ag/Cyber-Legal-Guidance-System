/**
 * ══════════════════════════════════════════════════════════════════════════════
 * CYBER LEGAL GUIDANCE SYSTEM — SHARED DATABASE & CROSS-PORTAL SYNC ENGINE (CLGS_DB)
 * ══════════════════════════════════════════════════════════════════════════════
 * Provides unified client-side storage, real-time cross-tab synchronization via
 * BroadcastChannel & localStorage storage events, and full CRUD GUI access for
 * both Citizen Complaint Drafter and Official Law Enforcement Command Portal.
 */

(function (global) {
  'use strict';

  // Biometric Placeholder SVGs for 4-Angle Verified Preview
  const BIO_SVGS = {
    blink: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
        <rect width="160" height="160" rx="12" fill="#0f172a"/>
        <circle cx="80" cy="72" r="42" fill="#1e293b" stroke="#334155" stroke-width="2"/>
        <!-- Eyes closed / Blink state -->
        <path d="M60 68 Q68 74 76 68" stroke="#10b981" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M84 68 Q92 74 100 68" stroke="#10b981" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M78 80 L82 80" stroke="#64748b" stroke-width="2" stroke-linecap="round"/>
        <path d="M72 95 Q80 101 88 95" stroke="#94a3b8" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <rect x="25" y="125" width="110" height="22" rx="6" fill="#064e3b"/>
        <text x="80" y="140" fill="#34d399" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">✓ LIVE BLINK PASS</text>
      </svg>
    `.trim()),

    profile_left: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
        <rect width="160" height="160" rx="12" fill="#0f172a"/>
        <!-- Left Profile head silhouette -->
        <path d="M95 38 C75 38 60 52 60 72 C60 76 56 80 52 82 C56 86 58 92 57 98 C65 106 78 110 90 110 C108 110 116 95 116 72 C116 50 108 38 95 38 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <circle cx="68" cy="70" r="3.5" fill="#38bdf8"/>
        <!-- 30 deg left arrow -->
        <path d="M38 72 L24 72 M28 66 L22 72 L28 78" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="25" y="125" width="110" height="22" rx="6" fill="#0c4a6e"/>
        <text x="80" y="140" fill="#38bdf8" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">✓ LEFT PROFILE 30°</text>
      </svg>
    `.trim()),

    profile_right: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
        <rect width="160" height="160" rx="12" fill="#0f172a"/>
        <!-- Right Profile head silhouette -->
        <path d="M65 38 C85 38 100 52 100 72 C100 76 104 80 108 82 C104 86 102 92 103 98 C95 106 82 110 70 110 C52 110 44 95 44 72 C44 50 52 38 65 38 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <circle cx="92" cy="70" r="3.5" fill="#38bdf8"/>
        <!-- 30 deg right arrow -->
        <path d="M122 72 L136 72 M132 66 L138 72 L132 78" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="25" y="125" width="110" height="22" rx="6" fill="#0c4a6e"/>
        <text x="80" y="140" fill="#38bdf8" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">✓ RIGHT PROFILE 30°</text>
      </svg>
    `.trim()),

    depth_3d: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
        <rect width="160" height="160" rx="12" fill="#0f172a"/>
        <circle cx="80" cy="72" r="42" fill="#1e293b" stroke="#818cf8" stroke-width="1.5" stroke-dasharray="3 3"/>
        <!-- Wireframe 3D grid lines -->
        <ellipse cx="80" cy="72" rx="30" ry="42" fill="none" stroke="#6366f1" stroke-width="1.2"/>
        <ellipse cx="80" cy="72" rx="15" ry="42" fill="none" stroke="#6366f1" stroke-width="1.2"/>
        <path d="M38 72 H122 M44 54 H116 M44 90 H116" stroke="#6366f1" stroke-width="1.2"/>
        <circle cx="68" cy="66" r="3" fill="#a5b4fc"/>
        <circle cx="92" cy="66" r="3" fill="#a5b4fc"/>
        <rect x="25" y="125" width="110" height="22" rx="6" fill="#312e81"/>
        <text x="80" y="140" fill="#c7d2fe" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">✓ 3D DEPTH PASS</text>
      </svg>
    `.trim())
  };

  const CLGS_DB = {
    STORAGE_KEY: 'clgs_official_complaints_db_v1',
    CHANNEL_NAME: 'clgs_cyber_portal_sync',
    channel: null,
    listeners: new Set(),

    init() {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        try {
          if (!this.channel) {
            this.channel = new BroadcastChannel(this.CHANNEL_NAME);
            this.channel.onmessage = (event) => {
              this.handleChannelMessage(event.data);
            };
          }
        } catch (e) {
          console.warn('BroadcastChannel init fallback:', e);
        }

        // Cross-window storage listener
        window.addEventListener('storage', (e) => {
          if (e.key === this.STORAGE_KEY) {
            this.notifyListeners({ type: 'STORAGE_SYNC', data: this.getAll() });
          }
        });
      }

      // Check if DB is empty; if so, populate initial realistic sample cases
      const existing = this.getAll();
      if (!existing || existing.length === 0) {
        this.seedSampleData(false);
      }
    },

    subscribe(fn) {
      if (typeof fn === 'function') {
        this.listeners.add(fn);
      }
      return () => this.listeners.delete(fn);
    },

    notifyListeners(payload) {
      this.listeners.forEach((fn) => {
        try {
          fn(payload);
        } catch (err) {
          console.error('CLGS_DB listener callback error:', err);
        }
      });
    },

    broadcast(type, payload) {
      const msg = { type, payload, timestamp: new Date().toISOString() };
      if (this.channel) {
        try {
          this.channel.postMessage(msg);
        } catch (e) {
          console.warn('Broadcast postMessage failed:', e);
        }
      }
      this.notifyListeners(msg);
    },

    handleChannelMessage(msg) {
      if (!msg) return;
      this.notifyListeners(msg);
    },

    getAll() {
      try {
        if (typeof localStorage === 'undefined') return [];
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.sort((a, b) => new Date(b.filedAt || 0) - new Date(a.filedAt || 0));
      } catch (err) {
        console.error('CLGS_DB.getAll error:', err);
        return [];
      }
    },

    getById(id) {
      const all = this.getAll();
      return all.find((c) => c.id === id) || null;
    },

    save(complaint) {
      if (!complaint) return null;
      const all = this.getAll();
      const now = new Date().toISOString();

      // Ensure stable ID
      if (!complaint.id) {
        const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
        complaint.id = `CYBER-2026-${rand}`;
      }

      if (!complaint.filedAt) {
        complaint.filedAt = now;
      }
      complaint.updatedAt = now;

      if (!complaint.status) {
        complaint.status = 'Pending Triage';
      }

      if (!complaint.caseDiary || !Array.isArray(complaint.caseDiary)) {
        complaint.caseDiary = [
          {
            timestamp: now,
            officerName: 'Intake System',
            officerBadge: 'PORTAL-BOT',
            action: 'Complaint Registered',
            notes: 'Citizen electronic FIR application and BSA Section 63 certificate filed successfully.'
          }
        ];
      }

      // Check if updating existing or inserting new
      const idx = all.findIndex((c) => c.id === complaint.id);
      let isNew = false;
      if (idx >= 0) {
        all[idx] = complaint;
      } else {
        isNew = true;
        all.unshift(complaint);
      }

      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
        }
      } catch (err) {
        console.error('CLGS_DB.save storage write error:', err);
      }

      this.broadcast(isNew ? 'NEW_COMPLAINT' : 'COMPLAINT_UPDATED', complaint);
      return complaint;
    },

    updateStatus(id, newStatus, officerNotes = '', officerName = 'Investigating Officer', officerBadge = 'LEO-2026') {
      const all = this.getAll();
      const target = all.find((c) => c.id === id);
      if (!target) return null;

      const now = new Date().toISOString();
      target.status = newStatus;
      target.updatedAt = now;

      if (newStatus === 'Golden Hour Freeze Notice Issued') {
        if (!target.financial) target.financial = {};
        target.financial.freezeNoticeIssued = true;
        target.financial.freezeNoticeDate = now;
      }

      if (!target.caseDiary) target.caseDiary = [];
      target.caseDiary.unshift({
        timestamp: now,
        officerName,
        officerBadge,
        action: `Status Updated to "${newStatus}"`,
        notes: officerNotes || `Official investigation status set to ${newStatus}.`
      });

      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
        }
      } catch (err) {
        console.error('CLGS_DB.updateStatus storage error:', err);
      }

      this.broadcast('STATUS_UPDATE', { id, newStatus, complaint: target });
      return target;
    },

    addCaseDiaryNote(id, notes, officerName = 'Investigating Officer', officerBadge = 'LEO-2026', action = 'Case Diary Entry') {
      const all = this.getAll();
      const target = all.find((c) => c.id === id);
      if (!target) return null;

      const now = new Date().toISOString();
      if (!target.caseDiary) target.caseDiary = [];
      target.caseDiary.unshift({
        timestamp: now,
        officerName,
        officerBadge,
        action,
        notes
      });
      target.updatedAt = now;

      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
        }
      } catch (err) {
        console.error('CLGS_DB.addCaseDiaryNote storage error:', err);
      }

      this.broadcast('CASE_DIARY_ADDED', { id, notes, complaint: target });
      return target;
    },

    delete(id) {
      let all = this.getAll();
      const initialLen = all.length;
      all = all.filter((c) => c.id !== id);
      if (all.length !== initialLen) {
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
          }
        } catch (err) {
          console.error('CLGS_DB.delete storage error:', err);
        }
        this.broadcast('COMPLAINT_DELETED', { id });
        return true;
      }
      return false;
    },

    clear() {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(this.STORAGE_KEY);
        }
      } catch (err) {
        console.error('CLGS_DB.clear storage error:', err);
      }
      this.broadcast('DATABASE_CLEARED', {});
    },

    exportJSON() {
      const all = this.getAll();
      return JSON.stringify(all, null, 2);
    },

    importJSON(jsonString) {
      try {
        const parsed = JSON.parse(jsonString);
        if (!Array.isArray(parsed)) {
          throw new Error('Import payload must be a JSON array of complaint objects.');
        }
        const existing = this.getAll();
        const map = new Map();
        existing.forEach((item) => map.set(item.id, item));
        parsed.forEach((item) => {
          if (item && item.id) map.set(item.id, item);
        });
        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(b.filedAt || 0) - new Date(a.filedAt || 0)
        );

        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(merged));
        }
        this.broadcast('DATABASE_IMPORTED', { count: merged.length });
        return merged.length;
      } catch (err) {
        console.error('CLGS_DB.importJSON failed:', err);
        throw err;
      }
    },

    generateFreezeNoticeText(complaint, officer = { name: 'Insp. Vikramaditya Singh', rank: 'Inspector of Police / IO', station: 'Cyber Crime Police Station, Central District', badge: 'LEO-2026-IND' }) {
      if (!complaint) return '';
      const c = complaint;
      const currentDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
      const fin = c.financial || {};
      const susp = c.suspect || {};
      const amt = fin.amount || '0';
      const utr = fin.utr || 'N/A';
      const targetAcc = susp.bank || fin.suspectTarget || 'N/A';
      const targetUpi = susp.upi || 'N/A';

      return `================================================================================
              OFFICE OF THE INVESTIGATING OFFICER / NODAL CYBER CELL
                      POLICE HEADQUARTERS, LAW ENFORCEMENT
================================================================================
DISPATCH REF : LEO/CYBER/BNSS-106/EMERGENCY/${c.id}
DATE         : ${currentDate}
URGENCY      : CRITICAL / GOLDEN HOUR ACTION MANDATORY WITHIN 120 MINUTES

TO,
1. THE NODAL CYBER CRIME DESK / BRANCH MANAGER,
   BANK / PAYMENT AGGREGATOR / INTERMEDIARY
2. NODAL FRAUD MITIGATION OFFICER (I4C / 1930 NETWORK)

SUBJECT: STATUTORY ORDER FOR IMMEDIATE FREEZING / LIEN MARKING OF ACCOUNTS & PRESERVATION OF AUDIT LOGS UNDER SECTION 106 OF BHARATIYA NAGARIK SURAKSHA SANHITA (BNSS), 2023 READ WITH SECTION 91 CRPC / SECTION 69B IT ACT, 2000.

Case Reference: Case FIR Application #${c.id}
Crime Category: ${c.incident?.crimeLabel || c.incident?.crimeType || 'Organized Cyber Financial Fraud'}
Complainant   : ${c.complainant?.name} (Contact: ${c.complainant?.phone})

1. WHEREAS, a cognizable cyber crime complaint has been registered before this authority disclosing unauthorized exfiltration of ₹${amt}/- defrauded via deceptive inducements / cyber coercion;

2. AND WHEREAS, credible transaction tracking and digital evidence verify that defrauded funds have been routed into the following beneficiary destination maintained at your financial institution:
   • Suspect Beneficiary Account: ${targetAcc}
   • Suspect Beneficiary UPI ID  : ${targetUpi}
   • Transaction UTR / Ref No    : ${utr}
   • Transaction Date / Time     : ${c.incident?.date || 'N/A'} at ${c.incident?.time || 'N/A'}

3. NOW THEREFORE, by virtue of statutory powers conferred under Section 106 of the Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS), you are HEREBY DIRECTED TO:
   (a) IMMEDIATELY FREEZE / PUT TOTAL DEBIT LIEN on the said beneficiary account/wallet up to the amount of ₹${amt}/- to prevent further layer transfers to mule accounts.
   (b) PRESERVE and furnish within 24 hours the full Account Opening Form (AOF), KYC Documents (Aadhaar/PAN), registered mobile number, IP Access Logs, and 6-month Bank Account Statement in searchable .XLSX / .CSV format.
   (c) FURNISH end-to-end forward money-trail details if the said funds have been further moved to secondary/tertiary beneficiary accounts.

TAKE NOTE: Non-compliance with this lawful order constitutes a penal offence under Section 223 of Bharatiya Nyaya Sanhita, 2023 (BNS) [Disobedience to order duly promulgated by public servant] and Section 44 of the Information Technology Act, 2000.


____________________________________________________________
INVESTIGATING OFFICER (IO):
Name   : ${officer.name}
Rank   : ${officer.rank}
Station: ${officer.station}
Badge  : ${officer.badge}
Email  : cybercell.nodal@police.gov.in / National Helpline: 1930
================================================================================`;
    },

    seedSampleData(force = false) {
      if (!force && typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw && raw !== '[]') return;
      }

      const sampleCases = [
        {
          id: 'CYBER-2026-DA8921',
          filedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          status: 'Golden Hour Freeze Notice Issued',
          priority: 'Priority 1 (Govt Spoof / Digital Arrest)',
          complainantMode: 'citizen',
          complainant: {
            name: 'Dr. Ramesh Chandra Sen',
            phone: '+91-98112-34567',
            email: 'dr.rcsen.cardio@medmail.in',
            address: 'B-42, Anand Niketan, Chanakyapuri Diplomatic Enclave',
            city: 'New Delhi',
            state: 'Delhi',
            pincode: '110021'
          },
          incident: {
            date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
            time: '10:45 AM',
            platform: 'Cellular Call & Skype Video',
            crimeType: 'digital_arrest',
            crimeLabel: 'Digital Arrest & Law Enforcement Impersonation',
            narration: 'Complainant received call from accused posing as FedEx Mumbai stating courier containing passport & 140g MDMA intercepted. Transferred call to fake Mumbai Cyber Cell / CBI officer on Skype who displayed forged Supreme Court arrest warrants and coerced RTGS payment to fake RBI escrow.',
            chronology: [
              { time: '10:45 AM', channel: 'Cellular Voice Call', desc: 'Call from +91-98765-43210 claiming FedEx courier interception.', amount: '0' },
              { time: '11:15 AM', channel: 'Skype Video Call', desc: 'Mock CBI room with uniform officers and forged arrest warrant.', amount: '0' },
              { time: '01:30 PM', channel: 'RTGS Wire Transfer', desc: 'Forced RTGS transfer to alleged RBI Supervisory Escrow.', amount: '45,00,000' }
            ]
          },
          financial: {
            amount: '45,00,000',
            utr: 'AXIS20261019001923',
            victimBank: 'State Bank of India (SBI) A/C ending in 4102',
            suspectTarget: 'Axis Bank A/C 924020087612984 (IFSC: UTIB0001423)',
            freezeNoticeIssued: true,
            freezeNoticeDate: new Date(Date.now() - 3600000).toISOString()
          },
          suspect: {
            phone: '+91-98765-43210',
            upi: 'cbi.escrow.verify@axl',
            bank: 'Axis Bank A/C 924020087612984 (IFSC: UTIB0001423)',
            url: 'https://cbi-narcotics-supervisory-gov.in.fakewarrant.com'
          },
          biometrics: {
            isVerified: true,
            verifiedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
            score: 99.2,
            antiSpoofVerdict: 'PASSED (Natural Eye-Blink & 3D Contour Validated)',
            snapshots: {
              center: BIO_SVGS.blink,
              turn_left: BIO_SVGS.profile_left,
              turn_right: BIO_SVGS.profile_right,
              tilt_vertical: BIO_SVGS.depth_3d
            }
          },
          evidence: [
            {
              name: 'SBI_Debit_Advice_RTGS_45L.pdf',
              category: 'Bank Transaction Proof',
              size: '342 KB',
              type: 'application/pdf',
              timestamp: '2026-10-31 13:40 IST',
              sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
              forensic: { verdict: 'CLEAN', score: 99.4, elaUniformity: 'High', software: 'SBI NetBanking Core v4' }
            },
            {
              name: 'Forged_CBI_Supreme_Court_Warrant.png',
              category: 'Deceptive Police Instrument',
              size: '1.2 MB',
              type: 'image/png',
              timestamp: '2026-10-31 11:20 IST',
              sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
              forensic: { verdict: 'DOCTORED (Forged Seal)', score: 92.1, elaUniformity: 'Tampered Header', software: 'Adobe Photoshop 2024' }
            },
            {
              name: 'Skype_Call_Screenshot_Fake_Police_Desk.png',
              category: 'Audio-Visual Call Capture',
              size: '890 KB',
              type: 'image/png',
              timestamp: '2026-10-31 11:35 IST',
              sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
              forensic: { verdict: 'AUTHENTIC CAPTURE', score: 98.7, elaUniformity: 'Uniform Bitstream', software: 'macOS Screen Capture' }
            }
          ],
          policeStation: 'Cyber Crime Police Station, Central District, Mandir Marg, New Delhi',
          caseDiary: [
            {
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              officerName: 'Insp. Vikramaditya Singh',
              officerBadge: 'LEO-DL-2026-89',
              action: 'BNSS §106 Notice Served on Axis Bank Nodal Officer',
              notes: 'Immediate debit freeze notice served electronically and by phone on Axis Bank Nodal Desk. ₹45,00,000 lien placed before mule dispersal.'
            },
            {
              timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
              officerName: 'Intake System',
              officerBadge: 'PORTAL-AUTO',
              action: 'Automated FIR Draft & BSA §63 Certificate Created',
              notes: 'Priority 1 Flag raised due to Public Servant Personation (BNS 204/319).'
            }
          ]
        },
        {
          id: 'CYBER-2026-UP4412',
          filedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          status: 'Under Active Investigation',
          priority: 'Priority 2 (High-Value Financial)',
          complainantMode: 'citizen',
          complainant: {
            name: 'Priya Sharma',
            phone: '+91-94481-22901',
            email: 'priya.sharma.dev@gmail.com',
            address: 'Flat 402, Royal Palms, Koramangala 4th Block',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560034'
          },
          incident: {
            date: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10),
            time: '02:15 PM',
            platform: 'OLX & WhatsApp UPI',
            crimeType: 'upi_fraud',
            crimeLabel: 'Armed Forces QR Code / OLX Payment Scam',
            narration: 'Complainant listed sofa set on OLX. Accused called claiming to be Indian Army Subedar posted at ASC Centre. Sent QR code falsely claiming scanning it was mandatory to receive army advance payment; debited ₹75,000 instead.',
            chronology: [
              { time: '02:00 PM', channel: 'OLX In-App Chat', desc: 'Buyer agreed on price without bargaining.', amount: '0' },
              { time: '02:15 PM', channel: 'WhatsApp Voice Call', desc: 'Accused sent QR code marked "Indian Army Canteen Advance Credit".', amount: '0' },
              { time: '02:22 PM', channel: 'PhonePe Debit', desc: 'Victim scanned and entered UPI PIN; ₹75,000 debited in 3 bursts.', amount: '75,000' }
            ]
          },
          financial: {
            amount: '75,000',
            utr: 'SBI20261021448912',
            victimBank: 'HDFC Bank Savings A/C ending in 8831',
            suspectTarget: 'subedar.army.canteen@sbi / SBI A/C 38291029312',
            freezeNoticeIssued: false
          },
          suspect: {
            phone: '+91-87654-32109',
            upi: 'subedar.army.canteen@sbi',
            bank: 'State Bank of India A/C 38291029312 (IFSC: SBIN0001042)',
            url: 'N/A'
          },
          biometrics: {
            isVerified: true,
            verifiedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
            score: 97.8,
            antiSpoofVerdict: 'PASSED (Natural Eye-Blink & 3D Contour Validated)',
            snapshots: {
              center: BIO_SVGS.blink,
              turn_left: BIO_SVGS.profile_left,
              turn_right: BIO_SVGS.profile_right,
              tilt_vertical: BIO_SVGS.depth_3d
            }
          },
          evidence: [
            {
              name: 'OLX_Chat_and_Army_ID_Forgery.png',
              category: 'Social Engineering Record',
              size: '640 KB',
              type: 'image/png',
              timestamp: '2026-10-30 14:30 IST',
              sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f901234567890abcdef1234567890abcdef',
              forensic: { verdict: 'CLEAN CAPTURE', score: 99.1, elaUniformity: 'Uniform', software: 'Android OS Screenshot' }
            },
            {
              name: 'PhonePe_Debited_Transaction_Slip.pdf',
              category: 'Payment Gateway Advice',
              size: '120 KB',
              type: 'application/pdf',
              timestamp: '2026-10-30 14:25 IST',
              sha256: 'fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
              forensic: { verdict: 'CRYPTOGRAPHIC PASS', score: 99.5, elaUniformity: 'Valid PDF', software: 'PhonePe Core Services' }
            }
          ],
          policeStation: 'Cyber Crime Police Station, Bengaluru City, Karnataka',
          caseDiary: [
            {
              timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
              officerName: 'SI Manjunath K.',
              officerBadge: 'LEO-KA-5502',
              action: 'CDR & IMEI Tracing Requested',
              notes: 'Requisition sent to Telecom Service Provider for Cell ID & IMEI tracking of mobile +91-87654-32109.'
            }
          ]
        },
        {
          id: 'CYBER-2026-SX9930',
          filedAt: new Date(Date.now() - 3600000 * 9).toISOString(),
          status: 'Pending Triage',
          priority: 'Priority 1 (Govt Spoof / Extortion)',
          complainantMode: 'citizen',
          complainant: {
            name: 'Aarav Mehta',
            phone: '+91-91223-88990',
            email: 'aarav.mehta99@yahoo.com',
            address: 'B-12, Green Heights, Andheri West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400053'
          },
          incident: {
            date: new Date(Date.now() - 86400000 * 3).toISOString().slice(0, 10),
            time: '11:30 PM',
            platform: 'WhatsApp Video Call & YouTube Threat',
            crimeType: 'sextortion_blackmail',
            crimeLabel: 'Sextortion & AI Deepfake Video Blackmail',
            narration: 'Complainant received brief unsolicited WhatsApp video call displaying obscene video. Accused morphed face into explicit clip, threatening circulation to family contacts and YouTube upload unless ₹1,20,000 paid immediately.',
            chronology: [
              { time: '11:30 PM', channel: 'WhatsApp Video', desc: '10-second nude video call received and disconnected.', amount: '0' },
              { time: '11:35 PM', channel: 'WhatsApp Message', desc: 'Received morphed video with contact list screenshot.', amount: '0' },
              { time: '11:55 PM', channel: 'Google Pay', desc: 'Transferred ₹40,000 under severe mental trauma.', amount: '40,000' }
            ]
          },
          financial: {
            amount: '1,20,000',
            utr: 'UPI20261028771920',
            victimBank: 'ICICI Bank A/C ending in 5521',
            suspectTarget: 'rajesh.mule.paytm@paytm',
            freezeNoticeIssued: false
          },
          suspect: {
            phone: '+91-91234-56780',
            upi: 'rajesh.mule.paytm@paytm',
            bank: 'Paytm Payments Bank A/C 919123456780',
            url: 'https://youtube-removal-cyberdesk.fake-portal.com'
          },
          biometrics: {
            isVerified: true,
            verifiedAt: new Date(Date.now() - 3600000 * 9).toISOString(),
            score: 98.4,
            antiSpoofVerdict: 'PASSED (Natural Eye-Blink & 3D Contour Validated)',
            snapshots: {
              center: BIO_SVGS.blink,
              turn_left: BIO_SVGS.profile_left,
              turn_right: BIO_SVGS.profile_right,
              tilt_vertical: BIO_SVGS.depth_3d
            }
          },
          evidence: [
            {
              name: 'WhatsApp_Extortion_Chats_and_Threats.png',
              category: 'Extortion Communications',
              size: '480 KB',
              type: 'image/png',
              timestamp: '2026-10-29 23:45 IST',
              sha256: '9876543210abcdef9876543210abcdef9876543210abcdef9876543210abcdef',
              forensic: { verdict: 'UNALTERED CHAT SCREENSHOT', score: 98.8, elaUniformity: 'High', software: 'iOS Screenshot' }
            }
          ],
          policeStation: 'Cyber Crime Police Station, West Region, Bandra-Kurla Complex, Mumbai',
          caseDiary: [
            {
              timestamp: new Date(Date.now() - 3600000 * 9).toISOString(),
              officerName: 'Intake System',
              officerBadge: 'PORTAL-BOT',
              action: 'Sextortion Emergency Triage Triggered',
              notes: 'Auto-flagged under IT Act 67A/66E & BNS 351(2) Criminal Intimidation.'
            }
          ]
        },
        {
          id: 'CYBER-2026-BC7719',
          filedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
          status: 'FIR Formally Registered',
          priority: 'Priority 2 (High-Value Financial)',
          complainantMode: 'corporate',
          complainant: {
            name: 'TechInnovate Solutions Pvt Ltd (Rep: Sandeep Roy, CISO)',
            phone: '+91-98101-77223',
            email: 'sandeep.roy@techinnovate.in',
            address: 'Cyber City, Tower B, 8th Floor, DLF Phase 2',
            city: 'Gurugram',
            state: 'Haryana',
            pincode: '122002',
            orgName: 'TechInnovate Solutions Pvt Ltd',
            orgCin: 'U72900HR2018PTC078129',
            orgGstin: '06AABCT1234F1Z8',
            repName: 'Sandeep Roy',
            repDesig: 'Chief Information Security Officer (CISO)'
          },
          incident: {
            date: new Date(Date.now() - 86400000 * 4).toISOString().slice(0, 10),
            time: '04:30 PM',
            platform: 'Corporate Email & Spoofed MX Domain',
            crimeType: 'business_email_compromise',
            crimeLabel: 'Business Email Compromise (BEC) & Vendor Wire Fraud',
            narration: 'Attackers registered lookalike domain v-supplier-invoicing.com impersonating regular hardware vendor. Intercepted vendor invoice chain and redirected quarterly invoice wire payment of ₹62,50,000 to fraudulent mule bank account.',
            chronology: [
              { time: '04:00 PM', channel: 'SMTP Email', desc: 'Received email from accounts@v-supplier-invoicing.com requesting bank change.', amount: '0' },
              { time: '04:30 PM', channel: 'Corporate RTGS Wire', desc: 'Treasury executed RTGS transfer of quarterly vendor invoice.', amount: '62,50,000' }
            ]
          },
          financial: {
            amount: '62,50,000',
            utr: 'HDFC202610229871',
            victimBank: 'Citibank N.A. Corporate A/C ending in 9001',
            suspectTarget: 'HDFC Bank A/C 50200088192341 (IFSC: HDFC0000431)',
            freezeNoticeIssued: true,
            freezeNoticeDate: new Date(Date.now() - 3600000 * 12).toISOString()
          },
          suspect: {
            phone: '+91-99887-11223',
            upi: 'vendor.corporate.clearing@hdfc',
            bank: 'HDFC Bank A/C 50200088192341 (IFSC: HDFC0000431)',
            url: 'https://v-supplier-invoicing.com'
          },
          biometrics: {
            isVerified: true,
            verifiedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
            score: 99.5,
            antiSpoofVerdict: 'PASSED (Corporate Authorized Signatory Verified)',
            snapshots: {
              center: BIO_SVGS.blink,
              turn_left: BIO_SVGS.profile_left,
              turn_right: BIO_SVGS.profile_right,
              tilt_vertical: BIO_SVGS.depth_3d
            }
          },
          evidence: [
            {
              name: 'Corporate_Board_Resolution_and_CISO_Authorization.pdf',
              category: 'Legal Authority Instrument',
              size: '512 KB',
              type: 'application/pdf',
              timestamp: '2026-10-28 16:45 IST',
              sha256: '777888999aaabbbcccdddeeefff000111222333444555666777888999aaabbb',
              forensic: { verdict: 'DIGITALLY SIGNED (MCA Compliant)', score: 99.9, elaUniformity: 'Valid Cert', software: 'Adobe Sign PKI' }
            },
            {
              name: 'Spoofed_Domain_RFC5322_Email_Headers_Audit.txt',
              category: 'Electronic Forensics Log',
              size: '88 KB',
              type: 'text/plain',
              timestamp: '2026-10-28 17:15 IST',
              sha256: 'bbccddeeff00112233445566778899aabbccddeeff00112233445566778899aa',
              forensic: { verdict: 'DKIM FAIL & SPF MISMATCH DETECTED', score: 99.8, elaUniformity: 'Authentic Log', software: 'Postfix Mail Log' }
            }
          ],
          policeStation: 'Cyber Crime Police Station, Sector 43, Gurugram, Haryana',
          caseDiary: [
            {
              timestamp: new Date(Date.now() - 3600000 * 10).toISOString(),
              officerName: 'ACP Rajendra Prasad',
              officerBadge: 'LEO-HR-8812',
              action: 'FIR No. 104/2026 Registered',
              notes: 'FIR registered under BNS 318(4) [Cheating], 319(2) [Personation], 336(3) [Forgery] & IT Act 66C/66D.'
            }
          ]
        },
        {
          id: 'CYBER-2026-LN1284',
          filedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
          status: 'Under Active Investigation',
          priority: 'Priority 1 (Govt Spoof / Extortion)',
          complainantMode: 'citizen',
          complainant: {
            name: 'Sunita Verma',
            phone: '+91-97841-55660',
            email: 'sunita.verma.edu@rediffmail.com',
            address: 'Plot 78, Malviya Nagar, Sector 3',
            city: 'Jaipur',
            state: 'Rajasthan',
            pincode: '302017'
          },
          incident: {
            date: new Date(Date.now() - 86400000 * 5).toISOString().slice(0, 10),
            time: '01:00 PM',
            platform: 'Instant Loan Android APK & WhatsApp',
            crimeType: 'illegal_loan_apps',
            crimeLabel: 'Predatory Chinese Loan App Harassment & Contact Doxing',
            narration: 'Complainant downloaded "SpeedLoan Pro" APK. Granted contacts & gallery permissions. Loan of ₹5,000 disbursed; within 5 days recovery agents demanded ₹35,000, sending morphed pornographic photos to WhatsApp contacts & school principal.',
            chronology: [
              { time: '11:00 AM', channel: 'Google Play Sideload APK', desc: 'Installed SpeedLoan Pro.', amount: '0' },
              { time: '11:15 AM', channel: 'IMPS Credit', desc: 'Received ₹3,200 after deducting ₹1,800 processing fee.', amount: '0' },
              { time: '01:00 PM', channel: 'WhatsApp Harassment', desc: 'Abusive audio calls threatening contact broadcast.', amount: '35,000' }
            ]
          },
          financial: {
            amount: '35,000',
            utr: 'IMPS20261026001289',
            victimBank: 'Bank of Baroda A/C ending in 1920',
            suspectTarget: 'speedloan.fintech.recovery@icici',
            freezeNoticeIssued: false
          },
          suspect: {
            phone: '+91-96541-23098',
            upi: 'speedloan.fintech.recovery@icici',
            bank: 'ICICI Bank A/C 001205008912',
            url: 'https://speedloan-instant-credit.com/apk/speedloan_v2.apk'
          },
          biometrics: {
            isVerified: true,
            verifiedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
            score: 98.1,
            antiSpoofVerdict: 'PASSED (Natural Eye-Blink & 3D Contour Validated)',
            snapshots: {
              center: BIO_SVGS.blink,
              turn_left: BIO_SVGS.profile_left,
              turn_right: BIO_SVGS.profile_right,
              tilt_vertical: BIO_SVGS.depth_3d
            }
          },
          evidence: [
            {
              name: 'SpeedLoan_Pro_Dangerous_Permissions_Manifest.txt',
              category: 'Malware APK Analysis',
              size: '34 KB',
              type: 'text/plain',
              timestamp: '2026-10-27 13:10 IST',
              sha256: '445566778899aabbccddeeff00112233445566778899aabbccddeeff00112233',
              forensic: { verdict: 'SPYWARE BEHAVIOR CONFIRMED', score: 99.7, elaUniformity: 'Static Analysis', software: 'Androguard APK Decompiler' }
            }
          ],
          policeStation: 'Cyber Crime Police Station, Jaipur Commissionerate, Rajasthan',
          caseDiary: [
            {
              timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
              officerName: 'Insp. Narendra Rathore',
              officerBadge: 'LEO-RJ-3109',
              action: 'Notice to Google & CERT-In for APK Domain Takedown',
              notes: 'Formal takedown notice dispatched under Section 79(3)(b) IT Act to block C2 domain and hosting IP.'
            }
          ]
        },
        {
          id: 'CYBER-2026-ST6650',
          filedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
          status: 'Golden Hour Freeze Notice Issued',
          priority: 'Priority 2 (High-Value Financial)',
          complainantMode: 'citizen',
          complainant: {
            name: 'Manmohan Joshi',
            phone: '+91-94120-66771',
            email: 'mjoshidun@gmail.com',
            address: '14/2, Rajpur Road, Near Clock Tower',
            city: 'Dehradun',
            state: 'Uttarakhand',
            pincode: '248001'
          },
          incident: {
            date: new Date(Date.now() - 86400000 * 7).toISOString().slice(0, 10),
            time: '11:00 AM',
            platform: 'WhatsApp VIP Group & Fake Trading App',
            crimeType: 'stock_trading_scam',
            crimeLabel: 'Fake Institutional Stock Trading & VIP WhatsApp Scam',
            narration: 'Complainant was added to "Goldman Sachs Institutional VIP Trading Group". Lured with fake IPO allotments showing 400% profits on fraudulent app. Coerced to deposit ₹28,00,000 across 4 mule accounts; withdrawal blocked demanding 20% security tax.',
            chronology: [
              { time: '10:00 AM', channel: 'WhatsApp Group', desc: 'Admin shared fake SEBI license certificate.', amount: '0' },
              { time: '11:30 AM', channel: 'App Dashboard', desc: 'Virtual portfolio showed ₹1.2 Crore profit.', amount: '0' },
              { time: '02:00 PM', channel: 'NEFT Transfer', desc: 'Transferred ₹28,00,000 in 4 installments.', amount: '28,00,000' }
            ]
          },
          financial: {
            amount: '28,00,000',
            utr: 'PUNB20261024559812',
            victimBank: 'Punjab National Bank (PNB) A/C ending in 7701',
            suspectTarget: 'Canara Bank A/C 192801009812 (IFSC: CNRB0002104)',
            freezeNoticeIssued: true,
            freezeNoticeDate: new Date(Date.now() - 3600000 * 24).toISOString()
          },
          suspect: {
            phone: '+91-88990-11223',
            upi: 'vip.institutional.trading@cnrb',
            bank: 'Canara Bank A/C 192801009812 (IFSC: CNRB0002104)',
            url: 'https://goldman-vip-institutional-trading.app'
          },
          biometrics: {
            isVerified: true,
            verifiedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
            score: 97.4,
            antiSpoofVerdict: 'PASSED (Natural Eye-Blink & 3D Contour Validated)',
            snapshots: {
              center: BIO_SVGS.blink,
              turn_left: BIO_SVGS.profile_left,
              turn_right: BIO_SVGS.profile_right,
              tilt_vertical: BIO_SVGS.depth_3d
            }
          },
          evidence: [
            {
              name: 'Fake_SEBI_Registration_Certificate_Forgery.pdf',
              category: 'Counterfeit Regulatory Document',
              size: '420 KB',
              type: 'application/pdf',
              timestamp: '2026-10-25 10:15 IST',
              sha256: '9900112233445566778899001122334455667788990011223344556677889900',
              forensic: { verdict: 'COUNTERFEIT FORGERY', score: 91.2, elaUniformity: 'Forged Stamp', software: 'Canva Design' }
            }
          ],
          policeStation: 'Cyber Crime Police Station, Special Task Force (STF), Dehradun, Uttarakhand',
          caseDiary: [
            {
              timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
              officerName: 'DySP Ankita Chauhan',
              officerBadge: 'LEO-UK-0012',
              action: 'Canara Bank Nodal Officer Contacted',
              notes: 'Primary mule account debits frozen. Secondary money trail being mapped.'
            }
          ]
        }
      ];

      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sampleCases));
        }
      } catch (err) {
        console.error('CLGS_DB.seedSampleData write error:', err);
      }
      this.broadcast('DATABASE_SEEDED', { count: sampleCases.length });
      return sampleCases;
    }
  };

  // Expose to window and Node.js module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CLGS_DB, BIO_SVGS };
  }
  if (typeof window !== 'undefined') {
    global.CLGS_DB = CLGS_DB;
    global.BIO_SVGS = BIO_SVGS;
    // Auto-initialize if DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => CLGS_DB.init());
    } else {
      CLGS_DB.init();
    }
  }
})(typeof window !== 'undefined' ? window : global);
