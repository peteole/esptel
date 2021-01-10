/**@type {Voice} */
let voice = null
function loadVoices() {
    voice = new Voice()
    document.body.appendChild(voice.configGUI);
}

async function saydata() {

    let response = await fetch("/data")
    let data = await response.json()

    const text = "Temperatur: " + data.temperature + " °C";
    document.getElementById("temperature-text").innerHTML = text;

    const alt = parseInt(44330 * (1.0 - Math.pow(data.pressure / 1013.25, 0.1903)));
    const text2 = "Höhe: " + alt + " m";
    document.getElementById("altitude-text").innerHTML = text2;

    if (voice != null) {
        voice.speak(text2);
    }
}

function start() {
    setInterval(saydata, interval * 1000);
}





