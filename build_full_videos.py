import os
import subprocess
from PIL import Image, ImageDraw, ImageFont
from render_slides_engine import render_slide

FFMPEG = '/Users/vatsalagarwal/.gemini/antigravity/bin/ffmpeg'
ARTIFACTS_DIR = '/Users/vatsalagarwal/.gemini/antigravity/brain/f2dddf3d-b128-463f-b7e6-02174b88d7a9'
PROJECT_DIR = '/Users/vatsalagarwal/Documents/Projects/Vatsal/Coding Based/Cyber Legal Guidance System V2'
TMP_DIR = '/tmp/clgs_video_build'

os.makedirs(TMP_DIR, exist_ok=True)
os.makedirs(f"{TMP_DIR}/launch", exist_ok=True)
os.makedirs(f"{TMP_DIR}/site", exist_ok=True)

BOLD_FONT = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
REG_FONT = '/System/Library/Fonts/Supplemental/Arial.ttf'

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

font_hud_title = get_font(BOLD_FONT, 18)
font_hud_sub = get_font(REG_FONT, 16)

# ══════════════════════════════════════════════════════════════════════════════
# VIDEO 1: LAUNCH VIDEO (9 SCENES WITH RISHI NARRATION)
# ══════════════════════════════════════════════════════════════════════════════
LAUNCH_SCENES = [
    {
        "id": "launch_01",
        "category": "National Challenge & Mission",
        "title": "THE CYBER CRIME EPIDEMIC IN INDIA",
        "subtitle": "Critical need for immediate legal action during the Golden Hour",
        "image": "/tmp/clgs_pure_tour/01_hero.png",
        "badges": ["🚨 National Helpline 1930", "⚡ Golden Hour Defense", "🛡️ Citizen Protection", "📉 Stop Fund Siphoning"],
        "narration": "Cyber fraud, digital extortion, and financial scams in India demand rapid, legally binding response. Millions are lost in the Golden Hour before victims can file an accurate police complaint. The National Cyber Legal Guidance and Corporate Incident Defense System transforms how India fights cybercrime."
    },
    {
        "id": "launch_02",
        "category": "Sovereign Architecture",
        "title": "SOVEREIGN IN-BROWSER CYBER COCKPIT",
        "subtitle": "Statutory alignment under IT Act 2000, BNS 2023 & DPDP Act 2023",
        "image": "/tmp/clgs_pure_tour/02_express.png",
        "badges": ["🇮🇳 Sovereign Bharat Defense", "⚖️ IT Act & BNS 2023", "🔒 Zero Plaintext Exposure", "🏛️ I4C & CERT-In Compliant"],
        "narration": "A sovereign digital cockpit aligning Indian citizens and enterprises with state police standards and statutory cyber law. Designed with zero server exposure, every computation runs client-side under strict DPDP Act and CERT-In mandates."
    },
    {
        "id": "launch_03",
        "category": "Statutory Legal Undertaking",
        "title": "MANDATORY BNS 2023 LEGAL UNDERTAKING",
        "subtitle": "Bilingual declaration of evidentiary authenticity & sound mental capacity",
        "image": "/tmp/clgs_pure_tour/04_legal_modal.png",
        "badges": ["⚖️ BNS Sec 217 & 228", "🧠 Sound Mind Declaration", "🇮🇳 Hindi & English", "🛡️ Strict False Filing Penalty"],
        "narration": "To ensure legal integrity and deter fabricated reports, complainants must execute a mandatory bilingual statutory undertaking under Sections 217 and 228 of the Bharatiya Nyaya Sanhita 2023, affirming their evidentiary responsibility and sound mental capacity."
    },
    {
        "id": "launch_04",
        "category": "Biometric Anti-Spoofing",
        "title": "LIVE ON-SPOT PHOTO VERIFICATION",
        "subtitle": "Real-time motion challenge engine rejecting static photos & fake IDs",
        "image": "/tmp/clgs_pure_tour/05_liveness_modal.png",
        "badges": ["📷 Dynamic Webcam Challenges", "🚫 Static Photo Rejection", "🪪 ID Replay Detection", "🔒 Verified Complainant Binding"],
        "narration": "Identity fraud is eliminated at the source. The live on-spot anti-spoofing engine presents real-time micro-motion challenges, actively rejecting printed photographs, fake college IDs, and screen replay attacks before binding evidence to the complainant."
    },
    {
        "id": "launch_05",
        "category": "Forensic Engineering",
        "title": "DEEP FORENSIC EVIDENCE & ELA TAMPER ENGINE",
        "subtitle": "Error Level Analysis, Laplacian noise consistency & block clone detection",
        "image": "/tmp/clgs_pure_tour/06_step2_forensics.png",
        "badges": ["🔬 Error Level Analysis (ELA)", "📐 Laplacian Noise CV", "🔍 Clone Duplication Check", "📜 BSA Section 63 Admissible"],
        "narration": "Digital evidence must withstand courtroom examination. The built-in Forensic Evidence Engine scrutinizes uploaded screenshots for software signatures, computes Error Level Analysis heatmaps, verifies Laplacian noise uniformity, and flags copy-move clone tampering."
    },
    {
        "id": "launch_06",
        "category": "Threat Intelligence",
        "title": "COMPROMISED GOVT DIRECTORY & THREAT ALERTS",
        "subtitle": "Cross-referencing spoofed caller IDs with automated CERT-In dispatch",
        "image": "/tmp/clgs_pure_tour/07_step2_gov_alert.png",
        "badges": ["🏛️ Official Govt Directory", "🚨 Spoofed Caller ID Warning", "⚡ CERT-In Dispatch Modal", "📋 Export CSV Audits"],
        "narration": "When syndicates impersonate police or government officers, the system cross-references national authority directories. Detecting compromised numbers, it provides immediate citizen advisories and formats formal incident dispatch notices for departmental SOCs."
    },
    {
        "id": "launch_07",
        "category": "Fund Recovery",
        "title": "SECTION 106 BNSS BANK ACCOUNT FREEZE",
        "subtitle": "12-digit UTR tracking & instantaneous bank nodal officer notice",
        "image": "/tmp/clgs_pure_tour/10_step4_freeze.png",
        "badges": ["🏦 12-Digit UTR Tracking", "🛑 Sec 106 BNSS Freeze Notice", "📧 Bank Nodal Dispatch", "⏱️ Sub-Minute Action"],
        "narration": "In financial cyber fraud, speed is everything. Capturing 12-digit UTR numbers, the system drafts statutory Section 106 BNSS freeze applications to halt illicit fund diversion through mule accounts before the money is withdrawn."
    },
    {
        "id": "launch_08",
        "category": "Statutory FIR Drafting",
        "title": "COURT-READY POLICE FIR & SECTION 63 BSA",
        "subtitle": "Automated legal drafting citing IT Act 2000 & BNS 2023 with SHA-256 hashes",
        "image": "/tmp/clgs_pure_tour/11_step5_fir.png",
        "badges": ["📄 Formatted FIR Application", "📜 Sec 63 BSA Certificate", "🔐 SHA-256 Bitstream Hash", "🖨️ PDF & Print Ready"],
        "narration": "Generate complete, court-ready First Information Report applications categorized under the IT Act 2000 and Bharatiya Nyaya Sanhita 2023, paired with mandatory Section 63 BSA electronic evidence certificates."
    },
    {
        "id": "launch_09",
        "category": "Privacy & Citizen AI",
        "title": "AES-256-GCM VAULT & CYBER SAHAYAK AI",
        "subtitle": "Zero-knowledge encrypted storage with 24/7 bilingual voice assistant",
        "image": "/tmp/clgs_pure_tour/14_cyber_sahayak.png",
        "badges": ["🔐 AES-256-GCM Vault", "🤖 Cyber Sahayak AI Mitra", "🎙️ Speech-Enabled Input", "🇮🇳 Sovereign Bharat Defense"],
        "narration": "Complete data confidentiality is guaranteed through client-side AES-256-GCM encryption. Backed by the 24/7 bilingual Cyber Sahayak AI companion, sovereign legal defense is now in the hands of every Indian citizen and business."
    }
]

