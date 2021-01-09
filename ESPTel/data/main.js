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
        voice.speak(text + "   " + text2);
    }
}
const interval = 10;
var slider = document.getElementById("updtime");
var output = document.getElementById("sec");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
    output.innerHTML = this.value;
    interval = parseInt(this.value);
}

function start() {
    setInterval(saydata, 10000);
}


