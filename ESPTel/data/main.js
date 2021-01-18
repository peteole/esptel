var myVar;
var interval = 10;
var response;
var data;
var alt;
var altBias = 0;


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

function displayData() {
    getData();
    const text = "Temperatur: " + data.temperature + " °C";
    document.getElementById("temperature-text").innerHTML = text;

    alt = parseInt(44330 * (1.0 - Math.pow(data.pressure / 1013.25, 0.1903)));
    const height = alt - altBias;
    const text2 = "height: " + height + " m";
    document.getElementById("height-text").innerHTML = text2;
    const text3 = "altitude: " + alt + " m";
    document.getElementById("altitude-text").innerHTML = text3;
    const text4 = "acX: " + data.ax + " acY:" + data.ay + " acZ:" + data.az + " acc:" + data.acc;
    document.getElementById("acc-text").innerHTML = text4;
    const text5 = "gyrX: " + data.gx + " gyrY:" + data.gy + " gyrZ:" + data.gz;
    document.getElementById("gyr-text").innerHTML = text5;
    const text6 = "magX: " + data.mx + " magY:" + data.my + " magZ:" + data.mz;
    document.getElementById("mag-text").innerHTML = text6;
    const text7 = "angX: " + data.angx;
    document.getElementById("angx-text").innerHTML = text7;
    const text8 = "dt: " + data.dt;
    document.getElementById("dt-text").innerHTML = text8;

}

function altreset() {

    altBias = alt;
}
function sayData() {
    //let text = document.getElementById("temperature-text").innerText;
    let read = document.getElementById("height-text").innerText;


    if (voice != null) {
        voice.speak(read);
    }
}
function displayLoop() {
    setInterval(displayData, 100)
}

function speechLoop() {
    myVar = setInterval(sayData, interval * 1000)
}

function stopSpeechLoop() {
    clearInterval(myVar);
}






