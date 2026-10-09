# Open Graph images

`soulkiller.html` is the source of `src/soulkiller/og.png`, laid out at 1200×630 and rendered at 2× (2400×1260). Re-render after editing:

```bash
chromium --headless=new --hide-scrollbars --window-size=1200,630 --force-device-scale-factor=2 --virtual-time-budget=5000 \
  --allow-file-access-from-files --screenshot=src/soulkiller/og.png "file://$PWD/og/soulkiller.html"
```

The logo comes from [michaljach/soulkiller](https://github.com/michaljach/soulkiller) (`assets/make_logo.py`).
