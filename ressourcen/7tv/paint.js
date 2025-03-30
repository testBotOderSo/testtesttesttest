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
                console.log(JSON.stringify(paintData, null, 2));

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

const Gradient = (type, direction, stops, repeat) => {
    if (type.includes('radial-gradient')) {
        return `${repeat ? `repeating-${type}` : type}(${stops})`;
    }
    return `${repeat ? `repeating-${type}` : type}(${direction}, ${stops})`;
};

function showError(paintID, elements) {
    elements.error.style.display = 'block';
    elements.paintName.textContent = `ID: ${paintID}`;
    document.title = `NotedBot │ Error 7TV ? Paint`;
};

function applyPaint(paintData, sample1, sample2) {
    if (!paintData?.layers?.length) return;
    paintData.layers.forEach(layer => {
        if (layer.ty?.images?.length) {
            const largestImage = layer.ty.images.reduce((max, img) => img.size > max.size ? img : max, layer.ty.images[0]);
            [sample1, sample2].forEach(el => {
                el.style.backgroundImage = `url('${largestImage.url}')`;
                el.style.color = 'transparent';
                el.style.backgroundClip = 'text';
                el.style.webkitBackgroundClip = 'text';
            });
        } else if (layer.ty?.stops) {
            const stops = layer.ty.stops.map(stop => `${stop.color.hex} ${stop.at * 100}%`).join(', ');
            const gradientType = layer.ty.angle !== undefined ? 'linear-gradient' : 'radial-gradient';
            const gradientDirection = layer.ty.angle !== undefined ? `${layer.ty.angle}deg` : 'circle';
            const gradient = `${gradientType}(${gradientDirection}, ${stops})`;
            [sample1, sample2].forEach(el => el.style.backgroundImage = gradient);
        } else if (layer.ty?.color) {
            [sample1, sample2].forEach(el => el.style.backgroundColor = layer.ty.color.hex);
        }
    });
};

getPaint();
