import os
import re

# Regex to match Chinese characters
chinese_regex = re.compile(r'[\u4e00-\u9fa5]')

root_dir = "F:/cad tools io/cadtools-cc/src"

results = []

for dirpath, _, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(('.ts', '.tsx')):
            filepath = os.path.join(dirpath, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    for line_num, line in enumerate(f, 1):
                        if chinese_regex.search(line):
                            results.append({
                                'file': filepath,
                                'line_num': line_num,
                                'content': line.strip()
                            })
            except Exception as e:
                print(f"Error reading {filepath}: {e}")

print(f"Found {len(results)} lines containing Chinese characters:")
for r in results:
    # Print in relative format for readability
    rel_path = os.path.relpath(r['file'], "F:/cad tools io/cadtools-cc")
    print(f"{rel_path}:{r['line_num']}: {r['content']}")
