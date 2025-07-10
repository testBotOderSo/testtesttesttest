document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.querySelector(".chat-box");

  const messages = [
    "Wydios: und Welchen Neuen Bot gibst heute?",
    "DasHeiligeKlo: Also er soll NotedBot heißen",
    "NotedBot: peepoHappy 🩵 Thanks for adding me, you can see my commands here ➜ www.notedbot.de/commands • The default prefix is ' ! ' • Default language is ' de ' • if you want the Language English write !channel lang en And you want Block another Lanauge Write !channel lang off",
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
    msg.textContent = `${time} ${messages[i]}`;

    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;

    i++;
    setTimeout(addMessage, 2000);
  }

  setTimeout(addMessage, 1000);
});
