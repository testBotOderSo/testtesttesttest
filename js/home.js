document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.querySelector(".chat-box");

  const header = document.createElement("div");
  header.className = "chat-header";
  header.innerHTML = `
    <div class="chat-header-indicator"></div>
    <div class="chat-header-title">Demo Chat</div>
  `;
  chatBox.appendChild(header);
  
  const chatBox = document.createElement("div");
  chatBox.className = "chat-box";
  chatDemo.appendChild(chatBox);

  const messages = [
    "Wydios: und Welchen Neuen Bot gibst heute?",
    "DasHeiligeKlo: Also er soll NotedBot heißen",
    "NotedBot: <img src='img/peepoHappy.png' alt='peepoHappy' class='chat-emote' /> 🩵 Thanks for adding me, you can see my commands here ➜ <a href='https://www.notedbot.de/commands' target='_blank' class='chat-link'>www.notedbot.de/commands</a> • The default prefix is ' ! ' • Default language is ' de ' • if you want the Language English write !channel lang en And you want Block another Lanauge Write !channel lang off",
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
    const content = contentParts.join(":" ).trim();
    const userColor = userColors[username] || "var(--text-primary)";

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
