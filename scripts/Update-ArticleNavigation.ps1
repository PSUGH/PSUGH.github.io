#Requires -Version 5.1
<#
.SYNOPSIS
    Aktualisiert dynamisch die Vor/Zurück Navigation in allen Artikeln basierend auf ressourcen/index.html.
.DESCRIPTION
    Dieses Skript liest die Reihenfolge der HTML-Ressourcen aus der ressourcen/index.html.
    Anschließend sucht es in jeder verlinkten Datei nach dem <nav class="article-nav">... </nav> Block
    und ersetzt ihn mit vollständig formatierten und dynamisierten Weiter/Zurück Links.
#>

$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Split-Path -Parent $scriptDir
$resourcesDir = Join-Path $projectRoot "ressourcen"
$indexPath = Join-Path $resourcesDir "index.html"

if (-not (Test-Path $indexPath)) {
    Write-Error "Konnte ressourcen/index.html nicht finden: $indexPath"
    exit 1
}

Write-Host "Lese Reihenfolge aus index.html..." -ForegroundColor Cyan

# Sicheres Einlesen ohne BOM-Änderungen als UTF8 String
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
$indexContent = [System.IO.File]::ReadAllText($indexPath, $utf8NoBom)

# Wir extrahieren alle Hrefs aus den h3-Headings der resource-cards
$searchPattern = '<h3><a href="([^"]+\.html)">(.*?)<\/a>.*?<\/h3>'
$matches = [regex]::Matches($indexContent, $searchPattern)

$articles = @()
foreach ($m in $matches) {
    if ($m.Groups[1].Value -ne "index.html") { 
        $articles += [PSCustomObject]@{
            File = $m.Groups[1].Value
            Title = $m.Groups[2].Value.Trim()
        }
    }
}

if ($articles.Count -eq 0) {
    Write-Warning "Keine Artikel in index.html gefunden."
    exit 0
}

Write-Host "$($articles.Count) Artikel zur Verlinkung gefunden.`n" -ForegroundColor Green

# Update Loop (Regex sucht nach Start-Tag und End-Tag ignorierend aller Newlines)
$navRegex = '(?s)<nav class="article-nav"[^>]*>.*?</nav>'

for ($i = 0; $i -lt $articles.Count; $i++) {
    $current = $articles[$i]
    $filePath = Join-Path $resourcesDir $current.File
    
    if (-not (Test-Path $filePath)) {
        Write-Warning "Datei nicht gefunden, überspringe: $filePath"
        continue
    }

    $prev = if ($i -gt 0) { $articles[$i - 1] } else { $null }
    $next = if ($i -lt ($articles.Count - 1)) { $articles[$i + 1] } else { $null }

    # Generiere den HTML-Block als Array-Liste
    $navHtml = [System.Collections.Generic.List[string]]::new()
    $navHtml.Add('                    <nav class="article-nav" aria-label="Artikel-Navigation">')
    
    if ($prev) {
        $navHtml.Add("                        <a href=""$($prev.File)"">&larr; $($prev.Title)</a>")
    } else {
        $navHtml.Add("                        <span></span>")
    }

    if ($next) {
        $navHtml.Add("                        <a href=""$($next.File)"">$($next.Title) &rarr;</a>")
    } else {
        $navHtml.Add("                        <span></span>")
    }

    $navHtml.Add('                    </nav>')

    # String-Join mit CRLF für saubere Windows-Style-Dateien (oder LF je nach Repo, standard htmlhint mag LF, wir nehmen aber was vorlag)
    $newNavBlock = $navHtml -join "`n"

    $fileContent = [System.IO.File]::ReadAllText($filePath, $utf8NoBom)
    
    if ($fileContent -match $navRegex) {
        # Fix für etwaige Regex Capture-Group Replacement Escape-Fehler
        $fileContent = [regex]::Replace($fileContent, $navRegex, $newNavBlock.Replace('$', '$$'))
        [System.IO.File]::WriteAllText($filePath, $fileContent, $utf8NoBom)
        Write-Host "  -> Aktualisiert: $($current.File) $(if ($prev) { '(Hat Prev)' }) $(if ($next) { '(Hat Next)' })"
    } else {
        Write-Warning "  -> Kein <nav class='article-nav'> Block gefunden in $($current.File)"
    }
}

Write-Host "`n✅ Alle Artikel-Navigationen dynamisch verknüpft!" -ForegroundColor Green
