let lang = {};
let langCode = "de";

async function loadLanguage(code = "de") {
  langCode = code;
  try {
    const res = await fetch(`../data/lang/${code}.json`);
    lang = await res.json();
    console.log(`🌍 Sprache geladen: ${code}`);
  } catch (e) {
    console.error("❌ Sprachdatei konnte nicht geladen werden:", e);
    lang = {};
  }
}

function t(path) {
  return path.split(".").reduce((obj, key) => obj?.[key], lang) || `[${path}]`;
}
