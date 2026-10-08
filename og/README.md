# Open Graph images

`engram.html` is the source of `src/engram/og.png`, laid out at 1200×630 and rendered at 2× (2400×1260). Re-render after editing:

```bash
chromium --headless=new --hide-scrollbars --window-size=1200,630 --force-device-scale-factor=2 --virtual-time-budget=5000 \
  --allow-file-access-from-files --screenshot=src/engram/og.png "file://$PWD/og/engram.html"
```

The logo comes from [michaljach/soulkiller](https://github.com/michaljach/soulkiller) (`assets/make_logo.py`).
