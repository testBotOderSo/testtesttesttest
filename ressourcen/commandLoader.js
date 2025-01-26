document.addEventListener('DOMContentLoaded', () => {
    const commandsContainer = document.getElementById('commands-container');
    const filterToggle = document.getElementById('filter-toggle');
    const categoryFilter = document.getElementById('category-filter');
    const permissionFilter = document.getElementById('permission-filter');
    const searchInput = document.getElementById('search-input');
    const deButton = document.getElementById('de-button'); // Deutsch-Button
    const usButton = document.getElementById('us-button'); // Englisch-Button
    let commandsData = [];
    let currentLanguage = 'DE'; // Standard-Sprache Deutsch

    // Fetch the commands data
    fetch('./ressourcen/commands.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch commands.json: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            commandsData = data;
            renderCommands(commandsData);
        })
        .catch(error => {
            commandsContainer.innerHTML = `<p>Error loading commands: ${error.message}</p>`;
        });

    // Toggle filter dropdown
    filterToggle.addEventListener('click', () => {
        filterToggle.parentElement.classList.toggle('active');
    });

    // Apply filters on change
    categoryFilter.addEventListener('change', applyFilters);
    permissionFilter.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);

    // Change language on button click
    deButton.addEventListener('click', () => {
        currentLanguage = 'DE';
        renderCommands(commandsData);
    });

    usButton.addEventListener('click', () => {
        currentLanguage = 'EN';
        renderCommands(commandsData);
    });

    // Render commands
    function renderCommands(commands) {
        commandsContainer.innerHTML = '';
        if (commands.length === 0) {
            return (commandsContainer.innerHTML = '<p>❔ Keine Commands gefunden</p>');
        }
        commands.forEach(command => {
            const commandDiv = document.createElement('div');
            commandDiv.classList.add('command');
            commandDiv.innerHTML = `
                <div class="command-info">
                    <p><strong>Name:</strong> ${command.name} ${command.aliases.length ? `(Alias: ${command.aliases.join(', ')})` : ''}</p>
                    <p><strong>Kategorie:</strong> ${command.category}</p>
                    <p><strong>Berechtigung:</strong> ${getPermissionLabel(command.permission)}</p>
                    <p><strong>Beschreibung:</strong> ${
                        currentLanguage === 'DE' ? command.descriptionDE : command.descriptionUS
                    }</p>
                    <p><strong>Verwendung:</strong> ${
                        currentLanguage === 'DE' ? command.usageDE : command.usageUS
                    }</p>
                    ${
                        command.link
                            ? isImageLink(command.link)
                                ? `<p><strong>Link:</strong><br><img src="${command.link}" alt="Image" style="max-width: 100%; max-height: 200px;"/></p>`
                                : `<p><strong>Link:</strong> <a href="${command.link}" target="_blank">${command.link}</a></p>`
                            : ''
                    }
                </div>
            `;
            commandsContainer.appendChild(commandDiv);
        });
    }

    // Apply filters to commands
    function applyFilters() {
        const selectedCategory = categoryFilter.value;
        const selectedPermission = permissionFilter.value;
        const searchTerm = searchInput.value.toLowerCase();

        const filteredCommands = commandsData.filter(command => {
            const matchesSearch =
                command.name.toLowerCase().includes(searchTerm) ||
                command.aliases.some(alias => alias.toLowerCase().includes(searchTerm));
            const matchesCategory = !selectedCategory || command.category === selectedCategory;
            const matchesPermission = !selectedPermission || command.permission == selectedPermission;

            return matchesSearch && matchesCategory && matchesPermission;
        });

        renderCommands(filteredCommands);
    }

    // Map permission levels to labels
    function getPermissionLabel(level) {
        const labels = {
            0: 'Jeder',
            1: 'VIP',
            2: 'Moderator',
            3: 'Broadcaster',
            4: 'Entwickler',
            5: 'Administrator'
        };
        return labels[level] || 'Unbekannt';
    }

    // Check if a link points to an image
    function isImageLink(link) {
        return /\.(png|jpg|jpeg|gif|webp)$/i.test(link);
    }
});
