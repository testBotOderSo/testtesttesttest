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

  const introText = document.querySelector(".intro p");
  if (introText) introText.textContent = "Alle Daten vom Bot 🧠";

  import("./twitch.js").then(({ getUserID }) => {
    const userID = getUserID();

    fetch("https://api.notedbot.de/v1/bot/stats")
      .then(res => res.json())
      .then(json => {
        if (json.error) throw new Error("API Error");
        const data = json.data;

        // Top-Level Stats
        const topRow = document.createElement("div");
        topRow.className = "feature-toprow";
        topRow.style = "display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;";

        const uptimeEl = document.createElement("div");
        uptimeEl.innerHTML = `<h3>Uptime</h3><p class="feature-content"></p>`;
        const updateFn = pingUptime(data.uptime);
        updateFn(uptimeEl.querySelector(".feature-content"));

        const channelsEl = document.createElement("div");
        channelsEl.innerHTML = `<h3>Channels</h3><p>${data.channels}</p>`;

        const commandsEl = document.createElement("div");
        commandsEl.innerHTML = `<h3>Commands</h3><p>${data.executeCommands}</p>`;

        topRow.append(uptimeEl, channelsEl, commandsEl);
        statsDisplay.appendChild(topRow);

        // 🏆 Top Commands
        const topCmdHeader = document.createElement("h2");
        topCmdHeader.textContent = "Top 5 Commands";
        topCmdHeader.style = "margin-top: 3rem; color: var(--accent-primary); text-align: center;";
        statsDisplay.appendChild(topCmdHeader);

        const topLine = document.createElement("div");
        topLine.style = "display: flex; justify-content: center; flex-wrap: wrap; gap: 1rem; font-size: 1.1rem;";
        data.topCommands.forEach(cmd => {
          const span = document.createElement("span");
          span.innerHTML = `<strong>${cmd.command}</strong>: ${cmd.count}`;
          topLine.appendChild(span);
        });
        statsDisplay.appendChild(topLine);

        // 📊 Weitere Stats
        const extraStats = [
          { label: "Nachrichten", value: data.messages },
          { label: "Aktive Reminders", value: data.reminders },
          { label: "Aktive AFKs", value: data.afk },
          { label: "Users", value: data.user }
        ];

        const extraRow = document.createElement("div");
        extraRow.style = "margin-top: 3rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;";

        extraStats.forEach(stat => {
          const card = document.createElement("div");
          card.className = "feature-card";
          card.innerHTML = `<h3>${stat.label}</h3><p>${stat.value}</p>`;
          extraRow.appendChild(card);
        });

        statsDisplay.appendChild(extraRow);

        // 🔍 Requests
        const isDev = data.devs.some(dev => dev.twitchid === userID);

        const reqHeader = document.createElement("h2");
        reqHeader.textContent = "Requests";
        reqHeader.style = "margin-top: 4rem; text-align: center; color: var(--accent-primary);";
        requestStats.appendChild(reqHeader);

        const reqGrid = document.createElement("div");
        reqGrid.style = "margin-top: 2rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;";

        data.request.forEach(req => {
          const div = document.createElement("div");
          div.className = "command-bubble";
          div.innerHTML = `
            <h3>${req.type}</h3>
            <p>Requests: <strong>${req.count}</strong></p>
            ${isDev && req.methods ? `<details><summary>Methoden</summary><pre>${JSON.stringify(req.methods, null, 2)}</pre></details>` : ""}
          `;
          reqGrid.appendChild(div);
        });

        requestStats.appendChild(reqGrid);
      })
      .catch(err => {
        statsDisplay.innerHTML = "<p style='color: red;'>Fehler beim Laden der Stats 😵</p>";
        console.error("TypeError: Da ist was falsch lass uns das mal anschauen🤓", err);
      });
  });
});

