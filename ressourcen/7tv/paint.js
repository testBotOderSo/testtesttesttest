function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const paintID = urlParams.get('PaintID');
    return { paintID };
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
        }`;
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

function applyPaint(data) {
    const paintName = data.name;

    if (paintName) {
        const paintNameElement = document.getElementById('paint-name');
        paintNameElement.textContent = paintName;
    }
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
		return `drop-shadow(${shadow.x_offset}px ${shadow.y_offset}px ${shadow.radius}px ${colorString})`;
	}).join(' ');
};
