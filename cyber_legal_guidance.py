# Cyber Legal Guidance System (Foundational Edition)
# B.Tech Evaluation Project | Offline Heuristic Legal-Tech Engine
# IT Act 2000 (Amended) | Bharatiya Nyaya Sanhita (BNS) 2023 | 1930 Helpline Protocol
# Built strictly with standard Python libraries (os, datetime) for offline privacy.

import os
import datetime

# ==============================================================================
# 1. CORE STATUTORY LEGAL CODEX (BNS 2023 & IT ACT 2000)
# ==============================================================================

BNS_SECTIONS = {
    "318": {
        "title": "Cheating (धोखाधड़ी)",
        "description": "Dishonestly inducing delivery of property or consent to retain property through deception.",
        "punishment": "Imprisonment up to 3 years and/or fine. Sub-clause (4) allows up to 7 years for aggravated fraud."
    },
    "319": {
        "title": "Cheating by Personation (प्रतिरूपण द्वारा धोखाधड़ी)",
        "description": "Cheating by pretending to be some other person, or knowingly substituting one person for another.",
        "punishment": "Imprisonment up to 5 years and/or fine."
    },
    "303": {
        "title": "Theft (चोरी)",
        "description": "Dishonestly taking any movable property out of possession of any person without consent.",
        "punishment": "Imprisonment up to 3 years, or fine, or both."
    },
    "308": {
        "title": "Extortion (जबरन वसूली / ब्लैकमेल)",
        "description": "Intentionally putting any person in fear of injury and dishonestly inducing delivery of property.",
        "punishment": "Imprisonment up to 7 years, or fine, or both."
    },
    "316": {
        "title": "Criminal Breach of Trust (आपराधिक विश्वासघात)",
        "description": "Dishonestly misappropriating or converting property entrusted to a person.",
        "punishment": "Imprisonment up to 5 years, or fine, or both."
    },
    "336": {
        "title": "Forgery (जालसाजी)",
        "description": "Making any false document or electronic record with intent to cause damage, fraud, or claim.",
        "punishment": "Imprisonment up to 2 years, or fine, or both."
    },
    "351": {
        "title": "Criminal Intimidation (आपराधिक धमकी)",
        "description": "Threatening another with injury to person, reputation, or property to compel an unlawful act.",
        "punishment": "Imprisonment up to 2 years, or fine, or both."
    },
    "78": {
        "title": "Stalking (पीछा करना / ऑनलाइन निगरानी)",
        "description": "Following, contacting, or monitoring internet/electronic communication of a person despite disinterest.",
        "punishment": "First conviction: up to 3 years; Subsequent: up to 5 years & fine."
    },
    "79": {
        "title": "Word, Gesture or Act Intended to Insult Modesty of a Woman",
        "description": "Intruding upon privacy or uttering insults to outrage the modesty of any woman.",
        "punishment": "Imprisonment up to 3 years and fine."
    }
}

