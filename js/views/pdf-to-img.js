export function renderPdfToImg(container) {
    container.innerHTML = `
        <div class="workspace">
            <h2>PDF to Image</h2>
            <p style="opacity: 0.8; margin-top: 0.5rem;">Convert your PDFs into high-quality images individually.</p>
            
            <div class="upload-area" id="p2i-upload">
                <i class="fa-solid fa-images upload-icon"></i>
                <h3>Drag & Drop a PDF here</h3>
                <input type="file" id="p2i-file-input" accept="application/pdf" style="display: none;">
                <button class="upload-btn" id="p2i-btn-select">Select PDF</button>
            </div>
            
            <div class="file-list" id="p2i-file-list"></div>
            
            <div id="p2i-options" style="display: none; margin-top: 2rem; text-align: left;">
                <label for="p2i-ranges" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">
                    Pages to Convert (e.g., "all", "1", "1-3, 5")
                </label>
                <input type="text" id="p2i-ranges" value="1" placeholder="Example: all or 1, 3-5" 
                    style="width: 100%; padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: transparent; color: var(--text-color); font-size: 1rem; font-family: inherit;">
                <p style="font-size: 0.8rem; margin-top: 0.5rem; opacity: 0.6;">
                    <i class="fa-solid fa-circle-info"></i> Your browser may ask for permission to allow multiple downloads.
                </p>

                <button class="btn-primary" id="btn-process-p2i" style="margin-top: 2rem;">
                    <i class="fa-solid fa-image"></i> Convert to Image
                </button>
            </div>

            <div id="p2i-images-container" style="display:flex; flex-wrap:wrap; justify-content:center; gap:1rem; margin-top:2rem;"></div>
        </div>
    `;

    const uploadArea = document.getElementById('p2i-upload');
    const fileInput = document.getElementById('p2i-file-input');
    const btnSelect = document.getElementById('p2i-btn-select');
    const fileList = document.getElementById('p2i-file-list');
    const optionsDiv = document.getElementById('p2i-options');
    const btnProcess = document.getElementById('btn-process-p2i');
    const imgContainer = document.getElementById('p2i-images-container');
    const inputRanges = document.getElementById('p2i-ranges');
    
    let selectedFile = null;

    const updateFileList = () => {
        fileList.innerHTML = '';
        imgContainer.innerHTML = ''; 
        if (selectedFile) {
            uploadArea.style.display = 'none';
            optionsDiv.style.display = 'block';
            
            const item = document.createElement('div');
            item.className = 'file-item';
            item.innerHTML = '<div class="file-name"><i class="fa-regular fa-file-pdf" style="color: var(--gold); margin-right: 8px;"></i>' + selectedFile.name + ' <span style="opacity:0.5; font-size: 0.8rem;">(' + window.formatSize(selectedFile.size) + ')</span></div><button class="remove-file" id="p2i-remove-file"><i class="fa-solid fa-times"></i></button>';
            fileList.appendChild(item);

            document.getElementById('p2i-remove-file').addEventListener('click', () => {
                selectedFile = null;
                uploadArea.style.display = 'block';
                optionsDiv.style.display = 'none';
                updateFileList();
            });
        } else {
            optionsDiv.style.display = 'none';
        }
    };

    const handleFiles = (files) => {
        if(files[0] && files[0].type === 'application/pdf') {
            selectedFile = files[0];
            updateFileList();
        } else {
            window.showToast("Please select a valid PDF file.", "error");
        }
    };

    /**
     * Parses page range strings like "all", "1, 3-5" into an array of 0-based indices.
     */
    const parsePageRanges = (text, totalPages) => {
        const pagesToConvert = new Set();
        const input = text.toLowerCase().trim();
        
        if (input === 'all') {
            for (let i = 0; i < totalPages; i++) pagesToConvert.add(i);
            return Array.from(pagesToConvert);
        }

        const parts = input.split(',');
        for (let part of parts) {
            part = part.trim();
            if (!part) continue;
            
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(Number);
                if (!isNaN(start) && !isNaN(end) && start <= end) {
                    for (let i = start; i <= end; i++) {
                        if (i > 0 && i <= totalPages) pagesToConvert.add(i - 1);
                    }
                }
            } else {
                const pageNum = Number(part);
                if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
                    pagesToConvert.add(pageNum - 1);
                }
            }
        }
        return Array.from(pagesToConvert).sort((a, b) => a - b);
    };

    btnSelect.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

    btnProcess.addEventListener('click', async () => {
        const rangeText = inputRanges.value.trim();
        if (!rangeText) {
            window.showToast("Please specify which pages to convert.", "error");
            return;
        }

        const originalText = btnProcess.innerHTML;
        btnProcess.disabled = true;

        try {
            const fileUrl = URL.createObjectURL(selectedFile);
            const loadingTask = pdfjsLib.getDocument(fileUrl);
            const pdf = await loadingTask.promise;
            
            const indices = parsePageRanges(rangeText, pdf.numPages);
            
            if (indices.length === 0) {
                window.showToast("No valid pages found in the specified range.", "error");
                btnProcess.disabled = false;
                return;
            }

            for (let i = 0; i < indices.length; i++) {
                const idx = indices[i];
                btnProcess.innerHTML = `<div class="loader"></div> Converting Page ${i + 1}/${indices.length}...`;
                
                const page = await pdf.getPage(idx + 1);
                const scale = 2.0; 
                const viewport = page.getViewport({ scale: scale });

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                
                await page.render(renderContext).promise;
                
                await new Promise((resolve) => {
                    canvas.toBlob((blob) => {
                        window.downloadBlob(blob, `PDFLuxe_Page_${idx + 1}.jpg`);
                        resolve();
                    }, 'image/jpeg', 0.95);
                });

                // Small delay to prevent browser download congestion
                if (indices.length > 1) await new Promise(r => setTimeout(r, 300));
            }
            
            window.showToast(`Successfully converted ${indices.length} page(s)!`, 'success');
            URL.revokeObjectURL(fileUrl);
            
        } catch (error) {
            console.error(error);
            window.showToast('Error converting PDF to Image.', 'error');
        } finally {
            btnProcess.innerHTML = originalText;
            btnProcess.disabled = false;
        }
    });
}

