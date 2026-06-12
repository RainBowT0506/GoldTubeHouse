const CryptoJS = require("crypto-js");

const $t = "zthxw34cdp6wfyxmpad38v52t3hsz6c5";

const zt = {
  stringify: function(t) {
    var e = { ct: t.ciphertext.toString(CryptoJS.enc.Base64) };
    if (t.iv) e.iv = t.iv.toString();
    if (t.salt) e.s = t.salt.toString();
    return JSON.stringify(e);
  },
  parse: function(t) {
    var e = JSON.parse(t), n = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Base64.parse(e.ct) });
    if (e.iv) n.iv = CryptoJS.enc.Hex.parse(e.iv);
    if (e.s) n.salt = CryptoJS.enc.Hex.parse(e.s);
    return n;
  }
};

function Bt(t) {
  var e = Buffer.from(t).toString('base64');
  e = e.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  return e;
}

function encode(t, e) {
  if (!t) return false;
  var n = CryptoJS.AES.encrypt(JSON.stringify(t), e || $t, {format: zt}).toString();
  return Bt(n).trim();
}

async function run() {
  const url = "https://www.youtube.com/watch?v=EH5jx5qPabU";
  const urlEncrypt = encode(url);
  const data = encode(urlEncrypt, url);

  try {
    const response = await fetch("https://get.downsub.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      body: JSON.stringify({ url, data })
    });
    const result = await response.json();
    console.log("Response state:", result.state);
    if (result.subtitles) {
      console.log("Subtitles count:", result.subtitles.length);
      console.log("Subtitles (first 3):", JSON.stringify(result.subtitles.slice(0, 3), null, 2));
    }
    if (result.subtitlesAutoTrans) {
      console.log("SubtitlesAutoTrans count:", result.subtitlesAutoTrans.length);
      console.log("SubtitlesAutoTrans (first 3):", JSON.stringify(result.subtitlesAutoTrans.slice(0, 3), null, 2));
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
