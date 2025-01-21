document.addEventListener('DOMContentLoaded', () => {
    const commandsContainer = document.getElementById('commands-container');
    const title = document.getElementById('title');
    const deButton = document.getElementById('de-button');
    const usButton = document.getElementById('us-button');
    const categorySelect = document.getElementById('category-select');

    let currentUserPermission = 0; // Zum Testen: Ersetze dies mit der aktuellen Benutzerberechtigung
    let currentLanguage = 'de';
    let currentCategoryFilter = 'all';

    // Lade die JSON-Datei mit Fetch
    fetch('./ressourcen/commands.json')
        .then(response => response.json())
        .then(commandsData => {
            // Funktion zum Rendern der Commands
            function renderCommands() {
                commandsContainer.innerHTML = '';
                const filteredCommands = commandsData.filter(command => {
                    // Filtere nach Kategorie
                    const isCategoryMatch = currentCategoryFilter === 'all' || command.category === currentCategoryFilter;
                    // Filtere nach Berechtigung
                    const isPermissionMatch = command.permission <= currentUserPermission;
                    return isCategoryMatch && isPermissionMatch;
                });

                const categories = {};
                filteredCommands.forEach(command => {
                    if (!categories[command.category]) {
                        categories[command.category] = [];
                    }
                    categories[command.category].push(command);
                });

                Object.keys(categories).sort().forEach(category => {
                    const categoryDiv = document.createElement('div');
                    categoryDiv.classList.add('category');
                    categoryDiv.innerHTML = `<h2>${category}</h2>`;

                    categories[category].forEach(command => {
                        const commandDiv = document.createElement('div');
                        commandDiv.classList.add('command');

                        const description = currentLanguage === 'de' ? command.descriptionDE : command.descriptionUS;
                        const usage = currentLanguage === 'de' ? command.usageDE : command.usageUS;

                        commandDiv.innerHTML = `
                            <p><strong>${command.name}</strong></p>
                            <p>${description}</p>
                            <p><em>${usage}</em></p>
                            <p>Link: <a href="${command.link}" target="_blank"><img src="${command.link}" alt="Emote"></a></p>
                        `;

                        categoryDiv.appendChild(commandDiv);
                    });

                    commandsContainer.appendChild(categoryDiv);
                });
            }

            // Sprachumschaltung
            deButton.addEventListener('click', () => {
                currentLanguage = 'de';
                title.textContent = 'Befehle';
                renderCommands();
            });

            usButton.addEventListener('click', () => {
                currentLanguage = 'us';
                title.textContent = 'Commands';
                renderCommands();
            });

            // Kategorieumschaltung
            categorySelect.addEventListener('change', () => {
                currentCategoryFilter = categorySelect.value;
                renderCommands();
            });

            // Initiale Commands anzeigen
            renderCommands();
        })
        .catch(error => {
            commandsContainer.innerHTML = `<p>Error loading commands: ${error.message}</p>`;
        });
});
