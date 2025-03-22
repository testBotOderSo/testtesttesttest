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
                    paintNameElement.textContent = paintData.name;
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
    if (paintData && paintData.layers && paintData.layers.length > 0) {
        paintData.layers.forEach(layer => {
            if (layer.ty) {
                if (layer.ty.images && layer.ty.images.length > 0) {
                    const gifImage = layer.ty.images.find(img => img.mime === 'image/gif');
                    if (gifImage) {
                        const img = new Image();
                        img.crossOrigin = 'Anonymous';
                        img.onload = function() {
                            const colorThief = new ColorThief();
                            const dominantColor = colorThief.getColor(img);
                            const hexColor = `#${((1 << 24) + (dominantColor[0] << 16) + (dominantColor[1] << 8) + dominantColor[2]).toString(16).slice(1)}`;
                            sample1Div.style.color = hexColor;
                            sample2Div.style.color = hexColor;
                        }
                        img.src = gifImage.url;
                    }
                    const largestImage = layer.ty.images.reduce((max, img) => img.size > max.size ? img : max, layer.ty.images[0]);
                    sample1Div.style.backgroundImage = `url('${largestImage.url.replace('/1x.', '/3x.')}')`;
                    sample2Div.style.backgroundImage = `url('${largestImage.url.replace('/1x.', '/3x.')}')`;

                    // Hier fügen wir die paint-text-spezifische Logik hinzu
                    if (paintData.id === "01JFQV4W300XYMWDJW7E1TVY34") {
                        const paintElements = document.querySelectorAll('.paint-text');
                        paintElements.forEach((element) => {
                            element.style.color = 'transparent';
                            element.style.backgroundClip = 'text';
                            element.style.webkitBackgroundClip = 'text';
                            element.style.backgroundImage = `url('${largestImage.url.replace('/1x.', '/3x.')}')`;
                            element.style.backgroundSize = '100% auto';
                            element.style.filter = 'drop-shadow(#39d21eff 0px 0px 0.1px) drop-shadow(#005557ff 1px 1px 0.1px)';
                        });
                    }

                } else if (layer.ty.stops && layer.ty.stops.length > 0) {
                    if (layer.ty.angle !== undefined) {
                        const gradientStops = createGradientStops(layer.ty.stops);
                        const gradientDirection = `${layer.ty.angle}deg`;
                        sample1Div.style.backgroundImage = applyGradient('linear-gradient', gradientDirection, gradientStops, layer.ty.repeating);
                        sample2Div.style.backgroundImage = applyGradient('linear-gradient', gradientDirection, gradientStops, layer.ty.repeating);
                    } else {
                        const gradientStops = createGradientStops(layer.ty.stops);
                        sample1Div.style.backgroundImage = applyGradient('radial-gradient', '', gradientStops, layer.ty.repeating);
                        sample2Div.style.backgroundImage = applyGradient('radial-gradient', '', gradientStops, layer.ty.repeating);
                    }
                    sample1Div.style.color = convertToHex(layer.ty.stops[0].color);
                    sample2Div.style.color = convertToHex(layer.ty.stops[layer.ty.stops.length - 1].color);
                } else if (layer.ty.color) {
                    sample1Div.style.color = convertToHex(layer.ty.color);
                    sample2Div.style.color = convertToHex(layer.ty.color);
                }
            }
        });
        if (paintData.layers && paintData.layers.length > 0 && paintData.layers[0].ty && paintData.layers[0].ty.images && paintData.layers[0].ty.images.length > 0){
            sample1Div.style.filter = '';
            sample2Div.style.filter = '';
        } else if (paintData.shadows && paintData.shadows.length > 0) {
            sample1Div.style.filter = applyShadows(paintData.shadows);
            sample2Div.style.filter = applyShadows(paintData.shadows);
        } else {
            sample1Div.style.filter = '';
            sample2Div.style.filter = '';
        }
    }
}

getPaint(); // lol10
