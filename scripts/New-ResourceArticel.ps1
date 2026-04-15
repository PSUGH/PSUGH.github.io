#Requires -Version 5.1
<#
.SYNOPSIS
    Erstellt eine neue PSUGH-Ressourcen-Seite aus dem Template.

.DESCRIPTION
    Kopiert _template.html, ersetzt alle PLACEHOLDER-Strings interaktiv
    und öffnet die fertige Datei im Standard-Editor.

.PARAMETER Slug
    Dateiname ohne .html (z.B. "invoke-restmethod").
    Erlaubt: Kleinbuchstaben, Ziffern, Bindestriche.

.EXAMPLE
    .\New-ResourceArticel.ps1 -Slug invoke-restmethod

.EXAMPLE
    .\New-ResourceArticel.ps1
    # ohne Parameter: interaktive Eingabe
#>
[CmdletBinding()]
param (
    [Parameter()]
    [ValidatePattern('^[a-z0-9][a-z0-9-]+$')]
    [string]$Slug
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ─── Pfade ────────────────────────────────────────────────────────────────────
$ScriptDir = $PSScriptRoot
$TemplatePath = Join-Path $ScriptDir '_template.html'

if (-not (Test-Path $TemplatePath))
{
    Write-Error "Template nicht gefunden: $TemplatePath"
    exit 1
}

# ─── Slug einlesen wenn nicht als Parameter übergeben ─────────────────────────
if (-not $Slug)
{
    do
    {
        $Slug = Read-Host 'Slug (Dateiname ohne .html, z.B. invoke-restmethod)'
    } until ($Slug -match '^[a-z0-9][a-z0-9-]+$')
}

$resourceDir = Join-Path $ScriptDir 'ressourcen'
$OutputPath = Join-Path $resourceDir "$Slug.html"

if (Test-Path $OutputPath)
{
    $overwrite = Read-Host "$OutputPath existiert bereits. Überschreiben? (j/N)"
    if ($overwrite -notmatch '^[jJ]$')
    {
        Write-Host 'Abgebrochen.' -ForegroundColor Yellow
        exit 0
    }
}

# ─── Interaktive Eingabe der Platzhalter ──────────────────────────────────────
Write-Host ''
Write-Host '── Artikel-Metadaten ──────────────────────────────────────────' -ForegroundColor Cyan
Write-Host '  Drücke Enter um die Vorschau zu übernehmen, oder gib einen neuen Wert ein.'
Write-Host ''

function Read-WithPreview
{
    param(
        [string]$Label,
        [string]$Preview,
        [int]$MinLen = 0,
        [int]$MaxLen = 0
    )
    $hint = if ($MaxLen -gt 0) { " ($MinLen–$MaxLen Zeichen)" } else { '' }
    Write-Host "  $Label$hint" -ForegroundColor Yellow
    Write-Host "  Vorschau: $Preview" -ForegroundColor DarkGray
    $input = Read-Host "  > "
    $result = if ($input.Trim() -eq '') { $Preview } else { $input.Trim() }

    if ($MaxLen -gt 0)
    {
        $len = $result.Length
        if ($len -lt $MinLen)
        {
            Write-Warning "  Zu kurz ($len Zeichen) — Ziel: $MinLen–$MaxLen"
        }
        elseif ($len -gt $MaxLen)
        {
            Write-Warning "  Zu lang ($len Zeichen) — Google kürzt ab $MaxLen"
        }
        else
        {
            Write-Host "  ✓ $len Zeichen" -ForegroundColor Green
        }
    }
    Write-Host ''
    return $result
}

# Vorschau-Werte aus Slug ableiten
$SlugTitle = (Get-Culture).TextInfo.ToTitleCase($Slug.Replace('-', ' '))

$TitleTag = Read-WithPreview -Label 'Title-Tag (<title>)' `
    -Preview "$SlugTitle Tutorial | PSUGH Ressourcen" `
    -MinLen 30 -MaxLen 60

$MetaDesc = Read-WithPreview -Label 'Meta Description' `
    -Preview "PowerShell-Tutorial: $SlugTitle – mit Beispielen der PowerShell Usergroup Hannover." `
    -MinLen 120 -MaxLen 160

$OgTitle = Read-WithPreview -Label 'OG Title (Social Preview)' `
    -Preview "$SlugTitle – Tutorial | PSUGH"

$OgDesc = Read-WithPreview -Label 'OG Description (Social Preview)' `
    -Preview "Lerne $SlugTitle mit praktischen Beispielen der PSUGH Hannover."

$H1 = Read-WithPreview -Label 'H1 (Hero-Überschrift)' `
    -Preview $SlugTitle

$HeroSubtitle = Read-WithPreview -Label 'Hero-Untertitel' `
    -Preview "$SlugTitle direkt in PowerShell nutzen – mit Praxisbeispielen."

# ─── Template einlesen und Platzhalter ersetzen ───────────────────────────────
$content = Get-Content -Path $TemplatePath -Raw -Encoding UTF8

$replacements = [ordered]@{
    'PLACEHOLDER_SLUG'          = $Slug
    'PLACEHOLDER_TITLE_TAG'     = $TitleTag
    'PLACEHOLDER_META_DESC'     = $MetaDesc
    'PLACEHOLDER_OG_TITLE'      = $OgTitle
    'PLACEHOLDER_OG_DESC'       = $OgDesc
    'PLACEHOLDER_H1'            = $H1
    'PLACEHOLDER_HERO_SUBTITLE' = $HeroSubtitle
}

foreach ($key in $replacements.Keys)
{
    $content = $content.Replace($key, $replacements[$key])
}

# Sicherheitscheck: keine PLACEHOLDER mehr übrig
$remaining = [regex]::Matches($content, 'PLACEHOLDER_\w+') | Select-Object -ExpandProperty Value -Unique
if ($remaining.Count -gt 0)
{
    Write-Warning "Nicht ersetzte Platzhalter gefunden: $($remaining -join ', ')"
}

# ─── Datei schreiben ─────────────────────────────────────────────────────────
$content | Set-Content -Path $OutputPath -Encoding UTF8 -NoNewline
Write-Host "✅ Erstellt: $OutputPath" -ForegroundColor Green

# ─── validate-seo.js Hinweis ──────────────────────────────────────────────────
Write-Host ''
Write-Host '── Nächste Schritte ────────────────────────────────────────────' -ForegroundColor Cyan
Write-Host "  1. Füge folgenden Eintrag in validate-seo.js → htmlFiles[] hinzu:"
Write-Host "     { file: 'ressourcen/$Slug.html', expectedCanonical: \`https://psugh.org/ressourcen/$Slug.html\`, noindex: false }," -ForegroundColor DarkYellow
Write-Host "  2. Füge einen Link in ressourcen/index.html → resource-grid hinzu."
Write-Host "  3. Führe danach .\scripts\Update-ArticleNavigation.ps1 aus, um alle Artikel automatisch miteinander zu verlinken."
Write-Host "  3. Füge $Slug.html zur sitemap.xml hinzu."
Write-Host ''

# ─── Editor öffnen ───────────────────────────────────────────────────────────
$editor = $null
foreach ($candidate in @('code', 'notepad++', 'notepad'))
{
    if (Get-Command $candidate -ErrorAction SilentlyContinue)
    {
        $editor = $candidate
        break
    }
}

if ($editor)
{
    Write-Host "Öffne in $editor ..." -ForegroundColor DarkGray
    & $editor $OutputPath
}