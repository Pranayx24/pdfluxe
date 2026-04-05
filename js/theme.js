/**
 * PDFLuxe Shared Theme Logic
 * Handles dark/light mode toggle and persistence
 */

export function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    const icon = toggleBtn.querySelector('i');
    
    const themes = ['dark', 'light', 'oled', 'sepia', 'cyber'];
    const icons = {
        'dark': 'fa-sun',
        'light': 'fa-moon',
        'oled': 'fa-ghost',
        'sepia': 'fa-coffee',
        'cyber': 'fa-bolt-lightning'
    };
    
    // Set initial theme
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (icon) icon.className = 'fa-solid ' + (icons[currentTheme] || 'fa-sun');
    
    // Remove existing listener to prevent duplicates
    const newToggleBtn = toggleBtn.cloneNode(true);
    toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);

    // Toggle Logic
    newToggleBtn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme') || 'dark';
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        const nextTheme = themes[nextIndex];
        
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
        
        if (icon) {
            icon.className = 'fa-solid ' + icons[nextTheme];
        }
        window.showToast("Theme switched to: " + nextTheme.toUpperCase(), 'info');
    });
}

// Global exposure for non-module scripts if needed
if (typeof window !== 'undefined') {
    window.initTheme = initTheme;
    
    // Immediate execution for theme attribute (prevents flash)
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
}
