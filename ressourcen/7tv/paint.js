const paintId = new URLSearchParams(window.location.search).get('paintID');
const graphqlEndpoint = 'https://7tv.io/v4/gql'; // Ersetze dies durch deinen GraphQL-Endpunkt

const query = `
    query Paints($paintId: ID!) {
        paints(where: { id: $paintId }) {
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

const variables = { paintId: paintId };

fetch(graphqlEndpoint, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    body: JSON.stringify({
        query: query,
        variables: variables,
    }),
})
    .then(response => response.json())
    .then(data => {
        if (data.data && data.data.paints && data.data.paints.paints && data.data.paints.paints.length > 0) {
            const paintData = data.data.paints.paints[0];
            applyPaintData(paintData);
        } else {
            console.error('Paint data not found for ID:', paintId);
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
    return '#000000'; // Standardfarbe, falls keine Farbe gefunden wird
};

const applyShadows = (shadows) => {
    if (shadows && shadows.length > 0) {
        return shadows.map(shadow => {
            const colorString = convertToHex(shadow.color);
            return `drop-shadow(${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${colorString})`;
        }).join(' ');
    }
    return ''; // Keine Schatten, falls keine vorhanden sind
};

const sample1Div = document.getElementById('sample1');
const sample2Div = document.getElementById('sample2');

function applyPaintData(paintData) {
    if (sample1Div && sample2Div && paintData && paintData.data) {
        if (paintData.data.layers && paintData.data.layers.length > 0) {
            sample1Div.style.backgroundColor = convertToHex(paintData.data.layers[0].color);
            sample2Div.style.backgroundColor = convertToHex(paintData.data.layers[0].color); // Da nur 1 layer vorhanden ist.
        }

        if (paintData.data.shadows && paintData.data.shadows.length > 0) {
            sample1Div.style.filter = applyShadows(paintData.data.shadows);
            sample2Div.style.filter = applyShadows(paintData.data.shadows);
        } else {
            sample1Div.style.filter = '';
            sample2Div.style.filter = '';
        }

    } else {
        console.error('Sample divs or paint data not found.');
    }
}
