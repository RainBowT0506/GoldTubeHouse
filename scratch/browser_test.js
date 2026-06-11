const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function run() {
  console.log("🚀 Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // Capture console messages
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  // Handle dialogs (alert, confirm, etc.)
  page.on('dialog', async dialog => {
    console.log(`[BROWSER DIALOG] Type: ${dialog.type()}, Message: ${dialog.message()}`);
    await dialog.dismiss();
  });

  try {
    console.log("🌐 Navigating to http://localhost:5173/ ...");
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });

    console.log("✏️ Entering YouTube URL...");
    await page.waitForSelector('.url-input');
    await page.evaluate(() => {
      const input = document.querySelector('.url-input');
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(input, 'https://www.youtube.com/watch?v=ivty6t0lUkQ');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    console.log("🖱️ Clicking '開始處理'...");
    await page.$eval('.btn-submit', el => el.click());

    console.log("⏳ Waiting for app screen to load...");
    // The loading screen is displayed first. Wait for the app screen to be loaded.
    await page.waitForSelector('#app-screen', { timeout: 30000 });
    console.log("✅ App screen loaded successfully!");

    // Wait a brief moment to ensure React state updates are finished
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));

    console.log("🔍 Locating segment content...");
    const selectAndPressEnterResult = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('.segment-content'));
      console.log(`Found ${els.length} segment-content elements.`);
      
      const el = els.find(e => e.innerText.includes("So the next thing we need"));
      if (!el) {
        return { success: false, reason: "Could not find element containing the text." };
      }

      const text = el.innerText;
      const index = text.indexOf("So the next thing we need");
      console.log(`Matched element text length: ${text.length}, target index: ${index}`);

      el.focus();
      const range = document.createRange();
      const sel = window.getSelection();

      let textNode = el.firstChild;
      while (textNode && textNode.nodeType !== Node.TEXT_NODE) {
        textNode = textNode.firstChild;
      }

      if (!textNode) {
        return { success: false, reason: "Could not locate child text node." };
      }

      // Set caret position exactly at the start of "So the next"
      range.setStart(textNode, index);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);

      console.log("Selection set at start of 'So the next...'");

      // Dispatch KeyboardEvent
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true
      });
      const dispatched = el.dispatchEvent(event);
      console.log(`Dispatched keydown event. Cancelled: ${event.defaultPrevented}`);

      return { success: true, index, textLength: text.length, defaultPrevented: event.defaultPrevented };
    });

    console.log("Result of selection & press Enter:", selectAndPressEnterResult);

    // Wait a moment for state changes
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));

    // Take a screenshot of the page to inspect visual changes
    const screenshotPath = path.join(__dirname, 'screenshot.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`📸 Screenshot saved to ${screenshotPath}`);

    // Print all segment titles currently visible
    const finalSegments = await page.evaluate(() => {
      const titles = Array.from(document.querySelectorAll('.segment-title')).map(e => e.innerText);
      const contents = Array.from(document.querySelectorAll('.segment-content')).map(e => e.innerText.substring(0, 80));
      return titles.map((t, idx) => ({ title: t, content: contents[idx] }));
    });
    console.log("📋 Current segments rendered on screen:", finalSegments);

  } catch (err) {
    console.error("❌ Test run failed with error:", err);
  } finally {
    await browser.close();
    console.log("🏁 Browser closed.");
  }
}

run();
