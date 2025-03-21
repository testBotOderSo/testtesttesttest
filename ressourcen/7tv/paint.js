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

function applyPaintData(paintData) {
    const sampleElement = document.getElementById('sample1'); // Beispiel: Sample 1 als Ziel
    if (!sampleElement) return;

    // Falls mehrere Layer existieren, erstellen wir sie als gestapelte Divs
    paintData.data.layers.forEach(layer => {
        const layerDiv = document.createElement('div');
        layerDiv.classList.add('paint-layer');
        layerDiv.style.opacity = layer.opacity;
        layerDiv.textContent = paintData.name; // Oder spezifische Inhalte setzen
        sampleElement.appendChild(layerDiv);
    });

    // Schatten hinzufügen
    if (paintData.data.shadows.length > 0) {
        let shadowStyle = paintData.data.shadows.map(shadow => {
            return `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px rgba(${shadow.color.r},${shadow.color.g},${shadow.color.b},${shadow.color.a})`;
        }).join(', ');

        sampleElement.style.textShadow = shadowStyle;
    }
}

