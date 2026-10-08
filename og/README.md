# Open Graph images

`engram.html` is the source of `src/engram/og.png` (1200×630). Re-render after editing:

```bash
chromium --headless=new --hide-scrollbars --window-size=1200,630 --virtual-time-budget=5000 \
  --allow-file-access-from-files --screenshot=src/engram/og.png "file://$PWD/og/engram.html"
```

The logo comes from [michaljach/soulkiller](https://github.com/michaljach/soulkiller) (`assets/make_logo.py`).
