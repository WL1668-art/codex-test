[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [ValidateNotNullOrEmpty()]
  [string]$CaseDir
)

$ErrorActionPreference = 'Stop'
$failures = [System.Collections.Generic.List[string]]::new()

function Add-Failure([string]$Message) { $failures.Add($Message) }
function Get-Seconds($Value) {
  if ($Value -is [int] -or $Value -is [long] -or $Value -is [double] -or $Value -is [decimal]) { return [double]$Value }
  if ($null -eq $Value) { throw 'time is null' }
  $match = [regex]::Match([string]$Value, '^(?:(\d+):)?(\d{1,2}):(\d{2}(?:\.\d+)?)$')
  if (-not $match.Success) { throw "invalid time '$Value'" }
  return ([double]$match.Groups[1].Value * 3600) + ([double]$match.Groups[2].Value * 60) + [double]$match.Groups[3].Value
}

try { $resolved = (Resolve-Path -LiteralPath $CaseDir -ErrorAction Stop).Path } catch { Write-Output "FAIL`n- Case directory not found: $CaseDir"; exit 1 }
$reportPath = Join-Path $resolved 'extraction-report.json'
$indexPath = Join-Path $resolved 'index.html'

if (-not (Test-Path -LiteralPath $reportPath -PathType Leaf)) { Add-Failure 'extraction-report.json is missing' }
if (-not (Test-Path -LiteralPath $indexPath -PathType Leaf)) { Add-Failure 'index.html is missing' }

$report = $null
if (Test-Path -LiteralPath $reportPath -PathType Leaf) {
  try { $report = Get-Content -LiteralPath $reportPath -Raw | ConvertFrom-Json -ErrorAction Stop } catch { Add-Failure "extraction-report.json is not valid JSON: $($_.Exception.Message)" }
}

if ($null -ne $report) {
  foreach ($section in @('source','subtitles','audio','asr','chapters','keyframes','browser_acceptance')) {
    if ($null -eq $report.PSObject.Properties[$section]) { Add-Failure "Missing required top-level section: $section" }
  }
  if ($null -eq $report.chapters -or @($report.chapters).Count -eq 0) {
    Add-Failure 'chapters must be nonempty'
  } else {
    $previousStart = -1.0
    $previousEnd = -1.0
    foreach ($chapter in @($report.chapters)) {
      foreach ($field in @('id','title','start','end','boundary_reason')) { if ([string]::IsNullOrWhiteSpace([string]$chapter.$field)) { Add-Failure "chapter is missing $field" } }
      try {
        $start = Get-Seconds $chapter.start; $end = Get-Seconds $chapter.end
        if ($start -ge $end) { Add-Failure "chapter '$($chapter.id)' does not have start < end" }
        if ($start -lt $previousStart -or $end -lt $previousEnd) { Add-Failure "chapter '$($chapter.id)' is out of chronological order" }
        $previousStart = $start; $previousEnd = $end
      } catch { Add-Failure "chapter '$($chapter.id)' has invalid timing: $($_.Exception.Message)" }
    }
  }
  foreach ($frame in @($report.keyframes)) {
    foreach ($field in @('timestamp','chapter','reason','helps_understand')) { if ([string]::IsNullOrWhiteSpace([string]$frame.$field)) { Add-Failure "keyframe is missing $field" } }
  }
  if ($null -ne $report.asr -and @('passed','success') -contains ([string]$report.asr.result).ToLowerInvariant()) {
    if ([double]$report.asr.segment_count -le 0) { Add-Failure 'successful ASR requires segment_count > 0' }
    foreach ($field in @('tail_gap_seconds','tail_gap_percent')) { if ($null -eq $report.asr.$field -or [string]::IsNullOrWhiteSpace([string]$report.asr.$field)) { Add-Failure "successful ASR requires $field" } }
  }
  $reportText = Get-Content -LiteralPath $reportPath -Raw
  if ($reportText -match '(?i)[a-z]:\\') { Add-Failure 'report contains a local absolute path' }
  if ($reportText -match '(?i)(cookie|token|password)\s*[:=]\s*[^\s,}"'']+') { Add-Failure 'report contains a credential-like value' }
}

if (Test-Path -LiteralPath $indexPath -PathType Leaf) {
  $pageText = Get-Content -LiteralPath $indexPath -Raw
  if ($pageText -match '(?i)(cookie|token|password)\s*[:=]\s*[^\s,}"'']+') { Add-Failure 'index.html contains a credential-like value' }
}

if ($failures.Count -gt 0) { Write-Output 'FAIL'; $failures | ForEach-Object { Write-Output "- $_" }; exit 1 }
Write-Output "PASS: $resolved"
exit 0
