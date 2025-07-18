export async function loginWithTwitch(clientID, redirectUri) {
    const scope = [
        "user:read:email",
        "moderation:read",
        "chat:read",
        "chat:edit",
        "channel:manage:moderators"
    ].join(" ");

    const url = `https://id.twitch.tv/oauth2/authorize?client_id=${clientID}&redirect_uri=${redirectUri}&response_type=token&scope=${encodeURIComponent(scope)}`;
    window.location.href = url;
};

export async function handleRedirect(clientID) {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");

    if (!accessToken) return false;

    localStorage.setItem("twitch_token", accessToken);

    const userRes = await fetch("https://api.twitch.tv/helix/users", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Client-ID": clientID
        }
    });

    const userData = await userRes.json();
    const user = userData.data[0];

    localStorage.setItem("user_id", user.id);
    localStorage.setItem("display_name", user.display_name);

    return true;
};

export async function fetchBotSettings() {
    const userID = localStorage.getItem("user_id");
    if (!userID) return null;

    try {
        const res = await fetch(`https://api.notedbot.de/v1/bot/channel?userID=${userID}`);
        if (!res.ok) {
            console.warn("Fetch fehlgeschlagen, Status:", res.status);
            localStorage.setItem("prefix", "!");
            localStorage.setItem("lang", "en");
            return null;
        };

        const data = await res.json();
        if (!data.data || !data.data.settings) {
            console.warn("Kein Bot-Channel gefunden, Fallback Werte gesetzt");
            localStorage.setItem("prefix", "!");
            localStorage.setItem("lang", "en");
            return null;
        };

        if (data.data.settings.prefix) {
            localStorage.setItem("prefix", data.data.settings.prefix);
        } else {
            localStorage.setItem("prefix", "!");
        }

        if (data.data.settings.lang) {
            localStorage.setItem("lang", data.data.settings.lang);
        } else {
            localStorage.setItem("lang", "en");
        }

        return data;
    } catch (error) {
        console.error("Fehler beim Laden der Bot-Settings:", error);
        localStorage.setItem("prefix", "!");
        localStorage.setItem("lang", "en");
        return null;
    }
}

export function getStoredPrefix() {
    return localStorage.getItem("prefix") || "!";
};

export function getStoredLang() {
    return localStorage.getItem("lang") || "en";
};

export function getDisplayName() {
    return localStorage.getItem("display_name") || "Unknown";
};

export function getUserID() {
    return localStorage.getItem("user_id") || "798723114";
};

export function isLoggedIn() {
    return !!localStorage.getItem("twitch_token");
};

export function logout() {
    localStorage.clear();
    window.location.href = "/";
};

document.addEventListener("DOMContentLoaded", async () => {
    const clientID = "lqy023ndpqdrpuzpz0mqvcxek37uxg";
    const redirect = await handleRedirect(clientID);
    if (redirect) {
        window.location.href = "/dashboard";
    }
});

async function updateLoginButton() {
    const userID = localStorage.getItem("user_id");
    const loginBtn = document.getElementById("login-btn");
    if (!userID || !loginBtn) return;

    try {
        const res = await fetch(`https://api.notedbot.de/v1/bot/user?userID=${userID}`);
        const { data } = await res.json();

        if (!data?.pfp || !data?.user?.username) throw new Error("Unvollständige User-Daten");

        loginBtn.innerHTML = `
            <a href="https://notedbot.de/dashboard" class="twitch"><img src="${data.pfp}" alt="Profilbild" style="width:28px; height:28px; border-radius:50%; vertical-align:middle; margin-right:8px;" />
            <span>${data.user.username}</span>
        `;
        
        loginBtn.style.cursor = "default";
    } catch (e) {
        console.error("updateLoginButton | Fehler beim Laden des Profilbilds ", e);
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    await updateLoginButton();
});
