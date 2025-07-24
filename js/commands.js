import { getStoredPrefix, getStoredLang } from "./twitch.js";
    
const Prefix = getStoredPrefix();
const Lang = getStoredLang();

async function fetchCommands() {
    const res = await fetch("https://api.notedbot.de/bot/commands", { cache: "no-store" });
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
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
        case "0": return translate("commands.permission.everyone");
        case "1": return translate("commands.permission.vip");
        case "2": return translate("commands.permission.moderator");
        case "3": return translate("commands.permission.broadcaster");
        case "4": return translate("commands.permission.dev");
        case "5": return translate("commands.permission.admin");
        default: return translate("commands.permission.unknown");
    }
};

function renderCommand(cmd) {
    const aliases = cmd.aliases?.length ? `(Alias: ${cmd.aliases.join(", ")})` : "";
    const description = Lang === "de" ? cmd.descriptionDE : cmd.descriptionUS;
    const usageRaw = Lang === "de" ? cmd.usageDE : cmd.usageUS;
    const usage = formatUsage(usageRaw);
    
    return `
        <div class="command-bubble">
            <div class="cmd-header-line">
            <strong>${Prefix}${cmd.name} ${aliases}</strong>
                ${cmd.link ? `<img src="${cmd.link}" alt="emote" class="cmd-img-inline" />` : ""}
            </div>
            <p>${translate("commands.description")}: ${description}</p>
            <button class="open-modal cmd-btn"
                data-name="${cmd.name}"
                data-aliases="${cmd.aliases.join(", ")}"
                data-usage="${usage}"
                data-permission="${cmd.permission}"
                data-category="${cmd.category}"
                data-cooldown="${cmd.cooldown || 0}"
                data-description="${description}"
                data-image="${cmd.link || ""}"
            >${translate("commands.more")}</button>
        </div>`;
};

async function renderCommands() {
    const list = document.getElementById("commandsList");
    const perm = document.getElementById("permFilter").value;
    const cat = document.getElementById("categoryFilter").value.toLowerCase();
    const search = document.getElementById("searchInput").value.toLowerCase();

    const rawCommands = await fetchCommands();
    if (!rawCommands || rawCommands.length === 0) {
        return list.innerHTML = `<i>${translate("command.error.noCommands")}</i>`;
    };

    const mergedCommands = mergeCommands(rawCommands);

    const filtered = mergedCommands.filter(c => {
        const permNum = perm === "" ? null : Number(perm);
        const matchPerm = !permNum || c.permission === permNum;

        const matchCat = !cat || (c.category && c.category.toLowerCase() === cat);

        const searchInName = c.name.toLowerCase().includes(search);
        const searchInAliases = c.aliases?.some(alias => alias.toLowerCase().includes(search)) || false;
        const matchSearch = !search || searchInName || searchInAliases;

        return matchPerm && matchCat && matchSearch;
    });

    list.innerHTML = filtered.map(renderCommand).join("") || `<i>${translate("commands.error.noResults")}</i>`;
    setSearchPlaceholder();

    document.querySelectorAll(".open-modal").forEach(btn => {
        btn.addEventListener("click", () => {
            const name = btn.dataset.name;
            const aliases = btn.dataset.aliases;
            const usage = btn.dataset.usage;
            const perm = btn.dataset.permission;
            const category = btn.dataset.category;
            const cooldown = btn.dataset.cooldown;
            const description = btn.dataset.description;
            
            const imageUrl = btn.dataset.image;
            const imgTag = imageUrl ? `<img src="${imageUrl}" alt="emote" class="cmd-img" />` : "";

            document.getElementById("popupTitle").innerHTML = `
                <span class='popup-label'>Command:</span> 
                <span class='popup-value'>${Prefix}${name}</span> ${imgTag}`;

            document.getElementById("popupAliases").innerHTML = `
                <span class='popup-label'>Aliases:</span> 
                <span class='popup-value'>${aliases}</span>`;

            document.getElementById("popupUsage").innerHTML = `
                <span class='popup-label'>Usage:</span> 
                <span class='popup-value'>${Prefix}${usage.includes("!") ? usage.substring(usage.indexOf("!") + 1) : usage}</span>`;

            document.getElementById("popupPerm").innerHTML = `
                <span class='popup-label'>Perms:</span> 
                <span class='popup-value'>${parsePermission(perm)}</span>`;

            document.getElementById("popupCooldown").innerHTML = `
                <span class='popup-label'>Cooldown:</span> 
                <span class='popup-value'>${cooldown}s</span>`;

            document.getElementById("popupCategory").innerHTML = `
                <span class='popup-label'>Category:</span> 
                <span class='popup-value'>${category}</span>`;

            document.getElementById("popupDescription").innerHTML = `
                <div class='popup-divider'></div>
                <div class='popup-description'>
                    <span class='popup-label'>Description:</span> 
                    <span class='popup-value'>${description}</span>
                </div>
                <div class='popup-divider'></div>`;

            const imgPath = `img/examples/${Lang}/${name}.png`;
            const img = new Image();
            img.onload = function() {
                const exampleImg = `<img src="${imgPath}" alt="example" class="cmd-img" />`;
                document.getElementById("popupExample").innerHTML = `<div class='popup-examples-title'>Example Response:</div><div class='popup-examples-box'>${exampleImg}</div>`;
            };
            img.onerror = function() {
                document.getElementById("popupExample").innerHTML = `<div class='popup-examples-title'>Example Response:</div><div class='popup-examples-box'><span style="color: var(--text-primary); font-style: italic;">No example</span></div>`;
            };
            img.src = imgPath;

            document.getElementById("popupOverlay").style.display = "block";
            document.getElementById("commandPopup").style.display = "block";
            document.title = `NotedBot • Cmd: ${name}`;
        });
    });
};

function setSearchPlaceholder() {
    const input = document.getElementById("searchInput");
    input.placeholder = translate("commands.search") || `${Lang === "de" ? "Suchen nach einem" : "Search for a"} Command?`;
};

function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        category: params.get("category") || "",
        perm: params.get("perm") || "",
        search: params.get("search") || ""
    };
};

function updateUrlParams() {
    const perm = document.getElementById("permFilter").value;
    const cat = document.getElementById("categoryFilter").value;
    const search = document.getElementById("searchInput").value;

    const params = new URLSearchParams();
    if (cat) params.set("category", cat);
    if (perm) params.set("perm", perm);
    if (search) params.set("search", search);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
};

async function main() {
    await loadLanguage(Lang);
    setSearchPlaceholder();

    const params = getUrlParams();

    document.getElementById("categoryFilter").value = params.category;
    document.getElementById("permFilter").value = params.perm;
    document.getElementById("searchInput").value = params.search;

    renderCommands();
};

document.addEventListener("click", (event) => {
    const popup = document.getElementById("commandPopup");
    if (popup.style.display === "block" && !popup.contains(event.target) && !event.target.classList.contains("open-modal")) {
        popup.style.display = "none";
        document.title = "NotedBot • Commands";
    }
});

document.getElementById("searchInput").addEventListener("input", () => { renderCommands(); updateUrlParams() });
document.getElementById("permFilter").addEventListener("change", () => { renderCommands(); updateUrlParams() });
document.getElementById("categoryFilter").addEventListener("change", () => { renderCommands(); updateUrlParams() });

main();