IT_ACT_SECTIONS = {
    "43": {
        "title": "Penalty and Compensation for Damage to Computer System",
        "description": "Unauthorized computer access, data downloading/theft, virus introduction, or denial of access.",
        "punishment": "Civil compensation to affected victim up to ₹1 Crore."
    },
    "43A": {
        "title": "Compensation for Failure to Protect Data",
        "description": "Corporate body failing to implement reasonable security practices for sensitive personal data.",
        "punishment": "Unlimited compensation to affected parties."
    },
    "65": {
        "title": "Tampering with Computer Source Documents",
        "description": "Intentionally concealing, destroying, or altering computer source code required by law.",
        "punishment": "Imprisonment up to 3 years and/or fine up to ₹2,00,000."
    },
    "66": {
        "title": "Computer-Related Offences (Hacking)",
        "description": "Dishonestly or fraudulently committing acts under Section 43 (hacking, device intrusion).",
        "punishment": "Imprisonment up to 3 years and/or fine up to ₹5,00,000."
    },
    "66C": {
        "title": "Identity Theft (पहचान की चोरी)",
        "description": "Fraudulently making use of electronic signature, password, OTP, or unique identification feature.",
        "punishment": "Imprisonment up to 3 years and fine up to ₹1,00,000."
    },
    "66D": {
        "title": "Cheating by Personation using Computer Resource",
        "description": "Cheating by impersonating someone through communication devices, fake emails, or phishing portals.",
        "punishment": "Imprisonment up to 3 years and fine up to ₹1,00,000."
    },
    "66E": {
        "title": "Violation of Privacy (निजता का उल्लंघन)",
        "description": "Capturing, publishing, or transmitting images of private areas of any person without consent.",
        "punishment": "Imprisonment up to 3 years and/or fine up to ₹2,00,000."
    },
    "67": {
        "title": "Publishing or Transmitting Obscene Material in Electronic Form",
        "description": "Transmitting or publishing lascivious or obscene material electronically.",
        "punishment": "First conviction: up to 3 years & ₹5 Lakh fine; Subsequent: up to 5 years."
    },
    "67A": {
        "title": "Publishing Material Containing Sexually Explicit Act",
        "description": "Publishing or transmitting sexually explicit material in electronic form.",
        "punishment": "First conviction: up to 5 years & ₹10 Lakh fine; Subsequent: up to 7 years."
    },
    "72A": {
        "title": "Disclosure of Information in Breach of Lawful Contract",
        "description": "Service provider or employee disclosing personal information without consent in breach of contract.",
        "punishment": "Imprisonment up to 3 years and/or fine up to ₹5,00,000."
    }
}

