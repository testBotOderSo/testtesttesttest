document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.querySelector(".chat-box");

  const messages = [
    "Wydios: und Welchen Neuen Bot gibst heute?",
    "DasHeiligeKlo: Also er soll NotedBot heißen",
    "NotedBot: <img src='img/peepoHappy.png' alt='peepoHappy' style='height: 1.2em; vertical-align: middle;' /> 🩵 Thanks for adding me, you can see my commands here ➜ <a href='https://www.notedbot.de/commands' target='_blank'>www.notedbot.de/commands</a> • The default prefix is ' ! ' • Default language is ' de ' • if you want the Language English write !channel lang en And you want Block another Lanauge Write !channel lang off",
    "xNot_Lenny: Let's gooo NotedBot",
    "fossabot: Das wars o7"
  ];

  const userColors = {
    "Wydios": "var(--accent-primary)",
    "DasHeiligeKlo": "var(--text-secondary)",
    "NotedBot": "var(--accent-primary)",
    "xNot_Lenny": "var(--accent-pink)",
    "fossabot": "var(--accent-primary)"
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
    const content = contentParts.join(":").trim();
    const userColor = userColors[username] || "var(--text-primary)";

    msg.innerHTML = `
      <span style="color: var(--text-muted); font-size: 0.9rem; font-weight: 600; min-width: 40px; display: inline-block;">${time}</span>
      <span style="color: ${userColor}; font-size: 0.9rem; font-weight: 600;"> ${username}:</span>
      <span style="color: var(--text-primary); font-size: 0.9rem;"> ${content}</span>
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
