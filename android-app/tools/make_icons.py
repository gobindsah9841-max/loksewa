#!/usr/bin/env python3
"""Draw the launcher icon: an open book with a gold tick, on the app's navy blue.

Usage:  make_icons.py <res-dir>

Writes into <res-dir>:
  drawable/ic_launcher_foreground.xml   vector foreground for the adaptive icon (Android 8+)
  mipmap-anydpi-v26/ic_launcher.xml     the adaptive icon itself
  mipmap-*/ic_launcher.png              plain icons for Android 5 to 7
One list of shapes feeds both, so the two always match.
"""
import os
import sys

from PIL import Image, ImageDraw

NAVY, WHITE, PAGE, GOLD = "#1F3A5F", "#FFFFFF", "#E6EDF7", "#F2B705"

# Shapes in the 108 x 108 grid of an adaptive icon; the visible middle is about 66 units wide.
LEFT_PAGE = [("M", 54, 41), ("C", 48, 36, 38, 35, 29, 37), ("L", 29, 71), ("C", 38, 69, 48, 70, 54, 75), ("Z",)]
RIGHT_PAGE = [("M", 54, 41), ("C", 60, 36, 70, 35, 79, 37), ("L", 79, 71), ("C", 70, 69, 60, 70, 54, 75), ("Z",)]
LINES = [((34, 46), (49, 48)), ((34, 52), (49, 54)), ((34, 58), (49, 60)), ((59, 48), (74, 46)), ((59, 54), (74, 52))]
BADGE = (71, 67, 10.5)
TICK = [(65.5, 67), (69.7, 71.2), (76.8, 62.4)]


def path_data(shape):
    out = []
    for seg in shape:
        out.append(seg[0] + ",".join("%g" % v for v in seg[1:]) if len(seg) > 1 else seg[0])
    return " ".join(out)


def polygon(shape, steps=24):
    pts, cur = [], None
    for seg in shape:
        if seg[0] in ("M", "L"):
            cur = (seg[1], seg[2]); pts.append(cur)
        elif seg[0] == "C":
            x0, y0 = cur; x1, y1, x2, y2, x3, y3 = seg[1:]
            for k in range(1, steps + 1):
                t = k / steps; u = 1 - t
                pts.append((u**3 * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t**3 * x3,
                            u**3 * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t**3 * y3))
            cur = (x3, y3)
    return pts


def vector_xml():
    x, y, r = BADGE
    circle = "M%g,%g a%g,%g 0 1,0 %g,0 a%g,%g 0 1,0 %g,0 Z" % (x - r, y, r, r, 2 * r, r, r, -2 * r)
    lines = "\n".join(
        '    <path android:pathData="M%g,%g L%g,%g" android:strokeColor="#8FA3BF" android:strokeWidth="1.7" android:strokeLineCap="round"/>'
        % (a[0], a[1], b[0], b[1]) for a, b in LINES)
    tick = "M%g,%g L%g,%g L%g,%g" % (TICK[0] + TICK[1] + TICK[2])
    return f'''<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp" android:height="108dp" android:viewportWidth="108" android:viewportHeight="108">
    <path android:pathData="{path_data(LEFT_PAGE)}" android:fillColor="{WHITE}"/>
    <path android:pathData="{path_data(RIGHT_PAGE)}" android:fillColor="{PAGE}"/>
{lines}
    <path android:pathData="{circle}" android:fillColor="{GOLD}" android:strokeColor="{NAVY}" android:strokeWidth="1.6"/>
    <path android:pathData="{tick}" android:strokeColor="{WHITE}" android:strokeWidth="3" android:strokeLineCap="round" android:strokeLineJoin="round"/>
</vector>
'''


ADAPTIVE_XML = '''<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>
'''


def legacy_png(size, scale=8):
    """A rounded navy square with the same drawing, a little larger than in the adaptive icon."""
    n = size * scale
    img = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    pad = n * 0.04
    d.rounded_rectangle([pad, pad, n - pad, n - pad], radius=n * 0.2, fill=NAVY)
    zoom = n / 108.0 * 1.5

    def tr(pt):
        return ((pt[0] - 54) * zoom + n / 2, (pt[1] - 55) * zoom + n / 2)

    d.polygon([tr(p) for p in polygon(LEFT_PAGE)], fill=WHITE)
    d.polygon([tr(p) for p in polygon(RIGHT_PAGE)], fill=PAGE)
    for a, b in LINES:
        d.line([tr(a), tr(b)], fill="#8FA3BF", width=max(1, int(1.7 * zoom)))
    x, y, r = BADGE
    cx, cy = tr((x, y))
    rr = r * zoom
    d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=GOLD, outline=NAVY, width=max(1, int(1.6 * zoom)))
    d.line([tr(p) for p in TICK], fill=WHITE, width=max(2, int(3 * zoom)), joint="curve")
    return img.resize((size, size), Image.LANCZOS)


def main():
    res = sys.argv[1]
    os.makedirs(os.path.join(res, "drawable"), exist_ok=True)
    os.makedirs(os.path.join(res, "mipmap-anydpi-v26"), exist_ok=True)
    open(os.path.join(res, "drawable", "ic_launcher_foreground.xml"), "w", encoding="utf-8").write(vector_xml())
    open(os.path.join(res, "mipmap-anydpi-v26", "ic_launcher.xml"), "w", encoding="utf-8").write(ADAPTIVE_XML)
    for name, size in (("mdpi", 48), ("hdpi", 72), ("xhdpi", 96), ("xxhdpi", 144), ("xxxhdpi", 192)):
        folder = os.path.join(res, "mipmap-" + name)
        os.makedirs(folder, exist_ok=True)
        legacy_png(size).save(os.path.join(folder, "ic_launcher.png"), optimize=True)
    if len(sys.argv) > 2:
        legacy_png(512, scale=4).save(sys.argv[2], optimize=True)


if __name__ == "__main__":
    main()
