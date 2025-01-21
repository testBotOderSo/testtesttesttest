document.addEventListener('DOMContentLoaded', () => {
    const commandsContainer = document.getElementById('commands-container');
    const title = document.getElementById('title');

    // Überprüfen, ob das Element 'commands-container' existiert
    if (!commandsContainer) {
        console.error('Das Element "commands-container" wurde nicht gefunden!');
        return; // Skript abbrechen, falls das Element nicht existiert
    }

    // Lade die JSON-Datei mit Fetch
    fetch('./ressourcen/commands.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch commands.json: ${response.statusText}`);
            }
            return response.json();
        })
        .then(commandsData => {
            let language = 'de';

            // Funktion zum Rendern der Commands
            function renderCommands() {
                commandsContainer.innerHTML = '';

                const categories = {};
                commandsData.forEach(command => {
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

                        const description = language === 'de' ? command.descriptionDE : command.descriptionUS;
                        const usage = language === 'de' ? command.usageDE : command.usageUS;

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
            document.getElementById('de-button').addEventListener('click', () => {
                language = 'de';
                title.textContent = 'Befehle';
                renderCommands();
            });

            document.getElementById('us-button').addEventListener('click', () => {
                language = 'us';
                title.textContent = 'Commands';
                renderCommands();
            });

            renderCommands();
        })
        .catch(error => {
            commandsContainer.innerHTML = `<p>Error loading commands: ${error.message}</p>`;
        });
});
