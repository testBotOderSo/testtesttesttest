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
        const img = new Image();
        img.src = paintUrl;
        img.onload = () => {
            const color = getDominantColorFromImage(img);
            changeDinoColor(color); 
        };
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
        
        document.title = `NotedBot │ 7TV "${paintName}" Paint`;
    }
};

function changeDinoColor(color) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    canvas.style.position = "fixed";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.zIndex = -1;
    canvas.style.pointerEvents = "none";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let dx = 1.2;
    let dy = 1.2;
    let score = 0;

    let particles = [];

    function createExplosion(px, py) {
        for (let i = 0; i < 20; i++) {
            let angle = Math.random() * Math.PI * 2;
            let speed = Math.random() * 3 + 1;
            particles.push({
                x: px,
                y: py,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                radius: Math.random() * 5 + 2
            });
        }
    }

    function updateParticles() {
        particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.03; 

            if (p.alpha <= 0) {
                particles.splice(index, 1);
            }
        });
    }

    function drawParticles() {
        particles.forEach(p => {
            ctx.fillStyle = `rgba(255, 200, 0, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function drawDino(x, y) {
        ctx.fillStyle = color;
        
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x + 20, y - 20, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(x + 25, y - 25, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = color;
        ctx.fillRect(x - 10, y + 20, 8, 15);
        ctx.fillRect(x + 5, y + 20, 8, 15);

        ctx.beginPath();
        ctx.moveTo(x - 25, y + 5);
        ctx.lineTo(x - 45, y);
        ctx.lineTo(x - 25, y - 5);
        ctx.fill();
    }

    function drawScore() {
        ctx.fillStyle = "blue";
        ctx.font = "20px Arial";
        ctx.fillText(`Score: ${score}`, 20, 30);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let hitLeft = x - 25 <= 0;
        let hitRight = x + 25 >= canvas.width;
        let hitTop = y - 25 <= 0;
        let hitBottom = y + 25 >= canvas.height;

        if ((hitLeft && hitTop) || (hitLeft && hitBottom) || 
            (hitRight && hitTop) || (hitRight && hitBottom)) {
            score++;
            createExplosion(x, y);
        }

        if (hitLeft || hitRight) dx *= -1;
        if (hitTop || hitBottom) dy *= -1;

        x += dx;
        y += dy;

        updateParticles();

        drawParticles();
        drawDino(x, y);
        drawScore();

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
};

window.onload = loadPaint;
