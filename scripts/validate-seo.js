#!/usr/bin/env node
/**
 * validate-seo.js — PSUGH Website SEO Validator
 * Usage: node validate-seo.js [--strict] [--fail-on-warnings]
 *
 * Exit codes:
 *   0 = all checks passed (or only warnings, unless --fail-on-warnings is provided)
 *   1 = one or more checks FAILED
 *   2 = one or more WARNINGS (only when --fail-on-warnings is enabled)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const STRICT = process.argv.includes('--strict');
const FAIL_ON_WARNINGS = process.argv.includes('--fail-on-warnings');
const CANONICAL_BASE = 'https://psugh.org';

// ─── ANSI colors ────────────────────────────────────────────────────────────
const c = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
};
const pass = `${c.green}✅${c.reset}`;
const fail = `${c.red}❌${c.reset}`;
const warn = `${c.yellow}⚠️ ${c.reset}`;

// ─── Counters ────────────────────────────────────────────────────────────────
let totalChecks = 0;
let totalPassed = 0;
let totalFailed = 0;
let totalWarnings = 0;

function result(status, label, detail = '') {
    totalChecks++;
    const icon = status === 'pass' ? pass : status === 'warn' ? warn : fail;

    if (status === 'pass') totalPassed++;
    if (status === 'fail') totalFailed++;
    if (status === 'warn') totalWarnings++;

    const detailStr = detail ? ` ${c.dim}→ ${detail}${c.reset}` : '';
    console.log(`   ${icon} ${label}${detailStr}`);
}

// ─── Helper: extract first regex match ───────────────────────────────────────
function extract(content, regex) {
    const m = content.match(regex);
    return m ? m[1] : null;
}

// ─── 1. Essential files ───────────────────────────────────────────────────────
console.log(
    `\n${c.bold}${c.cyan}🔍 SEO Validation Report — PSUGH Website${c.reset}`,
);
if (STRICT) console.log(`${c.yellow}   Mode: STRICT${c.reset}`);
console.log('');

const requiredFiles = [
    { file: 'robots.txt', critical: true },
    { file: 'sitemap.xml', critical: true },
    { file: 'site.webmanifest', critical: true },
    { file: '.htaccess', critical: false },
    { file: 'css/styles.css', critical: true },
    { file: 'css/fonts.css', critical: false },
];

console.log(`${c.bold}📁 Essential Files${c.reset}`);
requiredFiles.forEach(({ file, critical }) => {
    const exists = fs.existsSync(file);
    if (exists) {
        result('pass', file);
    } else if (critical) {
        result('fail', file, 'MISSING — required');
    } else {
        result('warn', file, 'not found');
    }
});

// ─── 2. robots.txt content ───────────────────────────────────────────────────
console.log(`\n${c.bold}🤖 robots.txt Content${c.reset}`);
if (fs.existsSync('robots.txt')) {
    const robots = fs.readFileSync('robots.txt', 'utf8');

    if (/User-agent:\s*\*/i.test(robots))
        result('pass', 'User-agent wildcard present');
    else result('fail', 'User-agent: * missing');

    const sitemapMatch = robots.match(/Sitemap:\s*(.+)/i);
    if (sitemapMatch) {
        const sitemapUrl = sitemapMatch[1].trim();
        if (sitemapUrl.startsWith(CANONICAL_BASE))
            result('pass', 'Sitemap URL uses canonical domain', sitemapUrl);
        else result('fail', 'Sitemap URL uses wrong domain', sitemapUrl);
    } else {
        result('fail', 'Sitemap directive missing from robots.txt');
    }

    if (/Disallow:\s*\/$/m.test(robots))
        result('fail', 'Disallow: / found — blocks all crawlers!');
} else {
    result('fail', 'robots.txt not readable');
}

