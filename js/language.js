let lang = {};
let langCode = "de";

async function loadLanguage(code = "de") {
    langCode = code;
    try {
        const res = await fetch(`../data/lang/${code}.json`);
        lang = await res.json();
    } catch (error) {
        console.error("Lang | Sprachdatei konnte nicht geladen werden:", error);
        lang = {};
    }
};

function translate(path) {
    return path.split(".").reduce((obj, key) => obj?.[key], lang) || `{${path}}`;
};