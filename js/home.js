document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.querySelector(".chat-box");

  const messages = [
    "Wydios: und Welchen Neuen Bot gibst heute?",
    "DasHeiligeKlo: Also er soll NotedBot heißen",
    "NotedBot: <a href='img/peepoHappy.png' type='image/png'></a> 🩵 Thanks for adding me, you can see my commands here ➜ www.notedbot.de/commands • The default prefix is ' ! ' • Default language is ' de ' • if you want the Language English write !channel lang en And you want Block another Lanauge Write !channel lang off",
    "xNot_Lenny: Let's gooo NotedBot",
    "fossabot: Das wars o7"
  ];

  let i = 0;

  function addMessage() {
    if (i >= messages.length) return;

    const now = new Date();
    const time = now.toTimeString().slice(0, 5);

    const msg = document.createElement("div");
    msg.className = `chat-msg user${(i % 3) + 1}`;

    const [username, ...contentParts] = messages[i].split(":");
    const content = contentParts.join(":").trim();

    msg.innerHTML = `
      <span style="color: var(--text-muted); font-size: 0.8rem; font-weight: 500; min-width: 40px;">${time}</span>
      <span style="color: var(--accent-secondary); font-weight: 600;"> ${username}:</span>
      <span style="color: var(--text-primary);"> ${content}</span>
    `;

    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;

    i++;
    setTimeout(addMessage, 1000);
  }

  setTimeout(addMessage, 1000);
});
