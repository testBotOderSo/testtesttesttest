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

    // Filter anwenden
    filterToggle.addEventListener('click', () => {
        filterToggle.parentElement.classList.toggle('active');
    });
    categoryFilter.addEventListener('change', applyFilters);
    permissionFilter.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);

    function renderCommands(commands) {
        commandsContainer.innerHTML = '';
        if (commands.length === 0) {
            commandsContainer.innerHTML = '<p>❔ Keine Command gefunden</p>';
            return;
        }
        commands.forEach(command => {
            const commandDiv = document.createElement('div');
            commandDiv.classList.add('command');
            commandDiv.innerHTML = `
                <div class="command-info">
                    <p><strong>${command.name}</strong> ${command.aliases.length ? `(${command.aliases.join(', ')})` : ''}</p>
                    <p>${command.descriptionDE}</p>
                    <p><em>${command.usageDE}</em></p>
                    <p class="category">Kategorie: ${command.category}</p>
                    <p class="permission">Berechtigung: ${getPermissionLabel(command.permission)}</p>
                </div>
                <p class="link" style="float: right;">Link: <a href="${command.link}" target="_blank"><img src="${command.link}" alt="Emote" class="command-img"></a></p>
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
