import os
import subprocess
from render_slides_engine import render_slide

FFMPEG = '/Users/vatsalagarwal/.gemini/antigravity/bin/ffmpeg'
ARTIFACTS_DIR = '/Users/vatsalagarwal/.gemini/antigravity/brain/f2dddf3d-b128-463f-b7e6-02174b88d7a9'
PROJECT_DIR = '/Users/vatsalagarwal/Documents/Projects/Vatsal/Coding Based/Cyber Legal Guidance System V2'
TMP_DIR = '/tmp/clgs_video_build'

os.makedirs(TMP_DIR, exist_ok=True)
os.makedirs(f"{TMP_DIR}/launch", exist_ok=True)
os.makedirs(f"{TMP_DIR}/site", exist_ok=True)

# ══════════════════════════════════════════════════════════════════════════════
# VIDEO 1: LAUNCH VIDEO DEFINITION (8 SCENES)
# ══════════════════════════════════════════════════════════════════════════════
LAUNCH_SCENES = [
    {
        "id": "launch_01",
        "category": "National Challenge & Mission",
        "title": "THE CYBER CRIME EPIDEMIC IN INDIA",
        "subtitle": "Critical need for immediate legal action during the Golden Hour",
        "image": f"{ARTIFACTS_DIR}/feature_v2_government_alert_banner.png",
        "badges": ["🚨 National Helpline 1930", "⚡ Golden Hour Defense", "🛡️ Citizen Protection", "📉 Stop Fund Siphoning"],
        "narration": "Cyber fraud, digital extortion, and financial scams in India demand rapid, legally binding response. Millions are lost in the Golden Hour before victims can file an accurate police complaint."
    },
    {
        "id": "launch_02",
        "category": "Sovereign Innovation",
        "title": "SOVEREIGN CYBER DEFENSE COCKPIT",
        "subtitle": "Statutory alignment under IT Act 2000, BNS 2023 & DPDP Act 2023",
        "image": f"{ARTIFACTS_DIR}/feature_top_and_intake.png",
        "badges": ["🇮🇳 Govt Aligned", "⚖️ IT Act 2000 & BNS 2023", "🔒 Zero Server Exposure", "🏛️ I4C & CERT-In Compliant"],
        "narration": "Introducing the National Cyber Legal Guidance and Corporate Incident Defense System. A sovereign, client-side digital cockpit aligning citizens and enterprises with Indian cyber law."
    },
    {
        "id": "launch_03",
        "category": "Dual Intake & Verification",
        "title": "DUAL REPORTING & ANTI-SPOOF VERIFICATION",
        "subtitle": "Citizen vs Corporate intake backed by real-time live webcam challenges",
        "image": "/tmp/screenshot_liveness_modal.png",
        "badges": ["👤 Individual Citizen", "🏢 Corporate & MSME", "📷 Live Anti-Spoofing AI", "⚖️ Statutory Undertaking"],
        "narration": "Built for everyone: Individual citizens facing UPI and loan fraud, and corporate enterprises facing CEO fraud and data breaches. Now backed by mandatory statutory legal undertakings and real-time anti-spoof photo verification."
    },
    {
        "id": "launch_04",
        "category": "Automated OCR Ingestion",
        "title": "INSTANT EVIDENCE EXTRACTION & OCR",
        "subtitle": "Client-side entity extraction from chats, bank SMS & screenshots",
        "image": f"{ARTIFACTS_DIR}/feature_bank_and_sanchar.png",
        "badges": ["🔍 In-Browser OCR", "📱 Phone & UPI Parser", "🌐 Scam Directory Integration", "🔒 Private & Offline"],
        "narration": "Victims don't need technical jargon. Simply drop screenshots of chat logs, bank SMS, or fake apps. In-browser OCR instantly extracts fraudster phone numbers, UPI handles, and suspicious URLs."
    },
    {
        "id": "launch_05",
        "category": "Immediate Fund Preservation",
        "title": "SECTION 106 BNSS BANK ACCOUNT FREEZE",
        "subtitle": "Automated freeze dispatch to nodal officers before funds are withdrawn",
        "image": f"{ARTIFACTS_DIR}/feature_universal_crime_loan_app.png",
        "badges": ["🏦 12-Digit UTR Tracking", "🛑 Sec 106 BNSS Freeze Notice", "📧 Bank Nodal Dispatch", "⏱️ Sub-Minute Action"],
        "narration": "Within the critical Golden Hour, the system automatically drafts official Section 106 BNSS Bank Freeze notices for nodal officers to halt illicit fund diversion across banking networks."
    },
    {
        "id": "launch_06",
        "category": "Statutory Documentation",
        "title": "COURT-READY POLICE FIR & BSA CERTIFICATE",
        "subtitle": "Admissible FIR drafting & mandatory Section 63 BSA electronic certificate",
        "image": f"{ARTIFACTS_DIR}/feature_auto_generated_fir.png",
        "badges": ["📄 Official FIR Application", "📜 Sec 63 BSA Certificate", "🔐 Cryptographic SHA-256", "⚖️ BNS & IT Act Sections"],
        "narration": "Generate court-ready First Information Report applications categorized under the IT Act 2000 and Bharatiya Nyaya Sanhita 2023, complete with Section 63 BSA electronic evidence certificates."
    },
    {
        "id": "launch_07",
        "category": "Cryptographic Privacy & AI",
        "title": "ZERO-KNOWLEDGE VAULT & CYBER SAHAYAK",
        "subtitle": "AES-256-GCM browser encryption with 24/7 bilingual voice AI companion",
        "image": f"{ARTIFACTS_DIR}/feature_cyber_sahayak_chatbot.png",
        "badges": ["🔐 AES-256-GCM Vault", "🤖 Cyber Sahayak AI", "🎙️ Speech-Enabled Input", "🇮🇳 Full Hindi & English"],
        "narration": "Privacy is sovereign. Everything runs 100 percent in your browser with AES-GCM-256 client-side encryption. Guided 24/7 by Cyber Sahayak AI companion in English and Hindi."
    },
    {
        "id": "launch_08",
        "category": "Sovereign Justice",
        "title": "SOVEREIGN CYBER JUSTICE FOR BHARAT",
        "subtitle": "Empowering citizens, businesses, and law enforcement nationwide",
        "image": f"{ARTIFACTS_DIR}/feature_v2_trial_personalized_questions.png",
        "badges": ["🇮🇳 National Deployment", "📞 1930 Cyber Helpline", "🌐 Instant Citizen Access", "🛡️ Open Sovereign Defense"],
        "narration": "Empowering every Indian citizen, business, and investigating officer with immediate, sovereign cyber legal defense. Explore the system today."
    }
]

