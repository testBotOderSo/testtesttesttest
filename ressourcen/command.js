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

function renderCommand(cmd) {
  const aliases = cmd.aliases?.length ? `(${cmd.aliases.join(", ")})` : "";
  const img = cmd.link?.[0] ? `<img src="${cmd.link[0]}" alt="emote" class="cmd-img" />` : "";
  const description = t(`commands.description`) === "commands.description" ? cmd.descriptionDE : cmd.descriptionUS;
  const usage = t(`commands.usage`) === "commands.usage" ? cmd.usageDE : cmd.usageUS;

  return `
    <div class="command-card">
      <div class="command-header">
        <strong>/${cmd.name}</strong> <span class="aliases">${aliases}</span>
        ${img}
      </div>
      <p>${description}</p>
      <button class="toggle-details">📘 Details anzeigen</button>
      <div class="command-details hidden">
        <p><strong>🛠 Aliases:</strong> ${cmd.aliases.join(", ")}</p>
        <p><strong>📥 Usage:</strong> ${usage}</p>
      </div>
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

  // Toggle Buttons aktivieren
  document.querySelectorAll(".toggle-details").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.nextElementSibling.classList.toggle("hidden");
    });
  });
}

function parsePermission(id) {
  switch (id) {
    case 0: return "Jeder";
    case 1: return "Vip";
    case 2: return "Mod";
    case 3: return "Broadcaster";
    case 4: return "Dev";
    case 5: return "Admin";
    default: return "Unbekannt";
  }
}

async function main() {
  const langCode = navigator.language.startsWith("de") ? "de" : "en";
  await loadLanguage(langCode);
  renderCommands();
}

document.getElementById("permFilter").onchange = renderCommands;
document.getElementById("categoryFilter").onchange = renderCommands;
main();

