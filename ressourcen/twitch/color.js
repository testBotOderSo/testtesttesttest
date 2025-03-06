export async function fetchTwitchColor(username) {
    try {
        const response = await fetch(`https://api.ivr.fi/v2/twitch/user?login=${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            console.error(`Fehler beim Fetchen von Twitch Farbe: ${response.status}`);
            return null;
        }
        const data = await response.json();
        return data[0]?.chatColor || '#FFFFFF';
    } catch (error) {
        console.error(`Fehler: ${error}`);
        return '#FFFFFF';
    }
}
