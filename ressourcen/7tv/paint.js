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
                
                [sample1Div, sample2Div, paintDiv, document.getElementById('paint-name')].forEach(div => {
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
            
            [sample1Div, sample2Div, paintDiv, document.getElementById('paint-name')].forEach(div => {
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
            
            [sample1Div, sample2Div, paintDiv, document.getElementById('paint-name')].forEach(div => {
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
        [sample1Div, sample2Div, paintDiv, document.getElementById('paint-name')].forEach(div => {
            div.style.filter = shadowStyle;
        });
    }
};
