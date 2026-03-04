# Media & Document Conversion Toolkit Command Recipes

Use these as starting points. Adapt paths, namespaces, and credentials to the task context.

## 1. Transcode video with ffmpeg

```bash
ffmpeg -i input.mov -c:v libx264 -crf 22 -preset medium output.mp4
```

Create broadly compatible MP4 output.

## 2. Resize image with ImageMagick

```bash
magick input.png -resize 1600x1600\> output.png
```

Shrink oversized images while keeping aspect ratio.

## 3. OCR scanned PDF

```bash
ocrmypdf --deskew in.pdf out.pdf
```

Create searchable PDF from scan.

## 4. Convert Markdown to PDF

```bash
pandoc doc.md -o doc.pdf
```

Render portable document from markdown.

## 5. Extract subtitles/media info

```bash
ffprobe -hide_banner input.mp4
```

Inspect media streams and metadata.

