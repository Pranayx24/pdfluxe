# Implementation Plan: PDFLuxe Feature Upgrades

This plan details the "Industrial Overhaul" of PDFLuxe, moving from a standard toolset to a premium, persistence-enabled, AI-powered document workstation.

## Phase 1: Core Architecture & Persistence
**Goal**: Ensure users never lose work and can handle larger volumes.

- [ ] **1.1. IndexedDB Integration**: Implement `idb` or raw IndexedDB to store "Work-in-Progress" (WIP) documents.
    - *Impact*: In `Scan Ultra`, pages will persist across refreshes.
    - *Impact*: Larger PDFs can be buffered locally.
- [ ] **1.2. Global Progress System**: A centralized toast/progress manager for long-running tasks (like OCR or Batch Compression).
- [ ] **1.3. PWA Manifest & Service Worker**: Enable "Add to Home Screen" and offline availability for basic tools.

## Phase 2: Industrial AI (The "Real" Upgrade)
**Goal**: Move from simulation to real client-side intelligence.

- [ ] **2.1. Client-Side OCR (Tesseract.js)**:
    - Replace the mock AI in `js/views/ai.js` with a real OCR engine.
    - Enable **Text Extraction** from scanned images/PDFs.
    - Add **Searchable PDF** output (Overlaying OCR text on images).
- [ ] **2.2. Lightweight PDF Chat**:
    - Implement a basic "Search & Summarize" using extracted text and local keyword mapping.

## Phase 3: Scan Ultra v2.5 (The "Pro" Update)
**Goal**: Enhance the flagship document scanner.

- [ ] **3.1. Persistence Recovery**: On initialization, check IndexedDB for "Unsaved Scans" and offer to resume.
- [ ] **3.2. Better Perspective Logic**:
    - Add a "Spirit Level" / Accelerometer check to ensure the phone is flat.
    - Implement "Smart Crop" auto-refinement (reducing the need for manual handle adjustment).
- [ ] **3.3. Advanced Filters**:
    - Add "Photo Enhancement" and "Shadow Removal" filters using OpenCV.js.

## Phase 4: Batch Processing & Pro Dashboard
**Goal**: Efficiency for power users.

- [ ] **4.1. The "Batch Queue"**:
    - Create a shared `BatchView` where users can drag 10+ files.
    - One-click "Bulk Action" (Rotate All, Compress All, Rename All).
- [ ] **4.2. "Recent Activity" Dashboard**:
    - Add a "Recently Processed" section to the Home screen (Local only, 0 Privacy risk).

## Phase 5: UI/UX Grand Polish
**Goal**: Ensure the "Luxe" in PDFLuxe.

- [ ] **5.1. Motion Design**:
    - Integrate `Framer Motion`-style CSS transitions for card hover and tool switching.
    - Add Lottie animations for "Success" and "Download" states.
    - Expand to include "OLED Black", "Sepia", and "Cyberpunk gold" themes.

---

### Priority Tasks (Next 48 Hours)
1. **IndexedDB Setup**: Foundation for everything else.
2. **Scan Persistence**: Highest user-value upgrade.
3. **Tesseract.js Integration**: Turning the "Mock AI" into a "Real AI".
