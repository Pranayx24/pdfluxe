import os
import re

for file in os.listdir('.'):
    if not file.endswith('.html'):
        continue

    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace the invalid docx script
    content = content.replace(
        '<script src="https://unpkg.com/docx@8.2.3/build/index.js"></script>',
        '<script src="https://unpkg.com/docx@8.2.3/build/index.umd.js"></script>'
    )

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated docx script tags in all HTML files.")
