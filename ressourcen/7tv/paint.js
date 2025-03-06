function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};

    // Standardwerte abrufen
    params.name = urlParams.get('name') || 'Wydios';
    params.elementID = urlParams.get('paint');
    params.paintID = urlParams.get('PaintID');
    params.paintName = urlParams.get('paintName');

    // Farbverlauf (Gradient)
    params.gradientFunction = urlParams.get('gradientFunction'); // LINEAR_GRADIENT, RADIAL_GRADIENT
    params.gradientAngle = urlParams.get('angle') || '0'; // Winkel für linear-gradient
    params.gradientRepeat = urlParams.get('repeat') === 'true';

    params.stops = [];
    for (let i = 1; urlParams.has(`color${i}`) && urlParams.has(`at${i}`); i++) {
        params.stops.push({
            color: `#${urlParams.get(`color${i}`)}`,
            at: parseFloat(urlParams.get(`at${i}`))
        });
    }

    // Schatten (Shadows)
    params.shadows = [];
    for (let i = 1; urlParams.has(`offsetX${i}`) && urlParams.has(`color${i}`); i++) {
        params.shadows.push({
            offsetX: parseFloat(urlParams.get(`offsetX${i}`)),
            offsetY: parseFloat(urlParams.get(`offsetY${i}`)),
            blur: parseFloat(urlParams.get(`blur${i}`)),
            color: `#${urlParams.get(`color${i}`)}`
        });
    }

    return params;
}

function createGradientStops(stops) {
    return stops.map(stop => `${stop.color} ${stop.at * 100}%`).join(', ');
}

function applyGradient(type, direction, stops, repeat) {
    if (type === 'RADIAL_GRADIENT') {
        return `${repeat ? 'repeating-radial-gradient' : 'radial-gradient'}(${stops})`;
    }
    return `${repeat ? 'repeating-linear-gradient' : 'linear-gradient'}(${direction}, ${stops})`;
}

function applyShadows(shadows) {
    return shadows.map(shadow =>
        `drop-shadow(${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.color})`
    ).join(' ');
}

function loadPaint() {
    const params = getUrlParams();
    const paintElements = document.querySelectorAll('.paint-text');

    if (params.elementID && params.paintID) {
        // Falls eine Paint-ID vorhanden ist, wird das 7TV-Bild genutzt
        const paintUrl = `https://cdn.7tv.app/paint/${params.elementID}/layer/${params.paintID}/1x.webp`;

        paintElements.forEach((element) => {
            element.style.color = 'transparent';
            element.style.backgroundClip = 'text';
            element.style.webkitBackgroundClip = 'text';
            element.style.backgroundImage = `url('${paintUrl}')`;
            element.style.backgroundSize = '100% auto';
            element.style.textShadow = 'none';
        });

    } else if (params.gradientFunction && params.stops.length > 0) {
        // Falls ein Farbverlauf angegeben wurde
        const gradientStops = createGradientStops(params.stops);
        const gradientDirection = `${params.gradientAngle}deg`;
        const gradientStyle = applyGradient(params.gradientFunction, gradientDirection, gradientStops, params.gradientRepeat);

        paintElements.forEach((element) => {
            element.style.color = 'transparent';
            element.style.backgroundClip = 'text';
            element.style.webkitBackgroundClip = 'text';
            element.style.backgroundImage = gradientStyle;
            element.style.textShadow = 'none';
        });

    } else if (params.shadows.length > 0) {
        // Falls Schatten definiert sind, aber kein Gradient oder Paint
        const shadowStyle = applyShadows(params.shadows);

        paintElements.forEach((element) => {
            element.style.color = params.shadows[0].color;
            element.style.textShadow = shadowStyle;

            const shadowSpan = document.createElement('span');
            shadowSpan.textContent = element.textContent;
            shadowSpan.style.textShadow = shadowStyle;
            element.appendChild(shadowSpan);
        });
    } else {
        // Falls keine Daten vorhanden sind, Standard setzen
        paintElements.forEach((element) => {
            element.style.color = "#FFFFFF";
            element.style.textShadow = "2px 2px 5px rgba(0,0,0,0.5)";
        });
    }

    if (params.name) {
        const nameElement = document.getElementById('sample1');
        nameElement.textContent = params.name;
        const spanElement = document.createElement('span');
        spanElement.textContent = params.name;
        nameElement.appendChild(spanElement);
        nameElement.style.fontSize = '5em';
        nameElement.style.fontWeight = 'bold';
    }

    if (params.paintName) {
        const paintNameElement = document.getElementById('paint-name');
        paintNameElement.textContent = params.paintName;
        paintNameElement.style.fontWeight = 'bold';

        if (params.paintID) {
            const paintUrl = `https://cdn.7tv.app/paint/${params.elementID}/layer/${params.paintID}/1x.webp`;
            paintNameElement.style.backgroundImage = `url('${paintUrl}')`;
            paintNameElement.style.backgroundSize = '100% auto';
        } else if (params.stops.length > 0) {
            paintNameElement.style.backgroundImage = applyGradient(params.gradientFunction, `${params.gradientAngle}deg`, createGradientStops(params.stops), params.gradientRepeat);
        } else if (params.shadows.length > 0) {
            paintNameElement.style.color = params.shadows[0].color;
            paintNameElement.style.textShadow = applyShadows(params.shadows);
        } else {
            paintNameElement.style.color = "#FFFFFF";
            paintNameElement.style.textShadow = "2px 2px 5px rgba(0,0,0,0.5)";
        }

        document.title = `NotedBot │ 7TV ${params.paintName} Paint`;
    }
}

window.onload = loadPaint;
