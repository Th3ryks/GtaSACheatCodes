let allCheats = {
    computer: [],
    ps: []
};

let currentPlatform = 'computer';
let currentLanguage = 'en';
let filteredCheats = [];

const translations = {
    en: {
        'site-title': 'GTA San Andreas Cheat Codes',
        'select-platform': 'Select Platform',
        'computer-phone': 'Computer/Phone',
        'playstation': 'PlayStation',
        'search-placeholder': 'Search cheat codes...',
        'all-categories': 'All Categories',
        'health-stats': 'Health & Stats',
        'weapons': 'Weapons',
        'vehicles': 'Vehicles',
        'weather': 'Weather',
        'gameplay': 'Gameplay',
        'spawn-items': 'Spawn Items',
        'people-npcs': 'People & NPCs',
        'wanted-level': 'Wanted Level',
        'computer-cheats': 'Computer/Phone Cheats Codes',
        'playstation-cheats': 'PlayStation Cheat Codes',
        'cheats-found': 'Cheat codes found',
        'no-cheats-found': 'No cheat codes found',
        'adjust-search': 'Try adjusting your search or filter criteria'
    },
    ru: {
        'site-title': 'Чит Коды GTA San Andreas',
        'select-platform': 'Выберите платформу',
        'computer-phone': 'Компьютер/Телефон',
        'playstation': 'PlayStation',
        'search-placeholder': 'Поиск чит кодов...',
        'all-categories': 'Все категории',
        'health-stats': 'Здоровье и характеристики',
        'weapons': 'Оружие',
        'vehicles': 'Транспорт',
        'weather': 'Погода',
        'gameplay': 'Игровой процесс',
        'spawn-items': 'Создание предметов',
        'people-npcs': 'Люди и NPC',
        'wanted-level': 'Уровень розыска',
        'computer-cheats': 'Чит коды для Компьютера/Телефона',
        'playstation-cheats': 'Чит коды для PlayStation',
        'cheats-found': 'чит кодов найдено',
        'no-cheats-found': 'Чит коды не найдены',
        'adjust-search': 'Попробуйте изменить критерии поиска или фильтра'
    }
};

const themeToggle = document.getElementById('themeToggle');
const languageToggle = document.getElementById('languageToggle');
const currentLangSpan = document.getElementById('currentLang');
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
    initializeLanguage();
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
            category: categorizeCheat(cheat.effect_en)
        }));
    });
}

function categorizeCheat(effectEn) {
    const effectLower = effectEn.toLowerCase();
    
    if (effectLower.includes('health') || effectLower.includes('armor') || 
        effectLower.includes('stamina') || effectLower.includes('respect') || 
        effectLower.includes('appeal') || effectLower.includes('body') || 
        effectLower.includes('hungry') || effectLower.includes('oxygen') ||
        effectLower.includes('god mode') || effectLower.includes('infinite health') ||
        effectLower.includes('muscle') || effectLower.includes('fat') || 
        effectLower.includes('skinny') || effectLower.includes('lung capacity')) {
        return 'health';
    }
    
    if (effectLower.includes('weapon') || effectLower.includes('ammo') || 
        effectLower.includes('gun') || effectLower.includes('rocket') || 
        effectLower.includes('hitman') || effectLower.includes('pistol') ||
        effectLower.includes('rifle') || effectLower.includes('shotgun') ||
        effectLower.includes('grenade') || effectLower.includes('ak-47') ||
        effectLower.includes('m4') || effectLower.includes('desert eagle') ||
        effectLower.includes('reload') || effectLower.includes('shoot')) {
        return 'weapons';
    }
    
    if (effectLower.includes('spawn') || effectLower.includes('get ') ||
        effectLower.includes('parachute') || effectLower.includes('jetpack')) {
        return 'spawn';
    }
    
    if (effectLower.includes('car') || effectLower.includes('vehicle') || 
        effectLower.includes('driving') || effectLower.includes('handling') || 
        effectLower.includes('nitro') || effectLower.includes('traffic') || 
        effectLower.includes('tank') || effectLower.includes('rhino') ||
        effectLower.includes('hydra') || effectLower.includes('hunter') ||
        effectLower.includes('helicopter') || effectLower.includes('jet') ||
        effectLower.includes('plane') || effectLower.includes('racecar')) {
        return 'vehicles';
    }
    
    if (effectLower.includes('weather') || effectLower.includes('sunny') || 
        effectLower.includes('rain') || effectLower.includes('fog') || 
        effectLower.includes('storm') || effectLower.includes('sand') || 
        effectLower.includes('midnight') || effectLower.includes('clock') || 
        effectLower.includes('sky') || effectLower.includes('time')) {
        return 'weather';
    }
    
    if (effectLower.includes('wanted') || effectLower.includes('police') || 
        effectLower.includes('star') || effectLower.includes('never wanted') ||
        effectLower.includes('clear wanted') || effectLower.includes('increase wanted')) {
        return 'wanted';
    }
    
    if (effectLower.includes('people') || effectLower.includes('pedestrian') || 
        effectLower.includes('everyone') || effectLower.includes('attack') || 
        effectLower.includes('riot') || effectLower.includes('gang') || 
        effectLower.includes('recruit') || effectLower.includes('has guns')) {
        return 'people';
    }
    
    return 'gameplay';
}