# ══════════════════════════════════════════════════════════════════════════════
# VIDEO 2: SITE EXPERIENCE VIDEO DEFINITION (9 SCENES)
# ══════════════════════════════════════════════════════════════════════════════
SITE_SCENES = [
    {
        "id": "site_01",
        "category": "Site Tour: Header & Controls",
        "title": "SOVEREIGN HEADER & NATIONAL HELPLINE",
        "subtitle": "Government compliance banner, emergency 1930 & language toggle",
        "image": f"{ARTIFACTS_DIR}/feature_top_and_intake.png",
        "badges": ["🇮🇳 Sovereign Compliance", "🚨 Helpline 1930 Pill", "🌐 English ⇄ हिन्दी Switch", "🌓 Dark / Light Mode"],
        "narration": "Welcome to the National Cyber Legal Guidance System. At the top, the sovereign compliance banner aligns with I4C, CERT-In, and DPDP Act 2023, featuring national emergency helpline 1930, instant dark and light mode toggles, and seamless Hindi and English language switching."
    },
    {
        "id": "site_02",
        "category": "Site Tour: Natural Language Triage",
        "title": "EXPRESS INTAKE & VOICE SEARCH",
        "subtitle": "Report fraud by speaking or typing everyday language",
        "image": f"{ARTIFACTS_DIR}/feature_express_intake_clean.png",
        "badges": ["🎙️ Microphone Voice Intake", "⚡ Natural Language AI", "💡 One-Click Preset Chips", "🤖 Cyber Sahayak Sync"],
        "narration": "Directly below, the Express Intake bar helps citizens under stress report crimes in simple, natural language. Users can speak using the microphone or type casual phrases like 75,000 rupees debited from my account. Cyber Sahayak AI instantly categorizes the incident."
    },
    {
        "id": "site_03",
        "category": "Site Tour: Step 1 KYC",
        "title": "STEP 1: COMPLAINANT KYC & JURISDICTION",
        "subtitle": "Dual reporting mode, 3-line Indian address & auto police station mapping",
        "image": f"{ARTIFACTS_DIR}/feature_jurisdiction_step1.png",
        "badges": ["👤 Citizen Mode", "🏢 Corporate & MSME Mode", "📍 3-Line Address Fields", "🚔 Auto Police Jurisdiction"],
        "narration": "Step 1 is Complainant KYC. Choose between Individual Citizen and Corporate or MSME mode. Fill in standard three-line Indian residential or company address details, while the jurisdiction engine automatically maps your PIN code to the nearest Cyber Crime Police Station."
    },
    {
        "id": "site_04",
        "category": "Site Tour: Security Gatekeeper",
        "title": "LEGAL UNDERTAKING & ANTI-SPOOF LIVENESS",
        "subtitle": "BNS 2023 legal declaration & on-spot live motion verification",
        "image": "/tmp/screenshot_legal_modal.png",
        "badges": ["⚖️ BNS 2023 Legal Warning", "🧠 Sound Mind Declaration", "📷 Live Motion Challenges", "🛡️ Reject Static Photos"],
        "narration": "Before moving forward, an essential statutory pop-up requires a legal undertaking under the Bharatiya Nyaya Sanhita 2023, warning that false evidence attracts criminal liability. Next, on-spot webcam verification uses real-time motion challenges to stop fake photos and identity theft."
    },
    {
        "id": "site_05",
        "category": "Site Tour: Step 2 Evidence",
        "title": "STEP 2: EVIDENCE INGESTION & OCR",
        "subtitle": "Drag & drop screenshots with instant entity parsing in browser",
        "image": f"{ARTIFACTS_DIR}/feature_bank_and_sanchar.png",
        "badges": ["📥 Drag & Drop Screenshots", "🔍 Client-Side OCR", "📱 Phone Number Parser", "💳 UPI & Link Extraction"],
        "narration": "In Step 2, upload your digital evidence. Simply drop screenshots of fraudulent WhatsApp chats, SMS, fake bank websites, or illicit loan apps. Client-side OCR scans the images in browser memory and extracts scammer phone numbers, UPI VPAs, and malicious links."
    },
    {
        "id": "site_06",
        "category": "Site Tour: Steps 3 & 4 Chronology & Freeze",
        "title": "STEPS 3 & 4: INCIDENT TIMELINE & BANK FREEZE",
        "subtitle": "Interactive chronology builder & Section 106 BNSS freeze notice",
        "image": f"{ARTIFACTS_DIR}/feature_fir_chronology.png",
        "badges": ["⏱️ Chronology Milestone Builder", "💰 12-Digit UTR Tracking", "🛑 Sec 106 BNSS Freeze Notice", "📧 Bank Nodal Dispatch"],
        "narration": "Step 3 allows you to build an interactive incident chronology. In Step 4, enter your financial transaction IDs and 12-digit UTR numbers. The system instantly generates a formal Section 106 BNSS bank account freeze notice to halt fund diversion."
    },
    {
        "id": "site_07",
        "category": "Site Tour: Step 5 Final Output",
        "title": "STEP 5: OFFICIAL POLICE FIR & BSA CERTIFICATE",
        "subtitle": "Court-admissible FIR draft citing BNS 2023 & Section 63 BSA certificate",
        "image": f"{ARTIFACTS_DIR}/feature_auto_generated_fir.png",
        "badges": ["📄 Formatted FIR Letterhead", "📜 Sec 63 BSA Certificate", "🖨️ Print & PDF Ready", "⚖️ Statutory Section Citations"],
        "narration": "Step 5 automatically drafts a court-admissible First Information Report citing exact sections of the BNS 2023 and IT Act 2000. It also generates the mandatory Section 63 BSA electronic evidence certificate complete with cryptographic SHA-256 hashes."
    },
    {
        "id": "site_08",
        "category": "Site Tour: Vault & Public Registry",
        "title": "CLIENT-SIDE VAULT & THREAT DIRECTORY",
        "subtitle": "AES-256-GCM encrypted backup & public scammer lookup",
        "image": f"{ARTIFACTS_DIR}/preview_vault.png",
        "badges": ["🔐 AES-256-GCM Encryption", "📁 Standalone .enc Files", "🔍 Public Suspect Lookup", "👮 Law Enforcement Console"],
        "narration": "For maximum data protection, the client-side AES-256-GCM encrypted vault lets you lock complaints into secure standalone files. Meanwhile, the Public Threat Directory and Law Enforcement portal allow quick lookup of reported scam numbers and UPI IDs."
    },
    {
        "id": "site_09",
        "category": "Site Tour: Emergency Protocol & Codex",
        "title": "GOLDEN HOUR ACTIONS & CYBER LAW CODEX",
        "subtitle": "First 60 minutes response guidelines & statutory rights compendium",
        "image": f"{ARTIFACTS_DIR}/feature_emergency_action_modal.png",
        "badges": ["🚨 Golden Hour Playbook", "📖 Indian Cyber Law Codex", "🤖 24x7 Cyber Sahayak", "🛡️ Sovereign Citizen Defense"],
        "narration": "With full Golden Hour protocols, a comprehensive Cyber Law Codex, and continuous guidance from Cyber Sahayak AI, the system provides sovereign legal defense for every Indian citizen. Safe, private, and powerful."
    }
]

