document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const languageParam = urlParams.get('language');
    const deButton = document.getElementById('de-button');
    const usButton = document.getElementById('us-button');
    const searchInput = document.getElementById('search-input');
    const categoryLabel = document.getElementById('category-label');
    const permissionLabel = document.getElementById('permission-label');
    const text1 = document.getElementById('text1');
    const text2 = document.getElementById('text2');
    const p1 = document.getElementById('p1');

    // Übersetzungen für Deutsch und Englisch
    const translations = {
        de: {
            searchInputPlaceholder: '🔎 Suchen Sie nach einem Command?',
            categoryLabel: 'Kategorie:',
            permissionLabel: 'Berechtigung:',
            text1: 'NotedBot Ein Twitch Chat Bot der für Spaß und Hilfe sorgen soll.',
            text2: 'Funktion vom Bot:',
            p1: 'Notis ist die interne Währung von NotedBot.',
            moreInfoLinkText: 'Mehr zu Notis Commands',
            commandNotis: 'Notis',
            commandChannelManagement: 'Channel Management',
            channelManagementText: 'Füge NotedBot mit dem Befehl <code>!join</code> zu deinem Channel hinzu.',
            commandSteps: 'Erste Schritte',
            stepsText: 'Commands können mit dem Präfix <code>!</code> verwendet werden.',
            questionsText: 'Bei Fragen zum Bot melde dich gerne bei <a href="https://twitch.tv/wydios" target="_blank">Mir (Wydios)</a>'
        },
        en: {
            searchInputPlaceholder: '🔎 Search for a command?',
            categoryLabel: 'Category:',
            permissionLabel: 'Permission:',
            text1: 'NotedBot A Twitch chat bot that is intended to provide fun and help.',
            text2: 'Function of the bot:',
            p1: 'Notis is the internal currency of NotedBot.',
            moreInfoLinkText: 'More on Notis Commands',
            commandNotis: 'Notis',
            commandChannelManagement: 'Channel Management',
            channelManagementText: 'Add NotedBot to your channel with the command <code>!join</code>.',
            commandSteps: 'Getting Started',
            stepsText: 'Commands can be used with the prefix <code>!</code>.',
            questionsText: 'For questions about the bot, feel free to contact <a href="https://twitch.tv/wydios" target="_blank">Me (Wydios)</a>'
        }
    };

    // Funktion um die Sprache umzuschalten
    const switchLanguage = (language) => {
        searchInput.placeholder = translations[language].searchInputPlaceholder;
        categoryLabel.textContent = translations[language].categoryLabel;
        permissionLabel.textContent = translations[language].permissionLabel;
        text1.textContent = translations[language].text1;
        text2.textContent = translations[language].text2;
        p1.textContent = translations[language].p1;

        // Weitere Texte
        document.getElementById('command-notis').textContent = translations[language].commandNotis;
        document.getElementById('command-channel-management').textContent = translations[language].commandChannelManagement;
        document.getElementById('channel-management-text').innerHTML = translations[language].channelManagementText;
        document.getElementById('command-steps').textContent = translations[language].commandSteps;
        document.getElementById('steps-text').innerHTML = translations[language].stepsText;
        document.getElementById('questions-text').innerHTML = translations[language].questionsText;
        document.getElementById('more-info-link').textContent = translations[language].moreInfoLinkText;
    };

    // Überprüfe die URL-Parameter und stelle die Sprache entsprechend ein
    if (languageParam === 'de') {
        switchLanguage('de');
    } else {
        switchLanguage('en');
    }

    // Events für die Buttons
    deButton.addEventListener('click', () => {
        switchLanguage('de');
        window.history.pushState({}, '', '?language=de');
    });

    usButton.addEventListener('click', () => {
        switchLanguage('en');
        window.history.pushState({}, '', '?language=en');
    });
});
