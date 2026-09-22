# Cyber Legal Guidance System V2 (Enterprise & Sovereign Edition)

[![Constitution of India](https://img.shields.io/badge/Statutory-BNS%202023%20%7C%20IT%20Act%20%7C%20BSA%2063-orange.svg)](#)
[![Client Privacy](https://img.shields.io/badge/Privacy-100%25%20Client--Side%20%7C%20Zero%20Data%20Exposure-green.svg)](#)
[![Video Production](https://img.shields.io/badge/Brag%20Video-Launch%20%26%20Site%20Experience%20(60s%2B)-blue.svg)](#)

A sovereign, privacy-first legal-tech and cyber incident response system developed to protect Indian citizens and corporate enterprises from digital fraud, coerce rapid **Golden Hour (1930 Helpline)** response, and synthesize court-admissible Police Complaints (FIRs) under the **Bharatiya Nyaya Sanhita (BNS) 2023**, **Information Technology Act, 2000**, and **Bharatiya Sakshya Adhiniyam (BSA) 2023**.

---

## What's New in V2

### 1. 🚨 Compromised Government Employee Number Detection Engine
Cyber syndicates increasingly spoof Caller IDs or hijack official government numbers to intimidate citizens with fake power disconnection warnings (e.g. *"Your electricity will be disconnected tonight"*), fake CBI/ED digital arrest summons, or bogus parcel customs seizures.
- **Mock Government Database (`government_directory_numbers.csv`)**: Pre-loaded with official telephone records across:
  - **Indian Railways** (Northern Railway, CRIS, IRCTC, Railway Board)
  - **State Electricity Boards / DISCOMs** (Tata Power-DDL, BSES Rajdhani, MSEDCL Maharashtra, UPPCL Uttar Pradesh, BESCOM Karnataka)
  - **Ministry of Home Affairs (MHA) & I4C** (National 1930 Cyber Crime Desk)
  - **State Cyber Crime Police** (Delhi Police IFSO Special Cell, Maharashtra Cyber, Karnataka CID)
  - **Income Tax Department** (CBDT Central Refund Processing Unit)
  - **Department of Telecommunications (DoT)** (TAFCOP & TERM Vigilance Cell)
  - **India Post & EPFO**
- **Real-Time Detection & Critical Alert Banner**: When any suspect number matches an official department telephone, the system renders a glowing critical alert warning the victim against compliance.
- **Automated IT Security SOC Dispatch**: Generates formal incident notification addressed to the department's CISO and SOC desk pursuant to Section 70B IT Act.
- **Alert Logging & Export (`government_it_security_alerts.csv`)**: Directly log and download CSV reports of all detected spoofing incidents, or manage directory numbers via the UI.

### 2. 🧪 Personalized Incident Question Matrix (Trial Feature)
While standard fields remain valid for all crimes, V2 introduces a specialized, dynamic questionnaire tailored to non-financial and specialized cybercrimes:
- **Fake Digital Arrest / Law Enforcement Impersonation**: Agency impersonated (CBI/ED/Police/Customs), video call platform (Skype/WhatsApp), fabricated allegations (MDMA in parcel/Money Laundering), and digital custody demands.
- **Sextortion & Cyber Blackmail**: Initial contact medium, nature of compromised/morphed footage, threatened distribution channels (Family WhatsApp group/Friends/YouTube), and follow-up fake police calls.
- **Predatory Loan Apps & Harassment**: Rogue APK name, extorted device permissions (Contacts/Gallery/SMS), defamatory WhatsApp groups created with victim's contacts, and extortion vs disbursed ratios.
- **Deepfakes & AI Synthetic Media**: Type of AI morphing (Face-swap, cloned voice note), offending URLs/handles, and IT Rules Rule 3(2)(b) 24-hour statutory takedown notice generation.
- **Courier / Customs Narcotics Scam**: Courier service impersonated (FedEx/DHL/India Post), alleged contraband route, and fake customs clearance fees.
- **Corporate Ransomware & Business Email Compromise (BEC)**: Compromised infrastructure, ransomware file extensions, spoofed executive emails, and CERT-In 6-hour incident reporting tracking.
- **Court-Ready Integration**: All personalized particulars automatically weave into the narrative of the court-admissible Police Complaint and the Section 63 BSA Digital Evidence Certificate.

### 3. 💬 Citizen Express Intake & "Cyber Sahayak" AI Mitra Chatbot
- Plain Hindi / Hinglish / English natural language incident reporting (e.g. *"Mere bank account se ₹75,000 cut hogaye"*).
- Instant extraction of financial losses, suspect phone numbers, UPI VPAs, and attack vectors.
- One-click population of the 5-Step Incident Wizard and instant trigger of the Golden Hour Emergency Action Modal.

### 4. 🎥 Launch & Site Experience Video Productions
Rendered at 1080p landscape (60+ seconds each) using the `brag` engine:
- **`Launch Video.mp4`** (62.0s): High-impact product trailer showcasing the statutory transition, Golden Hour response, 26+ crime coverage, and court-admissible FIR generation.
- **`Site Experience.mp4`** (71.0s): Hands-on, feature-by-feature interactive walkthrough demonstrating all 8 components of the system in action with zero URLs and Vatsal Agarwal complainant identity.
- Companion baked poster thumbnails: `Launch Video.jpg` and `Site Experience.jpg`.

---

## File Structure

```
Cyber Legal Guidance System V2/
├── index.html                            # Root production web entrypoint
├── cyber_legal_guidance_system.html      # Comprehensive V2 web platform (505 KB)
├── vercel.json                           # Vercel production headers, rewrites & caching
├── .vercelignore                         # Exclude dev caches & raw video comps from deployment
├── package.json                          # Project manifest & npm scripts
├── cyber_legal_guidance.py               # Comprehensive V2 Python CLI & server
├── government_directory_numbers.csv      # Mock database of official government numbers
├── government_it_security_alerts.csv     # Dispatched IT security incident log
├── Launch Video.mp4                      # Product launch video (62.0s)
├── Launch Video.jpg                      # Baked frame-0 poster thumbnail
├── Site Experience.mp4                   # Feature walkthrough video (71.0s)
├── Site Experience.jpg                   # Baked frame-0 poster thumbnail
├── scam_directory.json                   # Verified suspect scam entity database
├── airtel_spam_feed.json                 # PII-scrubbed telecom carrier threat feed
├── robots.txt                            # Search engine crawler policies
├── sitemap.xml                           # Web index map
├── llms.txt                              # Machine-readable LLM context specification
└── README.md                             # Documentation
```

---

## Deploy to Vercel

The repository is pre-configured with `vercel.json` for 1-click zero-configuration deployment on Vercel:

### Option A: Via Vercel CLI (Fastest)
From this directory, simply run:
```bash
npx vercel
```
- When prompted, authenticate in your browser.
- Select your scope/account and accept defaults (`Y`).
- For production deployment:
```bash
npx vercel --prod
```

### Option B: Via GitHub + Vercel Dashboard (Continuous Deployment)
1. Push this folder to a new GitHub repository:
   ```bash
   git remote add origin https://github.com/<your-username>/cyber-legal-guidance-system-v2.git
   git branch -M main
   git push -u origin main
   ```
2. Navigate to [vercel.com/new](https://vercel.com/new).
3. Import the repository and click **Deploy**. Vercel will automatically detect `index.html` and `vercel.json`.

### Pre-Configured Vercel Optimizations:
- **Clean URLs**: Enables extensionless routing (`/cockpit`, `/fir`, `/directory`).
- **Security Headers**: Injects `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and strict `Referrer-Policy`.
- **Global Edge Caching**: 1-year immutable caching for videos and images (`public, max-age=31536000`), with stale-while-revalidate for threat data feeds.

---

## Statutory Legal Framework
- **Bharatiya Nyaya Sanhita (BNS) 2023**: Sections 318 (Cheating), 319 (Personation), 308 (Extortion), 316 (Breach of Trust), 78/79 (Stalking & Modesty), 336 (Forgery).
- **Information Technology Act, 2000**: Sections 43/66 (Hacking & Damage), 66C (Identity Theft), 66D (Cheating by Personation), 66E (Privacy), 67/67A (Obscene/Explicit Media), 70B (CERT-In 6-Hour Reporting).
- **Bharatiya Sakshya Adhiniyam (BSA) 2023**: Section 63 Electronic Record Admissibility & Hash Certificate.
- **Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023**: Section 106 & 107 (Attachment & Freezing of Proceeds of Crime).
