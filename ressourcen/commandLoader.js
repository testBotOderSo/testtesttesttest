document.addEventListener('DOMContentLoaded', () => {
    const commandsContainer = document.getElementById('commands-container');
    const filterToggle = document.getElementById('filter-toggle');
    const categoryFilter = document.getElementById('category-filter');
    const permissionFilter = document.getElementById('permission-filter');
    const searchInput = document.getElementById('search-input');
    const deButton = document.getElementById('de-button'); 
    const usButton = document.getElementById('us-button'); 
    let commandsData = [];
    let currentLanguage = 'DE'; 

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
    
    deButton.addEventListener('click', () => {
        currentLanguage = 'DE';
        renderCommands(commandsData);
    });
    usButton.addEventListener('click', () => {
        currentLanguage = 'EN';
        renderCommands(commandsData);
    });
    function renderCommands(commands) {
        commandsContainer.innerHTML = ``;
        if (commands.length === 0) {
            return (commandsContainer.innerHTML = `<img src="img/shruge.gif"> <p style="font-weight: bold;">${currentLanguage === 'DE' ? 'Kein Command gefunden' : 'No Command found'}</p>`);
        }
        commands.forEach(command => {
            const commandDiv = document.createElement('div');
            commandDiv.classList.add('command');
            commandDiv.innerHTML = `
                <div class="command-info">
                    <p><strong>Name:</strong> ${command.name} ${command.aliases.length ? `(Alias: ${command.aliases.join(', ')})` : ''}</p>
                    <p><strong>Beschreibung:</strong> ${currentLanguage === 'DE' ? command.descriptionDE : command.descriptionUS} <img src="${command.link}"></p>
                    <p><strong>Category:</strong> ${command.category}</p>
                    <p><strong>Permission:</strong> ${getPermissionLabel(command.permission)}</p>
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
            0: 'Everyone',
            1: 'Vip',
            2: 'Moderator',
            3: 'Broadcaster',
            4: 'Dev',
            5: 'Admin'
        };
        return labels[level] || 'Unbekannt';
    }
});
