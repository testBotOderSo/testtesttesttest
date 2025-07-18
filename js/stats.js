function pingUptime(seconds) {
  const startTime = Date.now() - seconds * 1000;

  function formatUptime(elapsed) {
    const totalSeconds = Math.floor(elapsed / 1000);

    const weeks = Math.floor(totalSeconds / 604800);
    const days = Math.floor((totalSeconds % 604800) / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");

    let uptimeString = "";
    if (weeks > 0) uptimeString += `${weeks}w `;
    if (days > 0) uptimeString += `${days}d `;
    uptimeString += `${hours}:${minutes}:${secs}`;

    return uptimeString.trim();
  }

  return function updateDisplay(element) {
    function tick() {
      const now = Date.now();
      const elapsed = now - startTime;
      element.textContent = formatUptime(elapsed);
    }
    tick();
    setInterval(tick, 1000);
  };
}

document.addEventListener("DOMContentLoaded", async () => {
  const statsDisplay = document.getElementById("statsDisplay");
  const topCommands = document.getElementById("topCommands");
  const requestStats = document.getElementById("requestStats");

  import("./twitch.js").then(({ getUserID }) => {
    const userID = getUserID();

    fetch("https://api.notedbot.de/v1/bot/stats")
      .then(res => res.json())
      .then(json => {
        if (json.error) throw new Error("API Error");
        const data = json.data;

        const stats = [
          { label: "Uptime", key: "uptime" },
          { label: "Channels", value: data.channels },
          { label: "Users", value: data.user },
          { label: "AFK Nutzer", value: data.afk },
          { label: "Reminders", value: data.reminders },
          { label: "Nachrichten", value: data.messages },
          { label: "Ausgeführte Befehle", value: data.executeCommands }
        ];

        stats.forEach(stat => {
          const card = document.createElement("div");
          card.className = "feature-card";
          card.innerHTML = `<h3 class="feature-title">${stat.label}</h3><p class="feature-content">${stat.value ?? ""}</p>`;
          statsDisplay.appendChild(card);

          if (stat.key === "uptime") {
            const updateFn = pingUptime(data.uptime);
            const p = card.querySelector(".feature-content");
            updateFn(p);
          }
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

        const isDev = data.devs.some(dev => dev.twitchid === userID);

        data.request.forEach(req => {
          const div = document.createElement("div");
          div.className = "command-bubble";
          div.innerHTML = `
            <h3>${req.type}</h3>
            <p>Requests: <strong>${req.count}</strong></p>
            ${isDev && req.methods ? `<details><summary>Methoden</summary><pre>${JSON.stringify(req.methods, null, 2)}</pre></details>` : ""}
          `;
          requestStats.appendChild(div);
        });
      })
      .catch(err => {
        statsDisplay.innerHTML = "<p style='color: red;'>Fehler beim Laden der Stats 😵</p>";
        console.error("TypeError: Da ist was falsch lass uns das mal anschauen🤓", err);
      });
  });
});
