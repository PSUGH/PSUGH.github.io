<#
.SYNOPSIS
    Converts MP4 video files to WebM (VP9 codec) and extracts a WebP poster frame for site events.

.DESCRIPTION
    Uses ffmpeg to create a web-optimized WebM file and a static WebP poster frame.
    Outputs a PSCustomObject summarizing the conversion.

.PARAMETER Source
    Path to the input MP4 file. Defaults to 'img/irrer_wissenschaftler.mp4'.

.EXAMPLE
    ./scripts/Convert-ToWebM.ps1 -Source "img/irrer_wissenschaftler.mp4"
#>

[CmdletBinding()]
param(
    [Parameter(Position = 0, Mandatory = $false)]
    [string]$Source = "img/irrer_wissenschaftler.mp4"
)

# Ensure ffmpeg is installed
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    Write-Error "ffmpeg is required but was not found in PATH."
    return
}

# Resolve file paths
$ResolvedSource = Resolve-Path $Source -ErrorAction SilentlyContinue
if (-not $ResolvedSource -or -not (Test-Path $ResolvedSource.Path)) {
    Write-Error "Source file '$Source' not found."
    return
}

$SourceFile = $ResolvedSource.Path
$BaseDir = Split-Path $SourceFile -Parent
$BaseName = [System.IO.Path]::GetFileNameWithoutExtension($SourceFile)

$WebmFile = Join-Path $BaseDir "$BaseName.webm"
$PosterFile = Join-Path $BaseDir "${BaseName}_poster.webp"

Write-Host "🎥 Converting '$BaseName.mp4' to VP9 WebM..." -ForegroundColor Cyan

# 1. Convert to WebM (VP9, CRF 32, no audio for silent teasers)
$ffmpegWebmArgs = @("-y", "-i", "`"$SourceFile`"", "-c:v", "libvpx-vp9", "-crf", "32", "-b:v", "0", "-an", "`"$WebmFile`"")
Start-Process -FilePath "ffmpeg" -ArgumentList ($ffmpegWebmArgs -join " ") -NoNewWindow -Wait

# 2. Extract WebP Poster Frame
Write-Host "🖼️ Generating poster frame '$BaseName`_poster.webp'..." -ForegroundColor Cyan
$ffmpegPosterArgs = @("-y", "-i", "`"$SourceFile`"", "-vframes", "1", "`"$PosterFile`"")
Start-Process -FilePath "ffmpeg" -ArgumentList ($ffmpegPosterArgs -join " ") -NoNewWindow -Wait

# Gather file sizes
$OriginalSizeMB = [math]::Round((Get-Item $SourceFile).Length / 1MB, 2)
$WebmSizeMB = [math]::Round((Get-Item $WebmFile).Length / 1MB, 2)
$PosterSizeKB = [math]::Round((Get-Item $PosterFile).Length / 1KB, 2)

# Always use PSCustomObject for PowerShell output
[PSCustomObject]@{
    SourceFile      = $SourceFile
    OriginalSizeMB  = $OriginalSizeMB
    WebmFile        = $WebmFile
    WebmSizeMB      = $WebmSizeMB
    PosterFile      = $PosterFile
    PosterSizeKB    = $PosterSizeKB
    SavingsPercent  = [math]::Round(((1 - ($WebmSizeMB / $OriginalSizeMB)) * 100), 1)
}
