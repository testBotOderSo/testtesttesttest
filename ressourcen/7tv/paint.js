function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const elementID = urlParams.get('paint');
    const paintID = urlParams.get('PaintID');
    const paintName = urlParams.get('paintName');
    return { name, elementID, paintID, paintName };
};

function loadPaint() {
    const { name, elementID, paintID, paintName } = getUrlParams();
    
    if (elementID && paintID) {
        const paintUrl = `https://cdn.7tv.app/paint/${elementID}/layer/${paintID}/1x.webp`;
        
        const paintElements = document.querySelectorAll('.paint-text');
        paintElements.forEach((element) => {
            element.style.color = 'transparent'; 
            element.style.backgroundClip = 'text'; 
            element.style.webkitBackgroundClip = 'text';
            element.style.backgroundImage = `url('${paintUrl}')`; 
            element.style.backgroundSize = '100% auto'; 
            element.style.filter = 'drop-shadow(#39d21eff 0px 0px 0.1px) drop-shadow(#005557ff 1px 1px 0.1px)'; 
        });
    }

    if (name) {
        const nameElement = document.getElementById('sample1');
        nameElement.textContent = name;
        
        const spanElement = document.createElement('span');
        spanElement.textContent = name;
        nameElement.appendChild(spanElement); 
        
        nameElement.style.fontSize = '5em'; 
        nameElement.style.fontWeight = 'bold'; 
    }

    if (paintName) {
        const paintNameElement = document.getElementById('paint-name');
        paintNameElement.textContent = paintName;
        paintNameElement.style.fontWeight = 'bold'; 
        paintNameElement.style.color = 'transparent';
        paintNameElement.style.backgroundClip = 'text';
        paintNameElement.style.webkitBackgroundClip = 'text';

        const paintUrl = `https://cdn.7tv.app/paint/${elementID}/layer/${paintID}/1x.webp`;
        paintNameElement.style.backgroundImage = `url('${paintUrl}')`;
        paintNameElement.style.backgroundSize = '100% auto';
        paintNameElement.style.filter = 'drop-shadow(#39d21eff 0px 0px 0.1px) drop-shadow(#005557ff 1px 1px 0.1px)';
        
        document.title = `NotedBot │ 7TV ${paintName} Paint`;
    }

    function downloadPaintImage() {
        const { elementID, paintID } = getUrlParams();

        if (elementID && paintID) {
            const paintUrl = `https://cdn.7tv.app/paint/${elementID}/layer/${paintID}/1x.webp`;
            const link = document.createElement('a');
            link.href = paintUrl;
            link.download = `Paint-${paintID}.webp`;
            link.click();
        }
    }

    function downloadPaintName() {
        const { name, elementID, paintID } = getUrlParams();

        if (name && elementID && paintID) {
            const paintUrl = `https://cdn.7tv.app/paint/${elementID}/layer/${paintID}/1x.webp`;

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const img = new Image();
            img.src = paintUrl;

            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);

                ctx.font = 'bold 60px Arial';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(name, canvas.width / 2, canvas.height / 2);

                const dataUrl = canvas.toDataURL('image/png');

                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `PaintWithName-${name}.png`;
                link.click();
            };
        }
    }

    const downloadBtn = document.createElement('button');
    downloadBtn.id = 'download-btn';
    downloadBtn.textContent = 'Download Paint';
    downloadBtn.style.color = 'transparent';
    downloadBtn.style.backgroundClip = 'text';
    downloadBtn.style.webkitBackgroundClip = 'text';
    downloadBtn.style.backgroundImage = `url('${paintUrl}')`;
    downloadBtn.style.backgroundSize = '100% auto';
    downloadBtn.style.filter = 'drop-shadow(#39d21eff 0px 0px 0.1px) drop-shadow(#005557ff 1px 1px 0.1px)';
    downloadBtn.addEventListener('click', downloadPaintImage);
    document.body.appendChild(downloadBtn);

    const downloadNameBtn = document.createElement('button');
    downloadNameBtn.id = 'download-name-btn';
    downloadNameBtn.textContent = 'Download Name + Paint';
    downloadNameBtn.style.color = 'transparent';
    downloadNameBtn.style.backgroundClip = 'text';
    downloadNameBtn.style.webkitBackgroundClip = 'text';
    downloadNameBtn.style.backgroundImage = `url('${paintUrl}')`;
    downloadNameBtn.style.backgroundSize = '100% auto';
    downloadNameBtn.style.filter = 'drop-shadow(#39d21eff 0px 0px 0.1px) drop-shadow(#005557ff 1px 1px 0.1px)';
    downloadNameBtn.addEventListener('click', downloadPaintName);
    document.body.appendChild(downloadNameBtn);
};

window.onload = loadPaint;
