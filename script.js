const button = document.getElementById('id_button');
const readerDiv = document.getElementById('reader');
const spotifyContainer = document.getElementById('spotify_container');
const spotifyPlayer = document.getElementById('spotify_player');

let html5QrCode = null;

button.addEventListener('click', async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission !== 'granted') {
                alert('Musisz zezwolić na czujniki ruchu, inaczej gra nie zadziała!');
                return;
            }
        } catch (error) {
            console.error("Błąd uprawnień iOS:", error);
        }
    }

    readerDiv.style.display = "block";
    spotifyContainer.style.display = "none";
    button.innerText = "Szukam kodu...";
    button.style.background = "linear-gradient(135deg, #ff4b2b, #ff416c)";

    html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        (errorMessage) => {}
    ).catch(err => {
        alert("Błąd kamery. Upewnij się, że dałeś przeglądarce uprawnienia do aparatu!");
        button.innerText = "Skanuj QR";
    });
});

function onScanSuccess(decodedText) {
    html5QrCode.stop().then(() => {
        readerDiv.style.display = "none";
        let embedUrl = decodedText;
        if (embedUrl.includes("/track/")) {
            embedUrl = embedUrl.replace("/track/", "/embed/track/");
        }
        spotifyPlayer.src = embedUrl;
        button.innerText = "Zeskanowano! Odłóż telefon ekranem w dół";
        button.style.background = "linear-gradient(135deg, #11998e, #38ef7d)"; 
        window.addEventListener('deviceorientation', handleOrientation);
    });
}

function handleOrientation(event) {
    let beta = event.beta;
    if (beta === null) return; 
    if (Math.abs(beta) > 150) {
        spotifyContainer.style.display = "block";
        button.innerText = "Graj dalej!";
        window.removeEventListener('deviceorientation', handleOrientation);
    }
}