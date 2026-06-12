async function run() {
  const encUrl = "eyJjdCI6IlltRG1qMGZNTGJBakZQWFdNUXJSSXZETGxWSmdjXC9nWVFhcjZ1KzRKd0J3WmtXMmpYWHZDSWp4c2NicGRSZkN6SEVBZHZ3Mlp5aW5tblE3UkRPeEFBVnFBZ05SSTdzdmFEcUZZYXErV2RIakxkakFrMEFcL2JFSlNEbTdnSEVFSXBWbEpiMDRSUGVxOGZwcmpPTjhFSWFCc014djVrYUk5RUluSnFHYzJySUZ6Wk10cXlZejg2RnlmRE1nWkxQUnhpTXE5UkhiRTRoT2lLa25YK2tKUnRxQTNNMk1tR1lHOUlVMVoySzU5V2tPMGI4c1VoVFRoWFFTbDQ5cEZHbG11TlhEaVNrTDVaUVpiT2pZMGh1eVh6YzgrSmJmK0FZTjB4SGNERjdya3VaQ00xVGFaRW92UVNkMExoK003UDV6Q0JoOVNvSVVpVDJqTUl4VTR3YWJjalNpY1Jzcys3YU40ZU5SaGh2cFZ3M1hVMEpzbFhTdWJLcFM1dWJPUXV2NUlhRjBUWUJSRU1abVBZZGxIcWxtRFUreFwvTm5qNU05cXdaclwvalh4SWdHZnlVNytVbFVOV2FCKzk2dGdOUXIxTGg5elB3UStiUUNcL1hpK3lQeEhMVUlsdUE9PSIsIml2IjoiZTI1N2U2YTJmYjA0MDI2ZWVhMjNmOThkNzk5NzAyOWMiLCJzIjoiNTk3YzBmZWVlZDc4MjA3NSJ9";
  const downloadUrl = `https://subtitle.downsub.com/vtt/${encUrl}/`;
  
  console.log("Fetching from:", downloadUrl);
  
  try {
    const response = await fetch(downloadUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://downsub.com/"
      }
    });
    const text = await response.text();
    console.log("Status:", response.status);
    console.log("Response (first 500 chars):");
    console.log(text.substring(0, 500));
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
