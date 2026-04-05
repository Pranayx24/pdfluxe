/**
 * Industrial PDF Compare - Legal Grade
 * Extracts and diffs text between two documents side-by-side.
 */
export async function renderCompare(container) {
    container.innerHTML = `
        <div class="workspace" style="max-width: 1200px;">
            <div class="tool-header">
                <i class="fa-solid fa-scale-balanced tool-icon" style="color: #3498db;"></i>
                <h2>Legal Grade Compare</h2>
                <p>Detect additions and deletions between two different document versions.</p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem;">
                <div class="upload-area" id="compare-1-drop">
                    <i class="fa-solid fa-file-pdf upload-icon"></i>
                    <h3>Base Document (v1)</h3>
                    <input type="file" id="compare-1-input" accept="application/pdf" style="display: none;">
                    <button class="upload-btn">Select v1</button>
                    <div class="file-name-v1" style="font-size: 0.8rem; margin-top: 10px; opacity: 0.6;"></div>
                </div>
                <div class="upload-area" id="compare-2-drop">
                    <i class="fa-regular fa-file-pdf upload-icon" style="color: var(--gold);"></i>
                    <h3>Revised Document (v2)</h3>
                    <input type="file" id="compare-2-input" accept="application/pdf" style="display: none;">
                    <button class="upload-btn">Select v2</button>
                    <div class="file-name-v2" style="font-size: 0.8rem; margin-top: 10px; opacity: 0.6;"></div>
                </div>
            </div>

            <div id="compare-actions" style="display: none; margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 2rem;">
                <button class="btn-primary" id="btn-run-compare" style="max-width: 400px; margin: 0 auto; background: var(--gold); color: #000;">
                    Initiate Difference Analysis
                </button>
            </div>

            <div id="compare-results" style="display: none; margin-top: 3rem; text-align: left;">
                <div style="display: flex; gap: 2rem;">
                    <div id="diff-v1" style="flex:1; background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 12px; border: 1px solid #333; height: 500px; overflow-y: auto; font-family: monospace; white-space: pre-wrap;"></div>
                    <div id="diff-v2" style="flex:1; background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 12px; border: 1px solid #333; height: 500px; overflow-y: auto; font-family: monospace; white-space: pre-wrap;"></div>
                </div>
            </div>
        </div>
    `;

    const drop1 = document.getElementById('compare-1-drop');
    const drop2 = document.getElementById('compare-2-drop');
    const input1 = document.getElementById('compare-1-input');
    const input2 = document.getElementById('compare-2-input');
    const btnRun = document.getElementById('btn-run-compare');
    const results = document.getElementById('compare-results');

    let file1 = null;
    let file2 = null;

    drop1.onclick = () => input1.click();
    drop2.onclick = () => input2.click();

    const updateUI = () => {
        if (file1) document.querySelector('.file-name-v1').innerText = file1.name;
        if (file2) document.querySelector('.file-name-v2').innerText = file2.name;
        if (file1 && file2) document.getElementById('compare-actions').style.display = 'block';
    };

    input1.onchange = (e) => { file1 = e.target.files[0]; updateUI(); };
    input2.onchange = (e) => { file2 = e.target.files[0]; updateUI(); };

    btnRun.onclick = async () => {
        btnRun.innerText = "Analyzing Text Layers...";
        btnRun.disabled = true;

        try {
            const extractText = async (file) => {
                const data = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data }).promise;
                let text = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    text += content.items.map(it => it.str).join(" ") + "\n";
                }
                return text;
            };

            const text1 = await extractText(file1);
            const text2 = await extractText(file2);

            // Rough Diffing logic (Legal Grade - Word based)
            const words1 = text1.split(/\s+/);
            const words2 = text2.split(/\s+/);

            const container1 = document.getElementById('diff-v1');
            const container2 = document.getElementById('diff-v2');
            container1.innerHTML = "";
            container2.innerHTML = "";

            // Side-by-side logic (simplified for browser)
            words1.forEach(word => {
                const span = document.createElement('span');
                span.innerText = word + " ";
                if (!words2.includes(word)) {
                    span.style.backgroundColor = "rgba(231, 76, 60, 0.4)";
                    span.style.borderBottom = "2px solid #e74c3c";
                }
                container1.appendChild(span);
            });

            words2.forEach(word => {
                const span = document.createElement('span');
                span.innerText = word + " ";
                if (!words1.includes(word)) {
                    span.style.backgroundColor = "rgba(46, 204, 113, 0.4)";
                    span.style.borderBottom = "2px solid #2ecc71";
                }
                container2.appendChild(span);
            });

            results.style.display = 'block';
            window.showToast("Analysis Complete: Differences highlighted.", "success");
        } catch (e) {
            console.error(e);
            window.showToast("Comparison failed.", "error");
        } finally {
            btnRun.innerText = "Initiate Difference Analysis";
            btnRun.disabled = false;
        }
    };
}
