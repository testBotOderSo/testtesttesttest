const Prefix = "!"; 

async function fetchCommands() {
    const res = await fetch("https://api.notedbot.de/v1/bot/commands");
    const data = await res.json();
    return Array.isArray(data.commands) ? data.commands : [];
}

function mergeCommands(commands) {
    const map = new Map();
    for (const cmd of commands) {
        if (!map.has(cmd.name)) {
            map.set(cmd.name, {
                ...cmd,
                aliases: [...(cmd.aliases || [])],
                link: [...(cmd.link || [])]
            });
        } else {
            const existing = map.get(cmd.name);
            existing.aliases = Array.from(new Set([...existing.aliases, ...(cmd.aliases || [])]));
            existing.link = Array.from(new Set([...existing.link, ...(cmd.link || [])]));
        }
    }
    return Array.from(map.values());
}

function formatUsage(text) {
    return text.replace(/</g, "[").replace(/>/g, "]").replace(/&lt;/g, "[").replace(/&gt;/g, "]");
}

function renderCommand(cmd) {
    const aliases = cmd.aliases?.length ? `(${cmd.aliases.join(", ")})` : "";
    const img = cmd.link?.[0] ? `<img src="${cmd.link[0]}" alt="emote" class="cmd-img" />` : "";
    const description = t(`commands.description`) === "commands.description" ? cmd.descriptionDE : cmd.descriptionUS;
    const usageRaw = t(`commands.usage`) === "commands.usage" ? cmd.usageDE : cmd.usageUS;
    const usage = formatUsage(usageRaw);

    return `
        <div class="command-bubble">
            <div class="command-header">
                <strong>${Prefix}${cmd.name}</strong> <span class="aliases">${aliases}</span> ${img}
            </div>
            <p>${description}</p>
            <button class="open-modal"
                data-name="${cmd.name}"
                data-aliases="${cmd.aliases.join(", ")}"
                data-usage="${usage}"
            >📘 Details anzeigen</button>
        </div>`;
}

async function renderCommands() {
    const list = document.getElementById("commandsList");
    const perm = document.getElementById("permFilter").value.toLowerCase();
    const cat = document.getElementById("categoryFilter").value.toLowerCase();
    const rawCommands = await fetchCommands();
    const mergedCommands = mergeCommands(rawCommands);

    const filtered = mergedCommands.filter(c => {
        const matchPerm = !perm || parsePermission(c.permission).toLowerCase() === perm;
        const matchCat = !cat || c.category?.toLowerCase() === cat;
        return matchPerm && matchCat;
    });

    list.innerHTML = filtered.map(renderCommand).join("") || `<i>${t("commands.noResults")}</i>`;

    document.querySelectorAll(".open-modal").forEach(btn => {
        btn.addEventListener("click", () => {
            const name = btn.dataset.name;
            const aliases = btn.dataset.aliases;
            const usage = btn.dataset.usage;

            document.getElementById("popupTitle").innerText = `${Prefix}${name}`;
            document.getElementById("popupAliases").innerHTML = `🛠 <span style="color: white;">${aliases}</span>`;
            document.getElementById("popupUsage").innerHTML = `>_ <span style="color: white;">${usage}</span>`;
            document.getElementById("commandPopup").style.display = "block";
        });
    });
}

function parsePermission(id) {
    switch (id) {
        case 0: return t("commands.permission.everyone");
        case 1: return t("commands.permission.vip");
        case 2: return t("commands.permission.moderator");
        case 3: return t("commands.permission.broadcaster");
        case 4: return t("commands.permission.dev");
        case 5: return t("commands.permission.admin");
        default: return t("commands.permission.unknown");
    }
}

async function main() {
    const langCode = navigator.language.startsWith("de") ? "de" : "en";
    await loadLanguage(langCode);
    renderCommands();
}

document.getElementById("permFilter").onchange = renderCommands;
document.getElementById("categoryFilter").onchange = renderCommands;
document.querySelector(".close-btn").addEventListener("click", () => {
    document.getElementById("commandPopup").style.display = "none";
});

btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const aliases = btn.dataset.aliases;
    const usage = btn.dataset.usage;
    const perm = btn.dataset.permission;
    const category = btn.dataset.category;
    const cooldown = btn.dataset.cooldown;
    const description = btn.dataset.description;

    document.getElementById("popupTitle").innerText = `${Prefix}${name}`;
    document.getElementById("popupAliases").innerHTML = `🛠 <span style="color:white;">${aliases}</span>`;
    document.getElementById("popupUsage").innerHTML = `>_ <span style="color:white;">${usage}</span>`;
    document.getElementById("popupPerm").innerHTML = `🛡 <span style="color:white;">${parsePermission(perm)}</span>`;
    document.getElementById("popupCooldown").innerHTML = `⏱️ <span style="color:white;">${cooldown}s</span>`;
    document.getElementById("popupCategory").innerHTML = `📂 <span style="color:white;">${category}</span>`;
    document.getElementById("popupDescription").innerHTML = `<span style="color:white;">${description}</span>`;

    const fakeInput = `${Prefix}${name} ${usage.split(" ").slice(1).join(" ") || "..."}`;
    const fakeOutput = `@Wydios ist jetzt ${name} ${usage.split(" ").slice(1).join(" ") || "..."}`;

    document.getElementById("popupExample").innerHTML = `
        <code>13:52 Wydios: ${fakeInput}</code><br>
        <code>13:52 NotedBot: ${fakeOutput}</code>
    `;

    document.getElementById("commandPopup").style.display = "block";
});

main();