def produce_video(scenes, video_name, title_prefix):
    print(f"\n==================================================")
    print(f"PRODUCING VIDEO: {video_name}")
    print(f"==================================================")
    seg_list = []
    
    for idx, sc in enumerate(scenes):
        sc_num = idx + 1
        total = len(scenes)
        slide_img = f"{TMP_DIR}/{sc['id']}_slide.jpg"
        audio_aiff = f"{TMP_DIR}/{sc['id']}.aiff"
        audio_wav = f"{TMP_DIR}/{sc['id']}.wav"
        seg_mp4 = f"{TMP_DIR}/{sc['id']}_seg.mp4"

        print(f"[{sc_num}/{total}] Rendering Slide: {sc['title']}")
        render_slide(
            output_path=slide_img,
            scene_num=sc_num,
            total_scenes=total,
            category=sc['category'],
            title=sc['title'],
            subtitle=sc['subtitle'],
            image_path=sc['image'],
            badges=sc['badges'],
            narration_text=sc['narration']
        )

        print(f"[{sc_num}/{total}] Generating Narration Audio...")
        subprocess.run(['say', '-v', 'Rishi', '-r', '175', '-o', audio_aiff, sc['narration']], check=True)
        # Pad audio with 0.4s silence at end for smooth transition
        subprocess.run([
            FFMPEG, '-y', '-i', audio_aiff,
            '-af', 'apad=pad_dur=0.4',
            '-ar', '44100', audio_wav
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        print(f"[{sc_num}/{total}] Encoding Scene Clip...")
        # Create video segment matching audio length
        subprocess.run([
            FFMPEG, '-y',
            '-loop', '1', '-i', slide_img,
            '-i', audio_wav,
            '-c:v', 'libx264', '-tune', 'stillimage',
            '-c:a', 'aac', '-b:a', '192k',
            '-pix_fmt', 'yuv420p',
            '-shortest',
            seg_mp4
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        seg_list.append(seg_mp4)

    # Concat segments
    concat_txt = f"{TMP_DIR}/{video_name}_concat.txt"
    with open(concat_txt, 'w') as f:
        for s in seg_list:
            f.write(f"file '{s}'\n")

    final_output = f"{PROJECT_DIR}/{video_name}.mp4"
    final_artifact = f"{ARTIFACTS_DIR}/{video_name}.mp4"
    poster_output = f"{PROJECT_DIR}/{video_name}_poster.jpg"
    poster_artifact = f"{ARTIFACTS_DIR}/{video_name}_poster.jpg"

    print(f"\nConcatenating {len(seg_list)} segments into {final_output}...")
    subprocess.run([
        FFMPEG, '-y',
        '-f', 'concat', '-safe', '0', '-i', concat_txt,
        '-c', 'copy',
        final_output
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    # Extract first frame as high-res poster
    subprocess.run([
        FFMPEG, '-y',
        '-i', final_output,
        '-vframes', '1',
        '-q:v', '2',
        poster_output
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    # Copy to artifacts directory
    subprocess.run(['cp', final_output, final_artifact], check=True)
    subprocess.run(['cp', poster_output, poster_artifact], check=True)

    # Check duration
    res = subprocess.run([FFMPEG, '-i', final_output], stderr=subprocess.PIPE, text=True)
    dur_str = "Unknown"
    for line in res.stderr.splitlines():
        if 'Duration:' in line:
            dur_str = line.split('Duration:')[1].split(',')[0].strip()
            break

    print(f"✅ Video created successfully: {final_output}")
    print(f"   Duration: {dur_str}")
    print(f"   Poster: {poster_output}")
    print(f"   Artifact copy: {final_artifact}")

if __name__ == '__main__':
    produce_video(LAUNCH_SCENES, "launch_video", "Launch Video")
    produce_video(SITE_SCENES, "site_experience_video", "Site Experience Video")
    print("\n🎉 ALL 2 VIDEOS PRODUCED SUCCESSFULLY!")
