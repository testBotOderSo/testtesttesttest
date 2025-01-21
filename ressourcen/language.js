document.addEventListener('DOMContentLoaded', () => {
    const deButton = document.getElementById('de-button');
    const usButton = document.getElementById('us-button');
    const titleElement = document.getElementById('title');
    const searchInput = document.getElementById('search-input');

    const switchToGerman = () => {
        titleElement.textContent = 'Befehle';
        searchInput.placeholder = 'Suchen Sie nach einem Command?';
    };

    const switchToEnglish = () => {
        titleElement.textContent = 'Commands';
        searchInput.placeholder = 'Search for a command?';
    };

    deButton.addEventListener('click', switchToGerman);
    usButton.addEventListener('click', switchToEnglish);

    switchToGerman(); 
});
