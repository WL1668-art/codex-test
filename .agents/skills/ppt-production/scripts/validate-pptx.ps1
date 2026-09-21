[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)][string]$PptxPath,
  [Parameter(Mandatory = $false)][string]$SlideSpecPath,
  [Parameter(Mandatory = $false)][string]$PreviewsPath
)

$ErrorActionPreference = 'Stop'
$errors = [System.Collections.Generic.List[string]]::new()
$warnings = [System.Collections.Generic.List[string]]::new()

function Add-CheckError([string]$Message) { $errors.Add($Message) }
function Get-ZipEntryText($Archive, [string]$Name) {
  $entry = $Archive.Entries | Where-Object { $_.FullName -eq $Name } | Select-Object -First 1
  if ($null -eq $entry) { return $null }
  $stream = $entry.Open()
  try {
    $reader = [System.IO.StreamReader]::new($stream)
    try { return $reader.ReadToEnd() } finally { $reader.Dispose() }
  } finally { $stream.Dispose() }
}
function Get-EntryNames($Archive, [string]$Pattern) {
  return @($Archive.Entries | Where-Object { $_.FullName -match $Pattern } | ForEach-Object FullName | Sort-Object {
    if ($_ -match '(\d+)\.xml$') { return [int]$Matches[1] }
    return $_
  })
}
function Compact([string]$Value) { return ($Value -replace '\s+', '') }

