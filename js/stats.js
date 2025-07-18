document.addEventListener("DOMContentLoaded", async () => {
  const statsDisplay = document.getElementById("statsDisplay");
  const topCommands = document.getElementById("topCommands");

  try {
    const res = await fetch("https://api.notedbot.de/v1/bot/stats");
    const json = await res.json();

    if (json.error) throw new Error("API Error");

    const data = json.data;

    const stats = [
      { label: "📡 Uptime", value: `${data.uptime} Stunden` },
      { label: "📺 Channels", value: data.channels },
      { label: "👤 Users", value: data.user },
      { label: "😴 AFK Nutzer", value: data.afk },
      { label: "⏰ Reminders", value: data.reminders },
      { label: "💬 Nachrichten", value: data.messages },
      { label: "⚙️ Ausgeführte Befehle", value: data.executeCommands }
    ];

    stats.forEach(stat => {
      const card = document.createElement("div");
      card.className = "feature-card";
      card.innerHTML = `<h3 class="feature-title">${stat.label}</h3><p class="feature-content">${stat.value}</p>`;
      statsDisplay.appendChild(card);
    });

    data.topCommands.forEach(cmd => {
      const div = document.createElement("div");
      div.className = "command-bubble";
      div.innerHTML = `
        <h3>/ ${cmd.command}</h3>
        <p>Verwendet: <strong>${cmd.count}</strong> mal</p>
      `;
      topCommands.appendChild(div);
    });

  } catch (err) {
    statsDisplay.innerHTML = "<p style='color: red;'>Fehler beim Laden der Stats 😵</p>";
    console.error("TypeError: Da ist was falsch lass uns das mal anschauen🤓", err);
  }
});
