function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const paintID = urlParams.get('paintID');
    const helpElement = document.getElementById('help');
    if (!paintID) {
        helpElement.style.display = 'block';
        return { paintID: null };
    }
    return { paintID };
};

function getPaint() {
    const { paintID } = getUrlParams();

    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const sample1Element = document.getElementById('sample1');
    const sample2Element = document.getElementById('sample2');
    const paintNameElement = document.getElementById('paint-name');

    if (!paintID) {
        loadingElement.style.display = 'none';
        errorElement.style.display = 'none';
        sample1Element.style.display = 'none';
        sample2Element.style.display = 'none';
        document.title = `NotedBot │ 7TV Try Paint`;
        return;
    }

    loadingElement.style.display = 'block';
    errorElement.style.display = 'none';
    document.title = `NotedBot │ 7TV ... Paint`;

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
                            ty {
                                ... on PaintLayerTypeImage {
                                    images {
                                        url
                                        mime
                                        size
                                        scale
                                        width
                                        height
                                        frameCount
                                    }
                                }
                                ... on PaintLayerTypeRadialGradient {
                                    repeating
                                    shape
                                    stops {
                                        at
                                        color {
                                            hex
                                            r
                                            g
                                            b
                                            a
                                        }
                                    }
                                }
                                ... on PaintLayerTypeLinearGradient {
                                    angle
                                    repeating
                                    stops {
                                        at
                                        color {
                                            hex
                                            r
                                            g
                                            b
                                            a
                                        }
                                    }
                                }
                                ... on PaintLayerTypeSingleColor {
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
    })
    .then(response => response.json())
    .then(data => {
        if (data.data && data.data.paints && data.data.paints.paints) {
            const paintData = data.data.paints.paints.find(paint => paint.id === paintID);
            if (paintData) {
                console.log(`Paint Daten für ${paintData.name} ID: ${paintID} ->`);

                if (paintNameElement) {
                    paintNameElement.textContent = paintData.name;
                    document.title = `NotedBot │ 7TV ${paintData.name} Paint`;
                }

                applyPaint(paintData.data, paintNameElement, sample1Element, sample2Element);
            } else {
                console.error('Keine Paint Daten gefunden für ID:', paintID);
                Error();
            }
        } else {
            console.error('Keine Paint Daten gefunden');
            Error();
        }
    })
    .catch(error => {
        console.error('getPaint | Fehler beim fetchen vom Paints', error);
        Error();
    }).finally(() => {
        loadingElement.style.display = 'none';
    });
    function Error() {
        errorElement.style.display = 'block';
        if (paintID) {
            paintNameElement.textContent = `ID: ${paintID}`;
        }
        document.title = `NotedBot │ Error 7TV ? Paint`;
    };
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

const paintElem = document.getElementById('paint');
if (paintElem && paint) {
    if (paint.function === 'LINEAR_GRADIENT' && paint.stops?.length) {
        const gradientStops = createGradientStops(paint.stops);
        const gradientDirection = `${paint.angle}deg`;
        paintElem.style.backgroundImage = applyGradient('linear-gradient', gradientDirection, gradientStops, paint.repeat);
    } else if (paint.function === 'RADIAL_GRADIENT' && paint.stops?.length) {
        const gradientStops = createGradientStops(paint.stops);
        paintElem.style.backgroundImage = applyGradient('radial-gradient', '', gradientStops, paint.repeat);
    } else if (paint.function === 'URL' && paint.image_url) {
        const imageUrl = paint.image_url.replace('/1x.', '/3x.');
        paintElem.style.backgroundImage = `url('${imageUrl}')`;
    }

    if (paint.shadows?.length) {
        paintElem.style.filter = applyShadows(paint.shadows);
    } else {
        paintElem.style.filter = '';
    }
}

getPaint();
