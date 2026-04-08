import os
import re

for file in os.listdir('.'):
    if not file.endswith('.html'):
        continue

    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Update logic
    content = re.sub(r'js/main\.js\?v=\d+\.\d+', 'js/main.js?v=22.0', content)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated script tags in all HTML files.")
