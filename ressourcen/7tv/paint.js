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

function applyShadows(shadows) {
    return shadows.map(shadow => {
        const colorString = convertToHex(shadow.color);
        return `drop-shadow(${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${colorString})`;
    }).join(' ');
};

function applyPaint(paintData, paintDiv, sample1Div, sample2Div) {
    if (!paintData || !paintData.layers) return;
    
    const applyStyles = (div, styles) => {
        Object.assign(div.style, styles);
    };
    
    let imageSet = false;

    paintData.layers.forEach(layer => {
        if (!layer.ty) return;
        
        if (layer.ty.images && layer.ty.images.length > 0 && !imageSet) {
            const largestImage = layer.ty.images.reduce((max, img) => img.size > max.size ? img : max, layer.ty.images[0]);
            if (largestImage.url) {
                const imgUrl = largestImage.url.replace('/1x.', '/3x.');
                
                [sample1Div, sample2Div, paintDiv].forEach(div => {
                    applyStyles(div, {
                        backgroundImage: `url('${imgUrl}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center'
                    });
                });
                imageSet = true;
            }
        } else if (layer.ty.stops && !imageSet) {
            const gradientStops = createGradientStops(layer.ty.stops);
            const gradientType = layer.ty.angle !== undefined ? 'linear-gradient' : 'radial-gradient';
            const gradientDirection = layer.ty.angle !== undefined ? `${layer.ty.angle}deg` : 'circle';
            const gradientString = Gradient(gradientType, gradientDirection, gradientStops, layer.ty.repeating);
            
            [sample1Div, sample2Div, paintDiv].forEach(div => {
                applyStyles(div, {
                    backgroundImage: gradientString,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                });
            });
        } else if (layer.ty.color && !imageSet) {
            const hexColor = convertToHex(layer.ty.color);
            
            [sample1Div, sample2Div, paintDiv].forEach(div => {
                applyStyles(div, {
                    backgroundColor: hexColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                });
            });
        }
    });
    
    if (paintData.shadows?.length) {
        const shadowStyle = applyShadows(paintData.shadows);
        [sample1Div, sample2Div, paintDiv].forEach(div => {
            div.style.filter = shadowStyle;
        });
    }
};

getPaint();