function initializeEventListeners() {
    themeToggle.addEventListener('click', toggleTheme);
    languageToggle.addEventListener('click', toggleLanguage);
    
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

function initializeLanguage() {
    const savedLanguage = localStorage.getItem('language') || 'en';
    currentLanguage = savedLanguage;
    updateLanguageDisplay();
    translatePage();
}

function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.className = `${newTheme}-theme`;
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'ru' : 'en';
    localStorage.setItem('language', currentLanguage);
    updateLanguageDisplay();
    translatePage();
    displayCheats();
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function updateLanguageDisplay() {
    currentLangSpan.textContent = currentLanguage.toUpperCase();
}

function translatePage() {
    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    elementsToTranslate.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    
    const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[currentLanguage][key]) {
            element.placeholder = translations[currentLanguage][key];
        }
    });
    
    updatePlatformTitle();
}

function updatePlatformTitle() {
    const titleKey = currentPlatform === 'computer' ? 'computer-cheats' : 'playstation-cheats';
    platformTitle.textContent = translations[currentLanguage][titleKey];
}

function switchPlatform(platform) {
    currentPlatform = platform;
    
    platformButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-platform="${platform}"]`).classList.add('active');
    
    updatePlatformTitle();
    
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
        cheats = cheats.filter(cheat => {
            const effectText = currentLanguage === 'en' ? cheat.effect_en : cheat.effect_ru;
            return cheat.code.toLowerCase().includes(searchTerm) ||
                   effectText.toLowerCase().includes(searchTerm);
        });
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
        en: {
            health: 'Health & Stats',
            weapons: 'Weapons',
            vehicles: 'Vehicles',
            weather: 'Weather',
            gameplay: 'Gameplay',
            spawn: 'Spawn Items',
            people: 'People & NPCs',
            wanted: 'Wanted Level'
        },
        ru: {
            health: 'Здоровье и характеристики',
            weapons: 'Оружие',
            vehicles: 'Транспорт',
            weather: 'Погода',
            gameplay: 'Игровой процесс',
            spawn: 'Создание предметов',
            people: 'Люди и NPC',
            wanted: 'Уровень розыска'
        }
    };
    
    const effectText = currentLanguage === 'en' ? cheat.effect_en : cheat.effect_ru;
    const categoryName = categoryNames[currentLanguage][cheat.category] || 'Other';
    
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
            <div class="cheat-effect">${escapeHtml(effectText)}</div>
            <div class="cheat-category">${categoryName}</div>
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

console.log(`
🎮 GTA San Andreas Cheat Codes Website
🚀 Loaded successfully!
💡 Press Ctrl/Cmd + K to focus search
🌙 Theme: ${document.body.classList.contains('dark-theme') ? 'Dark' : 'Light'}
🌍 Language: ${currentLanguage.toUpperCase()}
`);