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
  const topStats = document.getElementById("topStats");
  const bottomLeft = document.getElementById("bottomLeft");
  const bottomRight = document.getElementById("bottomRight");
  const requestStats = document.getElementById("requestStats");
  const introText = document.getElementById("intro-text");
  introText.textContent = "Live Übersicht über den Bot – Kanäle, Befehle, Uptime & API-Auslastung.";

  import("./twitch.js").then(({ getUserID }) => {
    const userID = getUserID();

    fetch("https://api.notedbot.de/v1/bot/stats")
      .then(res => res.json())
      .then(json => {
        if (json.error) throw new Error("API Error");
        const data = json.data;

        const createStatBlock = (title, value) => {
          const block = document.createElement("div");
          block.style.textAlign = "center";
          block.style.flex = "1";
          block.style.color = "var(--text-primary)";
          block.style.userSelect = "text";
          block.innerHTML = `
            <h2 style="font-size:1.8rem; margin-bottom: 0.2rem;">${title}</h2>
            <p style="font-size:2.5rem; font-weight: 700; margin: 0;">${value}</p>
          `;
          return block;
        };

        const channelsBlock = createStatBlock("Channels", data.channels);
        const commandsBlock = createStatBlock("Used Commands", data.executeCommands);
        const uptimeBlock = createStatBlock("Uptime", "--:--:--");
        const uptimeUpdater = pingUptime(data.uptime);
        uptimeUpdater(uptimeBlock.querySelector("p"));

        topStats.append(channelsBlock, commandsBlock, uptimeBlock);

         const createTableSection = (title, rows) => `
  <h3 style="margin-bottom:0.5rem; color: var(--text-primary); font-size:1.5rem;">${title}</h3>
  <table style="width:100%; border-collapse: collapse; color: var(--text-primary);">
    <thead>
      <tr>
        <th style="width: 60%; text-align:left; border-bottom:1px solid #666; padding: 6px 8px;"></th>
        <th style="text-align:left; border-bottom:1px solid #666; padding: 6px 8px;"></th>
      </tr>
    </thead>
    <tbody>
      ${rows.map(([label, value]) => `
        <tr>
          <td style="padding:6px 8px; border-bottom: 1px solid #444;">${label}</td>
          <td style="padding:6px 8px; border-bottom: 1px solid #444;">${value}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>
`;

        const userRows = [
            ["😴 AFK Users", data.afk],
            ["⏰ Aktive Reminders", data.reminders],
            ["💬 Logged Messages", data.messages],
            ["👤 Users", data.user],
        ];
        bottomLeft.innerHTML = createTableSection("User Infos", userRows);

        const topCommandRows = data.topCommands.map(cmd => [cmd.command, cmd.count]);
        bottomRight.innerHTML = createTableSection("Top 5 Commands", topCommandRows);

        const isDev = data.devs.some(dev => dev.twitchid === userID);

        requestStats.innerHTML = "";
        const grid = document.createElement("div");
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(200px, 1fr))";
        grid.style.gap = "1rem";

        data.request.forEach(req => {
            const card = document.createElement("div");
            card.style.border = "1px solid var(--accent-primary)";
            card.style.padding = "1rem";
            card.style.borderRadius = "8px";
            card.style.backgroundColor = "var(--bg-glass)";
            card.style.color = "var(--text-primary)";
            card.style.boxShadow = "var(--border-primary)";

            card.innerHTML = `
                <h3 style="margin:0 0 0.5rem 0;">${req.type}</h3>
                <p style="margin:0 0 0.5rem 0;"><strong>Requests:</strong> ${req.count}</p>
                ${isDev && req.methods ? `
                    <details style="margin-top:0.5rem;">
                        <summary style="cursor:pointer; font-weight:500; opacity:0.8;">Methoden</summary>
                        <pre style="padding:0.5rem; border-radius:4px; white-space:pre-wrap; font-size:0.9rem; margin-top:0.5rem;">
                    ${Object.entries(req.methods).map(([k, v]) => `${k}: ${v}`).join("\n")}
                    </pre>
                </details>` : ""}
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
