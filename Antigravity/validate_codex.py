import re
import sys

def validate():
    file_path = "cyber_legal_guidance_system.html"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    print(f"File size: {len(content)} bytes")

    # Check CASE_CITATIONS_DATA
    match = re.search(r"const CASE_CITATIONS_DATA = \{(.*?)\n\};\n\nconst CRIME_SECTIONS_MAP", content, re.DOTALL)
    if not match:
        print("ERROR: CASE_CITATIONS_DATA not found!")
        sys.exit(1)

    citations_block = match.group(1)
    case_keys = re.findall(r'"([A-Z0-9_]+)":\s*\{', citations_block)
    print(f"SUCCESS: Found {len(case_keys)} landmark case citations in CASE_CITATIONS_DATA:")
    for k in case_keys:
        print(f"  - {k}")

    # Check button presence
    if 'id="btn-cat-citations"' not in content:
        print("ERROR: btn-cat-citations not found in HTML!")
        sys.exit(1)
    print("SUCCESS: btn-cat-citations found in HTML.")

    # Check i18n
    if "'codex-cat-citations':" not in content:
        print("ERROR: codex-cat-citations missing in i18n!")
        sys.exit(1)
    print("SUCCESS: codex-cat-citations found in i18n dictionaries.")

    # Check renderLawCodex logic
    if "entry.cat === 'citations'" not in content:
        print("ERROR: citations rendering branch missing in renderLawCodex!")
        sys.exit(1)
    print("SUCCESS: Citations rendering branch verified in renderLawCodex.")

    print("\nALL CODEX VALIDATIONS PASSED PERFECTLY!")

if __name__ == "__main__":
    validate()
