document.addEventListener('DOMContentLoaded', () => {
    const deButton = document.getElementById('de-button');
    const usButton = document.getElementById('us-button');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const permissionFilter = document.getElementById('permission-filter');
    // switchToGerman
    const switchToGerman = () => {
        searchInput.placeholder = '🔎 Suchen Sie nach einem Command?';
        categoryFilter.options[0].text = 'Kategorie';
        permissionFilter.options[0].text  = 'Berechtigung';
    };
    // switchToEnglish
    const switchToEnglish = () => {
        searchInput.placeholder = '🔎 Search for a command?';
        categoryFilter.options[0].text = 'Category';
        permissionFilter.options[0].text  = 'Permission';
    };

    deButton.addEventListener('click', switchToGerman);
    usButton.addEventListener('click', switchToEnglish);

    switchToGerman(); 
});
