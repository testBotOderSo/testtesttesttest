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
  const topStats = document.getElementById("topStats");        // oben: Channels, Commands, Uptime
  const bottomLeft = document.getElementById("bottomLeft");    // unten links: AFK etc.
  const bottomRight = document.getElementById("bottomRight");  // unten rechts: Top Commands Tabelle

  import("./twitch.js").then(({ getUserID }) => {
    const userID = getUserID();

    fetch("https://api.notedbot.de/v1/bot/stats")
      .then(res => res.json())
      .then(json => {
        if (json.error) throw new Error("API Error");
        const data = json.data;

        // Oben: Channels, Commands, Uptime
        const uptimeUpdater = pingUptime(data.uptime);
        const uptimeEl = document.createElement("div");
        uptimeEl.className = "stat-large";
        uptimeEl.innerHTML = `<h2>Uptime</h2><p class="stat-value">--:--:--</p>`;
        uptimeUpdater(uptimeEl.querySelector(".stat-value"));

        const channelsEl = document.createElement("div");
        channelsEl.className = "stat-large";
        channelsEl.innerHTML = `<h2>Channels</h2><p class="stat-value">${data.channels}</p>`;

        const commandsEl = document.createElement("div");
        commandsEl.className = "stat-large";
        commandsEl.innerHTML = `<h2>Used Commands</h2><p class="stat-value">${data.executeCommands}</p>`;

        topStats.appendChild(channelsEl);
        topStats.appendChild(commandsEl);
        topStats.appendChild(uptimeEl);

        // Unten links: Tabelle mit AFK, Reminders, Messages, Users (alle in --text-secondary)
        const leftTableHtml = `
          <table style="width:100%; border-collapse: collapse; color: var(--text-secondary);">
            <thead>
              <tr>
                <th style="text-align:left; border-bottom:1px solid #666;">Stat</th>
                <th style="text-align:left; border-bottom:1px solid #666;">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>😴 AFK Nutzer</td><td>${data.afk}</td></tr>
              <tr><td>⏰ Reminders</td><td>${data.reminders}</td></tr>
              <tr><td>💬 Nachrichten</td><td>${data.messages}</td></tr>
              <tr><td>👤 Users</td><td>${data.user}</td></tr>
            </tbody>
          </table>
        `;
        bottomLeft.innerHTML = leftTableHtml;

        // Unten rechts: Top 5 Commands als Tabelle mit --text-secondary auch
        let tableHtml = `<table style="width:100%; border-collapse: collapse; color: var(--text-secondary);">
          <thead>
            <tr>
              <th style="text-align:left; border-bottom:1px solid #666;">Trigger</th>
              <th style="text-align:left; border-bottom:1px solid #666;">Usage</th>
            </tr>
          </thead>
          <tbody>`;

        data.topCommands.forEach(cmd => {
          tableHtml += `
            <tr>
              <td style="padding:4px 8px; border-bottom:1px solid #333;">${cmd.command}</td>
              <td style="padding:4px 8px; border-bottom:1px solid #333;">${cmd.count}</td>
            </tr>
          `;
        });

        tableHtml += "</tbody></table>";
        bottomRight.innerHTML = tableHtml;

      })
      .catch(err => {
        topStats.innerHTML = "<p style='color: red;'>Fehler beim Laden der Stats 😵</p>";
        console.error("TypeError: Da ist was falsch lass uns das mal anschauen🤓", err);
      });
  });
});

