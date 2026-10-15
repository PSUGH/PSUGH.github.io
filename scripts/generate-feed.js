#!/usr/bin/env node
/**
 * generate-feed.js — Generates standard-compliant RSS 2.0 / Atom feed (feed.xml)
 * for PowerShell Usergroup Hannover (PSUGH).
 *
 * Includes:
 *   - Current upcoming meeting from current-meeting.json
 *   - Recent past meetings from past-events.json
 *   - Practical PowerShell resource articles from ressourcen/*.html
 *
 * Usage: node scripts/generate-feed.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const CANONICAL_BASE = 'https://psugh.org';
const FEED_PATH = path.join(ROOT_DIR, 'feed.xml');

// Helper to escape XML special characters
function escapeXml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// Format Date object to RFC 822 format (e.g. Fri, 16 Oct 2026 16:30:00 GMT)
function toRfc822(date) {
    return date.toUTCString();
}

// Parse sitemap.xml to extract lastmod dates for resource articles
function getSitemapDates() {
    const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
    const dates = new Map();
    if (!fs.existsSync(sitemapPath)) return dates;

    const sitemap = fs.readFileSync(sitemapPath, 'utf8');
    const urlBlocks = sitemap.match(/<url>[\s\S]*?<\/url>/g) || [];

    for (const block of urlBlocks) {
        const locMatch = block.match(/<loc>(.*?)<\/loc>/);
        const lastmodMatch = block.match(/<lastmod>(.*?)<\/lastmod>/);
        if (locMatch && lastmodMatch) {
            dates.set(locMatch[1].trim(), lastmodMatch[1].trim());
        }
    }
    return dates;
}

const items = [];
const sitemapDates = getSitemapDates();

// 1. Current Meeting
const currentMeetingPath = path.join(ROOT_DIR, 'current-meeting.json');
if (fs.existsSync(currentMeetingPath)) {
    try {
        const currentData = JSON.parse(fs.readFileSync(currentMeetingPath, 'utf8'));
        const meeting = currentData.nextMeeting;
        if (meeting && meeting.isoDate) {
            const meetingDate = new Date(meeting.isoDate);
            const topic = (meeting.topics && meeting.topics[0]) || {};
            const speaker = topic.speaker ? ` (Referent: ${topic.speaker})` : '';
            const title = `[Treffen] ${meeting.description || topic.title || 'PowerShell Usergroup Hannover Treffen'}${speaker}`;
            const link = `${CANONICAL_BASE}/events.html`;
            const dateStr = meeting.isoDate.split('T')[0];
            const guid = `${CANONICAL_BASE}/events.html#${dateStr}`;

            let desc = `<p><strong>Datum:</strong> ${escapeXml(meeting.date)}</p>`;
            if (topic.title) {
                desc += `<p><strong>Thema:</strong> ${escapeXml(topic.title)}</p>`;
            }
            if (topic.speaker) {
                desc += `<p><strong>Referent:</strong> ${escapeXml(topic.speaker)}</p>`;
            }
            if (topic.description) {
                const cleanDesc = topic.description.replace(/\n/g, '<br>');
                desc += `<p>${cleanDesc}</p>`;
            }
            if (meeting.linkedinUrl) {
                desc += `<p><a href="${escapeXml(meeting.linkedinUrl)}">Event auf LinkedIn öffnen</a></p>`;
            }
            desc += `<p><a href="${CANONICAL_BASE}/events.html">Details &amp; Kalendereintrag auf psugh.org</a></p>`;

            items.push({
                title,
                link,
                guid,
                pubDate: meetingDate,
                category: 'Monatstreffen',
                description: desc
            });
        }
    } catch (err) {
        console.warn('Fehler beim Lesen von current-meeting.json:', err);
    }
}

// 2. Past Events (take the latest 10 events)
const pastEventsPath = path.join(ROOT_DIR, 'past-events.json');
if (fs.existsSync(pastEventsPath)) {
    try {
        const pastData = JSON.parse(fs.readFileSync(pastEventsPath, 'utf8'));
        const pastEvents = (pastData.pastEvents || []).slice(0, 10);

        for (const event of pastEvents) {
            let eventDate;
            if (event.isoDate) {
                eventDate = new Date(event.isoDate);
            } else if (event.date) {
                eventDate = new Date(`${event.date}T18:30:00+02:00`);
            } else {
                continue;
            }

            const topic = (event.topics && event.topics[0]) || {};
            const speaker = topic.speaker ? ` (${topic.speaker})` : '';
            const title = `[Rückblick] ${event.title || event.description}${speaker}`;
            const link = `${CANONICAL_BASE}/events.html#${event.date}`;
            const guid = `${CANONICAL_BASE}/events.html#${event.date}`;

            let desc = `<p><strong>Datum:</strong> ${escapeXml(event.dateDisplay || event.date)}</p>`;
            if (topic.speaker) {
                desc += `<p><strong>Referent:</strong> ${escapeXml(topic.speaker)}</p>`;
            }
            if (topic.description) {
                const cleanDesc = topic.description.replace(/\n/g, '<br>');
                desc += `<p>${cleanDesc}</p>`;
            }
            if (event.recordingUrl) {
                desc += `<p><a href="${escapeXml(event.recordingUrl)}">▶ Aufzeichnung ansehen</a></p>`;
            }
            if (event.slidesUrl) {
                desc += `<p><a href="${escapeXml(event.slidesUrl)}">📄 Vortragsfolien herunterladen</a></p>`;
            }
            if (event.linkedinUrl) {
                desc += `<p><a href="${escapeXml(event.linkedinUrl)}">Diskussion auf LinkedIn</a></p>`;
            }

            items.push({
                title,
                link,
                guid,
                pubDate: eventDate,
                category: 'Community-Archiv',
                description: desc
            });
        }
    } catch (err) {
        console.warn('Fehler beim Lesen von past-events.json:', err);
    }
}

// 3. Resource Articles
const ressourcenDir = path.join(ROOT_DIR, 'ressourcen');
if (fs.existsSync(ressourcenDir)) {
    const files = fs.readdirSync(ressourcenDir)
        .filter(f => f.endsWith('.html') && f !== 'index.html');

    for (const file of files) {
        const filePath = path.join(ressourcenDir, file);
        const content = fs.readFileSync(filePath, 'utf8');

        // Extract title
        const titleMatch = content.match(/<title>(.*?)<\/title>/i);
        let rawTitle = titleMatch ? titleMatch[1].trim() : file;
        // Clean title
        rawTitle = rawTitle.replace(/\s*\|\s*PSUGH\s*Ressourcen.*$/i, '').trim();
        const title = `[Ressource] ${rawTitle}`;

        // Extract canonical
        const canonicalMatch = content.match(/<link\s+rel="canonical"\s+href="(.*?)"/i);
        const link = canonicalMatch ? canonicalMatch[1].trim() : `${CANONICAL_BASE}/ressourcen/${file}`;

        // Extract meta description
        const descMatch = content.match(/<meta\s+name="description"\s+content="(.*?)"/i) ||
            content.match(/<meta\s+content="(.*?)"\s+name="description"/i);
        const excerpt = descMatch ? descMatch[1].trim() : 'Praxisnahes PowerShell-Tutorial der PowerShell Usergroup Hannover.';

        // Determine pubDate
        const sitemapDateStr = sitemapDates.get(link);
        let pubDate;
        if (sitemapDateStr) {
            pubDate = new Date(`${sitemapDateStr}T09:00:00+02:00`);
        } else {
            const stats = fs.statSync(filePath);
            pubDate = stats.mtime;
        }

        const desc = `<p>${escapeXml(excerpt)}</p><p><a href="${link}">Vollständigen Artikel lesen →</a></p>`;

        items.push({
            title,
            link,
            guid: link,
            pubDate,
            category: 'PowerShell Ressourcen',
            description: desc
        });
    }
}

// Sort all items newest first
items.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

// Generate XML
const lastBuildDate = toRfc822(new Date());

const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>PowerShell Usergroup Hannover (PSUGH)</title>',
    `    <link>${CANONICAL_BASE}/</link>`,
    '    <description>Monatstreffen, praxisnahe PowerShell-, Azure- &amp; DevOps-Vorträge sowie praxisnahe Ressourcen-Artikel der PowerShell Usergroup Hannover.</description>',
    '    <language>de-DE</language>',
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    `    <atom:link href="${CANONICAL_BASE}/feed.xml" rel="self" type="application/rss+xml"/>`,
    '    <docs>https://www.rssboard.org/rss-specification</docs>',
    '    <generator>PSUGH Feed Generator</generator>',
    '    <image>',
    `      <url>${CANONICAL_BASE}/img/psugh-logo.webp</url>`,
    '      <title>PowerShell Usergroup Hannover (PSUGH)</title>',
    `      <link>${CANONICAL_BASE}/</link>`,
    '    </image>'
];

for (const item of items) {
    xmlLines.push('    <item>');
    xmlLines.push(`      <title>${escapeXml(item.title)}</title>`);
    xmlLines.push(`      <link>${escapeXml(item.link)}</link>`);
    xmlLines.push(`      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>`);
    xmlLines.push(`      <pubDate>${toRfc822(item.pubDate)}</pubDate>`);
    xmlLines.push(`      <category>${escapeXml(item.category)}</category>`);
    xmlLines.push(`      <description><![CDATA[${item.description}]]></description>`);
    xmlLines.push('    </item>');
}

xmlLines.push('  </channel>');
xmlLines.push('</rss>');
xmlLines.push('');

const outputXml = xmlLines.join('\n');
fs.writeFileSync(FEED_PATH, outputXml, 'utf8');

console.log(`✅ feed.xml erfolgreich generiert mit ${items.length} Einträgen:`);
console.log(`   - Speicherort : ${FEED_PATH}`);
console.log(`   - Letzter Build: ${lastBuildDate}`);
