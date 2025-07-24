import { getStoredPrefix, getStoredLang } from "./twitch.js";

document.addEventListener("DOMContentLoaded", async () => {
    
    const Prefix = getStoredPrefix();
    const Lang = getStoredLang();
    
    await loadLanguage(Lang);
    
    const features = [
        {
            title: "⛏️ Notis",
            content: translate("home.features.notis")
        },
        {
            title: "🛠️ Channel Management",
            content: translate("home.features.management").replace(/!/g, Prefix)
        },
        {
            title: "⚙️ Technic",
            content: translate("home.features.technic")
        },
        {
            title: "🌐 Open Source",
            content: translate("home.features.openSource")
        },
        {
            title: "🗣️ Multi Lang",
            content: translate("home.features.lang").replace(/!/g, Prefix)
        }
    ];

    features.forEach((feature, i) => {
        const container = document.getElementById(`feature-${i+1}`);
        if (container) {
            container.classList.add("feature-card");
            container.innerHTML = `
                <h3 class="feature-title">${feature.title}</h3>
                <p class="feature-content">${feature.content}</p>
            `;    
        }
    });
  
    const chatBox = document.querySelector(".chat-box");

    const messages = [
        `Wydios: <img src='img/demo/cinema.png' alt='cinema' class='chat-emote' /> ${translate("home.message.wydios")}`,
        `DasHeiligeKlo: <img src='img/demo/hmhm.gif' alt='hmhm' class='chat-emote' /> ${translate("home.message.klo")}`,
        "xNot_Lenny: <img src='img/demo/pauseChamp.png' alt='pauseChamp' class='chat-emote' /> ✋ ?",
        "LetsZoro: <img src='img/demo/pauseChamp.png' alt='pauseChamp' class='chat-emote' /> ✋",
        "deidaraxx: <img src='img/demo/froschnite.gif' alt='froschnite' class='chat-emote' /> Ring ding ding da baa",
        `ohne_flex: <img src='img/demo/pauseChamp.png' alt='pauseChamp' class='chat-emote' /> ✋ ${translate("home.message.ohne_flex")}`,
        `NotedBot: <img src='img/demo/peepoHappy.png' alt='peepoHappy' class='chat-emote' /> 🩵 ${translate("home.message.notedbot")} ➜ <a href='https://notedbot.de/commands' target='_blank' style='color: var(--accent-primary);'>https://notedbot.de/commands</a>`,
        "xNot_Lenny: <img src='img/demo/pagBounce.gif' alt='pagbounce' class='chat-emote' /> NotedBot",
        "DasHeiligeKlo: <img src='img/demo/pagBounce.gif' alt='pagbounce' class='chat-emote' />",
        "leon_W1109: <img src='img/demo/pagBounce.gif' alt='pagbounce' class='chat-emote' />",
        `Baysendj: <img src='img/demo/finally.gif' alt='finally' class='chat-emote' /> ${translate("home.message.baysen")}`,
        "LetsZoro: <img src='img/demo/finally.gif' alt='finally' class='chat-emote' />",
    ];

    const userColors = {
        "Wydios": "#0000FF",  
        "DasHeiligeKlo": "#008000",
        "LetsZoro": "#fbff00ff",
        "NotedBot": "#1E90FF",  
        "xNot_Lenny": "#FF0000", 
        "Baysendj": "#cc00ffff",
        "ohne_flex": "#00ff9dff",
        "deidaraxx": "#ff00aaff",
        "leon_W1109": "#9715CD"
    };

    let i = 0;

    function addMessage() {
        if (i >= messages.length) return;

        const now = new Date();
        const time = now.toTimeString().slice(0, 5);

        const msg = document.createElement("div");
        msg.className = "chat-msg";

        const [usernameRaw, ...contentParts] = messages[i].split(":");
        const username = usernameRaw.trim();
        const content = contentParts.join(":" ).trim();
        const userColor = userColors[username] || "#ffffff";

        msg.innerHTML = `
            <span class="chat-time">${time}</span>
            <span class="chat-user" style="color: ${userColor};"> ${username}:</span>
            <span class="chat-text"> ${content}</span>
        `;

        chatBox.appendChild(msg);
        chatBox.scrollTo({
            top: chatBox.scrollHeight,
            behavior: "smooth"
        });

        i++;
        setTimeout(addMessage, 1000);
    }

    setTimeout(addMessage, 1000);

    const devBlogEntries = [
        {
            title: "Performance Optimierung",
            content: translate("home.blog.performance"),
            date: "22. Juli 2025",
            color: "#FF0000"
        },
        {
            title: "WebSocket Verbidung (Beta)",
            content: translate("home.blog.websocket").replace(/!/g, Prefix),
            date: "14. Juli 2025",
            color: "var(--color-marcel)"
        },
        {
            title: "Login With Page",
            content: translate("home.blog.page"),
            date: "13. Juli 2025",
            color: "var(--accent-primary)"
        },
        {
            title: "global",
            content: translate("home.blog.global").replace(/!/g, Prefix),
            date: "5. Juli 2025",
            color: "var(--color-api)"
        },
        {
            title: "7tv",
            content: translate("home.blog.7tv"),
            date: "3. Juli 2025",
            color: "var(--color-twitch)"
        }
    ];

    function renderDevBlog() {
        const container = document.getElementById("dev-blog-card");
        if (!container) return;

        devBlogEntries.forEach(entry => {
            const div = document.createElement("div");
            div.classList.add("blog-entry");

            const color = entry.color ?? "var(--accent-primary)";

            div.innerHTML = `
                <h3 style="color: ${color}">${entry.title}</h3>
                <p>${entry.content}</p>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Posted: ${entry.date}</p>
            `;

            container.appendChild(div);
        });
    }
    renderDevBlog();
});

const menuToggle = document.getElementById("menu-toggle");
const navigation = document.querySelector(".navigation");
menuToggle.addEventListener("click", () => {
    navigation.classList.toggle("open");
});