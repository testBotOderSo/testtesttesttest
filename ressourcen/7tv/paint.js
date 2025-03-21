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
                applyPaint(paintData.data, sample1Elem, sample2Elem); // Hier sample2Elem hinzugefügt
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

function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const paintID = urlParams.get('paintID');
    return { paintID };
};

const convertToHex = (color) => {
    if (color && color.hex) {
        return color.hex;
    } else if (color && color.r !== undefined && color.g !== undefined && color.b !== undefined) {
        return `#${(1 << 24 | color.r << 16 | color.g << 8 | color.b).toString(16).slice(1)}`;
    }
    return '#000000';
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

function applyPaint(paintData, sample1Div, sample2Div) {
    if (sample1Div && sample2Div && paintData) {
        if (paintData.layers && paintData.layers.length > 0) {
            const color = paintData.layers[0].color;
            sample1Div.style.backgroundColor = convertToHex(color);
            sample2Div.style.backgroundColor = convertToHex(color);
        }

        if (paintData.shadows && paintData.shadows.length > 0) {
            sample1Div.style.filter = applyShadows(paintData.shadows);
            sample2Div.style.filter = applyShadows(paintData.shadows);
        } else {
            sample1Div.style.filter = '';
            sample2Div.style.filter = '';
        }
    } else {
        console.error("sample1Div or sample2Div or paintData is not defined.");
    }
}

getPaint();