// ─── 3. sitemap.xml content ──────────────────────────────────────────────────
console.log(`\n${c.bold}🗺️  sitemap.xml Content${c.reset}`);
if (fs.existsSync('sitemap.xml')) {
    const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
    const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

    result('pass', `${urls.length} URLs found`);

    const nonCanonical = urls.filter((u) => !u.startsWith(CANONICAL_BASE));
    if (nonCanonical.length === 0) {
        result('pass', 'All URLs use canonical domain');
    } else {
        nonCanonical.forEach((u) =>
            result('fail', 'Non-canonical URL in sitemap', u),
        );
    }

    // Check that impressum is NOT in sitemap (noindex page)
    const hasImpressum = urls.some((u) => u.includes('impressum'));
    if (hasImpressum)
        result('warn', 'impressum.html in sitemap but page uses noindex');

    const hasLastmod = /<lastmod>/.test(sitemap);
    if (hasLastmod) result('pass', 'lastmod dates present');
    else
        result(
            'warn',
            'No lastmod dates — Google uses these for crawl scheduling',
        );
} else {
    result('fail', 'sitemap.xml not readable');
}

// ─── 4. HTML files ───────────────────────────────────────────────────────────
const htmlFiles = [
    {
        file: 'index.html',
        expectedCanonical: `${CANONICAL_BASE}/`,
        noindex: false,
    },
    {
        file: 'events.html',
        expectedCanonical: `${CANONICAL_BASE}/events.html`,
        noindex: false,
        dynamicSchema: true,
    },
    {
        file: 'impressum.html',
        expectedCanonical: `${CANONICAL_BASE}/impressum.html`,
        noindex: true,
    },
    {
        file: 'ressourcen/index.html',
        expectedCanonical: `${CANONICAL_BASE}/ressourcen/`,
        noindex: false,
    },
    {
        file: 'ressourcen/invoke-webrequest.html',
        expectedCanonical: `${CANONICAL_BASE}/ressourcen/invoke-webrequest.html`,
        noindex: false,
    },
    {
        file: 'ressourcen/convertfrom-json.html',
        expectedCanonical: `${CANONICAL_BASE}/ressourcen/convertfrom-json.html`,
        noindex: false,
    },
    {
        file: 'ressourcen/select-object.html',
        expectedCanonical: `${CANONICAL_BASE}/ressourcen/select-object.html`,
        noindex: false,
    },
    {
        file: 'ressourcen/terminating-errors.html',
        expectedCanonical: `${CANONICAL_BASE}/ressourcen/terminating-errors.html`,
        noindex: false,
    },
    {
        file: 'ressourcen/try-catch.html',
        expectedCanonical: `${CANONICAL_BASE}/ressourcen/try-catch.html`,
        noindex: false,
    },
];

