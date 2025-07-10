document.addEventListener("DOMContentLoaded", () => {
  const features = [
    {
      title: "Notis",
      text: "Automatisierte Nachrichten, Begrüßungen und mehr."
    },
    {
      title: "Channel Management",
      text: "Steuere Sprache, Befehle, Mod-Rechte direkt im Chat."
    },
    {
      title: "Sonstiges",
      text: "Custom Commands, Integrationen und vieles mehr."
    }
  ];

  features.forEach((feature, i) => {
    const container = document.getElementById(`feature-${i+1}`);
    if(container){
      container.innerHTML = `
        <h3 style="color: var(--accent-primary);">${feature.title}</h3>
        <p style="color: var(--text-secondary);">${feature.text}</p>
      `;
    }
  });

  const gettingStarted = document.getElementById("getting-started");
  if(gettingStarted){
    gettingStarted.innerHTML = `
      <h2 style="color: var(--text-primary); margin-bottom: 1rem;">Erste Schritte</h2>
      <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto;">
        Füge NotedBot zu deinem Kanal hinzu, nutze <code>!commands</code> und richte deine Channel-Einstellungen direkt über den Chat oder unsere Web-API ein.
      </p>
    `;
  }
  
  const chatBox = document.querySelector(".chat-box");

  const messages = [
    "DemoChat: Ey Chat wollt Hir was cooles sehen?",
    "DasHeiligeKlo: <img src='img/hmhm.gif' alt='hmhm' class='chat-emote' /> was denn?",
    "NotedBot: <img src='img/peepoHappy.png' alt='peepoHappy' class='chat-emote' /> 🩵 Thanks for adding me, you can see my commands here ➜ <a href='https://www.notedbot.de/commands' target='_blank' class='chat-link'>www.notedbot.de/commands</a>",
    "xNot_Lenny: <img src='img/pag.png' alt='pag' class='chat-emote' /> NotedBot jetzt auch hier?",
    "ohne_flex: !user Wydios",
    "NotedBot: Wydios • id: 798723114 • Affiliate • 7tv Color: Winter Snowfall • Follower: 992 • Badge: Minecraft 15th Anniversary Celebration • Bio: was gibt's? • Created on: 06/01/2022 | <img src='img/PartyParrot.gif' alt='PartyParrot' class='chat-emote' />"
  ];

  const userColors = {
    "DemoChat": "#ff4d4d",  
    "DasHeiligeKlo": "#aaa",  
    "NotedBot": "#00C3FF",  
    "xNot_Lenny": "#ff4d4d", 
    "ohne_flex": "#FFD700"
  };

  let i = 0;

  function addMessage() {
    if (i >= messages.length) return;

    const now = new Date();
    const time = now.toTimeString().slice(0, 5);

    const msg = document.createElement("div");
    msg.className = `chat-msg`;

    const [usernameRaw, ...contentParts] = messages[i].split(":");
    const username = usernameRaw.trim();
    const content = contentParts.join(":" ).trim();
    const userColor = userColors[username] || "#ffffff";

    msg.innerHTML = `
      <span class="chat-time">${time}</span>
      <span class="chat-user" style="color: ${userColor};"> ${username}:</span>
      <span class="chat-text"> ${content}</span>
    `;

    chatBox.appendChild(msg);
    chatBox.scrollTo({
      top: chatBox.scrollHeight,
      behavior: "smooth"
    });

    i++;
    setTimeout(addMessage, 1500);
  }

  setTimeout(addMessage, 1000);
});
