document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.querySelector(".chat-box");

  const messages = [
    "DemoChat: Ey Chat wollt Hir was cooles sehen?",
    "DasHeiligeKlo: <img src='img/hmhm.gif' alt='hmhm' class='chat-emote' /> was denn?",
    "NotedBot: <img src='img/peepoHappy.png' alt='peepoHappy' class='chat-emote' /> 🩵 Thanks for adding me, you can see my commands here ➜ <a href='https://www.notedbot.de/commands' target='_blank' class='chat-link'>www.notedbot.de/commands</a>",
    "xNot_Lenny: <img src='img/pag.gif' alt='pag' class='chat-emote' /> NotedBot jetzt auch hier?",
    "ohne_flex: !afk Muss kurz weg ",
    'NotedBot: ➜ @ohne_flex ist jetzt Afk "Muss Kurz weg" ⏱️'
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
