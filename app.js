let allCheats = {
    computer: [],
    ps: []
};

let currentPlatform = 'computer';
let filteredCheats = [];

const themeToggle = document.getElementById('themeToggle');
const platformButtons = document.querySelectorAll('.platform-btn');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const cheatsGrid = document.getElementById('cheatsGrid');
const platformTitle = document.getElementById('platformTitle');
const resultsCount = document.getElementById('resultsCount');
const noResults = document.getElementById('noResults');

document.addEventListener('DOMContentLoaded', async () => {
    await loadAllCheats();
    initializeEventListeners();
    initializeTheme();
    displayCheats();
});

async function loadAllCheats() {
    try {
        const [computerPhoneResponse, psResponse] = await Promise.all([
            fetch('computer_phone.json'),
            fetch('ps.json')
        ]);

        allCheats.computer = await computerPhoneResponse.json();
        allCheats.ps = await psResponse.json();

        categorizeAllCheats();
        
        console.log('All cheats loaded successfully');
    } catch (error) {
        console.error('Error loading cheat data:', error);
        showError('Failed to load cheat codes. Please refresh the page.');
    }
}

function categorizeAllCheats() {
    Object.keys(allCheats).forEach(platform => {
        allCheats[platform] = allCheats[platform].map(cheat => ({
            ...cheat,
            category: categorizeCheat(cheat.effect)
        }));
    });
}

function categorizeCheat(effect) {
    const effectLower = effect.toLowerCase();
    
    if (effectLower.includes('health') || effectLower.includes('armor') || 
        effectLower.includes('stamina') || effectLower.includes('respect') || 
        effectLower.includes('appeal') || effectLower.includes('body') || 
        effectLower.includes('hungry') || effectLower.includes('oxygen')) {
        return 'health';
    }
    
    if (effectLower.includes('weapon') || effectLower.includes('ammo') || 
        effectLower.includes('gun') || effectLower.includes('rocket') || 
        effectLower.includes('hitman')) {
        return 'weapons';
    }
    
    if (effectLower.includes('spawn') && (effectLower.includes('car') || 
        effectLower.includes('tank') || effectLower.includes('bike') || 
        effectLower.includes('plane') || effectLower.includes('boat') || 
        effectLower.includes('helicopter') || effectLower.includes('vehicle') ||
        effectLower.includes('rhino') || effectLower.includes('hydra') || 
        effectLower.includes('hunter') || effectLower.includes('jetpack'))) {
        return 'spawn';
    }
    
    if (effectLower.includes('car') || effectLower.includes('vehicle') || 
        effectLower.includes('driving') || effectLower.includes('handling') || 
        effectLower.includes('nitro') || effectLower.includes('traffic') || 
        effectLower.includes('flying') && effectLower.includes('car')) {
        return 'vehicles';
    }
    
    if (effectLower.includes('weather') || effectLower.includes('sunny') || 
        effectLower.includes('rain') || effectLower.includes('fog') || 
        effectLower.includes('storm') || effectLower.includes('sand') || 
        effectLower.includes('midnight') || effectLower.includes('clock') || 
        effectLower.includes('sky')) {
        return 'weather';
    }
    
    if (effectLower.includes('wanted') || effectLower.includes('police') || 
        effectLower.includes('star')) {
        return 'wanted';
    }
    
    if (effectLower.includes('people') || effectLower.includes('pedestrian') || 
        effectLower.includes('elvis') || effectLower.includes('attack') || 
        effectLower.includes('riot') || effectLower.includes('gang') || 
        effectLower.includes('recruit')) {
        return 'people';
    }
    
    return 'gameplay';
}

function initializeEventListeners() {
    themeToggle.addEventListener('click', toggleTheme);
    
    platformButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const platform = e.currentTarget.dataset.platform;
            switchPlatform(platform);
        });
    });
    
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    categoryFilter.addEventListener('change', handleCategoryFilter);
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.className = `${savedTheme}-theme`;
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.className = `${newTheme}-theme`;
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function switchPlatform(platform) {
    currentPlatform = platform;
    
    platformButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-platform="${platform}"]`).classList.add('active');
    
    const titles = {
        computer: 'Computer/Phone Cheats',
        ps: 'PlayStation Cheats'
    };
    platformTitle.textContent = titles[platform];
    
    searchInput.value = '';
    categoryFilter.value = 'all';
    displayCheats();
}

function handleSearch() {
    displayCheats();
}

function handleCategoryFilter() {
    displayCheats();
}

function displayCheats() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    
    let cheats = [...allCheats[currentPlatform]];
    
    if (searchTerm) {
        cheats = cheats.filter(cheat => 
            cheat.code.toLowerCase().includes(searchTerm) ||
            cheat.effect.toLowerCase().includes(searchTerm)
        );
    }
    
    if (selectedCategory !== 'all') {
        cheats = cheats.filter(cheat => cheat.category === selectedCategory);
    }
    
    filteredCheats = cheats;
    renderCheats(cheats);
    updateResultsCount(cheats.length);
}

function renderCheats(cheats) {
    if (cheats.length === 0) {
        cheatsGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    cheatsGrid.style.display = 'grid';
    noResults.style.display = 'none';
    
    cheatsGrid.innerHTML = cheats.map(cheat => createCheatCard(cheat)).join('');
    
    addCopyFunctionality();
}

function createCheatCard(cheat) {
    const categoryNames = {
        health: 'Health & Stats',
        weapons: 'Weapons',
        vehicles: 'Vehicles',
        weather: 'Weather',
        gameplay: 'Gameplay',
        spawn: 'Spawn Items',
        people: 'People & NPCs',
        wanted: 'Wanted Level'
    };
    
    const copyButton = currentPlatform === 'ps' ? '' : `
        <button class="copy-btn" data-code="${escapeHtml(cheat.code)}">
            <i class="fas fa-copy"></i>
        </button>
    `;
    
    return `
        <div class="cheat-card">
            <div class="cheat-code">
                ${escapeHtml(cheat.code)}
                ${copyButton}
            </div>
            <div class="cheat-effect">${escapeHtml(cheat.effect)}</div>
            <div class="cheat-category">${categoryNames[cheat.category] || 'Other'}</div>
        </div>
    `;
}

function addCopyFunctionality() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const code = button.dataset.code;
            copyToClipboard(code);
            showCopyFeedback(button);
        });
    });
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

function showCopyFeedback(button) {
    const originalContent = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.style.background = '#2ecc71';
    
    setTimeout(() => {
        button.innerHTML = originalContent;
        button.style.background = '';
    }, 1000);
}

function updateResultsCount(count) {
    resultsCount.textContent = count;
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--danger-color);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    
    if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        searchInput.blur();
        displayCheats();
    }
});

document.documentElement.style.scrollBehavior = 'smooth';

const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
};

function showLoading() {
    cheatsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary-color);"></i>
            <p style="margin-top: 1rem; color: var(--text-secondary);">Loading cheats...</p>
        </div>
    `;
}

console.log(`
🎮 GTA San Andreas Cheat Codes Website
🚀 Loaded successfully!
💡 Press Ctrl/Cmd + K to focus search
🌙 Theme: ${document.body.classList.contains('dark-theme') ? 'Dark' : 'Light'}
`);