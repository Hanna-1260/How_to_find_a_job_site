import os
from PIL import Image

img_path = r"c:\Users\palul\Desktop\תואר ראשון\סמסטר ב\פיתוח אתרי אינטרנט\finalProject\How_to_find_a_job_site\images\scene1.png"
if os.path.exists(img_path):
    img = Image.open(img_path)
    width, height = img.size
    print(f"Image size: {width}x{height}")
    # Print pixels near top-left corner (0,0)
    for y in range(15):
        row = []
        for x in range(15):
            pixel = img.getpixel((x, y))
            # If RGB or RGBA, show value
            row.append(pixel)
        print(f"Row {y}: {row[:10]}")
else:
    print("File not found")
