document.addEventListener('DOMContentLoaded', () => {
    const deButton = document.getElementById('de-button');
    const usButton = document.getElementById('us-button');
    const searchInput = document.getElementById('search-input');
    const categoryLabel = document.getElementById('category-label');
    const permissionLabel = document.getElementById('permission-label');
    const text1 = document.getElementById('text1');
    const text2 = document.getElementById('text2');
    const p1 = document.getElementById('p1');
    const moreInfoLinkText = document.getElementById('more-info-link');
    const commandChannelManagement = document.getElementById('command-channel-management');
    const channelManagementText = document.getElementById('channel-management-text');
    const commandSteps = document.getElementById('command-steps');
    const stepsText = document.getElementById('steps-text');
    const questionsText = document.getElementById('questions-text');

    const switchToGerman = () => {
        searchInput.placeholder = '🔎 Suchen Sie nach einem Command?';
        categoryLabel.textContent = 'Kategorie:';
        permissionLabel.textContent = 'Berechtigung:';
        text1.textContent = 'NotedBot Ein Twitch Chat Bot der für Spaß und Hilfe sorgen soll.';
        text2.textContent = 'Funktion vom Bot:';
        p1.textContent = 'Notis ist die interne Währung von NotedBot.';
        moreInfoLinkText.textContent = 'Mehr zu Notis Commands';
        commandChannelManagement.textContent = 'Channel Management';
        channelManagementText.textContent = 'Füge NotedBot mit dem Befehl <code>!join</code> zu deinem Channel hinzu.';
        commandSteps.textContent = 'Erste Schritte';
        stepsText.textContent = 'Commands können mit dem Präfix <code>!</code> verwendet werden.';
        questionsText.textContent = 'Bei Fragen zum Bot melde dich gerne bei <a href="https://twitch.tv/wydios" target="_blank">Mir (Wydios)</a>';
    }

    const switchToEnglish = () => {
        searchInput.placeholder = '🔎 Search for a command?';
        categoryLabel.textContent = 'Category:';
        permissionLabel.textContent = 'Permission:';
        text1.textContent = 'NotedBot A Twitch chat bot that is intended to provide fun and help.';
        text2.textContent = 'Function of the bot:';
        p1.textContent = 'Notis is the internal currency of NotedBot.';
        moreInfoLinkText.textContent = 'More on Notis Commands';
        commandChannelManagement.textContent = 'Channel Management';
        channelManagementText.textContent = 'Add NotedBot to your channel with the command <code>!join</code>.';
        commandSteps.textContent = 'Getting Started';
        stepsText.textContent = 'Commands can be used with the prefix <code>!</code>.';
        questionsText.textContent = 'For questions about the bot, feel free to contact <a href="https://twitch.tv/wydios" target="_blank">Me (Wydios)</a>';
    }

    deButton.addEventListener('click', switchToGerman);
    usButton.addEventListener('click', switchToEnglish);
    
    switchToGerman(); 
});
