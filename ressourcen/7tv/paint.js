function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const elementID = urlParams.get('paint');
    const paintID = urlParams.get('PaintID');
    const paintName = urlParams.get('paintName');

    const shadows = [];
    for (let i = 1; urlParams.has(`offsetX${i}`) && urlParams.has(`color${i}`); i++) {
        const offsetX = parseFloat(urlParams.get(`offsetX${i}`));
        const offsetY = parseFloat(urlParams.get(`offsetY${i}`));
        const blur = parseFloat(urlParams.get(`blur${i}`));
        const color = urlParams.get(`color${i}`);

        if (!isNaN(offsetX) && !isNaN(offsetY) && !isNaN(blur) && /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(color)) {
            shadows.push({
                offsetX,
                offsetY,
                blur,
                color: `#${color}`
            });
        }
    }

    return { name, elementID, paintID, paintName, shadows };
}

function generateShadowStyle(shadows) {
    return shadows.map(shadow =>
        `drop-shadow(${shadow.color} ${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px)`
    ).join(" ");
}

function loadPaint() {
    const { name, elementID, paintID, paintName, shadows } = getUrlParams();
    const paintElements = document.querySelectorAll('.paint-text');

    if (elementID && paintID) {
        const paintUrl = `https://cdn.7tv.app/paint/${elementID}/layer/${paintID}/1x.webp`;

        paintElements.forEach((element) => {
            element.style.color = 'transparent';
            element.style.backgroundClip = 'text';
            element.style.webkitBackgroundClip = 'text';
            element.style.backgroundImage = `url('${paintUrl}')`;
            element.style.backgroundSize = '100% auto';
            element.style.textShadow = 'none';
        });

    } else if (elementID && shadows.length > 0) {
        const shadowStyle = generateShadowStyle(shadows);

        paintElements.forEach((element) => {
            element.style.color = shadows[0].color;
            element.style.textShadow = shadowStyle;

            const shadowSpan = document.createElement('span');
            shadowSpan.textContent = element.textContent;
            shadowSpan.style.textShadow = shadowStyle;
            element.appendChild(shadowSpan);
        });
    } else {
        paintElements.forEach((element) => {
            element.style.color = "#FFFFFF";
            element.style.textShadow = "2px 2px 5px rgba(0,0,0,0.5)";
        });
    }

    if (name) {
        const nameElement = document.getElementById('sample1');
        nameElement.textContent = name;
        const spanElement = document.createElement('span');
        spanElement.textContent = name;
        nameElement.appendChild(spanElement);
        nameElement.style.fontSize = '5em';
        nameElement.style.fontWeight = 'bold';
    }

    if (paintName) {
        const paintNameElement = document.getElementById('paint-name');
        paintNameElement.textContent = paintName;
        paintNameElement.style.fontWeight = 'bold';

        if (paintID) {
            const paintUrl = `https://cdn.7tv.app/paint/${elementID}/layer/${paintID}/1x.webp`;
            paintNameElement.style.backgroundImage = `url('${paintUrl}')`;
            paintNameElement.style.backgroundSize = '100% auto';
        } else if (shadows.length > 0) {
            paintNameElement.style.color = shadows[0].color;
            paintNameElement.style.textShadow = generateShadowStyle(shadows);
        } else {
            paintNameElement.style.color = "#FFFFFF";
            paintNameElement.style.textShadow = "2px 2px 5px rgba(0,0,0,0.5)";
        }

        document.title = `NotedBot │ 7TV ${paintName} Paint`;
    }
}

window.onload = loadPaint;
