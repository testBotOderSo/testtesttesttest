import { getDisplayName, getStoredPrefix, getStoredLang, fetchBotSettings, logout, loginWithTwitch } from "./twitch.js";

// Joa Danke Leon

const clientID = "lqy023ndpqdrpuzpz0mqvcxek37uxg";

function renderUserDetails(userData) {
    const { username, stvid, ffzid, permissions, history_names } = userData;

    const getPerm = (permission) => {
        switch (permission?.toLowerCase()) {
            case "admin": return "<span style='color: #FF0000'>Admin</span>";
            case "dev": return "<span style='color: #00ffeaff'>Dev</span>";
            case "mod": return "<span style='color: #2bff00ff'>Mod</span>";
            case "vip": return "<span style='color: #ea00ffff'>Vip</span>";
            case "default":
            case undefined:
            case null: return "<span style='color: var(--text-primary)'>Default</span>";
            default: return `<span style='color: (--text-primary)'>${permission}</span>`;
        }
    };

    const formatDateTime = (isoString) => {
        if (!isoString) return "-";
        const date = new Date(isoString);
        return date.toLocaleString("de-DE", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    };

    let parsedHistory = translate("dashboard.user.noOldNames");
    try {
        const arr = JSON.parse(history_names);
        if (Array.isArray(arr) && arr.length > 0) {
            parsedHistory = `
                <table style="width:100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="text-align:left; border-bottom:1px solid #666;">Name</th>
                            <th style="text-align:left; border-bottom:1px solid #666;">Geändert am</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${arr.map(obj => `
                            <tr>
                                <td style="padding: 4px 8px; border-bottom: 1px solid #333;">${obj.name}</td>
                                <td style="padding: 4px 8px; border-bottom: 1px solid #333;">${formatDateTime(obj.changed_at)}</td>
                            </tr>`).join("")}
                    </tbody>
                </table>
            `;
        }
    } catch {
        parsedHistory = translate("dashboard.user.noOldNames");
    }

    return { getPerm: getPerm(permissions), historyTable: parsedHistory, username, stvid, ffzid };
};

document.addEventListener("DOMContentLoaded", async () => {
    await fetchBotSettings();

    const name = getDisplayName();
    const prefix = getStoredPrefix();
    const lang = getStoredLang();
    const userID = localStorage.getItem("user_id");

    await loadLanguage(lang);

    const welcomeEl = document.getElementById("welcome");
    const channelInfo = document.getElementById("channel-info");
    const prefixInput = document.getElementById("prefix-input");
    const langInput = document.getElementById("lang-input");
    const customCommandsInput = document.getElementById("custom-commands");
    const blockedCommandsInput = document.getElementById("blocked-commands");
    
    const startLogin = document.getElementById("login-btn-start");
    const botSettings = document.getElementById("bot-settings");
    const joinOnly = document.getElementById("join-only");

    if (!userID) {
        welcomeEl.textContent = "Hey User! Log in with Twitch to activate your NotedBot and unlock all features";
        botSettings.style.display = "none";
        joinOnly.style.display = "none";

        if (startLogin) {
            startLogin.style.display = "inline-block";
            startLogin.addEventListener("click", () => loginWithTwitch(clientID, "https://notedbot.de"));
        }

        return;
    }

    if (startLogin) startLogin.style.display = "none";

    try {
        const [channel, user] = await Promise.all([
            fetch(`https://api.notedbot.de/bot/channel?twitchID=${userID}`),
            fetch(`https://api.notedbot.de/bot/user?twitchID=${userID}`)
        ]);

        const [channelResult, userResult] = await Promise.all([
            channel.json(),
            user.json()
        ]);

        const channelData = channelResult?.data?.settings;
        const userData = userResult?.data?.user;

        const isInChannel = !!channelData;

        if (!channel.ok || !isInChannel) {
            welcomeEl.textContent = 'Your channel is botless 😢 Click "🤝 Bot Joinen" to invite NotedBot and unlock the magic!';
            channelInfo.textContent = "";
            botSettings.style.display = "none";
            joinOnly.style.display = "block";
            return;
        }

        joinOnly.style.display = "none";
        botSettings.style.display = "block";

        welcomeEl.innerHTML = `Channel: ${name} <small>(ID: ${userID})</small>`;

        const blockedList = channelResult.data.blocked
            .map(cmd => `${cmd.commandname}`)
            .join(", ") || "-";

        const customList = Array.isArray(channelResult.data.custom) && channelResult.data.custom.length > 0
            ?   `<table style="width:100%; border-collapse: collapse;">
                    <thead>
                        <tr><th style="text-align:left; border-bottom:1px solid #666;">Trigger</th><th style="text-align:left; border-bottom:1px solid #666;">Response</th></tr>
                    </thead>
                <tbody>` + channelResult.data.custom.map(cmd => `
                    <tr>
                        <td style="padding: 4px 8px; border-bottom: 1px solid #333;">${cmd.trigger}</td>
                        <td style="padding: 4px 8px; border-bottom: 1px solid #333;">${cmd.responseMessage}</td>
                    </tr>`).join("") +
                `</tbody></table>`
            : "-";

        const { getPerm: permText, historyTable, username, stvid, ffzid } = renderUserDetails(userData);

        let links = { stv: "-", ffz: "-" };
        if (stvid) {
            const stv = await fetch(`https://api.notedbot.de/short?url=https://7tv.app/users/${stvid}`);
            const stvData = await stv.json();
            links.stv = `<a href='${stvData.data.short}' target="_blank" rel="noopener noreferrer"><img src="https://7tv.app/favicon.svg" style="height: 40px; vertical-align: middle;"></a>`;
        }
        if (ffzid) {
            const ffz = await fetch(`https://api.notedbot.de/short?url=https://www.frankerfacez.com/channel/${username}`);
            const ffzData = await ffz.json();
            links.ffz = `<a href='${ffzData.data.short}' target="_blank" rel="noopener noreferrer"><img src="https://frankerfacez.com/static/images/cover/zreknarf.png" style="height: 32px; vertical-align: middle;"></a>`;
        }

        channelInfo.innerHTML = `
            ${translate("dashboard.channel.prefix")}: <b>${channelData.prefix || prefix}</b><br>
            ${translate("dashboard.channel.lang")}: 
            <b style="
                background: ${(channelData.lang || lang) === "de" 
                    ? 'linear-gradient(90deg, black, red, gold)'
                    : 'linear-gradient(90deg, red, white, blue)'
                };
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-weight: bold;
            ">${(channelData.lang || lang) === "de" ? "Deutsch" : "English"}</b><br>
            <br>
            ${translate("dashboard.channel.blockedCmds")}: <b>${blockedList}</b><br>
            ${translate("dashboard.channel.customCmds")}: <b>${customList}</b><br>
            <br>
            ${translate("dashboard.channel.joined")}: <b>${channelData.joined_at || "Nie ?"}</b><br>
            ${translate("dashboard.user.perms")}: ${permText}<br>
            ${translate("dashboard.channel.more")}: <b>${links.stv}, ${links.ffz}</b><br>
            ${translate("dashboard.user.oldNames")}: ${historyTable}
        `;

        prefixInput.value = channelData.prefix || "";
        langInput.value = channelData.lang || "";
        customCommandsInput.value = JSON.stringify(channelResult.data.custom || [], null, 2);
        blockedCommandsInput.value = (channelResult.data.blocked || []).map(c => c.commandname).join(", ");

        prefixInput.disabled = false;
        langInput.disabled = false;
        customCommandsInput.disabled = false;
        blockedCommandsInput.disabled = false;
    } catch (err) {
        console.error("Fehler beim Laden der Channel/User Daten", err);
        welcomeEl.textContent = "Fehler beim Laden der Daten.";
        botSettings.style.display = "none";
        joinOnly.style.display = "block";
    }
});

window.joinBot = async () => {
    const twitchID = localStorage.getItem("user_id");
    const username = localStorage.getItem("display_name");
    const accessToken = localStorage.getItem("twitch_token");

    if (!twitchID || !accessToken || !username) return alert(translate("dashboard.token.no"));

    const tokenCheck = await fetch("https://id.twitch.tv/oauth2/validate", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!tokenCheck.ok) {
        alert(translate("dashboard.token.expired"));
        return logout();
    };

    const res = await fetch("https://api.notedbot.de/bot/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ twitchID, username, prefix: "!", lang: "de", accessToken, clientID })
    });

    if (res.ok) {
        alert(translate("dashboard.join.success"));
        location.reload();
    } else {
        alert(translate("dashboard.join.isChat"));
    }
};

