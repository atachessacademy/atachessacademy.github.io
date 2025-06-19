import os
from PIL import Image

ROLLS = ['roll1', 'roll2', 'roll3']
INPUT_DIR = 'raw_images'
OUTPUT_DIR = 'images'
TARGET_SIZE = (900, 900)
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}
BASE_PATH = OUTPUT_DIR  # Used in generate_roll_html()

# Resize images and populate output folder
for roll in ROLLS:
    folder = os.path.join(INPUT_DIR, roll)
    out_folder = os.path.join(OUTPUT_DIR, roll)
    os.makedirs(out_folder, exist_ok=True)

    for filename in sorted(os.listdir(folder)):
        if os.path.splitext(filename)[1].lower() in ALLOWED_EXTENSIONS:
            src_path = os.path.join(folder, filename)
            dst_path = os.path.join(out_folder, os.path.splitext(filename)[0] + ".jpg")  # normalize to .jpg

            # Resize and save
            with Image.open(src_path) as img:
                img = img.convert("RGB")
                img_resized = img.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
                img_resized.save(dst_path, format="JPEG")


def generate_roll_html(roll_id):
    folder = os.path.join(BASE_PATH, roll_id)
    if not os.path.exists(folder):
        return f'<!-- {roll_id} folder not found -->'

    images = sorted(
        f for f in os.listdir(folder)
        if os.path.splitext(f)[1].lower() == '.jpg'
    )

    if not images:
        return f'<!-- No images in {roll_id} -->'

    # Duplicate images for seamless animation
    doubled_images = images
    return "\n" + "\n".join(f'                        <img src="{folder}/{img}">' for img in doubled_images)


# Read the index template
with open("index_template.html", "r") as f:
    template = f.read()

# Generate image roll HTML and replace placeholders
for roll_id in ROLLS:
    marker = f"<!-- AUTO-GENERATE-{roll_id.upper()} -->"
    replacement = generate_roll_html(roll_id)
    template = template.replace(marker, replacement)

# Write final HTML
with open("index.html", "w") as f:
    f.write(template)