# ══════════════════════════════════════════════════════════════════════════════
# VIDEO 2: PURE SITE EXPERIENCE VIDEO (14 SCENES, NO HUMAN VOICE, NO BEZELS)
# ══════════════════════════════════════════════════════════════════════════════
PURE_SITE_SCENES = [
    {
        "id": "pure_01",
        "raw_img": "/tmp/clgs_pure_tour/01_hero.png",
        "hud_title": "01 / 14 · SOVEREIGN HEADER & CONTROLS",
        "hud_desc": "Helpline 1930, I4C / CERT-In compliance, dark mode & Hindi toggle"
    },
    {
        "id": "pure_02",
        "raw_img": "/tmp/clgs_pure_tour/02_express.png",
        "hud_title": "02 / 14 · EXPRESS NATURAL LANGUAGE INTAKE",
        "hud_desc": "Voice microphone input & conversational incident triage chips"
    },
    {
        "id": "pure_03",
        "raw_img": "/tmp/clgs_pure_tour/03_step1_kyc.png",
        "hud_title": "03 / 14 · COMPLAINANT KYC & JURISDICTION",
        "hud_desc": "Citizen vs Corporate intake, 3-line Indian address & automated police routing"
    },
    {
        "id": "pure_04",
        "raw_img": "/tmp/clgs_pure_tour/04_legal_modal.png",
        "hud_title": "04 / 14 · STATUTORY LEGAL UNDERTAKING",
        "hud_desc": "Mandatory bilingual affirmation under BNS 2023 & sound mental capacity"
    },
    {
        "id": "pure_05",
        "raw_img": "/tmp/clgs_pure_tour/05_liveness_modal.png",
        "hud_title": "05 / 14 · LIVE ON-SPOT PHOTO ANTI-SPOOFING",
        "hud_desc": "Real-time motion challenge engine rejecting static photos & fake IDs"
    },
    {
        "id": "pure_06",
        "raw_img": "/tmp/clgs_pure_tour/06_step2_forensics.png",
        "hud_title": "06 / 14 · DEEP FORENSIC EVIDENCE & ELA TAMPER AUDIT",
        "hud_desc": "Authenticity score meter, ELA heatmap, Laplacian noise & clone block check"
    },
    {
        "id": "pure_07",
        "raw_img": "/tmp/clgs_pure_tour/07_step2_gov_alert.png",
        "hud_title": "07 / 14 · COMPROMISED GOVERNMENT NUMBER THREAT ALERT",
        "hud_desc": "Cross-reference official directory against caller ID spoofing & impersonation"
    },
    {
        "id": "pure_08",
        "raw_img": "/tmp/clgs_pure_tour/08_gov_dispatch.png",
        "hud_title": "08 / 14 · AUTOMATED IT SECURITY INCIDENT DISPATCH",
        "hud_desc": "Immediate statutory alert notification to department CISO, CERT-In & NCIIPC"
    },
    {
        "id": "pure_09",
        "raw_img": "/tmp/clgs_pure_tour/09_step3_incident.png",
        "hud_title": "09 / 14 · TRIAL-PERSONALIZED QUESTIONS MATRIX",
        "hud_desc": "Dynamic interrogation matrix tailored to specific cyber extortion offences"
    },
    {
        "id": "pure_10",
        "raw_img": "/tmp/clgs_pure_tour/10_step4_freeze.png",
        "hud_title": "10 / 14 · SECTION 106 BNSS BANK ACCOUNT FREEZE",
        "hud_desc": "12-digit UTR tracking & instantaneous bank nodal officer freeze application"
    },
    {
        "id": "pure_11",
        "raw_img": "/tmp/clgs_pure_tour/11_step5_fir.png",
        "hud_title": "11 / 14 · COURT-READY POLICE FIR COMPLAINT",
        "hud_desc": "Standardized police complaint citing BNS 2023 & IT Act 2000 sections"
    },
    {
        "id": "pure_12",
        "raw_img": "/tmp/clgs_pure_tour/12_step6_bsa.png",
        "hud_title": "12 / 14 · SECTION 63 BSA ELECTRONIC CERTIFICATE",
        "hud_desc": "Mandatory admissibility certificate complete with SHA-256 bitstream hashes"
    },
    {
        "id": "pure_13",
        "raw_img": "/tmp/clgs_pure_tour/13_tab_vault.png",
        "hud_title": "13 / 14 · ZERO-KNOWLEDGE CRYPTOGRAPHIC VAULT",
        "hud_desc": "AES-256-GCM client-side encryption locking complaints into standalone .enc files"
    },
    {
        "id": "pure_14",
        "raw_img": "/tmp/clgs_pure_tour/14_cyber_sahayak.png",
        "hud_title": "14 / 14 · 24/7 CYBER SAHAYAK AI MITRA CHATBOT",
        "hud_desc": "Proactive step-aware conversational companion in Hindi and English"
    }
]

