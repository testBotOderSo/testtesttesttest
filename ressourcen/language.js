document.addEventListener('DOMContentLoaded', () => {
    const deButton = document.getElementById('de-button');
    const usButton = document.getElementById('us-button');
    const titleElement = document.getElementById('title');
    const searchInput = document.getElementById('search-input');
    const switchToGerman  = () => {
        titleElement.textContent = 'Befehle';
        searchInput.placeholder = 'Suchen Sie nach einem Command?';
        deButton.querySelector('img').src = 'https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg';
        usButton.querySelector('img').src = 'https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg';
    };
    const switchToEnglish = () => {
        titleElement.textContent = 'Commands';
        searchInput.placeholder = 'Search for a command?';
        deButton.querySelector('img').src = 'https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg';
        usButton.querySelector('img').src = 'https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg';
    };
    deButton.addEventListener('click', switchToGerman);
    usButton.addEventListener('click', switchToEnglish);
    switchToGerman(); 
});