# 8 Core Crime Vectors Mapped to BNS and IT Act
CRIME_LEGAL_MAP = {
    "upi_fraud": {
        "name": "UPI & Online Banking Fraud (ऑनलाइन बैंकिंग व यूपीआई फ्रॉड)",
        "bns": ["318", "319"],
        "it_act": ["66C", "66D"],
        "steps": [
            "Call National Cyber Crime Helpline 1930 immediately to trigger Golden Hour bank lien freeze.",
            "Contact your home bank to hotlist cards/netbanking and report unauthorized UPI transactions.",
            "Obtain 12-digit Bank Transaction UTR reference number from your bank passbook/statement.",
            "Lodge formal complaint at cybercrime.gov.in within 24 hours."
        ]
    },
    "phishing": {
        "name": "Phishing Link & Malicious APK Scam (फ़िशिंग लिंक व मालवेयर एपीके)",
        "bns": ["318", "319", "336"],
        "it_act": ["66D", "43"],
        "steps": [
            "Turn on Airplane Mode immediately to stop malicious APKs from reading SMS / OTPs.",
            "Uninstall suspect APK and boot phone into Safe Mode if needed.",
            "Change NetBanking, UPI, and email passwords from a separate, secure device.",
            "Report the phishing URL and SMS sender ID on cybercrime.gov.in and Sanchar Saathi (Chakshu)."
        ]
    },
    "hacking": {
        "name": "Account, Mobile, or Computer Intrusion (हैकिंग व अनधिकृत पहुंच)",
        "bns": ["316", "303"],
        "it_act": ["66", "43"],
        "steps": [
            "Revoke all active logins and terminate active sessions in account security settings.",
            "Enable multi-factor authentication (MFA) via Authenticator App (avoid SMS-only 2FA).",
            "Preserve server/device audit logs and screenshots showing unauthorized access timestamps.",
            "File formal police report citing Section 66 IT Act & Section 316 BNS."
        ]
    },
    "identity_theft": {
        "name": "Identity Theft, SIM Swap & Forgery (पहचान की चोरी व सिम स्वैप)",
        "bns": ["319", "336"],
        "it_act": ["66C", "66D"],
        "steps": [
            "If phone network signal disappears abruptly, visit telecom operator store immediately to halt SIM swap.",
            "Check active mobile connections linked to your Aadhaar using the DoT TAFCOP portal (sancharsaathi.gov.in).",
            "Lock your Aadhaar biometrics via UIDAI website or mAadhaar app.",
            "Notify your bank and credit bureaus (CIBIL/Experian) to place a fraud alert."
        ]
    },
    "sextortion": {
        "name": "Sextortion, Blackmail & Privacy Breach (सेक्सटॉर्शन व ब्लैकमेल)",
        "bns": ["308", "351"],
        "it_act": ["66E", "67", "67A"],
        "steps": [
            "DO NOT PAY ANY MONEY. Paying extortion guarantees demands will escalate.",
            "Block the fraudster on all calling and social media platforms immediately.",
            "Preserve chat transcripts, profile URLs, phone numbers, and payment VPAs.",
            "Report non-consensual explicit material on StopNCII.org to generate digital hash block.",
            "File an urgent complaint on cybercrime.gov.in under 'Report Cyber Crime Related to Women/Child'."
        ]
    },
    "investment_fraud": {
        "name": "Fake Investment & Work-From-Home Task Scam (फर्जी निवेश व टास्क घोटाला)",
        "bns": ["318", "319"],
        "it_act": ["66D"],
        "steps": [
            "Stop all further deposits immediately. Fraudsters always demand extra 'taxes/fees' to withdraw.",
            "Call 1930 Helpline immediately with suspect bank/UPI details to block receiver mule accounts.",
            "Verify whether the entity is registered with SEBI on sebi.gov.in.",
            "Export complete Telegram / WhatsApp chat backups and transaction receipts for evidence."
        ]
    },
    "data_breach": {
        "name": "Data Breach & Corporate Negligence (डेटा ब्रीच व गोपनीयता उल्लंघन)",
        "bns": ["316"],
        "it_act": ["43A", "72A"],
        "steps": [
            "Isolate compromised systems from internal network to contain exfiltration.",
            "Mandatorily report the incident to CERT-In (incident@cert-in.org.in) within 6 hours.",
            "Audit access logs, database query records, and external IP connection traces.",
            "Notify affected data principals and regulatory authorities as required by law."
        ]
    },
    "online_harassment": {
        "name": "Cyber Stalking, Defamation & Harassment (साइबर स्टॉकिंग व प्रताड़ना)",
        "bns": ["78", "79", "351"],
        "it_act": ["66E", "67"],
        "steps": [
            "Take unedited full-screen screenshots displaying dates, timestamps, URLs, and caller IDs.",
            "Do not engage with or provoke the harasser; maintain complete documentary record.",
            "Send formal takedown notice to platform Grievance Officer under IT Rules 2021.",
            "File a complaint at the local Cyber Crime Police Station."
        ]
    }
}

# Multi-dimensional Hinglish & English Keyword Dictionary
KEYWORD_MAP = {
    "upi_fraud": [
        "utr", "gpay", "google pay", "phonepe", "paytm", "upi", "qr code", "qr", 
        "paise cut gaye", "bank se cut", "unauthorized transaction", "debit", "paisa kat gaya",
        "paise nikal gaye", "cut hogaye", "bank debited", "unauthorized debit", "paise chale gaye"
    ],
    "phishing": [
        "fake link", "otp asked", "lottery link", "kyc link", "apk download", "link pe click", 
        "phishing", "fake website", "bijli bill link", "electricity bill link", "challan link", "sms link"
    ],
    "hacking": [
        "hacked", "phone hack", "account hack", "instagram hack", "facebook hack", 
        "password change", "malware", "virus", "unauthorized access", "remote access", "anydesk"
    ],
    "identity_theft": [
        "sim swap", "fake profile", "aadhaar fraud", "pan misuse", "identity theft", 
        "cloned sim", "impersonation", "fake account my name", "aadhaar misused"
    ],
    "sextortion": [
        "sextortion", "nude video", "blackmail", "video call recording", "viral", 
        "kapde utar", "nangi video", "compromised video", "private photos", "obscene video"
    ],
    "investment_fraud": [
        "crypto", "trading", "profit guarantee", "double money", "task scam", 
        "telegram task", "wfh task", "youtube like task", "ponzi", "stock group", "ipo scam"
    ],
    "data_breach": [
        "data leak", "database sold", "personal data leaked", "hospital data", 
        "breach", "customer records", "corporate leak", "source code leak"
    ],
    "online_harassment": [
        "stalking", "abusive message", "doxxing", "harassment", "threatening call", 
        "gali galoch", "trolling", "defamation", "dhamki"
    ]
}


