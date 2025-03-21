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

function applyPaint(data) {
    const paintName = data.name;
    const paintNameElement = document.getElementById('paint-name');
    if (paintNameElement) {
        paintNameElement.textContent = paintName;
    }

    const sample1Elem = document.getElementById('sample1');
    const sample2Elem = document.getElementById('sample2');

    if (data.data && data.data.paints && data.data.paints.paints) {
        data.data.paints.paints.forEach((paint, index) => {
            const paintElem = index === 0 ? sample1Elem : (index === 1 ? sample2Elem : null);
            if (paintElem && paint.data) {
                if (paint.data.function === 'LINEAR_GRADIENT' && paint.data.stops?.length) {
                    const gradientStops = createGradientStops(paint.data.stops);
                    const gradientDirection = `${paint.data.angle}deg`;
                    paintElem.style.backgroundImage = applyGradient('linear-gradient', gradientDirection, gradientStops, paint.data.repeat);
                    paintElem.style.background = ''; // Clear any potential solid background
                } else if (paint.data.function === 'RADIAL_GRADIENT' && paint.data.stops?.length) {
                    const gradientStops = createGradientStops(paint.data.stops);
                    paintElem.style.backgroundImage = applyGradient('radial-gradient', '', gradientStops, paint.data.repeat);
                    paintElem.style.background = ''; // Clear any potential solid background
                } else if (paint.data.function === 'URL' && paint.data.image_url) {
                    const imageUrl = paint.data.image_url.replace('/1x.', '/3x.');
                    paintElem.style.backgroundImage = `url('${imageUrl}')`;
                    paintElem.style.backgroundSize = 'cover'; // Optional: Stelle sicher, dass das Bild den gesamten Bereich abdeckt
                    paintElem.style.background = ''; // Clear any potential solid background
                } else if (paint.data.layers?.length > 0 && paint.data.layers[0].color) {
                    // Wenn eine Farbe im Layer vorhanden ist, wende sie als Hintergrundfarbe an
                    const color = paint.data.layers[0].color;
                    const hexColor = convertToHex((color.r << 16) | (color.g << 8) | color.b);
                    paintElem.style.backgroundColor = hexColor;
                    paintElem.style.backgroundImage = ''; // Clear any potential gradient or image
                }

                if (paint.data.shadows?.length) {
                    paintElem.style.filter = applyShadows(paint.data.shadows);
                } else {
                    paintElem.style.filter = '';
                }
            }
        });
    }
};

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
                            color {
                                hex
                                r
                                g
                                b
                                a
                            }
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
                        function
                        stops {
                            at
                            color {
                                r
                                g
                                b
                                a
                            }
                        }
                        angle
                        repeat
                        image_url
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
                applyPaint(paintData);
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

// Rufe getPaint auf, sobald die Seite geladen ist
document.addEventListener('DOMContentLoaded', getPaint);
