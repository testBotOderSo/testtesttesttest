function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const badgeID = urlParams.get('badgeID');
    const badgeName = urlParams.get('badgeName');
    return { name, badgeID, badgeName };
}

function loadBadge() {
    const { name, badgeID, badgeName } = getUrlParams();
    
    if (badgeID) {
        const badgeUrl = `https://cdn.7tv.app/badge/${badgeID}/4x.avif`;
        
        const sample1 = document.getElementById('sample1');
        if (sample1) {
            sample1.style.color = 'transparent';
            sample1.style.backgroundClip = 'text';
            sample1.style.webkitBackgroundClip = 'text';
            sample1.style.backgroundImage = `url('${badgeUrl}')`;
            sample1.style.backgroundSize = '100% auto';
            sample1.style.filter = 'drop-shadow(#ffd700 0px 0px 1px) drop-shadow(#ff8800 1px 1px 1px)';
            if (name) {
                sample1.textContent = name;
            }
        }

        const sample3 = document.getElementById('sample3');
        if (sample3) {
            sample3.style.width = '100px';
            sample3.style.height = '100px';
            sample3.style.backgroundImage = `url('${badgeUrl}')`;
            sample3.style.backgroundSize = 'contain';
            sample3.style.backgroundRepeat = 'no-repeat';
            sample3.style.display = 'inline-block';
        }
    }

    if (badgeName) {
        const badgeNameElement = document.getElementById('badge-name');
        if (badgeNameElement) {
            badgeNameElement.textContent = badgeName;
            badgeNameElement.style.fontWeight = 'bold';
            document.title = `NotedBot │ 7TV ${badgeName} Badge`;
        }
    }
}

window.onload = loadBadge;
