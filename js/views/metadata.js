import { getPDFLib } from '../pdf-engine.js';

/**
 * Industrial Identity Editor
 * Direct manipulation of hidden PDF metadata and document properties.
 */
export async function renderMetadata(container) {
    container.innerHTML = `
        <div class="workspace">
            <div class="tool-header">
                <i class="fa-solid fa-address-card tool-icon" style="color: #f1c40f;"></i>
                <h2>Identity Editor</h2>
                <p>Modify hidden document properties, authorship, and ownership metadata.</p>
            </div>

            <div class="upload-area" id="meta-upload">
                <i class="fa-solid fa-fingerprint upload-icon"></i>
                <h3>Select PDF to Edit Identity</h3>
                <input type="file" id="pdf-meta-input" accept="application/pdf" style="display: none;">
                <button class="upload-btn">Choose File</button>
            </div>

            <div id="meta-interface" style="display: none; margin-top: 2rem; text-align: left;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" id="meta-title" placeholder="Loading...">
                    </div>
                    <div class="form-group">
                        <label>Author</label>
                        <input type="text" id="meta-author" placeholder="Loading...">
                    </div>
                    <div class="form-group">
                        <label>Subject</label>
                        <input type="text" id="meta-subject" placeholder="Loading...">
                    </div>
                    <div class="form-group">
                        <label>Producer</label>
                        <input type="text" id="meta-producer" placeholder="Loading...">
                    </div>
                    <div class="form-group" style="grid-column: span 2;">
                        <label>Keywords (comma separated)</label>
                        <input type="text" id="meta-keywords" placeholder="Loading...">
                    </div>
                </div>

                <button class="btn-primary" id="btn-save-meta" style="background: #f1c40f; color: #000; margin-top: 2rem; border:none;">
                    <i class="fa-solid fa-floppy-disk"></i> Overwrite Identity & Export
                </button>
            </div>
        </div>

        <style>
            .form-group { margin-bottom: 1rem; }
            .form-group label { display: block; font-size: 0.8rem; font-weight: 700; color: #f1c40f; text-transform: uppercase; margin-bottom: 5px; }
            .form-group input { width: 100%; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: #fff; padding: 0.8rem; border-radius: 8px; font-size: 0.9rem; }
            .form-group input:focus { border-color: #f1c40f; outline: none; background: rgba(0,0,0,0.3); }
        </style>
    `;

    const uploadArea = document.getElementById('meta-upload');
    const input = document.getElementById('pdf-meta-input');
    const interfaceArea = document.getElementById('meta-interface');
    const btnSave = document.getElementById('btn-save-meta');

    let activeFile = null;
    let pdfDoc = null;

    uploadArea.onclick = () => input.click();
    
    input.onchange = async (e) => {
        const pLib = getPDFLib();
        if (!pLib) return;

        const file = e.target.files[0];
        if (!file || file.type !== 'application/pdf') return;
        activeFile = file;

        const data = await file.arrayBuffer();
        pdfDoc = await pLib.PDFDocument.load(data, { ignoreEncryption: true });

        // Load existing
        document.getElementById('meta-title').value = pdfDoc.getTitle() || "";
        document.getElementById('meta-author').value = pdfDoc.getAuthor() || "";
        document.getElementById('meta-subject').value = pdfDoc.getSubject() || "";
        document.getElementById('meta-producer').value = pdfDoc.getProducer() || "";
        document.getElementById('meta-keywords').value = (pdfDoc.getKeywords() || "").split(" ").join(", ");

        uploadArea.style.display = 'none';
        interfaceArea.style.display = 'block';
    };

    btnSave.onclick = async () => {
        if (!pdfDoc) return;
        btnSave.innerText = "Encoding Properties...";
        btnSave.disabled = true;

        try {
            pdfDoc.setTitle(document.getElementById('meta-title').value);
            pdfDoc.setAuthor(document.getElementById('meta-author').value);
            pdfDoc.setSubject(document.getElementById('meta-subject').value);
            pdfDoc.setProducer(document.getElementById('meta-producer').value);
            pdfDoc.setKeywords(document.getElementById('meta-keywords').value.split(',').map(k => k.trim()));

            const finalBytes = await pdfDoc.save();
            window.downloadBlob(new Blob([finalBytes], {type: 'application/pdf'}), `Modified_${activeFile.name}`, "Identity Editor");
            
            window.showToast("Metadata updated successfully.", "success");
            uploadArea.style.display = 'block';
            interfaceArea.style.display = 'none';
        } catch (err) {
            console.error(err);
            window.showToast("Update failed.", "error");
        } finally {
            btnSave.innerText = "Overwrite Identity & Export";
            btnSave.disabled = false;
        }
    };
}
