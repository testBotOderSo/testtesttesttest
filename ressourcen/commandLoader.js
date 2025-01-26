document.addEventListener('DOMContentLoaded', () => {
    const commandsContainer = document.getElementById('commands-container');
    const filterToggle = document.getElementById('filter-toggle');
    const categoryFilter = document.getElementById('category-filter');
    const permissionFilter = document.getElementById('permission-filter');
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

    filterToggle.addEventListener('click', () => {
        filterToggle.parentElement.classList.toggle('active');
    });
    categoryFilter.addEventListener('change', applyFilters);
    permissionFilter.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);

    function renderCommands(commands) {
        commandsContainer.innerHTML = '';
        if (commands.length === 0) {
            return commandsContainer.innerHTML = '<p>❔ Keine Commands gefunden</p>';
        }
        commands.forEach(command => {
            const commandDiv = document.createElement('div');
            commandDiv.classList.add('command');
            commandDiv.innerHTML = `
                <div class="command-info">
                    <p><strong>Name:</strong> ${command.name} ${command.aliases.length ? `(Alias: ${command.aliases.join(', ')})` : ''}</p>
                    <p><strong>Kategorie:</strong> ${command.category}</p>
                    <p><strong>Berechtigung:</strong> ${getPermissionLabel(command.permission)}</p>
                    <p><strong>Beschreibung (DE):</strong> ${command.descriptionDE}</p>
                    <p><strong>Beschreibung (EN):</strong> ${command.descriptionUS}</p>
                    <p><strong>Verwendung (DE):</strong> ${command.usageDE}</p>
                    <p><strong>Verwendung (EN):</strong> ${command.usageUS}</p>
                    ${command.link ? `<p><strong>Link:</strong> <a href="${command.link}" target="_blank">${command.link}</a></p>` : ''}
                </div>
            `;
            commandsContainer.appendChild(commandDiv);
        });
    }

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