# ==============================================================================
# 2. HEURISTIC CLASSIFICATION ENGINE
# ==============================================================================

def get_crime_type_from_keywords(user_input: str) -> tuple[str, int]:
    """
    Deterministic keyword hit-counter matching user grievance text against
    vernacular Hinglish/English threat vectors.
    Returns (crime_type, confidence_percentage).
    """
    cleaned_input = user_input.lower().strip()
    scores = {}

    for crime, keywords in KEYWORD_MAP.items():
        score = 0
        for kw in keywords:
            if kw in cleaned_input:
                score += 1
        scores[crime] = score

    best_crime = max(scores, key=scores.get)
    max_score = scores[best_crime]

    if max_score == 0:
        return "upi_fraud", 60

    confidence = min(99, 60 + (max_score * 13))
    return best_crime, confidence


def display_legal_sections(crime_type: str):
    """
    Displays the applicable BNS 2023 and IT Act 2000 statutory sections.
    """
    crime_info = CRIME_LEGAL_MAP.get(crime_type, CRIME_LEGAL_MAP["upi_fraud"])
    print("\n" + "="*70)
    print(f"  CRIME CLASSIFICATION: {crime_info['name'].upper()}")
    print("="*70)

    print("\n[+] APPLICABLE BHARATIYA NYAYA SANHITA (BNS) 2023 CITATIONS:")
    for sec in crime_info["bns"]:
        sec_data = BNS_SECTIONS.get(sec, {})
        print(f"  • BNS Section {sec}: {sec_data.get('title', 'Offence')}")
        print(f"    Description: {sec_data.get('description', '')}")
        print(f"    Punishment : {sec_data.get('punishment', '')}\n")

    print("[+] APPLICABLE INFORMATION TECHNOLOGY (IT) ACT, 2000 CITATIONS:")
    for sec in crime_info["it_act"]:
        sec_data = IT_ACT_SECTIONS.get(sec, {})
        print(f"  • IT Act Section {sec}: {sec_data.get('title', 'Offence')}")
        print(f"    Description: {sec_data.get('description', '')}")
        print(f"    Punishment : {sec_data.get('punishment', '')}\n")

    print("[!] IMMEDIATE ACTIONS / EMERGENCY PROTOCOLS:")
    for idx, step in enumerate(crime_info["steps"], 1):
        print(f"  {idx}. {step}")


