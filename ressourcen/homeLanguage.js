document.addEventListener('DOMContentLoaded', () => {
    const deButton = document.getElementById('de-button');
    const usButton = document.getElementById('us-button');
    const text1 = document.getElementById('text1');
    const text2 = document.getElementById('text2');
    const p1 = document.getElementById('p1');
    const p2 = document.getElementById('p2');
    const a1 = document.getElementById('a1');
    const text3 = document.getElementById('text3');
    const p3 = document.getElementById('p3');
    const text4 = document.getElementById('text4');
    const p4 = document.getElementById('p4');
    const p5 = document.getElementById('p5');
    const p6 = document.getElementById('p6');
    const p7 = document.getElementById('p7');
    const p8 = document.getElementById('p8');
    const p9 = document.getElementById('p9');
    const p10 = document.getElementById('p10');

    const switchToGerman = () => {
        text1.textContent = 'NotedBot Ein Twitch Chat Bot der für Spaß und Hilfe sorgen soll.';
        text2.textContent = 'Funktion vom Bot:';
        p1.textContent = 'Notis ist die interne Währung von NotedBot.';
        p2.textContent = 'Verdiene dir Notis durch verschiedene Aktivitäten und verwende sie, um an die Spitze der Rangliste zu gelangen!';
        a1.textContent = 'Mehr zu Notis Commands';
        text3.textContent = 'Channel Management';
        p3.innerHTML = 'Füge NotedBot mit dem Befehl <code>!join</code> zu deinem Channel hinzu.';
        text4.innerHTM  = 'Erste Schritte';
        p4.innerHTML = 'Der Bot benötigt keine Moderatorenrechte, aber es wird empfohlen, sie zu vergeben, um den vollen Funktionsumfang nutzen zu können.';
        p5.innerHTML = 'Commands können mit dem Präfix <code>!</code> verwendet werden.';
        p6.innerHTML = '<p>Das Präfix kann pro Kanal mit dem Befehl <code>!prefix</code> geändert werden.<br/>';
        p7.innerHTML = 'Bei Fragen zum Bot melde dich gerne bei <a href="https://twitch.tv/wydios" target="_blank">Mir (Wydios)</a>';
        p8.innerHTML = 'Die/Der Seite/Bot würde mit 🩵 von ';
        p9.innerHTML = 'entwickelt';
        p10.innerHTML = 'Diese Seite und der Bot steht in keiner rechtlichen Verbindung zu Twitch Interactive (Braucht man das eigentlich zu sagen?)';
    }

    const switchToEnglish = () => {
        text1.textContent = 'NotedBot A Twitch chat bot that is intended to provide fun and help.';
        text2.textContent = 'Function of the bot:';
        p1.textContent = 'Notis is the internal currency of NotedBot.';
        p2.textContent = 'Earn Notis through various activities and use them to get to the top of the leaderboard!';
        a1.textContent = 'More on Notis Commands';
        text3.textContent = 'Channel Management';
        p3.innerHTML = 'Add NotedBot to your channel with the command <code>!join</code>.';
        text4.innerHTML = 'Getting Started';
        p4.innerHTML = 'The bot does not require moderator rights, but it is recommended to grant them in order to use the full functionality.';
        p5.innerHTML = 'Commands can be used with the prefix <code>!</code>.';
        p6.innerHTML = '<p>The prefix can be changed per channel with the command <code>!prefix</code>.<br/>';
        p7.innerHTML = 'If you have any questions about the bot, please contact <a href="https://twitch.tv/wydios" target="_blank">Mir (Wydios)</a>';
        p8.innerHTML = 'The site/bot would be marked with 🩵 by ';
        p9.innerHTML = 'developed';
        p10.innerHTML = 'This site and the bot have no legal connection to Twitch Interactive (Do we actually need to say that?)';
    }

    deButton.addEventListener('click', switchToGerman);
    usButton.addEventListener('click', switchToEnglish);
    
    switchToGerman(); 
});