try {
  $resolvedPptx = (Resolve-Path -LiteralPath $PptxPath).Path
  $info = Get-Item -LiteralPath $resolvedPptx
  if ($info.Length -le 0) { Add-CheckError 'PPTX file is empty.' }
  if ([System.IO.Path]::GetExtension($resolvedPptx).ToLowerInvariant() -ne '.pptx') { Add-CheckError 'Input is not a .pptx file.' }

  Add-Type -AssemblyName System.IO.Compression.FileSystem
  $archive = [System.IO.Compression.ZipFile]::OpenRead($resolvedPptx)
  try {
    $presentationXml = Get-ZipEntryText $archive 'ppt/presentation.xml'
    if ($null -eq $presentationXml) { Add-CheckError 'ppt/presentation.xml is missing.'; throw 'Required presentation XML is missing.' }
    try { [xml]$presentation = $presentationXml } catch { Add-CheckError 'presentation.xml cannot be parsed.'; throw }
    $ns = [System.Xml.XmlNamespaceManager]::new($presentation.NameTable)
    $ns.AddNamespace('p', 'http://schemas.openxmlformats.org/presentationml/2006/main')
    $sizeNode = $presentation.SelectSingleNode('//p:sldSz', $ns)
    if ($null -eq $sizeNode) { Add-CheckError 'Slide-size node is missing.' } else {
      $cx = [int64]$sizeNode.cx; $cy = [int64]$sizeNode.cy
      if ($cy -eq 0 -or [math]::Abs(($cx / [double]$cy) - (16 / 9)) -gt 0.01) { Add-CheckError "Slide size is not 16:9: $cx x $cy." }
    }

    $slideNames = Get-EntryNames $archive '^ppt/slides/slide\d+\.xml$'
    $notesNames = Get-EntryNames $archive '^ppt/notesSlides/notesSlide\d+\.xml$'
    $mediaNames = Get-EntryNames $archive '^ppt/media/'
    if ($slideNames.Count -eq 0) { Add-CheckError 'No slide XML files found.' }
    if ($notesNames.Count -ne $slideNames.Count) { Add-CheckError "Speaker-notes count is $($notesNames.Count), expected $($slideNames.Count)." }

    $slideFacts = @()
    for ($i = 0; $i -lt $slideNames.Count; $i++) {
      $slideXml = Get-ZipEntryText $archive $slideNames[$i]
      try { [xml]$slideDoc = $slideXml } catch { Add-CheckError "Slide XML is malformed: $($slideNames[$i])."; continue }
      $textRuns = [regex]::Matches($slideXml, '<a:t>([\s\S]*?)</a:t>') | ForEach-Object { $_.Groups[1].Value }
      $shapeCount = ([regex]::Matches($slideXml, '<p:sp>')).Count
      $pictureCount = ([regex]::Matches($slideXml, '<p:pic>')).Count
      if ($textRuns.Count -eq 0) { Add-CheckError "Slide $($i + 1) has no text object." }
      $slideFacts += [pscustomobject]@{ Number = $i + 1; Text = ($textRuns -join ' '); Shapes = $shapeCount; Pictures = $pictureCount }
    }

    $suspicious = [System.Collections.Generic.List[string]]::new()
    foreach ($name in @($archive.Entries | Where-Object { $_.FullName -match '\.(xml|rels)$' } | ForEach-Object FullName)) {
      $entryText = Get-ZipEntryText $archive $name
      if ($entryText -match '(?i)(?:[a-z]:\\|[a-z]:/(?!/)|/users/|/home/|cookie|api[_ -]?key|bearer\s+[a-z0-9._-]+|authorization\s*:|password\s*[:=])') { $suspicious.Add($name) }
    }
    if ($suspicious.Count -gt 0) { Add-CheckError "Package contains suspicious path or credential text: $($suspicious -join ', ')." }

    if ($SlideSpecPath) {
      $resolvedSpec = (Resolve-Path -LiteralPath $SlideSpecPath).Path
      try { $spec = Get-Content -LiteralPath $resolvedSpec -Raw | ConvertFrom-Json -Depth 64 } catch { Add-CheckError 'slide-spec JSON cannot be parsed.'; throw }
      $specSlides = @($spec.slides)
      if ($specSlides.Count -ne $slideNames.Count) { Add-CheckError "slide-spec has $($specSlides.Count) slides; PPTX has $($slideNames.Count)." }
      $ids = @($specSlides | ForEach-Object { [string]$_.id })
      if (($ids | Select-Object -Unique).Count -ne $ids.Count) { Add-CheckError 'slide-spec contains duplicate ids.' }
      for ($i = 0; $i -lt $specSlides.Count; $i++) {
        $item = $specSlides[$i]
        if ([string]::IsNullOrWhiteSpace([string]$item.title)) { Add-CheckError "slide-spec slide $($i + 1) has no title." }
        $core = [string]$item.core_message
        if ([string]::IsNullOrWhiteSpace($core) -and $null -ne $item.content) { $core = [string]$item.content.core_message }
        if ([string]::IsNullOrWhiteSpace($core) -and $null -ne $item.content) { $core = [string]$item.content.takeaway }
        if ([string]::IsNullOrWhiteSpace($core)) { $core = [string]$item.subtitle; $warnings.Add("slide-spec slide $($i + 1) uses subtitle as a legacy core-message equivalent.") }
        if ([string]::IsNullOrWhiteSpace($core)) { Add-CheckError "slide-spec slide $($i + 1) has no core_message or equivalent." }
        if (@('object', 'hero', 'hybrid') -notcontains [string]$item.render_mode) { Add-CheckError "slide-spec slide $($i + 1) has invalid render_mode." }
        if ($null -eq $item.speaker_notes -or [string]::IsNullOrWhiteSpace([string]$item.speaker_notes.talk)) { Add-CheckError "slide-spec slide $($i + 1) has no speaker_notes.talk." }
        if ($i -lt $slideFacts.Count -and -not (Compact $slideFacts[$i].Text).Contains((Compact ([string]$item.title)))) { Add-CheckError "Expected title is absent from PPTX slide $($i + 1)." }
        if ($i -lt $slideFacts.Count -and [string]$item.render_mode -eq 'object' -and $slideFacts[$i].Pictures -ge 1 -and $slideFacts[$i].Shapes -lt 2) { Add-CheckError "Object slide $($i + 1) appears to be only a bitmap." }
      }
    }

    if ($PreviewsPath) {
      $resolvedPreviews = (Resolve-Path -LiteralPath $PreviewsPath).Path
      $previews = @(Get-ChildItem -LiteralPath $resolvedPreviews -Filter '*.png' -File)
      if ($previews.Count -eq 0) { Add-CheckError 'Preview directory has no PNG files.' }
      Add-Type -AssemblyName System.Drawing
      foreach ($preview in $previews) {
        $image = [System.Drawing.Image]::FromFile($preview.FullName)
        try { if ($image.Width -ne 1920 -or $image.Height -ne 1080) { Add-CheckError "Preview has invalid dimensions: $($preview.Name) is $($image.Width)x$($image.Height)." } }
        finally { $image.Dispose() }
      }
    }

    if ($errors.Count -gt 0) {
      Write-Host "FAIL [structural]" -ForegroundColor Red
      $errors | ForEach-Object { Write-Host "- $_" -ForegroundColor Red }
      if ($warnings.Count -gt 0) { Write-Host 'Warnings:' -ForegroundColor Yellow; $warnings | Select-Object -Unique | ForEach-Object { Write-Host "- $_" -ForegroundColor Yellow } }
      exit 1
    }
    Write-Host "PASS [structural] slides=$($slideNames.Count) media=$($mediaNames.Count) notes=$($notesNames.Count)" -ForegroundColor Green
    if ($warnings.Count -gt 0) { Write-Host 'Warnings:' -ForegroundColor Yellow; $warnings | Select-Object -Unique | ForEach-Object { Write-Host "- $_" -ForegroundColor Yellow } }
    exit 0
  } finally { $archive.Dispose() }
} catch {
  Write-Host "FAIL [structural] $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}
