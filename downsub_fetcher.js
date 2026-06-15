const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function main() {
  const url = process.argv[2];
  const outputFile = process.argv[3];

  if (!url || !outputFile) {
    console.error("Usage: node downsub_fetcher.js <url> <outputFile>");
    process.exit(1);
  }

  // Create a unique temporary directory for this download process to avoid concurrent conflicts
  const downloadPath = path.join(
    '/Users/linchengyi/PycharmProjects/GoldTubeHouse/scratch',
    'downsub_temp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8)
  );
  
  try {
    fs.mkdirSync(downloadPath, { recursive: true });
  } catch (e) {
    console.error("Failed to create download directory:", e.message);
    process.exit(1);
  }

  console.log(`[DownSub Puppeteer] Starting browser to download subtitles for: ${url}`);
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    // Use a standard browser User-Agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // Enable request interception to block images, fonts, media, and ad scripts for maximum speed
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      const reqUrl = req.url().toLowerCase();
      if (
        type === 'image' ||
        type === 'font' ||
        type === 'media' ||
        reqUrl.includes('google-analytics') ||
        reqUrl.includes('googlesyndication') ||
        reqUrl.includes('doubleclick') ||
        reqUrl.includes('adsystem') ||
        reqUrl.includes('adservice') ||
        reqUrl.includes('adnxs') ||
        reqUrl.includes('quantserve') ||
        reqUrl.includes('facebook') ||
        reqUrl.includes('analytics') ||
        reqUrl.includes('amazon-adsystem') ||
        reqUrl.includes('popads')
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    // Configure Chrome DevTools Protocol to allow file downloads to our custom path
    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: downloadPath
    });

    // Navigate to downsub, waiting only for DOM to be loaded instead of network idle (speeds up loads by 10x on ad-heavy sites)
    await page.goto(`https://downsub.com/?url=${encodeURIComponent(url)}`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Wait for the SRT buttons to appear (times out after 30 seconds)
    await page.waitForFunction(() => {
      const buttons = document.querySelectorAll('button');
      for (const b of buttons) {
        if (b.innerText && b.innerText.trim() === 'SRT') return true;
      }
      return false;
    }, { timeout: 30000 });

    // Find the best available SRT button
    const targetLanguage = await page.evaluate(() => {
      const priorities = [
        'chinese (traditional)', '中文（繁體）', 'zh-hant',
        'chinese (simplified)', '中文（简体）', 'zh-hans',
        'chinese', '中文', 'zh',
        'english', 'english (auto-generated)', '英語', '英語（自動產生）'
      ];

      const rows = Array.from(document.querySelectorAll('.layout.justify-start, .layout.justify-start.align-center, .flex.mt-5.text-center')).filter(el => {
        const buttons = Array.from(el.querySelectorAll('button'));
        return buttons.some(b => b.innerText && b.innerText.trim() === 'SRT');
      });

      for (const p of priorities) {
        for (const row of rows) {
          const text = (row.innerText || '').toLowerCase();
          if (text.includes(p)) {
            return {
              language: p,
              rowText: row.innerText
            };
          }
        }
      }

      if (rows.length > 0) {
        return {
          language: 'Any',
          rowText: rows[0].innerText
        };
      }

      return null;
    });

    if (!targetLanguage) {
      throw new Error('No SRT buttons found on page');
    }

    console.log(`[DownSub Puppeteer] Selected target row text: ${targetLanguage.rowText.replace(/\n/g, ' ')}`);

    // Click the matching button
    await page.evaluate((targetText) => {
      const rows = Array.from(document.querySelectorAll('.layout.justify-start, .layout.justify-start.align-center, .flex.mt-5.text-center')).filter(el => {
        const buttons = Array.from(el.querySelectorAll('button'));
        return buttons.some(b => b.innerText && b.innerText.trim() === 'SRT');
      });

      const match = rows.find(r => r.innerText === targetText);
      if (match) {
        const srtBtn = Array.from(match.querySelectorAll('button')).find(b => b.innerText && b.innerText.trim() === 'SRT');
        if (srtBtn) {
          srtBtn.click();
          return true;
        }
      }

      // Fallback
      const firstSrtBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.trim() === 'SRT');
      if (firstSrtBtn) {
        firstSrtBtn.click();
        return true;
      }

      return false;
    }, targetLanguage.rowText);

    // Wait for file download (max 30 seconds)
    console.log('[DownSub Puppeteer] Clicked SRT button. Waiting for download...');
    let downloadedFile = null;
    for (let attempt = 0; attempt < 60; attempt++) {
      await new Promise(r => setTimeout(r, 500));
      const files = fs.readdirSync(downloadPath);
      // Filter out temp Chrome download files (.crdownload)
      const finishedFiles = files.filter(f => !f.endsWith('.crdownload'));
      if (finishedFiles.length > 0) {
        downloadedFile = finishedFiles[0];
        break;
      }
    }

    if (!downloadedFile) {
      throw new Error('Download timed out or failed');
    }

    const downloadedFilePath = path.join(downloadPath, downloadedFile);
    console.log(`[DownSub Puppeteer] Successfully downloaded ${downloadedFile}. Copying to destination...`);
    
    // Copy the file to the requested output file path
    fs.copyFileSync(downloadedFilePath, outputFile);
    
    // Clean up temporary downloaded file
    try {
      fs.unlinkSync(downloadedFilePath);
    } catch (e) {}

    console.log(`[DownSub Puppeteer] Done. Subtitles written to ${outputFile}`);
    process.exit(0);

  } catch (err) {
    console.error("[DownSub Puppeteer] Error:", err.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
    // Remove the temp folder
    try {
      fs.rmSync(downloadPath, { recursive: true, force: true });
    } catch (e) {}
  }
}

main();
