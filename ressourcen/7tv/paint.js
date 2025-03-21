const paintId = new URLSearchParams(window.location.search).get('paintID');
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
        console.log('GQL Antwort:', JSON.stringify(data, null, 2));
        if (data.data && data.data.paints && data.data.paints.paints) {
            const paintData = data.data.paints.paints.find(paint => paint.id === paintId);
            if (paintData) {
                console.log('Paint data found for ID:', paintId, paintData);
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

const applyShadows = (shadows) => {
    if (shadows && shadows.length > 0) {
        return shadows.map(shadow => {
            const colorString = convertToHex(shadow.color);
            return `drop-shadow(${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${colorString})`;
        }).join(' ');
    }
    return '';
};

const sample1Div = document.getElementById('sample1');
const sample2Div = document.getElementById('sample2');
const paintNameSpan = document.getElementById('paint-name');

function applyPaintData(paintData) {
    if (sample1Div && sample2Div && paintData && paintData.data) {
        console.log('Applying Paint Data:', paintData);

        // Name anwenden
        if (paintData.name) {
            paintNameSpan.textContent = paintData.name;
        }

        // Farben anwenden (falls vorhanden)
        if (paintData.data.shadows && paintData.data.shadows.length > 0 && paintData.data.shadows[0].color) {
            const layerColor = convertToHex(paintData.data.shadows[0].color);
            sample1Div.style.backgroundColor = layerColor;
            sample2Div.style.backgroundColor = layerColor;
            console.log('Applied layer colors:', layerColor);
        }

        // Schatten anwenden
        if (paintData.data.shadows && paintData.data.shadows.length > 0) {
            const shadowsString = applyShadows(paintData.data.shadows);
            sample1Div.style.filter = shadowsString;
            sample2Div.style.filter = shadowsString;
            console.log('Applied shadows:', shadowsString);
        } else {
            sample1Div.style.filter = '';
            sample2Div.style.filter = '';
            console.log('No shadows to apply.');
        }
    } else {
        console.error('Sample divs or paint data not found.');
    }
}
