const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function run() {
  const downloadPath = '/Users/linchengyi/PycharmProjects/GoldTubeHouse/scratch';
  const testUrl = 'https://www.youtube.com/watch?v=EH5jx5qPabU';
  
  console.log(`Launching Puppeteer to download subtitles for: ${testUrl}`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  // Set download behavior
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath
  });

  // Keep track of files in the directory before download
  const beforeFiles = fs.readdirSync(downloadPath);

  await page.goto(`https://downsub.com/?url=${encodeURIComponent(testUrl)}`, {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  console.log('Page loaded. Waiting for subtitle options...');
  
  // Wait for the buttons to be rendered
  await page.waitForFunction(() => {
    const buttons = document.querySelectorAll('button');
    for (const b of buttons) {
      if (b.innerText && b.innerText.trim() === 'SRT') return true;
    }
    return false;
  }, { timeout: 30000 });
  
  console.log('Subtitle options appeared. Selecting language...');

  // Find the best available SRT button in the page
  const targetLanguage = await page.evaluate(() => {
    // Priority languages: Traditional Chinese, Simplified Chinese, English, auto-generated versions
    const priorities = [
      'Chinese (Traditional)', 'Chinese', '中文（繁體）', '中文（简体）', '中文',
      'English', 'English (auto-generated)', '英語', '英語（自動產生）'
    ];
    
    // Find all rows containing the button and text
    const rows = Array.from(document.querySelectorAll('div, span')).filter(el => {
      // Must contain a button with text "SRT"
      const buttons = Array.from(el.querySelectorAll('button'));
      const hasSrt = buttons.some(b => b.innerText && b.innerText.trim() === 'SRT');
      return hasSrt && el.innerText && (el.innerText.includes('auto-generated') || el.innerText.includes('Chinese') || el.innerText.includes('English') || el.innerText.includes('中文'));
    });
    
    // Search for priorities in order
    for (const p of priorities) {
      for (const row of rows) {
        if (row.innerText.toLowerCase().includes(p.toLowerCase())) {
          // Found it! Return the selector details
          return {
            language: p,
            rowText: row.innerText.substring(0, 100)
          };
        }
      }
    }
    
    // Fallback: just return the first row that has SRT
    for (const row of rows) {
      const text = row.innerText || '';
      return {
        language: 'Any',
        rowText: text.substring(0, 100)
      };
    }
    
    return null;
  });
  
  if (!targetLanguage) {
    throw new Error('No SRT buttons found on page');
  }
  
  console.log('Selected Target Row:', targetLanguage);
  
  // Click the SRT button in that row
  await page.evaluate((targetText) => {
    // Find all rows again
    const divs = Array.from(document.querySelectorAll('div, span')).filter(el => {
      const buttons = Array.from(el.querySelectorAll('button'));
      return buttons.some(b => b.innerText && b.innerText.trim() === 'SRT') && el.innerText;
    });
    
    // Find the matching row
    const match = divs.find(d => d.innerText.includes(targetText));
    if (match) {
      const srtBtn = Array.from(match.querySelectorAll('button')).find(b => b.innerText && b.innerText.trim() === 'SRT');
      if (srtBtn) {
        srtBtn.click();
        return true;
      }
    }
    
    // Fallback: Click first SRT button
    const firstSrtBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.trim() === 'SRT');
    if (firstSrtBtn) {
      firstSrtBtn.click();
      return true;
    }
    
    return false;
  }, targetLanguage.rowText);
  
  console.log('Clicked SRT button. Waiting for download...');
  
  // Wait for the new file to appear (max 15 seconds)
  let downloadedFile = null;
  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise(r => setTimeout(r, 500));
    const afterFiles = fs.readdirSync(downloadPath);
    const newFiles = afterFiles.filter(f => !beforeFiles.includes(f) && !f.endsWith('.crdownload'));
    if (newFiles.length > 0) {
      downloadedFile = newFiles[0];
      break;
    }
  }
  
  if (!downloadedFile) {
    throw new Error('Download timed out or failed');
  }
  
  console.log(`Successfully downloaded: ${downloadedFile}`);
  const filePath = path.join(downloadPath, downloadedFile);
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`File size: ${content.length} characters.`);
  console.log('First 200 characters of file:\n', content.substring(0, 200));
  
  await browser.close();
}

run().catch(console.error);
