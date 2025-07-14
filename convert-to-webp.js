/**
 * Image Conversion Script
 * This script converts PNG images to WebP format for better web performance
 * 
 * Prerequisites:
 * 1. Install Node.js from https://nodejs.org/
 * 2. Run: npm install sharp
 * 
 * Usage:
 * node convert-to-webp.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const QUALITY = 80; // WebP quality (0-100, 80 is a good balance)
const COMPRESSED_DIR = 'All-DrawingsCompressed';
const WEBP_DIR = 'All-DrawingsWebP';
const FULL_SIZE_DIR = 'All-Drawings';
const WEBP_FULL_DIR = 'All-DrawingsWebPFull';

async function createDirectoryIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dirPath}`);
  }
}

async function convertImage(inputPath, outputPath, quality = QUALITY) {
  try {
    await sharp(inputPath)
      .webp({ quality })
      .toFile(outputPath);
    
    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);
    const savings = ((inputStats.size - outputStats.size) / inputStats.size * 100).toFixed(1);
    
    console.log(`✅ Converted: ${path.basename(inputPath)} → ${path.basename(outputPath)} (${savings}% smaller)`);
    return true;
  } catch (error) {
    console.error(`❌ Error converting ${inputPath}:`, error.message);
    return false;
  }
}

async function convertDirectory(sourceDir, targetDir, quality = QUALITY) {
  if (!fs.existsSync(sourceDir)) {
    console.log(`⚠️  Directory ${sourceDir} doesn't exist, skipping...`);
    return;
  }

  await createDirectoryIfNotExists(targetDir);
  
  const files = fs.readdirSync(sourceDir);
  const pngFiles = files.filter(file => file.toLowerCase().endsWith('.png'));
  
  console.log(`\n📁 Converting ${pngFiles.length} files from ${sourceDir} to ${targetDir}...`);
  
  let successCount = 0;
  for (const file of pngFiles) {
    const inputPath = path.join(sourceDir, file);
    const outputPath = path.join(targetDir, file.replace('.png', '.webp'));
    
    const success = await convertImage(inputPath, outputPath, quality);
    if (success) successCount++;
  }
  
  console.log(`\n📊 Completed: ${successCount}/${pngFiles.length} files converted successfully`);
}

async function main() {
  console.log('🚀 Starting WebP conversion process...\n');
  
  try {
    // Convert compressed images (for thumbnails)
    await convertDirectory(COMPRESSED_DIR, WEBP_DIR, QUALITY);
    
    // Convert full-size images (for full view)
    await convertDirectory(FULL_SIZE_DIR, WEBP_FULL_DIR, QUALITY);
    
    console.log('\n🎉 WebP conversion completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Update your HTML files to use WebP images');
    console.log('2. Implement lazy loading for better performance');
    console.log('3. Add fallback support for older browsers');
    
  } catch (error) {
    console.error('❌ Conversion failed:', error.message);
    process.exit(1);
  }
}

// Run the conversion
main();