# ══════════════════════════════════════════════════════════════════════════════
# BUILD VIDEO 1: LAUNCH VIDEO
# ══════════════════════════════════════════════════════════════════════════════
def build_launch_video():
    print(f"\n==================================================")
    print(f"PRODUCING VIDEO 1: LAUNCH VIDEO (9 SCENES)")
    print(f"==================================================")
    seg_list = []
    total = len(LAUNCH_SCENES)

    for idx, sc in enumerate(LAUNCH_SCENES):
        sc_num = idx + 1
        slide_img = f"{TMP_DIR}/launch/{sc['id']}_slide.jpg"
        audio_aiff = f"{TMP_DIR}/launch/{sc['id']}.aiff"
        audio_wav = f"{TMP_DIR}/launch/{sc['id']}.wav"
        seg_mp4 = f"{TMP_DIR}/launch/{sc['id']}_seg.mp4"

        print(f"[{sc_num}/{total}] Rendering Launch Slide: {sc['title']}")
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

        print(f"[{sc_num}/{total}] Generating Rishi Narration...")
        subprocess.run(['say', '-v', 'Rishi', '-r', '175', '-o', audio_aiff, sc['narration']], check=True)
        subprocess.run([
            FFMPEG, '-y', '-i', audio_aiff,
            '-af', 'apad=pad_dur=0.4',
            '-ar', '44100', audio_wav
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        print(f"[{sc_num}/{total}] Encoding Scene Segment...")
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

    concat_txt = f"{TMP_DIR}/launch_concat.txt"
    with open(concat_txt, 'w') as f:
        for s in seg_list:
            f.write(f"file '{s}'\n")

    targets = [
        f"{PROJECT_DIR}/launch_video.mp4",
        f"{PROJECT_DIR}/Launch Video.mp4",
        f"{ARTIFACTS_DIR}/launch_video.mp4",
        f"{ARTIFACTS_DIR}/Launch Video.mp4"
    ]
    poster_targets = [
        f"{PROJECT_DIR}/launch_video_poster.jpg",
        f"{PROJECT_DIR}/Launch Video.jpg",
        f"{ARTIFACTS_DIR}/launch_video_poster.jpg",
        f"{ARTIFACTS_DIR}/Launch Video.jpg"
    ]

    print(f"\nConcatenating {len(seg_list)} segments into final Launch Video...")
    subprocess.run([
        FFMPEG, '-y',
        '-f', 'concat', '-safe', '0', '-i', concat_txt,
        '-c', 'copy',
        targets[0]
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    # Extract poster
    subprocess.run([
        FFMPEG, '-y',
        '-i', targets[0],
        '-vframes', '1',
        '-q:v', '2',
        poster_targets[0]
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    # Duplicate to alias files and artifacts
    for t in targets[1:]:
        subprocess.run(['cp', targets[0], t], check=True)
    for p in poster_targets[1:]:
        subprocess.run(['cp', poster_targets[0], p], check=True)

    # Duration check
    res = subprocess.run([FFMPEG, '-i', targets[0]], stderr=subprocess.PIPE, text=True)
    dur = "Unknown"
    for line in res.stderr.splitlines():
        if 'Duration:' in line:
            dur = line.split('Duration:')[1].split(',')[0].strip()
            break

    print(f"✅ Launch Video successfully created!")
    print(f"   Output: {targets[0]}")
    print(f"   Duration: {dur}")

# ══════════════════════════════════════════════════════════════════════════════
# BUILD VIDEO 2: PURE SITE EXPERIENCE VIDEO (NO HUMAN VOICE, NO BEZELS)
# ══════════════════════════════════════════════════════════════════════════════
def build_pure_site_video():
    print(f"\n==================================================")
    print(f"PRODUCING VIDEO 2: PURE SITE EXPERIENCE VIDEO (14 SCENES)")
    print(f"==================================================")
    
    seg_list = []
    total = len(PURE_SITE_SCENES)
    SCENE_DURATION = 6.0  # 14 scenes x 6.0s = 84s (1m 24s > 1:10)

    for idx, sc in enumerate(PURE_SITE_SCENES):
        sc_num = idx + 1
        frame_img = f"{TMP_DIR}/site/{sc['id']}_frame.png"
        seg_mp4 = f"{TMP_DIR}/site/{sc['id']}_seg.mp4"

        print(f"[{sc_num}/{total}] Preparing Pure Screencast Frame: {sc['hud_title']}")
        # Open 1920x1080 raw screenshot
        raw = Image.open(sc['raw_img']).convert('RGBA')
        W, H = raw.size

        # Create overlay for sleek bottom HUD strip (y: 1042..1080, 38px)
        overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        odraw = ImageDraw.Draw(overlay)
        odraw.rectangle([0, H - 42, W, H], fill=(15, 23, 42, 235))
        odraw.line([(0, H - 42), (W, H - 42)], fill=(56, 189, 248, 140), width=2)
        odraw.text((30, H - 33), sc['hud_title'], fill=(255, 255, 255, 255), font=font_hud_title)
        odraw.text((450, H - 32), f"—  {sc['hud_desc']}", fill=(148, 163, 184, 255), font=font_hud_sub)
        odraw.text((W - 360, H - 32), "SOVEREIGN CYBER DEFENSE COCKPIT", fill=(245, 158, 11, 255), font=font_hud_title)

        # Composite together
        final_frame = Image.alpha_composite(raw, overlay).convert('RGB')
        final_frame.save(frame_img, quality=95)

        # Encode 6.0-second video segment with still image
        subprocess.run([
            FFMPEG, '-y',
            '-loop', '1', '-i', frame_img,
            '-c:v', 'libx264', '-t', str(SCENE_DURATION),
            '-pix_fmt', 'yuv420p',
            '-r', '30',
            seg_mp4
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        seg_list.append(seg_mp4)

    concat_txt = f"{TMP_DIR}/site_concat.txt"
    with open(concat_txt, 'w') as f:
        for s in seg_list:
            f.write(f"file '{s}'\n")

    unmuxed_mp4 = f"{TMP_DIR}/site_unmuxed.mp4"
    print(f"\nConcatenating {len(seg_list)} pure site segments into {unmuxed_mp4}...")
    subprocess.run([
        FFMPEG, '-y',
        '-f', 'concat', '-safe', '0', '-i', concat_txt,
        '-c', 'copy',
        unmuxed_mp4
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    # Total duration = total * SCENE_DURATION = 84 seconds
    total_dur = total * SCENE_DURATION
    ambient_audio = f"{TMP_DIR}/ambient_synth.aac"
    print(f"Generating ambient technological synth background audio ({total_dur}s, NO human voice)...")
    # Generates serene deep harmonic drone (55Hz sub + 110Hz + 165Hz fifth + 220Hz octave with subtle tremolo)
    synth_expr = (
        "sin(2*PI*55*t)*0.16 + "
        "sin(2*PI*110*t)*(0.08 + 0.02*sin(2*PI*0.25*t)) + "
        "sin(2*PI*165*t)*(0.05 + 0.01*cos(2*PI*0.125*t)) + "
        "sin(2*PI*220*t)*0.04"
    )
    subprocess.run([
        FFMPEG, '-y',
        '-f', 'lavfi',
        '-i', f"aevalsrc={synth_expr}:c=stereo:s=44100:d={total_dur}",
        '-c:a', 'aac', '-b:a', '192k',
        ambient_audio
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    targets = [
        f"{PROJECT_DIR}/site_experience_video.mp4",
        f"{PROJECT_DIR}/Site Experience.mp4",
        f"{ARTIFACTS_DIR}/site_experience_video.mp4",
        f"{ARTIFACTS_DIR}/Site Experience.mp4"
    ]
    poster_targets = [
        f"{PROJECT_DIR}/site_experience_video_poster.jpg",
        f"{PROJECT_DIR}/Site Experience.jpg",
        f"{ARTIFACTS_DIR}/site_experience_video_poster.jpg",
        f"{ARTIFACTS_DIR}/Site Experience.jpg"
    ]

    print(f"Muxing pure site video with ambient technological audio into final MP4...")
    subprocess.run([
        FFMPEG, '-y',
        '-i', unmuxed_mp4,
        '-i', ambient_audio,
        '-c:v', 'copy',
        '-c:a', 'copy',
        '-shortest',
        targets[0]
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    # Extract first frame poster
    subprocess.run([
        FFMPEG, '-y',
        '-i', targets[0],
        '-vframes', '1',
        '-q:v', '2',
        poster_targets[0]
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    # Duplicate to alias targets and artifacts
    for t in targets[1:]:
        subprocess.run(['cp', targets[0], t], check=True)
    for p in poster_targets[1:]:
        subprocess.run(['cp', poster_targets[0], p], check=True)

    # Duration check
    res = subprocess.run([FFMPEG, '-i', targets[0]], stderr=subprocess.PIPE, text=True)
    dur = "Unknown"
    for line in res.stderr.splitlines():
        if 'Duration:' in line:
            dur = line.split('Duration:')[1].split(',')[0].strip()
            break

    print(f"✅ Pure Site Experience Video successfully created!")
    print(f"   Output: {targets[0]}")
    print(f"   Duration: {dur}")

if __name__ == '__main__':
    build_launch_video()
    build_pure_site_video()
    print("\n🎉 ALL VIDEOS CREATED AND VERIFIED SUCCESSFULLY!")
