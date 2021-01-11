var interval;
var response;
var data;
var alt;
var altBias = 0;

const slider = document.querySelector(".slider");
const output = document.getElementById("sliderVal");
output.innerHTML = slider.value;

slider.oninput = function () {
    output.innerHTML = this.value;
    interval = parseInt(output.innerText);
}
class Voice {
    constructor() {
        this.configGUI = document.createElement("div")
        const voices = window.speechSynthesis.getVoices();
        const selector = document.createElement("select")
        this.configGUI.appendChild(selector)
        const uriToVoice = new Map();
        for (let voice of voices) {
            const newOption = document.createElement("option");
            newOption.innerText = voice.lang + " (Name: " + voice.name + "," + voice.localService + ")";
            newOption.value = voice.voiceURI;
            uriToVoice.set(voice.voiceURI, voice)
            selector.appendChild(newOption);
        }
        selector.onchange = (event) => {
            this.voice = uriToVoice.get(selector.value);
        }
        selector.onchange();
    }
    /**
     * @param {string} text text to speak
     */
    speak(text) {
        var msg = new SpeechSynthesisUtterance();
        msg.text = text
        msg.voice = this.voice
        window.speechSynthesis.speak(msg);
    }
}

/**@type {Voice} */
let voice = null
function loadVoices() {
    voice = new Voice()
    document.body.appendChild(voice.configGUI);
}

async function getData() {
    response = await fetch("/data")
    data = await response.json()
}

function saydata() {
    getData();
    const text = "Temperatur: " + data.temperature + " °C";
    document.getElementById("temperature-text").innerHTML = text;

    alt = parseInt(44330 * (1.0 - Math.pow(data.pressure / 1013.25, 0.1903)));
    const height = alt - altBias;
    const text2 = "height: " + height + " m";
    document.getElementById("height-text").innerHTML = text2;
    const text3 = "altitude: " + alt + " m";
    document.getElementById("altitude-text").innerHTML = text3;


    if (voice != null) {
        voice.speak(text + "  " + text2);
    }
}
async function altreset() {
    getData();
    altBias = alt;
}


function start() {
    saydata();
    setTimeout(start, interval * 1000)

}




