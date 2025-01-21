document.addEventListener('DOMContentLoaded', () => {
    const commandsContainer = document.getElementById('commands-container');
    const categoryFilter = document.getElementById('category-filter');
    const permissionFilter = document.getElementById('permission-filter');
    const searchInput = document.getElementById('search-input');
    fetch('./ressourcen/commands.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch commands.json: ${response.statusText}`);
            }
            return response.json();
        })
        .then(commandsData => {
            const categories = [...new Set(commandsData.map(command => command.category))].sort();
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
            function applyFilters() {
                const selectedCategory = categoryFilter.value;
                const selectedPermission = permissionFilter.value;
                const searchTerm = searchInput.value.toLowerCase();
                const filteredCommands = commandsData.filter(command => {
                    const matchesCategory = !selectedCategory || command.category === selectedCategory;
                    const matchesPermission = !selectedPermission || command.permission == selectedPermission;
                    const matchesSearch = command.name.toLowerCase().includes(searchTerm) ||
                        command.aliases.some(alias => alias.toLowerCase().includes(searchTerm));
                    return matchesCategory && matchesPermission && matchesSearch;
                });
                renderCommands(filteredCommands);
            }
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
            categoryFilter.addEventListener('change', applyFilters);
            permissionFilter.addEventListener('change', applyFilters);
            searchInput.addEventListener('input', applyFilters);
            renderCommands(commandsData);
        })
        .catch(error => {
            commandsContainer.innerHTML = `<p>Error loading commands: ${error.message}</p>`;
        });
});

