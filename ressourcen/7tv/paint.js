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
                applyPaint(paintData.data, sample1Elem, sample2Elem);
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

const applyShadows = (shadows) => {
    if (shadows && shadows.length > 0) {
        return shadows.map(shadow => {
            const colorString = convertToHex(shadow.color);
            return `drop-shadow(${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${colorString})`;
        }).join(' ');
    }
    return '';
};

function applyPaint(paintData, sample1Elem, sample2Elem) {
    if (sample1Elem && sample2Elem && paintData) {
        let color = null;

        // Versuche, die Farbe aus den Layers zu holen
        if (paintData.layers && paintData.layers.length > 0 && paintData.layers[0].color) {
            color = paintData.layers[0].color;
        } else if (paintData.shadows && paintData.shadows.length > 0 && paintData.shadows[0].color) {
            // Wenn keine Farbe in den Layers gefunden wurde, verwende die Farbe aus den Shadows
            color = paintData.shadows[0].color;
        }

        if (color) {
            sample1Elem.style.backgroundColor = convertToHex(color);
            sample2Elem.style.backgroundColor = convertToHex(color);
        } else {
            console.error("Keine Farbinformationen in den Layers oder Shadows gefunden.");
        }

        if (paintData.shadows && paintData.shadows.length > 0) {
            sample1Elem.style.filter = applyShadows(paintData.shadows);
            sample2Elem.style.filter = applyShadows(paintData.shadows);
        } else {
            sample1Elem.style.filter = '';
            sample2Elem.style.filter = '';
        }
    } else {
        console.error("sample1Elem oder sample2Elem oder paintData ist nicht definiert.");
    }
}

getPaint(); // lol2
