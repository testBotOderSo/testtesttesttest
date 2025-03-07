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
        const { elementID, paintID, name } = getUrlParams();
    
        if (elementID && paintID) {
            const paintUrl = `https://cdn.7tv.app/paint/${elementID}/layer/${paintID}/1x.webp`;
    
            const img = new Image();
            img.crossOrigin = 'anonymous'; // Stellt sicher, dass das Bild ohne CORS-Fehler geladen wird
            img.src = paintUrl;
    
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
    
                ctx.drawImage(img, 0, 0);
                ctx.font = 'bold 60px Arial';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText(name, canvas.width / 2, canvas.height / 2);
    
                const imageURL = canvas.toDataURL('image/png'); // Hier wird das Bild als PNG exportiert
    
                const link = document.createElement('a');
                link.href = imageURL;
                link.download = `PaintWithName-${name}.png`; // Der Downloadname des Bildes
                link.click();
            };
    
            img.onerror = function () {
                alert('Fehler beim Laden des Bildes. Überprüfe die URL und den CORS-Header.');
            };
        }
    }

    // Event Listener für die Buttons, die den Download auslösen
    const downloadBtn = document.getElementById('download-btn');
    downloadBtn.addEventListener('click', downloadPaintImage);

    const downloadNameBtn = document.getElementById('download-name-btn');
    downloadNameBtn.addEventListener('click', downloadPaintImage);
};

window.onload = loadPaint;
