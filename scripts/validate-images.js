const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '../img');
const allowedExtensions = ['.webp', '.svg', '.ico'];
// Allowed as fallback for older browsers
const exceptionFiles = ['hintergrund.jpg', 'psugh-logo.png']; 
// Note: We already converted psugh-logo.png, 
// so check if it's actually still there or if we should update this list. 

console.log('--- Checking for non-optimized images in /img ---');

const files = fs.readdirSync(imgDir);
const errors = [];

files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    
    // If it's a PNG or JPG, check if it's in the exception list
    if ((ext === '.png' || ext === '.jpg' || ext === '.jpeg') && !exceptionFiles.includes(file)) {
        errors.push(`NON-OPTIMIZED FILE FOUND: ${file}. Please convert to .webp using scripts/Convert-ToWebP.ps1`);
    }

    // Check if the file is just a reference (0 bytes or empty)
    const stats = fs.statSync(path.join(imgDir, file));
    if (stats.size === 0) {
        errors.push(`EMPTY IMAGE FILE: ${file}`);
    }
});

if (errors.length > 0) {
    console.error('Errors found:');
    errors.forEach(err => console.error(` - ${err}`));
    process.exit(1);
} else {
    console.log('All images are optimized! (WebP/SVG/ICO or allowed fallbacks)');
}
