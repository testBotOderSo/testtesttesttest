const Prefix = "!";

async function fetchCommands() {
    const res = await fetch("https://api.notedbot.de/v1/bot/commands");
    const data = await res.json();
    return Array.isArray(data.commands) ? data.commands : [];
};

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
};

function formatUsage(text) {
    return text.replace(/</g, "[").replace(/>/g, "]").replace(/&lt;/g, "[").replace(/&gt;/g, "]");
};

function parsePermission(id) {
    switch (id) {
        case 0: return translate("commands.permission.everyone");
        case 1: return translate("commands.permission.vip");
        case 2: return translate("commands.permission.moderator");
        case 3: return translate("commands.permission.broadcaster");
        case 4: return translate("commands.permission.dev");
        case 5: return translate("commands.permission.admin");
        default: return translate("commands.permission.unknown");
    }
};

function renderCommand(cmd) {
    const aliases = cmd.aliases?.length ? `(${cmd.aliases.join(", ")})` : "";
    const img = cmd.link?.[0] ? `<img src="${cmd.link[0]}" alt="emote" class="cmd-img" />` : "";
    const description = langCode === "de" ? cmd.descriptionDE : cmd.descriptionUS;
    const usageRaw = langCode === "de" ? cmd.usageDE : cmd.usageUS;
    const usage = formatUsage(usageRaw);
    
    return `
        <div class="command-bubble">
            <div class="command-header">
                <strong>${Prefix}${cmd.name}</strong> <p class="aliases">${aliases}</p> ${img}
            </div>
            <p>${description}</p>
            <button class="open-modal"
                data-name="${cmd.name}"
                data-aliases="${cmd.aliases.join(", ")}"
                data-usage="${usage}"
                data-permission="${cmd.permission}"
                data-category="${cmd.category}"
                data-cooldown="${cmd.cooldown || 0}"
                data-description="${description}"
            >📘 Details anzeigen</button>
        </div>`;
};

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

    list.innerHTML = filtered.map(renderCommand).join("") || `<i>${translate("commands.noResults")}</i>`;

    document.querySelectorAll(".open-modal").forEach(btn => {
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

            const fakeInput = `${Prefix}${name}`;
            const fakeOutput = `@Wydios ${Prefix}${usage.includes("!") ? usage.substring(usage.indexOf("!") + 1) : usage}`;

            document.getElementById("popupExample").innerHTML = 
                `<code>Wydios: ${fakeInput}</code><br>
                 <code>NotedBot: ${fakeOutput}</code>`;

            document.getElementById("commandPopup").style.display = "block";
            document.title = `NotedBot • Cmd: ${name}`;
        });
    });
};;

async function main() {
    const langCode = navigator.language.startsWith("de") ? "de" : "en";
    await loadLanguage(langCode);
    renderCommands();
};

document.getElementById("permFilter").onchange = renderCommands;
document.getElementById("categoryFilter").onchange = renderCommands;

main();
