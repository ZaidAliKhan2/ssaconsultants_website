"""Crop the supplied SSA artwork; no tracing, recoloring or background fill."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = Image.open(root / 'assets/images/logo.png').convert('RGBA')
# Source is 3600 x 3600. This rectangle excludes the circle and subtitle.
mark = source.crop((660, 1130, 3020, 2010))
mark = mark.crop(mark.getchannel('A').getbbox())
for size, name in ((32, 'favicon-32.png'), (48, 'favicon.png'), (180, 'apple-touch-icon.png')):
    resized = mark.copy()
    resized.thumbnail((size, size), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    canvas.paste(resized, ((size - resized.width) // 2, (size - resized.height) // 2))
    canvas.save(root / 'assets/images' / name, optimize=True)
