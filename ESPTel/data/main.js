var myVar;
var interval = 10;
var response;
var data;
var alt = 0; //alt as int
var altfloat = 0; //altitude as float
var altfloat0 = 0; //last value
var altBias = 0;
var mhdg;
var pitch = 0;
var bank = 0;
var gload;
var vs = 0.0; //vertical speed
var ctx;
var factor = 5; //display factor
var c;
var width = 600; //pixel size of horizon canvas
var height = 400;
var fwidth = 2.5 * width;
var fheight = factor * height;


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

    altfloat = parseFloat(44330 * (1.0 - Math.pow(data.pressure / 1013.25, 0.1903)));
    vs = (vs * 4 + (altfloat - altfloat0) * 6) / 10; //Glättung der vertical speed
    if (vs > 0.3 || vs < -0.3) {
        sound();
    }
    altfloat0 = altfloat;
    alt = parseInt(altfloat);

    const height = alt - altBias;
    const text2 = "height: " + height + " m";
    document.getElementById("height-text").innerHTML = text2;
    const text3 = "altitude: " + alt + " m    v/s:" + vs.toFixed(2); + "m/s";
    document.getElementById("altitude-text").innerHTML = text3;
    const text4 = "accX: " + data.ax.toFixed(2) + " accY:" + data.ay.toFixed(2) + " accZ:" + data.az.toFixed(2);
    document.getElementById("acc-text").innerHTML = text4;
    const text5 = "gyrX: " + data.gx + " gyrY:" + data.gy + " gyrZ:" + data.gz;
    document.getElementById("gyr-text").innerHTML = text5;
    const text6 = "magX: " + data.mx + " magY:" + data.my + " magZ:" + data.mz;
    document.getElementById("mag-text").innerHTML = text6;

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
/* Vario audio
*/
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
var frequency = 440.0
o.frequency.value = frequency
o.connect(g)
g.connect(context.destination)
o.start(0)
function sound() {
    g.gain.exponentialRampToValueAtTime(1, context.currentTime + 0.1)
    frequency = 440.0 + vs * 100
    o.frequency.value = frequency
    context.resume()
    g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 5)
}






