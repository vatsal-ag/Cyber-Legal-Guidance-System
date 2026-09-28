import subprocess
import time
import os

CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
OUT_DIR = '/tmp/clgs_pure_tour'
os.makedirs(OUT_DIR, exist_ok=True)

VIEWS = [
    ("01_hero", "hero"),
    ("02_express", "express"),
    ("03_step1_kyc", "step1_kyc"),
    ("04_legal_modal", "legal_modal"),
    ("05_liveness_modal", "liveness_modal"),
    ("06_step2_forensics", "step2_forensics"),
    ("07_step2_gov_alert", "step2_gov_alert"),
    ("08_gov_dispatch", "gov_dispatch"),
    ("09_step3_incident", "step3_incident"),
    ("10_step4_freeze", "step4_freeze"),
    ("11_step5_fir", "step5_fir"),
    ("12_step6_bsa", "step6_bsa"),
    ("13_tab_vault", "tab_vault"),
    ("14_cyber_sahayak", "cyber_sahayak"),
]

print("Starting headless Chrome screencast batch captures at 1920x1080...")

for idx, (name, view_param) in enumerate(VIEWS):
    out_file = f"{OUT_DIR}/{name}.png"
    url = f"http://localhost:8000/?view={view_param}"
    print(f"[{idx+1}/{len(VIEWS)}] Capturing {name} from {url}...")
    cmd = [
        CHROME,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--virtual-time-budget=3000",
        "--run-all-compositor-stages-before-draw",
        "--window-size=1920,1080",
        f"--screenshot={out_file}",
        url
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    if os.path.exists(out_file):
        sz = os.path.getsize(out_file)
        print(f"   -> Saved: {out_file} ({sz} bytes)")
    else:
        print(f"   ❌ FAILED to capture {out_file}")

print("Batch capture completed!")
