async function fetchCommands() {
  const res = await fetch("https://api.notedbot.de/v1/bot/commands");
  const data = await res.json();
  return data.commands || [];
}

function renderCommand(cmd) {
  const perms = Array.isArray(cmd.perms) ? cmd.perms.join(", ") : cmd.perms || "Unbekannt";
  const category = cmd.category || "Unbekannt";
  return `
    <div class="command-card">
      <strong>/${cmd.name}</strong> – ${cmd.description}<br/>
      <small>🛡 ${perms} | 🗂 ${category}</small>
    </div>`;
}

async function renderCommands() {
  const list = document.getElementById("commandsList");
  const perm = document.getElementById("permFilter").value.toLowerCase();
  const cat = document.getElementById("categoryFilter").value.toLowerCase();
  const commands = await fetchCommands();

  const filtered = commands.filter(c => {
    const matchPerm = !perm || (Array.isArray(c.perms) && c.perms.map(p => p.toLowerCase()).includes(perm));
    const matchCat = !cat || c.category?.toLowerCase() === cat;
    return matchPerm && matchCat;
  });

  list.innerHTML = filtered.map(renderCommand).join("") || `<i>${t("commands.noResults")}</i>`;
}

async function main() {
  const browserLang = navigator.language.startsWith("de") ? "de" : "en";
  await loadLanguage(browserLang);
  renderCommands();
}

document.getElementById("permFilter").onchange = renderCommands;
document.getElementById("categoryFilter").onchange = renderCommands;

main();