window.partBot = async () => {
    const confirmed = confirm(translate("dashboard.part.confirm"));
    if (!confirmed) return;

    const twitchID = localStorage.getItem("user_id");
    const accessToken = localStorage.getItem("twitch_token");
    if (!twitchID || !accessToken) return alert(translate("dashboard.token.no"));

    const res = await fetch("https://api.notedbot.de/bot/part", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ twitchID, accessToken })
    });

    if (res.ok) {
        alert(translate("dashboard.part.success"));
        location.reload();
    } else {
        alert(translate("dashboard.part.isNotChat"));
    }
};

async function updateSettings(data) {
    const twitchID = localStorage.getItem("user_id");
    const accessToken = localStorage.getItem("twitch_token");
    if (!twitchID || !accessToken) return alert(translate("dashboard.token.no"));

    const res = await fetch("https://api.notedbot.de/bot/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ twitchID, accessToken, ...data })
    });

    const response = await res.json();

    if (res.ok && response && !response.error) {
        alert(response.data);
        location.reload();
    } else {
        alert(translate("dashboard.settings.failed"));
    }
};

window.updatePrefix = async () => {
    const newPrefix = document.getElementById("prefix-input").value.trim();
    if (!validatePrefix(newPrefix)) return;
    await updateSettings({ prefix: newPrefix });
};

