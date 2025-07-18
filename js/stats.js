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
  const bottomLeft = document.getElementById("bottomLeft");    // unten links: User Infos
  const bottomRight = document.getElementById("bottomRight");  // unten rechts: Top Commands
  const requestStats = document.getElementById("requestStats"); // requests unten

  import("./twitch.js").then(({ getUserID }) => {
    const userID = getUserID();

    fetch("https://api.notedbot.de/v1/bot/stats")
      .then(res => res.json())
      .then(json => {
        if (json.error) throw new Error("API Error");
        const data = json.data;

        // Oben: Channels, Commands, Uptime - alle gleich groß mit Überschrift
        const createStatBlock = (title, value) => {
          const block = document.createElement("div");
          block.style.textAlign = "center";
          block.style.flex = "1";
          block.style.color = "var(--text-primary)";
          block.style.userSelect = "none";
          block.innerHTML = `
            <h2 style="font-size:1.8rem; margin-bottom: 0.2rem;">${title}</h2>
            <p style="font-size:2.5rem; font-weight: 700; margin: 0;">${value}</p>
          `;
          return block;
        };

        // Channels
        const channelsBlock = createStatBlock("Channels", data.channels);
        // Used Commands
        const commandsBlock = createStatBlock("Used Commands", data.executeCommands);
        // Uptime (wird live upgedatet)
        const uptimeBlock = createStatBlock("Uptime", "--:--:--");
        const uptimeUpdater = pingUptime(data.uptime);
        uptimeUpdater(uptimeBlock.querySelector("p"));

        topStats.style.display = "flex";
        topStats.style.gap = "2rem";
        topStats.appendChild(channelsBlock);
        topStats.appendChild(commandsBlock);
        topStats.appendChild(uptimeBlock);

        // Unten links: User Infos Tabelle mit --text-secondary
        bottomLeft.style.color = "var(--text-secondary)";
        bottomLeft.innerHTML = `
          <h3 style="margin-bottom:0.5rem; color: var(--text-primary); font-size:1.5rem;">User Infos</h3>
          <table style="width:100%; border-collapse: collapse; color: inherit;">
            <thead>
              <tr>
                <th style="text-align:left; border-bottom:1px solid #666; padding: 6px 8px;">Stat</th>
                <th style="text-align:left; border-bottom:1px solid #666; padding: 6px 8px;">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style="padding:6px 8px;">😴 AFK Nutzer</td><td style="padding:6px 8px;">${data.afk}</td></tr>
              <tr><td style="padding:6px 8px;">⏰ Reminders</td><td style="padding:6px 8px;">${data.reminders}</td></tr>
              <tr><td style="padding:6px 8px;">💬 Nachrichten</td><td style="padding:6px 8px;">${data.messages}</td></tr>
              <tr><td style="padding:6px 8px;">👤 Users</td><td style="padding:6px 8px;">${data.user}</td></tr>
            </tbody>
          </table>
        `;

        // Unten rechts: Top 5 Commands Tabelle mit --text-secondary
        bottomRight.style.color = "var(--text-secondary)";
        bottomRight.innerHTML = `
          <h3 style="margin-bottom:0.5rem; color: var(--text-primary); font-size:1.5rem;">Top 5 Commands</h3>
          <table style="width:100%; border-collapse: collapse; color: inherit;">
            <thead>
              <tr>
                <th style="text-align:left; border-bottom:1px solid #666; padding: 6px 8px;">Trigger</th>
                <th style="text-align:left; border-bottom:1px solid #666; padding: 6px 8px;">Usage</th>
              </tr>
            </thead>
            <tbody>
              ${data.topCommands.map(cmd => `
                <tr>
                  <td style="padding:6px 8px;">${cmd.command}</td>
                  <td style="padding:6px 8px;">${cmd.count}</td>
                </tr>`).join("")}
            </tbody>
          </table>
        `;

        // Requests Sektion mit dev check
        requestStats.innerHTML = `<h2 style="color: var(--accent-primary); margin-bottom:1rem;">Requests</h2>`;
        const isDev = data.devs.some(dev => dev.twitchid === userID);

        const grid = document.createElement("div");
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(200px, 1fr))";
        grid.style.gap = "1rem";

        data.request.forEach(req => {
          const card = document.createElement("div");
          card.style.border = "1px solid var(--border-primary)";
          card.style.padding = "1rem";
          card.style.borderRadius = "6px";
          card.style.backgroundColor = "var(--background-secondary)";
          card.innerHTML = `
            <h3 style="margin-top:0;">${req.type}</h3>
            <p><strong>Requests:</strong> ${req.count}</p>
            ${isDev && req.methods ? `<details><summary style="cursor:pointer; user-select:none;">Methoden</summary><pre style="white-space: pre-wrap; margin-top:0.5rem;">${JSON.stringify(req.methods, null, 2)}</pre></details>` : ""}
          `;
          grid.appendChild(card);
        });

        requestStats.appendChild(grid);

      })
      .catch(err => {
        topStats.innerHTML = "<p style='color: red;'>Fehler beim Laden der Stats 😵</p>";
        console.error("TypeError: Da ist was falsch lass uns das mal anschauen🤓", err);
      });
  });
});
