import re

log_path = r"C:\Users\willp\.gemini\antigravity\brain\fb827cad-57e6-4ce5-a633-176f04488cd7\.system_generated\logs\transcript.jsonl"
with open(log_path, "r", encoding="utf-8") as f:
    content = f.read()

# Search for the phased roadmap in the transcript
matches = re.finditer(r'(# Implementation Plan - Phased CAD[\s\S]*?### Phase 4:[^\"]*)', content)
for idx, m in enumerate(matches):
    text = m.group(1).replace("\\n", "\n").replace('\\"', '"').replace("\\\\", "\\")
    print(f"--- MATCH {idx+1} ---")
    
    # Extract only lines that look like phases or tools
    for line in text.split("\n"):
        if "Phase " in line or "1. " in line or "2. " in line or "3. " in line or "4. " in line or "5. " in line or "6. " in line or "7. " in line or "8. " in line or "9. " in line or "10. " in line or "11. " in line or "12. " in line or "13. " in line:
            print(line.strip())
