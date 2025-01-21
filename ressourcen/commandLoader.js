document.addEventListener('DOMContentLoaded', () => {
    const commandsContainer = document.getElementById('commands-container');
    const combinedFilter = document.getElementById('combined-filter');
    const searchInput = document.getElementById('search-input');
    let commandsData = [];

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

    // Filter anwenden
    combinedFilter.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);

    function renderCommands(commands) {
        commandsContainer.innerHTML = '';
        if (commands.length === 0) {
            commandsContainer.innerHTML = '<p>Keine Befehle gefunden.</p>';
            return;
        }
        commands.forEach(command => {
            const commandDiv = document.createElement('div');
            commandDiv.classList.add('command');
            commandDiv.innerHTML = `
                <p><strong>${command.name}</strong> ${command.aliases.length ? `(${command.aliases.join(', ')})` : ''}</p>
                <p>${command.descriptionDE}</p>
                <p><em>${command.usageDE}</em></p>
                <p class="category">Kategorie: ${command.category}</p>
                <p class="permission">Berechtigung: ${getPermissionLabel(command.permission)}</p>
            `;
            commandsContainer.appendChild(commandDiv);
        });
    }

    function applyFilters() {
        const selectedFilter = combinedFilter.value;
        const searchTerm = searchInput.value.toLowerCase();

        const filteredCommands = commandsData.filter(command => {
            const matchesSearch =
                command.name.toLowerCase().includes(searchTerm) ||
                command.aliases.some(alias => alias.toLowerCase().includes(searchTerm));
            const matchesFilter =
                !selectedFilter || command.category === selectedFilter || command.permission == selectedFilter;

            return matchesSearch && matchesFilter;
        });

        renderCommands(filteredCommands);
    }

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
});

