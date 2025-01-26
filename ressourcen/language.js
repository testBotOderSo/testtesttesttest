document.addEventListener('DOMContentLoaded', () => {
    const deButton = document.getElementById('de-button');
    const usButton = document.getElementById('us-button');
    const searchInput = document.getElementById('search-input');

    const switchToGerman = () => {
        searchInput.placeholder = '🔎 Suchen Sie nach einem Command?';
    };

    const switchToEnglish = () => {
        searchInput.placeholder = '🔎 Search for a command?';
    };

    deButton.addEventListener('click', switchToGerman);
    usButton.addEventListener('click', switchToEnglish);

    switchToGerman(); 
});
