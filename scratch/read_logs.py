import re

log_path = r"C:\Users\willp\.gemini\antigravity\brain\fb827cad-57e6-4ce5-a633-176f04488cd7\.system_generated\logs\transcript.jsonl"
with open(log_path, "r", encoding="utf-8") as f:
    content = f.read()

m = re.search(r'(# Implementation Plan - Phased CAD[\s\S]*?### Phase 4:[^\"]*)', content)
if m:
    raw_text = m.group(1)
    # Unescape newlines and quotes
    clean_text = raw_text.replace("\\n", "\n").replace('\\"', '"').replace("\\\\", "\\")
    print(clean_text)
else:
    print("Not found")
