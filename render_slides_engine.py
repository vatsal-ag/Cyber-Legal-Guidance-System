import os
import subprocess
import textwrap
from PIL import Image, ImageDraw, ImageFont, ImageFilter

FFMPEG = '/Users/vatsalagarwal/.gemini/antigravity/bin/ffmpeg'
ARTIFACTS_DIR = '/Users/vatsalagarwal/.gemini/antigravity/brain/f2dddf3d-b128-463f-b7e6-02174b88d7a9'
OUTPUT_DIR = '/Users/vatsalagarwal/Documents/Projects/Vatsal/Coding Based/Cyber Legal Guidance System V2'

# Font setup
BOLD_FONT = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
REG_FONT = '/System/Library/Fonts/Supplemental/Arial.ttf'
MONO_FONT = '/System/Library/Fonts/Menlo.ttc'

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

font_header = get_font(BOLD_FONT, 22)
font_title = get_font(BOLD_FONT, 44)
font_subtitle = get_font(REG_FONT, 24)
font_badge = get_font(BOLD_FONT, 20)
font_subtitles = get_font(REG_FONT, 22)
font_tag = get_font(BOLD_FONT, 18)

def render_slide(output_path, scene_num, total_scenes, category, title, subtitle, image_path, badges, narration_text):
    W, H = 1920, 1080
    im = Image.new('RGB', (W, H), (11, 25, 44)) # dark navy #0b192c
    draw = ImageDraw.Draw(im)

    # 1. Subtle background glow & gradient
    for y in range(H):
        ratio = y / H
        r = int(11 + 8 * (1 - ratio))
        g = int(25 + 15 * ratio)
        b = int(44 + 30 * ratio)
        draw.line([(0, y), (W, y)], fill=(r, g, b))

    # 2. Top Tiranga Accent Line (Saffron, White, Green)
    bar_h = 6
    draw.rectangle([0, 0, W // 3, bar_h], fill=(255, 153, 51))
    draw.rectangle([W // 3, 0, 2 * W // 3, bar_h], fill=(255, 255, 255))
    draw.rectangle([2 * W // 3, 0, W, bar_h], fill=(19, 136, 8))

    # 3. Header bar
    draw.rectangle([0, bar_h, W, bar_h + 60], fill=(14, 36, 66))
    draw.text((40, bar_h + 18), "🇮🇳 NATIONAL CYBER LEGAL GUIDANCE & CORPORATE INCIDENT DEFENSE SYSTEM", fill=(255, 255, 255), font=font_header)
    
    # Category / Pill
    cat_text = f"● {category.upper()}"
    draw.text((1420, bar_h + 18), cat_text, fill=(245, 158, 11), font=font_header)
    scene_text = f"[{scene_num}/{total_scenes}]"
    draw.text((1820, bar_h + 18), scene_text, fill=(148, 163, 184), font=font_header)
    draw.line([(0, bar_h + 60), (W, bar_h + 60)], fill=(30, 58, 138), width=2)

    # 4. Title & Subtitle
    top_y = 90
    draw.text((40, top_y), title, fill=(255, 255, 255), font=font_title)
    draw.text((40, top_y + 54), subtitle, fill=(148, 163, 184), font=font_subtitle)

    # 5. Badges
    badge_x = 40
    badge_y = top_y + 96
    for b_text in badges:
        # Measure text width
        bbox = draw.textbbox((0, 0), b_text, font=font_badge)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        bw = tw + 28
        bh = 38
        draw.rounded_rectangle([badge_x, badge_y, badge_x + bw, badge_y + bh], radius=8, fill=(30, 41, 59), outline=(59, 130, 246), width=1)
        draw.text((badge_x + 14, badge_y + 8), b_text, fill=(226, 232, 240), font=font_badge)
        badge_x += bw + 14

    # 6. Center Visual Display (Device Frame / Screenshot Card)
    card_x = 40
    card_y = 250
    card_w = 1840
    card_h = 710

    # Outer frame glow
    draw.rounded_rectangle([card_x - 3, card_y - 3, card_x + card_w + 3, card_y + card_h + 3], radius=16, outline=(30, 58, 138), width=2)
    draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=14, fill=(15, 23, 42))

    # Browser tab bar mockup
    draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + 40], radius=14, fill=(30, 41, 59))
    draw.rectangle([card_x, card_y + 20, card_x + card_w, card_y + 40], fill=(30, 41, 59)) # square bottom corners
    # 3 dots
    draw.ellipse([card_x + 18, card_y + 14, card_x + 30, card_y + 26], fill=(239, 68, 68))
    draw.ellipse([card_x + 38, card_y + 14, card_x + 50, card_y + 26], fill=(245, 158, 11))
    draw.ellipse([card_x + 58, card_y + 14, card_x + 70, card_y + 26], fill=(16, 185, 129))
    draw.text((card_x + 90, card_y + 11), "https://cybercrime.gov.in/guidance/ — Sovereign Cockpit Live Experience", fill=(148, 163, 184), font=font_tag)

    # Embed Screenshot
    if os.path.exists(image_path):
        try:
            screenshot = Image.open(image_path).convert('RGB')
            # Fit inside card_w - 4, card_h - 44
            inner_w = card_w - 4
            inner_h = card_h - 44
            screenshot.thumbnail((inner_w, inner_h), Image.Resampling.LANCZOS)
            sw, sh = screenshot.size
            # Center horizontally and vertically inside the viewport
            px = card_x + 2 + (inner_w - sw) // 2
            py = card_y + 42 + (inner_h - sh) // 2
            im.paste(screenshot, (px, py))
        except Exception as e:
            print("Failed to embed image:", image_path, e)
            draw.text((card_x + 100, card_y + 100), f"Visual Preview: {title}", fill=(255, 255, 255), font=font_title)

    # 7. Bottom Narration Subtitle Banner
    draw.rectangle([0, H - 90, W, H], fill=(10, 15, 28))
    draw.line([(0, H - 90), (W, H - 90)], fill=(37, 99, 235), width=2)
    # Format subtitle lines
    sub_lines = textwrap.wrap(narration_text, width=115)
    if len(sub_lines) > 2:
        sub_lines = sub_lines[:2]
        sub_lines[1] += '...'
    line_y = H - 76 if len(sub_lines) == 1 else H - 82
    for s_line in sub_lines:
        bbox = draw.textbbox((0, 0), s_line, font=font_subtitles)
        tw = bbox[2] - bbox[0]
        sx = (W - tw) // 2
        draw.text((sx, line_y), s_line, fill=(241, 245, 249), font=font_subtitles)
        line_y += 30

    im.save(output_path, 'JPEG', quality=95)
    print("Saved slide:", output_path)

print("Slide renderer defined successfully.")
