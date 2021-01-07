/**@type {Voice} */
let voice = null
function loadVoices() {
    voice = new Voice()
    document.body.appendChild(voice.configGUI);
}
async function saydata() {
    let response = await fetch("/data")
    let data = await response.json()
    console.log(data)


    const text1 = "Temperature " + data.temperature + " degrees celsius";
    const header1 = document.getElementById("temperature-text");
    header1.innerHTML = text1
    voice.speak(text1);
    let alt = 44330 * (1.0 - pow(data.pressure / 1013.25, 0.1903));
    const text2 = "Altitude " + alt + " meters";
    const header2 = document.getElementById("altitude-text");
    header2.innerHTML = text2
    voice.speak(text2);

}