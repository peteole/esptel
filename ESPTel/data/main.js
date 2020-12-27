/**@type {Voice} */
let voice=null
function loadVoices(){
    voice=new Voice()
    document.body.appendChild(voice.configGUI);
}
async function saydata() {
    let response = await fetch("/data")
    let data = await response.json()
    console.log(data)

    
    const text = "Temperature " + data.temperature + " degrees celsius";
    const header = document.getElementById("temperature-text");
    header.innerHTML = text
    voice.speak(text);
}