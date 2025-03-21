function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const paintID = urlParams.get('paintID');
    return { paintID };
};

const convertToHex = (color) => {
    const normalizedColor = color >>> 0;
    return `#${normalizedColor.toString(16).padStart(8, '0')}`;
};

const createGradientStops = (stops) => {
    return stops.map(stop => `${convertToHex(stop.color)} ${stop.at * 100}%`).join(', ');
};

const applyGradient = (type, direction, stops, repeat) => {
    if (type.includes('radial-gradient')) {
        return `${repeat ? `repeating-${type}` : type}(${stops})`;
    }
    return `${repeat ? `repeating-${type}` : type}(${direction}, ${stops})`;
};

const applyShadows = (shadows) => {
    return shadows.map(shadow => {
        const colorString = convertToHex(shadow.color);
        return `drop-shadow(${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${colorString})`;
    }).join(' ');
};

function applyPaint(paint, element) {
    if (element && paint) {
        if (paint.function === 'LINEAR_GRADIENT' && paint.stops?.length) {
            const gradientStops = createGradientStops(paint.stops);
            const gradientDirection = `${paint.angle}deg`;
            element.style.backgroundImage = applyGradient('linear-gradient', gradientDirection, gradientStops, paint.repeat);
            element.style.backgroundColor = '';
        } else if (paint.function === 'RADIAL_GRADIENT' && paint.stops?.length) {
            const gradientStops = createGradientStops(paint.stops);
            element.style.backgroundImage = applyGradient('radial-gradient', '', gradientStops, paint.repeat);
            element.style.backgroundColor = '';
        } else if (paint.function === 'URL' && paint.image_url) {
            const imageUrl = paint.image_url.replace('/1x.', '/3x.');
            element.style.backgroundImage = `url('${imageUrl}')`;
            element.style.backgroundSize = 'cover';
            element.style.backgroundColor = '';
        } else if (paint.shadows && paint.shadows.length > 0 && paint.shadows[0].color) {
            const shadowColor = paint.shadows[0].color;
            const hexColor = convertToHex((shadowColor.r << 16) | (shadowColor.g << 8) | shadowColor.b);
            element.style.backgroundColor = hexColor;
            element.style.backgroundImage = '';
        } else {
            element.style.backgroundColor = '';
            element.style.backgroundImage = '';
        }

        if (paint.shadows?.length) {
            element.style.filter = applyShadows(paint.shadows);
        } else {
            element.style.filter = '';
        }
    }
}

function getPaint() {
    const { paintID } = getUrlParams();
    const query = `
        query Paints {
            paints {
                paints {
                    id
                    name
                    data {
                        layers {
                            id
                            opacity
                        }
                        shadows {
                            offsetX
                            offsetY
                            blur
                            color {
                                hex
                                r
                                g
                                b
                                a
                            }
                        }
                    }
                }
            }
        }
    `;
    fetch('https://7tv.io/v4/gql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ query: query }),
    }).then(response => response.json()).then(data => {
        console.log('GQL Antwort:', data);
        if (data.data && data.data.paints && data.data.paints.paints) {
            const paintData = data.data.paints.paints.find(paint => paint.id === paintID);
            if (paintData) {
                console.log(`Paint Daten für ID: ${paintID} ->`);
                console.log(JSON.stringify(paintData, null, 2));

                const sample1Elem = document.getElementById('sample1');
                const sample2Elem = document.getElementById('sample2');
                const paintNameElement = document.getElementById('paint-name');

                if (paintNameElement) {
                    document.title = `NotedBot │ 7TV ${paintData.name} Paint`;
                }
                applyPaint(paintData.data, sample1Elem);
            } else {
                console.error('Keine Paint Daten gefunden für ID:', paintID);
            }
        } else {
            console.error('Keine Paint Daten gefunden.');
        }
    }).catch(error => {
        console.error('getPaint | Fehler beim fetchen vom Paints', error);
    })
};

document.addEventListener('DOMContentLoaded', getPaint);