htmlFiles.forEach(
    ({ file, expectedCanonical, noindex, dynamicSchema = false }) => {
        if (!fs.existsSync(file)) {
            console.log(
                `\n${c.bold}📄 ${file}${c.reset} ${c.dim}(not found — skipped)${c.reset}`,
            );
            return;
        }

        const raw = fs.readFileSync(file, 'utf8');
        // Collapse newlines so multiline tags are matchable
        const content = raw.replace(/\r?\n/g, ' ');

        console.log(`\n${c.bold}📄 ${file}${c.reset}`);

        // ── Title ────────────────────────────────────────────────────────────────
        const title = extract(content, /<title>(.*?)<\/title>/i);
        if (!title) {
            result('fail', 'Title tag');
        } else {
            const len = title.length;
            if (len >= 30 && len <= 60)
                result('pass', 'Title tag', `"${title}" (${len} chars)`);
            else if (len < 30)
                result(
                    'warn',
                    'Title too short',
                    `${len} chars — aim for 30-60`,
                );
            else
                result(
                    'warn',
                    'Title too long',
                    `${len} chars — aim for 30-60`,
                );
        }

        // ── Meta description ─────────────────────────────────────────────────────
        const desc =
            extract(content, /<meta\s+name="description"\s+content="(.*?)"/i) ||
            extract(content, /<meta\s+content="(.*?)"\s+name="description"/i);
        if (!desc) {
            result('fail', 'Meta description');
        } else {
            const len = desc.length;
            if (len >= 120 && len <= 160)
                result('pass', 'Meta description', `${len} chars`);
            else if (len < 120)
                result(
                    'warn',
                    'Meta description short',
                    `${len} chars — aim for 120-160`,
                );
            else
                result(
                    'warn',
                    'Meta description long',
                    `${len} chars — Google truncates at ~160`,
                );
        }

        // ── Canonical ────────────────────────────────────────────────────────────
        const canonical = extract(
            content,
            /<link\s+rel="canonical"\s+href="(.*?)"/i,
        );
        if (!canonical) {
            result('fail', 'Canonical URL');
        } else if (canonical === expectedCanonical) {
            result('pass', 'Canonical URL', canonical);
        } else {
            result(
                'fail',
                'Canonical URL mismatch',
                `expected: ${expectedCanonical} — got: ${canonical}`,
            );
        }

        // ── lang attribute ───────────────────────────────────────────────────────
        const lang = extract(content, /<html[^>]+lang="([^"]+)"/i);
        if (lang === 'de-DE' || lang === 'de')
            result('pass', 'html lang attribute', lang);
        else if (lang)
            result(
                'warn',
                'html lang attribute',
                `"${lang}" — expected "de-DE"`,
            );
        else result('fail', 'html lang attribute missing');

        // ── Viewport ─────────────────────────────────────────────────────────────
        if (/<meta\s+name="viewport"/i.test(content))
            result('pass', 'Viewport meta tag');
        else result('fail', 'Viewport meta tag missing');

        // ── Open Graph ───────────────────────────────────────────────────────────
        const ogRequired = [
            'og:type',
            'og:title',
            'og:description',
            'og:url',
            'og:image',
            'og:site_name',
            'og:locale',
        ];
        const missingOG = ogRequired.filter(
            (p) => !content.includes(`property="${p}"`),
        );
        if (missingOG.length === 0)
            result(
                'pass',
                'Open Graph tags',
                `all ${ogRequired.length} present`,
            );
        else
            missingOG.forEach((p) =>
                result('fail', `Open Graph missing: ${p}`),
            );

        // ── OG URL matches canonical ──────────────────────────────────────────────
        const ogUrl = extract(
            content,
            /<meta\s+property="og:url"\s+content="(.*?)"/i,
        );
        if (ogUrl && ogUrl === expectedCanonical)
            result('pass', 'og:url matches canonical');
        else if (ogUrl)
            result(
                'fail',
                'og:url mismatch with canonical',
                `og:url="${ogUrl}"`,
            );

        // ── Twitter Card ─────────────────────────────────────────────────────────
        if (/meta\s+name="twitter:card"/.test(content))
            result('pass', 'Twitter Card');
        else result('fail', 'Twitter Card missing');

        // ── Structured data ──────────────────────────────────────────────────────
        if (/<script\s+type="application\/ld\+json">/.test(content)) {
            result('pass', 'Structured data (ld+json)');
            // Try to validate JSON if inline
            const jsonBlocks = [
                ...raw.matchAll(
                    /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g,
                ),
            ];
            jsonBlocks.forEach((m, i) => {
                try {
                    JSON.parse(m[1]);
                    result('pass', `ld+json block ${i + 1} valid JSON`);
                } catch (e) {
                    result(
                        'fail',
                        `ld+json block ${i + 1} invalid JSON`,
                        e.message,
                    );
                }
            });
        } else if (dynamicSchema) {
            // Schema is injected at runtime via JS — verify the injection function exists in source
            if (/injectEventSchemas/.test(raw))
                result(
                    'pass',
                    'Structured data (ld+json)',
                    'dynamic injection via injectEventSchemas()',
                );
            else
                result(
                    'fail',
                    'Structured data (ld+json)',
                    'dynamicSchema=true but injectEventSchemas() not found in source',
                );
        } else {
            result(
                noindex ? 'warn' : 'fail',
                'Structured data (ld+json)',
                noindex ? 'noindex page — ok to omit' : 'missing',
            );
        }

        // ── Robots meta ──────────────────────────────────────────────────────────
        const robotsContent = extract(
            content,
            /<meta\s+name="robots"\s+content="(.*?)"/i,
        );
        if (noindex) {
            if (robotsContent && robotsContent.includes('noindex'))
                result('pass', 'Robots meta: noindex', robotsContent);
            else result('fail', 'Robots meta: noindex expected but not set');
        } else {
            if (!robotsContent || robotsContent.includes('noindex'))
                result(
                    robotsContent ? 'fail' : 'warn',
                    'Robots meta',
                    robotsContent
                        ? `noindex found on indexable page!`
                        : 'not set — defaults to index,follow (ok)',
                );
            else result('pass', 'Robots meta', robotsContent);
        }

        // ── GA4 ──────────────────────────────────────────────────────────────────
        if (/gtag|googletagmanager/.test(content))
            result('pass', 'Google Analytics (GA4)');
        else result('warn', 'Google Analytics not detected');

        // ── Google Search Console verification ───────────────────────────────────
        if (STRICT) {
            if (/<meta\s+name="google-site-verification"/.test(content))
                result('pass', 'Google Search Console verification tag');
            else
                result(
                    'warn',
                    'Google Search Console verification tag missing',
                );
        }
    },
);