def save_complaint_handout(report: dict) -> str:
    """
    Saves a formal, structured incident report text file to reports/ directory.
    """
    os.makedirs("reports", exist_ok=True)
    timestamp_str = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filepath = os.path.join("reports", f"cyber_complaint_{timestamp_str}.txt")

    content = f"""================================================================================
                    CYBER CRIME INCIDENT HANDOUT & POLICE REPORT
            Bharatiya Nyaya Sanhita (BNS) 2023 & Information Technology Act 2000
================================================================================
Report Reference ID : CLGS-{timestamp_str}
Date & Time Filed   : {datetime.datetime.now().strftime('%d %B %Y, %I:%M %p')}
Classification      : {report['crime_name']}
Confidence Score    : {report['confidence']}%
--------------------------------------------------------------------------------
1. COMPLAINANT PARTICULARS:
   • Full Name         : {report.get('victim_name', 'N/A')}
   • Contact Number    : {report.get('victim_phone', 'N/A')}
   • Contact Email     : {report.get('victim_email', 'N/A')}

2. INCIDENT & TRANSACTION FORENSICS:
   • Incident Date     : {report.get('incident_date', 'N/A')}
   • Disputed Amount   : Rs. {report.get('disputed_amount', '0')}/-
   • Bank UTR / Txn ID : {report.get('txn_id', 'N/A')}
   • Suspect Identifier: {report.get('suspect_identifier', 'Unknown / Trace requested')}

3. COMPLAINANT FACTUAL GRIEVANCE:
   "{report.get('user_grievance', '')}"

4. STATUTORY PENAL PROVISIONS CHARGED:
   • BNS 2023 Sections : {', '.join(report.get('bns_sections', []))}
   • IT Act Sections   : {', '.join(report.get('it_sections', []))}

5. EMERGENCY STATUTORY RELIEF PRAYERS:
   (a) Direct the concerned Bank under Section 106 BNSS 2023 to place an immediate
       lien hold / freeze upon the recipient beneficiary account.
   (b) Exercise powers under Section 94 BNSS 2023 to requisition Call Detail Records
       (CDR) and IPDR logs from Telecom Service Providers.
   (c) Direct online intermediaries to preserve electronic evidence pursuant to
       Section 63 of Bharatiya Sakshya Adhiniyam (BSA), 2023.

================================================================================
Generated by Cyber Legal Guidance System (Offline Privacy-First Architecture)
"""

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    return filepath


# ==============================================================================
# 3. INTERACTIVE CONSOLE MENU & CONTROLLER
# ==============================================================================

def identify_crime_interactive():
    print("\n" + "="*70)
    print("  OPTION 1: FILE GRIEVANCE & IDENTIFY CRIME (Hinglish Supported)")
    print("="*70)
    print("Describe what happened in simple English or Hinglish.")
    print("Example: 'Mere phone hack ho gya aur bank se ₹50000 cut gaye. TXN ID 987654321 hai.'\n")

    user_input = input("Enter your grievance: ").strip()
    if not user_input:
        print("[-] Grievance description cannot be empty.")
        return

    crime_type, confidence = get_crime_type_from_keywords(user_input)
    crime_info = CRIME_LEGAL_MAP[crime_type]

    print(f"\n[✔] Crime Detected: {crime_info['name']}")
    print(f"[✔] Deterministic Confidence: {confidence}%")

    display_legal_sections(crime_type)

    print("\n" + "-"*70)
    print("  ENTER FORENSIC PARTICULARS FOR POLICE COMPLAINT HANDOUT")
    print("-"*70)
    name = input("Enter Complainant Name: ").strip() or "Aggrieved Citizen"
    phone = input("Enter Complainant Phone: ").strip() or "N/A"
    email = input("Enter Complainant Email: ").strip() or "N/A"
    inc_date = input("Enter Incident Date (DD-MM-YYYY): ").strip() or datetime.datetime.now().strftime("%d-%m-%Y")
    amount = input("Enter Disputed Amount (in Rs): ").strip() or "0"
    txn_id = input("Enter Bank UTR / Transaction ID (if any): ").strip() or "N/A"
    suspect = input("Enter Suspect Phone / UPI / Website: ").strip() or "Unknown"

    report = {
        "crime_name": crime_info["name"],
        "confidence": confidence,
        "victim_name": name,
        "victim_phone": phone,
        "victim_email": email,
        "incident_date": inc_date,
        "disputed_amount": amount,
        "txn_id": txn_id,
        "suspect_identifier": suspect,
        "user_grievance": user_input,
        "bns_sections": crime_info["bns"],
        "it_sections": crime_info["it_act"]
    }

    filepath = save_complaint_handout(report)
    print("\n" + "="*70)
    print(f"[✔] Formal Police Complaint Handout saved successfully!")
    print(f"[✔] File Location: {filepath}")
    print("="*70)


