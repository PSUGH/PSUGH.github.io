#Requires -Version 5.1
<#
.SYNOPSIS
    Generiert die RSS 2.0 / Atom feed.xml Datei für PSUGH.org.

.DESCRIPTION
    Liest current-meeting.json, past-events.json und ressourcen/*.html ein,
    aggregiert alle Termine und Tutorials chronologisch absteigend und
    schreibt eine standardkonforme feed.xml nach RSS 2.0 Spezifikation.

.OUTPUTS
    [PSCustomObject] Statusbericht mit generierten Einträgen und Speicherort.

.EXAMPLE
    .\scripts\New-RssFeed.ps1
#>
[CmdletBinding()]
param (
    [Parameter()]
    [string]$OutputPath = (Join-Path (Split-Path -Parent $PSScriptRoot) 'feed.xml')
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$CanonicalBase = 'https://psugh.org'

function Escape-XmlText {
    param ([string]$Text)
    if ([string]::IsNullOrEmpty($Text)) { return '' }
    return [System.Security.SecurityElement]::Escape($Text)
}

function ConvertTo-Rfc822Date {
    param ([datetime]$DateTime)
    return $DateTime.ToUniversalTime().ToString('ddd, dd MMM yyyy HH:mm:ss \G\M\T', [System.Globalization.CultureInfo]::InvariantCulture)
}

$feedItems = [System.Collections.Generic.List[PSCustomObject]]::new()

# 1. Sitemap-Daten einlesen für stabile lastmod-Daten
$sitemapDates = @{}
$sitemapPath = Join-Path $ProjectRoot 'sitemap.xml'
if (Test-Path $sitemapPath) {
    [xml]$sitemapXml = Get-Content -Path $sitemapPath -Raw -Encoding UTF8
    foreach ($urlNode in $sitemapXml.urlset.url) {
        if ($urlNode.loc -and $urlNode.lastmod) {
            $sitemapDates[$urlNode.loc.Trim()] = [datetime]::Parse($urlNode.lastmod.Trim())
        }
    }
}

# 2. Aktuelles Treffen
$currentMeetingPath = Join-Path $ProjectRoot 'current-meeting.json'
if (Test-Path $currentMeetingPath) {
    $currentData = Get-Content -Path $currentMeetingPath -Raw -Encoding UTF8 | ConvertFrom-Json
    $meeting = $currentData.nextMeeting
    if ($meeting -and $meeting.isoDate) {
        $meetingDate = [datetime]::Parse($meeting.isoDate)
        $topic = if ($meeting.topics -and $meeting.topics.Count -gt 0) { $meeting.topics[0] } else { $null }
        $speaker = if ($topic -and $topic.speaker) { " (Referent: $($topic.speaker))" } else { '' }
        $title = "[Treffen] $(if ($meeting.description) { $meeting.description } elseif ($topic) { $topic.title } else { 'PowerShell Usergroup Hannover Treffen' })$speaker"
        $dateStr = $meeting.isoDate.Split('T')[0]
        $link = "$CanonicalBase/events.html"
        $guid = "$CanonicalBase/events.html#$dateStr"

        $desc = "<p><strong>Datum:</strong> $(Escape-XmlText $meeting.date)</p>"
        if ($topic -and $topic.title) {
            $desc += "<p><strong>Thema:</strong> $(Escape-XmlText $topic.title)</p>"
        }
        if ($topic -and $topic.speaker) {
            $desc += "<p><strong>Referent:</strong> $(Escape-XmlText $topic.speaker)</p>"
        }
        if ($topic -and $topic.description) {
            $desc += "<p>$($topic.description -replace '\r?\n', '<br>')</p>"
        }
        if ($meeting.linkedinUrl) {
            $desc += "<p><a href=""$(Escape-XmlText $meeting.linkedinUrl)"">Event auf LinkedIn öffnen</a></p>"
        }
        $desc += "<p><a href=""$CanonicalBase/events.html"">Details &amp; Kalendereintrag auf psugh.org</a></p>"

        $feedItems.Add([PSCustomObject]@{
            Title       = $title
            Link        = $link
            Guid        = $guid
            PubDate     = $meetingDate
            Category    = 'Monatstreffen'
            Description = $desc
        })
    }
}

# 3. Vergangene Treffen (letzte 10)
$pastEventsPath = Join-Path $ProjectRoot 'past-events.json'
if (Test-Path $pastEventsPath) {
    $pastData = Get-Content -Path $pastEventsPath -Raw -Encoding UTF8 | ConvertFrom-Json
    $pastEvents = $pastData.pastEvents | Select-Object -First 10

    foreach ($event in $pastEvents) {
        $eventDate = if ($event.isoDate) {
            [datetime]::Parse($event.isoDate)
        } elseif ($event.date) {
            [datetime]::Parse("$($event.date)T18:30:00+02:00")
        } else {
            continue
        }

        $topic = if ($event.topics -and $event.topics.Count -gt 0) { $event.topics[0] } else { $null }
        $speaker = if ($topic -and $topic.speaker) { " ($($topic.speaker))" } else { '' }
        $title = "[Rückblick] $(if ($event.title) { $event.title } else { $event.description })$speaker"
        $link = "$CanonicalBase/events.html#$($event.date)"
        $guid = "$CanonicalBase/events.html#$($event.date)"

        $desc = "<p><strong>Datum:</strong> $(Escape-XmlText (if ($event.dateDisplay) { $event.dateDisplay } else { $event.date }))</p>"
        if ($topic -and $topic.speaker) {
            $desc += "<p><strong>Referent:</strong> $(Escape-XmlText $topic.speaker)</p>"
        }
        if ($topic -and $topic.description) {
            $desc += "<p>$($topic.description -replace '\r?\n', '<br>')</p>"
        }
        if ($event.recordingUrl) {
            $desc += "<p><a href=""$(Escape-XmlText $event.recordingUrl)"">▶ Aufzeichnung ansehen</a></p>"
        }
        if ($event.slidesUrl) {
            $desc += "<p><a href=""$(Escape-XmlText $event.slidesUrl)"">📄 Vortragsfolien herunterladen</a></p>"
        }
        if ($event.linkedinUrl) {
            $desc += "<p><a href=""$(Escape-XmlText $event.linkedinUrl)"">Diskussion auf LinkedIn</a></p>"
        }

        $feedItems.Add([PSCustomObject]@{
            Title       = $title
            Link        = $link
            Guid        = $guid
            PubDate     = $eventDate
            Category    = 'Community-Archiv'
            Description = $desc
        })
    }
}

# 4. Ressourcen-Artikel
$resourceDir = Join-Path $ProjectRoot 'ressourcen'
if (Test-Path $resourceDir) {
    $resourceFiles = Get-ChildItem -Path $resourceDir -Filter '*.html' | Where-Object { $_.Name -ne 'index.html' }
    foreach ($file in $resourceFiles) {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8

        # Titel extrahieren
        $rawTitle = if ($content -match '<title>(.*?)</title>') { $Matches[1].Trim() } else { $file.BaseName }
        $cleanTitle = $rawTitle -replace '\s*\|\s*PSUGH\s*Ressourcen.*$', ''
        $title = "[Ressource] $cleanTitle"

        # Canonical extrahieren
        $link = if ($content -match '<link\s+rel="canonical"\s+href="(.*?)"') { $Matches[1].Trim() } else { "$CanonicalBase/ressourcen/$($file.Name)" }

        # Meta-Description
        $descText = if ($content -match '<meta\s+name="description"\s+content="(.*?)"') { $Matches[1].Trim() } else { 'Praxisnahes PowerShell-Tutorial der PowerShell Usergroup Hannover.' }

        # Veröffentlichungsdatum
        $pubDate = if ($sitemapDates.ContainsKey($link)) {
            $sitemapDates[$link].AddHours(9)
        } else {
            $file.LastWriteTime
        }

        $desc = "<p>$(Escape-XmlText $descText)</p><p><a href=""$link"">Vollständigen Artikel lesen →</a></p>"

        $feedItems.Add([PSCustomObject]@{
            Title       = $title
            Link        = $link
            Guid        = $link
            PubDate     = $pubDate
            Category    = 'PowerShell Ressourcen'
            Description = $desc
        })
    }
}

# Sortieren nach Datum absteigend
$sortedItems = $feedItems | Sort-Object -Property PubDate -Descending

# XML generieren
$lastBuildDate = ConvertTo-Rfc822Date (Get-Date)

$sb = [System.Text.StringBuilder]::new()
[void]$sb.AppendLine('<?xml version="1.0" encoding="UTF-8"?>')
[void]$sb.AppendLine('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">')
[void]$sb.AppendLine('  <channel>')
[void]$sb.AppendLine('    <title>PowerShell Usergroup Hannover (PSUGH)</title>')
[void]$sb.AppendLine("    <link>$CanonicalBase/</link>")
[void]$sb.AppendLine('    <description>Monatstreffen, praxisnahe PowerShell-, Azure- &amp; DevOps-Vorträge sowie praxisnahe Ressourcen-Artikel der PowerShell Usergroup Hannover.</description>')
[void]$sb.AppendLine('    <language>de-DE</language>')
[void]$sb.AppendLine("    <lastBuildDate>$lastBuildDate</lastBuildDate>")
[void]$sb.AppendLine("    <atom:link href=""$CanonicalBase/feed.xml"" rel=""self"" type=""application/rss+xml""/>")
[void]$sb.AppendLine('    <docs>https://www.rssboard.org/rss-specification</docs>')
[void]$sb.AppendLine('    <generator>PSUGH Feed Generator (PowerShell)</generator>')
[void]$sb.AppendLine('    <image>')
[void]$sb.AppendLine("      <url>$CanonicalBase/img/psugh-logo.webp</url>")
[void]$sb.AppendLine('      <title>PowerShell Usergroup Hannover (PSUGH)</title>')
[void]$sb.AppendLine("      <link>$CanonicalBase/</link>")
[void]$sb.AppendLine('    </image>')

foreach ($item in $sortedItems) {
    [void]$sb.AppendLine('    <item>')
    [void]$sb.AppendLine("      <title>$(Escape-XmlText $item.Title)</title>")
    [void]$sb.AppendLine("      <link>$(Escape-XmlText $item.Link)</link>")
    [void]$sb.AppendLine("      <guid isPermaLink=""true"">$(Escape-XmlText $item.Guid)</guid>")
    [void]$sb.AppendLine("      <pubDate>$(ConvertTo-Rfc822Date $item.PubDate)</pubDate>")
    [void]$sb.AppendLine("      <category>$(Escape-XmlText $item.Category)</category>")
    [void]$sb.AppendLine("      <description><![CDATA[$($item.Description)]]></description>")
    [void]$sb.AppendLine('    </item>')
}

[void]$sb.AppendLine('  </channel>')
[void]$sb.AppendLine('</rss>')

# Schreiben
Set-Content -Path $OutputPath -Value $sb.ToString() -Encoding UTF8

# Rückgabe als PSCustomObject gemäß User Rule
[PSCustomObject]@{
    FeedPath       = $OutputPath
    TotalItems     = $sortedItems.Count
    LastBuildDate  = $lastBuildDate
    Status         = 'Success'
}
