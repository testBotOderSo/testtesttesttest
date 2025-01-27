function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        category: params.get('category') || '',
        permission: params.get('permission') || ''
    };
}

function applyFiltersFromURL() {
    const { category, permission } = getQueryParams();
  
    if (category) {
        const categorySelect = document.getElementById('category-filter');
        categorySelect.value = category;
    }
    if (permission) {
        const permissionSelect = document.getElementById('permission-filter');
        permissionSelect.value = permission;
    }
    filterCommands();
}

function filterCommands() {
    const category = document.getElementById('category-filter').value;
    const permission = document.getElementById('permission-filter').value;

    console.log(`Filter angewendet: Kategorie = ${category}, Berechtigung = ${permission}`);

    const commandsContainer = document.getElementById('commands-container');
    commandsContainer.innerHTML = `<p>Gefilterte Commands: Kategorie = ${category}, Berechtigung = ${permission}</p>`;
}

function setupFilterListeners() {
    document.getElementById('category-filter').addEventListener('change', filterCommands);
    document.getElementById('permission-filter').addEventListener('change', filterCommands);
}

document.addEventListener('DOMContentLoaded', () => { applyFiltersFromURL(); setupFilterListeners(); });