def browse_legal_codex():
    print("\n" + "="*70)
    print("  OPTION 2: BROWSE CYBER LAW CODEX (BNS 2023 & IT ACT 2000)")
    print("="*70)
    print("Select Statute to Browse:")
    print("  1. Bharatiya Nyaya Sanhita (BNS), 2023 Penal Sections")
    print("  2. Information Technology (IT) Act, 2000 Statutory Sections")
    print("  3. View All 8 Pre-Mapped Cyber Crime Categories")
    choice = input("\nEnter choice (1-3): ").strip()

    if choice == "1":
        print("\n--- BNS 2023 CYBER PENAL CODES ---")
        for sec, data in BNS_SECTIONS.items():
            print(f"• Section {sec}: {data['title']}")
            print(f"  {data['description']}")
            print(f"  Penalty: {data['punishment']}\n")
    elif choice == "2":
        print("\n--- IT ACT 2000 CYBER OFFENCES ---")
        for sec, data in IT_ACT_SECTIONS.items():
            print(f"• Section {sec}: {data['title']}")
            print(f"  {data['description']}")
            print(f"  Penalty: {data['punishment']}\n")
    elif choice == "3":
        print("\n--- 8 CORE CYBERCRIME CATEGORIES ---")
        for key, d in CRIME_LEGAL_MAP.items():
            print(f"• {d['name']}")
            print(f"  BNS Sections: {', '.join(d['bns'])} | IT Act: {', '.join(d['it_act'])}\n")


def display_golden_hour_guide():
    print("\n" + "="*70)
    print("  OPTION 3: EMERGENCY 'GOLDEN HOUR' PROTOCOLS (1930 HELPLINE)")
    print("="*70)
    print("""
🚨 THE CRITICAL FIRST 2 HOURS:
If you have fallen victim to financial cyber fraud, the first 2 hours are
known as the 'Golden Hour'. Swift reporting allows banks to block recipient
mule accounts before funds are withdrawn at ATMs.

IMMEDIATE STEPS:
1. DIAL 1930 (National Cyber Crime Helpline):
   Operated by the Indian Cybercrime Coordination Centre (I4C), Ministry of
   Home Affairs. Keep your Bank Name, Account Number, and Transaction ID ready.

2. CONTACT YOUR HOME BANK CUSTOMER CARE:
   Request immediate lien hold on disputed transactions and hotlist cards.

3. REPORT UNREGISTERED FINANCIAL ENTITIES:
   Report fraudulent loan apps or Ponzi schemes on RBI SACHET (sachet.rbi.org.in).

4. SUBMIT FORMAL POLICE REPORT:
   Submit full complaint with digital evidence at cybercrime.gov.in.
""")


def main():
    while True:
        print("\n" + "="*70)
        print("          CYBER LEGAL GUIDANCE SYSTEM (FOUNDATIONAL EDITION)")
        print("      Academic Evaluation 2 Architecture | Standard Offline Engine")
        print("="*70)
        print("  1. ⚡ File Grievance & Classify Crime (Hinglish NLP + FIR Handout)")
        print("  2. 📘 Browse Cyber Law Codex (BNS 2023 & IT Act 2000)")
        print("  3. 🚨 Emergency 'Golden Hour' 1930 Helpline Response Guide")
        print("  4. 🚪 Exit")
        choice = input("\nEnter choice (1-4): ").strip()

        if choice == "1":
            identify_crime_interactive()
        elif choice == "2":
            browse_legal_codex()
        elif choice == "3":
            display_golden_hour_guide()
        elif choice == "4":
            print("\nExiting Cyber Legal Guidance System. Stay safe online!")
            break
        else:
            print("[-] Invalid selection. Please enter 1, 2, 3, or 4.")


if __name__ == "__main__":
    main()
