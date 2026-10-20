import re
import sys

def validate():
    file_path = "cyber_legal_guidance_system.html"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    print(f"File size: {len(content)} bytes")

    # 1. Check CASE_CITATIONS_DATA (Indian Citations)
    match_indian = re.search(r"const CASE_CITATIONS_DATA = \{(.*?)\n\};\n\nconst INTERNATIONAL_CITATIONS_DATA", content, re.DOTALL)
    if not match_indian:
        print("ERROR: CASE_CITATIONS_DATA not found!")
        sys.exit(1)

    citations_block = match_indian.group(1)
    case_keys = re.findall(r'"([A-Z0-9_]+)":\s*\{', citations_block)
    print(f"SUCCESS: Found {len(case_keys)} Indian case citations in CASE_CITATIONS_DATA:")
    for k in case_keys:
        print(f"  - {k}")

    # 2. Check INTERNATIONAL_CITATIONS_DATA (Global Precedents)
    match_intl = re.search(r"const INTERNATIONAL_CITATIONS_DATA = \{(.*?)\n\};\n\nconst CRIME_SECTIONS_MAP", content, re.DOTALL)
    if not match_intl:
        print("ERROR: INTERNATIONAL_CITATIONS_DATA not found!")
        sys.exit(1)

    intl_block = match_intl.group(1)
    intl_keys = re.findall(r'"([A-Z0-9_]+)":\s*\{', intl_block)
    print(f"\nSUCCESS: Found {len(intl_keys)} International case citations in INTERNATIONAL_CITATIONS_DATA:")
    for k in intl_keys:
        print(f"  - {k}")

    # 3. Check Filter Buttons in HTML
    if 'id="btn-cat-citations"' not in content:
        print("ERROR: btn-cat-citations not found in HTML!")
        sys.exit(1)
    print("\nSUCCESS: btn-cat-citations found in HTML.")

    if 'id="btn-cat-intl"' not in content:
        print("ERROR: btn-cat-intl not found in HTML!")
        sys.exit(1)
    print("SUCCESS: btn-cat-intl found in HTML.")

    # 4. Check i18n Dictionaries
    if "'codex-cat-citations':" not in content:
        print("ERROR: codex-cat-citations missing in i18n!")
        sys.exit(1)
    if "'codex-cat-intl':" not in content:
        print("ERROR: codex-cat-intl missing in i18n!")
        sys.exit(1)
    print("SUCCESS: codex-cat-citations and codex-cat-intl found in i18n dictionaries.")

    # 5. Check renderLawCodex logic
    if "entry.cat === 'intl'" not in content:
        print("ERROR: International citations rendering branch missing in renderLawCodex!")
        sys.exit(1)
    if "entry.cat === 'citations'" not in content:
        print("ERROR: Indian citations rendering branch missing in renderLawCodex!")
        sys.exit(1)
    print("SUCCESS: Both Indian and International rendering branches verified in renderLawCodex.")

    print("\n=================================================================")
    print("🎉 ALL INDIAN & INTERNATIONAL CODEX VALIDATIONS PASSED 100%!")
    print("=================================================================")

if __name__ == "__main__":
    validate()
