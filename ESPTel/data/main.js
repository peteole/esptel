const slider = document.querySelector(".slider");
const output = document.querySelector(".sliderVal");
var interval;
var response;
var data;
var alt;
var altBias = 0;
output.innerHTML = slider.value;

slider.oninput = function () {
    output.innerHTML = this.value;
    interval = parseInt(output.innerText);
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
    const text2 = "Höhe: " + height + " m";
    document.getElementById("altitude-text").innerHTML = text2;
    window.speechSynthesis.speak(text + "  " + text2);

}
function altreset() {
    getData();
    altBias = alt;
}


async function start() {
    saydata();
    setTimeout(start, interval * 1000)

}




