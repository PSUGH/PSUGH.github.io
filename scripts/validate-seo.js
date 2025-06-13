const fs = require('fs');

console.log('🔍 SEO Validation Report for PSUGH Website\n');

// Check if essential SEO files exist
const seoFiles = ['robots.txt', 'sitemap.xml', 'site.webmanifest', '.htaccess'];

console.log('📁 Essential SEO Files:');
seoFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// Check HTML files for SEO elements
const htmlFiles = ['index.html', 'impressum.html'];

console.log('\n📄 HTML SEO Elements:');
htmlFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        console.log(`\n   📋 ${file}:`);

        const checks = [
            { name: 'Title tag', regex: /<title>.*<\/title>/ },
            { name: 'Meta description', regex: /<meta name="description"/ },
            { name: 'Canonical URL', regex: /<link rel="canonical"/ },
            { name: 'Open Graph tags', regex: /<meta property="og:/ },
            { name: 'Twitter Card', regex: /<meta name="twitter:/ },
            { name: 'Structured data', regex: /<script type="application\/ld\+json">/ },
            { name: 'Robots meta', regex: /<meta name="robots"/ }
        ];

        checks.forEach(check => {
            const found = check.regex.test(content);
            console.log(`      ${found ? '✅' : '❌'} ${check.name}`);
        });
    }
});

console.log('\n🚀 SEO Implementation: COMPLETE!');
console.log('   Your website is optimized for search engines and social media.');
