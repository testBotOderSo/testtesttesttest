const paintId = new URLSearchParams(window.location.search).get('paintID');
console.log('paintId:', paintId);
const graphqlEndpoint = 'https://7tv.io/v4/gql';

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

fetch(graphqlEndpoint, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    body: JSON.stringify({ query: query }),
})
    .then(response => response.json())
    .then(data => {
        console.log('GQL Antwort:', data);
        if (data.data && data.data.paints && data.data.paints.paints) {
            const paintData = data.data.paints.paints.find(paint => paint.id === paintId);
            if (paintData) {
                console.log(`Paint data found for ID: ${paintId} ->`);
                console.log(JSON.stringify(paintData, null, 2));
                applyPaintData(paintData);
            } else {
                console.error('Paint data not found for ID:', paintId);
            }
        } else {
            console.error('Paint data not found.');
        }
    })
    .catch(error => {
        console.error('Error fetching GraphQL data:', error);
    });

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

function applyPaintData(paintData) {
    const sample1Elem = document.getElementById('sample1');
    const sample2Elem = document.getElementById('sample2');
    if (sample1Elem && sample2Elem && paintData && paintData.data) {
        console.log('Applying Paint Data:', paintData);

        // Gradient anwenden
        if (paintData.data.shadows && paintData.data.shadows.length > 0 && paintData.data.shadows[0].color) {
            const gradientStops = createGradientStops([{ at: 0, color: paintData.data.shadows[0].color }]);
            sample1Elem.style.backgroundImage = applyGradient('linear-gradient', '90deg', gradientStops, false);
            sample2Elem.style.backgroundImage = applyGradient('linear-gradient', '90deg', gradientStops, false);
        }

        // Schatten anwenden
        if (paintData.data.shadows && paintData.data.shadows.length > 0) {
            sample1Elem.style.filter = applyShadows(paintData.data.shadows);
            sample2Elem.style.filter = applyShadows(paintData.data.shadows);
        } else {
            sample1Elem.style.filter = '';
            sample2Elem.style.filter = '';
        }
    } else {
        console.error('Sample elements or paint data not found.');
    }
}