window.updateLang = async () => {
    const newLang = document.getElementById("lang-input").value.trim();
    if (!validateLang(newLang)) return;
    await updateSettings({ lang: newLang });
};

window.updateCustomCommands = async () => {
    let customCommandsRaw = document.getElementById("custom-commands").value.trim();
    if (!customCommandsRaw) {
        alert(`${translate("dashboard.settings.customCommand")}\n` +
            `[{"trigger":"hello","responseMessage":"Hallo {1}!"},{"trigger":"bye","responseMessage":"Tschüss {1}!"}]`);
        return;
    }

    let customCommandsParsed;
    try {
        customCommandsParsed = JSON.parse(customCommandsRaw);
        if (!Array.isArray(customCommandsParsed)) throw new Error("Kein Array");
    } catch {
        alert(`${translate("dashboard.settings.customCommands")}\n` +
            `[{"trigger":"hello","responseMessage":"Hallo {username}!"},{"trigger":"bye","responseMessage":"Tschüss {username}!"}]`);
        return;
    }

    await updateSettings({ custom: customCommandsParsed });
};

window.updateBlockedCommands = async () => {
    let blockedRaw = document.getElementById("blocked-commands").value.trim();
    if (!blockedRaw) {
        alert(`${translate("dashboard.settings.blockedCommand")}\n` +
            `test, spam, 7tv`);
        return;
    }

    const blockedArr = blockedRaw.split(",").map(s => s.trim()).filter(s => s.length > 0);
    await updateSettings({ blocked: blockedArr });
};

window.logout = logout;

function validatePrefix(prefix) {
    const allowedPrefixes = ["!", "?", "&", "$", "§", "%", "+", "-", "#", "=", "<", ">"];
    if (!allowedPrefixes.includes(prefix)) {
        alert(`${translate("dashboard.settings.prefixs")} ${allowedPrefixes.join(" ")}`);
        return false;
    }
    return true;
};

function validateLang(lang) {
    if (!["de", "en"].includes(lang.toLowerCase())) {
        alert(translate("dashboard.settings.lang"));
        return false;
    }
    return true;
};