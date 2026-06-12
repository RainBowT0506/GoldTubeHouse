import requests

url = "https://downsub.com/js/main.5fdea74d3e1d105efe89.js"
r = requests.get(url)
text = r.text

import re
matches = re.finditer(r'(\$encode|encode\s*=)', text)
for m in matches:
    idx = m.start()
    start = max(0, idx - 500)
    end = min(len(text), idx + 1000)
    print("--- MATCH ---")
    print(text[start:end])
