const puppeteer = require('puppeteer');
const fs = require('fs');

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Set User-Agent to sound like a normal browser
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  const testUrl = 'https://www.youtube.com/watch?v=EH5jx5qPabU';
  console.log(`Navigating to: https://downsub.com/?url=${encodeURIComponent(testUrl)}`);
  
  await page.goto(`https://downsub.com/?url=${encodeURIComponent(testUrl)}`, {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  console.log('Page loaded. Waiting for 10 seconds...');
  await new Promise(r => setTimeout(r, 10000));
  
  // Take screenshot and save it
  await page.screenshot({ path: '/Users/linchengyi/PycharmProjects/GoldTubeHouse/scratch/downsub_screenshot.png' });
  console.log('Screenshot saved to scratch/downsub_screenshot.png');
  
  // Dump page HTML structure
  const html = await page.content();
  fs.writeFileSync('/Users/linchengyi/PycharmProjects/GoldTubeHouse/scratch/downsub_page.html', html, 'utf8');
  console.log('HTML content saved to scratch/downsub_page.html');
  
  // Query all buttons or anchors
  const elements = await page.evaluate(() => {
    const elList = [];
    document.querySelectorAll('*').forEach(el => {
      if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'SPAN' || el.tagName === 'DIV') {
        const text = (el.innerText || el.textContent || '').trim();
        if (text === 'SRT' || text === '下載' || text.includes('Hindi') || text.includes('English')) {
          elList.push({
            tag: el.tagName,
            text: text.substring(0, 50),
            id: el.id,
            className: el.className,
            parentTag: el.parentElement ? el.parentElement.tagName : 'NONE'
          });
        }
      }
    });
    return elList;
  });
  
  console.log('Query matches:', JSON.stringify(elements.slice(0, 30), null, 2));

  await browser.close();
}

run().catch(console.error);
