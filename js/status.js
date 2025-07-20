import { getUserID } from "./twitch.js";

let uptimeStarted = false;
let uptimeUpdater = null;
let uptimeElement = null;

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
};

async function loadStats() {
    const topStats = document.getElementById("topStats");
    const bottomLeft = document.getElementById("bottomLeft");
    const bottomMiddle = document.getElementById("bottomMiddle");
    const bottomRight = document.getElementById("bottomRight");
    const requestStats = document.getElementById("requestStats");

    const userID = getUserID();

    try {
        const res = await fetch("https://api.notedbot.de/v1/bot/stats").then((response) => response.json());
        const data = res.data;
        if (!data) {
            topStats.innerHTML = "<p style='color: red;'>Fehler beim Laden des Status</p>";
            return;
        }

        topStats.innerHTML = "";
        bottomLeft.innerHTML = "";
        bottomMiddle.innerHTML = "";
        bottomRight.innerHTML = "";
        requestStats.innerHTML = "";

        topStats.style.display = "flex";
        topStats.style.flexWrap = "wrap";
        topStats.style.gap = "1rem";
        topStats.style.justifyContent = "center";

        const createStatBlock = (title, value) => {
            const block = document.createElement("div");
            block.style.textAlign = "center";
            block.style.flex = "1 1 180px";
            block.style.color = "var(--text-primary)";
            block.style.userSelect = "text";
            block.style.background = "none";
            block.style.borderRadius = "12px";
            block.style.padding = "1rem";
            block.style.boxShadow = "var(--border-primary)";
            block.innerHTML = `
                <h2 style="font-size:1.3rem; margin-bottom: 0.3rem;">${title}</h2>
                <p style="font-size:2rem; font-weight: 700; margin: 0;">${value}</p>
            `;
            return block;
        };

        const channelsBlock = createStatBlock("Channels", data.channels);
        const commandsBlock = createStatBlock("Used Commands", data.executeCommands);
        const allCommandsBlock = createStatBlock("All Commands", data.allCommands);
        const uptimeBlock = createStatBlock("Uptime", "--:--:--");

        topStats.append(channelsBlock, commandsBlock, allCommandsBlock, uptimeBlock);

        if (!uptimeStarted) {
            uptimeElement = uptimeBlock.querySelector("p");
            uptimeUpdater = pingUptime(data.uptime);
            uptimeUpdater(uptimeElement);
            uptimeStarted = true;
        } else if (uptimeElement) {
            uptimeBlock.querySelector("p").replaceWith(uptimeElement);
        }

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
                        </tr>`).join("")}
                </tbody>
            </table>
        `;

        const userRows = [
            ["😴 AFK Users", data.afk],
            ["⏰ Aktive Reminders", data.reminders],
            ["💬 Logged Messages", data.messages],
            ["👥 Users", data.user],
        ];
        bottomLeft.innerHTML = createTableSection("User Infos", userRows);

        const notis = data.notis;
        const notisRows = [
            ["🏦 Total Notis", notis.total_notis],
            ["🎁 Notis give/get", `${notis.total_give} / ${notis.total_get}`],
            ["🏆 Gamble Wins/Loss", `${notis.total_gamble_win} / ${notis.total_gamble_lost}`],
            ["🎰 Gamble Wins/Losses (Noti Count)", `${notis.total_gamble_win_notis} / ${notis.total_gamble_lost_notis}`],
            ["📦 Crates Found", notis.total_kisten],
        ];
        bottomMiddle.innerHTML += createTableSection("Notis Stats", notisRows);

        const medalEmojis = ["🥇", "🥈", "🥉"];
        const topCommandRows = data.topCommands.map((cmd, i) => {
            const label = i < 3 ? `${medalEmojis[i]} ${cmd.command}` : cmd.command;
            return [label, cmd.count];
        });
        bottomRight.innerHTML = createTableSection("Top 5 Commands", topCommandRows);

        const isDev = data.devs.some(dev => dev.twitchid === userID);
        const grid = document.createElement("div");

        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(200px, 1fr))";
        grid.style.gap = "1rem";

        data.request.forEach(req => {
            const card = document.createElement("div");
            card.style.border = "1px solid var(--accent-primary)";
            card.style.padding = "1rem";
            card.style.borderRadius = "8px";
            card.style.backgroundColor = "none";
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

    } catch (err) {
        topStats.innerHTML = "<p style='color: red;'>Fehler beim Laden des Status</p>";
        console.error("Status Fehler", err);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    loadStats();
    setInterval(loadStats, 5000);
});
