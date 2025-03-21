const paint = {"id":"01GZBZ2T0R0005K1FJYZ11J7EZ","name":"Tropical","function":"LINEAR_GRADIENT","angle":90,"image_url":"","repeat":false,"stops":[{"at":0,"color":-145138177},{"at":0.5,"color":-20489985},{"at":1,"color":-1124794113}],"shadows":[{"x_offset":0, "y_offset": 0, "radius": 4, "color":-145138177}]}; // Sehr feiner Schatten

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

const sample1Div = document.getElementById('sample1');
const sample2Div = document.getElementById('sample2');

if (paint) {
    if (paint.function === 'LINEAR_GRADIENT' && paint.stops?.length) {
        const gradientStops = createGradientStops(paint.stops);
        const gradientDirection = `${paint.angle}deg`;
        sample1Div.style.backgroundImage = applyGradient('linear-gradient', gradientDirection, gradientStops, paint.repeat);
        sample2Div.style.backgroundImage = applyGradient('linear-gradient', gradientDirection, gradientStops, paint.repeat);
        sample1Div.style.backgroundColor = convertToHex(paint.stops[0].color);
        sample2Div.style.backgroundColor = convertToHex(paint.stops[2].color);
    } else if (paint.function === 'RADIAL_GRADIENT' && paint.stops?.length) {
        const gradientStops = createGradientStops(paint.stops);
        sample1Div.style.backgroundImage = applyGradient('radial-gradient', '', gradientStops, paint.repeat);
        sample2Div.style.backgroundImage = applyGradient('radial-gradient', '', gradientStops, paint.repeat);
        sample1Div.style.backgroundColor = convertToHex(paint.stops[0].color);
        sample2Div.style.backgroundColor = convertToHex(paint.stops[2].color);
    } else if (paint.function === 'URL' && paint.image_url) {
        const imageUrl = paint.image_url.replace('/1x.', '/3x.');
        sample1Div.style.backgroundImage = `url('${imageUrl}')`;
        sample2Div.style.backgroundImage = `url('${imageUrl}')`;
    }

    if (paint.shadows?.length) {
        sample1Div.style.filter = applyShadows(paint.shadows);
        sample2Div.style.filter = applyShadows(paint.shadows);
    } else {
        sample1Div.style.filter = '';
        sample2Div.style.filter = '';
    }
}
