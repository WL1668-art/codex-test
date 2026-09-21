# PPTX QA

Run the PowerShell validator with a PPTX path, optionally a slide spec and preview directory:

```powershell
.\scripts\validate-pptx.ps1 -PptxPath <deck.pptx> -SlideSpecPath <slide-spec.json> -PreviewsPath <previews>
```

It verifies package readability, slide XML, slide count, 16:9 dimensions, media, notes, visible text, suspicious paths and secrets, preview sizes, and supplied-spec consistency. It also flags an `object` page that has only an image with no meaningful native text/shape structure.

The result is `structural` unless a real Office renderer was used. With Office evidence, additionally inspect font metrics, wrapping, clipping, image crop, and layout drift. Record P0/P1 findings honestly; do not silently deliver a P0 package.
