# Slide specification

Use one structured source for preview and PPTX production. New specifications use this minimum shape:

```json
{
  "deck": { "title": "", "language": "", "aspect_ratio": "16:9" },
  "slides": [
    {
      "id": "01",
      "title": "",
      "subtitle": "",
      "core_message": "",
      "page_type": "",
      "render_mode": "object",
      "layout": "",
      "content": {},
      "visual_assets": [],
      "source": [],
      "speaker_notes": { "talk": "", "key_line": "", "transition": "" }
    }
  ]
}
```

`render_mode` must be one of `object`, `hero`, or `hybrid`. Keep ids unique. `content` carries page-specific data; it does not replace `core_message`. A validator may accept a clearly equivalent legacy message field for migration, but new specs should include `core_message` explicitly.
