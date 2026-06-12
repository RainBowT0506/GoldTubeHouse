const CryptoJS = require("crypto-js");
const fs = require("fs");
const path = require("path");
const os = require("os");

const $t = "zthxw34cdp6wfyxmpad38v52t3hsz6c5";

const zt = {
  stringify: function(t) {
    var e = { ct: t.ciphertext.toString(CryptoJS.enc.Base64) };
    if (t.iv) e.iv = t.iv.toString();
    if (t.salt) e.s = t.salt.toString();
    return JSON.stringify(e);
  },
  parse: function(t) {
    var e = JSON.parse(t),
      n = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Base64.parse(e.ct) });
    if (e.iv) n.iv = CryptoJS.enc.Hex.parse(e.iv);
    if (e.s) n.salt = CryptoJS.enc.Hex.parse(e.s);
    return n;
  }
};

function Bt(t) {
  return Buffer.from(t).toString("base64")
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function encode(t, e) {
  if (!t) return false;
  return Bt(CryptoJS.AES.encrypt(JSON.stringify(t), e || $t, { format: zt }).toString()).trim();
}

async function downloadSRT(sub) {
  const title = encodeURIComponent((sub.name || "subtitle") + " [DownSub.com]");
  // Use SRT endpoint with title param + trailing & (exactly as DownSub website does)
  const srtUrl = `https://subtitle.downsub.com/srt/${sub.url}/?title=${title}&`;
  const resp = await fetch(srtUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Referer": "https://downsub.com/"
    }
  });
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
  }
  const text = await resp.text();
  if (!text.trim().match(/^\d+\s*\n/)) {
    throw new Error("Response is not valid SRT content");
  }
  return text;
}

async function main() {
  const url = process.argv[2];
  // Optional output file path (avoids pipe buffer limits for large subtitles)
  const outputFile = process.argv[3] || null;

  if (!url) {
    console.error("Missing URL argument");
    process.exit(1);
  }

  try {
    const urlEncrypt = encode(url);
    const data = encode(urlEncrypt, url);

    const response = await fetch("https://get.downsub.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      body: JSON.stringify({ url, data })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch info: ${response.statusText}`);
    }

    const result = await response.json();
    if (result.state === 3) {
      throw new Error("DownSub failed to find video info or transcripts.");
    }

    const originalSubs = result.subtitles || [];
    const autoTransSubs = result.subtitlesAutoTrans || [];

    if (originalSubs.length === 0 && autoTransSubs.length === 0) {
      throw new Error("No subtitles found for this video.");
    }

    // Build priority-ordered candidate list
    // Prefer original (non-translated) subtitles - they are complete
    // zh-Hant/zh original > en_auto original > zh translated > en translated > any
    const candidates = [];

    const addByCodes = (pool, codes) => {
      for (const code of codes) {
        const sub = pool.find(s => s.code && s.code.toLowerCase() === code.toLowerCase());
        if (sub && !candidates.find(c => c.url === sub.url)) candidates.push(sub);
      }
    };

    // Original (non-translated) subtitles first - these are full-length
    addByCodes(originalSubs, ["zh-Hant", "zh-Hans", "zh", "en_auto", "en"]);
    // Auto-translated subtitles as fallback
    addByCodes(autoTransSubs, ["zh-Hant", "zh-Hans", "zh", "zh-TW", "zh-CN", "en_auto", "en"]);

    // Remaining originals then translated as last resort
    for (const sub of [...originalSubs, ...autoTransSubs]) {
      if (!candidates.find(c => c.url === sub.url)) candidates.push(sub);
    }

    // Try each candidate until one succeeds
    let lastError = null;
    for (const sub of candidates) {
      try {
        const srtContent = await downloadSRT(sub);

        if (outputFile) {
          // Write to file to avoid pipe buffer limits for large subtitles
          fs.writeFileSync(outputFile, srtContent, "utf8");
          // Print the file path so Python can read it
          process.stdout.write(outputFile + "\n");
        } else {
          process.stdout.write(srtContent);
        }
        process.exit(0);
      } catch (err) {
        process.stderr.write(`[DownSub] Skipping ${sub.code} (${err.message})\n`);
        lastError = err;
      }
    }

    throw new Error(`All subtitle candidates failed. Last error: ${lastError?.message}`);
  } catch (err) {
    console.error("DownSub Error:", err.message);
    process.exit(1);
  }
}

main();
