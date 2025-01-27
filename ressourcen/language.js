document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const languageParam = urlParams.get('language');
    const deButton = document.getElementById('de-button');
    const usButton = document.getElementById('us-button');
    const searchInput = document.getElementById('search-input');
    const categoryLabel = document.getElementById('category-label');
    const permissionLabel = document.getElementById('permission-label');
    // switchToGerman
    const switchToGerman = () => {
        searchInput.placeholder = '🔎 Suchen Sie nach einem Command?';
        categoryLabel.textContent = 'Kategorie:';
        permissionLabel.textContent = 'Berechtigung:';
    };
    // switchToEnglish
    const switchToEnglish = () => {
        searchInput.placeholder = '🔎 Search for a command?';
        categoryLabel.textContent = 'Category:';
        permissionLabel.textContent = 'Permission:';
    };
    // Language
    if (languageParam === 'de') {
        switchToGerman();
    } else {
        switchToEnglish(); 
    }
    // Events
    deButton.addEventListener('click', switchToGerman);
    usButton.addEventListener('click', switchToEnglish);
    // switchToGerman
    switchToGerman(); 
});
