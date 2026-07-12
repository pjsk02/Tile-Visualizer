"""
Extract a structured tile catalog from GLOSSY_RANDOM_VOL_1.pdf ("2ft by 4ft Catalog.pdf").

Local, free, CPU-only:
- PyMuPDF (fitz) rasterizes pages (no pdftoppm dependency).
- pytesseract + local Tesseract binary OCRs the rasterized regions (no text layer in PDF).

Output:
- images/<slug>_texture.png   (clean flat tile crop)
- images/<slug>_thumb.png     (downsized texture)
- images/<slug>_lifestyle.png (bottom lifestyle render)
- catalog.json, catalog.csv
- contact_sheet.png (grid of every extracted tile + OCR'd name, for visual QA)
"""

import csv
import json
import re
import sys
from pathlib import Path

import fitz  # PyMuPDF
import pytesseract
from PIL import Image, ImageDraw, ImageFont

TESSERACT_CMD = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD

REPO_ROOT = Path(__file__).resolve().parent.parent
PDF_PATH = REPO_ROOT / "2ft by 4ft Catalog.pdf"
IMAGES_DIR = REPO_ROOT / "images"
CATALOG_JSON = REPO_ROOT / "catalog.json"
CATALOG_CSV = REPO_ROOT / "catalog.csv"
CONTACT_SHEET = REPO_ROOT / "contact_sheet.png"

DPI = 200
ZOOM = DPI / 72.0

# Fractional crop boxes (left, top, right, bottom), validated against pages 10/20/30/40/50/60.
CROP_NAME = (0.06, 0.225, 0.46, 0.262)
CROP_FIELDS = (0.44, 0.245, 0.78, 0.345)
CROP_TILE = (0.09, 0.255, 0.44, 0.60)
CROP_LIFESTYLE = (0.0, 0.65, 1.0, 1.0)

FINISH = "glossy"
COLLECTION = "Glossy Random Vol 1"
SIZE_MM = "600x1200"
WIDTH_FT = 2
HEIGHT_FT = 4

THUMB_WIDTH = 300

FAMILY_KEYWORDS = [
    "Onyx", "Carrara", "Statuario", "Travertyna", "Travertine", "Travartino",
    "Marmo", "Marble", "Breccia", "Brecia", "Crystel", "Crema", "Aqua",
    "Fusion", "Verde", "Cornica",
]


def crop_box(w, h, frac):
    l, t, r, b = frac
    return (int(l * w), int(t * h), int(r * w), int(b * h))


def ocr_line(img, psm=6):
    cfg = f"--psm {psm}"
    return pytesseract.image_to_string(img, config=cfg).strip()


def ocr_name(img):
    """Name crop sometimes bleeds into the tile image below it, which breaks
    tesseract's single-line mode (psm 7). psm 6 (uniform block) handles that
    gracefully -- just take its first non-blank line."""
    text = pytesseract.image_to_string(img, config="--psm 6")
    first_line = next((line for line in text.splitlines() if line.strip()), "")
    cleaned = re.sub(r"[^A-Za-z ]+", "", first_line)
    return re.sub(r"\s+", " ", cleaned).strip()


def slugify(name):
    s = name.strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def derive_family(name):
    for kw in FAMILY_KEYWORDS:
        if kw.lower() in name.lower():
            return kw
    return name.split()[0] if name.split() else "Unknown"


def dominant_color(img):
    small = img.convert("RGB").resize((32, 32))
    pixels = list(small.getdata())
    n = len(pixels)
    r = sum(p[0] for p in pixels) // n
    g = sum(p[1] for p in pixels) // n
    b = sum(p[2] for p in pixels) // n
    return [r, g, b]


def is_product_page(fields_text):
    t = fields_text.upper()
    return "FINISH" in t or "GLOSSY" in t