// ─── 5. site.webmanifest ─────────────────────────────────────────────────────
console.log(`\n${c.bold}📱 site.webmanifest${c.reset}`);
if (fs.existsSync('site.webmanifest')) {
    try {
        const manifest = JSON.parse(
            fs.readFileSync('site.webmanifest', 'utf8'),
        );

        [
            'name',
            'short_name',
            'description',
            'lang',
            'theme_color',
            'background_color',
            'start_url',
        ].forEach((field) => {
            if (manifest[field])
                result('pass', `"${field}" present`, manifest[field]);
            else result('fail', `"${field}" missing`);
        });

        // Check icon purposes — "any maskable" combined is invalid per W3C spec
        const badPurpose = (manifest.icons || []).filter(
            (i) => i.purpose === 'any maskable',
        );
        if (badPurpose.length > 0)
            result(
                'fail',
                'Icon purpose "any maskable" combined — must be separate entries',
            );
        else result('pass', 'Icon purpose declarations valid');

        // Check for 192x192 icon
        const has192 = (manifest.icons || []).some(
            (i) => i.sizes === '192x192',
        );
        has192
            ? result('pass', '192x192 icon present')
            : result('warn', '192x192 icon missing');
    } catch (e) {
        result('fail', 'site.webmanifest is not valid JSON', e.message);
    }
} else {
    result('fail', 'site.webmanifest not found');
}

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${c.bold}─────────────────────────────────────────${c.reset}`);
console.log(`${c.bold}📊 Summary${c.reset}`);
console.log(`   Total checks : ${totalChecks}`);
console.log(`   ${c.green}Passed${c.reset}        : ${totalPassed}`);
console.log(`   ${c.red}Failed${c.reset}        : ${totalFailed}`);
console.log(`   ${c.yellow}Warnings${c.reset}      : ${totalWarnings}`);

if (totalFailed === 0 && totalWarnings === 0) {
    console.log(
        `\n${c.green}${c.bold}🚀 All checks passed — site is SEO-ready!${c.reset}\n`,
    );
    process.exit(0);
} else if (totalFailed === 0) {
    console.log(
        `\n${c.yellow}${c.bold}⚠️  No failures, but ${totalWarnings} warning(s) to review.${c.reset}\n`,
    );
    process.exit(FAIL_ON_WARNINGS ? 2 : 0);
} else {
    console.log(
        `\n${c.red}${c.bold}❌ ${totalFailed} check(s) failed — review required.${c.reset}\n`,
    );
    process.exit(1);
}