def main():
    if not PDF_PATH.exists():
        print(f"ERROR: PDF not found at {PDF_PATH}")
        sys.exit(1)

    IMAGES_DIR.mkdir(exist_ok=True)

    doc = fitz.open(str(PDF_PATH))
    mat = fitz.Matrix(ZOOM, ZOOM)

    tiles = []
    skipped_pages = []
    suspicious = []
    seen_slugs = {}

    for page_index in range(doc.page_count):
        page_num = page_index + 1
        page = doc[page_index]
        pix = page.get_pixmap(matrix=mat)
        img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        w, h = img.size

        fields_img = img.crop(crop_box(w, h, CROP_FIELDS))
        fields_text = ocr_line(fields_img, psm=6)

        if not is_product_page(fields_text):
            skipped_pages.append((page_num, "not a product page (no Finish/Glossy field detected)"))
            continue

        name_img = img.crop(crop_box(w, h, CROP_NAME))
        name = ocr_name(name_img)

        if len(name) < 2:
            suspicious.append((page_num, "empty/garbled name OCR", fields_text[:60]))
            continue

        m = re.search(r"Random[:\s]*[^\d]*(\d{1,2})", fields_text, re.IGNORECASE)
        random_faces = int(m.group(1)) if m else None
        if random_faces is None:
            suspicious.append((page_num, f"could not parse Random: NN for '{name}'", fields_text[:60]))

        tile_img = img.crop(crop_box(w, h, CROP_TILE))
        lifestyle_img = img.crop(crop_box(w, h, CROP_LIFESTYLE))

        slug = slugify(name)
        if slug in seen_slugs:
            seen_slugs[slug] += 1
            slug = f"{slug}-{seen_slugs[slug]}"
        else:
            seen_slugs[slug] = 1

        texture_path = IMAGES_DIR / f"{slug}_texture.png"
        thumb_path = IMAGES_DIR / f"{slug}_thumb.png"
        lifestyle_path = IMAGES_DIR / f"{slug}_lifestyle.png"

        tile_img.save(texture_path)
        lifestyle_img.save(lifestyle_path)

        tw, th = tile_img.size
        thumb = tile_img.resize((THUMB_WIDTH, int(th * THUMB_WIDTH / tw)))
        thumb.save(thumb_path)

        color = dominant_color(tile_img)
        family = derive_family(name)

        tiles.append({
            "id": slug,
            "slug": slug,
            "name": name,
            "finish": FINISH,
            "collection": COLLECTION,
            "width_ft": WIDTH_FT,
            "height_ft": HEIGHT_FT,
            "size_mm": SIZE_MM,
            "texture_path": f"images/{texture_path.name}",
            "thumbnail_path": f"images/{thumb_path.name}",
            "lifestyle_path": f"images/{lifestyle_path.name}",
            "random_faces": random_faces,
            "source_page": page_num,
            "family": family,
            "dominant_color": color,
        })

    with open(CATALOG_JSON, "w", encoding="utf-8") as f:
        json.dump(tiles, f, indent=2)

    if tiles:
        fieldnames = list(tiles[0].keys())
        with open(CATALOG_CSV, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            for t in tiles:
                row = dict(t)
                row["dominant_color"] = ";".join(str(c) for c in row["dominant_color"])
                writer.writerow(row)

    build_contact_sheet(tiles)

    print("=" * 60)
    print("EXTRACTION SUMMARY")
    print("=" * 60)
    print(f"Pages processed: {doc.page_count}")
    print(f"Tiles extracted: {len(tiles)}")
    print(f"Pages skipped (non-product): {len(skipped_pages)}")
    for pnum, reason in skipped_pages:
        print(f"  - page {pnum}: {reason}")
    print(f"Suspicious tiles (spot-check these): {len(suspicious)}")
    for entry in suspicious:
        pnum, reason = entry[0], entry[1]
        print(f"  - page {pnum}: {reason}")
    dupes = {k: v for k, v in seen_slugs.items() if v > 1}
    if dupes:
        print(f"Duplicate names (suffixed): {dupes}")
    print(f"catalog.json -> {CATALOG_JSON}")
    print(f"catalog.csv  -> {CATALOG_CSV}")
    print(f"contact sheet -> {CONTACT_SHEET}")


def build_contact_sheet(tiles):
    if not tiles:
        return
    cols = 8
    rows = (len(tiles) + cols - 1) // cols
    cell_w, cell_h = 160, 220
    sheet = Image.new("RGB", (cols * cell_w, rows * cell_h), "white")
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("arial.ttf", 12)
    except Exception:
        font = ImageFont.load_default()

    for i, t in enumerate(tiles):
        col, row = i % cols, i // cols
        x0, y0 = col * cell_w, row * cell_h
        thumb_path = REPO_ROOT / t["thumbnail_path"]
        try:
            thumb = Image.open(thumb_path)
            thumb.thumbnail((cell_w - 10, cell_h - 40))
            sheet.paste(thumb, (x0 + 5, y0 + 5))
        except Exception:
            pass
        label = f"{t['name']}\np{t['source_page']}"
        draw.text((x0 + 5, y0 + cell_h - 32), label, fill="black", font=font)

    sheet.save(CONTACT_SHEET)


if __name__ == "__main__":
    main()
